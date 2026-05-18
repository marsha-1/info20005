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


const searchInput = document.getElementById('search-input');

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const resultsDiv = document.getElementById('search-results');
    resultsDiv.innerHTML = '';

    if (query.length < 2) return;

    const matches = Object.entries(products).filter(([key, p]) =>
      p.name.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      resultsDiv.innerHTML = '<p>No results found.</p>';
      return;
    }

      matches.slice(0, 4).forEach(([key, p]) => {        
      resultsDiv.innerHTML += `
        <div class="search-result-item" onclick="window.location.href='products.html?id=${key}'">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <h2>${p.name}</h2>
            <p>${p.price}</p>
          </div>
        </div>
      `;
    });
  });
}

const searchResultsGrid = document.getElementById('search-results-grid');

if (searchResultsGrid) {
  const params = new URLSearchParams(window.location.search);
  const query = params.get('q');

  if (query) {
    document.getElementById('search-title').textContent = `RESULTS FOR "${query}"`;

    const matches = Object.entries(products).filter(([key, p]) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );

    if (matches.length === 0) {
      searchResultsGrid.innerHTML = '<p style="padding: 2rem;">No results found.</p>';
    } else {
      matches.forEach(([key, p]) => {        
        searchResultsGrid.innerHTML += `
          <a href="products.html?id=${key}">
            <div class="category-img-wrap">
              <img src="${p.image}" alt="${p.name}">
              <p class="explore">QUICK VIEW</p>
            </div>
            <h2 style="margin-top: 5px;">${p.name}</h2>
            <p>${p.price}</p>
          </a>
        `;
      });
    }
  }
}

const popup = document.getElementById("popup");
const closeBtn = document.getElementById("close-popup");

setTimeout(() => {
    popup.style.display = "flex";
}, 2000);

closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
});