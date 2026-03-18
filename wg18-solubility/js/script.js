document.addEventListener("DOMContentLoaded", () => {
    const svg = document.querySelector("#svg-container svg");

    const sugarValues = [0, 25, 50, 100, 250, 500, 750];
    const waterValues = [0, 100, 250, 500, 750, 1000];
    const tempRange = { min: 0, max: 100 };

    // Track state of sliders
    const currentValues = {
        sugar: 0,
        water: 0,
        temp: 0
    };

    let anim = null; // Store current lottie instance

    /**
     * Initializes a slider with drag functionality and value updates.
     */
    function initSlider(handlerId, fillId, valueId, values, isRange = false) {
        const handler = document.getElementById(handlerId);
        const fill = document.getElementById(fillId);
        const valueTxt = document.getElementById(valueId);
        const sliderGroup = handler.parentElement;

        const minX = 10.5;
        const maxX = 537;
        const width = maxX - minX;
        const baseOffset = 287.4;

        const fillStartPoints = {
            "Path_453": 9.756,
            "Path_453-2": 9.02,
            "Path_453-3": 6.917
        };
        const startX = fillStartPoints[fillId] || 10;

        let isDragging = false;

        function update(clientX) {
            const pt = svg.createSVGPoint();
            pt.x = clientX;
            pt.y = 0;
            const svgP = pt.matrixTransform(sliderGroup.getScreenCTM().inverse());
            
            let x = svgP.x;
            x = Math.max(minX, Math.min(maxX, x));
            
            let percent = (x - minX) / width;
            let displayValue;
            let snapX;

            if (isRange) {
                displayValue = Math.round(values.min + percent * (values.max - values.min));
                percent = (displayValue - values.min) / (values.max - values.min);
                snapX = minX + percent * width;
            } else {
                const stepIndex = Math.round(percent * (values.length - 1));
                displayValue = values[stepIndex];
                percent = stepIndex / (values.length - 1);
                snapX = minX + percent * width;
            }

            handler.setAttribute("transform", `translate(${snapX - baseOffset}, 0)`);
            updateFillPath(fill, fillId, snapX, startX);
            updateValueText(handlerId, valueId, displayValue);
        }

        function updateFillPath(el, id, currentX, start) {
            if (id === "Path_453") {
                el.setAttribute("d", `M${currentX},5.842H${start}c-1.66,0-3.007,2.2-3.007,4.924S8.1,15.691,${start},15.691H${currentX}Z`);
            } else if (id === "Path_453-2") {
                el.setAttribute("d", `M${currentX},5.842H${start}c-1.254,0-2.271,2.2-2.271,4.924s1.017,4.924,2.271,4.924H${currentX}Z`);
            } else if (id === "Path_453-3") {
                el.setAttribute("d", `M${currentX},5.842H${start}a36.315,36.315,0,0,0-.168,4.924,36.351,36.351,0,0,0,.168,4.924H${currentX}Z`);
            }
        }

        function updateValueText(hId, vId, val) {
            if (hId === "sugar-handler") currentValues.sugar = val;
            else if (hId === "water-handler") currentValues.water = val;
            else if (hId === "temp-handler") currentValues.temp = val;

            if (vId === 'temp-value') {
                valueTxt.innerHTML = `<tspan x="0" y="0">${val} </tspan><tspan y="0" font-size="14.582" baseline-shift="8.332499716634633">o</tspan><tspan y="0">C</tspan>`;
            } else {
                valueTxt.innerHTML = `<tspan x="0" y="0">${val} g</tspan>`;
            }

            renderSaturation();
        }

        function setValue(val) {
            let percent;
            if (isRange) {
                percent = (val - values.min) / (values.max - values.min);
            } else {
                const idx = values.indexOf(val);
                percent = idx !== -1 ? idx / (values.length - 1) : 0;
            }
            
            const snapX = minX + percent * width;
            handler.setAttribute("transform", `translate(${snapX - baseOffset}, 0)`);
            updateFillPath(fill, fillId, snapX, startX);
            updateValueText(handlerId, valueId, val);
        }

        handler.style.cursor = "pointer";
        handler.addEventListener("mousedown", (e) => {
            isDragging = true;
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseup", onMouseUp);
        });

        handler.addEventListener("touchstart", (e) => {
            isDragging = true;
            document.addEventListener("touchmove", onTouchMove);
            document.addEventListener("touchend", onTouchEnd);
        }, { passive: true });

        const onMouseMove = (e) => { if (isDragging) update(e.clientX); };
        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
        const onTouchMove = (e) => { if (isDragging) update(e.touches[0].clientX); };
        const onTouchEnd = () => {
            isDragging = false;
            document.removeEventListener("touchmove", onTouchMove);
            document.removeEventListener("touchend", onTouchEnd);
        };

        if (handlerId === "sugar-handler") setValue(0);
        else if (handlerId === "water-handler") setValue(0);
        else if (handlerId === "temp-handler") setValue(0);

        // Expose reset so we can call it from outside
        sliderResetFns[handlerId] = () => setValue(0);
    }

    // Map to store slider reset functions exposed by initSlider
    const sliderResetFns = {};

    // Initialize all three sliders
    initSlider("sugar-handler", "Path_453", "sugar-value", sugarValues);
    initSlider("water-handler", "Path_453-2", "water-value", waterValues);
    initSlider("temp-handler", "Path_453-3", "temp-value", tempRange, true);

    // ── Reset Button ──────────────────────────────────────────────────────
    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
        resetBtn.addEventListener("click", () => {
            // 🔁 Reset all slider values to 0
            sliderResetFns["sugar-handler"]?.();
            sliderResetFns["water-handler"]?.();
            sliderResetFns["temp-handler"]?.();

            // 🔁 Reset internal state
            currentValues.sugar = 0;
            currentValues.water = 0;
            currentValues.temp  = 0;

            // 🛑 Destroy Lottie animation if running
            if (anim) {
                anim.destroy();
                anim = null;
            }
            const lottieContainer = document.getElementById("lottie-animation");
            if (lottieContainer) lottieContainer.innerHTML = "";

            // 🔒 Disable play and reset buttons again
            const playBtn = document.getElementById("play-btn-link");
            if (playBtn) {
                playBtn.classList.add("disabled");
            }
            resetBtn.classList.add("disabled");

            // 🔄 Update saturation UI
            renderSaturation();
        });
    }

    // ── Saturation Logic ───────────────────────────────────────────────────
    function maxSoluble() {
        // Sugar solubility: ~180 + 0.9*T g per 100g water
        if (currentValues.water === 0) return 0;
        return (180 + 0.9 * currentValues.temp) * (currentValues.water / 100);
    }

    function undissolved() {
        return Math.max(0, currentValues.sugar - maxSoluble());
    }

    function saturationFraction() {
        const max = maxSoluble();
        if (max === 0) return currentValues.sugar > 0 ? 1 : 0;
        return Math.min(1, currentValues.sugar / max);
    }

    function renderSaturation() {
        const sf = saturationFraction();
        const und = undissolved();
        const pct = Math.round(sf * 100);

        // Update saturation bar
        const satBar = document.getElementById("sat-bar");
        const satPct = document.getElementById("sat-pct");
        if (satBar) {
            satBar.style.width = Math.min(pct, 100) + "%";
            if (sf >= 1) {
                satBar.classList.add("over");
            } else {
                satBar.classList.remove("over");
            }
        }
        if (satPct) satPct.textContent = pct + "%";

        // Update state info
        const stateInfo = document.getElementById("state-info");
        if (stateInfo) {
            let info = "";
            if (currentValues.water === 0 || currentValues.sugar === 0) {
                info = "Adjust the sliders to begin. Add solute and water to observe dissolution!";
            } else if (sf < 0.25) {
                info = "<strong>Unsaturated:</strong> Plenty of room for more solute. The solution can dissolve more!";
            } else if (sf < 0.75) {
                info = "<strong>Partially Saturated:</strong> Getting fuller. Particles are moving through the solvent.";
            } else if (sf < 1.0) {
                info = "<strong>Nearly Saturated:</strong> Almost at the limit! Try raising temperature to dissolve more.";
            } else {
                info = `<strong style="color:#ff003c">⚠️ Supersaturated / Precipitate Visible!</strong> ${und.toFixed(0)}g of solute cannot dissolve and settles at the bottom.`;
            }
            stateInfo.innerHTML = info;
        }

        // Update dynamic info
        const dynInfo = document.getElementById("dynamic-info");
        if (dynInfo) {
            let tip = "";
            if (currentValues.water === 0 && currentValues.sugar === 0) {
                tip = "💡 <strong>Tip:</strong> Drag the sliders to start experimenting!";
            } else if (currentValues.temp < 20 && sf > 0.8) {
                tip = "🌡️ <strong>Try this:</strong> Raise the temperature — it increases solubility!";
            } else if (sf >= 1) {
                tip = "🔬 <strong>Observe:</strong> White sediment = undissolved solute. This is a <strong>precipitate</strong>.";
            } else if (currentValues.temp > 60) {
                tip = "🫧 <strong>Observe:</strong> High temperature — water evaporation increases, affecting the solution!";
            } else if (und === 0 && currentValues.sugar > 50) {
                tip = "✅ <strong>Perfect:</strong> All solute is dissolved. Solution is clear (homogeneous mixture).";
            } else {
                tip = "📊 <strong>Formula:</strong> Max solubility = (180 + 0.9 × T) × (water ÷ 100) grams";
            }
            dynInfo.innerHTML = tip;
        }

        // 🔓 Enable play button only when all sliders are set
        const playBtn = document.getElementById("play-btn-link");
        if (playBtn) {
            if (currentValues.sugar > 0 && currentValues.water > 0 && currentValues.temp > 0) {
                playBtn.classList.remove("disabled");
            } else {
                playBtn.classList.add("disabled");
            }
        }
    }

    // Initial render
    renderSaturation();

    // Lottie logic
    const playBtn = document.getElementById("play-btn-link");
    if (playBtn) {
        playBtn.onclick = () => {
            const path = getAnimationPath(currentValues.water, currentValues.sugar, currentValues.temp);
            if (path) {
                // 🔒 Disable play button once clicked
                playBtn.classList.add("disabled");
                playLottie(path);
            } else {
                console.log("No animation for this combination:", currentValues);
            }
        };
    }

    function getAnimationPath(water, sugar, temp) {
        // No animation if water or sugar is 0
        if (water === 0 || sugar === 0) return null;

        // The folders use uppercase "ML"
        const folder = `${water}ML`;
        let range = "30_To_100";
        let link = "To";

        // Logic to handle irregular ranges in specific folders
        if (water === 100) {
            if (sugar === 250) range = temp <= 60 ? "30_To_60" : "70_To_100";
            else if (sugar === 500) range = temp <= 80 ? "30_To_80" : "90_To_100";
        } else if (water === 250) {
            if (sugar === 750) range = temp <= 70 ? "30_To_70" : "80_To_100";
        }

        // 50G files use "T0" instead of "To"
        if (sugar === 50) {
            link = "T0";
            range = `30_${link}_100`;
        }

        return `./lottie/${folder}/${water}Ml_${sugar}G_Tem_${range}.json`;
    }

    function playLottie(path) {
        const container = document.getElementById('lottie-animation');
        if (!container) return;

        if (anim) {
            anim.destroy();
        }

        anim = lottie.loadAnimation({
            container: container,
            renderer: 'svg',
            loop: false,
            autoplay: true,
            path: path
        });

        // 🔓 Enable reset button once animation finishes
        anim.addEventListener('complete', () => {
            const resetBtn = document.getElementById('reset-btn');
            if (resetBtn) {
                resetBtn.classList.remove('disabled');
            }
        });

        console.log("Playing animation:", path);
    }
});
