const fs = require('fs');

let script = fs.readFileSync('js/script.js', 'utf-8');

// Replace .country-box querySelectorAll with iteration over COUNTRY_IDS
script = script.replace(/document\.querySelectorAll\('\.country-box'\)\.forEach\(el => {[\s\S]*?}\);/g, 
`COUNTRY_IDS.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.classList.remove('selected', 'active', 'correct');
    });`);

script = script.replace(/document\.querySelectorAll\('\.country-box'\)\.forEach\(el => el\.classList\.remove\('selected', 'active', 'correct'\)\);/g, 
`COUNTRY_IDS.forEach(cId => {
        const el = document.getElementById(cId);
        if(el) el.classList.remove('selected', 'active', 'correct');
    });`);

fs.writeFileSync('js/script.js', script);

let html = fs.readFileSync('index.html', 'utf-8');
// Fix croatia-map duplicate
// the first croatia-map is around 4566. The second is around 4715.
// Let's replace the second one
let count = 0;
html = html.replace(/<g id="croatia-map">/g, (match) => {
    count++;
    if (count === 2) {
        return '<g id="croatia-map-dup">';
    }
    return match;
});

fs.writeFileSync('index.html', html);
console.log('Fixed wg155!');
