export default function decorate(block) {
  const rows = [...block.children];

  if (rows.length < 3) return;

  const titleRow = rows[0];
  const imageRow = rows[1];
  const textRow = rows[2];

  const wrapper = document.createElement('div');

  if (titleRow) {
    const titleText = titleRow.textContent.trim();
    const heading = document.createElement('h2');
    heading.textContent = titleText;
    wrapper.appendChild(heading);
  }

  if (imageRow) {
    while (imageRow.firstChild) {
      wrapper.appendChild(imageRow.firstChild);
    }
  }

  if (textRow) {
    const paragraph = document.createElement('p');
    paragraph.textContent = textRow.textContent.trim();
    wrapper.appendChild(paragraph);
  }

  block.textContent = '';
  block.appendChild(wrapper);
}
