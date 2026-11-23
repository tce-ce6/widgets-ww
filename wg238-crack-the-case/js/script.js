'use strict';

/* ==========================================================================
   wg238 — Crack the Case: Adjective or Adverb?  (widget logic)

   Flow (reference/en_en_04_wg238.docx + adjective-or-adverb.html):
     Briefing  clues for spotting an adjective and an adverb; START THE MISSION.
     Game      all 20 sets, shuffled (two same-job sets never back to back),
               the two sentences of each set shuffled too. The learner labels
               the word in each sentence; CHECK stamps the right answer above
               it and explains. No second try. CHECK -> NEXT CASE
               (SEE FINAL RESULT on the last case). A case is cracked only
               when both sentences are right.
     Results   CASE CLOSED stamp and "You cracked n of 20 cases!";
               PLAY AGAIN returns to the briefing.
   ========================================================================== */

(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ---------------------------------------------------------------------
  // Game library (Data Table 2). [word] marks the target word.
  // ---------------------------------------------------------------------
  const P = (word, a, b) => ({ word, rows: [a, b] });
  const R = (s, a, why) => ({ s, a, why });
  const LABEL = { adj: 'adjective', adv: 'adverb' };

  const SETS = [
    P('fast', R('Meena has a [fast] bicycle with five gears.', 'adj', 'It comes just before “bicycle” and tells us what kind of bicycle Meena has.'),
      R('The cheetah ran [fast] across the grassland.', 'adv', 'It tells us how the cheetah ran.')),
    P('hard', R('Our team practised [hard] before the final.', 'adv', 'It tells us how the team practised.'),
      R('This mango is still too [hard] to eat.', 'adj', 'It comes after “is still too” and tells us more about the mango.')),
    P('early', R('We caught the [early] train to Pune.', 'adj', 'It comes just before “train” and tells us which train we caught.'),
      R('Ravi woke up [early] on the day of the trip.', 'adv', 'It tells us when Ravi woke up.')),
    P('high', R('The eagle flew [high] above the hills.', 'adv', 'It tells us where the eagle flew.'),
      R('The wall around the old fort is very [high].', 'adj', 'It comes after “is very” and tells us more about the wall.')),
    P('low', R('Sit on the [low] stool near the window.', 'adj', 'It comes just before “stool” and tells us what kind of stool.'),
      R('The plane flew [low] over the village.', 'adv', 'It tells us where the plane flew.')),
    P('far', R('We walked [far] into the forest.', 'adv', 'It tells us where we walked.'),
      R('Aunty lives on the [far] side of the river.', 'adj', 'It comes just before “side” and tells us which side.')),
    P('long', R('It was a [long] drive to Shimla.', 'adj', 'It comes just before “drive” and tells us what kind of drive it was.'),
      R('We did not have to wait [long] for the bus.', 'adv', 'It tells us how much time we had to wait.')),
    P('deep', R('Do not swim at the [deep] end of the pool.', 'adj', 'It comes just before “end” and tells us which end.'),
      R('The roots of the banyan tree go [deep] into the ground.', 'adv', 'It tells us where the roots go.')),
    P('right', R('Turn [right] at the temple to reach the market.', 'adv', 'It tells us where to turn.'),
      R('Arjun gave the [right] answer in the quiz.', 'adj', 'It comes just before “answer” and tells us more about the answer.')),
    P('daily', R('Dad reads the [daily] newspaper with his tea.', 'adj', 'It comes just before “newspaper” and tells us what kind of newspaper.'),
      R('Water the tulsi plant [daily].', 'adv', 'It tells us when to water the plant.')),
    P('weekly', R('Our class library books are changed [weekly].', 'adv', 'It tells us when the books are changed.'),
      R('We have a [weekly] spelling test on Fridays.', 'adj', 'It comes before “spelling test” and tells us what kind of test.')),
    P('close', R('Priya and Sana are [close] friends.', 'adj', 'It comes just before “friends” and tells us what kind of friends they are.'),
      R('Stand [close] together so that everyone fits in the photo.', 'adv', 'It tells us where to stand.')),
    P('wrong', R('Karan spelt my name [wrong] on the card.', 'adv', 'It tells us how Karan spelt my name.'),
      R('We got on the [wrong] bus by mistake.', 'adj', 'It comes just before “bus” and tells us which bus.')),
    P('straight', R('Draw a [straight] line with your ruler.', 'adj', 'It comes just before “line” and tells us what kind of line.'),
      R('Come [straight] home after school.', 'adv', 'It tells us how to come home.')),
    P('late', R('The guests arrived [late] for dinner.', 'adv', 'It tells us when the guests arrived.'),
      R('My brother stayed up [late] to finish his model.', 'adv', 'It tells us when my brother stayed up.')),
    P('monthly', R('We pay the milkman [monthly].', 'adv', 'It tells us when we pay the milkman.'),
      R('The school magazine comes out [monthly].', 'adv', 'It tells us when the magazine comes out.')),
    P('softly', R('The cat walked [softly] across the roof.', 'adv', 'It tells us how the cat walked.'),
      R('Please speak [softly] in the hospital.', 'adv', 'It tells us how to speak.')),
    P('friendly', R('Our new neighbours are very [friendly].', 'adj', 'It comes after “are very” and tells us more about the neighbours. It ends in -ly, but it is still an adjective.'),
      R('A [friendly] dog wagged its tail at us.', 'adj', 'It comes just before “dog” and tells us what kind of dog.')),
    P('lovely', R('What a [lovely] garden you have!', 'adj', 'It comes just before “garden” and tells us what kind of garden. It ends in -ly, but it is still an adjective.'),
      R('The weather in Ooty was [lovely].', 'adj', 'It comes after “was” and tells us more about the weather.')),
    P('lonely', R('The [lonely] kitten cried all night.', 'adj', 'It comes just before “kitten” and tells us what kind of kitten. It ends in -ly, but it is still an adjective.'),
      R('Grandpa feels [lonely] when we are away.', 'adj', 'It comes after “feels” and tells us more about Grandpa.'))
  ];

  // ---------------------------------------------------------------------
  // DOM
  // ---------------------------------------------------------------------
  const stage = $('#stage');
  const screens = $$('.screen');
  const promptWord = $('#prompt-word');
  const counterNum = $('#counter-num');
  const rows = $$('#game .row');
  const mainBtn = $('#main-btn');

  // ---------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------
  let order = [];     // this game's sets, shuffled
  let caseIdx = 0;    // index into order
  let solved = 0;     // cases with both sentences right
  let picks = [null, null];
  let checked = false;

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------
  function shuffle(list) {
    const a = list.slice();
    for (let j = a.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [a[j], a[k]] = [a[k], a[j]];
    }
    return a;
  }

  const sameJob = (p) => p.rows[0].a === p.rows[1].a;

  // Sentence -> DOM, with the [word] wrapped in a highlighted span.
  function fillSentence(el, s) {
    el.textContent = '';
    const inner = document.createElement('span');
    const m = s.match(/^(.*?)\[(.+?)\](.*)$/);
    inner.append(m[1]);
    const t = document.createElement('span');
    t.className = 'target';
    t.textContent = m[2];
    inner.append(t, m[3]);
    el.appendChild(inner);
  }

  function show(id) {
    screens.forEach((s) => s.classList.toggle('active', s.id === id));
    stage.dataset.screen = id;
  }

  // ---------------------------------------------------------------------
  // Briefing
  // ---------------------------------------------------------------------
  function briefing() {
    show('brief');
  }

  // ---------------------------------------------------------------------
  // Game
  // ---------------------------------------------------------------------
  function newGame() {
    // Shuffle the sets, keeping same-job sets apart, and the sentences in each.
    let o;
    do { o = shuffle(SETS); } while (o.some((p, j) => j > 0 && sameJob(p) && sameJob(o[j - 1])));
    order = o.map((p) => ({ word: p.word, rows: shuffle(p.rows) }));
    caseIdx = 0;
    solved = 0;
    show('game');
    showCase();
  }

  function showCase() {
    const set = order[caseIdx];
    picks = [null, null];
    checked = false;
    promptWord.textContent = set.word;
    counterNum.textContent = `${caseIdx + 1} of ${order.length}`;
    rows.forEach((row, k) => {
      row.classList.remove('checked');
      fillSentence($('.sentence', row), set.rows[k].s);
      $$('.pick', row).forEach((b) => {
        b.disabled = false;
        b.setAttribute('aria-pressed', 'false');
      });
      const fb = $('.fb', row);
      fb.className = 'fb hidden';
      fb.textContent = '';
    });
    setMainButton('Check', 'btn-check');
    mainBtn.disabled = true;
  }

  function setMainButton(label, cls) {
    mainBtn.textContent = label;
    mainBtn.className = `btn ${cls}`;
  }

  function choose(row, btn) {
    if (checked) return;
    const k = +row.dataset.k;
    picks[k] = btn.dataset.a;
    $$('.pick', row).forEach((b) => b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'));
    mainBtn.disabled = picks.includes(null);
  }

  function stamp(target, kind) {
    const old = $('.stamp', target);
    if (old) old.remove();
    const m = document.createElement('span');
    m.className = `stamp ${kind}`;
    m.textContent = LABEL[kind];
    m.setAttribute('aria-hidden', 'true');
    target.appendChild(m);
  }

  function check() {
    const set = order[caseIdx];
    let both = true;
    rows.forEach((row, k) => {
      const r = set.rows[k];
      const ok = picks[k] === r.a;
      if (!ok) both = false;
      row.classList.add('checked');
      $$('.pick', row).forEach((b) => { b.disabled = true; });
      stamp($('.target', row), r.a);
      const fb = $('.fb', row);
      fb.className = `fb ${ok ? 'ok' : 'no'}`;
      fb.innerHTML = '';
      const head = document.createElement('b');
      head.textContent = ok ? 'Correct!' : 'Not quite.';
      // Skip the closing "It's an ..." when the reason already says so (-ly adjectives).
      const tail = /still an? (adjective|adverb)\.$/.test(r.why) ? '' : ` It’s an ${LABEL[r.a]}.`;
      fb.append(head, ` ${r.why}${tail}`);
    });
    if (both) solved++;
    checked = true;
    const last = caseIdx === order.length - 1;
    setMainButton(last ? 'See final result' : 'Next case', last ? 'btn-final' : 'btn-next');
    mainBtn.disabled = false;
    mainBtn.focus({ preventScroll: true });
  }

  function onMain() {
    if (!checked) { check(); return; }
    caseIdx++;
    if (caseIdx < order.length) showCase();
    else results();
  }

  // ---------------------------------------------------------------------
  // Results
  // ---------------------------------------------------------------------
  function results() {
    $('#score-num').textContent = solved;
    $('#score-total').textContent = order.length;
    // Restart the slam each time
    const st = $('#closed-stamp');
    st.style.animation = 'none';
    void st.offsetWidth;
    st.style.animation = '';
    show('result');
    $('#again-btn').focus({ preventScroll: true });
  }

  // ---------------------------------------------------------------------
  // Events
  // ---------------------------------------------------------------------
  $('#start-btn').addEventListener('click', newGame);
  $('#again-btn').addEventListener('click', briefing);
  mainBtn.addEventListener('click', onMain);
  rows.forEach((row) => {
    $$('.pick', row).forEach((b) => b.addEventListener('click', () => choose(row, b)));
  });

  briefing();
})();
