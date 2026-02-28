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
        "Activity_Title"
    ];

    elementsToHide.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = "none";
        }
    });

    let isBudgetCompleted = false;

    function showHomeScreen() {
        // Elements to show on home screen
        const homeElements = [
            "Card_default_state",
            "I-Text_Home_Screen"
        ];

        // Elements to hide when on home screen (the entire game UI)
        const gameElements = [
            "Base_panel",
            "Data_table",
            "Pie-Chart_Angle_UI",
            "Pie-Chart_Angle_selector",
            "Angle_selection_UI",
            "Pie_Chart-Lables",
            "I-Text-Arrow",
            "BTNs-Global",
            "Question-TOS",
            "Activity_Title",
            "custom-popup-fo",
            "dynamic-sectors"
        ];

        gameElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });

        homeElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "block";
        });

        // Handle completed state visibility
        const completedState = document.getElementById("Card_Complited_state");
        if (completedState) {
            completedState.style.display = isBudgetCompleted ? "block" : "none";
            // Show the specific tick for Budget Distribution
            const budgetTick = document.getElementById("Group_16891");
            if (budgetTick) budgetTick.style.display = isBudgetCompleted ? "block" : "none";
        }
    }

    const homeBtn = document.getElementById("Group_1688");
    if (homeBtn) {
        homeBtn.style.cursor = "pointer";
        homeBtn.addEventListener("click", showHomeScreen);
    }

    const budgetDistributionCard = document.getElementById("Group_1685");
    let isPieChartInitialized = false;

    if (budgetDistributionCard) {
        budgetDistributionCard.style.cursor = "pointer";
        budgetDistributionCard.addEventListener("click", () => {
            const elementsToShow = [
                "Base_panel",
                "Data_table",
                "Pie-Chart_Angle_UI",
                "Pie-Chart_Angle_selector",
                "Angle_selection_UI",
                "Pie_Chart-Lables",
                "I-Text-Arrow",
                "BTNs-Global",
                "Question-TOS",
                "Activity_Title"
            ];

            elementsToShow.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.display = "block";
                }
            });

            // Additionally hide the home text and card state
            const homeText = document.getElementById("I-Text_Home_Screen");
            if (homeText) homeText.style.display = "none";

            const defaultState = document.getElementById("Card_default_state");
            if (defaultState) defaultState.style.display = "none";

            initPieChartLogic();
        });
    }

    /* Pie Chart Generation Logic */
    function describeArc(x, y, r, startAngle, endAngle) {
        const polarToCartesian = (cx, cy, r, angleInDegrees) => {
            const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
            return {
                x: cx + (r * Math.cos(angleInRadians)),
                y: cy + (r * Math.sin(angleInRadians))
            };
        };

        const start = polarToCartesian(x, y, r, endAngle);
        const end = polarToCartesian(x, y, r, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        // SVG sweeps from start to end, moving clockwise
        return [
            "M", x, y,
            "L", end.x, end.y,
            "A", r, r, 0, largeArcFlag, 1, start.x, start.y,
            "Z"
        ].join(" ");
    }

    const pieCategories = [
        { id: 'Infrastructure', expectedAngle: 120, color: '#2196f3', btnId: 'Group_1653', dotId: 'Ellipse_3', pathId: 'Path_4273', rectGroupId: 'Group_1654', cx: 828.5, cy: 571.59, r: 32.5 },
        { id: 'Salaries', expectedAngle: 90, color: '#ff9800', btnId: 'Group_1653-2', dotId: 'Ellipse_3-2', pathId: 'Path_4273-2', rectGroupId: 'Group_1654-2', cx: 828.5, cy: 645.59, r: 32.5 },
        { id: 'Sports', expectedAngle: 60, color: '#e91e63', btnId: 'Group_1653-3', dotId: 'Ellipse_3-3', pathId: 'Path_4273-3', rectGroupId: 'Group_1654-3', cx: 828.5, cy: 719.59, r: 32.5 },
        { id: 'Library', expectedAngle: 30, color: '#ffeb3b', btnId: 'Group_1653-4', dotId: 'Ellipse_3-4', pathId: 'Path_4273-4', rectGroupId: 'Group_1654-4', cx: 828.5, cy: 793.59, r: 32.5 },
        { id: 'Laboratory', expectedAngle: 30, color: '#8bc34a', btnId: 'Group_1681', dotId: 'Ellipse_3-5', pathId: 'Path_4273-5', rectGroupId: 'Group_1654-5', cx: 828.5, cy: 867.59, r: 32.5 },
        { id: 'Events', expectedAngle: 30, color: '#4caf50', btnId: 'Group_1682', dotId: 'Ellipse_3-6', pathId: 'Path_4273-6', rectGroupId: 'Group_1654-6', cx: 828.5, cy: 941.59, r: 32.5 }
    ];

    let currentCumulativeAngle = 0;

    function createPopup(text, isSolution = false) {
        const popupFO = document.getElementById('custom-popup-fo');
        if (!popupFO) return;

        const content = document.getElementById('custom-popup-content');
        const textContainer = document.getElementById('custom-popup-text');
        const solutionTitle = document.getElementById('custom-popup-solution-title');
        const closeBtn = document.getElementById('custom-popup-close');
        const svgContainer = document.getElementById('custom-popup-solution-svg-container');

        if (!content || !textContainer || !solutionTitle || !closeBtn || !svgContainer) return;

        // Reset visibility/classes
        content.classList.remove('popup-default', 'popup-solution');
        solutionTitle.style.display = 'none';
        closeBtn.style.display = 'none';
        svgContainer.style.display = 'none';
        textContainer.style.display = 'none';
        svgContainer.innerHTML = '';

        if (isSolution) {
            content.classList.add('popup-solution');
            solutionTitle.style.display = 'block';
            closeBtn.style.display = 'flex';
            svgContainer.style.display = 'block';

            closeBtn.onclick = () => { popupFO.style.display = 'none'; };

            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            svg.setAttribute('viewBox', '0 0 600 600');
            svg.style.width = '100%';
            svg.style.height = '100%';

            let popCumulativeAngle = 0;
            pieCategories.forEach(cat => {
                const startA = popCumulativeAngle;
                const endA = popCumulativeAngle + cat.expectedAngle;

                const sector = document.createElementNS(svgNS, 'path');
                sector.setAttribute('d', describeArc(300, 300, 200, startA, endA));
                sector.setAttribute('fill', cat.color);
                sector.setAttribute('stroke', '#fff');
                sector.setAttribute('stroke-width', '1');
                svg.appendChild(sector);

                const midAngle = startA + (cat.expectedAngle / 2);
                const midRad = (midAngle - 90) * Math.PI / 180.0;
                const lx = 300 + 120 * Math.cos(midRad);
                const ly = 300 + 120 * Math.sin(midRad);

                const amountText = {
                    'Infrastructure': '₹4 lakh',
                    'Salaries': '₹3 lakh',
                    'Sports': '₹2 lakh',
                    'Library': '₹1 lakh',
                    'Laboratory': '₹1 lakh',
                    'Events': '₹1 lakh'
                }[cat.id];

                const rect = document.createElementNS(svgNS, 'rect');
                rect.setAttribute('x', lx - 30);
                rect.setAttribute('y', ly - 15);
                rect.setAttribute('width', 60);
                rect.setAttribute('height', 30);
                rect.setAttribute('rx', 5);
                rect.setAttribute('fill', '#fff');
                svg.appendChild(rect);

                const textEl = document.createElementNS(svgNS, 'text');
                textEl.setAttribute('x', lx);
                textEl.setAttribute('y', ly + 5);
                textEl.setAttribute('text-anchor', 'middle');
                textEl.setAttribute('font-size', '14');
                textEl.setAttribute('fill', '#424242');
                textEl.textContent = amountText;
                svg.appendChild(textEl);

                popCumulativeAngle = endA;
            });
            svgContainer.appendChild(svg);
        } else {
            content.classList.add('popup-default');
            textContainer.style.display = 'block';
            textContainer.textContent = text;

            setTimeout(() => { popupFO.style.display = 'none'; }, 2000);
        }

        popupFO.style.display = 'block';
    }

    function initPieChartLogic() {
        if (isPieChartInitialized) return;
        isPieChartInitialized = true;

        const style = document.createElement('style');
        style.innerHTML = `
            input[type="number"]::-webkit-outer-spin-button,
            input[type="number"]::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
            input[type="number"] {
                -moz-appearance: textfield;
            }
        `;
        document.head.appendChild(style);

        const selector = document.getElementById('Pie-Chart_Angle_selector');
        let dynamicSectors;
        if (selector) {
            dynamicSectors = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            dynamicSectors.id = 'dynamic-sectors';
            selector.parentNode.insertBefore(dynamicSectors, selector);
        }

        const lineGroup = document.getElementById('Group_1675');

        const resetChart = () => {
            currentCumulativeAngle = 0;
            if (dynamicSectors) dynamicSectors.innerHTML = '';
            if (lineGroup) lineGroup.setAttribute('transform', `rotate(0, 1411.5, 536.59)`);
            pieCategories.forEach(cat => {
                cat.plotted = false;
                cat.inputAngle = 0;
                if (cat.inputEl) cat.inputEl.value = '';
                const dot = document.getElementById(cat.dotId);
                const path = document.getElementById(cat.pathId);
                if (dot) dot.style.display = 'none';
                if (path) {
                    path.style.display = 'none';
                    path.setAttribute('d', `M${cat.cx},${cat.cy} L${cat.cx},${cat.cy}`);
                }
            });
        };

        pieCategories.forEach(cat => {
            const plotSegment = () => {
                if (cat.plotted) return;

                const inputVal = cat.inputAngle || 0;
                if (inputVal <= 0) {
                    createPopup('Please enter an angle first!', false);
                    return;
                }

                const startA = currentCumulativeAngle;
                const endA = currentCumulativeAngle + inputVal;

                if (dynamicSectors) {
                    const sectorPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    sectorPath.setAttribute('d', describeArc(1411.5, 536.59, 279, startA, endA));
                    sectorPath.setAttribute('fill', cat.color);
                    sectorPath.setAttribute('stroke', '#fff');
                    sectorPath.setAttribute('stroke-width', '2');
                    dynamicSectors.appendChild(sectorPath);
                }

                currentCumulativeAngle = endA;
                cat.plotted = true;

                if (lineGroup) {
                    lineGroup.setAttribute('transform', `rotate(${currentCumulativeAngle}, 1411.5, 536.59)`);
                }

                if (dot) dot.style.display = 'block';
                const pathEl = document.getElementById(cat.pathId);
                if (pathEl) pathEl.style.display = 'block';
            };

            const parentGroup = document.getElementById(cat.rectGroupId);
            if (parentGroup) {
                const textGroups = Array.from(parentGroup.querySelectorAll('g[id^="_"]'));
                textGroups.forEach(tg => tg.style.display = 'none');

                const rect = parentGroup.querySelector('rect');
                if (rect) {
                    const x = rect.getAttribute('x');
                    const y = rect.getAttribute('y');
                    const w = rect.getAttribute('width');
                    const h = rect.getAttribute('height');

                    const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
                    fo.setAttribute('x', x);
                    fo.setAttribute('y', y);
                    fo.setAttribute('width', w);
                    fo.setAttribute('height', h);

                    const input = document.createElement('input');
                    input.type = 'number';
                    input.id = 'input_' + cat.id;
                    input.style.width = '100%';
                    input.style.height = '100%';
                    input.style.border = 'none';
                    input.style.background = 'transparent';
                    input.style.textAlign = 'center';
                    input.style.fontFamily = 'Roboto';
                    input.style.fontSize = '28px';
                    input.style.fontWeight = '500';
                    input.style.color = '#424242';
                    input.style.outline = 'none';

                    fo.appendChild(input);
                    parentGroup.appendChild(fo);

                    cat.inputEl = input;

                    input.addEventListener('input', () => {
                        cat.inputAngle = parseFloat(input.value) || 0;
                        const pathEl = document.getElementById(cat.pathId);
                        if (pathEl && cat.inputAngle > 0) {
                            pathEl.style.display = 'block';
                            const angleRad = (cat.inputAngle - 90) * Math.PI / 180.0;
                            const endX = cat.cx + (cat.r * Math.cos(angleRad));
                            const endY = cat.cy + (cat.r * Math.sin(angleRad));
                            pathEl.setAttribute('d', `M${cat.cx},${cat.cy} L${endX},${endY}`);
                        } else if (pathEl) {
                            pathEl.setAttribute('d', `M${cat.cx},${cat.cy} L${cat.cx},${cat.cy}`);
                        }

                        // Update main pie chart radius line as preview
                        if (!cat.plotted && lineGroup) {
                            const previewAngle = currentCumulativeAngle + cat.inputAngle;
                            lineGroup.setAttribute('transform', `rotate(${previewAngle}, 1411.5, 536.59)`);
                        }
                    });

                    // Add Enter key listener
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); // Prevent accidental form submission if any
                            plotSegment();
                        }
                    });
                }
            }

            const dot = document.getElementById(cat.dotId);
            const path = document.getElementById(cat.pathId);
            if (dot) dot.style.display = 'none';
            if (path) path.style.display = 'none';

            const btn = document.getElementById(cat.btnId);
            if (btn) {
                btn.style.cursor = 'pointer';
                btn.addEventListener('click', plotSegment);
            }
        });

        const submitBtn = document.getElementById('Group_1647');
        if (submitBtn) {
            submitBtn.style.cursor = 'pointer';
            submitBtn.addEventListener('click', () => {
                const allPlotted = pieCategories.every(cat => cat.plotted);
                const allCorrect = pieCategories.every(cat => cat.inputAngle === cat.expectedAngle);
                if (allPlotted) {
                    if (allCorrect) {
                        isBudgetCompleted = true;
                        createPopup('Correct! 🥳');
                    } else {
                        createPopup('Incorrect! \u274C', false);
                    }
                } else {
                    createPopup('Incomplete!', false);
                }
            });
        }

        const resetBtn = document.getElementById('Group_540');
        if (resetBtn) {
            resetBtn.style.cursor = 'pointer';
            resetBtn.addEventListener('click', resetChart);
        }

        const showAnswerBtn = document.getElementById('Group_1161');
        if (showAnswerBtn) {
            showAnswerBtn.style.cursor = 'pointer';
            showAnswerBtn.addEventListener('click', () => {
                createPopup('', true); // Show solution modal
            });
        }
    }
});
