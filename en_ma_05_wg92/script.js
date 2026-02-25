/**
 * script.js — Factor Flash: Tests of Divisibility
 * Fixes: (1) rapid-click animation guard, (2) guaranteed ≥50% correct balls
 */

/* ============================================================
   CONSTANTS
   ============================================================ */
const BALL_NUMBERS = [2, 3, 4, 5, 6, 9, 10, 11];

const BALL_COLOR_CLASS = {
	2: 'ball-2',
	3: 'ball-3',
	4: 'ball-4',
	5: 'ball-5',
	6: 'ball-6',
	9: 'ball-9',
	10: 'ball-10',
	11: 'ball-11',
};

// Range for random target numbers
const TARGET_RANGE = { min: 100, max: 9999 };

// Minimum number of balls that must be correct (factors) — guarantees ~50%
const MIN_CORRECT_BALLS = 4;

/* ============================================================
   GAME STATE
   ============================================================ */
let state = {
	targetNumber: 0,
	ballStates: {},  // { 2: null|'correct'|'wrong', ... }
	isAnimating: false, // guard to prevent overlapping Lottie calls
};

/* ============================================================
   DOM REFS
   ============================================================ */
const dom = {
	ballsGrid: document.getElementById('balls-grid'),
	targetNumber: document.getElementById('target-number'),
	feedbackText: document.getElementById('feedback-text'),
	btnNew: document.getElementById('btn-new'),
	btnReset: document.getElementById('btn-reset'),
	lottieOverlay: document.getElementById('lottie-overlay'),
	lottieCorrectEl: document.getElementById('lottie-correct'),
	lottieWrongEl: document.getElementById('lottie-incorrect'),
};

/* ============================================================
   LOTTIE ANIMATION INSTANCES
   ============================================================ */
let lottieCorrect = null;
let lottieWrong = null;
let lottieTimer = null; // tracks the current hide-timer so we can cancel it

function initLottie() {
	lottieCorrect = lottie.loadAnimation({
		container: dom.lottieCorrectEl,
		renderer: 'svg',
		loop: false,
		autoplay: false,
		path: 'assets/anim/correct-confetti-anim.json',
	});

	lottieWrong = lottie.loadAnimation({
		container: dom.lottieWrongEl,
		renderer: 'svg',
		loop: false,
		autoplay: false,
		path: 'assets/anim/incorrect-cross-anim.json',
	});
}

/**
 * Play a lottie animation for `duration` ms.
 * If an animation is already playing, we cancel the previous timer and
 * restart cleanly — prevents rapid-click broken-state issues.
 */
function playLottie(type, duration = 1500) {
	// Cancel any pending hide-timer from the previous animation
	if (lottieTimer !== null) {
		clearTimeout(lottieTimer);
		lottieTimer = null;
	}

	// Stop both animations first
	if (lottieCorrect) lottieCorrect.stop();
	if (lottieWrong) lottieWrong.stop();

	// Show overlay and configure which player is visible
	dom.lottieOverlay.classList.add('active');
	dom.lottieCorrectEl.style.display = (type === 'correct') ? 'block' : 'none';
	dom.lottieWrongEl.style.display = (type === 'wrong') ? 'block' : 'none';

	// Play the right one from the beginning
	const anim = (type === 'correct') ? lottieCorrect : lottieWrong;
	if (anim) anim.play();

	// Schedule hide — store timer id so we can cancel on rapid clicks
	lottieTimer = setTimeout(() => {
		dom.lottieOverlay.classList.remove('active');
		if (lottieCorrect) lottieCorrect.stop();
		if (lottieWrong) lottieWrong.stop();
		lottieTimer = null;
	}, duration);
}

/* ============================================================
   HELPER: IS FACTOR
   ============================================================ */
function isFactor(n, target) {
	return target % n === 0;
}

/* ============================================================
   HELPER: COUNT CORRECT BALLS for a given number
   ============================================================ */
function countFactors(num) {
	return BALL_NUMBERS.filter(n => isFactor(n, num)).length;
}

/* ============================================================
   HELPER: RANDOM INT (inclusive)
   ============================================================ */
function randInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* ============================================================
   GENERATE TARGET NUMBER
   Guarantees at least MIN_CORRECT_BALLS of the 8 ball numbers
   are factors of the target (i.e., ≥50% correct balls).
   Uses rejection sampling — very fast in practice because numbers
   divisible by several small primes are common.
   ============================================================ */
function generateTarget() {
	let candidate;
	let attempts = 0;
	const maxAttempts = 5000;

	do {
		candidate = randInt(TARGET_RANGE.min, TARGET_RANGE.max);
		attempts++;
	} while (countFactors(candidate) < MIN_CORRECT_BALLS && attempts < maxAttempts);

	// Fallback: if we somehow never found one, build a guaranteed number.
	// LCM(2,3,4,5,6,9,10) = 180, so 180 * k has 7 correct balls (all except 11)
	if (attempts >= maxAttempts) {
		const k = randInt(1, 55);          // 180*55 = 9900 (within range)
		candidate = 180 * k;
	}

	state.targetNumber = candidate;
}

/* ============================================================
   RENDER TARGET NUMBER IN FLASK BOX
   ============================================================ */
function renderFlaskNumber() {
	dom.targetNumber.textContent = state.targetNumber.toLocaleString();
}

/* ============================================================
   RENDER BALLS GRID
   ============================================================ */
function renderBalls() {
	dom.ballsGrid.innerHTML = '';
	BALL_NUMBERS.forEach(n => {
		const wrap = document.createElement('div');
		wrap.className = 'ball-wrap';
		wrap.dataset.num = n;

		const ball = document.createElement('div');
		ball.className = `ball ${BALL_COLOR_CLASS[n]}`;
		ball.textContent = n;
		ball.id = `ball-${n}`;

		const label = document.createElement('span');
		label.className = 'ball-wrap-label';

		const s = state.ballStates[n];
		if (s === 'correct') {
			label.textContent = 'CORRECT';
			wrap.classList.add('correct', 'used');
		} else if (s === 'wrong') {
			label.textContent = 'WRONG';
			wrap.classList.add('wrong', 'used');
		}

		wrap.appendChild(ball);
		wrap.appendChild(label);
		dom.ballsGrid.appendChild(wrap);

		// Attach click listener only to un-clicked balls
		if (!s) {
			wrap.addEventListener('click', () => handleBallClick(n, wrap));
		}
	});
}

/* ============================================================
   SHOW FEEDBACK (screen-reader accessible)
   ============================================================ */
function showFeedback(text) {
	if (dom.feedbackText) {
		dom.feedbackText.textContent = text;
	}
}

/* ============================================================
   HANDLE BALL CLICK
   ============================================================ */
function handleBallClick(num, wrapEl) {
	// Guard: already clicked or not in DOM
	if (state.ballStates[num]) return;
	if (!wrapEl.isConnected) return;

	const correct = isFactor(num, state.targetNumber);
	state.ballStates[num] = correct ? 'correct' : 'wrong';

	if (correct) {
		/* ----- CORRECT ----- */
		// Mark the ball immediately in the DOM
		wrapEl.classList.add('correct', 'used');
		wrapEl.querySelector('.ball-wrap-label').textContent = 'CORRECT';
		// Detach click listener by replacing node
		const clone = wrapEl.cloneNode(true);
		wrapEl.replaceWith(clone);

		playLottie('correct', 1500);
		showFeedback(`✓ ${num} is a factor of ${state.targetNumber.toLocaleString()}`);

	} else {
		/* ----- WRONG ----- */
		// Immediately disable further clicks
		wrapEl.classList.add('used');
		const clickedBall = wrapEl.querySelector('.ball');
		if (clickedBall) clickedBall.style.pointerEvents = 'none';

		// Trigger fall animation
		wrapEl.classList.add('falling');

		setTimeout(() => {
			if (!wrapEl.isConnected) return; // guard: new round may have started
			wrapEl.classList.remove('falling');
			wrapEl.classList.add('wrong');
			const lbl = wrapEl.querySelector('.ball-wrap-label');
			if (lbl) lbl.textContent = 'WRONG';
			// Detach click listener
			const clone = wrapEl.cloneNode(true);
			wrapEl.replaceWith(clone);
		}, 650);

		playLottie('wrong', 1500);
		showFeedback(`✗ ${num} is not a factor of ${state.targetNumber.toLocaleString()}`);
	}
}

/* ============================================================
   START NEW ROUND
   ============================================================ */
function startNewRound() {
	// Cancel any active lottie before switching state
	if (lottieTimer !== null) {
		clearTimeout(lottieTimer);
		lottieTimer = null;
	}
	dom.lottieOverlay.classList.remove('active');
	if (lottieCorrect) lottieCorrect.stop();
	if (lottieWrong) lottieWrong.stop();

	state.ballStates = {};
	BALL_NUMBERS.forEach(n => { state.ballStates[n] = null; });
	generateTarget();
	renderFlaskNumber();
	renderBalls();
	showFeedback('Select a ball to begin!');
}

/* ============================================================
   FULL RESET
   ============================================================ */
function resetGame() {
	// Cancel any active lottie
	if (lottieTimer !== null) {
		clearTimeout(lottieTimer);
		lottieTimer = null;
	}
	dom.lottieOverlay.classList.remove('active');
	if (lottieCorrect) lottieCorrect.stop();
	if (lottieWrong) lottieWrong.stop();

	state = {
		targetNumber: 0,
		ballStates: {},
		isAnimating: false,
	};
	BALL_NUMBERS.forEach(n => { state.ballStates[n] = null; });
	generateTarget();
	renderFlaskNumber();
	renderBalls();
	showFeedback('Select a ball to begin!');
}

/* ============================================================
   EVENT LISTENERS
   ============================================================ */
dom.btnNew.addEventListener('click', startNewRound);
dom.btnReset.addEventListener('click', resetGame);

document.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') startNewRound();
	if (e.key === 'Escape') {
		if (lottieTimer !== null) { clearTimeout(lottieTimer); lottieTimer = null; }
		dom.lottieOverlay.classList.remove('active');
	}
});

/* ============================================================
   INIT
   ============================================================ */
function init() {
	initLottie();
	BALL_NUMBERS.forEach(n => { state.ballStates[n] = null; });
	generateTarget();
	renderFlaskNumber();
	renderBalls();
	showFeedback('Select a ball to begin!');
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', init);
} else {
	init();
}
