const text = `"I have served the Ashworth family for thirty-seven years," Mr. Peters said, his voice steady and measured. "On the evening of March 15th, I secured all windows and doors at precisely 9:47 PM, as is my custom. The heirloom—a gold pocket watch—was in its display case at that time. I observed nothing unusual during my rounds. The household retired at the standard hour. When I returned to the drawing room at 6:15 AM, the case was empty."`;
const hint = 'his voice steady and measured. I secured all windows and doors at precisely 9:47 PM, as is my custom. The heirloom—a gold pocket watch—was in its display case at that time. I observed nothing unusual during my rounds When I returned to the drawing room at 6:15 AM, the case was empty';

function wrapHighlights(text, hint) {
    if (!hint) return text;
    const parts = text.split(/(\b\w+\b)/);
    const hintWords = hint.match(/\b\w+\b/g) || [];
    
    let hIdx = 0;
    let res = "";
    let inHighlight = false;
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (/\b\w+\b/.test(part)) { 
            if (hIdx < hintWords.length && part.toLowerCase() === hintWords[hIdx].toLowerCase()) {
                if (!inHighlight) {
                    res += '<span class="highlight">';
                    inHighlight = true;
                }
                res += part;
                hIdx++;
            } else {
                if (inHighlight) {
                    res += '</span>';
                    inHighlight = false;
                }
                res += part;
            }
        } else {
            if (inHighlight) {
                res += part;
            } else {
                res += part;
            }
        }
    }
    if (inHighlight) {
        res += '</span>';
    }
    return res;
}

console.log(wrapHighlights(text, hint));
