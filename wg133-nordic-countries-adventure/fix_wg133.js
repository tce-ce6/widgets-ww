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
console.log('Fixed wg133!');
