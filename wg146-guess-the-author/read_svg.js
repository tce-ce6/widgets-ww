const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const idRegex = /id="([^"]+)"/g;
const ids = new Set();
let match;
while ((match = idRegex.exec(html)) !== null) {
    if (/plate|cookie|flower|vas|paint|palette|group|item/i.test(match[1])) {
        ids.add(match[1]);
    }
}
console.log(Array.from(ids).sort().join('\n'));
