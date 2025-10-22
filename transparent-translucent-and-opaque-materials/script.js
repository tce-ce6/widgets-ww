// script.js
 
/**
 * LottieSVGAnimation Class
 * Manages loading and controlling a Lottie animation within an SVG <foreignObject>.
 */
class LottieSVGAnimation {
    // Set loop and autoplay defaults to false for controlled segment playback.
    constructor(containerId, jsonPath, loop = false, autoplay = false) {
        this.containerId = containerId;
        this.jsonPath = jsonPath;
        this.loop = loop;
        this.autoplay = autoplay;
        this.animation = null;
    }
 
    init() {
        const container = document.getElementById(this.containerId);
 
        if (!container) {
            console.error(`Container with ID "${this.containerId}" not found.`);
            return;
        }
 
        // Create a <foreignObject> to host the Lottie animation inside the SVG group
        const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        // Ensure width/height are either dynamic ("100%") or match your SVG/Group dimensions
          foreignObject.setAttribute("width", "730");
        foreignObject.setAttribute("height", "730");
        foreignObject.setAttribute("transform", "translate(530, 332)");
       
        // Inner div for animation
        const div = document.createElement("div");
        div.setAttribute("id", `${this.containerId}-lottie`);
        div.style.width = "100%";
        div.style.height = "100%";
 
        foreignObject.appendChild(div);
        container.appendChild(foreignObject);
 
        // Load Lottie animation
        this.animation = lottie.loadAnimation({
            container: div,
            renderer: 'svg',
            loop: this.loop,
            autoplay: this.autoplay,
            path: this.jsonPath,
        });
 
        this.animation.addEventListener('DOMLoaded', () => {
            console.log(`Lottie animation loaded inside #${this.containerId}`);
        });
    }
 
    /**
     * Plays a specific segment of the Lottie animation.
     * @param {number} startFrame - The frame number to start the playback from.
     * @param {number} endFrame - The frame number to end the playback at.
     */
    playSegment(startFrame, endFrame) {
        if (this.animation) {
            // The segments parameter is an array like [startFrame, endFrame].
            // 'true' as the second argument (forceFlag) immediately starts the new segment.
            this.animation.playSegments([startFrame, endFrame], true);
        }
    }
}
 
// ----------------------------------------------------------------------
 
// --- Implementation Logic (Revised for Staged Playback) ---
 
document.addEventListener('DOMContentLoaded', () => {
    // Function to hide materials in target boxes initially
    function hideInitialMaterials() {
        const boxGroups = document.querySelectorAll('[id$="-panel-1"] g, [id$="-panel-2"] g, [id$="-panel-3"] g');
        boxGroups.forEach(group => {
            if (group.querySelector('use')) {
                group.style.display = 'none';
            }
        });
    }

    // Call this function when page loads
    hideInitialMaterials();

    // --- Lottie logic (untouched) ---
    // ...existing code...


    // --- Custom SVG Drag and Drop logic for materials and panels ---
    // Map of material IDs to their correct panel and box
    const materialMap = {
        'transparent-material-1': { panel: 'transparent-panel', box: 'transparent-box-1' },
        'transparent-material-2': { panel: 'transparent-panel', box: 'transparent-box-2' },
        'transparent-material-3': { panel: 'transparent-panel', box: 'transparent-box-3' },
        'translucent-material-1': { panel: 'translucent-panel', box: 'translucent-box-1' },
        'translucent-material-2': { panel: 'translucent-panel', box: 'translucent-box-2' },
        'translucent-material-3': { panel: 'translucent-panel', box: 'translucent-box-3' },
        'opaque-material-1': { panel: 'opaque-panel', box: 'opaque-panel-1' },
        'opaque-material-2': { panel: 'opaque-panel', box: 'opaque-panel-2' },
        'opaque-material-3': { panel: 'opaque-panel', box: 'opaque-panel-3' },
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
                if (isDragging) return;  // Prevent starting new drag while one is in progress
                
                isDragging = true;
                draggingMaterial = material;
                originalParent = material.parentNode;
                console.log('Starting drag of:', material.id);
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
        const cursorpt = pt.matrixTransform(svg.getScreenCTM().inverse());

        // Check if dropped over a valid panel
        let dropped = false;
        
        // Get the material's mapping data
        const currentMaterial = draggingMaterial.id;
        const mapping = materialMap[currentMaterial];
        
        console.log('Dropping material:', currentMaterial);
        console.log('Mapping:', mapping);
        
        if (mapping) {
            const targetPanel = getSVGElementById(mapping.panel);
            const targetBox = getSVGElementById(mapping.box);
            
            console.log('Target panel:', mapping.panel, !!targetPanel);
            console.log('Target box:', mapping.box, !!targetBox);
            
            if (targetPanel && targetBox) {
                // Get panel boundaries
                const panelBBox = targetPanel.getBBox();
                const svg = document.querySelector('svg');
                const svgPoint = svg.createSVGPoint();
                svgPoint.x = e.clientX;
                svgPoint.y = e.clientY;
                const svgCursorPoint = svgPoint.matrixTransform(svg.getScreenCTM().inverse());
                
                console.log('Drop position:', svgCursorPoint);
                console.log('Panel bounds:', panelBBox);
                
                // Check if cursor is within panel bounds
                if (
                    svgCursorPoint.x >= panelBBox.x &&
                    svgCursorPoint.x <= panelBBox.x + panelBBox.width &&
                    svgCursorPoint.y >= panelBBox.y &&
                    svgCursorPoint.y <= panelBBox.y + panelBBox.height
                ) {
                    console.log('Drop is within panel bounds!');
                    
                    // Get the target box's bounds to position the material
                    const boxBBox = targetBox.getBBox();
                    
                    // Find the 'use' element in the targetBox
                    const targetUse = targetBox.querySelector('use');
                    if (targetUse) {
                        // Create a new 'use' element with the same dimensions and source
                        const sourceUse = draggingMaterial.querySelector('use');
                        if (sourceUse) {
                            // Update the target use element's attributes
                            targetUse.setAttribute('href', sourceUse.getAttribute('href'));
                            targetUse.setAttribute('width', sourceUse.getAttribute('width'));
                            targetUse.setAttribute('height', sourceUse.getAttribute('height'));
                            
                            // Center the material in the box
                            const useWidth = parseFloat(sourceUse.getAttribute('width'));
                            const useHeight = parseFloat(sourceUse.getAttribute('height'));
                            const xPos = boxBBox.x + (boxBBox.width - useWidth) / 2;
                            const yPos = boxBBox.y + (boxBBox.height - useHeight) / 2;
                            
                            targetUse.setAttribute('x', xPos);
                            targetUse.setAttribute('y', yPos);
                            
                            // Show the target use element
                            targetUse.style.display = 'block';
                            targetUse.parentElement.style.display = 'block';
                        }
                    } else {
                        // If no use element exists, create one in the target box
                        const sourceUse = draggingMaterial.querySelector('use');
                        if (sourceUse && targetBox) {
                            const newG = document.createElementNS("http://www.w3.org/2000/svg", "g");
                            const newUse = document.createElementNS("http://www.w3.org/2000/svg", "use");
                            
                            // Copy attributes from source use
                            newUse.setAttribute('href', sourceUse.getAttribute('href'));
                            newUse.setAttribute('width', sourceUse.getAttribute('width'));
                            newUse.setAttribute('height', sourceUse.getAttribute('height'));
                            
                            // Center in box
                            const useWidth = parseFloat(sourceUse.getAttribute('width'));
                            const useHeight = parseFloat(sourceUse.getAttribute('height'));
                            const xPos = boxBBox.x + (boxBBox.width - useWidth) / 2;
                            const yPos = boxBBox.y + (boxBBox.height - useHeight) / 2;
                            
                            newUse.setAttribute('x', xPos);
                            newUse.setAttribute('y', yPos);
                            
                            newG.appendChild(newUse);
                            targetBox.appendChild(newG);
                        }
                    }
                    
                    // Remove the dragged material
                    if (draggingMaterial.parentNode) {
                        draggingMaterial.parentNode.removeChild(draggingMaterial);
                    }
                    
                    dropped = true;
                    console.log('Successfully showed material in target box');
                } else {
                    console.log('Drop position outside panel bounds');
                }
            }
        }

        if (!dropped && originalParent) {
            console.log('Returning to original position');
            // If not dropped in valid area, return to original parent
            try {
                originalParent.appendChild(draggingMaterial);
                draggingMaterial.setAttribute('transform', originalTransform);
            } catch (err) {
                console.error('Error returning to original position:', err);
            }
        }
        if (!dropped) {
            // Snap back to original position
            draggingMaterial.setAttribute('transform', originalTransform);
        }
        
        // Reset the dragging material's state
        if (draggingMaterial) {
            const rect = draggingMaterial.querySelector('rect');
            if (rect) {
                rect.style.pointerEvents = 'all';
                rect.style.cursor = 'pointer';
            }
        }
        
        // Reset dragging state
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

    // Feedback function (simple, can be improved)

    // --- End custom SVG Drag and Drop logic ---

    // ...existing code...
});