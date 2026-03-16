export default function decorate(block) {
  const slides = [...block.children];

  if (slides.length === 0) return;

  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((slide) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'carousel-slide';
    wrapper.append(slide.firstElementChild);
    track.append(wrapper);
  });

  block.textContent = '';
  block.append(track);

  let index = 0;

  /* arrows */

  const nav = document.createElement('div');
  nav.className = 'carousel-nav';

  const prev = document.createElement('button');
  prev.className = 'carousel-btn';
  prev.innerHTML = '←';

  const next = document.createElement('button');
  next.className = 'carousel-btn';
  next.innerHTML = '→';

  nav.append(prev, next);
  block.append(nav);

  /* dots */

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'carousel-dots';

  const dots = [];

  function update() {
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
  }

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'carousel-dot';
    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
      index = i;
      update();
    });

    dots.push(dot);
    dotsWrap.append(dot);
  });

  block.append(dotsWrap);

  next.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    update();
  });

  prev.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    update();
  });

  /* hide controls if only one slide */

  if (slides.length <= 1) {
    nav.style.display = 'none';
    dotsWrap.style.display = 'none';
  }
}
