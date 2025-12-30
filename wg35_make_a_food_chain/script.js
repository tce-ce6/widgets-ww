let lottieSessionId = 0;

window.addEventListener("DOMContentLoaded", () => {
    const group = document.getElementById("animal-group");
    if (!group) return;

    function flashMessage(text, type) {
        console.log(`[${type}] ${text}`);
    }

    // --- State Variables ---
    let currentBorder = null;
    let selectedAnimalData = null;
    let placedAnimals = [];
    let autoResetTimer = null;
    
    // 🔒 State Flags
    let isAnimating = false;
    let isResetting = false;
    let isGameComplete = false; // Prevents clicks after success
    const svgContainer = document.querySelector(".svg-container");
    const selectedAnimalsGroup = document.getElementById("selected-animals");
    if (!selectedAnimalsGroup) return;

    // --- JSON Data ---
    const animals = [
        { id: "lion", src: "assets/lion.svg", x: 1300, y: 123, role: "predator" },
        { id: "rabbit", src: "assets/Rabbit.svg", x: 1480, y: 123, role: "herbivore" },
        { id: "butterfly", src: "assets/butterfly.svg", x: 1660, y: 123, role: "herbivore" },

        { id: "crow", src: "assets/crow.svg", x: 1300, y: 303, role: "predator" },
        { id: "goat", src: "assets/Goat.svg", x: 1480, y: 303, role: "herbivore" },
        { id: "frog", src: "assets/frog.svg", x: 1660, y: 303, role: "predator" },
        
        { id: "snake", src: "assets/snake.svg", x: 1300, y: 483, role: "predator" },
        { id: "deer", src: "assets/Deer.svg", x: 1480, y: 483, role: "herbivore" },
        { id: "plant", src: "assets/plant.svg", x: 1660, y: 483, role: "producer" },

        { id: "catterpiller", src: "assets/catterpiller.svg", x: 1300, y: 663, role: "herbivore" },
        { id: "grasshopper", src: "assets/grasshopper.svg", x: 1480, y: 663, role: "herbivore" },
        { id: "lizard", src: "assets/lizard.svg", x: 1660, y: 663, role: "predator" },
        { id: "tiger", src: "assets/tiger.svg", x: 1480, y: 843, role: "predator" }
    ];

    const animalSlots = animals.map(a => Object.freeze({ x: a.x, y: a.y }));
    let lastSlotMap = {};
    animals.forEach(a => { lastSlotMap[a.id] = { x: a.x, y: a.y }; });

    let shuffleDifficulty = "hard";

    const correctChains = [
        ["plant", "deer", "tiger"], ["plant", "goat", "tiger"], ["plant", "rabbit", "tiger"],
        ["plant", "grasshopper", "frog"], ["plant", "catterpiller", "frog"],
        ["plant", "grasshopper", "lizard"], ["plant", "catterpiller", "lizard"],
        ["plant", "butterfly", "lizard"], ["plant", "grasshopper", "crow"],
        ["plant", "catterpiller", "crow"], ["plant", "butterfly", "crow"],
        ["plant", "deer", "lion"], ["plant", "goat", "lion"], ["plant", "rabbit", "lion"],
        ["plant", "rabbit", "snake"], ["plant", "grasshopper", "snake"],
        ["plant", "butterfly", "frog"], ["plant", "butterfly", "snake"]
    ];

    const bucketPositions = {
        "1st-bucket": { x: 90, y: 520, role: "producer" },
        "2nd-bucket": { x: 485, y: 520, role: "herbivore" },
        "3rd-bucket": { x: 875, y: 520, role: "predator" }
    };

    const bucketIds = ["1st-bucket", "2nd-bucket", "3rd-bucket"];

    // --- HELPER: Lock/Unlock Buckets ---
    function updateBucketVisuals() {
        bucketIds.forEach(id => {
            const bucket = document.getElementById(id);
            const isOccupied = placedAnimals.some(p => p.bucket === id);
            
            // Enabled ONLY if empty AND an animal is actively selected
            const isEnabled = !isOccupied && selectedAnimalData !== null;
            
            if (bucket) {
                bucket.style.cursor = isEnabled ? "pointer" : "default";
            }
        });
    }
    const flexButtonContainer = document.querySelector(".flexContainer");

    // --- Lottie Animation Variables ---
    let currentLottie = null;
    const LOTTIE_FO_ID = "lottie-animation-container-fo";
    const LOTTIE_DIV_ID = "lottie-animation-div";
    const CORRECT_ANIM_PATH = 'assets/animation/en_evs_04_wg35_Assets_Correct.json';
    const INCORRECT_ANIM_PATH = 'assets/animation/en_evs_04_wg35_Assets_Incorrect.json';
    const COMPLETE_ANIM_PATH = 'assets/animation/en_evs_04_wg35_Assets_correct_food_chain.json';

    const FULL_SCREEN_WIDTH = 1920;
    const FULL_SCREEN_HEIGHT = 1080;
    const LOTTIE_X = 0;
    const LOTTIE_Y = 0;
    const resetButtonPrimary = document.getElementById("reset-button");
    
    // Disable Reset Button Initially
    if (resetButtonPrimary) {
        resetButtonPrimary.disabled = true; 
        resetButtonPrimary.addEventListener("click", resetWidget);
    }

    function playLottieAnimation(animationPath, loop = false) {
        removeLottieAnimation();
        const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        fo.setAttribute("x", LOTTIE_X);
        fo.setAttribute("y", LOTTIE_Y);
        fo.setAttribute("width", FULL_SCREEN_WIDTH.toString());
        fo.setAttribute("height", FULL_SCREEN_HEIGHT.toString());
        fo.setAttribute("id", LOTTIE_FO_ID);
        fo.style.pointerEvents = 'none';
        fo.style.zIndex = '9999';

        const div = document.createElement("div");
        div.setAttribute("id", LOTTIE_DIV_ID);
        div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.pointerEvents = 'none';

        fo.appendChild(div);
        group.appendChild(fo);

        if (typeof lottie === 'undefined') return;
        const session = ++lottieSessionId;

        currentLottie = lottie.loadAnimation({
            container: div,
            renderer: 'svg',
            loop: loop,
            autoplay: true,
            path: animationPath
        });

        if (!loop) {
            currentLottie.addEventListener('complete', () => {
                const mySession = session;
                setTimeout(() => {
                    if (mySession === lottieSessionId) removeLottieAnimation();
                }, 100);
            });
        }
        if (currentLottie && currentLottie.isPaused) currentLottie.play();
    }

    function removeLottieAnimation() {
        if (currentLottie) {
            currentLottie.destroy();
            currentLottie = null;
        }
        const fo = document.getElementById(LOTTIE_FO_ID);
        if (fo) fo.remove();
    }

    function showInsightButton(show) {
        const insightBtn = document.getElementById("insight-button");
        if (insightBtn) {
            insightBtn.style.display = show ? "block" : "none";
            if (show) insightBtn.classList.add("blinking");
            else insightBtn.classList.remove("blinking");
        }
    }

    function isPartialChainValid(currentAnimals, nextAnimalId, nextBucketId) {
        const allPlacedAnimals = [...currentAnimals, { id: nextAnimalId, bucket: nextBucketId }];
        return correctChains.some(correctChain => {
            return allPlacedAnimals.every(placedItem => {
                const bucketIndex = bucketIds.indexOf(placedItem.bucket);
                return placedItem.id === correctChain[bucketIndex];
            });
        });
    }

    function checkFoodChainCompletion() {
        if (placedAnimals.length === 3) {
            const chainIds = placedAnimals.sort((a, b) =>
                bucketIds.indexOf(a.bucket) - bucketIds.indexOf(b.bucket)
            ).map(a => a.id);

            const isChainCorrect = correctChains.some(correctChain =>
                correctChain.every((id, index) => id === chainIds[index])
            );

            if (isChainCorrect) {
                // 🔒 LOCK THE GAME
                isGameComplete = true;

                playLottieAnimation(COMPLETE_ANIM_PATH, false);
                flashMessage('Correct! The food chain is complete!', 'complete');

                const resetButton = document.getElementById("reset-button");
                if (resetButton) resetButton.classList.add("blinking");

                isAnimating = false;
                isResetting = false;
                selectedAnimalData = null;
                updateBucketVisuals();

                if (autoResetTimer) clearTimeout(autoResetTimer);
                autoResetTimer = setTimeout(() => { resetWidget(); }, 8000);

                return true;
            } else {
                console.warn("Completed chain is incorrect.");
                setTimeout(() => resetWidget(), 0);
                return false;
            }
        }
        return false;
    }
    function showInsightPopup() {
            svgContainer.classList.add("modal-open");
            flexButtonContainer.style.zIndex = "9";
        const insightDetails = document.getElementById("insight-detials");
        const insightCloseBtn = document.getElementById("close-insight-btn");
        if (insightDetails) insightDetails.style.display = 'block';
        if (insightCloseBtn) insightCloseBtn.addEventListener("click", () => {
            svgContainer.classList.remove("modal-open");
            flexButtonContainer.style.zIndex = "11";
            insightDetails.style.display = 'none'});
        showInsightButton(true);
    }

    animals.forEach(a => {
        const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        fo.setAttribute("x", a.x);
        fo.setAttribute("y", a.y);
        fo.setAttribute("width", "140");
        fo.setAttribute("height", "140");
        fo.setAttribute("data-id", a.id);

        const img = document.createElement("img");
        img.src = a.src;
        img.id = a.id;
        img.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.cursor = "pointer";
        img.addEventListener("click", () => selectAnimal(a));

        fo.appendChild(img);
        group.appendChild(fo);
    });

    function removeFlyingClone() {
        const flyingClone = document.getElementById("flying-animal-clone");
        if (flyingClone) flyingClone.remove();
    }

    function isAnimalPlaced(id) {
        return placedAnimals.some(a => a.id === id);
    }

    function selectAnimal(animal) {
        // 🔒 CHECK: Block if game is complete
        if (isGameComplete) return;
        
        if (isAnimating) return;
        if (isResetting) return;
        if (isAnimalPlaced(animal.id)) return;

        removeFlyingClone();
        removeLottieAnimation();

        if (currentBorder) {
            currentBorder.remove();
            currentBorder = null;
        }

        group.querySelectorAll('foreignObject[data-id]').forEach(fo => {
            const id = fo.getAttribute('data-id');
            if (isAnimalPlaced(id)) {
                fo.style.opacity = '0.4';
                fo.style.pointerEvents = 'none';
            } else {
                fo.style.opacity = '1';
                fo.style.pointerEvents = 'auto';
            }
        });

        selectedAnimalData = animal;

        const border = document.createElementNS("http://www.w3.org/2000/svg", "image");
        border.setAttributeNS("http://www.w3.org/1999/xlink", "href", "assets/yellow-border.svg");
        const fo = group.querySelector(`foreignObject[data-id="${animal.id}"]`);
        if (!fo) return;
        const x = parseFloat(fo.getAttribute("x"));
        const y = parseFloat(fo.getAttribute("y"));
        border.setAttribute("x", x - 20);
        border.setAttribute("y", y - 20);
        border.setAttribute("width", "180");
        border.setAttribute("height", "180");
        group.appendChild(border);
        currentBorder = border;

        console.log(`Selected: ${animal.id}`);
        updateBucketVisuals();
    }

    function placeAnimalInBucket(bucketId) {
        // 🔒 CHECK: Block if game is complete
        if (isGameComplete) return;

        const existingPlacement = placedAnimals.find(p => p.bucket === bucketId);
        if (existingPlacement) {
            console.log(`Bucket ${bucketId} is already occupied. Click ignored.`);
            return;
        }

        if (isAnimating) return;
        if (isResetting) return;
        if (!selectedAnimalData) {
            console.log("No animal selected yet.");
            return;
        }

        isAnimating = true;
        removeLottieAnimation();

        const targetBucket = bucketPositions[bucketId];
        if (!targetBucket) { isAnimating = false; return; }

        const sourceFo = group.querySelector(`foreignObject[data-id="${selectedAnimalData.id}"]`);
        if (!sourceFo) { isAnimating = false; return; }

        const startX = parseFloat(sourceFo.getAttribute("x"));
        const startY = parseFloat(sourceFo.getAttribute("y"));
        const endX = targetBucket.x;
        const endY = targetBucket.y;

        removeFlyingClone();

        const flyingFo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        flyingFo.setAttribute("x", startX);
        flyingFo.setAttribute("y", startY);
        flyingFo.setAttribute("width", "140");
        flyingFo.setAttribute("height", "140");
        flyingFo.setAttribute("id", "flying-animal-clone");

        const flyingImg = document.createElement("img");
        flyingImg.src = selectedAnimalData.src;
        flyingImg.style.width = "100%";
        flyingImg.style.height = "100%";
        flyingImg.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

        flyingFo.appendChild(flyingImg);
        group.appendChild(flyingFo);

        flyingFo.style.transition = 'transform 0.5s ease-in-out, width 0.5s ease-in-out, height 0.5s ease-in-out';
        flyingFo.style.transformOrigin = '0 0';
        flyingFo.style.pointerEvents = 'none';

        const isCorrectRole = selectedAnimalData.role === targetBucket.role;
        const isChainValid = isPartialChainValid(placedAnimals, selectedAnimalData.id, bucketId);
        const isCorrectPlacement = isCorrectRole && isChainValid;

        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const animationDuration = 500;

        setTimeout(() => {
            flyingFo.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            flyingFo.setAttribute("width", "270");
            flyingFo.setAttribute("height", "270");
        }, 50);

        if (isCorrectPlacement) {
            setTimeout(() => {
                playLottieAnimation(CORRECT_ANIM_PATH);
                removeFlyingClone();

                const animalIconFo = group.querySelector(`[data-id="${selectedAnimalData.id}"]`);
                if (animalIconFo) {
                    animalIconFo.style.opacity = '0.4';
                    animalIconFo.style.pointerEvents = 'none';
                }
                if (currentBorder) {
                    currentBorder.remove();
                    currentBorder = null;
                }

                const finalFo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
                finalFo.setAttribute("x", endX);
                finalFo.setAttribute("y", endY);
                finalFo.setAttribute("width", "270");
                finalFo.setAttribute("height", "270");
                finalFo.setAttribute("data-bucket-id", bucketId);
                finalFo.setAttribute("data-animal-id", selectedAnimalData.id);
                const finalImg = document.createElement("img");
                finalImg.src = selectedAnimalData.src;
                finalImg.id = selectedAnimalData.id + "-placed";
                finalImg.style.width = "100%";
                finalImg.style.height = "100%";
                finalImg.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
                finalFo.appendChild(finalImg);
                selectedAnimalsGroup.appendChild(finalFo);

                placedAnimals.push({
                    id: selectedAnimalData.id,
                    role: selectedAnimalData.role,
                    bucket: bucketId
                });
                
                selectedAnimalData = null;
                updateBucketVisuals();

                // Enable Reset Button on correct placement
                if (resetButtonPrimary) resetButtonPrimary.disabled = false;

                showInsightButton(true);
                checkFoodChainCompletion();
                isAnimating = false;
            }, animationDuration);

        } else {
            setTimeout(() => {
                playLottieAnimation(INCORRECT_ANIM_PATH);
                flyingFo.style.transform = `translate(0, 0)`;
                flyingFo.setAttribute("width", "140");
                flyingFo.setAttribute("height", "140");
                setTimeout(() => { removeFlyingClone(); }, animationDuration);
                if (currentBorder) {
                    currentBorder.remove();
                    currentBorder = null;
                }
                selectedAnimalData = null;
                updateBucketVisuals();
                
                showInsightButton(true);
                isAnimating = false;
            }, animationDuration);
        }
    }

    function shuffleArray(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
    }

    function shuffleWithoutSamePosition(animals, slots) {
        let shuffled;
        let valid = false;
        let attempts = 0;
        while (!valid && attempts < 100) {
            shuffled = shuffleArray(slots);
            valid = animals.every((animal, i) => {
                const prev = lastSlotMap[animal.id];
                const newSlot = shuffled[i];
                return prev.x !== newSlot.x || prev.y !== newSlot.y;
            });
            attempts++;
        }
        if (!valid) console.warn("Could not find perfect shuffle, using random.");
        return shuffled;
    }

    function getShuffledSlotsByDifficulty() {
        if (shuffleDifficulty === "hard") return shuffleWithoutSamePosition(animals, animalSlots);
        return shuffleArray(animalSlots);
    }

    function animateToPosition(fo, x, y) {
        const ox = parseFloat(fo.getAttribute("x"));
        const oy = parseFloat(fo.getAttribute("y"));
        fo.style.transition = "transform 0.6s ease-in-out";
        fo.style.transform = `translate(${x - ox}px, ${y - oy}px)`;
        setTimeout(() => {
            fo.style.transition = "";
            fo.style.transform = "";
            fo.setAttribute("x", x);
            fo.setAttribute("y", y);
        }, 600);
    }

    function resetWidget() {
        // 🔓 UNLOCK THE GAME
        isGameComplete = false;

        if (autoResetTimer) {
            clearTimeout(autoResetTimer);
            autoResetTimer = null;
        }

        isAnimating = false;
        if (isResetting) return;
        isResetting = true;

        removeFlyingClone();
        removeLottieAnimation();
        document.querySelectorAll("#flying-animal-clone").forEach(el => el.remove());
        selectedAnimalsGroup.querySelectorAll("foreignObject").forEach(fo => fo.remove());
        
        placedAnimals.length = 0;
        selectedAnimalData = null;
        
        updateBucketVisuals();

        // Disable Reset Button because buckets are empty
        if (resetButtonPrimary) resetButtonPrimary.disabled = true;

        group.querySelectorAll('foreignObject[data-id]').forEach(fo => {
            fo.style.opacity = '1';
            fo.style.pointerEvents = 'auto';
        });

        const shuffledSlots = getShuffledSlotsByDifficulty();
        animals.forEach((animal, index) => {
            const slot = shuffledSlots[index];
            lastSlotMap[animal.id] = { x: slot.x, y: slot.y };
            const fo = group.querySelector(`foreignObject[data-id="${animal.id}"]`);
            if (!fo) return;
            fo.style.display = "block";
            fo.style.opacity = "1";
            fo.style.pointerEvents = "auto";
            animateToPosition(fo, slot.x, slot.y);
        });

        const resetButton = document.getElementById("reset-button");
        if (resetButton) resetButton.classList.remove("blinking");

        showInsightButton(true);
        console.log(`Widget reset with ${shuffleDifficulty} shuffle`);

        setTimeout(() => {
            isResetting = false;
        }, 750);
    }

    bucketIds.forEach(id => {
        const bucket = document.getElementById(id);
        if (bucket) {
            bucket.style.cursor = "default";
            bucket.addEventListener("click", () => placeAnimalInBucket(id));
        }
    });

    const insightButton = document.getElementById("insight-button");
    if (insightButton) insightButton.addEventListener("click", showInsightPopup);

    const insightDetails = document.getElementById("insight-detials");
    const insightCloseBtn = document.getElementById("insight-close-btn");
    if (insightDetails && insightCloseBtn) insightCloseBtn.addEventListener("click", () => insightDetails.style.display = 'none');

    const popupClose = document.getElementById("insight-popup-close");
    const insightPopup = document.getElementById("insight-popup");
    if (popupClose && insightPopup) popupClose.addEventListener("click", () => insightPopup.style.display = 'none');

    showInsightButton(true);
    window.resetWidget = resetWidget;
    window.getShuffledSlotsByDifficulty = getShuffledSlotsByDifficulty;
});