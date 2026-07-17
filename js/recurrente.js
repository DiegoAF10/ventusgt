/**
 * Recurrente Checkout Integration v5 — Cart-aware
 *
 * Works with cart.js for multi-item shopping cart.
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

let appliedCoupon = null; // { code, type, discount_percent? }

const VENTUS_WHATSAPP = '50231015202';

/**
 * Builds a WhatsApp pre-filled message with the full cart, totals and
 * (if already typed) the customer's name — used by the COD payment method.
 */
function buildCodWhatsAppMessage(data, totals) {
  var lines = [];
  lines.push('Hola VENTUS, quiero hacer este pedido con pago contra entrega (COD):');
  lines.push('');
  totals.lineItems.forEach(function(li) {
    lines.push(li.quantity + 'x ' + li.name + ' - Q' + li.lineTotal);
  });
  lines.push('');
  lines.push('Envio: ' + (totals.shipping === 0 ? 'Gratis' : 'Q' + totals.shipping));
  lines.push('Total: Q' + totals.total);

  if (data.name) {
    lines.push('');
    lines.push('Nombre: ' + data.name);
  }
  if (data.phone) lines.push('Telefono: ' + data.phone);
  if (data.address && data.address.line1) {
    var addrParts = [data.address.line1];
    if (data.address.zone) addrParts.push('Zona ' + data.address.zone);
    if (data.address.neighborhood) addrParts.push(data.address.neighborhood);
    if (data.address.city) addrParts.push(data.address.city);
    if (data.address.department) addrParts.push(data.address.department);
    lines.push('Direccion: ' + addrParts.join(', '));
  }

  lines.push('');
  lines.push('Como coordinamos el pago al recibir el pedido?');

  return lines.join('\n');
}

/**
 * COD path: builds the WhatsApp message and opens wa.me — never touches
 * the Recurrente/Worker checkout endpoint.
 */
function submitCheckoutCod(data, totals) {
  var message = buildCodWhatsAppMessage(data, totals);
  var url = 'https://wa.me/' + VENTUS_WHATSAPP + '?text=' + encodeURIComponent(message);
  window.open(url, '_blank');
  window.dispatchEvent(new CustomEvent('ventusCodCheckoutOpened'));
}

/**
 * Backward compat: adds to cart and navigates to checkout
 */
function buyProduct(sku) {
  if (!PRODUCT_INFO[sku]) return;
  if (typeof addToCart === 'function') {
    addToCart(sku, 1);
    window.location.href = '/checkout.html';
  } else {
    window.location.href = '/checkout.html?sku=' + sku;
  }
}

/**
 * Recalculate and update order summary from cart state.
 * Renders multi-item line items in the summary sidebar.
 */
function updateOrderSummary() {
  if (typeof getCartTotals !== 'function') return;

  var totals = getCartTotals();

  // Apply coupon to cart totals
  var discountAmount = 0;
  var isFreeShipping = false;

  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round(totals.subtotal * appliedCoupon.discount_percent / 100);
    } else if (appliedCoupon.type === 'free_shipping') {
      isFreeShipping = true;
    }
  }

  var afterDiscount = totals.subtotal - discountAmount;
  var shipping = isFreeShipping ? 0 : calculateShipping(totals.subtotal);
  var total = afterDiscount + shipping;

  // Render line items in summary
  var summaryLines = document.getElementById('ch-summary-lines');
  if (summaryLines) {
    summaryLines.innerHTML = '';
    for (var i = 0; i < totals.lineItems.length; i++) {
      var li = totals.lineItems[i];
      var label = li.quantity > 1 ? li.quantity + 'x ' + li.name : li.name;
      var row = document.createElement('div');
      row.className = 'flex justify-between text-sm';
      row.innerHTML = '<span class="text-gray-600">' + label + '</span><span class="font-medium">Q' + li.lineTotal + '.00</span>';
      summaryLines.appendChild(row);
    }

    // NT-02 gift row
    var skusInCart = totals.lineItems.map(function(l) { return l.sku; });
    var hasNT02Gift = skusInCart.indexOf('NT-02') !== -1 && skusInCart.indexOf('NT-03') === -1;
    var giftRow = document.getElementById('ch-summary-gift');
    if (giftRow) {
      giftRow.style.display = hasNT02Gift ? '' : 'none';
    }
  }

  // Discount row
  var existingDiscount = document.getElementById('ch-summary-discount');
  if (discountAmount > 0) {
    var html = '<span class="text-green-600">Descuento (' + appliedCoupon.discount_percent + '%)</span><span class="text-green-600 font-medium">-Q' + discountAmount + '.00</span>';
    if (existingDiscount) {
      existingDiscount.innerHTML = html;
      existingDiscount.style.display = '';
    }
  } else if (existingDiscount) {
    existingDiscount.style.display = 'none';
  }

  // Shipping
  var shippingEl = document.getElementById('ch-summary-shipping');
  if (shippingEl) {
    shippingEl.innerHTML = shipping === 0
      ? '<span class="text-green-600">Gratis</span>'
      : 'Q' + shipping + '.00';
  }

  // Shipping hint
  var shippingHint = document.getElementById('ch-shipping-hint');
  if (shippingHint) {
    if (shipping > 0 && !isFreeShipping) {
      var remaining = FREE_SHIPPING_THRESHOLD - totals.subtotal;
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
  var totalEl = document.getElementById('ch-summary-total');
  if (totalEl) totalEl.textContent = 'Q' + total + '.00';
}

/**
 * Form submission handler — reads cart, sends items[] to Worker
 */
async function submitCheckout(e) {
  e.preventDefault();
  var form = document.getElementById('checkout-form');
  var btn = document.getElementById('checkout-submit');
  var btnMobile = document.getElementById('checkout-submit-mobile');
  var errorDiv = document.getElementById('checkout-error');
  var errorDivMobile = document.getElementById('checkout-error-mobile');

  function showError(msg) {
    if (errorDiv) { errorDiv.textContent = msg; errorDiv.style.display = 'block'; }
    if (errorDivMobile) { errorDivMobile.textContent = msg; errorDivMobile.style.display = 'block'; }
  }
  function hideError() {
    if (errorDiv) errorDiv.style.display = 'none';
    if (errorDivMobile) errorDivMobile.style.display = 'none';
  }

  // Build items from cart
  var cart = getCart();
  var items = cart.items.map(function(i) { return { sku: i.sku, quantity: i.quantity }; });

  if (items.length === 0) {
    showError('Tu carrito esta vacio.');
    return;
  }

  var data = {
    items: items,
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
    coupon_code: appliedCoupon ? appliedCoupon.code : '',
  };

  // Basic client-side validation
  if (!data.name || !data.email || !data.phone || !data.address.line1 || !data.address.city || !data.address.department) {
    showError('Por favor completa todos los campos obligatorios (*).');
    return;
  }

  // Payment method: 'card' (Recurrente) or 'cod_whatsapp' (contra entrega)
  var pmField = form.elements.namedItem('payment_method');
  var paymentMethod = pmField && pmField.value ? pmField.value : 'card';
  var totals = getCartTotals();
  var defaultLabel = paymentMethod === 'cod_whatsapp' ? 'Continuar por WhatsApp' : 'Continuar al pago';

  // GA4 ecommerce: begin_checkout (fired once per submit attempt, method-aware)
  if (typeof gtag === 'function') {
    gtag('event', 'begin_checkout', {
      currency: 'GTQ',
      value: totals.subtotal,
      method: paymentMethod,
      items: totals.lineItems.map(function(li) {
        return { item_id: li.sku, item_name: li.name, price: li.price, quantity: li.quantity };
      }),
    });
  }

  // COD: build the WhatsApp message and stop — never touches Recurrente
  if (paymentMethod === 'cod_whatsapp') {
    submitCheckoutCod(data, totals);
    return;
  }

  // Loading state
  if (btn) { btn.disabled = true; btn.textContent = 'Procesando...'; }
  if (btnMobile) { btnMobile.disabled = true; btnMobile.textContent = 'Procesando...'; }
  hideError();

  try {
    var res = await fetch(WORKER_URL + '/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    var result = await res.json();

    if (!res.ok) {
      throw new Error(result.details ? result.details.join('. ') : result.error || 'Error al procesar');
    }

    if (result.checkout_url) {
      // Save order data for Purchase pixel/GA4 event (orderId used for dedupe + transaction_id)
      var orderId = result.order_id || result.id || result.reference || ('local_' + Date.now());
      localStorage.setItem('ventus_last_order', JSON.stringify({
        orderId: String(orderId),
        items: totals.lineItems.map(function(li) {
          return { sku: li.sku, name: li.name, price: li.price, quantity: li.quantity };
        }),
        value: totals.total,
        subtotal: totals.subtotal,
        shipping: totals.shipping,
        num_items: totals.itemCount,
        coupon: appliedCoupon ? appliedCoupon.code : null,
        timestamp: Date.now(),
      }));

      // Clear cart before redirect
      clearCart();
      window.location.href = result.checkout_url;
    } else {
      throw new Error('No se recibio URL de pago');
    }
  } catch (err) {
    showError(err.message);
    if (btn) { btn.disabled = false; btn.textContent = defaultLabel; }
    if (btnMobile) { btnMobile.disabled = false; btnMobile.textContent = defaultLabel; }
  }
}
