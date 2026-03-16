export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  const cells = [...row.children];
  if (cells.length < 2) return;

  const imageWrap = document.createElement('div');
  imageWrap.className = 'adventure-teaser-image';
  imageWrap.append(...cells[0].childNodes);

  const contentWrap = document.createElement('div');
  contentWrap.className = 'adventure-teaser-content';
  contentWrap.append(...cells[1].childNodes);

  block.innerHTML = '';
  block.append(imageWrap, contentWrap);
}
