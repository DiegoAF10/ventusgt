/**
 * VENTUS Social Proof & Behavioral Enhancements
 * - Purchase toast notifications
 * - Enhanced exit intent (bundle offer for desktop + mobile)
 * - Price-per-night display
 */
(function() {
  'use strict';

  // ── Purchase Toast Notifications ──
  var toastData = [
    { name: 'María', zone: 'Zona 14', product: 'Bundle', time: '2 horas' },
    { name: 'Carlos', zone: 'Zona 10', product: 'Mouth Tape', time: '4 horas' },
    { name: 'Andrea', zone: 'Cayalá', product: 'Bundle', time: '6 horas' },
    { name: 'Roberto', zone: 'Mixco', product: 'Mouth Tape', time: '8 horas' },
    { name: 'Lucia', zone: 'Antigua', product: 'Nose Tape', time: '1 día' }
  ];

  function showToast() {
    if (sessionStorage.getItem('ventus_toast_count') >= 2) return;

    var count = parseInt(sessionStorage.getItem('ventus_toast_count') || '0');
    var item = toastData[count % toastData.length];

    var toast = document.createElement('div');
    toast.className = 'social-proof-toast';
    toast.innerHTML = '<div class="toast-name">' + item.name + ' de ' + item.zone + ' compro el ' + item.product + '</div>' +
      '<div class="toast-detail">Hace ' + item.time + '</div>';
    document.body.appendChild(toast);

    // Slide in
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        toast.classList.add('visible');
      });
    });

    // Slide out after 4s
    setTimeout(function() {
      toast.classList.remove('visible');
      setTimeout(function() { toast.remove(); }, 500);
    }, 4000);

    sessionStorage.setItem('ventus_toast_count', count + 1);
  }

  // Show first toast after 8s, second after 25s
  if (!sessionStorage.getItem('ventus_toast_count') || parseInt(sessionStorage.getItem('ventus_toast_count')) < 2) {
    var currentCount = parseInt(sessionStorage.getItem('ventus_toast_count') || '0');
    if (currentCount === 0) {
      setTimeout(showToast, 8000);
      setTimeout(showToast, 25000);
    } else if (currentCount === 1) {
      setTimeout(showToast, 12000);
    }
  }

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
