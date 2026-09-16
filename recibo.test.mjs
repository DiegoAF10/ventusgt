import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ped = readFileSync(new URL('./_astro/pedido.astro_astro_type_script_index_0_lang.x4Gr826j.js', import.meta.url), 'utf8');
const gra = readFileSync(new URL('./_astro/gracias.astro_astro_type_script_index_0_lang.BLmVIAnI.js', import.meta.url), 'utf8');
const graHtml = readFileSync(new URL('./gracias/index.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('./_astro/gracias.IH5dsDWE.css', import.meta.url), 'utf8');

test('pedido JS writes the receipt key before redirect', () => {
  assert.match(ped, /ventus-confirmed-order/);
  assert.match(ped, /mode:"cod"/);
  assert.match(ped, /window\.location\.href=S/);
});

test('pedido JS guarda entrega completa en el snapshot', () => {
  assert.match(ped, /entrega:\{nombre:/);
  assert.match(ped, /localStorage\.setItem\("ventus-confirmed-order"/);
});

test('gracias JS muestra Pedido #N aunque falte el resumen', () => {
  assert.match(gra, /pintarSoloNumero/);
  assert.match(gra, /recibo-paint\.mjs/);
  assert.doesNotMatch(gra, /El resumen temporal de esta compra no está disponible/);
  assert.doesNotMatch(gra, /El detalle de líneas se muestra si volvés/);
});

test('gracias JS pinta entrega también en contra entrega', () => {
  assert.match(gra, /pintarEntrega/);
  assert.match(gra, /filasEntrega/);
});

test('gracias keeps ?pedido= in the address bar', () => {
  assert.match(graHtml, /safe\.toString\(\)\s*\?\s*location\.pathname/);
});

test('gracias es un recibo completo, no cuatro tarjetas iguales', () => {
  assert.match(graHtml, /Lo que pediste/);
  assert.match(graHtml, /A dónde va/);
  assert.match(graHtml, /Cómo pagás/);
  assert.match(graHtml, /Qué sigue/);
  assert.match(css, /\.recibo-hoja|\.recibo-bloque/);
  assert.doesNotMatch(css, /border-radius:22px/);
});

test('el lead del hero deja ver el espacio de Pagás cuando', () => {
  const bloque = css.slice(css.indexOf('.recibo-hero #receipt-lead'), css.indexOf('.recibo-hero #receipt-number'));
  assert.match(bloque, /letter-spacing:\s*0/);
  assert.match(bloque, /word-spacing:/);
});
