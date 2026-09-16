import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  armarSnapshotCod,
  filasEntrega,
  pedidoValido,
  quetzales,
  textosHero,
} from './recibo-paint.mjs';

const cliente = {
  nombre: 'Ana López',
  telefono: '55551234',
  direccion: 'Portón negro 12',
  departamento: 'Guatemala',
  municipio: 'Mixco',
  nota: 'Llamar al llegar',
};

const datos = {
  ok: true,
  numero: 18,
  lineas: [{ sku: 'MT-01', cantidad: 1, precio_unitario_centavos: 10000, nombre: 'VENTUS Boca' }],
  subtotal_centavos: 10000,
  envio_centavos: 3500,
  total_centavos: 13500,
};

test('el snapshot COD guarda líneas, totales y entrega', () => {
  const snap = armarSnapshotCod(datos, cliente, 1_700_000_000_000);
  assert.equal(snap.mode, 'cod');
  assert.equal(snap.savedAt, 1_700_000_000_000);
  assert.equal(snap.order.numero, 18);
  assert.equal(snap.order.lineas[0].sku, 'MT-01');
  assert.equal(snap.order.total_centavos, 13500);
  assert.equal(snap.order.entrega.nombre, 'Ana López');
  assert.equal(snap.order.entrega.municipio, 'Mixco');
  assert.equal(snap.order.entrega.nota, 'Llamar al llegar');
});

test('un pedido con líneas y plata es válido', () => {
  assert.equal(pedidoValido(armarSnapshotCod(datos, cliente).order), true);
  assert.equal(pedidoValido({ numero: 18, lineas: [] }), false);
});

test('las filas de entrega salen en orden y sin vacíos', () => {
  const filas = filasEntrega(armarSnapshotCod(datos, cliente).order);
  assert.deepEqual(filas.map((f) => f.dt), [
    'Nombre',
    'Teléfono',
    'Dirección',
    'Municipio',
    'Departamento',
    'Nota',
  ]);
  assert.equal(filas[2].dd, 'Portón negro 12');
});

test('el hero COD con resumen no pide que vuelvas a comprar', () => {
  const t = textosHero({ mode: 'cod', numero: 18, tieneResumen: true });
  assert.equal(t.title, 'Pedido recibido');
  assert.match(t.lead, /Pagás cuando te llega/);
  assert.equal(t.number, 'Pedido #18');
  assert.doesNotMatch(t.lead, /Consultá tu pedido/);
});

test('sin resumen igual se ve Pedido #N', () => {
  const t = textosHero({ mode: 'cod', numero: 18, tieneResumen: false });
  assert.equal(t.number, 'Pedido #18');
  assert.equal(t.title, 'Pedido recibido');
});

test('los quetzales van con formato de Guatemala', () => {
  assert.match(quetzales(13500), /Q/);
  assert.match(quetzales(13500), /135/);
});
