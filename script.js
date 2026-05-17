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
}
);

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.category').forEach(cat => {
  observer.observe(cat);
});

const filterBtns = document.querySelectorAll('.filter-btn');
const productLinks = document.querySelectorAll('.product-grid a');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    productLinks.forEach(product => {
      const metal = product.dataset.metal;
      const price = parseInt(product.dataset.price);

      if (filter === 'all') {
        product.style.display = 'block';
      } else if (filter === 'gold' && metal === 'gold') {
        product.style.display = 'block';
      } else if (filter === 'silver' && metal === 'silver') {
        product.style.display = 'block';
      } else if (filter === 'under500' && price < 500) {
        product.style.display = 'block';
      } else if (filter === 'under1000' && price < 1000) {
        product.style.display = 'block';
      } else {
        product.style.display = 'none';
      }
    });
  });
});