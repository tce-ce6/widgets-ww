/**
 * Temperature Widget Logic
 * Single Source of Truth: The Slider Y-Position
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- Configuration & Constants ---
    const CONFIG = {
        constraints: {
            minY: 205, // Top (Max Temp: 380K)
            maxY: 813, // Bottom (Min Temp: 220K)
            rangeY: 608 // Total travel distance (813 - 205)
        },
        temperature: {
            maxK: 380, // Kelvin at Top
            minK: 220, // Kelvin at Bottom
            rangeK: 160 // Total Kelvin range (380 - 220)
        },
        indicator: {
            bottomAnchor: 870, // The fixed bottom pixel value where fill starts
            maxHeight: 628     // Maximum height of the bar
        },
        // The Y position where 0°C (273.15K) sits physically on the screen
        referenceZeroCelsiusY: 615 
    };

    // --- Preset Definitions ---
    const PRESETS = [
        { id: 'water-freezing', kelvin: 273.15 },       // 0 °C
        { id: 'water-boiling', kelvin: 373.15 },        // 100 °C
        { id: 'room-temperature', kelvin: 293.15 },     // 20 °C
        { id: 'avg-body-temperature', kelvin: 310.15 }  // 37 °C
    ];

    // --- DOM Elements ---
    const els = {
        // Slider Elements
        sliderGroup: document.getElementById('slider-group'),
        sliderControl: document.getElementById('slider-control'), // The handle
        indicator: document.getElementById('temp-level-indicator'),

        // Small Text (Inside Slider) - We need the wrapper <foreignObject> to move them
        smallKWrapper: document.getElementById('kelvin-temp').closest('foreignObject'),
        smallCWrapper: document.getElementById('celsius-temp').closest('foreignObject'),
        smallFWrapper: document.getElementById('fahrenheit-temp').closest('foreignObject'),
        sliderPanel: document.getElementById('slider-panel'), // The background track

        // Text Content Targets
        text: {
            smallK: document.getElementById('kelvin-temp'),
            smallC: document.getElementById('celsius-temp'),
            smallF: document.getElementById('fahrenheit-temp'),
            largeK: document.getElementById('kelvin-info-text'),
            largeC: document.getElementById('celsius-info-text'),
            largeF: document.getElementById('fahrenheit-info-text')
        }
    };

    // --- Initialization ---
    // We capture the initial Y positions relative to the "Zero Celsius" reference point (Y=615).
    // This allows us to move them all together maintaining their relative spacing.
    const movables = [
        els.sliderControl,
        els.sliderPanel,
        els.smallKWrapper,
        els.smallCWrapper,
        els.smallFWrapper
    ].map(el => ({
        element: el,
        baseOffset: parseFloat(el.getAttribute('y')) - CONFIG.referenceZeroCelsiusY
    }));

    // --- Helper Functions ---

    // 1. Math: Convert Y Position to Kelvin
    // Note: Lower Y = Higher Temp (Top of screen is max temp)
    function yToKelvin(y) {
        const percentFromTop = (y - CONFIG.constraints.minY) / CONFIG.constraints.rangeY;
        // Invert percentage because Top is Max
        const temp = CONFIG.temperature.maxK - (percentFromTop * CONFIG.temperature.rangeK);
        return temp;
    }

    // 2. Math: Convert Kelvin to Y Position (for Presets)
    function kelvinToY(k) {
        const percentOfRange = (CONFIG.temperature.maxK - k) / CONFIG.temperature.rangeK;
        return CONFIG.constraints.minY + (percentOfRange * CONFIG.constraints.rangeY);
    }

    // 3. Formatting
    const format = n => Math.round(n * 10) / 10; // Round to 1 decimal place

    // --- Core Update System ---
    function updateSystem(newY) {
        // A. Constraint Logic: Clamp Y between Top and Bottom limits
        const clampedY = Math.max(CONFIG.constraints.minY, Math.min(CONFIG.constraints.maxY, newY));

        // B. Calculate Temperatures
        const k = yToKelvin(clampedY);
        const c = k - 273.15;
        const f = (c * 9/5) + 32;

        // C. Update Text Content
        const kStr = `${Math.round(k)} K`;
        const cStr = `${Math.round(c)} °C`;
        const fStr = `${Math.round(f)}° F`;

        els.text.smallK.textContent = kStr;
        els.text.smallC.textContent = cStr;
        els.text.smallF.textContent = fStr;
        els.text.largeK.textContent = kStr;
        els.text.largeC.textContent = cStr;
        els.text.largeF.textContent = fStr;

        // D. Move Slider Group Elements
        // Everything moves relative to the new Y position
        movables.forEach(item => {
            item.element.setAttribute('y', clampedY + item.baseOffset);
        });

        // E. Update Indicator Fill
        // Calculate fill height based on temperature percentage
        const tempPercent = (k - CONFIG.temperature.minK) / CONFIG.temperature.rangeK;
        const fillHeight = Math.max(0, tempPercent * CONFIG.indicator.maxHeight);
        
        // Grow upwards from bottom: Y = BottomAnchor - Height
        els.indicator.setAttribute('height', fillHeight);
        els.indicator.setAttribute('y', CONFIG.indicator.bottomAnchor - fillHeight);
    }

    // --- Interaction: Dragging ---
    let isDragging = false;

    // Helper: translate mouse screen coordinates to SVG coordinates
    function getSVGMouseY(evt) {
        const svg = els.sliderGroup.closest('svg');
        const pt = svg.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        const globalPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
        return globalPoint.y;
    }

    els.sliderControl.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault(); // Prevent text selection
        resetPresetsVisuals(); // Dragging clears preset selection
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        // Calculate new Y based on mouse position
        // We offset by ~40px so the mouse grabs the center of the handle
        const mouseSvgY = getSVGMouseY(e); 
        updateSystem(mouseSvgY - 40); 
    });

    window.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // --- Interaction: Presets ---
    
    function resetPresetsVisuals() {
        PRESETS.forEach(p => {
            document.getElementById(p.id).style.display = 'block'; // Show Normal
            document.getElementById(p.id + '-selected').style.display = 'none'; // Hide Selected
        });
    }

    PRESETS.forEach(preset => {
        const btnNormal = document.getElementById(preset.id);
        const btnSelected = document.getElementById(preset.id + '-selected');

        // Initial setup: Ensure selected state is hidden
        if(btnSelected) btnSelected.style.display = 'none';

        // Click Handler
        if(btnNormal) {
            btnNormal.addEventListener('click', () => {
                // 1. Reset all buttons
                resetPresetsVisuals();
                
                // 2. Highlight this button
                btnNormal.style.display = 'none';
                btnSelected.style.display = 'block';

                // 3. Move Slider to specific temperature
                const targetY = kelvinToY(preset.kelvin);
                updateSystem(targetY);
            });
        }
    });

    // --- Startup ---
    // Initialize at Room Temperature
    const startY = kelvinToY(293.15);
    updateSystem(startY);
    
    // Set initial visual state for Room Temp button
    const roomBtn = document.getElementById('room-temperature');
    const roomBtnSel = document.getElementById('room-temperature-selected');
    if(roomBtn && roomBtnSel) {
        roomBtn.style.display = 'none';
        roomBtnSel.style.display = 'block';
    }
});