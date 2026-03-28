document.addEventListener("DOMContentLoaded", () => {
    // --- Configuration & State ---
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];

    // Defined flow positions for the plane per step
    const planePositions = [
        { x: 1547.97, y: 90 },
        { x: 1200, y: 180 },
        { x: 800, y: 180 },
        { x: 280, y: 90 }
    ];

    let currentPrimeIndex = 0;
    let targetNumber = 0;
    let currentPlaneNumber = 0;
    let originalTarget = 0;
    let selectedPrime = null;
    let isGameStarted = false;
    let primeFactors = [];
    let currentCannonAngle = 0;
    let cannonPivotX = 0;
    let cannonPivotY = 0;

    // Animation Instances
    let lottieAnim = null;
    let trophyAnim = null;
    let confettiAnim = null;

    let currentStep = 0; // Tracks which position the plane is currently in

    // --- DOM Elements ---
    const DOM = {
        btnPlus: document.getElementById("btn-plus"),
        btnMinus: document.getElementById("btn-minus"),
        btnAdd: document.getElementById("btn-factor-add"),
        btnNewGame: document.getElementById("btn-new-game"),
        targetNumberText: document.querySelector("#target-number-text div"),

        cannonBallContainer: document.getElementById("canon-ball-factors"),
        cannonBalls: [
            document.getElementById("cannon-ball-1"),
            document.getElementById("cannon-ball-2"),
            document.getElementById("cannon-ball-3"),
            document.getElementById("cannon-ball-4")
        ],
        btnNext: document.getElementById("btn-next"),
        btnBack: document.getElementById("btn-back"),

        currentPrimeText: document.querySelector("#current-prime-text tspan"),
        planeNumberText: document.querySelector("#plane-number-text tspan"),
        loadedPrimeText: document.getElementById("prime-shoot-text"),
        primeShootObject: document.getElementById("prime-shoot"),
        calcPanel: document.getElementById("calculation-display-pannel"),
        calcTexts: document.querySelectorAll("#_24_212_226_2223 text tspan"),

        shooterBody: document.getElementById("missile-shooter"),
        planes: document.querySelectorAll('foreignObject[id="plan-generated"]'),

        explosionObject: document.getElementById("explosion-animation"),
        lottieContainer: document.getElementById("explosion-animation-lottie"),

        // New elements for victory animations
        confettiContainer: document.getElementById("confetti-lottie"),
        trophyContainer: document.getElementById("trophy-lottie"),

        feedbackCorrect: document.getElementById("feedback-correct-object"),
        feedbackIncorrect: document.getElementById("feedback-incorrect-object"),
        hitPrimeText: document.querySelector("#hit-text-panel text:nth-of-type(2) tspan"),
        hitDividesText: document.querySelector("#hit-text-panel text:nth-of-type(3) tspan"),
        missPrimeText: document.querySelector("#miss-text-panel text:nth-of-type(2) tspan"),
        missTargetText: document.querySelector("#miss-text-panel text:nth-of-type(4) tspan"),
        victoryPanel: document.getElementById("final-result-tos")
    };

    const activePlane = DOM.planes[0];
    const activePlaneText = activePlane ? activePlane.querySelector("#prime-plain-text tspan") : null;

    // --- Initialization ---
    function init() {
        applyCursors();
        resetGame();
        bindEvents();
    }

    function applyCursors() {
        const clickable = [
            DOM.btnPlus, DOM.btnMinus, DOM.btnAdd,
            DOM.btnNext, DOM.btnBack, DOM.btnNewGame,
            activePlane, ...DOM.cannonBalls
        ];
        clickable.forEach(el => {
            if (el) el.style.cursor = "pointer";
        });
    }

    function resetGame() {
        // Set random target number between 10-50
        targetNumber = Math.floor(Math.random() * 41) + 10;
        currentPlaneNumber = targetNumber;
        originalTarget = targetNumber;
        selectedPrime = null;
        isGameStarted = false;
        primeFactors = [];
        currentPrimeIndex = 0;
        currentStep = 0;
        currentCannonAngle = 0;
        cannonPivotX = 0;
        cannonPivotY = 0;

        if (DOM.targetNumberText) DOM.targetNumberText.innerHTML = targetNumber;
        if (DOM.currentPrimeText) DOM.currentPrimeText.textContent = "";
        if (DOM.loadedPrimeText) DOM.loadedPrimeText.textContent = "";

        if (DOM.calcPanel) DOM.calcPanel.style.display = "none";
        DOM.calcTexts.forEach(t => t.textContent = "");

        DOM.planes.forEach(p => p.style.display = "none");
        if (DOM.feedbackCorrect) DOM.feedbackCorrect.style.display = "none";
        if (DOM.feedbackIncorrect) DOM.feedbackIncorrect.style.display = "none";
        if (DOM.victoryPanel) DOM.victoryPanel.style.display = "none";

        // Show plane immediately with the random number (after hiding all planes)
        const initialPos = planePositions[0];
        if (activePlane) {
            activePlane.setAttribute("x", initialPos.x);
            activePlane.setAttribute("y", initialPos.y);
            activePlane.style.display = "block";
            activePlane.classList.add("plane-highlight"); // Add highlighting
        }

        if (activePlaneText) activePlaneText.textContent = currentPlaneNumber;
        if (DOM.planeNumberText) DOM.planeNumberText.textContent = currentPlaneNumber;

        // Reset Victory Animations
        if (trophyAnim) {
            trophyAnim.destroy();
            trophyAnim = null;
        }
        if (confettiAnim) {
            confettiAnim.destroy();
            confettiAnim = null;
        }
        if (DOM.confettiContainer) {
            DOM.confettiContainer.parentElement.style.display = "none";
            DOM.confettiContainer.innerHTML = "";
        }
        if (DOM.trophyContainer) {
            DOM.trophyContainer.parentElement.style.display = "none";
            DOM.trophyContainer.innerHTML = "";
        }

        if (DOM.btnAdd) {
            DOM.btnAdd.style.opacity = "1";
            DOM.btnAdd.style.pointerEvents = "auto";
        }

        // Remove blink class from New Game button
        if (DOM.btnNewGame) DOM.btnNewGame.classList.remove("blink");

        if (DOM.shooterBody) DOM.shooterBody.setAttribute("transform", "");
        if (DOM.primeShootObject) DOM.primeShootObject.setAttribute("transform", "");

        updateCannonBalls();
    }

    // --- Core Logic ---

    function updateCannonBalls() {
        for (let i = 0; i < 4; i++) {
            const ball = DOM.cannonBalls[i];
            const textEl = document.querySelector(`#cannon-ball-${i + 1}-text div`);
            const primeVal = primes[currentPrimeIndex + i];

            if (primeVal) {
                if (ball) {
                    ball.style.display = "block";
                    ball.dataset.value = primeVal;
                }
                if (textEl) {
                    textEl.innerHTML = primeVal;
                    textEl.parentElement.style.display = "block";
                }
            } else {
                if (ball) ball.style.display = "none";
                if (textEl) textEl.parentElement.style.display = "none";
            }
        }

        if (DOM.btnBack) {
            DOM.btnBack.style.opacity = currentPrimeIndex === 0 ? "0.5" : "1";
            DOM.btnBack.style.pointerEvents = currentPrimeIndex === 0 ? "none" : "auto";
        }
        if (DOM.btnNext) {
            DOM.btnNext.style.opacity = (currentPrimeIndex + 4 >= primes.length) ? "0.5" : "1";
            DOM.btnNext.style.pointerEvents = (currentPrimeIndex + 4 >= primes.length) ? "none" : "auto";
        }
    }

    function selectCannonBall(value) {
        if (isGameStarted && currentPlaneNumber === 1) return;

        selectedPrime = parseInt(value);
        if (DOM.currentPrimeText) DOM.currentPrimeText.textContent = selectedPrime;

        const loadedTextEl = DOM.loadedPrimeText.querySelector("tspan") || DOM.loadedPrimeText;
        if (loadedTextEl) loadedTextEl.textContent = selectedPrime;
    }

    function updateCalculationPanel() {
        if (DOM.calcPanel) DOM.calcPanel.style.display = "block";
        DOM.calcTexts.forEach(t => t.textContent = "");

        const fmt = (n) => Number.isInteger(n) ? n.toString() : Number(n.toFixed(2)).toString();
        const measureCanvas = document.createElement("canvas");
        const ctx = measureCanvas.getContext("2d");
        ctx.font = "bold 28px Roboto, sans-serif";
        const textWidth = (str) => ctx.measureText(str).width;

        let steps = [];
        let remaining = originalTarget;
        let factorsSoFar = [];

        for (let i = 0; i < primeFactors.length; i++) {
            factorsSoFar.push(primeFactors[i]);
            remaining = remaining / primeFactors[i];

            // Clamp floating noise (e.g., 1.0000000002 -> 1)
            if (Math.abs(remaining - Math.round(remaining)) < 1e-6) {
                remaining = Math.round(remaining);
            }

            const prefix = i === 0 ? `${fmt(originalTarget)} = ` : "= ";
            const tail = remaining > 1 ? ` x ${fmt(remaining)}` : "";
            const stepStr = `${prefix}${factorsSoFar.map(fmt).join(' x ')}${tail}`;
            steps.push(stepStr);
        }

        // Add a final, clean prime-product line (e.g., "= 2 x 2 x 3 x 2")
        if (primeFactors.length > 0) {
            steps.push(`= ${primeFactors.map(fmt).join(' x ')}`);
        }

        let displaySteps = steps;
        if (steps.length > 3) {
            displaySteps = [steps[0], ...steps.slice(-2)];
        }
        // Align all "=" signs under the first "="
        let eqColumnX = null;
        const baseX = DOM.calcTexts[0] ? parseFloat(DOM.calcTexts[0].getAttribute("x") || "0") : 0;

        if (displaySteps[0]) {
            const eqIdx = displaySteps[0].indexOf("=");
            if (eqIdx !== -1) {
                const prefix = displaySteps[0].slice(0, eqIdx);
                eqColumnX = baseX + textWidth(prefix);
            }
        }

        displaySteps.forEach((stepStr, index) => {
            const tspan = DOM.calcTexts[index];
            if (!tspan) return;

            tspan.textContent = stepStr;

            if (eqColumnX !== null) {
                const eqIdx = stepStr.indexOf("=");
                if (eqIdx !== -1) {
                    const prefix = stepStr.slice(0, eqIdx);
                    const targetX = eqColumnX - textWidth(prefix);
                    tspan.setAttribute("x", targetX);
                } else {
                    tspan.setAttribute("x", baseX);
                }
            }
        });
    }

    function aimShooterAt(targetX, targetY) {
        if (!DOM.shooterBody) return;

        const bbox = DOM.shooterBody.getBBox();
        const pivotX = bbox.x + (bbox.width / 2);
        const pivotY = bbox.y + bbox.height;

        const planeCenterTargetX = targetX + (144 / 2);
        const planeCenterTargetY = targetY + (209 / 2);

        const dx = planeCenterTargetX - pivotX;
        const dy = planeCenterTargetY - pivotY;
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);

        angle += 90;

        // Store current angle and pivot for calculating cannon mouth position
        currentCannonAngle = angle;
        cannonPivotX = pivotX;
        cannonPivotY = pivotY;

        DOM.shooterBody.style.transition = "transform 0.4s ease-in-out";
        DOM.shooterBody.setAttribute("transform", `rotate(${angle}, ${pivotX}, ${pivotY})`);

        // Counter-rotate the number to keep it upright
        if (DOM.primeShootObject) {
            const numberCenterX = 925 + 42.5; // x + (width/2)
            const numberCenterY = 660 + 42.5; // y + (height/2)
            DOM.primeShootObject.style.transition = "transform 0.4s ease-in-out";
            DOM.primeShootObject.setAttribute("transform", `rotate(${-angle}, ${numberCenterX}, ${numberCenterY})`);
        }
    }

    function triggerFeedback(type) {
        const activePos = planePositions[Math.min(currentStep, planePositions.length - 1)];
        const shiftedY = activePos.y + 300;

        // If plane is above cannon area (x between 600-1000), shift cloud to the right
        let cloudX = activePos.x;
        if (activePos.x >= 600 && activePos.x <= 1000) {
            cloudX = activePos.x + 300; // Shift to the right
        }

        if (type === "correct") {
            if (DOM.hitPrimeText) DOM.hitPrimeText.textContent = selectedPrime;

            // Adjust spacing for the " divides evenly!" text based on number width
            if (DOM.hitDividesText) {
                // For single digit: x="70.9688", for double digit: move further right
                const isDoubleDigit = selectedPrime && selectedPrime.toString().length >= 2;
                const newX = isDoubleDigit ? "88" : "70.9688"; // Move right for double digits
                DOM.hitDividesText.setAttribute("x", newX);
            }

            if (DOM.feedbackCorrect) {
                DOM.feedbackCorrect.setAttribute("x", cloudX);
                DOM.feedbackCorrect.setAttribute("y", shiftedY);
                DOM.feedbackCorrect.style.display = "block";
            }
            if (DOM.feedbackIncorrect) DOM.feedbackIncorrect.style.display = "none";
        } else {
            if (DOM.missPrimeText) DOM.missPrimeText.textContent = selectedPrime;
            if (DOM.missTargetText) DOM.missTargetText.textContent = currentPlaneNumber;
            if (DOM.feedbackIncorrect) {
                DOM.feedbackIncorrect.setAttribute("x", cloudX);
                DOM.feedbackIncorrect.setAttribute("y", shiftedY);
                DOM.feedbackIncorrect.style.display = "block";
            }
            if (DOM.feedbackCorrect) DOM.feedbackCorrect.style.display = "none";
        }

        setTimeout(() => {
            if (DOM.feedbackCorrect) DOM.feedbackCorrect.style.display = "none";
            if (DOM.feedbackIncorrect) DOM.feedbackIncorrect.style.display = "none";
        }, 2500);
    }

    function playAnimation(isCorrect, onComplete) {
        if (lottieAnim) {
            lottieAnim.destroy();
        }

        // Position blast at plane for correct answer, at cannon mouth for incorrect answer
        let blastX, blastY;
        if (isCorrect) {
            const activePos = planePositions[Math.min(currentStep, planePositions.length - 1)];
            blastX = activePos.x - 130;
            blastY = activePos.y - 80;
        } else {
            // Calculate cannon mouth position based on current rotation
            const cannonLength = 320; // distance from pivot to muzzle center
            const angleInRadians = (currentCannonAngle - 90) * (Math.PI / 180);

            const mouthOffsetX = Math.cos(angleInRadians) * cannonLength;
            const mouthOffsetY = Math.sin(angleInRadians) * cannonLength;

            const blastOffset = 200; // half of explosion object's 400px size
            blastX = cannonPivotX + mouthOffsetX - blastOffset;
            blastY = cannonPivotY + mouthOffsetY - blastOffset;
        }

        if (DOM.explosionObject) {
            DOM.explosionObject.setAttribute("x", blastX);
            DOM.explosionObject.setAttribute("y", blastY);
            DOM.explosionObject.style.display = "block";
        }

        const animPath = isCorrect ? './assets/explode-anim.json' : './assets/wrong-smoke.json';

        if (DOM.lottieContainer) {
            DOM.lottieContainer.innerHTML = "";
            setTimeout(() => {
                lottieAnim = lottie.loadAnimation({
                    container: DOM.lottieContainer,
                    renderer: 'svg',
                    loop: false,
                    autoplay: true,
                    path: animPath
                });

                lottieAnim.addEventListener('complete', () => {
                    DOM.lottieContainer.innerHTML = "";
                    if (DOM.explosionObject) DOM.explosionObject.style.display = "none";

                    if (onComplete) {
                        onComplete();
                    }
                });
            }, 800);
        }
    }

    // --- Event Listeners ---
    function bindEvents() {

        if (DOM.btnPlus) DOM.btnPlus.addEventListener("click", () => {
            if (isGameStarted) return;
            targetNumber++;
            if (DOM.targetNumberText) DOM.targetNumberText.innerHTML = targetNumber;
        });

        if (DOM.btnMinus) DOM.btnMinus.addEventListener("click", () => {
            if (isGameStarted) return;
            if (targetNumber > 0) targetNumber--;
            if (DOM.targetNumberText) DOM.targetNumberText.innerHTML = targetNumber;
        });

        if (DOM.btnAdd) DOM.btnAdd.addEventListener("click", () => {
            if (isGameStarted || targetNumber < 2) return;

            isGameStarted = true;
            originalTarget = targetNumber;
            currentPlaneNumber = targetNumber;
            currentStep = 0;

            DOM.btnAdd.style.opacity = "0.6";
            DOM.btnAdd.style.pointerEvents = "none";

            // Remove highlight when game starts
            if (activePlane) {
                activePlane.classList.remove("plane-highlight");
            }

            const initialPos = planePositions[0];
            if (activePlane) {
                activePlane.setAttribute("x", initialPos.x);
                activePlane.setAttribute("y", initialPos.y);
                activePlane.style.display = "block";
            }

            if (activePlaneText) activePlaneText.textContent = currentPlaneNumber;
            if (DOM.planeNumberText) DOM.planeNumberText.textContent = currentPlaneNumber;
        });

        DOM.cannonBalls.forEach(ball => {
            if (ball) {
                ball.addEventListener("click", function () {
                    selectCannonBall(this.dataset.value);
                });
            }
        });

        if (DOM.btnNext) DOM.btnNext.addEventListener("click", () => {
            if (currentPrimeIndex + 4 < primes.length) {
                currentPrimeIndex += 4;
                updateCannonBalls();
            }
        });

        if (DOM.btnBack) DOM.btnBack.addEventListener("click", () => {
            if (currentPrimeIndex - 4 >= 0) {
                currentPrimeIndex -= 4;
                updateCannonBalls();
            }
        });

        if (activePlane) activePlane.addEventListener("click", () => {
            if (currentPlaneNumber === 1) return;

            if (!selectedPrime) {
                // alert("Please select a prime number cannonball to load first!");
                return;
            }

            const activePos = planePositions[Math.min(currentStep, planePositions.length - 1)];
            aimShooterAt(activePos.x, activePos.y);

            if (currentPlaneNumber % selectedPrime === 0) {
                triggerFeedback("correct");
                primeFactors.push(selectedPrime);
                currentPlaneNumber = currentPlaneNumber / selectedPrime;

                playAnimation(true, () => {
                    updateCalculationPanel();

                    if (currentPlaneNumber === 1) {
                        // VICTORY STATE TRIGGER
                        if (activePlaneText) activePlaneText.textContent = "1";
                        if (DOM.planeNumberText) DOM.planeNumberText.textContent = "1";
                        if (DOM.victoryPanel) DOM.victoryPanel.style.display = "block";

                        // Make New Game button blink
                        if (DOM.btnNewGame) DOM.btnNewGame.classList.add("blink");

                        // Trigger Confetti Animation mapping to active plane
                        if (DOM.confettiContainer) {
                            const confettiFO = DOM.confettiContainer.parentElement; // Grabs the foreignObject wrapper
                            if (confettiFO) {
                                confettiFO.setAttribute("x", activePos.x - 120);
                                confettiFO.setAttribute("y", activePos.y - 100);
                                confettiFO.style.display = "block";
                            }
                            confettiAnim = lottie.loadAnimation({
                                container: DOM.confettiContainer,
                                renderer: 'svg',
                                loop: false,
                                autoplay: true,
                                path: './assets/confetti-anim.json' // Path to confetti
                            });
                        }

                        // Trigger Trophy Animation
                        if (DOM.trophyContainer) {
                            const trophyFO = DOM.trophyContainer.parentElement;
                            if (trophyFO) trophyFO.style.display = "block";

                            trophyAnim = lottie.loadAnimation({
                                container: DOM.trophyContainer,
                                renderer: 'svg',
                                loop: false,
                                autoplay: true,
                                path: './assets/trophy.json'
                            });
                        }

                    } else {
                        // Move to next position - only alternate between right (0) and left (3) positions
                        currentStep = (currentStep === 0) ? 3 : 0;
                        const nextPos = planePositions[currentStep];
                        activePlane.setAttribute("x", nextPos.x);
                        activePlane.setAttribute("y", nextPos.y);

                        if (activePlaneText) activePlaneText.textContent = currentPlaneNumber;
                        if (DOM.planeNumberText) DOM.planeNumberText.textContent = currentPlaneNumber;
                    }
                });
            } else {
                triggerFeedback("incorrect");
                playAnimation(false, () => {
                    // Clear loaded number after incorrect shot animation completes
                    selectedPrime = null;
                    if (DOM.currentPrimeText) DOM.currentPrimeText.textContent = "";
                    const loadedTextEl = DOM.loadedPrimeText.querySelector("tspan") || DOM.loadedPrimeText;
                    if (loadedTextEl) loadedTextEl.textContent = "";
                });
                return; // Don't clear immediately for incorrect shots
            }

            // Clear loaded number after successful shot animation completes
            setTimeout(() => {
                selectedPrime = null;
                if (DOM.currentPrimeText) DOM.currentPrimeText.textContent = "";
                const loadedTextEl = DOM.loadedPrimeText.querySelector("tspan") || DOM.loadedPrimeText;
                if (loadedTextEl) loadedTextEl.textContent = "";
            }, 1000); // Delay clearing so user can see what they shot
        });

        if (DOM.btnNewGame) {
            DOM.btnNewGame.addEventListener("click", resetGame);
        }
    }

    init();
});
