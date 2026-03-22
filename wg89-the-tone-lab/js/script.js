document.addEventListener("DOMContentLoaded", () => {
    // Toggles
    const sentenceOn = document.getElementById('Group 636');
    const sentenceOff = document.getElementById('Group 617');
    const wordOn = document.getElementById('Group 617_2');
    const wordOff = document.getElementById('Group 637');
    const punctOn = document.getElementById('Group 617_3');
    const punctOff = document.getElementById('Group 635');

    // Dropdown elements
    const dropdownTrigger = document.getElementById('dropdownTrigger');
    const dropdownList = document.getElementById('dropdownList');
    const selectedToneLabel = document.getElementById('selectedToneLabel');
    const dropdownArrow = document.getElementById('dropdownArrow');
    const listItems = document.querySelectorAll('.tone-list li');

    // Toggle Groups (Background + Text)
    const sentenceGroup = document.getElementById('Group 253');
    const wordGroup = document.getElementById('Group 647');
    const punctGroup = document.getElementById('Group 648');

    const middleTitle = document.getElementById('middleTitle');
    const middlePassage = document.getElementById('middlePassage');
    const annotationContent = document.getElementById('annotationContent');

    const btnReset = document.getElementById('Group 277');
    const btnInsights = document.getElementById('Group 591'); // Corrected ID

    let currentTone = null;

    const toneData = {
        "Melancholic": {
            text: "The old man shuffled into the room, his footsteps heavy with years of solitude. His gaze lingered on the empty chair\u2014her chair\u2014where silence now lived like an unwelcome guest. With a sigh that seemed to carry the weight of all their shared evenings, he lowered himself to the table and, hands trembling ever so slightly, opened the letter.",
            highlights: {
                word: ["shuffled", "heavy", "solitude", "lingered", "sigh", "trembling", "silence now lived like an unwelcome guest"],
                sentence: ["The old man shuffled into the room, his footsteps heavy with years of solitude.", "With a sigh that seemed to carry the weight of all their shared evenings, he lowered himself to the table and, hands trembling ever so slightly, opened the letter."],
                punct: ["—"]
            },
            annotations: {
                word: "Words suggesting weariness, loss, and emotional burden. Personification (\"silence now lived like an unwelcome guest\").",
                sentence: "Long, flowing sentences slow pace and demonstrate grief.",
                punct: "Em dashes - for reflective pauses. Commas - create a gentle, unhurried rhythm."
            }
        },
        "Humorous": {
            text: "The old man tottered into the room, knees creaking louder than the floorboards. He squinted at the empty chair... ah yes, still empty, no surprise there... and shuffled over to the table with all the grace of a penguin on roller skates. He plopped down, fumbled with his glasses, and attacked the envelope like it owed him money.",
            highlights: {
                word: ["tottered", "creaking", "squinted", "plopped", "fumbled", "attacked", "grace of a penguin on roller skates", "attacked the envelope like it owed him money"],
                sentence: ["The old man tottered into the room, knees creaking louder than the floorboards.", "He plopped down, fumbled with his glasses, and attacked the envelope like it owed him money."],
                punct: ["..."]
            },
            annotations: {
                word: "Playful, exaggerated verbs for comic effect. Simile (\"grace of a penguin on roller skates\"); Hyperbole (\"attacked the envelope like it owed him money\")",
                sentence: "Mix of longer descriptive sentences with abrupt, punchy actions to emphasise humour.",
                punct: "Ellipsis for comic timing."
            }
        },
        "Suspenseful": {
            text: "The old man stepped into the room. Stopped. His eyes darted to the chair—empty, as it had been for months now. Or had it? He approached the table slowly, pulse quickening. The letter waited. What secrets lay folded inside? He tore it open.",
            highlights: {
                word: ["darted", "pulse quickening", "tore", "secrets"],
                sentence: ["Stopped.", "Or had it?", "The letter waited."],
                punct: ["—", "?"]
            },
            annotations: {
                word: "Active, tense verbs suggesting urgency and unease.",
                sentence: "Fragmented, one-word sentences create tension and uncertainty.",
                punct: "Em dash — for dramatic interruption.<br/>Question marks — to heighten mystery."
            }
        },
        "Nostalgic": {
            text: "The old man wandered into the room, where afternoon light still pooled golden on the floorboards, just as it always had. There sat her chair, unchanged, patient, still holding the shape of all those quiet afternoons they'd spent together. Smiling faintly at a memory only he could see, he eased into his seat, unfolded the letter, and began to read.",
            highlights: {
                word: ["wandered", "golden", "patient", "chair", "smiling faintly", "eased"],
                sentence: ["into the room", "where afternoon light still pooled golden on the floorboards, just as it always had.", "unchanged, patient, still holding the shape of all those quiet afternoons they'd spent together."],
                punct: [","]
            },
            annotations: {
                word: "Warm, gentle words evoking comfort and memory. Imagery (\"Afternoon light pooled golden\"); Symbolism (\"Chair\")",
                sentence: "Long, meandering sentences with embedded clauses to mimick the drift of memory; unhurried pacing.",
                punct: "Commas — create a soft, rolling rhythm; no harsh stops."
            }
        },
        "Detached": {
            text: "The man, aged approximately seventy-five, entered the room at 4:32 PM. He observed the vacant chair opposite the window. He proceeded to the table, seated himself, and retrieved the envelope. He opened it.",
            highlights: {
                word: ["approximately", "entered", "observed", "proceeded", "retrieved"],
                sentence: ["aged approximately seventy-five, entered the room at 4:32 PM.", "vacant chair opposite the window", "to the table, seated himself"],
                punct: ["."]
            },
            annotations: {
                word: "Formal, impersonal, precise vocabulary; no emotional descriptors.",
                sentence: "Short, declarative sentences to convey flat tone.",
                punct: "Periods only; no expressive punctuation - factual and flat."
            }
        },
        "Bitter": {
            text: "The old man dragged himself into the room—that miserable, too-quiet room. The chair sat there, empty, mocking him with its emptiness, as if she'd simply chosen to leave. He dropped into his seat. The letter. Of course! Another piece of paper pretending to matter. He ripped it open.",
            highlights: {
                word: ["dragged", "miserable", "mocking", "dropped", "ripped", "Another piece of paper pretending to matter"],
                sentence: ["himself into the room", "The chair sat there, empty,", "The letter. Of course", "He ripped it open"],
                punct: ["—", "!", "."]
            },
            annotations: {
                word: "Harsh, aggressive words conveying resentment and frustration. Personification (\"chair sat there... mocking him\"); Sarcasm (\"Another piece of paper pretending to matter\")",
                sentence: "Mix of short, punchy sentences and fragments expressing irritation. Incomplete sentences suggest dismissiveness.",
                punct: "Em dashes for bitter interjections. Periods used for abrupt, angry stops showing animosity. Exclamation mark to convey bitterness."
            }
        },
        "Hopeful": {
            text: "The old man made his way into the room, sunlight streaming through the window to warm the wooden floor. His eyes found the empty chair—still waiting, as if she might return any moment. He settled into his seat at the table, heart lifting ever so slightly, and opened the letter. Perhaps today, it would bring good news.",
            highlights: {
                word: ["sunlight", "warm", "waiting", "settled", "chair—still waiting", "streaming", "Perhaps today"],
                sentence: ["The old man made his way into the room", "His eyes found the empty", "as if she might return any moment", "settled into his seat at the table", "heart lifting ever so slightly, and opened the letter"],
                punct: [","]
            },
            annotations: {
                word: "Gentle, optimistic words suggesting comfort and anticipation. Personification (\"chair—still waiting\"); Imagery (\"sunlight streaming\"); Rhetorical suggestion (\"Perhaps today\")",
                sentence: "Balanced sentences with a steady, calm rhythm; forward-looking phrasing.",
                punct: "Commas for smooth, flowing pauses."
            }
        },
        "Ominous": {
            text: "The old man crept into the room, shadows pooling in the corners like spilled ink. His eyes were drawn to the empty chair: too empty, unnaturally still. Something felt wrong. He lowered himself to the table, fingers cold, and reached for the letter. It seemed to pulse in his hands, waiting to unleash its secrets.",
            highlights: {
                word: ["crept", "shadows", "spilled ink", "unnaturally", "cold", "pulse"],
                sentence: ["pooling in the corners like", "His eyes were drawn to the empty chair: too empty", "Something felt wrong.", "It seemed to ", "his hands, waiting to unleash its secrets"],
                punct: [":", ","]
            },
            annotations: {
                word: "Dark, foreboding words creating unease.",
                sentence: "Short declarative sentences - to disrupt flow and heighten tension.",
                punct: "Colon for dramatic revelation. Commas for suspenseful pauses."
            }
        }
    };

    // Toggles state
    let toggles = {
        sentence: false,
        word: false,
        punct: false
    };

    // Initially hide all OFF states (already handled in setupToggle but just in case)
    if (sentenceOff) sentenceOff.style.display = 'none';
    if (wordOff) wordOff.style.display = 'none';
    if (punctOff) punctOff.style.display = 'none';

    function setupToggle(onEl, offEl, key) {
        if (!onEl || !offEl) return;
        onEl.style.cursor = 'pointer';
        offEl.style.cursor = 'pointer';

        // Start with OFF (ON hidden)
        onEl.style.display = 'none';
        offEl.style.display = 'block';

        onEl.addEventListener('click', () => {
            onEl.style.display = 'none';
            offEl.style.display = 'block';
            toggles[key] = false;
            updateStyling();
        });

        offEl.addEventListener('click', () => {
            offEl.style.display = 'none';
            onEl.style.display = 'block';
            toggles[key] = true;
            updateStyling();
        });
    }

    setupToggle(sentenceOn, sentenceOff, 'sentence');
    setupToggle(wordOn, wordOff, 'word');
    setupToggle(punctOn, punctOff, 'punct');

    // Dropdown Interactivity
    if (dropdownTrigger && dropdownList) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdownList.style.display === 'block';
            dropdownList.style.display = isOpen ? 'none' : 'block';
        });

        listItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const tone = item.getAttribute('data-value');
                currentTone = tone;

                if (selectedToneLabel) selectedToneLabel.textContent = tone;
                listItems.forEach(li => li.classList.remove('selected'));
                item.classList.add('selected');

                dropdownList.style.display = 'none';

                // Reset toggles when choosing a new tone
                toggles = { sentence: false, word: false, punct: false };
                if (sentenceOn) sentenceOn.style.display = 'none';
                if (sentenceOff) sentenceOff.style.display = 'block';
                if (wordOn) wordOn.style.display = 'none';
                if (wordOff) wordOff.style.display = 'block';
                if (punctOn) punctOn.style.display = 'none';
                if (punctOff) punctOff.style.display = 'block';

                if (btnReset) btnReset.style.opacity = "1";

                // Make toggles solid when tone is selected
                if (sentenceGroup) sentenceGroup.style.opacity = "1";
                if (wordGroup) wordGroup.style.opacity = "1";
                if (punctGroup) punctGroup.style.opacity = "1";

                updateStyling();
            });
        });

        document.addEventListener('click', () => {
            if (dropdownList) dropdownList.style.display = 'none';
        });
    }

    function updateStyling() {
        if (!currentTone || !toneData[currentTone]) {
            middleTitle.textContent = "Select a tone";
            middlePassage.innerHTML = "";
            annotationContent.innerHTML = "";
            return;
        }

        const data = toneData[currentTone];
        middleTitle.textContent = currentTone;
        const text = data.text;
        let annos = "";

        const sentenceRanges = [];
        const inlineRanges = []; // word + punct (rendered nested inside sentence spans)

        function collectRanges(terms, cssClass, bucket) {
            terms.forEach(term => {
                let idx = 0;
                while (true) {
                    const pos = text.indexOf(term, idx);
                    if (pos === -1) break;
                    bucket.push({ start: pos, end: pos + term.length, cssClass });
                    idx = pos + 1;
                }
            });
        }

        if (toggles.word) {
            collectRanges(data.highlights.word, 'hl-word', inlineRanges);
            annos += `<div class="anno-item"><span class="anno-label word">Word Choice:</span> ${data.annotations.word}</div>`;
        }
        if (toggles.sentence) {
            collectRanges(data.highlights.sentence, 'hl-sentence', sentenceRanges);
            annos += `<div class="anno-item"><span class="anno-label sentence">Sentence Structure:</span> ${data.annotations.sentence}</div>`;
        }
        if (toggles.punct) {
            collectRanges(data.highlights.punct, 'hl-punct', inlineRanges);
            annos += `<div class="anno-item"><span class="anno-label punct">Punctuation:</span> ${data.annotations.punct}</div>`;
        }

        // Sort both buckets by start position
        sentenceRanges.sort((a, b) => a.start - b.start);
        inlineRanges.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

        // Render a text segment [segStart, segEnd) with inline (word/punct) highlights nested inside
        function renderSegment(segStart, segEnd, outerClass) {
            let out = outerClass ? `<span class="${outerClass}">` : '';
            let cur = segStart;
            for (const r of inlineRanges) {
                if (r.start >= segEnd) break;
                if (r.end <= segStart) continue;
                const rStart = Math.max(r.start, segStart);
                const rEnd = Math.min(r.end, segEnd);
                if (rStart > cur) out += escapeHtml(text.slice(cur, rStart));
                out += `<span class="${r.cssClass}">${escapeHtml(text.slice(rStart, rEnd))}</span>`;
                cur = rEnd;
            }
            if (cur < segEnd) out += escapeHtml(text.slice(cur, segEnd));
            if (outerClass) out += '</span>';
            return out;
        }

        // Build final HTML: walk through sentence ranges as outer wrappers,
        // rendering non-sentence gaps with inline highlights too
        let html = '';
        let cursor = 0;
        for (const sr of sentenceRanges) {
            if (sr.start > cursor) {
                // Gap before this sentence: render with inline highlights only
                html += renderSegment(cursor, sr.start, null);
            }
            // Sentence region: outer green span with inline highlights nested inside
            html += renderSegment(sr.start, sr.end, 'hl-sentence');
            cursor = sr.end;
        }
        if (cursor < text.length) {
            html += renderSegment(cursor, text.length, null);
        }

        middlePassage.innerHTML = html;
        annotationContent.innerHTML = annos;
    }

    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    // Insights Popup
    const insightsPopupGroup = document.getElementById('insightsPopupGroup');
    if (btnInsights && insightsPopupGroup) {
        btnInsights.style.cursor = 'pointer';
        btnInsights.addEventListener('click', (e) => {
            e.stopPropagation();
            insightsPopupGroup.style.display = insightsPopupGroup.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (insightsPopupGroup.style.display === 'block') {
                insightsPopupGroup.style.display = 'none';
            }
        });
    }

    // Reset Button (Clear Filters Only)
    if (btnReset) {
        btnReset.style.cursor = 'pointer';
        btnReset.addEventListener('click', () => {
            if (!currentTone) return;

            // Clear toggles
            toggles = { sentence: false, word: false, punct: false };

            // Reset toggle UI to OFF
            [sentenceOn, wordOn, punctOn].forEach(on => on.style.display = 'none');
            [sentenceOff, wordOff, punctOff].forEach(off => off.style.display = 'block');

            // Keep buttons and toggles active (opaque) since tone is still selected
            if (btnReset) btnReset.style.opacity = "1";

            if (sentenceGroup) sentenceGroup.style.opacity = "1";
            if (wordGroup) wordGroup.style.opacity = "1";
            if (punctGroup) punctGroup.style.opacity = "1";

            updateStyling();
        });
    }

    // Next button functionality removed (per user request)
});
