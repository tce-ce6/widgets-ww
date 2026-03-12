document.addEventListener("DOMContentLoaded", () => {
  const CROP_DATA = {
    // Rabi Crops
    Wheat: [
      "Jammu and Kashmir", "Himachal Pradesh", "Uttarakhand", "Punjab", "Haryana",
      "Rajasthan", "Uttar Pradesh", "Bihar", "Jharkhand", "West Bengal",
      "Madhya Pradesh", "Gujarat", "Maharashtra"
    ],
    Barley: ["Rajasthan", "Uttar Pradesh", "Madhya Pradesh", "Haryana", "Punjab", "West Bengal"],
    Mustard: ["Rajasthan", "Haryana", "Madhya Pradesh", "Uttar Pradesh", "West Bengal"],
    Chickpea: ["Madhya Pradesh", "Maharashtra", "Rajasthan", "Karnataka", "Uttar Pradesh"],
    Peas: ["Uttar Pradesh", "Madhya Pradesh", "Punjab", "Himachal Pradesh", "Jharkhand"],

    // Kharif Crops
    "Paddy (Rice)": [
      "West Bengal", "Uttar Pradesh", "Punjab", "Tamil Nadu", "Andhra Pradesh",
      "Bihar", "Chhattisgarh", "Odisha", "Assam"
    ],
    Sugarcane: ["Uttar Pradesh", "Maharashtra", "Karnataka", "Tamil Nadu", "Bihar", "Gujarat"],
    Cotton: ["Gujarat", "Maharashtra", "Telangana", "Karnataka", "Haryana", "Rajasthan"],
    Jute: ["West Bengal", "Bihar", "Assam", "Odisha", "Meghalaya"],
    Tea: ["Assam", "West Bengal", "Tamil Nadu", "Kerala"],
    Coffee: ["Karnataka", "Kerala", "Tamil Nadu"],
    Rubber: ["Kerala", "Tamil Nadu", "Karnataka"],

    // Zaid Crops
    Watermelon: ["Uttar Pradesh", "Karnataka", "Tamil Nadu", "Andhra Pradesh", "Maharashtra"],
    Muskmelon: ["Uttar Pradesh", "Punjab", "Haryana", "Maharashtra", "Andhra Pradesh"],
    "Moong Dal": ["Rajasthan", "Maharashtra", "Karnataka", "Andhra Pradesh", "Tamil Nadu"],
    Cucumber: ["Haryana", "Uttar Pradesh", "Karnataka", "Punjab", "Andhra Pradesh"]
  };

  const CROP_FACTS = {
    Wheat: {
      climate1: "Cool and moist weather during growing ",
      climate2: "period, warm and dry during ripening.",
      climate3: "Temperature: 10-25°C",
      soil1: "Well-drained loamy soil with good ",
      soil2: "organic content.",
      variety1: "• HD-2967", variety2: "• PBW-343", variety3: "• Lok-1",
      variety4: "• GW-322", variety5: "• Sharbati", variety6: "• Kalyan Sona",
      fact1: "Punjab and Haryana are called the 'Breadbasket of India' because they ",
      fact2: "produce nearly 50% of the country's wheat."
    },
    Barley: {
      climate1: "Cool and dry climate, frost resistant.",
      climate2: "Requires moderate rainfall.",
      climate3: "Temperature: 12-32°C",
      soil1: "Sandy to moderately heavy loam soils. ",
      soil2: "Must be well-drained.",
      variety1: "• RD-2786", variety2: "• BH-902", variety3: "• PL-426",
      variety4: "• DWRUB-52", variety5: "• K-560", variety6: "• RD-2552",
      fact1: "Barley is one of the oldest cultivated grains and is widely ",
      fact2: "used for malting in the beverage industry."
    },
    Mustard: {
      climate1: "Cool and dry climate during growth.",
      climate2: "Requires clear weather during flowering.",
      climate3: "Temperature: 10-25°C",
      soil1: "Light loam to heavy loam soils ",
      soil2: "with good drainage.",
      variety1: "• Pusa Bold", variety2: "• Kranti", variety3: "• Varuna",
      variety4: "• Rohini", variety5: "• Maya", variety6: "• Pusa Jaikisan",
      fact1: "Mustard seeds are a rich source of oil and protein, ",
      fact2: "and India is a leading global producer."
    },
    Chickpea: {
      climate1: "Moderate rainfall and cold winter.",
      climate2: "Very sensitive to excess moisture.",
      climate3: "Temperature: 20-25°C",
      soil1: "Well-drained dark cotton soils ",
      soil2: "and sandy loam soils.",
      variety1: "• Pusa 372", variety2: "• KAK 2", variety3: "• JG 11",
      variety4: "• Vijay", variety5: "• Vishal", variety6: "• Digvijay",
      fact1: "Also known as Bengal Gram, chickpea is the most ",
      fact2: "important pulse crop grown in India."
    },
    Peas: {
      climate1: "Cool season crop requiring moist conditions.",
      climate2: "Cannot tolerate frost during flowering.",
      climate3: "Temperature: 13-18°C",
      soil1: "Well-drained loamy to clayey soils ",
      soil2: "rich in organic matter.",
      variety1: "• Arkel", variety2: "• Bonneville", variety3: "• Pusa Pragati",
      variety4: "• Lincoln", variety5: "• Azad P-1", variety6: "• Matar Ageta",
      fact1: "India is historically one of the largest producers ",
      fact2: "of green peas globally."
    },
    "Paddy (Rice)": {
      climate1: "Hot and humid climate.",
      climate2: "Requires heavy and prolonged rainfall.",
      climate3: "Temperature: 21-37°C",
      soil1: "Heavy clay or clay loam, ",
      soil2: "capable of holding surface water.",
      variety1: "• IR8", variety2: "• Jaya", variety3: "• Basmati",
      variety4: "• Swarna", variety5: "• BPT 5204", variety6: "• Sona Masuri",
      fact1: "Rice is the staple food for more than ",
      fact2: "half of the Indian population."
    },
    Sugarcane: {
      climate1: "Hot and humid climate with abundant rain.",
      climate2: "Long growing season ranging 10-15 months.",
      climate3: "Temperature: 21-27°C",
      soil1: "Deep, rich loamy soil ",
      soil2: "with excellent drainage.",
      variety1: "• Co 0238", variety2: "• Co 86032", variety3: "• CoJ 64",
      variety4: "• Co 0118", variety5: "• Co 11015", variety6: "• Co 89003",
      fact1: "India is the second-largest producer of sugarcane ",
      fact2: "in the world after Brazil."
    },
    Cotton: {
      climate1: "Warm and humid climate, lots of sunshine.",
      climate2: "Requires 210 frost-free days.",
      climate3: "Temperature: 21-30°C",
      soil1: "Black cotton soil (Regur), ",
      soil2: "well-drained deep loams.",
      variety1: "• Sujata", variety2: "• MCU-5", variety3: "• DCH-32",
      variety4: "• Bunny Bt", variety5: "• Mallika Bt", variety6: "• RCH-2",
      fact1: "Cotton is known as 'White Gold' in Indian ",
      fact2: "agricultural and economic terms."
    },
    Jute: {
      climate1: "Hot and humid climate.",
      climate2: "High rainfall exceeding 1500mm.",
      climate3: "Temperature: 24-35°C",
      soil1: "New alluvial (Khadar) soil, ",
      soil2: "loamy plains and river basins.",
      variety1: "• JRO 524", variety2: "• JRO 878", variety3: "• JRC 212",
      variety4: "• JRC 321", variety5: "• JRC 7447", variety6: "• Tarun",
      fact1: "Known as the 'Golden Fibre', jute is primarily grown ",
      fact2: "in the Ganges-Brahmaputra delta region."
    },
    Tea: {
      climate1: "Warm and humid climate.",
      climate2: "Rainfall well distributed throughout the year.",
      climate3: "Temperature: 20-30°C",
      soil1: "Deep, fertile, well-drained soil, ",
      soil2: "rich in organic humus.",
      variety1: "• Assam", variety2: "• Darjeeling", variety3: "• Nilgiri",
      variety4: "• Kangra", variety5: "• Munnar", variety6: "• Dooars",
      fact1: "India is the second-largest producer of tea globally, ",
      fact2: "famous for its Darjeeling and Assam blends."
    },
    Coffee: {
      climate1: "Hot and humid climate, moderate rainfall.",
      climate2: "Grown mostly under shade trees.",
      climate3: "Temperature: 15-28°C",
      soil1: "Well-drained, rich friable loamy soil ",
      soil2: "containing abundant iron and organic matter.",
      variety1: "• Arabica", variety2: "• Robusta", variety3: "• Kent",
      variety4: "• S.795", variety5: "• Cauvery", variety6: "• San Ramon",
      fact1: "Indian coffee is unique as it is grown in the shade ",
      fact2: "rather than direct sunlight like in other countries."
    },
    Rubber: {
      climate1: "Equatorial climate, hot and humid.",
      climate2: "Heavy rainfall of over 2000mm.",
      climate3: "Temperature: above 25°C",
      soil1: "Well-drained, deeply weathered ",
      soil2: "lateritic soils.",
      variety1: "• RRII 105", variety2: "• GT 1", variety3: "• PB 28/59",
      variety4: "• PB 217", variety5: "• RRIM 600", variety6: "• PB 235",
      fact1: "Kerala alone accounts for the vast majority ",
      fact2: "of India's natural rubber production."
    },
    Watermelon: {
      climate1: "Hot and dry climate with plenty of sunshine.",
      climate2: "Vulnerable to frost.",
      climate3: "Temperature: 25-30°C",
      soil1: "Sandy or sandy loam soils. ",
      soil2: "Must be well-drained.",
      variety1: "• Sugar Baby", variety2: "• Arka Jyoti", variety3: "• Asahi Yamato",
      variety4: "• Durgapura Lal", variety5: "• Pusa Bedana", variety6: "• Kiran",
      fact1: "A watermelon comprises approximately 92% water, ",
      fact2: "making it ideal for the extreme Indian summer."
    },
    Muskmelon: {
      climate1: "Hot and dry climate is ideal.",
      climate2: "Requires high temperature during ripening.",
      climate3: "Temperature: 25-30°C",
      soil1: "Deep, well-drained sandy loam ",
      soil2: "soils are optimum.",
      variety1: "• Hara Madhu", variety2: "• Pusa Sharbati", variety3: "• Arka Rajhans",
      variety4: "• Punjab Sunehri", variety5: "• Durgapura Madhu", variety6: "• Kashi Madhu",
      fact1: "Muskmelon is highly valued for its sweet, juicy ",
      fact2: "flesh and cooling properties during summer."
    },
    "Moong Dal": {
      climate1: "Warm climate, can tolerate heat well.",
      climate2: "Grown mostly as a catch crop in Zaid.",
      climate3: "Temperature: 25-35°C",
      soil1: "Well-drained loamy to sandy loam soils. ",
      soil2: "Cannot tolerate waterlogging.",
      variety1: "• Pusa Baisakhi", variety2: "• PS 16", variety3: "• K 851",
      variety4: "• Samrat", variety5: "• SML 668", variety6: "• Meha",
      fact1: "Moong dal (Green Gram) is highly digestible and a ",
      fact2: "major source of plant-based protein in Indian diets."
    },
    Cucumber: {
      climate1: "Warm climate, killed by frost.",
      climate2: "Likes abundant moisture.",
      climate3: "Temperature: 20-30°C",
      soil1: "Well-drained sandy loam soil with ",
      soil2: "good organic matter content.",
      variety1: "• Pusa Uday", variety2: "• Pusa Barkha", variety3: "• Japanese Long",
      variety4: "• Swarna Ageti", variety5: "• Kalyanpur Green", variety6: "• Pusa Sanyog",
      fact1: "Cucumber is structurally a fruit but is treated ",
      fact2: "functionally and culinarily as a vegetable."
    }
  };

  let currentState = {
    season: null,
    crop: null,
    selectedStates: new Set(),
    isAnswerRevealed: false
  };

  const elements = {
    btnRabiHome: document.getElementById("btn-rabi"),
    btnKharifHome: document.getElementById("btn-Kharif"),
    btnZaidHome: document.getElementById("btn-Zaid"),
    panel01buttons: document.getElementById("panel01buttons"),
    itextActivity: document.getElementById("i-text-activity"),
    panel02map: document.getElementById("panel02map"),
    mapContainer: document.getElementById("map-container"),
    cropPromptContainer: document.getElementById("crop-prompt-container"),
    cropPromptTitle: document.getElementById("crop-prompt-title"),
    cropPromptText: document.getElementById("crop-prompt-text"),
    itextcropmap: document.getElementById("i-text-cropmap"),
    globalButtons: document.getElementById("global-buttons"),
    submitBtn: document.getElementById("submit-btn"),
    showAnswerBtn: document.getElementById("show-answer-btn"),
    homeBtn: document.getElementById("home-btn"),
    feedbackCorrectPopup: document.getElementById("feedback-correct-popup"),
    feedbackIncorrectPopup: document.getElementById("feedback-incorrect-popup"),
    factsheet: document.getElementById("factsheet"),
    factsheetTitle: document.getElementById("factsheet-title"),
    factsheetBtnText: document.getElementById("factsheet-btn-text"),
    factsheetStates: document.getElementById("factsheet-states"),
    factsheetClimate: document.getElementById("factsheet-climate"),
    factsheetSoil: document.getElementById("factsheet-soil"),
    factsheetVariety: document.getElementById("factsheet-variety"),
    factsheetFact: document.getElementById("factsheet-fact"),
    croplabel: document.getElementById("croplabel")
  };

  const hideAll = () => {
    Object.values(elements).forEach(el => {
      if (el) {
        el.style.display = "none";
        el.classList.add("st170");
      }
    });
  };

  const showHome = () => {
    hideAll();
    currentState = { season: null, crop: null, selectedStates: new Set(), isAnswerRevealed: false };

    if (elements.panel01buttons) {
      elements.panel01buttons.style.display = "block";
      elements.panel01buttons.classList.remove("st170");
    }
    if (elements.itextActivity) {
      elements.itextActivity.style.display = "block";
      elements.itextActivity.classList.remove("st170");
      const tspans = elements.itextActivity.querySelectorAll("text tspan");
      if (tspans.length > 0) {
        tspans[0].textContent = "Select a season to begin.";
      }
    }
    if (elements.globalButtons) {
      elements.globalButtons.style.display = "block";
      elements.globalButtons.classList.remove("st170");
      elements.submitBtn.style.display = "none";
      elements.showAnswerBtn.style.display = "none";
      elements.factsheetBtnText?.querySelector("tspan")?.setAttribute("textContent", "Factsheet");
    }
    if (elements.homeBtn) elements.homeBtn.style.display = "none";
  };

  const centerSVGText = (tspan, x) => {
    if (tspan) {
      tspan.setAttribute("x", x);
      tspan.setAttribute("text-anchor", "middle");
    }
  };

  const initMapPaths = () => {
    // Any map initialization logic (if needed in future)
  };

  const highlightState = (stateName, isCorrect = false) => {
    const stateGroup = document.querySelector(`[data-state="${stateName}"]`);
    if (stateGroup) {
      stateGroup.classList.add(isCorrect ? "correct-highlight" : "selected-highlight");
    }
  };

  const resetMapHighlights = () => {
    document.querySelectorAll("[data-state]").forEach(el => {
      el.classList.remove("correct-highlight", "selected-highlight");
    });
    currentState.selectedStates.clear();
  };

  const updateFactsheet = (crop) => {
    const facts = CROP_FACTS[crop];
    if (!facts) return;

    // Factsheet title
    if (elements.factsheetTitle) {
      const span = elements.factsheetTitle.querySelector("tspan");
      if (span) {
        span.textContent = `${crop} Factsheet`;
        centerSVGText(span, 1370);
      }
    }

    // Factsheet button text
    if (elements.factsheetBtnText) {
      const span = elements.factsheetBtnText.querySelector("tspan");
      if (span) {
        span.textContent = `${crop} Factsheet`;
        centerSVGText(span, 1372.5);
      }
    }

    // States list
    if (elements.factsheetStates && CROP_DATA[crop]) {
      const tspans = Array.from(elements.factsheetStates.querySelectorAll("text tspan"));
      if (tspans.length > 0) {
        tspans[0].textContent = "States:";
        centerSVGText(tspans[0], 1106);
        CROP_DATA[crop].forEach((state, i) => {
          if (tspans[i + 1]) {
            tspans[i + 1].textContent = state;
            centerSVGText(tspans[i + 1], 1106);
          }
        });
      }
    }

    // Climate
    if (elements.factsheetClimate) {
      const tspans = elements.factsheetClimate.querySelectorAll("text tspan");
      if (tspans.length >= 3) {
        tspans[0].textContent = facts.climate1;
        tspans[1].textContent = facts.climate2;
        tspans[2].textContent = facts.climate3;
      }
    }

    // Soil
    if (elements.factsheetSoil) {
      const tspans = elements.factsheetSoil.querySelectorAll("text tspan");
      if (tspans.length >= 2) {
        tspans[0].textContent = facts.soil1;
        tspans[1].textContent = facts.soil2;
      }
    }

    // Varieties
    if (elements.factsheetVariety) {
      const tspans = elements.factsheetVariety.querySelectorAll("text tspan");
      if (tspans.length >= 6) {
        for (let i = 0; i < 6; i++) {
          const key = `variety${i + 1}`;
          tspans[i].textContent = facts[key] || "";
        }
      }
    }

    // Fact
    if (elements.factsheetFact) {
      const tspans = elements.factsheetFact.querySelectorAll("text tspan");
      if (tspans.length >= 2) {
        tspans[0].textContent = facts.fact1;
        tspans[1].textContent = facts.fact2;
      }
    }
  };

  const selectSeason = (season) => {
    currentState.season = season;
    hideAll();

    if (elements.panel01buttons) {
      elements.panel01buttons.style.display = "block";
      elements.panel01buttons.classList.remove("st170");
    }

    if (elements.itextActivity) {
      elements.itextActivity.style.display = "block";
      elements.itextActivity.classList.remove("st170");
      const tspans = elements.itextActivity.querySelectorAll("text tspan");
      if (tspans.length > 0) {
        tspans[0].textContent = "Select by tapping a crop from the list.";
      }
    }

    if (elements.panel02map) {
      elements.panel02map.style.display = "block";
      elements.panel02map.classList.remove("st170");
    }
    if (elements.mapContainer) {
      elements.mapContainer.style.display = "block";
      elements.mapContainer.classList.remove("st170");
    }

    if (elements.globalButtons) {
      elements.globalButtons.style.display = "block";
      elements.globalButtons.classList.remove("st170");
      elements.submitBtn.style.display = "none";
      elements.showAnswerBtn.style.display = "none";
    }

    if (elements.homeBtn) {
      elements.homeBtn.style.display = "block";
      elements.homeBtn.classList.remove("st170");
    }
  };

  const selectCrop = (crop) => {
    currentState = {
      ...currentState,
      crop,
      selectedStates: new Set(),
      isAnswerRevealed: false
    };

    resetMapHighlights();

    if (elements.panel02map) {
      elements.panel02map.style.display = "block";
      elements.panel02map.classList.remove("st170");
    }
    if (elements.mapContainer) {
      elements.mapContainer.style.display = "block";
      elements.mapContainer.classList.remove("st170");
    }

    if (elements.croplabel) {
      const labelTspan = elements.croplabel.querySelector("tspan");
      if (labelTspan) {
        labelTspan.textContent = `${currentState.season} season`;
        const textNode = labelTspan.closest("text");
        if (textNode) {
          textNode.setAttribute("text-anchor", "middle");
          textNode.setAttribute("transform", `translate(471 134)`);
          labelTspan.setAttribute("x", "0");
        }
      }
    }

    // Show selected crop highlight (bright version)
    ["btn-rabi-selected", "btn-Kharif-selected", "btn-Zaid-selected"].forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        container.style.display = "block";
        container.classList.remove("st170");
        Array.from(container.children).forEach(child => {
          const match = Array.from(child.querySelectorAll("tspan"))
            .some(t => t.textContent.trim() === crop);
          child.style.display = match ? "block" : "none";
        });
      }
    });

    // Dim unselected crops
    ["btn-rabi", "btn-Kharif", "btn-Zaid"].forEach(id => {
      const container = document.getElementById(id);
      if (container) {
        Array.from(container.children).forEach(child => {
          const match = Array.from(child.querySelectorAll("tspan"))
            .some(t => t.textContent.trim() === crop);
          if (match) {
            child.style.display = "none"; // hide base version
          } else {
            child.style.display = "block";
            child.style.opacity = "0.5";
          }
        });
      }
    });

    // Crop prompt popup
    if (elements.cropPromptContainer) {
      elements.cropPromptContainer.style.display = "block";
      elements.cropPromptContainer.classList.remove("st170");

      const count = CROP_DATA[crop]?.length || 0;
      const promptTexts = elements.cropPromptText?.querySelectorAll("text tspan");
      if (promptTexts?.length >= 4) {
        promptTexts[0].textContent = `${crop} selected!`;
        promptTexts[1].textContent = `This crop is majorly grown in ${count} states/UTs `;
        promptTexts[2].textContent = "across India. ";
        promptTexts[3].textContent = "Can you find them all on the map?";

        centerSVGText(promptTexts[0], 1326);
        centerSVGText(promptTexts[1], 1370);
        centerSVGText(promptTexts[2], 1370);
        centerSVGText(promptTexts[3], 1370);
      }

      const titleTspan = elements.cropPromptTitle?.querySelector("tspan");
      if (titleTspan) {
        titleTspan.textContent = crop;
        centerSVGText(titleTspan, 1372.5);
      }
    }

    // Correct popup text
    if (elements.feedbackCorrectPopup) {
      const texts = elements.feedbackCorrectPopup.querySelectorAll("text tspan");
      const count = CROP_DATA[crop]?.length || 0;
      if (texts?.length >= 4) {
        texts[0].textContent = "You Nailed It!";
        texts[2].textContent = `You have identified all ${count} major ${crop} `;
      }
    }

    updateFactsheet(crop);

    if (elements.showAnswerBtn) {
      elements.showAnswerBtn.style.display = "block";
      elements.showAnswerBtn.classList.remove("st170");
      const tspan = elements.showAnswerBtn.querySelector("tspan");
      if (tspan) tspan.textContent = "Show Answer";
    }
  };

  // Season buttons
  elements.btnRabiHome?.addEventListener("click", () => selectSeason("Rabi"));
  elements.btnKharifHome?.addEventListener("click", () => selectSeason("Kharif"));
  elements.btnZaidHome?.addEventListener("click", () => selectSeason("Zaid"));

  // Crop buttons (Rabi)
  document.getElementById("Group_1570")?.addEventListener("click", () => selectCrop("Wheat"));
  document.getElementById("Group_1571")?.addEventListener("click", () => selectCrop("Barley"));
  document.getElementById("Group_1572")?.addEventListener("click", () => selectCrop("Mustard"));
  document.getElementById("Group_1573")?.addEventListener("click", () => selectCrop("Chickpea"));
  document.getElementById("Group_1574")?.addEventListener("click", () => selectCrop("Peas"));

  // Crop buttons (Kharif)
  document.getElementById("Group_Kharif_0")?.addEventListener("click", () => selectCrop("Paddy (Rice)"));
  document.getElementById("Group_Kharif_1")?.addEventListener("click", () => selectCrop("Sugarcane"));
  document.getElementById("Group_Kharif_2")?.addEventListener("click", () => selectCrop("Cotton"));
  document.getElementById("Group_Kharif_3")?.addEventListener("click", () => selectCrop("Jute"));
  document.getElementById("Group_Kharif_4")?.addEventListener("click", () => selectCrop("Tea"));
  document.getElementById("Group_Kharif_5")?.addEventListener("click", () => selectCrop("Coffee"));
  document.getElementById("Group_Kharif_6")?.addEventListener("click", () => selectCrop("Rubber"));

  // Crop buttons (Zaid)
  document.getElementById("Group_Zaid_0")?.addEventListener("click", () => selectCrop("Watermelon"));
  document.getElementById("Group_Zaid_1")?.addEventListener("click", () => selectCrop("Muskmelon"));
  document.getElementById("Group_Zaid_2")?.addEventListener("click", () => selectCrop("Moong Dal"));
  document.getElementById("Group_Zaid_3")?.addEventListener("click", () => selectCrop("Cucumber"));

  // Got It (prompt popup)
  document.getElementById("got-it-btn")?.addEventListener("click", () => {
    if (elements.cropPromptContainer) {
      elements.cropPromptContainer.style.display = "none";
      elements.cropPromptContainer.classList.add("st170");
    }
    if (elements.itextcropmap) {
      elements.itextcropmap.style.display = "block";
      elements.itextcropmap.classList.remove("st170");
    }
  });

  // Got It (incorrect feedback)
  document.getElementById("got-it-incorrect-btn")?.addEventListener("click", () => {
    if (elements.feedbackIncorrectPopup) {
      elements.feedbackIncorrectPopup.style.display = "none";
      elements.feedbackIncorrectPopup.classList.add("st170");
    }
  });

  // Factsheet button
  document.getElementById("factsheet-btn")?.addEventListener("click", () => {
    if (elements.feedbackCorrectPopup) {
      elements.feedbackCorrectPopup.style.display = "none";
      elements.feedbackCorrectPopup.classList.add("st170");
    }
    if (elements.factsheet) {
      elements.factsheet.style.display = "block";
      elements.factsheet.classList.remove("st170");
    }
  });

  // Try Another Crop
  document.getElementById("try-another-crop-btn")?.addEventListener("click", showHome);

  // Submit button
  elements.submitBtn?.addEventListener("click", () => {
    if (currentState.selectedStates.size === 0) return;

    const correct = CROP_DATA[currentState.crop] || [];
    if (currentState.selectedStates.size === correct.length &&
      [...currentState.selectedStates].every(s => correct.includes(s))) {
      if (elements.feedbackCorrectPopup) {
        elements.feedbackCorrectPopup.style.display = "block";
        elements.feedbackCorrectPopup.classList.remove("st170");
      }
      elements.submitBtn.style.opacity = "0.5";
      elements.submitBtn.style.pointerEvents = "none";
    } else {
      if (elements.feedbackIncorrectPopup) {
        elements.feedbackIncorrectPopup.style.display = "block";
        elements.feedbackIncorrectPopup.classList.remove("st170");
      }
    }
  });

  // Show / Hide Answer
  elements.showAnswerBtn?.addEventListener("click", () => {
    const correct = CROP_DATA[currentState.crop] || [];
    const tspan = elements.showAnswerBtn?.querySelector("tspan");

    if (!currentState.isAnswerRevealed) {
      correct.forEach(s => highlightState(s, true));
      currentState.isAnswerRevealed = true;
      if (tspan) tspan.textContent = "Hide Answer";
    } else {
      resetMapHighlights();
      currentState.selectedStates.forEach(s => highlightState(s, false));
      currentState.isAnswerRevealed = false;
      if (tspan) tspan.textContent = "Show Answer";
    }
  });

  // Home button
  elements.homeBtn?.addEventListener("click", showHome);

  // Map click handler
  elements.mapContainer?.addEventListener("click", (e) => {
    const target = e.target.closest("[data-state]");
    if (!target || !currentState.crop) return;

    const stateName = target.getAttribute("data-state");
    if (!stateName) return;

    if (currentState.selectedStates.has(stateName)) {
      currentState.selectedStates.delete(stateName);
      target.classList.remove("selected-highlight");
    } else {
      currentState.selectedStates.add(stateName);
      target.classList.add("selected-highlight");
    }

    elements.submitBtn.style.opacity = currentState.selectedStates.size > 0 ? "1" : "0.5";
    elements.submitBtn.style.pointerEvents = currentState.selectedStates.size > 0 ? "auto" : "none";
  });

  // Initial setup
  initMapPaths();
  showHome();
});