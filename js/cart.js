/**
 * VENTUS Cart — localStorage-based shopping cart
 *
 * Loaded on every page. Manages cart state, badge updates, and toast notifications.
 * Prices are always resolved from CART_PRODUCTS (never stored in localStorage).
 */

const CART_STORAGE_KEY = 'ventus_cart';
const CART_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const CART_PRODUCTS = {
  'MT-01': { name: 'Mouth Tape VENTUS', price: 100, img: '/assets/img/mt-01/frente.webp' },
  'NT-01': { name: 'Nose Tape VENTUS', price: 100, img: '/assets/img/nt-01/frente.webp' },
  'NT-02': { name: 'Nose Tape VENTUS — Edicion Premium', price: 149, img: '/assets/img/nt-02/frente.webp' },
  'NT-03': { name: 'Repuestos VENTUS — Pimple Patch', price: 49, img: '/assets/img/nt-03/frente.webp' },
  'BUNDLE': { name: 'Bundle VENTUS — Mouth + Nose Tape', price: 169, img: '/assets/img/bundle/bundle.webp' },
};

const CART_FREE_SHIPPING_THRESHOLD = 149;
const CART_FLAT_SHIPPING_RATE = 35;

// ── Read ──
function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return { items: [] };
    const cart = JSON.parse(raw);
    if (cart.updatedAt && (Date.now() - cart.updatedAt > CART_MAX_AGE_MS)) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return { items: [] };
    }
    cart.items = (cart.items || []).filter(i => CART_PRODUCTS[i.sku]);
    return cart;
  } catch {
    return { items: [] };
  }
}

// ── Write ──
function saveCart(cart) {
  cart.updatedAt = Date.now();
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartBadge();
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: getCartTotals() }));
}

// ── Add item ──
function addToCart(sku, quantity) {
  quantity = quantity || 1;
  if (!CART_PRODUCTS[sku]) return;
  const cart = getCart();
  const existing = cart.items.find(i => i.sku === sku);
  if (existing) {
    existing.quantity = Math.min(10, existing.quantity + quantity);
  } else {
    cart.items.push({ sku: sku, quantity: Math.min(10, quantity) });
  }
  saveCart(cart);
  showCartConfirmation(sku, quantity);
}

// ── Remove item ──
function removeFromCart(sku) {
  const cart = getCart();
  cart.items = cart.items.filter(i => i.sku !== sku);
  saveCart(cart);
}

// ── Update quantity ──
function updateCartQuantity(sku, newQuantity) {
  const cart = getCart();
  const item = cart.items.find(i => i.sku === sku);
  if (!item) return;
  if (newQuantity <= 0) {
    cart.items = cart.items.filter(i => i.sku !== sku);
  } else {
    item.quantity = Math.min(10, Math.max(1, newQuantity));
  }
  saveCart(cart);
}

// ── Clear ──
function clearCart() {
  localStorage.removeItem(CART_STORAGE_KEY);
  updateCartBadge();
  window.dispatchEvent(new CustomEvent('cartUpdated', { detail: getCartTotals() }));
}

// ── Computed totals ──
function getCartTotals() {
  const cart = getCart();
  let subtotal = 0;
  let itemCount = 0;
  const lineItems = [];

  for (const item of cart.items) {
    const product = CART_PRODUCTS[item.sku];
    if (!product) continue;
    const lineTotal = product.price * item.quantity;
    subtotal += lineTotal;
    itemCount += item.quantity;
    lineItems.push({
      sku: item.sku,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      lineTotal: lineTotal,
      img: product.img,
    });
  }

  const shipping = subtotal >= CART_FREE_SHIPPING_THRESHOLD ? 0 : (subtotal > 0 ? CART_FLAT_SHIPPING_RATE : 0);
  const total = subtotal + shipping;

  return { lineItems: lineItems, subtotal: subtotal, shipping: shipping, total: total, itemCount: itemCount };
}

function getCartItemCount() {
  const cart = getCart();
  return cart.items.reduce(function(sum, i) { return sum + i.quantity; }, 0);
}

// ── Badge ──
function updateCartBadge() {
  var count = getCartItemCount();
  var badges = document.querySelectorAll('.cart-badge');
  for (var i = 0; i < badges.length; i++) {
    if (count > 0) {
      badges[i].textContent = count > 9 ? '9+' : count;
      badges[i].classList.remove('hidden');
    } else {
      badges[i].classList.add('hidden');
    }
  }
}

// ── Toast notification ──
function showCartConfirmation(sku, quantity) {
  var product = CART_PRODUCTS[sku];
  if (!product) return;
  var toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'fixed top-20 right-4 bg-white border border-gray-200 rounded-xl p-4 shadow-lg z-[60] transform translate-x-[120%] transition-transform duration-300 max-w-xs';
    toast.innerHTML =
      '<div class="flex items-center gap-3">' +
        '<div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">' +
          '<svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>' +
        '</div>' +
        '<div class="min-w-0">' +
          '<p class="text-sm font-semibold" id="cart-toast-title"></p>' +
          '<p class="text-xs text-gray-500" id="cart-toast-sub"></p>' +
        '</div>' +
      '</div>' +
      '<a href="/checkout.html" class="block mt-3 text-center text-sm font-medium text-white bg-[#0b3e5d] rounded-lg py-2 hover:bg-[#2d5289] transition-colors">' +
        'Ver carrito y pagar' +
      '</a>';
    document.body.appendChild(toast);
  }
  document.getElementById('cart-toast-title').textContent = 'Agregado al carrito';
  document.getElementById('cart-toast-sub').textContent = quantity + 'x ' + product.name;
  toast.style.transform = 'translateX(0)';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(function() {
    toast.style.transform = 'translateX(120%)';
  }, 3000);
}

// Initialize badge on page load
document.addEventListener('DOMContentLoaded', updateCartBadge);
