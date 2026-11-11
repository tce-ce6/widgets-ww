/* Find the Market Price (wg184): find where Qs = Qd, then predict how news shifts the curves. */
(function () {
  'use strict';

  const { sub, find, explain, news } = window.MARKET_PRICE_CONTENT;

  const NS = 'http://www.w3.org/2000/svg';
  const START_PRICE = 50;
  const BASE_PRICE = 70;
  const CLEAR_GAP = 1;
  const EQ_GAP = 0.75;
  const SHIFT_MS = 700;
  const GLIDE_MS = 600;
  const SETTLE_TICK_MS = 260;
  const SETTLE_RATE = 0.08;

  /* Plot area on the stage, and its economic scale. */
  const PLOT = { left: 983, right: 1671, top: 237, bottom: 635 };
  const P_MAX = 100;
  const Q_MAX = 120;

  const COLOR = {
    demand: '#2e7ed9',
    supply: '#14942a',
    short: '#eb0000',
    surplus: '#7a5fb8',
    axis: '#4cc0a5',
    grid: '#98e3e6',
    plot: '#f2ffd9',
    ghost: '#7d7d7d',
    baseE: '#8a8b8a',
  };

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const stage = $('stage');
  const chart = $('chart');
  const slider = $('priceSlider');
  const openBtn = $('openBtn');
  const settleBtn = $('settleBtn');
  const toExplainBtn = $('toExplainBtn');
  const toNewsBtn = $('toNewsBtn');
  const nextBtn = $('nextBtn');
  const dayNote = $('dayNote');
  const wideNote = $('wideNote');
  const board = $('board');
  const shiftFb = $('shiftFb');
  const priceFb = $('priceFb');
  const priceCard = $('priceCard');
  const printing = $('printing');
  const newsScene = $('newsScene');
  const fpDemand = $('fpDemand');
  const fpSupply = $('fpSupply');
  const insights = $('insights');

  let price = START_PRICE;
  let shiftD = 0;
  let shiftS = 0;
  let days = 0;
  let cardIndex = 0;
  let busy = false;
  let settleTimer = 0;
  let fpBusy = false;
  /* Bumped on Reset, so that animations still running stop touching the screen. */
  let runId = 0;

  /* ---------- the market model ---------- */
  const qd = (p) => Math.max(0, 120 - p + shiftD);
  const qs = (p) => Math.max(0, 2 * p - 90 + shiftS);
  const gapAt = (p) => qd(p) - qs(p);
  const eqPrice = () => (210 + shiftD - shiftS) / 3;

  const xOf = (q) => PLOT.left + (q / Q_MAX) * (PLOT.right - PLOT.left);
  const yOf = (p) => PLOT.bottom - (p / P_MAX) * (PLOT.bottom - PLOT.top);

  /** Fits the fixed 1920x1080 stage inside the window, centred. */
  function fitStage() {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    const x = (window.innerWidth - 1920 * scale) / 2;
    const y = (window.innerHeight - 1080 * scale) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  }

  function goTo(id) {
    document.querySelectorAll('.screen.is-active').forEach((screen) => screen.classList.remove('is-active'));
    $(`screen-${id}`).classList.add('is-active');
  }

  function showPhase(phase) {
    document.querySelectorAll('[data-phase]').forEach((part) => {
      part.hidden = part.dataset.phase !== phase;
    });
    const step = { find: 0, explain: 1, news: 2, free: 2 }[phase];
    $('rail').querySelectorAll('.rail-step').forEach((item, i) => {
      item.classList.toggle('is-lit', i <= step);
      if (i === step) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
  }

  function hideAll(...parts) {
    parts.forEach((part) => {
      part.hidden = true;
    });
  }

  function showNote(node, kind, text) {
    node.classList.remove('is-ok', 'is-no', 'is-info');
    node.classList.add(`is-${kind}`);
    node.textContent = text;
    node.hidden = false;
  }

  /* ---------- the chart ---------- */
  function svg(name, attrs, text) {
    const node = document.createElementNS(NS, name);
    Object.keys(attrs).forEach((key) => node.setAttribute(key, attrs[key]));
    if (text !== undefined) node.textContent = text;
    chart.appendChild(node);
    return node;
  }

  function drawFrame() {
    svg('rect', { x: PLOT.left, y: PLOT.top, width: PLOT.right - PLOT.left, height: PLOT.bottom - PLOT.top, fill: COLOR.plot, stroke: COLOR.grid });
    [20, 40, 60, 80].forEach((p) => {
      svg('line', { x1: PLOT.left, y1: yOf(p), x2: PLOT.right, y2: yOf(p), stroke: COLOR.grid });
    });
    [20, 40, 60, 80, 100].forEach((q) => {
      svg('line', { x1: xOf(q), y1: PLOT.top, x2: xOf(q), y2: PLOT.bottom, stroke: COLOR.grid });
    });
    [0, 20, 40, 60, 80, 100].forEach((p) => {
      svg('text', { x: 942, y: yOf(p) + 4, 'text-anchor': 'middle', 'font-size': 22 }, String(p));
    });
    [0, 20, 40, 60, 80, 100, 120].forEach((q) => {
      svg('text', { x: xOf(q), y: 671, 'text-anchor': 'middle', 'font-size': 22 }, String(q));
    });
    /* Axis arrows */
    svg('rect', { x: 899, y: 240, width: 3, height: 390, fill: COLOR.axis });
    svg('polygon', { points: '900.5,226 910.5,255 890.5,255', fill: COLOR.axis });
    svg('rect', { x: 976, y: 700, width: 680, height: 3, fill: COLOR.axis });
    svg('polygon', { points: '1680,701.5 1652,691.5 1652,711.5', fill: COLOR.axis });
    svg('text', { x: 1291, y: 741, 'text-anchor': 'middle', 'font-size': 22 }, 'Quantity of plates per day');
    svg('text', { x: 866, y: 453, 'text-anchor': 'middle', 'font-size': 22, transform: 'rotate(-90 866 453)' }, 'Price per plate (₹)');
    /* Legend */
    svg('line', { x1: 1051, y1: 831, x2: 1105, y2: 831, stroke: COLOR.demand, 'stroke-width': 5, 'stroke-linecap': 'round' });
    svg('text', { x: 1122, y: 838, 'font-size': 18, fill: '#6056a0' }, 'Demand (buyers)');
    svg('line', { x1: 1289, y1: 831, x2: 1343, y2: 831, stroke: COLOR.supply, 'stroke-width': 5, 'stroke-linecap': 'round' });
    svg('text', { x: 1359, y: 838, 'font-size': 18, fill: '#00742b' }, 'Supply (sellers)');
  }

  drawFrame();

  const ghostAttrs = { stroke: COLOR.ghost, 'stroke-width': 1.5, 'stroke-dasharray': '6', visibility: 'hidden' };
  const demandGhost = svg('line', ghostAttrs);
  const supplyGhost = svg('line', ghostAttrs);
  const demandLine = svg('line', { stroke: COLOR.demand, 'stroke-width': 5, 'stroke-linecap': 'round' });
  const supplyLine = svg('line', { stroke: COLOR.supply, 'stroke-width': 5, 'stroke-linecap': 'round' });
  const demandLabel = svg('text', { 'font-size': 27, 'font-weight': 700, 'text-anchor': 'middle', fill: COLOR.demand }, 'Demand');
  const supplyLabel = svg('text', { 'font-size': 27, 'font-weight': 700, 'text-anchor': 'middle', fill: COLOR.supply }, 'Supply');
  const priceLine = svg('line', { stroke: '#000', 'stroke-dasharray': '3' });
  const gapBar = svg('line', { 'stroke-width': 5, visibility: 'hidden' });
  const baseMark = svg('g', { visibility: 'hidden' });
  const baseRing = svg('circle', { r: 13, fill: 'none', stroke: '#707070', 'stroke-width': 1.5 });
  const baseText = svg('text', { 'font-size': 27, 'font-weight': 700, 'text-anchor': 'middle', fill: COLOR.baseE, stroke: COLOR.plot, 'stroke-width': 6, 'paint-order': 'stroke' }, 'E');
  baseMark.append(baseRing, baseText);
  const qdDot = svg('circle', { r: 13.5, fill: COLOR.demand });
  const qsDot = svg('circle', { r: 13.5, fill: COLOR.supply });
  const primeMark = svg('text', { 'font-size': 27, 'font-weight': 700, 'text-anchor': 'middle', fill: COLOR.supply, visibility: 'hidden' }, 'E′');

  /** Curve ends, clipped to the plot at every shift. */
  function demandEnds(shift) {
    const a = 120 + shift;
    const low = Math.max(20, a - 120);
    const high = Math.min(100, a);
    return { x1: xOf(a - low), y1: yOf(low), x2: xOf(a - high), y2: yOf(high) };
  }

  function supplyEnds(shift) {
    const c = 90 - shift;
    const low = Math.max(20, c / 2);
    const high = Math.min(100, (120 + c) / 2);
    return { x1: xOf(2 * low - c), y1: yOf(low), x2: xOf(2 * high - c), y2: yOf(high) };
  }

  function setLine(line, ends) {
    Object.keys(ends).forEach((key) => line.setAttribute(key, ends[key]));
  }

  function setText(node, x, y) {
    node.setAttribute('x', x);
    node.setAttribute('y', y);
  }

  setLine(demandGhost, demandEnds(0));
  setLine(supplyGhost, supplyEnds(0));

  function drawCurves() {
    const d = demandEnds(shiftD);
    const s = supplyEnds(shiftS);
    setLine(demandLine, d);
    setLine(supplyLine, s);
    setText(demandLabel, Math.min(d.x1 - 17, 1620), Math.min(d.y1 + 36, 622));
    setText(supplyLabel, Math.min(s.x2 - 5, 1620), s.y2 + 57);
  }

  function setGhosts() {
    demandGhost.setAttribute('visibility', shiftD !== 0 ? 'visible' : 'hidden');
    supplyGhost.setAttribute('visibility', shiftS !== 0 ? 'visible' : 'hidden');
  }

  function placeBaseMark(p, q) {
    baseRing.setAttribute('cx', xOf(q));
    baseRing.setAttribute('cy', yOf(p));
    setText(baseText, xOf(q) + 3, yOf(p) - 24);
    baseMark.setAttribute('visibility', 'visible');
  }

  function placePrime(p, q) {
    setText(primeMark, xOf(q) + 13, yOf(p) - 26);
    primeMark.setAttribute('visibility', 'visible');
  }

  function hidePrime() {
    primeMark.setAttribute('visibility', 'hidden');
  }

  /* ---------- the board and the chart markers, from the current price ---------- */
  function render() {
    const d = qd(price);
    const s = qs(price);
    const y = yOf(price);
    const xd = xOf(d);
    const xs = xOf(s);
    const gap = d - s;
    const shown = Math.round(price);

    slider.setAttribute('aria-valuetext', `${shown} rupees`);
    $('priceOut').textContent = `₹${shown}`;
    $('qdOut').textContent = Math.round(d);
    $('qsOut').textContent = Math.round(s);
    $('fpPrice').textContent = `₹${shown}`;
    $('fpQd').textContent = Math.round(d);
    $('fpQs').textContent = Math.round(s);

    setLine(priceLine, { x1: 977, y1: y, x2: Math.max(xd, xs), y2: y });
    qdDot.setAttribute('cx', xd);
    qdDot.setAttribute('cy', y);
    qsDot.setAttribute('cx', xs);
    qsDot.setAttribute('cy', y);

    const cmp = $('cmpOut');
    const subLine = $('subOut');
    if (Math.abs(gap) < EQ_GAP) {
      gapBar.setAttribute('visibility', 'hidden');
      cmp.textContent = 'Qs = Qd';
      cmp.className = 'cmp-out is-eq';
      subLine.textContent = sub.eq;
      return;
    }
    const kind = gap > 0 ? 'short' : 'surplus';
    setLine(gapBar, { x1: xd, y1: y, x2: xs, y2: y });
    gapBar.setAttribute('stroke', COLOR[kind]);
    gapBar.setAttribute('visibility', 'visible');
    cmp.textContent = gap > 0 ? 'Qs < Qd' : 'Qs > Qd';
    cmp.className = `cmp-out is-${kind}`;
    subLine.textContent = sub[kind](Math.round(Math.abs(gap)));
  }

  function setPrice(value) {
    price = value;
    render();
  }

  /* ---------- animation ---------- */
  function tween(from, to, duration, step, done) {
    if (reduceMotion) {
      step(to);
      done();
      return;
    }
    const run = runId;
    let startedAt = 0;
    const frame = (now) => {
      if (run !== runId) return;
      if (!startedAt) startedAt = now;
      const k = Math.min((now - startedAt) / duration, 1);
      step(from + (to - from) * (1 - (1 - k) ** 3));
      if (k < 1) window.requestAnimationFrame(frame);
      else done();
    };
    window.requestAnimationFrame(frame);
  }

  function animateShift(toD, toS, done) {
    const fromD = shiftD;
    const fromS = shiftS;
    if (toD !== 0) demandGhost.setAttribute('visibility', 'visible');
    if (toS !== 0) supplyGhost.setAttribute('visibility', 'visible');
    tween(0, 1, SHIFT_MS, (k) => {
      shiftD = fromD + (toD - fromD) * k;
      shiftS = fromS + (toS - fromS) * k;
      drawCurves();
      render();
    }, () => {
      shiftD = toD;
      shiftS = toS;
      drawCurves();
      render();
      setGhosts();
      done();
    });
  }

  function animatePrice(to, done) {
    tween(price, to, GLIDE_MS, setPrice, () => {
      setPrice(to);
      done();
    });
  }

  /* ---------- find it ---------- */
  function startFind() {
    showPhase('find');
    hideAll(dayNote, wideNote, settleBtn, toExplainBtn, toNewsBtn, nextBtn, printing, priceCard, shiftFb, $('explainFb'));
    board.classList.remove('is-cleared');
    openBtn.hidden = false;
    openBtn.disabled = true;
    slider.value = START_PRICE;
    $('dayCount').textContent = '';
    setPrice(START_PRICE);
    slider.focus({ preventScroll: true });
  }

  function testPrice() {
    openBtn.disabled = false;
    setPrice(Number(slider.value));
    if (days > 0) showNote(wideNote, 'info', find.newPrice);
  }

  function runDay() {
    days += 1;
    $('dayCount').textContent = find.dayCount(days);
    const gap = gapAt(price);
    if (Math.abs(gap) <= CLEAR_GAP) {
      clearMarket();
      return;
    }
    const kind = gap > 0 ? 'short' : 'surplus';
    showNote(wideNote, 'no', find[kind](days, price, qd(price), qs(price), Math.abs(gap)));
  }

  /** The E mark and the settle button are the reward, so neither exists before this moment. */
  function clearMarket() {
    showNote(dayNote, 'ok', find.cleared(days, price, qd(price), qs(price)));
    placeBaseMark(price, qd(price));
    hideAll(wideNote, openBtn, $('sliderCard'));
    board.classList.add('is-cleared');
    settleBtn.hidden = false;
    settleBtn.disabled = false;
    toExplainBtn.hidden = false;
    toExplainBtn.disabled = false;
    toExplainBtn.focus({ preventScroll: true });
  }

  /** Starts the price far from the crossing and moves it by the excess, wherever the crossing lies. */
  function settle() {
    settleBtn.disabled = true;
    toExplainBtn.disabled = true;
    wideNote.hidden = true;
    const rest = eqPrice();
    const finish = () => {
      window.clearInterval(settleTimer);
      setPrice(rest);
      showNote(wideNote, 'info', find.settled(rest));
      settleBtn.disabled = false;
      toExplainBtn.disabled = false;
      toExplainBtn.focus({ preventScroll: true });
    };
    if (reduceMotion) {
      finish();
      return;
    }
    setPrice(price >= rest ? 30 : 95);
    settleTimer = window.setInterval(() => {
      const next = price + SETTLE_RATE * gapAt(price);
      if (Math.abs(gapAt(next)) < CLEAR_GAP) finish();
      else setPrice(next);
    }, SETTLE_TICK_MS);
  }

  /* ---------- buttons for the questions ---------- */
  function makeOptions(holder, options, onPick) {
    holder.textContent = '';
    options.forEach((option) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `opt${option.side ? ` opt--${option.side}` : ''}`;
      btn.textContent = option.text;
      btn.dataset.id = option.id;
      btn.addEventListener('click', () => onPick(option.id, btn));
      holder.appendChild(btn);
    });
  }

  function resetOptions(holder) {
    holder.querySelectorAll('.opt').forEach((btn) => {
      btn.disabled = false;
      btn.classList.remove('is-right', 'is-wrong');
    });
  }

  function lockOptions(holder) {
    holder.querySelectorAll('.opt').forEach((btn) => {
      btn.disabled = true;
    });
  }

  /* ---------- explain ---------- */
  function startExplain() {
    window.clearInterval(settleTimer);
    showPhase('explain');
    hideAll(dayNote, wideNote, openBtn, settleBtn, toExplainBtn, $('explainFb'));
    setPrice(eqPrice());
    const holder = $('explainOpts');
    resetOptions(holder);
    holder.querySelector('.opt').focus({ preventScroll: true });
  }

  function answerExplain(id, btn) {
    const holder = $('explainOpts');
    const right = id === explain.answer;
    const copy = right ? explain.right : explain.wrong;
    lockOptions(holder);
    btn.classList.add(right ? 'is-right' : 'is-wrong');
    holder.querySelector(`[data-id="${explain.answer}"]`).classList.add('is-right');
    $('explainScene').hidden = true;
    $('explainFbHead').textContent = copy.head;
    $('explainFbText').textContent = copy.text;
    $('explainFb').className = `check-fb is-${right ? 'ok' : 'no'}`;
    $('explainFb').hidden = false;
    toNewsBtn.hidden = false;
    toNewsBtn.focus({ preventScroll: true });
  }

  /* ---------- news days ---------- */
  function startNews() {
    showPhase('news');
    hideAll($('explainFb'), toNewsBtn);
    startCard(0);
  }

  /** Back to the base market first, so shifts never stack. */
  function startCard(i) {
    const card = news.cards[i];
    cardIndex = i;
    busy = true;
    $('edition').textContent = news.edition(i + 1, news.cards.length);
    $('headline').textContent = card.head;
    $('standfirst').textContent = card.stand;
    resetOptions($('shiftOpts'));
    resetOptions($('priceOpts'));
    hideAll(shiftFb, priceCard, printing, nextBtn, wideNote);
    newsScene.hidden = false;
    hidePrime();
    animateShift(0, 0, () => {
      animatePrice(BASE_PRICE, () => {
        busy = false;
        $('shiftOpts').querySelector('.opt').focus({ preventScroll: true });
      });
    });
  }

  function pickShift(id, btn) {
    if (busy) return;
    const card = news.cards[cardIndex];
    if (id !== card.shift) {
      btn.classList.add('is-wrong');
      btn.disabled = true;
      showNote(shiftFb, 'no', `${card.why[id]} Choose again.`);
      return;
    }
    btn.classList.add('is-right');
    lockOptions($('shiftOpts'));
    hideAll(shiftFb, newsScene);
    showNote(priceFb, 'ok', news.rightCall);
    priceCard.hidden = false;
    $('priceOpts').querySelector('.opt').focus({ preventScroll: true });
  }

  function pickPrice(id, btn) {
    if (busy) return;
    const card = news.cards[cardIndex];
    if (id !== card.price) {
      btn.classList.add('is-wrong');
      btn.disabled = true;
      showNote(priceFb, 'no', news.wrongPrice[card.price]);
      return;
    }
    btn.classList.add('is-right');
    lockOptions($('priceOpts'));
    showNote(priceFb, 'ok', news.rightCall);
    printing.hidden = false;
    busy = true;
    animateShift(card.toDemand, card.toSupply, () => {
      placePrime(card.newEq.p, card.newEq.q);
      animatePrice(card.newEq.p, () => {
        showNote(wideNote, 'ok', card.reveal);
        nextBtn.textContent = cardIndex < news.cards.length - 1 ? news.nextText : news.lastText;
        nextBtn.hidden = false;
        nextBtn.focus({ preventScroll: true });
        busy = false;
      });
    });
  }

  function nextCard() {
    if (busy) return;
    if (cardIndex < news.cards.length - 1) startCard(cardIndex + 1);
    else startFree();
  }

  /* ---------- free play ---------- */
  function startFree() {
    busy = true;
    showPhase('free');
    hideAll(shiftFb, priceCard, printing, nextBtn, wideNote);
    hidePrime();
    fpDemand.value = 0;
    fpSupply.value = 0;
    setFreeLabels();
    animateShift(0, 0, () => {
      animatePrice(BASE_PRICE, () => {
        busy = false;
        fpDemand.focus({ preventScroll: true });
      });
    });
  }

  function setFreeLabels() {
    [fpDemand, fpSupply].forEach((input) => {
      const value = Number(input.value);
      input.setAttribute('aria-valuetext', `${value > 0 ? 'plus ' : value < 0 ? 'minus ' : ''}${Math.abs(value)} plates`);
    });
  }

  /** Finishes the running animation, then catches up with the latest slider values. */
  function freeShift() {
    setFreeLabels();
    if (fpBusy || busy) return;
    fpBusy = true;
    animateShift(Number(fpDemand.value), Number(fpSupply.value), () => {
      const p = eqPrice();
      placeBaseMark(p, qd(p));
      animatePrice(p, () => {
        fpBusy = false;
        if (Number(fpDemand.value) !== shiftD || Number(fpSupply.value) !== shiftS) freeShift();
      });
    });
  }

  /* ---------- insights ---------- */
  function openInsights() {
    insights.hidden = false;
    $('insightsClose').focus({ preventScroll: true });
  }

  function closeInsights() {
    insights.hidden = true;
    $('insightsBtn').focus({ preventScroll: true });
  }

  /* ---------- start and reset ---------- */
  function resetMarket() {
    runId += 1;
    window.clearInterval(settleTimer);
    busy = false;
    fpBusy = false;
    days = 0;
    shiftD = 0;
    shiftS = 0;
    drawCurves();
    setGhosts();
    hidePrime();
    baseMark.setAttribute('visibility', 'hidden');
    insights.hidden = true;
  }

  function startWidget() {
    resetMarket();
    goTo('market');
    startFind();
  }

  function reset() {
    resetMarket();
    goTo('start');
    $('startBtn').focus({ preventScroll: true });
  }

  makeOptions($('explainOpts'), explain.options, answerExplain);
  makeOptions($('shiftOpts'), news.shifts, pickShift);
  makeOptions($('priceOpts'), news.prices, pickPrice);

  $('startBtn').addEventListener('click', startWidget);
  $('resetBtn').addEventListener('click', reset);
  slider.addEventListener('input', testPrice);
  openBtn.addEventListener('click', runDay);
  settleBtn.addEventListener('click', settle);
  toExplainBtn.addEventListener('click', startExplain);
  toNewsBtn.addEventListener('click', startNews);
  nextBtn.addEventListener('click', nextCard);
  fpDemand.addEventListener('input', freeShift);
  fpSupply.addEventListener('input', freeShift);
  $('insightsBtn').addEventListener('click', () => {
    if (insights.hidden) openInsights();
    else closeInsights();
  });
  $('insightsClose').addEventListener('click', closeInsights);
  document.addEventListener('keydown', (event) => {
    if (insights.hidden) return;
    if (event.key === 'Escape') closeInsights();
    if (event.key === 'Tab') {
      // Only the two buttons above the overlay can take focus while it is open.
      event.preventDefault();
      const close = $('insightsClose');
      (document.activeElement === close ? $('insightsBtn') : close).focus({ preventScroll: true });
    }
  });
  window.addEventListener('resize', fitStage);

  fitStage();
  drawCurves();
  render();
})();
