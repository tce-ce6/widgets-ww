document.addEventListener("DOMContentLoaded", () => {

  const molecules = document.querySelectorAll(".molecule-item");
  const reactantsDropPanel = document.getElementById("Rectangle_233");
  const productsDropPanel = document.getElementById("Rectangle_232");

  const Group_109 = document.getElementById("Group_109");
  const Group_109_2 = document.getElementById("Group_109-2");

  const reactantsMassDisplay = document.querySelector("#_0g text tspan");
  const productsMassDisplay = document.querySelector("#_0g-2 text tspan");
  const combinedMassDisplay = document.querySelector("#_0g_0g text tspan");

  let reactantsList = [];
  let productsList = [];

  const reactions = [
    {
      id: "h2_o2",
      equation: [
        { type: "mol", text: "2H", sub: "2" },
        { type: "sym", text: "+" },
        { type: "mol", text: "O", sub: "2" },
        { type: "sym", text: "→" },
        { type: "mol", text: "2H", sub: "2", post: "O" },
      ],
      description: "Hydrogen reacts with Oxygen to form Water",
      reactants: ["H2", "O2"],
      products: ["H2O"],
      requiredReactants: { H2: 2, O2: 1 },
      requiredProducts: { H2O: 2 },
      hint: "Hint: Two molecules of H₂ (4g) + One molecule of O₂ (32g) = Two molecules of H₂O (36g)",
    },
    {
      id: "n2_h2",
      equation: [
        { type: "mol", text: "N", sub: "2" },
        { type: "sym", text: "+" },
        { type: "mol", text: "3H", sub: "2" },
        { type: "sym", text: "→" },
        { type: "mol", text: "2NH", sub: "3" },
      ],
      description: "Nitrogen reacts with Hydrogen to form Ammonia",
      reactants: ["N2", "H2"],
      products: ["NH3"],
      requiredReactants: { N2: 1, H2: 3 },
      requiredProducts: { NH3: 2 },
      hint: "Hint: One molecule of N₂ (28g) + Three molecules of H₂ (6g) = Two molecules of NH₃ (34g)",
    },
    {
      id: "ch4_o2",
      equation: [
        { type: "mol", text: "CH", sub: "4" },
        { type: "sym", text: "+" },
        { type: "mol", text: "2O", sub: "2" },
        { type: "sym", text: "→" },
        { type: "mol", text: "CO", sub: "2" },
        { type: "sym", text: "+" },
        { type: "mol", text: "2H", sub: "2", post: "O" },
      ],
      description:
        "Methane reacts with Oxygen to form Carbon Dioxide and Water",
      reactants: ["CH4", "O2"],
      products: ["CO2", "H2O"],
      requiredReactants: { CH4: 1, O2: 2 },
      requiredProducts: { CO2: 1, H2O: 2 },
      hint: "Hint: One molecule of CH₄ (16g) + Two molecules of O₂ (64g) = One molecule of CO₂ (44g) + Two molecules of H₂O (36g)",
    },
  ];

  const molNames = {
    H2: "Hydrogen gas (H₂)",
    O2: "Oxygen gas (O₂)",
    H2O: "Water (H₂O)",
    N2: "Nitrogen gas (N₂)",
    NH3: "Ammonia (NH₃)",
    CH4: "Methane (CH₄)",
    CO2: "Carbon Dioxide (CO₂)",
  };

  let currentReactionIndex = 0;
  let feedbackTimeout;

  function showFeedback(formula, side) {
    const reaction = reactions[currentReactionIndex];
    const isCorrect =
      side === "reactant"
        ? reaction.reactants.includes(formula)
        : reaction.products.includes(formula);

    const correctPanel = document.getElementById("correct_feedback_panel");
    const incorrectPanel = document.getElementById("incorrect_feedback_panel");
    const correctDesc = document.getElementById("correct_feedback_desc");

    if (!correctPanel || !incorrectPanel || !correctDesc) return;

    clearTimeout(feedbackTimeout);

    // Reset both
    correctPanel.style.display = "none";
    incorrectPanel.style.display = "none";

    if (isCorrect) {
      const name = molNames[formula] || formula;
      correctDesc.textContent = `${name} is a ${side} in this reaction.`;
      correctPanel.style.display = "block";
    } else {
      incorrectPanel.style.display = "block";
    }

    feedbackTimeout = setTimeout(() => {
      correctPanel.style.display = "none";
      incorrectPanel.style.display = "none";
    }, 3000);
  }

  function renderFormula() {
    const reaction = reactions[currentReactionIndex];
    const group = document.getElementById("Group_101");
    const descTspan = document.querySelector(
      "#Hydrogen_reacts_with_Oxygen_to_form_Water text",
    );

    if (!group || !descTspan) return;

    // Clear existing
    group.innerHTML = "";
    descTspan.innerHTML = "";

    const textEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text",
    );
    textEl.setAttribute("x", "1411");
    textEl.setAttribute("y", "235");
    textEl.setAttribute("text-anchor", "middle");
    textEl.setAttribute("font-family", "SegoeUI-Bold, 'Segoe UI'");
    textEl.setAttribute("font-size", "55");
    textEl.setAttribute("font-weight", "700");

    reaction.equation.forEach((item, index) => {
      if (item.type === "mol") {
        const spanMain = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "tspan",
        );
        spanMain.textContent = item.text;
        textEl.appendChild(spanMain);

        const spanSub = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "tspan",
        );
        spanSub.setAttribute("baseline-shift", "sub");
        spanSub.setAttribute("font-size", "32");
        spanSub.textContent = item.sub;
        textEl.appendChild(spanSub);

        if (item.post) {
          const spanPost = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "tspan",
          );
          spanPost.textContent = item.post;
          textEl.appendChild(spanPost);
        }
      } else {
        const spanSym = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "tspan",
        );
        // Add spaces around symbols for better legibility
        spanSym.textContent = `  ${item.text}  `;
        textEl.appendChild(spanSym);
      }
    });

    group.appendChild(textEl);

    // Set dynamic font size based on description length
    const fontSize = reaction.description.length > 50 ? "24" : "30";
    descTspan.setAttribute("font-size", fontSize);
    descTspan.textContent = reaction.description;
  }

  // Initial render
  setTimeout(renderFormula, 100);

  function getMolData(mol) {
    return {
      id: mol.id,
      mass: parseInt(mol.getAttribute("data-mass")),
      formula: mol.getAttribute("data-formula"),
    };
  }

  molecules.forEach((mol) => {
    mol.style.cursor = "grab";
    mol.addEventListener("dragstart", (e) => {
      const data = getMolData(mol);
      e.dataTransfer.setData("text/plain", JSON.stringify(data));
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.dropEffect = "copy";
    });
  });

  [
    {
      panel: reactantsDropPanel,
      list: reactantsList,
      display: reactantsMassDisplay,
      type: "reactant",
      offset: { x: 1040, y: 560 },
    },
    {
      panel: Group_109,
      list: reactantsList,
      display: reactantsMassDisplay,
      type: "reactant",
      offset: { x: 1040, y: 560 },
    },
    {
      panel: productsDropPanel,
      list: productsList,
      display: productsMassDisplay,
      type: "product",
      offset: { x: 1550, y: 560 },
    },
    {
      panel: Group_109_2,
      list: productsList,
      display: productsMassDisplay,
      type: "product",
      offset: { x: 1550, y: 560 },
    },
  ].forEach(({ panel, list, display, type, offset }) => {
    if (!panel) return;

    panel.addEventListener("dragenter", (e) => {
      e.preventDefault();
      panel.style.opacity = "0.7";
    });

    panel.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    });

    panel.addEventListener("dragleave", (e) => {
      panel.style.opacity = "1";
    });

    panel.addEventListener("drop", (e) => {
      e.preventDefault();
      panel.style.opacity = "1";
      try {
        const dataRaw = e.dataTransfer.getData("text/plain");
        if (!dataRaw) return;
        const data = JSON.parse(dataRaw);
        if (!data || isNaN(data.mass)) return;

        const instanceId = `${data.formula}_${Date.now()}`;
        const newItem = { ...data, instanceId };
        list.push(newItem);

        const originalMol = document.getElementById(data.id);
        if (originalMol) {
          const clone = originalMol.cloneNode(true);
          clone.setAttribute("id", instanceId);
          clone.style.cursor = "pointer";
          clone.setAttribute("draggable", "false");

          // Get the center of the original molecule in SVG coordinates
          const bbox = originalMol.getBBox();
          const centerX = bbox.x + bbox.width / 2;
          const centerY = bbox.y + bbox.height / 2;

          // Calculate target position (center of the inner dash-lined box)
          // Reactant target center: ~1148, 541
          // Product target center: ~1661, 541
          const targetX = type === "reactant" ? 1148.7 : 1661.7;
          const targetY = 564.5;

          // Stacking offset (slight jitter so they don't overlap perfectly)
          const count = list.length - 1;
          const offsetX = count * 5;
          const offsetY = count * -5;

          const wrapper = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "g",
          );
          // transform order:
          // 1. Move to target center + stack offset
          // 2. Scale
          // 3. Move molecule center to (0,0) by subtracting its original coordinates
          const scale = 1.0;
          wrapper.setAttribute(
            "transform",
            `translate(${targetX + offsetX}, ${targetY + offsetY}) scale(${scale}) translate(${-centerX}, ${-centerY})`,
          );

          wrapper.appendChild(clone);
          wrapper.style.pointerEvents = "all";
          wrapper.classList.add("dropped-molecule");

          wrapper.addEventListener("click", () => {
            const index = list.findIndex(
              (item) => item.instanceId === instanceId,
            );
            if (index > -1) {
              list.splice(index, 1);
              wrapper.remove();
              updateMasses();
            }
          });

          panel.parentNode.appendChild(wrapper);
          // Show feedback if correct
          showFeedback(data.formula, type);
        }
        updateMasses();
      } catch (err) { }
    });
  });

  function updateMasses() {
    const rMass = reactantsList.reduce((sum, item) => sum + item.mass, 0);
    const pMass = productsList.reduce((sum, item) => sum + item.mass, 0);

    if (reactantsMassDisplay) reactantsMassDisplay.textContent = `${rMass}g`;
    if (productsMassDisplay) productsMassDisplay.textContent = `${pMass}g`;
    if (combinedMassDisplay)
      combinedMassDisplay.textContent = `${rMass}g  #  ${pMass}g`;
  }

  function checkAnswer() {
    const reaction = reactions[currentReactionIndex];
    const checkPanel = document.getElementById("feedback_on_check_answer");
    const checkTitle = document.getElementById("feedback_check_title");
    const checkMassStatus = document.getElementById(
      "feedback_check_mass_status",
    );
    const checkDetails = document.getElementById("feedback_check_details");
    const checkHint = document.getElementById("feedback_check_hint");

    if (
      !checkPanel ||
      !checkTitle ||
      !checkMassStatus ||
      !checkDetails ||
      !checkHint
    )
      return;

    const rMass = reactantsList.reduce((sum, item) => sum + item.mass, 0);
    const pMass = productsList.reduce((sum, item) => sum + item.mass, 0);

    const rCounts = {};
    reactantsList.forEach(
      (m) => (rCounts[m.formula] = (rCounts[m.formula] || 0) + 1),
    );
    const pCounts = {};
    productsList.forEach(
      (m) => (pCounts[m.formula] = (pCounts[m.formula] || 0) + 1),
    );

    const missingR = [];
    for (let f in reaction.requiredReactants) {
      if ((rCounts[f] || 0) < reaction.requiredReactants[f]) {
        const sub = f.match(/\d+/) ? f.replace(/(\d+)/g, "$1") : ""; // Simplified for now
        missingR.push(f.replace(/(\d+)/g, ($1) => "₀₁₂₃₄₅₆₇₈₉"[$1] || $1));
      }
    }

    const missingP = [];
    for (let f in reaction.requiredProducts) {
      if ((pCounts[f] || 0) < reaction.requiredProducts[f]) {
        missingP.push(f.replace(/(\d+)/g, ($1) => "₀₁₂₃₄₅₆₇₈₉"[$1] || $1));
      }
    }

    const isMassConserved = rMass === pMass && rMass > 0;
    const isMoleculesCorrect = missingR.length === 0 && missingP.length === 0;
    // Check for extra molecules too? Simplified for now: just check if counts match exactly.
    let isPerfect = isMassConserved && isMoleculesCorrect;

    // Also check if any WRONG molecules are present
    const hasWrongReactant = reactantsList.some(
      (m) => !reaction.requiredReactants[m.formula],
    );
    const hasWrongProduct = productsList.some(
      (m) => !reaction.requiredProducts[m.formula],
    );
    if (hasWrongReactant || hasWrongProduct) isPerfect = false;

    if (isPerfect) {
      // Show success feedback
      const correctPanel = document.getElementById("correct_feedback_panel");
      const incorrectPanel = document.getElementById(
        "incorrect_feedback_panel",
      );
      const correctDesc = document.getElementById("correct_feedback_desc");

      if (incorrectPanel) incorrectPanel.style.display = "none";
      if (correctPanel && correctDesc) {
        correctDesc.textContent =
          "Congratulations! Mass is conserved and molecules are correct.";
        correctPanel.style.display = "block";

        clearTimeout(feedbackTimeout);
        feedbackTimeout = setTimeout(() => {
          correctPanel.style.display = "none";
        }, 3000);
      }
      checkPanel.style.display = "none";
    } else {
      checkPanel.style.display = "block";
      checkTitle.querySelector("tspan").textContent = "Not quite right";

      if (rMass === pMass) {
        checkMassStatus.querySelector("tspan").textContent =
          "Mass is conserved, but check molecules:";
      } else {
        checkMassStatus.querySelector("tspan").textContent =
          "Mass NOT conserved:";
      }

      let detailText = `${rMass}g (left) ${rMass === pMass ? "=" : "≠"} ${pMass}g (right)`;
      if (missingR.length > 0)
        detailText += ` | Missing reactants: ${missingR.join(", ")}`;
      if (missingP.length > 0)
        detailText += ` | Missing products: ${missingP.join(", ")}`;

      checkDetails.querySelector("tspan").textContent = detailText;
      checkHint.querySelector("tspan").textContent = reaction.hint;
    }
  }

  const checkAnsBtn = document.getElementById("Group_96");
  if (checkAnsBtn) {
    checkAnsBtn.style.cursor = "pointer";
    checkAnsBtn.addEventListener("click", checkAnswer);
  }

  const closeCheckBtn = document.getElementById("Group_579");
  if (closeCheckBtn) {
    closeCheckBtn.style.cursor = "pointer";
    closeCheckBtn.addEventListener("click", () => {
      document.getElementById("feedback_on_check_answer").style.display =
        "none";
    });
  }

  const helpBtn = document.getElementById("help_btn");
  if (helpBtn) {
    helpBtn.style.cursor = "pointer";
    helpBtn.addEventListener("click", () => {
      document.getElementById("help_panel").style.display = "block";
    });
  }

  const closeHelpBtn = document.getElementById("Group_593");
  if (closeHelpBtn) {
    closeHelpBtn.style.cursor = "pointer";
    closeHelpBtn.addEventListener("click", () => {
      document.getElementById("help_panel").style.display = "none";
    });
  }

  const resetBtn = document.getElementById("Group_97");
  if (resetBtn) {
    resetBtn.style.cursor = "pointer";
    resetBtn.addEventListener("click", () => {
      // Hide check panel if open
      const checkPanel = document.getElementById("feedback_on_check_answer");
      if (checkPanel) checkPanel.style.display = "none";

      // Cycle reaction
      currentReactionIndex = (currentReactionIndex + 1) % reactions.length;
      renderFormula();

      // Clear current setup
      reactantsList.length = 0;
      productsList.length = 0;
      document.querySelectorAll(".dropped-molecule").forEach((m) => m.remove());
      updateMasses();
    });
  }
});
