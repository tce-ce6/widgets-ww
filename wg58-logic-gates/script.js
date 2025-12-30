document.addEventListener("DOMContentLoaded", () => {
    // 1. JSON Data
    const gateData = {
        "btn_and_gate":  { asset: "AND_Gate.svg",  table: { "00": 0, "01": 0, "10": 0, "11": 1 } },
        "btn_or_gate":   { asset: "OR_Gate.svg",   table: { "00": 0, "01": 1, "10": 1, "11": 1 } },
        "btn_not_gate":  { asset: "NOT_Gate.svg",  table: { "0": 1, "1": 0 } },
        "btn_nand_gate": { asset: "NAND_Gate.svg", table: { "00": 1, "01": 1, "10": 1, "11": 0 } },
        "btn_nor_gate":  { asset: "NOR_Gate.svg",  table: { "00": 1, "01": 0, "10": 0, "11": 0 } },
        "btn_xor_gate":  { asset: "XOR_Gate.svg",  table: { "00": 0, "01": 1, "10": 1, "11": 0 } },
        "btn_xnor_gate": { asset: "XNOR_Gate.svg", table: { "00": 1, "01": 0, "10": 0, "11": 1 } }
    };

    let activeBtnId = null;

    // 2. Element Selectors
    const gateButtons = Object.keys(gateData).map(id => document.getElementById(id));
    const resetBtn = document.getElementById("btn-reset") || document.getElementById("btn_reset");
    
    const tableOther = document.getElementById("truth_table_other");
    const tableNot = document.getElementById("truth_table_not");

    const displayGroup = document.getElementById("selected_gate_group");
    const gateImg = displayGroup ? displayGroup.querySelector("img") : null;
    
    const notWiring = document.getElementById("not_gate_connection_group");
    const otherWiring = document.getElementById("other_gate_connection_group");
    const indicatorWrapper = document.getElementById("input_indicator_group");

    // 3. Initialization
    function initDefault() {
        resetBtn.style.opacity = "0.28";
        activeBtnId = null;
        
        if (displayGroup) displayGroup.style.display = "block";
        if (gateImg) gateImg.src = "assets/Gates/Select_Gate.png";
        
        if (otherWiring) otherWiring.style.display = "block";
        if (notWiring) notWiring.style.display = "none";
        
        if (tableOther) tableOther.style.display = "none";
        if (tableNot) tableNot.style.display = "none";

        if (indicatorWrapper) indicatorWrapper.style.display = "block";
        
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

        gateButtons.forEach(btn => { 
            if(btn) { 
                btn.style.opacity = "1"; 
                btn.style.cursor = "pointer"; 
            }
        });

        updateLogic();
    }

    // 4. Update Truth Table Numbers
    function updateTruthTableUI(gateId) {
        const isNotGate = (gateId === "btn_not_gate");
        
        if (tableNot) tableNot.style.display = isNotGate ? "block" : "none";
        if (tableOther) tableOther.style.display = isNotGate ? "none" : "block";

        const data = gateData[gateId];
        if (!data) return;

        if (isNotGate) {
            const el0 = document.getElementById("_13");
            const el1 = document.getElementById("_0-21");
            
            if (el0) {
                const span = el0.querySelector("tspan");
                if (span) span.textContent = data.table["0"];
            }
            if (el1) {
                const span = el1.querySelector("tspan");
                if (span) span.textContent = data.table["1"];
            }
        } else {
            const tableMapping = [
                { a: "0", b: "0", idA: "INPUT_A_R1C1", idB: "INPUT_B_R1C2", idOut: "OUTPUT_R1C3" },
                { a: "0", b: "1", idA: "INPUT_A_R2C1", idB: "INPUT_B_R2C2", idOut: "OUTPUT_R2C3" },
                { a: "1", b: "0", idA: "INPUT_A_R3C1", idB: "INPUT_B_R3C2", idOut: "OUTPUT_R3C3" },
                { a: "1", b: "1", idA: "INPUT_A_R4C1", idB: "INPUT_B_R4C2", idOut: "OUTPUT_R4C3" }
            ];

            tableMapping.forEach(row => {
                const elA = document.getElementById(row.idA);
                const elB = document.getElementById(row.idB);
                const elOut = document.getElementById(row.idOut);

                if (elA) elA.querySelector("tspan").textContent = row.a;
                if (elB) elB.querySelector("tspan").textContent = row.b;
                if (elOut) elOut.querySelector("tspan").textContent = data.table[`${row.a}${row.b}`];
            });
        }
    }

    // 5. Interaction: Gate Selection
    gateButtons.forEach(btn => {
        if (!btn) return;
        btn.addEventListener("click", () => {
            // Get current value of Input A from whichever group is currently visible before switching
            const currentIs_Not = (activeBtnId === "btn_not_gate");
            const currentSourceGroup = currentIs_Not ? notWiring : otherWiring;
            const sourceToggles = currentSourceGroup.querySelectorAll('input[type="checkbox"]');
            const currentValA = (sourceToggles[0] && sourceToggles[0].checked);

            activeBtnId = btn.id;
            resetBtn.style.opacity = "1";
            gateButtons.forEach(b => b.style.opacity = "1");
            btn.style.opacity = "0.28";

            if (displayGroup) displayGroup.style.display = "block";
            if (gateImg) gateImg.src = `assets/Gates/${gateData[activeBtnId].asset}`;

            if (activeBtnId === "btn_not_gate") {
                if (notWiring) {
                    notWiring.style.display = "block";
                    // Sync Input A to the NOT gate checkbox
                    const notToggle = notWiring.querySelector('input[type="checkbox"]');
                    if (notToggle) notToggle.checked = currentValA;
                }
                if (otherWiring) otherWiring.style.display = "none";
            } else {
                if (notWiring) notWiring.style.display = "none";
                if (otherWiring) {
                    otherWiring.style.display = "block";
                    // Sync Input A back from the NOT gate checkbox
                    const otherToggles = otherWiring.querySelectorAll('input[type="checkbox"]');
                    if (otherToggles[0]) otherToggles[0].checked = currentValA;
                }
            }

            updateTruthTableUI(activeBtnId);
            updateLogic();
        });
    });

    // 6. Reset Button
    if (resetBtn) {
        resetBtn.style.cursor = "pointer";
        resetBtn.addEventListener("click", initDefault);
    }

    // 7. Interaction: Toggles
    document.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
            updateLogic();
        }
    });

    // 8. Logic Core
    function updateLogic() {
        const isNotActive = (activeBtnId === "btn_not_gate");
        const currentGroup = isNotActive ? notWiring : otherWiring;
        if (!currentGroup) return;

        const toggles = currentGroup.querySelectorAll('input[type="checkbox"]');
        
        // Input A mapping
        const valA = (toggles[0] && toggles[0].checked) ? 1 : 0;
        
        // Input B mapping (only relevant for non-NOT gates)
        const valB = (toggles[1] && toggles[1].checked) ? 1 : 0;

        const suffix = isNotActive ? "_not" : "_other";
        
        // Update Indicator A for NOT or OTHER
        syncDisplay(currentGroup, `input_indicator_on_a${suffix}`, `input_indicator_off_a${suffix}`, valA);
        
        // Update Indicator B only if it's NOT a NOT gate
        if (!isNotActive) {
            syncDisplay(currentGroup, `input_indicator_on_b${suffix}`, `input_indicator_off_b${suffix}`, valB);
        }

        let result = 0;
        if (activeBtnId) {
            if (isNotActive) {
                // NOT gate only cares about valA
                result = gateData[activeBtnId].table[valA];
            } else {
                // Other gates care about valA and valB
                result = gateData[activeBtnId].table[`${valA}${valB}`];
            }
        }

        syncDisplay(currentGroup, `out_put_on${suffix}`, `out_put_off${suffix}`, result);
    }

    function syncDisplay(group, onId, offId, value) {
        const onEl = group.querySelector(`#${onId}`);
        const offEl = group.querySelector(`#${offId}`);

        if (value === 1) {
            if (onEl) onEl.style.display = "block";
            if (offEl) offEl.style.display = "none";
        } else {
            if (onEl) onEl.style.display = "none";
            if (offEl) offEl.style.display = "block";
        }
    }

    initDefault();
});