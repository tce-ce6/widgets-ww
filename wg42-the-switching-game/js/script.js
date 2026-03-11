document.addEventListener("DOMContentLoaded", () => {
    const introScreen = document.getElementById("intro-screen");
    const learnBtn = document.querySelector("#intro-screen button:nth-child(1)");
    const practiseBtn = document.querySelector(
        "#intro-screen button:nth-child(2)",
    );

    const homeBtn = document.getElementById("Home_button");
    const nextBtn = document.getElementById("Check_answer_reset_etc");
    const progressBar = document.getElementById("Progress_bar");
    const feedback = document.getElementById("Feedback_sticker");
    const correct = document.getElementById("Group_1182");
    const incorrect = document.getElementById("Group_1182-2");
    // Screens / Panels
    const IText = document.getElementById("I-text");
    const learnPanel1 = document.getElementById("Question_2_panel_1");
    const learnPanel2 = document.getElementById("Question_2_panel_2"); // Target boxes
    const learnPanel3 = document.getElementById("Question_2_panel_3"); // Options
    const practiseScreen = document.getElementById("Practise_screen");

    const question2Panel = document.getElementById("Question_2_panel");
    const comparePanel = document.getElementById("Compare_active_passive");
    const question3Panel = document.getElementById("Question_3_panel");

    const otherScreens = [
        comparePanel,
        question3Panel,
    ];

    // ---- Learn Questions Data ----
    // Each question: sentence1, sentence2Prefix, options (array), answer (ordered array — one entry per drop box)
    const learnQuestions = [
        {
            sentence1: "The chef prepared the delicious meal.",
            sentence2Prefix: "The delicious meal",
            options: ["delicious", "prepared", "the chef.", "is", "was", "cooking", "by", "prepare"],
            answer: ["was", "prepared", "by", "the chef."],
        },
        {
            sentence1: "The teacher explains the lesson clearly.",
            sentence2Prefix: "The lesson",
            options: ["explains", "was", "teacher", "is", "explained", "clearly.", "the", "by"],
            answer: ["is", "explained", "by", "the", "teacher", "clearly."],
        },
        {
            sentence1: "The students will perform the play tomorrow.",
            sentence2Prefix: "The play",
            options: ["was", "by", "tomorrow.", "the", "students", "performed", "will be", "tonight"],
            answer: ["will be", "performed", "by", "the", "students", "tomorrow."],
        },
        {
            sentence1: "The talented artist painted the mural.",
            sentence2Prefix: "The mural",
            options: ["by", "is", "painted", "artist.", "was", "talented", "the", "painting"],
            answer: ["was", "painted", "by", "the", "talented", "artist."],
        },
        {
            sentence1: "The doctor examines the patients daily.",
            sentence2Prefix: "The patients",
            options: ["were", "are", "the", "doctor", "examined", "examines", "daily.", "by"],
            answer: ["are", "examined", "by", "the", "doctor", "daily."],
        },
    ];

    const comparisonQuestions = [
        {
            activeHTML: `<span id="hl-act-sub">The chef</span> prepared <span id="hl-act-obj">the delicious meal</span>.`,
            passiveHTML: `<span id="hl-pas-obj">The delicious meal</span> was prepared <span id="hl-pas-by">by</span> <span id="hl-pas-sub">the chef</span>.`,
            options: [
                { text: "The words 'the delicious meal' (object) moved to the beginning of the sentence.", correct: true, type: "object" },
                { text: "The words 'the chef' (subject) moved to the end of the sentence.", correct: true, type: "subject" },
                { text: "The verb 'prepared' changed to 'was prepared'.", correct: true, type: "verb" },
                { text: "The word 'by' was added before 'the chef'.", correct: true, type: "by" },
                { text: "The word 'delicious' was shifted after the verb.", correct: false },
                { text: "The sentence changed from past tense to present tense.", correct: false }
            ]
        },
        {
            activeHTML: `<span id="hl-act-sub">The teacher</span> explains <span id="hl-act-obj">the lesson</span> clearly.`,
            passiveHTML: `<span id="hl-pas-obj">The lesson</span> is explained <span id="hl-pas-by">by</span> <span id="hl-pas-sub">the teacher</span> clearly.`,
            options: [
                { text: "The words 'the lesson' (object) moved to the beginning of the sentence.", correct: true, type: "object" },
                { text: "The words 'the teacher' (subject) moved to the end of the sentence.", correct: true, type: "subject" },
                { text: "The verb 'explains' changed to 'is explained'.", correct: true, type: "verb" },
                { text: "The word 'by' was added before 'the teacher'.", correct: true, type: "by" },
                { text: "The word 'clearly' moved to a different position.", correct: false },
                { text: "The sentence became a question.", correct: false }
            ]
        },
        {
            activeHTML: `<span id="hl-act-sub">The students</span> will perform <span id="hl-act-obj">the play</span> tomorrow.`,
            passiveHTML: `<span id="hl-pas-obj">The play</span> will be performed <span id="hl-pas-by">by</span> <span id="hl-pas-sub">the students</span> tomorrow.`,
            options: [
                { text: "The words 'the play' (object) moved to the beginning of the sentence.", correct: true, type: "object" },
                { text: "The words 'the students' (subject) moved to the end of the sentence.", correct: true, type: "subject" },
                { text: "The verb 'will perform' changed to 'will be performed'.", correct: true, type: "verb" },
                { text: "The word 'by' was added before 'the students'.", correct: true, type: "by" },
                { text: "The word 'by' was added before the object.", correct: false },
                { text: "The verb changed from future tense to past tense.", correct: false }
            ]
        },
        {
            activeHTML: `<span id="hl-act-sub">The talented artist</span> painted <span id="hl-act-obj">the mural</span>.`,
            passiveHTML: `<span id="hl-pas-obj">The mural</span> was painted <span id="hl-pas-by">by</span> <span id="hl-pas-sub">the talented artist</span>.`,
            options: [
                { text: "The words 'the mural' (object) moved to the beginning of the sentence.", correct: true, type: "object" },
                { text: "The words 'the talented artist' (subject) moved to the end of the sentence.", correct: true, type: "subject" },
                { text: "The verb 'painted' changed to 'was painted'.", correct: true, type: "verb" },
                { text: "The word 'by' was added before 'the talented artist'.", correct: true, type: "by" },
                { text: "The word 'talented' was moved before 'mural'.", correct: false },
                { text: "An adverb was added to describe how the painting was done.", correct: false }
            ]
        },
        {
            activeHTML: `<span id="hl-act-sub">The doctor</span> examines <span id="hl-act-obj">the patients</span> daily.`,
            passiveHTML: `<span id="hl-pas-obj">The patients</span> are examined <span id="hl-pas-by">by</span> <span id="hl-pas-sub">the doctor</span> daily.`,
            options: [
                { text: "The words 'the patients' (object) moved to the beginning of the sentence.", correct: true, type: "object" },
                { text: "The words 'the doctor' (subject) moved to the end of the sentence.", correct: true, type: "subject" },
                { text: "The verb 'examines' changed to 'are examined'.", correct: true, type: "verb" },
                { text: "The word 'by' was added before 'the doctor'.", correct: true, type: "by" },
                { text: "The word 'daily' changed to 'everyday'.", correct: false },
                { text: "The sentence changed from singular to plural focus.", correct: false }
            ]
        }
    ];

    const practiseQuestions = [
        {
            active: "The children love their grandmother.",
            options: ["Their", "grandmother", "is", "loved", "by", "the", "children", ".", "was", "loves"],
            answer: ["Their", "grandmother", "is", "loved", "by", "the", "children", "."]
        },
        {
            active: "The farmer grows fresh vegetables.",
            options: ["by", "were", "vegetables", "the", "are", "farmer", "grows", ".", "Fresh", "grown"],
            answer: ["Fresh", "vegetables", "are", "grown", "by", "the", "farmer", "."]
        },
        {
            active: "The company will launch a new product.",
            options: ["be", "product", "launched", "the", "will", "company", "launching", "A", "new", "by", "being", "."],
            answer: ["A", "new", "product", "will", "be", "launched", "by", "the", "company", "."]
        },
        {
            active: "The clever detective solved the mystery.",
            options: ["mystery", "clever", "is", "solved", "detective", "the", "by", "was", ".", "The", "solving"],
            answer: ["The", "mystery", "was", "solved", "by", "the", "clever", "detective", "."]
        },
        {
            active: "My sister baked delicious cookies.",
            options: ["cookies", "sister", "are", "my", "Delicious", "were", "bakes", "baked", "by", "."],
            answer: ["Delicious", "cookies", "were", "baked", "by", "my", "sister", "."]
        }
    ];

    let currentComparisonQuestion = 0;
    let currentPractiseQuestion = 0;
    let practiseFilledSlots = [];

    function hideAll() {
        introScreen.style.display = "none";
        IText.style.display = "none";
        learnPanel1.style.display = "none";
        learnPanel2.style.display = "none";
        learnPanel3.style.display = "none";
        practiseScreen.style.display = "none";
        // homeBtn.style.display = "none"; // Keep home button visible everywhere
        nextBtn.style.display = "none";
        progressBar.style.display = "none";
        incorrect.style.display = "none";
        correct.style.display = "none";
        feedback.style.opacity = "0";
        if (question2Panel) question2Panel.style.display = "none";
        otherScreens.forEach((s) => {
            if (s) s.style.display = "none";
        });
    }

    function initGame() {
        hideAll();
        introScreen.style.display = "block";
        homeBtn.style.display = "block";
    }

    // Update the SVG text content inside a group by replacing the first tspan text
    function setSVGText(group, text) {
        const tspans = group.querySelectorAll("tspan");
        if (tspans.length > 0) {
            // Clear all tspans except the first, set first one
            for (let i = 1; i < tspans.length; i++) {
                tspans[i].textContent = "";
            }
            tspans[0].textContent = text;
        } else {
            const textEl = group.querySelector("text");
            if (textEl) textEl.textContent = text;
        }
    }

    // Update the Next button label
    function setNextBtnLabel(label) {
        const tspan = nextBtn.querySelector("tspan");
        if (tspan) tspan.textContent = label;

        const path = nextBtn.querySelector("#Path_21");
        if (path) {
            if (label === "Show Passive Voice") {
                path.setAttribute("d", "M886.53,1150.34h320c25.68,0,46.5,20.82,46.5,46.5s-20.82,46.5-46.5,46.5h-320c-25.68,0-46.5-20.82-46.5-46.5s20.82-46.5,46.5-46.5Z");
            } else {
                path.setAttribute("d", "M988.53,1150.34h116c25.68,0,46.5,20.82,46.5,46.5s-20.82,46.5-46.5,46.5h-116c-25.68,0-46.5-20.82-46.5-46.5s20.82-46.5,46.5-46.5Z");
            }
        }
    }

    function showFinalLearnScreen() {
        hideAll();
        question2Panel.style.display = "block";
        feedback.style.opacity = "1";
        IText.style.display = "block";

        const iTextEl = IText.querySelector("text");
        if (iTextEl) {
            iTextEl.innerHTML =
                '<tspan x="0" y="0">Now, look at all the sentences again. Select the sentences</tspan>' +
                '<tspan x="0" y="32">where the person or thing doing the action comes FIRST.</tspan>';
        }

        setupFinalSelectionInteraction();
        nextBtn.style.display = "none";
    }

    function showActiveComparison() {
        hideAll();
        comparePanel.style.display = "block";
        feedback.style.opacity = "0";

        // Passive sentences
        const passiveIds = ["Group_1186-2", "Group_1188-2", "Group_1190-2", "Group_1192-2", "Group_1194-2"];
        passiveIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });

        // Passive headers
        const passiveHeaderIds = ["Line_1", "Passive_Voice", "Rectangle_243"];
        passiveHeaderIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });

        // Compare button Group_1200
        const compareBtn = document.getElementById("Group_1200");
        if (compareBtn) {
            compareBtn.style.display = "none";
            compareBtn.style.cursor = "pointer";
            compareBtn.onclick = () => {
                currentComparisonQuestion = 0;
                showQuestion3Panel(currentComparisonQuestion);
            };
        }

        setNextBtnLabel("Show Passive Voice");
        nextBtn.style.display = "block";

        IText.style.display = "block";
        const iTextEl = IText.querySelector("text");
        if (iTextEl) {
            iTextEl.innerHTML =
                '<tspan x="0" y="0">Now, look at all the sentences again. Select the sentences</tspan>' +
                '<tspan x="0" y="32">where the person or thing doing the action comes FIRST.</tspan>';
        }
    }

    function showQuestion3Panel(index) {
        hideAll();
        question3Panel.style.display = "block";
        feedback.style.opacity = "1";
        IText.style.display = "block";

        const q = comparisonQuestions[index];

        // Update instruction
        const iTextEl = IText.querySelector("text");
        if (iTextEl) {
            iTextEl.innerHTML =
                '<tspan x="0" y="0">Look at the sentence pair below. Select ALL the changes that</tspan>' +
                '<tspan x="0" y="32">happen when we transform from active to passive voice.</tspan>';
        }

        // Update Sentences via foreignObject div
        const activeDiv = document.getElementById("q3-active-sentence");
        const passiveDiv = document.getElementById("q3-passive-sentence");
        if (activeDiv) {
            activeDiv.innerHTML = q.activeHTML;
        }
        if (passiveDiv) {
            passiveDiv.innerHTML = q.passiveHTML;
        }

        // Highlight rects (the actual rect elements for position measurement)
        const hlRects = {
            subjectActive: document.getElementById("Rectangle_38-13"),
            objectActive: document.getElementById("Rectangle_38-2-2"),
            passiveObject: document.getElementById("Rectangle_38-5-2"),
            subjectPassive: document.getElementById("Rectangle_38-4-2"),
            by: document.getElementById("Rectangle_38-3-2")
        };
        // Groups for show/hide (parent g elements)
        const hlGroups = {
            subjectActive: document.getElementById("Group_1216"),
            objectActive: document.getElementById("Group_1218"),
            passiveObject: document.getElementById("Group_1219"),
            subjectPassive: document.getElementById("Group_1217"),
            by: document.getElementById("Group_1222")
        };

        const arrows = {
            subject: document.getElementById("Group_1220"),
            object: document.getElementById("Group_1221")
        };

        // We must wait a tick for the DOM to render the injected HTML before measuring bounds
        setTimeout(() => {
            const svgEl = document.querySelector("svg");
            const svgRect = svgEl.getBoundingClientRect();

            // Helper to update highlights dynamically using getBoundingClientRect
            function updateHighlightDOM(spanId, rectEl) {
                if (!rectEl) return;
                const spanEl = document.getElementById(spanId);
                if (!spanEl) return;

                const spanRect = spanEl.getBoundingClientRect();

                // Get the coordinate system transform for the rectangle's parent
                const parentGroup = rectEl.parentNode;
                const ctm = parentGroup.getScreenCTM();
                if (!ctm) return;
                const invCtm = ctm.inverse();

                // Map the left/top of the span to SVG local space
                let pt1 = svgEl.createSVGPoint();
                pt1.x = spanRect.left;
                pt1.y = spanRect.top;
                pt1 = pt1.matrixTransform(invCtm);

                // Map the right/bottom to SVG local space
                let pt2 = svgEl.createSVGPoint();
                pt2.x = spanRect.right;
                pt2.y = spanRect.bottom;
                pt2 = pt2.matrixTransform(invCtm);

                rectEl.setAttribute("x", pt1.x - 5);
                rectEl.setAttribute("width", (pt2.x - pt1.x) + 10);
            }

            // Helper to update arrows
            function updateArrow(arrowGroup, r1, r2) {
                if (!arrowGroup || !r1 || !r2) return;
                const line = arrowGroup.querySelector("line");
                const poly = arrowGroup.querySelector("path");
                const x1 = parseFloat(r1.getAttribute("x")) + parseFloat(r1.getAttribute("width")) / 2;
                const x2 = parseFloat(r2.getAttribute("x")) + parseFloat(r2.getAttribute("width")) / 2;
                const y1 = 438.61;
                const y2 = 531.61;
                line.setAttribute("x1", x1); line.setAttribute("y1", y1);
                line.setAttribute("x2", x2); line.setAttribute("y2", y2);
                const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
                const isSubject = arrowGroup.id === "Group_1220";
                const tipX = isSubject ? 1190.37 : 832.22;
                const tipY = isSubject ? 563.89 : 563.47;
                const origAngle = isSubject ? 21.05 : 151.7;
                poly.setAttribute("transform", `translate(${x2},${y2}) rotate(${angle - origAngle}) translate(${-tipX},${-tipY})`);
            }

            // Position current highlights dynamically
            updateHighlightDOM("hl-act-sub", hlRects.subjectActive);
            updateHighlightDOM("hl-act-obj", hlRects.objectActive);
            updateHighlightDOM("hl-pas-obj", hlRects.passiveObject);
            updateHighlightDOM("hl-pas-sub", hlRects.subjectPassive);
            updateHighlightDOM("hl-pas-by", hlRects.by);

            // Position arrows based on updated highlight rect positions
            updateArrow(arrows.subject, hlRects.subjectActive, hlRects.subjectPassive);
            updateArrow(arrows.object, hlRects.objectActive, hlRects.passiveObject);
        }, 10);

        // Hide all arrows and highlight groups initially
        Object.values(arrows).forEach(a => { if (a) a.style.display = "none"; });
        Object.values(hlGroups).forEach(g => { if (g) g.style.display = "none"; });

        // Update Options Tiles
        const tileIds = ["Group_1202", "Group_1203", "Group_1204", "Group_1205", "Group_1206", "Group_1207"];
        let correctSelected = 0;
        const totalCorrect = q.options.filter(o => o.correct).length;

        tileIds.forEach((id, i) => {
            const tile = document.getElementById(id);
            if (!tile) return;
            const opt = q.options[i];

            // Set text
            const textElements = tile.querySelectorAll("text");
            textElements.forEach((el, index) => {
                if (index === 0) el.innerHTML = "";
                else el.style.display = "none";
            });

            const textEl = textElements[0];
            if (textEl) {
                const words = (opt ? opt.text : "").split(" ");
                let l1 = "", l2 = "";
                words.forEach(w => {
                    if ((l1 + w).length < 40) l1 += w + " ";
                    else l2 += w + " ";
                });
                let html = `<tspan x="0" y="0">${l1.trim()}</tspan>`;
                if (l2) html += `<tspan x="0" y="35">${l2.trim()}</tspan>`;
                textEl.innerHTML = html;
            }

            const rectEl = tile.querySelector("rect");
            if (rectEl) rectEl.setAttribute("fill", "#fff");
            const existingIcons = tile.querySelectorAll(".feedback-marker");
            existingIcons.forEach(icon => icon.remove());
            tile.onclick = null;
            tile.style.cursor = "pointer";

            let isSelected = false;

            tile.onclick = () => {
                isSelected = !isSelected;
                tile.querySelectorAll(".feedback-marker").forEach(m => m.remove());

                if (isSelected) {
                    const NS = "http://www.w3.org/2000/svg";
                    const rX = parseFloat(rectEl.getAttribute("x"));
                    const rY = parseFloat(rectEl.getAttribute("y"));

                    if (opt.correct) {
                        if (rectEl) rectEl.setAttribute("fill", "#0480eb");
                        const marker = document.createElementNS(NS, "path");
                        marker.setAttribute("class", "feedback-marker");
                        marker.setAttribute("fill", "#fff");
                        marker.setAttribute("d", "M309.08,505.71c-4.8,6.51-8.76,13.61-11.77,21.12-.42,1.1-1.42,1.88-2.59,2.01-.79.1-1.52.22-2.14.36-1.31.28-2.65-.29-3.36-1.42-1.92-3.05-4.13-6.69-5.25-8.55-.46-.76-.27-1.74.44-2.27.26-.19.56-.41.92-.63,1.65-1.05,3.83-.65,5,.92l2.97,3.95c4.36-8.37,8.18-12.88,10.52-15.12,1.32-1.27,3.22-1.73,4.97-1.22.29.09.45.39.37.68-.02.06-.04.12-.08.17h0Z");
                        marker.setAttribute("transform", `translate(${rX - 279}, ${rY - 495})`);
                        tile.appendChild(marker);
                        correctSelected++;

                        if (opt.type === "subject") {
                            if (hlGroups.subjectActive) hlGroups.subjectActive.style.display = "block";
                            if (hlGroups.subjectPassive) hlGroups.subjectPassive.style.display = "block";
                            if (arrows.subject) arrows.subject.style.display = "block";
                        } else if (opt.type === "object") {
                            if (hlGroups.objectActive) hlGroups.objectActive.style.display = "block";
                            if (hlGroups.passiveObject) hlGroups.passiveObject.style.display = "block";
                            if (arrows.object) arrows.object.style.display = "block";
                        } else if (opt.type === "by") {
                            if (hlGroups.by) hlGroups.by.style.display = "block";
                        }
                    } else {
                        if (rectEl) rectEl.setAttribute("fill", "red");
                        incorrect.style.display = "block";
                        setTimeout(() => { incorrect.style.display = "none"; }, 1000);
                        const xIcon = document.createElementNS(NS, "path");
                        xIcon.setAttribute("class", "feedback-marker");
                        xIcon.setAttribute("fill", "#fff");
                        xIcon.setAttribute("d", "M285.87,508.82l2.31-2.24c.73-.71,1.91-.71,2.63,0l3.96,3.84,3.96-3.84c.73-.71,1.9-.71,2.63,0l2.31,2.24c.73.71.73,1.85,0,2.56l-3.96,3.84,3.96,3.84c.73.71.73,1.85,0,2.56l-2.31,2.24c-.73.71-1.9.71-2.63,0l-3.96-3.84-3.96,3.84c-.73-.71-1.9.71-2.63,0l-2.31-2.24c-.73-.71-.73-1.85,0-2.56l3.96-3.84-3.96-3.84c-.73-.71-.73-1.85,0-2.56h0Z");
                        xIcon.setAttribute("transform", `translate(${rX - 274} , ${rY - 495})`);
                        tile.appendChild(xIcon);
                    }
                } else {
                    if (rectEl) rectEl.setAttribute("fill", "#fff");
                    if (opt.correct) {
                        correctSelected--;
                        if (opt.type === "subject") {
                            if (hlGroups.subjectActive) hlGroups.subjectActive.style.display = "none";
                            if (hlGroups.subjectPassive) hlGroups.subjectPassive.style.display = "none";
                            if (arrows.subject) arrows.subject.style.display = "none";
                        } else if (opt.type === "object") {
                            if (hlGroups.objectActive) hlGroups.objectActive.style.display = "none";
                            if (hlGroups.passiveObject) hlGroups.passiveObject.style.display = "none";
                            if (arrows.object) arrows.object.style.display = "none";
                        } else if (opt.type === "by") {
                            if (hlGroups.by) hlGroups.by.style.display = "none";
                        }
                    }
                }

                const anyIncorrect = tileIds.some(tid => {
                    const t = document.getElementById(tid);
                    const r = t ? t.querySelector("rect") : null;
                    return r && r.getAttribute("fill") === "red";
                });

                if (correctSelected === totalCorrect && !anyIncorrect) {
                    nextBtn.style.display = "block";
                    correct.style.display = "block";
                    setNextBtnLabel(index === comparisonQuestions.length - 1 ? "Practice" : "Next");
                    setTimeout(() => { correct.style.display = "none"; }, 1500);
                } else {
                    nextBtn.style.display = "none";
                    correct.style.display = "none";
                }
            };
        });

        nextBtn.onclick = () => {
            if (index < comparisonQuestions.length - 1) {
                currentComparisonQuestion++;
                showQuestion3Panel(currentComparisonQuestion);
            } else {
                practiseBtn.click();
            }
        };
    }


    function showFullComparison() {
        // Show all children including lines and groups
        const children = Array.from(comparePanel.children);
        children.forEach(child => {
            child.style.display = "block";
        });

        // Explicitly show legend elements that might have been hidden
        const passiveHeaderIds = ["Line_1", "Passive_Voice", "Rectangle_243"];
        passiveHeaderIds.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "block";
        });

        // Hide nextBtn
        nextBtn.style.display = "none";

        // Show Compare button
        const compareBtn = document.getElementById("Group_1200");
        if (compareBtn) compareBtn.style.display = "block";

        IText.style.display = "block";
        const iTextEl = IText.querySelector("text");
        if (iTextEl) {
            iTextEl.innerHTML =
                '<tspan x="0" y="0">Now, look at all the sentences again. Select the sentences</tspan>' +
                '<tspan x="0" y="32">where the person or thing doing the action comes FIRST.</tspan>';
        }
    }

    function setupFinalSelectionInteraction() {
        // Group IDs in order from index.html (matches the 2-column layout in screenshot)
        const groupIds = [
            "Group_1185", "Group_1186", "Group_1187", "Group_1188", "Group_1189",
            "Group_1190", "Group_1191", "Group_1192", "Group_1193", "Group_1194"
        ];

        const activeIndices = [0, 2, 4, 6, 8];
        const selectedIndices = new Set();

        groupIds.forEach((id, index) => {
            const group = document.getElementById(id);
            if (!group) return;

            group.style.cursor = "pointer";
            const rectBox = group.querySelector('rect[width="41"]');

            // Initialization: ensure boxes are white and icons removed
            if (rectBox) rectBox.setAttribute("fill", "#fff");
            const existingIcon = group.querySelector(".checkbox-icon");
            if (existingIcon) existingIcon.remove();

            group.onclick = () => {
                const isActive = activeIndices.includes(index);
                const isSelected = selectedIndices.has(index);

                if (isSelected) {
                    selectedIndices.delete(index);
                    if (rectBox) rectBox.setAttribute("fill", "#fff");
                    const icon = group.querySelector(".checkbox-icon");
                    if (icon) icon.remove();
                } else {
                    selectedIndices.add(index);
                    const NS = "http://www.w3.org/2000/svg";
                    const newIcon = document.createElementNS(NS, "path");
                    newIcon.setAttribute("class", "checkbox-icon");
                    newIcon.setAttribute("fill", "#fff");

                    if (isActive) {
                        if (rectBox) rectBox.setAttribute("fill", "#5ca0fa");
                        // Path_2164 design
                        newIcon.setAttribute("d", "M309.08,505.71c-4.8,6.51-8.76,13.61-11.77,21.12-.42,1.1-1.42,1.88-2.59,2.01-.79.1-1.52.22-2.14.36-1.31.28-2.65-.29-3.36-1.42-1.92-3.05-4.13-6.69-5.25-8.55-.46-.76-.27-1.74.44-2.27.26-.19.56-.41.92-.63,1.65-1.05,3.83-.65,5,.92l2.97,3.95c4.36-8.37,8.18-12.88,10.52-15.12,1.32-1.27,3.22-1.73,4.97-1.22.29.09.45.39.37.68-.02.06-.04.12-.08.17h0Z");
                    } else {
                        if (rectBox) rectBox.setAttribute("fill", "red");
                        // Path_2248 design
                        newIcon.setAttribute("d", "M285.87,508.82l2.31-2.24c.73-.71,1.91-.71,2.63,0l3.96,3.84,3.96-3.84c.73-.71,1.9-.71,2.63,0l2.31,2.24c.73.71.73,1.85,0,2.56l-3.96,3.84,3.96,3.84c.73.71.73,1.85,0,2.56l-2.31,2.24c-.73.71-1.9.71-2.63,0l-3.96-3.84-3.96,3.84c-.73.71-1.9.71-2.63,0l-2.31-2.24c-.73-.71-.73-1.85,0-2.56l3.96-3.84-3.96-3.84c-.73-.71-.73-1.85,0-2.56h0Z");
                    }

                    // Position relative to box (rect x=274.77, y=497.38 reference)
                    const boxX = parseFloat(rectBox.getAttribute("x") || 0);
                    const boxY = parseFloat(rectBox.getAttribute("y") || 0);
                    const deltaX = boxX - 274.77;
                    const deltaY = boxY - 497.38;
                    newIcon.setAttribute("transform", `translate(${deltaX}, ${deltaY})`);

                    group.appendChild(newIcon);
                }

                checkCompletion();
            };
        });

        function checkCompletion() {
            const allActiveSelected = activeIndices.every(i => selectedIndices.has(i));
            const noPassiveSelected = Array.from(selectedIndices).every(i => !activeIndices.includes(i) ? false : true); // Dummy check logic? No.

            // Correct logic: all active are in selected, and no passive are in selected
            const passiveIndices = [1, 3, 5, 7, 9];
            const hasAnyPassive = passiveIndices.some(i => selectedIndices.has(i));

            if (allActiveSelected && !hasAnyPassive) {
                correct.style.display = "block";
                setNextBtnLabel("Next");
                nextBtn.style.display = "block";

                // Position green circle feedback and stars near top right of blue container
                correct.setAttribute("transform", "translate(150, 50)");
            } else {
                correct.style.display = "none";
            }

            if (hasAnyPassive) {
                incorrect.style.display = "block";
                // Position red circle feedback on the right middle
                incorrect.setAttribute("transform", "translate(40, 50)");
            } else {
                incorrect.style.display = "none";
            }
        }
    }

    function getPractiseOptionGroups() {
        return Array.from(document.querySelectorAll("#Practise_screen #Group_702 > g"))
            .filter(g => g.querySelector("text"));
    }

    function getPractiseSlotGroups() {
        // Sort a set of slot groups left-to-right by their first rect's x position
        function sortByX(groups) {
            return groups.slice().sort((a, b) => {
                const rA = a.querySelector("rect"), rB = b.querySelector("rect");
                return parseFloat(rA ? rA.getAttribute("x") : 0) - parseFloat(rB ? rB.getAttribute("x") : 0);
            });
        }
        const row1 = sortByX(Array.from(document.querySelectorAll("#Practise_screen #Group_1226 > g")));
        const row2 = sortByX(Array.from(document.querySelectorAll("#Practise_screen #Group_700 > g")));
        const row3 = sortByX(Array.from(document.querySelectorAll("#Practise_screen #Group_703 > g")));
        return [...row1, ...row2, ...row3]; // 12 slots total (4 per row × 3 rows)
    }

    function showPractisePanel(index) {
        hideAll();
        practiseScreen.style.display = "block";
        feedback.style.opacity = "1";
        IText.style.display = "block";
        // homeBtn.style.display = "block"; // Already shown in initGame/persistent
        progressBar.style.display = "block";
        nextBtn.style.display = "none";
        correct.style.display = "none";
        incorrect.style.display = "none";

        const feedbackSticker = document.getElementById("Feedback_sticker");
        if (feedbackSticker) feedbackSticker.style.display = "none";

        const iTextEl = IText.querySelector("text");
        if (iTextEl) {
            iTextEl.innerHTML = '<tspan x="0" y="0">Convert the active voice sentence to passive voice by selecting words from the help box.</tspan>';
        }

        const q = practiseQuestions[index];
        practiseFilledSlots = Array(q.answer.length).fill(null);

        // Moved Y from 40 to 10 to give more room at bottom
        practiseScreen.setAttribute("transform", "translate(150, 10) scale(0.85)");

        const needsRow3 = q.answer.length > 8;
        const helpBox = document.querySelector("#Practise_screen #Group_702");
        if (needsRow3) {
            if (helpBox) helpBox.setAttribute("transform", "translate(0, 208)"); // Increatest spacing
        } else {
            if (helpBox) helpBox.setAttribute("transform", "translate(0, 100)"); // Base spacing for 2 rows
        }

        // Move feedback and button groups lower (Y=150) than the game panel (Y=10)
        [nextBtn, correct, incorrect].forEach(el => {
            if (el) el.setAttribute("transform", "translate(150, 150) scale(0.85)");
        });


        // Update progress bar
        const totalGameQuestions = 5 + 5 + 5;
        const progressPercent = Math.round(((10 + index) / totalGameQuestions) * 100);
        const pbRect = document.getElementById("Rectangle_4");
        if (pbRect) {
            pbRect.setAttribute("width", `${progressPercent * 2.82}`);
        }

        // Update the active sentence text in the SVG
        const activeSentenceText = document.querySelector("#Practise_screen #Group_2-2 text");
        if (activeSentenceText) {
            activeSentenceText.setAttribute("text-anchor", "middle");
            activeSentenceText.setAttribute("transform", "translate(1035 372)");
            activeSentenceText.innerHTML = `<tspan x="0" y="0">${q.active}</tspan>`;
            adjustActiveSentenceBoxWidth("#Practise_screen #Group_2-2 text", "#Practise_screen #Group_618-2 rect");
        }

        // Set up option pill groups
        const optionGroups = getPractiseOptionGroups();
        optionGroups.forEach((group, i) => {
            // Remove any injected words from previous round
            group.querySelectorAll(".practise-injected").forEach(el => el.remove());

            // Update the text of each pill to the current question's option
            const textEl = group.querySelector("text");
            if (textEl && i < q.options.length) {
                // Clear all tspans and set simple text
                const tspans = textEl.querySelectorAll("tspan");
                tspans.forEach(t => t.remove());
                const svgNS = "http://www.w3.org/2000/svg";
                const ts = document.createElementNS(svgNS, "tspan");
                ts.textContent = q.options[i];
                textEl.appendChild(ts);

                // Center text inside its pill rect
                const rectEl = group.querySelector('rect[fill="#0480eb"]') || group.querySelector("rect");
                if (rectEl) {
                    const rx = parseFloat(rectEl.getAttribute("x") || 0);
                    const ry = parseFloat(rectEl.getAttribute("y") || 0);
                    const rw = parseFloat(rectEl.getAttribute("width") || 274);
                    const rh = parseFloat(rectEl.getAttribute("height") || 72);
                    textEl.setAttribute("text-anchor", "middle");
                    textEl.setAttribute("dominant-baseline", "middle");
                    textEl.setAttribute("x", rx + rw / 2);
                    textEl.setAttribute("y", ry + rh / 2 + 2);
                    textEl.removeAttribute("transform");
                }

                group.style.display = "";
                group.style.opacity = "1";
                group.style.pointerEvents = "auto";
                group.style.cursor = "pointer";

                group.onclick = () => {
                    const emptySlotIndex = practiseFilledSlots.findIndex(s => s === null);
                    if (emptySlotIndex === -1) return;
                    practiseFilledSlots[emptySlotIndex] = { text: q.options[i], sourceIndex: i };
                    group.style.opacity = "0.4";
                    group.style.pointerEvents = "none";
                    renderPractiseSlots();
                };
            } else {
                group.style.display = "none";
            }
        });

        // Clear slot injections and render empty slots
        renderPractiseSlots();
    }

    function renderPractiseSlots() {
        const q = practiseQuestions[currentPractiseQuestion];
        const slotGroups = getPractiseSlotGroups();
        const svgNS = "http://www.w3.org/2000/svg";

        slotGroups.forEach((box, i) => {
            // Remove previously injected filled-word group
            box.querySelectorAll(".practise-filled").forEach(el => el.remove());

            if (i >= q.answer.length) {
                box.style.display = "none";
                return;
            }
            box.style.display = "";
            box.style.opacity = "1";

            const outerRect = box.querySelector("rect");
            const dashRect = box.querySelector('rect[stroke-dasharray]') ||
                box.querySelectorAll("rect")[1];

            if (practiseFilledSlots[i]) {
                // Show the word as a filled blue pill
                const rx = parseFloat(outerRect.getAttribute("x") || 0);
                const ry = parseFloat(outerRect.getAttribute("y") || 0);
                const rw = parseFloat(outerRect.getAttribute("width") || 274);
                const rh = parseFloat(outerRect.getAttribute("height") || 72);

                // Create filled overlay group
                const filledG = document.createElementNS(svgNS, "g");
                filledG.setAttribute("class", "practise-filled");
                filledG.style.cursor = "pointer";

                const bgRect = document.createElementNS(svgNS, "rect");
                bgRect.setAttribute("x", rx); bgRect.setAttribute("y", ry);
                bgRect.setAttribute("width", rw); bgRect.setAttribute("height", rh);
                bgRect.setAttribute("rx", "14"); bgRect.setAttribute("ry", "14");
                bgRect.setAttribute("fill", "#0480eb");
                filledG.appendChild(bgRect);

                const wordText = document.createElementNS(svgNS, "text");
                wordText.setAttribute("x", rx + rw / 2);
                wordText.setAttribute("y", ry + rh / 2 + 2);
                wordText.setAttribute("text-anchor", "middle");
                wordText.setAttribute("dominant-baseline", "middle");
                wordText.setAttribute("fill", "#fff");
                wordText.setAttribute("font-family", "Roboto-Regular, Roboto");
                wordText.setAttribute("font-size", "38");
                const ts = document.createElementNS(svgNS, "tspan");
                ts.textContent = practiseFilledSlots[i].text;
                wordText.appendChild(ts);
                filledG.appendChild(wordText);

                filledG.onclick = (e) => {
                    e.stopPropagation();
                    returnPractiseSlot(i);
                };

                box.appendChild(filledG);
                scaleTextToFit(wordText, rw - 24); // Scaling for Practise slots

                // Make the dash border solid
                if (dashRect) dashRect.setAttribute("stroke-dasharray", "");
            } else {
                // Restore dashed border
                if (dashRect) dashRect.setAttribute("stroke-dasharray", "6 6");
                box.style.cursor = "default";
                box.onclick = null;
            }
        });

        // Validation: check if all slots filled
        const filledCount = practiseFilledSlots.filter(s => s !== null).length;
        const q2 = practiseQuestions[currentPractiseQuestion];
        if (filledCount === q2.answer.length) {
            const isCorrect = practiseFilledSlots.slice(0, q2.answer.length)
                .every((s, idx) => s !== null && s.text === q2.answer[idx]);
            if (isCorrect) {
                correct.style.display = "block";
                incorrect.style.display = "none";
                nextBtn.style.display = "block";
                setNextBtnLabel(currentPractiseQuestion < practiseQuestions.length - 1 ? "Next" : "Finish");
                nextBtn.onclick = () => {
                    correct.style.display = "none";
                    if (currentPractiseQuestion < practiseQuestions.length - 1) {
                        currentPractiseQuestion++;
                        showPractisePanel(currentPractiseQuestion);
                    } else {
                        location.reload();
                    }
                };
            } else {
                incorrect.style.display = "block";
                correct.style.display = "none";
                nextBtn.style.display = "none";
                setTimeout(() => { incorrect.style.display = "none"; }, 1500);
            }
        } else {
            correct.style.display = "none";
            incorrect.style.display = "none";
            nextBtn.style.display = "none";
        }
    }

    function returnPractiseSlot(i) {
        if (!practiseFilledSlots[i]) return;
        const sourceIndex = practiseFilledSlots[i].sourceIndex;
        const optionGroups = getPractiseOptionGroups();
        if (optionGroups[sourceIndex]) {
            optionGroups[sourceIndex].style.opacity = "1";
            optionGroups[sourceIndex].style.pointerEvents = "auto";
        }
        practiseFilledSlots[i] = null;
        // Clear feedback when a word is returned
        correct.style.display = "none";
        incorrect.style.display = "none";
        nextBtn.style.display = "none";
        renderPractiseSlots();
    }

    // Load a learn question by index into the existing SVG panels
    function loadLearnQuestion(index) {
        const q = learnQuestions[index];
        const answerCount = q.answer.length;

        // 1. Update Sentence 1 text in Panel 1
        const s1Group = learnPanel1.querySelector("text");
        if (s1Group) {
            const tspans = s1Group.querySelectorAll("tspan");
            for (let i = 1; i < tspans.length; i++) tspans[i].textContent = "";
            if (tspans[0]) tspans[0].textContent = q.sentence1;
            else s1Group.textContent = q.sentence1;
            adjustActiveSentenceBoxWidth("#Question_2_panel_1 #Group_2 text", "#Question_2_panel_1 #Group_618 rect");
        }

        // 2. Update sentence 2 prefix in Panel 2
        const allP2Texts = Array.from(learnPanel2.querySelectorAll("text"));
        const prefixTextEl = allP2Texts.find((t) => {
            const content = t.textContent.trim();
            return content !== "Begin with..." && content !== "";
        });
        if (prefixTextEl) {
            const tspans = prefixTextEl.querySelectorAll("tspan");
            for (let i = 1; i < tspans.length; i++) tspans[i].textContent = "";
            if (tspans[0]) tspans[0].textContent = q.sentence2Prefix;
            else prefixTextEl.textContent = q.sentence2Prefix;
        }

        // 3. Remove any cloned pills and dynamically added drop zones from previous question
        Array.from(learnPanel2.children).forEach((c) => {
            if (
                c.classList.contains("learn-clone") ||
                c.classList.contains("dynamic-dropzone")
            ) {
                c.remove();
            }
        });

        // 4. Build drop zones — ONE ROW, auto-fit from text-end to panel right edge
        //    Measure where the prefix text ends, then divide remaining space among boxes
        const PANEL_RIGHT = 1637;   // inner right edge of panel 2 (from SVG)
        const BOX_GAP = 10;     // px gap between consecutive boxes
        const BOX_H = 72;
        const START_Y = 506.97;

        // Measure prefix text actual rendered end-X in SVG global coordinates
        // getComputedTextLength() gives text width in SVG units; add the text's translate-x offset
        let textEndX = 760;  // fallback
        if (prefixTextEl) {
            try {
                const transform = prefixTextEl.getAttribute("transform") || "";
                const match = transform.match(/translate\(\s*([0-9.]+)/);
                const textOriginX = match ? parseFloat(match[1]) : 451;
                const tspan = prefixTextEl.querySelector("tspan");
                const textLen = tspan ? tspan.getComputedTextLength() : 0;
                textEndX = textOriginX + textLen + 20;  // 20px breathing room
            } catch (e) { /* keep fallback on error */ }
        }
        const START_X = textEndX;
        const totalW = PANEL_RIGHT - START_X;
        // BOX_W = (totalW - (n-1)*GAP) / n
        const BOX_W = Math.floor((totalW - (answerCount - 1) * BOX_GAP) / answerCount);
        const COL_GAP = BOX_W + BOX_GAP;   // distance between box starts

        // Get the 4 original static drop zones sorted left→right
        const staticDropZones = Array.from(
            learnPanel2.querySelectorAll("g[id^='Rectangle_']"),
        ).sort((a, b) => {
            const rA = a.querySelector("rect"), rB = b.querySelector("rect");
            if (!rA || !rB) return 0;
            return parseFloat(rA.getAttribute("x") || 0) - parseFloat(rB.getAttribute("x") || 0);
        });

        // Reposition needed zones (all in one row), create extras if needed
        for (let i = 0; i < answerCount; i++) {
            const newX = START_X + i * COL_GAP;
            const newY = START_Y;

            if (i < staticDropZones.length) {
                const zone = staticDropZones[i];
                zone.style.display = "";
                const rects = zone.querySelectorAll("rect");
                rects.forEach((r, ri) => {
                    r.setAttribute("x", newX + ri * 2);
                    r.setAttribute("y", newY + ri * 2);
                    r.setAttribute("width", ri === 0 ? String(BOX_W) : String(BOX_W - 4));
                    r.setAttribute("height", ri === 0 ? String(BOX_H) : String(BOX_H - 4));
                });
            } else {
                const template = staticDropZones[0];
                const newZone = template.cloneNode(true);
                newZone.removeAttribute("id");
                newZone.setAttribute("id", `Rectangle_dyn_${i}`);
                newZone.classList.add("dynamic-dropzone");
                const rects = newZone.querySelectorAll("rect");
                rects.forEach((r, ri) => {
                    r.setAttribute("x", newX + ri * 2);
                    r.setAttribute("y", newY + ri * 2);
                    r.setAttribute("width", ri === 0 ? String(BOX_W) : String(BOX_W - 4));
                    r.setAttribute("height", ri === 0 ? String(BOX_H) : String(BOX_H - 4));
                });
                learnPanel2.appendChild(newZone);
            }
        }

        // Hide unused static drop zones
        staticDropZones.slice(answerCount).forEach((z) => { z.style.display = "none"; });

        // 5. Update option words in Panel 3
        const optionGroups = Array.from(learnPanel3.children).filter((g) =>
            g.querySelector("text"),
        );
        optionGroups.forEach((g, i) => {
            if (i < q.options.length) {
                const tspans = g.querySelectorAll("tspan");
                for (let j = 1; j < tspans.length; j++) tspans[j].textContent = "";
                if (tspans[0]) tspans[0].textContent = q.options[i];
                else {
                    const t = g.querySelector("text");
                    if (t) t.textContent = q.options[i];
                }
                g.style.display = "";
                g.classList.remove("used");
                g.style.opacity = "1";
            } else {
                g.style.display = "none";
            }
        });

        // 6. Reset feedback and button
        correct.style.display = "none";
        incorrect.style.display = "none";
        nextBtn.style.display = "none";

        // 7. Set button label: "Continue" for last question, "Next" otherwise
        const isLast = index === learnQuestions.length - 1;
        setNextBtnLabel(isLast ? "Continue" : "Next");

        // 8. Setup interaction for this question
        setupInteraction(learnPanel3, learnPanel2, q.answer, (isCorrect) => {
            if (isCorrect) {
                nextBtn.style.display = "block";
            }
        });
    }

    // --- Utility to handle Options and Drops ---
    function setupInteraction(
        optionsPanel,
        dropZonesParent,
        targetSequence,
        onComplete,
    ) {
        // Find all visible drop boxes (exclude hidden ones)
        const dropZones = Array.from(
            dropZonesParent.querySelectorAll("g[id^='Rectangle_']"),
        )
            .filter((g) => g.style.display !== "none")
            .sort((a, b) => {
                const rectA = a.querySelector("rect");
                const rectB = b.querySelector("rect");
                if (!rectA || !rectB) return 0;
                const yA = parseFloat(rectA.getAttribute("y") || 0);
                const yB = parseFloat(rectB.getAttribute("y") || 0);
                if (Math.abs(yA - yB) > 20) return yA - yB;
                const xA = parseFloat(rectA.getAttribute("x") || 0);
                const xB = parseFloat(rectB.getAttribute("x") || 0);
                return xA - xB;
            });

        // Options mapping
        const optionGroups = Array.from(optionsPanel.children).filter(
            (g) => g.querySelector("text") && g.style.display !== "none",
        );

        // Track filled slots
        let filledSlots = new Array(dropZones.length).fill(null);
        let clones = []; // To easily reset later if needed

        optionGroups.forEach((g) => {
            g.style.cursor = "pointer";
            g.onclick = () => {
                if (g.classList.contains("used")) return;

                const emptySlotIndex = filledSlots.findIndex((slot) => slot === null);
                if (emptySlotIndex === -1) return; // No empty slots

                const textEl = g.querySelector("text");
                if (!textEl) return;
                const word = Array.from(textEl.querySelectorAll("tspan"))
                    .map((t) => t.textContent)
                    .join("")
                    .trim();

                // Mark as used
                g.classList.add("used");
                g.style.opacity = "0.4";

                // Build a fresh placed pill that exactly fits the destination box
                const NS = "http://www.w3.org/2000/svg";
                const dstGroup = dropZones[emptySlotIndex];
                const dstRect = dstGroup.querySelectorAll("rect")[0];
                const dstX = parseFloat(dstRect.getAttribute("x") || 0);
                const dstY = parseFloat(dstRect.getAttribute("y") || 0);
                const dstW = parseFloat(dstRect.getAttribute("width") || 194);
                const dstH = parseFloat(dstRect.getAttribute("height") || 72);

                const clone = document.createElementNS(NS, "g");
                clone.classList.add("learn-clone");
                clone.style.cursor = "pointer";
                // Outer filled rect
                const outerRect = document.createElementNS(NS, "rect");
                outerRect.setAttribute("x", dstX);
                outerRect.setAttribute("y", dstY);
                outerRect.setAttribute("width", dstW);
                outerRect.setAttribute("height", dstH);
                outerRect.setAttribute("rx", "14"); outerRect.setAttribute("ry", "14");
                outerRect.setAttribute("fill", "#0480eb");
                clone.appendChild(outerRect);

                // Inner border rect
                const innerRect = document.createElementNS(NS, "rect");
                innerRect.setAttribute("x", dstX + 2);
                innerRect.setAttribute("y", dstY + 2);
                innerRect.setAttribute("width", dstW - 4);
                innerRect.setAttribute("height", dstH - 4);
                innerRect.setAttribute("rx", "12"); innerRect.setAttribute("ry", "12");
                innerRect.setAttribute("fill", "none");
                innerRect.setAttribute("stroke", "#003a6c");
                innerRect.setAttribute("stroke-width", "4");
                clone.appendChild(innerRect);

                // Word text — centered in the box
                const wordText = document.createElementNS(NS, "text");
                wordText.setAttribute("x", dstX + dstW / 2);
                wordText.setAttribute("y", dstY + dstH / 2);
                wordText.setAttribute("fill", "#fff");
                wordText.setAttribute("font-family", "Roboto-Regular, Roboto");
                wordText.setAttribute("font-size", "38");
                wordText.setAttribute("text-anchor", "middle");
                wordText.setAttribute("dominant-baseline", "middle");
                const ts = document.createElementNS(NS, "tspan");
                ts.textContent = word;
                wordText.appendChild(ts);
                clone.appendChild(wordText);


                // Make the clone removable
                clone.onclick = () => {
                    clone.remove();
                    filledSlots[emptySlotIndex] = null;
                    g.classList.remove("used");
                    g.style.opacity = "1";

                    correct.style.display = "none";
                    incorrect.style.display = "none";
                    nextBtn.style.display = "none";
                };

                dropZonesParent.appendChild(clone);
                scaleTextToFit(wordText, dstW - 24); // Scaling for Learn slots
                filledSlots[emptySlotIndex] = { word, clone };
                clones.push(clone);

                // Check completion
                if (filledSlots.findIndex((slot) => slot === null) === -1) {
                    const currentSequence = filledSlots.map((s) => s.word);
                    const isCorrect = currentSequence.every(
                        (w, i) => w === targetSequence[i],
                    );

                    if (isCorrect) {
                        correct.style.display = "block";
                        incorrect.style.display = "none";
                        onComplete(true);
                    } else {
                        incorrect.style.display = "block";
                        correct.style.display = "none";
                        onComplete(false);
                    }
                }
            };
        });
    }

    learnBtn.addEventListener("click", () => {
        hideAll();
        IText.style.display = "block";
        learnPanel1.style.display = "block";
        learnPanel2.style.display = "block";
        learnPanel3.style.display = "block";
        homeBtn.style.display = "block";
        progressBar.style.display = "block";

        // Reset instruction text to its original 2-line state
        const iTextEl = IText.querySelector("text");
        if (iTextEl) {
            iTextEl.innerHTML =
                '<tspan x="0" y="0">Look at the sentence. Does the person who does</tspan>' +
                '<tspan x="0" y="36">the action come FIRST? Select the correct box.</tspan>';
        }

        currentLearnQuestion = 0;
        loadLearnQuestion(currentLearnQuestion);
    });

    // Next / Continue button handler (for Learn mode)
    nextBtn.addEventListener("click", () => {
        if (learnPanel1.style.display === "block") {
            currentLearnQuestion++;
            if (currentLearnQuestion < learnQuestions.length) {
                loadLearnQuestion(currentLearnQuestion);
            } else {
                showFinalLearnScreen();
            }
        } else if (question2Panel.style.display === "block") {
            showActiveComparison();
        } else if (comparePanel.style.display === "block" && nextBtn.style.display === "block") {
            showFullComparison();
        }
    });

    practiseBtn.addEventListener("click", () => {
        currentPractiseQuestion = 0;
        showPractisePanel(currentPractiseQuestion);
    });

    homeBtn.addEventListener("click", () => {
        initGame();
    });

    initGame();

    function adjustActiveSentenceBoxWidth(textSelector, rectSelector) {
        const textEl = document.querySelector(textSelector);
        const rects = document.querySelectorAll(rectSelector);
        if (!textEl || rects.length === 0) return;

        // Get the actual width of the text
        const textWidth = textEl.getComputedTextLength();
        const padding = 120; // More padding for premium look
        const minWidth = 800; // Increased min width
        const finalWidth = Math.max(minWidth, textWidth + padding);

        // Center point is x=1035
        const centerX = 1035;
        const newX = centerX - finalWidth / 2;

        rects.forEach(rect => {
            rect.setAttribute("width", finalWidth);
            rect.setAttribute("x", newX);
        });
    }

    function scaleTextToFit(textEl, maxWidth, initialFontSize = 38) {
        if (!textEl) return;
        let fontSize = initialFontSize;
        textEl.setAttribute("font-size", fontSize);
        while (textEl.getComputedTextLength() > maxWidth && fontSize > 10) {
            fontSize -= 1;
            textEl.setAttribute("font-size", fontSize);
        }
    }
});
