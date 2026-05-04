const slides = document.querySelectorAll('.hero-slide');
let current = 0;

setInterval(() => {
  slides[current].classList.remove('active');
  current = (current + 1) % slides.length;
  slides[current].classList.add('active');
}, 3000);

let lastScroll = 0;
const ticker = document.querySelector('.ticker');
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;

  if (currentScroll > lastScroll && currentScroll > 50) {
    ticker.style.transform = 'translateY(-100%)';
    ticker.style.transition = 'transform 0.3s ease';
    header.style.transform = 'translateY(-137px)';
    header.style.transition = 'transform 0.3s ease';
  } else {
    ticker.style.transform = 'translateY(0)';
    ticker.style.transition = 'transform 0.3s ease';
    header.style.transform = 'translateY(0)';
    header.style.transition = 'transform 0.3s ease';
  }

  lastScroll = currentScroll;
});