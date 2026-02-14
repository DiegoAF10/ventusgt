/**
 * Recurrente Checkout Integration v4
 *
 * Redirects to /checkout.html?sku=XXX for full-page checkout experience.
 * checkout.html handles the form and POSTs to the Worker.
 *
 * Shared utilities: PRODUCT_INFO, DEPARTMENTS, calculateShipping, submitCheckout
 */

const WORKER_URL = 'https://ventus-backoffice.ventusgt.workers.dev';

const PRODUCT_INFO = {
  'MT-01': { name: 'Mouth Tape VENTUS', price: 100 },
  'NT-01': { name: 'Nose Tape VENTUS', price: 100 },
  'NT-02': { name: 'Nose Tape VENTUS — Edicion Premium', price: 149 },
  'NT-03': { name: 'Repuestos VENTUS — Pimple Patch', price: 49 },
  'BUNDLE': { name: 'Bundle VENTUS — Mouth + Nose Tape', price: 169 },
};

const FREE_SHIPPING_THRESHOLD = 149;
const FLAT_SHIPPING_RATE = 35;

function calculateShipping(price) {
  return price >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING_RATE;
}

const DEPARTMENTS = [
  'Guatemala', 'Sacatepequez', 'Chimaltenango', 'Escuintla',
  'Santa Rosa', 'Solola', 'Totonicapan', 'Quetzaltenango',
  'Suchitepequez', 'Retalhuleu', 'San Marcos', 'Huehuetenango',
  'Quiche', 'Baja Verapaz', 'Alta Verapaz', 'Peten',
  'Izabal', 'Zacapa', 'Chiquimula', 'Jalapa', 'Jutiapa', 'El Progreso',
];

let currentSku = null;
let appliedCoupon = null; // { code, type, discount_percent? }
let currentQuantity = 1;

/**
 * Update quantity and recalculate order summary
 */
function changeQuantity(delta) {
  const newQty = currentQuantity + delta;
  if (newQty < 1 || newQty > 10) return;
  currentQuantity = newQty;
  updateOrderSummary();
}

/**
 * Recalculate and update all order summary DOM elements
 */
function updateOrderSummary() {
  if (!currentSku) return;
  const product = PRODUCT_INFO[currentSku];
  if (!product) return;

  const unitPrice = product.price;
  const subtotal = unitPrice * currentQuantity;

  // Apply coupon
  let discountAmount = 0;
  let isFreeShipping = false;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round(subtotal * appliedCoupon.discount_percent / 100);
    } else if (appliedCoupon.type === 'free_shipping') {
      isFreeShipping = true;
    }
  }

  const afterDiscount = subtotal - discountAmount;
  const shipping = isFreeShipping ? 0 : calculateShipping(afterDiscount);
  const total = afterDiscount + shipping;

  // Product card
  document.getElementById('ch-product-price').textContent = 'Q' + subtotal;
  const unitPriceEl = document.getElementById('ch-unit-price');
  if (unitPriceEl) {
    unitPriceEl.textContent = currentQuantity > 1 ? 'Q' + unitPrice + ' c/u' : '';
    unitPriceEl.style.display = currentQuantity > 1 ? '' : 'none';
  }

  // Quantity display
  const qtyEl = document.getElementById('ch-quantity');
  if (qtyEl) qtyEl.textContent = currentQuantity;

  // +/- button states
  const minusBtn = document.getElementById('ch-qty-minus');
  const plusBtn = document.getElementById('ch-qty-plus');
  if (minusBtn) {
    minusBtn.disabled = currentQuantity <= 1;
    minusBtn.style.opacity = currentQuantity <= 1 ? '0.4' : '1';
  }
  if (plusBtn) {
    plusBtn.disabled = currentQuantity >= 10;
    plusBtn.style.opacity = currentQuantity >= 10 ? '0.4' : '1';
  }

  // Order summary
  const summaryLabel = currentQuantity > 1
    ? currentQuantity + 'x ' + product.name
    : product.name;
  document.getElementById('ch-summary-product').textContent = summaryLabel;
  document.getElementById('ch-summary-price').textContent = 'Q' + subtotal + '.00';

  // Discount row
  const existingDiscount = document.getElementById('ch-summary-discount');
  if (discountAmount > 0) {
    const html = '<span class="text-green-600">Descuento (' + appliedCoupon.discount_percent + '%)</span><span class="text-green-600 font-medium">-Q' + discountAmount + '.00</span>';
    if (existingDiscount) {
      existingDiscount.innerHTML = html;
    } else {
      const row = document.createElement('div');
      row.id = 'ch-summary-discount';
      row.className = 'flex justify-between text-sm';
      row.innerHTML = html;
      document.getElementById('ch-summary-price').parentElement.after(row);
    }
  } else if (existingDiscount) {
    existingDiscount.remove();
  }

  // Shipping
  document.getElementById('ch-summary-shipping').innerHTML = shipping === 0
    ? '<span class="text-green-600">Gratis</span>'
    : 'Q' + shipping + '.00';

  // Shipping hint
  const shippingHint = document.getElementById('ch-shipping-hint');
  if (shippingHint) {
    if (shipping > 0 && !isFreeShipping) {
      const remaining = FREE_SHIPPING_THRESHOLD - afterDiscount;
      if (remaining > 0) {
        shippingHint.textContent = 'Agrega Q' + remaining + ' mas para envio gratis';
        shippingHint.style.display = '';
      } else {
        shippingHint.style.display = 'none';
      }
    } else {
      shippingHint.style.display = 'none';
    }
  }

  // Total
  document.getElementById('ch-summary-total').textContent = 'Q' + total + '.00';
}

/**
 * Called from product pages — redirects to checkout page
 */
function buyProduct(sku) {
  if (!PRODUCT_INFO[sku]) return;
  window.location.href = '/checkout.html?sku=' + sku;
}

/**
 * Form submission handler — used by checkout.html
 */
async function submitCheckout(e) {
  e.preventDefault();
  const form = document.getElementById('checkout-form');
  const btn = document.getElementById('checkout-submit');
  const btnMobile = document.getElementById('checkout-submit-mobile');
  const errorDiv = document.getElementById('checkout-error');
  const errorDivMobile = document.getElementById('checkout-error-mobile');

  // Collect form data
  const data = {
    sku: currentSku,
    quantity: currentQuantity,
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    address: {
      line1: form.line1.value.trim(),
      zone: form.zone.value.trim(),
      neighborhood: form.neighborhood.value.trim(),
      city: form.city.value.trim(),
      department: form.department.value,
    },
    nit: form.nit.value.trim() || 'CF',
    delivery_notes: form.delivery_notes.value.trim(),
    addons: currentSku === 'NT-02' ? ['NT-03'] : [],
    coupon_code: appliedCoupon ? appliedCoupon.code : '',
  };

  function showError(msg) {
    if (errorDiv) { errorDiv.textContent = msg; errorDiv.style.display = 'block'; }
    if (errorDivMobile) { errorDivMobile.textContent = msg; errorDivMobile.style.display = 'block'; }
  }
  function hideError() {
    if (errorDiv) errorDiv.style.display = 'none';
    if (errorDivMobile) errorDivMobile.style.display = 'none';
  }

  // Basic client-side validation
  if (!data.name || !data.email || !data.phone || !data.address.line1 || !data.address.city || !data.address.department) {
    showError('Por favor completa todos los campos obligatorios (*).');
    return;
  }

  // Loading state
  if (btn) { btn.disabled = true; btn.textContent = 'Procesando...'; }
  if (btnMobile) { btnMobile.disabled = true; btnMobile.textContent = 'Procesando...'; }
  hideError();

  try {
    const res = await fetch(`${WORKER_URL}/api/checkout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.details ? result.details.join('. ') : result.error || 'Error al procesar');
    }

    if (result.checkout_url) {
      // Save order data for Purchase pixel event on gracias.html
      const product = PRODUCT_INFO[currentSku];
      const basePrice = product?.price || 0;
      const subtotal = basePrice * currentQuantity;
      const isFreeShipping = appliedCoupon && appliedCoupon.type === 'free_shipping';
      const discount = appliedCoupon && appliedCoupon.type === 'percent'
        ? Math.round(subtotal * appliedCoupon.discount_percent / 100) : 0;
      const finalSubtotal = subtotal - discount;
      const shipping = isFreeShipping ? 0 : calculateShipping(finalSubtotal);
      localStorage.setItem('ventus_last_order', JSON.stringify({
        sku: currentSku,
        product_name: product?.name || '',
        quantity: currentQuantity,
        value: finalSubtotal + shipping,
        price: finalSubtotal,
        unit_price: basePrice,
        original_price: subtotal,
        discount,
        shipping_waived: isFreeShipping,
        coupon: appliedCoupon ? appliedCoupon.code : null,
        shipping,
        timestamp: Date.now(),
      }));
      window.location.href = result.checkout_url;
    } else {
      throw new Error('No se recibio URL de pago');
    }
  } catch (err) {
    showError(err.message);
    if (btn) { btn.disabled = false; btn.textContent = 'Continuar al pago'; }
    if (btnMobile) { btnMobile.disabled = false; btnMobile.textContent = 'Continuar al pago'; }
  }
}
