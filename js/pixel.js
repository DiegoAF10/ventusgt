/**
 * VENTUS — Meta Pixel + Event Tracking
 *
 * Single script for all pages. Auto-detects page type and fires events.
 * Add to <head> of every page: <script src="/js/pixel.js"></script>
 *
 * Events fired:
 *   PageView      — All pages (automatic)
 *   ViewContent   — Product pages (/productos/*)
 *   AddToCart      — When buyProduct() is called
 *   InitiateCheckout — Checkout page (/checkout.html)
 *   Purchase      — Thank you page (/gracias.html)
 */

// ═══ CONFIG ═══
const PIXEL_ID = '1674866443482392';

// ═══ META PIXEL BASE CODE ═══
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');

fbq('init', PIXEL_ID);
fbq('track', 'PageView');

// ═══ AUTO EVENT DETECTION ═══
(function() {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);

  // --- Product pages: ViewContent ---
  if (path.includes('/productos/')) {
    const priceMeta = document.querySelector('meta[property="product:price:amount"]');
    const titleMeta = document.querySelector('meta[property="og:title"]');

    // Map URL to SKU
    const skuMap = {
      'mouth-tape': 'MT-01',
      'nose-tape-premium': 'NT-02',
      'nose-tape': 'NT-01',
      'bundle': 'BUNDLE',
      'repuestos': 'NT-03',
    };
    const slug = path.split('/').pop().replace('.html', '');
    const sku = skuMap[slug] || slug;

    fbq('track', 'ViewContent', {
      content_ids: [sku],
      content_name: titleMeta?.content || document.title,
      content_type: 'product',
      value: parseFloat(priceMeta?.content) || 0,
      currency: 'GTQ',
    });
  }

  // --- Checkout page: InitiateCheckout ---
  if (path.includes('/checkout')) {
    const sku = params.get('sku');
    const products = {
      'MT-01': 100, 'NT-01': 100, 'NT-02': 149,
      'NT-03': 49, 'BUNDLE': 169,
    };
    const value = products[sku] || 0;

    fbq('track', 'InitiateCheckout', {
      content_ids: sku ? [sku] : [],
      value,
      currency: 'GTQ',
      num_items: 1,
    });
  }

  // --- Thank you page: Purchase ---
  if (path.includes('/gracias')) {
    try {
      const orderData = JSON.parse(localStorage.getItem('ventus_last_order') || '{}');

      if (orderData.sku && orderData.value) {
        fbq('track', 'Purchase', {
          content_ids: [orderData.sku],
          content_name: orderData.product_name || '',
          content_type: 'product',
          value: orderData.value,
          currency: 'GTQ',
          num_items: 1,
        });

        // Clear so it doesn't fire again on refresh
        localStorage.removeItem('ventus_last_order');
      }
    } catch { /* ignore */ }
  }
})();

// ═══ ADDTOCART HOOK ═══
// Patches buyProduct() to fire AddToCart before redirect
(function() {
  if (typeof window.buyProduct !== 'function') return;

  const originalBuy = window.buyProduct;
  window.buyProduct = function(sku) {
    const products = {
      'MT-01': { name: 'Mouth Tape VENTUS', price: 100 },
      'NT-01': { name: 'Nose Tape VENTUS', price: 100 },
      'NT-02': { name: 'Nose Tape VENTUS — Edicion Premium', price: 149 },
      'NT-03': { name: 'Repuestos VENTUS — Pimple Patch', price: 49 },
      'BUNDLE': { name: 'Bundle VENTUS — Mouth + Nose Tape', price: 169 },
    };
    const product = products[sku];

    if (product) {
      fbq('track', 'AddToCart', {
        content_ids: [sku],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'GTQ',
      });
    }

    return originalBuy(sku);
  };
})();
