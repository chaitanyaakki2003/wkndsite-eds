/* button.js */

export default function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const container = document.createElement('div');
  container.className = 'button-container';

  link.parentNode.insertBefore(container, link);
  container.appendChild(link);

  block.style.textAlign = 'left';
}