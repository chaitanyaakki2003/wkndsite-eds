export default function decorate(block) {
  const rows = [...block.children];

  const tabLabels = rows
    .map((row) => {
      const firstCell = row.children[0];
      return firstCell ? firstCell.textContent.trim() : '';
    })
    .filter(Boolean);

  block.textContent = '';

  const tabList = document.createElement('ul');
  tabList.className = 'tabs-list';

  function getCardCategory(card) {
    const titleEl = card.querySelector('.cards-card-body h3');
    const title = titleEl ? titleEl.textContent.trim().toLowerCase() : '';

    const categoryMap = {
      'bali surf camp': 'surfing',
      'beervana in portland': 'travel',
      'climbing new zealand': 'climbing',
      'colorado rock climbing': 'climbing',
      'cycling southern utah': 'cycling',
      'cycling tuscany': 'cycling',
      'downhill skiing wyoming': 'skiing',
      'gastronomic marais tour': 'travel',
      'napa wine tasting': 'travel',
      'riverside camping': 'travel',
      'ski touring mont blanc': 'skiing',
      'surf camp in costa rica': 'surfing',
      'tahoe skiing': 'skiing',
      'west coast cycling': 'cycling',
      'whistler mountain biking': 'cycling',
      'yosemite backpacking': 'travel',
    };

    return categoryMap[title] || '';
  }

  function filterCards(selectedTab) {
    const cards = document.querySelectorAll('.cards ul li');
    const selected = selectedTab.toLowerCase();

    cards.forEach((card) => {
      const category = getCardCategory(card);

      if (selected === 'all') {
        card.style.display = '';
      } else if (category === selected) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  }

  tabLabels.forEach((label, index) => {
    const li = document.createElement('li');
    li.className = 'tabs-item';

    const button = document.createElement('button');
    button.className = 'tabs-button';
    button.type = 'button';
    button.textContent = label;

    if (index === 0) {
      button.classList.add('active');
    }

    button.addEventListener('click', () => {
      block.querySelectorAll('.tabs-button').forEach((btn) => {
        btn.classList.remove('active');
      });

      button.classList.add('active');
      filterCards(label);
    });

    li.appendChild(button);
    tabList.appendChild(li);
  });

  block.appendChild(tabList);

  filterCards('All');
}
