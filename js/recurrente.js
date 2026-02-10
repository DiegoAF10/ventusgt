/**
 * Recurrente Checkout Integration
 *
 * After running `npm run recurrente:setup`, update the PAYMENT_LINKS below
 * with the URLs from data/recurrente-links.json
 */

const PAYMENT_LINKS = {
  'MT-01': 'https://app.recurrente.com/checkout-session/ch_7tuglribplwbqmpv',
  'NT-01': 'https://app.recurrente.com/checkout-session/ch_cnlrm37qrrkifb1b',
  'NT-02': 'https://app.recurrente.com/checkout-session/ch_nqkfbihznql2p2uo',
  'BUNDLE': 'https://app.recurrente.com/checkout-session/ch_mbptcdcolmhqh7hy',
};

function buyProduct(sku) {
  const url = PAYMENT_LINKS[sku];
  if (url) {
    window.location.href = url;
  } else {
    // Fallback: WhatsApp with product inquiry
    const messages = {
      'MT-01': 'Hola! Me interesa el Mouth Tape VENTUS (Q100)',
      'NT-01': 'Hola! Me interesa el Nose Tape VENTUS (Q100)',
      'NT-02': 'Hola! Me interesa el Nose Tape Premium VENTUS (Q100)',
      'BUNDLE': 'Hola! Me interesa el Bundle VENTUS (Q175)',
    };
    const msg = encodeURIComponent(messages[sku] || 'Hola! Me interesan los productos VENTUS');
    // TODO: Replace with actual WhatsApp number
    // window.open(`https://wa.me/502XXXXXXXX?text=${msg}`, '_blank');
    alert('Enlace de pago próximamente. Escribinos por WhatsApp o Instagram @ventus.gt');
  }
}
