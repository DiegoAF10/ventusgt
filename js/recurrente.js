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
      const isFreeShipping = appliedCoupon && appliedCoupon.type === 'free_shipping';
      const discount = appliedCoupon && appliedCoupon.type === 'percent'
        ? Math.round(basePrice * appliedCoupon.discount_percent / 100) : 0;
      const finalPrice = basePrice - discount;
      const shipping = isFreeShipping ? 0 : calculateShipping(finalPrice);
      localStorage.setItem('ventus_last_order', JSON.stringify({
        sku: currentSku,
        product_name: product?.name || '',
        value: finalPrice + shipping,
        price: finalPrice,
        original_price: basePrice,
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
