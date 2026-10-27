/* FAUVE Scent Finder: one question per screen, choices only, three results. */
(function () {
  'use strict';
  var Q = window.FAUVE_FINDER || [];
  var S = window.FAUVE_SCENTS || [];
  var stage = document.getElementById('finder-stage');
  var bar = document.querySelector('.fv-progress');
  var fill = bar && bar.querySelector('.fv-progress__fill');
  var back = document.getElementById('finder-back');
  var answers = {};
  var step = -1; // -1 intro, 0..n-1 questions, n loading/results

  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  var CHECK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke-width="1" stroke-linecap="square" aria-hidden="true"><path d="M4 12.5l5 5L20 6.5"/></svg>';

  function progress(n) {
    if (!bar) return;
    var done = Math.max(0, Math.min(Q.length, n));
    fill.style.width = (done / Q.length * 100) + '%';
    bar.setAttribute('aria-valuenow', done);
    bar.setAttribute('aria-label', 'Question ' + Math.min(done + 1, Q.length) + ' of ' + Q.length);
  }

  function show(node) {
    stage.innerHTML = '';
    stage.appendChild(node);
    var h = node.querySelector('h1, h2, legend');
    if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    window.scrollTo({ top: 0 });
    back.classList.toggle('is-off', step < 0 || step > Q.length - 1);
  }

  function intro() {
    step = -1; progress(0);
    var s = el('section', 'screen screen--intro');
    s.appendChild(el('p', 'label-sm fv-eyebrow', 'Find your scent'));
    s.appendChild(el('h1', 'display', 'A scent that tells your story.'));
    s.appendChild(el('p', 'body-lg', 'Six short questions about how you feel, where you belong and what you love. There are no wrong answers, and nothing to type.'));
    var go = el('button', 'fv-btn fv-btn--primary', 'Begin');
    go.type = 'button'; go.addEventListener('click', function () { ask(0); });
    var a = el('div', 'screen__actions'); a.appendChild(go); s.appendChild(a);
    show(s);
  }

  function ask(i) {
    step = i; progress(i);
    var q = Q[i];
    var s = el('section', 'screen');
    var fs = el('fieldset');
    var lg = el('legend');
    lg.appendChild(el('span', 'label-sm', q.eyebrow + ' · ' + (i + 1) + ' of ' + Q.length));
    lg.appendChild(el('span', 'h1', q.question));
    fs.appendChild(lg);
    var grid = el('div', 'opts');
    q.options.forEach(function (o, k) {
      var lab = el('label', 'fv-opt');
      var input = el('input', 'fv-opt__input');
      input.type = 'radio'; input.name = q.key; input.value = o.value;
      if (answers[q.key] === o.value) input.checked = true;
      var media = el('span', 'fv-opt__media');
      if (o.image) { var img = el('img'); img.src = o.image; img.alt = ''; img.loading = k < 4 ? 'eager' : 'lazy'; media.appendChild(img); }
      else media.appendChild(el('span', 'tint tint--' + (o.tint || 'sand')));
      var chk = el('span', 'fv-opt__check'); chk.innerHTML = CHECK; media.appendChild(chk);
      lab.appendChild(input); lab.appendChild(media); lab.appendChild(el('span', 'fv-opt__label body-sm', o.label));
      input.addEventListener('change', function () { answers[q.key] = o.value; next.disabled = false; });
      /* A click (not an arrow key) moves on by itself after a short pause. */
      lab.addEventListener('click', function (e) {
        if (e.detail === 0) return;
        setTimeout(function () { if (answers[q.key] === o.value) go(); }, 450);
      });
      grid.appendChild(lab);
    });
    fs.appendChild(grid); s.appendChild(fs);
    var next = el('button', 'fv-btn fv-btn--secondary', i === Q.length - 1 ? 'See my scents' : 'Next');
    next.type = 'button'; next.disabled = !answers[q.key];
    var moved = false;
    function go() { if (moved || !answers[q.key]) return; moved = true; if (i + 1 < Q.length) ask(i + 1); else reading(); }
    next.addEventListener('click', go);
    var a = el('div', 'screen__actions'); a.appendChild(next); s.appendChild(a);
    show(s);
  }

  function reading() {
    step = Q.length; progress(Q.length);
    var s = el('section', 'screen screen--loading');
    s.setAttribute('role', 'status');
    s.appendChild(el('div', 'breath'));
    s.appendChild(el('h2', 'h2', 'Reading your scent profile'));
    show(s);
    setTimeout(results, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 300 : 2200);
  }

  function score(sc) {
    var p = 0, why = [];
    if (sc.moods.indexOf(answers.mood) > -1) { p += 3; why.push('mood'); }
    if (sc.places.indexOf(answers.place) > -1) { p += 2; why.push('place'); }
    if (sc.time === answers.time) { p += 1; why.push('time'); }
    if (sc.family === answers.like) { p += 3; why.push('like'); }
    if (answers.avoid !== 'none' && sc.family === answers.avoid) p -= 10;
    if (sc.intensity === answers.intensity) { p += 1; why.push('intensity'); }
    return { s: sc, p: p, why: why };
  }

  function labelOf(key) {
    var q = Q.filter(function (x) { return x.key === key; })[0];
    var o = q && q.options.filter(function (x) { return x.value === answers[key]; })[0];
    return o ? o.label.toLowerCase() : '';
  }

  function sentence(r) {
    var w = r.why;
    if (w.indexOf('mood') > -1 && w.indexOf('place') > -1) return 'It holds the ' + labelOf('mood') + ' you asked for, and the feeling of ' + labelOf('place') + '.';
    if (w.indexOf('like') > -1 && w.indexOf('time') > -1) return 'It is built on ' + labelOf('like') + ', and it belongs to ' + labelOf('time') + '.';
    if (w.indexOf('mood') > -1) return 'It is the one that feels ' + labelOf('mood') + '.';
    if (w.indexOf('like') > -1) return 'It begins where you said you are drawn: ' + labelOf('like') + '.';
    if (w.indexOf('place') > -1) return 'It carries something of ' + labelOf('place') + '.';
    return 'It sits alongside your answers, a quieter way into the same story.';
  }

  var FAMILY_IMG = { woody: 'ingredient-oud', floral: 'ingredient-lavender', gourmand: 'ingredient-coffee', amber: 'ingredient-vanilla', fresh: 'campaign-leaf' };

  function results() {
    var s = el('section', 'screen');
    if (S.length < 3) {
      var e = el('div', 'results__empty');
      e.appendChild(el('p', 'label-sm fv-eyebrow', 'Your scent profile'));
      e.appendChild(el('h1', 'h1', 'Our scent library is still being written.'));
      e.appendChild(el('p', 'body-lg', 'Your answers are saved for this visit. Share them with us and we will choose three for you by hand.'));
      var a = el('a', 'fv-btn fv-btn--primary', 'Send my answers');
      var msg = 'Hello FAUVE, here is my scent profile: ' + Q.map(function (q) { return q.eyebrow + ': ' + labelOf(q.key); }).join('; ') + '.';
      var href = window.FAUVE_WA ? window.FAUVE_WA(msg) : '';
      a.href = href || 'contact.html'; if (href) { a.target = '_blank'; a.rel = 'noopener'; }
      var again = el('button', 'fv-btn fv-btn--secondary', 'Start again'); again.type = 'button';
      again.addEventListener('click', function () { answers = {}; intro(); });
      var acts = el('div', 'screen__actions'); acts.appendChild(a); acts.appendChild(again);
      e.appendChild(acts); s.appendChild(e); show(s); return;
    }
    var top = S.map(score).filter(function (r) { return r.p > -5; }).sort(function (a, b) { return b.p - a.p; }).slice(0, 3);
    s.appendChild(el('p', 'label-sm fv-eyebrow', 'Your scent profile'));
    s.appendChild(el('h1', 'h1', 'Three scents for your story.'));
    var grid = el('div', 'results');
    top.forEach(function (r) {
      var sc = r.s, card = el('article', 'fv-result');
      var m = el('div', 'fv-result__media'), img = el('img', 'fv-img');
      img.src = sc.image || 'assets/img/photo/' + (FAMILY_IMG[sc.family] || 'bottle-still') + '.jpg';
      img.alt = ''; img.setAttribute('data-ratio', '4:5'); m.appendChild(img); card.appendChild(m);
      card.appendChild(el('h2', 'fv-result__name h3', sc.name));
      var dl = el('dl', 'fv-result__notes body-sm');
      [['Top', sc.top], ['Heart', sc.heart], ['Base', sc.base]].forEach(function (row) {
        if (!row[1]) return;
        var d = el('div', 'fv-result__row'); d.appendChild(el('dt', null, row[0])); d.appendChild(el('dd', null, row[1])); dl.appendChild(d);
      });
      card.appendChild(dl);
      card.appendChild(el('p', 'fv-result__why body-sm', sentence(r)));
      grid.appendChild(card);
    });
    s.appendChild(grid);
    var again = el('button', 'fv-btn fv-btn--secondary', 'Start again'); again.type = 'button';
    again.addEventListener('click', function () { answers = {}; intro(); });
    var acts = el('div', 'screen__actions'); acts.appendChild(again); s.appendChild(acts);
    show(s);
  }

  back.addEventListener('click', function () { if (step > 0) ask(step - 1); else intro(); });
  intro();
})();
