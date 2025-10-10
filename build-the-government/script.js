// Make SVG government-type cards interactive: clicking or pressing Enter/Space
// on any card will hide #step-1 and show #step-2.
document.addEventListener('DOMContentLoaded', () => {
	const step1 = document.getElementById('step-1');
	const step2 = document.getElementById('step-2');
	if (!step1 || !step2) return;
	// Find candidate cards: top-level <g> elements inside step-1 that contain a <use>
	const groups = Array.from(step1.querySelectorAll('g[id]'));
	const cards = groups.filter(g => Boolean(g.querySelector('use')));

	// Loaded JSON data will be stored here
	let governmentData = null;

	// Publicly accessible selected object (for debugging/other scripts)
	window.selectedGovernment = null;
	// last selected card id (e.g. 'republic')
	window.selectedGovernmentCardId = null;

	function updateGovernmentImage(cardId) {
		if (!cardId) return;
		// element is a <use id="government-img"> inside the SVG
		const useEl = document.getElementById('government-img') || document.querySelector('use#government-img');
		if (!useEl) return;
		const path = `./assets/${cardId}.svg`;
		try { useEl.setAttribute('href', path); } catch (e) {}
		// older browsers may use xlink:href
		try { useEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', path); } catch (e) {}
	}

	// Load data.json once
	fetch('./data.json')
		.then(res => {
			if (!res.ok) throw new Error('Failed to load data.json: ' + res.status);
			return res.json();
		})
		.then(json => {
			// Expecting json.government_types array
			governmentData = json.government_types || json;
		})
		.catch(err => {
			console.error('Error loading data.json', err);
			governmentData = null;
		});

	function idToGovernmentType(id) {
		// Convert id like 'constitutional-monarchy' -> 'Constitutional Monarchy'
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
		// remember which card was clicked so we can update the image
		window.selectedGovernmentCardId = cardId;
		updateGovernmentImage(cardId);
		// reset answered blocks and hide action buttons for new selection
		Object.keys(answeredBlocks).forEach(k => delete answeredBlocks[k]);
		hideActionButtons();
		// hide all result groups
		for (let i = 1; i <= 4; i++) {
			const rg = getResultGroup(i);
			if (rg) rg.style.display = 'none';
		}
		const govType = idToGovernmentType(cardId);
		if (!governmentData) {
			console.warn('governmentData not loaded yet; selection will be attempted again after load');
		}

		const match = (governmentData || []).find(g => {
			return String(g['Government Type']).toLowerCase() === String(govType).toLowerCase();
		});

		if (match) {
			window.selectedGovernment = match;
			// You can now use `window.selectedGovernment` elsewhere in your app
			console.log('Selected government:', match['Government Type'], match);
		} else {
			// If no match found, still set a fallback object with the inferred type
			window.selectedGovernment = { 'Government Type': govType, blocks: [] };
			console.warn('No matching government found for', govType);
		}
	}

	cards.forEach(card => {
		// Make it focusable and announceable to assistive tech
		try { card.setAttribute('tabindex', '0'); } catch (e) {}
		try { card.setAttribute('role', 'button'); } catch (e) {}
		try { card.setAttribute('aria-label', card.id || 'government card'); } catch (e) {}
		card.style.cursor = 'pointer';

		const activate = (evt) => {
			if (evt) evt.stopPropagation();
			// filter and store data
			selectGovernmentById(card.id);
			// show step-2
			showStep2();
		};

		card.addEventListener('click', activate);
		card.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				activate(e);
			}
		});
	});

	// --- Step-2 interaction: update block titles and options based on selectedGovernment ---

	const questionWrapper = step2.querySelector('#question-wrapper');
	const blockTitles = questionWrapper ? Array.from(questionWrapper.querySelectorAll('g[id^="block-title-"]')) : [];
	const optionWrapper = step2.querySelector('#option-wrapper');
	const options = optionWrapper ? {
		1: optionWrapper.querySelector('#option-1'),
		2: optionWrapper.querySelector('#option-2'),
		3: optionWrapper.querySelector('#option-3')
	} : null;

	// Track which blocks (by 0-based index) have been correctly answered
	const answeredBlocks = {};

	// Buttons (dynamic)
	const btn1 = document.getElementById('btn-1');
	const btn2 = document.getElementById('btn-2');

	function hideActionButtons() {
		if (btn1) { btn1.style.display = 'none'; btn1.disabled = true; }
		if (btn2) { btn2.style.display = 'none'; btn2.disabled = true; }
	}

	function showActionButtons() {
		// Only show the primary continue button when all blocks are answered
		if (btn1) { btn1.style.display = 'inline-block'; btn1.disabled = false; btn1.textContent = 'continue'; }
		if (btn2) { btn2.style.display = 'none'; btn2.disabled = true; }
	}

	// hide initially
	hideActionButtons();

	if (btn2) {
		btn2.addEventListener('click', () => {
			// simple reset: reload the page to return to initial state
			window.location.reload();
		});
	}

	if (btn1) {
		btn1.addEventListener('click', () => {
			// Only act when a government has been selected
			const gov = window.selectedGovernment;
			if (!gov) return;

			// Find 'Insight Countries' either at top-level or inside blocks
			let insights = '';
			if (gov['Insight Countries']) insights = gov['Insight Countries'];
			if (!insights && Array.isArray(gov.blocks)) {
				for (const b of gov.blocks) {
					if (b && b['Insight Countries']) { insights = b['Insight Countries']; break; }
				}
			}

			const wrapper = document.getElementById('insights-wrapper');
			if (wrapper) wrapper.style.display = 'block';
			const countriesEl = document.getElementById('insights-countries');
			if (countriesEl) countriesEl.textContent = insights || '';

			// Hide question and option areas when insights are shown
			const qWrapper = document.getElementById('question-wrapper');
			if (qWrapper) qWrapper.style.display = 'none';
			if (optionWrapper) optionWrapper.style.display = 'none';
		});
	}

	// Insight button inside the SVG: show the insight result box when clicked
	const insightBtn = document.getElementById('insight-btn') || step2.querySelector('#insight-btn');
	if (insightBtn) {
		try { insightBtn.style.cursor = 'pointer'; } catch (e) {}
		insightBtn.addEventListener('click', (e) => {
			e.stopPropagation();
			const resultBox = document.getElementById('insight-result-box') || step2.querySelector('#insight-result-box');
			if (resultBox) resultBox.style.display = 'block';
			// Hide the small note when result box opens
			const note = document.getElementById('insights-note') || step2.querySelector('#insights-note');
			if (note) note.style.display = 'none';
		});
	}

	// reset answered blocks and hide action buttons for new selection
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
			// reset interactive styles
			opt.style.pointerEvents = '';
			// remove any answer state classes added on previous interaction
			try {
				opt.classList.remove('wrong-answer');
				opt.classList.remove('correct-answer');
			} catch (e) {}
			// also clear classes on inner foreignObject div if present
			try {
				const inner = getForeignDiv(opt);
				if (inner && inner.classList) {
					inner.classList.remove('wrong-answer');
					inner.classList.remove('correct-answer');
				}
			} catch (e) {}
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

	function renderOptionsForBlock(index) {
		// index is 0-based for blocks array; map to option-1..3
		clearOptionsDisplay();
		const blk = (window.selectedGovernment && window.selectedGovernment.blocks) ? window.selectedGovernment.blocks[index] : null;
		if (!blk || !options) return;
		// If this block was already answered correctly, reveal its result and don't show options
		if (answeredBlocks[index]) {
			// show options but disable them
			const map2 = {
				1: blk['Option A'] || '',
				2: blk['Option B'] || '',
				3: blk['Option C'] || ''
			};
			Object.keys(map2).forEach(k => {
				const optEl = options[k];
				if (!optEl) return;
				const div = getForeignDiv(optEl);
				if (div) div.textContent = map2[k];
				optEl.style.display = 'inline';
				optEl.style.pointerEvents = 'none';
			});
			setResultText(index + 1, blk['Answer'] || '');
			return;
		}
		const map = {
			1: blk['Option A'] || '',
			2: blk['Option B'] || '',
			3: blk['Option C'] || ''
		};
		Object.keys(map).forEach(k => {
			const optEl = options[k];
			if (!optEl) return;
			const div = getForeignDiv(optEl);
			if (div) div.textContent = map[k];
			// show the option group
			optEl.style.display = 'inline';
			optEl.style.pointerEvents = '';
		});
	}

	// Attach handlers to block title groups
	blockTitles.forEach((bt, i) => {
		try { bt.setAttribute('tabindex', '0'); } catch (e) {}
		try { bt.setAttribute('role', 'button'); } catch (e) {}
		bt.style.cursor = 'pointer';
		bt.addEventListener('click', (e) => {
			e.stopPropagation();
			// Ensure selection exists (if data loaded after selection, reconcile)
			if ((!window.selectedGovernment || !window.selectedGovernment.blocks || window.selectedGovernment.blocks.length === 0) && governmentData) {
				// try to find using currently selected type
				const current = window.selectedGovernment && window.selectedGovernment['Government Type'];
				if (current) {
					const found = governmentData.find(g => String(g['Government Type']).toLowerCase() === String(current).toLowerCase());
					if (found) {
						window.selectedGovernment = found;
						renderBlockTitles();
					}
				}
			}
			renderOptionsForBlock(i);
		});
		bt.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				bt.click();
			}
		});
	});

	// --- Option selection handling: when an option is clicked, insert correct answer text into result box ---

	// Helpers to find result containers
	function getResultGroup(n) {
		return step2.querySelector('#result-' + n);
	}

	function setResultText(n, text) {
		const div = step2.querySelector('#block-title-' + n + '-ans');
		if (div) div.textContent = text;
		const resultGroup = getResultGroup(n);
		if (resultGroup) resultGroup.style.display = 'block';
	}

	function findOptionDiv(optionEl) {
		return optionEl ? getForeignDiv(optionEl) : null;
	}

	if (options) {
		Object.keys(options).forEach(k => {
			const optEl = options[k];
			if (!optEl) return;
			// make clickable/focusable
			try { optEl.setAttribute('tabindex', '0'); } catch (e) {}
			optEl.style.cursor = 'pointer';
			optEl.addEventListener('click', (e) => {
				e.stopPropagation();
				// Determine which block is currently active by seeing which option groups are visible
				const activeIndex = parseInt(optionWrapper.getAttribute('data-active-block') || '-1', 10);
				if (activeIndex < 0) return;
				const blk = (window.selectedGovernment && window.selectedGovernment.blocks) ? window.selectedGovernment.blocks[activeIndex] : null;
				if (!blk) return;
				const chosenText = findOptionDiv(optEl)?.textContent || '';
				const correctText = (blk['Answer'] || '').toString();
				if (chosenText.trim().toLowerCase() === correctText.trim().toLowerCase()) {
					// Correct selection: reveal the answer in the result box
					answeredBlocks[activeIndex] = true;
					setResultText(activeIndex + 1, correctText);
                    optEl.classList.add('correct-answer');
					// keep options visible but disable interaction for this block
					Object.values(options).forEach(o => {
						if (!o) return;
						o.style.pointerEvents = 'none';
					});
					// If all blocks are answered, show the continue button
					const totalBlocks = (window.selectedGovernment && window.selectedGovernment.blocks) ? window.selectedGovernment.blocks.length : 0;
					const answeredCount = Object.keys(answeredBlocks).length;
					if (totalBlocks > 0 && answeredCount >= totalBlocks) {
						showActionButtons();
					}
				} else {
					// Incorrect selection: mark red briefly, do not reveal result
						optEl.classList.add('wrong-answer');
						// Also add the class to the inner div if present
						try {
							const inner = findOptionDiv(optEl);
							if (inner && inner.classList) inner.classList.add('wrong-answer');
						} catch (e) {}

						setTimeout(() => {
							try {
								optEl.classList.remove('wrong-answer');
							} catch (e) {}
							try {
								const inner = findOptionDiv(optEl);
								if (inner && inner.classList) inner.classList.remove('wrong-answer');
							} catch (e) {}
						}, 500);
				}
			});
			optEl.addEventListener('keydown', (e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					optEl.click();
				}
			});
		});
	}

	// Update optionWrapper to track which block is active so option clicks know where to write
	// We set data-active-block when a block-title is clicked (renderOptionsForBlock already called there)
	blockTitles.forEach((bt, i) => {
		bt.addEventListener('click', () => {
			if (optionWrapper) optionWrapper.setAttribute('data-active-block', String(i));
		});
	});

	// When data.json finishes loading, if there is an inferred selectedGovernment try to replace it
	// with the real object and render titles if step-2 is visible.

	// Reconcile after fetch completes by observing when governmentData is set above.
	// Since fetch sets governmentData inside a promise, we can poll briefly until it's set.
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

