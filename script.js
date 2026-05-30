document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cartCount = document.getElementById("cart-count");
  const cartSubtotal = document.getElementById("cart-subtotal");

  if (!cartContainer) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartCount.textContent = `YOU HAVE ${cart.length} ITEM${cart.length !== 1 ? "S" : ""} IN YOUR CART.`;

  let total = 0;
  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    cartSubtotal.textContent = "AU$0.00";
    return;
  }

  cart.forEach((product, index) => {
    const price = Number(product.price.replace("AU$", "").replace(",", ""));
    total += price;

    cartContainer.innerHTML += `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">

        <div>
          <h2>${product.name}</h2>
          <p>${product.price}</p>
        </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>        
      </div>
    `;
  });

  cartSubtotal.textContent = `AU$${total.toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
});

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  location.reload();
}


document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".add-to-cart");

  if (!addBtn) return;

  addBtn.addEventListener("click", () => {
    const id = new URLSearchParams(window.location.search).get("id");
    const product = products[id];

    if (!product) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart.push({
      id: id,
      name: product.name,
      price: product.price,
      image: product.image
    });

    localStorage.setItem("cart", JSON.stringify(cart));
    const popup = document.getElementById("cart-popup");

    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 4000);

    console.log("Added to cart");
  });
});

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
const productLinks = document.querySelectorAll('.product-list .category a');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const categories = document.querySelectorAll('.product-list .category');

    categories.forEach(cat => {
      const a = cat.querySelector('a');
      const metal = a.dataset.metal;
      const price = parseInt(a.dataset.price);
      const sale = a.dataset.sale;

      if (filter === 'all') {
        cat.style.display = 'block';
      } else if (filter === 'gold' && metal === 'gold') {
        cat.style.display = 'block';
      } else if (filter === 'silver' && metal === 'silver') {
        cat.style.display = 'block';
      } else if (filter === 'under500' && price < 500) {
        cat.style.display = 'block';
      } else if (filter === 'under1000' && price < 1000) {
        cat.style.display = 'block';
      } else if (filter === 'sale' && sale === 'true') {
        cat.style.display = 'block';
      } else {
        cat.style.display = 'none';
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


function toggleFav(btn, id) {
  let favs = JSON.parse(localStorage.getItem('favourites') || '[]');
  
  if (favs.includes(id)) {
    favs = favs.filter(f => f !== id);
    btn.classList.remove('active');
    btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
  } else {
    favs.push(id);
    btn.classList.add('active');
    btn.innerHTML = '<i class="fa-solid fa-heart" style="color:#c0392b"></i>';
  }
  
  localStorage.setItem('favourites', JSON.stringify(favs));
}

// load saved favourites on page load
document.querySelectorAll('.heart-btn').forEach(btn => {
  const id = btn.getAttribute('onclick').match(/'([^']+)'\)/)[1];
  const favs = JSON.parse(localStorage.getItem('favourites') || '[]');
  if (favs.includes(id)) {
    btn.classList.add('active');
    btn.innerHTML = '<i class="fa-solid fa-heart" style="color:#c0392b"></i>';
  }
});


function toggleSort() {
  const dropdown = document.getElementById('sort-dropdown');
  dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

function sortProducts(type, e) {
  const grid = document.querySelector('.product-list');
  const items = Array.from(grid.querySelectorAll('.category'));

  items.sort((a, b) => {
    const priceA = parseInt(a.querySelector('a').dataset.price);
    const priceB = parseInt(b.querySelector('a').dataset.price);
    if (type === 'low') return priceA - priceB;
    if (type === 'high') return priceB - priceA;
    return 0;
  });

  items.forEach(p => grid.appendChild(p));

  const labels = {
    low: 'PRICE: LOW TO HIGH',
    high: 'PRICE: HIGH TO LOW',
  };

  document.getElementById('sort-label').textContent = labels[type];
  document.getElementById('sort-dropdown').style.display = 'none';
}
// close dropdown when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.sort-bar')) {
    const dropdown = document.getElementById('sort-dropdown');
    if (dropdown) dropdown.style.display = 'none';
  }
});