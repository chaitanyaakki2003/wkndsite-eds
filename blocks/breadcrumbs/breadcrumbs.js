export default function decorate(block) {
  // 1. Get segments and remove empty ones
  const allSegments = window.location.pathname.split('/').filter(Boolean);

  // 2. Extract only the last two segments (magazine and the article slug)
  // This ignores /us/en/ or any other regional prefix
  const breadcrumbSegments = allSegments.slice(-2);

  const nav = document.createElement('nav');
  nav.className = 'breadcrumbs-nav';
  const ul = document.createElement('ul');

  // We'll track the full path to ensure links still point to the correct URL
  // We use the full original path for the base link
  const basePath = `/${allSegments.slice(0, allSegments.length - 2).join('/')}`;

  breadcrumbSegments.forEach((segment, index) => {
    const li = document.createElement('li');
    const link = document.createElement('a');

    // Set the href: magazine is basePath/magazine, slug is basePath/magazine/slug
    const currentPathSegments = breadcrumbSegments.slice(0, index + 1);
    link.href = `${basePath}/${currentPathSegments.join('/')}`;

    // Formatting Logic
    let displayText = segment.replace(/-/g, ' ');

    // Force uppercase for 'magazine' if it's the first breadcrumb item
    if (index === 0 && segment.toLowerCase() === 'magazine') {
      displayText = 'MAGAZINE';
    }

    link.textContent = displayText;

    // Mark the last item as active
    if (index === breadcrumbSegments.length - 1) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }

    li.appendChild(link);
    ul.appendChild(li);
  });

  nav.appendChild(ul);
  block.appendChild(nav);
}
