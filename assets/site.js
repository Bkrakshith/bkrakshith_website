/* bkrakshith.com — menu, email link, lightbox and the scroll animations.
   Every page still reads correctly without this file, and all motion
   is skipped when the visitor asks for reduced motion. */
(function () {
  window.__siteReady = true;
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var ease = 'cubic-bezier(.2,.7,.2,1)';

  // ── Email address, assembled here so it is not in the HTML for scrapers.
  var email = 'rakshith' + '@' + 'bkrakshith' + '.com';
  document.querySelectorAll('[data-email]').forEach(function (a) {
    a.href = 'mailto:' + email + (a.dataset.subject ? '?subject=' + encodeURIComponent(a.dataset.subject) : '');
    if (a.hasAttribute('data-email-text')) a.textContent = email;
  });

  // ── Pill menu: open at the top of the page, collapses on scroll,
  //    expands on hover (CSS) or on click/tap (here).
  var pill = document.querySelector('[data-pill]');
  if (pill) {
    var btn = pill.querySelector('.pill-toggle');
    var setOpen = function (open) {
      pill.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    btn.addEventListener('click', function () { setOpen(!pill.classList.contains('open')); });
    document.addEventListener('click', function (e) {
      if (pill.classList.contains('open') && !pill.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pill.classList.contains('open')) { setOpen(false); btn.focus(); }
    });
    var top = function () { pill.classList.toggle('at-top', window.scrollY < 60); };
    top();
    window.addEventListener('scroll', top, { passive: true });
  }

  // ── Split headings into letters that rise into place.
  function split(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    el.setAttribute('aria-label', el.textContent.replace(/\s+/g, ' ').trim());
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var word = document.createElement('span');
            word.className = 'split-line';
            word.setAttribute('aria-hidden', 'true');
            Array.prototype.forEach.call(part, function (c) {
              var s = document.createElement('span');
              s.className = 'ch';
              s.style.setProperty('--i', i++);
              s.textContent = c;
              word.appendChild(s);
            });
            frag.appendChild(word);
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR' && n.tagName !== 'SVG') {
          walk(n);
        }
      });
    })(el);
  }

  // ── Count-up numbers: <span data-count="99.6" data-suffix="%">99.6%</span>
  function countUp(el) {
    var target = parseFloat(el.dataset.count);
    if (isNaN(target)) return;
    var dec = (el.dataset.count.split('.')[1] || '').length;
    var pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    var group = el.dataset.group === '1';
    var t0 = null, dur = 1600;
    function frame(t) {
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var v = target * (1 - Math.pow(1 - p, 3));
      el.textContent = pre + (group ? v.toLocaleString('en-GB', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : v.toFixed(dec)) + suf;
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var reveals = document.querySelectorAll('[data-reveal], [data-split], [data-scale], [data-count]');
  if (reduce || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    document.querySelectorAll('[data-split]').forEach(split);
    // Stagger siblings that reveal together.
    document.querySelectorAll('[data-stagger]').forEach(function (group) {
      var step = parseFloat(group.dataset.stagger) || 0.08;
      Array.prototype.forEach.call(group.querySelectorAll(':scope > [data-reveal]'), function (el, n) {
        if (!el.style.getPropertyValue('--d')) el.style.setProperty('--d', (n * step).toFixed(2) + 's');
      });
    });
    document.querySelectorAll('[data-count]').forEach(function (el) {
      if (el.textContent.indexOf(',') > -1) el.dataset.group = '1';
      el.textContent = (el.dataset.prefix || '') + '0' + (el.dataset.suffix || '');
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        if (e.target.hasAttribute('data-count')) countUp(e.target);
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  // ── Hero: the photo card flips in and follows the pointer. On wide
  //    screens it then travels with the scroll, straightens up and lands
  //    in the [data-card-slot] beside the next section's text.
  var hero = document.querySelector('.hero');
  if (hero) {
    var go = function () { hero.classList.add('is-in'); };
    if (reduce) go(); else requestAnimationFrame(function () { requestAnimationFrame(go); });
    var heroCard = hero.querySelector('.hero-card');
    var inner = hero.querySelector('.hero-card-inner');
    var slot = document.querySelector('[data-card-slot]');
    var wide = window.matchMedia('(min-width: 901px)');
    var geo = null;
    var flying = function () { return heroCard && heroCard.classList.contains('flying'); };

    if (inner && !reduce && window.matchMedia('(hover: hover)').matches) {
      setTimeout(function () { hero.classList.add('tilt-ready'); }, 1900);
      hero.addEventListener('pointermove', function (e) {
        if (!hero.classList.contains('tilt-ready') || flying()) return;
        var r = hero.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform = 'rotateY(' + (-22 + x * 26).toFixed(1) + 'deg) rotateX(' + (6 - y * 16).toFixed(1) + 'deg) rotateZ(2deg)';
      });
      hero.addEventListener('pointerleave', function () { if (!flying()) inner.style.transform = ''; });
    }

    if (heroCard && slot && !reduce) {
      var docPos = function (el) {
        var x = 0, y = 0;
        for (var n = el; n; n = n.offsetParent) { x += n.offsetLeft; y += n.offsetTop; }
        return { x: x, y: y, w: el.offsetWidth };
      };
      var place = function () {
        if (!geo) return;
        var p = Math.max(0, Math.min(1, window.scrollY / geo.dy));
        var e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        if (p === 0) {
          heroCard.classList.remove('flying');
          heroCard.style.transform = '';
          inner.style.transform = '';
          return;
        }
        heroCard.classList.add('flying');
        heroCard.style.transform = 'translate(' + (geo.dx * e).toFixed(1) + 'px,' + (geo.dy * p).toFixed(1) + 'px) scale(' + (1 + (geo.s - 1) * e).toFixed(4) + ')';
        var k = 1 - e;
        inner.style.transform = 'rotateY(' + (-22 * k).toFixed(2) + 'deg) rotateX(' + (6 * k).toFixed(2) + 'deg) rotateZ(' + (2 * k).toFixed(2) + 'deg)';
      };
      var measure = function () {
        if (!wide.matches) {
          geo = null;
          root.classList.remove('fly-on');
          heroCard.classList.remove('flying');
          heroCard.style.transform = '';
          inner.style.transform = '';
          return;
        }
        var a = docPos(heroCard), b = docPos(slot);
        var dy = b.y - a.y;
        if (dy <= 0) { geo = null; return; }
        geo = { dx: b.x - a.x, dy: dy, s: b.w / a.w };
        root.classList.add('fly-on');
        place();
      };
      var queued = false;
      window.addEventListener('scroll', function () {
        if (queued) return;
        queued = true;
        requestAnimationFrame(function () { queued = false; place(); });
      }, { passive: true });
      window.addEventListener('resize', measure);
      window.addEventListener('load', measure);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
      measure();
    }
  }

  // ── Accordions with a height animation. One item open at a time.
  document.querySelectorAll('.acc details').forEach(function (d) {
    var s = d.querySelector('summary'), body = d.querySelector('.acc-body');
    if (!s || !body) return;
    s.addEventListener('click', function (e) {
      e.preventDefault();
      if (d.open) { close(d); return; }
      var acc = d.parentElement;
      acc.querySelectorAll(':scope > details[open]').forEach(close);
      d.open = true;
      var media = acc.dataset.media && document.querySelector(acc.dataset.media);
      if (media) {
        var idx = Array.prototype.indexOf.call(acc.querySelectorAll(':scope > details'), d);
        media.querySelectorAll('img').forEach(function (im, k) { im.classList.toggle('on', k === idx); });
      }
      if (!reduce && body.animate) {
        body.animate([{ height: '0px', opacity: 0 }, { height: body.scrollHeight + 'px', opacity: 1 }], { duration: 450, easing: ease });
      }
    });
  });
  function close(d) {
    var body = d.querySelector('.acc-body');
    if (reduce || !body.animate) { d.open = false; return; }
    d.classList.add('closing');
    var a = body.animate([{ height: body.scrollHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }], { duration: 320, easing: ease, fill: 'forwards' });
    a.onfinish = function () { d.open = false; d.classList.remove('closing'); a.cancel(); };
  }

  // ── Stacked project cards: each card shrinks as the next one covers it.
  var stack = Array.prototype.slice.call(document.querySelectorAll('.stack-card'));
  if (stack.length > 1 && !reduce) {
    var ticking = false;
    var paint = function () {
      ticking = false;
      var vh = window.innerHeight;
      for (var i = 0; i < stack.length - 1; i++) {
        var stick = parseFloat(getComputedStyle(stack[i]).top) || 0;
        var next = stack[i + 1].getBoundingClientRect().top;
        var p = Math.max(0, Math.min(1, (vh - next) / Math.max(1, vh - stick)));
        var inner = stack[i].firstElementChild;
        inner.style.transform = 'scale(' + (1 - p * 0.07).toFixed(4) + ')';
        inner.style.filter = 'brightness(' + (1 - p * 0.4).toFixed(3) + ')';
      }
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    paint();
  }

  // ── Project filters on the Projects page.
  document.querySelectorAll('[data-filters]').forEach(function (bar) {
    var grid = document.querySelector(bar.dataset.filters);
    if (!grid) return;
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-filter]');
      if (!b) return;
      bar.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var cat = b.dataset.filter;
      grid.querySelectorAll('[data-cat]').forEach(function (item, n) {
        var show = cat === 'all' || item.dataset.cat === cat;
        var was = !item.classList.contains('is-hidden');
        item.classList.toggle('is-hidden', !show);
        if (show && !was && !reduce && item.animate) {
          item.animate([{ opacity: 0, transform: 'translateY(20px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: n * 40, easing: ease, fill: 'backwards' });
        }
      });
    });
  });

  // ── Lightbox for images marked .zoom.
  var zooms = document.querySelectorAll('.zoom');
  if (zooms.length && typeof HTMLDialogElement === 'function') {
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Enlarged image');
    dlg.innerHTML = '<button type="button">Close ✕</button><img alt=""><p></p>';
    document.body.appendChild(dlg);
    var big = dlg.querySelector('img'), cap = dlg.querySelector('p');
    dlg.querySelector('button').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    zooms.forEach(function (z) {
      z.addEventListener('click', function (e) {
        e.preventDefault();
        var img = z.querySelector('img');
        big.src = z.getAttribute('href') || img.currentSrc || img.src;
        big.alt = img.alt || '';
        cap.textContent = z.dataset.caption || img.alt || '';
        dlg.showModal();
      });
    });
  }

  root.classList.add('ready');
})();
