/* ==========================================================================
   Population Lab (wg217) - Exact Logic & Interactions
   Complies with WIDGET-GUIDE.md and en_eco_8_wg217.md guidelines.
   ========================================================================== */
(function () {
  'use strict';

  var d = window.WIDGET_DATA;
  var H = window.WIDGET_HELPERS;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(id) { return document.getElementById(id); }
  function el(tag, cls) { var e = document.createElement(tag); if (cls) e.className = cls; return e; }

  /* ==========================================================================
     1. STAGE SCALING
     ========================================================================== */
  var stage = $('stage');
  var modalStage = $('modal-stage');
  var body = document.body;

  function fitStage() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var s = Math.min(vw / 1920, vh / 1080);
    var tx = (vw - 1920 * s) / 2;
    var ty = (vh - 1080 * s) / 2;
    var t = 'translate(' + tx + 'px, ' + ty + 'px) scale(' + s + ')';
    stage.style.transform = t;
    if (modalStage) modalStage.style.transform = t;
  }
  fitStage();
  window.addEventListener('resize', fitStage);

  /* Modal backdrop synchronisation */
  function syncModalBackdrop() {
    var hasModal = !$('insightModal').hidden || !$('summaryCard').hidden;
    body.classList.toggle('has-modal', hasModal);
  }

  /* ==========================================================================
     2. NAVIGATION, BADGES & INSIGHTS
     ========================================================================== */
  var screens = ['screen-intro', 'screen-lv1', 'screen-lv2', 'screen-lv3', 'screen-results'];
  var activeScreen = 'screen-intro';

  var earned = { 1: false, 2: false, 3: false };
  var gold   = { 1: false, 2: false, 3: false };
  var best   = { 1: 0, 2: 0, 3: 0 };
  var MAX    = { 1: 6, 2: 8, 3: 8 };
  var badgeNames = { 1: 'Graph Reader', 2: 'Stage Detective', 3: 'Policy Advisor' };
  var levelNames = { 1: 'Read the graph', 2: 'Name the stage', 3: 'Advise the minister' };

  function showScreen(id) {
    screens.forEach(function (s) {
      var scr = $(s);
      if (!scr) return;
      var on = s === id;
      scr.hidden = !on;
      scr.classList.toggle('is-active', on);
    });
    activeScreen = id;

    /* Header navigation pills are hidden on intro screen */
    var pills = $('pills');
    if (pills) pills.hidden = id === 'screen-intro';

    /* Hide stage check / reveal buttons on intro and results */
    if (id === 'screen-intro' || id === 'screen-results') {
      if ($('stageChkBtn')) $('stageChkBtn').hidden = true;
      if ($('stageRevBtn')) $('stageRevBtn').hidden = true;
    }

    /* Highlight active pill */
    ['nav1', 'nav2', 'nav3', 'nav4'].forEach(function (navId, i) {
      var b = $(navId);
      if (!b) return;
      var match = ['screen-lv1', 'screen-lv2', 'screen-lv3', 'screen-results'][i];
      var isCur = id === match;
      b.classList.toggle('on', isCur);
      b.setAttribute('aria-selected', String(isCur));
    });

    if (id === 'screen-results') renderResults();
  }

  function earnBadge(lvl, isGold) {
    earned[lvl] = true;
    if (isGold) gold[lvl] = true;
    var b = $('bdg' + lvl);
    if (!b) return;
    b.classList.add('earned');
    b.classList.toggle('gold', !!gold[lvl]);
  }

  /* Navigation pill events */
  ['nav1', 'nav2', 'nav3', 'nav4'].forEach(function (navId, i) {
    var b = $(navId);
    if (!b) return;
    b.addEventListener('click', function () {
      showScreen(['screen-lv1', 'screen-lv2', 'screen-lv3', 'screen-results'][i]);
    });
  });

  $('startBtn').addEventListener('click', function () {
    showScreen('screen-lv1');
  });

  /* Insights Modal */
  function openInsights() {
    $('insightModal').hidden = false;
    syncModalBackdrop();
    $('insClose').focus();
    $('liveRegion').textContent = 'Insights overlay opened.';
  }
  function closeInsights() {
    $('insightModal').hidden = true;
    syncModalBackdrop();
    $('liveRegion').textContent = '';
  }
  $('insHead').addEventListener('click', openInsights);
  $('insClose').addEventListener('click', closeInsights);
  $('insightModal').addEventListener('click', function (e) {
    if (e.target === $('insightModal')) closeInsights();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (!$('insightModal').hidden) closeInsights();
      if (!$('summaryCard').hidden) closeSummary();
    }
  });

  /* Summary Modal Popup */
  function openSummary(lvl, sc, max, badgeText, goldHint, onAgain, onNext) {
    $('sumLvlNum').textContent = lvl;
    $('sumScoreNum').textContent = sc;
    $('sumMaxNum').textContent = max;
    $('summaryBadge').textContent = badgeText;
    $('summaryGoldHint').textContent = goldHint;
    
    var nextLabel = lvl < 3 ? 'Go to level ' + (lvl + 1) : 'See my results';
    $('sumGoNext').textContent = nextLabel;

    $('sumPlayAgain').onclick = function () {
      closeSummary();
      onAgain();
    };
    $('sumGoNext').onclick = function () {
      closeSummary();
      onNext();
    };

    $('summaryCard').hidden = false;
    syncModalBackdrop();
  }

  function closeSummary() {
    $('summaryCard').hidden = true;
    syncModalBackdrop();
  }

  /* ==========================================================================
     3. CURVE ENGINE (SVG Drawing)
     ========================================================================== */
  var NS = 'http://www.w3.org/2000/svg';
  function createSvg(parent, name, attrs, text) {
    var elem = document.createElementNS(NS, name);
    for (var k in attrs) elem.setAttribute(k, attrs[k]);
    if (text != null) elem.textContent = text;
    if (parent) parent.appendChild(elem);
    return elem;
  }

  var W = 640, H_CH = 300, ML = 44, MR = 16, MT = 16, MB = 34;
  var PW = W - ML - MR, PH = H_CH - MT - MB;
  var CUT1 = 0.16, CUT2 = 0.84;

  function toX(t) { return ML + t * PW; }
  function toY(v) { return MT + (1 - v) * PH; }

  function buildCurveChart(svg) {
    svg.innerHTML = '';
    var N = 120;
    var bPoints = [], dPoints = [];
    for (var i = 0; i <= N; i++) {
      var t = i / N;
      bPoints.push([toX(t), toY(H.birth(t))]);
      dPoints.push([toX(t), toY(H.death(t))]);
    }
    function makePath(pts) {
      return pts.map(function (p, idx) {
        return (idx ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      }).join(' ');
    }

    /* Grid lines */
    var gridG = createSvg(svg, 'g', { 'class': 'chart-grid-lines' });
    [0.2, 0.4, 0.6, 0.8].forEach(function (frac) {
      createSvg(gridG, 'line', { x1: ML, y1: toY(frac), x2: ML + PW, y2: toY(frac), stroke: '#ebd9b8', 'stroke-width': '1' });
      createSvg(gridG, 'line', { x1: toX(frac), y1: MT, x2: toX(frac), y2: MT + PH, stroke: '#ebd9b8', 'stroke-width': '1' });
    });

    /* Stage bands (hidden until revealed) */
    var bandsG = createSvg(svg, 'g', { 'class': 'stage-band' });
    [[0, CUT1, 'rgba(31,111,178,0.12)', 'Stage 1'],
     [CUT1, CUT2, 'rgba(214,69,42,0.12)', 'Stage 2'],
     [CUT2, 1, 'rgba(46,157,107,0.15)', 'Stage 3']].forEach(function (b) {
      createSvg(bandsG, 'rect', { x: toX(b[0]), y: MT, width: toX(b[1]) - toX(b[0]), height: PH, fill: b[2] });
      createSvg(bandsG, 'text', { x: (toX(b[0]) + toX(b[1])) / 2, y: MT + 18, 'class': 'stage-band-lbl' }, b[3]);
    });
    [CUT1, CUT2].forEach(function (c) {
      createSvg(bandsG, 'line', { x1: toX(c), y1: MT, x2: toX(c), y2: MT + PH, 'class': 'stage-divider' });
    });

    /* Axes */
    createSvg(svg, 'line', { x1: ML, y1: MT, x2: ML, y2: MT + PH, 'class': 'chart-axis-line' });
    createSvg(svg, 'line', { x1: ML, y1: MT + PH, x2: ML + PW, y2: MT + PH, 'class': 'chart-axis-line' });
    createSvg(svg, 'text', { x: 14, y: MT + PH / 2, 'class': 'chart-axis-label', 'text-anchor': 'middle',
      transform: 'rotate(-90 14 ' + (MT + PH / 2) + ')' }, 'Birth and death rates');    ``
    createSvg(svg, 'text', { x: ML + PW / 2, y: H_CH - 10, 'class': 'chart-axis-label', 'text-anchor': 'middle' }, 'Time');

    /* Gap fill polygon */
    var g1 = createSvg(svg, 'path', { d: '', 'class': 'gapfill' });
    var g2 = createSvg(svg, 'path', { d: '', 'class': 'gapneg' });

    /* Curves */
    createSvg(svg, 'path', { d: makePath(bPoints), 'class': 'curve curve--birth' });
    createSvg(svg, 'path', { d: makePath(dPoints), 'class': 'curve curve--death' });

    /* Labels */
    createSvg(svg, 'text', { x: toX(0.02), y: toY(H.birth(0.02)) - 10, 'class': 'curve-lbl curve-lbl--birth' }, 'Birth rate');
    createSvg(svg, 'text', { x: toX(0.02), y: toY(H.death(0.02)) + 22, 'class': 'curve-lbl curve-lbl--death' }, 'Death rate');

    /* Labels for natural increase */
    var gl1 = createSvg(svg, 'text', { x: toX(0.42), y: toY(0.70), 'class': 'gaplbl' }, 'Natural increase in population');
    var gl3 = createSvg(svg, 'text', { x: toX(1.0) - 4, y: toY(0.12), 'class': 'gaplbl', style: 'text-anchor:end' }, 'More deaths than births');

    /* Marker */
    var vline = createSvg(svg, 'line', { x1: 0, y1: MT, x2: 0, y2: MT + PH, 'class': 'marker-line' });
    var ring  = createSvg(svg, 'circle', { r: 10, 'class': 'ring-pulse' });
    var dotB  = createSvg(svg, 'circle', { r: 8, 'class': 'marker-dot-birth' });
    var dotD  = createSvg(svg, 'circle', { r: 8, 'class': 'marker-dot-death' });

    var bandsOn = false, curTime = 0;

    function buildRegion(upTo, test) {
      var segs = [], cur = [];
      for (var k = 0; k <= upTo; k++) {
        var tt = k / N, bv = H.birth(tt), dv = H.death(tt);
        if (test(bv, dv)) cur.push([toX(tt), toY(bv), toY(dv)]);
        else if (cur.length) { segs.push(cur); cur = []; }
      }
      if (cur.length) segs.push(cur);
      return segs.map(function (s) {
        var top = s.map(function (p, j) { return (j ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
        var bot = s.slice().reverse().map(function (p) { return 'L' + p[0].toFixed(1) + ' ' + p[2].toFixed(1); }).join(' ');
        return top + ' ' + bot + ' Z';
      }).join(' ');
    }

    function syncLabels() {
      var pos = bandsOn && curTime >= 0.3;
      var neg = bandsOn && curTime >= 0.88;
      gl1.classList.toggle('show', pos);
      gl3.classList.toggle('show', neg);
    }

    function setT(t) {
      curTime = t;
      var x = toX(t), bv = H.birth(t), dv = H.death(t);
      vline.setAttribute('x1', x); vline.setAttribute('x2', x);
      dotB.setAttribute('cx', x); dotB.setAttribute('cy', toY(bv));
      dotD.setAttribute('cx', x); dotD.setAttribute('cy', toY(dv));
      ring.setAttribute('cx', x); ring.setAttribute('cy', (toY(bv) + toY(dv)) / 2);
      var up = Math.round(t * N);
      g1.setAttribute('d', buildRegion(up, function (b, d) { return b >= d; }));
      g2.setAttribute('d', buildRegion(up, function (b, d) { return b < d; }));
      syncLabels();
    }

    function pulse() {
      if (reduce) return;
      ring.classList.remove('go');
      void ring.getBoundingClientRect();
      ring.classList.add('go');
    }

    function showBands(on) {
      bandsOn = on;
      bandsG.classList.toggle('show', on);
      syncLabels();
    }

    return { setT: setT, pulse: pulse, showBands: showBands };
  }

  /* ==========================================================================
     4. LEVEL 1: READ THE GRAPH
     ========================================================================== */
  var chart1 = buildCurveChart($('chart1'));
  var slider1 = $('time1');
  var steps1 = d.level1.steps;
  var st1, cur1;

  function score1() {
    return st1.reduce(function (acc, s) { return acc + s.pts; }, 0);
  }

  function reset1() {
    st1 = steps1.map(function () { return { status: 'open', picked: null, pts: 0, seen: false }; });
    cur1 = 0;
    chart1.showBands(false);
    slider1.value = 70;
    chart1.setT(0.70);
    render1();
  }

  function renderRightHeader(container, num, title, countLabel, curIdx, totalCount, score, maxScore, stArray) {
    container.innerHTML = '';
    var hdr = el('div', 'right-header');
    
    var leftGrp = el('div', 'right-title-badge');
    var circ = el('span', 'num-circ');
    circ.textContent = num;
    var nameSpan = el('span');
    nameSpan.textContent = title;
    leftGrp.appendChild(circ);
    leftGrp.appendChild(nameSpan);

    var rightGrp = el('div', 'right-status-group');
    var labelSpan = el('span');
    labelSpan.textContent = countLabel;
    rightGrp.appendChild(labelSpan);

    var dotsWrap = el('div', 'status-dots');
    for (var i = 0; i < totalCount; i++) {
      var dot = el('div', 'sq-dot');
      var st = stArray[i];
      if (st.status === 'answered') {
        dot.classList.add(st.pts > 0 ? 'ok' : 'bad');
      } else if (st.status === 'revealed' || st.status === 'skipped') {
        dot.style.background = '#9e9e9e';
      }
      if (i === curIdx) dot.classList.add('cur');
      dotsWrap.appendChild(dot);
    }
    rightGrp.appendChild(dotsWrap);

    var scoreSpan = el('span', 'score-text');
    scoreSpan.textContent = 'Score: ' + score + ' of ' + maxScore;
    rightGrp.appendChild(scoreSpan);

    hdr.appendChild(leftGrp);
    hdr.appendChild(rightGrp);
    container.appendChild(hdr);
  }

  function render1() {
    var p1 = $('p1');
    var p = steps1[cur1];
    var s = st1[cur1];
    var isDone = s.status === 'answered' || s.status === 'revealed';

    /* Toggle tutorial swirl arrow on task 1 */
    $('tutorialArrow').hidden = !(cur1 === 0 && s.status === 'open');

    renderRightHeader(p1, '1', 'Read the graph', 'Question', cur1, steps1.length, score1(), MAX[1], st1);

    var qP = el('p', 'q-prompt');
    qP.textContent = p.q;
    p1.appendChild(qP);

    var subP = el('p', 'q-subtext');
    subP.textContent = p.kind === 'find'
      ? 'Drag the slider under the graph, then press Check answer'
      : 'Now look closely at the position of the marker on the graph.';
    p1.appendChild(subP);

    /* MCQ alignment: if prev was find, ensure marker matches */
    if (p.kind === 'mcq' && s.status === 'open' && !s.seen) {
      s.seen = true;
      var prev = steps1[cur1 - 1];
      if (prev && prev.kind === 'find' && !prev.ok(parseFloat(slider1.value))) {
        slider1.value = prev.pos;
        chart1.setT(prev.pos / 100);
      }
    }

    /* Content Area */
    if (p.kind === 'find') {
      var fbBox = el('div', 'find-feedback-card');
      fbBox.id = 'p1FindFb';
      fbBox.hidden = true;
      p1.appendChild(fbBox);

      if (s.status === 'answered') {
        fbBox.hidden = false;
        fbBox.className = 'find-feedback-card';
        fbBox.innerHTML = '<span class="feedback-tag-pill">Don\'t miss out</span>' +
          '<b>Correct.</b> ' + p.good;
      } else if (s.status === 'revealed') {
        fbBox.hidden = false;
        fbBox.className = 'find-feedback-card find-feedback-card--hint';
        fbBox.innerHTML = '<span class="feedback-tag-pill">Answer revealed</span>' +
          '<b>The marker has moved to a correct spot.</b> ' + p.good;
      }
    } else {
      /* MCQ Options */
      var list = el('div', 'mcq-options-list');
      p.opts.forEach(function (o, idx) {
        var wrap = el('div', 'mcq-item-wrap');
        var btn = el('button', 'mcq-option-btn');
        btn.type = 'button';

        var icon = el('span', 'opt-indicator-icon');
        var textSpan = el('span');
        textSpan.textContent = o.t;
        btn.appendChild(icon);
        btn.appendChild(textSpan);

        var whyP = el('p', 'mcq-explanation-text');
        whyP.hidden = true;

        if (isDone) {
          btn.disabled = true;
          whyP.hidden = false;
          if (idx === p.key) {
            btn.classList.add('is-correct');
            icon.innerHTML = '&#10003;';
            whyP.innerHTML = '<b>Right.</b> ' + o.why;
          } else {
            if (s.picked === idx) {
              btn.classList.add('is-wrong');
              icon.innerHTML = '&#10005;';
              whyP.innerHTML = '<b>Not quite.</b> ' + o.why;
            } else {
              whyP.innerHTML = '<b>Why not?</b> ' + o.why;
            }
          }
        } else {
          btn.addEventListener('click', function () {
            pick1(idx);
          });
        }

        wrap.appendChild(btn);
        wrap.appendChild(whyP);
        list.appendChild(wrap);
      });
      p1.appendChild(list);
    }

    /* Actions Bar (inside right white card) */
    var acts = el('div', 'right-actions-bar');

    var nextBtn = el('button', 'btn-action btn--next-task');
    nextBtn.textContent = cur1 === steps1.length - 1 ? 'See my result' : 'Next task';
    nextBtn.type = 'button';
    nextBtn.disabled = !isDone && s.status !== 'skipped';
    if (isDone || s.status === 'skipped') nextBtn.classList.add('active');
    nextBtn.addEventListener('click', next1);
    acts.appendChild(nextBtn);

    var skipBtn = el('button', 'btn-action btn--skip');
    skipBtn.textContent = 'Skip';
    skipBtn.type = 'button';
    skipBtn.disabled = isDone;
    skipBtn.addEventListener('click', skip1);
    acts.appendChild(skipBtn);

    p1.appendChild(acts);

    /* Stage Bottom Buttons (Exact coordinates from en_eco_8_wg217.svg) */
    var stageChk = $('stageChkBtn');
    if (stageChk) {
      stageChk.hidden = !(p.kind === 'find' && s.status === 'open');
      stageChk.textContent = 'Check answer';
      stageChk.onclick = check1;
    }
    var stageRev = $('stageRevBtn');
    if (stageRev) {
      stageRev.hidden = isDone || s.status === 'skipped';
      stageRev.onclick = reveal1;
    }
  }

  function pick1(idx) {
    var p = steps1[cur1], s = st1[cur1];
    s.picked = idx;
    s.status = 'answered';
    s.pts = idx === p.key ? 1 : 0;
    $('liveRegion').textContent = idx === p.key ? 'Correct.' : 'Not quite.';
    render1();
  }

  function check1() {
    var p = steps1[cur1], s = st1[cur1];
    var val = parseFloat(slider1.value);
    $('tutorialArrow').hidden = true;

    if (p.ok(val)) {
      s.status = 'answered';
      s.pts = 1;
      chart1.pulse();
      $('liveRegion').textContent = 'Correct.';
      render1();
    } else {
      var fbBox = $('p1FindFb');
      if (fbBox) {
        fbBox.hidden = false;
        fbBox.className = 'find-feedback-card find-feedback-card--hint';
        fbBox.innerHTML = '<span class="feedback-tag-pill">Think about it</span>' +
          '<b>Not quite.</b> ' + p.hint + ' Try again, or use Reveal answer.';
      }
      $('liveRegion').textContent = 'Not quite. ' + p.hint;
    }
  }

  function reveal1() {
    var p = steps1[cur1], s = st1[cur1];
    s.status = 'revealed';
    s.pts = 0;
    $('tutorialArrow').hidden = true;
    if (p.kind === 'find') {
      slider1.value = p.pos;
      chart1.setT(p.pos / 100);
      chart1.pulse();
    }
    render1();
  }

  function skip1() {
    var p = steps1[cur1];
    st1[cur1].status = 'skipped';
    $('tutorialArrow').hidden = true;
    if (p.kind === 'find') {
      slider1.value = p.pos;
      chart1.setT(p.pos / 100);
    }
    next1();
  }

  function next1() {
    if (cur1 < steps1.length - 1) {
      cur1++;
      render1();
    } else {
      finish1();
    }
  }

  function finish1() {
    var sc = score1();
    var nResolved = st1.filter(function (s) { return s.status === 'answered' || s.status === 'revealed'; }).length;
    var ok = nResolved >= 5 && sc > 0;
    var isGold = ok && sc >= 5;
    if (ok) earnBadge(1, isGold);
    best[1] = Math.max(best[1], sc);
    chart1.showBands(true);

    var badgeMsg = isGold ? d.level1.summary.msgs.gold : (ok ? d.level1.summary.msgs.badge : d.level1.summary.msgs.none);
    var goldHint = isGold ? 'You earned the highest badge!' : 'Get 5 or more right on your own to make it gold.';

    openSummary(1, sc, MAX[1], badgeMsg, goldHint, reset1, function () {
      showScreen('screen-lv2');
    });
  }

  slider1.addEventListener('input', function () {
    chart1.setT(slider1.value / 100);
    $('tutorialArrow').hidden = true;
    var fbBox = $('p1FindFb');
    if (fbBox && st1[cur1].status === 'open') fbBox.hidden = true;
  });

  /* ==========================================================================
     5. LEVEL 2: NAME THE STAGE
     ========================================================================== */
  var chart2 = buildCurveChart($('chart2'));
  var cases2 = d.level2.cases;
  var CHAR2  = d.characteristics;
  var st2, cur2;

  function score2() {
    return st2.reduce(function (acc, s) { return acc + s.pts; }, 0);
  }

  function reset2() {
    st2 = cases2.map(function () { return { status: 'open', stageSel: null, clueSel: null, pts: 0 }; });
    cur2 = 0;
    render2();
  }

  function render2() {
    var c = cases2[cur2];
    var s = st2[cur2];
    var isLocked = s.status === 'answered' || s.status === 'revealed';

    /* Left Column */
    $('l2tag').textContent = 'Level 2: ' + c.name;
    $('l2ctx').textContent = c.ctx;

    var statsTb = $('l2stats');
    statsTb.innerHTML = '';
    c.stats.forEach(function (row) {
      var tr = el('tr');
      var td1 = el('td'); td1.textContent = row[0];
      var td2 = el('td'); td2.textContent = row[1];
      tr.appendChild(td1); tr.appendChild(td2);
      statsTb.appendChild(tr);
    });

    $('l2tab').hidden = isLocked;
    $('l2char').hidden = !isLocked;
    if (isLocked) {
      $('l2char').innerHTML = '<b>Stage ' + c.answer + ': what to remember</b><ul>' +
        CHAR2[c.answer].map(function (it) { return '<li>' + it + '</li>'; }).join('') + '</ul>';
    }

    chart2.setT(c.pos / 100);
    chart2.showBands(isLocked);

    /* Right Column */
    var p2 = $('p2');
    renderRightHeader(p2, '2', 'Name the stage', 'Case', cur2, cases2.length, score2(), MAX[2], st2);

    var qP = el('p', 'q-prompt');
    qP.textContent = 'Which stage is this country in?';
    p2.appendChild(qP);

    var subP = el('p', 'q-subtext');
    subP.textContent = 'The marker on the graph shows where this country is. Use the graph and the table.';
    p2.appendChild(subP);

    /* Stage buttons */
    var stgRow = el('div', 'stage-buttons-row');
    [1, 2, 3].forEach(function (stgNum) {
      var btn = el('button', 'stage-btn');
      btn.type = 'button';
      var numSpan = el('span', 'stage-num-badge');
      numSpan.textContent = stgNum;
      var lblSpan = el('span');
      lblSpan.textContent = 'Stage';
      btn.appendChild(lblSpan);
      btn.appendChild(numSpan);

      if (isLocked) {
        btn.disabled = true;
        if (stgNum === c.answer) btn.classList.add('right');
        else if (s.stageSel === stgNum) btn.classList.add('wrong');
      } else {
        if (s.stageSel === stgNum) btn.classList.add('selected');
        btn.addEventListener('click', function () {
          s.stageSel = stgNum;
          render2();
        });
      }
      stgRow.appendChild(btn);
    });
    p2.appendChild(stgRow);

    /* Clue question appears when a stage is chosen */
    if (s.stageSel !== null || isLocked) {
      var clueTitle = el('p', 'l2-clue-title');
      clueTitle.textContent = 'Which one clue proves it best?';
      p2.appendChild(clueTitle);

      var clueList = el('div', 'mcq-options-list');
      c.opts.forEach(function (o, idx) {
        var wrap = el('div', 'mcq-item-wrap');
        var btn = el('button', 'mcq-option-btn');
        btn.type = 'button';

        var icon = el('span', 'opt-indicator-icon');
        var textSpan = el('span');
        textSpan.textContent = o.t;
        btn.appendChild(icon);
        btn.appendChild(textSpan);

        var whyP = el('p', 'mcq-explanation-text');
        whyP.hidden = true;

        if (isLocked) {
          btn.disabled = true;
          whyP.hidden = false;
          if (idx === c.key) {
            btn.classList.add('is-correct');
            icon.innerHTML = '&#10003;';
            whyP.innerHTML = '<b>Right.</b> ' + o.why;
          } else {
            if (s.clueSel === idx) {
              btn.classList.add('is-wrong');
              icon.innerHTML = '&#10005;';
              whyP.innerHTML = '<b>Not quite.</b> ' + o.why;
            } else {
              whyP.innerHTML = '<b>Why not?</b> ' + o.why;
            }
          }
        } else {
          if (s.clueSel === idx) btn.classList.add('is-correct');
          btn.addEventListener('click', function () {
            s.clueSel = idx;
            render2();
          });
        }

        wrap.appendChild(btn);
        wrap.appendChild(whyP);
        clueList.appendChild(wrap);
      });
      p2.appendChild(clueList);
    }

    /* Result pill box if locked */
    if (isLocked && s.status === 'answered') {
      var pillBox = el('div', 'l2-result-pill-box');
      var stOk = s.stageSel === c.answer;
      var clOk = s.clueSel === c.key;
      pillBox.textContent = 'Stage: ' + (stOk ? 'Correct' : 'Not quite') + '. Clue: ' + (clOk ? 'Correct' : 'Not quite');
      p2.appendChild(pillBox);
    }

    /* Actions Bar (inside right white card) */
    var acts = el('div', 'right-actions-bar');

    var nextBtn = el('button', 'btn-action btn--next-task');
    nextBtn.textContent = cur2 === cases2.length - 1 ? 'See my result' : 'Next task';
    nextBtn.type = 'button';
    nextBtn.disabled = !isLocked && s.status !== 'skipped';
    if (isLocked || s.status === 'skipped') nextBtn.classList.add('active');
    nextBtn.addEventListener('click', next2);
    acts.appendChild(nextBtn);

    var skipBtn = el('button', 'btn-action btn--skip');
    skipBtn.textContent = 'Skip';
    skipBtn.type = 'button';
    skipBtn.disabled = isLocked;
    skipBtn.addEventListener('click', skip2);
    acts.appendChild(skipBtn);

    p2.appendChild(acts);

    /* Stage Bottom Buttons */
    var stageChk = $('stageChkBtn');
    if (stageChk) {
      stageChk.hidden = isLocked;
      stageChk.textContent = 'Check answer';
      stageChk.disabled = !(s.stageSel !== null && s.clueSel !== null);
      stageChk.onclick = lock2;
    }
    var stageRev = $('stageRevBtn');
    if (stageRev) {
      stageRev.hidden = isLocked || s.status === 'skipped';
      stageRev.onclick = reveal2;
    }
  }

  function lock2() {
    var c = cases2[cur2], s = st2[cur2];
    if (s.stageSel === null || s.clueSel === null) return;
    s.status = 'answered';
    s.pts = (s.stageSel === c.answer ? 1 : 0) + (s.clueSel === c.key ? 1 : 0);
    chart2.pulse();
    render2();
  }

  function reveal2() {
    var c = cases2[cur2], s = st2[cur2];
    s.status = 'revealed';
    s.pts = 0;
    s.stageSel = c.answer;
    s.clueSel = c.key;
    chart2.pulse();
    render2();
  }

  function skip2() {
    st2[cur2].status = 'skipped';
    next2();
  }

  function next2() {
    if (cur2 < cases2.length - 1) {
      cur2++;
      render2();
    } else {
      finish2();
    }
  }

  function finish2() {
    var sc = score2();
    var nResolved = st2.filter(function (s) { return s.status === 'answered' || s.status === 'revealed'; }).length;
    var ok = nResolved >= 3 && sc > 0;
    var isGold = ok && sc >= 6;
    if (ok) earnBadge(2, isGold);
    best[2] = Math.max(best[2], sc);

    var badgeMsg = isGold ? d.level2.summary.msgs.gold : (ok ? d.level2.summary.msgs.badge : d.level2.summary.msgs.none);
    var goldHint = isGold ? 'You earned the highest badge!' : 'Score 6 or more on your own to make it gold.';

    openSummary(2, sc, MAX[2], badgeMsg, goldHint, reset2, function () {
      showScreen('screen-lv3');
    });
  }

  /* ==========================================================================
     6. LEVEL 3: ADVISE THE MINISTER
     ========================================================================== */
  var rounds3 = d.level3.rounds;
  var st3, cur3;

  function score3() {
    return st3.reduce(function (acc, s) { return acc + s.pts; }, 0);
  }

  function calcTrackPercent(pos) {
    if (pos <= 15) return (pos / 15) * 33.3;
    if (pos <= 83) return 33.3 + ((pos - 16) / 68) * 33.3;
    return 66.6 + ((pos - 84) / 16) * 33.4;
  }

  function setCountryPointer(pos) {
    $('ptr3').style.left = calcTrackPercent(pos).toFixed(1) + '%';
  }

  function reset3() {
    st3 = rounds3.map(function () { return { status: 'open', picked: null, tried: [], pts: 0 }; });
    cur3 = 0;
    render3(false);
  }

  function render3(animatePointer) {
    var r = rounds3[cur3];
    var s = st3[cur3];
    var isDone = s.status === 'answered' || s.status === 'revealed';

    /* Left column */
    $('l3brief').textContent = r.brief;
    if (animatePointer && !reduce) {
      setCountryPointer(r.at);
      void $('ptr3').offsetWidth;
      setCountryPointer(r.after);
    } else {
      setCountryPointer(isDone ? r.after : r.at);
    }

    /* Right column */
    var p3 = $('p3');
    renderRightHeader(p3, '3', 'Advise the minister', 'Round', cur3, rounds3.length, score3(), MAX[3], st3);

    var qP = el('p', 'q-prompt');
    qP.textContent = r.q;
    p3.appendChild(qP);

    var subP = el('p', 'q-subtext');
    subP.textContent = 'Read the situation on the left, then choose the best option.';
    p3.appendChild(subP);

    /* Options */
    var list = el('div', 'mcq-options-list');
    r.opts.forEach(function (o, idx) {
      var wrap = el('div', 'mcq-item-wrap');
      var btn = el('button', 'mcq-option-btn');
      btn.type = 'button';

      var icon = el('span', 'opt-indicator-icon');
      var textSpan = el('span');
      textSpan.textContent = o.t;
      btn.appendChild(icon);
      btn.appendChild(textSpan);

      var whyP = el('p', 'mcq-explanation-text');
      whyP.hidden = true;

      var wasTried = s.tried.indexOf(idx) >= 0;

      if (isDone) {
        btn.disabled = true;
        whyP.hidden = false;
        if (idx === r.key) {
          btn.classList.add('is-correct');
          icon.innerHTML = '&#10003;';
          whyP.innerHTML = '<b>Right.</b> ' + o.why;
        } else {
          if (s.picked === idx || wasTried) {
            btn.classList.add('is-wrong');
            icon.innerHTML = '&#10005;';
            whyP.innerHTML = '<b>Not quite.</b> ' + o.why;
          } else {
            whyP.innerHTML = '<b>Why not?</b> ' + o.why;
          }
        }
      } else if (wasTried) {
        btn.disabled = true;
        btn.classList.add('is-wrong');
        icon.innerHTML = '&#10005;';
        whyP.hidden = false;
        whyP.innerHTML = '<b>Not quite.</b> ' + o.why;
      } else {
        btn.addEventListener('click', function () {
          pick3(idx);
        });
      }

      wrap.appendChild(btn);
      wrap.appendChild(whyP);
      list.appendChild(wrap);
    });
    p3.appendChild(list);

    /* Actions Bar (inside right white card) */
    var acts = el('div', 'right-actions-bar');

    var nextBtn = el('button', 'btn-action btn--next-task');
    nextBtn.textContent = cur3 === rounds3.length - 1 ? 'See my result' : 'Next task';
    nextBtn.type = 'button';
    nextBtn.disabled = !isDone && s.status !== 'skipped';
    if (isDone || s.status === 'skipped') nextBtn.classList.add('active');
    nextBtn.addEventListener('click', next3);
    acts.appendChild(nextBtn);

    var skipBtn = el('button', 'btn-action btn--skip');
    skipBtn.textContent = 'Skip';
    skipBtn.type = 'button';
    skipBtn.disabled = isDone;
    skipBtn.addEventListener('click', skip3);
    acts.appendChild(skipBtn);

    p3.appendChild(acts);

    /* Stage Bottom Buttons */
    var stageChk = $('stageChkBtn');
    if (stageChk) stageChk.hidden = true;
    var stageRev = $('stageRevBtn');
    if (stageRev) {
      stageRev.hidden = isDone || s.status === 'skipped';
      stageRev.onclick = reveal3;
    }
  }

  function pick3(idx) {
    var r = rounds3[cur3], s = st3[cur3];
    if (idx === r.key) {
      s.status = 'answered';
      s.picked = idx;
      s.pts = Math.max(0, 2 - s.tried.length);
      $('liveRegion').textContent = 'Right.';
      render3(true);
    } else {
      s.tried.push(idx);
      if (s.tried.length >= 2) {
        s.status = 'revealed';
        s.pts = 0;
        $('liveRegion').textContent = 'Two tries used. Answer revealed.';
        render3(true);
      } else {
        $('liveRegion').textContent = 'Not quite. One more try.';
        render3(false);
      }
    }
  }

  function reveal3() {
    var s = st3[cur3];
    s.status = 'revealed';
    s.pts = 0;
    render3(true);
  }

  function skip3() {
    st3[cur3].status = 'skipped';
    next3();
  }

  function next3() {
    if (cur3 < rounds3.length - 1) {
      cur3++;
      render3(false);
    } else {
      finish3();
    }
  }

  function finish3() {
    var sc = score3();
    var nResolved = st3.filter(function (s) { return s.status === 'answered' || s.status === 'revealed'; }).length;
    var ok = nResolved >= 3 && sc > 0;
    var isGold = ok && sc >= 6;
    if (ok) earnBadge(3, isGold);
    best[3] = Math.max(best[3], sc);

    var badgeMsg = isGold ? d.level3.summary.msgs.gold : (ok ? d.level3.summary.msgs.badge : d.level3.summary.msgs.none);
    var goldHint = isGold ? 'You earned the highest badge!' : 'Score 6 or more on your own to make it gold.';

    openSummary(3, sc, MAX[3], badgeMsg, goldHint, reset3, function () {
      showScreen('screen-results');
    });
  }

  /* ==========================================================================
     7. RESULTS SCREEN
     ========================================================================== */
  function renderResults() {
    best[1] = Math.max(best[1], score1());
    best[2] = Math.max(best[2], score2());
    best[3] = Math.max(best[3], score3());

    var totalBest = best[1] + best[2] + best[3];
    var totalMax = MAX[1] + MAX[2] + MAX[3];
    $('totalScore').textContent = 'Total score: ' + totalBest + ' of ' + totalMax;

    var container = $('badgeCards');
    container.innerHTML = '';

    [1, 2, 3].forEach(function (lvl) {
      var card = el('div', 'res-level-card');
      
      var rosette = el('img', 'res-rosette');
      rosette.src = './assets/svg/rosette.svg';
      rosette.alt = 'Rosette';
      card.appendChild(rosette);

      var lvlHead = el('div', 'res-level-head');
      lvlHead.innerHTML = 'Level <span class="badge-circle-num">' + lvl + '</span>';
      card.appendChild(lvlHead);

      var titleDiv = el('div', 'res-level-title');
      titleDiv.textContent = levelNames[lvl];
      card.appendChild(titleDiv);

      var statusDiv = el('div', 'res-level-status');
      var stStr = gold[lvl] ? 'Gold badge earned!' : (earned[lvl] ? 'Badge earned!' : (best[lvl] > 0 ? 'In progress' : 'Not started'));
      statusDiv.textContent = stStr + ' Best: ' + best[lvl] + ' of ' + MAX[lvl];
      card.appendChild(statusDiv);

      var playBtn = el('button', 'res-btn-play');
      playBtn.type = 'button';
      playBtn.textContent = earned[lvl] ? 'Play again' : 'Go to Level ' + lvl;
      playBtn.addEventListener('click', function () {
        if (lvl === 1) { reset1(); showScreen('screen-lv1'); }
        else if (lvl === 2) { reset2(); showScreen('screen-lv2'); }
        else { reset3(); showScreen('screen-lv3'); }
      });
      card.appendChild(playBtn);

      container.appendChild(card);
    });
  }

  $('resetAll').addEventListener('click', function () {
    earned = { 1: false, 2: false, 3: false };
    gold   = { 1: false, 2: false, 3: false };
    best   = { 1: 0, 2: 0, 3: 0 };
    [1, 2, 3].forEach(function (n) {
      var b = $('bdg' + n);
      if (b) { b.classList.remove('earned'); b.classList.remove('gold'); }
    });
    reset1();
    reset2();
    reset3();
    showScreen('screen-intro');
  });

  /* ==========================================================================
     8. INITIALISE
     ========================================================================== */
  reset1();
  reset2();
  reset3();
  showScreen('screen-intro');

})();
