/* ==========================================================================
   wg192 — Explore The Stages of Water Cycle

   The learner taps any of the four stages to start the cycle there. Each
   stage plays its animation and fades in a description; then a blinking
   "Tap here" points to the next stage. Following the cue goes round the
   cycle (Evaporation → Condensation → Precipitation → Collection → …) for
   as long as the learner likes. Reset goes back to the start.

   Behaviour: reference/en_bio_09_wg192.pptx (slides and speaker notes).
   Layout: reference/AI/en_bio_09_wg192.svg. Animations: reference/Jason animation.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- stage scaling (1920 x 1080 design px) ---------- */
  const outer = $('#outer');
  function fitStage() {
    const s = Math.min(innerWidth / 1920, innerHeight / 1080);
    outer.style.width = `${1920 * s}px`;
    outer.style.height = `${1080 * s}px`;
    document.documentElement.style.setProperty('--s', s);
  }
  fitStage();
  addEventListener('resize', fitStage);

  /* ---------- content ---------- */
  const ORDER = ['evaporation', 'condensation', 'precipitation', 'collection'];
  const NAME = { evaporation: 'Evaporation', condensation: 'Condensation', precipitation: 'Precipitation', collection: 'Collection' };
  const DESC = {
    evaporation: 'The Sun heats the water of waterbodies like oceans. Water evaporates from the surface of those waterbodies as invisible vapour.',
    condensation: 'Higher up the air is colder. The water vapour cools and joins into tiny droplets to form clouds.',
    precipitation: 'When the water droplets become heavy in the air, they fall from the cloud as rain.',
    collection: 'The water gathered in rivers and underground, flows to the seas and oceans.'
  };
  // How each stage animation plays (frames at 30 fps), from the storyboard notes:
  //   evaporation:   vapour keeps rising (loop the whole comp)
  //   condensation:  clouds drift to the hills and turn dark, then stay (play once)
  //   precipitation: rain keeps falling (the clouds fade after frame 240, so loop 90-240)
  //   collection:    the river keeps flowing (the flow fades near the end, so loop 0-280)
  const PLAY = {
    evaporation: { first: [0, 161], loop: [0, 161] },
    condensation: { first: [0, 119], loop: null },
    precipitation: { first: [0, 240], loop: [90, 240] },
    collection: { first: [0, 280], loop: [0, 280] }
  };
  const CUE_AFTER = 5000;   // "Tap here" after 5 s (condensation: when its clouds have turned dark)

  /* ---------- animations ---------- */
  const clone = (d) => JSON.parse(JSON.stringify(d));
  const anims = {};
  $$('#scene .lottie-box').forEach((box) => {
    const k = box.dataset.stage;
    const a = lottie.loadAnimation({
      container: box, renderer: 'svg', loop: false, autoplay: false,
      animationData: clone(window.LOTTIE_DATA[k])
    });
    a.addEventListener('DOMLoaded', () => a.goToAndStop(0, true));
    anims[k] = a;
  });
  // Idle scene: the plain landscape (evaporation, frame 0)
  function showScene(k) {
    $$('#scene .lottie-box').forEach((b) => b.classList.toggle('on', b.dataset.stage === k));
  }

  const cues = {};
  $$('.tap-cue').forEach((box) => {
    const k = box.dataset.stage;
    // Evaporation / Condensation: cue on the left of the button, arrow pointing right.
    const data = (k === 'evaporation' || k === 'condensation') ? window.LOTTIE_DATA.tapLeft : window.LOTTIE_DATA.tapRight;
    cues[k] = lottie.loadAnimation({ container: box, renderer: 'svg', loop: true, autoplay: false, animationData: clone(data) });
  });

  /* ---------- state ---------- */
  let current = null;    // stage now playing
  let next = null;       // stage the cue points to
  let cueTimer = 0;
  let loopHandler = null;
  let descTimer = 0;

  const btns = Object.fromEntries($$('.stage-btn').map((b) => [b.dataset.stage, b]));
  const desc = $('#desc');
  const descText = $('#descText');

  function nextOf(k) { return ORDER[(ORDER.indexOf(k) + 1) % ORDER.length]; }

  function hideCues() {
    Object.entries(cues).forEach(([k, a]) => { a.stop(); $(`.tap-cue[data-stage="${k}"]`).classList.remove('on'); });
  }
  function showCue(k) {
    hideCues();
    $(`.tap-cue[data-stage="${k}"]`).classList.add('on');
    if (reduced()) cues[k].goToAndStop(0, true); else cues[k].play();
  }

  function setDesc(k) {
    clearTimeout(descTimer);
    if (!k) {
      if (desc.hidden) return;
      desc.classList.add('out');
      descTimer = setTimeout(() => { desc.hidden = true; desc.classList.remove('out'); }, 350);
      return;
    }
    desc.classList.remove('out');
    desc.hidden = true; void desc.offsetWidth; // restart the fade-in
    descText.textContent = DESC[k];
    desc.hidden = false;
  }

  function stopAll() {
    clearTimeout(cueTimer);
    Object.values(anims).forEach((a) => {
      if (loopHandler) a.removeEventListener('complete', loopHandler);
      a.pause();
    });
    loopHandler = null;
  }

  function play(k) {
    stopAll();
    const a = anims[k];
    const p = PLAY[k];
    showScene(k);

    if (reduced()) {
      a.goToAndStop(p.loop ? p.loop[0] + 60 : p.first[1], true);
      cueTimer = setTimeout(() => showCue(next), 1500);
      return;
    }

    // first pass, then loop (or hold) as the stage needs
    loopHandler = () => {
      if (current !== k) return;
      if (p.loop) a.playSegments(p.loop, true);
      else {
        a.goToAndStop(p.first[1], true);
        if (k === 'condensation') showCue(next); // clouds are dark and on the hills
      }
    };
    a.addEventListener('complete', loopHandler);
    a.playSegments(p.first, true);
    if (k !== 'condensation') cueTimer = setTimeout(() => showCue(next), CUE_AFTER);
  }

  function go(k) {
    current = k;
    next = nextOf(k);
    $('#itext').hidden = true;
    $('#resetBtn').disabled = false;
    Object.entries(btns).forEach(([s, b]) => {
      b.classList.toggle('on', s === k);
      b.setAttribute('aria-pressed', s === k ? 'true' : 'false');
    });
    hideCues();
    setDesc(k);
    play(k);
    announce(`${NAME[k]}. ${DESC[k]}`);
  }

  /* ---------- stage buttons ---------- */
  // Before the cycle starts any stage can be tapped. After that, the cycle
  // moves on only to the next stage, once its "Tap here" cue is showing.
  Object.entries(btns).forEach(([k, b]) => {
    b.addEventListener('click', () => {
      if (!current) { go(k); return; }
      const cueOn = $(`.tap-cue[data-stage="${next}"]`).classList.contains('on');
      if (k === next && cueOn) { go(k); return; }
      if (k === current) return;
      // not yet: draw the eye to where the cycle goes next
      const target = cueOn ? btns[next] : btns[current];
      target.classList.remove('nudge'); void target.offsetWidth; target.classList.add('nudge');
    });
  });
  function syncLocks() {
    Object.entries(btns).forEach(([k, b]) => {
      const cueOn = current && $(`.tap-cue[data-stage="${next}"]`).classList.contains('on');
      b.classList.toggle('locked', !!current && !(k === next && cueOn));
    });
  }
  new MutationObserver(syncLocks).observe($('#stage'), { subtree: true, attributes: true, attributeFilter: ['class'] });

  /* ---------- Reset ---------- */
  function reset() {
    stopAll();
    current = null;
    next = null;
    hideCues();
    setDesc(null);
    Object.values(btns).forEach((b) => { b.classList.remove('on'); b.setAttribute('aria-pressed', 'false'); });
    Object.values(anims).forEach((a) => a.goToAndStop(0, true));
    showScene('evaporation');
    $('#itext').hidden = false;
    $('#resetBtn').disabled = true;
    syncLocks();
  }
  $('#resetBtn').addEventListener('click', reset);

  /* ---------- Insights ---------- */
  const insight = $('#insight');
  let lastFocus = null;
  function openInsight() { lastFocus = document.activeElement; insight.hidden = false; $('#insightClose').focus(); }
  function closeInsight() { insight.hidden = true; if (lastFocus) lastFocus.focus(); }
  $('#insightBtn').addEventListener('click', openInsight);
  $('#insightClose').addEventListener('click', closeInsight);
  insight.addEventListener('click', (e) => { if (e.target === insight) closeInsight(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !insight.hidden) closeInsight(); });

  /* ---------- screen reader line ---------- */
  const sr = document.createElement('p');
  sr.className = 'sr-only';
  sr.setAttribute('aria-live', 'polite');
  sr.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)';
  document.body.appendChild(sr);
  function announce(m) { sr.textContent = ''; setTimeout(() => { sr.textContent = m; }, 30); }

  /* ---------- what the Help tour needs (js/how-to-play.js) ---------- */
  window.WC = {
    state: () => ({ current, next }),
    closeInsight: () => { if (!insight.hidden) closeInsight(); }
  };

  /* ---------- start ---------- */
  reset();
})();
