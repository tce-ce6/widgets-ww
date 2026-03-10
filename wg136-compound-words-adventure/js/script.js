const GameState = {
    currentFamily: null,
    completedFamilies: new Set(),
    elements: {},
    families: {
        sun: { discovered: [] },
        rain: { discovered: [] },
        snow: { discovered: [] },
        fire: { discovered: [] },
        sea: { discovered: [] },
        sand: { discovered: [] }
    },
    familyData: {
        sun: { name: 'SUN', correctIdx: [0, 3, 4, 5], distractorIdx: [1, 2] },
        rain: { name: 'RAIN', correctIdx: [0, 1, 2, 3], distractorIdx: [4, 5] },
        snow: { name: 'SNOW', correctIdx: [0, 2, 3, 4], distractorIdx: [1, 5] },
        fire: { name: 'FIRE', correctIdx: [1, 2, 3, 4], distractorIdx: [0, 5] },
        sea: { name: 'SEA', correctIdx: [0, 3, 4, 5], distractorIdx: [1, 2] },
        sand: { name: 'SAND', correctIdx: [0, 2, 4, 5], distractorIdx: [1, 3] }
    },
    CARD_POSITIONS: [
        { x: 516.5, y: 212.11 }, // 0
        { x: 278.5, y: 336.11 }, // 1
        { x: 277.5, y: 567.11 }, // 2
        { x: 516.5, y: 694.11 }, // 3
        { x: 755.5, y: 567.11 }, // 4
        { x: 754.5, y: 336.11 }  // 5
    ],
    HOME_MAPPINGS: {
        'Group_7999': 'sun',
        'Group_8000': 'snow',
        'Group_8001': 'rain',
        'Group_8002': 'sea',
        'Group_8003': 'fire',
        'Group_8004': 'sand'
    },
    isAnimating: false
};

function initGame() {
    injectStyles();

    // Group assets initially when all are visible to ensure getBBox works
    groupAssets();

    // Bind home icons
    Object.keys(GameState.HOME_MAPPINGS).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.cursor = 'pointer';
            el.addEventListener('click', () => {
                openFamily(GameState.HOME_MAPPINGS[id]);
            });
        }
    });

    // Create discovered words container
    let activityBox = document.getElementById('activity-box');
    if (activityBox) {
        const wordsContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");
        wordsContainer.id = 'discovered-words-container';
        activityBox.appendChild(wordsContainer);
    }

    // Hide activity box and family assets
    document.getElementById('activity-box').style.display = 'none';
    Object.keys(GameState.families).forEach(fam => {
        const el = document.getElementById(fam + '_family_assets');
        if (el) el.style.display = 'none';
    });
}

function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .interactive-card {
           transform-origin: center;
        }
        .interactive-card.used {
           opacity: 0.4;
           pointer-events: none;
        }
        .interactive-card.wrong {
           animation: shake-card 0.4s;
        }
        @keyframes shake-card {
           0% { transform: translateX(0); }
           25% { transform: translateX(-12px); }
           50% { transform: translateX(12px); }
           75% { transform: translateX(-12px); }
           100% { transform: translateX(0); }
        }
        .words-plus {
            font-family: "Roboto", sans-serif;
        }
    `;
    document.head.appendChild(style);
}

function groupAssets() {
    const families = Object.keys(GameState.families);
    families.forEach(fam => {
        const group = document.getElementById(fam + '_family_assets');
        if (!group) return;

        const children = Array.from(group.children);

        const optionContainers = GameState.CARD_POSITIONS.map((pos, idx) => {
            const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
            g.setAttribute('class', 'interactive-card');
            g.dataset.idx = idx;
            g.style.cursor = 'pointer';
            return g;
        });

        const centerContainer = document.createElementNS("http://www.w3.org/2000/svg", "g");

        children.forEach(child => {
            // Some elements might have 0 dimensions if not properly rendered, but XD SVGs are path-based
            const bbox = child.getBBox();
            if (bbox.width === 0 && bbox.height === 0) return;

            const centerX = bbox.x + bbox.width / 2;
            const centerY = bbox.y + bbox.height / 2;

            let matched = false;
            for (let i = 0; i < GameState.CARD_POSITIONS.length; i++) {
                const pos = GameState.CARD_POSITIONS[i];
                if (centerX > pos.x - 20 && centerX < pos.x + 220 && centerY > pos.y - 20 && centerY < pos.y + 220) {
                    optionContainers[i].appendChild(child);
                    matched = true;
                    break;
                }
            }

            if (!matched) {
                // Central position bounding check
                if (centerX > 490 && centerX < 730 && centerY > 430 && centerY < 670) {
                    centerContainer.appendChild(child);
                }
            }
        });

        optionContainers.forEach((container, idx) => {
            group.appendChild(container);
            container.addEventListener('click', () => handleOptionClick(fam, idx));
        });
        group.appendChild(centerContainer);

        GameState.elements[fam] = {
            group: group,
            options: optionContainers,
            center: centerContainer
        };
    });
}

function openFamily(family) {
    if (GameState.isAnimating) return;

    GameState.currentFamily = family;

    // Hide home screen
    document.getElementById('home').style.display = 'none';

    // Hide all family assets, show chosen
    Object.keys(GameState.families).forEach(fam => {
        const el = document.getElementById(fam + '_family_assets');
        if (el) el.style.display = (fam === family) ? 'block' : 'none';
    });

    // Show activity box
    document.getElementById('activity-box').style.display = 'block';

    // Update instruction text
    const tspanElements = document.querySelectorAll('#Click_the_pictures_that_make_a_word_with_SUN_ text tspan');
    if (tspanElements.length >= 2) {
        tspanElements[1].textContent = GameState.familyData[family].name;
    }

    // Render state
    renderDiscoveredWords(family);
}

function returnToMenu() {
    GameState.currentFamily = null;
    GameState.isAnimating = false;
    document.getElementById('activity-box').style.display = 'none';

    Object.keys(GameState.families).forEach(fam => {
        const el = document.getElementById(fam + '_family_assets');
        if (el) el.style.display = 'none';
    });

    document.getElementById('home').style.display = 'block';
}

function handleOptionClick(family, idx) {
    if (GameState.isAnimating) return;

    // Need to get the actual <g> container
    const container = GameState.elements[family].options[idx];
    if (!container || container.classList.contains('used')) return;

    const isCorrect = GameState.familyData[family].correctIdx.includes(idx);

    if (!isCorrect) {
        GameState.isAnimating = true;
        container.classList.add('wrong');
        setTimeout(() => {
            container.classList.remove('wrong');
            GameState.isAnimating = false;
        }, 400); // Wait for shake to finish
    } else {
        GameState.isAnimating = true;

        // Highlight and fly to center
        container.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        container.style.filter = 'drop-shadow(0 0 15px #f6c248)';

        const pos = GameState.CARD_POSITIONS[idx];
        const targetX = 516.5 - pos.x;
        const targetY = 452.5 - pos.y;

        container.style.transform = `translate(${targetX}px, ${targetY}px) scale(0.8)`;

        setTimeout(() => {
            // Revert container physics
            container.style.transition = 'none';
            container.style.transform = 'none';
            container.style.filter = 'none';
            container.classList.add('used');

            createConfetti();

            GameState.families[family].discovered.push(idx);
            renderDiscoveredWords(family);

            checkCompletion(family);

        }, 650);
    }
}

function renderDiscoveredWords(family) {
    const wordsContainer = document.getElementById('discovered-words-container');
    if (!wordsContainer) return;

    wordsContainer.innerHTML = '';
    const discovered = GameState.families[family].discovered;

    discovered.forEach((originalIdx, posIndex) => {
        const WordX = 1060 + (posIndex % 2) * 270;
        const WordY = 320 + Math.floor(posIndex / 2) * 200;

        const combinedGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");

        // Setup center wrapper
        const centerWrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
        centerWrapper.setAttribute('transform', `translate(${WordX}, ${WordY}) scale(0.4) translate(-516.5, -452.5)`);
        const centerClone = GameState.elements[family].center.cloneNode(true);
        centerWrapper.appendChild(centerClone);

        // Setup text + sign
        const plusSign = document.createElementNS("http://www.w3.org/2000/svg", "text");
        plusSign.setAttribute("x", WordX + 90);
        plusSign.setAttribute("y", WordY + 50);
        plusSign.setAttribute("font-size", "45");
        plusSign.setAttribute("fill", "#fdce35");
        plusSign.setAttribute("font-weight", "bold");
        plusSign.setAttribute("class", "words-plus");
        plusSign.textContent = "+";

        // Setup option wrapper
        const optionWrapper = document.createElementNS("http://www.w3.org/2000/svg", "g");
        const pos = GameState.CARD_POSITIONS[originalIdx];
        optionWrapper.setAttribute('transform', `translate(${WordX + 120}, ${WordY}) scale(0.4) translate(${-pos.x}, ${-pos.y})`);

        // clone without 'used' styles
        const optionClone = GameState.elements[family].options[originalIdx].cloneNode(true);
        optionClone.classList.remove('used');
        optionWrapper.appendChild(optionClone);

        combinedGroup.appendChild(centerWrapper);
        combinedGroup.appendChild(plusSign);
        combinedGroup.appendChild(optionWrapper);
        wordsContainer.appendChild(combinedGroup);
    });

    // Update progress text
    const tspanCount = document.querySelector('#_0_of_4 tspan');
    if (tspanCount) {
        tspanCount.textContent = `${discovered.length} of 4`;
    }

    // Update progress circles
    for (let i = 1; i <= 4; i++) {
        const ellipse = document.getElementById(`Ellipse_${i}`);
        if (ellipse) {
            ellipse.setAttribute('fill', i <= discovered.length ? '#f6c248' : '#077077');
        }
    }
}

function checkCompletion(family) {
    const discovered = GameState.families[family].discovered;
    if (discovered.length === 4) {
        GameState.completedFamilies.add(family);

        setTimeout(() => {
            if (GameState.completedFamilies.size === 6) {
                showPopupMsg('🏆 Congratulations!', "You've mastered all 24 compound words!", () => {
                    resetGame();
                }, "PLAY AGAIN");
            } else {
                showPopupMsg('Amazing!', `You completed the ${GameState.familyData[family].name} family!`, () => {
                    returnToMenu();
                });
            }
        }, 800);
    } else {
        GameState.isAnimating = false;
    }
}

function resetGame() {
    Object.keys(GameState.families).forEach(fam => {
        GameState.families[fam].discovered = [];
        if (GameState.elements[fam]) {
            GameState.elements[fam].options.forEach(opt => {
                opt.classList.remove('used');
                opt.style.transition = 'none';
                opt.style.transform = 'none';
                opt.style.filter = 'none';
            });
        }
    });
    GameState.completedFamilies.clear();
    GameState.currentFamily = null;
    GameState.isAnimating = false;
    returnToMenu();
}

function showPopupMsg(title, msg, onComplete, btnText) {
    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '2000';

    const card = document.createElement('div');
    card.style.backgroundColor = '#fff';
    card.style.padding = '40px 60px';
    card.style.borderRadius = '20px';
    card.style.textAlign = 'center';
    card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
    card.style.maxWidth = '600px';

    // Add emojis based on title
    const emoji = document.createElement('div');
    emoji.textContent = title.includes('Amazing') ? '🎉' : '🏆';
    emoji.style.fontSize = '80px';
    emoji.style.marginBottom = '10px';
    card.appendChild(emoji);

    const h2 = document.createElement('h2');
    h2.textContent = title;
    h2.style.color = '#333';
    h2.style.fontSize = '38px';
    h2.style.margin = '0 0 15px 0';
    h2.style.fontFamily = '"Roboto", sans-serif';
    card.appendChild(h2);

    const p = document.createElement('p');
    p.textContent = msg;
    p.style.color = '#666';
    p.style.fontSize = '26px';
    p.style.margin = '0 0 35px 0';
    p.style.fontFamily = '"Roboto", sans-serif';
    card.appendChild(p);

    if (btnText) {
        const btn = document.createElement('button');
        btn.textContent = btnText;
        btn.style.padding = '15px 40px';
        btn.style.fontSize = '22px';
        btn.style.fontWeight = 'bold';
        btn.style.backgroundColor = '#1e6bef';
        btn.style.color = '#fff';
        btn.style.border = 'none';
        btn.style.borderRadius = '30px';
        btn.style.cursor = 'pointer';
        btn.style.transition = 'all 0.2s';
        btn.onmouseover = () => btn.style.transform = 'scale(1.05)';
        btn.onmouseout = () => btn.style.transform = 'scale(1)';
        btn.onclick = () => {
            overlay.remove();
            if (onComplete) onComplete();
        };
        card.appendChild(btn);
    } else {
        setTimeout(() => {
            overlay.style.transition = 'opacity 0.4s';
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
                if (onComplete) onComplete();
            }, 400);
        }, 2200);
    }

    overlay.appendChild(card);
    document.querySelector('.container').appendChild(overlay);
}

function createConfetti() {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    const container = document.querySelector('.container');
    if (!container) return;

    for (let i = 0; i < 60; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = Math.random() < 0.5 ? '10px' : '14px';
        confetti.style.height = Math.random() < 0.5 ? '10px' : '14px';

        // Mix between circles and squares
        if (Math.random() < 0.5) confetti.style.borderRadius = '50%';

        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.top = '-20px';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.zIndex = '1500';
        confetti.style.pointerEvents = 'none';

        container.appendChild(confetti);

        const animationDuration = Math.random() * 1.5 + 1.5;
        const animationDelay = Math.random() * 0.5;

        confetti.animate([
            { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
            { transform: `translate3d(${Math.random() * 200 - 100}px, 100vh, 0) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: animationDuration * 1000,
            delay: animationDelay * 1000,
            easing: 'cubic-bezier(.37,0,.63,1)',
            fill: 'forwards'
        });

        setTimeout(() => {
            if (confetti.parentNode) confetti.remove();
        }, (animationDuration + animationDelay) * 1000 + 100);
    }
}

document.addEventListener('DOMContentLoaded', initGame);
