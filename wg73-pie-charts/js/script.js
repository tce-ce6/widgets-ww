document.addEventListener("DOMContentLoaded", () => {
    const elementsToHide = [
        "Card_Complited_state",
        "I-Text_Home_Screen",
        "Base_panel",
        "PIe_Chart-Ref_Image_Not_for_use",
        "Data_table",
        "Pie-Chart_Angle_UI",
        "Pie-Chart_Angle_selector",
        "Angle_selection_UI",
        "Pie_Chart-Lables",
        "I-Text-Arrow",
        "BTNs-Global",
        "Question-TOS",
        "Activity_Title",
        "Group_1689",
        "Group_16891",
        "Group_16892",
        "Group_16893"
    ];

    elementsToHide.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    // Configuration for different games
    const gameConfigs = {
        budget: {
            title: "School Budget Distribution",
            categoryHeader: "Department",
            valueHeader: "Amount (₹ in lakhs)",
            questionRows: [
                "A school's annual budget of ₹12 lakh is distributed among various ",
                "departments. The largest allocation of ₹4 lakh goes to infrastructure ",
                "development. Teacher salaries get ₹3 lakh, sports facilities ₹2 lakh, ",
                "and library, laboratory, and events each receive ₹1 lakh. ",
                "Draw a pie chart showing the school budget distribution."
            ],
            tableRows: [
                { id: "Infrastructure", label: "Infrastructure", value: "₹4 lakh", expectedAngle: 120, color: '#2196f3' },
                { id: "Salaries", label: "Salaries", value: "₹3 lakh", expectedAngle: 90, color: '#ff9800' },
                { id: "Sports", label: "Sports", value: "₹2 lakh", expectedAngle: 60, color: '#e91e63' },
                { id: "Library", label: "Library", value: "₹1 lakh", expectedAngle: 30, color: '#ffeb3b' },
                { id: "Laboratory", label: "Laboratory", value: "₹1 lakh", expectedAngle: 30, color: '#8bc34a' },
                { id: "Events", label: "Events", value: "₹1 lakh", expectedAngle: 30, color: '#4caf50' }
            ],
            totalLabel: "Total",
            totalValue: "₹12 lakh",
            totalAngle: "360°"
        },
        daily: {
            title: "Daily Activities Chart",
            categoryHeader: "Activity",
            valueHeader: "Hours (h)",
            questionRows: [
                "A Class 6 student recorded how they spend their 24 hours in a typical day.",
                "Maximum time (8 hours) goes to sleeping, followed by 6 hours in school.",
                "Playing and other activities take 3 hours each, while studying and eating",
                "take 2 hours each. Draw a pie chart to represent how the student",
                "spends 24 hours in a day."
            ],
            tableRows: [
                { id: "Sleeping", label: "Sleeping", value: "8", expectedAngle: 120, color: '#4caf50' },
                { id: "School", label: "School", value: "6", expectedAngle: 90, color: '#03a9f4' },
                { id: "Playing", label: "Playing", value: "3", expectedAngle: 45, color: '#797b7e' },
                { id: "Studying", label: "Studying", value: "2", expectedAngle: 30, color: '#f44336' },
                { id: "Eating", label: "Eating", value: "2", expectedAngle: 30, color: '#ffabc5' },
                { id: "Others", label: "Others", value: "3", expectedAngle: 45, color: '#9c27b0' }
            ],
            totalLabel: "Total",
            totalValue: "24",
            totalAngle: "360°"
        },
        icecream: {
            title: "Favorite Ice Cream Flavors",
            categoryHeader: "Flavor",
            valueHeader: "Number of Students",
            questionRows: [
                "A survey was conducted among 360 Class 6 students about their favorite ice cream",
                "flavor. Chocolate emerged as the clear favorite with 120 votes (1/3 of students).",
                "Vanilla received 90 votes, while Strawberry and Mango each got 60 votes.",
                "Butterscotch was least popular with 30 votes.",
                "Represent the ice cream flavor survey data using a pie chart."
            ],
            tableRows: [
                { id: "Chocolate", label: "Chocolate", value: "120", expectedAngle: 120, color: '#2196f3' },
                { id: "Vanilla", label: "Vanilla", value: "90", expectedAngle: 90, color: '#ff9800' },
                { id: "Strawberry", label: "Strawberry", value: "60", expectedAngle: 60, color: '#9e9e9e' },
                { id: "Mango", label: "Mango", value: "60", expectedAngle: 60, color: '#ffeb3b' },
                { id: "Butterscotch", label: "Butterscotch", value: "30", expectedAngle: 30, color: '#8fceff' }
            ],
            totalLabel: "Total",
            totalValue: "360",
            totalAngle: "360°"
        },
        air: {
            title: "Composition of Air (Simplified)",
            categoryHeader: "Gas",
            valueHeader: "Parts",
            questionRows: [
                "Air is a mixture of different gases. This simplified model shows nitrogen as",
                "the major component (6 parts out of 12), oxygen as the second major",
                "component (3 parts), carbon dioxide (2 parts), and other gases including",
                "argon and water vapor (1 part).",
                "Create a pie chart to show the composition of air. Calculate the central",
                "angle for each gas component and draw the sectors."
            ],
            tableRows: [
                { id: "Nitrogen", label: "Nitrogen", value: "6", expectedAngle: 180, color: '#3f51b5' },
                { id: "Oxygen", label: "Oxygen", value: "3", expectedAngle: 90, color: '#ff9800' },
                { id: "CarbonDioxide", label: "Carbon Dioxide", value: "2", expectedAngle: 60, color: '#9e9e9e' },
                { id: "OtherGases", label: "Other Gases", value: "1", expectedAngle: 30, color: '#ffeb3b' }
            ],
            totalLabel: "Total",
            totalValue: "12",
            totalAngle: "360°"
        }
    };

    let completedGames = {
        budget: false,
        daily: false,
        icecream: false,
        air: false
    };

    let currentGameKey = null;
    let currentPieCategories = [];
    let currentCumulativeAngle = 0;
    const gameKeys = ['daily', 'budget', 'icecream', 'air'];

    let feedbackAnims = {};

    function initFeedbackAnims() {
        const correctContainer = document.getElementById('lottie-correct');
        const incorrectContainer = document.getElementById('lottie-incorrect');

        if (correctContainer) {
            feedbackAnims.happy = lottie.loadAnimation({
                container: correctContainer,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: 'assets/anim/emoji_happy-star.json'
            });
        }

        if (incorrectContainer) {
            feedbackAnims.sad = lottie.loadAnimation({
                container: incorrectContainer,
                renderer: 'svg',
                loop: false,
                autoplay: false,
                path: 'assets/anim/emoji-sad.json'
            });
        }
    }

    function showHomeScreen() {
        currentGameKey = null;
        const homeElements = ["Card_default_state", "I-Text_Home_Screen"];
        const gameElements = [
            "Base_panel", "Data_table", "Pie-Chart_Angle_UI", "Pie-Chart_Angle_selector",
            "Angle_selection_UI", "Pie_Chart-Lables", "I-Text-Arrow", "BTNs-Global",
            "Question-TOS", "Activity_Title", "custom-popup-fo", "dynamic-sectors", "answer_popup"
        ];

        gameElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });
        const navElements = ["Group_1531", "Group_1643"];
        navElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });

        homeElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "block";
        });

        const completedState = document.getElementById("Card_Complited_state");
        if (completedState) {
            completedState.style.display = "block";
            const budgetTick = document.getElementById("Group_16891");
            if (budgetTick) budgetTick.style.display = completedGames.budget ? "block" : "none";

            const dailyTick = document.getElementById("Group_1689");
            if (dailyTick) dailyTick.style.display = completedGames.daily ? "block" : "none";

            const icecreamTick = document.getElementById("Group_16892");
            if (icecreamTick) icecreamTick.style.display = completedGames.icecream ? "block" : "none";

            const airTick = document.getElementById("Group_16893");
            if (airTick) airTick.style.display = completedGames.air ? "block" : "none";
        }
    }

    function loadGame(gameKey) {
        currentGameKey = gameKey;
        const config = gameConfigs[gameKey];

        const titleText = document.getElementById("activity-html-content");
        if (titleText) titleText.textContent = config.title;

        const categoryHeaderEl = document.querySelector("g[id='Department'] text tspan");
        if (categoryHeaderEl) categoryHeaderEl.textContent = config.categoryHeader;

        const valueHeaderEl = document.querySelector("g[id='Amount_in_lakhs_'] text tspan");
        if (valueHeaderEl) valueHeaderEl.textContent = config.valueHeader;

        const valueHeaderPieEl = document.querySelector("g[id='Amount_in_lakhs_2'] text tspan");
        if (valueHeaderPieEl) valueHeaderPieEl.textContent = config.valueHeader;

        const tosContent = document.getElementById("tos-html-content");
        if (tosContent) {
            tosContent.textContent = config.questionRows.join(" ");
        }

        const tableGroups = ["Group_1539", "Group_1540", "Group_1541", "Group_1542", "Group_1543", "Group_1544"];
        tableGroups.forEach((id, i) => {
            const group = document.getElementById(id);
            if (!group) return;
            if (i < config.tableRows.length) {
                group.style.display = "block";
                const row = config.tableRows[i];
                const labelText = group.querySelector("g[isolation='isolate'] text");
                if (labelText) {
                    const tspans = labelText.querySelectorAll("tspan");
                    if (tspans.length > 0) {
                        tspans[0].textContent = row.label;
                        for (let j = 1; j < tspans.length; j++) tspans[j].textContent = "";
                    } else labelText.textContent = row.label;
                }
                const valueGroup = group.querySelector("g[id^='_'] text tspan");
                if (valueGroup) valueGroup.textContent = row.value;
                const rowPath = group.querySelector("path[fill]:not([fill='none'])");
                if (rowPath) rowPath.setAttribute('fill', row.color);
            } else {
                group.style.display = "none";
            }
        });

        const totalGroup = document.getElementById("Group_1545");
        const rowHeight = 74;
        const maxRows = 6;
        const activeRows = config.tableRows.length;
        const moveUpBy = (maxRows - activeRows) * rowHeight;

        if (totalGroup) {
            totalGroup.style.display = "block";
            if (activeRows < maxRows) {
                totalGroup.setAttribute("transform", `translate(0, -${moveUpBy})`);
            } else {
                totalGroup.setAttribute("transform", `translate(0, 0)`);
            }
            const totalValText = totalGroup.querySelector("g[id='_12'] text tspan");
            if (totalValText) totalValText.textContent = config.totalValue;
        }

        const pieLabels = ["Group_1669", "Group_1670", "Group_1671", "Group_1672", "Group_1673", "Group_1674"];
        pieLabels.forEach((id, i) => {
            const labelGroup = document.getElementById(id);
            if (!labelGroup) return;
            if (i < config.tableRows.length) {
                // Labels are hidden until the segment is drawn
                labelGroup.style.display = "block";
                const row = config.tableRows[i];
                const textEl = labelGroup.querySelector("text tspan");
                if (textEl) {
                    let unit = '';
                    if (gameKey === 'daily') unit = 'h';
                    else if (gameKey === 'air') unit = row.value === '1' ? ' part' : ' parts';
                    textEl.textContent = row.value + unit;
                }
            } else {
                labelGroup.style.display = "none";
            }
        });

        const btnSuffixes = ["", "-2", "-3", "-4"];
        const specialBtns = ["Group_1681", "Group_1682"];
        for (let i = 0; i < 6; i++) {
            const inputId = i < 4 ? "Group_1654" + btnSuffixes[i] : "Group_1654-" + (i + 1);
            const circleId = i < 4 ? "Group_1653" + btnSuffixes[i] : specialBtns[i - 4];

            const inputEl = document.getElementById(inputId);
            const circleEl = document.getElementById(circleId);

            if (inputEl) inputEl.style.display = i < config.tableRows.length ? "block" : "none";
            if (circleEl) circleEl.style.display = i < config.tableRows.length ? "block" : "none";
        }

        currentPieCategories = config.tableRows.map((row, i) => {
            let btnId, dotId, pathId, rectGroupId, cx, cy;
            if (i < 4) {
                btnId = "Group_1653" + btnSuffixes[i];
                dotId = "Ellipse_3" + btnSuffixes[i];
                pathId = "Path_4273" + btnSuffixes[i];
                rectGroupId = "Group_1654" + btnSuffixes[i];
                cx = 828.5; cy = 571.59 + (i * 74);
            } else {
                btnId = specialBtns[i - 4];
                dotId = "Ellipse_3-" + (i + 1);
                pathId = "Path_4273-" + (i + 1);
                rectGroupId = "Group_1654-" + (i + 1);
                cx = 828.5; cy = 867.59 + ((i - 4) * 74);
            }
            return {
                id: row.id, label: row.label, expectedAngle: row.expectedAngle, color: row.color,
                btnId, dotId, pathId, rectGroupId, cx, cy, r: 32.5, valueText: row.value
            };
        });

        const elementsToShow = [
            "Base_panel", "Data_table", "Pie-Chart_Angle_UI", "Pie-Chart_Angle_selector",
            "Angle_selection_UI", "I-Text-Arrow", "BTNs-Global", "Pie_Chart-Lables",
            "Question-TOS", "Activity_Title", "dynamic-sectors"
        ];
        elementsToShow.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "block";
        });

        const nextBtn = document.getElementById("Group_1531");
        const prevBtn = document.getElementById("Group_1643");
        if (nextBtn) nextBtn.style.display = "block";
        if (prevBtn) prevBtn.style.display = "block";

        const gameIndex = gameKeys.indexOf(gameKey);
        if (prevBtn) {
            if (gameIndex === 0) {
                prevBtn.style.opacity = "0.5";
                prevBtn.style.pointerEvents = "none";
            } else {
                prevBtn.style.opacity = "1";
                prevBtn.style.pointerEvents = "auto";
                prevBtn.style.cursor = "pointer";
            }
        }
        if (nextBtn) {
            if (gameIndex === gameKeys.length - 1) {
                nextBtn.style.opacity = "0.5";
                nextBtn.style.pointerEvents = "none";
            } else {
                nextBtn.style.opacity = "1";
                nextBtn.style.pointerEvents = "auto";
                nextBtn.style.cursor = "pointer";
            }
        }

        const homeText = document.getElementById("I-Text_Home_Screen");
        if (homeText) homeText.style.display = "none";
        const defaultState = document.getElementById("Card_default_state");
        if (defaultState) defaultState.style.display = "none";

        initPieChartLogic();
    }

    const dailyCard = document.getElementById("Group_1684");
    if (dailyCard) {
        dailyCard.style.cursor = "pointer";
        dailyCard.addEventListener("click", () => loadGame('daily'));
    }

    const budgetCard = document.getElementById("Group_1685");
    if (budgetCard) {
        budgetCard.style.cursor = "pointer";
        budgetCard.addEventListener("click", () => loadGame('budget'));
    }

    const icecreamCard = document.getElementById("Group_1686");
    if (icecreamCard) {
        icecreamCard.style.cursor = "pointer";
        icecreamCard.addEventListener("click", () => loadGame('icecream'));
    }

    const airCard = document.getElementById("Group_1687");
    if (airCard) {
        airCard.style.cursor = "pointer";
        airCard.addEventListener("click", () => loadGame('air'));
    }

    const homeBtn = document.getElementById("Group_1688");
    if (homeBtn) {
        homeBtn.style.cursor = "pointer";
        homeBtn.addEventListener("click", showHomeScreen);
    }

    function describeArc(x, y, r, startAngle, endAngle) {
        const polarToCartesian = (cx, cy, r, angleInDegrees) => {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return { x: cx + (r * Math.cos(angleInRadians)), y: cy + (r * Math.sin(angleInRadians)) };
        };
        const start = polarToCartesian(x, y, r, endAngle);
        const end = polarToCartesian(x, y, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        return ["M", x, y, "L", end.x, end.y, "A", r, r, 0, largeArcFlag, 1, start.x, start.y, "Z"].join(" ");
    }

    function createPopup(text, isSolution = false) {
        console.log("createPopup", text, isSolution);

        if (isSolution) {
            const answerPopup = document.getElementById('answer_popup');
            if (!answerPopup) return;

            const sectorsContainer = document.getElementById('answer-popup-sectors');
            if (sectorsContainer) sectorsContainer.innerHTML = '';

            const ringContainer = document.getElementById('answer-popup-ring');
            if (ringContainer) {
                ringContainer.innerHTML = '';
                // Clone the degree tick ring from the main SVG and shift it
                // Main ring center: 1411.5, 536.59 → popup ring center: 465, 430
                // Popup has transform="translate(1010,165)", so in global terms popup center = 1475, 595
                // Radius r=235 vs original r=279. Scale = 235/279 = 0.8423
                // Shift: 0.8423 * 1411.5 + Tx = 465 -> Tx = -723.89
                // Shift: 0.8423 * 536.59 + Ty = 430 -> Ty = -21.96
                const ringTransform = `translate(-723.89, -21.96) scale(0.8423)`;
                const mainRing = document.getElementById('Group_1650');
                if (mainRing) {
                    const ringClone = mainRing.cloneNode(true);
                    ringClone.removeAttribute('id');
                    ringClone.setAttribute('transform', ringTransform);
                    ringContainer.appendChild(ringClone);
                }
            }

            const svgNS = 'http://www.w3.org/2000/svg';
            // Match the new smaller pie: cx=465, cy=430, r=235
            const cx = 465, cy = 430, r = 235;

            let popCumulativeAngle = 0;
            currentPieCategories.forEach(cat => {
                const startA = popCumulativeAngle;
                const endA = popCumulativeAngle + cat.expectedAngle;

                // Sector
                const sector = document.createElementNS(svgNS, 'path');
                sector.setAttribute('d', describeArc(cx, cy, r, startA, endA));
                sector.setAttribute('fill', cat.color);
                sector.setAttribute('stroke', '#fff');
                sector.setAttribute('stroke-width', '2');
                sectorsContainer.appendChild(sector);

                // Label – adaptive radius: small slices get a tighter inner position
                const midAngle = startA + (cat.expectedAngle / 2);
                const midRad = (midAngle - 90) * Math.PI / 180.0;
                // Use 55% of r for slices < 45°, 65% for larger slices
                const labelR = cat.expectedAngle < 45 ? r * 0.45 : r * 0.62;
                const lx = cx + labelR * Math.cos(midRad);
                const ly = cy + labelR * Math.sin(midRad);

                let unit = '';
                if (currentGameKey === 'daily') unit = 'h';
                else if (currentGameKey === 'air') unit = cat.valueText === '1' ? ' part' : ' parts';
                const labelStr = cat.valueText + unit;

                // White rounded rect label
                const labelRect = document.createElementNS(svgNS, 'rect');
                const labelW = 80, labelH = 34;
                labelRect.setAttribute('x', lx - labelW / 2); labelRect.setAttribute('y', ly - labelH / 2);
                labelRect.setAttribute('width', labelW); labelRect.setAttribute('height', labelH);
                labelRect.setAttribute('rx', 5); labelRect.setAttribute('fill', '#fff');
                sectorsContainer.appendChild(labelRect);

                const textEl = document.createElementNS(svgNS, 'text');
                textEl.setAttribute('x', lx); textEl.setAttribute('y', ly + 6);
                textEl.setAttribute('text-anchor', 'middle');
                textEl.setAttribute('font-size', '18');
                textEl.setAttribute('font-family', 'Roboto, sans-serif');
                textEl.setAttribute('fill', '#424242');
                textEl.textContent = labelStr;
                sectorsContainer.appendChild(textEl);

                popCumulativeAngle = endA;
            });

            // Wire close button
            const closeBtn = document.getElementById('answer-popup-close-btn');
            if (closeBtn) {
                const newClose = closeBtn.cloneNode(true);
                closeBtn.parentNode.replaceChild(newClose, closeBtn);
                newClose.addEventListener('click', () => { answerPopup.style.display = 'none'; });
            }

            answerPopup.style.display = 'block';

            // Update the amount label dynamically
            const amountLabelEl = answerPopup.querySelector('text[data-role="amount-label"]');
            if (amountLabelEl && currentGameKey && gameConfigs[currentGameKey]) {
                amountLabelEl.textContent = gameConfigs[currentGameKey].valueHeader;
            }
        } else {
            const popupFO = document.getElementById('custom-popup-fo');
            if (popupFO) {
                const content = document.getElementById('custom-popup-content');
                const textContainer = document.getElementById('custom-popup-text');
                const solutionTitle = document.getElementById('custom-popup-solution-title');
                const closeBtn = document.getElementById('custom-popup-close');
                const svgContainer = document.getElementById('custom-popup-solution-svg-container');

                if (content && textContainer && solutionTitle && closeBtn && svgContainer) {
                    content.classList.remove('popup-default', 'popup-solution');
                    solutionTitle.style.display = 'none'; closeBtn.style.display = 'none';
                    svgContainer.style.display = 'none'; textContainer.style.display = 'none';
                    svgContainer.innerHTML = '';

                    content.classList.add('popup-default');
                    textContainer.style.display = 'block';
                    textContainer.textContent = text;
                    setTimeout(() => { popupFO.style.display = 'none'; }, 2000);
                    popupFO.style.display = 'block';
                }
            }
        }
    }

    function initPieChartLogic() {
        const selector = document.getElementById('Pie-Chart_Angle_selector');
        let dynamicSectors = document.getElementById('dynamic-sectors');
        if (!dynamicSectors && selector) {
            dynamicSectors = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            dynamicSectors.id = 'dynamic-sectors';
            selector.parentNode.insertBefore(dynamicSectors, selector);
        }

        const lineGroup = document.getElementById('Group_1675');
        const updateSubmitResetState = () => {
            const allFilled = currentPieCategories.every(cat => cat.inputEl && cat.inputEl.value.trim() !== "");
            const btns = ['Group_1647', 'Group_1161', 'Group_540'];
            btns.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    if (allFilled) {
                        el.style.opacity = "1";
                        el.style.pointerEvents = "auto";
                        el.style.cursor = "pointer";
                    } else {
                        el.style.opacity = "0.5";
                        el.style.pointerEvents = "none";
                    }
                }
            });
        };

        const resetChart = () => {
            currentCumulativeAngle = 0;
            if (dynamicSectors) dynamicSectors.innerHTML = '';
            if (lineGroup) lineGroup.setAttribute('transform', `rotate(0, 1411.5, 536.59)`);
            currentPieCategories.forEach(cat => {
                cat.plotted = false; cat.inputAngle = 0;
                if (cat.inputEl) cat.inputEl.value = '0';
                const dot = document.getElementById(cat.dotId);
                const path = document.getElementById(cat.pathId);
                if (dot) dot.style.display = 'block'; // Keep dot showing center
                if (path) {
                    path.style.display = 'block';
                    // Reset to 0 degrees arm
                    path.setAttribute('d', `M${cat.cx},${cat.cy} L${cat.cx},${cat.cy - 31}`);
                }
            });
            // Hide all labels on reset
            const pieLabelsReset = ["Group_1669", "Group_1670", "Group_1671", "Group_1672", "Group_1673", "Group_1674"];
            pieLabelsReset.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
            // Draw white background circle
            if (dynamicSectors) {
                const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                bgCircle.setAttribute('cx', '1411.5'); bgCircle.setAttribute('cy', '536.59'); bgCircle.setAttribute('r', '279');
                bgCircle.setAttribute('fill', '#ffffff');
                dynamicSectors.appendChild(bgCircle);
            }
            updateSubmitResetState();
        };

        resetChart();

        currentPieCategories.forEach(cat => {
            const plotSegment = () => {
                if (cat.plotted) return;
                const inputVal = cat.inputAngle || 0;
                if (inputVal <= 0) { createPopup('Please enter an angle first!', false); return; }
                const startA = currentCumulativeAngle;
                const endA = currentCumulativeAngle + inputVal;
                if (dynamicSectors) {
                    const sectorPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    sectorPath.setAttribute('d', describeArc(1411.5, 536.59, 279, startA, endA));
                    sectorPath.setAttribute('fill', cat.color); sectorPath.setAttribute('stroke', '#fff'); sectorPath.setAttribute('stroke-width', '2');
                    dynamicSectors.appendChild(sectorPath);
                }
                currentCumulativeAngle = endA; cat.plotted = true;
                if (lineGroup) lineGroup.setAttribute('transform', `rotate(${currentCumulativeAngle}, 1411.5, 536.59)`);
                const dot = document.getElementById(cat.dotId); if (dot) dot.style.display = 'block';
                // Show label for this segment
                const labelIds = ["Group_1669", "Group_1670", "Group_1671", "Group_1672", "Group_1673", "Group_1674"];
                const catIdx = currentPieCategories.findIndex(c => c.id === cat.id);
                if (catIdx !== -1 && labelIds[catIdx]) {
                    const lbl = document.getElementById(labelIds[catIdx]);
                    if (lbl) lbl.style.display = 'block';
                }
            };

            const parentGroup = document.getElementById(cat.rectGroupId);
            if (parentGroup) {
                const oldFO = parentGroup.querySelector('foreignObject'); if (oldFO) oldFO.remove();
                const textGroups = Array.from(parentGroup.querySelectorAll('g[id^="_"]'));
                textGroups.forEach(tg => tg.style.display = 'none');
                const rect = parentGroup.querySelector('rect');
                if (rect) {
                    const updateRadiusArm = (angle) => {
                        const pathEl = document.getElementById(cat.pathId);
                        if (pathEl) {
                            pathEl.style.display = 'block';
                            const rad = (angle - 90) * Math.PI / 180.0;
                            const rx = cat.cx + (31 * Math.cos(rad));
                            const ry = cat.cy + (31 * Math.sin(rad));
                            pathEl.setAttribute('d', `M${cat.cx},${cat.cy} L${rx},${ry}`);
                        }
                    };

                    const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
                    fo.setAttribute('x', rect.getAttribute('x')); fo.setAttribute('y', rect.getAttribute('y'));
                    fo.setAttribute('width', rect.getAttribute('width')); fo.setAttribute('height', rect.getAttribute('height'));
                    
                    const container = document.createElement('div');
                    container.style.display = 'flex'; container.style.alignItems = 'center';
                    container.style.justifyContent = 'center'; container.style.width = '100%'; container.style.height = '100%';

                    const input = document.createElement('input');
                    input.type = 'number'; input.value = '0';
                    input.style.width = '60px'; input.style.height = '100%';
                    input.style.border = 'none'; input.style.background = 'transparent';
                    input.style.textAlign = 'center'; input.style.fontFamily = 'Roboto';
                    input.style.fontSize = '28px'; input.style.fontWeight = '500';
                    input.style.color = '#424242'; input.style.outline = 'none';
                    input.style.padding = '0'; input.style.margin = '0';
                    input.min = '0'; input.max = '360';
                    
                    const degreeSymbol = document.createElement('span');
                    degreeSymbol.textContent = '0';
                    degreeSymbol.style.fontSize = '14px'; degreeSymbol.style.fontWeight = '600';
                    degreeSymbol.style.color = '#424242';
                    degreeSymbol.style.alignSelf = 'center';
                    degreeSymbol.style.marginBottom = '12px';
                    degreeSymbol.style.marginLeft = '1px';

                    container.appendChild(input); container.appendChild(degreeSymbol);
                    fo.appendChild(container); parentGroup.appendChild(fo);
                    cat.inputEl = input;
                    cat.inputAngle = 0;
                    updateRadiusArm(0);

                    input.addEventListener('input', () => {
                        let val = parseFloat(input.value) || 0;
                        if (val < 0) { val = 0; input.value = 0; }
                        if (val > 360) { val = 360; input.value = 360; }
                        cat.inputAngle = val;
                        updateRadiusArm(val);
                        if (!cat.plotted && lineGroup) {
                            const previewAngle = currentCumulativeAngle + cat.inputAngle;
                            lineGroup.setAttribute('transform', `rotate(${previewAngle}, 1411.5, 536.59)`);
                        }
                    });
                    input.addEventListener('input', updateSubmitResetState);
                    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') plotSegment(); });
                }
            }

            const btn = document.getElementById(cat.btnId);
            if (btn) {
                btn.style.cursor = 'pointer';
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);

                let isDragging = false;
                let hasMoved = false;

                const handleMove = (e) => {
                    if (!isDragging) return;
                    hasMoved = true;
                    e.preventDefault();
                    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
                    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
                    
                    const svg = newBtn.ownerSVGElement;
                    const pt = svg.createSVGPoint();
                    pt.x = clientX; pt.y = clientY;
                    const svgPt = pt.matrixTransform(svg.getScreenCTM().inverse());
                    
                    const dx = svgPt.x - cat.cx;
                    const dy = svgPt.y - cat.cy;
                    let angle = Math.atan2(dy, dx) * 180 / Math.PI + 90;
                    if (angle < 0) angle += 360;
                    
                    angle = Math.round(angle);
                    if (angle === 360) angle = 0;
                    
                    cat.inputAngle = angle;
                    if (cat.inputEl) cat.inputEl.value = angle;
                    
                    const pathEl = document.getElementById(cat.pathId);
                    if (pathEl) {
                        pathEl.style.display = 'block';
                        const rad = (angle - 90) * Math.PI / 180.0;
                        const rx = cat.cx + (31 * Math.cos(rad));
                        const ry = cat.cy + (31 * Math.sin(rad));
                        pathEl.setAttribute('d', `M${cat.cx},${cat.cy} L${rx},${ry}`);
                    }
                    
                    if (!cat.plotted && lineGroup) {
                        const previewAngle = currentCumulativeAngle + cat.inputAngle;
                        lineGroup.setAttribute('transform', `rotate(${previewAngle}, 1411.5, 536.59)`);
                    }
                    updateSubmitResetState();
                };

                newBtn.addEventListener('mousedown', (e) => { if(!cat.plotted) { isDragging = true; hasMoved = false; } });
                window.addEventListener('mousemove', handleMove);
                window.addEventListener('mouseup', () => { isDragging = false; });
                
                newBtn.addEventListener('touchstart', (e) => { if(!cat.plotted) { isDragging = true; hasMoved = false; } }, {passive: false});
                window.addEventListener('touchmove', handleMove, {passive: false});
                window.addEventListener('touchend', () => { isDragging = false; });

                newBtn.addEventListener('click', (e) => {
                    if (!hasMoved) plotSegment();
                });
            }
        });

        const submitBtn = document.getElementById('Group_1647');
        if (submitBtn) {
            submitBtn.style.cursor = 'pointer';
            const newSubmit = submitBtn.cloneNode(true);
            submitBtn.parentNode.replaceChild(newSubmit, submitBtn);
            newSubmit.addEventListener('click', () => {
                const allPlotted = currentPieCategories.every(cat => cat.plotted);
                const allCorrect = currentPieCategories.every(cat => cat.inputAngle === cat.expectedAngle);

                const correctPopup = document.getElementById('correct-popup-container');
                const incorrectPopup = document.getElementById('incorrect-popup-container');

                if (allPlotted) {
                    if (allCorrect) {
                        completedGames[currentGameKey] = true;
                        if (correctPopup) {
                            correctPopup.style.display = 'block';
                            if (feedbackAnims.happy) {
                                feedbackAnims.happy.goToAndPlay(0, true);
                            }
                            setTimeout(() => { correctPopup.style.display = 'none'; }, 3000);
                        } else {
                            createPopup('Correct! 🥳');
                        }
                    } else {
                        if (incorrectPopup) {
                            incorrectPopup.style.display = 'block';
                            if (feedbackAnims.sad) {
                                feedbackAnims.sad.goToAndPlay(0, true);
                            }
                            setTimeout(() => { incorrectPopup.style.display = 'none'; }, 3000);
                        } else {
                            createPopup('Incorrect! \u274C', false);
                        }
                    }
                } else {
                    createPopup('Incomplete!', false);
                }
            });
        }

        const nextBtnAction = document.getElementById('Group_1531');
        if (nextBtnAction) {
            const newNext = nextBtnAction.cloneNode(true);
            nextBtnAction.parentNode.replaceChild(newNext, nextBtnAction);
            newNext.addEventListener('click', () => {
                const currentIndex = gameKeys.indexOf(currentGameKey);
                if (currentIndex < gameKeys.length - 1) {
                    loadGame(gameKeys[currentIndex + 1]);
                }
            });
        }

        const prevBtnAction = document.getElementById('Group_1643');
        if (prevBtnAction) {
            const newPrev = prevBtnAction.cloneNode(true);
            prevBtnAction.parentNode.replaceChild(newPrev, prevBtnAction);
            newPrev.addEventListener('click', () => {
                const currentIndex = gameKeys.indexOf(currentGameKey);
                if (currentIndex > 0) {
                    loadGame(gameKeys[currentIndex - 1]);
                }
            });
        }


        const correctPopup = document.getElementById('correct-popup-container');
        if (correctPopup) {
            correctPopup.addEventListener('click', () => correctPopup.style.display = 'none');
        }
        const incorrectPopup = document.getElementById('incorrect-popup-container');
        if (incorrectPopup) {
            incorrectPopup.addEventListener('click', () => incorrectPopup.style.display = 'none');
        }

        const resetBtn = document.getElementById('Group_540');
        if (resetBtn) {
            resetBtn.style.cursor = 'pointer';
            const newReset = resetBtn.cloneNode(true);
            resetBtn.parentNode.replaceChild(newReset, resetBtn);
            newReset.addEventListener('click', resetChart);
        }

        const showAnswerBtn = document.getElementById('Group_1161');
        if (showAnswerBtn) {
            showAnswerBtn.style.cursor = 'pointer';
            const newShow = showAnswerBtn.cloneNode(true);
            showAnswerBtn.parentNode.replaceChild(newShow, showAnswerBtn);
            newShow.addEventListener('click', () => createPopup('', true));
        }
    }
    showHomeScreen();
    initFeedbackAnims();
});
