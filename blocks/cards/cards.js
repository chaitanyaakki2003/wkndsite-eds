/* eslint-disable*/
import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const isMagazine = block.classList.contains('magazine');
  const isAboutUs = block.classList.contains('aboutus');
  const isAdventure = block.classList.contains('adventure');
  const isArticle = block.classList.contains('article');
  const ul = document.createElement('ul');
  const items = [...block.children];

  items.forEach((row, index) => {
    const li = document.createElement('li');

    // REMOVED: The logic that added 'hidden-card' class to items after the 4th index

    while (row.firstElementChild) li.append(row.firstElementChild);

    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'cards-card-image';
      } else {
        div.className = 'cards-card-body';
        const title = div.querySelector('h1, h2, h3, h4, h5, h6, a');
        if (title && title.tagName !== 'H3') {
          const h3 = document.createElement('h3');
          h3.innerHTML = title.innerHTML;
          title.replaceWith(h3);
        }

        if (isAboutUs || isArticle) {
          const socialContainer = document.createElement('div');
          socialContainer.className = isArticle ? 'article-social-bar' : 'aboutus-social-bar';

          const icons = div.querySelectorAll('span.icon');
          if (icons.length > 0) {
            icons.forEach((icon) => {
              const wrapper = icon.closest('a') || icon;
              socialContainer.append(wrapper);
            });
            div.append(socialContainer);
          }

          div.querySelectorAll('p').forEach((p) => {
            if (!p.textContent.trim() && !p.children.length) p.remove();
          });
        }
      }
    });

    const body = li.querySelector('.cards-card-body');
    const image = li.querySelector('.cards-card-image');

    if (isMagazine) {
      if (body) {
        const badge = document.createElement('div');
        badge.className = 'magazine-badge';
        badge.innerHTML = '<span>🔒</span>';
        body.prepend(badge);
        if (image) li.appendChild(image);
      }
    } else if (isAboutUs || isArticle) {
      if (image) li.prepend(image);
    }

    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

  block.replaceChildren(ul);

  // REMOVED: The button creation and event listener logic at the end
}
