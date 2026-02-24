#!/usr/bin/env node
/**
 * VENTUS — Automated Asset Generator using Gemini API
 *
 * Generates all product images from ASSET-BRIEF.md using Gemini's
 * native image generation with reference product photos.
 *
 * Usage:
 *   node generate-assets.js              # Generate all assets
 *   node generate-assets.js --asset 1    # Generate specific asset by number
 *   node generate-assets.js --session 1  # Generate all assets from session 1
 *   node generate-assets.js --list       # List all assets and their status
 *   node generate-assets.js --dry-run    # Show prompts without generating
 *
 * Setup:
 *   1. Get API key: https://aistudio.google.com/apikey
 *   2. Set env: export GEMINI_API_KEY=your_key_here
 *      Or add to ventus-system/.env: GEMINI_API_KEY=your_key_here
 *   3. npm install @google/genai (run once)
 */

import { GoogleGenAI } from "@google/genai";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Config ──────────────────────────────────────────────────────────

const MODEL = process.env.GEMINI_MODEL || "gemini-3-pro-image-preview";
const DELAY_MS = 3000; // Delay between requests to avoid rate limiting
const IMG_DIR = path.join(__dirname, "img");

// Load API key from env or .env file
function loadApiKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;

  // Try loading from ventus-system/.env
  const envPath = path.resolve(__dirname, "../../.env");
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, "utf-8");
    const match = envContent.match(/^GEMINI_API_KEY=(.+)$/m);
    if (match) return match[1].trim();
  }

  console.error("❌ GEMINI_API_KEY not found.");
  console.error("   Set it via: export GEMINI_API_KEY=your_key");
  console.error("   Or add to ventus-system/.env: GEMINI_API_KEY=your_key");
  console.error("   Get one free at: https://aistudio.google.com/apikey");
  process.exit(1);
}

// ── System Context ──────────────────────────────────────────────────

const SYSTEM_CONTEXT = `Sos el fotógrafo de producto de VENTUS, una marca guatemalteca de cintas de respiración nasal. Vas a generar fotos de producto y lifestyle siguiendo estas directrices EXACTAS:

ESTILO VISUAL:
- Mood: Limpio, luminoso, con aire. Sensación de calma y bienestar.
- Fondos: Blancos o neutros claros para producto. Ambientes reales para lifestyle.
- Iluminación: Natural o softbox. NUNCA flash directo ni sombras duras.
- Paleta: Tonos fríos (azules, blancos, grises claros). Cálidos SOLO en contexto de sueño (dorados suaves).
- Personas: Aspecto latino/guatemalteco natural. Expresiones relajadas, no forzadas. Edad 25-40. Fit pero no bodybuilder.
- Producto: Siempre nítido, bien iluminado. El producto es el protagonista.
- Composición: Espacio negativo generoso. No abarrotar el frame.

REFERENCIAS DE MARCA:
- Se siente como: Nike editorial + Patagonia honestidad + Aesop minimalismo
- NO se siente como: GNC suplementos, Herbalife MLM, clínica fría, fitness bro

PRODUCTOS VENTUS:
- MT-01 (Mouth Tape): Cinta adhesiva negra ovalada que se pega sobre los labios cerrados. Empaque: pouch stand-up azul navy oscuro con logo VENTUS blanco.
- NT-01 (Nose Tape): Tira adhesiva negra curva que se pega sobre el puente nasal. Empaque: pouch stand-up azul navy oscuro con logo VENTUS blanco.
- NT-02 (Nose Tape Premium): Dilatador nasal RÍGIDO, MOLDEADO, 3D. Forma de mariposa/corbatín: puente central grueso negro texturizado + alas adhesivas TRANSPARENTES a los lados que se pegan a la piel. Viene en 4 tallas (S/M/L/XL). Superficie rugosa con textura visible. NO es una tira plana — es una pieza moldeada que se asienta sobre el puente nasal y abre las fosas mecánicamente. Empaque: caja blanca rectangular "Starter Kit".

REGLAS:
1. El producto en la imagen debe verse IDÉNTICO a las fotos de referencia adjuntas. No cambies colores, forma, texto del empaque, ni proporciones.
2. Las personas deben verse naturales — no modelos de stock perfectos.
3. Calidad fotográfica profesional pero no artificial.
4. Formato de salida: la resolución más alta posible.`;

// ── Asset Definitions ───────────────────────────────────────────────

const ASSETS = [
  // ── Session 1: MT-01 Mouth Tape ──
  {
    id: 1,
    session: 1,
    name: "MT-01 Paso 1 — Secando labios",
    output: "mt-01/paso-1.png",
    refs: ["mt-01/frente.png", "mt-01/lifestyle-m.png"],
    aspectRatio: "3:2",
    prompt: `Generá una foto de producto para el paso 1 de las instrucciones de uso del Mouth Tape VENTUS.

LA ESCENA: Close-up de una mujer latina (~30 años) secándose los labios con una toalla blanca pequeña. Está en un baño limpio y moderno. El empaque del producto (el pouch azul navy que ves en la referencia) está visible en el fondo, ligeramente desenfocado, sobre el mueble del baño.

COMPOSICIÓN: Retrato desde el pecho hacia arriba, ligeramente ladeado. Foco en los labios y la toalla. Iluminación softbox lateral, cálida. Fondo: baño con tonos blancos/cream.

DIMENSIONES: Horizontal, ratio 3:2.
MOOD: Preparación tranquila antes de dormir.`
  },
  {
    id: 2,
    session: 1,
    name: "MT-01 Paso 2 — Aplicando cinta",
    output: "mt-01/paso-2.png",
    refs: ["mt-01/lifestyle-f.png", "mt-01/frente.png"],
    aspectRatio: "3:2",
    prompt: `Generá una foto de producto para el paso 2 de las instrucciones de uso del Mouth Tape VENTUS.

LA ESCENA: Mujer latina (~30 años) aplicándose la cinta negra ovalada sobre los labios cerrados. Sus dedos (índice y pulgar de ambas manos) están presionando los bordes de la cinta contra la piel. La cinta es EXACTAMENTE como la que ves en la foto de referencia: negra, ovalada, mate, cubriendo los labios completamente.

COMPOSICIÓN: Close-up más cerrado. Foco en la boca, los dedos, y la cinta. Se ven los ojos parcialmente. Iluminación softbox lateral cálida.

DIMENSIONES: Horizontal, ratio 3:2.
MOOD: Acción simple y natural — como ponerse una bandita.`
  },
  {
    id: 3,
    session: 1,
    name: "MT-01 Paso 3 — Durmiendo",
    output: "mt-01/paso-3.png",
    refs: ["mt-01/lifestyle-f.png"],
    aspectRatio: "3:2",
    prompt: `Generá una foto de producto para el paso 3 de las instrucciones de uso del Mouth Tape VENTUS.

LA ESCENA: Mujer latina (~30 años) acostada en la cama, ojos cerrados, expresión completamente relajada, con la cinta negra ovalada puesta sobre los labios. Sábanas blancas, almohada suave. La cinta se ve EXACTAMENTE como en la foto de referencia: negra, ovalada, mate, bien pegada.

COMPOSICIÓN: Vista ligeramente elevada (como si la cámara estuviera sobre la cama). Cabeza sobre almohada, pelo suelto. Iluminación cálida y suave (lámpara de noche, tono dorado).

DIMENSIONES: Horizontal, ratio 3:2.
MOOD: Descanso profundo. Calma total.`
  },
  {
    id: 16,
    session: 1,
    name: "MT-01 Before/After",
    output: "mt-01/before-after.png",
    refs: ["mt-01/lifestyle-m.png"],
    aspectRatio: "16:9",
    prompt: `Generá una imagen split before/after para el Mouth Tape VENTUS.

LAYOUT: Split 50/50 horizontal.

LADO IZQUIERDO — "ANTES":
- Hombre latino (~30 años) durmiendo con boca abierta
- Expresión de incomodidad/tensión facial
- Iluminación fría, ligeramente azulada
- Texto "ANTES" superpuesto en blanco semitransparente
- Tono: descanso incompleto

LADO DERECHO — "DESPUÉS":
- El MISMO hombre durmiendo con cinta negra VENTUS en los labios (igual a la referencia)
- Expresión completamente relajada, paz
- Iluminación cálida, dorada
- Texto "DESPUÉS" superpuesto en blanco semitransparente
- Tono: sueño profundo, alivio

DIVISOR: Línea vertical blanca de 2px en el centro.
DIMENSIONES: Horizontal, ratio 2:1.`
  },

  // ── Session 2: NT-01 Nose Tape ──
  {
    id: 4,
    session: 2,
    name: "NT-01 Paso 1 — Limpiando nariz",
    output: "nt-01/paso-1.png",
    refs: ["nt-01/frente.png", "nt-01/nose-tape.webp"],
    aspectRatio: "3:2",
    prompt: `Generá una foto de producto para el paso 1 de las instrucciones de uso del Nose Tape VENTUS.

LA ESCENA: Hombre latino atlético (~28 años, pelo corto, barba de 2 días) limpiándose el puente nasal con una toallita. Está en un vestidor de gym o baño deportivo. El empaque azul navy del producto está sobre el banco/mueble.

COMPOSICIÓN: Retrato desde el pecho hacia arriba. Foco en la nariz y la mano limpiando. Iluminación natural lateral.

DIMENSIONES: Horizontal, ratio 3:2.
MOOD: Pre-entrenamiento, preparación.`
  },
  {
    id: 5,
    session: 2,
    name: "NT-01 Paso 2 — Aplicando tira",
    output: "nt-01/paso-2.png",
    refs: ["nt-01/nose-tape.webp"],
    aspectRatio: "3:2",
    prompt: `Generá una foto de producto para el paso 2 de las instrucciones de uso del Nose Tape VENTUS.

LA ESCENA: Hombre latino atlético aplicándose la tira nasal negra sobre el puente de la nariz. Sus dedos están presionando la tira para pegarla bien. La tira es EXACTAMENTE como la referencia: negra, curva, cruzando el puente nasal de lado a lado.

COMPOSICIÓN: Close-up de la cara, desde la frente hasta el labio superior. Los dedos son visibles aplicando presión. Ligeramente de 3/4 para mostrar la curvatura de la tira.

DIMENSIONES: Horizontal, ratio 3:2.
MOOD: Concentración simple, como amarrarse los zapatos antes de correr.`
  },
  {
    id: 6,
    session: 2,
    name: "NT-01 Paso 3 — Corriendo",
    output: "nt-01/paso-3.png",
    refs: ["nt-01/nose-tape.webp"],
    aspectRatio: "3:2",
    prompt: `Generá una foto de producto para el paso 3 de las instrucciones de uso del Nose Tape VENTUS.

LA ESCENA: Hombre latino atlético corriendo al aire libre con la tira nasal negra VENTUS visible sobre el puente nasal. Calle arbolada o parque, luz natural de mañana. Camiseta sin mangas. Sudor leve. Expresión de esfuerzo controlado — no sufrimiento.

COMPOSICIÓN: De pecho hacia arriba, ligeramente de 3/4, en movimiento. Fondo bokeh (árboles desenfocados). La tira nasal debe ser claramente visible.

DIMENSIONES: Horizontal, ratio 3:2.
MOOD: Energía, rendimiento, aire libre. "Sentí la diferencia."`
  },
  {
    id: 10,
    session: 2,
    name: "NT-01 Lifestyle — Deporte",
    output: "nt-01/lifestyle-sport.png",
    refs: ["nt-01/nose-tape.webp"],
    aspectRatio: "4:3",
    prompt: `Generá una foto lifestyle para el Nose Tape VENTUS NT-01.

LA ESCENA: Hombre latino atlético (~30 años) en un box de CrossFit, haciendo double unders o box jumps, con la tira nasal negra VENTUS claramente visible. Sudor en la frente. Ropa deportiva (shorts, camiseta ajustada). Luz natural entrando por portón abierto del box.

COMPOSICIÓN: Cuerpo completo o 3/4, capturando el movimiento. La tira nasal debe ser visible aunque no sea el foco principal. Fondo: box de CrossFit (barras, platos, cuerdas).

DIMENSIONES: Horizontal, ratio 4:3 (web hero).
MOOD: CrossFit, comunidad, rendimiento. Energía sin agresividad.`
  },
  {
    id: 11,
    session: 2,
    name: "NT-01 Lifestyle — Sueño",
    output: "nt-01/lifestyle-sleep.png",
    refs: ["nt-01/nose-tape.webp", "mt-01/lifestyle-m.png"],
    aspectRatio: "4:3",
    prompt: `Generá una foto lifestyle nocturna para el Nose Tape VENTUS NT-01.

LA ESCENA: Hombre latino (~30 años) durmiendo de lado en la cama, con la tira nasal negra VENTUS visible sobre el puente nasal. Sábanas blancas, almohada suave. Luz cálida suave (lámpara de noche, tono dorado/ámbar). Expresión completamente relajada.

COMPOSICIÓN: Vista a la altura de la cama, horizontal. Cabeza sobre almohada, cuerpo parcialmente cubierto por sábanas.

DIMENSIONES: Horizontal, ratio 4:3.
MOOD: Sueño profundo, respiración libre, calma total.`
  },

  // ── Session 3: NT-02 Nose Tape Premium ──
  {
    id: 7,
    session: 3,
    name: "NT-02 Paso 1 — Limpiando nariz",
    output: "nt-02/paso-1.png",
    refs: ["nt-02/ref-closeup.webp"],
    aspectRatio: "3:2",
    prompt: `Photo of a latina woman (~27, ponytail, gym clothes) wiping her nose bridge with a small towel in a modern gym. She is preparing to put on the nasal dilator device shown in the reference photo. The device is NOT on her nose yet — she is cleaning the area first. Gym background softly blurred. Natural gym lighting. Shot from chest up.`
  },
  {
    id: 8,
    session: 3,
    name: "NT-02 Paso 2 — Aplicando dilatador",
    output: "nt-02/paso-2.png",
    refs: ["nt-02/ref-closeup.webp", "nt-02/ref-sizing.webp"],
    aspectRatio: "3:2",
    prompt: `Close-up photo of a latina woman placing the EXACT nasal dilator device from the reference photos onto her nose bridge. Her fingers are pressing it into place. The device looks EXACTLY like in the reference — same size, shape, color, proportions. Do NOT change or reinterpret the device design. Gym background blurred. Close-up from forehead to chin.`
  },
  {
    id: 9,
    session: 3,
    name: "NT-02 Paso 3 — Gym intenso",
    output: "nt-02/paso-3.png",
    refs: ["nt-02/ref-lifestyle.webp", "nt-02/ref-closeup.webp"],
    aspectRatio: "3:2",
    prompt: `Photo of a latina woman doing an intense kettlebell workout in a gym, wearing the EXACT same nasal dilator device shown in the reference photos on her nose bridge. The device must look IDENTICAL to the reference — do NOT change its size, shape, or design. Sweaty skin. Focused expression. Gym lighting. Waist up, action shot. The device is small and sits only on the nose bridge — it does NOT extend to the cheeks.`
  },
  {
    id: 12,
    session: 3,
    name: "NT-02 Lifestyle — Gym",
    output: "nt-02/lifestyle-gym.png",
    refs: ["nt-02/ref-closeup.webp", "nt-02/ref-lifestyle.webp"],
    aspectRatio: "4:3",
    prompt: `Photo of a muscular latino man (CrossFit build, not bodybuilder) doing a heavy deadlift in a serious gym, wearing the EXACT same nasal dilator device from the reference photos on his nose bridge. The device must be IDENTICAL to the reference — same small size, sitting only on the nose bridge. Heavy sweat. Low angle shot. Bumper plates, chalk, serious gym. Cool gym lighting with contrast.`
  },
  {
    id: 13,
    session: 3,
    name: "NT-02 Close-up Premium",
    output: "nt-02/lifestyle-closeup.png",
    refs: ["nt-02/ref-closeup.webp", "nt-02/ref-sizing.webp"],
    aspectRatio: "4:3",
    prompt: `Generá un close-up premium del dilatador nasal VENTUS NT-02 puesto en la nariz.

PRODUCTO: El NT-02 es un DILATADOR NASAL RÍGIDO, MOLDEADO, 3D (ver referencias adjuntas). Tiene un puente central grueso negro con TEXTURA RUGOSA visible y alas adhesivas TRANSPARENTES a los lados. Se ve como un dispositivo de ingeniería médica — prominente, estructurado, no plano. Puede tener gotas de sudor sobre la superficie texturizada negra.

LA ESCENA: Close-up extremo del puente nasal de una persona con el dilatador NT-02 perfectamente colocado. Se ve claramente: el puente central negro texturizado sobre la nariz, las alas transparentes pegadas a la piel a los lados. La piel tiene textura real (poros, leve brillo de sudor). Gotas de sudor sobre la superficie negra del dispositivo.

COMPOSICIÓN: Macro/close-up. Solo se ve desde las cejas hasta el labio superior. El dilatador ocupa el centro del frame. Iluminación studio softbox, detalle nítido.

DIMENSIONES: Horizontal, ratio 4:3.
MOOD: Calidad premium, ingeniería, "diseñado para rendir."`
  },

  // ── Session 4: Extras ──
  {
    id: 14,
    session: 4,
    name: "Testimonial — Fundador",
    output: "testimonials/cliente-1.png",
    refs: ["mt-01/lifestyle-m.png"],
    aspectRatio: "1:1",
    prompt: `Generá una foto que parezca una selfie REAL tomada con celular. Debe ser IMPOSIBLE distinguirla de una foto real. Nada de look AI — nada de piel perfecta, nada de iluminación perfecta, nada de composición perfecta.

LA PERSONA: Hombre guatemalteco de ~28 años, piel morena clara, cabello negro corto ligeramente despeinado (acaba de despertar), barba de 2 días, cejas naturales gruesas. Tiene una cinta adhesiva negra ovalada sobre los labios cerrados (mouth tape — ver referencia adjunta). Camiseta blanca arrugada de dormir.

IMPERFECCIONES REALES (esto es lo que hace que parezca real):
- Almohada arrugada, sábanas movidas (no perfectamente lisas)
- Leve marca de almohada en la mejilla
- Ojos ligeramente hinchados (recién despertó)
- Pelo despeinado de un solo lado
- Iluminación despareja — luz natural de ventana que entra por un lado, sombras suaves del otro
- Ligero ruido/grano de cámara de celular
- No perfectamente centrado — como si se la tomó rápido al despertar
- Expresión de "sonrisa con los ojos" (squinting ligeramente) porque tiene la boca tapada

COMPOSICIÓN: Selfie desde arriba (brazo extendido), ligeramente ladeada. Se ve rostro + hombros + parte de la almohada. Como una Instagram story casual.

DIMENSIONES: Cuadrado, ratio 1:1.
ESTILO FOTOGRÁFICO: iPhone 14/15. No studio. No ring light. Ventana natural.
MOOD: "Loco, dormí toda la noche sin roncar." Auténtico al 100%.`
  },
  {
    id: 15,
    session: 4,
    name: "Comparación Bundle (Infografía)",
    output: "bundle/comparacion.png",
    refs: ["bundle/bundle.png"],
    aspectRatio: "16:9",
    prompt: `Generá una infografía de comparación de precio para el Bundle VENTUS.

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
- Incluye imagen del bundle (usar la referencia adjunta)
- Mouth Tape + Nose Tape
- Precio: Q169
- Badge: "ENVÍO GRATIS"
- Badge destacado: "Ahorrás Q66"
Color de fondo: blanco con borde naranja

TIPOGRAFÍA: Bold sans-serif para precios, regular para descripciones.
COLORES: Azul navy (#0b3e5d) para texto, naranja (#e67e22) para highlights.
DIMENSIONES: Horizontal, ratio 16:9.
ESTILO: Limpio, minimalista, tipo Apple product comparison.`
  },
];

// ── Helpers ─────────────────────────────────────────────────────────

function readImageAsBase64(relativePath) {
  const fullPath = path.join(IMG_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠️  Reference not found: ${relativePath}`);
    return null;
  }
  const buffer = fs.readFileSync(fullPath);
  return buffer.toString("base64");
}

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimes = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
  return mimes[ext] || "image/png";
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function assetExists(asset) {
  return fs.existsSync(path.join(IMG_DIR, asset.output));
}

// ── Core Generation ─────────────────────────────────────────────────

async function generateAsset(ai, asset, force = false) {
  console.log(`\n🎨 [${asset.id}/${ASSETS.length}] ${asset.name}`);

  const outputPath = path.join(IMG_DIR, asset.output);

  if (!force && assetExists(asset)) {
    console.log(`  ✅ Already exists: ${asset.output} (use --force to regenerate)`);
    return { success: true, skipped: true };
  }

  // Build content parts: system context + reference images + prompt
  const parts = [];

  // Add system context as text
  parts.push({ text: SYSTEM_CONTEXT });

  // Add reference images
  for (const ref of asset.refs) {
    const base64 = readImageAsBase64(ref);
    if (base64) {
      parts.push({
        inlineData: {
          mimeType: getMimeType(ref),
          data: base64,
        },
      });
      console.log(`  📎 Reference: ${ref}`);
    }
  }

  // Add the specific prompt
  parts.push({ text: asset.prompt });

  try {
    console.log(`  🔄 Generating with ${MODEL}...`);

    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ role: "user", parts }],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: {
          aspectRatio: asset.aspectRatio || "3:2",
        },
      },
    });

    // Extract image from response
    let imageFound = false;
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log(`  💬 ${part.text.substring(0, 100)}...`);
      } else if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, "base64");
        ensureDir(outputPath);
        fs.writeFileSync(outputPath, buffer);
        const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
        console.log(`  ✅ Saved: ${asset.output} (${sizeMB} MB)`);
        imageFound = true;
      }
    }

    if (!imageFound) {
      console.error(`  ❌ No image in response. Model may have refused or errored.`);
      return { success: false, error: "No image in response" };
    }

    return { success: true, skipped: false };
  } catch (err) {
    console.error(`  ❌ Error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

// ── Main ────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  // --list: Show all assets and their status
  if (args.includes("--list")) {
    console.log("\n📋 VENTUS Asset Status:\n");
    console.log("  #  | Session | Status | Name");
    console.log("  ---|---------|--------|" + "-".repeat(40));
    for (const a of ASSETS) {
      const exists = assetExists(a) ? "✅ done" : "⬜ pending";
      console.log(`  ${String(a.id).padStart(2)} |    ${a.session}    | ${exists} | ${a.name}`);
    }
    const done = ASSETS.filter(a => assetExists(a)).length;
    console.log(`\n  Progress: ${done}/${ASSETS.length} assets generated.\n`);
    return;
  }

  // --dry-run: Show prompts without generating
  if (args.includes("--dry-run")) {
    const targets = getTargetAssets(args);
    console.log(`\n🔍 Dry run — ${targets.length} assets:\n`);
    for (const a of targets) {
      console.log(`━━━ [${a.id}] ${a.name} ━━━`);
      console.log(`Output: ${a.output}`);
      console.log(`Refs: ${a.refs.join(", ")}`);
      console.log(`Ratio: ${a.aspectRatio}`);
      console.log(`Prompt:\n${a.prompt}\n`);
    }
    return;
  }

  // Initialize Gemini
  const apiKey = loadApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const force = args.includes("--force");
  const targets = getTargetAssets(args);

  console.log(`\n🚀 VENTUS Asset Generator`);
  console.log(`   Model: ${MODEL}`);
  console.log(`   Assets: ${targets.length} to generate`);
  console.log(`   Force: ${force ? "yes (regenerating existing)" : "no (skipping existing)"}\n`);

  const results = { success: 0, skipped: 0, failed: 0 };

  for (let i = 0; i < targets.length; i++) {
    const asset = targets[i];

    // Skip existing unless --force
    if (!force && assetExists(asset)) {
      console.log(`⏭️  [${asset.id}] ${asset.name} — already exists`);
      results.skipped++;
      continue;
    }

    const result = await generateAsset(ai, asset, force);

    if (result.success && result.skipped) results.skipped++;
    else if (result.success) results.success++;
    else results.failed++;

    // Rate limit delay (skip on last item)
    if (i < targets.length - 1) {
      console.log(`  ⏳ Waiting ${DELAY_MS / 1000}s...`);
      await sleep(DELAY_MS);
    }
  }

  // Summary
  console.log(`\n${"━".repeat(50)}`);
  console.log(`📊 Results: ✅ ${results.success} generated | ⏭️ ${results.skipped} skipped | ❌ ${results.failed} failed`);

  if (results.success > 0) {
    console.log(`\n💡 Next: Convert to WebP for production:`);
    console.log(`   node generate-assets.js --list   (check status)`);
    console.log(`   Then convert PNGs to WebP at 85% quality for the website.`);
  }

  console.log();
}

function getTargetAssets(args) {
  // --asset N: specific asset
  const assetIdx = args.indexOf("--asset");
  if (assetIdx !== -1 && args[assetIdx + 1]) {
    const id = parseInt(args[assetIdx + 1]);
    const found = ASSETS.filter(a => a.id === id);
    if (found.length === 0) {
      console.error(`❌ Asset #${id} not found. Use --list to see all assets.`);
      process.exit(1);
    }
    return found;
  }

  // --session N: all assets from session
  const sessionIdx = args.indexOf("--session");
  if (sessionIdx !== -1 && args[sessionIdx + 1]) {
    const session = parseInt(args[sessionIdx + 1]);
    const found = ASSETS.filter(a => a.session === session);
    if (found.length === 0) {
      console.error(`❌ Session ${session} not found. Sessions: 1-4.`);
      process.exit(1);
    }
    return found;
  }

  // Default: all assets
  return ASSETS;
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
