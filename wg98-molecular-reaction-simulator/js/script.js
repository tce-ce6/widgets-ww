// script.js

document.addEventListener("DOMContentLoaded", () => {
    // ─── Screen Elements ──────────────────────────────────────────────────────
    const homeScreen     = document.getElementById("Home screen");
    const activityScreen = document.getElementById("Activity screen");

    // ─── Activity Screen UI Elements ─────────────────────────────────────────
    const reactionTitle  = document.getElementById("Combination Reaction_4");
    const dropdownBtn    = document.getElementById("dropdown-button");
    const btnHome        = document.getElementById("btn-home");

    // Temperature buttons
    const btnVeryCold    = document.getElementById("btn-very-cold");
    const btnCold        = document.getElementById("btn-cold");
    const btnWarm        = document.getElementById("btn-warm");
    const btnHot         = document.getElementById("btn-hot");

    // Speed buttons
    const btn025x        = document.getElementById("btn-025x");
    const btn05x         = document.getElementById("btn-0.5x");
    const btn1x          = document.getElementById("btn-1x");
    const btn15x         = document.getElementById("btn-1.5x");

    // Start / Reset
    const btnStart       = document.getElementById("btn-start");
    const btnReset       = document.getElementById("btn-reset");

    // Live Data text spans (value nodes inside the SVG <text> elements)
    // These IDs are the <text> elements themselves – we read/write their first child <tspan>
    const liveParticleSpeed   = document.getElementById("Warm_4");          // tspan value
    const liveCollisions      = document.getElementById("0");               // tspan "0"
    const liveSuccessful      = document.getElementById("4_3");            // tspan "4"
    const liveSuccessRate     = document.getElementById("8.9%");            // tspan
    const liveProducts        = document.getElementById("4_4");            // tspan "4"

    // Temperature headline in the control panel (big label)
    const tempHeadlineEl      = document.querySelector("#\\32 H2 + O2 tspan"); // fallback
    const tempLabelEl         = document.querySelector("#Warm-2 tspan");        // "Warm" bold heading
    const particleSpeedLabelEl= document.querySelector("#Particle\\ Speed\\:\\-Warm tspan, [id='Particle Speed:Warm'] tspan");

    // ─── All molecule group IDs ───────────────────────────────────────────────
    const allMolecules = [
        "c4h12o4", "cuso4", "zn", "cu", "hci", "ch4",
        "naoh", "co2", "h2o", "o2", "agno3", "nano3", "h2"
    ];

    // ─── Reaction → molecule mapping ─────────────────────────────────────────
    const reactionMoleculesMap = {
        "Combination Reaction":          ["h2", "o2", "h2o"],
        "Decomposition Reaction":        ["h2o", "h2", "o2"],
        "Displacement Reaction":         ["zn", "cuso4", "cu"],
        "Double Displacement Reaction":  ["agno3", "nano3", "hci"],
        "Redox (Oxidation-Reduction)":   ["ch4", "o2", "co2", "h2o"]
    };

    // ─── Simulation state ────────────────────────────────────────────────────
    // Temperature modes and their speed multipliers
    const TEMPS = {
        "Very Cold": { label: "Very Cold", speedMult: 0.4,  color: "#2D81FF" },
        "Cold":      { label: "Cold",      speedMult: 0.7,  color: "#1D9CFF" },
        "Warm":      { label: "Warm",      speedMult: 1.3,  color: "#F3A521" },
        "Hot":       { label: "Hot",       speedMult: 2.0,  color: "#F35221" }
    };

    // Speed multipliers
    const SPEEDS = {
        "0.25x": 0.25,
        "0.5x":  0.5,
        "1x":    1.0,
        "1.5x":  1.5
    };

    let currentReaction    = "Combination Reaction";
    let currentTemp        = "Warm";
    let currentSpeed       = "1x";
    let isRunning          = false;
    let animationId        = null;

    // Simulation area in SVG coordinates (the main white/dark canvas area)
    // Approximate bounds based on SVG layout (x: 460–1420, y: 75–975)
    const SIM_X_MIN = 460;
    const SIM_X_MAX = 1420;
    const SIM_Y_MIN = 75;
    const SIM_Y_MAX = 975;
    const MOL_RADIUS = 36; // approximate radius in SVG units

    // Particle state: array of { id, el, x, y, vx, vy }
    let particles = [];

    // Stats
    let collisionCount  = 0;
    let successCount    = 0;
    let productCount    = 0;
    let lastSecTimestamp = 0;
    let collisionsThisSec = 0;

    // ─── Init ─────────────────────────────────────────────────────────────────
    function init() {
        homeScreen.style.display    = "block";
        activityScreen.style.display = "none";
        hideAllMolecules();
    }

    function hideAllMolecules() {
        allMolecules.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });
    }

    // ─── Utility: clear all spawned particles ─────────────────────────────────
    function clearAllParticles() {
        particles.forEach(p => {
            if (p.el && p.el.parentNode) p.el.parentNode.removeChild(p.el);
        });
        particles = [];
        // Catch-all for any lingering clones generated by the simulator
        document.querySelectorAll(".sim-clone").forEach(el => {
            if (el && el.parentNode) el.parentNode.removeChild(el);
        });
    }

    // ─── Load reaction (Home → Activity) ─────────────────────────────────────
    window.loadReaction = function (reactionName) {
        currentReaction = reactionName;
        homeScreen.style.display     = "none";
        activityScreen.style.display = "block";

        if (reactionTitle) {
            const tspan = reactionTitle.querySelector("tspan") || reactionTitle.firstElementChild;
            if (tspan) tspan.textContent = reactionName;
            else reactionTitle.textContent = reactionName;
        }

        stopSimulation();
        resetStats();
        clearAllParticles();
        setupParticles();
    };

    // Home screen card handlers
    window.loadCombinationReaction       = () => loadReaction("Combination Reaction");
    window.loadDecompositionReaction     = () => loadReaction("Decomposition Reaction");
    window.loadDisplacementReaction      = () => loadReaction("Displacement Reaction");
    window.loadDoubleDisplacementReaction= () => loadReaction("Double Displacement Reaction");
    window.loadRedoxReaction             = () => loadReaction("Redox (Oxidation-Reduction)");

    // ─── Utility: add an invisible click-target rect to a <g> SVG element ─────
    // This ensures the entire bounding box of the group fires click events.
    function addClickRect(groupEl, x, y, w, h) {
        if (!groupEl) return;
        groupEl.setAttribute("style", (groupEl.getAttribute("style") || "") + "; pointer-events: all;");
        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", w);
        rect.setAttribute("height", h);
        rect.setAttribute("fill", "transparent");
        rect.setAttribute("stroke", "none");
        rect.setAttribute("pointer-events", "fill");
        groupEl.insertBefore(rect, groupEl.firstChild);
    }

    // ─── btn-home ─────────────────────────────────────────────────────────────
    if (btnHome) {
        // SVG coords: x≈44.9, y≈1002.77, w≈65, h≈65
        addClickRect(btnHome, 44, 1002, 66, 66);
        btnHome.style.cursor = "pointer";
        btnHome.addEventListener("click", () => {
            stopSimulation();
            clearAllParticles();
            activityScreen.style.display = "none";
            homeScreen.style.display     = "block";
            hideAllMolecules();
        });
    }

    // ─── Reaction Transformations ──────────────────────────────────────────────
    // Map reaction type to { reactants: [...], products: [...] }
    const reactionRules = {
        "Combination Reaction": {
            reactants: ["h2", "o2"],
            products: ["h2o"]
        },
        "Decomposition Reaction": {
            reactants: ["h2o"],
            products: ["h2", "o2"]
        },
        "Displacement Reaction": {
            reactants: ["zn", "cuso4"],
            products: ["cu"] // Simplified ZnSO4 visualization (just becomes Cu)
        },
        "Double Displacement Reaction": {
            reactants: ["agno3", "hci"], // Visualizing as AgNO3 + HCl -> AgCl + HNO3 (using available icons)
            products: ["nano3"] // Using NaNO3 visually as product
        },
        "Redox (Oxidation-Reduction)": {
            reactants: ["ch4", "o2"],
            products: ["co2", "h2o"]
        }
    };

    // ─── Particle setup ──────────────────────────────────────────────────────
    function setupParticles() {
        hideAllMolecules();
        particles = [];

        // At start, only spawn Reactants for the chosen reaction
        const rule = reactionRules[currentReaction];
        if (!rule) return;

        // Spawn multiple copies of reactants to ensure collisions
        rule.reactants.forEach(id => {
            const copies = rule.reactants.length === 1 ? 6 : 4;
            spawnMolecule(id, copies);
        });
    }

    function spawnMolecule(id, count, x = null, y = null) {
        const template = document.getElementById(id);
        if (!template) return;

        for (let i = 0; i < count; i++) {
            const clone = template.cloneNode(true);
            const uid = Math.random().toString(36).substring(2, 9);
            clone.id = `${id}_clone_${uid}`;
            clone.classList.add("sim-clone"); // Tag for secure cleanup
            clone.style.display = "block";
            // Ensure clone DOES NOT block pointer events (it's just visual)
            clone.style.pointerEvents = "none";
            template.parentNode.appendChild(clone);

            const px = x !== null ? x : SIM_X_MIN + MOL_RADIUS + Math.random() * (SIM_X_MAX - SIM_X_MIN - MOL_RADIUS * 2);
            const py = y !== null ? y : SIM_Y_MIN + MOL_RADIUS + Math.random() * (SIM_Y_MAX - SIM_Y_MIN - MOL_RADIUS * 2);
            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 2;

            const p = {
                id: clone.id,
                baseId: id,
                el: clone,
                origY: getOrigY(id),
                x: px,
                y: py,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                isReacted: false
            };
            particles.push(p);
            setMoleculePosition(clone, px, py, id);
        }
        template.style.display = "none";
    }

    // Each molecule has a known original center-Y in the sidebar
    function getOrigY(id) {
        const yCenters = {
            "c4h12o4": 1007, "cuso4": 908, "zn": 817, "cu": 718,
            "hci": 627, "ch4": 528, "naoh": 381, "co2": 282,
            "h2o": 183, "o2": 147, "agno3": 755, "nano3": 457, "h2": 655
        };
        return yCenters[id] || 500;
    }

    function setMoleculePosition(el, x, y, baseId) {
        const origX = 403;
        const origY = getOrigY(baseId);
        const dx = x - origX;
        const dy = y - origY;
        el.setAttribute("transform", `translate(${dx}, ${dy})`);
    }

    // ─── Simulation loop ─────────────────────────────────────────────────────
    function startSimulation() {
        if (isRunning) return;
        isRunning = true;
        lastSecTimestamp = performance.now();
        collisionsThisSec = 0;
        animationId = requestAnimationFrame(tick);
    }

    function stopSimulation() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }

    function tick(timestamp) {
        if (!isRunning) return;

        const tempInfo   = TEMPS[currentTemp]   || TEMPS["Warm"];
        const speedMult  = SPEEDS[currentSpeed] || 1.0;
        const totalSpeed = tempInfo.speedMult * speedMult;

        if (timestamp - lastSecTimestamp >= 1000) {
            updateLiveText(liveCollisions, collisionsThisSec.toString());
            collisionsThisSec = 0;
            lastSecTimestamp = timestamp;
        }

        let toRemove = new Set();
        let toSpawn = [];

        // First, apply velocities
        particles.forEach(p => {
            if (p.isReacted) return;
            p.x += p.vx * totalSpeed;
            p.y += p.vy * totalSpeed;
        });

        // Resolve overlaps and window bounds
        for (let iter = 0; iter < 3; iter++) { // 3 iterations for stability
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                if (p.isReacted) continue;

                // Box bounds (force within bounds)
                if (p.x - MOL_RADIUS < SIM_X_MIN) { p.x = SIM_X_MIN + MOL_RADIUS; if (iter === 0) p.vx = Math.abs(p.vx); }
                if (p.x + MOL_RADIUS > SIM_X_MAX) { p.x = SIM_X_MAX - MOL_RADIUS; if (iter === 0) p.vx = -Math.abs(p.vx); }
                if (p.y - MOL_RADIUS < SIM_Y_MIN) { p.y = SIM_Y_MIN + MOL_RADIUS; if (iter === 0) p.vy = Math.abs(p.vy); }
                if (p.y + MOL_RADIUS > SIM_Y_MAX) { p.y = SIM_Y_MAX - MOL_RADIUS; if (iter === 0) p.vy = -Math.abs(p.vy); }

                for (let j = i + 1; j < particles.length; j++) {
                    let q = particles[j];
                    if (q.isReacted) continue;

                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const distSq = dx * dx + dy * dy;
                    const minDist = MOL_RADIUS * 2;
                    const minDistSq = minDist * minDist;

                    if (distSq < minDistSq && distSq > 0.00001) {
                        const dist = Math.sqrt(distSq);
                        
                        // Separate overlapping particles instantly
                        const overlap = (minDist - dist) / 2.0 + 0.5; // push apart slightly extra
                        const nx = dx / dist;
                        const ny = dy / dist;

                        p.x += nx * overlap;
                        p.y += ny * overlap;
                        q.x -= nx * overlap;
                        q.y -= ny * overlap;

                        // Calculate reflection (elastic collision)
                        // Only do this on the first iteration to avoid double-bouncing
                        if (iter === 0) {
                            const dvx = p.vx - q.vx;
                            const dvy = p.vy - q.vy;
                            const dot = dvx * nx + dvy * ny;

                            // If they're moving towards each other
                            if (dot < 0) {
                                // Add random jitter to avoid molecules getting stuck in perfectly parallel opposite motions
                                const jitterAngle = (Math.random() - 0.5) * 0.2;
                                const ca = Math.cos(jitterAngle);
                                const sa = Math.sin(jitterAngle);
                                
                                p.vx -= dot * nx;
                                p.vy -= dot * ny;
                                q.vx += dot * nx;
                                q.vy += dot * ny;

                                // apply slight random jitter
                                p.vx = p.vx * ca - p.vy * sa;
                                p.vy = p.vx * sa + p.vy * ca;
                                q.vx = q.vx * ca - q.vy * sa;
                                q.vy = q.vx * sa + q.vy * ca;
                                
                                collisionsThisSec++;
                                collisionCount++;

                                // Reaction logic
                                let reactionRule = reactionRules[currentReaction];
                                if (reactionRule && !p.isReacted && !q.isReacted) {
                                    const reactionChance = currentTemp === "Hot" ? 0.3 : (currentTemp === "Warm" ? 0.15 : (currentTemp === "Cold" ? 0.05 : 0.01));
                                    if (Math.random() < reactionChance) {
                                        let reacts = false;
                                        if (reactionRule.reactants.length === 2) {
                                            if ((p.baseId === reactionRule.reactants[0] && q.baseId === reactionRule.reactants[1]) ||
                                                (p.baseId === reactionRule.reactants[1] && q.baseId === reactionRule.reactants[0])) {
                                                reacts = true;
                                            }
                                        } else if (reactionRule.reactants.length === 1) {
                                            if (p.baseId === reactionRule.reactants[0] && q.baseId === reactionRule.reactants[0]) {
                                                reacts = true;
                                            }
                                        }

                                        if (reacts) {
                                            p.isReacted = true;
                                            q.isReacted = true;
                                            toRemove.add(p);
                                            toRemove.add(q);
                                            
                                            successCount++;
                                            
                                            const mx = (p.x + q.x) / 2;
                                            const my = (p.y + q.y) / 2;
                                            reactionRule.products.forEach((prodId, idx) => {
                                                // offset products slightly if multiple to prevent immediate overlapping
                                                const offset = idx === 0 ? 10 : -10;
                                                toSpawn.push({ id: prodId, x: mx + offset, y: my + offset });
                                                productCount++;
                                            });

                                            updateLiveText(liveSuccessful, successCount.toString());
                                            updateLiveText(liveProducts, productCount.toString());
                                            const rate = ((successCount / collisionCount) * 100).toFixed(1) + "%";
                                            updateLiveText(liveSuccessRate, rate);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        particles.forEach((p) => {
            if (!p.isReacted) setMoleculePosition(p.el, p.x, p.y, p.baseId);
        });

        // Process removals
        if (toRemove.size > 0) {
            toRemove.forEach(p => {
                if (p.el && p.el.parentNode) p.el.parentNode.removeChild(p.el);
            });
            particles = particles.filter(p => !p.isReacted);
        }

        // Process spawns
        toSpawn.forEach(s => spawnMolecule(s.id, 1, s.x, s.y));

        animationId = requestAnimationFrame(tick);
    }

    // ─── Reset simulation ─────────────────────────────────────────────────────
    function resetSimulation() {
        stopSimulation();
        resetStats();
        clearAllParticles();
        setupParticles();
    }

    function resetStats() {
        collisionCount    = 0;
        successCount      = 0;
        productCount      = 0;
        collisionsThisSec = 0;
        updateLiveText(liveCollisions,  "0");
        updateLiveText(liveSuccessful,  "0");
        updateLiveText(liveSuccessRate, "0%");
        updateLiveText(liveProducts,    "0");
    }

    // ─── Helper: safely set text of a <text> or <tspan> SVG element ──────────
    function updateLiveText(el, text) {
        if (!el) return;
        const tspan = el.querySelector ? el.querySelector("tspan") : null;
        if (tspan) tspan.textContent = text;
        else if (el.firstChild) el.firstChild.textContent = text;
        else el.textContent = text;
    }

    // ─── Temperature button handlers ─────────────────────────────────────────
    const tempBtnMap = [
        { el: btnVeryCold, key: "Very Cold" },
        { el: btnCold,     key: "Cold"      },
        { el: btnWarm,     key: "Warm"      },
        { el: btnHot,      key: "Hot"       }
    ];

    tempBtnMap.forEach(({ el, key }) => {
        if (!el) return;
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
            currentTemp = key;

            // Update big temperature label
            if (tempLabelEl) tempLabelEl.textContent = key;

            // Update "Particle Speed: Warm" label
            if (particleSpeedLabelEl) {
                particleSpeedLabelEl.textContent = `Particle Speed:${key}`;
            }

            // Update live data particle speed
            updateLiveText(liveParticleSpeed, key);

            highlightTempBtn(el);
        });
    });

    function highlightTempBtn(activeEl) {
        // Reset all fills to their defaults then highlight active
        const defaults = {
            "btn-very-cold": "#213CF3",
            "btn-cold":      "#1D9CFF",
            "btn-warm":      "#F3A521",
            "btn-hot":       "#F35221"
        };
        Object.entries(defaults).forEach(([id, fill]) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            const rect = btn.querySelector("path, rect");
            if (rect) rect.setAttribute("fill", fill);
        });
        // Highlight active (brighter border effect via opacity)
        if (activeEl) {
            const rect = activeEl.querySelector("path, rect");
            if (rect) {
                const orig = rect.getAttribute("fill");
                rect.setAttribute("fill", orig); // keep color, just add outline
            }
            // Add a glowing outline by temporarily modifying stroke
            const paths = activeEl.querySelectorAll("path, rect");
            paths.forEach(path => {
                path.setAttribute("stroke", "#ffffff");
                path.setAttribute("stroke-width", "4");
            });
            // Remove outline from others
            tempBtnMap.forEach(({ el }) => {
                if (el && el !== activeEl) {
                    el.querySelectorAll("path, rect").forEach(path => {
                        path.removeAttribute("stroke");
                        path.removeAttribute("stroke-width");
                    });
                }
            });
        }
    }

    // ─── Speed button handlers ────────────────────────────────────────────────
    const speedBtnMap = [
        { el: btn025x, key: "0.25x" },
        { el: btn05x,  key: "0.5x"  },
        { el: btn1x,   key: "1x"    },
        { el: btn15x,  key: "1.5x"  }
    ];

    speedBtnMap.forEach(({ el, key }) => {
        if (!el) return;
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
            currentSpeed = key;
            highlightSpeedBtn(el);
        });
    });

    function highlightSpeedBtn(activeEl) {
        speedBtnMap.forEach(({ el }) => {
            if (!el) return;
            el.querySelectorAll("path, rect").forEach(path => {
                path.setAttribute("fill", "#0F5EFD");
                path.removeAttribute("stroke");
                path.removeAttribute("stroke-width");
            });
        });
        if (activeEl) {
            activeEl.querySelectorAll("path, rect").forEach(path => {
                path.setAttribute("fill", "#0F5EFD");
                path.setAttribute("stroke", "#ffffff");
                path.setAttribute("stroke-width", "4");
            });
        }
    }

    // ─── Start / Reset button handlers ───────────────────────────────────────
    if (btnStart) {
        btnStart.style.cursor = "pointer";
        btnStart.addEventListener("click", () => {
            if (particles.length === 0) setupParticles();
            startSimulation();
        });
    }

    if (btnReset) {
        btnReset.style.cursor = "pointer";
        btnReset.addEventListener("click", () => {
            resetSimulation();
        });
    }

    // ─── Dropdown ─────────────────────────────────────────────────────────────
    const dropdownMenuSvg = document.getElementById("dropdown-menu-svg");
    const dropdownArrow = document.getElementById("dropdown-arrow-icon");

    if (dropdownBtn && dropdownMenuSvg) {
        dropdownBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isClosed = dropdownMenuSvg.style.display === "none";
            
            if (isClosed) {
                dropdownMenuSvg.style.display = "block";
                if (dropdownArrow) dropdownArrow.style.transform = "rotate(180deg)";
            } else {
                dropdownMenuSvg.style.display = "none";
                if (dropdownArrow) dropdownArrow.style.transform = "rotate(0deg)";
            }
        });

        const menuItems = [
            "menu-item-redox",
            "menu-item-double",
            "menu-item-displacement",
            "menu-item-decomposition",
            "menu-item-combination"
        ];

        menuItems.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const reactionName = el.getAttribute("data-reaction");
                    
                    dropdownMenuSvg.style.display = "none";
                    if (dropdownArrow) dropdownArrow.style.transform = "rotate(0deg)";
                    
                    if (reactionName) {
                        loadReaction(reactionName);
                    }
                });
                
                el.addEventListener("mouseenter", () => {
                   const bg = el.querySelector("path[fill]");
                   if (bg) bg.setAttribute("fill", "#FCDCB9"); // Highlight color
                });
                el.addEventListener("mouseleave", () => {
                   const bg = el.querySelector("path[fill]");
                   const isBlue = id === "menu-item-double" || id === "menu-item-decomposition";
                   if (bg) bg.setAttribute("fill", isBlue ? "#A9CCFF" : "white");
                });
            }
        });

        // Close dropdown on outside click
        document.addEventListener("click", () => {
            if (dropdownMenuSvg.style.display === "block") {
                dropdownMenuSvg.style.display = "none";
                if (dropdownArrow) dropdownArrow.style.transform = "rotate(0deg)";
            }
        });
    }

    // ─── Start ────────────────────────────────────────────────────────────────
    init();
});