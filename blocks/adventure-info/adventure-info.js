export default function decorate(block) {
  const rows = [...block.children];

  /* create tab container */

  const tabsContainer = document.createElement('div');
  tabsContainer.className = 'adventure-tabs';

  const contents = [];

  rows.forEach((row, index) => {
    const title = row.children[0].textContent.trim();
    const content = row.children[1];

    contents.push(content);

    const button = document.createElement('button');
    button.textContent = title;

    tabsContainer.append(button);

    button.addEventListener('click', () => {
      tabsContainer.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      contents.forEach((c) => c.classList.add('tab-hidden'));

      button.classList.add('active');
      content.classList.remove('tab-hidden');
    });

    /* hide non-first */

    if (index !== 0) {
      content.classList.add('tab-hidden');
    }

    /* remove title column */

    row.remove();
  });

  /* insert tabs + content */

  block.prepend(tabsContainer);

  contents.forEach((c) => block.appendChild(c));

  tabsContainer.querySelector('button').classList.add('active');
}
