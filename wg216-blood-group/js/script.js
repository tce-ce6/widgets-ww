'use strict';

/* ==========================================================================
   wg216 — What is the blood group?  (widget logic)

   Flow (from reference/en_bio_11_wg216.html):
     1. "Add blood sample"  -> dropper puts one drop of blood in each well.
     2. "Add reagents"      -> Anti-A, Anti-B, Anti-D are added and mixed.
                               Wells whose antigen is present clump; the
                               others turn smooth, even red.
     3. "Which blood group is this?"  -> pick one of the 8 groups.
     4. Compatibility quiz  -> drag groups into "can donate to" /
                               "can receive from".
   "Test another sample" starts again with a new random blood group.

   Visuals:
     - Bench scene = LOTTIE_DATA.scene (one timeline, see lottie-data.js).
       Frames 0-410 add blood; 410-959 add reagents, mix, and show clumped
       cells in all three wells. For wells that must NOT react, the
       clumped-cells layer is removed from the data before loading, and
       LOTTIE_DATA.smooth (cells spreading into smooth red) is played on top
       of that well instead.
     - Buttons + instruction line = artwork from assets/images/layout.svg.
   ========================================================================== */

(function () {
  // ---------------------------------------------------------------------
  // Blood group data
  // ---------------------------------------------------------------------
  const GROUPS = {
    'A+': { a: true, b: false, d: true }, 'A-': { a: true, b: false, d: false },
    'B+': { a: false, b: true, d: true }, 'B-': { a: false, b: true, d: false },
    'AB+': { a: true, b: true, d: true }, 'AB-': { a: true, b: true, d: false },
    'O+': { a: false, b: false, d: true }, 'O-': { a: false, b: false, d: false }
  };
  const ORDER = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  function canDonate(donor, recipient) {
    const d = GROUPS[donor], r = GROUPS[recipient];
    return !(d.a && !r.a) && !(d.b && !r.b) && !(d.d && !r.d);
  }
  const donateTo = g => ORDER.filter(r => canDonate(g, r));
  const receiveFrom = g => ORDER.filter(d => canDonate(d, g));
  const fmt = g => g.replace('-', '−');

  // ---------------------------------------------------------------------
  // Animation timing (frames of LOTTIE_DATA.scene, 30 fps)
  // ---------------------------------------------------------------------
  const BLOOD_END = 410;      // blood is in all three wells
  const SCENE_END = 959;      // reagents added, mixed, cells shown
  const CELLS_SHOW = 849;     // the "circles" (clumped cells) layers appear

  // Wells, keyed by antigen. sceneX = x of that well's "circles" layer in
  // the Lottie composition (used to find the layer to remove).
  const WELLS = [
    { k: 'a', name: 'Anti-A', sceneX: 472, fx: 'well-fx-a' },
    { k: 'b', name: 'Anti-B', sceneX: 793, fx: 'well-fx-b' },
    { k: 'd', name: 'Anti-D', sceneX: 1114, fx: 'well-fx-d' }
  ];

  // Instruction line while the animation runs: [from frame, text]
  const BLOOD_STEPS = [
    [0, 'The dropper is drawing blood from the sample tube...'],
    [150, 'Adding one drop of blood to the Anti-A well...'],
    [222, 'Adding one drop of blood to the Anti-B well...'],
    [290, 'Adding one drop of blood to the Anti-D well...']
  ];
  const REAGENT_STEPS = [
    [BLOOD_END, 'Adding one drop of Anti-A to the blood in its well...'],
    [530, 'Adding one drop of Anti-B to the blood in its well...'],
    [640, 'Adding one drop of Anti-D to the blood in its well...'],
    [733, 'Mixing each well with an applicator stick...'],
    [CELLS_SHOW, 'Watch the wells. Do the red cells clump or stay smooth?']
  ];

  const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // ---------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------
  const iText = document.getElementById('i-text');
  const sceneBox = document.getElementById('lottie-scene');
  const panel = document.getElementById('panel');
  const btnAction = document.getElementById('btn-action');
  const btnActionLabel = btnAction.querySelector('text');
  const btnNew = document.getElementById('btn-new');

  // Size the main action button to its label with the same side padding as
  // "Test another sample" (measured from that button), keeping its right
  // edge where the design has it so the gap between the two stays the same.
  const ACTION_RIGHT = 1045, BTN_TOP = 954, BTN_H = 93;
  function fitActionButton() {
    const newPath = btnNew.querySelector('path'), newLabel = btnNew.querySelector('text');
    const pathEl = btnAction.querySelector('path');
    let pad = 40;
    try {
      pad = (newPath.getBBox().width - newLabel.getComputedTextLength()) / 2;
      const textLen = btnActionLabel.getComputedTextLength();
      if (!textLen || !isFinite(pad)) return; // hidden / not laid out yet
      const w = textLen + 2 * pad;
      const x = ACTION_RIGHT - w, r = BTN_H / 2;
      pathEl.setAttribute('d',
        `M${x + r},${BTN_TOP}h${w - 2 * r}a${r},${r} 0 0 1 0,${BTN_H}h${-(w - 2 * r)}a${r},${r} 0 0 1 0,${-BTN_H}Z`);
      btnActionLabel.setAttribute('x', x + w / 2);
    } catch (e) { /* not rendered yet (e.g. hidden): keep the design's shape */ }
  }
  // Fonts can load after first paint and change the text width.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => fitActionButton());
  const btnInsights = document.getElementById('btn-insights');
  const modalLayer = document.getElementById('modal-layer');
  const modalBack = document.getElementById('modal-back');
  const modalBox = document.getElementById('modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');
  const modalClose = document.getElementById('modal-close');

  // ---------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------
  let gen = 0;            // bumps on every new sample; stale callbacks check it
  let S = {};
  let scene = null;       // Lottie bench scene
  let wellAnims = [];     // Lottie smooth-red overlays

  function setMsg(t) { iText.textContent = t; }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  // ---------------------------------------------------------------------
  // Lottie
  // ---------------------------------------------------------------------

  /** Scene data for this patient: full timeline, with the clumped-cells
   *  layer removed from every well that must not react. */
  function sceneDataFor(patient) {
    const data = JSON.parse(JSON.stringify(window.LOTTIE_DATA.scene));
    data.op = SCENE_END;
    const truth = GROUPS[patient];
    const smoothXs = WELLS.filter(w => !truth[w.k]).map(w => w.sceneX);
    data.layers = data.layers.filter(l => {
      if (l.nm !== 'circles') return true;
      const x = l.ks && l.ks.p && Array.isArray(l.ks.p.k) ? l.ks.p.k[0] : null;
      return !smoothXs.some(sx => Math.abs(sx - x) < 5);
    });
    return data;
  }

  function destroyAnims() {
    if (scene) { scene.destroy(); scene = null; }
    wellAnims.forEach(a => a.destroy());
    wellAnims = [];
    sceneBox.innerHTML = '';
    WELLS.forEach(w => { document.querySelector('#' + w.fx + ' .lottie-box').innerHTML = ''; });
  }

  function loadScene(patient) {
    scene = lottie.loadAnimation({
      container: sceneBox,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      animationData: sceneDataFor(patient)
    });
    const anim = scene;
    anim.addEventListener('DOMLoaded', () => { if (anim === scene) anim.goToAndStop(0, true); });
  }

  /** Plays scene frames [from, to]; calls onFrame(absoluteFrame). Resolves
   *  when done, or false if a new sample was started meanwhile. */
  function playScene(from, to, onFrame) {
    const myGen = gen, anim = scene;
    return new Promise(resolve => {
      if (reduceMotion) {
        anim.goToAndStop(to - 1, true);
        if (onFrame) onFrame(to - 1);
        resolve(myGen === gen);
        return;
      }
      const onEnter = () => { if (onFrame) onFrame(anim.firstFrame + anim.currentFrame); };
      const onDone = () => {
        anim.removeEventListener('enterFrame', onEnter);
        anim.removeEventListener('complete', onDone);
        resolve(myGen === gen);
      };
      anim.addEventListener('enterFrame', onEnter);
      anim.addEventListener('complete', onDone);
      anim.playSegments([from, to], true);
    });
  }

  /** Plays the smooth-red overlay on one well. */
  /** Smooth-well overlay without the red cell dots ("circles-positive"),
   *  so a well with no reaction fills with one plain, even colour. */
  function smoothData() {
    const data = JSON.parse(JSON.stringify(window.LOTTIE_DATA.smooth));
    data.layers = data.layers.filter(l => l.nm !== 'circles-positive');
    return data;
  }

  function playSmooth(well) {
    const myGen = gen;
    return new Promise(resolve => {
      const anim = lottie.loadAnimation({
        container: document.querySelector('#' + well.fx + ' .lottie-box'),
        renderer: 'svg',
        loop: false,
        autoplay: !reduceMotion,
        animationData: smoothData()
      });
      wellAnims.push(anim);
      if (reduceMotion) {
        const jumpToEnd = () => { anim.goToAndStop(anim.totalFrames - 1, true); resolve(myGen === gen); };
        if (anim.isLoaded) jumpToEnd(); else anim.addEventListener('DOMLoaded', jumpToEnd);
      } else {
        anim.addEventListener('complete', () => resolve(myGen === gen));
      }
    });
  }

  function stepper(steps) {
    let shown = -1;
    return frame => {
      let idx = -1;
      steps.forEach((s, i) => { if (frame >= s[0]) idx = i; });
      if (idx !== shown && idx >= 0) { shown = idx; setMsg(steps[idx][1]); }
    };
  }

  // ---------------------------------------------------------------------
  // Steps 1 + 2: lab work
  // ---------------------------------------------------------------------
  async function addBlood() {
    if (S.busy || S.blood) return;
    S.busy = true; refreshBar();
    const ok = await playScene(0, BLOOD_END, stepper(BLOOD_STEPS));
    if (!ok) return;
    S.blood = true; S.phase = 1; S.busy = false;
    refreshAll();
  }

  async function addReagents() {
    if (S.busy || S.reagents || !S.blood) return;
    S.busy = true; refreshBar();
    const truth = GROUPS[S.patient];
    const steps = stepper(REAGENT_STEPS);
    const smooth = [];
    let started = false;
    const startSmooth = () => {
      if (started) return;
      started = true;
      WELLS.filter(w => !truth[w.k]).forEach(w => smooth.push(playSmooth(w)));
    };
    const ok = await playScene(BLOOD_END, SCENE_END, f => {
      steps(f);
      if (f >= CELLS_SHOW) startSmooth();
    });
    if (!ok) return;
    startSmooth();
    const done = await Promise.all(smooth);
    if (done.includes(false)) return;
    S.reagents = true; S.busy = false; S.phase = 2;
    refreshAll();
  }

  // ---------------------------------------------------------------------
  // Bottom bar + instruction
  // ---------------------------------------------------------------------
  function refreshBar() {
    const showAction = S.phase < 2;
    btnAction.classList.toggle('hidden', !showAction);
    // With the action button gone, centre "Test another sample" (its centre is x 1279; canvas centre is 960).
    if (showAction) btnNew.removeAttribute('transform');
    else btnNew.setAttribute('transform', 'translate(-319 0)');
    btnAction.classList.toggle('is-disabled', !!S.busy);
    btnAction.setAttribute('aria-disabled', S.busy ? 'true' : 'false');
    btnActionLabel.textContent = S.blood ? 'Add reagents' : 'Add blood sample';
    fitActionButton();
    btnAction.setAttribute('aria-label', btnActionLabel.textContent);
    if (S.busy) return;
    if (!S.blood) setMsg("Start by placing one drop of the patient's blood in each well.");
    else if (!S.reagents) setMsg('Each well now has a blood drop. Add one reagent to each well and mix.');
    else if (S.phase === 2) setMsg('Compare the three wells. Clumps mean a reaction. Smooth, even red means no reaction.');
    else setMsg('This blood is ' + fmt(S.patient) + '. Now work out who can give and receive it.');
  }

  function refreshAll() { refreshBar(); renderPanel(); }

  function onAction() {
    if (S.busy) return;
    if (!S.blood) addBlood();
    else if (!S.reagents) addReagents();
  }

  // ---------------------------------------------------------------------
  // Feedback text (from the reference)
  // ---------------------------------------------------------------------
  function wellLines(g) {
    const t = GROUPS[g], out = [];
    out.push(t.a ? 'The Anti-A well clumped, so the red cells have the A antigen.' : 'The Anti-A well stayed smooth, so the red cells have no A antigen.');
    out.push(t.b ? 'The Anti-B well clumped, so the red cells have the B antigen.' : 'The Anti-B well stayed smooth, so the red cells have no B antigen.');
    if (t.a && t.b) out.push('Having both A and B antigens makes the group AB.');
    else if (!t.a && !t.b) out.push('Having neither A nor B antigen makes the group O. There is no separate O antigen.');
    else out.push('Having only the ' + (t.a ? 'A' : 'B') + ' antigen makes the group ' + (t.a ? 'A' : 'B') + '.');
    out.push(t.d ? 'The Anti-D well clumped, so the RhD antigen is present. That makes it Rh positive (+).' : 'The Anti-D well stayed smooth, so there is no RhD antigen. That makes it Rh negative (−).');
    return out;
  }

  function wrongIdLines(guess, truth) {
    const G = GROUPS[guess], T = GROUPS[truth], f = fmt(guess), out = [];
    const abo = G.a !== T.a || G.b !== T.b, rh = G.d !== T.d;
    let head = f + ' is not right. ';
    head += abo && rh ? 'Both the letter and the Rh sign need another look.' : abo ? 'You read the Rh sign correctly, but the letter is wrong.' : 'The letter is correct, but the Rh sign is wrong.';
    if (G.a && !T.a) out.push(f + ' red cells have the A antigen, so they would clump with Anti-A. Here the Anti-A well stayed smooth.');
    if (!G.a && T.a) out.push(f + ' red cells have no A antigen, so the Anti-A well would stay smooth. Here it clumped.');
    if (G.b && !T.b) out.push(f + ' red cells have the B antigen, so they would clump with Anti-B. Here the Anti-B well stayed smooth.');
    if (!G.b && T.b) out.push(f + ' red cells have no B antigen, so the Anti-B well would stay smooth. Here it clumped.');
    if (G.d && !T.d) out.push(f + ' is Rh positive, so it would clump with Anti-D. Here the Anti-D well stayed smooth.');
    if (!G.d && T.d) out.push(f + ' is Rh negative, so the Anti-D well would stay smooth. Here it clumped.');
    out.push('Look at the wells again and choose another option.');
    return { head, out };
  }

  function antigenPhrase(g) {
    const t = GROUPS[g], l = [];
    if (t.a) l.push('A'); if (t.b) l.push('B'); if (t.d) l.push('RhD');
    if (!l.length) return 'no A, B or RhD antigen';
    return 'the ' + l.join(' and ').replace(/ and (?=[^ ]+ and)/, ', ') + ' antigen' + (l.length > 1 ? 's' : '');
  }
  function antibodyPhrase(g) {
    const t = GROUPS[g], l = [];
    if (!t.a) l.push('anti-A'); if (!t.b) l.push('anti-B');
    return l.length ? l.join(' and ') : 'no anti-A or anti-B';
  }
  function listPhrase(arr) {
    const f = arr.map(fmt);
    return f.length === 1 ? f[0] : f.slice(0, -1).join(', ') + ' and ' + f[f.length - 1];
  }

  function cantGive(P, X) {
    const p = GROUPS[P], x = GROUPS[X], out = [], extra = [];
    if (p.a && !x.a) extra.push('A'); if (p.b && !x.b) extra.push('B');
    if (extra.length) out.push(`${fmt(P)} red cells have the ${extra.join(' and ')} antigen${extra.length > 1 ? 's' : ''}. A person with group ${fmt(X)} has ${extra.map(e => 'anti-' + e).join(' and ')} in their plasma, which would clump these cells.`);
    if (p.d && !x.d) out.push(`${fmt(P)} red cells have the RhD antigen. A person with group ${fmt(X)} is Rh negative and can make anti-D against them.`);
    return `${fmt(P)} cannot donate blood to ${fmt(X)}. ` + out.join(' ');
  }
  function missedGive(P, X) {
    if (P === X) return `${fmt(P)} can donate blood to ${fmt(X)}. The same group is always a safe match.`;
    const p = GROUPS[P];
    if (!p.a && !p.b && !p.d) return `${fmt(P)} can donate blood to ${fmt(X)}. ${fmt(P)} red cells have no A, B or RhD antigen, so nothing in a ${fmt(X)} person's blood attacks them.`;
    return `${fmt(P)} can donate blood to ${fmt(X)}. A person with group ${fmt(X)} already has ${antigenPhrase(P)} on their own cells, so their plasma has no antibody against ${fmt(P)} cells.`;
  }
  function cantReceive(P, X) {
    const p = GROUPS[P], x = GROUPS[X], out = [], extra = [];
    if (x.a && !p.a) extra.push('A'); if (x.b && !p.b) extra.push('B');
    if (extra.length) out.push(`${fmt(X)} red cells have the ${extra.join(' and ')} antigen${extra.length > 1 ? 's' : ''}. ${fmt(P)} plasma has ${extra.map(e => 'anti-' + e).join(' and ')}, which would clump them.`);
    if (x.d && !p.d) out.push(`${fmt(X)} red cells have the RhD antigen. A ${fmt(P)} person is Rh negative and can make anti-D against them.`);
    return `${fmt(P)} cannot receive blood from ${fmt(X)}. ` + out.join(' ');
  }
  function missedReceive(P, X) {
    if (P === X) return `${fmt(P)} can receive blood from ${fmt(X)}. The same group is always a safe match.`;
    const x = GROUPS[X];
    if (!x.a && !x.b && !x.d) return `${fmt(P)} can receive blood from ${fmt(X)}. ${fmt(X)} red cells have no A, B or RhD antigen, so ${fmt(P)} plasma has nothing to react with.`;
    return `${fmt(P)} can receive blood from ${fmt(X)}. ${fmt(X)} red cells have only antigens that ${fmt(P)} cells also have, so ${fmt(P)} plasma will not attack them.`;
  }
  function rightSummary(P) {
    const out = [];
    out.push(`${fmt(P)} red cells have ${antigenPhrase(P)}. The plasma has ${antibodyPhrase(P)}.`);
    out.push(`${fmt(P)} can donate blood to ${listPhrase(donateTo(P))}. These groups already have every antigen found on ${fmt(P)} cells, so their plasma will not attack them.`);
    out.push(`${fmt(P)} can receive blood from ${listPhrase(receiveFrom(P))}. These red cells have no antigen that ${fmt(P)} lacks, so ${fmt(P)} plasma will not clump them.`);
    if (!GROUPS[P].d) out.push('An Rh negative person has no anti-D at first, but makes it after receiving Rh positive cells. That is why Rh positive blood is kept away from them.');
    return out;
  }

  // ---------------------------------------------------------------------
  // Panels
  // ---------------------------------------------------------------------
  function renderPanel() {
    // Keep focus and scroll position across re-renders.
    const active = document.activeElement;
    const focusKey = active && panel.contains(active) ? active.getAttribute('data-key') : null;
    const oldCard = panel.querySelector('.card');
    const oldKind = oldCard ? oldCard.dataset.kind : null;
    const oldScroll = oldCard ? oldCard.scrollTop : 0;

    if (S.phase < 2) { panel.innerHTML = ''; return; }
    if (S.phase === 2) { panel.innerHTML = renderId(); S.idFaded = true; }
    else { panel.innerHTML = renderQuiz(); S.quizFaded = true; }

    const card = panel.querySelector('.card');
    if (card && card.dataset.kind === oldKind) card.scrollTop = oldScroll;
    if (focusKey) {
      const again = panel.querySelector(`[data-key="${CSS.escape(focusKey)}"]`);
      if (again) again.focus();
    }
  }

  function renderId() {
    const done = S.idState === 'right';
    const opts = ORDER.map(g => {
      let cls = '';
      if (done && g === S.patient) cls = 'pick-right';
      else if (S.idState === 'wrong' && g === S.guess) cls = 'pick-wrong';
      return `<button type="button" data-act="guess" data-g="${g}" data-key="guess-${g}" class="${cls}" aria-pressed="${!S.idState && S.guess === g}">${fmt(g)}</button>`;
    }).join('');
    let fb = '';
    if (S.idState === 'wrong') {
      const r = wrongIdLines(S.guess, S.patient);
      fb = `<div class="note bad" aria-live="polite"><p><b>${esc(r.head)}</b></p><ul>${r.out.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
    } else if (done) {
      fb = `<div class="note ok" aria-live="polite"><p><b>${esc('Correct. This blood is ' + fmt(S.patient) + '.')}</b></p><ul>${wellLines(S.patient).map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        <div class="actions"><button type="button" class="primary" data-act="toQuiz" data-key="toQuiz">Check compatibility</button></div></div>`;
    }
    const actions = done ? '' : `<div class="actions"><button type="button" class="primary" data-act="checkId" data-key="checkId">Check answer</button><button type="button" class="secondary" data-act="showId" data-key="showId">Show answer</button></div>`;
    return `<section class="card card-id${S.idFaded ? '' : ' fade'}" data-kind="id" aria-labelledby="id-title">
      <h3 id="id-title">Which blood group is this?</h3>
      <p class="lead">Use the three wells on the tile to decide.</p>
      <div class="groups" role="group" aria-label="Blood groups">${opts}</div>
      <p class="error" aria-live="polite">${esc(S.idError)}</p>
      ${actions}
      ${fb}
    </section>`;
  }

  function quizStatus() {
    const P = S.patient, rightD = donateTo(P), rightR = receiveFrom(P);
    const wD = S.donate.filter(x => !rightD.includes(x)), mD = rightD.filter(x => !S.donate.includes(x));
    const wR = S.receive.filter(x => !rightR.includes(x)), mR = rightR.filter(x => !S.receive.includes(x));
    return { allRight: !wD.length && !mD.length && !wR.length && !mR.length, rightD, rightR, mD, mR };
  }

  function boxFeedback(id, st) {
    const P = S.patient, items = S[id], right = id === 'donate' ? st.rightD : st.rightR;
    const missing = id === 'donate' ? st.mD : st.mR;
    const lines = items.map(x => {
      const ok = right.includes(x);
      const text = id === 'donate' ? (ok ? missedGive(P, x) : cantGive(P, x)) : (ok ? missedReceive(P, x) : cantReceive(P, x));
      return `<p class="fline ${ok ? 'ok' : 'bad'}">${esc(text)}</p>`;
    });
    if (missing.length) lines.push(`<p class="fline bad">${esc(id === 'donate' ? 'This box is missing at least one group that can safely receive this blood.' : 'This box is missing at least one group this person can safely receive from.')}</p>`);
    return `<div class="fbbox" aria-live="polite">${lines.join('')}</div>`;
  }

  function renderQuiz() {
    const P = S.patient, st = quizStatus(), locked = S.quizDone;
    const bank = ORDER.map(x => `<button type="button" class="chip${S.selected === x ? ' sel' : ''}" data-chip="${x}" data-from="bank" data-key="chip-${x}" aria-pressed="${S.selected === x}">${fmt(x)}</button>`).join('');
    const box = (id, items, right) => {
      const inner = items.length ? items.map(x => {
        const cls = S.checked ? (right.includes(x) ? ' right' : ' wrong') : '';
        return `<span class="placed${cls}" data-chip="${x}" data-from="${id}">${fmt(x)}${locked ? '' : `<button type="button" class="x" data-act="remove" data-box="${id}" data-g="${x}" data-key="x-${id}-${x}" aria-label="Remove ${fmt(x)}">×</button>`}</span>`;
      }).join('') : '<span class="empty">Drag blood groups here</span>';
      return `<div class="drop-box" data-drop="${id}" data-key="box-${id}" tabindex="0" role="button" aria-label="${id === 'donate' ? 'Can donate to' : 'Can receive from'} box. Press Enter to add the selected group.">${inner}</div>
        ${S.checked ? boxFeedback(id, st) : ''}`;
    };
    const finish = S.checked && st.allRight
      ? '<div class="note ok" aria-live="polite"><p><b>All correct.</b></p></div>' : '';
    return `<section class="card card-quiz${S.quizFaded ? '' : ' fade'}" data-kind="quiz" aria-labelledby="quiz-title">
      <h3 id="quiz-title" tabindex="-1">Determine the compatibility of this blood group.</h3>
      <p class="lead">Drag and drop each group into the sentence where it fits. A group can also go in both boxes.</p>
      <div class="bank" role="group" aria-label="Blood groups">${bank}</div>
      <p class="sentence">The person with blood group <b>${fmt(P)}</b> can donate blood to</p>
      ${box('donate', S.donate, st.rightD)}
      <p class="sentence">The person with blood group <b>${fmt(P)}</b> can receive blood from</p>
      ${box('receive', S.receive, st.rightR)}
      <p class="error" aria-live="polite">${esc(S.quizError)}</p>
      ${locked ? '' : '<div class="actions"><button type="button" class="primary" data-act="checkQuiz" data-key="checkQuiz">Check answer</button><button type="button" class="secondary" data-act="showQuiz" data-key="showQuiz">Show answer</button></div>'}
      ${finish}
    </section>`;
  }

  function addTo(boxId, g) {
    if (S.quizDone) return;
    if (!S[boxId].includes(g)) S[boxId].push(g);
    S[boxId].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b));
    S.quizError = ''; S.checked = false;
  }
  function removeFrom(boxId, g) { S[boxId] = S[boxId].filter(x => x !== g); S.checked = false; }

  // ---------------------------------------------------------------------
  // Pop-ups
  // ---------------------------------------------------------------------
  let lastFocus = null;

  function openModal(title, html, extra) {
    lastFocus = document.activeElement;
    modalTitle.textContent = title;
    modalBody.innerHTML = html;
    modalBox.className = 'modal' + (extra ? ' ' + extra : '');
    updateCanvasScale();
    modalLayer.classList.remove('hidden');
    modalClose.focus({ preventScroll: true });
    modalBox.scrollTop = 0;
  }

  function closeModal() {
    if (modalLayer.classList.contains('hidden')) return;
    modalLayer.classList.add('hidden');
    modalBody.innerHTML = '';
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  // The pop-up lives outside the SVG (so its backdrop covers the whole screen);
  // scale its 1920x1080 stage to match the canvas's on-screen size.
  const masterSvg = document.getElementById('master-svg');
  function updateCanvasScale() {
    const r = masterSvg.getBoundingClientRect();
    const s = Math.min(r.width / 1920, r.height / 1080) || 1;
    modalLayer.style.setProperty('--canvas-scale', s.toFixed(4));
  }
  window.addEventListener('resize', updateCanvasScale);

  modalClose.addEventListener('click', closeModal);
  modalLayer.addEventListener('click', e => { if (e.target === modalLayer || e.target === modalBack) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

  function showIdAnswer() {
    openModal('The answer is ' + fmt(S.patient), `<ul>${wellLines(S.patient).map(x => `<li>${esc(x)}</li>`).join('')}</ul>`);
  }

  function showQuizAnswer() {
    const P = S.patient;
    const row = arr => `<div class="ans-row">${arr.map(x => `<span class="ans">${fmt(x)}</span>`).join('')}</div>`;
    openModal('Here is the answer',
      `<p class="sentence">The person with blood group <b>${fmt(P)}</b> can donate blood to</p>${row(donateTo(P))}
       <p class="sentence">The person with blood group <b>${fmt(P)}</b> can receive blood from</p>${row(receiveFrom(P))}
       <ul>${rightSummary(P).map(x => `<li>${esc(x)}</li>`).join('')}</ul>`);
  }

  function showInsights() {
    const abo = [['A', 'A', 'Anti-B'], ['B', 'B', 'Anti-A'], ['AB', 'A and B', 'None'], ['O', 'None', 'Anti-A and anti-B']];
    const comp = [
      ['O-', 'All groups', 'O-'], ['O+', 'O+, A+, B+, AB+', 'O+, O-'],
      ['A-', 'A-, A+, AB-, AB+', 'A-, O-'], ['A+', 'A+, AB+', 'A+, A-, O+, O-'],
      ['B-', 'B-, B+, AB-, AB+', 'B-, O-'], ['B+', 'B+, AB+', 'B+, B-, O+, O-'],
      ['AB-', 'AB-, AB+', 'AB-, A-, B-, O-'], ['AB+', 'AB+', 'All groups']
    ].map(r => r.map(c => c.replace(/-/g, '−')));
    const table = (head, rows) => `<table class="itable"><thead><tr>${head.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    openModal('Insights',
      `<h3>ABO blood group system</h3>
       ${table(['Blood group', 'Antigen on red cells', 'Antibody in plasma'], abo)}
       <ul><li>An antibody meeting its matching antigen makes red cells clump. This is agglutination.</li></ul>
       <h3>Rh factor</h3>
       <ul>
         <li>Rh factor is the RhD antigen on red cells.</li>
         <li>RhD present: Rh positive (+). RhD absent: Rh negative (−).</li>
         <li>Rh negative people make anti-D only after exposure to Rh positive blood.</li>
         <li>Rh negative people should receive only Rh negative blood.</li>
       </ul>
       <h3>Donor and recipient compatibility (red cells)</h3>
       ${table(['Blood group', 'Can donate to', 'Can receive from'], comp)}
       <ul>
         <li>Donor red cells must not carry an antigen the recipient lacks.</li>
         <li>O− is the universal donor.</li>
         <li>AB+ is the universal recipient.</li>
       </ul>`, 'wide plainhead');
  }

  // ---------------------------------------------------------------------
  // Panel interaction: clicks / keyboard
  // ---------------------------------------------------------------------
  let drag = null, suppressClick = false;

  panel.addEventListener('click', e => {
    if (suppressClick) { suppressClick = false; return; }
    const t = e.target.closest('[data-act],[data-chip],[data-drop]');
    if (!t) return;
    const act = t.getAttribute('data-act');
    if (act === 'guess') { if (S.idState === 'right') return; S.guess = t.dataset.g; S.idError = ''; S.idState = null; renderPanel(); return; }
    if (act === 'checkId') {
      if (!S.guess) { S.idError = 'Choose a blood group first.'; renderPanel(); return; }
      S.idState = S.guess === S.patient ? 'right' : 'wrong'; renderPanel(); return;
    }
    if (act === 'showId') { showIdAnswer(); return; }
    if (act === 'toQuiz') { S.phase = 3; refreshAll(); focusFirst(); return; }
    if (act === 'remove') { removeFrom(t.dataset.box, t.dataset.g); renderPanel(); return; }
    if (act === 'checkQuiz') {
      if (!S.donate.length || !S.receive.length) { S.quizError = 'Place at least one group in each box before checking.'; renderPanel(); return; }
      S.checked = true; S.selected = null; S.quizDone = quizStatus().allRight; renderPanel(); return;
    }
    if (act === 'showQuiz') { showQuizAnswer(); return; }
    if (act === 'new') { newPatient(); return; }
    if (S.phase !== 3 || S.quizDone) return;
    if (t.dataset.chip && t.dataset.from === 'bank') { S.selected = S.selected === t.dataset.chip ? null : t.dataset.chip; renderPanel(); return; }
    if (t.dataset.drop && S.selected) { addTo(t.dataset.drop, S.selected); S.selected = null; renderPanel(); return; }
    if (t.dataset.drop && !S.selected) { S.quizError = 'Drag a group into the box, or tap a group first and then the box.'; renderPanel(); }
  });

  panel.addEventListener('keydown', e => {
    const box = e.target.closest('[data-drop]');
    if (box && e.target === box && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); box.click(); }
  });

  // Move focus to the new card's heading (so keyboard/screen-reader users land on it).
  function focusFirst() {
    const h = panel.querySelector('.card h3');
    if (h) h.focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------------
  // Drag and drop (pointer events; ghost lives in <body>)
  // ---------------------------------------------------------------------
  panel.addEventListener('pointerdown', e => {
    if (S.phase !== 3 || S.quizDone) return;
    if (e.target.closest('.x')) return;
    const c = e.target.closest('[data-chip]');
    if (!c) return;
    drag = { g: c.dataset.chip, from: c.dataset.from, sx: e.clientX, sy: e.clientY, ghost: null, over: null, id: e.pointerId };
  });

  window.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (!drag.ghost) {
      if (Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) return;
      drag.ghost = document.createElement('div');
      drag.ghost.className = 'drag-ghost';
      drag.ghost.textContent = fmt(drag.g);
      document.body.appendChild(drag.ghost);
    }
    e.preventDefault();
    drag.ghost.style.left = e.clientX + 'px';
    drag.ghost.style.top = e.clientY + 'px';
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const box = under && under.closest('[data-drop]');
    if (drag.over && drag.over !== box) drag.over.classList.remove('hover');
    if (box) box.classList.add('hover');
    drag.over = box;
  }, { passive: false });

  window.addEventListener('pointerup', e => {
    if (!drag || e.pointerId !== drag.id) return;
    if (drag.ghost) {
      drag.ghost.remove();
      suppressClick = true;
      setTimeout(() => { suppressClick = false; }, 50);
      const target = drag.over ? drag.over.dataset.drop : null;
      if (drag.over) drag.over.classList.remove('hover');
      if (target) {
        if (drag.from !== 'bank' && drag.from !== target) removeFrom(drag.from, drag.g);
        addTo(target, drag.g);
      } else if (drag.from !== 'bank') removeFrom(drag.from, drag.g);
      S.selected = null;
      drag = null;
      renderPanel();
      return;
    }
    drag = null;
  });

  window.addEventListener('pointercancel', () => {
    if (drag && drag.ghost) drag.ghost.remove();
    if (drag && drag.over) drag.over.classList.remove('hover');
    drag = null;
  });

  // ---------------------------------------------------------------------
  // SVG buttons (click + Enter/Space)
  // ---------------------------------------------------------------------
  function bindSvgButton(el, fn) {
    el.addEventListener('click', fn);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
    });
  }

  bindSvgButton(btnAction, onAction);
  bindSvgButton(btnNew, () => newPatient());
  bindSvgButton(btnInsights, showInsights);

  // ---------------------------------------------------------------------
  // New sample
  // ---------------------------------------------------------------------
  function newPatient() {
    gen++;
    closeModal();
    if (drag && drag.ghost) drag.ghost.remove();
    drag = null;
    destroyAnims();
    let patient;
    do { patient = ORDER[Math.floor(Math.random() * ORDER.length)]; } while (ORDER.length > 1 && patient === S.patient);
    S = {
      patient,
      blood: false, reagents: false, busy: false, phase: 0,
      guess: null, idState: null, idError: '', idFaded: false,
      donate: [], receive: [], selected: null, checked: false, quizDone: false, quizError: '', quizFaded: false
    };
    loadScene(patient);
    refreshAll();
  }

  newPatient();
})();
