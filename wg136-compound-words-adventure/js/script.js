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
        .interactive-card { transform-origin: center; cursor: pointer; transition: transform 0.2s; }
        .interactive-card:hover { transform: scale(1.05); }
        .interactive-card.used { opacity: 0; pointer-events: none; }
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
        #home_btn { cursor: pointer; transition: transform 0.2s; }
        #home_btn:hover { transform: scale(1.05); }
    `;
    document.head.appendChild(style);

    // Initial Hide of Activity UI
    hideElement('question');
    hideElement('qitxt');
    hideElement('status_bar');
    hideElement('answer_panels');

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
         homeBtn.onclick = returnToMenu;
    }
}

function openFamily(family) {
    if (WidgetState.isAnimating) return;
    WidgetState.currentFamily = family;

    // Hide Home Screen elements
    hideElement('home_cards');
    hideElement('home_itext');
    // removed hideElement main, as it breaks entire DOM visibility

    unhideElement('question');
    unhideElement('qitxt');
    unhideElement('status_bar');
    unhideElement('answer_panels');
    
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
        unhideElement(family + '_family_assets');
        setupFamilyInteractions(family, famAssets);
    }

    renderDiscoveredWords(family);
    updateInstructionText(family);
}

function returnToMenu() {
    if (WidgetState.isAnimating) return;
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

    // Reset instruction text to default or keep it.
    unhideElement('home_cards');
    unhideElement('home_itext');
}

function setupFamilyInteractions(family, famAssets) {
    // Only setup once
    if (WidgetState.elements[family]) return;
    
    WidgetState.elements[family] = { options: [] };
    
    // Options are typically 6 groups around the center.
    // Based on previous structure, we find the 6 option paths/groups.
    // We will find all children of famAssets that have no child groups, or a specific structure.
    const children = Array.from(famAssets.children);
    
    const options = [];
    children.forEach(child => {
        // Skip background rectangles or large layout paths by ignoring things with no ID and are just empty paths
        if (child.tagName === 'g') {
            options.push(child);
        }
    });
    
    // We need exactly 6 options and 1 center, wait, it might be nested
    // We'll let the user rename them or just try to bind what we can
    // It's safer if the user renames the assets to `${family}_opt_0`, etc.
    // If not, we bind ALL 'g' children that have a transform or match
    
    // Since we don't know the exact IDs, we iterate all sub-groups that represent individual cards.
    // In our SVG layout, they are likely the top level 'g' elements inside the family asset.
    let validOptions = options.filter(g => {
        // Find visible bounding elements
        return true; 
    });

    validOptions.forEach((opt, index) => {
        opt.classList.add('interactive-card');
        // Setup simple bounds-based sync for elements at this index if needed
        if (WidgetState.discovered[family].includes(index)) {
             opt.classList.add('used');
             opt.style.opacity = '0';
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
                sibling.style.opacity = '0';
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
                sibling.style.pointerEvents = 'auto';
            }
        }
    });
}

function handleOptionClick(family, index, element) {
    if (WidgetState.isAnimating) return;
    
    const mappings = WidgetState.WORD_MAPPINGS[family];
    const compoundWord = mappings[index];
    
    if (compoundWord) {
        // Correct guess
        WidgetState.isAnimating = true;
        
        // Disable
        element.style.pointerEvents = 'none';
        
        // Fade out transition
        element.style.transition = 'opacity 0.6s, filter 0.6s';
        element.style.filter = 'drop-shadow(0 0 15px #f6c248)';
        element.style.opacity = '0';
        fadeSiblingsAt(element);
        
        setTimeout(() => {
            element.classList.add('used');
            element.style.transition = 'none';
            element.style.filter = 'none';
            // KEEP opacity at 0 so it stays securely hidden
            
            if (!WidgetState.discovered[family].includes(index)) {
                WidgetState.discovered[family].push(index);
            }
            createConfetti();
            renderDiscoveredWords(family);
            
            WidgetState.isAnimating = false;
        }, 650);
        
    } else {
        // Wrong guess
        element.classList.add('wrong');
        setTimeout(() => {
            element.classList.remove('wrong');
        }, 400);
    }
}

function renderDiscoveredWords(family) {
    // Hide all existing answer panels first
    const mapping = WidgetState.WORD_MAPPINGS[family] || {};
    
    // Unhide the panel graphic corresponding to the discovered word
    const discoveredList = WidgetState.discovered[family];
    
    // According to instructions: Extract the answer panels from main SVG
    // We just find elements by ID like 'sandstorm_ans' and show them.
    Object.keys(mapping).forEach((idxStr, posIndex) => {
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
                // Optionally reposition if we want them stacked vertically tightly:
                // If they are already laid out perfectly in the SVG, we don't need to move them!
                ansPanel.classList.add('ans-panel', 'show');
            } else {
                hideElement(panelId);
                ansPanel.classList.remove('show');
            }
        }
    });

    // Update status text, e.g., "1 of 4"
    const statusText = document.getElementById('status_bar'); // Wait, need to find the specific text node
    if (statusText) {
        // The text is probably a text node inside status_bar. Let's just find the tspan inside it.
        const tspans = statusText.querySelectorAll('tspan');
        tspans.forEach(ts => {
            if (ts.textContent.includes('of 4') || ts.textContent.match(/\\d of 4/)) {
                ts.textContent = `${discoveredList.length} of 4`;
            }
        });
    }
}

function updateInstructionText(family) {
    const qitxt = document.getElementById('qitxt');
    if (qitxt) {
        const tspans = qitxt.querySelectorAll('tspan');
        tspans.forEach(ts => {
            const currentText = ts.textContent.trim().toUpperCase();
            if (['SUN', 'SAND', 'SEA', 'RAIN', 'SNOW', 'FIRE'].includes(currentText)) {
                ts.textContent = family.toUpperCase();
            }
        });
    }
}

function createConfetti() {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4'];
    for (let i = 0; i < 40; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.top = '-10px';
        confetti.style.left = Math.random() * 100 + 'vw';
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
