// script.js

document.addEventListener("DOMContentLoaded", () => {
    // Screen Elements
    const homeScreen = document.getElementById("Home screen");
    const activityScreen = document.getElementById("Activity screen");

    // Elements inside Activity Screen
    const reactionTitle = document.getElementById("Combination Reaction_4");
    const dropdownBtn = document.getElementById("Group 6");

    // All molecule group IDs from the SVG
    const allMolecules = [
        "c4h12o4", "cuso4", "zn", "cu", "hci", "ch4",
        "naoh", "co2", "h2o", "o2", "agno3", "nano3", "h2"
    ];

    // Mapping reactions to their relevant molecules based on the SVG assets
    const reactionMoleculesMap = {
        "Combination Reaction": ["h2", "o2", "h2o"],
        "Decomposition Reaction": ["h2o", "h2", "o2"],
        "Displacement Reaction": ["zn", "cuso4", "cu"],
        "Double Displacement Reaction": ["agno3", "nano3", "hci"], // Using closest available molecules
        "Redox (Oxidation-Reduction)": ["ch4", "o2", "co2", "h2o"]
    };

    // 1. Initial State: Show Home, Hide Activity and Molecules
    function init() {
        homeScreen.style.display = "block";
        activityScreen.style.display = "none";
        hideAllMolecules();
    }

    // Helper to hide all molecules
    function hideAllMolecules() {
        allMolecules.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });
    }

    // Helper to randomly position molecules within the simulation viewing area
    function randomizePosition(element) {
        // Generate random translate offsets 
        // (Adjust these ranges based on your exact SVG viewing window size)
        const randomX = Math.floor(Math.random() * 500) - 100;
        const randomY = Math.floor(Math.random() * 400) - 200;

        element.setAttribute("transform", `translate(${randomX}, ${randomY})`);
    }

    // 2. Load Reaction Function (Handles entering Activity Screen)
    window.loadReaction = function (reactionName) {
        homeScreen.style.display = "none";
        activityScreen.style.display = "block";

        // Update the title in the activity screen
        if (reactionTitle) {
            reactionTitle.textContent = reactionName;
        }

        // Hide all molecules, then show and randomize the relevant ones
        hideAllMolecules();

        const relevantMolecules = reactionMoleculesMap[reactionName] || [];
        relevantMolecules.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.style.display = "block";
                randomizePosition(el);
            }
        });
    };

    // Attach global click handlers for the Home Screen cards
    window.loadCombinationReaction = () => loadReaction("Combination Reaction");
    window.loadDecompositionReaction = () => loadReaction("Decomposition Reaction");
    window.loadDisplacementReaction = () => loadReaction("Displacement Reaction");
    window.loadDoubleDisplacementReaction = () => loadReaction("Double Displacement Reaction");
    window.loadRedoxReaction = () => loadReaction("Redox (Oxidation-Reduction)");

    // 3. Dropdown Implementation
    dropdownBtn.style.cursor = "pointer";

    dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent immediate closing
        toggleDropdown();
    });

    function toggleDropdown() {
        let dropdownOverlay = document.getElementById("reaction-dropdown-menu");

        // Create the dropdown menu if it doesn't exist
        if (!dropdownOverlay) {
            dropdownOverlay = document.createElement("div");
            dropdownOverlay.id = "reaction-dropdown-menu";

            // Styling to match your provided reference image
            Object.assign(dropdownOverlay.style, {
                position: "absolute",
                backgroundColor: "#ffffff",
                border: "2px solid #000",
                zIndex: "1000",
                width: "350px",
                boxShadow: "0px 4px 6px rgba(0,0,0,0.3)"
            });

            // The exact items shown in your image
            const items = [
                "Redox (Oxidation-Reduction)",
                "Double Displacement Reaction",
                "Displacement Reaction",
                "Decomposition Reaction",
                "Combination Reaction"
            ];

            items.forEach(item => {
                const itemDiv = document.createElement("div");
                itemDiv.textContent = item;

                // Match typography and borders
                Object.assign(itemDiv.style, {
                    padding: "12px 15px",
                    borderBottom: "2px solid #000",
                    cursor: "pointer",
                    fontFamily: "Roboto, sans-serif",
                    fontSize: "20px",
                    color: "#000",
                    backgroundColor: "#fff"
                });

                // Hover effects matching the orange selector tint
                itemDiv.addEventListener("mouseenter", () => itemDiv.style.backgroundColor = "#FCDCB9");
                itemDiv.addEventListener("mouseleave", () => itemDiv.style.backgroundColor = "#fff");

                // Click handler to load the reaction
                itemDiv.addEventListener("click", () => {
                    loadReaction(item);
                    dropdownOverlay.style.display = "none";
                });

                dropdownOverlay.appendChild(itemDiv);
            });

            document.body.appendChild(dropdownOverlay);
        }

        // Position the dropdown directly over/above the SVG button
        const btnRect = dropdownBtn.getBoundingClientRect();
        dropdownOverlay.style.left = `${btnRect.left}px`;

        // Place the bottom of the dropdown list right at the top of the button
        dropdownOverlay.style.bottom = `${window.innerHeight - btnRect.top}px`;

        // Toggle display
        dropdownOverlay.style.display = dropdownOverlay.style.display === "none" ? "block" : "none";
    }

    // Close the dropdown if the user clicks anywhere else on the screen
    document.addEventListener("click", (e) => {
        const dropdownOverlay = document.getElementById("reaction-dropdown-menu");
        if (dropdownOverlay && dropdownOverlay.style.display === "block") {
            dropdownOverlay.style.display = "none";
        }
    });

    // Run initial state setup
    init();
});