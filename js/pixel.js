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

  // --- Thank you page: Purchase (multi-item aware) ---
  if (path.includes('/gracias')) {
    try {
      const orderData = JSON.parse(localStorage.getItem('ventus_last_order') || '{}');

      if (orderData.value) {
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

        // Clear so it doesn't fire again on refresh
        localStorage.removeItem('ventus_last_order');
      }
    } catch { /* ignore */ }

    // Safety: clear cart on thank you page
    if (typeof clearCart === 'function') clearCart();
  }
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
