let contents = require('fs').readFileSync('js/script.js', 'utf8');

// 1. Add answer_panel_bg
contents = contents.replace("unhideElement('answer_panels');", "unhideElement('answer_panels');\n    unhideElement('answer_panel_bg');\n    hideElement('correct_end_popup');");

// 2. Play chirp
const chirpStr = `
function playChirp() {
    try {
        const audio = new window.Audio('assets/bird-chirping.mp3');
        audio.play().catch(() => {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueCurveAtTime([2000, 4000, 2000], ctx.currentTime, 0.2);
            gain.gain.setValueCurveAtTime([0.2, 0.01], ctx.currentTime, 0.2);
            osc.start(); osc.stop(ctx.currentTime + 0.2);
        });
    } catch(e) {}
}
`;
contents += chirpStr;

// 3. Ghostly image (opacity 0.3)
contents = contents.replace(/opt\.style\.opacity = '0'/g, "opt.style.opacity = '0.3'");
contents = contents.replace(/element\.style\.opacity = '0'/g, "element.style.opacity = '0.3'");
contents = contents.replace(/sibling\.style\.opacity = '0'/g, "sibling.style.opacity = '0.3'");

// 4. Confetti animation out of card
contents = contents.replace("function createConfetti() {", "function createConfetti(rect) {");
contents = contents.replace("Math.random() * 100 + 'vw'", "rect ? (rect.left + rect.width/2 + 'px') : Math.random() * 100 + 'vw'");
contents = contents.replace("top = '-10px'", "top = rect ? (rect.top + rect.height/2 + 'px') : '-10px'");
// pass rect in handleOptionClick
contents = contents.replace("createConfetti();", "createConfetti(element.getBoundingClientRect());");
contents = contents.replace("createConfetti();", "createConfetti(element.getBoundingClientRect());"); // inside setTimeout
// wait, we also have to call chirp
contents = contents.replace(/WidgetState.isAnimating = true;/g, "WidgetState.isAnimating = true;\n        playChirp();");

// 5. Exclamation mark
contents = contents.replace(/ts\.textContent === family\.toUpperCase\(\)/g, "// obsolete");
contents = contents.replace(/const currentText = ts\.textContent\.trim\(\)\.toUpperCase\(\);[^}]+}/, "ts.removeAttribute('x');\n            const textCheck = ts.textContent.trim().toUpperCase();\n            if (['SUN', 'SAND', 'SEA', 'RAIN', 'SNOW', 'FIRE'].includes(textCheck)) ts.textContent = family.toUpperCase();\n            if (textCheck === '!') { ts.removeAttribute('x'); ts.setAttribute('dx', '5'); }");
// Wait, the regex replace for exclamation mark needs precision.

require('fs').writeFileSync('js/tmp_script.js', contents);
