'use strict';

// In Electron with nodeIntegration, the UMD build of lottie assigns itself to
// module.exports instead of window.lottie — pick it up from there.
if (
  !window.lottie &&
  typeof module === 'object' &&
  module &&
  module.exports &&
  typeof module.exports.loadAnimation === 'function'
) {
  window.lottie = module.exports;
}

document.addEventListener('DOMContentLoaded', () => {
  const FLOWERS = window.FLOWERS;
  const ANIM = window.ANIM_DATA || {};
  const SVG_NS = 'http://www.w3.org/2000/svg';

  /* ==========================================================================
     CONTENT + GEOMETRY (stage px, from the AI artboard)
     ========================================================================== */

  const STAGE_W = 1920;
  const STAGE_H = 1080;
  const GROUND_Y = 905; // top of the yellow ground strip in bg.svg
  const BUSH_H = 60; // bushes band just above it (used for the letterbox fill)

  const TEXT = {
    pick: 'Tap any two flowers, or the same flower twice, to choose the bee’s path',
    start: 'Tap “<b>Start</b>” to view the type of pollination',
  };
  const RESULT = {
    sameFlower: {
      type: 'self',
      label: 'Self-pollination',
      text: 'It is self-pollination because the pollen is transferred<br>from the anther to the stigma of the same flower.',
    },
    samePlant: {
      type: 'self',
      label: 'Self-pollination',
      text: 'It is self-pollination because the pollen is transferred from the anther<br>of one flower to the stigma of another flower on the same plant.',
    },
    otherPlant: {
      type: 'cross',
      label: 'Cross-pollination',
      text: 'It is cross-pollination because the pollen is transferred from the anther of a flower<br>on one plant to the stigma of a flower on another plant of the same species.',
    },
  };

  // Bee Lottie: 200x200 comp drawn in a 260px box; FEET = its legs in that box.
  const BEE_BOX = 160;
  const FEET = [74, 114];
  const BEE_HOME = [1672, 290];
  const BEE_SPEED = 480; // stage px per second
  const SIT_MS = 2000; // the bee sits on the anther this long before flying on
  const PLANT_NAME = { L: 'left', R: 'right' };
  const STEM_X = { L: 445, R: 1215 }; // main stem of each plant
  const GAP_X = { L: 700, R: 960 }; // where a same-plant flight loops, between the plants
  const LOOP_MIN_Y = 390; // keeps the loop below the result panel

  /* ==========================================================================
     DOM
     ========================================================================== */

  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const modalStage = $('modal-stage');
  const viewport = $('viewport');
  const itext = $('itext');
  const result = $('result');
  const scene = $('scene');
  const flowersBox = $('flowers');
  const trail = $('trail');
  const trailReveal = $('trailReveal');
  const pollenFx = $('pollenFx');
  const typePill = $('typePill');
  const bee = $('bee');
  const startBtn = $('startBtn');
  const resetBtn = $('resetBtn');
  const insightsBtn = $('insightsBtn');
  const insightsOverlay = $('insightsOverlay');
  const insightsClose = $('insightsClose');

  /* ==========================================================================
     STAGE SCALING
     ========================================================================== */

  const fitStage = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / STAGE_W, vh / STAGE_H);
    const x = (vw - STAGE_W * scale) / 2;
    const y = (vh - STAGE_H * scale) / 2;
    const t = `translate(${x}px, ${y}px) scale(${scale})`;
    stage.style.transform = t;
    modalStage.style.transform = t; // modals share the stage's position and scale
    viewport.style.setProperty('--ground-y', `${y + GROUND_Y * scale}px`);
    viewport.style.setProperty('--bush-h', `${BUSH_H * scale}px`);
  };
  fitStage();
  window.addEventListener('resize', fitStage);

  /* ==========================================================================
     FLOWERS
     ========================================================================== */

  const svgEl = (tag, attrs) => {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  };

  const flowerEls = FLOWERS.map((f, i) => {
    const g = svgEl('g', {
      class: 'flower',
      'data-plant': f.plant,
      tabindex: '0',
      role: 'button',
      'aria-pressed': 'false',
      'aria-label': `${PLANT_NAME[f.plant]} plant, ${f.name} flower`,
    });
    g.appendChild(svgEl('path', { class: 'flower__shape', d: f.shape }));
    g.appendChild(svgEl('path', { class: 'flower__ring', d: f.ring }));
    g.addEventListener('click', () => pickFlower(i));
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        pickFlower(i);
      }
    });
    flowersBox.appendChild(g);
    return g;
  });

  /* ==========================================================================
     STATE
     ========================================================================== */

  const state = {
    picks: [], // flower indexes: [pollen from, pollen to]
    running: false,
    done: false,
  };
  let timers = [];
  let rafId = 0;

  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  const setItext = (key) => {
    itext.hidden = !key;
    itext.innerHTML = key ? TEXT[key] : '';
    itext.classList.toggle('is-go', key === 'start');
  };

  const pickFlower = (i) => {
    if (state.running || state.done || state.picks.length >= 2) return;
    state.picks.push(i);
    const g = flowerEls[i];
    g.classList.add('is-picked');
    g.setAttribute('aria-pressed', 'true');
    if (state.picks.length === 2) {
      if (state.picks[0] === state.picks[1]) g.classList.add('is-twice');
      startBtn.disabled = false;
      setItext('start');
    }
  };

  /* ==========================================================================
     BEE
     ========================================================================== */

  let beeAnim = null;
  if (window.lottie && ANIM.bee) {
    beeAnim = window.lottie.loadAnimation({
      container: $('beeAnim'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: JSON.parse(JSON.stringify(ANIM.bee)),
    });
  }
  bee.style.width = `${BEE_BOX}px`;
  bee.style.height = `${BEE_BOX}px`;
  bee.style.setProperty('--feet-x', `${FEET[0]}px`);
  bee.style.setProperty('--feet-y', `${FEET[1]}px`);

  const placeBee = (x, y) => {
    bee.style.transform = `translate(${x - FEET[0]}px, ${y - FEET[1]}px)`;
  };

  const buzz = new Audio('assets/audio/bee-buzz.mp3');
  buzz.loop = true;
  buzz.volume = 0.5;
  const setBuzz = (on) => {
    if (on) {
      const p = buzz.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      buzz.pause();
    }
  };

  const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

  // Fly the bee along `pathEl`; `onStep(lengthSoFar)` lets the trail follow it.
  const flyAlong = (pathEl, onStep, done) => {
    const len = pathEl.getTotalLength();
    const dur = Math.min(3600, Math.max(1300, (len / BEE_SPEED) * 1000));
    const t0 = performance.now();
    let lastX = pathEl.getPointAtLength(0).x;
    bee.classList.remove('is-idle');
    setBuzz(true);
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const l = len * ease(t);
      const p = pathEl.getPointAtLength(l);
      // face the way it is flying (the drawing faces left)
      if (Math.abs(p.x - lastX) > 0.6) {
        bee.classList.toggle('is-right', p.x > lastX);
        lastX = p.x;
      }
      placeBee(p.x, p.y);
      if (onStep) onStep(l);
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        rafId = 0;
        setBuzz(false);
        done();
      }
    };
    rafId = requestAnimationFrame(step);
  };

  /* ==========================================================================
     PATHS
     ========================================================================== */

  const fmt = (pts) => pts.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  // home -> first anther: one easy swoop
  const pathToAnther = (to) => {
    const [x0, y0] = BEE_HOME;
    const [x1, y1] = to;
    return `M${fmt([[x0, y0]])} C${fmt([
      [x0 - 160, y0 - 120],
      [x1 + (x0 > x1 ? 220 : -220), y1 - 200],
      [x1, y1],
    ])}`;
  };

  // anther -> stigma: out to one side, one loop-the-loop, down onto the stigma.
  // The loop stays below the result panel and clear of the other flowers.
  const pathToStigma = (from, to, a, b) => {
    const fa = FLOWERS[a];
    let dir;
    let mid;
    if (a === b) {
      // same flower: loop out away from the stem
      dir = Math.sign(from[0] - STEM_X[fa.plant]) || 1;
      mid = [from[0] + dir * 170, from[1] - 30];
    } else if (fa.plant === FLOWERS[b].plant) {
      // same plant: loop in the gap between the plants
      mid = [GAP_X[fa.plant], (from[1] + to[1]) / 2];
      dir = Math.sign(mid[0] - from[0]) || 1;
    } else {
      dir = Math.sign(to[0] - from[0]) || 1;
      mid = [(from[0] + to[0]) / 2, Math.min(from[1], to[1]) - 60];
    }
    mid[1] = Math.max(LOOP_MIN_Y, mid[1]);
    const r = 70;
    return `M${fmt([from])}` +
      ` C${fmt([[from[0] + dir * 30, from[1] - 80], [mid[0] - dir * r * 1.6, mid[1] + r * 1.6], mid])}` +
      ` C${fmt([[mid[0] + dir * r * 1.6, mid[1] - r * 1.6], [mid[0] - dir * r * 1.6, mid[1] - r * 1.6], mid])}` +
      ` C${fmt([[mid[0] + dir * r * 1.6, mid[1] + r * 1.6], [to[0], to[1] - 120], to])}`;
  };

  /* ==========================================================================
     RUN
     ========================================================================== */

  const flightPath = svgEl('path', { d: '' }); // measuring only, never shown
  flightPath.style.display = 'none';
  scene.appendChild(flightPath);

  const scatterPollen = ([x, y], glow) => {
    if (glow) pollenFx.appendChild(svgEl('circle', { class: 'stigma-glow', cx: x, cy: y, r: 16 }));
    for (let i = 0; i < 9; i++) {
      const a = (Math.PI * 2 * i) / 9 + Math.random() * 0.4;
      const d = 10 + Math.random() * 12;
      const c = svgEl('circle', { class: 'pollen-grain', cx: x, cy: y, r: 3 + Math.random() * 1.5 });
      c.style.setProperty('--dx', `${(Math.cos(a) * d).toFixed(1)}px`);
      c.style.setProperty('--dy', `${(Math.sin(a) * d).toFixed(1)}px`);
      pollenFx.appendChild(c);
    }
  };

  const showResult = (a, b) => {
    const r = a === b ? RESULT.sameFlower : FLOWERS[a].plant === FLOWERS[b].plant ? RESULT.samePlant : RESULT.otherPlant;
    setItext(null);
    result.className = `result result--${r.type}`;
    result.innerHTML = r.text;
    result.hidden = false;
    typePill.className = `type-pill type-pill--${r.type}`;
    typePill.textContent = r.label;
    typePill.hidden = false;
  };

  const start = () => {
    if (state.picks.length !== 2 || state.running || state.done) return;
    const [a, b] = state.picks;
    const from = FLOWERS[a].anther;
    const to = FLOWERS[b].stigma;
    state.running = true;
    startBtn.disabled = true;
    scene.classList.add('is-locked');

    // 1. home -> anther of the first flower
    flightPath.setAttribute('d', pathToAnther(from));
    flyAlong(flightPath, null, () => {
      bee.classList.add('has-pollen');
      scatterPollen(from, false);

      // 2. after 2 s, anther -> stigma of the second flower, drawing the path behind it
      later(() => {
        const d = pathToStigma(from, to, a, b);
        trail.setAttribute('d', d);
        trailReveal.setAttribute('d', d);
        const len = trail.getTotalLength();
        trailReveal.style.strokeDasharray = `${len} ${len}`;
        trailReveal.style.strokeDashoffset = `${len}`;
        flyAlong(trail, (l) => {
          trailReveal.style.strokeDashoffset = `${len - l}`;
        }, () => {
          bee.classList.remove('has-pollen');
          scatterPollen(to, true);
          state.running = false;
          state.done = true;
          later(() => showResult(a, b), 350);
        });
      }, SIT_MS);
    });
  };

  const reset = () => {
    timers.forEach(clearTimeout);
    timers = [];
    cancelAnimationFrame(rafId);
    rafId = 0;
    setBuzz(false);
    buzz.currentTime = 0;

    state.picks = [];
    state.running = false;
    state.done = false;
    flowerEls.forEach((g) => {
      g.classList.remove('is-picked', 'is-twice');
      g.setAttribute('aria-pressed', 'false');
    });
    scene.classList.remove('is-locked');
    trail.setAttribute('d', '');
    trailReveal.setAttribute('d', '');
    pollenFx.innerHTML = '';
    result.hidden = true;
    typePill.hidden = true;
    startBtn.disabled = true;
    setItext('pick');

    bee.classList.remove('is-right', 'has-pollen');
    bee.classList.add('is-idle');
    placeBee(BEE_HOME[0], BEE_HOME[1]);
  };

  /* ==========================================================================
     INSIGHTS (modal on the body.has-modal backdrop)
     ========================================================================== */

  const openInsights = () => {
    insightsOverlay.hidden = false;
    document.body.classList.add('has-modal');
    insightsClose.focus();
  };

  const closeInsights = () => {
    insightsOverlay.hidden = true;
    document.body.classList.remove('has-modal');
    insightsBtn.focus();
  };

  /* ==========================================================================
     EVENTS + INIT
     ========================================================================== */

  startBtn.addEventListener('click', start);
  resetBtn.addEventListener('click', reset);
  insightsBtn.addEventListener('click', () => (insightsOverlay.hidden ? openInsights() : closeInsights()));
  insightsClose.addEventListener('click', closeInsights);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !insightsOverlay.hidden) closeInsights();
  });

  if (beeAnim) beeAnim.setSpeed(1.4);
  reset();
});
