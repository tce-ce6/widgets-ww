// script.js
 
/**
 * LottieSVGAnimation Class
 * Manages loading and controlling a Lottie animation within an SVG <foreignObject>.
 */
class LottieSVGAnimation {
    // Set loop and autoplay defaults to false for controlled segment playback.
    constructor(containerId, jsonPath, loop = false, autoplay = false, offsetX = 0, offsetY = 0) {
        this.containerId = containerId;
        this.jsonPath = jsonPath;
        this.loop = loop;
        this.autoplay = autoplay;
        this.offsetX = offsetX; // Store X offset
        this.offsetY = offsetY; // Store Y offset
        this.animation = null;
        this.foreignObject = null; // Store the foreignObject
        this.isReady = false; // State to track if Lottie is loaded
        
        // Determine a unique ID for the foreignObject based on container and animation type
        const animType = this.jsonPath.includes('correct') ? 'correct' : (this.jsonPath.includes('incorrect') ? 'wrong' : 'default');
        this.foreignObjectId = `${containerId}-${animType}-foreignObject`; 
    }

    init() {
        const container = document.getElementById(this.containerId);

        if (!container) {
            console.error(`Container with ID "${this.containerId}" not found.`);
            return;
        }

        // --- Start: Get the box path for positioning reference ---
        const path = container.querySelector('path');
        if (!path) {
            console.error(`No path found in ${this.containerId}. Cannot position Lottie animation.`);
            return;
        }
        
        let bbox;
        try {
            bbox = path.getBBox();
        } catch(e) {
            console.error(`Could not get BBox for path inside ${this.containerId}`, e);
            return;
        }
        // --- End: Get box path reference ---

        const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        this.foreignObject = foreignObject;
        
        // Set the unique ID for the foreignObject
        foreignObject.setAttribute("id", this.foreignObjectId);
        
        // Set foreignObject size to match the box BBox
        foreignObject.setAttribute("width", bbox.width - 25);
        foreignObject.setAttribute("height", bbox.height - 25);
        
        // Apply offsets and position the foreignObject at the BBox's location
        // The offsets are APPLIED TO THE foreignObject's position ONLY
        // This doesn't affect any other elements in the container
        foreignObject.setAttribute("x", bbox.x + this.offsetX); 
        foreignObject.setAttribute("y", bbox.y + this.offsetY);
        
        // Make sure foreignObject doesn't interfere with other elements
        foreignObject.style.pointerEvents = 'none'; // Don't capture mouse events
        foreignObject.style.display = 'none'; 

        // This is the inner div that Lottie renders into
        const div = document.createElement("div");
        const animName = this.jsonPath.includes('correct') ? 'correct' : (this.jsonPath.includes('incorrect') ? 'incorrect' : 'wrong-default');
        div.setAttribute("id", `${this.containerId}-${animName}-lottie`);
        div.style.width = "100%";
        div.style.height = "100%";

        foreignObject.appendChild(div);
        
        // Append the foreignObject to the main container (g element)
        container.appendChild(foreignObject); 

        // Load Lottie animation
        this.animation = lottie.loadAnimation({
            container: div,
            renderer: 'svg',
            loop: this.loop,
            autoplay: this.autoplay,
            path: this.jsonPath,
        });

        // Set the ready state on loaded
        this.animation.addEventListener('DOMLoaded', () => {
            this.isReady = true;
            console.log(`Lottie animation loaded inside #${this.containerId} (${this.jsonPath})`);
        });

        // Handle error case just in case
        this.animation.addEventListener('error', (e) => {
            console.error(`Lottie failed to load for #${this.containerId} (${this.jsonPath})`, e);
            this.isReady = false;
        });
    }

    // Helper to remove the 'complete' listener after it fires and resets the animation
    hideAnimationOnce = () => {
        if (this.foreignObject) {
            this.foreignObject.style.display = 'none';
        }
        if (this.animation) {
            this.animation.removeEventListener('complete', this.hideAnimationOnce);
            this.animation.goToAndStop(0, true); // Reset to start frame
        }
    }
 
    /**
      * Plays the full Lottie animation once.
      */
    playFull() {
        if (this.isReady && this.animation) {
            // Stop any existing playback and reset to frame 0
            this.animation.stop(); 
            
            this.foreignObject.style.display = 'block';
            
            // CRITICAL FIX FOR SVG/LOTTIE RENDERING
            this.animation.resize(); 
            
            this.animation.play();
            // Attach the hide listener
            this.animation.addEventListener('complete', this.hideAnimationOnce);
            return true;
        } else {
            console.warn(`Lottie is not ready or instance is missing for ${this.containerId}`);
            return false;
        }
    }
}
 
// ----------------------------------------------------------------------

// **NEW:** Global map to store Lottie animation instances
const lottieAnimations = {};
// ASSUMPTION: These files are located at the root of your project
const CORRECT_LOTTIE_PATH = 'correct.json'; 
const WRONG_LOTTIE_PATH = 'incorrect.json'; 
 
// --- Implementation Logic ---
 
document.addEventListener('DOMContentLoaded', () => {
    // Function to hide materials in target boxes initially
    function hideInitialMaterials() {
        // Query groups that are the target boxes and contain a 'use' element
        const boxGroups = document.querySelectorAll(
            '#transparent-box-1 g, #transparent-box-2 g, #transparent-box-3 g,' +
            '#translucent-box-1 g, #translucent-box-2 g, #translucent-box-3 g,' +
            '#opaque-panel-1 g, #opaque-panel-2 g, #opaque-panel-3 g'
        );
        
        boxGroups.forEach(group => {
            // Check for use element within the group and hide the group if a material is present
            // We now look for the material-container class
            if (group.classList.contains('material-container')) {
                group.style.display = 'none';
            }
        });
    }

    hideInitialMaterials();

    // --- Lottie initialization logic ---
    const allBoxIds = [
        'transparent-box-1', 'transparent-box-2', 'transparent-box-3',
        'translucent-box-1', 'translucent-box-2', 'translucent-box-3',
        'opaque-panel-1', 'opaque-panel-2', 'opaque-panel-3'
    ];

    // DEFINE THE DESIRED OFFSET HERE 
    // This offset is applied *relative* to the top-left of the path's BBox.
    const LOTTIE_OFFSET_X = 15; // <--- Change this value for horizontal adjustment
    const LOTTIE_OFFSET_Y = -60; // <--- Change this value for vertical adjustment


    allBoxIds.forEach(boxId => {
        // Initialize correct animation
        const correctAnim = new LottieSVGAnimation(
            boxId, 
            CORRECT_LOTTIE_PATH, 
            false, 
            false, 
            LOTTIE_OFFSET_X, 
            LOTTIE_OFFSET_Y
        );
        correctAnim.init();

        // Initialize wrong animation
        const wrongAnim = new LottieSVGAnimation(
            boxId, 
            WRONG_LOTTIE_PATH, 
            false, 
            false, 
            LOTTIE_OFFSET_X, 
            LOTTIE_OFFSET_Y
        );
        wrongAnim.init();

        // Store both in the global map for easy access
        lottieAnimations[boxId] = { correct: correctAnim, wrong: wrongAnim };
    });
    // ------------------------------------


    // --- Custom SVG Drag and Drop logic for materials and panels ---
    // Map of material IDs to their correct panel category
    const materialMap = {
        'transparent-material-1': { panel: 'transparent-panel', category: 'transparent' }, 
        'transparent-material-2': { panel: 'transparent-panel', category: 'transparent' },
        'transparent-material-3': { panel: 'transparent-panel', category: 'transparent' },
        'translucent-material-1': { panel: 'translucent-panel', category: 'translucent' },
        'translucent-material-2': { panel: 'translucent-panel', category: 'translucent' },
        'translucent-material-3': { panel: 'translucent-panel', category: 'translucent' },
        'opaque-material-1': { panel: 'opaque-panel', category: 'opaque' },
        'opaque-material-2': { panel: 'opaque-panel', category: 'opaque' },
        'opaque-material-3': { panel: 'opaque-panel', category: 'opaque' },
    };

    // Helper: get SVG element by id (works for <g> in inline SVG)
    function getSVGElementById(id) {
        const svg = document.querySelector('svg');
        if (!svg) return null;
        return svg.querySelector(`[id='${id}']`);
    }

    // Store drag state
    let draggingMaterial = null;
    let dragOffset = { x: 0, y: 0 };
    let originalTransform = '';
    let isDragging = false;
    let originalParent = null;

    // Add custom drag handlers to each material, including its transparent rect
    Object.keys(materialMap).forEach(materialId => {
        const material = getSVGElementById(materialId);
        if (material) {
            material.style.cursor = 'pointer';
            
            // Create startDrag function
            const startDrag = function (e) {
                e.preventDefault();
                if (isDragging) return; 
                
                isDragging = true;
                draggingMaterial = material;
                originalParent = material.parentNode;
                
                const svg = document.querySelector('svg');
                const pt = svg.createSVGPoint();
                pt.x = e.clientX;
                pt.y = e.clientY;
                const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
                
                // Get current transform (if any)
                let currentTransform = material.getAttribute('transform');
                let tx = 0, ty = 0;
                if (currentTransform) {
                    const match = /translate\(([-\d.]+),\s*([\-\d.]+)\)/.exec(currentTransform);
                    if (match) {
                        tx = parseFloat(match[1]);
                        ty = parseFloat(match[2]);
                    }
                }
                
                // Store offset from where you grab inside the material
                dragOffset.x = cursorpt.x - tx;
                dragOffset.y = cursorpt.y - ty;
                originalTransform = currentTransform || '';
                
                // Bring to front
                material.parentNode.appendChild(material);
                
                document.addEventListener('mousemove', onDragMove);
                document.addEventListener('mouseup', onDragEnd);
            };

            // Get the rect and use elements
            const rect = material.querySelector('rect');
            const use = material.querySelector('use');

            if (rect && use) {
                // Ensure rect exactly matches the use element's dimensions
                rect.setAttribute('x', use.getAttribute('x'));
                rect.setAttribute('y', use.getAttribute('y'));
                rect.setAttribute('width', use.getAttribute('width'));
                rect.setAttribute('height', use.getAttribute('height'));
                rect.style.pointerEvents = 'all';
                rect.style.cursor = 'pointer';
            }

            // Add event listeners to both the group and the rect
            material.addEventListener('mousedown', startDrag);
            if (rect) {
                rect.addEventListener('mousedown', startDrag);
            }
        }
    });

    function onDragMove(e) {
        if (!draggingMaterial) return;
        const svg = document.querySelector('svg');
        const pt = svg.createSVGPoint();
        pt.x = e.clientX;
        pt.y = e.clientY;
        const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());
        // Move material so that the cursor stays at the same relative position inside the material
        const x = cursorpt.x - dragOffset.x;
        const y = cursorpt.y - dragOffset.y;
        draggingMaterial.setAttribute('transform', `translate(${x},${y})`);
    }

  function onDragEnd(e) {
    if (!draggingMaterial) return;
    const svg = document.querySelector('svg');
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgCursorPoint = pt.matrixTransform(svg.getScreenCTM().inverse());

    let dropped = false;

    const currentMaterial = draggingMaterial.id;
    const mapping = materialMap[currentMaterial];

    if (mapping) {
        // ... (Finding targetBox logic remains the same) ...
        const allBoxIds = [
            'transparent-box-1', 'transparent-box-2', 'transparent-box-3',
            'translucent-box-1', 'translucent-box-2', 'translucent-box-3',
            'opaque-panel-1', 'opaque-panel-2', 'opaque-panel-3'
        ];

        let targetBox = null;

        // --- 1. Find the target box the cursor is directly over or the closest available box ---
        let closestEmptyDistance = Infinity;
        let closestEmptyBox = null;

        for (const boxId of allBoxIds) {
            const box = getSVGElementById(boxId);
            if (!box) continue;

            // Get the path element's BBox (not affected by foreignObject)
            const boxPath = box.querySelector('path');
            if (!boxPath) continue;

            const boxBBox = boxPath.getBBox();

            // Check if cursor is directly over this box
            if (
                svgCursorPoint.x >= boxBBox.x &&
                svgCursorPoint.x <= boxBBox.x + boxBBox.width &&
                svgCursorPoint.y >= boxBBox.y &&
                svgCursorPoint.y <= boxBBox.y + boxBBox.height
            ) {
                targetBox = box;
                break; // Found the box under the cursor, use it immediately
            }

            // Check if box is empty and calculate distance for fallback snapping
            const existingMaterialGroup = box.querySelector('g.material-container');
            // Check if the box is empty (no material group, or the material group is hidden)
            const isEmptyBox = !existingMaterialGroup || existingMaterialGroup.style.display === 'none';

            // Only consider empty boxes within the material's intended panel for *snapping*
            if (isEmptyBox && boxId.startsWith(mapping.category)) {
                const boxCenterX = boxBBox.x + boxBBox.width / 2;
                const boxCenterY = boxBBox.y + boxBBox.height / 2;
                const distance = Math.sqrt(
                    Math.pow(svgCursorPoint.x - boxCenterX, 2) +
                    Math.pow(svgCursorPoint.y - boxCenterY, 2)
                );

                if (distance < closestEmptyDistance) {
                    closestEmptyDistance = distance;
                    closestEmptyBox = box;
                }
            }
        }

        // If no box was directly under the cursor, use the closest empty box (if close enough)
        if (!targetBox && closestEmptyBox && closestEmptyDistance < 50) {
            targetBox = closestEmptyBox;
        }


        // --- 2. Process Drop (Correct/Incorrect/No Drop) ---
        if (targetBox) {

            // Extract category from targetBox.id
            let boxCategory = '';
            if (targetBox.id.includes('transparent-box-') || targetBox.id.includes('translucent-box-')) {
                boxCategory = targetBox.id.split('-box-')[0];
            } else if (targetBox.id.includes('opaque-panel-')) {
                boxCategory = targetBox.id.split('-panel-')[0];
            }

            const materialCategory = mapping.category;
            const existingMaterialGroup = targetBox.querySelector('g.material-container');
            const targetIsEmpty = !existingMaterialGroup || existingMaterialGroup.style.display === 'none';


            if (materialCategory === boxCategory && targetIsEmpty) {
                // *** CORRECT Drop (and empty slot) ***

                // 1. Play CORRECT Lottie animation on the target box
                const animPlayer = lottieAnimations[targetBox.id]?.correct;
                if (animPlayer) {
                    if (!animPlayer.playFull()) {
                        console.error(`Failed to play CORRECT Lottie for: ${targetBox.id}. Check Lottie file path and readiness.`);
                    }
                } else {
                    console.error(`Lottie animation instance not found for: ${targetBox.id}`);
                }
                
                // *** NEW: Add 'active' class to the target box (g element) ***
                targetBox.classList.add('active');

                setTimeout(() => {
                    targetBox.classList.add('show');
                }, 900);
                // *************************************************************

                // --- UPDATED MATERIAL PLACEMENT LOGIC ---
                // Get ONLY the path element's BBox, ignoring any foreignObject children
                const targetPath = targetBox.querySelector('path');
                if (!targetPath) {
                    console.error('Target box has no path element');
                    return;
                }

                const boxBBox = targetPath.getBBox(); // Use path BBox, not container BBox
                let materialGroup = existingMaterialGroup;
                let targetUse = materialGroup ? materialGroup.querySelector('use') : null;
                const sourceUse = draggingMaterial.querySelector('use');

                if (sourceUse) {
                    if (!materialGroup) {
                        // Create new group and use element if none exists
                        materialGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
                        materialGroup.classList.add('material-container'); // Add class for better targeting
                        targetUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
                        materialGroup.appendChild(targetUse);
                        targetBox.appendChild(materialGroup);
                    }

                    // Update existing or new use element attributes
                    targetUse.setAttribute('href', sourceUse.getAttribute('href'));
                    targetUse.setAttribute('width', sourceUse.getAttribute('width'));
                    targetUse.setAttribute('height', sourceUse.getAttribute('height'));

                    // Calculate center position based on PATH bounding box only
                    const useWidth = parseFloat(sourceUse.getAttribute('width'));
                    const useHeight = parseFloat(sourceUse.getAttribute('height'));
                    // Calculate the required TRANSLATION to center the use element (which has x/y=0 relative to its g parent)
                    // inside the box's PATH BBox (not affected by foreignObject).
                    const xTranslate = boxBBox.x + (boxBBox.width - useWidth) / 2;
                    const yTranslate = boxBBox.y + (boxBBox.height - useHeight) / 2;

                    // Use transform to position the material group
                    materialGroup.setAttribute('transform', `translate(${xTranslate}, ${yTranslate})`);

                    // The inner use element should have x/y=0 relative to its parent container group,
                    // as the translation handles the final position.
                    targetUse.setAttribute('x', 0);
                    targetUse.setAttribute('y', 0);

                    // Show the target material group
                    materialGroup.style.display = 'block';

                    // Remove the dragged material from the material area
                    if (draggingMaterial.parentNode) {
                        draggingMaterial.parentNode.removeChild(draggingMaterial);
                    }

                    dropped = true;
                }
                // --- END UPDATED PLACEMENT LOGIC ---

            } else if (materialCategory !== boxCategory) {
                // *** INCORRECT Drop (and a drop target was found) ***

                // 1. Play WRONG Lottie animation on the target box
                const animPlayer = lottieAnimations[targetBox.id]?.wrong;
                if (animPlayer) {
                    if (!animPlayer.playFull()) {
                        console.error(`Failed to play WRONG Lottie for: ${targetBox.id}. Check Lottie file path and readiness.`);
                    }
                } else {
                    console.error(`Lottie animation instance not found for: ${targetBox.id}`);
                }
                // Do NOT set dropped = true, so the material snaps back to its origin.

            } else if (materialCategory === boxCategory && !targetIsEmpty) {
                // *** Correct panel, but the box is NOT empty (already placed) ***
                // Do NOT set dropped = true, so the material snaps back to its origin.
                console.log('Box already filled. Snapping back.');
            }
        }
    }

    // If not a valid/allowed drop (i.e., dropped === false), return to original position.
    if (!dropped && originalParent) {
        // Snap back to original position
        originalParent.appendChild(draggingMaterial);
        draggingMaterial.setAttribute('transform', originalTransform);
    }

    // Final state reset
    draggingMaterial = null;
    dragOffset = { x: 0, y: 0 };
    originalTransform = '';
    isDragging = false;

    // Clean up event listeners
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);

    // Re-enable all draggable materials
    Object.keys(materialMap).forEach(materialId => {
        const mat = getSVGElementById(materialId);
        if (mat) {
            const rect = mat.querySelector('rect');
            if (rect) {
                rect.style.pointerEvents = 'all';
                rect.style.cursor = 'pointer';
            }
        }
    });
}
});