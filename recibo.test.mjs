import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const ped = readFileSync(new URL('./_astro/pedido.astro_astro_type_script_index_0_lang.x4Gr826j.js', import.meta.url), 'utf8');
const gra = readFileSync(new URL('./_astro/gracias.astro_astro_type_script_index_0_lang.BLmVIAnI.js', import.meta.url), 'utf8');
const graHtml = readFileSync(new URL('./gracias/index.html', import.meta.url), 'utf8');
test('pedido JS writes the receipt key before redirect', () => {
  assert.match(ped, /ventus-confirmed-order/);
  assert.match(ped, /mode:"cod"/);
  assert.match(ped, /window\.location\.href=S/);
});
test('gracias JS shows the order number without sessionStorage', () => {
  assert.match(gra, /Pedido #\$\{y\}/);
  assert.doesNotMatch(gra, /El resumen temporal de esta compra no está disponible/);
});
test('gracias keeps ?pedido= in the address bar', () => {
  assert.match(graHtml, /safe\.toString\(\)\?location\.pathname/);
});
