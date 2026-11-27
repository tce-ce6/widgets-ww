/* ==========================================================================
   wg221 — Limits of PIL  (CBSE Grade 8, Political Science)

   Flow (reference/en_ps_08_wg221.docx):
     Intro -> pick a case -> Problem -> Petition (A, then B) -> Pause and Ponder
     -> Back to Cases (other case not done yet) or Reinforcement (both done)
     -> Back to start.
   Left visual: assets/animations/visual_0N_loop while reading, visual_0N_op_01 /
   op_02 when a petition's consequence is shown (data in js/lottie-data.js).
   ========================================================================== */
(function () {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const FPS = 30;

  /* ---------------------------------------------------------------------- */
  /* Content                                                                 */
  /* ---------------------------------------------------------------------- */

  const CASES = {
    river: {
      title: 'The Poisoned River',
      visual: 'visual_01',
      tag: 'The Poisoned River',
      stats: [
        ['15', 'years of industrial discharge into the river.'],
        ['4', 'states affected along its length.'],
        ['Millions', 'dependent on it for water and farming.']
      ],
      context: 'Arjun Nair is an environmental lawyer. He has documented the river’s decline for three years. He wants to file a PIL in the Supreme Court on behalf of everyone who depends on this river.',
      next: 'Explore Arjun’s petition options',
      petitionText: 'Arjun has two petition options. Explore each one and see what the court can do.',
      options: {
        A: {
          text: 'Order the factories to reduce industrial discharge into the river.',
          order: 'Factories shall take immediate measures to limit the discharge of industrial waste into the river.',
          button: 'What changed in the river?',
          consequence: 'The river is slightly cleaner near the factories. Further downstream nothing has changed.'
        },
        B: {
          text: 'Order immediate and complete cessation of all industrial discharge into the river.',
          order: 'All industrial discharge shall cease immediately. Factories shall install treatment systems within one year.',
          button: 'What changed in the river?',
          consequence: 'The factories have stopped. The discharge has ended. But fifteen years of accumulated pollution cannot be undone by a court order. The river will take decades to recover.'
        }
      },
      question: 'Both petitions reached the court. The court acted both times. Yet the river did not fully recover. What does this tell you about the limits of PIL?',
      insight: 'PIL can stop ongoing harm. But reversing damage that has already accumulated goes beyond what a court order alone can achieve.'
    },
    food: {
      title: 'The Right to Food',
      visual: 'visual_02',
      tag: 'The Right to Food',
      stats: [
        ['Millions', 'facing hunger across rural India.'],
        ['Surplus', 'grain stored in government godowns.']
      ],
      context: 'Meera Devi is a social worker. She has documented hunger and malnutrition across three states. Grain is stored in government godowns. It is not reaching the people who need it. She wants to file a PIL in the Supreme Court.',
      next: 'Explore Meera’s petition options',
      petitionText: 'Meera has two petition options. Explore each one and see what the court can do.',
      options: {
        A: {
          text: 'Order the government to distribute grain from state godowns to families facing hunger.',
          order: 'All state governments shall immediately release grain from Food Corporation of India godowns for distribution to families facing hunger.',
          button: 'Did the grain reach all?',
          consequence: 'Grain reached some families. But the order covered only immediate distribution, not a permanent system. Many others received nothing.'
        },
        B: {
          text: 'Declare the right to food as a fundamental right that is enforceable for every citizen.',
          order: 'The government shall ensure grain stored in state godowns reaches those facing hunger. Declaring food a fundamental right falls within the powers of Parliament, not the judiciary.',
          button: 'Did the court deliver what Meera asked for?',
          consequence: 'Meera asked for an enforceable right. The court gave directions instead.'
        }
      },
      question: 'Both petitions reached the court. The court acted both times. Yet Meera could not get an enforceable right. What does this tell you about the limits of PIL?',
      insight: 'PIL can bring a problem to the highest court. But making a right permanently enforceable for every citizen requires legislation. Only Parliament can do that.'
    }
  };

  const STATEMENTS = [
    ['PIL can be used to stop ongoing harm.', true],
    ['PIL can always reverse damage that has already occurred.', false],
    ['Any citizen can file a PIL for a public cause.', true],
    ['A court order through PIL carries the same power as an Act of Parliament.', false],
    ['PIL can direct governments to act on public problems.', true],
    ['PIL alone can create a permanent enforceable right.', false]
  ];

  /* ---------------------------------------------------------------------- */
  /* State                                                                   */
  /* ---------------------------------------------------------------------- */

  const done = { river: false, food: false };
  let caseId = null;      // case being explored
  let explored = {};      // { A: bool, B: bool } for the current case
  let picked = null;      // petition whose court order is showing
  let anim = null;        // current Lottie on the left
  let animRun = 0;        // cancels pending consequence reveals
  let answered = 0;

  /* ---------------------------------------------------------------------- */
  /* Helpers                                                                 */
  /* ---------------------------------------------------------------------- */

  function mk(tag, attrs, parent) {
    const el = document.createElementNS(SVG_NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => el.setAttribute(k, v));
    if (parent) parent.appendChild(el);
    return el;
  }

  function say(text) {
    const sr = $('#sr');
    sr.textContent = '';
    setTimeout(() => { sr.textContent = text; }, 30);
  }

  // SVG elements with role="button": Enter / Space act as a click
  function onActivate(el, fn) {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        fn(e);
      }
    });
  }

  function buildButton(g) {
    const [x, y, w, h] = g.dataset.btn.split(' ').map(Number);
    const label = g.querySelector('text');
    g.insertBefore(mk('rect', { x, y, width: w, height: h, rx: h / 2 }), label);
    label.setAttribute('x', x + w / 2);
    label.setAttribute('y', y + h / 2 + 12);
  }

  function showScreen(id) {
    $$('.screen').forEach((s) => s.classList.toggle('active', s.id === id));
  }

  function showStep(id) {
    $$('.step').forEach((s) => s.classList.toggle('active', s.id === id));
    const first = $(`#${id} button:not(.hidden):not([disabled])`);
    if (first && document.activeElement && document.activeElement !== document.body) first.focus({ preventScroll: true });
  }

  function reveal(el) {
    el.classList.remove('hidden', 'appear');
    void el.getBoundingClientRect();
    el.classList.add('appear');
  }

  /* ---------------------------------------------------------------------- */
  /* Left visual (Lottie)                                                    */
  /* ---------------------------------------------------------------------- */

  /* Sound inside the Lottie files (audio layers with embedded mp3).
     lottie.js only plays these through Howler.js, which this widget does not
     load; without it lottie uses a stand-in with no volume() method, which
     throws when the first audio layer starts and stops the animation there.
     This small HTML5 Audio player gives lottie the methods it calls. */
  let animSounds = [];

  function lottieAudio(src) {
    const el = new Audio(src);
    el.preload = 'auto';
    const sound = {
      play() { const p = el.play(); if (p && p.catch) p.catch(() => { /* blocked until a tap */ }); },
      pause() { el.pause(); },
      stop() { el.pause(); },
      playing() { return !el.paused && !el.ended; },
      seek(t) {
        if (typeof t !== 'number') return el.currentTime;
        // past the end of the clip: leave it finished instead of restarting it
        if (Number.isFinite(el.duration) && t >= el.duration) { el.pause(); return el.currentTime; }
        el.currentTime = t;
        return t;
      },
      rate(r) { if (typeof r === 'number') el.playbackRate = r; return el.playbackRate; },
      volume(v) { if (typeof v === 'number') el.volume = Math.max(0, Math.min(1, v)); return el.volume; },
      setVolume(v) { sound.volume(v); }
    };
    animSounds.push(el);
    return sound;
  }

  function stopAnimSounds() {
    animSounds.forEach((el) => { el.pause(); el.removeAttribute('src'); el.load(); });
    animSounds = [];
  }

  // After Effects exports audio levels in dB (0 = normal), but lottie reads them
  // as a percentage (0 = silent). Turn dB into lottie's 0-100 scale.
  function fixAudioLevels(data) {
    const toPct = (db) => 100 * Math.pow(10, db / 20);
    const visit = (layers) => (layers || []).forEach((l) => {
      if (l.ty !== 6) return;
      const lv = l.au && l.au.lv;
      if (!lv) return;
      if (lv.a === 0 && Array.isArray(lv.k)) lv.k = lv.k.map(toPct);
      else if (lv.a === 1 && Array.isArray(lv.k)) lv.k.forEach((kf) => { if (kf.s) kf.s = kf.s.map(toPct); if (kf.e) kf.e = kf.e.map(toPct); });
    });
    visit(data.layers);
    (data.assets || []).forEach((a) => visit(a.layers));
    return data;
  }

  function playVisual(key, loop) {
    animRun++;
    if (anim) anim.destroy();
    stopAnimSounds();
    // lottie mutates the data, so give each load its own copy
    const data = fixAudioLevels(JSON.parse(JSON.stringify(window.LOTTIE_DATA[key])));
    const a = lottie.loadAnimation({
      container: $('#visual'),
      renderer: 'svg',
      loop,
      autoplay: true,
      audioFactory: lottieAudio,
      animationData: data,
      rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
    });
    // lottie only lets the sound layers that exist when play() runs make sound;
    // sound layers that start later are created afterwards and stay muted. Let
    // them play as soon as they are created, unless the animation is paused.
    const ac = a.audioController;
    if (ac && ac.addAudio) {
      const add = ac.addAudio.bind(ac);
      ac.addAudio = (layer) => {
        add(layer);
        if (!a.isPaused && layer.resume) layer.resume();
      };
    }
    anim = a;
    return anim;
  }

  // Play the consequence once, then call back (held on its last frame).
  function playConsequence(key, then) {
    const a = playVisual(key, false);
    const run = animRun;
    const data = window.LOTTIE_DATA[key];
    let fired = false;
    const finish = () => {
      if (fired || run !== animRun) return;
      fired = true;
      then();
    };
    a.addEventListener('complete', finish);
    // fallback in case the tab is hidden and frames do not advance
    setTimeout(finish, ((data.op - data.ip) / (data.fr || FPS)) * 1000 + 600);
  }

  /* ---------------------------------------------------------------------- */
  /* Intro                                                                   */
  /* ---------------------------------------------------------------------- */

  function goIntro() {
    if (anim) { anim.destroy(); anim = null; }
    stopAnimSounds();
    animRun++;
    showScreen('intro');
    $$('.case-card').forEach((c) => {
      const isDone = done[c.dataset.case];
      c.classList.toggle('explored', isDone);
      c.setAttribute('aria-disabled', String(isDone));
      c.setAttribute('aria-label', CASES[c.dataset.case].title + (isDone ? ', explored' : ''));
    });
  }

  $$('.case-card').forEach((card) => {
    onActivate(card, () => {
      if (!done[card.dataset.case]) enterCase(card.dataset.case);
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Case: problem                                                           */
  /* ---------------------------------------------------------------------- */

  function enterCase(id) {
    caseId = id;
    explored = { A: false, B: false };
    picked = null;
    const c = CASES[id];

    // $('#p-tag').textContent = c.tag;
    const stats = $('#p-stats');
    stats.classList.toggle('two', c.stats.length === 2);
    stats.innerHTML = c.stats.map(([n, t]) => `<div class="stat"><p class="stat-num">${n}</p><p class="stat-label">${t}</p></div>`).join('');
    $('#p-context').textContent = c.context;
    $('#p-next').textContent = c.next;

    showScreen('case');
    showStep('step-problem');
    playVisual(`${c.visual}_loop`, true);
    say(`${c.title}. Read the case.`);
  }

  $('#p-next').addEventListener('click', startPetition);

  /* ---------------------------------------------------------------------- */
  /* Case: petition                                                          */
  /* ---------------------------------------------------------------------- */

  function setOption(opt, state) {
    const el = $(`#opt-${opt}`);
    el.classList.remove('active', 'inactive', 'selected', 'explored');
    el.classList.add(state);
    el.setAttribute('aria-disabled', String(state !== 'active'));
    el.setAttribute('aria-pressed', String(state === 'selected' || state === 'explored'));
  }

  function startPetition() {
    const c = CASES[caseId];
    $('#t-itext').textContent = c.petitionText;
    ['A', 'B'].forEach((o) => { $(`#opt-${o} .pt-text`).textContent = c.options[o].text; });
    setOption('A', 'active');
    setOption('B', 'inactive');
    $('#court').classList.add('hidden');
    $('#ponder-btn').classList.add('hidden');
    showStep('step-petition');
    say('The petition. Start with the first option.');
  }

  function pickPetition(opt) {
    if (!$(`#opt-${opt}`).classList.contains('active')) return;
    picked = opt;
    const o = CASES[caseId].options[opt];
    setOption(opt, 'selected');
    $('#order').textContent = o.order;
    const btn = $('#consequence-btn');
    btn.textContent = o.button;
    btn.classList.remove('hidden');
    btn.disabled = false;
    $('#consequence').classList.add('hidden');
    // restart the reveal animation of the court order block
    const court = $('#court');
    court.classList.add('hidden');
    void court.getBoundingClientRect();
    court.classList.remove('hidden');
    btn.focus({ preventScroll: true });
    say(`Court order: ${o.order}`);
  }

  ['A', 'B'].forEach((o) => $(`#opt-${o}`).addEventListener('click', () => pickPetition(o)));

  $('#consequence-btn').addEventListener('click', () => {
    if (!picked) return;
    const opt = picked;
    const c = CASES[caseId];
    const btn = $('#consequence-btn');
    btn.disabled = true;
    btn.classList.add('hidden');
    say('Watch the picture on the left.');
    playConsequence(`${c.visual}_op_0${opt === 'A' ? 1 : 2}`, () => {
      const text = $('#consequence');
      text.textContent = c.options[opt].consequence;
      text.classList.remove('hidden');
      explored[opt] = true;
      setOption(opt, 'explored');
      picked = null;
      if (opt === 'A') setOption('B', 'active');
      say(c.options[opt].consequence + (opt === 'A' ? ' Now explore the second petition.' : ''));
      if (explored.A && explored.B) {
        setTimeout(() => {
          const p = $('#ponder-btn');
          reveal(p);
          p.focus({ preventScroll: true });
        }, 500);
      } else {
        $('#opt-B').focus({ preventScroll: true });
      }
    });
  });

  /* ---------------------------------------------------------------------- */
  /* Case: Pause and Ponder                                                  */
  /* ---------------------------------------------------------------------- */

  $('#ponder-btn').addEventListener('click', () => {
    const c = CASES[caseId];
    const q = $('#question');
    q.textContent = c.question;
    q.classList.remove('tapped');
    q.setAttribute('aria-expanded', 'false');
    $('#insight').classList.add('hidden');
    $('#end-btn').classList.add('hidden');
    showStep('step-ponder');
    say('Pause and Ponder. Tap the question.');
  });

  $('#question').addEventListener('click', () => {
    const q = $('#question');
    if (q.classList.contains('tapped')) return;
    q.classList.add('tapped');
    q.setAttribute('aria-expanded', 'true');
    const c = CASES[caseId];
    $('#insight-text').textContent = c.insight;
    $('#insight').classList.remove('hidden');
    const other = caseId === 'river' ? 'food' : 'river';
    const end = $('#end-btn');
    end.textContent = done[other] ? 'See what this taught us' : 'Back to Cases';
    end.classList.toggle('pink', done[other]);
    end.classList.toggle('blue', !done[other]);
    setTimeout(() => {
      reveal(end);
      end.focus({ preventScroll: true });
    }, 400);
    say(`Insight: ${c.insight}`);
  });

  $('#end-btn').addEventListener('click', () => {
    done[caseId] = true;
    if (done.river && done.food) goReinforce();
    else goIntro();
  });

  /* ---------------------------------------------------------------------- */
  /* Reinforcement                                                           */
  /* ---------------------------------------------------------------------- */

  function buildStatements() {
    const root = $('#statements');
    root.innerHTML = '';
    answered = 0;
    STATEMENTS.forEach(([text, isTrue], k) => {
      const g = mk('g', {
        class: 'statement', role: 'button', tabindex: '0',
        'aria-label': `${text} Tap to check.`,
        transform: `translate(462 ${201 + 120 * k})`
      }, root);
      mk('rect', { class: 'st-bg', width: 1046, height: 101, rx: 18 }, g);
      mk('rect', { class: 'st-box', x: 24, y: 20, width: 61, height: 61, rx: 10 }, g);
      mk('path', { class: 'st-mark tick', d: 'M38 51L50 65L72 36' }, g);
      mk('path', { class: 'st-mark cross', d: 'M41 37L68 64M68 37L41 64' }, g);
      const t = mk('text', { class: 'st-text', x: 105, y: 61 }, g);
      t.textContent = text;
      onActivate(g, () => {
        if (g.classList.contains('answered')) return;
        g.classList.add('answered', isTrue ? 'correct' : 'incorrect');
        g.setAttribute('aria-disabled', 'true');
        g.setAttribute('aria-label', `${text} ${isTrue ? 'Correct.' : 'Not correct.'}`);
        say(`${isTrue ? 'Correct' : 'Not correct'}: ${text}`);
        answered++;
        if (answered === STATEMENTS.length) {
          const b = $('#restart-btn');
          b.classList.remove('hidden');
          setTimeout(() => b.focus(), 300);
        }
      });
    });
  }

  function goReinforce() {
    if (anim) { anim.destroy(); anim = null; }
    stopAnimSounds();
    animRun++;
    buildStatements();
    $('#restart-btn').classList.add('hidden');
    showScreen('reinforce');
    say('Read each statement. Tap the box next to it to see if it is correct.');
  }

  onActivate($('#restart-btn'), () => {
    done.river = false;
    done.food = false;
    goIntro();
    say('Back to start. Choose a case to explore.');
  });

  /* ---------------------------------------------------------------------- */
  /* Start                                                                   */
  /* ---------------------------------------------------------------------- */

  $$('.svg-btn[data-btn]').forEach(buildButton);
  goIntro();

  // for the Help tour and testing
  window.PIL = { enterCase, goIntro, goReinforce, done, CASES };
}());
