/**
 * Global variables for the application state
 */
const AppState = {
    elements: {
        nextBtn: null,
        step1: null,
        step2: null,
        mapBg: null,
        map: null,
        flagsWrapper: null,
        iText2: null,
        btnQuiz: null,
        countryMaps: {}
    },
    mapState: {
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        currentScale: 1
    },
    data: null,
    currentCountryData: null
};

const COUNTRY_IDS = [
    'bulgaria', 'serbia', 'croatia', 'north-macedonia', 'kosovo', 
    'bosnia-and-herzegovina', 'greece', 'montenegro', 'albania', 'slovenia'
];

/**
 * Initialize DOM element references
 */
function initElements() {
    AppState.elements.nextBtn = document.getElementById('next-btn');
    AppState.elements.step1 = document.getElementById('step-1');
    AppState.elements.step2 = document.getElementById('step-2');
    AppState.elements.mapBg = document.getElementById('map-bg');
    AppState.elements.map = document.getElementById('map');
    
    AppState.elements.flagsWrapper = document.getElementById('flags-wrapper');
    AppState.elements.iText2 = document.getElementById('i-text2');
    AppState.elements.btnQuiz = document.getElementById('btn-quiz');
    
    COUNTRY_IDS.forEach(id => {
        AppState.elements.countryMaps[id] = document.getElementById(`${id}-map`);
    });
}

/**
 * Helper to get mouse coordinates relative to the SVG container
 */
function getMousePosition(evt, svg) {
    const CTM = svg.getScreenCTM();
    if (evt.touches) { evt = evt.touches[0]; }
    return {
        x: (evt.clientX - CTM.e) / CTM.a,
        y: (evt.clientY - CTM.f) / CTM.d
    };
}

/**
 * Initialize map panning and clipping
 */
function initMapPanAndClip() {
    const mapBg = AppState.elements.mapBg;
    const map = AppState.elements.map;
    
    if (!mapBg || !map) return;

    const svg = map.closest('svg');
    if (!svg) return;

    // 1. Setup Clip Path to clip #map to #Rectangle 343 bounds inside #map-bg
    let defs = svg.querySelector('defs');
    if (!defs) {
        defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        svg.insertBefore(defs, svg.firstChild);
    }
    const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
    clipPath.id = 'map-clip';
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Using Vector_5 path from Rectangle 343 (the main background block for the map)
    path.setAttribute('d', 'M1735 127.242H704C690.745 127.242 680 137.987 680 151.242V841.242C680 854.497 690.745 865.242 704 865.242H1735C1748.25 865.242 1759 854.497 1759 841.242V151.242C1759 137.987 1748.25 127.242 1735 127.242Z');
    clipPath.appendChild(path);
    defs.appendChild(clipPath);

    // Create wrapper for clipping so translation on #map works independently
    const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wrapper.id = 'map-wrapper';
    wrapper.setAttribute('clip-path', 'url(#map-clip)');
    
    map.parentNode.insertBefore(wrapper, map);
    wrapper.appendChild(map);

    // 2. Setup Panning and Zooming Listeners
    mapBg.style.cursor = 'grab';

    const updateMapTransform = () => {
        map.setAttribute('transform', `translate(${AppState.mapState.currentX}, ${AppState.mapState.currentY}) scale(${AppState.mapState.currentScale})`);
    };

    const startDrag = (e) => {
        AppState.mapState.isDragging = true;
        const pos = getMousePosition(e, svg);
        AppState.mapState.startX = pos.x;
        AppState.mapState.startY = pos.y;
        mapBg.style.cursor = 'grabbing';
    };

    const drag = (e) => {
        if (!AppState.mapState.isDragging) return;
        e.preventDefault(); 
        const pos = getMousePosition(e, svg);
        const dx = pos.x - AppState.mapState.startX;
        const dy = pos.y - AppState.mapState.startY;
        
        AppState.mapState.startX = pos.x;
        AppState.mapState.startY = pos.y;
        
        AppState.mapState.currentX += dx;
        AppState.mapState.currentY += dy;
        
        updateMapTransform();
    };

    const endDrag = () => {
        AppState.mapState.isDragging = false;
        mapBg.style.cursor = 'grab';
    };

    const zoom = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        let newScale = AppState.mapState.currentScale + delta;
        newScale = Math.min(Math.max(0.5, newScale), 5); // Limit zoom out to 0.5x and zoom in to 5x

        const scaleRatio = newScale / AppState.mapState.currentScale;
        const pos = getMousePosition(e, svg);

        AppState.mapState.currentX = pos.x - (pos.x - AppState.mapState.currentX) * scaleRatio;
        AppState.mapState.currentY = pos.y - (pos.y - AppState.mapState.currentY) * scaleRatio;
        AppState.mapState.currentScale = newScale;

        updateMapTransform();
    };

    // Attach to mapBg so we can click and drag anywhere in the background
    mapBg.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', drag);
    window.addEventListener('mouseup', endDrag);
    mapBg.addEventListener('wheel', zoom, { passive: false });
}

/**
 * Load quiz data from data.json
 */
async function loadData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Failed to load data.json');
        AppState.data = await response.json();
    } catch (error) {
        console.error('Error loading data:', error);
    }
}

/**
 * Handle country click
 */
function handleCountryClick(countryId) {
    if (!AppState.data || !AppState.data.questions) return;

    const normalizedName = countryId.replace(/-/g, ' ').toLowerCase();
    
    AppState.currentCountryData = AppState.data.questions.find(
        item => item.country.toLowerCase() === normalizedName
    );

    if (AppState.elements.flagsWrapper) {
        AppState.elements.flagsWrapper.classList.add('disabled');
    }
    if (AppState.elements.iText2) {
        AppState.elements.iText2.style.display = 'block';
    }
    if (AppState.elements.btnQuiz) {
        AppState.elements.btnQuiz.style.display = 'block';
    }
}

/**
 * Attach event listeners to elements
 */
function attachEventListeners() {
    if (AppState.elements.nextBtn) {
        AppState.elements.nextBtn.addEventListener('click', handleNextBtnClick);
    }
    
    COUNTRY_IDS.forEach(id => {
        const element = AppState.elements.countryMaps[id];
        if (element) {
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => handleCountryClick(id));
        }
    });
}

/**
 * Handle the click event for the next button
 */
function handleNextBtnClick() {
    if (AppState.elements.step1 && AppState.elements.step2) {
        AppState.elements.step1.style.display = 'none';
        AppState.elements.step2.style.display = 'block';
    }
}

/**
 * Initialize the widget
 */
async function init() {
    await loadData();
    initElements();
    attachEventListeners();
    initMapPanAndClip();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);