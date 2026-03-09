document.addEventListener("DOMContentLoaded", () => {
    const actionBtns = document.querySelectorAll(".action-btn");
    const resetBtn = document.getElementById("reset-btn");
    const buttonInsite = document.getElementById("Button_Insite");
    const modalForeignObj = document.querySelector(".insight-modal").closest("foreignObject");
    const closeBtn = document.getElementById("close-btn");
    const instructionText = document.getElementById("Select at least one from below  to view the blood flow");
    
    // Labels
    const pulmonaryVein = document.getElementById("pulmonary-vein");
    const pulmonaryArtery = document.getElementById("pulmonary-artery");
    const venaCava = document.getElementById("vena-cava");
    const dorsalAorta = document.getElementById("dorsal-aorta");
    
    const allLabels = [pulmonaryVein, pulmonaryArtery, venaCava, dorsalAorta];

    const hideAllLabels = () => {
        allLabels.forEach(label => {
            if (label) label.style.display = "none";
        });
    };
    
    const hideAllContainers = () => {
        actionBtns.forEach(b => {
            if (b.id !== "reset-btn") {
                const container = document.getElementById(`container-${b.id}`);
                if (container) container.style.display = "none";
            }
        });
    };
    
    let activeAnimations = {};

    // By default, reset btn shouldn't be clickable
    if (resetBtn) {
        resetBtn.style.pointerEvents = "none";
        resetBtn.style.cursor = "default";
    }

    // Insight button cursor
    if (buttonInsite) {
        buttonInsite.style.cursor = "pointer";
    }

    actionBtns.forEach(btn => {
        if (btn.id === "reset-btn") return;

        // Make action buttons look clickable
        btn.style.cursor = "pointer";

        btn.addEventListener("click", () => {
            const isActive = !!activeAnimations[btn.id];

            if (isActive) {
                // Deactivate
                activeAnimations[btn.id].destroy();
                delete activeAnimations[btn.id];
                
                const bgPath = btn.querySelector("path");
                if (bgPath) bgPath.setAttribute("fill", "#74052A");
                
                const targetContainer = document.getElementById(`container-${btn.id}`);
                if (targetContainer) targetContainer.style.display = "none";

                // Handle labels hide specifically for deactivated flow
                if (btn.id === "venous-blood-flow") {
                    if (pulmonaryVein) pulmonaryVein.style.display = "none";
                } else if (btn.id === "arterial-blood-flow") {
                    if (pulmonaryArtery) pulmonaryArtery.style.display = "none";
                    if (dorsalAorta) dorsalAorta.style.display = "none";
                }

                if (Object.keys(activeAnimations).length === 0) {
                    if (resetBtn) {
                        resetBtn.setAttribute("opacity", "0.2");
                        resetBtn.style.pointerEvents = "none";
                        resetBtn.style.cursor = "default";
                    }
                    if (instructionText) {
                        instructionText.style.display = "block";
                    }
                }
            } else {
                // Activate
                const bgPath = btn.querySelector("path");
                if (bgPath) bgPath.setAttribute("fill", "#D15F08");

                // Handle labels display
                if (btn.id === "venous-blood-flow") {
                    if (pulmonaryVein) pulmonaryVein.style.display = "block";
                } else if (btn.id === "arterial-blood-flow") {
                    if (pulmonaryArtery) pulmonaryArtery.style.display = "block";
                    if (dorsalAorta) dorsalAorta.style.display = "block";
                }

                const targetContainer = document.getElementById(`container-${btn.id}`);
                if (targetContainer) {
                    targetContainer.style.display = "block";
                    const lottieContainer = targetContainer.querySelector(".lottie-anim");
                    if (lottieContainer) {
                        activeAnimations[btn.id] = lottie.loadAnimation({
                            container: lottieContainer,
                            renderer: 'svg',
                            loop: true,
                            autoplay: true,
                            path: `./lottie/${btn.id}.json`
                        });
                    }
                }

                if (resetBtn) {
                    resetBtn.setAttribute("opacity", "1");
                    resetBtn.style.pointerEvents = "auto";
                    resetBtn.style.cursor = "pointer";
                }
                if (instructionText) {
                    instructionText.style.display = "none";
                }
            }
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            Object.values(activeAnimations).forEach(anim => anim.destroy());
            activeAnimations = {};
            
            // Hide any displayed labels
            hideAllLabels();
            
            // Hide all Lottie containers
            hideAllContainers();
            
            // Reset all backgrounds
            actionBtns.forEach(b => {
                if (b.id !== "reset-btn") {
                    const bgPath = b.querySelector("path");
                    if (bgPath) bgPath.setAttribute("fill", "#74052A");
                }
            });

            // Disable reset button
            resetBtn.setAttribute("opacity", "0.2");
            resetBtn.style.pointerEvents = "none";
            resetBtn.style.cursor = "default";
            
            // Show instruction text
            if (instructionText) {
                instructionText.style.display = "block";
            }
        });
    }

    // Modal interactions
    if (buttonInsite && modalForeignObj) {
        buttonInsite.addEventListener("click", () => {
            modalForeignObj.style.display = "block";
            document.body.classList.add("modal-open");
        });
    }

    if (closeBtn && modalForeignObj) {
        closeBtn.addEventListener("click", () => {
            modalForeignObj.style.display = "none";
            document.body.classList.remove("modal-open");
        });
    }
});
