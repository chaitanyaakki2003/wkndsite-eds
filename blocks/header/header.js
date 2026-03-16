import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function createLangSelector() {
  const langWrap = document.createElement('div');
  langWrap.className = 'header-lang';

  const btn = document.createElement('button');
  btn.className = 'header-lang-btn';
  btn.type = 'button';
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = `
  <span class="header-lang-flag">
    <img src="/icons/us-flag.svg" alt="US">
  </span>
  <span>EN-US</span>
  <span class="header-lang-chevron"></span>
`;

  const menu = document.createElement('div');
  menu.className = 'header-lang-menu';

  const options = [
    { label: 'EN-US', flag: '/icons/us-flag.svg' },
  ];

  options.forEach((item) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.innerHTML = `
  <img src="${item.flag}" class="header-lang-flag-img">
  ${item.label}
`;
    option.addEventListener('click', () => {
      btn.innerHTML = `
        <span class="header-lang-flag">${item.flag}</span>
        <span>${item.label}</span>
        <span class="header-lang-chevron"></span>
      `;
      langWrap.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    });
    menu.appendChild(option);
  });

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langWrap.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  langWrap.append(btn, menu);
  return langWrap;
}

function createSearch(searchLink) {
  const wrap = document.createElement('div');
  wrap.className = 'header-search';

  const link = document.createElement('a');
  link.href = searchLink ? searchLink.href : '#';

  const icon = document.createElement('span');
  icon.className = 'header-search-icon';

  const text = document.createElement('span');
  text.textContent = 'Search';

  link.append(icon, text);
  wrap.append(link);

  return wrap;
}

function markActiveLink(nav) {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  [...nav.querySelectorAll('a')].forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '') || '/';
    link.classList.toggle('is-active', currentPath === linkPath);
  });
}

function closeLangOnOutsideClick(block, e) {
  const lang = block.querySelector('.header-lang');
  if (lang && !lang.contains(e.target)) {
    lang.classList.remove('is-open');
    const btn = lang.querySelector('.header-lang-btn');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }
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

  const brandSection = nav.querySelector('.nav-brand');
  const sectionsSection = nav.querySelector('.nav-sections');
  const toolsSection = nav.querySelector('.nav-tools');

  const originalLogoImg = brandSection?.querySelector('img');
  let logoImg = null;

  if (originalLogoImg) {
    logoImg = originalLogoImg.cloneNode(true);
  }

  const brandLink = document.createElement('a');
  brandLink.href = '/';
  brandLink.setAttribute('aria-label', 'Home');

  if (logoImg) {
    brandLink.appendChild(logoImg);
  } else {
    brandLink.textContent = 'WKND';
  }

  const topbar = document.createElement('div');
  topbar.className = 'header-topbar';

  const topbarInner = document.createElement('div');
  topbarInner.className = 'header-topbar-inner';

  const signIn = document.createElement('a');
  signIn.className = 'header-signin';
  signIn.href = '#';
  signIn.textContent = 'Sign In';

  /* ADD THIS BELOW */
  const signInModal = document.createElement('div');
  signInModal.className = 'signin-modal';
  signInModal.innerHTML = `
  <div class="signin-modal-overlay"></div>
  <div class="signin-modal-dialog">
    <button class="signin-modal-close" type="button">&times;</button>
 
    <h2>Sign In</h2>
    <div class="signin-modal-line"></div>
    <h3>Welcome Back</h3>
 
    <form class="signin-form">
      <input type="text" placeholder="USERNAME">
      <input type="password" placeholder="PASSWORD">
      <a href="#" class="signin-forgot">FORGOT YOUR PASSWORD?</a>
      <button type="submit" class="signin-submit">SIGN IN</button>
    </form>
  </div>
`;

  document.body.appendChild(signInModal);

  signIn.addEventListener('click', (e) => {
    e.preventDefault();
    signInModal.classList.add('is-open');
  });

  signInModal.querySelector('.signin-modal-close')
    .addEventListener('click', () => {
      signInModal.classList.remove('is-open');
    });

  signInModal.querySelector('.signin-modal-overlay')
    .addEventListener('click', () => {
      signInModal.classList.remove('is-open');
    });

  const langSelector = createLangSelector();

  topbarInner.append(signIn, langSelector);
  topbar.append(topbarInner);

  const main = document.createElement('div');
  main.className = 'header-main';

  const brand = document.createElement('div');
  brand.className = 'header-brand';
  brand.append(brandLink);

  const toggle = document.createElement('button');
  toggle.className = 'header-toggle';
  toggle.type = 'button';
  toggle.setAttribute('aria-label', 'Toggle navigation');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.innerHTML = '<span></span>';

  const right = document.createElement('div');
  right.className = 'header-right';

  const navLinks = document.createElement('nav');
  navLinks.className = 'header-nav';

  if (sectionsSection) {
    const links = [...sectionsSection.querySelectorAll(':scope a')];
    links.forEach((link) => {
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent.trim();
      navLinks.append(a);
    });
  }

  markActiveLink(navLinks);

  let searchLink = null;
  if (toolsSection) {
    searchLink = [...toolsSection.querySelectorAll('a')].find((link) => link.textContent.trim().toLowerCase().includes('search'));
  }

  const search = createSearch(searchLink);

  right.append(navLinks, search);
  main.append(brand, toggle, right);

  block.append(topbar, main);

  const placeholder = document.createElement('div');
  placeholder.className = 'header-placeholder';
  block.insertAdjacentElement('afterend', placeholder);

  let fixedHeaderHeight = 0;

  function syncHeaderHeight(forceFull = false) {
    const wasCompact = block.classList.contains('is-compact');

    if (forceFull && wasCompact) {
      block.classList.remove('is-compact');
    }

    fixedHeaderHeight = block.offsetHeight;
    placeholder.style.height = `${fixedHeaderHeight}px`;

    if (forceFull && wasCompact) {
      block.classList.add('is-compact');
    }
  }

  toggle.addEventListener('click', () => {
    const isOpen = block.classList.toggle('is-menu-open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  document.addEventListener('click', (e) => closeLangOnOutsideClick(block, e));

  function onScroll() {
    const currentY = window.scrollY;

    if (currentY > 10) {
      block.classList.add('is-scrolled');
    } else {
      block.classList.remove('is-scrolled');
    }

    if (currentY > 20) {
      block.classList.add('is-compact');
    } else {
      block.classList.remove('is-compact');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => syncHeaderHeight(true));

  onScroll();
  syncHeaderHeight(true);

  isDesktop.addEventListener('change', () => {
    if (isDesktop.matches) {
      block.classList.remove('is-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      syncHeaderHeight(true);
    }
  });
}
