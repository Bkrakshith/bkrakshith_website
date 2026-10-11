/* bkrakshith.com — small progressive enhancements. Every page works without it. */
(function () {
  // Today's date in the masthead strip.
  document.querySelectorAll('[data-today]').forEach(function (el) {
    el.textContent = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  });

  // Mobile menu.
  var mast = document.querySelector('.mast');
  var toggle = document.querySelector('.menu-toggle');
  if (mast && toggle) {
    toggle.addEventListener('click', function () {
      var open = mast.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.querySelector('span').textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mast.classList.contains('open')) toggle.click();
    });
  }

  // Email address, assembled here so it is not in the HTML for scrapers.
  var email = 'rakshith' + '@' + 'bkrakshith' + '.com';
  document.querySelectorAll('[data-email]').forEach(function (a) {
    a.href = 'mailto:' + email;
    if (a.hasAttribute('data-email-text')) a.textContent = email;
  });

  // Lightbox for images marked .zoom.
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
        var fc = z.closest('figure') && z.closest('figure').querySelector('figcaption');
        cap.textContent = fc ? fc.textContent : (img.alt || '');
        dlg.showModal();
      });
    });
  }
})();
