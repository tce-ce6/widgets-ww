import { literaryDevices } from './data.js';

// State
let currentView = 'home';
let selectedDevice = null;
let builderSelectedIndexes = [];
let invalidSelection = null;

// DOM Elements
const homeView = document.getElementById('view-home');
const builderView = document.getElementById('view-builder');
const homeGrid = document.getElementById('home-grid');
const detailOverlay = document.getElementById('detail-overlay');
const resultOverlay = document.getElementById('result-overlay');

// Data sorted
const sortedDevices = [...literaryDevices].sort((a, b) => a.order - b.order);

// --- Initialization ---
function init() {
    renderHome();
    setupEventListeners();
}

// --- Rendering ---

function renderHome() {
    homeGrid.innerHTML = '';
    sortedDevices.forEach(device => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${device.title}</h3>
        `;
        card.onclick = () => openDetail(device);
        homeGrid.appendChild(card);
    });
}

function openDetail(device) {
    selectedDevice = device;
    document.getElementById('detail-title').innerText = device.title;
    const descEl = document.getElementById('detail-description');
    descEl.innerText = device.description;
    descEl.classList.toggle('active', device.id === 'transferred-epithet');

    const sentenceEl = document.getElementById('detail-sentence');
    sentenceEl.classList.toggle('active', device.id === 'oxymoron' || device.id === 'hyperbole');
    sentenceEl.classList.toggle('alliteration-mode', device.id === 'alliteration');

    // Render Mapping
    const mappingEl = document.getElementById('detail-mapping');
    mappingEl.innerHTML = '';
    const svgOverlay = document.getElementById('svg-overlay');
    svgOverlay.style.display = device.id === 'alliteration' ? 'none' : 'block';
    
    // Sort keys based on first appearance in sentence to prevent crossing lines
    const mappingKeys = Object.keys(device.example.mapping).sort((a, b) => {
        const indexA = device.example.sentence.findIndex(w => w.type === a);
        const indexB = device.example.sentence.findIndex(w => w.type === b);
        return indexA - indexB;
    });

    mappingKeys.forEach(key => {
        if (device.id === 'alliteration') return; // Do not show mapping-item for Alliteration
        
        const value = device.example.mapping[key];
        const item = document.createElement('div');
        item.className = 'mapping-item';
        // item.style.color = value.background === 'yellow' ? '#856404' : value.background;
        item.dataset.key = key;
        // In js/script.js, line 55
        item.innerText = `{ ${value.title} }`;

        mappingEl.appendChild(item);
    });

    // Render Sentence
    sentenceEl.innerHTML = '';
    device.example.sentence.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'sentence-word';
        span.innerText = word.words;
        if (word.type) {
            span.style.backgroundColor = device.example.mapping[word.type].background;
            span.dataset.type = word.type;
        }
        sentenceEl.appendChild(span);
    });

    // Hide app and show detail-overlay as block
    document.getElementById('app').classList.add('hidden');
    detailOverlay.classList.add('step-mode');
    detailOverlay.style.display = 'block';

    // Wait for render then draw lines
    setTimeout(() => drawLines(), 100);
}

function drawLines() {
    const svg = document.getElementById('svg-overlay');
    const container = document.getElementById('detail-viz-container');
    const containerRect = container.getBoundingClientRect();

    svg.innerHTML = '';
    if (selectedDevice.id === 'alliteration') return;

    svg.setAttribute('height', containerRect.height);
    svg.setAttribute('width', containerRect.width);
    svg.setAttribute('viewBox', `0 0 ${containerRect.width} ${containerRect.height}`);

    const words = document.querySelectorAll('.sentence-word');
    const labels = document.querySelectorAll('.mapping-item');

    selectedDevice.example.sentence.forEach((word, wordIndex) => {
        if (!word.type) return;

        const wordEl = words[wordIndex];
        const labelEl = Array.from(labels).find(l => l.dataset.key === word.type);

        if (!wordEl || !labelEl) return;

        const wordRect = wordEl.getBoundingClientRect();
        const labelRect = labelEl.getBoundingClientRect();

        const x1 = (labelRect.left + labelRect.width / 2) - containerRect.left;
        const y1 = (labelRect.bottom) - containerRect.top;
        const x2 = (wordRect.left + wordRect.width / 2) - containerRect.left;
        const y2 = (wordRect.top) - containerRect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', '#333');
        line.setAttribute('stroke-width', '1.5');
        line.setAttribute('stroke-dasharray', '3,3');
        svg.appendChild(line);
    });
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

let shuffledCombinations = [];

function launchBuilder() {
    detailOverlay.style.display = 'none';
    detailOverlay.classList.remove('step-mode');
    document.getElementById('app').classList.remove('hidden');
    currentView = 'builder';
    homeView.classList.add('hidden');
    builderView.classList.remove('hidden');

    document.getElementById('builder-title').innerText = selectedDevice.title;
    const resTitle = document.getElementById('result-title');
    if (resTitle) resTitle.innerText = selectedDevice.title;
    builderSelectedIndexes = [];

    // Shuffle once per launch
    shuffledCombinations = selectedDevice.player.combinations.map(col => shuffleArray(col));

    renderBuilder();
}

function renderBuilder() {
    const content = document.getElementById('builder-content');
    content.innerHTML = '';

    const combinations = selectedDevice.player.combinations;
    const colCount = combinations.length;

    content.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;

    // Get sorted mapping keys to assign colors to columns
    const mappingKeys = Object.keys(selectedDevice.example.mapping).sort((a, b) => {
        const indexA = selectedDevice.example.sentence.findIndex(w => w.type === a);
        const indexB = selectedDevice.example.sentence.findIndex(w => w.type === b);
        return indexA - indexB;
    });

    shuffledCombinations.forEach((col, colIndex) => {
        const colDiv = document.createElement('div');
        colDiv.className = 'builder-col';

        const isColumnDisabled = colIndex > builderSelectedIndexes.length;

        col.forEach((item) => {
            const opt = document.createElement('div');
            const isSelected = builderSelectedIndexes[colIndex] === item.id;
            const isInvalid = invalidSelection?.colIndex === colIndex && invalidSelection?.itemId === item.id;

            opt.className = `option-card ${isColumnDisabled ? 'disabled' : ''} ${isSelected ? 'selected correct' : ''} ${isInvalid ? 'invalid' : ''}`;
            opt.innerText = item.title;

            if (isSelected) {
                // Map column index to mapping keys (with fallback for devices with fewer keys than columns)
                const typeKey = mappingKeys[Math.min(colIndex, mappingKeys.length - 1)];
                const bgColor = selectedDevice.example.mapping[typeKey].background;
                opt.style.backgroundColor = bgColor;
                // If the background is yellow, match the dark text style from mapping-item
                if (bgColor === 'yellow') opt.style.color = '#856404';
            }

            opt.onclick = () => handleSelect(colIndex, item.id);
            colDiv.appendChild(opt);
        });

        content.appendChild(colDiv);
    });

    updateConstructedSentence();
    updateSubmitButton();
}

function handleSelect(colIndex, itemId) {
    if (colIndex > builderSelectedIndexes.length) return;

    let baseSelections;
    if (colIndex < builderSelectedIndexes.length) {
        baseSelections = builderSelectedIndexes.slice(0, colIndex);
    } else {
        baseSelections = [...builderSelectedIndexes];
    }

    const updated = [...baseSelections];
    updated[colIndex] = itemId;

    const answerString = updated.join('');
    const isValidPrefix = selectedDevice.player.correctAnswers.some(ans => ans.answer.startsWith(answerString));

    if (!isValidPrefix) {
        builderSelectedIndexes = baseSelections;
        invalidSelection = { colIndex, itemId };
        renderBuilder();
        setTimeout(() => {
            invalidSelection = null;
            renderBuilder();
        }, 700);
        return;
    }

    invalidSelection = null;
    builderSelectedIndexes = updated;
    renderBuilder();
}

function updateConstructedSentence() {
    const combinations = selectedDevice.player.combinations;

    // Populate the individual result columns
    for (let i = 1; i <= 3; i++) {
        const colEl = document.getElementById(`builder-col-${i}`);
        if (!colEl) continue;

        const selectionIndex = i - 1;
        const selectedId = builderSelectedIndexes[selectionIndex];
        const selectedItem = combinations[selectionIndex]?.find(item => item.id === selectedId);

        if (selectedItem) {
            colEl.innerText = selectedItem.title;
            colEl.classList.add('correct');

            // Apply background color based on mapping scatter
            const mappingKeys = Object.keys(selectedDevice.example.mapping).sort((a, b) => {
                const indexA = selectedDevice.example.sentence.findIndex(w => w.type === a);
                const indexB = selectedDevice.example.sentence.findIndex(w => w.type === b);
                return indexA - indexB;
            });

            const typeKey = mappingKeys[Math.min(selectionIndex, mappingKeys.length - 1)];
            const bgColor = selectedDevice.example.mapping[typeKey].background;
            colEl.style.backgroundColor = bgColor;

        } else {
            colEl.innerText = '';
            colEl.style.backgroundColor = 'transparent';
            colEl.classList.remove('correct');
        }
    }

    const textEl = document.getElementById('constructed-sentence');
    if (textEl) {
        const sentence = builderSelectedIndexes
            .map((sel, i) => combinations[i].find(item => item.id === sel)?.title)
            .join(' ');
        textEl.innerText = sentence || "Select combinations above...";
        textEl.style.color = sentence ? '#1e293b' : '#64748b';
    }
}

function updateSubmitButton() {
    const btn = document.getElementById('btn-submit');
    const answerString = builderSelectedIndexes.join('');
    const combinations = selectedDevice.player.combinations;

    const isExactCorrect = selectedDevice.player.correctAnswers.some(ans => ans.answer === answerString);
    const isComplete = builderSelectedIndexes.length === combinations.length;

    btn.disabled = !(isComplete && isExactCorrect);
}

function handleSubmit() {
    const answerString = builderSelectedIndexes.join('');
    const result = selectedDevice.player.correctAnswers.find(ans => ans.answer === answerString);

    const combinations = selectedDevice.player.combinations;
    const sentence = builderSelectedIndexes
        .map((sel, i) => combinations[i].find(item => item.id === sel)?.title)
        .join(' ');

    document.getElementById('final-sentence').innerText = sentence;
    document.getElementById('result-explanation').innerText = result?.explanation || result?.title || "Correct!";
    
    const resTitle = document.getElementById('result-title');
    if (resTitle) resTitle.innerText = selectedDevice.title;

    resultOverlay.style.display = 'flex';
}

function goHome() {
    currentView = 'home';
    document.getElementById('app').classList.remove('hidden');
    homeView.classList.remove('hidden');
    builderView.classList.add('hidden');
    detailOverlay.style.display = 'none';
    detailOverlay.classList.remove('step-mode');
    resultOverlay.style.display = 'none';
    selectedDevice = null;
    builderSelectedIndexes = [];
}

// --- Event Listeners ---
function setupEventListeners() {

    document.getElementById('btn-launch').onclick = launchBuilder;

    document.querySelectorAll('.home-btn').forEach(btn => {
        btn.onclick = goHome;
    });

    document.getElementById('btn-submit').onclick = handleSubmit;

    document.getElementById('close-result').onclick = () => {
        resultOverlay.style.display = 'none';
        goHome();
    };

    window.onclick = (event) => {
        if (event.target === detailOverlay) detailOverlay.style.display = 'none';
    };

    window.onresize = () => {
        if (detailOverlay.style.display !== 'none') drawLines();
    };
}

// Start
init();
