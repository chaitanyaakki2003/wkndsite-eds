export default function decorate(block) {
  const rows = [...block.children];

  rows.forEach((row) => {
    const textContent = row.textContent.toLowerCase();

    if (textContent.includes('wanderlust')) {
      row.classList.add('definition-section');

      const contentHolder = row.querySelector(':scope > div');

      const rawText = row.textContent.trim();
      const lines = rawText.split('\n').filter((line) => line.trim() !== '');

      if (lines.length >= 3) {
        contentHolder.innerHTML = `
          <p class="def-title">${lines[0]}</p>
          <p class="def-desc">${lines[1]}</p>
          <p class="pos-italic">${lines[2]}</p>
        `;
      }
    }
  });
}