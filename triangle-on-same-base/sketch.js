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
            drawZero: false,        // ✅ do not show "0"
            distance: 1,
            label: { offset: [0, -15] }
        }
    });

    const yaxis = brd.create('axis', [[0, 0], [0, 1]], {
        withLabel: true,
        ticks: {
            drawLabels: true,
            drawZero: false,        // ✅ do not show "0"
            distance: 1,
            label: { offset: [-20, 0] }
        }
    });

    // --- Lines (parallel) ---
    const lineL = brd.create('line', [[-1, 7], [25, 7]], {
        strokeColor: '#3b82f6', strokeWidth: 2, name: 'l', withLabel: true
    });
    const lineM = brd.create('line', [[-1, 1], [25, 1]], {
        strokeColor: '#3b82f6', strokeWidth: 2, name: 'm', withLabel: true
    });

    // --- Base Points (Fixed) ---
    const B = brd.create('point', [3, 1], { name: 'B', fixed: true, size: 4, color: 'black' });
    const C = brd.create('point', [12, 1], { name: 'C', fixed: true, size: 4, color: 'black' });

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
        try { return p.Area().toFixed(2); } 
        catch (e) { return '—'; }
    }

    function getPerimeter(p) {
        try {
            let per = 0;
            for (let i = 0; i < 3; i++) per += p.borders[i].Value();
            return per.toFixed(2);
        } catch (e) { return '—'; }
    }

    // --- Text Labels ---
    brd.create('text', [12, 12.5, '<b>Area of Triangles Between Two Parallel Lines</b>'], {
        fontSize: 14,
        anchorX: 'middle'
    });

    const leftX = 5, rightX = 19;

    // Triangle ABC Info
    brd.create('text', [leftX, 11.5, 'Area of ▲ABC:'], { fontSize: 12, anchorX: 'middle' });
    brd.create('text', [leftX, 10.9, function() { 
        return getArea(polyABC) + ' sq. units'; 
    }], { fontSize: 12, color: '#9333ea', anchorX: 'middle' });

    brd.create('text', [leftX, 10.2, 'Perimeter of ▲ABC:'], { fontSize: 12, anchorX: 'middle' });
    brd.create('text', [leftX, 9.6, function() { 
        return getPerimeter(polyABC) + ' units'; 
    }], { fontSize: 12, color: '#9333ea', anchorX: 'middle' });

    // Triangle DBC Info
    brd.create('text', [rightX, 11.5, 'Area of ▲DBC:'], { fontSize: 12, anchorX: 'middle' });
    brd.create('text', [rightX, 10.9, function() { 
        return getArea(polyDBC) + ' sq. units'; 
    }], { fontSize: 12, color: '#10b981', anchorX: 'middle' });

    brd.create('text', [rightX, 10.2, 'Perimeter of ▲DBC:'], { fontSize: 12, anchorX: 'middle' });
    brd.create('text', [rightX, 9.6, function() { 
        return getPerimeter(polyDBC) + ' units'; 
    }], { fontSize: 12, color: '#10b981', anchorX: 'middle' });

    // // Observation
    // brd.create('text', [12, -0.5, function() {
    //     return '<b>Drag points A and D along line l to observe constant area and changing perimeter.</b>';
    // }], {
    //     fontSize: 12, color: '#4b5563', anchorX: 'middle'
    // });

    // --- Force full initialization ---
    brd.fullUpdate();  // ✅ Forces initial computation for function-based texts

    // --- Small trick to ensure visibility before user interaction ---
    setTimeout(function() { brd.fullUpdate(); }, 100); // ✅ Second update after layout completes
}
