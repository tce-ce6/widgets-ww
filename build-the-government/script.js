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
			opt.style.outline = '';
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
			optEl.style.outline = '';
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
					optEl.style.outline = '3px solid #4caf50';
					// hide options for the block (they will be re-enabled when other blocks are opened)
					clearOptionsDisplay();
				} else {
					// Incorrect selection: mark red briefly, do not reveal result
					optEl.style.outline = '3px solid #ff5252';
					// Optionally remove the red outline after a short time
					setTimeout(() => { try { optEl.style.outline = ''; } catch (e) {} }, 900);
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

