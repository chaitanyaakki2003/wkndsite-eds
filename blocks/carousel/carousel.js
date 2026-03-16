export default function decorate(block) {
  const rows = Array.from(block.children);
  block.textContent = '';
 
  const sliderWrapper = document.createElement('div');
  sliderWrapper.classList.add('slider-wrapper');
 
  const slides = rows.map((row, index) => {
    const slide = document.createElement('div');
    slide.classList.add('slide');
 
    if (index === 0) {
      slide.classList.add('active');
    }
 
    const imgCol = row.children[0];
    const textCol = row.children[1];
 
    if (imgCol) {
      slide.append(imgCol);
    }
 
    if (textCol) {
      slide.append(textCol);
    }
 
    sliderWrapper.append(slide);
    return slide;
  });
 
  block.append(sliderWrapper);
 
  const navContainer = document.createElement('div');
  navContainer.classList.add('carousel-nav');
 
  const dots = document.createElement('div');
  dots.classList.add('dots');
 
  const arrows = document.createElement('div');
  arrows.classList.add('arrows');
 
  const prevBtn = document.createElement('button');
  prevBtn.setAttribute('type', 'button');
  prevBtn.setAttribute('aria-label', 'Previous slide');
  prevBtn.textContent = '←';
 
  const nextBtn = document.createElement('button');
  nextBtn.setAttribute('type', 'button');
  nextBtn.setAttribute('aria-label', 'Next slide');
  nextBtn.textContent = '→';
 
  arrows.append(prevBtn, nextBtn);
 
  let currentIndex = 0;
 
  function goToSlide(index) {
    slides[currentIndex].classList.remove('active');
    dots.children[currentIndex].classList.remove('active');
 
    currentIndex = (index + slides.length) % slides.length;
 
    slides[currentIndex].classList.add('active');
    dots.children[currentIndex].classList.add('active');
  }
 
  slides.forEach((slide, index) => {
    if (!slide) {
      return;
    }
 
    const dot = document.createElement('span');
    dot.classList.add('dot');
 
    if (index === 0) {
      dot.classList.add('active');
    }
 
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
 
    dots.append(dot);
  });
 
  navContainer.append(dots, arrows);
  block.append(navContainer);
 
  prevBtn.addEventListener('click', () => {
    goToSlide(currentIndex - 1);
  });
 
  nextBtn.addEventListener('click', () => {
    goToSlide(currentIndex + 1);
  });
}
 
 