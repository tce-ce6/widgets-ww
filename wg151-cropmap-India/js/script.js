document.addEventListener("DOMContentLoaded", () => {
  const CROP_DATA = {
    // Rabi Crops
    Wheat: [
      "Jammu and Kashmir",
      "Himachal Pradesh",
      "Uttarakhand",
      "Punjab",
      "Haryana",
      "Rajasthan",
      "Uttar Pradesh",
      "Bihar",
      "Jharkhand",
      "West Bengal",
      "Madhya Pradesh",
      "Gujarat",
      "Maharashtra",
    ],
    Barley: [
      "Rajasthan",
      "Uttar Pradesh",
      "Madhya Pradesh",
      "Haryana",
      "Punjab",
      "West Bengal",
    ],
    Mustard: [
      "Rajasthan",
      "Haryana",
      "Madhya Pradesh",
      "Uttar Pradesh",
      "West Bengal",
    ],
    Chickpea: [
      "Madhya Pradesh",
      "Maharashtra",
      "Rajasthan",
      "Karnataka",
      "Uttar Pradesh",
    ],
    Peas: [
      "Uttar Pradesh",
      "Madhya Pradesh",
      "Punjab",
      "Himachal Pradesh",
      "Jharkhand",
    ],

    // Kharif Crops
    "Paddy (Rice)": [
      "West Bengal",
      "Uttar Pradesh",
      "Punjab",
      "Tamil Nadu",
      "Andhra Pradesh",
      "Bihar",
      "Chhattisgarh",
      "Odisha",
      "Assam",
    ],
    Sugarcane: [
      "Uttar Pradesh",
      "Maharashtra",
      "Karnataka",
      "Tamil Nadu",
      "Bihar",
      "Gujarat",
    ],
    Cotton: [
      "Gujarat",
      "Maharashtra",
      "Telangana",
      "Karnataka",
      "Haryana",
      "Rajasthan",
    ],
    Jute: ["West Bengal", "Bihar", "Assam", "Odisha", "Meghalaya"],
    Tea: ["Assam", "West Bengal", "Tamil Nadu", "Kerala"],
    Coffee: ["Karnataka", "Kerala", "Tamil Nadu"],
    Rubber: ["Kerala", "Tamil Nadu", "Karnataka"],

    // Zaid Crops
    Watermelon: [
      "Uttar Pradesh",
      "Karnataka",
      "Tamil Nadu",
      "Andhra Pradesh",
      "Maharashtra",
    ],
    Muskmelon: [
      "Uttar Pradesh",
      "Punjab",
      "Haryana",
      "Maharashtra",
      "Andhra Pradesh",
    ],
    "Moong Dal": [
      "Rajasthan",
      "Maharashtra",
      "Karnataka",
      "Andhra Pradesh",
      "Tamil Nadu",
    ],
    Cucumber: [
      "Haryana",
      "Uttar Pradesh",
      "Karnataka",
      "Punjab",
      "Andhra Pradesh",
    ],
  };

  const CROP_FACTS = {
    // Rabi
    Wheat: {
      climate1: "Cool and moist weather during growing ",
      climate2: "period, warm and dry during ripening.",
      climate3: "Temperature: 10-25°C",
      soil1: "Well-drained loamy soil with good ",
      soil2: "organic content.",
      variety1: "• HD-2967",
      variety2: "• PBW-343",
      variety3: "• Lok-1",
      variety4: "• GW-322",
      variety5: "• Sharbati",
      variety6: "• Kalyan Sona",
      fact1:
        "Punjab and Haryana are called the 'Breadbasket of India' because they ",
      fact2: "produce nearly 50% of the country's wheat.",
    },
    Barley: {
      climate1: "Cool and dry climate, frost resistant.",
      climate2: "Requires moderate rainfall.",
      climate3: "Temperature: 12-32°C",
      soil1: "Sandy to moderately heavy loam soils. ",
      soil2: "Must be well-drained.",
      variety1: "• RD-2786",
      variety2: "• BH-902",
      variety3: "• PL-426",
      variety4: "• DWRUB-52",
      variety5: "• K-560",
      variety6: "• RD-2552",
      fact1: "Barley is one of the oldest cultivated grains and is widely ",
      fact2: "used for malting in the beverage industry.",
    },
    Mustard: {
      climate1: "Cool and dry climate during growth.",
      climate2: "Requires clear weather during flowering.",
      climate3: "Temperature: 10-25°C",
      soil1: "Light loam to heavy loam soils ",
      soil2: "with good drainage.",
      variety1: "• Pusa Bold",
      variety2: "• Kranti",
      variety3: "• Varuna",
      variety4: "• Rohini",
      variety5: "• Maya",
      variety6: "• Pusa Jaikisan",
      fact1: "Mustard seeds are a rich source of oil and protein, ",
      fact2: "and India is a leading global producer.",
    },
    Chickpea: {
      climate1: "Moderate rainfall and cold winter.",
      climate2: "Very sensitive to excess moisture.",
      climate3: "Temperature: 20-25°C",
      soil1: "Well-drained dark cotton soils ",
      soil2: "and sandy loam soils.",
      variety1: "• Pusa 372",
      variety2: "• KAK 2",
      variety3: "• JG 11",
      variety4: "• Vijay",
      variety5: "• Vishal",
      variety6: "• Digvijay",
      fact1: "Also known as Bengal Gram, chickpea is the most ",
      fact2: "important pulse crop grown in India.",
    },
    Peas: {
      climate1: "Cool season crop requiring moist conditions.",
      climate2: "Cannot tolerate frost during flowering.",
      climate3: "Temperature: 13-18°C",
      soil1: "Well-drained loamy to clayey soils ",
      soil2: "rich in organic matter.",
      variety1: "• Arkel",
      variety2: "• Bonneville",
      variety3: "• Pusa Pragati",
      variety4: "• Lincoln",
      variety5: "• Azad P-1",
      variety6: "• Matar Ageta",
      fact1: "India is historically one of the largest producers ",
      fact2: "of green peas globally.",
    },

    // Kharif
    "Paddy (Rice)": {
      climate1: "Hot and humid climate.",
      climate2: "Requires heavy and prolonged rainfall.",
      climate3: "Temperature: 21-37°C",
      soil1: "Heavy clay or clay loam, ",
      soil2: "capable of holding surface water.",
      variety1: "• IR8",
      variety2: "• Jaya",
      variety3: "• Basmati",
      variety4: "• Swarna",
      variety5: "• BPT 5204",
      variety6: "• Sona Masuri",
      fact1: "Rice is the staple food for more than ",
      fact2: "half of the Indian population.",
    },
    Sugarcane: {
      climate1: "Hot and humid climate with abundant rain.",
      climate2: "Long growing season ranging 10-15 months.",
      climate3: "Temperature: 21-27°C",
      soil1: "Deep, rich loamy soil ",
      soil2: "with excellent drainage.",
      variety1: "• Co 0238",
      variety2: "• Co 86032",
      variety3: "• CoJ 64",
      variety4: "• Co 0118",
      variety5: "• Co 11015",
      variety6: "• Co 89003",
      fact1: "India is the second-largest producer of sugarcane ",
      fact2: "in the world after Brazil.",
    },
    Cotton: {
      climate1: "Warm and humid climate, lots of sunshine.",
      climate2: "Requires 210 frost-free days.",
      climate3: "Temperature: 21-30°C",
      soil1: "Black cotton soil (Regur), ",
      soil2: "well-drained deep loams.",
      variety1: "• Sujata",
      variety2: "• MCU-5",
      variety3: "• DCH-32",
      variety4: "• Bunny Bt",
      variety5: "• Mallika Bt",
      variety6: "• RCH-2",
      fact1: "Cotton is known as 'White Gold' in Indian ",
      fact2: "agricultural and economic terms.",
    },
    Jute: {
      climate1: "Hot and humid climate.",
      climate2: "High rainfall exceeding 1500mm.",
      climate3: "Temperature: 24-35°C",
      soil1: "New alluvial (Khadar) soil, ",
      soil2: "loamy plains and river basins.",
      variety1: "• JRO 524",
      variety2: "• JRO 878",
      variety3: "• JRC 212",
      variety4: "• JRC 321",
      variety5: "• JRC 7447",
      variety6: "• Tarun",
      fact1: "Known as the 'Golden Fibre', jute is primarily grown ",
      fact2: "in the Ganges-Brahmaputra delta region.",
    },
    Tea: {
      climate1: "Warm and humid climate.",
      climate2: "Rainfall well distributed throughout the year.",
      climate3: "Temperature: 20-30°C",
      soil1: "Deep, fertile, well-drained soil, ",
      soil2: "rich in organic humus.",
      variety1: "• Assam",
      variety2: "• Darjeeling",
      variety3: "• Nilgiri",
      variety4: "• Kangra",
      variety5: "• Munnar",
      variety6: "• Dooars",
      fact1: "India is the second-largest producer of tea globally, ",
      fact2: "famous for its Darjeeling and Assam blends.",
    },
    Coffee: {
      climate1: "Hot and humid climate, moderate rainfall.",
      climate2: "Grown mostly under shade trees.",
      climate3: "Temperature: 15-28°C",
      soil1: "Well-drained, rich friable loamy soil ",
      soil2: "containing abundant iron and organic matter.",
      variety1: "• Arabica",
      variety2: "• Robusta",
      variety3: "• Kent",
      variety4: "• S.795",
      variety5: "• Cauvery",
      variety6: "• San Ramon",
      fact1: "Indian coffee is unique as it is grown in the shade ",
      fact2: "rather than direct sunlight like in other countries.",
    },
    Rubber: {
      climate1: "Equatorial climate, hot and humid.",
      climate2: "Heavy rainfall of over 2000mm.",
      climate3: "Temperature: above 25°C",
      soil1: "Well-drained, deeply weathered ",
      soil2: "lateritic soils.",
      variety1: "• RRII 105",
      variety2: "• GT 1",
      variety3: "• PB 28/59",
      variety4: "• PB 217",
      variety5: "• RRIM 600",
      variety6: "• PB 235",
      fact1: "Kerala alone accounts for the vast majority ",
      fact2: "of India's natural rubber production.",
    },

    // Zaid
    Watermelon: {
      climate1: "Hot and dry climate with plenty of sunshine.",
      climate2: "Vulnerable to frost.",
      climate3: "Temperature: 25-30°C",
      soil1: "Sandy or sandy loam soils. ",
      soil2: "Must be well-drained.",
      variety1: "• Sugar Baby",
      variety2: "• Arka Jyoti",
      variety3: "• Asahi Yamato",
      variety4: "• Durgapura Lal",
      variety5: "• Pusa Bedana",
      variety6: "• Kiran",
      fact1: "A watermelon comprises approximately 92% water, ",
      fact2: "making it ideal for the extreme Indian summer.",
    },
    Muskmelon: {
      climate1: "Hot and dry climate is ideal.",
      climate2: "Requires high temperature during ripening.",
      climate3: "Temperature: 25-30°C",
      soil1: "Deep, well-drained sandy loam ",
      soil2: "soils are optimum.",
      variety1: "• Hara Madhu",
      variety2: "• Pusa Sharbati",
      variety3: "• Arka Rajhans",
      variety4: "• Punjab Sunehri",
      variety5: "• Durgapura Madhu",
      variety6: "• Kashi Madhu",
      fact1: "Muskmelon is highly valued for its sweet, juicy ",
      fact2: "flesh and cooling properties during summer.",
    },
    "Moong Dal": {
      climate1: "Warm climate, can tolerate heat well.",
      climate2: "Grown mostly as a catch crop in Zaid.",
      climate3: "Temperature: 25-35°C",
      soil1: "Well-drained loamy to sandy loam soils. ",
      soil2: "Cannot tolerate waterlogging.",
      variety1: "• Pusa Baisakhi",
      variety2: "• PS 16",
      variety3: "• K 851",
      variety4: "• Samrat",
      variety5: "• SML 668",
      variety6: "• Meha",
      fact1: "Moong dal (Green Gram) is highly digestible and a ",
      fact2: "major source of plant-based protein in Indian diets.",
    },
    Cucumber: {
      climate1: "Warm climate, killed by frost.",
      climate2: "Likes abundant moisture.",
      climate3: "Temperature: 20-30°C",
      soil1: "Well-drained sandy loam soil with ",
      soil2: "good organic matter content.",
      variety1: "• Pusa Uday",
      variety2: "• Pusa Barkha",
      variety3: "• Japanese Long",
      variety4: "• Swarna Ageti",
      variety5: "• Kalyanpur Green",
      variety6: "• Pusa Sanyog",
      fact1: "Cucumber is structurally a fruit but is treated ",
      fact2: "functionally and culinarily as a vegetable.",
    },
  };

  let currentState = {
    season: null,
    crop: null,
    selectedStates: new Set(),
    isAnswerRevealed: false,
  };

  // Elements
  const elements = {
    homeScreen: document.getElementById("btn-home-screen"),
    btnRabiHome: document.getElementById("Group_1591"),
    btnKharifHome: document.getElementById("Group_1590"),
    btnZaidHome: document.getElementById("Group_1589"),

    btnRabi: document.getElementById("btn-rabi"),
    btnKharif: document.getElementById("btn-Kharif"),
    btnZaid: document.getElementById("btn-Zaid"),
    panelRabi: document.getElementById("btn-rabi"),
    panelKharif: document.getElementById("btn-Kharif"),
    panelZaid: document.getElementById("btn-Zaid"),

    globalButtons: document.getElementById("btn-global"),
    cropPromptContainer: document.getElementById("crop-selection-popup"),
    cropPromptText: document.getElementById(
      "Wheat_selected_This_crop_is_majorly_grown_in_13_states_UTs_across_India._Can_you_find_them_all_on_the_map_",
    ),
    cropPromptTitle: document.getElementById("Wheat2"),

    gotItBtn: document.getElementById("Group_1614"),
    submitBtn: document.getElementById("Group_1610"),
    showAnswerBtn: document.getElementById("Group_1611"),
    homeBtn: document.getElementById("Group_601"),

    feedbackIncorrectPopup: document.getElementById("feedback-incorrect-state"),
    gotItIncorrectBtn: document.getElementById("Group_16141"),

    feedbackCorrectPopup: document.getElementById("feedback-end-crop"),
    feedbackCorrectText: document.getElementById(
      "You_Nailed_It_Congratulations_You_have_identified_all_13_major_Wheat_producing_states_",
    ),
    tryAnotherCropBtn: document.getElementById("Group_16161"),

    factsheet: document.getElementById("popup-factsheet"),
    factsheetBtn: document.getElementById("Group_1616"),
    factsheetBtnText: document.getElementById("Wheat_Factsheet"),
    factsheetTitle: document.getElementById("Wheat_Factsheet1"),
    factsheetClimate: document.getElementById(
      "Required_Climatic_Condition:_Cool_and_moist_weather_during_growing_period_warm_and_dry_during_ripening._Temperature:_10-25_C",
    ),
    factsheetSoil: document.getElementById(
      "Suitable_Soil:_Well-drained_loamy_soil_with_good_organic_content.",
    ),
    factsheetVariety: document.getElementById(
      "Variety_in_India_:_HD-2967_PBW-343_Lok-1_GW-322_Sharbati_Kalyan_Sona",
    ),
    factsheetFact: document.getElementById(
      "Fact:_Punjab_and_Haryana_are_called_the_Breadbasket_of_India_because_they_produce_nearly_50_of_the_country_s_wheat.",
    ),
    factsheetStates: document.getElementById(
      "States:_Jammu_and_Kashmir_Himachal_Pradesh_Uttarakhand_Punjab_Haryana_Rajasthan_Uttar_Pradesh_Bihar_Jharkhand_West_Bengal_Madhya_Pradesh_Gujarat_Maharashtra",
    ),

    mapContainer: document.getElementById("state-map-clickable"),
    croplabel: document.getElementById("crop-label"),
    panel01buttons: document.getElementById("panel-01-buttons"),
    itextActivity: document.getElementById("i-text-activity"),
    panel02map: document.getElementById("panel-02-map"),
    itextcropmap: document.getElementById("i-text-crop-map"),
    iTextHomeScreen: document.getElementById("i-text-home-screen"),
  };

  // Initialize visibility
  const hideAll = () => {
    Object.values(elements).forEach((el) => {
      if (el) {
        el.style.display = "none";
        el.classList.add("st170");
      }
    });
    // Explicitly hide highlighted crop buttons groups
    ["btn-rabi-selected", "btn-Kharif-selected", "btn-Zaid-selected", "panel-02-map", "state-map-clickable"].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = "none";
            el.classList.add("st170");
        }
    });

    // Remove blocker box Rectangle_63 if it exists
    const blocker = document.getElementById("Rectangle_63");
    if (blocker) {
        blocker.style.display = "none";
        blocker.classList.add("st170");
    }
  };


  const showHome = () => {
    hideAll();
    
    // Show home screen components
    if (elements.homeScreen) {
        elements.homeScreen.style.display = "block";
        elements.homeScreen.classList.remove("st170");
    }
    
    // Reset and show season panels (base version)
    [elements.btnRabi, elements.btnKharif, elements.btnZaid].forEach(panel => {
      if (panel) {
        panel.style.display = "block";
        panel.classList.remove("st170");
        // Reset opacity and display of all children (crops)
        Array.from(panel.children).forEach(child => {
            child.style.opacity = "1";
            child.style.display = "block";
        });
      }
    });

    if (elements.iTextHomeScreen) {
        elements.iTextHomeScreen.style.display = "block";
        elements.iTextHomeScreen.classList.remove("st170");
    }

    // Show Home Season Buttons
    [elements.btnRabiHome, elements.btnKharifHome, elements.btnZaidHome].forEach(btn => {
        if (btn) {
            btn.style.display = "block";
            btn.classList.remove("st170");
        }
    });

    resetMapHighlights();

    // Ensure selected highlight groups are hidden
    ["btn-rabi-selected", "btn-Kharif-selected", "btn-Zaid-selected"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) {
          el.style.display = "none";
          el.classList.add("st170");
        }
      },
    );

    currentState = {
      season: null,
      crop: null,
      selectedStates: new Set(),
      isAnswerRevealed: false,
    };
  };

  // Dynamic State Identification
  const getTargetStateName = (path) => {
    // 1. Try to get name directly from parent group ID or data attribute
    if (path.dataset.state) return path.dataset.state;

    let currentElement = path.parentElement;
    while (currentElement && currentElement.tagName === "g") {
      if (currentElement.id && currentElement.classList.contains("st37")) {
        let name = currentElement.id.replace(/_/g, " ");
        if (name && !name.includes("Group") && name.length > 2) {
          if (name.includes("Jammu and Kashmir")) return "Jammu and Kashmir";
          return name;
        }
      }
      currentElement = currentElement.parentElement;
    }

    // 2. Fallback: Proximity matching with stricter distance and inside map only
    // Using getBBox instead of getBoundingClientRect because getBBox works on hidden elements
    let pRect;
    try {
      pRect = path.getBBox();
    } catch (e) {
      return null;
    }

    const pCenter = {
      x: pRect.x + pRect.width / 2,
      y: pRect.y + pRect.height / 2,
    };

    const labels = Array.from(
      elements.mapContainer.querySelectorAll(
        "g[id].st37 text, text.st29, text.st51, text.st30, text.st46, text.st34",
      ),
    );


    let closest = null;
    let minDist = Infinity;

    labels.forEach((l) => {
      const text = l.textContent.trim();
      if (
        text.length < 3 ||
        /^\d+$/.test(text) ||
        text.includes("Season") ||
        text.includes("Got it") ||
        text.toLowerCase().includes("major") ||
        text.includes("?")
      )
        return;

      let lRect;
      try {
        lRect = l.getBBox();
      } catch (e) {
        return;
      }

      const lCenter = {
        x: lRect.x + lRect.width / 2,
        y: lRect.y + lRect.height / 2,
      };

      // 3. Stricter Hit-Test: Use Intersection first
      const isIntersecting = 
        pRect.x < lRect.x + lRect.width &&
        pRect.x + pRect.width > lRect.x &&
        pRect.y < lRect.y + lRect.height &&
        pRect.y + pRect.height > lRect.y;

      const dist = Math.sqrt(
        Math.pow(pCenter.x - lCenter.x, 2) + Math.pow(pCenter.y - lCenter.y, 2),
      );

      // If intersecting, prioritize this label significantly
      const adjustedDist = isIntersecting ? dist / 5 : dist;

      if (adjustedDist < minDist && adjustedDist < 120) {
        minDist = adjustedDist;
        closest = text;
      }
    });

    return closest;
  };

  const initMapPaths = () => {
    if (!elements.mapContainer) return;
    const paths = elements.mapContainer.querySelectorAll("path");
    paths.forEach((p) => {
      const state = getTargetStateName(p);
      if (state) {
        p.setAttribute("data-state", state);
      }
    });
  };

  const highlightState = (stateName, isCorrect) => {
    const paths = Array.from(
      elements.mapContainer.querySelectorAll(`path[data-state="${stateName}"]`),
    );
    paths.forEach((p) => {
      p.style.fill = isCorrect ? "#44ff64" : "#F44336";
      p.style.opacity = isCorrect ? "1" : "0.7";
      p.classList.remove("st170");
    });
  };

  const resetMapHighlights = () => {
    if (!elements.mapContainer) return;
    const paths = Array.from(elements.mapContainer.querySelectorAll("path"));
    paths.forEach((p) => {
      p.style.fill = "";
      p.style.opacity = "";
    });

    updateSubmitButtonState();
  };

  const updateSubmitButtonState = () => {
    if (elements.submitBtn) {
      if (currentState.selectedStates.size === 0) {
        elements.submitBtn.style.opacity = "0.5";
        elements.submitBtn.style.pointerEvents = "none";
      } else {
        elements.submitBtn.style.opacity = "1";
        elements.submitBtn.style.pointerEvents = "auto";
      }
    }
  };

  const handleStateClick = (e) => {
    const path = e.target.closest("path");
    if (!path || !currentState.crop || currentState.isAnswerRevealed) return;

    const stateName = getTargetStateName(path);
    if (!stateName) return;

    console.log("Clicked state:", stateName);

    const correctStates = CROP_DATA[currentState.crop] || [];
    if (correctStates.includes(stateName)) {
      if (!currentState.selectedStates.has(stateName)) {
        currentState.selectedStates.add(stateName);
        highlightState(stateName, true);
        updateSubmitButtonState();
      }
    } else {
      highlightState(stateName, false);
      if (elements.feedbackIncorrectPopup) {
        elements.feedbackIncorrectPopup.style.display = "block";
        elements.feedbackIncorrectPopup.classList.remove("st170");
      }
    }
  };

  const selectSeason = (season) => {
    console.log("Selecting season:", season);
    currentState = {
        ...currentState,
        season: season,
        crop: null,
        selectedStates: new Set(),
        isAnswerRevealed: false
    };
    hideAll();
    
    let panel = elements[`panel${season}`];
    if (panel) {
      panel.style.display = "block";
      panel.classList.remove("st170");

      // Dim other season buttons and highlight current
      ["Rabi", "Kharif", "Zaid"].forEach(s => {
          const p = elements[`panel${s}`];
          if (p) {
              p.style.display = "block";
              p.classList.remove("st170");
              const isCurrent = s === season;
              Array.from(p.children).forEach(child => {
                  child.style.opacity = isCurrent ? "1" : "0.5";
              });
          }
      });

      if (elements.croplabel) {
        const labelTspan = elements.croplabel.querySelector("tspan");
        if (labelTspan) {
          labelTspan.textContent = `${season} season`;
        }
        elements.croplabel.style.display = "block";
        elements.croplabel.classList.remove("st170");
      }

      elements.panel01buttons.style.display = "block";
      elements.panel01buttons.classList.remove("st170");

      elements.itextActivity.style.display = "block";
      elements.itextActivity.classList.remove("st170");

      // Map components
      elements.panel02map.style.display = "block";
      elements.panel02map.classList.remove("st170");
      elements.mapContainer.style.display = "block";
      elements.mapContainer.classList.remove("st170");

      // Home button / global menu
      elements.globalButtons.style.display = "block";
      elements.globalButtons.classList.remove("st170");
      elements.homeBtn.style.display = "block";
      elements.homeBtn.classList.remove("st170");
    }
  };

  const selectCrop = (crop) => {
    console.log("Selecting crop:", crop);
    currentState = {
        ...currentState,
        crop: crop,
        selectedStates: new Set(),
        isAnswerRevealed: false
    };
    
    resetMapHighlights();
    
    // Ensure map is visible
    if (elements.panel02map) {
        elements.panel02map.style.display = "block";
        elements.panel02map.classList.remove("st170");
    }
    if (elements.mapContainer) {
        elements.mapContainer.style.display = "block";
        elements.mapContainer.classList.remove("st170");
    }
    
    // Check crop-label tspan exists before setting text
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

    // Show only the selected crop's proper SVG group designed by artists
    ["btn-rabi-selected", "btn-Kharif-selected", "btn-Zaid-selected"].forEach(
      (id) => {
        const selectedContainer = document.getElementById(id);
        if (selectedContainer) {
          selectedContainer.style.display = "block";
          selectedContainer.classList.remove("st170"); // ensure wrapper is visible

          Array.from(selectedContainer.children).forEach((childGroup) => {
            let hasMatch = false;
            childGroup.querySelectorAll("tspan").forEach((tspan) => {
              // Trim and match crop name
              if (tspan.textContent.trim() === crop) {
                hasMatch = true;
              }
            });
            childGroup.style.display = hasMatch ? "block" : "none";
          });
        }
      },
    );

    // Dim the unselected base buttons and hide the base version of the selected button
    ["btn-rabi", "btn-Kharif", "btn-Zaid"].forEach((id) => {
      const baseContainer = document.getElementById(id);
      if (baseContainer) {
        Array.from(baseContainer.children).forEach((childGroup) => {
          let hasMatch = false;
          childGroup.querySelectorAll("tspan").forEach((tspan) => {
            if (tspan.textContent.trim() === crop) {
              hasMatch = true;
            }
          });

          if (hasMatch) {
            // Hide the base version because the bright green 'selected' version is showing
            childGroup.style.display = "none";
          } else {
            // Leave the unselected bases visible, but dim them
            childGroup.style.display = "block";
            childGroup.style.opacity = "0.5";
          }
        });
      }
    });

    // Do NOT hideAll(), we want to keep the menu visible.
    // Just hide Activity Text and ensure correct state
    //elements.itextActivity.classList.add("st170");

    if (elements.cropPromptContainer) {
      elements.cropPromptContainer.style.display = "block";
      elements.cropPromptContainer.classList.remove("st170");

      const count = CROP_DATA[crop]?.length || 0;
      const promptTexts =
        elements.cropPromptText?.querySelectorAll("text tspan");
      if (promptTexts && promptTexts.length >= 4) {
        promptTexts[0].textContent = `${crop} selected! `;
        promptTexts[1].textContent = `This crop is majorly grown in ${count} states/UTs `;
      }

      const titleTspan = elements.cropPromptTitle?.querySelector("tspan");
      if (titleTspan) {
        titleTspan.textContent = crop;
        const textNode = titleTspan.closest("text");
        if (textNode) {
          textNode.setAttribute("text-anchor", "middle");
          textNode.setAttribute("transform", `translate(1372.5 397)`);
          titleTspan.setAttribute("x", "0");
        }
      }

      const mapPromptTexts =
        elements.itextcropmap?.querySelectorAll("text tspan");
      if (elements.itextcropmap) {
        // Re-center all text elements in the prompt container manually
        // We set the parent 'text' element to center alignment so tspans don't overlap
        const texts = elements.itextcropmap.querySelectorAll("text");
        texts.forEach((text) => text.setAttribute("text-anchor", "middle"));

        if (mapPromptTexts && mapPromptTexts.length >= 3) {
          mapPromptTexts[0].textContent = `Identify and Tap ${count} major `;
          mapPromptTexts[1].textContent = `${crop.toLowerCase()} `;
        }
      }

      // Update success popup texts
      if (elements.feedbackCorrectText) {
        const successTexts =
          elements.feedbackCorrectText.querySelectorAll("text tspan");
        if (successTexts && successTexts.length >= 4) {
          successTexts[2].textContent = `identified all ${count} major ${crop} `;
        }
      }

      if (elements.factsheetBtnText) {
        const btnText = elements.factsheetBtnText.querySelector("text tspan");
        if (btnText) {
          btnText.textContent = `${crop} Factsheet`;
        }
      }

      const centerSVGText = (tspan, xPosition) => {
        if (!tspan) return;
        const textNode = tspan.closest("text");
        if (textNode) {
          textNode.setAttribute("text-anchor", "middle");
          // Removing the transform and hardcoding the center X avoids the text being misaligned
          // But we want to preserve the Y position from the transform
          const transform = textNode.getAttribute("transform");
          if (transform) {
            const match = transform.match(/translate\(([-\d.]+)\s+([-\d.]+)\)/);
            if (match) {
              textNode.setAttribute(
                "transform",
                `translate(${xPosition} ${match[2]})`,
              );
            }
          }
        }
        tspan.setAttribute("x", "0");
      };

      // Update Factsheet Dialog
      if (elements.factsheetTitle) {
        const span = elements.factsheetTitle.querySelector("tspan");
        if (span) {
          span.textContent = `${crop} Factsheet`;
          centerSVGText(span, 1370);
        }
      }

      const facts = CROP_FACTS[crop];
      if (facts) {
        // Clear old states list and insert new ones
        if (elements.factsheetStates) {
          const tspans = Array.from(
            elements.factsheetStates.querySelectorAll("text tspan"),
          );
          // the first element is usually "States:" title
          if (tspans.length > 0) {
            tspans[0].textContent = "States:";
            centerSVGText(tspans[0], 1106); // Center of States box
            for (let i = 1; i < tspans.length; i++) {
              tspans[i].textContent = CROP_DATA[crop][i - 1] || "";
              centerSVGText(tspans[i], 1106);
            }
          }
        }

        // Climate
        if (elements.factsheetClimate) {
          const tspans = Array.from(
            elements.factsheetClimate.querySelectorAll("text tspan"),
          );
          if (tspans.length >= 4) {
            tspans[1].textContent = facts.climate1;
            centerSVGText(tspans[1], 1534); // Center of Climate box
            tspans[2].textContent = facts.climate2;
            centerSVGText(tspans[2], 1534);
            tspans[3].textContent = facts.climate3;
            centerSVGText(tspans[3], 1534);
          }
        }

        // Soil
        if (elements.factsheetSoil) {
          const tspans = Array.from(
            elements.factsheetSoil.querySelectorAll("text tspan"),
          );
          if (tspans.length >= 3) {
            tspans[1].textContent = facts.soil1;
            centerSVGText(tspans[1], 1534);
            tspans[2].textContent = facts.soil2;
            centerSVGText(tspans[2], 1534);
          }
        }

        // Variety
        if (elements.factsheetVariety) {
          const tspans = Array.from(
            elements.factsheetVariety.querySelectorAll("text tspan"),
          );
          if (tspans.length >= 7) {
            tspans[1].textContent = facts.variety1;
            centerSVGText(tspans[1], 1534);
            tspans[2].textContent = facts.variety2;
            centerSVGText(tspans[2], 1534);
            tspans[3].textContent = facts.variety3;
            centerSVGText(tspans[3], 1534);
            tspans[4].textContent = facts.variety4;
            centerSVGText(tspans[4], 1534);
            tspans[5].textContent = facts.variety5;
            centerSVGText(tspans[5], 1534);
            tspans[6].textContent = facts.variety6;
            centerSVGText(tspans[6], 1534);
          }
        }

        // Fact
        if (elements.factsheetFact) {
          const tspans = Array.from(
            elements.factsheetFact.querySelectorAll("text tspan"),
          );
          if (tspans.length >= 3) {
            tspans[1].textContent = facts.fact1;
            centerSVGText(tspans[1], 1370); // Center of Fact box
            tspans[2].textContent = facts.fact2;
            centerSVGText(tspans[2], 1370);
          }
        }
      }
    }
  };

  // Event Listeners for Season Buttons (Home Screen)
  elements.btnRabiHome?.addEventListener("click", () => selectSeason("Rabi"));
  elements.btnKharifHome?.addEventListener("click", () =>
    selectSeason("Kharif"),
  );
  elements.btnZaidHome?.addEventListener("click", () => selectSeason("Zaid"));

  // Event Listeners for Crop Buttons
  // Rabi
  document
    .getElementById("Group_1570")
    ?.addEventListener("click", () => selectCrop("Wheat"));
  document
    .getElementById("Group_1571")
    ?.addEventListener("click", () => selectCrop("Barley"));
  document
    .getElementById("Group_1572")
    ?.addEventListener("click", () => selectCrop("Mustard"));
  document
    .getElementById("Group_1573")
    ?.addEventListener("click", () => selectCrop("Chickpea"));
  document
    .getElementById("Group_1574")
    ?.addEventListener("click", () => selectCrop("Peas"));

  // Kharif
  document
    .getElementById("Group_Kharif_0")
    ?.addEventListener("click", () => selectCrop("Paddy (Rice)"));
  document
    .getElementById("Group_Kharif_1")
    ?.addEventListener("click", () => selectCrop("Sugarcane"));
  document
    .getElementById("Group_Kharif_2")
    ?.addEventListener("click", () => selectCrop("Cotton"));
  document
    .getElementById("Group_Kharif_3")
    ?.addEventListener("click", () => selectCrop("Jute"));
  document
    .getElementById("Group_Kharif_4")
    ?.addEventListener("click", () => selectCrop("Tea"));
  document
    .getElementById("Group_Kharif_5")
    ?.addEventListener("click", () => selectCrop("Coffee"));
  document
    .getElementById("Group_Kharif_6")
    ?.addEventListener("click", () => selectCrop("Rubber"));

  // Zaid
  document
    .getElementById("Group_Zaid_0")
    ?.addEventListener("click", () => selectCrop("Watermelon"));
  document
    .getElementById("Group_Zaid_1")
    ?.addEventListener("click", () => selectCrop("Muskmelon"));
  document
    .getElementById("Group_Zaid_2")
    ?.addEventListener("click", () => selectCrop("Moong Dal"));
  document
    .getElementById("Group_Zaid_3")
    ?.addEventListener("click", () => selectCrop("Cucumber"));

  // Popup Controls
  elements.gotItBtn?.addEventListener("click", () => {
    if (elements.cropPromptContainer) {
      elements.cropPromptContainer.style.display = "none";
      elements.cropPromptContainer.classList.add("st170");
    }
    if (elements.itextcropmap) {
      elements.itextcropmap.style.display = "block";
      elements.itextcropmap.classList.remove("st170");
    }
    if (elements.globalButtons) {
      elements.globalButtons.style.display = "block";
      elements.globalButtons.classList.remove("st170");
    }
    elements.submitBtn.style.opacity = "0.5";
    elements.submitBtn.style.pointerEvents = "none";
  });

  elements.gotItIncorrectBtn?.addEventListener("click", () => {
    if (elements.feedbackIncorrectPopup) {
      elements.feedbackIncorrectPopup.style.display = "none";
      elements.feedbackIncorrectPopup.classList.add("st170");
    }
  });

  elements.factsheetBtn?.addEventListener("click", () => {
    if (elements.feedbackCorrectPopup) {
      elements.feedbackCorrectPopup.style.display = "none";
      elements.feedbackCorrectPopup.classList.add("st170");
    }
    if (elements.factsheet) {
      elements.factsheet.style.display = "block";
      elements.factsheet.classList.remove("st170");
    }
  });

  elements.tryAnotherCropBtn?.addEventListener("click", () => {
    showHome();
  });

  // Global Buttons
  elements.submitBtn?.addEventListener("click", () => {
    if (currentState.selectedStates.size === 0) return;

    const correctStates = CROP_DATA[currentState.crop] || [];
    if (currentState.selectedStates.size === correctStates.length) {
      if (elements.feedbackCorrectPopup) {
        elements.feedbackCorrectPopup.style.display = "block";
        elements.feedbackCorrectPopup.classList.remove("st170");
      }
    } else {
      alert(
        `Keep searching! You've found ${currentState.selectedStates.size} out of ${correctStates.length} states.`,
      );
    }
  });

  elements.showAnswerBtn?.addEventListener("click", () => {
    const correctStates = CROP_DATA[currentState.crop] || [];
    correctStates.forEach((s) => highlightState(s, true));
    currentState.isAnswerRevealed = true;
    // Success popup removed from automatic show answer
  });

  elements.homeBtn?.addEventListener("click", () => {
    showHome();
  });

  if (elements.mapContainer) {
    elements.mapContainer.addEventListener("click", handleStateClick);
  }

  // Initial call
  initMapPaths();
  showHome();
});
