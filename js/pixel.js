/**
 * VENTUS — Meta Pixel + Event Tracking v2 (Cart-aware)
 *
 * Single script for all pages. Auto-detects page type and fires events.
 * Add to <head> of every page: <script src="/js/pixel.js" defer></script>
 *
 * Events fired:
 *   PageView         — All pages (automatic)
 *   ViewContent      — Product pages (/productos/*)
 *   AddToCart         — When addToCart() is called (patches cart.js)
 *   InitiateCheckout — Checkout page, reads cart totals
 *   Purchase         — Thank you page, reads ventus_last_order
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

  // --- Checkout page: InitiateCheckout (cart-aware) ---
  if (path.includes('/checkout')) {
    if (typeof getCartTotals === 'function') {
      var totals = getCartTotals();
      if (totals.itemCount > 0) {
        fbq('track', 'InitiateCheckout', {
          content_ids: totals.lineItems.map(function(li) { return li.sku; }),
          value: totals.subtotal,
          currency: 'GTQ',
          num_items: totals.itemCount,
        });
      }
    } else {
      // Legacy fallback: single SKU from URL
      const sku = params.get('sku');
      const products = { 'MT-01': 100, 'NT-01': 100, 'NT-02': 149, 'NT-03': 49, 'BUNDLE': 169 };
      fbq('track', 'InitiateCheckout', {
        content_ids: sku ? [sku] : [],
        value: products[sku] || 0,
        currency: 'GTQ',
        num_items: 1,
      });
    }
  }

  // --- Thank you page: Purchase (multi-item aware, deduped by order id) ---
  // NOTA: sin CAPI server-side esto sigue siendo aproximado (no cubre bloqueos
  // de ad-blocker ni conversiones fuera del navegador). Es la mejor señal
  // disponible solo con tracking client-side.
  if (path.includes('/gracias')) {
    try {
      const raw = localStorage.getItem('ventus_last_order');
      const orderData = raw ? JSON.parse(raw) : null;
      const FIRED_KEY = 'ventus_purchase_fired';

      if (orderData && orderData.value && orderData.orderId) {
        const alreadyFired = localStorage.getItem(FIRED_KEY) === orderData.orderId;

        if (!alreadyFired) {
          // Build content_ids from items array (new) or single sku (legacy)
          const contentIds = orderData.items
            ? orderData.items.map(function(i) { return i.sku; })
            : orderData.sku ? [orderData.sku] : [];

          fbq('track', 'Purchase', {
            content_ids: contentIds,
            content_type: 'product',
            value: orderData.value,
            currency: 'GTQ',
            num_items: orderData.num_items || 1,
          });

          if (typeof gtag === 'function') {
            gtag('event', 'purchase', {
              transaction_id: orderData.orderId,
              value: orderData.value,
              shipping: orderData.shipping || 0,
              currency: 'GTQ',
              items: (orderData.items || []).map(function(i) {
                return {
                  item_id: i.sku,
                  item_name: i.name || i.sku,
                  price: i.price,
                  quantity: i.quantity,
                };
              }),
            });
          }

          // Flag this specific order as fired so a refresh can't re-fire it
          localStorage.setItem(FIRED_KEY, orderData.orderId);
        }

        // Clear the order payload either way — it's been processed once
        localStorage.removeItem('ventus_last_order');
      }
    } catch { /* ignore */ }

    // Safety: clear cart on thank you page
    if (typeof clearCart === 'function') clearCart();
  }
})();

// ═══ GA4 ECOMMERCE: view_item (product pages + landings) ═══
// Landings (ronquidos.html, rendimiento.html) carry the same og:title /
// product:price:amount meta as product pages, so we reuse them here.
(function() {
  if (typeof gtag !== 'function') return;

  const path = window.location.pathname;
  const isProductPage = path.includes('/productos/');

  const productSkuMap = {
    'mouth-tape': 'MT-01',
    'nose-tape-premium': 'NT-02',
    'nose-tape': 'NT-01',
    'bundle': 'BUNDLE',
    'repuestos': 'NT-03',
  };
  const landingSkuMap = {
    'ronquidos': 'MT-01',
    'rendimiento': 'NT-01',
  };

  const slug = path.split('/').pop().replace('.html', '');
  const isLandingPage = !isProductPage && Object.prototype.hasOwnProperty.call(landingSkuMap, slug);

  if (!isProductPage && !isLandingPage) return;

  const sku = isProductPage ? (productSkuMap[slug] || slug) : landingSkuMap[slug];
  const priceMeta = document.querySelector('meta[property="product:price:amount"]');
  const titleMeta = document.querySelector('meta[property="og:title"]');
  const price = parseFloat(priceMeta && priceMeta.content) || 0;
  const name = (titleMeta && titleMeta.content) || document.title;

  gtag('event', 'view_item', {
    currency: 'GTQ',
    value: price,
    items: [{ item_id: sku, item_name: name, price: price, quantity: 1 }],
  });
})();

// ═══ ADDTOCART HOOK ═══
// Patches addToCart() (from cart.js) to fire AddToCart pixel event
(function() {
  if (typeof window.addToCart !== 'function') return;

  const originalAdd = window.addToCart;
  window.addToCart = function(sku, quantity) {
    quantity = quantity || 1;
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
        value: product.price * quantity,
        currency: 'GTQ',
      });
    }

    return originalAdd(sku, quantity);
  };
})();
