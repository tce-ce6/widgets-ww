let fs = require('fs');
let content = fs.readFileSync('js/script.js', 'utf8');

// 1. Add NativeOrder parsing
let initGameInsert = `
    WidgetState.NativeOrder = {};
    WidgetState.families.forEach(f => {
        WidgetState.NativeOrder[f] = [];
        const ansGroup = document.getElementById(f);
        if (ansGroup) {
            Array.from(ansGroup.children).forEach(child => {
                let y = 0;
                // find either native 'y' attributes or translates
                const childHtml = child.innerHTML;
                const matchTranslate = childHtml.match(/translate\\([^,]+[,\\s]+([-\\d\\.]+)/);
                const matchY = childHtml.match(/<rect[^>]*y="([\\d\\.]+)"/);
                if (matchTranslate) y = parseFloat(matchTranslate[1]);
                else if (matchY) y = parseFloat(matchY[1]);
                
                WidgetState.NativeOrder[f].push({ id: child.getAttribute('id'), y: y });
            });
            WidgetState.NativeOrder[f].sort((a,b) => a.y - b.y);
        }
    });
`;
content = content.replace("console.log('initGame: Setting up initial widget state');", "console.log('initGame: Setting up initial widget state');\n" + initGameInsert);

// 2. Fix translation placement
let oldTranslate = "ansPanel.style.transform = `translate(0px, ${(orderIndex - Object.keys(mapping).indexOf(idxStr)) * 150}px)`;";
let newTranslate = `
                let nativeSlot = WidgetState.NativeOrder[family].findIndex(item => item.id === panelId);
                if (nativeSlot === -1) nativeSlot = Object.keys(mapping).indexOf(idxStr);
                ansPanel.style.transform = \`translate(0px, \${(orderIndex - nativeSlot) * 153}px)\`;
`;
content = content.replace(oldTranslate, newTranslate);

// 3. Fix validOptions to include rect and path
content = content.replace("if (child.tagName === 'g') {", "if (child.tagName === 'g' || child.tagName === 'rect' || child.tagName === 'path') {");

// 4. Fix End Popup Background overlay size
let endPopupFix = `
    const endPopupBg = document.querySelector('#correct_end_popup rect');
    if (endPopupBg) {
        endPopupBg.setAttribute('x', '-5000');
        endPopupBg.setAttribute('y', '-5000');
        endPopupBg.setAttribute('width', '10000');
        endPopupBg.setAttribute('height', '10000');
    }
`;
content = content.replace("unhideElement('correct_end_popup');", "unhideElement('correct_end_popup');\n" + endPopupFix);

fs.writeFileSync('js/script.js', content);
