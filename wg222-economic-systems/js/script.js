/* ==========================================================================
   wg222 — Economic Systems (CBSE Grade 9 Economics)

   Two moves, as the storyboard: the learner builds a comparison table one
   cell at a time by choosing the correct answer from real options, then
   applies it to four unlabelled situations.

   Behaviour, content and copy: reference/en_eco_9_wg222.html (the source of
   truth per the storyboard, reference/en_eco_9_wg222.docx). Layout and look:
   the design, reference/Widget/AI/en_eco_9_wg222.svg.

   To edit content: change FEATURES or SITUATIONS only.
   ========================================================================== */
(function () {
  'use strict';

  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

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

  const sysName = { market: 'Market', command: 'Command', mixed: 'Mixed' };
  const SYSTEMS = ['market', 'command', 'mixed'];

  // Each feature is a row. Each system cell has its OWN correct answer and its
  // OWN real distractors (plausible but wrong), so it is not guessable by elimination.
  const FEATURES = [
    {
      id: 'own', label: 'Who owns resources?', sub: 'Factories, land, businesses',
      cells: {
        market: { correct: 'Private individuals and firms', distractors: ['Only foreign companies', 'Village councils', 'Worker unions'] },
        command: { correct: 'The state', distractors: ['Private banks', 'Local landlords', 'Religious trusts'] },
        mixed: { correct: 'Both private and state', distractors: ['Only the state', 'Only private firms', 'Charities alone'] }
      }
    },
    {
      id: 'decide', label: 'Who decides production?', sub: 'What to make and how much',
      cells: {
        market: { correct: 'Buyers and sellers', distractors: ['A five-year plan', 'The army', 'A royal family'] },
        command: { correct: 'Government planners', distractors: ['Shop owners', 'Foreign investors', 'Stock markets'] },
        mixed: { correct: 'Market, with the state guiding', distractors: ['Only central planners', 'Only shoppers', 'Trade unions only'] }
      }
    },
    {
      id: 'drive', label: 'What drives activity?', sub: 'The main motive',
      cells: {
        market: { correct: 'Profit', distractors: ['Equal shares for all', 'Orders from officials', 'National pride alone'] },
        command: { correct: "Society's planned needs", distractors: ['Private profit', 'Competition between firms', 'Advertising'] },
        mixed: { correct: 'Profit and social goals', distractors: ['Profit only', 'State needs only', 'Charity only'] }
      }
    },
    {
      id: 'price', label: 'What sets prices?', sub: 'When goods are scarce',
      cells: {
        market: { correct: 'Supply and demand', distractors: ['A government price list', 'A fixed rate forever', 'The largest buyer'] },
        command: { correct: 'The government fixes them', distractors: ['Daily auctions', 'Shopkeepers freely', 'Foreign exchanges'] },
        mixed: { correct: 'Market, with some state control', distractors: ['Government fixes all', 'Fully free, no limits', 'Buyers vote on them'] }
      }
    }
  ];

  const SITUATIONS = [
    {
      story: 'A new phone brand opens a factory because it sees a chance to make money. No official told it to. It sets its own prices and competes with rivals.',
      answer: 'market',
      why: 'A private firm, acting for profit, choosing on its own what to make and what to charge. No state direction. That is the market at work.'
    },
    {
      story: 'The government owns the farms and tells each one exactly which crops to grow and how much. Prices are fixed by officials, not by shops.',
      answer: 'command',
      why: 'State ownership, a central plan setting production, and government-fixed prices. Every marker points to a command system.'
    },
    {
      story: 'Private companies run most businesses for profit, but the government runs public hospitals and gives free schooling to the poor.',
      answer: 'mixed',
      why: 'Private firms and profit on one side, state-run services and social goals on the other, together. That balance is the mixed economy.'
    },
    {
      story: 'After a bad harvest, bread becomes scarce. Its price quickly rises on its own, and shops never run empty because the higher price cools demand.',
      answer: 'market',
      why: 'Prices move freely with supply and demand, and that movement clears the shortage. Free pricing is a market feature.'
    }
  ];

  // Design art: feature icon (table row) and the faint panel picture for each feature;
  // one illustration per situation. Panel art boxes are relative to the question panel.
  const PANEL_ART = {
    own: { left: 36, top: 5, w: 258, h: 194 },
    decide: { left: 61, top: 3, w: 249, h: 195 },
    drive: { left: 106, top: 2, w: 130, h: 196 },
    price: { left: 69, top: 7, w: 203, h: 191 }
  };
  const TICK = (size) => `<svg class="tick" viewBox="0 0 38 38" width="${size}" height="${size}" aria-hidden="true"><circle cx="19" cy="19" r="18" fill="#4c9936" stroke="#fff" stroke-width="2"/><path d="M11 19.5l5.5 5.5L27.5 13" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };

  /* ---------- screens ---------- */
  function show(id) {
    $$('.screen').forEach((s) => s.classList.toggle('show', s.id === id));
    $('#startover').hidden = id === 'stage-intro';
  }

  /* ============ COMPARISON TABLE ============ */
  // Fixed queue of (feature, system) cells in reading order.
  const queue = [];
  FEATURES.forEach((f) => SYSTEMS.forEach((sys) => queue.push({ f, sys })));
  let qi = 0;

  const tableWrap = $('#table-wrap');
  FEATURES.forEach((f) => {
    const row = document.createElement('div');
    row.className = 'trow';
    row.innerHTML =
      `<div class="cell-label"><img src="./assets/images/icon-${f.id}.svg" alt=""><span class="lbl">${f.label}</span><span class="sub">${f.sub}</span></div>` +
      SYSTEMS.map((sys) => `<div class="ans ${sys}" id="ans-${f.id}-${sys}" aria-label="${f.label} ${sysName[sys]}: not yet answered">${TICK(22)}<span class="q" aria-hidden="true">?</span><span class="txt"></span></div>`).join('');
    tableWrap.appendChild(row);
  });

  const askPrompt = $('#ask-prompt');
  const askOpts = $('#ask-opts');
  const askFeedback = $('#ask-feedback');
  const askArt = $('#ask-art');
  const ansEl = (f, sys) => $(`#ans-${f.id}-${sys}`);
  const clearAwaiting = () => $$('.ans.awaiting').forEach((a) => a.classList.remove('awaiting'));

  function renderCell() {
    if (qi >= queue.length) { completeBuild(); return; }
    const cur = queue[qi];
    clearAwaiting();
    ansEl(cur.f, cur.sys).classList.add('awaiting');

    askPrompt.innerHTML = `${cur.f.label.replace('?', '')} in a <strong>${sysName[cur.sys]}</strong> economy?`;
    askFeedback.textContent = '';
    const art = PANEL_ART[cur.f.id];
    askArt.src = `./assets/images/panel-${cur.f.id}.svg`;
    Object.assign(askArt.style, { left: `${art.left}px`, top: `${art.top}px`, width: `${art.w}px`, height: `${art.h}px` });

    const cell = cur.f.cells[cur.sys];
    askOpts.innerHTML = '';
    shuffle([cell.correct].concat(cell.distractors)).forEach((opt) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = opt;
      b.addEventListener('click', () => choose(cur, opt, b));
      askOpts.appendChild(b);
    });
  }

  function fillCell(cur) {
    const el = ansEl(cur.f, cur.sys);
    el.querySelector('.txt').textContent = cur.f.cells[cur.sys].correct;
    el.classList.add('filled');
    el.classList.remove('awaiting');
    el.setAttribute('aria-label', `${cur.f.label} ${sysName[cur.sys]}: ${cur.f.cells[cur.sys].correct}`);
  }

  function choose(cur, opt, btn) {
    if (opt === cur.f.cells[cur.sys].correct) {
      fillCell(cur);
      qi++;
      renderCell();
    } else {
      btn.classList.add('wrong');
      btn.disabled = true;
      btn.classList.remove('shake'); void btn.offsetWidth; btn.classList.add('shake');
      askFeedback.textContent = `Not quite. Think about what a ${sysName[cur.sys]} system values, and try again.`;
    }
  }

  function completeBuild() {
    clearAwaiting();
    $('#build-body').hidden = true;
    $('#build-complete-body').hidden = false;
    $('#build-skip').disabled = true;
    $('#build-reveal').disabled = true;
  }

  $('#build-skip').addEventListener('click', () => { qi++; renderCell(); });
  $('#build-reveal').addEventListener('click', () => { if (qi < queue.length) { fillCell(queue[qi]); qi++; renderCell(); } });
  $('#build-restart').addEventListener('click', () => resetBuild());

  function resetBuild() {
    FEATURES.forEach((f) => SYSTEMS.forEach((sys) => {
      const el = ansEl(f, sys);
      el.querySelector('.txt').textContent = '';
      el.className = `ans ${sys}`;
      el.setAttribute('aria-label', `${f.label} ${sysName[sys]}: not yet answered`);
    }));
    qi = 0;
    $('#build-body').hidden = false;
    $('#build-complete-body').hidden = true;
    $('#build-skip').disabled = false;
    $('#build-reveal').disabled = false;
    renderCell();
  }

  /* ============ SITUATIONS ============ */
  let sIndex = 0;
  const sitStory = $('#sit-story');
  const sitOpts = $('#sit-opts');
  const sitReveal = $('#sit-reveal');
  const sitCount = $('#sit-count');

  function renderSituation() {
    if (sIndex >= SITUATIONS.length) {
      $('#apply-body').hidden = true;
      $('#apply-done-body').hidden = false;
      sitCount.textContent = '';
      $('#apply-skip').disabled = true;
      $('#apply-reveal').disabled = true;
      $('#apply-next').disabled = true;
      return;
    }
    const s = SITUATIONS[sIndex];
    sitCount.textContent = `Situation ${sIndex + 1} of ${SITUATIONS.length}`;
    sitStory.textContent = s.story;
    $('#sit-art').src = `./assets/images/sit${sIndex + 1}.svg`;
    sitReveal.hidden = true;
    sitOpts.innerHTML = '';
    SYSTEMS.forEach((sys) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.dataset.sys = sys;
      b.innerHTML = `${TICK(38)}<span>${sysName[sys]} economy</span>`;
      b.addEventListener('click', () => revealSituation(s, sys));
      sitOpts.appendChild(b);
    });
  }

  function revealSituation(s, chosen) {
    $$('#sit-opts button').forEach((b) => {
      b.disabled = true;
      b.classList.toggle('right', b.dataset.sys === s.answer);
      b.classList.toggle('wrong', b.dataset.sys === chosen && chosen !== s.answer);
    });
    const correct = chosen === s.answer;
    sitReveal.hidden = false;
    sitReveal.classList.toggle('bad', !correct);
    $('#rv-name').textContent = `${correct ? 'Yes. ' : 'The system here is '}${sysName[s.answer]} economy.`;
    $('#rv-why').textContent = s.why;
  }

  $('#apply-next').addEventListener('click', () => {
    if (sIndex >= SITUATIONS.length) return;
    if (!sitReveal.hidden) { sIndex++; renderSituation(); } else { sitCount.textContent = 'Choose a system first, or use Skip.'; }
  });
  $('#apply-skip').addEventListener('click', () => { sIndex++; renderSituation(); });
  $('#apply-reveal').addEventListener('click', () => { const s = SITUATIONS[sIndex]; if (s) revealSituation(s, s.answer); });
  $('#apply-restart').addEventListener('click', () => resetApply());

  function resetApply() {
    sIndex = 0;
    $('#apply-body').hidden = false;
    $('#apply-done-body').hidden = true;
    $('#apply-skip').disabled = false;
    $('#apply-reveal').disabled = false;
    $('#apply-next').disabled = false;
    renderSituation();
  }

  /* ============ moving between stages ============ */
  function startOver() {
    resetBuild();
    resetApply();
    show('stage-intro');
  }
  $('#startover').addEventListener('click', startOver);
  $('#final-startover').addEventListener('click', startOver);
  $('#go-build').addEventListener('click', () => { show('stage-build'); renderCell(); });
  $('#go-apply').addEventListener('click', () => { show('stage-apply'); renderSituation(); });

  /* ---------- what the Help tour needs (js/how-to-play.js) ---------- */
  window.ES = {
    stage: () => ($$('.screen.show')[0] || {}).id,
    building: () => !$('#build-body').hidden,
    applying: () => !$('#apply-body').hidden
  };

  /* ---------- start ---------- */
  resetBuild();
  resetApply();
  show('stage-intro');
})();
