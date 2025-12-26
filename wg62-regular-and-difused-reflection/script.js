document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Setup: Ensure the menu is visible when the page loads
    // (In your HTML, Material_title has style="display:none", we need to show it initially)
    resetActiveSimulation();

    // 2. Define the mappings between clickable buttons and the reflection groups
    const interactions = [
        { 
            btnId: "mirror-surface-selection", 
            targetId: "mirror-reflection" 
        },
        { 
            btnId: "lake-surface-selection", 
            targetId: "lake-surface-reflection",
            // Special handling for lake because it has nested hidden images
            isLake: true 
        },
        { 
            btnId: "paper-selection", 
            targetId: "paper-reflection" 
        },
        { 
            btnId: "wall-selection", 
            targetId: "wall-reflection" 
        }
    ];

    // 3. specific elements to hide on click
    const menuGroup = document.getElementById("Material_title");
    const instructionText = document.getElementById("i_text");

    // 4. Add Click Event Listeners
    interactions.forEach(item => {
        const button = document.getElementById(item.btnId);
        const target = document.getElementById(item.targetId);

        if (button) {
            // Make it look clickable
            button.style.cursor = "pointer";

            button.addEventListener("click", () => {
                // Hide the Menu and Text
                if (menuGroup) menuGroup.style.display = "none";
                if (instructionText) instructionText.style.display = "none";

                // Show the specific reflection
                if (target) {
                    target.style.display = "block";
                    
                    // Special fix for Lake: 
                    // The lake group contains inner images that are also hidden.
                    // We must show the "calm" lake by default when lake is chosen.
                    if (item.isLake) {
                        const calmLake = document.getElementById("lake_calm_reflection");
                        if (calmLake) calmLake.style.display = "block";
                    }
                }
            });
        }
    });
});

// 5. Reset Function (Called by the HTML button)
window.resetActiveSimulation = function() {
    // Elements to show
    const menuGroup = document.getElementById("Material_title");
    const instructionText = document.getElementById("i_text");

    // Show Menu and Text
    if (menuGroup) menuGroup.style.display = "block"; // or "inline" depending on SVG structure, but block usually works for Groups
    if (instructionText) instructionText.style.display = "block";

    // Hide ALL reflection groups
    const allReflections = [
        "mirror-reflection", 
        "lake-surface-reflection", 
        "paper-reflection", 
        "wall-reflection"
    ];

    allReflections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });

    // Reset internal Lake states (hide the specific lake types)
    const lakeInternalIds = ["lake_calm_reflection", "lake_wavy_reflection", "lake_rough_reflection"];
    lakeInternalIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
};