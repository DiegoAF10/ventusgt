/**
 * VENTUS Social Proof & Behavioral Enhancements
 * - Purchase toast notifications
 * - Enhanced exit intent (bundle offer for desktop + mobile)
 * - Price-per-night display
 */
(function() {
  'use strict';

  // NOTA (2026-07-16): Se eliminaron los toasts de "compras recientes" —
  // usaban nombres y zonas inventados (María Zona 14, Carlos Zona 10, etc.),
  // no ventas reales. VENTUS no fabrica social proof. Si en el futuro se
  // quiere reactivar, debe alimentarse de pedidos reales vía el Worker
  // (ventus-backoffice), nunca de datos hardcodeados.

  // ── Enhanced Exit Intent ──
  // Desktop: mouseout top of viewport
  // Mobile: scroll velocity detection (fast scroll up = leaving)
  var exitShown = sessionStorage.getItem('ventus_exit_bundle');

  if (!exitShown) {
    // Desktop exit intent
    document.addEventListener('mouseout', function(e) {
      if (!e.relatedTarget && e.clientY < 5 && !sessionStorage.getItem('ventus_exit_bundle')) {
        showBundleExit();
      }
    });

    // Mobile: detect rapid upward scroll (intent to leave)
    var lastY = 0;
    var lastT = 0;
    window.addEventListener('scroll', function() {
      var y = window.scrollY;
      var t = Date.now();
      var dt = t - lastT;
      if (dt > 0 && dt < 200) {
        var velocity = (lastY - y) / dt; // positive = scrolling up
        if (velocity > 3 && y < 200 && !sessionStorage.getItem('ventus_exit_bundle')) {
          showBundleExit();
        }
      }
      lastY = y;
      lastT = t;
    }, { passive: true });
  }

  function showBundleExit() {
    var popup = document.getElementById('exit-popup');
    if (popup) {
      popup.classList.add('active');
      sessionStorage.setItem('ventus_exit_bundle', 'true');
      popup.addEventListener('click', function(ev) {
        if (ev.target === this) closeExitPopup();
      });
    }
  }

  // ── Price Per Night Display ──
  document.querySelectorAll('[data-price][data-nights]').forEach(function(el) {
    var price = parseFloat(el.getAttribute('data-price'));
    var nights = parseInt(el.getAttribute('data-nights'));
    if (price && nights) {
      var perNight = (price / nights).toFixed(2);
      var span = document.createElement('span');
      span.className = 'price-per-night';
      span.textContent = 'Solo Q' + perNight + ' por noche';
      el.appendChild(span);
    }
  });

})();
