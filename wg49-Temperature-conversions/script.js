/**
 * Temperature Widget Logic - Final Version
 * Features: Drag, Presets, Reset Button, Starts at 0°C
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. Configuration & Constraints ---
    const CONFIG = {
        constraints: {
            minY: 205, // Top (Max Temp: 380K)
            maxY: 813, // Bottom (Min Temp: 220K)
            rangeY: 608 // 813 - 205
        },
        temperature: {
            maxK: 380,
            minK: 220,
            rangeK: 160
        },
        indicator: {
            bottomAnchor: 870, // Fixed bottom Y
            maxHeight: 608     // Max fill height
        },
        referenceZeroCelsiusY: 615 // The Y position for 0°C
    };

    // --- 2. Presets Data ---
    // Note: 0°C is exactly "water-freezing" (273.15 K)
    const PRESETS = [
        { id: 'water-freezing', kelvin: 273.15 },
        { id: 'water-boiling', kelvin: 373.15 },
        { id: 'room-temperature', kelvin: 293.15 },
        { id: 'avg-body-temperature', kelvin: 310.15 }
    ];

    // --- 3. DOM Elements Selection ---
    const els = {
        sliderGroup: document.getElementById('slider-group'),
        sliderControl: document.getElementById('slider-control'),
        resetBtn: document.getElementById('reset-button'), // Your new button
        indicator: document.getElementById('temp-level-indicator'),

        // Movable wrappers (ForeignObjects)
        sliderPanel: document.getElementById('slider-panel'),
        smallKWrapper: document.getElementById('kelvin-temp') ? document.getElementById('kelvin-temp').closest('foreignObject') : null,
        smallCWrapper: document.getElementById('celsius-temp') ? document.getElementById('celsius-temp').closest('foreignObject') : null,
        smallFWrapper: document.getElementById('fahrenheit-temp') ? document.getElementById('fahrenheit-temp').closest('foreignObject') : null,

        // Text Targets
        text: {
            smallK: document.getElementById('kelvin-temp'),
            smallC: document.getElementById('celsius-temp'),
            smallF: document.getElementById('fahrenheit-temp'),
            largeK: document.getElementById('kelvin-info-text'),
            largeC: document.getElementById('celsius-info-text'),
            largeF: document.getElementById('fahrenheit-info-text')
        }
    };

    // --- 4. Initialization Logic ---
    // Capture base offsets relative to 0°C (Y=615) to ensure proportional movement 
    const movables = [
        els.sliderControl,
        els.sliderPanel,
        els.smallKWrapper,
        els.smallCWrapper,
        els.smallFWrapper
    ].filter(el => el !== null).map(el => ({
        element: el,
        baseOffset: parseFloat(el.getAttribute('y')) - CONFIG.referenceZeroCelsiusY
    }));

    // --- 5. Helper Functions ---

    // Map Y Position -> Kelvin 
    function yToKelvin(y) {
        const percentFromTop = (y - CONFIG.constraints.minY) / CONFIG.constraints.rangeY;
        return CONFIG.temperature.maxK - (percentFromTop * CONFIG.temperature.rangeK);
    }

    // Map Kelvin -> Y Position (for Presets/Reset)
    function kelvinToY(k) {
        const percentOfRange = (CONFIG.temperature.maxK - k) / CONFIG.temperature.rangeK;
        return CONFIG.constraints.minY + (percentOfRange * CONFIG.constraints.rangeY);
    }

    // Manage Preset Buttons Visibility
    function setPresetVisualState(activeId) {
        PRESETS.forEach(p => {
            const normal = document.getElementById(p.id);
            const selected = document.getElementById(p.id + '-selected');
            
            if (normal && selected) {
                if (p.id === activeId) {
                    normal.style.display = 'none';
                    selected.style.display = 'block';
                } else {
                    normal.style.display = 'block';
                    selected.style.display = 'none';
                }
            }
        });
    }

    // --- 6. Core Update System (Single Source of Truth) ---
    function updateSystem(newY) {
        // A. Clamp Y (Constraints) 
        const clampedY = Math.max(CONFIG.constraints.minY, Math.min(CONFIG.constraints.maxY, newY));

        // B. Calculate Temperatures 
        const k = yToKelvin(clampedY);
        const c = k - 273.15;
        const f = (c * 9/5) + 32;

        // C. Update Text 
        const kStr = `${Math.round(k)} K`;
        const cStr = `${Math.round(c)} °C`;
        const fStr = `${Math.round(f)}° F`;

        // Update Small Text
        if(els.text.smallK) els.text.smallK.textContent = kStr;
        if(els.text.smallC) els.text.smallC.textContent = cStr;
        if(els.text.smallF) els.text.smallF.textContent = fStr;
        
        // Update Large Text
        if(els.text.largeK) els.text.largeK.textContent = kStr;
        if(els.text.largeC) els.text.largeC.textContent = cStr;
        if(els.text.largeF) els.text.largeF.textContent = fStr;

        // D. Move Slider Elements 
        movables.forEach(item => {
            item.element.setAttribute('y', clampedY + item.baseOffset);
        });
        const tempPercent = (k - CONFIG.temperature.minK) / CONFIG.temperature.rangeK;
        const fillHeight = Math.max(0, tempPercent * CONFIG.indicator.maxHeight) + 37;
        
        els.indicator.setAttribute('height', fillHeight);
        els.indicator.setAttribute('y', CONFIG.indicator.bottomAnchor - fillHeight);
    }

    // --- 7. Reset / 0°C Logic ---
    function setZeroCelsius() {
        const zeroCelsiusY = kelvinToY(273.15); // Calculate Y for 0°C
        updateSystem(zeroCelsiusY);
        setPresetVisualState('water-freezing'); // 0°C matches water freezing preset
    }

    // --- 8. Event Listeners ---

    // A. Dragging
    let isDragging = false;

    function getSVGMouseY(evt) {
        const svg = els.sliderGroup.closest('svg');
        const pt = svg.createSVGPoint();
        pt.x = evt.clientX;
        pt.y = evt.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse()).y;
    }

    if(els.sliderControl) {
        els.sliderControl.addEventListener('mousedown', (e) => {
            isDragging = true;
            e.preventDefault();
            setPresetVisualState(null); // Deselect presets when dragging
        });

        window.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const mouseSvgY = getSVGMouseY(e);
            updateSystem(mouseSvgY - 40); // Offset to center on handle
        });

        window.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // B. Presets Clicking
    PRESETS.forEach(preset => {
        const btnNormal = document.getElementById(preset.id);
        if (btnNormal) {
            btnNormal.addEventListener('click', () => {
                const targetY = kelvinToY(preset.kelvin);
                updateSystem(targetY);
                setPresetVisualState(preset.id);
            });
        }
    });

    // C. Reset Button Listener
    if (els.resetBtn) {
        els.resetBtn.addEventListener('click', () => {
            setZeroCelsius(); // Go to 0°C
        });
    }

    // --- 9. Start Application ---
    // Requirement: Start at 0 Degree C
    setZeroCelsius(); 
});