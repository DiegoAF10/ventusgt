/**
 * VENTUS Article Publisher
 * Runs daily via GitHub Actions. Checks schedule.json for articles
 * due today, moves them from _scheduled/ to ciencia/, updates
 * index.html and sitemap.xml automatically.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CIENCIA = path.join(ROOT, 'ciencia');
const SCHEDULED = path.join(CIENCIA, '_scheduled');
const SCHEDULE_FILE = path.join(CIENCIA, 'schedule.json');
const INDEX_FILE = path.join(CIENCIA, 'index.html');
const SITEMAP_FILE = path.join(ROOT, 'sitemap.xml');

const MONTHS_ES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function today() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function formatDateES(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${parseInt(d)} de ${MONTHS_ES[parseInt(m) - 1]}, ${y}`;
}

function buildArticleCard(article) {
  return `        <a href="${article.slug}.html" class="group block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
          <div class="aspect-[16/10] bg-[#f4ede5] overflow-hidden">
            <img src="../assets/img/ciencia/${article.image || article.slug}.webp" alt="${article.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy">
          </div>
          <div class="p-5">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-xs font-semibold tracking-wider uppercase text-blue-600">${article.category}</span>
              <span class="text-xs text-gray-400">&middot;</span>
              <span class="text-xs text-gray-400">${article.read_time} min lectura</span>
            </div>
            <h2 class="font-bold text-lg mb-2 group-hover:text-blue-700 transition-colors">${article.title}</h2>
            <p class="text-sm text-gray-500 leading-relaxed line-clamp-3">${article.description}</p>
            <div class="mt-4 flex items-center gap-2 text-xs text-gray-400">
              <time datetime="${article.publish_date}">${formatDateES(article.publish_date)}</time>
              <span>&middot;</span>
              <span>VENTUS</span>
            </div>
          </div>
        </a>`;
}

function buildSitemapEntry(slug, date) {
  return `  <url>\n    <loc>https://tiendaventus.com/ciencia/${slug}.html</loc>\n    <lastmod>${date}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>`;
}

function run() {
  const todayStr = today();
  console.log(`[publish] ${todayStr} — Checking schedule...`);

  // Read schedule
  const schedule = JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
  const due = schedule.articles.filter(a => !a.published && a.publish_date <= todayStr);

  if (due.length === 0) {
    console.log('[publish] No articles due today.');
    process.exit(0);
  }

  console.log(`[publish] ${due.length} article(s) to publish:`);
  let indexHtml = fs.readFileSync(INDEX_FILE, 'utf8');
  let sitemap = fs.readFileSync(SITEMAP_FILE, 'utf8');
  let published = 0;

  for (const article of due) {
    const src = path.join(SCHEDULED, `${article.slug}.html`);
    const dest = path.join(CIENCIA, `${article.slug}.html`);

    // Check if HTML file exists in _scheduled/
    if (!fs.existsSync(src)) {
      console.log(`[publish] SKIP: ${article.slug}.html not found in _scheduled/`);
      continue;
    }

    // 1. Move HTML to live
    fs.renameSync(src, dest);
    console.log(`[publish] Moved: _scheduled/${article.slug}.html → ciencia/${article.slug}.html`);

    // 2. Add article card to index.html (before END marker)
    const card = buildArticleCard(article);
    indexHtml = indexHtml.replace(
      '        <!-- PUBLISHED_ARTICLES_END -->',
      card + '\n        <!-- PUBLISHED_ARTICLES_END -->'
    );

    // 3. Remove empty state if present
    const emptyStateRegex = /\s*<!-- EMPTY_STATE_START -->[\s\S]*?<!-- EMPTY_STATE_END -->/;
    indexHtml = indexHtml.replace(emptyStateRegex, '');

    // 4. Add to sitemap
    const sitemapEntry = buildSitemapEntry(article.slug, article.publish_date);
    sitemap = sitemap.replace('</urlset>', sitemapEntry + '\n</urlset>');

    // 5. Mark as published
    article.published = true;
    article.published_at = todayStr;
    published++;
  }

  if (published > 0) {
    fs.writeFileSync(INDEX_FILE, indexHtml, 'utf8');
    fs.writeFileSync(SITEMAP_FILE, sitemap, 'utf8');
    fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedule, null, 2) + '\n', 'utf8');
    console.log(`[publish] Done. ${published} article(s) published.`);
  }
}

run();
