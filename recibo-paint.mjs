/** Recibo /gracias/: textos y datos. Sin motor. Sin WhatsApp. */

const NOMBRES = {
  'MT-01': 'VENTUS Boca',
  'NT-01': 'VENTUS Nariz',
  'NT-02': 'VENTUS Clip',
  'NT-03': 'Recambios del Clip',
  BUNDLE: 'VENTUS 24',
};

const ETIQUETAS_ENTREGA = [
  ['nombre', 'Nombre'],
  ['telefono', 'Teléfono'],
  ['direccion', 'Dirección'],
  ['municipio', 'Municipio'],
  ['departamento', 'Departamento'],
  ['nota', 'Nota'],
];

export function quetzales(centavos) {
  return new Intl.NumberFormat('es-GT', { style: 'currency', currency: 'GTQ' }).format(
    (Number(centavos) || 0) / 100,
  );
}

export function nombreSku(sku, nombre) {
  const limpio = String(nombre || '').trim();
  if (limpio) return limpio;
  return NOMBRES[sku] || String(sku || '');
}

function texto(valor) {
  return String(valor ?? '').trim();
}

export function armarSnapshotCod(datos, cliente = {}, savedAt = Date.now()) {
  const entregaCasa = datos && typeof datos.entrega === 'object' && datos.entrega ? datos.entrega : {};
  const entrega = {
    nombre: texto(entregaCasa.nombre || cliente.nombre),
    telefono: texto(entregaCasa.telefono || cliente.telefono),
    direccion: texto(entregaCasa.direccion || cliente.direccion),
    municipio: texto(entregaCasa.municipio || cliente.municipio),
    departamento: texto(entregaCasa.departamento || cliente.departamento),
    nota: texto(entregaCasa.nota || cliente.nota),
  };
  return {
    savedAt,
    mode: 'cod',
    order: {
      numero: datos?.numero,
      lineas: Array.isArray(datos?.lineas) ? datos.lineas : [],
      subtotal_centavos: Number(datos?.subtotal_centavos) || 0,
      envio_centavos: Number(datos?.envio_centavos) || 0,
      total_centavos: Number(datos?.total_centavos) || 0,
      descuento_centavos: Number(datos?.descuento_centavos) || 0,
      departamento: entrega.departamento,
      entrega,
    },
  };
}

export function pedidoValido(order) {
  if (!order || order.numero == null || order.numero === '') return false;
  if (!Array.isArray(order.lineas) || order.lineas.length === 0) return false;
  const plata = [order.subtotal_centavos, order.envio_centavos, order.total_centavos];
  if (!plata.every((n) => Number.isInteger(n) && n >= 0)) return false;
  return order.lineas.every(
    (l) =>
      typeof l.sku === 'string' &&
      Number.isInteger(l.cantidad) &&
      l.cantidad > 0 &&
      Number.isInteger(l.precio_unitario_centavos) &&
      l.precio_unitario_centavos >= 0,
  );
}

export function filasEntrega(order) {
  const e = (order && typeof order.entrega === 'object' && order.entrega) || {};
  const plano = {
    nombre: e.nombre,
    telefono: e.telefono,
    direccion: e.direccion,
    municipio: e.municipio,
    departamento: e.departamento || order?.departamento,
    nota: e.nota,
  };
  return ETIQUETAS_ENTREGA.flatMap(([key, dt]) => {
    const dd = texto(plano[key]);
    return dd ? [{ dt, dd }] : [];
  });
}

export function textosHero({ mode, numero, tieneResumen }) {
  const n = texto(numero);
  if (mode === 'cod') {
    return {
      title: 'Pedido recibido',
      lead: tieneResumen
        ? 'Ya lo tenemos anotado. Pagás cuando te llega.'
        : 'Ya lo tenemos anotado. Pagás cuando te llega.',
      number: n ? `Pedido #${n}` : '',
    };
  }
  return {
    title: tieneResumen ? 'Pedido recibido' : 'Estamos confirmando el pago',
    lead: tieneResumen ? 'Tu pago fue confirmado.' : 'Un momento: confirmamos los datos antes de mostrar el resumen.',
    number: n ? `Pedido #VT-${n}` : '',
  };
}

export function textoEta(departamento, savedAt) {
  const depto = texto(departamento);
  if (savedAt && depto) {
    const horas = depto === 'Guatemala' ? 24 : 48;
    const fecha = (extra) =>
      new Intl.DateTimeFormat('es-GT', { timeZone: 'America/Guatemala', day: 'numeric', month: 'long' }).format(
        new Date(savedAt + extra * 36e5),
      );
    return `Entre el ${fecha(horas)} y el ${fecha(horas + 24)} · ${depto}. Estimación de ${horas}–${horas + 24} horas desde tu pedido.`;
  }
  return 'Guatemala: 24–48 horas. Otros departamentos: 48–72 horas desde el pedido.';
}

export function leerSnapshot(raw, now = Date.now(), ttl = 72 * 60 * 60 * 1000) {
  if (!raw) return null;
  try {
    const t = JSON.parse(raw);
    if (!t || !Number.isFinite(t.savedAt)) return null;
    if (now - t.savedAt < 0 || now - t.savedAt >= ttl) return null;
    return t;
  } catch {
    return null;
  }
}
