# VENTUS — Gemini Pro Image Generation Kit

> **Propósito:** Prompts listos para generar TODOS los assets del ASSET-BRIEF.md
> con Gemini Pro. Cada prompt incluye las referencias a subir y el texto exacto.
>
> **Fecha:** 2026-02-23
> **Versión:** 1.0

---

## Cómo usar este kit

### Flujo por imagen:
1. Abrí Gemini Pro (gemini.google.com)
2. Subí las **imágenes de referencia** indicadas en cada prompt
3. Pegá el **System Context** (una sola vez por sesión)
4. Pegá el **prompt específico** del asset
5. Si el resultado no es exacto → usá el **prompt de corrección** al final
6. Descargá → renombrá según la ruta indicada

### Tips para consistencia:
- **Subí SIEMPRE las referencias del producto** — Gemini necesita ver el producto real
- **No cambies el system context** entre imágenes de la misma sesión
- **Si Gemini cambia el estilo del producto** (color, forma, texto), pedí corrección específica
- **Generá en la resolución más alta posible** y después recortá/convertí

---

## System Context (pegar UNA VEZ al inicio de la sesión)

> Copiar y pegar esto al inicio de cada sesión de Gemini. Establece el estilo
> visual para todas las imágenes de la sesión.

```
Sos el fotógrafo de producto de VENTUS, una marca guatemalteca de cintas
de respiración nasal. Vas a generar fotos de producto y lifestyle siguiendo
estas directrices EXACTAS:

ESTILO VISUAL:
- Mood: Limpio, luminoso, con aire. Sensación de calma y bienestar.
- Fondos: Blancos o neutros claros para producto. Ambientes reales para lifestyle.
- Iluminación: Natural o softbox. NUNCA flash directo ni sombras duras.
- Paleta: Tonos fríos (azules, blancos, grises claros). Cálidos SOLO en contexto
  de sueño (dorados suaves).
- Personas: Aspecto latino/guatemalteco natural. Expresiones relajadas, no forzadas.
  Edad 25-40. Fit pero no bodybuilder.
- Producto: Siempre nítido, bien iluminado. El producto es el protagonista.
- Composición: Espacio negativo generoso. No abarrotar el frame.

REFERENCIAS DE MARCA:
- Se siente como: Nike editorial + Patagonia honestidad + Aesop minimalismo
- NO se siente como: GNC suplementos, Herbalife MLM, clínica fría, fitness bro

PRODUCTOS VENTUS:
- MT-01 (Mouth Tape): Cinta adhesiva negra ovalada que se pega sobre los labios
  cerrados. Empaque: pouch stand-up azul navy oscuro con logo VENTUS blanco.
- NT-01 (Nose Tape): Tira adhesiva negra curva que se pega sobre el puente
  nasal. Empaque: pouch stand-up azul navy oscuro con logo VENTUS blanco.
- NT-02 (Nose Tape Premium): Tira nasal premium. Empaque: caja blanca
  rectangular "Starter Kit".

REGLAS:
1. El producto en la imagen debe verse IDÉNTICO a las fotos de referencia que
   te adjunto. No cambies colores, forma, texto del empaque, ni proporciones.
2. Las personas deben verse naturales — no modelos de stock perfectos.
3. Calidad fotográfica profesional pero no artificial.
4. Si incluís texto en la imagen, debe ser en español.
5. Formato de salida: la resolución más alta posible.
```

---

## P1 — Assets de alto impacto

---

### ASSET 1: MT-01 "Cómo se usa" — Paso 1

**Subir referencias:**
- `assets/img/mt-01/frente.png` (empaque del producto)
- `assets/img/mt-01/lifestyle-m.png` (referencia de cómo se ve la cinta puesta)

**Prompt:**
```
Generá una foto de producto para el paso 1 de las instrucciones de uso
del Mouth Tape VENTUS.

LA ESCENA: Close-up de una mujer latina (~30 años) secándose los labios
con una toalla blanca pequeña. Está en un baño limpio y moderno.
El empaque del producto (el pouch azul navy que ves en la referencia)
está visible en el fondo, ligeramente desenfocado, sobre el mueble del baño.

COMPOSICIÓN: Retrato desde el pecho hacia arriba, ligeramente ladeado.
Foco en los labios y la toalla. Iluminación softbox lateral, cálida.
Fondo: baño con tonos blancos/cream.

DIMENSIONES: 600x400px, horizontal.
MOOD: Preparación tranquila antes de dormir.
```

**Ruta destino:** `assets/img/mt-01/paso-1.webp`

---

### ASSET 2: MT-01 "Cómo se usa" — Paso 2

**Subir referencias:**
- `assets/img/mt-01/lifestyle-f.png` (mujer con la cinta puesta — referencia de la cinta)
- `assets/img/mt-01/frente.png` (empaque)

**Prompt:**
```
Generá una foto de producto para el paso 2 de las instrucciones de uso
del Mouth Tape VENTUS.

LA ESCENA: La misma mujer latina del paso 1 está aplicándose la cinta
negra ovalada sobre los labios cerrados. Sus dedos (índice y pulgar de
ambas manos) están presionando los bordes de la cinta contra la piel.
La cinta es EXACTAMENTE como la que ves en la foto de referencia:
negra, ovalada, mate, cubriendo los labios completamente.

COMPOSICIÓN: Close-up más cerrado que el paso 1. Foco en la boca,
los dedos, y la cinta. Se ven los ojos parcialmente. Misma iluminación
que paso 1.

DIMENSIONES: 600x400px, horizontal.
MOOD: Acción simple y natural — como ponerse una bandita.
```

**Ruta destino:** `assets/img/mt-01/paso-2.webp`

---

### ASSET 3: MT-01 "Cómo se usa" — Paso 3

**Subir referencias:**
- `assets/img/mt-01/lifestyle-f.png` (referencia exacta del look final)

**Prompt:**
```
Generá una foto de producto para el paso 3 de las instrucciones de uso
del Mouth Tape VENTUS.

LA ESCENA: Mujer latina (~30 años) acostada en la cama, ojos cerrados,
expresión completamente relajada, con la cinta negra ovalada puesta sobre
los labios. Sábanas blancas, almohada suave. La cinta se ve EXACTAMENTE
como en la foto de referencia: negra, ovalada, mate, bien pegada.

COMPOSICIÓN: Vista ligeramente elevada (como si la cámara estuviera
sobre la cama). Cabeza sobre almohada, pelo suelto. Iluminación cálida
y suave (lámpara de noche, tono dorado).

DIMENSIONES: 600x400px, horizontal.
MOOD: Descanso profundo. Calma total. Esta es la recompensa.
```

**Ruta destino:** `assets/img/mt-01/paso-3.webp`

---

### ASSET 4: NT-01 "Cómo se usa" — Paso 1

**Subir referencias:**
- `assets/img/nt-01/frente.png` (empaque)
- `assets/img/nt-01/nose-tape.webp` (cómo se ve la tira puesta)

**Prompt:**
```
Generá una foto de producto para el paso 1 de las instrucciones de uso
del Nose Tape VENTUS.

LA ESCENA: Hombre latino atlético (~28 años, pelo corto, barba de 2 días)
limpiándose el puente nasal con una toallita. Está en un vestidor de gym
o baño deportivo. El empaque azul navy del producto está sobre el banco/mueble.

COMPOSICIÓN: Retrato desde el pecho hacia arriba. Foco en la nariz y
la mano limpiando. Iluminación natural lateral.

DIMENSIONES: 600x400px, horizontal.
MOOD: Pre-entrenamiento, preparación.
```

**Ruta destino:** `assets/img/nt-01/paso-1.webp`

---

### ASSET 5: NT-01 "Cómo se usa" — Paso 2

**Subir referencias:**
- `assets/img/nt-01/nose-tape.webp` (REFERENCIA CRÍTICA — la tira puesta)
- `assets/img/nt-01/nose-tape-2.webp`

**Prompt:**
```
Generá una foto de producto para el paso 2 de las instrucciones de uso
del Nose Tape VENTUS.

LA ESCENA: El mismo hombre latino atlético aplicándose la tira nasal negra
sobre el puente de la nariz. Sus dedos están presionando la tira para
pegarla bien. La tira es EXACTAMENTE como la referencia: negra, curva,
cruzando el puente nasal de lado a lado.

COMPOSICIÓN: Close-up de la cara, desde la frente hasta el labio superior.
Los dedos son visibles aplicando presión. Ligeramente de 3/4 para mostrar
la curvatura de la tira.

DIMENSIONES: 600x400px, horizontal.
MOOD: Concentración simple, como amarrarse los zapatos antes de correr.
```

**Ruta destino:** `assets/img/nt-01/paso-2.webp`

---

### ASSET 6: NT-01 "Cómo se usa" — Paso 3

**Subir referencias:**
- `assets/img/nt-01/nose-tape.webp` (cómo se ve la tira puesta)

**Prompt:**
```
Generá una foto de producto para el paso 3 de las instrucciones de uso
del Nose Tape VENTUS.

LA ESCENA: Hombre latino atlético corriendo al aire libre con la tira nasal
negra VENTUS visible sobre el puente nasal. Está en una calle arbolada o
parque, luz natural de mañana. Camiseta sin mangas o tank top. Sudor leve.
Expresión de esfuerzo controlado — no sufrimiento.

COMPOSICIÓN: De pecho hacia arriba, ligeramente de 3/4, en movimiento.
Fondo bokeh (árboles, calle desenfocada). La tira nasal debe ser
claramente visible.

DIMENSIONES: 600x400px, horizontal.
MOOD: Energía, rendimiento, aire libre. "Sentí la diferencia."
```

**Ruta destino:** `assets/img/nt-01/paso-3.webp`

---

### ASSET 7: NT-02 "Cómo se usa" — Paso 1

**Subir referencias:**
- `assets/img/nt-02/frente.png` (empaque)

**Prompt:**
```
Generá una foto de producto para el paso 1 de las instrucciones de uso
del Nose Tape Premium VENTUS (NT-02).

LA ESCENA: Mujer latina atlética (~27 años, pelo recogido en cola, ropa
de gym) limpiándose el puente nasal con una toallita en un gym moderno.
La caja blanca del NT-02 (Starter Kit) está visible sobre un banco de
ejercicio o mueble del gym.

COMPOSICIÓN: Retrato desde el pecho hacia arriba. Foco en la nariz y
la acción de limpiar. Iluminación artificial de gym (tonos fríos).

DIMENSIONES: 600x400px, horizontal.
MOOD: Pre-workout, preparación, foco.
```

**Ruta destino:** `assets/img/nt-02/paso-1.webp`

---

### ASSET 8: NT-02 "Cómo se usa" — Paso 2

**Subir referencias:**
- `assets/img/nt-01/nose-tape.webp` (referencia de cómo se ve la tira — misma forma)
- `assets/img/nt-02/frente.png` (empaque)

**Prompt:**
```
Generá una foto de producto para el paso 2 de las instrucciones de uso
del Nose Tape Premium VENTUS (NT-02).

LA ESCENA: La misma mujer atlética aplicándose la tira nasal negra sobre
el puente de la nariz. Dedos presionando la tira. Fondo: gym desenfocado.

COMPOSICIÓN: Close-up de la cara, desde la frente hasta la barbilla.
Los dedos son visibles. Vista frontal ligeramente elevada.

DIMENSIONES: 600x400px, horizontal.
MOOD: Ritual de preparación, foco atlético.
```

**Ruta destino:** `assets/img/nt-02/paso-2.webp`

---

### ASSET 9: NT-02 "Cómo se usa" — Paso 3

**Subir referencias:**
- `assets/img/nt-01/nose-tape.webp` (referencia de la tira puesta)

**Prompt:**
```
Generá una foto de producto para el paso 3 de las instrucciones de uso
del Nose Tape Premium VENTUS (NT-02).

LA ESCENA: Mujer latina atlética en medio de un entrenamiento intenso
(levantando pesas, kettlebell swing, o AMRAP). Tira nasal negra visible
sobre el puente nasal. Sudor real. Gym con iluminación artificial.
Expresión de esfuerzo concentrado.

COMPOSICIÓN: De cintura hacia arriba, en acción. Se ve la tira nasal
claramente. Fondo de gym desenfocado (racks, pesas).

DIMENSIONES: 600x400px, horizontal.
MOOD: Rendimiento máximo. "Entrená al máximo."
```

**Ruta destino:** `assets/img/nt-02/paso-3.webp`

---

### ASSET 10: NT-01 Lifestyle — Deporte

**Subir referencias:**
- `assets/img/nt-01/nose-tape.webp`

**Prompt:**
```
Generá una foto lifestyle para el Nose Tape VENTUS NT-01.

LA ESCENA: Hombre latino atlético (~30 años) en un box de CrossFit,
haciendo double unders o box jumps, con la tira nasal negra VENTUS
claramente visible. Sudor en la frente. Ropa deportiva (shorts,
camiseta ajustada). Luz natural entrando por portón abierto del box.

COMPOSICIÓN: Cuerpo completo o 3/4, capturando el movimiento.
La tira nasal debe ser visible aunque no sea el foco principal.
Fondo: box de CrossFit (barras, platos, cuerdas).

DIMENSIONES: 800x600px, horizontal (web hero).
Generar también versión 1080x1080px cuadrada (Instagram).
MOOD: CrossFit, comunidad, rendimiento. Energía sin agresividad.
```

**Ruta destino:** `assets/img/nt-01/lifestyle-sport.webp`

---

### ASSET 11: NT-01 Lifestyle — Sueño

**Subir referencias:**
- `assets/img/nt-01/nose-tape.webp` (cómo se ve la tira)
- `assets/img/mt-01/lifestyle-m.png` (referencia de mood nocturno)

**Prompt:**
```
Generá una foto lifestyle nocturna para el Nose Tape VENTUS NT-01.

LA ESCENA: Hombre latino (~30 años) durmiendo de lado en la cama, con la
tira nasal negra VENTUS visible sobre el puente nasal. Sábanas blancas,
almohada suave. Luz cálida suave (lámpara de noche, tono dorado/ámbar).
Expresión completamente relajada.

COMPOSICIÓN: Vista a la altura de la cama, horizontal. Cabeza sobre
almohada, cuerpo parcialmente cubierto por sábanas.

DIMENSIONES: 800x600px, horizontal.
MOOD: Sueño profundo, respiración libre, calma total.
```

**Ruta destino:** `assets/img/nt-01/lifestyle-sleep.webp`

---

### ASSET 12: NT-02 Lifestyle — Gym

**Subir referencias:**
- `assets/img/nt-01/nose-tape.webp` (referencia de la tira)

**Prompt:**
```
Generá una foto lifestyle de gym para el Nose Tape Premium VENTUS NT-02.

LA ESCENA: Hombre latino musculoso (no bodybuilder, más tipo CrossFitter)
en un gym, haciendo peso muerto o sentadilla pesada. Tira nasal negra
VENTUS visible. Sudor intenso. Gym serio (no comercial — plataformas,
bumper plates, magnesia).

COMPOSICIÓN: 3/4 cuerpo, ángulo bajo (ligeramente desde abajo para
dar sensación de poder). Tira nasal visible. Iluminación de gym
(overhead, tonos fríos con contraste).

DIMENSIONES: 800x600px, horizontal.
Generar también versión 1080x1080px cuadrada.
MOOD: Premium, intensidad, "para los que entrenan en serio."
```

**Ruta destino:** `assets/img/nt-02/lifestyle-gym.webp`

---

### ASSET 13: NT-02 Lifestyle — Close-up Premium

**Subir referencias:**
- `assets/img/nt-01/nose-tape.webp` (referencia EXACTA de la tira)
- `assets/img/nt-01/nose-tape-2.webp`

**Prompt:**
```
Generá un close-up premium del Nose Tape VENTUS puesto en la nariz.

LA ESCENA: Close-up extremo del puente nasal de una persona con la tira
nasal negra VENTUS perfectamente aplicada. La piel tiene textura real
(poros, leve brillo de sudor). Se ve la curvatura de la tira adaptándose
al puente nasal. Fondo completamente neutro (gris claro, out of focus).

COMPOSICIÓN: Macro/close-up. Solo se ve desde las cejas hasta el labio
superior. La tira nasal ocupa el centro del frame. Iluminación studio
softbox, detalle nítido.

DIMENSIONES: 800x600px, horizontal.
MOOD: Calidad premium, detalle, ingeniería. "Diseñada para tu nariz."
```

**Ruta destino:** `assets/img/nt-02/lifestyle-closeup.webp`

---

### ASSET 14: Foto Testimonial — Fundador

**Subir referencias:**
- `assets/img/mt-01/lifestyle-m.png` (referencia de mood)

**Prompt:**
```
Generá una foto tipo selfie natural de un hombre guatemalteco (~28 años)
usando mouth tape para dormir.

LA ESCENA: Selfie tomada desde arriba, en la cama, con cinta negra ovalada
sobre los labios. Sonrisa en los ojos (ojos ligeramente arrugados como
si sonriera bajo la cinta). Cabello un poco despeinado. Camiseta blanca
básica. Sábanas blancas.

COMPOSICIÓN: Selfie vertical, encuadre de rostro + hombros.
Iluminación: luz natural de ventana (mañana). No studio — debe verse
como foto real tomada con iPhone.

DIMENSIONES: 400x400px, cuadrado (se croppeará circular en web).
MOOD: "Recién desperté y dormí increíble." Natural, auténtico, no posado.
```

**Ruta destino:** `assets/img/testimonials/cliente-1.webp`

---

## P2 — Assets incrementales

---

### ASSET 15: Comparación Bundle (Infografía)

**Subir referencias:**
- `assets/img/bundle/bundle.png` (empaque real)

**Prompt:**
```
Generá una infografía de comparación de precio para el Bundle VENTUS.

LAYOUT: Dos columnas lado a lado con "VS" en el centro.

COLUMNA IZQUIERDA (gris, menos atractiva):
Título: "POR SEPARADO"
- MT-01 Mouth Tape: Q100
- NT-01 Nose Tape: Q100
- Envío: Q35
- Línea divisoria
- Total: Q235
Color de fondo: gris claro (#f5f5f5)

COLUMNA DERECHA (naranja/brand, destacada):
Título: "BUNDLE VENTUS"
- Mouth Tape + Nose Tape
- Imagen del bundle (usar la referencia que subí)
- Precio: Q169
- Badge: "ENVÍO GRATIS"
- Badge destacado: "Ahorrás Q66"
Color de fondo: blanco con borde naranja (#e67e22)

TIPOGRAFÍA: Montserrat Bold para precios, Regular para descripciones.
COLORES: Azul navy (#0b3e5d) para texto, naranja (#e67e22) para highlights.
DIMENSIONES: 800x500px, horizontal.
ESTILO: Limpio, minimalista, tipo Apple product comparison.
```

**Ruta destino:** `assets/img/bundle/comparacion.webp`

---

### ASSET 16: Before/After — Mouth Tape

**Subir referencias:**
- `assets/img/mt-01/lifestyle-m.png` (referencia "después")

**Prompt:**
```
Generá una imagen split before/after para el Mouth Tape VENTUS.

LAYOUT: Split 50/50 horizontal.

LADO IZQUIERDO — "ANTES":
- Hombre latino (~30 años) durmiendo con boca abierta
- Expresión de incomodidad/tensión facial
- Iluminación fría, ligeramente azulada
- Overlay semitransparente con texto "ANTES" en blanco
- Tono: descanso incompleto

LADO DERECHO — "DESPUÉS":
- El MISMO hombre durmiendo con cinta negra VENTUS en los labios
- Expresión completamente relajada, paz
- Iluminación cálida, dorada
- Overlay semitransparente con texto "DESPUÉS" en blanco
- Tono: sueño profundo, alivio

DIVISOR: Línea vertical blanca de 2px en el centro.
DIMENSIONES: 800x400px, horizontal.
MOOD: La diferencia es obvia sin decir una palabra.
```

**Ruta destino:** `assets/img/mt-01/before-after.webp`

---

## Prompts de corrección (usar cuando el resultado necesita ajustes)

### Si el producto no se ve exacto:
```
La cinta/tira en la imagen no se ve como el producto real. Mirá la foto
de referencia que te subí — la cinta debe ser:
- Color: Negro mate, no brillante
- Forma: [Ovalada para MT-01 / Curva para NT-01/NT-02]
- Tamaño: Proporcional al que se ve en la referencia
- Textura: Lisa, adhesiva, no tela

Por favor regenerá manteniendo todo lo demás igual pero corrigiendo
el producto.
```

### Si la persona no se ve latina/natural:
```
La persona se ve demasiado como modelo de stock/caucásica. Necesito:
- Rasgos latinos naturales (piel morena clara a media)
- No "perfecta" — piel con textura real, cejas naturales
- Edad visible (~28-35 años)
- Aspecto guatemalteco/centroamericano

Regenerá manteniendo la composición pero cambiando la persona.
```

### Si la iluminación/mood está mal:
```
La iluminación no es correcta para esta toma.
[Para sueño]: Necesito luz cálida, dorada, de lámpara de noche. NO
luz de día ni fluorescente.
[Para deporte]: Necesito luz natural o de gym. NO studio limpio.
[Para producto]: Necesito softbox lateral, fondo limpio. NO luces
de colores ni sombras duras.

Regenerá con la iluminación correcta.
```

### Si querés variaciones (para A/B testing en ads):
```
Perfecto, esta imagen me sirve como base. Ahora generá 3 variaciones:
1. Misma escena pero con una MUJER en vez de hombre (misma edad, latina)
2. Misma escena pero ángulo diferente (más cerrado / más abierto)
3. Misma escena pero contexto diferente (outdoor vs indoor / otro gym)

Mantené el producto idéntico en todas las variaciones.
```

---

## Workflow batch (para generar todo en una sesión)

### Orden recomendado (por eficiencia):

**Sesión 1 — Mouth Tape MT-01 (4 imágenes):**
1. Subir: `frente.png`, `lifestyle-f.png`, `lifestyle-m.png`
2. Pegar System Context
3. Generar: Paso 1 → Paso 2 → Paso 3 → Before/After
4. Pedir variaciones si necesitás opciones

**Sesión 2 — Nose Tape NT-01 (5 imágenes):**
1. Subir: `frente.png`, `nose-tape.webp`, `nose-tape-2.webp`
2. Pegar System Context (si es sesión nueva)
3. Generar: Paso 1 → Paso 2 → Paso 3 → Lifestyle Sport → Lifestyle Sleep

**Sesión 3 — Nose Tape Premium NT-02 (4 imágenes):**
1. Subir: `frente.png`, `lado.png`, `nose-tape.webp` (de NT-01, la tira es similar)
2. Generar: Paso 1 → Paso 2 → Paso 3 → Lifestyle Gym → Close-up Premium

**Sesión 4 — Extras (3 imágenes):**
1. Generar: Testimonial → Bundle Infografía → [Bonus ad creatives]

**Tiempo estimado: ~45-60 min total para 16+ imágenes**
(vs. 1 hora sesión fotográfica + post-producción)

---

## Post-producción (después de Gemini)

### Conversión a WebP (usar en terminal):

```bash
# Instalar cwebp si no lo tenés
# npm install -g cwebp-bin

# Convertir PNG/JPG a WebP (calidad 85%)
cwebp -q 85 imagen.png -o imagen.webp

# Batch convert (todas las imágenes nuevas)
for f in assets/img/*/paso-*.png; do cwebp -q 85 "$f" -o "${f%.png}.webp"; done
```

### Resize si es necesario:

```bash
# Con ImageMagick
magick imagen.png -resize 600x400 -quality 85 imagen.webp

# Para Instagram square (1080x1080)
magick imagen.png -resize 1080x1080 -quality 85 imagen-ig.webp
```

---

## Checklist de assets

| # | Asset | Producto | Sesión | Estado |
|---|-------|----------|--------|--------|
| 1 | Paso 1 — secando labios | MT-01 | 1 | ⬜ |
| 2 | Paso 2 — aplicando cinta | MT-01 | 1 | ⬜ |
| 3 | Paso 3 — durmiendo | MT-01 | 1 | ⬜ |
| 4 | Paso 1 — limpiando nariz | NT-01 | 2 | ⬜ |
| 5 | Paso 2 — aplicando tira | NT-01 | 2 | ⬜ |
| 6 | Paso 3 — corriendo | NT-01 | 2 | ⬜ |
| 7 | Paso 1 — limpiando nariz | NT-02 | 3 | ⬜ |
| 8 | Paso 2 — aplicando tira | NT-02 | 3 | ⬜ |
| 9 | Paso 3 — gym intenso | NT-02 | 3 | ⬜ |
| 10 | Lifestyle sport | NT-01 | 2 | ⬜ |
| 11 | Lifestyle sleep | NT-01 | 2 | ⬜ |
| 12 | Lifestyle gym | NT-02 | 3 | ⬜ |
| 13 | Close-up premium | NT-02 | 3 | ⬜ |
| 14 | Testimonial fundador | — | 4 | ⬜ |
| 15 | Comparación bundle | Bundle | 4 | ⬜ |
| 16 | Before/After | MT-01 | 1 | ⬜ |
