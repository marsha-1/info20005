const products = {
  'blue-natural-boulder-opal-ring': {
    name: 'BLUE NATURAL OPAL BOULDER RING',
    price: 'AU$2,509.15',
    image: 'rings/Blue Natural Boulder Opal Ring.jpg',
    category: 'rings',
    categoryName: 'RINGS',
    description: 'x',
    details: {
      Metal: '10K Yellow Gold',
      Stone: 'Opal (Solid - 100% Natural Australian Opal)',
      Weight: '14.60ct',
      Shapes: 'Free Form',
      Tone: 'Black',
      OverallDimensions: 'Stone Size 9mm x 8mm', 
      Listedon: '2026-03-22',
      RingSize: '6.75',
      ItemNumber: '#29658',
    }
  },
  'earthen-blaze-queensland-boulder-opal-ring': {
    name: 'Earthen Blaze Queensland Boulder Opal Ring',
    price: 'AU$2,006.65',
    image: 'rings/Earthen Blaze Queensland Boulder Opal Ring.jpg',
    category: 'rings',
    categoryName: 'RINGS',
    description: 'x',
    details: {
      Metal: 'Sterling Silver',
      Stone: 'Opal (Solid - 100% natural Australian opal)',
    }
  },
};

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const product = products[id];

if (product) {
  document.getElementById('product-img').src = product.image;
  document.getElementById('product-name').textContent = product.name;
  document.getElementById('product-price').textContent = product.price;
  document.getElementById('product-description').textContent = product.description;
  document.getElementById('breadcrumb-name').textContent = product.name.toUpperCase();
  document.getElementById('breadcrumb-category').href = product.category + '.html';
  document.getElementById('breadcrumb-category').textContent = product.categoryName;
  document.title = product.name + ' — Majulix';

  const detailsDiv = document.getElementById('product-details');
  let detailsHTML = '<h3>PRODUCT DETAILS</h3>';
  for (const [key, value] of Object.entries(product.details)) {
    detailsHTML += `<p><strong>${key}:</strong> ${value}</p>`;
  }
  detailsDiv.innerHTML = detailsHTML;
}