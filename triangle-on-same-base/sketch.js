function initGeometryBoard() {
    // --- Initialize the board ---
    const brd = JXG.JSXGraph.initBoard('jxgbox', {
        boundingbox: [-1, 13, 25, -1],
        grid: true,
        showCopyright: false,
        showNavigation: false,
        renderer: 'canvas'
    });

    // --- Custom Axes (1-unit ticks, no '0' label) ---
    const xaxis = brd.create('axis', [[0, 0], [1, 0]], {
        withLabel: true,
        ticks: {
            drawLabels: true,
            drawZero: false,
            distance: 1,
            label: { offset: [0, -15] }
        }
    });

    const yaxis = brd.create('axis', [[0, 0], [0, 1]], {
        withLabel: true,
        ticks: {
            drawLabels: true,
            drawZero: false,
            distance: 1,
            label: { offset: [-20, 0] }
        }
    });

    const p1 = brd.create('point', [-1, 1], { visible: false, fixed: true });
    const p2 = brd.create('point', [25, 1], { visible: false, fixed: true });

    // --- Lines (parallel) ---
    const lineL = brd.create('line', [[-1, 7], [25, 7]], {
        strokeColor: '#3b82f6', strokeWidth: 2, name: 'l', withLabel: true
    });
    const lineM = brd.create('line', [p1, p2], {
        strokeColor: '#3b82f6', strokeWidth: 2, name: 'm', withLabel: true
    });

    const Y_CORD = 1;

    // --- Base Points (Fixed) ---
    // const B = brd.create('point', [3, () => Y_CORD], { name: 'B', fixed: false, size: 4, color: 'black' });
    // const C = brd.create('point', [12, () => Y_CORD], { name: 'C', fixed: false, size: 4, color: 'black' });

    const B = brd.create('glider', [3, 0, lineM], {
        name: 'B', size: 5, color: 'black', label: { offset: [-15, 10] }
    });

    const C = brd.create('glider', [12, 0, lineM], {
        name: 'C', size: 5, color: 'black', label: { offset: [-15, 10] }
    });

    // --- Movable Gliders ---
    const A = brd.create('glider', [6, 7, lineL], {
        name: 'A', size: 5, color: '#9333ea', label: { offset: [-15, 10] }
    });
    const D = brd.create('glider', [9, 7, lineL], {
        name: 'D', size: 5, color: '#10b981', label: { offset: [5, 10] }
    });

    // --- Triangles ---
    const polyABC = brd.create('polygon', [B, C, A], {
        fillColor: '#9333ea', fillOpacity: 0.25,
        borders: { strokeColor: '#9333ea', strokeWidth: 2 }
    });
    const polyDBC = brd.create('polygon', [B, C, D], {
        fillColor: '#10b981', fillOpacity: 0.25,
        borders: { strokeColor: '#10b981', strokeWidth: 2 }
    });

    // --- Utility functions ---
    function getArea(p) {
        try {
            return p.Area().toFixed(2);
        } catch (e) {
            return '—';
        }
    }

    function getPerimeter(p) {
        try {
            if (!p || !p.borders) return '—';
            let per = 0;
            for (let i = 0; i < p.borders.length; i++) {
                per += p.borders[i].L(); // ✅ Corrected: use .L() instead of .Value()
            }
            return per.toFixed(2);
        } catch (e) {
            return '—';
        }
    }

    // --- Text Labels ---
    // brd.create('text', [12, 12.5, '<b>Area of Triangles Between Two Parallel Lines</b>'], {
    //     fontSize: 14,
    //     anchorX: 'middle'
    // });

    const leftX = 5, rightX = 19;
    const boxY = 10.5; // Center Y position for the info box

    // Create the background 'div' using a text element with CSS class
    // NOTE: This requires CSS to be defined in your HTML (see explanation below)
    brd.create('text', [rightX, boxY,
        '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'
    ], {
        fontSize: 12,
        anchorX: 'middle',
        anchorY: 'middle',
        fixed: true,
        cssStyle: 'padding: 30px;',
        cssClass: 'infoBoxBackgroundDBC' // Custom class for the green background
    });

    // Triangle DBC Info - Text elements positioned over the background
    brd.create('text', [rightX, boxY + 1.0, 'Area of ▲DBC:'], { fontSize: 14, anchorX: 'middle', fixed: true });
    brd.create('text', [rightX, boxY + 0.4, function () {
        return getArea(polyDBC) + ' sq. units';
    }], { fontSize: 14, color: '#10b981', anchorX: 'middle', fixed: true });

    brd.create('text', [rightX, boxY - 0.3, 'Perimeter of ▲DBC:'], { fontSize: 14, anchorX: 'middle', fixed: true });
    brd.create('text', [rightX, boxY - 0.9, function () {
        return getPerimeter(polyDBC) + ' units';
    }], { fontSize: 14, color: '#10b981', anchorX: 'middle', fixed: true });


    // Create the background 'div' for ABC
    brd.create('text', [leftX, boxY,
        '&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;'
    ], {
        fontSize: 12,
        anchorX: 'middle',
        anchorY: 'middle',
        fixed: true,
        cssStyle: 'padding: 30px;',
        cssClass: 'infoBoxBackgroundABC' // Custom class for the purple background
    });

    // Triangle ABC Info - Text elements positioned over the background
    brd.create('text', [leftX, boxY + 1.0, 'Area of ▲ABC:'], { fontSize: 14, anchorX: 'middle', fixed: true });
    brd.create('text', [leftX, boxY + 0.4, function () {
        return getArea(polyABC) + ' sq. units';
    }], { fontSize: 14, color: '#9333ea', anchorX: 'middle', fixed: true });

    brd.create('text', [leftX, boxY - 0.3, 'Perimeter of ▲ABC:'], { fontSize: 14, anchorX: 'middle', fixed: true });
    brd.create('text', [leftX, boxY - 0.9, function () {
        return getPerimeter(polyABC) + ' units';
    }], { fontSize: 14, color: '#9333ea', anchorX: 'middle', fixed: true });

    // --- Force full initialization ---
    brd.fullUpdate();
    setTimeout(() => brd.fullUpdate(), 100);
}
