const COOKIE_DAYS = 7;
const PRODUCTS = {
  headphones: {
    title: 'Wireless Headphones',
    description: 'Comfortable noise-reducing headphones with 20 hours battery life.',
    price: 59.99,
  },
  speaker: {
    title: 'Smart Speaker',
    description: 'Voice-enabled speaker with crisp audio and smart home support.',
    price: 79.99,
  },
  tracker: {
    title: 'Fitness Tracker',
    description: 'Lightweight tracker with sleep monitoring and step goals.',
    price: 39.99,
  },
};

function setCookie(name, value, days = COOKIE_DAYS) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
  return document.cookie.split('; ').reduce((value, cookiePair) => {
    const [cookieName, cookieValue] = cookiePair.split('=');
    return cookieName === name ? decodeURIComponent(cookieValue) : value;
  }, '');
}

function saveSessionCart(cart) {
  sessionStorage.setItem('cartItems', JSON.stringify(cart));
}

function loadSessionCart() {
  const raw = sessionStorage.getItem('cartItems');
  return raw ? JSON.parse(raw) : [];
}

function updateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (!cartCountEl) return;
  const cart = loadSessionCart();
  const totalUnits = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountEl.textContent = totalUnits;
}

function setActiveSection(sectionId) {
  ['home', 'product', 'cart'].forEach(id => {
    const section = document.getElementById(`${id}-section`);
    if (section) {
      section.classList.toggle('hidden', id !== sectionId);
    }
  });
  setCookie('lastSection', sectionId, COOKIE_DAYS);
  if (sectionId === 'cart') {
    renderCartItems();
  }
}

function saveUserName() {
  const input = document.getElementById('user-name');
  if (!input) return;
  const name = input.value.trim();
  if (!name) return;
  setCookie('userName', name, COOKIE_DAYS);
  renderGreeting();
}

function renderGreeting() {
  const greetingEl = document.getElementById('greeting');
  if (!greetingEl) return;
  const name = getCookie('userName');
  const lastSection = getCookie('lastSection');
  if (name) {
    greetingEl.innerHTML = `Welcome back, <strong>${name}</strong>!` +
      (lastSection ? `<br/><small>Last section: ${lastSection}</small>` : '');
  } else {
    greetingEl.textContent = 'Hello! Enter your name to personalize this store.';
  }
}

function addToCart(title, price) {
  const cart = loadSessionCart();
  const existing = cart.find(item => item.title === title);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ title, price, quantity: 1 });
  }
  saveSessionCart(cart);
  updateCartCount();
  alert(`Added ${title} to cart.`);
}

function removeFromCart(title) {
  const cart = loadSessionCart().filter(item => item.title !== title);
  saveSessionCart(cart);
  renderCartItems();
  updateCartCount();
}

function clearCart() {
  sessionStorage.removeItem('cartItems');
  renderCartItems();
  updateCartCount();
}

function renderCartItems() {
  const listEl = document.getElementById('cart-list');
  const emptyEl = document.getElementById('empty-cart');
  const summaryEl = document.getElementById('cart-summary');
  const cartTotalEl = document.getElementById('cart-total');
  if (!listEl || !emptyEl || !summaryEl || !cartTotalEl) return;

  const cart = loadSessionCart();
  if (cart.length === 0) {
    listEl.innerHTML = '';
    emptyEl.classList.remove('hidden');
    summaryEl.classList.add('hidden');
    return;
  }

  emptyEl.classList.add('hidden');
  summaryEl.classList.remove('hidden');
  listEl.innerHTML = '';

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotalEl.textContent = `$${total.toFixed(2)}`;

  cart.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.innerHTML = `
      <div>
        <strong>${item.title}</strong>
        <div class="muted">${item.quantity} × $${item.price.toFixed(2)}</div>
      </div>
      <button onclick="removeFromCart('${item.title}')">Remove</button>
    `;
    listEl.appendChild(itemEl);
  });
}

function showSection(sectionId) {
  setActiveSection(sectionId);
}

function showProduct(productId) {
  const product = PRODUCTS[productId];
  if (!product) return;
  document.getElementById('product-title').textContent = product.title;
  document.getElementById('product-description').textContent = product.description;
  document.getElementById('product-price').textContent = `$${product.price.toFixed(2)}`;
  const addButton = document.getElementById('product-add-button');
  if (addButton) {
    addButton.onclick = () => {
      addToCart(product.title, product.price);
      showSection('cart');
    };
  }
  setActiveSection('product');
}

function proceedCheckout() {
  const cart = loadSessionCart();
  if (cart.length === 0) {
    alert('Your cart is empty. Add products before proceeding.');
    return;
  }
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  alert(`Proceeding to checkout with ${cart.length} item(s) totaling $${total.toFixed(2)}.`);
  clearCart();
  showSection('home');
}

function initializePage() {
  updateCartCount();
  renderGreeting();

  const saveBtn = document.getElementById('save-name');
  if (saveBtn) saveBtn.addEventListener('click', saveUserName);

  const clearCartBtn = document.getElementById('clear-cart');
  if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);

  const checkoutButton = document.getElementById('checkout-button');
  if (checkoutButton) checkoutButton.addEventListener('click', proceedCheckout);

  const lastSection = getCookie('lastSection');
  if (lastSection && ['home', 'product', 'cart'].includes(lastSection)) {
    setActiveSection(lastSection);
  } else {
    setActiveSection('home');
  }
}

window.addEventListener('DOMContentLoaded', initializePage);
