window.addEventListener("DOMContentLoaded", () => {
    // Check if group exists. If not, the script will likely fail later.
    const group = document.getElementById("animal-group");
    if (!group) {
        console.error("The SVG element with id='animal-group' was not found.");
        return;
    }
    console.log("SVG loaded:", group);
    
    let currentBorder = null;
    let selectedAnimalData = null; // Store the data of the currently selected animal
    let placedAnimals = []; // Tracks the animals currently placed in the buckets: [{id: 'plant', role: 'producer', bucket: '1st-bucket'}, ...]
    
    // Get the target container for selected animals
    const selectedAnimalsGroup = document.getElementById("selected-animals");
    if (!selectedAnimalsGroup) {
        console.error("The SVG element with id='selected-animals' was was not found.");
        return;
    }

    // --- 1. Define JSON with Roles and All Possible Correct Chains ---
    
    // Extend the animals data with their role in the food chain
    const animals = [
        { id: "lion", src: "assets/lion.svg", x: 1350, y: 140, role: "predator" },
        { id: "rabbit", src: "assets/Rabbit.svg", x: 1530, y: 140, role: "herbivore" },
        { id: "butterfly", src: "assets/butterfly.svg", x: 1710, y: 140, role: "herbivore" },
        { id: "crow", src: "assets/crow.svg", x: 1350, y: 320, role: "predator" }, 
        { id: "goat", src: "assets/Goat.svg", x: 1530, y: 320, role: "herbivore" },
        { id: "frog", src: "assets/frog.svg", x: 1710, y: 320, role: "predator" },
        { id: "snake", src: "assets/snake.svg", x: 1350, y: 500, role: "predator" },
        { id: "deer", src: "assets/Deer.svg", x: 1530, y: 500, role: "herbivore" },
        { id: "plant", src: "assets/plant.svg", x: 1710, y: 500, role: "producer" },
        { id: "catterpiller", src: "assets/catterpiller.svg", x: 1350, y: 680, role: "herbivore" },
        { id: "grasshopper", src: "assets/grasshopper.svg", x: 1530, y: 680, role: "herbivore" },
        { id: "lizard", src: "assets/lizard.svg", x: 1710, y: 680, role: "predator" },
        { id: "tiger", src: "assets/tiger.svg", x: 1530, y: 860, role: "predator" }
    ];

    // Map animal IDs to their full data object for easy lookup
    const animalMap = animals.reduce((map, animal) => {
        map[animal.id] = animal;
        return map;
    }, {});
    
    // All correct combinations based on the image:
    const correctChains = [
        ["plant", "deer", "tiger"], ["plant", "goat", "tiger"], ["plant", "rabbit", "tiger"],
        ["plant", "grasshopper", "frog"], ["plant", "catterpiller", "frog"], ["plant", "grasshopper", "lizard"],
        ["plant", "catterpiller", "lizard"], ["plant", "butterfly", "lizard"], ["plant", "grasshopper", "crow"],
        ["plant", "catterpiller", "crow"], ["plant", "butterfly", "crow"], ["plant", "deer", "lion"],
        ["plant", "goat", "lion"], ["plant", "rabbit", "lion"], ["plant", "rabbit", "snake"],
        ["plant", "grasshopper", "snake"]
    ];

    // Coordinates for the center of the buckets (x for foreignObject)
    const bucketPositions = {
        "1st-bucket": { x: 90, y: 520, role: "producer" }, // First box
        "2nd-bucket": { x: 485, y: 520, role: "herbivore" }, // Second box
        "3rd-bucket": { x: 875, y: 520, role: "predator" } // Third box
    };
    
    const bucketIds = ["1st-bucket", "2nd-bucket", "3rd-bucket"];

    // --- Lottie Animation Variables (No change) ---
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
        
        fo.appendChild(div);
        group.appendChild(fo); 

        if (typeof lottie === 'undefined') {
            console.error("Lottie library is not loaded. Cannot play animation.");
            return;
        }

        currentLottie = lottie.loadAnimation({
            container: div,
            renderer: 'svg',
            loop: loop, 
            autoplay: true,
            path: animationPath
        });
        
        if (!loop) {
            currentLottie.addEventListener('complete', () => {
                currentLottie.pause(); 
            });
        }
        
        if (currentLottie && currentLottie.isPaused) {
            currentLottie.play();
        }
    }

    function removeLottieAnimation() {
        if (currentLottie) {
            currentLottie.destroy();
            currentLottie = null;
        }
        const fo = document.getElementById(LOTTIE_FO_ID);
        if (fo) {
            fo.remove();
        }
    }


    function flashMessage(message, type) {
        const msgElement = document.getElementById("feedback-message");
        if (msgElement) {
            msgElement.textContent = message;
            msgElement.className = `flash-message ${type}`; 
            setTimeout(() => {
                msgElement.textContent = '';
                msgElement.className = 'flash-message';
            }, 3000); 
        }
    }

    function playAudio(type) {
        let audioSrc = '';
        if (type === 'correct') {
            audioSrc = 'assets/celebration.mp3'; 
        } else if (type === 'incorrect') {
            audioSrc = 'assets/sad-music.mp3'; 
        }
        
        if (audioSrc) {
            const audio = new Audio(audioSrc);
            audio.play().catch(e => console.error("Audio playback failed:", e));
        }
    }

    function showInsightButton(show) {
        const insightBtn = document.getElementById("insight-button");
        if (insightBtn) {
            insightBtn.style.display = show ? "block" : "none";
            if (show) {
                insightBtn.classList.add("blinking"); 
            } else {
                insightBtn.classList.remove("blinking");
            }
        }
    }

    // --- NEW CORE FIX: Compatibility Check for Any-Order Placement ---
    function isPartialChainValid(currentAnimals, nextAnimalId, nextBucketId) {
        // 1. Combine all placed animals (current ones + the new one)
        const allPlacedAnimals = [...currentAnimals, { id: nextAnimalId, bucket: nextBucketId }];
        
        // 2. Check if this combination of placed items fits into ANY single correct chain
        return correctChains.some(correctChain => {
            // Check 1: Does every placed item's ID match the required ID at its bucket's position
            // in the target correctChain?
            const positionMatch = allPlacedAnimals.every(placedItem => {
                const bucketIndex = bucketIds.indexOf(placedItem.bucket);
                // The item's ID must match the ID at that position in the correct chain
                return placedItem.id === correctChain[bucketIndex];
            });

            // Check 2: (Optional but highly recommended) Ensure ALL placed IDs are accounted for in the chain
            // This is implicitly handled by the positionMatch check if bucketIds are unique.
            
            return positionMatch;
        });
    }
    // ---------------------------------------------------------------------------------


    // --- Completion Check (No change) ---
    function checkFoodChainCompletion() {
        if (placedAnimals.length === 3) {
            // Since partial validation passed, the final check only confirms the 3 IDs form a complete chain
            const chainIds = placedAnimals.sort((a, b) => 
                bucketIds.indexOf(a.bucket) - bucketIds.indexOf(b.bucket)
            ).map(a => a.id);
            
            const isChainCorrect = correctChains.some(correctChain => 
                correctChain.every((id, index) => id === chainIds[index])
            );

            if (isChainCorrect) {
                playLottieAnimation(COMPLETE_ANIM_PATH, false); 
                
                flashMessage('Correct! The food chain is complete!', 'complete'); 
                const resetButton = document.getElementById("reset-button");
                if (resetButton) resetButton.classList.add("blinking"); 
                return true;
            } else {
                // Should not happen if partial validation is correct, but kept as a safeguard
                console.warn("Completed chain is incorrect. Resetting.");
                resetWidget(); 
                return false;
            }
        }
        return false;
    }

    function showInsightPopup() {
        const popup = document.getElementById("insight-popup");
        const content = document.getElementById("insight-content");
        if (popup && content) {
            content.innerHTML = `
                <p><strong>1. Most food chains start with plants (Producers).</strong></p>
                <p><strong>2. The second level is usually occupied by plant-eating/herbivorous organisms (Primary Consumers).</strong></p>
                <p><strong>3. The third level of a food chain is usually occupied by flesh-eating/carnivorous or both plant and flesh-eating/omnivorous organisms (Secondary Consumers/Predators).</strong></p>
            `;
            popup.style.display = 'block'; 
        }
        showInsightButton(false); 
    }
    
    // --- Animal Icon Generation (No change) ---
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
    
    // --- Utility to remove any flying/animating clones (No change) ---
    function removeFlyingClone() {
        const flyingClone = document.getElementById("flying-animal-clone");
        if (flyingClone) {
            flyingClone.remove();
        }
    }


    // --- Animal Selection Function (No change) ---
    function selectAnimal(animal) {
        if (placedAnimals.some(a => a.id === animal.id)) {
            console.log(`${animal.id} is already placed.`);
            return;
        }

        removeFlyingClone(); 
        removeLottieAnimation(); 

        selectedAnimalData = animal;

        if (currentBorder) {
            currentBorder.remove();
            currentBorder = null;
        }

        const border = document.createElementNS("http://www.w3.org/2000/svg", "image");
        border.setAttributeNS("http://www.w3.org/1999/xlink", "href", "assets/yellow-border.svg");
        border.setAttribute("x", animal.x - 20);
        border.setAttribute("y", animal.y - 20);
        border.setAttribute("width", '180px');
        border.setAttribute("height", '180px');

        group.appendChild(border);

        currentBorder = border;

        console.log(`Selected: ${animal.id}`);
    }

    // --- Core Placement and Validation Function (Uses new compatibility check) ---
    function placeAnimalInBucket(bucketId) {
        if (!selectedAnimalData) {
            console.log("No animal selected yet.");
            return; 
        }

        removeLottieAnimation(); 
        
        const targetBucket = bucketPositions[bucketId];
        if (!targetBucket) {
            console.error("Invalid bucket ID:", bucketId);
            return;
        }

        const existingPlacement = placedAnimals.find(p => p.bucket === bucketId);
        if (existingPlacement) {
            console.log(`Bucket ${bucketId} is already occupied by ${existingPlacement.id}.`);
            return;
        }

        // Get coordinates
        const startX = selectedAnimalData.x;
        const startY = selectedAnimalData.y;
        const endX = targetBucket.x;
        const endY = targetBucket.y;

        // 2. Create the "flying" clone
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

        // 3. Check for correctness
        const isCorrectRole = selectedAnimalData.role === targetBucket.role;
        
        // Check for compatibility with existing placements and overall chain structure
        const isChainValid = isPartialChainValid(placedAnimals, selectedAnimalData.id, bucketId);
        
        const isCorrectPlacement = isCorrectRole && isChainValid; 

        // 4. Start the movement animation
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const animationDuration = 500; // 0.5s

        setTimeout(() => {
            flyingFo.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            flyingFo.setAttribute("width", "270"); 
            flyingFo.setAttribute("height", "270"); 
        }, 50); 

        // 5. Post-Animation Logic
        
        if (isCorrectPlacement) {
            // --- CORRECT PLACEMENT ---
            setTimeout(() => {
                playLottieAnimation(CORRECT_ANIM_PATH); 
                playAudio('correct');
                flashMessage('Correct!', 'correct');
                
                removeFlyingClone(); 

                const animalIconFo = group.querySelector(`[data-id="${selectedAnimalData.id}"]`);
                if (animalIconFo) {
                    animalIconFo.style.display = 'none';
                }

                if (currentBorder) {
                    currentBorder.remove();
                    currentBorder = null;
                }
                
                // Place the final static icon
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

                console.log(`Placed ${selectedAnimalData.id} into ${bucketId} (Role: ${selectedAnimalData.role})`);

                selectedAnimalData = null; 
                showInsightButton(false); 

                checkFoodChainCompletion();

            }, animationDuration);

        } else {
            // --- INCORRECT PLACEMENT ---
            
            setTimeout(() => {
                playLottieAnimation(INCORRECT_ANIM_PATH); 
                playAudio('incorrect');
                
                flashMessage('Incorrect', 'incorrect');

                // Animate the clone back to its starting position (Go back)
                flyingFo.style.transform = `translate(0, 0)`;
                flyingFo.setAttribute("width", "140"); 
                flyingFo.setAttribute("height", "140"); 

                setTimeout(() => {
                    removeFlyingClone();
                }, animationDuration);
                
                // Clear selection and border
                if (currentBorder) {
                    currentBorder.remove();
                    currentBorder = null;
                }
                selectedAnimalData = null;
                showInsightButton(true);

            }, animationDuration);
        }
    }

    // --- Reset Function (No change) ---
    function resetWidget() {
        removeFlyingClone(); 
        removeLottieAnimation();

        const placedFos = selectedAnimalsGroup.querySelectorAll('foreignObject');
        placedFos.forEach(fo => fo.remove());
        
        const allAnimalIcons = group.querySelectorAll('foreignObject[data-id]');
        allAnimalIcons.forEach(fo => fo.style.display = 'block');
        
        placedAnimals = [];
        
        if (currentBorder) {
            currentBorder.remove();
            currentBorder = null;
        }
        selectedAnimalData = null;
        
        flashMessage('', '');
        const resetButton = document.getElementById("reset-button");
        if (resetButton) resetButton.classList.remove("blinking"); 
        showInsightButton(false);
        
        console.log("Widget reset to default screen.");
    }
    
    // --- Event Listeners for Buckets and Reset/Insight (No change) ---
    
    bucketIds.forEach(id => {
        const bucket = document.getElementById(id);
        if (bucket) {
            bucket.style.cursor = "pointer"; 
            bucket.addEventListener("click", () => placeAnimalInBucket(id));
        } else {
            console.error(`Bucket element with id='${id}' not found.`);
        }
    });
    
    const insightButton = document.getElementById("insight-button");
    if (insightButton) {
        insightButton.addEventListener("click", showInsightPopup);
    }
    
    const resetButton = document.getElementById("reset-button");
    if (resetButton) {
        resetButton.addEventListener("click", resetWidget);
    }
    
    const popupClose = document.getElementById("insight-popup-close"); 
    const insightPopup = document.getElementById("insight-popup");
    if (popupClose && insightPopup) {
         popupClose.addEventListener("click", () => insightPopup.style.display = 'none');
    }
    showInsightButton(false);
});