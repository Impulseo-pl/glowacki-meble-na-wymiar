(function () {
  // menu na telefonie
  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () { links.classList.toggle('open'); });
  }

  // hero: zdjęcia zmieniające się z przenikaniem
  var slides = [].slice.call(document.querySelectorAll('.slide'));
  var caps = [].slice.call(document.querySelectorAll('.cap'));
  var dots = [].slice.call(document.querySelectorAll('.dots button'));
  if (slides.length > 1) {
    var stage = document.querySelector('.showcase');
    var cur = 0, timer = null;
    var ready = function (i) {
      var img = slides[i].querySelector('img');
      return img && img.complete && img.naturalWidth > 0;
    };
    var go = function (n) {
      var prev = cur;
      var next = (n + slides.length) % slides.length;
      var guard = 0;
      while (!ready(next) && guard < slides.length) { next = (next + 1) % slides.length; guard++; }
      if (!ready(next) || next === prev) return;
      cur = next;
      // poprzedni kadr zostaje tłem sekcji, żeby przenikanie nie odsłoniło pustki
      var img = slides[prev].querySelector('img');
      var src = img.currentSrc || img.src;
      if (src && stage) stage.style.backgroundImage = 'url("' + src + '")';
      slides.forEach(function (el, i) { el.classList.toggle('on', i === cur); });
      caps.forEach(function (el, i) { el.classList.toggle('on', i === cur); });
      dots.forEach(function (el, i) { el.classList.toggle('on', i === cur); });
    };
    var start = function () {
      clearInterval(timer);
      timer = setInterval(function () { go(cur + 1); }, 5800);
    };
    dots.forEach(function (d, i) {
      d.addEventListener('click', function () { go(i); start(); });
    });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { clearInterval(timer); } else { start(); }
    });
    start();
  }

  // delikatne pojawianie się sekcji
  var items = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    [].forEach.call(items, function (el) { el.classList.add('in'); });
  }
  // bezpiecznik: gdyby obserwator nie zadziałał, po 2,5 s odsłaniamy to, co widać
  setTimeout(function () {
    [].forEach.call(items, function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
    });
  }, 2500);

  // powiększanie zdjęć
  var box = document.querySelector('.lb');
  if (box) {
    var big = box.querySelector('img');
    var close = box.querySelector('button');
    var hide = function () {
      box.hidden = true; big.src = ''; document.body.style.overflow = '';
    };
    [].forEach.call(document.querySelectorAll('.bento figure, .mosaic figure'), function (fig) {
      fig.addEventListener('click', function () {
        var img = fig.querySelector('img');
        if (!img) return;
        big.src = img.currentSrc || img.src;
        big.alt = img.alt || '';
        box.hidden = false;
        document.body.style.overflow = 'hidden';
      });
    });
    close.addEventListener('click', hide);
    box.addEventListener('click', function (e) { if (e.target === box) hide(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !box.hidden) hide();
    });
  }
})();
