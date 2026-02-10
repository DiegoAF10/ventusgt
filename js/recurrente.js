/**
 * Recurrente Checkout Integration v2
 *
 * On-site modal checkout form that captures customer data
 * before redirecting to Recurrente for payment.
 *
 * Flow: buyProduct(sku) -> modal -> POST to Worker -> redirect to Recurrente
 */

const WORKER_URL = 'https://ventus-backoffice.ventusgt.workers.dev';

const PRODUCT_INFO = {
  'MT-01': { name: 'Mouth Tape VENTUS', price: 100 },
  'NT-01': { name: 'Nose Tape VENTUS', price: 100 },
  'NT-02': { name: 'Nose Tape VENTUS — Edicion Premium', price: 100 },
  'BUNDLE': { name: 'Bundle VENTUS — Mouth + Nose Tape', price: 175 },
};

const DEPARTMENTS = [
  'Guatemala', 'Sacatepequez', 'Chimaltenango', 'Escuintla',
  'Santa Rosa', 'Solola', 'Totonicapan', 'Quetzaltenango',
  'Suchitepequez', 'Retalhuleu', 'San Marcos', 'Huehuetenango',
  'Quiche', 'Baja Verapaz', 'Alta Verapaz', 'Peten',
  'Izabal', 'Zacapa', 'Chiquimula', 'Jalapa', 'Jutiapa', 'El Progreso',
];

let currentSku = null;

function buyProduct(sku) {
  currentSku = sku;
  const product = PRODUCT_INFO[sku];
  if (!product) return;
  openCheckoutModal(sku, product);
}

function openCheckoutModal(sku, product) {
  // Remove existing modal if any
  const existing = document.getElementById('checkout-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'checkout-modal';
  modal.className = 'checkout-backdrop';
  modal.innerHTML = `
    <div class="checkout-card">
      <div class="checkout-header">
        <div>
          <h2 class="checkout-title">Finalizar Compra</h2>
          <p class="checkout-subtitle">${product.name} — Q${product.price}</p>
        </div>
        <button onclick="closeCheckoutModal()" class="checkout-close" aria-label="Cerrar">&times;</button>
      </div>

      <form id="checkout-form" class="checkout-form" onsubmit="submitCheckout(event)">
        <div class="checkout-section">
          <p class="checkout-section-label">Datos personales</p>
          <div class="checkout-grid">
            <div class="checkout-field checkout-full">
              <label class="checkout-label" for="ch-name">Nombre completo *</label>
              <input type="text" id="ch-name" name="name" class="checkout-input" required
                     placeholder="Ej: Maria Lopez" autocomplete="name">
            </div>
            <div class="checkout-field">
              <label class="checkout-label" for="ch-email">Email *</label>
              <input type="email" id="ch-email" name="email" class="checkout-input" required
                     placeholder="tu@email.com" autocomplete="email">
            </div>
            <div class="checkout-field">
              <label class="checkout-label" for="ch-phone">Telefono *</label>
              <input type="tel" id="ch-phone" name="phone" class="checkout-input" required
                     placeholder="5555 1234" autocomplete="tel">
            </div>
          </div>
        </div>

        <div class="checkout-section">
          <p class="checkout-section-label">Direccion de entrega</p>
          <div class="checkout-grid">
            <div class="checkout-field checkout-full">
              <label class="checkout-label" for="ch-address">Direccion *</label>
              <input type="text" id="ch-address" name="line1" class="checkout-input" required
                     placeholder="Ej: 4a Avenida 12-34">
            </div>
            <div class="checkout-field">
              <label class="checkout-label" for="ch-zone">Zona</label>
              <input type="text" id="ch-zone" name="zone" class="checkout-input"
                     placeholder="Ej: 10">
            </div>
            <div class="checkout-field">
              <label class="checkout-label" for="ch-neighborhood">Colonia / Residencial</label>
              <input type="text" id="ch-neighborhood" name="neighborhood" class="checkout-input"
                     placeholder="Ej: Oakland">
            </div>
            <div class="checkout-field">
              <label class="checkout-label" for="ch-city">Ciudad *</label>
              <input type="text" id="ch-city" name="city" class="checkout-input" required
                     placeholder="Ej: Guatemala" autocomplete="address-level2">
            </div>
            <div class="checkout-field">
              <label class="checkout-label" for="ch-department">Departamento *</label>
              <select id="ch-department" name="department" class="checkout-input" required>
                <option value="">Seleccionar...</option>
                ${DEPARTMENTS.map(d => `<option value="${d}">${d}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>

        <div class="checkout-section">
          <p class="checkout-section-label">Facturacion</p>
          <div class="checkout-grid">
            <div class="checkout-field">
              <label class="checkout-label" for="ch-nit">NIT</label>
              <input type="text" id="ch-nit" name="nit" class="checkout-input"
                     placeholder="CF" value="CF">
            </div>
            <div class="checkout-field">
              <label class="checkout-label" for="ch-notes">Notas de entrega</label>
              <input type="text" id="ch-notes" name="delivery_notes" class="checkout-input"
                     placeholder="Ej: Edificio azul, apto 3B">
            </div>
          </div>
        </div>

        <!-- Price summary -->
        <div class="checkout-summary">
          <div class="checkout-summary-row">
            <span>Producto</span>
            <span>Q${product.price}.00</span>
          </div>
          <div class="checkout-summary-row" id="checkout-shipping-row">
            <span>Envio</span>
            <span id="checkout-shipping-value">Gratis</span>
          </div>
          <div class="checkout-summary-row checkout-summary-total">
            <span>Total</span>
            <span id="checkout-total-value">Q${product.price}.00</span>
          </div>
        </div>

        <div id="checkout-error" class="checkout-error" style="display:none;"></div>

        <button type="submit" id="checkout-submit" class="checkout-btn">
          Continuar al pago — Q${product.price}.00
        </button>

        <p class="checkout-disclaimer">
          Seras redirigido a Recurrente para completar el pago con tarjeta de forma segura.
        </p>
      </form>
    </div>
  `;

  document.body.appendChild(modal);

  // Animate in
  requestAnimationFrame(() => modal.classList.add('active'));

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCheckoutModal();
  });

  // Close on Escape
  document.addEventListener('keydown', handleEscKey);

  // Update shipping when department changes
  const deptSelect = modal.querySelector('#ch-department');
  deptSelect.addEventListener('change', () => updateShippingQuote(sku, deptSelect.value, product.price));

  // Focus first input
  setTimeout(() => document.getElementById('ch-name')?.focus(), 100);
}

async function updateShippingQuote(sku, department, productPrice) {
  const shippingEl = document.getElementById('checkout-shipping-value');
  const totalEl = document.getElementById('checkout-total-value');
  const btn = document.getElementById('checkout-submit');
  if (!department) return;

  try {
    const res = await fetch(`${WORKER_URL}/api/shipping?sku=${sku}&department=${encodeURIComponent(department)}`);
    const data = await res.json();
    if (data.shipping > 0) {
      shippingEl.textContent = `Q${data.shipping.toFixed(2)}`;
    } else {
      shippingEl.textContent = 'Gratis';
    }
    totalEl.textContent = `Q${data.total.toFixed(2)}`;
    btn.textContent = `Continuar al pago — Q${data.total.toFixed(2)}`;
  } catch {
    // If quote fails, keep showing product price only
    totalEl.textContent = `Q${productPrice}.00`;
    btn.textContent = `Continuar al pago — Q${productPrice}.00`;
  }
}

function handleEscKey(e) {
  if (e.key === 'Escape') closeCheckoutModal();
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;
  modal.classList.remove('active');
  document.removeEventListener('keydown', handleEscKey);
  setTimeout(() => modal.remove(), 300);
}

async function submitCheckout(e) {
  e.preventDefault();
  const form = document.getElementById('checkout-form');
  const btn = document.getElementById('checkout-submit');
  const errorDiv = document.getElementById('checkout-error');

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
  };

  // Basic client-side validation
  if (!data.name || !data.email || !data.phone || !data.address.line1 || !data.address.city || !data.address.department) {
    errorDiv.textContent = 'Por favor completa todos los campos obligatorios (*).';
    errorDiv.style.display = 'block';
    return;
  }

  // Loading state
  btn.disabled = true;
  btn.textContent = 'Procesando...';
  errorDiv.style.display = 'none';

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
      window.location.href = result.checkout_url;
    } else {
      throw new Error('No se recibio URL de pago');
    }
  } catch (err) {
    errorDiv.textContent = err.message;
    errorDiv.style.display = 'block';
    btn.disabled = false;
    btn.textContent = 'Continuar al pago';
  }
}
