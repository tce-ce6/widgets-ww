window.debugNavigate = async function() {
    console.log("%c==============================", "color: green; font-weight: bold;");
    console.log("%c[DEBUG] Starting Auto Navigation Method", "color: green; font-weight: bold;");
    console.log("%c==============================", "color: green; font-weight: bold;");
    
    function simulateClick(el, label) {
        if (!el) {
            console.warn(\`[DEBUG] Target \${label} missing.\`);
            return false;
        }
        console.log(\`%c[DEBUG] ➔ Clicking \${label}\`, 'color: cyan');
        el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        return true;
    }

    if (AppState.currentQuestionIndex >= AppState.data.questions.length) {
        console.log("[DEBUG] Game already finished -> Clicking Replay");
        const btnReplay = document.getElementById('btn-replay');
        if (btnReplay && btnReplay.style.display !== 'none') {
            simulateClick(btnReplay, "Replay Button");
        } else {
            console.log("[DEBUG] Cannot find replay button, aborting.");
            return;
        }
        await new Promise(r => setTimeout(r, 600));
    }

    while (AppState.currentQuestionIndex < AppState.data.questions.length) {
        let qIndex = AppState.currentQuestionIndex;
        let qs = AppState.data.questions[qIndex];
        let countryId = qs.country.toLowerCase().replace(/\s/g, '-');
        
        console.log(\`%c[DEBUG] --- Scenario \${qIndex + 1}/\${AppState.data.questions.length} | Target: \${qs.country} ---\`, "color: #ff9900; font-weight: bold;");
        
        // 1. Click Flag Box
        let box = document.getElementById(countryId);
        if (!simulateClick(box, \`Flag Box (\${countryId})\`)) break;
        await new Promise(r => setTimeout(r, 200));
        
        // 2. Click Quiz
        let btnQuiz = document.getElementById('btn-quiz');
        if (!simulateClick(btnQuiz, 'btn-quiz')) break;
        await new Promise(r => setTimeout(r, 200));
        
        // 3. Option
        let optionFound = false;
        AppState.elements.options.forEach((li, i) => {
            if(!li) return;
            const labelSpan = li.querySelector('.label');
            let text = labelSpan ? [...li.childNodes].filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim() : li.textContent.trim();
            if(!text) text = li.textContent.replace(labelSpan?.textContent || '', '').trim();
            
            if (text === qs.correctAnswer) {
                simulateClick(li, \`Option (\${text})\`);
                optionFound = true;
            }
        });
        if (!optionFound) {
            console.warn("[DEBUG] Could not find correct option!");
            break; 
        }
        await new Promise(r => setTimeout(r, 600));
        
        // 4. Click Map
        let mapCountry = document.getElementById(countryId + '-map');
        if (!simulateClick(mapCountry, \`Map (\${countryId}-map)\`)) break;
        await new Promise(r => setTimeout(r, 600));
        
        // 5. Click Next 
        let btnNext = document.getElementById('btn-next');
        if (btnNext && btnNext.style.display !== 'none') {
            simulateClick(btnNext, 'btn-next');
        } else if (AppState.currentQuestionIndex >= AppState.data.questions.length - 1) {
            console.log("%c[DEBUG] Navigation Complete! Final Scenario Reached.", "color: green; font-weight: bold;");
            AppState.currentQuestionIndex++; // advance to trigger endgame manually if Next didn't do it
            // actually if Next didn't show up, we wait a bit
        } else {
            console.warn("[DEBUG] btn-next missing. Stuck?");
            break;
        }
        await new Promise(r => setTimeout(r, 200));
    }
    console.log("%c[DEBUG] Current State:", "color: yellow", { ...AppState });
};
