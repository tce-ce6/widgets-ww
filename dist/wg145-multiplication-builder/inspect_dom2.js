const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const html = fs.readFileSync('index.html', 'utf8');
const dom = new JSDOM(html);
const document = dom.window.document;

const allGroups = Array.from(document.querySelectorAll('g'));
let results = [];

// Find groups that have exactly 10 similar children (e.g. 10 plates, and inside them 10 cookies)
allGroups.forEach(g => {
    const children = Array.from(g.children).filter(c => c.tagName.toLowerCase() === 'g');
    if (children.length === 10) {
        results.push({ id: g.id || 'NO_ID', numChildren: children.length });

        // Check grandchildren
        let has10G = true;
        children.forEach(c => {
            const grand = Array.from(c.children).filter(cc => cc.tagName.toLowerCase() === 'g');
            // the wireframes states up to 10 items per group. Is it 10?
        });
    }
});

console.log("Groups with 10 <g> children:");
console.log(results);

// Another approach: find groups with specific colors?
// Let's print the IDs of the direct children of the "Layer 50" (which contains pictures based on previous inspection)
const layer50 = document.getElementById('Layer_50');
if (layer50) {
    console.log("Children of Layer_50:");
    Array.from(layer50.children).forEach(c => {
        console.log(" -", c.id || c.getAttribute('data-name') || c.tagName);
    });
}
