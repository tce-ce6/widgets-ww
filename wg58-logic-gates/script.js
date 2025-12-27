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
    
    // FIX: Select the group that holds the gate image
    const displayGroup = document.getElementById("selected_gate_group");
    const gateImg = displayGroup ? displayGroup.querySelector("img") : null;
    
    const notWiring = document.getElementById("not_gate_connection_group");
    const otherWiring = document.getElementById("other_gate_connection_group");
    const indicatorWrapper = document.getElementById("input_indicator_group");

    // 3. Initialization
    function initDefault() {
        activeBtnId = null;
        
        // FIX: Ensure the Gate Display Group is VISIBLE
        if (displayGroup) displayGroup.style.display = "block";
        if (gateImg) gateImg.src = "assets/Gates/selecr_gate.svg";
        
        // Default Wiring Visibility
        if (otherWiring) otherWiring.style.display = "block";
        if (notWiring) notWiring.style.display = "none";
        
        // Ensure Indicator Wrapper is visible
        if (indicatorWrapper) indicatorWrapper.style.display = "block";
        
        // Reset Toggles
        document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);

        gateButtons.forEach(btn => { 
            if(btn) { 
                btn.style.opacity = "1"; 
                btn.style.cursor = "pointer"; 
            }
        });
        
        updateLogic();
    }

    // 4. Interaction: Gate Selection
    gateButtons.forEach(btn => {
        if (!btn) return;
        btn.addEventListener("click", () => {
            activeBtnId = btn.id;

            // Visual Selection
            gateButtons.forEach(b => b.style.opacity = "1");
            btn.style.opacity = "0.28";

            // FIX: Make sure the group is visible and swap the image
            if (displayGroup) displayGroup.style.display = "block";
            if (gateImg) gateImg.src = `assets/Gates/${gateData[activeBtnId].asset}`;

            // Handle Wiring Switching
            if (activeBtnId === "btn_not_gate") {
                if (notWiring) notWiring.style.display = "block";
                if (otherWiring) otherWiring.style.display = "none";
            } else {
                if (notWiring) notWiring.style.display = "none";
                if (otherWiring) otherWiring.style.display = "block";
            }

            updateLogic();
        });
    });

    // 5. Interaction: Toggles
    document.addEventListener("change", (e) => {
        if (e.target.type === "checkbox") {
            updateLogic();
        }
    });

    // 6. Logic Core
    function updateLogic() {
        const isNotActive = (activeBtnId === "btn_not_gate");
        const currentGroup = isNotActive ? notWiring : otherWiring;
        if (!currentGroup) return;

        // Get Toggle Values
        const toggles = currentGroup.querySelectorAll('input[type="checkbox"]');
        const valA = (toggles[0] && toggles[0].checked) ? 1 : 0;
        const valB = (toggles[1] && toggles[1].checked) ? 1 : 0;

        const suffix = isNotActive ? "_not" : "_other";
        
        // Update Input Indicators
        syncDisplay(currentGroup, `input_indicator_on_a${suffix}`, `input_indicator_off_a${suffix}`, valA);
        if (!isNotActive) {
            syncDisplay(currentGroup, `input_indicator_on_b${suffix}`, `input_indicator_off_b${suffix}`, valB);
        }

        // Calculate Result
        let result = 0;
        if (activeBtnId) {
            if (isNotActive) {
                result = gateData[activeBtnId].table[valA];
            } else {
                result = gateData[activeBtnId].table[`${valA}${valB}`];
            }
        }

        // Update Output
        syncDisplay(currentGroup, `out_put_on${suffix}`, `out_put_off${suffix}`, result);
    }

    // Helper to toggle between On/Off elements
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