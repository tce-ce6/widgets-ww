/**
 * Temperature Widget Logic — FINAL FIXED VERSION
 * ✔ Correct slider mapping
 * ✔ Reaches exact min/max
 * ✔ No rounding drift
 * ✔ Mouse + Touch supported
 */

document.addEventListener("DOMContentLoaded", () => {

    /* --------------------------------------------------
     * 1. CONFIGURATION (UNCHANGED COORDINATES)
     * -------------------------------------------------- */
    const CONFIG = {
        constraints: {
            minY: 205,   // Top → 380K
            maxY: 813,   // Bottom → 220K
            rangeY: 813 - 205
        },
        temperature: {
            minK: 220,
            maxK: 380,
            get rangeK() {
                return this.maxK - this.minK;
            }
        },
        indicator: {
            bottomAnchor: 870,
            maxHeight: 608
        },
        referenceZeroCelsiusY: 615
    };

    /* --------------------------------------------------
     * 2. PRESETS
     * -------------------------------------------------- */
    const PRESETS = [
        { id: 'water-freezing', kelvin: 273.15 },
        { id: 'water-boiling', kelvin: 373.15 },
        { id: 'room-temperature', kelvin: 300.15 },
        { id: 'avg-body-temperature', kelvin: 310.15 }
    ];

    /* --------------------------------------------------
     * 3. ELEMENTS
     * -------------------------------------------------- */
    const els = {
        sliderGroup: document.getElementById('slider-group'),
        sliderControl: document.getElementById('slider-control'),
        sliderPanel: document.getElementById('slider-panel'),
        resetBtn: document.getElementById('reset-button'),
        indicator: document.getElementById('temp-level-indicator'),

        smallKWrapper: document.getElementById('kelvin-temp')?.closest('foreignObject'),
        smallCWrapper: document.getElementById('celsius-temp')?.closest('foreignObject'),
        smallFWrapper: document.getElementById('fahrenheit-temp')?.closest('foreignObject'),

        text: {
            smallK: document.getElementById('kelvin-temp'),
            smallC: document.getElementById('celsius-temp'),
            smallF: document.getElementById('fahrenheit-temp'),
            largeK: document.getElementById('kelvin-info-text'),
            largeC: document.getElementById('celsius-info-text'),
            largeF: document.getElementById('fahrenheit-info-text')
        }
    };

    /* --------------------------------------------------
     * 4. MOVABLE ELEMENT BASE OFFSETS
     * -------------------------------------------------- */
    const movables = [
        els.sliderControl,
        els.sliderPanel,
        els.smallKWrapper,
        els.smallCWrapper,
        els.smallFWrapper
    ].filter(Boolean).map(el => ({
        element: el,
        baseOffset: parseFloat(el.getAttribute('y')) - CONFIG.referenceZeroCelsiusY
    }));

    /* --------------------------------------------------
     * 5. MAPPING FUNCTIONS
     * -------------------------------------------------- */
    function yToKelvin(y) {
        const ratio = (y - CONFIG.constraints.minY) / CONFIG.constraints.rangeY;
        return CONFIG.temperature.maxK - ratio * CONFIG.temperature.rangeK;
    }

    function kelvinToY(k) {
        const ratio = (CONFIG.temperature.maxK - k) / CONFIG.temperature.rangeK;
        return CONFIG.constraints.minY + ratio * CONFIG.constraints.rangeY;
    }

    /* --------------------------------------------------
     * 6. PRESET VISUAL STATE
     * -------------------------------------------------- */
    function setPresetVisualState(activeId) {
        PRESETS.forEach(p => {
            const normal = document.getElementById(p.id);
            const selected = document.getElementById(p.id + '-selected');
            if (!normal || !selected) return;

            normal.style.display = p.id === activeId ? 'none' : 'block';
            selected.style.display = p.id === activeId ? 'block' : 'none';
        });
    }

    /* --------------------------------------------------
     * 7. CORE UPDATE SYSTEM
     * -------------------------------------------------- */
    function updateSystem(rawY) {

        // Clamp first
        const y = Math.max(
            CONFIG.constraints.minY,
            Math.min(CONFIG.constraints.maxY, rawY)
        );

        let k = yToKelvin(y);

        // Snap only at extremes
        if (y === CONFIG.constraints.minY) k = CONFIG.temperature.maxK;
        if (y === CONFIG.constraints.maxY) k = CONFIG.temperature.minK;

        const c = k - 273.15;
        const f = c * 9 / 5 + 32;

        const kStr = `${Math.round(k * 10) / 10} K`;
        const cStr = `${c.toFixed(1)} °C`;
        const fStr = `${Math.round(f * 10) / 10} °F`;

        if (els.text.smallK) els.text.smallK.textContent = kStr;
        if (els.text.largeK) els.text.largeK.textContent = kStr;
        if (els.text.smallC) els.text.smallC.textContent = cStr;
        if (els.text.largeC) els.text.largeC.textContent = cStr;
        if (els.text.smallF) els.text.smallF.textContent = fStr;
        if (els.text.largeF) els.text.largeF.textContent = fStr;

        movables.forEach(m =>
            m.element.setAttribute('y', y + m.baseOffset)
        );

        const percent = (k - CONFIG.temperature.minK) / CONFIG.temperature.rangeK;
        const height = Math.max(0, percent * CONFIG.indicator.maxHeight) + 37;

        els.indicator.setAttribute('height', height);
        els.indicator.setAttribute('y', CONFIG.indicator.bottomAnchor - height);
    }

    /* --------------------------------------------------
     * 8. RESET (0°C)
     * -------------------------------------------------- */
    function setZeroCelsius() {
        updateSystem(kelvinToY(273.15));
        setPresetVisualState('water-freezing');
    }

    /* --------------------------------------------------
     * 9. DRAGGING (MOUSE + TOUCH)
     * -------------------------------------------------- */
    let isDragging = false;
    const HANDLE_OFFSET = 40;

    function getSVGClientY(evt) {
        const svg = els.sliderGroup.closest('svg');
        const pt = svg.createSVGPoint();
        const src = evt.touches?.[0] || evt.changedTouches?.[0] || evt;
        pt.x = src.clientX;
        pt.y = src.clientY;
        return pt.matrixTransform(svg.getScreenCTM().inverse()).y;
    }

    function startDrag(e) {
        isDragging = true;
        e.cancelable && e.preventDefault();
        setPresetVisualState(null);
    }

    function moveDrag(e) {
        if (!isDragging) return;
        e.cancelable && e.preventDefault();
        updateSystem(getSVGClientY(e) - HANDLE_OFFSET);
    }

    function endDrag() {
        isDragging = false;
    }

    // Mouse
    els.sliderControl?.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', moveDrag);
    window.addEventListener('mouseup', endDrag);

    // Touch
    els.sliderControl?.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchmove', moveDrag, { passive: false });
    window.addEventListener('touchend', endDrag);
    window.addEventListener('touchcancel', endDrag);

    /* --------------------------------------------------
     * 10. PRESETS
     * -------------------------------------------------- */
    PRESETS.forEach(p => {
        document.getElementById(p.id)?.addEventListener('click', () => {
            updateSystem(kelvinToY(p.kelvin));
            setPresetVisualState(p.id);
        });
    });

    /* --------------------------------------------------
     * 11. RESET BUTTON
     * -------------------------------------------------- */
    els.resetBtn?.addEventListener('click', setZeroCelsius);

    /* --------------------------------------------------
     * 12. START STATE
     * -------------------------------------------------- */
    setZeroCelsius();
});
