/*hero slideshow: cycles through .hero-slide elements every 3 seconds */
const slides = document.querySelectorAll('.hero-slide');
let current = 0;
 
if (slides.length > 0) {
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 3000);
}

/*hides ticker and header when scrolling down using translateY, shows tem again when scrollin up*/
let lastScroll = 0;
const ticker = document.querySelector('.ticker');
const header = document.querySelector('header');
 
if (ticker && header) {
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
}

/*cart page - render cart items
Reads localStorage cart, builds HTML for each item including the image, name, price (sale or normal), qty controls and remove button*/  
document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const cartSubtotal = document.getElementById("cart-subtotal");

  if (!cartContainer) return;

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartContainer.innerHTML = "";

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    if (cartSubtotal) cartSubtotal.textContent = "AU$0.00";
    return;
  }

  cart.forEach((item, index) => {
    const p = products[item.id];
    const isOnSale = p && p.sale;

    const div = document.createElement('div');
    div.className = 'cart-item cart-page-item';
    div.innerHTML = `
      <div class="cart-item-img-wrap" style="margin-left:15px">
        <img src="${item.image}" alt="${item.name}" style="width:150px; height:200px; object-fit:cover; display:block; border-radius:0">
      </div>
      <div class="cart-item-info" style="margin-left:15px;">
        <h2 style="font-size:20px">${item.name}</h2>
        <div style="margin-top: 6px;">
          ${isOnSale
            ? `<span class="sale-price">${p.salePrice}</span> <span class="original-price">${p.price}</span>`
            : `<p>${item.price}</p>`}
        </div>
        <div class="qty-controls">
          <button onclick="updateCartQty(${index}, -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateCartQty(${index}, 1)">+</button>
        </div>
        <button class="remove-btn" onclick="removeFromCartPage(${index})">REMOVE</button>
      </div>      
    `;
    cartContainer.appendChild(div);
  });

  updateCartTotal();
});

/*update quantity: adds or remove quantity, remove items if qty = 0
saves to localStorage and reloads page*/ 
function updateCartQty(index, change) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart[index].qty += change;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  location.reload();
}


/*remove item: remove item at given index from cart array, saves and reloads*/
function removeFromCartPage(index) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  location.reload();
}

/*total updates:
calculates subtotal, applies discount, and 10%GST. will update all summary elements on screen including discount*/
function updateCartTotal() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');

  const subtotal = cart.reduce((sum, item) => {
    const price = parseInt((item.price || '0').replace(/[^0-9]/g, ''));
    return sum + price * item.qty;
  }, 0);

  const discount = Math.round(subtotal * (appliedDiscount || 0));
  const total = subtotal - discount;
  const gst = Math.round(total * 0.1);

  const subtotalEl = document.getElementById('cart-subtotal');
  const itemsEl = document.getElementById('summary-items');
  const gstEl = document.getElementById('summary-gst');
  const totalEl = document.getElementById('summary-total');
  const discountEl = document.getElementById('summary-discount');

  if (subtotalEl) subtotalEl.textContent = `AU$${subtotal.toLocaleString()}`;
  if (itemsEl) itemsEl.textContent = `AU$${subtotal.toLocaleString()}`;
  if (gstEl) gstEl.textContent = `AU$${gst.toLocaleString()}`;
  if (totalEl) totalEl.textContent = `AU$${total.toLocaleString()}`;
  if (discountEl) {
    discountEl.textContent = discount > 0 ? `-AU$${discount.toLocaleString()}` : 'AU$0';
  }
}


/*product page: add to cart button
listens for click on the main add to cart button on product.html, then reads product id from URL,
adds to localStorage cart, opens drawer*/
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".add-to-cart");
 
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      const id = new URLSearchParams(window.location.search).get("id");
      const product = products[id];
 
      if (!product) return;
 
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
 
      const existing = cart.find(item => item.id === id);
      if (existing) {
        existing.qty += 1;
      } else {
        cart.push({
          id: id,
          name: product.name,
          price: product.salePrice || product.price,
          image: product.image,
          qty: 1
        });
      }
 
      localStorage.setItem("cart", JSON.stringify(cart));
      openCartDrawer();
    });
  }
});

/*quick add to cart feature: called from add to cart buttons on product grid pages, 
then reads product from products object, adds to localStorage, opens drawer. */
function addToCart(id) {
  const p = products[id];
  if (!p) return;
 
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
 
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({
      id: id,
      name: p.name,
      price: p.salePrice || p.price,
      image: p.image,
      qty: 1
    });
  }
 
  localStorage.setItem('cart', JSON.stringify(cart));
  openCartDrawer();
}

/*cart drawer open: renders cart items in the slide in drawer along with
sale tags, qty controls and remove button, calulates and shows price total*/
function openCartDrawer() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const drawer = document.getElementById('cart-drawer');
  const itemsDiv = document.getElementById('cart-drawer-items');
  const subtotalDiv = document.getElementById('cart-drawer-subtotal');

  if (!drawer || !itemsDiv || !subtotalDiv) return;

  itemsDiv.innerHTML = '';

  cart.forEach((item, index) => {
    const p = products[item.id];
    const isOnSale = p && p.sale;

    itemsDiv.innerHTML += `
      <div class="cart-drawer-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-drawer-item-info">
          ${isOnSale ? '<span class="product-tag" style="position:static; display:inline-block; margin-bottom:4px;">SALE</span>' : ''}
          <h2>${item.name}</h2>
          <div>
            ${isOnSale ? `<span class="sale-price">${p.salePrice}</span> <span class="original-price">${p.price}</span>` : `<p>${item.price}</p>`}
          </div>
          <div class="qty-controls">
            <button onclick="updateQty(${index}, -1)">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${index}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeFromDrawer(${index})">REMOVE</button>
        </div>
      </div>
    `;
  });

  const total = cart.reduce((sum, item) => {
    const price = parseInt((item.price || '0').replace(/[^0-9]/g, ''));
    return sum + price * item.qty;
  }, 0);

  subtotalDiv.innerHTML = `
    <span>SUBTOTAL</span>
    <span>AU$${total.toLocaleString()}</span>
  `;

  drawer.style.display = 'block';
}

/*cart drawer quantity update: updates qty in localStorage and renders the drawer*/
function updateQty(index, change) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart[index].qty += change;
  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  openCartDrawer();
}

/*cart drawer: remove item, removes item from both cart and drawer*/
function removeFromDrawer(index) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  openCartDrawer();
}

/*close cart drawer: hides the cart overlay*/
function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) drawer.style.display = 'none';
}

/*adds .visible class to .category elements when they enter the viewport o trigger the CSS slide-in animation*/
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


/*filter :listens for filter button clicks, then reads data-metal, data-price, data-sale
from each .category div and shows or hides accordingly.*/
const filterBtns = document.querySelectorAll('.filter-btn');
 
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    const categories = document.querySelectorAll('.product-list .category');

    categories.forEach(cat => {
      const a = cat.querySelector('a');
      if (!a) return;
      const metal = cat.dataset.metal || a.dataset.metal;
      const price = parseInt(cat.dataset.price || a.dataset.price);
      const sale = cat.dataset.sale || a.dataset.sale;
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

/*search overlay: listens for input in the search box, filters product by its name, and 
renders up to 4 matching results with image, name, and price*/
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
            ${p.sale
              ? `<span class="sale-price">${p.salePrice}</span> <span class="original-price">${p.price}</span>`
              : `<p style="margin-top:8px; font-size:13px;">${p.price}</p>`}
          </div>
        </div>
      `;
    });

  });
 
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const query = searchInput.value;
      if (query.trim() !== '') {
        window.location.href = 'search.html?q=' + encodeURIComponent(query);
      }
    }
  });
}

/*open and close searcg overlay*/
function openSearch() {
  document.getElementById('search-overlay').style.display = 'flex';
  document.getElementById('search-backdrop').style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeSearch() {
  document.getElementById('search-overlay').style.display = 'none';
  document.getElementById('search-backdrop').style.display = 'none';
  document.body.style.overflow = '';
}

/*search result grid: reads query from URL, filters products by name, 
then renders full product cards with filter data attributes*/
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
        const numericPrice = parseInt((p.salePrice || p.price).replace(/[^0-9]/g, ''));
        searchResultsGrid.innerHTML += `
          <div class="category" data-metal="${p.metal || ''}" data-price="${numericPrice}" data-sale="${p.sale}">
            <a href="products.html?id=${key}">
              <div class="category-img-wrap">
                <img src="${p.image}" alt="${p.name}">
                <p class="explore">QUICK VIEW</p>
                <button class="heart-btn" onclick="event.preventDefault(); toggleFav(this, '${key}')">
                  <i class="fa-regular fa-heart"></i>
                </button>
                ${p.sale ? '<span class="product-tag">SALE</span>' : ''}
              </div>
              <div style="margin-top: 5px;">
                ${p.sale
                  ? `<span class="sale-price">${p.salePrice}</span><span class="original-price">${p.price}</span>`
                  : `<p>${p.price}</p>`}
              </div>
              <h2>${p.name}</h2>
            </a>
            <button class="add-to-cart-quick" onclick="addToCart('${key}')">
              <i class="fa-solid fa-bag-shopping"></i> ADD TO CART
            </button>
          </div>
        `;
      });
    }
  }
}
 
/*favorite toggle:  adds or removes product id from localStorage favourites array, 
updates heart icon to solid red when active, outline when inactive.*/
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

/*favorite page :on  page load reads localStorage and fills in saved heart icons
so favourited items show as active across all pages.*/
document.querySelectorAll('.heart-btn').forEach(btn => {
  const match = btn.getAttribute('onclick').match(/'([^']+)'\)/);
  if (!match) return;
  const id = match[1];
  const favs = JSON.parse(localStorage.getItem('favourites') || '[]');
  if (favs.includes(id)) {
    btn.classList.add('active');
    btn.innerHTML = '<i class="fa-solid fa-heart" style="color:#c0392b"></i>';
  }
});

/*favorit page: reads favourites from localStorage and renders full product cards
with heart button, sale tags and add to cart*/
const favouritesGrid = document.getElementById('favourites-grid');

if (favouritesGrid) {
  const favs = JSON.parse(localStorage.getItem('favourites') || '[]');

  if (favs.length === 0) {
    favouritesGrid.innerHTML = '<p style="padding: 2rem;">You have no favourites yet.</p>';
  } else {
    favs.forEach(key => {
      const p = products[key];
      if (!p) return;
      favouritesGrid.innerHTML += `
        <div class="category">
          <a href="products.html?id=${key}">
            <div class="category-img-wrap">
              <img src="${p.image}" alt="${p.name}">
              <p class="explore">QUICK VIEW</p>
              <button class="heart-btn active" onclick="event.preventDefault(); toggleFav(this, '${key}')">
                <i class="fa-solid fa-heart" style="color:#c0392b"></i>
              </button>
            </div>
            <div style="margin-top: 5px;">
              ${p.sale ? `<span class="sale-price">${p.salePrice}</span><span class="original-price">${p.price}</span>` : `<p>${p.price}</p>`}
            </div>
            <h2>${p.name}</h2>
          </a>
          <button class="add-to-cart-quick" onclick="addToCart('${key}')">
            <i class="fa-solid fa-bag-shopping"></i> ADD TO CART
          </button>
        </div>
      `;
    });
  }
}
 
/*sort toggle drop down*/
function toggleSort() {
  const dropdown = document.getElementById('sort-dropdown');
  if (dropdown) dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}

/*sort producst: sorts .category divs by data-price low to high or high to low,
then reappends them to the grid in the new order.*/
function sortProducts(type, e) {
  const grid = document.querySelector('.product-list');
  if (!grid) return;
 
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
 
  const sortLabel = document.getElementById('sort-label');
  if (sortLabel) sortLabel.textContent = labels[type];
 
  const sortDropdown = document.getElementById('sort-dropdown');
  if (sortDropdown) sortDropdown.style.display = 'none';
}
 
/*close sort droppwd down when clicking anywehere outisde*/
document.addEventListener('click', (e) => {
  if (!e.target.closest('.sort-bar')) {
    const dropdown = document.getElementById('sort-dropdown');
    if (dropdown) dropdown.style.display = 'none';
  }
});
 
/*sale page: filters products where sale == true, renders shuffled product cards
with sale tags and add to cart button */
const clearanceGrid = document.getElementById('clearance-grid');
 
if (clearanceGrid) {
  const saleProducts = Object.entries(products).filter(([key, p]) => p.sale === true);
 
  saleProducts.forEach(([key, p]) => {
    const numericPrice = parseInt(p.salePrice.replace(/[^0-9]/g, ''));
    clearanceGrid.innerHTML += `
      <div class="category" data-metal="${p.metal || ''}" data-price="${numericPrice}" data-sale="true">
        <a href="products.html?id=${key}">
          <div class="category-img-wrap">
            <img src="${p.image}" alt="${p.name}">
            <p class="explore">QUICK VIEW</p>
            <button class="heart-btn" onclick="event.preventDefault(); toggleFav(this, '${key}')">
              <i class="fa-regular fa-heart"></i>
            </button>
            <span class="product-tag">SALE</span>
          </div>
          <div style="margin-top:5px;">
            <span class="sale-price">${p.salePrice}</span>
            <span class="original-price">${p.price}</span>
          </div>
          <h2>${p.name}</h2>
        </a>
        <button class="add-to-cart-quick" onclick="addToCart('${key}')">
          <i class="fa-solid fa-bag-shopping"></i> ADD TO CART
        </button>
      </div>
    `;
  });
 
  const clearanceItems = Array.from(clearanceGrid.querySelectorAll('.category'));
  clearanceItems.sort(() => Math.random() - 0.5);
  clearanceItems.forEach(item => clearanceGrid.appendChild(item));
}

/*renders all products shuffled randomly with sale tags and add to cart.*/
const allGrid = document.getElementById('all-grid');
 
if (allGrid) {
  Object.entries(products).forEach(([key, p]) => {
    const numericPrice = parseInt((p.salePrice || p.price).replace(/[^0-9]/g, ''));
    allGrid.innerHTML += `
      <div class="category">
        <a href="products.html?id=${key}" data-metal="${p.metal || ''}" data-price="${numericPrice}" data-sale="${p.sale}">
          <div class="category-img-wrap">
            <img src="${p.image}" alt="${p.name}">
            <p class="explore">QUICK VIEW</p>
            <button class="heart-btn" onclick="event.preventDefault(); toggleFav(this, '${key}')">
              <i class="fa-regular fa-heart"></i>
            </button>
            ${p.sale ? '<span class="product-tag">SALE</span>' : ''}
          </div>
          <div style="margin-top: 5px;">
            ${p.sale ? `<span class="sale-price">${p.salePrice}</span><span class="original-price">${p.price}</span>` : `<p>${p.price}</p>`}
          </div>
          <h2>${p.name}</h2>
        </a>
        <button class="add-to-cart-quick" onclick="addToCart('${key}')">
          <i class="fa-solid fa-bag-shopping"></i> ADD TO CART
        </button>
      </div>
    `;
  });
 
  const allItems = Array.from(allGrid.querySelectorAll('.category'));
  allItems.sort(() => Math.random() - 0.5);
  allItems.forEach(item => allGrid.appendChild(item));
}
 
const searchBtn = document.querySelector('.icon[onclick*="search-overlay"]');
if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    const allProducts = Object.values(products);
    const shuffled = allProducts.sort(() => Math.random() - 0.5);
    const popular = shuffled.slice(0, 5);
 
    const popularCol = document.querySelector('.search-col');
    if (popularCol) {
      popularCol.innerHTML = '<p class="search-col-title">POPULAR SEARCHES</p>';
      popular.forEach(p => {
        popularCol.innerHTML += `
          <a href="search.html?q=${encodeURIComponent(p.name)}">${p.name}</a>
        `;
      });
    }
  });
}

const imgs = ['product-img-1', 'product-img-2', 'product-img-3', 'product-img-4'];
imgs.forEach((imgId, i) => {
  const el = document.getElementById(imgId);
  if (el && product.images && product.images[i]) {
    el.src = product.images[i];
  } else if (el) {
    el.style.display = 'none';
  }
});

/*promoCodes object stores valid codes with discount rates and labels.
applyPromo() validates input, applies discount and updates totals.
Saves applied discount to localStorage for use on checkout page.*/ 
const promoCodes = {
  'NEWMEMBER': { discount: 0.10, label: '10% off for new members!' },
  'MAJULIX15': { discount: 0.15, label: '15% off!' },
  'INFO20005ISFUN': { discount: 1, label: 'INFO20005 IS FUN!! YOUR CART IS FREE!' },
};

let appliedDiscount = 0;

function applyPromo() {
  const input = document.getElementById('promo-input');
  const message = document.getElementById('promo-message');
  const code = input.value.trim().toUpperCase();

  if (promoCodes[code]) {
    appliedDiscount = promoCodes[code].discount;
    message.style.color = 'green';
    message.textContent = `✓ ${promoCodes[code].label}`;
    updateCartTotal();
  } else {
    appliedDiscount = 0;
    message.style.color = '#A64B4B';
    message.textContent = 'Invalid promo code.';
    updateCartTotal();
  }
}

/*checkout items order sumarry: reads cart and saved discount from localStorage.
renders product items and calculates totals for checkout and payment pages.*/
const checkoutItems = document.getElementById('checkout-items');

if (checkoutItems) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const savedDiscount = parseFloat(localStorage.getItem('appliedDiscount') || '0');

  let subtotal = 0;

  cart.forEach(item => {
    const p = products[item.id];
    const isOnSale = p && p.sale;
    const price = parseInt((item.price || '0').replace(/[^0-9]/g, ''));
    subtotal += price * item.qty;

    checkoutItems.innerHTML += `
      <div class="checkout-item">
        <div style="position:relative; width:60px; flex-shrink:0;">
          <img src="${item.image}" alt="${item.name}" style="width:100px; height:120px; object-fit:cover;">
        </div>
        <div style="flex:1; margin-left:45px;">
          <h2 style="font-size:15px; margin-bottom:10px">${item.name}</h2>
          <p style="font-size:12px; margin-top:4px;">
            ${isOnSale
              ? `<span class="sale-price">${p.salePrice}</span> <span class="original-price">${p.price}</span>`
              : item.price}
          </p>
          <p style="font-size:12px; color:var(--text-brown);">Qty: ${item.qty}</p>
        </div>
      </div>
    `;
  });

  const discount = Math.round(subtotal * savedDiscount);
  const total = subtotal - discount;
  const gst = Math.round(total * 0.1);

  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('checkout-total', `AU$${total.toLocaleString()}`);
  setEl('checkout-subtotal', `AU$${subtotal.toLocaleString()}`);
  setEl('checkout-gst', `AU$${gst.toLocaleString()}`);
  setEl('checkout-discount', discount > 0 ? `-AU$${discount.toLocaleString()}` : 'AU$0');
  setEl('checkout-total-2', `AU$${total.toLocaleString()}`);
}

function applyPromo() {
  const input = document.getElementById('promo-input');
  const message = document.getElementById('promo-message');
  const code = input.value.trim().toUpperCase();

  if (promoCodes[code]) {
    appliedDiscount = promoCodes[code].discount;
    localStorage.setItem('appliedDiscount', appliedDiscount);
    message.style.color = 'green';
    message.textContent = `✓ ${promoCodes[code].label}`;
    updateCartTotal();
  } else {
    appliedDiscount = 0;
    localStorage.setItem('appliedDiscount', 0);
    message.style.color = '#A64B4B';
    message.textContent = 'Invalid promo code.';
    updateCartTotal();
  }
}

/*checkout form validation: validates email format, prvenet proceeding to payment is any field is invalid*/
function submitCheckout() {
  const email = document.getElementById('email');
  const emailError = document.getElementById('email-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.value)) {
    emailError.style.display = 'block';
    email.style.border = '1px solid #A64B4B';
    return;
  } else {
    emailError.style.display = 'none';
    email.style.border = '1px solid var(--support)';
  }

  const firstName = document.getElementById('first-name').value;
  const lastName = document.getElementById('last-name').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('address').value;
  const city = document.getElementById('city').value;
  const postcode = document.getElementById('postcode').value;
  const state = document.getElementById('state').value;

  if (!firstName || !lastName || !phone || !address || !city || !postcode || !state) {
    alert('Please fill in all fields.');
    return;
  }

  window.location.href = 'payment.html';
}

function selectPayment(el, type) {
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.classList.remove('active');
    const fields = opt.querySelector('.payment-fields');
    if (fields) fields.style.display = 'none';
  });

  el.classList.add('active');
  el.querySelector('input[type="radio"]').checked = true;

  if (type === 'card') {
    document.getElementById('card-fields').style.display = 'block';
  }
}

function formatCard(input) {
  let val = input.value.replace(/\D/g, '').substring(0, 16);
  input.value = val.replace(/(.{4})/g, '$1 ').trim();
}

function submitPayment() {
  const selected = document.querySelector('input[name="payment"]:checked');
  if (!selected) {
    alert('Please select a payment method.');
    return;
  }
  localStorage.removeItem('cart');
  localStorage.removeItem('appliedDiscount');
  window.location.href = 'confirmation.html';
}

/*payment : validates card number (16 digits), expiry (MM/YY), CVV (3 digits) and name, highlights invalid fields in red. 
Clears cart and redirects to confirmation.*/
function submitPayment() {
  const selected = document.querySelector('input[name="payment"]:checked');
  if (!selected) {
    alert('Please select a payment method.');
    return;
  }

  if (selected.value === 'card') {
    const cardNumber = document.querySelector('#card-fields input[placeholder="1234 5678 9012 3456"]');
    const expiry = document.querySelector('#card-fields input[placeholder="MM/YY"]');
    const cvv = document.querySelector('#card-fields input[placeholder="123"]');
    const name = document.querySelector('#card-fields input[placeholder="Full name"]');

    const cardClean = cardNumber.value.replace(/\s/g, '');
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;

    let valid = true;

    if (cardClean.length !== 16) {
      cardNumber.style.border = '1px solid #A64B4B';
      valid = false;
    } else {
      cardNumber.style.border = '1px solid var(--support)';
    }

    if (!expiryRegex.test(expiry.value)) {
      expiry.style.border = '1px solid #A64B4B';
      valid = false;
    } else {
      expiry.style.border = '1px solid var(--support)';
    }

    if (!cvvRegex.test(cvv.value)) {
      cvv.style.border = '1px solid #A64B4B';
      valid = false;
    } else {
      cvv.style.border = '1px solid var(--support)';
    }

    if (name.value.trim() === '') {
      name.style.border = '1px solid #A64B4B';
      valid = false;
    } else {
      name.style.border = '1px solid var(--support)';
    }

    if (!valid) {
      return;
    }
  }

  localStorage.removeItem('cart');
  localStorage.removeItem('appliedDiscount');
  window.location.href = 'confirmation.html';
}

/* shows and hides join for free slide down)
function openJoinDrawer() {
  document.getElementById('join-drawer').style.display = 'block';
}
function closeJoinDrawer() {
  document.getElementById('join-drawer').style.display = 'none';
}

/*join drawer: validates email format and checks out all required  fields are filled*/
function submitJoin() {
  const firstName = document.getElementById('join-first-name').value.trim();
  const lastName = document.getElementById('join-last-name').value.trim();
  const email = document.getElementById('join-email');
  const phone = document.getElementById('join-phone').value.trim();
  const emailError = document.getElementById('join-email-error');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let valid = true;

  if (!emailRegex.test(email.value)) {
    emailError.style.display = 'block';
    email.style.border = '1px solid #A64B4B';
    valid = false;
  } else {
    emailError.style.display = 'none';
    email.style.border = '1px solid var(--support)';
  }

  if (!firstName || !lastName || !phone) {
    alert('Please fill in all fields.');
    valid = false;
  }

  if (!valid) return;

  document.getElementById('join-success').style.display = 'block';
  setTimeout(() => closeJoinDrawer(), 2000);
}

/*mobile menu toggle: shows and hide menu*/
function toggleMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    menu.style.display = menu.style.display === 'none' || menu.style.display === '' ? 'block' : 'none';
  }
}