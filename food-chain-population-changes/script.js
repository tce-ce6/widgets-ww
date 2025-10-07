// Instantiate the class when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new FoodChainWidget();
});

class FoodChainWidget {
    constructor() {
        this.DEFAULT_CIRCLE_RADIUS = 35; 
        this.ACTIVE_COLOR = '#4CAF50';
        this.INSTRUCTION_COLOR = '#99FF00';
        
        // --- Tracking Variable ---
        this.lastClickedOrganismGroup = null; 
        // -----------------------------
        
        // --- Button and Text Element References ---
        this.playButton = document.getElementById('play-btn');
        this.resetButton = document.getElementById('reset-btn');
        this.instructionNote = document.getElementById('instruction-note');
        // 👇 NEW: Reference to the top-note SVG element
        this.topNote = document.getElementById('top-note'); 
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

        // --- Stage 1 Configuration (omitted for brevity) ---
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

        // --- Stage 2 Configuration (omitted for brevity) ---
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

        // --- Stage 3 Configuration (omitted for brevity) ---
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
        // 👇 Hide the top-note initially
        this.hideElement('top-note');
        this.addActiveCirclesToStage1();
        this.disableInitialButtons(); 
        this.setupStageListeners(); 
        this.setupPlayButtonListener(); 
        this.setupResetButtonListener(); 
        this.setGroupInteractionState(null, false); // Enable all stages initially
    }
    
    // -------------------------------------------

    // --- Button and Text Control Methods ---
    // (setGroupInteractionState, disableInitialButtons, setButtonState, updateInstructionText remain unchanged)

    // ... (Your methods for interaction control: setGroupInteractionState, disableInitialButtons, setButtonState, updateInstructionText, setupPlayButtonListener, setupResetButtonListener) ...
    
    /**
     * Resets the entire widget back to its initial state (Stage 1).
     */
    handleResetButtonClick() {
        // 1. Reset all visual states to initial (Stage 1)
        this.hideDefaultElements(); // Hides all graphics that should be initially hidden
        this.applyStageConfig('maize-stages', 'stage-1', this.stage1Config['maize-stages']);
        this.applyStageConfig('Grasshopper-stages', 'stage-1', this.stage1Config['Grasshopper-stages']);
        this.applyStageConfig('lizard-stages', 'stage-1', this.stage1Config['lizard-stages']);
        
        // 👇 Hide top-note on reset
        this.hideElement('top-note');
        
        // Reset population notes visually
        this.resetPopulationNotes(); 

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
     * Resets the population instruction notes to a default 'Increase' state (or empty).
     */
    resetPopulationNotes() {
        const maizeNote = document.querySelector('#maize-increase #instruction-note');
        const grasshopperNote = document.querySelector('#grasshopper-increase #instruction-note');
        const lizardNote = document.querySelector('#lizard-increase #instruction-note');

        // Reset to default text and green color (or transparent)
        if (maizeNote) { maizeNote.textContent = 'Increase'; maizeNote.style.color = this.INSTRUCTION_COLOR; }
        if (grasshopperNote) { grasshopperNote.textContent = 'Increase'; grasshopperNote.style.color = this.INSTRUCTION_COLOR; }
        if (lizardNote) { lizardNote.textContent = 'Increase'; lizardNote.style.color = this.INSTRUCTION_COLOR; }
    }

    /**
     * NEW METHOD: Applies the specific population changes based on the selected organism.
     * @param {string} groupId - The ID of the organism group that was selected.
     */
    updatePopulationNotes(groupId) {
        // 1. Always reset all notes first to clear previous state (especially color)
        this.resetPopulationNotes();
        
        const maizeNote = document.querySelector('#maize-increase #instruction-note');
        const grasshopperNote = document.querySelector('#grasshopper-increase #instruction-note');
        const lizardNote = document.querySelector('#lizard-increase #instruction-note');

        // 2. Apply new changes based on the clicked group
        if (groupId === 'Grasshopper-stages') {
            // Increasing grasshoppers (consumer) -> Maize (food) decreases, Lizards (predator) increase
            if (maizeNote) { maizeNote.textContent = 'Decrease'; maizeNote.style.color = '#FFB300'; } // Orange/Warning color for decrease
            if (lizardNote) { lizardNote.textContent = 'Increase'; lizardNote.style.color = this.INSTRUCTION_COLOR; }
        } 
        else if (groupId === 'maize-stages') {
            // Increasing maize (food) -> Grasshoppers (consumer) increase
            if (grasshopperNote) { grasshopperNote.textContent = 'Increase'; grasshopperNote.style.color = this.INSTRUCTION_COLOR; }
            // Maize doesn't typically affect lizard directly in this simple chain, but the rule for the other two needs to be established.
            // Since reset sets them to 'Increase', no specific action needed for them unless they should be explicitly 'No Change'
        } 
        else if (groupId === 'lizard-stages') {
            // Increasing lizards (predator) -> Grasshoppers (food) decrease
            if (grasshopperNote) { grasshopperNote.textContent = 'Decrease'; grasshopperNote.style.color = '#FFB300'; } // Orange/Warning color for decrease
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

        // 👇 Hide top-note when 'Play' is clicked
        this.hideElement('top-note');

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
    
    // ... (hideDefaultElements, showElement, hideElement, applyStageConfig remain unchanged) ...

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

                        // 👇 Show the top-note when any stage is clicked
                        this.showElement('top-note');
                        
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
                        
                        // 7. Determine and apply show/hide config (omitted for brevity)
                        let config = null;
                        if (stageId === 'stage-1') {
                            config = this.stage1Config[group.id]; 
                        } else if (stageId === 'stage-2') {
                            config = this.stage2Config[group.id];
                        } else if (stageId === 'stage-3') {
                            config = this.stage3Config[group.id];
                        }
                        
                        if (config) {
                            if (config.show && Array.isArray(config.show)) {
                                config.show.forEach(id => this.showElement(id));
                            }
                            if (config.hide && Array.isArray(config.hide)) {
                                config.hide.forEach(id => this.hideElement(id));
                            }
                        }

                        // 8. Call the NEW DEDICATED method for population logic
                        this.updatePopulationNotes(group.id);
                        
                    });
                } else {
                    console.warn(`Stage element #${stageId} not found in ${group.id}.`);
                }
            });
        });
    }
    
    // ... (getStageCenter, addActiveCirclesToStage1, moveActiveCircle remain unchanged) ...

    // ADDED FOR BREVITY - YOUR ORIGINAL METHODS
    setGroupInteractionState(activeGroupId, disabledState) {
        this.organismStages.forEach(group => {
            const groupElement = document.getElementById(group.id);
            if (!groupElement) return;

            if (activeGroupId === null || group.id !== activeGroupId) {
                if (disabledState) {
                    groupElement.style.pointerEvents = 'none';
                    groupElement.style.opacity = '0.5'; 
                } else {
                    groupElement.style.pointerEvents = '';
                    groupElement.style.opacity = '1.0';
                }
            } else {
                groupElement.style.pointerEvents = '';
                groupElement.style.opacity = '1.0';
            }
        });
    }

    disableInitialButtons() {
        this.setButtonState(true, true);
    }
    
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

    setupPlayButtonListener() {
        if (this.playButton) {
            this.playButton.addEventListener('click', () => {
                this.handlePlayButtonClick();
            });
        }
    }

    setupResetButtonListener() {
        if (this.resetButton) {
            this.resetButton.addEventListener('click', () => {
                this.handleResetButtonClick();
            });
        }
    }
    
    applyStageConfig(groupId, stageId, config) {
        if (config && config.show && Array.isArray(config.show)) {
            config.show.forEach(id => this.showElement(id));
        }
        if (config && config.hide && Array.isArray(config.hide)) {
            config.hide.forEach(id => this.hideElement(id));
        }
    }

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