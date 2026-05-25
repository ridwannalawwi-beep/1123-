(function(){
  // Page transition
  document.addEventListener('click', function(e) {
    var backBtn = e.target.closest('[data-navigate="back"]');
    if (backBtn) {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
      document.body.style.opacity = '0';
      setTimeout(function(){ history.back(); }, 350);
      return;
    }
    var link = e.target.closest('a[href]');
    if (link && link.hostname === location.hostname && link.href !== location.href && link.href.indexOf('#') === -1 && !link.hasAttribute('onclick')) {
      e.preventDefault();
      document.body.style.transition = 'opacity 0.35s cubic-bezier(0.22, 1, 0.36, 1)';
      document.body.style.opacity = '0';
      setTimeout(function(){ window.location.href = link.href; }, 350);
    }
  });

  // Scroll reveal
  var ro = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function(){ entry.target.classList.add('active'); }, entry.target.dataset.delay || i * 100);
        ro.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal-up, .fade-in').forEach(function(el){ ro.observe(el); });

  // Custom cursor
  var cursor = document.createElement('div');
  cursor.className = 'cursor-dot';
  document.body.appendChild(cursor);
  var mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
  document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX; mouseY = e.clientY;
  });
  (function animate() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animate);
  })();
  document.querySelectorAll('a, button, [data-cursor]').forEach(function(el) {
    el.addEventListener('mouseenter', function(){ cursor.classList.add('active'); });
    el.addEventListener('mouseleave', function(){ cursor.classList.remove('active'); });
  });

  // Magnetic hover
  document.querySelectorAll('a, button').forEach(function(btn) {
    if (btn.closest('.cursor-dot')) return;
    btn.addEventListener('mousemove', function(e) {
      var rect = btn.getBoundingClientRect();
      var x = (e.clientX - rect.left - rect.width / 2) * 0.12;
      var y = (e.clientY - rect.top - rect.height / 2) * 0.12;
      btn.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
    });
    btn.addEventListener('mouseleave', function(){ btn.style.transform = ''; });
  });

  // Cart badge sync
  function updateCartBadge() {
    var merch = JSON.parse(localStorage.getItem('cartMerch') || '[]');
    var staticArr = JSON.parse(localStorage.getItem('cartStatic') || '[]');
    var staticQtys = JSON.parse(localStorage.getItem('cartStaticQtys') || '{}');
    var total = 0;
    merch.forEach(function(item) { total += item.qty || 1; });
    staticArr.forEach(function(idx) { total += staticQtys[idx] || 1; });
    document.querySelectorAll('.cart-badge').forEach(function(b) {
      b.textContent = total;
      b.style.display = total > 0 ? 'flex' : 'none';
    });
  }
  window.updateCartBadge = updateCartBadge;
  updateCartBadge();

  // Smooth header hide/show on scroll
  var h = document.querySelector('header');
  if (h) {
    var ls = 0;
    h.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)';
    window.addEventListener('scroll', function() {
      var cs = window.pageYOffset;
      if (cs > ls && cs > 200) { h.style.transform = 'translateY(-100%)'; }
      else if (cs < ls) { h.style.transform = 'translateY(0)'; }
      ls = cs;
    }, { passive: true });
  }

  // Stacked cart toast notifications
  function showCartToast() {
    var c = document.getElementById('toast-container');
    if (!c) return;
    var t = document.createElement('div');
    t.className = 'translate-x-8 opacity-0 transition-all duration-500 ease-out pointer-events-auto';
    t.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
    t.innerHTML = '<div class="bg-[#1a1c1c] border border-white/10 backdrop-blur-xl px-6 py-4 flex items-center gap-4 shadow-2xl min-w-[320px] rounded-none">' +
      '<div class="w-10 h-10 bg-green-500/20 flex items-center justify-center shrink-0">' +
      '<span class="material-symbols-outlined text-green-400 text-xl">check_circle</span></div>' +
      '<div>' +
      '<p class="font-label-caps text-label-caps text-primary tracking-wider">PESANAN BERHASIL</p>' +
      '<p class="font-body-md text-body-md text-on-surface-variant text-sm">Pesanan kamu sudah masuk ke keranjang</p>' +
      '</div></div>';
    c.insertBefore(t, c.firstChild);
    requestAnimationFrame(function() {
      t.classList.remove('translate-x-8', 'opacity-0');
      t.classList.add('translate-x-0', 'opacity-100');
    });
    t._timer = setTimeout(function() {
      // Step 1: slide out to the right
      t.classList.remove('translate-x-0', 'opacity-100');
      t.classList.add('translate-x-8', 'opacity-0');
      // Step 2: collapse height so remaining toasts slide up smoothly
      setTimeout(function() {
        var h = t.scrollHeight;
        t.style.transition = 'height 0.35s ease-out, margin 0.35s ease-out, padding 0.35s ease-out';
        t.style.height = h + 'px';
        t.style.overflow = 'hidden';
        t.style.margin = '0';
        // Force reflow
        void t.offsetHeight;
        t.style.height = '0';
        t.style.paddingTop = '0';
        t.style.paddingBottom = '0';
        t.style.border = 'none';
        setTimeout(function() {
          if (t.parentNode) t.parentNode.removeChild(t);
        }, 350);
      }, 500);
    }, 5000);
  }
  window.showCartToast = showCartToast;
})();
