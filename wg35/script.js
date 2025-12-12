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
        { id: "crow", src: "assets/crow.svg", x: 1350, y: 320, role: "predator" }, // Crow is omnivorous/carnivorous, so acts as a predator/secondary consumer here
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

    // --- Lottie Animation Variables ---
    let currentLottie = null;
    const LOTTIE_FO_ID = "lottie-animation-container-fo";
    const LOTTIE_DIV_ID = "lottie-animation-div";
    const CORRECT_ANIM_PATH = 'assets/animation/en_evs_04_wg35_Assets_Correct.json';
    const INCORRECT_ANIM_PATH = 'assets/animation/en_evs_04_wg35_Assets_Incorrect.json';
    const COMPLETE_ANIM_PATH = 'assets/animation/en_evs_04_wg35_Assets_correct_food_chain.json'; // New Path
    
    // Full screen dimensions
    const FULL_SCREEN_WIDTH = 1920; 
    const FULL_SCREEN_HEIGHT = 1080; 
    const LOTTIE_X = 0; // Start at top left corner of the SVG viewbox
    const LOTTIE_Y = 0; 
    
    // --- Lottie Animation Functions (MODIFIED) ---
    function playLottieAnimation(animationPath, loop = false) { 
        // 1. Remove any previous animation
        removeLottieAnimation();
        
        // 2. Create the outer ForeignObject container (Full Screen)
        const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        fo.setAttribute("x", LOTTIE_X);
        fo.setAttribute("y", LOTTIE_Y);
        fo.setAttribute("width", FULL_SCREEN_WIDTH.toString());
        fo.setAttribute("height", FULL_SCREEN_HEIGHT.toString());
        fo.setAttribute("id", LOTTIE_FO_ID);
        // Ensure Lottie is on top of everything, but doesn't block interaction 
        // with the panels beneath (except for the duration of the visual feedback).
        fo.style.pointerEvents = 'none'; 
        fo.style.zIndex = '9999'; // Use z-index if CSS is available/needed, otherwise rely on SVG append order

        // 3. Create the inner HTML div container for Lottie
        const div = document.createElement("div");
        div.setAttribute("id", LOTTIE_DIV_ID);
        div.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        div.style.width = '100%';
        div.style.height = '100%';
        
        fo.appendChild(div);
        group.appendChild(fo); // Append to the main SVG group

        // 4. Load and play the animation
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
        
        // Fix: Do NOT automatically remove the animation after it completes.
        // Instead, we will force the animation to hold its end state.
        
        // Use the segment feature to stop the animation on the last frame if it's not looping.
        if (!loop) {
            currentLottie.addEventListener('complete', () => {
                // By pausing on the last frame, the final state is held.
                currentLottie.pause(); 
            });
        }
        
        // Make sure it plays immediately if it was destroyed and re-loaded
        if (currentLottie && currentLottie.isPaused) {
            currentLottie.play();
        }
    }

    function removeLottieAnimation() {
        if (currentLottie) {
            currentLottie.destroy();
            currentLottie = null;
        }
        // Remove the foreignObject container from the SVG
        const fo = document.getElementById(LOTTIE_FO_ID);
        if (fo) {
            fo.remove();
        }
    }


    // --- Utility Functions for Feedback and Visibility (No change) ---

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

    // --- Completion Check (MODIFIED) ---
    function checkFoodChainCompletion() {
        if (placedAnimals.length === 3) {
            const chainIds = placedAnimals.sort((a, b) => 
                bucketIds.indexOf(a.bucket) - bucketIds.indexOf(b.bucket)
            ).map(a => a.id);
            
            const isChainCorrect = correctChains.some(correctChain => 
                correctChain.every((id, index) => id === chainIds[index])
            );

            if (isChainCorrect) {
                // Play the grand completion animation (Full Screen)
                playLottieAnimation(COMPLETE_ANIM_PATH, false); 
                
                flashMessage('Correct! The food chain is complete!', 'complete'); 
                const resetButton = document.getElementById("reset-button");
                if (resetButton) resetButton.classList.add("blinking"); 
                return true;
            } else {
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
    
    // --- New: Utility to remove any flying/animating clones ---
    function removeFlyingClone() {
        const flyingClone = document.getElementById("flying-animal-clone");
        if (flyingClone) {
            flyingClone.remove();
        }
    }


    // --- Animal Selection Function (Clears Lottie) ---
    function selectAnimal(animal) {
        // If the animal is already placed, you can't select it
        if (placedAnimals.some(a => a.id === animal.id)) {
            console.log(`${animal.id} is already placed.`);
            return;
        }

        removeFlyingClone(); 
        removeLottieAnimation(); // Clear previous feedback when selecting a new animal

        // 1. Store the selected animal's data
        selectedAnimalData = animal;

        // 2. Remove previous border
        if (currentBorder) {
            currentBorder.remove();
            currentBorder = null;
        }

        // 3. Create new border
        const border = document.createElementNS("http://www.w3.org/2000/svg", "image");
        border.setAttributeNS("http://www.w3.org/1999/xlink", "href", "assets/yellow-border.svg");

        // 4. Position border slightly around icon
        border.setAttribute("x", animal.x - 20);
        border.setAttribute("y", animal.y - 20);
        border.setAttribute("width", '180px');
        border.setAttribute("height", '180px');

        // 5. Place border after animals (on top)
        group.appendChild(border);

        // 6. Save reference
        currentBorder = border;

        console.log(`Selected: ${animal.id}`);
    }

    // --- Core Placement and Validation Function (No change to core logic) ---
    function placeAnimalInBucket(bucketId) {
        if (!selectedAnimalData) {
            console.log("No animal selected yet.");
            return; 
        }

        // Clear any previous feedback animation before starting a new placement
        removeLottieAnimation(); 
        
        // Get the target role and position for the selected bucket
        const targetBucket = bucketPositions[bucketId];
        if (!targetBucket) {
            console.error("Invalid bucket ID:", bucketId);
            return;
        }

        // 1. Check if the bucket is already occupied
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

        // Apply initial transformation for animation
        flyingFo.style.transition = 'transform 0.5s ease-in-out, width 0.5s ease-in-out, height 0.5s ease-in-out';
        flyingFo.style.transformOrigin = '0 0'; 
        flyingFo.style.pointerEvents = 'none'; 

        // 3. Check for correctness
        const isCorrectRole = selectedAnimalData.role === targetBucket.role;

        // 4. Start the movement animation
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const animationDuration = 500; // 0.5s

        setTimeout(() => {
            // Translate to the target bucket's coordinates and scale up
            flyingFo.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            flyingFo.setAttribute("width", "270"); 
            flyingFo.setAttribute("height", "270"); 
        }, 50); 

        // 5. Post-Animation Logic (Correct/Incorrect)
        
        if (isCorrectRole) {
            // --- CORRECT PLACEMENT ---
            setTimeout(() => {
                // Trigger Lottie and Audio (Individual Correct Feedback)
                playLottieAnimation(CORRECT_ANIM_PATH); 
                playAudio('correct');

                // 1. 'Correct' message will flash
                flashMessage('Correct!', 'correct');
                
                // 2. Remove the flying clone (its job is done)
                removeFlyingClone(); 

                // 3. Hide the original icon from the panel
                const animalIconFo = group.querySelector(`[data-id="${selectedAnimalData.id}"]`);
                if (animalIconFo) {
                    animalIconFo.style.display = 'none';
                }

                // 4. Remove the selection border
                if (currentBorder) {
                    currentBorder.remove();
                    currentBorder = null;
                }
                
                // 5. Place the final static icon in the bucket group
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

                // 6. Record the placement
                placedAnimals.push({ 
                    id: selectedAnimalData.id, 
                    role: selectedAnimalData.role, 
                    bucket: bucketId 
                });

                console.log(`Placed ${selectedAnimalData.id} into ${bucketId} (Role: ${selectedAnimalData.role})`);

                // 7. Clear selected animal after successful placement
                selectedAnimalData = null; 
                showInsightButton(false); 

                // 8. Check if the chain is complete and correct (all 3 boxes filled)
                checkFoodChainCompletion();

            }, animationDuration);

        } else {
            // --- INCORRECT PLACEMENT ---
            
            // Wait for the first part of the animation (going to the bucket)
            setTimeout(() => {
                // Trigger Lottie and Audio (Individual Incorrect Feedback)
                playLottieAnimation(INCORRECT_ANIM_PATH); 
                playAudio('incorrect');
                
                // 1. 'Incorrect' message will flash
                flashMessage('Incorrect', 'incorrect');

                // 2. Animate the clone back to its starting position (No transform) and original size
                flyingFo.style.transform = `translate(0, 0)`;
                flyingFo.setAttribute("width", "140"); 
                flyingFo.setAttribute("height", "140"); 

                // 3. After the return animation, remove the clone
                setTimeout(() => {
                    removeFlyingClone();
                }, animationDuration);
                
                // 4. Clear selection and border
                if (currentBorder) {
                    currentBorder.remove();
                    currentBorder = null;
                }
                selectedAnimalData = null;
                // 5. 'Insight' button will appear and blink
                showInsightButton(true);

            }, animationDuration);
        }
    }

    // --- Reset Function (Modified to remove flying clones and Lottie) ---
    function resetWidget() {
        // IMPORTANT: Remove any flying clone and Lottie animation on reset
        removeFlyingClone(); 
        removeLottieAnimation();

        // 1. Remove all animals from the buckets
        const placedFos = selectedAnimalsGroup.querySelectorAll('foreignObject');
        placedFos.forEach(fo => fo.remove());
        
        // 2. Show all animals in the image panel again
        const allAnimalIcons = group.querySelectorAll('foreignObject[data-id]');
        allAnimalIcons.forEach(fo => fo.style.display = 'block');
        
        // 3. Clear placed animals array
        placedAnimals = [];
        
        // 4. Clear selection and border
        if (currentBorder) {
            currentBorder.remove();
            currentBorder = null;
        }
        selectedAnimalData = null;
        
        // 5. Clear messages and reset button
        flashMessage('', '');
        const resetButton = document.getElementById("reset-button");
        if (resetButton) resetButton.classList.remove("blinking"); 
        showInsightButton(false);
        
        console.log("Widget reset to default screen.");
    }
    
    // --- Event Listeners for Buckets and Reset/Insight ---
    
    // Bucket Listeners
    bucketIds.forEach(id => {
        const bucket = document.getElementById(id);
        if (bucket) {
            bucket.style.cursor = "pointer"; 
            bucket.addEventListener("click", () => placeAnimalInBucket(id));
        } else {
            console.error(`Bucket element with id='${id}' not found.`);
        }
    });
    
    // Assuming you have elements with these IDs in your SVG/HTML
    const insightButton = document.getElementById("insight-button");
    if (insightButton) {
        insightButton.addEventListener("click", showInsightPopup);
    }
    
    const resetButton = document.getElementById("reset-button");
    if (resetButton) {
        resetButton.addEventListener("click", resetWidget);
    }
    
    // Optional: Listener to close the Insight popup
    const popupClose = document.getElementById("insight-popup-close"); 
    const insightPopup = document.getElementById("insight-popup");
    if (popupClose && insightPopup) {
         popupClose.addEventListener("click", () => insightPopup.style.display = 'none');
    }
    // Initialize the insight button to be hidden
    showInsightButton(false);
});