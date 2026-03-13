const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

function logStructure(el, depth = 0) {
    if (depth > 2) return;
    const name = el.getAttribute('data-name') || el.id;
    if (name) console.log('  '.repeat(depth) + name);
    Array.from(el.children).forEach(c => logStructure(c, depth + 1));
}

const plates = document.getElementById('Plates_Cookies');
if (plates) {
    console.log("Plates & Cookies structure:");
    logStructure(plates);
} else {
    console.log("Plates_Cookies not found");
}

const otherGroups = Array.from(document.querySelectorAll('g[id*="Group_"]'));
// count them to see if there's a pattern
console.log("Total groups:", otherGroups.length);
