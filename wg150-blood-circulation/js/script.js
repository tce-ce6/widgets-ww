document.addEventListener("DOMContentLoaded", () => {
    const actionBtns = document.querySelectorAll(".action-btn");
    const playAllBtn = document.getElementById("play-all");
    const buttonInsite = document.getElementById("Button_Insite");
    const modalForeignObj = document.querySelector(".insight-modal").closest("foreignObject");
    const closeBtn = document.getElementById("close-btn");

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

    const updateLabels = () => {
        // First hide all
        if (pulmonaryVein) pulmonaryVein.style.display = "none";
        if (venaCava) venaCava.style.display = "none";
        if (pulmonaryArtery) pulmonaryArtery.style.display = "none";
        if (dorsalAorta) dorsalAorta.style.display = "none";

        // Then show based on active animations
        Object.keys(activeAnimations).forEach(id => {
            if (id === "venous-blood-flow") {
                if (pulmonaryVein) pulmonaryVein.style.display = "block";
                if (venaCava) venaCava.style.display = "block";
            } else if (id === "arterial-blood-flow") {
                if (pulmonaryArtery) pulmonaryArtery.style.display = "block";
                if (dorsalAorta) dorsalAorta.style.display = "block";
            } else if (id === "o2-blood-flow") {
                if (pulmonaryVein) pulmonaryVein.style.display = "block";
                if (dorsalAorta) dorsalAorta.style.display = "block";
            } else if (id === "co2-blood-flow") {
                if (pulmonaryArtery) pulmonaryArtery.style.display = "block";
                if (venaCava) venaCava.style.display = "block";
            } else if (id.includes("pulmonary-circulation")) {
                if (pulmonaryArtery) pulmonaryArtery.style.display = "block";
                if (pulmonaryVein) pulmonaryVein.style.display = "block";
            } else if (id.includes("systemic-circulation")) {
                if (dorsalAorta) dorsalAorta.style.display = "block";
                if (venaCava) venaCava.style.display = "block";
            }
        });
    };



    // Insight button cursor
    if (buttonInsite) {
        buttonInsite.style.cursor = "pointer";
    }

    actionBtns.forEach(btn => {
        if (btn.id === "reset-btn") return;

        // Make action buttons look clickable
        btn.style.cursor = "pointer";

        btn.addEventListener("click", () => {
            const pBtn = document.querySelector('[id^="pulmonary-circulation"]');
            const sBtn = document.querySelector('[id^="systemic-circulation"]');
            const isPlayAllActive = pBtn && sBtn && !!activeAnimations[pBtn.id] && !!activeAnimations[sBtn.id];

            const isActive = !!activeAnimations[btn.id];

            // Unhighlight everything first
            actionBtns.forEach(b => {
                const bgPath = b.querySelector("path");
                if (bgPath) bgPath.setAttribute("fill", "#74052A");
            });
            if (playAllBtn) playAllBtn.style.backgroundColor = "#74052A";

            if (isActive && !isPlayAllActive) {
                // Deactivate
                activeAnimations[btn.id].destroy();
                delete activeAnimations[btn.id];

                const targetContainer = document.getElementById(`container-${btn.id}`);
                if (targetContainer) targetContainer.style.display = "none";

                // Handle labels hide specifically for deactivated flow
                updateLabels();
            } else {
                // Deactivate any currently active animations to ensure only one is active at a time
                Object.keys(activeAnimations).forEach(activeId => {
                    activeAnimations[activeId].destroy();
                    delete activeAnimations[activeId];

                    const activeContainer = document.getElementById(`container-${activeId}`);
                    if (activeContainer) activeContainer.style.display = "none";
                });

                // Activate
                const bgPath = btn.querySelector("path");
                if (bgPath) bgPath.setAttribute("fill", "#D15F08");

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

                // Handle labels display
                updateLabels();

            }
        });
    });


    // Play all interactions
    if (playAllBtn) {
        playAllBtn.style.cursor = "pointer";
        playAllBtn.addEventListener("click", () => {
            const pulmonaryBtn = document.querySelector('[id^="pulmonary-circulation"]');
            const systemicBtn = document.querySelector('[id^="systemic-circulation"]');

            if (pulmonaryBtn && systemicBtn) {
                const pId = pulmonaryBtn.id;
                const sId = systemicBtn.id;

                const isPulmonaryActive = !!activeAnimations[pId];
                const isSystemicActive = !!activeAnimations[sId];

                // Clean up any active state first (since reset code was removed)
                Object.keys(activeAnimations).forEach(activeId => {
                    activeAnimations[activeId].destroy();
                    delete activeAnimations[activeId];

                    const activeContainer = document.getElementById(`container-${activeId}`);
                    if (activeContainer) activeContainer.style.display = "none";
                });
                
                // Visual cleanup
                actionBtns.forEach(b => {
                    const bgPath = b.querySelector("path");
                    if (bgPath) bgPath.setAttribute("fill", "#74052A");
                });
                if (playAllBtn) playAllBtn.style.backgroundColor = "#74052A";

                updateLabels();

                // If it WAS active, we just wanted to turn it off, so we're done here.
                // Otherwise turn it on
                if (!(isPulmonaryActive && isSystemicActive)) {
                    [pId, sId].forEach(id => {
                        const targetContainer = document.getElementById(`container-${id}`);
                        if (targetContainer) {
                            targetContainer.style.display = "block";
                            const lottieContainer = targetContainer.querySelector(".lottie-anim");
                            if (lottieContainer) {
                                activeAnimations[id] = lottie.loadAnimation({
                                    container: lottieContainer,
                                    renderer: 'svg',
                                    loop: true,
                                    autoplay: true,
                                    path: `./lottie/${id}.json`
                                });
                            }
                        }
                    });

                    updateLabels();


                    playAllBtn.style.backgroundColor = "#D15F08";
                }
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
