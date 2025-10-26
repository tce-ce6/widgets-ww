/**
 * Manages click interactions to ensure:
 * 1. Zoom panels are EXCLUSIVE to their type (only one leaf zoom open, only one root zoom open).
 * 2. Leaf zooms DO NOT hide root zooms, and vice-versa.
 * 3. Selection groups (selected-leaf/root) remain independent and single-selection per type.
 * 4. Hides ALL .leaf-rectangles or ALL .root-rectangles when corresponding item is selected.
 */
class ZoomManager {
    // ... (All existing methods: constructor, init, hidePrimaryZoomGroupsByType, togglePrimaryZoom, getSvgSource, updateSelectedGroups, handleClick remain UNCHANGED) ...
    constructor(clickableIds, zoomSuffix = '-zoom') {
        this.clickableIds = clickableIds;
        this.zoomSuffix = zoomSuffix;
        this.handleClick = this.handleClick.bind(this);
    }

    init() {
        this.clickableIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', this.handleClick);
                element.style.cursor = 'pointer';
            } else {
                console.warn(`Clickable element with ID '${id}' not found. Check your SVG/HTML.`);
            }
        });
    }

    // --- Function 1: Toggle the Primary Zoom Group (TYPE-SPECIFIC EXCLUSIVITY - UNCHANGED) ---

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
    // -------------------------------------------------------------------

    // --- Function 2: Update Selected Groups (Single Selection Per Type + Hiding ALL Rectangles - UNCHANGED) ---

    getSvgSource(element) {
        const useElement = element.querySelector('use');
        return useElement ? useElement.getAttribute('href') : null;
    }

    /**
     * Updates the target selected group(s) and HIDES all context rectangles of the selected type.
     */
    updateSelectedGroups(type, svgSource) {
        if (!svgSource) return;

        if (type === 'leaf') {
            // HIDE ALL LEAF RECTANGLES
            document.querySelectorAll('.leaf-rectangles').forEach(rectGroup => {
                rectGroup.style.display = 'none';
            });

            // Update leaf selection displays (Existing logic)
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

        } else if (type === 'root') {
            // HIDE ALL ROOT RECTANGLES
            document.querySelectorAll('.root-rectangles').forEach(rectGroup => {
                rectGroup.style.display = 'none';
            });

            // Update root selection display (Existing logic)
            const rootGroup = document.querySelector('.selected-root');

            if (rootGroup) {
                const useElement = rootGroup.querySelector('use');
                if (useElement) {
                    useElement.setAttribute('href', svgSource);
                }
                rootGroup.style.display = 'block';
            }
        }
    }
    // -------------------------------------------------------------------

    /**
     * Main event handler logic.
     */
    handleClick(event) {
        const clickedElement = event.currentTarget;
        const clickedId = clickedElement.id;

        let type;
        if (clickedId.includes('leaf')) {
            type = 'leaf';
        } else if (clickedId.includes('root')) {
            type = 'root';
        } else {
            return;
        }

        const svgSource = this.getSvgSource(clickedElement);

        // 1. Execute the primary zoom functionality (exclusive per type)
        this.togglePrimaryZoom(clickedId, type);

        // 2. Execute the selection functionality (hides ALL corresponding rectangles)
        this.updateSelectedGroups(type, svgSource);
    }
}

// --- Initialization Block ---
const allClickableIds = [
    "monocot-leaf-1", "monocot-leaf-2", "monocot-leaf-3",
    "dicot-leaf-1", "dicot-leaf-2", "dicot-leaf-3",
    "monocot-root-1", "monocot-root-2", "monocot-root-3",
    "dicot-root-1", "dicot-root-2", "dicot-root-3"
];

const manager = new ZoomManager(allClickableIds);

// --- NEW MODAL LOGIC STARTS HERE ---

/**
 * Manages the modal visibility and content based on clicks to the zoom buttons.
 */
function initializeModalControls() {
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.getElementById('close-btn');
    const detailImg = document.getElementById('detail-img');
    const svgContainer = document.getElementById("svg-container");

    // All the buttons that should trigger the modal
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
            // Find the corresponding primary group to get the SVG source
            const primaryGroupId = btnId.replace('-zoom-btn', '');
            const primaryGroup = document.getElementById(primaryGroupId);

            if (!primaryGroup) {
                console.warn(`Primary group for button '${btnId}' not found. Cannot determine SVG source.`);
                return;
            }

            // Find the <use> element within the primary group
            const useElement = primaryGroup.querySelector('use');
            if (!useElement) {
                console.warn(`No <use> element found in primary group '${primaryGroupId}'.`);
                return;
            }

            const svgSource = useElement.getAttribute('href');

            // Add click listener
            btn.addEventListener('click', () => {
                // Set the image source
                detailImg.setAttribute('src', svgSource);

                // Show the modal
                modal.style.display = 'block';
                svgContainer.classList.add('modal-open'); // Optional: Add a class for styling
                modal.style.transform = 'scale(1)'; // Optional: Add a scale effect
                modal.style.opacity = '1'; // Optional: Add a scale effect
                modal.style.visibility = 'visible'; // Optional: Add a scale effect
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