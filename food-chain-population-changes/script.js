// Instantiate the class when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FoodChainWidget();
});

class FoodChainWidget {
    constructor() {
        this.DEFAULT_CIRCLE_RADIUS = 35; 
        this.ACTIVE_COLOR = '#4CAF50';
        
        // --- Tracking Variable ---
        this.lastClickedOrganismGroup = null; 
        // -----------------------------
        
        // --- Button and Text Element References ---
        this.playButton = document.getElementById('play-btn');
        this.resetButton = document.getElementById('reset-btn');
        this.instructionNote = document.getElementById('instruction-note');
        // ----------------------------------------------
        
        // --- DEFAULT HIDDEN ELEMENTS (Used only for initial DOM state) ---
        // These are the initial stage graphics that are hidden on load.
        this.defaultHiddenIds = [
            'lizard_1', 'lizard_2', 'lizard_5', 'lizard_6', 
            'maize-1', 'maize-4', 'maize-5', 'maize-8', 'maize-10', 'maize-12',
            'grasshopper-1', 'grasshopper-3', 'grasshopper-7', 'grasshopper-8',
            'maize-increase',      
            'grasshopper-increase',
            'lizard-increase'      
        ];
        // -----------------------------------------------------------------

        // --- Stage 1 Configuration ---
        this.stage1Config = {
            'maize-stages': { 
                show: ['maize-2', 'maize-3', 'maize-6', 'maize-7', 'maize-9', 'maize-11'], 
                hide: [
                    'maize-1', 'maize-4', 'maize-5', 'maize-8', 'maize-10', 'maize-12'
                ] 
            },
            'Grasshopper-stages': {
                show: [], 
                hide: [
                    'grasshopper-1', 'grasshopper-3', 'grasshopper-7', 'grasshopper-8'
                ]
            }, 
            'lizard-stages': {
                show: [], 
                hide: [
                    'lizard_1', 'lizard_2', 'lizard_5', 'lizard_6'
                ]
            }
        };

        // --- Stage 2 Configuration ---
        this.stage2Config = {
            'maize-stages': { 
                show: ['maize-1', 'maize-4', 'maize-increase'],
                hide: ['maize-5', 'maize-8', 'maize-10', 'maize-12'] 
            },
            'Grasshopper-stages': {
                show: ['grasshopper-1', 'grasshopper-7', 'grasshopper-increase'],
                hide: ['grasshopper-3', 'grasshopper-8'] 
            }, 
            'lizard-stages': {
                show: ['lizard_1', 'lizard_5', 'lizard-increase'],
                hide: ['lizard_2', 'lizard_6'] 
            }
        };

        // --- Stage 3 Configuration ---
        this.stage3Config = {
            'maize-stages': {
                show: ['maize-5', 'maize-8', 'maize-12', 'maize-10', 'maize-increase', 'maize-1' , 'maize-4'],
                hide: [] 
            },
            'Grasshopper-stages': {
                show: ['grasshopper-3', 'grasshopper-8', 'grasshopper-1', 'grasshopper-7' ,'grasshopper-increase'],
                hide: []
            }, 
            'lizard-stages': {
                show: ['lizard_2', 'lizard_6', 'lizard_1', 'lizard_5', 'lizard-increase'],
                hide: []
            }
        };
        // -------------------------------------------------------------------------------
        
        // Configuration for stages (used for initialization and listeners)
        this.organismStages = [
            { id: 'maize-stages', stages: ['stage-1', 'stage-2', 'stage-3'] },
            { id: 'Grasshopper-stages', stages: ['stage-1', 'stage-2', 'stage-3'] },
            { id: 'lizard-stages', stages: ['stage-1', 'stage-2', 'stage-3'] }
        ];

        // Map to store the currently active circle element for each organism group
        this.activeCircles = {}; 

        this.initializeWidget(); 
    }

    // --- Initialization and Basic Visibility ---

    initializeWidget() {
        this.hideDefaultElements();
        this.addActiveCirclesToStage1();
        this.disableInitialButtons(); 
        this.setupStageListeners(); 
        this.setupPlayButtonListener(); 
        this.setupResetButtonListener(); 
        this.setGroupInteractionState(null, false); // Enable all stages initially
    }
    
    // --- Stage Group Interaction Control ---

    /**
     * Disables interaction on all organism groups except the specified one.
     * @param {string | null} activeGroupId - The ID of the group to keep enabled, or null to enable all.
     * @param {boolean} disabledState - true to disable interaction, false to enable.
     */
    setGroupInteractionState(activeGroupId, disabledState) {
        this.organismStages.forEach(group => {
            const groupElement = document.getElementById(group.id);
            if (!groupElement) return;

            // Only apply the disabled state if the group is NOT the active group OR if we are enabling all (activeGroupId is null)
            if (activeGroupId === null || group.id !== activeGroupId) {
                if (disabledState) {
                    // Disable: Block pointer events and dim the visuals
                    groupElement.style.pointerEvents = 'none';
                    groupElement.style.opacity = '0.5'; 
                } else {
                    // Enable: Restore pointer events and opacity
                    groupElement.style.pointerEvents = ''; // Reset to default
                    groupElement.style.opacity = '1.0';
                }
            } else {
                // Ensure the active group is always fully enabled
                groupElement.style.pointerEvents = '';
                groupElement.style.opacity = '1.0';
            }
        });
    }

    // -------------------------------------------

    // --- Button and Text Control Methods ---

    disableInitialButtons() {
        // ACTION: Disable both Play (true) and Reset (true) buttons initially
        this.setButtonState(true, true);
    }
    
    /**
     * NEW: Takes separate control states for Play and Reset buttons.
     */
    setButtonState(disabledPlay, disabledReset) {
        if (this.playButton) {
            this.playButton.disabled = disabledPlay;
            if (this.playButton.tagName.toLowerCase() === 'g') {
                this.playButton.style.opacity = disabledPlay ? '0.5' : '1.0';
            }
        }
        if (this.resetButton) {
            this.resetButton.disabled = disabledReset;
            if (this.resetButton.tagName.toLowerCase() === 'g') {
                this.resetButton.style.opacity = disabledReset ? '0.5' : '1.0';
            }
        }
    }
    
    updateInstructionText(text) {
        if (this.instructionNote) {
            this.instructionNote.textContent = text;
        }
    }

    // -------------------------------------------
    
    setupPlayButtonListener() {
        if (this.playButton) {
            this.playButton.addEventListener('click', () => {
                this.handlePlayButtonClick();
            });
        }
    }

    /**
     * Sets up the listener for the Reset button.
     */
    setupResetButtonListener() {
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => {
                this.handleResetButtonClick();
            });
        }
    }

    /**
     * Resets the entire widget back to its initial state (Stage 1).
     */
    handleResetButtonClick() {
        // 1. Reset all visual states to initial (Stage 1)
        this.hideDefaultElements(); // Hides all graphics that should be initially hidden
        this.applyStageConfig('maize-stages', 'stage-1', this.stage1Config['maize-stages']);
        this.applyStageConfig('Grasshopper-stages', 'stage-1', this.stage1Config['Grasshopper-stages']);
        this.applyStageConfig('lizard-stages', 'stage-1', this.stage1Config['lizard-stages']);
        
        // 2. Move active circles back to stage-1
        this.organismStages.forEach(group => {
            const stage1Element = document.getElementById(group.id).querySelector('#stage-1');
            if (stage1Element) {
                this.moveActiveCircle(group.id, stage1Element);
            }
        });
        
        // 3. Reset all interaction states
        this.setGroupInteractionState(null, false); // Enable all stage groups
        // ACTION: Disable both Play (true) and Reset (true) buttons
        this.setButtonState(true, true); 
        this.lastClickedOrganismGroup = null; // Clear tracking variable
        
        // 4. Reset instructions
        this.updateInstructionText("Select any stage for any organism to begin.");
    }
    
    /**
     * Helper method to apply configuration (show/hide) for a specific stage.
     */
    applyStageConfig(groupId, stageId, config) {
        // 1. SHOW elements
        if (config && config.show && Array.isArray(config.show)) {
            config.show.forEach(id => this.showElement(id));
        }
        // 2. HIDE elements
        if (config && config.hide && Array.isArray(config.hide)) {
            config.hide.forEach(id => this.hideElement(id));
        }
    }

    /**
     * UPDATED: Only disables the Play button, keeping the Reset button enabled.
     */
    handlePlayButtonClick() {
        // 1. Hide all 'increase' elements first to reset the display
        this.hideElement('maize-increase');
        this.hideElement('grasshopper-increase');
        this.hideElement('lizard-increase');

        // 2. Determine which organism group was last clicked and show controls
        if (this.lastClickedOrganismGroup) {
            
            // Show all 'increase' controls regardless of which was clicked (per your current logic)
            this.showElement('maize-increase');
            this.showElement('grasshopper-increase');
            this.showElement('lizard-increase');

            // 3. Keep the selected stage group enabled and others disabled
            this.setGroupInteractionState(this.lastClickedOrganismGroup, true); 
            
            // ACTION: Disable the Play button (true), keep Reset enabled (false)
            this.setButtonState(true, false); 

        } else {
            console.warn("Play clicked before selecting an organism stage.");
        }
        
        // Update instruction text
        this.updateInstructionText("Drag the slider left or right to see other changes.");
    }
    // -------------------------------------------

    hideDefaultElements() {
        this.defaultHiddenIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.style.display = 'none'; 
            }
        });
    }

    showElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = ''; 
        }
    }
    
    hideElement(id) {
        const element = document.getElementById(id);
        if (element) {
            element.style.display = 'none';
        }
    }

    /**
     * Finds the center coordinates of the main circle path within a stage element.
     */
    getStageCenter(stageElement) {
        const existingEllipse = stageElement.querySelector('path[id^="Ellipse 7"]');

        if (existingEllipse) {
            const bbox = existingEllipse.getBBox(); 
            const cx = bbox.x + bbox.width / 2;
            const cy = bbox.y + bbox.height / 2;
            return { cx, cy };
        } else {
            console.error(`Ellipse path not found in stage: ${stageElement.id}`);
            return { cx: 0, cy: 0 };
        }
    }

    /**
     * Adds the initial active green circle to stage-1 and tracks it.
     */
    addActiveCirclesToStage1() {
        this.organismStages.forEach(group => {
            const parentGroup = document.getElementById(group.id);
            if (!parentGroup) return;

            const stage1Group = parentGroup.querySelector('#stage-1'); 
            if (!stage1Group) return;
            
            const { cx, cy } = this.getStageCenter(stage1Group);

            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', cx);
            circle.setAttribute('cy', cy);
            circle.setAttribute('r', this.DEFAULT_CIRCLE_RADIUS); 
            circle.setAttribute('fill', this.ACTIVE_COLOR); 
            circle.setAttribute('class', 'active-indicator-circle'); 

            stage1Group.appendChild(circle);
            
            this.activeCircles[group.id] = circle; 
        });
    }

    /**
     * Sets up click listeners on all stages (stage-1, stage-2, stage-3) for all three organisms.
     */
    setupStageListeners() {
    this.organismStages.forEach(group => {
        const parentGroup = document.getElementById(group.id);
        if (!parentGroup) return;

        group.stages.forEach(stageId => {
            const stageElement = parentGroup.querySelector(`#${stageId}`);
            if (stageElement) {
                // Attach the event listener to the stage group
                stageElement.addEventListener('click', (event) => {
                    
                    // 1. Reset/Hide ALL 'increase' elements 
                    this.hideElement('maize-increase');
                    this.hideElement('grasshopper-increase');
                    this.hideElement('lizard-increase');
                    
                    // 2. Move the active green circle to the clicked stage
                    this.moveActiveCircle(group.id, stageElement);
                    
                    // 3. Track the last clicked organism group
                    this.lastClickedOrganismGroup = group.id;

                    // 4. Disable all OTHER stage groups (keeps current group enabled)
                    this.setGroupInteractionState(group.id, true); 

                    // 5. Enable both Play (false) and Reset (false) buttons
                    this.setButtonState(false, false); 

                    // 6. Update instruction
                    this.updateInstructionText("Click 'Play' to observe the changes.");
                    
                    // 7. Determine which configuration object to use based on clicked stage
                    let config = null;
                    if (stageId === 'stage-1') {
                        config = this.stage1Config[group.id]; 
                    } else if (stageId === 'stage-2') {
                        config = this.stage2Config[group.id];
                    } else if (stageId === 'stage-3') {
                        config = this.stage3Config[group.id];
                    }
                    
                    // 8. Apply show/hide logic
                    if (config) {
                        if (config.show && Array.isArray(config.show)) {
                            config.show.forEach(id => this.showElement(id));
                        }
                        if (config.hide && Array.isArray(config.hide)) {
                            config.hide.forEach(id => this.hideElement(id));
                        }
                    }

                    // --- 9. NEW: Food Chain Population Rule Logic ---
                    if (group.id === 'Grasshopper-stages') {
                        // Increasing grasshoppers → Maize decreases, Lizards increase
                        const maizeNote = document.querySelector('#maize-increase #instruction-note');
                        const lizardNote = document.querySelector('#lizard-increase #instruction-note');
                        if (maizeNote) {maizeNote.textContent = 'Decrease'; maizeNote.style.color = '#FFB300';}
                        if (lizardNote) lizardNote.textContent = 'Increase';
                    } 
                    else if (group.id === 'maize-stages') {
                        // Increasing maize → Grasshoppers increase
                        const grasshopperNote = document.querySelector('#grasshopper-increase #instruction-note');
                        if (grasshopperNote) grasshopperNote.textContent = 'Increase';
                    } 
                    else if (group.id === 'lizard-stages') {
                        // Increasing lizards → Grasshoppers decrease
                        const grasshopperNote = document.querySelector('#grasshopper-increase #instruction-note');
                        if (grasshopperNote) {grasshopperNote.textContent = 'Decrease'; grasshopperNote.style.color = '#FFB300';}
                    }
                    // --- End of Food Chain Logic ---
                });
            } else {
                console.warn(`Stage element #${stageId} not found in ${group.id}.`);
            }
        });
    });
}


    /**
     * Moves the green circle from its current position to the center of the clicked stage.
     */
    moveActiveCircle(organismId, targetStageElement) {
        const currentCircle = this.activeCircles[organismId];
        
        if (!currentCircle) {
            console.error(`Active circle not found for ${organismId}.`);
            return;
        }

        const { cx, cy } = this.getStageCenter(targetStageElement);

        if (cx === 0 && cy === 0) {
            console.error(`Could not determine valid position for stage: ${targetStageElement.id}`);
            return;
        }

        currentCircle.setAttribute('cx', cx);
        currentCircle.setAttribute('cy', cy);
        
        targetStageElement.appendChild(currentCircle);
        
    }
}

