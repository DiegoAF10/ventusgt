import { c as vaciarCarrito, t as track } from "./cart.CC054dpK.js";
import {
  filasEntrega,
  leerSnapshot,
  nombreSku,
  pedidoValido,
  quetzales,
  textoEta,
  textosHero,
} from "../recibo-paint.mjs";

const LLAVE = "ventus-confirmed-order";

function el(id) {
  return document.getElementById(id);
}

function texto(id, valor) {
  el(id).textContent = valor;
}

function leerGuardado() {
  for (const store of [sessionStorage, localStorage]) {
    try {
      const snap = leerSnapshot(store.getItem(LLAVE));
      if (snap) return snap;
      store.removeItem(LLAVE);
    } catch {}
  }
  return null;
}

function pintarHero({ mode, numero, tieneResumen }) {
  const t = textosHero({ mode, numero, tieneResumen });
  texto("receipt-title", t.title);
  texto("receipt-lead", t.lead);
  if (t.number) {
    texto("receipt-number", t.number);
    el("receipt-number").hidden = false;
  }
}

function pintarLineas(order, thumbs) {
  const caja = el("receipt-lines");
  caja.replaceChildren();
  for (const n of order.lineas) {
    const fila = document.createElement("div");
    fila.className = "receipt-line";
    if (thumbs[n.sku]) {
      const img = document.createElement("img");
      img.src = thumbs[n.sku];
      img.alt = nombreSku(n.sku, n.nombre);
      fila.append(img);
    }
    const cuerpo = document.createElement("div");
    const nom = document.createElement("strong");
    const cant = document.createElement("small");
    const monto = document.createElement("b");
    nom.textContent = nombreSku(n.sku, n.nombre);
    cant.textContent = `Cantidad: ${n.cantidad}`;
    monto.textContent = quetzales(n.cantidad * n.precio_unitario_centavos);
    cuerpo.append(nom, cant);
    fila.append(cuerpo, monto);
    caja.append(fila);
  }
}

function pintarEntrega(order) {
  const filas = filasEntrega(order);
  const lista = el("receipt-delivery");
  lista.replaceChildren();
  if (!filas.length) {
    el("receipt-address-card").hidden = true;
    return;
  }
  for (const f of filas) {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = f.dt;
    dd.textContent = f.dd;
    row.append(dt, dd);
    lista.append(row);
  }
  el("receipt-address-card").hidden = false;
}

function pintarPedido(order, mode, savedAt, thumbs) {
  el("receipt-state").hidden = true;
  el("receipt-retry").hidden = true;
  el("receipt-content").hidden = false;
  el("recibo-productos").hidden = false;
  pintarHero({ mode, numero: order.numero, tieneResumen: true });
  texto("receipt-method", mode === "cod" ? "Contra entrega" : "Tarjeta");
  texto("receipt-payment", mode === "cod" ? "Pagás al recibir" : "Pago confirmado");
  pintarLineas(order, thumbs);
  texto("receipt-subtotal", quetzales(order.subtotal_centavos));
  texto("receipt-shipping", order.envio_centavos === 0 ? "Gratis" : quetzales(order.envio_centavos));
  texto("receipt-total", quetzales(order.total_centavos));
  if (order.descuento_centavos) {
    el("receipt-discount-row").hidden = false;
    texto("receipt-discount", `−${quetzales(order.descuento_centavos)}`);
  }
  pintarEntrega(order);
  texto("receipt-eta", textoEta(order.departamento || order.entrega?.departamento || "", savedAt));
  try {
    vaciarCarrito();
    sessionStorage.removeItem("ventus-checkout-context");
  } catch {}
  if (mode === "card") {
    const llave = `ventus-purchase-${order.numero}`;
    let ya = false;
    try {
      ya = !!sessionStorage.getItem(llave);
    } catch {}
    if (!ya) {
      track(
        "purchase",
        {
          transaction_id: String(order.numero),
          currency: "GTQ",
          value: order.total_centavos / 100,
          items: order.lineas.map((o) => ({
            item_id: o.sku,
            quantity: o.cantidad,
            price: o.precio_unitario_centavos / 100,
          })),
        },
        {
          eventID: `ventus-orden-${order.numero}`,
          metaParams: {
            content_type: "product",
            contents: order.lineas.map((o) => ({
              id: o.sku,
              quantity: o.cantidad,
              item_price: o.precio_unitario_centavos / 100,
            })),
          },
        },
      );
      try {
        sessionStorage.setItem(llave, String(Date.now()));
      } catch {}
    }
  }
}

function pintarSoloNumero(numero, mode) {
  el("receipt-state").hidden = true;
  el("receipt-retry").hidden = true;
  el("receipt-content").hidden = false;
  el("recibo-productos").hidden = true;
  el("receipt-address-card").hidden = true;
  pintarHero({ mode, numero, tieneResumen: false });
  texto("receipt-method", mode === "cod" ? "Contra entrega" : "Tarjeta");
  texto("receipt-payment", mode === "cod" ? "Pagás al recibir" : "Pago confirmado");
  texto("receipt-eta", textoEta("", 0));
}

async function arrancar() {
  const root = el("receipt-main");
  if (!root) return;
  const q = new URLSearchParams(window.__receiptQuery || "");
  delete window.__receiptQuery;
  const checkoutId = q.get("checkout_id");
  const pedido = q.get("pedido");
  const thumbs = JSON.parse(root.dataset.thumbs || "{}");

  if (pedido) {
    const snap = leerGuardado();
    if (snap?.mode === "cod" && String(snap.order?.numero) === pedido && pedidoValido(snap.order)) {
      pintarPedido(snap.order, "cod", snap.savedAt, thumbs);
    } else {
      pintarSoloNumero(pedido, "cod");
    }
    return;
  }

  if (!checkoutId || !/^[A-Za-z0-9_-]{6,64}$/.test(checkoutId)) {
    pintarHero({ mode: "card", numero: "", tieneResumen: false });
    texto("receipt-title", "Consultá tu pedido");
    texto("receipt-lead", "Abrí el enlace de tu compra o escribinos por WhatsApp.");
    el("receipt-state").hidden = true;
    return;
  }

  const retry = el("receipt-retry");
  let ocupado = false;
  async function consultar() {
    if (ocupado) return;
    ocupado = true;
    retry.disabled = true;
    try {
      const r = await fetch(`${root.dataset.base}/api/tienda/pedido/${encodeURIComponent(checkoutId)}`, {
        cache: "no-store",
        referrerPolicy: "no-referrer",
        signal: AbortSignal.timeout(15000),
      });
      if (!r.ok) throw new Error("lookup");
      const t = await r.json();
      if (t.ok && t.pagado === true && pedidoValido(t)) pintarPedido(t, "card", Date.now(), thumbs);
      else {
        texto("receipt-title", t.confirmando ? "Estamos confirmando el pago" : "Pago sin confirmar");
        texto("receipt-lead", "Todavía no tenemos confirmación del pago.");
        el("receipt-state").textContent = "Revisá el estado aquí. No hace falta crear otro pedido.";
        retry.hidden = false;
      }
    } catch {
      texto("receipt-title", "No pudimos consultar el pago");
      texto("receipt-lead", "Esto no significa que haya fallado.");
      el("receipt-state").textContent = "Revisá el estado aquí o escribinos antes de volver a comprar.";
      retry.hidden = false;
    } finally {
      ocupado = false;
      retry.disabled = false;
    }
  }
  retry.addEventListener("click", consultar);
  await consultar();
}

arrancar();
