document.addEventListener("DOMContentLoaded", () => {
    // --- Configuration & State ---
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    let currentPrimeIndex = 0; // Tracks which set of 4 primes we are showing
    let selectedPrime = null;  // Currently selected prime loaded in the cannon
    let currentMainNumber = 10; // The number modified by plus/minus
    let isPlaneActive = false;
    let lottieAnim = null; // Store current Lottie animation to clean up

    // --- DOM Elements ---
    const DOM = {
        cannonBalls: [
            document.getElementById("cannon-ball-1"),
            document.getElementById("cannon-ball-2"),
            document.getElementById("cannon-ball-3"),
            document.getElementById("cannon-ball-4")
        ],
        cannonBallTexts: [
            document.getElementById("cannon-ball-text-1"),
            document.getElementById("cannon-ball-text-2"),
            document.getElementById("cannon-ball-text-3"),
            document.getElementById("cannon-ball-text-4")
        ],
        btnNext: document.getElementById("btn-next"),
        btnBack: document.getElementById("btn-back"),
        btnPlus: document.getElementById("btn-plus"),
        btnMinus: document.getElementById("btn-minus"),
        btnAdd: document.getElementById("btn-add"),

        mainNumberText: document.getElementById("main-number-text"),
        shooterLoadedText: document.getElementById("shooter-loaded-text"),
        shooterBody: document.getElementById("missile-shooter"),

        planeGroup: document.getElementById("plane-group"),
        plane: document.getElementById("plane"),

        feedbackText: document.getElementById("feedback-text"),
        lottieContainer: document.getElementById("lottie-container")
    };

    // --- Initialization ---
    function init() {
        applyCursors(); // Apply the pointer cursors
        updateCannonBalls();
        updateMainNumberDisplay();
        hidePlane();
        bindEvents();
    }

    // --- Styling Functions ---
    // Adds cursor: pointer to all clickable elements
    function applyCursors() {
        const clickableElements = [
            DOM.btnNext,
            DOM.btnBack,
            DOM.btnPlus,
            DOM.btnMinus,
            DOM.btnAdd,
            DOM.plane,
            ...DOM.cannonBalls
        ];

        clickableElements.forEach(el => {
            if (el) {
                el.style.cursor = "pointer";
            }
        });
    }

    // --- Core Functions ---

    // 1. Pagination for Prime Numbers
    function updateCannonBalls() {
        for (let i = 0; i < 4; i++) {
            const primeValue = primes[currentPrimeIndex + i];
            if (primeValue) {
                DOM.cannonBalls[i].style.display = "block";
                if (DOM.cannonBallTexts[i]) DOM.cannonBallTexts[i].textContent = primeValue;

                // Set data attribute for easy access
                DOM.cannonBalls[i].dataset.value = primeValue;
            } else {
                DOM.cannonBalls[i].style.display = "none";
            }
        }

        // Handle Back/Next button visibility
        DOM.btnBack.style.opacity = currentPrimeIndex === 0 ? "0.5" : "1";
        DOM.btnBack.style.pointerEvents = currentPrimeIndex === 0 ? "none" : "auto";

        DOM.btnNext.style.opacity = (currentPrimeIndex + 4 >= primes.length) ? "0.5" : "1";
        DOM.btnNext.style.pointerEvents = (currentPrimeIndex + 4 >= primes.length) ? "none" : "auto";
    }

    // 2. Select a Cannon Ball
    function selectCannonBall(ballElement) {
        // Remove highlight from all (Optional: depends on your CSS)
        DOM.cannonBalls.forEach(ball => ball.classList.remove("selected-ball"));

        // Highlight clicked
        ballElement.classList.add("selected-ball");

        // Update loaded state
        selectedPrime = parseInt(ballElement.dataset.value);
        if (DOM.shooterLoadedText) {
            DOM.shooterLoadedText.textContent = selectedPrime;
        }
    }

    // 3. Number Selection (Plus/Minus)
    function updateMainNumberDisplay() {
        if (DOM.mainNumberText) {
            DOM.mainNumberText.textContent = currentMainNumber;
        }
    }

    // 4. Plane Mechanics
    function showPlane() {
        if (isPlaneActive) return; // Only one plane visible at a time

        isPlaneActive = true;
        DOM.planeGroup.setAttribute("transform", `translate(1547.97, 90)`);
        DOM.planeGroup.style.display = "block";
        if (DOM.feedbackText) DOM.feedbackText.style.display = "none"; // Hide previous feedback
    }

    function hidePlane() {
        isPlaneActive = false;
        if (DOM.planeGroup) DOM.planeGroup.style.display = "none";
    }

    // 5. Shooter Rotation Calculation
    function aimShooterAtPlane(planeX, planeY) {
        if (!DOM.shooterBody) return;

        // Get the bounding box to find the bottom center for the rotation pivot
        const shooterBox = DOM.shooterBody.getBBox();
        const pivotX = shooterBox.x + (shooterBox.width / 2);
        const pivotY = shooterBox.y + shooterBox.height; // Bottom of the element

        const dx = planeX - pivotX;
        const dy = planeY - pivotY;

        // Calculate angle in degrees
        let angle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Adjust angle assuming 0 degrees is facing right. 
        // If your cannon graphic points UP by default, add 90 degrees.
        angle += 90;

        // Apply rotation from the bottom pivot
        DOM.shooterBody.setAttribute("transform", `rotate(${angle}, ${pivotX}, ${pivotY})`);
    }

    // 6. Handle Checking & Lottie Animations
    function handlePlaneClick() {
        if (!selectedPrime) {
            alert("Please select a prime number cannonball first!");
            return;
        }

        // Aim the shooter
        aimShooterAtPlane(1547.97, 90);

        // Check Logic: Is selected prime a factor of the current number?
        const isCorrect = (currentMainNumber % selectedPrime === 0);

        // Clean up previous lottie if exists
        if (lottieAnim) {
            lottieAnim.destroy();
        }

        const animPath = isCorrect ? './assets/explode-anim.json' : './assets/wrong-smoke.json';
        const feedbackMsg = isCorrect ? "Correct!" : "Try Again!";

        // Position feedback text relative to plane
        if (DOM.feedbackText) {
            DOM.feedbackText.setAttribute("x", 1547.97);
            DOM.feedbackText.setAttribute("y", 90 - 20); // 20px above the plane
            DOM.feedbackText.textContent = feedbackMsg;
            DOM.feedbackText.style.display = "block";
        }

        // Play Lottie strictly using SVG renderer to append inside the SVG container
        if (DOM.lottieContainer) {
            DOM.lottieContainer.setAttribute("transform", `translate(1547.97, 90)`);
            lottieAnim = lottie.loadAnimation({
                container: DOM.lottieContainer, // an existing SVG <g> tag
                renderer: 'svg',
                loop: false,
                autoplay: true,
                path: animPath
            });

            lottieAnim.addEventListener('complete', () => {
                if (isCorrect) {
                    hidePlane();
                }
            });
        }
    }

    // --- Event Listeners ---
    function bindEvents() {
        // Cannonballs
        DOM.cannonBalls.forEach(ball => {
            if (ball) {
                ball.addEventListener("click", function () {
                    selectCannonBall(this);
                });
            }
        });

        // Next/Back Primes
        if (DOM.btnNext) {
            DOM.btnNext.addEventListener("click", () => {
                if (currentPrimeIndex + 4 < primes.length) {
                    currentPrimeIndex += 4;
                    updateCannonBalls();
                }
            });
        }

        if (DOM.btnBack) {
            DOM.btnBack.addEventListener("click", () => {
                if (currentPrimeIndex - 4 >= 0) {
                    currentPrimeIndex -= 4;
                    updateCannonBalls();
                }
            });
        }

        // Number Selection
        if (DOM.btnPlus) {
            DOM.btnPlus.addEventListener("click", () => {
                currentMainNumber++;
                updateMainNumberDisplay();
            });
        }

        if (DOM.btnMinus) {
            DOM.btnMinus.addEventListener("click", () => {
                if (currentMainNumber > 2) currentMainNumber--;
                updateMainNumberDisplay();
            });
        }

        // Add Plane
        if (DOM.btnAdd) {
            DOM.btnAdd.addEventListener("click", showPlane);
        }

        // Shoot Plane
        if (DOM.plane) {
            DOM.plane.addEventListener("click", handlePlaneClick);
        }
    }

    // Run
    init();
});