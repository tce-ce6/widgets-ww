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
    homeCardsContainer: document.getElementById("btn-home-screen"),
    itextHomeScreen: document.getElementById("i-text-home-screen"),
    btnRabiHome: document.getElementById("Group_1591"),
    btnKharifHome: document.getElementById("Group_1590"),
    btnZaidHome: document.getElementById("Group_1589"),
    backHomeBtn: document.getElementById("Group_1592"),
    kharifBtn: document.getElementById("btn-Kharif"),
    rabiBtn: document.getElementById("btn-rabi"),
    zaidBtn: document.getElementById("btn-Zaid"),
    panel01buttons: document.getElementById("panel-01-buttons"),
    itextActivity: document.getElementById("i-text-activity"),
    panel02map: document.getElementById("panel-02-map"),
    mapContainer: document.getElementById("state-map-clickable"),
    cropPromptContainer: document.getElementById("crop-selection-popup"),
    cropPromptTitle: document.getElementById("crop-prompt-title"),
    cropPromptText: document.getElementById("crop-prompt-text"),
    itextcropmap: document.getElementById("i-text-crop-map"),
    globalButtons: document.getElementById("btn-global"),
    submitBtn: document.getElementById("Submit"),
    showAnswerBtn: document.getElementById("Show_Answer"),
    feedbackCorrectPopup: document.getElementById("feedback-correct-popup"),
    feedbackIncorrectPopup: document.getElementById("feedback-incorrect-state"),
    factsheet: document.getElementById("popup-factsheet"),
    factsheetTitle: document.getElementById("factsheet-title"),
    factsheetBtnText: document.getElementById("factsheet-btn-text"),
    factsheetStates: document.getElementById("factsheet-states"),
    factsheetClimate: document.getElementById("factsheet-climate"),
    factsheetSoil: document.getElementById("factsheet-soil"),
    factsheetVariety: document.getElementById("factsheet-variety"),
    factsheetFact: document.getElementById("factsheet-fact"),
    croplabel: document.getElementById("crop-label"),
    cropInstructionText: document.getElementById("crop-instruction-text"),
    feedbackIncorrectText: document.getElementById("feedback-incorrect-text"),
    feedbackCorrectText: document.getElementById("feedback-correct-text"),
    gotItBtn: document.getElementById("got-it-btn"),
    gotItIncorrectBtn: document.getElementById("got-it-incorrect-btn"),
  };

  const hideAll = () => {
    Object.values(elements).forEach((el) => {
      if (el && el.style) el.style.display = "none";
    });
    if (elements.mapContainer) elements.mapContainer.style.display = "none";

    // Specifically hide state label groups (class st37 that are siblings of map groups)
    // We target IDs that are state names
    // const stateLabelGroups = document.querySelectorAll('.st37[id]');
    // stateLabelGroups.forEach(g => {
    //   // Seasonal buttons also use st37, so we check if it's a state label group
    //   // State label groups usually contain text elements
    //   if (g.querySelector('text')) {
    //     g.style.display = "none";
    //   }
    // });
  };
  // const getTargetStateName = (path) => {
  //   // 1. Try to get name directly from parent group ID or data attribute
  //   if (path.dataset.state) return path.dataset.state;

  //   let currentElement = path.parentElement;
  //   while (currentElement && currentElement.tagName === "g") {
  //     if (currentElement.id && currentElement.classList.contains("st37")) {
  //       let name = currentElement.id.replace(/_/g, " ");
  //       if (name && !name.includes("Group") && name.length > 2) {
  //         if (name.includes("Jammu and Kashmir")) return "Jammu and Kashmir";
  //         return name;
  //       }
  //     }
  //     currentElement = currentElement.parentElement;
  //   }

  //   // 2. Try to find a text label close to this path
  //   const pathRect = path.getBBox();
  //   const pathCenter = {
  //     x: pathRect.x + pathRect.width / 2,
  //     y: pathRect.y + pathRect.height / 2,
  //   };

  //   let closestLabel = null;
  //   let minDistance = Infinity;

  //   // Search in the ownerSVG instead of just mapContainer, as labels are siblings
  //   const labels = Array.from(path.ownerSVGElement.querySelectorAll("text tspan, text"));


  //   let closest = null;
  //   let minDist = Infinity;

  //   labels.forEach((l) => {
  //     const text = l.textContent.trim();
  //     if (
  //       text.length < 3 ||
  //       /^\d+$/.test(text) ||
  //       text.includes("Season") ||
  //       text.includes("Got it") ||
  //       text.toLowerCase().includes("major") ||
  //       text.includes("?")
  //     )
  //       return;

  //     let lRect;
  //     try {
  //       lRect = l.getBBox();
  //     } catch (e) {
  //       return;
  //     }

  //     const lCenter = {
  //       x: lRect.x + lRect.width / 2,
  //       y: lRect.y + lRect.height / 2,
  //     };

  //     // 3. Stricter Hit-Test: Use Intersection first
  //     const isIntersecting =
  //       pathRect.x < lRect.x + lRect.width &&
  //       pathRect.x + pathRect.width > lRect.x &&
  //       pathRect.y < lRect.y + lRect.height &&
  //       pathRect.y + pathRect.height > lRect.y;

  //     const dist = Math.sqrt(
  //       Math.pow(pathCenter.x - lCenter.x, 2) + Math.pow(pathCenter.y - lCenter.y, 2),
  //     );

  //     // If intersecting, prioritize this label significantly
  //     const adjustedDist = isIntersecting ? dist / 5 : dist;

  //     if (adjustedDist < minDist && adjustedDist < 120) {
  //       minDist = adjustedDist;
  //       closest = text;
  //     }
  //   });

  //   return closest;
  // }



  // const getTargetStateName = (path) => {
  //   if (!path) return null;

  //   // 1. Already has data-state (from previous run)
  //   if (path.dataset.state) {
  //     return path.dataset.state.trim();
  //   }

  //   // 2. Walk up the parent groups - look for st37 groups with meaningful IDs
  //   let current = path;
  //   let depth = 0;

  //   while (current && current.tagName === "g" && depth < 15) {   // prevent infinite loop
  //     if (current.id && current.classList.contains("st37")) {
  //       let name = current.id
  //         .replace(/_/g, " ")
  //         .replace(/\s+/g, " ")
  //         .trim();

  //       // Clean known state names
  //       if (name.includes("Jammu")) return "Jammu and Kashmir";
  //       if (name.includes("Himachal")) return "Himachal Pradesh";
  //       if (name.includes("Uttarakhand")) return "Uttarakhand";
  //       if (name.includes("Punjab")) return "Punjab";
  //       if (name.includes("Haryana")) return "Haryana";
  //       if (name.includes("Rajasthan")) return "Rajasthan";
  //       if (name.includes("Uttar Pradesh")) return "Uttar Pradesh";
  //       if (name.includes("Bihar")) return "Bihar";
  //       if (name.includes("Jharkhand")) return "Jharkhand";
  //       if (name.includes("West Bengal")) return "West Bengal";
  //       if (name.includes("Madhya Pradesh")) return "Madhya Pradesh";
  //       if (name.includes("Gujarat")) return "Gujarat";
  //       if (name.includes("Maharashtra")) return "Maharashtra";

  //       // Generic fallback for other states
  //       if (name.length > 4 && !name.includes("Group") && !name.includes("Season")) {
  //         return name;
  //       }
  //     }
  //     current = current.parentElement;
  //     depth++;
  //   }

  //   // 3. Last resort: Search nearby text labels (less reliable but helpful)
  //   try {
  //     const bbox = path.getBBox();
  //     const centerX = bbox.x + bbox.width / 2;
  //     const centerY = bbox.y + bbox.height / 2;

  //     const allTexts = path.ownerSVGElement.querySelectorAll("text tspan, text");

  //     let bestText = null;
  //     let minDistance = Infinity;

  //     for (const t of allTexts) {
  //       const txt = t.textContent.trim();
  //       if (txt.length < 5 ||
  //         txt.includes("Season") ||
  //         txt.includes("Got it") ||
  //         txt.includes("Factsheet") ||
  //         /^\d+$/.test(txt)) continue;

  //       try {
  //         const tbox = t.getBBox();
  //         const dist = Math.hypot(centerX - (tbox.x + tbox.width / 2),
  //           centerY - (tbox.y + tbox.height / 2));

  //         if (dist < minDistance && dist < 180) {
  //           minDistance = dist;
  //           bestText = txt;
  //         }
  //       } catch (e) { }
  //     }

  //     if (bestText) return bestText;
  //   } catch (e) { }

  //   return null;
  // };




  const getTargetStateName1 = (path) => {
    // 1. Try to get name directly from parent group ID
    let currentElement = path.parentElement;
    while (currentElement && currentElement.tagName === "g") {
      if (currentElement.id && currentElement.classList.contains("st37")) {
        let name = currentElement.id.replace(/_/g, " ");
        if (name && !name.includes("Group") && name.length > 2) {
          // Special cases handling
          if (name.includes("Jammu and Kashmir")) return "Jammu and Kashmir";
          return name;
        }
      }
      currentElement = currentElement.parentElement;
    }

    // 2. Fallback: Proximity matching with stricter distance and inside map only
    const pRect = path.getBoundingClientRect();
    const pCenter = {
      x: pRect.left + pRect.width / 2,
      y: pRect.top + pRect.height / 2,
    };

    const labels = Array.from(
      elements.mapContainer.querySelectorAll(
        "g[id].st37 text, text.st29, text.st51, text.st30, text.st46, text.st40",
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

      const lRect = l.getBoundingClientRect();
      const lCenter = {
        x: lRect.left + lRect.width / 2,
        y: lRect.top + lRect.height / 2,
      };

      const dist = Math.sqrt(
        Math.pow(pCenter.x - lCenter.x, 2) + Math.pow(pCenter.y - lCenter.y, 2),
      );

      // Only match if it's reasonably close (e.g. less than 150px away)
      if (dist < minDist && dist < 150) {
        minDist = dist;
        closest = text;
      }
    });

    return closest;
  };

  const getTargetStateName = (path) => {
    // 1. Try to get name directly from parent group ID
    let currentElement = path.parentElement;
    while (currentElement && currentElement.tagName === "g") {
      // Check if the ID exists and isn't one of the seasonal/UI groups
      if (currentElement.id &&
        !currentElement.id.includes("Group") &&
        !currentElement.id.includes("Season") &&
        !currentElement.id.includes("btn")) {

        // Clean the ID: remove numbers and underscores (e.g., "Rajasthan_1_" -> "Rajasthan")
        let name = currentElement.id
          .replace(/_\d+_/g, "") // Remove trailing numbers like _1_
          .replace(/_/g, " ")    // Replace remaining underscores with spaces
          .trim();

        if (name.length > 2) {
          // Handle special case for J&K if necessary
          if (name.includes("Jammu")) return "Jammu and Kashmir";
          return name;
        }
      }
      currentElement = currentElement.parentElement;
    }

    // 2. Fallback: Check if the path itself has the data-state attribute already
    if (path.dataset && path.dataset.state) {
      return path.dataset.state;
    }

    return null;
  };

  // const initMapPaths = () => {
  //   if (!elements.mapContainer) return;
  //   const paths = elements.mapContainer.querySelectorAll("path");
  //   paths.forEach((p) => {
  //     const state = getTargetStateName(p);
  //     if (state) {
  //       p.setAttribute("data-state", state);
  //     }
  //   });
  // };


  const initMapPaths = () => {
    if (!elements.mapContainer) {
      console.warn("mapContainer not found");
      return;
    }

    const paths = elements.mapContainer.querySelectorAll("path");
    let count = 0;

    paths.forEach((path, index) => {
      const stateName = getTargetStateName(path);

      if (stateName) {
        path.setAttribute("data-state", stateName);
        path.style.cursor = "pointer";
        count++;
      }
    });

    console.log(`✅ initMapPaths completed - ${count} state paths initialized`);

    // Debug: Show how many paths have data-state now
    console.log("Paths with data-state:", document.querySelectorAll("path[data-state]").length);
  };

  const showHome = () => {
    hideAll();
    currentState = { season: null, crop: null, selectedStates: new Set(), isAnswerRevealed: false };

    // Show home screen components
    [elements.homeCardsContainer, elements.itextHomeScreen, elements.btnRabiHome, elements.btnKharifHome, elements.btnZaidHome].forEach(el => {
      if (el) {
        el.style.display = "block";
        el.classList.remove("st170");
        el.style.opacity = "1";
      }
    });

    // Hide global buttons on home screen
    if (elements.globalButtons) {
      elements.globalButtons.style.display = "none";
      elements.globalButtons.classList.add("st170");
    }
  };

  const selectSeason = (season) => {
    currentState.season = season;
    hideAll();

    // Show map interaction panels
    if (elements.panel01buttons) {
      elements.panel01buttons.style.display = "block";
      elements.panel01buttons.classList.remove("st170");
    }

    // Show the specific seasonal crop list
    const cropList = elements[`${season.toLowerCase()}Btn`];
    if (cropList) {
      cropList.style.display = "block";
      cropList.classList.remove("st170");
      cropList.style.opacity = "1";
      Array.from(cropList.children).forEach(child => {
        child.style.display = "block";
        child.style.opacity = "1";
      });
    }

    // Show itextActivity with default text
    if (elements.itextActivity) {
      elements.itextActivity.style.display = "block";
      elements.itextActivity.classList.remove("st170");
      const tspans = elements.itextActivity.querySelectorAll("text tspan");
      if (tspans.length > 0) {
        tspans[0].textContent = "Select by tapping a crop from the list.";
        centerSVGText(tspans[0], 500);
      }
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
      elements.croplabel.style.display = "block";
      elements.croplabel.classList.remove("st170");
    }

    // Show global buttons (contains the Home icon)
    // if (elements.globalButtons) {
    //   elements.globalButtons.style.display = "block";
    //   elements.globalButtons.classList.remove("st170");
    //   elements.submitBtn.style.display = "none";
    //   elements.showAnswerBtn.style.display = "none";
    // }
  };
  const highlightState = (stateName, isCorrect) => {
    if (!elements.mapContainer) return;
    const paths = Array.from(elements.mapContainer.querySelectorAll("path"));
    paths.forEach(p => {
      if (p.getAttribute("data-state") === stateName) {
        if (isCorrect === true) {
          p.classList.add("correct-highlight");
          p.classList.remove("selected-highlight", "incorrect-highlight");
        } else if (isCorrect === false) {
          p.classList.add("incorrect-highlight");
          p.classList.remove("selected-highlight", "correct-highlight");
        } else {
          p.classList.add("selected-highlight");
          p.classList.remove("correct-highlight", "incorrect-highlight");
        }
      }
    });
  };

  const resetMapHighlights = () => {
    if (!elements.mapContainer) return;
    const paths = Array.from(elements.mapContainer.querySelectorAll("path"));
    paths.forEach((p) => {
      p.style.fill = "";
      p.style.opacity = "";
      p.classList.remove("selected-highlight", "correct-highlight", "incorrect-highlight");
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
  const selectCrop = (crop) => {
    console.log(crop)
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
    if (elements.gotItBtn) {
      elements.gotItBtn.style.display = "block"
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
      elements.croplabel.style.display = "block";
      elements.croplabel.classList.remove("st170");
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
          const tspan = Array.from(child.querySelectorAll("tspan"))
            .find(t => t.textContent.trim() === crop);
          if (tspan) {
            child.style.display = "none"; // hide base version of selected crop
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

        centerSVGText(promptTexts[0], 1370);
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

    // Right side instruction
    if (elements.cropInstructionText) {
      const tspans = elements.cropInstructionText.querySelectorAll("tspan");
      if (tspans.length >= 3) {
        const count = CROP_DATA[crop]?.length || 0;
        tspans[0].textContent = `Identify and Tap ${count} major `;
        tspans[1].textContent = `${crop} `;
        tspans[2].textContent = "cultivating states/Union Territory.";
        // Note: The original hardcoded version had a specific structure. 
        // We keep it but make it dynamic.
      }
    }

    // Incorrect feedback text
    if (elements.feedbackIncorrectText) {
      const tspans = elements.feedbackIncorrectText.querySelectorAll("tspan");
      if (tspans.length >= 3) {
        tspans[1].textContent = `This is not a ${crop} `;
      }
    }

    // Correct feedback text
    if (elements.feedbackCorrectText) {
      const tspan = elements.feedbackCorrectText.querySelector("tspan.st39");
      const tspans = elements.feedbackCorrectText.querySelectorAll("tspan");
      if (tspans.length >= 4) {
        const count = CROP_DATA[crop]?.length || 0;
        tspans[2].textContent = `identified all ${count} major ${crop} `;
      }
    }

    updateFactsheet(crop);

    if (elements.showAnswerBtn) {
      elements.showAnswerBtn.style.display = "block";
      elements.showAnswerBtn.classList.remove("st170");
      const tspan = elements.showAnswerBtn.querySelector("tspan");
      if (tspan) tspan.textContent = "Show Answer";
    }

    if (elements.submitBtn) {
      elements.submitBtn.style.display = "block";
      elements.submitBtn.style.opacity = "0.5";
      elements.submitBtn.style.pointerEvents = "none";
    }

    // Show state labels
    const stateLabelGroups = document.querySelectorAll('.st37[id]');
    stateLabelGroups.forEach(g => {
      if (g.querySelector('text') && !['Rabi_Season', 'Kharif_Season', 'Zaid_Season'].includes(g.id)) {
        g.style.display = "block";
        g.style.opacity = "1";
      }
    });
  };

  // Global navigation
  elements.backHomeBtn?.addEventListener("click", showHome);
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
  // Common Action Buttons
  document.getElementById("Group_1614")?.addEventListener("click", () => {
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
  document.getElementById("Group_16141")?.addEventListener("click", () => {
    if (elements.feedbackIncorrectPopup) {
      elements.feedbackIncorrectPopup.style.display = "none";
      elements.feedbackIncorrectPopup.classList.add("st170");
    }
  });

  // Factsheet button
  document.getElementById("Group_1616")?.addEventListener("click", () => {
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
  document.getElementById("Group_16161")?.addEventListener("click", showHome);

  // Submit button
  elements.submitBtn?.addEventListener("click", () => {
    if (currentState.selectedStates.size === 0) return;

    const correct = CROP_DATA[currentState.crop] || [];
    const isPerfect = currentState.selectedStates.size === correct.length &&
      [...currentState.selectedStates].every(s => correct.includes(s));

    if (isPerfect) {
      if (elements.feedbackCorrectPopup) {
        elements.feedbackCorrectPopup.style.display = "block";
        elements.feedbackCorrectPopup.classList.remove("st170");
      }
      elements.submitBtn.style.opacity = "0.5";
      elements.submitBtn.style.pointerEvents = "none";
    } else {
      const selectedArr = [...currentState.selectedStates];
      const allCorrect = selectedArr.every(s => correct.includes(s));

      if (allCorrect && selectedArr.length < correct.length) {
        alert(`Keep searching! You've found ${selectedArr.length} out of ${correct.length} major ${currentState.crop} states.`);
      } else {
        if (elements.feedbackIncorrectPopup) {
          elements.feedbackIncorrectPopup.style.display = "block";
          elements.feedbackIncorrectPopup.classList.remove("st170");
        }
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

  // Got it buttons
  [elements.gotItBtn, elements.gotItIncorrectBtn].forEach(btn => {
    btn?.addEventListener("click", () => {
      if (elements.cropPromptContainer) {
        elements.cropPromptContainer.style.display = "none";
        elements.cropPromptContainer.classList.add("st170");
      }
      if (elements.feedbackIncorrectPopup) {
        elements.feedbackIncorrectPopup.style.display = "none";
        elements.feedbackIncorrectPopup.classList.add("st170");
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



  const updateFactsheet = (crop) => {
    console.log("Updating factsheet for:", crop);
    const facts = CROP_FACTS[crop];
    if (!facts) {
      console.warn("No facts found for crop:", crop);
      return;
    }

    if (elements.factsheetTitle) {
      const tspan = elements.factsheetTitle.querySelector("tspan");
      if (tspan) {
        tspan.textContent = `${crop} Factsheet`;
        centerSVGText(tspan, 1370);
      }
    }

    if (elements.factsheetBtnText) {
      const tspan = elements.factsheetBtnText.querySelector("tspan");
      if (tspan) {
        tspan.textContent = `${crop} Factsheet`;
        centerSVGText(tspan, 1372.5);
      }
    }

    if (elements.factsheetStates) {
      const textElements = elements.factsheetStates.querySelectorAll("text");
      const states = CROP_DATA[crop] || [];
      textElements.forEach((txt, i) => {
        const t = txt.querySelector("tspan");
        if (i === 0) {
          if (t) t.textContent = "States:";
        } else if (states[i - 1]) {
          txt.style.display = "block";
          if (t) t.textContent = states[i - 1];
        } else {
          txt.style.display = "none";
        }
      });
    }

    if (elements.factsheetClimate) {
      const tspans = elements.factsheetClimate.querySelectorAll("text tspan");
      if (tspans.length >= 4) {
        tspans[1].textContent = facts.climate1;
        tspans[2].textContent = facts.climate2;
        tspans[3].textContent = facts.climate3;
      }
    }

    if (elements.factsheetSoil) {
      const tspans = elements.factsheetSoil.querySelectorAll("text tspan");
      if (tspans.length >= 3) {
        tspans[1].textContent = facts.soil1;
        tspans[2].textContent = facts.soil2;
      }
    }

    if (elements.factsheetVariety) {
      const tspans = elements.factsheetVariety.querySelectorAll("text tspan");
      for (let i = 1; i <= 6; i++) {
        if (tspans[i]) {
          tspans[i].textContent = facts[`variety${i}`] || "";
        }
      }
    }

    if (elements.factsheetFact) {
      const tspans = elements.factsheetFact.querySelectorAll("text tspan");
      if (tspans.length >= 3) {
        tspans[1].textContent = facts.fact1;
        tspans[2].textContent = facts.fact2;
      }
    }
  };

  // Initial setup
  initMapPaths();
  showHome();
});
