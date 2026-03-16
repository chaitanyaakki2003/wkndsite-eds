export default function decorate(block) {
  // This is the key to reducing the overall size!
  block.classList.add('accordion-wrapper');

  [...block.children].forEach((row) => {
    const titlePart = row.children[0];
    const contentPart = row.children[1];

    if (titlePart && contentPart) {
      const button = document.createElement('button');
      button.className = 'accordion-title';
      button.innerHTML = `<span>${titlePart.textContent}</span>`;

      const content = document.createElement('div');
      content.className = 'accordion-content';
      content.innerHTML = contentPart.innerHTML;

      button.addEventListener('click', () => {
        const isActive = button.classList.contains('active');
        button.classList.toggle('active');
        content.style.display = isActive ? 'none' : 'block';
      });

      row.innerHTML = '';
      row.append(button, content);
    }
  });
}
