/**
 * Manages click interactions to ensure:
 * 1. Zoom panels are EXCLUSIVE to their type.
 * 2. Selection markers are INDEPENDENT (one leaf AND one root can be visible).
 * 3. Rectangles hide based on the type clicked, but the other type's rectangles remain visible.
 * 4. Provides plain text feedback based on the Leaf and Root type combination selected.
 */
class ZoomManager {
    constructor(clickableIds, zoomSuffix = '-zoom') {
        this.clickableIds = clickableIds;
        this.zoomSuffix = zoomSuffix;
        this.handleClick = this.handleClick.bind(this);
        this.reset = this.reset.bind(this);
        
        // Properties to track the current selected type (e.g., 'monocot', 'dicot', or null)
        this.currentLeafType = null;
        this.currentRootType = null;

        this.monocotBtn = null;
        this.dicotBtn = null;
        this.resultContainer = null;
        this.resultNote = null;
        this.msgContainer = null;
        this.resetBtn = null;
        this.plantContainer = null;
        this.resetNote = null; // Element that contains the reset button/note
        this.btnWrapper = null;
        this.selectNote = null;
    }

    init() {
        // NOTE: The initial listener attachment from your previous init() is moved to attachPlantPartListeners()
        
        this.monocotBtn = document.getElementById('monocot-btn');
        this.dicotBtn = document.getElementById('dicot-btn');
        this.resultContainer = document.getElementById('result-container');
        this.resultNote = document.getElementById('result-note');
        this.resetNote = document.getElementById('reset-note');
        this.msgContainer = document.getElementById('message-container');
        this.resetBtn = document.getElementById('reset-btn');
        this.plantContainer = document.getElementById('plant-container');
        this.btnWrapper = document.querySelector(".btn-wrapper");
        this.selectNote = document.getElementById("select-note");

        if (this.monocotBtn) {
            this.monocotBtn.addEventListener('click', () => {
                this.checkResult("monocot-result");
            });
        }

        if (this.dicotBtn) {
            this.dicotBtn.addEventListener('click', () => {
                this.checkResult("dicot-result");
            });
        }
        
        if (this.resetBtn) {
            this.resetBtn.setAttribute("aria-disabled", "true");
        }

        if (this.msgContainer) {
             this.msgContainer.style.display = 'none';
        }
        
        // Perform initial reset, which now calls attachPlantPartListeners()
        this.resetInternalState();
    }
    
    // -------------------------------------------------------------------
    // ## NEW: Listener Control Helpers
    // -------------------------------------------------------------------

    /**
     * Attaches click listeners to all plant part elements and sets cursor to pointer.
     */
    attachPlantPartListeners() {
        this.clickableIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Ensure the listener is added only once, then manage removal
                element.removeEventListener('click', this.handleClick); 
                element.addEventListener('click', this.handleClick);
                element.style.cursor = 'pointer';
            }
        });
    }

    /**
     * Removes click listeners from all plant part elements and resets cursor to default.
     */
    detachPlantPartListeners() {
        this.clickableIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.removeEventListener('click', this.handleClick);
                element.style.cursor = 'default';
            }
        });
    }

    // -------------------------------------------------------------------
    // ## CORE LOGIC: CHECK RESULT (Locks the Selection)
    // -------------------------------------------------------------------
    checkResult(resultType) {
        // 🔥 NEW: Disable selection on plant parts
        this.detachPlantPartListeners();
        
        // 1. Enable the reset button and re-attach listener
        if (this.resetBtn) {
            // Ensure the button is enabled and clickable after results are shown
            this.resetBtn.removeEventListener('click', this.reset);
            this.resetBtn.addEventListener('click', this.reset);
            this.resetBtn.setAttribute("aria-disabled", "false"); 
        }

        this.msgContainer.style.display = "none";
        
        // 2. MAKE THE RESET NOTE/BUTTON VISIBLE
        if (this.resetNote) {
             this.resetNote.style.display = "block"; 
        }


        this.plantContainer.classList.add('resize-plant');

        this.btnWrapper.style.transform = "translate(0px, -252px)";
        this.selectNote.style.transform = "translate(0px, -247px)";
        this.resultContainer.style.transform = "translate(0px, 63px)";

        this.resultContainer.classList.remove('correct-result'); // Clear previous state

        if(resultType === "monocot-result" && this.currentLeafType === "monocot" && this.currentRootType === "monocot") {
            this.resultContainer.style.display = "block";
            this.resultContainer.classList.remove('incorrect-result');
            this.resultContainer.classList.add('correct-result');
            this.resultNote.innerHTML = "<span>You are correct! A monocot plant generally has leaves with parallel venations and fibrous roots.<span class='exceptions-txt'> Exception: Smilax is a monocot plant having reticulate venation.</span></span>";
            
        }else if (resultType === "dicot-result" && (this.currentLeafType == "monocot" || this.currentRootType == "monocot")) {
            this.resultContainer.style.display = "block";
            this.resultContainer.classList.remove('correct-result');
            this.resultContainer.classList.add('incorrect-result');
            this.resultNote.innerHTML = "<span>You are incorrect! It is not a dicot plant as it has leaves with parallel venations and fibrous roots.</span>";
        } 
        else if (resultType === "dicot-result" && this.currentLeafType === "dicot" && this.currentRootType === "dicot") {
            this.resultContainer.style.display = "block";
            this.resultContainer.classList.remove('incorrect-result');
            this.resultContainer.classList.add('correct-result');
            this.resultNote.innerHTML = "<span>You are correct! A dicot plant generally has leaves with reticulate venations and tap-roots. <span class='exceptions-txt'>​ Exceptions: Calophyllum and Eryngium are dicot plants having parallel leaf venations with tap-roots.</span></span>";
            
        } else if (resultType === "monocot-result" && (this.currentLeafType == "dicot" || this.currentRootType == "dicot")) {
            this.resultContainer.style.display = "block";
            this.resultContainer.classList.remove('correct-result');
            this.resultContainer.classList.add('incorrect-result');
            this.resultNote.innerHTML = "<span>You are incorrect! It is not a monocot plant as it has leaves with reticulate venations and tap-roots. ​</span>";
        }
    }
    
    // -------------------------------------------------------------------
    // ## CORE LOGIC: UPDATE FEEDBACK (Hides the Reset Button)
    // -------------------------------------------------------------------
    /**
     * Updates the feedback message with plain text based on the current leaf and root selections.
     */
    updateFeedbackMessage() {
        const msgContainer = document.getElementById('message-container');
        const msgNote = document.getElementById('message-note');
        const instructionNote = document.getElementById("instruction-note");
        const btnGroup = document.getElementById("btn-group");
        
        if (!msgContainer || !msgNote || !instructionNote || !btnGroup) return;

        // Reset button should be hidden and disabled when selections are being made
        if (this.resetBtn) {
            this.resetBtn.setAttribute("aria-disabled", "true"); 
            this.resetBtn.removeEventListener('click', this.reset); 
        }
        if (this.resetNote) {
            this.resetNote.style.display = "none"; // Hide the reset button/note
        }

        // Hide result container immediately upon new selections
        if (this.resultContainer) {
            this.resultContainer.style.display = "none";
        }

        // Check if both a leaf and a root have been selected
        if (this.currentLeafType && this.currentRootType) {
            msgContainer.style.display = 'block'; // Make the container visible

            const isCorrectPair = (this.currentLeafType === this.currentRootType);
            let messageText = '';

            if (isCorrectPair) {
                messageText = `Correct pair! A plant with ${this.currentLeafType === 'monocot' ? 'parallel leaf venation' : 'reticulate leaf venation'} generally has ${this.currentRootType === 'monocot' ? 'fibrous roots' : 'tap roots'}.`;
                msgContainer.classList.add('correct-message');
                msgContainer.classList.remove('incorrect-message');
                instructionNote.style.display = "none";
                btnGroup.style.display = "block"; // Show Monocot/Dicot check buttons
                
            } else {
                messageText = "You have chosen the wrong pair of leaf venation and root types. Please try again!​";
                msgContainer.classList.remove('correct-message');
                msgContainer.classList.add('incorrect-message');
                instructionNote.style.display = "none";
                btnGroup.style.display = "none"; // Hide Monocot/Dicot check buttons
            }
            
            msgNote.textContent = messageText;

        } else {
             // Hide the message container if not a complete pair
             msgContainer.style.display = 'none';
             msgNote.textContent = '';
             instructionNote.style.display = "block";
             btnGroup.style.display = "none";
        }
    }
    
    // -------------------------------------------------------------------
    // ## CORE LOGIC: RESET STATE (Unlocks the Selection)
    // -------------------------------------------------------------------
    /**
     * Resets the internal state and the entire UI back to the initial condition.
     */
    resetInternalState() {
        // 🔥 NEW: Re-enable selection on plant parts
        this.attachPlantPartListeners();
        
        // 1. Reset selection tracking
        this.currentLeafType = null;
        this.currentRootType = null;

        // 2. Show all rectangles
        document.querySelectorAll('.leaf-rectangles, .root-rectangles').forEach(rectGroup => {
            rectGroup.style.display = 'block';
        });

        // 3. Hide all selection markers
        this.hideSelectionGroupsByType('leaf');
        this.hideSelectionGroupsByType('root');

        // 4. Hide all primary zoom panels
        this.clickableIds.forEach(id => {
            const zoomElement = document.getElementById(id + this.zoomSuffix);
            if (zoomElement) {
                zoomElement.style.display = 'none';
            }
        });

        // 5. Hide bottom selection display groups
        document.querySelectorAll('.selected-leaf-1, .selected-leaf-2, .selected-leaf-3, .selected-root').forEach(g => {
            if (g) g.style.display = 'none';
        });
        
        // 6. Reset UI elements
        if (this.resultContainer) {
            this.resultContainer.style.display = "none";
            this.resultContainer.classList.remove('correct-result');
        }
        if (this.msgContainer) {
            this.msgContainer.style.display = 'none';
            const msgNote = document.getElementById('message-note');
            if (msgNote) msgNote.textContent = '';
        }
        if (this.plantContainer) {
            this.plantContainer.classList.remove('resize-plant');
        }
        if (this.btnWrapper) {
            this.btnWrapper.style.transform = "translate(0px, 0px)"; // Reset transform
        }
        if (this.selectNote) {
            this.selectNote.style.transform = "translate(0px, 0px)"; // Reset transform
        }
        if (this.resultContainer) {
            this.resultContainer.style.transform = "translate(0px, 0px)"; // Reset transform
        }
        
        // CONTROL VISIBILITY: Hide reset note/button on reset
        if (this.resetNote) {
            this.resetNote.style.display = "none";
        }
        
        const instructionNote = document.getElementById("instruction-note");
        const btnGroup = document.getElementById("btn-group");
        if (instructionNote) instructionNote.style.display = "block"; // Show initial instruction
        if (btnGroup) btnGroup.style.display = "none"; // Hide result buttons
        
        if (this.resetBtn) {
            this.resetBtn.setAttribute("aria-disabled", "true"); // Disable reset on clean state
            this.resetBtn.removeEventListener('click', this.reset); 
        }
    }
    
    /**
     * Public reset method that calls the internal one.
     */
    reset() {
        this.resetInternalState();
    }
    
    // -------------------------------------------------------------------
    // ## HELPER LOGIC (UNCHANGED)
    // -------------------------------------------------------------------
    
    // --- Function 1: Toggle the Primary Zoom Group (TYPE-SPECIFIC EXCLUSIVITY) ---

    hidePrimaryZoomGroupsByType(clickedId, type) {
        const typeSpecificIds = this.clickableIds.filter(id => id.includes(type));

        typeSpecificIds.forEach(id => {
            if (id !== clickedId) {
                const zoomElement = document.getElementById(id + this.zoomSuffix);
                if (zoomElement) {
                    zoomElement.style.display = 'none';
                }
            }
        });
    }

    togglePrimaryZoom(clickedId, type) {
        const targetZoomId = clickedId + this.zoomSuffix;
        const targetZoomElement = document.getElementById(targetZoomId);

        if (targetZoomElement) {
            const isCurrentlyHidden = (targetZoomElement.style.display === 'none' || targetZoomElement.style.display === '');

            this.hidePrimaryZoomGroupsByType(clickedId, type);

            if (isCurrentlyHidden) {
                targetZoomElement.style.display = 'block';
            } else {
                targetZoomElement.style.display = 'none';
            }
        }
    }

    // --- Function 2: Selection Markers (TYPE-SPECIFIC EXCLUSIVITY) ---

    /**
     * Helper to hide selection markers ONLY for the given type.
     */
    hideSelectionGroupsByType(type) {
        let selectors = [];

        if (type === 'leaf') {
            selectors = [
                '.selected-monocot-leaf-1', '.selected-monocot-leaf-2', '.selected-monocot-leaf-3',
                '.selected-diocot-leaf-1', '.selected-diocot-leaf-2', '.selected-diocot-leaf-3',
            ];
        } else if (type === 'root') {
            selectors = [
                '.selected-monocot-root-1', '.selected-monocot-root-2', '.selected-monocot-root-3',
                '.selected-dicot-root-1', '.selected-dicot-root-2', '.selected-dicot-root-3' 
            ];
        }

        const allSelectors = selectors.join(', ');

        if (allSelectors) {
            document.querySelectorAll(allSelectors).forEach(group => {
                group.style.display = 'none';
                const useElement = group.querySelector('use');
                if (useElement) {
                    useElement.style.display = 'none';
                }
            });
        }
    }

    /**
     * Shows groups corresponding to the clicked leaf/root ID, after hiding only the groups of the same type.
     */
    toggleSelectionMarkers(clickedId, type) {
        // 1. Clear only markers of the same type
        this.hideSelectionGroupsByType(type); 

        // 2. Determine the correct class name for the selected item
        let selectionBase = clickedId;
        if (clickedId.startsWith('dicot-leaf')) {
            selectionBase = clickedId.replace('dicot', 'diocot');
        }

        const selectionClass = `.selected-${selectionBase}`;
        
        // 3. Show the specific selection marker
        const selectedElements = document.querySelectorAll(selectionClass);
        
        selectedElements.forEach(group => {
            group.style.display = 'block';
            const useElement = group.querySelector('use');
            if (useElement) {
                useElement.style.display = 'block';
            }
        });
    }

    // --- Function 3: Update Selected Groups & Rectangle Hiding ---

    getSvgSource(element) {
        const useElement = element.querySelector('use');
        return useElement ? useElement.getAttribute('href') : null;
    }

    /**
     * Updates the target selected group(s) on the bottom panel AND hides the rectangles 
     * of the SELECTED type on the main image.
     */
    updateSelectedGroups(type, svgSource) {
        if (!svgSource) return;

        if (type === 'leaf') {
            // HIDE ALL LEAF RECTANGLES 
            document.querySelectorAll('.leaf-rectangles').forEach(rectGroup => {
                rectGroup.style.display = 'none';
            });
            
            // Update leaf selection displays (bottom display area)
            const leafGroups = [
                document.querySelector('.selected-leaf-1'),
                document.querySelector('.selected-leaf-2'),
                document.querySelector('.selected-leaf-3')
            ];

            leafGroups.forEach(g => {
                if (g) {
                    const useElement = g.querySelector('use');
                    if (useElement) {
                        useElement.setAttribute('href', svgSource);
                    }
                    g.style.display = 'block';
                }
            });
            
            // Ensure the root selection display at the bottom is hidden
            const rootDisplay = document.querySelector('.selected-root');
            if (rootDisplay) rootDisplay.style.display = 'none';

        } else if (type === 'root') {
            
            // HIDE ALL ROOT RECTANGLES 
            document.querySelectorAll('.root-rectangles').forEach(rectGroup => {
                rectGroup.style.display = 'none';
            });

            // Update root selection display (bottom display area)
            const rootGroup = document.querySelector('.selected-root');

            if (rootGroup) {
                const useElement = rootGroup.querySelector('use');
                if (useElement) {
                    useElement.setAttribute('href', svgSource);
                }
                rootGroup.style.display = 'block';
            }
            
            // Ensure the leaf selection displays at the bottom are hidden
            document.querySelectorAll('.selected-leaf-1, .selected-leaf-2, .selected-leaf-3').forEach(g => {
                 if (g) g.style.display = 'none';
            });
        }
    }
    
    /**
     * Main event handler logic.
     */
    handleClick(event) {
        const clickedElement = event.currentTarget;
        const clickedId = clickedElement.id;
        
        // Hide result container immediately upon any new click
        if (this.resultContainer) {
            this.resultContainer.style.display = "none";
        }

        let type;
        let botanicalType; // monocot or dicot

        if (clickedId.includes('leaf')) {
            type = 'leaf';
            // Determine the type from the ID for tracking
            botanicalType = clickedId.startsWith('monocot') ? 'monocot' : 'dicot';
            this.currentLeafType = botanicalType;

        } else if (clickedId.includes('root')) {
            type = 'root';
            // Determine the type from the ID for tracking
            botanicalType = clickedId.startsWith('monocot') ? 'monocot' : 'dicot';
            this.currentRootType = botanicalType;

        } else {
            return;
        }

        const svgSource = this.getSvgSource(clickedElement);
        
        // 1. Show the specific selection markers for the clicked item (clears same-type markers)
        this.toggleSelectionMarkers(clickedId, type);
        
        // 2. Execute the primary zoom functionality (exclusive per type)
        this.togglePrimaryZoom(clickedId, type);

        // 3. Execute the selection functionality (updates BOTTOM DISPLAY and hides same-type RECTANGLES)
        this.updateSelectedGroups(type, svgSource);
        
        // 4. Check and update the feedback message with plain text
        this.updateFeedbackMessage();
    }
}

// -------------------------------------------------------------------
// ## INITIALIZATION AND MODAL LOGIC
// -------------------------------------------------------------------

const allClickableIds = [
    "monocot-leaf-1", "monocot-leaf-2", "monocot-leaf-3",
    "dicot-leaf-1", "dicot-leaf-2", "dicot-leaf-3",
    "monocot-root-1", "monocot-root-2", "monocot-root-3",
    "dicot-root-1", "dicot-root-2", "dicot-root-3"
];

const manager = new ZoomManager(allClickableIds);

/**
 * Manages the modal visibility and content based on clicks to the zoom buttons.
 */
function initializeModalControls() {
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.getElementById('close-btn');
    const detailImg = document.getElementById('detail-img');
    const svgContainer = document.getElementById("svg-container");

    const zoomButtonIds = [
        "monocot-leaf-1-zoom-btn", "monocot-leaf-2-zoom-btn", "monocot-leaf-3-zoom-btn",
        "dicot-leaf-1-zoom-btn", "dicot-leaf-2-zoom-btn", "dicot-leaf-3-zoom-btn",
        "monocot-root-1-zoom-btn", "monocot-root-2-zoom-btn", "monocot-root-3-zoom-btn",
        "dicot-root-1-zoom-btn", "dicot-root-2-zoom-btn", "dicot-root-3-zoom-btn"
    ];

    if (!modal || !closeBtn || !detailImg) {
        console.warn("Modal elements (detail-modal, close-btn, or detail-img) not found. Modal controls will not initialize.");
        return;
    }

    // 1. Add listeners to the zoom buttons
    zoomButtonIds.forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) {
            const primaryGroupId = btnId.replace('-zoom-btn', '');
            const primaryGroup = document.getElementById(primaryGroupId);

            if (!primaryGroup) {
                console.warn(`Primary group for button '${btnId}' not found. Cannot determine SVG source.`);
                return;
            }

            const useElement = primaryGroup.querySelector('use');
            if (!useElement) {
                console.warn(`No <use> element found in primary group '${primaryGroupId}'.`);
                return;
            }

            const svgSource = useElement.getAttribute('href');

            // Add click listener
            btn.addEventListener('click', () => {
                detailImg.setAttribute('src', svgSource);
                modal.style.display = 'block';
                svgContainer.classList.add('modal-open');
                modal.style.transform = 'scale(1)';
                modal.style.opacity = '1';
                modal.style.visibility = 'visible';
            });
            btn.style.cursor = 'pointer';
        } else {
            console.warn(`Zoom button with ID '${btnId}' not found.`);
        }
    });

    // 2. Add listener to the close button
    closeBtn.addEventListener('click', () => {
        svgContainer.classList.remove('modal-open');
        modal.style.display = 'none';
    });
    closeBtn.style.cursor = 'pointer';
}


document.addEventListener('DOMContentLoaded', () => {
    manager.init();
    // Initialize the new modal controls
    initializeModalControls();
});