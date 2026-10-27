/* FAUVE site behaviour: header on scroll, menu panel, reveal and parallax,
   and filling contact details and packages from the data files. */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var C = window.FAUVE_CONTACT || {};
  var P = window.FAUVE_PACKAGES || {};

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  /* WhatsApp link from the contact data. Returns '' until a number is set. */
  function wa(message) {
    var n = String(C.whatsapp || '').replace(/\D/g, '');
    if (!n) return '';
    return 'https://wa.me/' + n + '?text=' + encodeURIComponent(message || C.whatsappMessage || '');
  }
  window.FAUVE_WA = wa;

  /* Header: transparent over the opening image, stone once the page scrolls. */
  var nav = $('.fv-nav');
  var mark = nav && $('.fv-nav__mark img', nav);
  var cta = nav && $('.fv-nav__cta .fv-btn', nav);
  var fixedSolid = nav && nav.classList.contains('is-solid');
  function onScroll() {
    if (!nav || fixedSolid) return;
    var solid = window.scrollY > window.innerHeight * 0.5;
    nav.classList.toggle('is-solid', solid);
    if (mark) mark.src = solid || nav.classList.contains('is-light') ? mark.dataset.dark : mark.dataset.light;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu panel */
  var menu = $('#site-menu');
  var menuBtn = $('.fv-nav__menu');
  function setMenu(open) {
    if (!menu) return;
    menu.hidden = !open;
    document.body.classList.toggle('is-locked', open);
    if (menuBtn) menuBtn.setAttribute('aria-expanded', String(open));
    if (open) { var c = $('.fv-menu__close', menu); if (c) c.focus(); }
    else if (menuBtn) menuBtn.focus();
  }
  if (menuBtn) menuBtn.addEventListener('click', function () { setMenu(true); });
  if (menu) {
    $('.fv-menu__close', menu).addEventListener('click', function () { setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });
  }

  /* Reveal sections as they enter, and drift large photographs gently. */
  var reveals = $$('.reveal');
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (n) { io.observe(n); });
  } else {
    reveals.forEach(function (n) { n.classList.add('is-in'); });
  }
  var drift = $$('.parallax');
  if (!reduce && drift.length) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        drift.forEach(function (img) {
          var r = img.parentElement.getBoundingClientRect();
          var p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
          img.style.transform = 'translateY(' + (p * -40).toFixed(1) + 'px) scale(1.08)';
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* Contact details: each line shows only when its value exists. */
  function contactLines() {
    var lines = [];
    if (C.whatsapp) lines.push(['WhatsApp', '+' + String(C.whatsapp).replace(/\D/g, ''), wa()]);
    if (C.email) lines.push(['Email', C.email, 'mailto:' + C.email]);
    if (C.instagram) lines.push(['Instagram', C.instagram.replace(/^https?:\/\/(www\.)?/, ''), C.instagram]);
    if (C.tiktok) lines.push(['TikTok', C.tiktok.replace(/^https?:\/\/(www\.)?/, ''), C.tiktok]);
    if (C.location) lines.push(['Studio', C.location, '']);
    if (C.hours) lines.push(['Replies', C.hours, '']);
    return lines;
  }
  $$('[data-contact-list]').forEach(function (ul) {
    var lines = contactLines();
    if (!lines.length) { ul.hidden = true; return; }
    lines.forEach(function (l) {
      var li = el('li'); li.appendChild(el('span', 'label-sm', l[0]));
      var v = l[2] ? el('a', 'body', l[1]) : el('span', 'body', l[1]);
      if (l[2]) { v.href = l[2]; if (/^https/.test(l[2])) { v.target = '_blank'; v.rel = 'noopener'; } }
      li.appendChild(v); ul.appendChild(li);
    });
  });
  $$('[data-footer-contact]').forEach(function (p) {
    var bits = [C.location, C.email, C.legalName].filter(Boolean);
    if (bits.length) p.textContent = bits.join(' · '); else p.hidden = true;
  });
  $$('[data-social]').forEach(function (a) {
    var key = a.getAttribute('data-social');
    var href = key === 'whatsapp' ? wa() : C[key];
    if (href) { a.href = href; a.target = '_blank'; a.rel = 'noopener'; } else a.remove();
  });
  $$('[data-wa]').forEach(function (a) {
    var href = wa(a.getAttribute('data-wa') || '');
    if (href) { a.href = href; a.target = '_blank'; a.rel = 'noopener'; } else if (a.hasAttribute('data-wa-fallback')) { a.href = a.getAttribute('data-wa-fallback'); } else a.hidden = true;
  });

  /* Packages: cards when the data has them, a short note when it does not. */
  $$('[data-packages]').forEach(function (box) {
    var key = box.getAttribute('data-packages');
    var list = P[key] || [];
    var notes = P[key + 'Notes'] || [];
    if (!list.length) {
      var pend = el('div', 'pending');
      pend.appendChild(el('p', 'h3', box.getAttribute('data-empty-title') || 'Packages are being finalised.'));
      pend.appendChild(el('p', 'body', 'Tell us about your occasion and we will shape one with you.'));
      var a = el('a', 'fv-btn fv-btn--secondary', 'Ask on WhatsApp');
      var href = wa('Hello FAUVE, I would like to ask about ' + (box.getAttribute('data-topic') || 'your services') + '.');
      a.href = href || 'contact.html'; if (href) { a.target = '_blank'; a.rel = 'noopener'; }
      pend.appendChild(a); box.appendChild(pend); return;
    }
    var grid = el('div', 'cards');
    list.forEach(function (pk) {
      var card = el('article', 'fv-price reveal');
      if (pk.image) { var m = el('div', 'fv-price__media'); var img = el('img', 'fv-img'); img.src = pk.image; img.alt = pk.name; img.loading = 'lazy'; img.setAttribute('data-ratio', '4:5'); m.appendChild(img); card.appendChild(m); }
      card.appendChild(el('h3', 'fv-price__name h3', pk.name));
      if (pk['for']) card.appendChild(el('p', 'fv-price__desc body-sm', pk['for']));
      if (pk.inclusions && pk.inclusions.length) {
        var ul = el('ul', 'fv-price__list body-sm');
        pk.inclusions.forEach(function (i) { ul.appendChild(el('li', null, i)); });
        card.appendChild(ul);
      }
      card.appendChild(el('p', 'fv-price__price h3', pk.price || 'Price on request'));
      var b = el('a', 'fv-btn fv-btn--secondary', 'Enquire');
      var href = wa('Hello FAUVE, I would like to ask about the ' + pk.name + ' package.');
      b.href = href || 'contact.html'; if (href) { b.target = '_blank'; b.rel = 'noopener'; }
      card.appendChild(b); grid.appendChild(card);
      card.classList.add('is-in');
    });
    box.appendChild(grid);
    if (notes.length) {
      var nl = el('ul', 'notes body-sm');
      notes.forEach(function (n) { nl.appendChild(el('li', null, n)); });
      box.appendChild(nl);
    }
  });

  /* Inquiry form: compose the message and open WhatsApp with it. */
  var form = $('#inquiry');
  if (form) {
    var hint = $('.fv-field__hint', form);
    if (!wa()) {
      if (hint) hint.textContent = 'Our WhatsApp line is being set up. Please check back soon.';
      $$('button[type=submit], a.fv-btn', form).forEach(function (b) { if (b.tagName === 'BUTTON') b.disabled = true; else b.hidden = true; });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements.name;
      if (!name.value.trim()) { name.setAttribute('aria-invalid', 'true'); name.focus(); return; }
      name.removeAttribute('aria-invalid');
      var parts = ['Hello FAUVE, my name is ' + name.value.trim() + '.'];
      if (form.elements.occasion.value.trim()) parts.push('Occasion: ' + form.elements.occasion.value.trim() + '.');
      if (form.elements.date.value) parts.push('Date: ' + form.elements.date.value + '.');
      if (form.elements.message.value.trim()) parts.push(form.elements.message.value.trim());
      var href = wa(parts.join('\n'));
      if (href) window.open(href, '_blank', 'noopener');
    });
  }

  var year = $('[data-year]'); if (year) year.textContent = new Date().getFullYear();
})();
