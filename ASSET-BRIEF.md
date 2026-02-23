# VENTUS — Asset Creation Brief (CRO Phase 6)

> **Fecha:** 2026-02-23
> **Contexto:** Las páginas de producto ya tienen la estructura CRO completa
> (testimonios, antes/después, objeciones, FAQ, CTAs). Este brief detalla
> los assets visuales que Diego debe crear para maximizar la conversión.
>
> **Prioridad:** P1 = impacto directo en conversión, crear primero.
> P2 = mejora incremental, puede esperar.

---

## Assets existentes (ya tenemos)

| Producto | Assets disponibles |
|----------|-------------------|
| MT-01 | `frente.png/webp`, `atras.png`, `lifestyle-m.png/webp`, `lifestyle-f.png/webp` |
| NT-01 | `frente.png/webp`, `nose-tape.webp`, `nose-tape-2.webp` |
| NT-02 | `frente.png/webp`, `atras.png/webp`, `lado.png/webp` |
| Bundle | `bundle.png/webp` |
| Brand | `logo-full.png`, `logo-avatar.png`, `isotipo.png`, `wordmark.png`, `element-curve.png` |
| Ciencia | `efecto-bohr.webp`, `efecto-bohr-curva.webp`, `efecto-bohr-nose-tape.webp` |

---

## P1 — Assets de alto impacto (crear primero)

### 1. Fotos "Cómo se usa" — Secuencia de 3 pasos

**Necesidad:** Cada producto tiene una sección "Cómo se usa" con 3 pasos
descriptivos. Una foto por paso elimina la fricción de "no sé cómo se pone".

**Productos que lo necesitan:**
- MT-01 (Mouth Tape): ya tiene la sección, falta visual
- NT-01 (Nose Tape): ya tiene la sección, falta visual
- NT-02 (Nose Tape Premium): ya tiene la sección, falta visual

**Especificaciones por producto:**

#### MT-01 (Mouth Tape)
| Paso | Descripción | Foto necesaria |
|------|-------------|----------------|
| 1 | "Secá bien tus labios" | Close-up de persona secándose los labios con toalla |
| 2 | "Colocá la cinta sobre tus labios" | Persona aplicando la cinta, dedos visibles, acción clara |
| 3 | "Dormí tranquilo/a" | Persona acostada con la cinta puesta, expresión relajada |

#### NT-01 / NT-02 (Nose Tape)
| Paso | Descripción | Foto necesaria |
|------|-------------|----------------|
| 1 | "Limpiá y secá tu nariz" | Close-up limpiando puente nasal |
| 2 | "Colocá la tira sobre el puente nasal" | Persona aplicando la tira, dedos visibles |
| 3 | "Sentí la diferencia / Entrená al máximo" | Persona entrenando con la tira puesta (NT-01: running/CrossFit, NT-02: gym intenso) |

**Formato:** 600x400px mínimo, WebP, fondo limpio (blanco, cream, o gym),
iluminación natural o softbox. Persona guatemalteca real.

**Ruta de archivo:**
- `assets/img/mt-01/paso-1.webp`, `paso-2.webp`, `paso-3.webp`
- `assets/img/nt-01/paso-1.webp`, `paso-2.webp`, `paso-3.webp`
- `assets/img/nt-02/paso-1.webp`, `paso-2.webp`, `paso-3.webp`

---

### 2. Lifestyle photos — NT-01 y NT-02

**Necesidad:** MT-01 tiene lifestyle (hombre y mujer), pero NT-01 y NT-02
no tienen. Estas fotos van en el hero de cada producto y en los ads.

| Producto | Foto necesaria | Contexto |
|----------|---------------|----------|
| NT-01 | Persona corriendo o en CrossFit con nose tape visible | Outdoor running o box de CrossFit, luz natural, sudor real |
| NT-01 | Persona durmiendo con nose tape (uso nocturno) | Ambiente nocturno cálido, cama, almohada |
| NT-02 | Persona en gym intenso (pesas, AMRAP) con nose tape premium visible | Gym, luz artificial, energía, sudor |
| NT-02 | Close-up del producto puesto en la nariz (mostrar la diferencia premium) | Fondo neutro, enfoque en la calidad del adhesivo |

**Formato:** 800x600px mínimo para web, 1080x1080px para Instagram.
WebP para web. Iluminación según BRAND.md (natural o softbox).

**Ruta de archivo:**
- `assets/img/nt-01/lifestyle-sport.webp`, `lifestyle-sleep.webp`
- `assets/img/nt-02/lifestyle-gym.webp`, `lifestyle-closeup.webp`

---

### 3. Foto de testimonial real (1 persona mínimo)

**Necesidad:** Los testimonios usan iniciales con avatar de color. Una sola
foto real de un cliente (con permiso) multiplica la credibilidad de toda
la sección.

**Especificaciones:**
- Foto de rostro, sonriente, natural (no estudio)
- Puede ser selfie de buena calidad (luz natural)
- Si es posible, con producto visible (usando la cinta)
- Obtener permiso escrito antes de usar (BRAND.md §8.3)

**Formato:** 200x200px mínimo, circular crop, WebP.

**Ruta:** `assets/img/testimonials/cliente-1.webp`

**Alternativa si no hay clientes disponibles:** Foto del fundador Diego
usando el producto con un caption como "Diego, Fundador — lo usa cada noche".

---

## P2 — Assets de mejora incremental

### 4. Visual de comparación Bundle

**Necesidad:** La sección "Por qué el Bundle" en bundle.html tiene una
comparación de precio por separado vs. bundle. Un visual haría el ahorro
más tangible.

**Concepto:** Infografía simple:
```
┌─────────────────┐    ┌──────────────────┐
│  POR SEPARADO   │    │     BUNDLE       │
│                 │    │                  │
│  MT-01  Q100    │    │  MT-01 + NT-01   │
│  NT-01  Q100    │    │                  │
│  Envío   Q35    │    │     Q169         │
│  ─────────────  │ vs │  Envío GRATIS    │
│  Total  Q235    │    │                  │
│                 │    │  Ahorrás Q66     │
└─────────────────┘    └──────────────────┘
```

**Formato:** 800x500px, WebP. Usar paleta VENTUS (Orange #e67e22 para el
lado bundle, Gray para el lado separado). Montserrat Bold para precios.

**Ruta:** `assets/img/bundle/comparacion.webp`

---

### 5. Screenshots de social proof

**Necesidad:** Screenshots reales de conversaciones WhatsApp con clientes
satisfechos (anonimizados). Van en sección de testimonios como refuerzo.

**Especificaciones:**
- Captura de pantalla de WhatsApp (mensaje del cliente)
- Difuminar nombre y foto del cliente
- Resaltar el texto clave del mensaje
- Contexto: "Me cambió el sueño", "Ya no ronco", "Increíble para el gym"

**Formato:** 400x300px, WebP, bordes redondeados.

**Ruta:** `assets/img/social-proof/whatsapp-1.webp`, `whatsapp-2.webp`

---

### 6. Before/After visual real

**Necesidad:** Las secciones before/after son texto. Una imagen real de
"persona cansada → persona descansada" o "respirando por la boca →
respirando por la nariz" reforzaría el mensaje.

**Concepto:** Split image (dos fotos misma persona):
- Izquierda (ANTES): Persona con boca abierta al dormir, expresión cansada
- Derecha (DESPUÉS): Persona con cinta puesta, expresión relajada

**Formato:** 800x400px (lado a lado), WebP. Labels "ANTES" / "DESPUÉS"
superpuestos. Tono cálido (sueño).

**Ruta:** `assets/img/mt-01/before-after.webp`

---

## Producción recomendada

### Sesión fotográfica mínima viable (1 hora)

Con una sola sesión se pueden cubrir todos los P1:

1. **Modelo:** 1 persona (preferiblemente cliente real)
2. **Locaciones:** Casa (cama, baño) + gym o espacio de ejercicio
3. **Props:** Los 4 productos VENTUS, toalla, almohada, botella de agua
4. **Equipo:** Celular con buena cámara (iPhone/Samsung reciente), luz natural
5. **Tomas necesarias:** ~15 fotos únicas cubren todo el P1

### Orden de tomas sugerido

| # | Toma | Producto | Sección |
|---|------|----------|---------|
| 1 | Close-up secando labios | MT-01 | Cómo se usa paso 1 |
| 2 | Aplicando mouth tape | MT-01 | Cómo se usa paso 2 |
| 3 | Acostado/a con mouth tape | MT-01 | Cómo se usa paso 3 + lifestyle |
| 4 | Close-up limpiando nariz | NT-01 | Cómo se usa paso 1 |
| 5 | Aplicando nose tape | NT-01 | Cómo se usa paso 2 |
| 6 | Corriendo con nose tape | NT-01 | Cómo se usa paso 3 + lifestyle |
| 7 | Aplicando nose tape premium | NT-02 | Cómo se usa paso 2 |
| 8 | En gym con nose tape premium | NT-02 | Cómo se usa paso 3 + lifestyle |
| 9 | Close-up nose tape premium puesto | NT-02 | Lifestyle closeup |
| 10 | Selfie sonriente con producto | Any | Testimonial real |

### Post-producción

- Convertir a WebP (calidad 85%)
- Crop a tamaños especificados
- No filtros excesivos (BRAND.md: luz natural, sin saturación artificial)
- Alt text descriptivo para cada imagen

---

## Implementación en código

Cuando los assets estén listos, hay que:
1. Colocar las imágenes en las rutas indicadas
2. Actualizar los `<img>` placeholders en cada sección "Cómo se usa"
3. Los pasos actualmente son solo texto/íconos — agregar `<img>` tags
4. Agregar `loading="lazy"` y `alt` descriptivo a cada imagen

Las secciones de texto (testimonios, before/after, objeciones) funcionan
sin imágenes y ya están live. Los assets mejoran la conversión pero no son
bloqueantes para el lanzamiento.
