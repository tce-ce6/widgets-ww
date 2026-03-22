const WidgetState = {
    families: ['sun', 'rain', 'snow', 'fire', 'sea', 'sand'],
    completed: {},
    discovered: {
        sun: [], rain: [], snow: [], fire: [], sea: [], sand: []
    },
    WORD_MAPPINGS: {
        sun:  { 0: 'sunflower', 3: 'sunglasses', 4: 'sunscreen', 5: 'sunlight' },
        rain: { 0: 'raincoat',  1: 'rainstorm',  2: 'rainbow',    3: 'raindrop' },
        snow: { 0: 'snowball',  2: 'snowflake',  3: 'snowsuit',   4: 'snowman' },
        fire: { 1: 'fireman',   2: 'fireplace',  3: 'firewood',   4: 'firefly' },
        sea:  { 0: 'seafood',   3: 'seahorse',   4: 'seashell',   5: 'seaweed' },
        sand: { 0: 'sandpaper', 2: 'sandcastle', 4: 'sandstorm',  5: 'sandbox' }
    },
    currentFamily: null,
    isAnimating: false,
    elements: {}
};

function initGame() {
    // Inject required styles for shaking / flying / hiding
    const style = document.createElement('style');
    style.textContent = `
        .interactive-card { transform-origin: center; cursor: pointer; }
        .interactive-card.used { pointer-events: none; }
        .interactive-card.wrong { animation: shake-card 0.4s; }
        @keyframes shake-card {
           0% { transform: translateX(0); }
           25% { transform: translateX(-12px); }
           50% { transform: translateX(12px); }
           75% { transform: translateX(-12px); }
           100% { transform: translateX(0); }
        }
        .ans-panel {
            transition: all 0.5s ease-in-out;
            opacity: 0;
            transform: translateY(20px);
        }
        .ans-panel.show {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    console.log('initGame: Setting up initial widget state');

    WidgetState.NativeOrder = {};
    WidgetState.families.forEach(f => {
        WidgetState.NativeOrder[f] = [];
        const ansGroup = document.getElementById(f);
        if (ansGroup) {
            Array.from(ansGroup.children).forEach(child => {
                let y = 0;
                // find either native 'y' attributes or translates
                const childHtml = child.innerHTML;
                const matchTranslate = childHtml.match(/translate\([^,]+[,\s]+([-\d\.]+)/);
                const matchY = childHtml.match(/<rect[^>]*y="([\d\.]+)"/);
                if (matchTranslate) y = parseFloat(matchTranslate[1]);
                else if (matchY) y = parseFloat(matchY[1]);
                
                WidgetState.NativeOrder[f].push({ id: child.getAttribute('id'), y: y });
            });
            WidgetState.NativeOrder[f].sort((a,b) => a.y - b.y);
        }
    });

    // Initial Hide of Activity UI
    hideElement('question');
    hideElement('qitxt');
    hideElement('status_bar');
    hideElement('answer_panels');
    hideElement('correct_end_popup');

    // Hide all family assets
    WidgetState.families.forEach(f => {
        hideElement(f + '_family_assets');
        
        // Hide individual answer components if they exist natively
        const ansGroup = document.getElementById(f);
        if (ansGroup && ansGroup.parentElement && ansGroup.parentElement.id === 'answer_panels') {
            hideElement(f);
            // also hide all children (the specific answer panels)
            Array.from(ansGroup.children).forEach(child => hideElement(child.getAttribute('id')));
        }
    });

    // Setup Home Cards
    const homeMappings = {
        'SUN': 'sun', 'RAIN_': 'rain', 'SNOW': 'snow', 'FIRE_': 'fire', 'SEA_': 'sea', 'SAND_': 'sand'
    };
    
    Object.keys(homeMappings).forEach(id => {
        let el = document.getElementById(id);
        if (el) {
            el.classList.add('interactive-card');
            el.onclick = () => openFamily(homeMappings[id]);
        }
    });

    // Setup Home Button
    let homeBtn = document.getElementById('home_btn');
    if (homeBtn) {
         homeBtn.style.cursor = 'pointer';
         homeBtn.onclick = returnToMenu;
         console.log('initGame: Home button mapped successfully');
    }
}

function openFamily(family) {
    if (WidgetState.isAnimating) {
        console.log('openFamily: Ignored, animation in progress');
        return;
    }
    console.log(`openFamily: Initiating layout transition for family [${family}]`);
    WidgetState.currentFamily = family;

    // Hide Home Screen elements

    hideElement('home_cards');
    hideElement('home_itext');
    
    unhideElement('question');
    unhideElement('qitxt');
    unhideElement('status_bar');
    unhideElement('answer_panels');
    unhideElement('answer_panel_bg');
    hideElement('correct_end_popup');
    
    // Show current family answer container
    unhideElement(family);
    
    // Re-hide all existing children panels by default except ones we've discovered
    const ansContainer = document.getElementById(family);
    if (ansContainer) {
        Array.from(ansContainer.children).forEach(child => {
            child.style.display = 'none';
        });
    }

    // Hide all families, then show specific
    WidgetState.families.forEach(f => {
        hideElement(f + '_family_assets');
        
        // Hide answer_panel wrappers for other families so they don't leak
        const otherAns = document.getElementById(f);
        if (otherAns && f !== family) {
            hideElement(f);
        }
    });

    const famAssets = document.getElementById(family + '_family_assets');
    if (famAssets) {
        console.log(`openFamily: Found assets for [${family}], unhiding and setting up interactions`);
        unhideElement(family + '_family_assets');
        setupFamilyInteractions(family, famAssets);
    } else {
        console.log(`openFamily: WARNING - Assets for [${family}] missing from DOM`);
    }

    renderDiscoveredWords(family);
    updateInstructionText(family);
    updatePopupText(family);
}

function returnToMenu() {
    if (WidgetState.isAnimating) {
        console.log('returnToMenu: Ignored, animation in progress');
        return;
    }
    console.log('returnToMenu: Transitioning widget back to home menu overview');
    WidgetState.currentFamily = null;

    hideElement('question');

    hideElement('qitxt');
    hideElement('status_bar');
    hideElement('answer_panels');

    WidgetState.families.forEach(f => {
        hideElement(f + '_family_assets');
        const ansGroup = document.getElementById(f);
        if (ansGroup) {
            hideElement(f);
            Array.from(ansGroup.children).forEach(child => hideElement(child.getAttribute('id')));
        }
    });

    hideElement('correct_end_popup');

    // Reset instruction text to default or keep it.
    unhideElement('home_cards');
    unhideElement('home_itext');
}

function setupFamilyInteractions(family, famAssets) {
    // Only setup once
    if (WidgetState.elements[family]) {
        console.log(`setupFamilyInteractions: Interactions already mapped for [${family}]`);
        return;
    }
    
    console.log(`setupFamilyInteractions: Performing initial geometric mapping for [${family}] cards`);
    WidgetState.elements[family] = { options: [] };
    
    // Options are typically 6 groups around the center.

    // Based on previous structure, we find the 6 option paths/groups.
    // We will find all children of famAssets that have no child groups, or a specific structure.
    const children = Array.from(famAssets.children);
    
    const options = [];
    children.forEach(child => {
        // Skip background rectangles or large layout paths by ignoring things with no ID and are just empty paths
        if (child.tagName === 'g' || child.tagName === 'rect' || child.tagName === 'path') {
            options.push(child);
        }
    });
    
    // Find central card logic
    const cardRects = children.map(c => c.getBoundingClientRect());
    let cx = 0, cy = 0;
    cardRects.forEach(r => { cx += r.left + r.width/2; cy += r.top + r.height/2; });
    cx /= children.length; cy /= children.length;

    let centerCard = null;
    let minD = Infinity;
    children.forEach((c, i) => {
        const r = cardRects[i];
        if (r.width > window.innerWidth * 0.5) return; // skip giant backgrounds
        const dx = (r.left + r.width/2) - cx;
        const dy = (r.top + r.height/2) - cy;
        const d = dx*dx + dy*dy;
        if (d < minD) { minD = d; centerCard = c; }
    });
    if (centerCard) {
        console.log(`setupFamilyInteractions: Isolated center main card and disabled interactions`);
        centerCard.style.pointerEvents = 'none';
    }

    let validOptions = options.filter(g => g !== centerCard);
    console.log(`setupFamilyInteractions: Found ${validOptions.length} valid target cards for [${family}]`);
    
    // Auto-map SVGs dynamically
    if (!WidgetState.WORD_MAPPINGS) WidgetState.WORD_MAPPINGS = {};
    if (!WidgetState.WORD_MAPPINGS[family] || Object.keys(WidgetState.WORD_MAPPINGS[family]).length < 4) {
        WidgetState.WORD_MAPPINGS[family] = {};
        const ansGroup = document.getElementById(family);
        if (ansGroup) {
            Array.from(ansGroup.children).forEach(ans => {
                const id = ans.getAttribute('id');
                const wordKey = id.replace('_ans', '').replace('-ans', '');
                const paths = Array.from(ans.querySelectorAll('path')).map(p => p.getAttribute('d')).filter(d => d && d.length > 20);
                
                let bestIdx = -1; let maxScore = 0;
                validOptions.forEach((opt, idx) => {
                    const optPaths = Array.from(opt.querySelectorAll('path')).map(p => p.getAttribute('d'));
                    let score = 0;
                    optPaths.forEach(op => { if (paths.includes(op)) score++; });
                    if (score > maxScore) { maxScore = score; bestIdx = idx; }
                });
                
                if (bestIdx > -1) {
                    WidgetState.WORD_MAPPINGS[family][bestIdx] = wordKey;
                }
            });
        }
    }

    // Geometrically robustify mappings: if an icon is unmapped but sits inside a mapped background, copy mapping
    const mappings = WidgetState.WORD_MAPPINGS[family];
    if (mappings) {
        validOptions.forEach((opt, idx) => {
            if (!mappings[idx]) {
                const rect = opt.getBoundingClientRect();
                const cx = rect.left + rect.width/2;
                const cy = rect.top + rect.height/2;
                for (let i=0; i<validOptions.length; i++) {
                    if (mappings[i] && i !== idx) {
                        const pRect = validOptions[i].getBoundingClientRect();
                        if (cx >= pRect.left && cx <= pRect.right && cy >= pRect.top && cy <= pRect.bottom) {
                            mappings[idx] = mappings[i];
                            break;
                        }
                    }
                }
            }
        });
    }

    validOptions.forEach((opt, index) => {
        opt.classList.add('interactive-card');
        opt.style.pointerEvents = 'all'; // ensures empty rect bounds are clickable if standard SVG spec allows or if background path catches it

        // Setup simple bounds-based sync for elements at this index if needed
        if (WidgetState.discovered[family].includes(index)) {
             opt.classList.add('used');
             opt.style.opacity = '0.3';
             opt.style.pointerEvents = 'none';
             fadeSiblingsAt(opt);
        } else {
             opt.classList.remove('used');
             opt.style.opacity = '';
             opt.style.pointerEvents = 'auto';
             showSiblingsAt(opt);
        }

        opt.onclick = () => handleOptionClick(family, index, opt);
    });
    
    WidgetState.elements[family].options = validOptions;
}

function fadeSiblingsAt(element) {
    if (!element || !element.parentElement) return;
    const rect = element.getBoundingClientRect();
    Array.from(element.parentElement.children).forEach(sibling => {
        if (sibling.tagName === 'g' && sibling !== element) {
            const sRect = sibling.getBoundingClientRect();
            const scx = sRect.left + sRect.width / 2;
            const scy = sRect.top + sRect.height / 2;
            if (scx >= rect.left && scx <= rect.right && scy >= rect.top && scy <= rect.bottom) {
                sibling.style.transition = 'opacity 0.6s, filter 0.6s';
                sibling.style.opacity = '0.3';
                sibling.style.pointerEvents = 'none';
            }
        }
    });
}

function showSiblingsAt(element) {
    if (!element || !element.parentElement) return;
    const rect = element.getBoundingClientRect();
    Array.from(element.parentElement.children).forEach(sibling => {
        if (sibling.tagName === 'g' && sibling !== element) {
            const sRect = sibling.getBoundingClientRect();
            const scx = sRect.left + sRect.width / 2;
            const scy = sRect.top + sRect.height / 2;
            if (scx >= rect.left && scx <= rect.right && scy >= rect.top && scy <= rect.bottom) {
                sibling.style.transition = 'none';
                sibling.style.opacity = '';
                sibling.style.pointerEvents = 'none';
            }
        }
    });
}

function handleOptionClick(family, index, element) {
    if (WidgetState.isAnimating) return;
    
    const mappings = WidgetState.WORD_MAPPINGS[family];
    const compoundWord = mappings ? mappings[index] : null;
    
    console.log(`handleOptionClick: Clicked map index [${index}] on family [${family}]. Match exists: ${!!compoundWord}`);
    
    if (compoundWord) {
        // Correct guess
        console.log(`handleOptionClick: Correct! Triggering animations for [${compoundWord}]`);
        WidgetState.isAnimating = true;

        playChirp();
        
        // Disable
        element.style.pointerEvents = 'none';
        
        // Fade out transition
        element.style.transition = 'opacity 0.6s, filter 0.6s';
        element.style.filter = 'drop-shadow(0 0 15px #f6c248)';
        element.style.opacity = '0.3';
        fadeSiblingsAt(element);
        
        setTimeout(() => {
            element.classList.add('used');
            element.style.transition = 'none';
            element.style.filter = 'none';
            // KEEP opacity at 0.3 so it stays securely ghosted
            
            if (!WidgetState.discovered[family].includes(index)) {
                WidgetState.discovered[family].push(index);
            }
            createConfetti(element.getBoundingClientRect());
            renderDiscoveredWords(family);
            
            WidgetState.isAnimating = false;
        }, 650);
        
    } else {
        // Wrong guess
        console.log(`handleOptionClick: Incorrect choice at index [${index}]. Triggering shake.`);
        element.classList.add('wrong');
        setTimeout(() => {
            element.classList.remove('wrong');
        }, 400);
    }
}

function renderDiscoveredWords(family) {
    console.log(`renderDiscoveredWords: Refreshing panels for [${family}]`);
    // Hide all existing answer panels first
    const mapping = WidgetState.WORD_MAPPINGS[family] || {};
    
    // Unhide the panel graphic corresponding to the discovered word
    const discoveredList = WidgetState.discovered[family];
    
    // According to instructions: Extract the answer panels from main SVG
    // We just find elements by ID like 'sandstorm_ans' and show them.
    Object.keys(mapping).forEach((idxStr) => {
        const idx = parseInt(idxStr);
        const word = mapping[idx];
        let panelId = word + '_ans'; // e.g. sandstorm_ans
        
        // Handle explicit SVG ID typos
        if (panelId === 'seahorse_ans') panelId = 'seahorse-ans';
        if (panelId === 'seaweed_ans') panelId = 'seawood_ans';

        const ansPanel = document.getElementById(panelId);
        
        if (ansPanel) {
            if (discoveredList.includes(idx)) {
                unhideElement(panelId);
                const orderIndex = discoveredList.indexOf(idx);
                // Dynamically offset from top to bottom
                
                let nativeSlot = WidgetState.NativeOrder[family].findIndex(item => item.id === panelId);
                if (nativeSlot === -1) nativeSlot = Object.keys(mapping).indexOf(idxStr);
                ansPanel.style.transform = `translate(0px, ${(orderIndex - nativeSlot) * 153}px)`;

                ansPanel.classList.add('ans-panel', 'show');
            } else {
                hideElement(panelId);
                ansPanel.classList.remove('show');
            }
        }
    });

    // Update status text, e.g., "1 of 4"
    const statusText = document.getElementById('status_bar'); 
    if (statusText) {
        const tspans = statusText.querySelectorAll('tspan');
        tspans.forEach(ts => {
            if (ts.textContent.includes('of 4') || ts.textContent.match(/\\d of 4/)) {
                ts.textContent = `${discoveredList.length} of 4`;
            }
        });

        // Update green circles
        const circles = statusText.querySelectorAll('circle, ellipse');
        circles.forEach((c, i) => {
            if (i < discoveredList.length) {
                c.setAttribute('fill', '#00b894');
            } else {
                c.setAttribute('fill', '#077077');
            }
        });
    }

    if (discoveredList.length >= 4) {
        console.log(`renderDiscoveredWords: Completed 4/4! Presenting ending popup.`);
        setTimeout(() => {
            unhideElement('correct_end_popup');

    const endPopupBg = document.querySelector('#correct_end_popup rect');
    if (endPopupBg) {
        endPopupBg.setAttribute('x', '-5000');
        endPopupBg.setAttribute('y', '-5000');
        endPopupBg.setAttribute('width', '10000');
        endPopupBg.setAttribute('height', '10000');
    }

            const playAgainBtn = document.getElementById('Play_Again') || document.getElementById('Group_8214');
            if (playAgainBtn) {
                playAgainBtn.style.cursor = 'pointer';
                playAgainBtn.onclick = () => { 
                    console.log('End Popup: Triggered Play Again reset');
                    hideElement('correct_end_popup'); 
                    returnToMenu(); 
                };
            }
        }, 1200);
    }
}

function updateInstructionText(family) {
    console.log(`updateInstructionText: Flowing exclamation text correctly for [${family}]`);
    const qitxt = document.getElementById('qitxt');

    if (qitxt) {
        const tspans = qitxt.querySelectorAll('tspan');
        tspans.forEach(ts => {
            ts.removeAttribute('x'); // Let flow handle it
            const currentText = ts.textContent.trim().toUpperCase();
            if (['SUN', 'SAND', 'SEA', 'RAIN', 'SNOW', 'FIRE'].includes(currentText)) {
                ts.textContent = family.toUpperCase();
            }
            if (currentText === '!') {
                ts.setAttribute('dx', '5');
            }
        });
    }
}

function updatePopupText(family) {
    const popup = document.getElementById('correct_end_popup');
    if (popup) {
        const tspans = popup.querySelectorAll('tspan');
        tspans.forEach(ts => {
            if (ts.textContent.match(/SUN|SAND|SEA|RAIN|SNOW|FIRE/i)) {
                ts.textContent = ts.textContent.replace(/SUN|SAND|SEA|RAIN|SNOW|FIRE/ig, family.toUpperCase());
            }
        });
    }
}

function playChirp() {

    try {
        const audio = new window.Audio('assets/bird-chirping.mp3');
        audio.play().catch(() => {
            // Backup synth beep
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain); gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(2000, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(4000, ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.2, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
            osc.start(); osc.stop(ctx.currentTime + 0.1);
        });
    } catch(e) {}
}

function createConfetti(rect) {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4'];
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.top = rect ? (rect.top + rect.height/2 + 'px') : '-10px';
        confetti.style.left = rect ? (rect.left + rect.width/2 + 'px') : (Math.random() * 100 + 'vw');
        confetti.style.zIndex = '9999';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        document.body.appendChild(confetti);

        const duration = Math.random() * 2 + 1.5;
        confetti.animate([
            { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
            { transform: `translate3d(${Math.random()*200 - 100}px, 100vh, 0) rotate(${Math.random()*720}deg)`, opacity: 0 }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(.37,0,.63,1)',
            fill: 'forwards'
        });

        setTimeout(() => confetti.remove(), duration * 1000 + 100);
    }
}

function hideElement(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
}

function unhideElement(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', initGame);
