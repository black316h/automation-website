/* ==========================================================================
   main.js — 全站共用 JavaScript
   功能：手機選單 / 燈箱相簿 / 導覽列 active 狀態
   ========================================================================== */

/* ---------- 手機選單 ----------------------------------------- */
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav    = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    var isOpen = nav.classList.toggle('is-open');
    toggle.classList.toggle('is-open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* 點選連結後自動關閉 */
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* 點選選單外側關閉 */
  document.addEventListener('click', function (e) {
    if (!toggle.contains(e.target) && !nav.contains(e.target)) {
      nav.classList.remove('is-open');
      toggle.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}());

/* ---------- 導覽列 active 狀態 ------------------------------- */
(function () {
  var path = window.location.pathname;
  document.querySelectorAll('.site-nav a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    /* 去掉相對路徑前綴（../）後比對 */
    var clean = href.replace(/^(\.\.\/)+/, '');
    if (
      (clean === 'index.html' && (path === '/' || path.endsWith('/index.html'))) ||
      (clean !== 'index.html' && clean !== '' && path.includes(clean.replace('.html', '')))
    ) {
      a.classList.add('active');
    }
  });
}());

/* ---------- 燈箱 Lightbox ------------------------------------ */
(function () {
  var items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  var overlay  = document.getElementById('lightbox');
  if (!overlay) return;

  var imgEl    = overlay.querySelector('.lightbox-img');
  var closeBtn = overlay.querySelector('.lightbox-close');
  var prevBtn  = overlay.querySelector('.lightbox-prev');
  var nextBtn  = overlay.querySelector('.lightbox-next');

  /* 收集相簿 */
  var images = [];
  var current = 0;

  items.forEach(function (item, idx) {
    var src = item.querySelector('img').src;
    var alt = item.querySelector('img').alt || '';
    images.push({ src: src, alt: alt });

    item.addEventListener('click', function () {
      current = idx;
      open();
    });
  });

  function open() {
    imgEl.src = images[current].src;
    imgEl.alt = images[current].alt;
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    updateNav();
  }

  function close() {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    imgEl.src = '';
  }

  function prev() {
    current = (current - 1 + images.length) % images.length;
    imgEl.src = images[current].src;
    imgEl.alt = images[current].alt;
  }

  function next() {
    current = (current + 1) % images.length;
    imgEl.src = images[current].src;
    imgEl.alt = images[current].alt;
  }

  function updateNav() {
    var show = images.length > 1 ? '' : 'none';
    if (prevBtn) prevBtn.style.display = show;
    if (nextBtn) nextBtn.style.display = show;
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  if (prevBtn)  prevBtn.addEventListener('click', prev);
  if (nextBtn)  nextBtn.addEventListener('click', next);

  /* 點擊遮罩關閉 */
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });

  /* 鍵盤操作 */
  document.addEventListener('keydown', function (e) {
    if (!overlay.classList.contains('is-open')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
}());
