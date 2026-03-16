import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  const modal = document.querySelector('.wknd-signin-modal');
  if (e.code === 'Escape') {
    if (modal && modal.classList.contains('is-open')) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      const trigger = document.querySelector('.wknd-topbar-signin-btn');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
      return;
    }

    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    if (!navSections) return;
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

function toggleAllNavSections(sections, expanded = false) {
  if (!sections) return;
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');

  if (navSections) {
    const navDrops = navSections.querySelectorAll('.nav-drop');
    if (isDesktop.matches) {
      navDrops.forEach((drop) => {
        if (!drop.hasAttribute('tabindex')) {
          drop.setAttribute('tabindex', 0);
          drop.addEventListener('focus', focusNavSection);
        }
      });
    } else {
      navDrops.forEach((drop) => {
        drop.removeAttribute('tabindex');
        drop.removeEventListener('focus', focusNavSection);
      });
    }
  }

  if (!expanded || isDesktop.matches) {
    window.addEventListener('keydown', closeOnEscape);
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

function createSignInModal() {
  const modal = document.createElement('div');
  modal.className = 'wknd-signin-modal';
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
    <div class="wknd-signin-overlay"></div>
    <div class="wknd-signin-dialog">
      <h2 class="wknd-signin-title">Sign In</h2>
      <div class="wknd-signin-title-line"></div>
      <p class="wknd-signin-subtitle">Welcome Back</p>

      <form class="wknd-signin-form">
        <input class="wknd-signin-field" type="text" placeholder="USERNAME">
        <input class="wknd-signin-field" type="password" placeholder="PASSWORD">
        <a class="wknd-signin-forgot" href="#">FORGOT YOUR PASSWORD?</a>
        <br>
        <button class="wknd-signin-submit">SIGN IN</button>
      </form>

      <div class="wknd-signin-bottom-line"></div>
    </div>
  `;

  document.body.append(modal);
  return modal;
}

export default async function decorate(block) {

  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';

  const nav = document.createElement('nav');
  nav.id = 'nav';

  while (fragment.firstElementChild) {
    nav.append(fragment.firstElementChild);
  }

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  /* -------------------------------------
     ADD SEARCH TEXT WITHOUT REMOVING ICON
  ------------------------------------- */

  const navTools = nav.querySelector('.nav-tools');

  if (navTools) {

    const searchLink = navTools.querySelector('a');

    if (searchLink && !searchLink.querySelector('.wknd-search-text')) {

      const text = document.createElement('span');
      text.className = 'wknd-search-text';
      text.textContent = 'SEARCH';

      searchLink.append(text);

    }
  }

  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');

  hamburger.innerHTML = `
    <button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>
  `;

  const navSections = nav.querySelector('.nav-sections');

  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));

  nav.prepend(hamburger);

  nav.setAttribute('aria-expanded', 'false');

  toggleMenu(nav, navSections, isDesktop.matches);

  isDesktop.addEventListener('change', () =>
    toggleMenu(nav, navSections, isDesktop.matches)
  );

  const topbarSignin = document.createElement('div');

  topbarSignin.className = 'wknd-topbar-signin';

  topbarSignin.innerHTML = `
    <button type="button" class="wknd-topbar-signin-btn">
      SIGN IN
    </button>
  `;

  nav.append(topbarSignin);

  const modal = createSignInModal();

  const signInBtn = topbarSignin.querySelector('.wknd-topbar-signin-btn');

  signInBtn.addEventListener('click', () => {

    const isOpen = modal.classList.contains('is-open');

    modal.classList.toggle('is-open', !isOpen);

    document.body.style.overflow = isOpen ? '' : 'hidden';

  });

  const navWrapper = document.createElement('div');

  navWrapper.className = 'nav-wrapper';

  navWrapper.append(nav);

  block.append(navWrapper);

}