document.addEventListener('DOMContentLoaded', () => {
	const step1 = document.getElementById('step-1');
	const step2 = document.getElementById('step-2');
	if (!step1 || !step2) return;
	// Find candidate cards: top-level <g> elements inside step-1 that contain a <use>
	const groups = Array.from(step1.querySelectorAll('g[id]'));
	// Filter to get only the <g> elements that represent government cards (those with an ID and a <use> child)
	const cards = groups.filter(g => g.id && Boolean(g.querySelector('use')));

	// State for the new comparison mode
	let compareMode = false;
	const selectedCardsForCompare = new Set(); // Stores card IDs (used for both modes)

	// Loaded JSON data will be stored here
	let governmentData = null;

	// Publicly accessible selected object (for debugging/other scripts)
	window.selectedGovernment = null;
	// last selected card id (e.g. 'republic')
	window.selectedGovernmentCardId = null;

	// Buttons (dynamic)
	const btn1 = document.getElementById('btn-1'); // Compare / Continue / Back
	const btn2 = document.getElementById('btn-2'); // Continue / Reset

	function updateGovernmentImage(cardId) {
		if (!cardId) return;
		// element is a <use id="government-img"> inside the SVG
		const useEl = document.getElementById('government-img') || document.querySelector('use#government-img');
		if (!useEl) return;
		const path = `./assets/${cardId}.svg`;
		try { useEl.setAttribute('href', path); } catch (e) { }
		// older browsers may use xlink:href
		try { useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', path); } catch (e) { }
		// Ensure 'active' class is removed on a new image selection
		try { useEl.classList.remove('active'); } catch (e) { }
	}

	// Load data.json once
	fetch('./data.json')
		.then(res => {
			if (!res.ok) throw new Error('Failed to load data.json: ' + res.status);
			return res.json();
		})
		.then(json => {
			governmentData = json.government_types || json;
		})
		.catch(err => {
			console.error('Error loading data.json', err);
			governmentData = null;
		});

	function idToGovernmentType(id) {
		if (!id) return id;
		return id
			.replace(/[-_]+/g, ' ')
			.split(' ')
			.map(s => s.charAt(0).toUpperCase() + s.slice(1))
			.join(' ');
	}

	function showStep2() {
		step1.style.display = 'none';
		step2.style.display = 'inline';
		const firstFocusable = step2.querySelector('button, [tabindex], a, input, select, textarea');
		if (firstFocusable) firstFocusable.focus();
	}

	function selectGovernmentById(cardId) {
		window.selectedGovernmentCardId = cardId;
		updateGovernmentImage(cardId);
		Object.keys(answeredBlocks).forEach(k => delete answeredBlocks[k]);
		hideActionButtons();
		for (let i = 1; i <= 4; i++) {
			const rg = getResultGroup(i);
			if (rg) rg.style.display = 'none';
		}
		const govType = idToGovernmentType(cardId);
		const match = (governmentData || []).find(g => {
			return String(g['Government Type']).toLowerCase() === String(govType).toLowerCase();
		});
		window.selectedGovernment = match || { 'Government Type': govType, blocks: [] };
	}


	// --- Button Control Functions ---

	function hideActionButtons() {
		if (btn1) { btn1.style.display = 'none'; btn1.disabled = true; }
		if (btn2) { btn2.style.display = 'none'; btn2.disabled = true; }
	}

	function setStep1Buttons() {
		// Step 1 Initial State (Single-Select/Continue mode)
		if (btn1) {
			btn1.style.display = 'inline-block';
			btn1.textContent = 'Compare';
			btn1.disabled = false; // Compare is enabled
		}
		if (btn2) {
			btn2.style.display = 'inline-block';
			btn2.textContent = 'Continue';
			btn2.disabled = true; // Continue is disabled
		}
	}

	function updateStep1ButtonsInCompareMode() {
		const selectedCount = selectedCardsForCompare.size;
		const enableContinue = selectedCount >= 2;

		if (btn1) {
			// Compare button: DISABLED when 2 or more are selected
			btn1.disabled = enableContinue;
		}
		if (btn2) {
			// Continue button: ENABLED when 2 or more are selected
			btn2.disabled = !enableContinue;
		}
	}


	// --- Card Interaction ---
	cards.forEach(card => {
		try { card.setAttribute('tabindex', '0'); } catch (e) { }
		try { card.setAttribute('role', 'button'); } catch (e) { }
		card.style.cursor = 'pointer';

		const cardId = card.id;

		const handleCardActivation = (evt) => {
			if (evt) evt.stopPropagation();

			if (compareMode) {
				// In Compare Mode: Toggle selection and update visual/buttons
				if (selectedCardsForCompare.has(cardId)) {
					selectedCardsForCompare.delete(cardId);
					card.classList.remove('active');
				} else {
					selectedCardsForCompare.add(cardId);
					card.classList.add('active');
				}
				updateStep1ButtonsInCompareMode();

			} else {
				// Original Single-Select Mode: Select one and immediately proceed to Step 2

				// 1. Perform original actions: filter data and show step-2
				selectGovernmentById(cardId);
				showStep2();

				// 2. Clear selections (since we are leaving step 1)
				selectedCardsForCompare.clear();
				cards.forEach(c => c.classList.remove('active'));
			}
		};

		// This unified handler manages selection visuals in both modes
		const handleCardSelectAndActivate = (evt) => {
			if (evt) evt.stopPropagation();

			if (compareMode) {
				// In Compare Mode, use the full logic to toggle and update buttons
				handleCardActivation(evt);
			} else {
				// In Single-Select Mode, ensure only one card has the active class before transitioning.

				// Clear previous selections and visuals (critical for single-select mode visual)
				cards.forEach(c => c.classList.remove('active'));
				selectedCardsForCompare.clear(); // Although unused for single-select transition, keep clean

				// Select the current card and add active class
				selectedCardsForCompare.add(cardId);
				card.classList.add('active');

				// Restore original functionality: Go to Step 2 immediately.
				handleCardActivation(evt);
			}
		}


		card.addEventListener('click', handleCardSelectAndActivate);
		card.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				handleCardSelectAndActivate(e);
			}
		});
	});

	// --- Button Click Handlers ---

	// Initial button state on load (Step 1)
	setStep1Buttons();

	if (btn2) {
		btn2.addEventListener('click', () => {
			const btnText = btn2.textContent.trim().toLowerCase();

			if (btnText === 'reset') {
				// Existing functionality for Step 2
				window.location.reload();
				return;
			}

			if (btnText === 'continue' && !btn2.disabled) {
				// This path is now used when 2+ cards are selected in Compare Mode.
				if (compareMode && selectedCardsForCompare.size >= 2) {
					console.log('Comparison triggered via Continue for:', Array.from(selectedCardsForCompare));
					alert(`Comparison triggered for: ${Array.from(selectedCardsForCompare).join(', ')}. (Comparison UI logic would load here)`);

					// After comparison, reset selections and revert buttons
					selectedCardsForCompare.clear();
					cards.forEach(c => c.classList.remove('active'));
					updateStep1ButtonsInCompareMode(); // Should disable Continue and enable Compare
					return;
				}

				// Safety/Redundancy path for single-select mode (should be unreachable if card click works)
				const cardId = Array.from(selectedCardsForCompare)[0];
				if (cardId) {
					selectGovernmentById(cardId);
					showStep2();
				}
			}
		});
	}

	if (btn1) {
		btn1.addEventListener('click', () => {
			const btnText = btn1.textContent.trim().toLowerCase();

			if (btnText === 'back to government types') {
				// Handle Back from Step 2 Insights
				step2.style.display = 'none';
				step1.style.display = 'inline';

				// Reset to initial Step 1 state (Single-Select Mode)
				compareMode = false;
				selectedCardsForCompare.clear();
				cards.forEach(c => c.classList.remove('active'));
				setStep1Buttons(); // Sets Compare enabled, Continue disabled

				if (cards.length > 0) cards[0].focus();

				return;
			}

			if (btnText === 'compare') {
				// Enter Compare Mode
				if (!compareMode) {
					compareMode = true;

					// Clear any existing selections/visuals (from the last single-click transition)
					selectedCardsForCompare.clear();
					cards.forEach(c => c.classList.remove('active'));

					// Update button state (Compare enabled, Continue disabled)
					updateStep1ButtonsInCompareMode();
				} else {
					// Exit Compare Mode
					compareMode = false;

					// Clear selections/visuals
					selectedCardsForCompare.clear();
					cards.forEach(c => c.classList.remove('active'));

					// Revert to initial Step 1 button state
					setStep1Buttons();
				}
				return;
			}

			// ... Existing 'Continue' logic from Step 2 completion
			if (btnText === 'continue' && !btn1.disabled) {
				const gov = window.selectedGovernment;
				if (!gov) return;

				let insights = gov['Insight Countries'];
				if (!insights && Array.isArray(gov.blocks)) {
					for (const b of gov.blocks) {
						if (b && b['Insight Countries']) { insights = b['Insight Countries']; break; }
					}
				}

				const wrapper = document.getElementById('insights-wrapper');
				if (wrapper) wrapper.style.display = 'block';
				const countriesEl = document.getElementById('insights-countries');
				if (countriesEl) countriesEl.textContent = insights || '';

				const qWrapper = document.getElementById('question-wrapper');
				if (qWrapper) qWrapper.style.display = 'none';
				if (optionWrapper) optionWrapper.style.display = 'none';

				hideActionButtons();
			}
		});
	}

	// --- Step 2 Logic (unchanged from last working version) ---

	const questionWrapper = step2.querySelector('#question-wrapper');
	const blockTitles = questionWrapper ? Array.from(questionWrapper.querySelectorAll('g[id^="block-title-"]')) : [];
	const optionWrapper = step2.querySelector('#option-wrapper');
	const options = optionWrapper ? {
		1: optionWrapper.querySelector('#option-1'),
		2: optionWrapper.querySelector('#option-2'),
		3: optionWrapper.querySelector('#option-3')
	} : null;

	const answeredBlocks = {};

	function showActionButtons() {
		if (btn1) { btn1.style.display = 'inline-block'; btn1.disabled = false; btn1.textContent = 'continue'; }
		if (btn2) { btn2.style.display = 'none'; btn2.disabled = true; }
	}

	function checkAllAnsweredAndActivateImage() {
		const totalBlocks = (window.selectedGovernment && window.selectedGovernment.blocks) ? window.selectedGovernment.blocks.length : 0;
		const answeredCount = Object.keys(answeredBlocks).length;

		if (totalBlocks > 0 && answeredCount >= totalBlocks) {
			showActionButtons();
			const useEl = document.getElementById('government-img') || document.querySelector('use#government-img');
			if (useEl) {
				try { useEl.classList.add('active'); } catch (e) {
					console.error('Could not add active class to government-img', e);
				}
			}
		}
	}

	const insightBtn = document.getElementById('insight-btn') || step2.querySelector('#insight-btn');
	if (insightBtn) {
		try { insightBtn.style.cursor = 'pointer'; } catch (e) { }
		insightBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			const resultBox = document.getElementById('insight-result-box') || step2.querySelector('#insight-result-box');
			if (resultBox) resultBox.style.display = 'block';
			const note = document.getElementById('insights-note') || step2.querySelector('#insights-note');
			if (note) note.style.display = 'none';

			if (btn1) {
				btn1.style.display = 'inline-block';
				btn1.disabled = false;
				btn1.textContent = 'Back to Government Types';
			}
		});
	}

	Object.keys(answeredBlocks).forEach(k => delete answeredBlocks[k]);
	hideActionButtons();

	function getForeignDiv(el) {
		if (!el) return null;
		const fo = el.querySelector('foreignObject');
		if (!fo) return null;
		return fo.querySelector('div');
	}

	function clearOptionsDisplay() {
		if (!options) return;
		Object.values(options).forEach(opt => {
			if (!opt) return;
			opt.style.display = 'none';
			opt.style.pointerEvents = '';
			try {
				opt.classList.remove('wrong-answer', 'correct-answer');
				const inner = getForeignDiv(opt);
				if (inner) inner.classList.remove('wrong-answer', 'correct-answer');
			} catch (e) { }
		});
	}

	function renderBlockTitles() {
		if (!window.selectedGovernment || !window.selectedGovernment.blocks) return;
		window.selectedGovernment.blocks.forEach((blk, idx) => {
			const titleGroup = blockTitles[idx];
			if (!titleGroup) return;
			const div = getForeignDiv(titleGroup);
			if (div) div.textContent = blk['Block Title'] || div.textContent;
		});
	}

	function getResultGroup(n) {
		return step2.querySelector('#result-' + n);
	}

	function setResultText(n, text) {
		const div = step2.querySelector('#block-title-' + n + '-ans');
		if (div) div.textContent = text;
		const resultGroup = getResultGroup(n);
		if (resultGroup) resultGroup.style.display = 'block';
	}

	function renderOptionsForBlock(index) {
		clearOptionsDisplay();
		const blk = (window.selectedGovernment && window.selectedGovernment.blocks) ? window.selectedGovernment.blocks[index] : null;
		if (!blk || !options) return;
		if (answeredBlocks[index]) {
			const map2 = { 1: blk['Option A'] || '', 2: blk['Option B'] || '', 3: blk['Option C'] || '' };
			Object.keys(map2).forEach(k => {
				const optEl = options[k];
				if (!optEl) return;
				if (getForeignDiv(optEl)) getForeignDiv(optEl).textContent = map2[k];
				optEl.style.display = 'inline';
				optEl.style.pointerEvents = 'none';
			});
			setResultText(index + 1, blk['Answer'] || '');
			return;
		}
		const map = { 1: blk['Option A'] || '', 2: blk['Option B'] || '', 3: blk['Option C'] || '' };
		Object.keys(map).forEach(k => {
			const optEl = options[k];
			if (!optEl) return;
			if (getForeignDiv(optEl)) getForeignDiv(optEl).textContent = map[k];
			optEl.style.display = 'inline';
			optEl.style.pointerEvents = '';
		});
	}

	blockTitles.forEach((bt, i) => {
		try { bt.setAttribute('tabindex', '0'); } catch (e) { }
		try { bt.setAttribute('role', 'button'); } catch (e) { }
		bt.style.cursor = 'pointer';
		bt.addEventListener('click', (e) => {
			e.stopPropagation();
			if ((!window.selectedGovernment || !window.selectedGovernment.blocks || window.selectedGovernment.blocks.length === 0) && governmentData) {
				const current = window.selectedGovernment && window.selectedGovernment['Government Type'];
				if (current) {
					const found = governmentData.find(g => String(g['Government Type']).toLowerCase() === String(current).toLowerCase());
					if (found) { window.selectedGovernment = found; renderBlockTitles(); }
				}
			}
			renderOptionsForBlock(i);
		});
		bt.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bt.click(); }
		});
	});

	function findOptionDiv(optionEl) {
		return optionEl ? getForeignDiv(optionEl) : null;
	}

	if (options) {
		Object.keys(options).forEach(k => {
			const optEl = options[k];
			if (!optEl) return;
			try { optEl.setAttribute('tabindex', '0'); } catch (e) { }
			optEl.style.cursor = 'pointer';
			optEl.addEventListener('click', (e) => {
				e.stopPropagation();
				const activeIndex = parseInt(optionWrapper.getAttribute('data-active-block') || '-1', 10);
				if (activeIndex < 0) return;
				const blk = (window.selectedGovernment && window.selectedGovernment.blocks) ? window.selectedGovernment.blocks[activeIndex] : null;
				if (!blk) return;
				const chosenText = findOptionDiv(optEl)?.textContent || '';
				const correctText = (blk['Answer'] || '').toString();
				if (chosenText.trim().toLowerCase() === correctText.trim().toLowerCase()) {
					answeredBlocks[activeIndex] = true;
					setResultText(activeIndex + 1, correctText);
					optEl.classList.add('correct-answer');
					Object.values(options).forEach(o => { if (o) o.style.pointerEvents = 'none'; });
					checkAllAnsweredAndActivateImage();
				} else {
					optEl.classList.add('wrong-answer');
					const inner = findOptionDiv(optEl);
					if (inner) inner.classList.add('wrong-answer');
					setTimeout(() => {
						optEl.classList.remove('wrong-answer');
						if (inner) inner.classList.remove('wrong-answer');
					}, 500);
				}
			});
			optEl.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); optEl.click(); }
			});
		});
	}

	blockTitles.forEach((bt, i) => {
		bt.addEventListener('click', () => {
			if (optionWrapper) optionWrapper.setAttribute('data-active-block', String(i));
		});
	});

	(function reconcileAfterLoad(retries = 10) {
		if (governmentData) {
			if (window.selectedGovernment && window.selectedGovernment['Government Type'] && (!window.selectedGovernment.blocks || window.selectedGovernment.blocks.length === 0)) {
				const found = governmentData.find(g => String(g['Government Type']).toLowerCase() === String(window.selectedGovernment['Government Type']).toLowerCase());
				if (found) {
					window.selectedGovernment = found;
					renderBlockTitles();
				}
			}
			return;
		}
		if (retries <= 0) return;
		setTimeout(() => reconcileAfterLoad(retries - 1), 150);
	})();
});