/* MediGrace / SEIRA MEDICAL ART – site scripts */
(function () {
  'use strict';

  var header = document.querySelector('.header');
  var menuBtn = document.querySelector('.menu-btn');
  var body = document.body;

  /* header: transparent on hero → solid after scroll */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('is-solid');
    else header.classList.remove('is-solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile drawer */
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      var open = body.classList.toggle('menu-open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.drawer a').forEach(function (a) {
      a.addEventListener('click', function () {
        body.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) {
        body.classList.remove('menu-open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* current nav item */
  var path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.gnav a, .drawer__nav a').forEach(function (a) {
    var href = a.getAttribute('href') || '';
    if (href.split('#')[0] === path) a.classList.add('is-current');
  });

  /* FAQ accordion */
  document.querySelectorAll('.faq__item').forEach(function (item) {
    var q = item.querySelector('.faq__q');
    if (!q) return;
    q.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');
    q.addEventListener('click', function () {
      var open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero parallax: 背景をゆっくり追従させ、テキストはスクロールで溶けるように消す */
  var heroBg = document.querySelector('.hero__bg');
  var heroInner = document.querySelector('.hero__inner');
  if (heroBg && !reduceMotion) {
    var heroH = 0;
    var ticking = false;
    function measureHero() { heroH = heroBg.parentNode.offsetHeight || window.innerHeight; }
    function paintHero() {
      ticking = false;
      var y = window.scrollY;
      if (y > heroH) return;
      heroBg.style.transform = 'translate3d(0,' + (y * 0.22).toFixed(1) + 'px,0)';
      if (heroInner) {
        var p = Math.min(1, y / (heroH * 0.7));
        heroInner.style.opacity = String(1 - p * 0.9);
        heroInner.style.transform = 'translate3d(0,' + (y * 0.1).toFixed(1) + 'px,0)';
      }
    }
    function requestHero() {
      if (!ticking) { ticking = true; window.requestAnimationFrame(paintHero); }
    }
    measureHero();
    window.addEventListener('scroll', requestHero, { passive: true });
    window.addEventListener('resize', function () { measureHero(); requestHero(); });
    paintHero();
  }

  /* scroll reveal */
  var targets = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    targets.forEach(function (t) { io.observe(t); });
  } else {
    targets.forEach(function (t) { t.classList.add('is-in'); });
  }

  /* contact form (front-end validation only; wire to backend / form service on deploy) */
  var form = document.querySelector('.form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var btn = form.querySelector('button[type=submit]');
      if (btn) { btn.disabled = true; btn.textContent = '送信しました。ありがとうございます。'; }
      form.querySelectorAll('input,select,textarea').forEach(function (el) { el.disabled = true; });
    });
  }

  /* footer year */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
