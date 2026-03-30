document.addEventListener("DOMContentLoaded", () => {
const CROP_DATA = {
  // Rabi Season Crops
  Mustard: [
    "Rajasthan",
    "Haryana",
    "Gujarat",
    "Madhya Pradesh",
    "Uttar Pradesh",
    "West Bengal",
    "Assam"
  ],
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
    "Maharashtra"
  ],
  Barley: [
    "Uttar Pradesh",
    "Rajasthan",
    "Madhya Pradesh",
    "Bihar",
    "Punjab",
    "Haryana",
    "Himachal Pradesh",
    "Jammu and Kashmir"
  ],
  Chickpea: [
    "Maharashtra",
    "Madhya Pradesh",
    "Rajasthan",
    "Uttar Pradesh",
    "Karnataka",
    "Gujarat"
  ],
  Peas: [
    "Madhya Pradesh",
    "Uttar Pradesh",
    "Punjab",
    "Jharkhand",
    "Himachal Pradesh",
    "West Bengal",
    "Chhattisgarh",
    "Haryana",
    "Bihar",
    "Uttarakhand"
  ],

  // Kharif Season Crops
  "Paddy (Rice)": [
    "Assam",
    "Odisha",
    "Andhra Pradesh",
    "Telangana",
    "Tamil Nadu",
    "Gujarat",
    "Maharashtra",
    "Karnataka",
    "Goa",
    "Kerala",
    "Chhattisgarh",
    "Madhya Pradesh",
    "Punjab",
    "Haryana"
  ],
  Sugarcane: [
    "Punjab",
    "Haryana",
    "Uttarakhand",
    "Uttar Pradesh",
    "Bihar",
    "Maharashtra",
    "Karnataka",
    "Tamil Nadu",
    "Telangana",
    "Andhra Pradesh"
  ],
  Cotton: [
    "Gujarat",
    "Maharashtra",
    "Telangana",
    "Rajasthan",
    "Madhya Pradesh",
    "Andhra Pradesh",
    "Karnataka",
    "Tamil Nadu",
    "Haryana",
    "Punjab"
  ],
  Jute: [
    "West Bengal",
    "Bihar",
    "Assam",
    "Meghalaya",
    "Odisha",
    "Andhra Pradesh"
  ],
  Tea: [
    "West Bengal",
    "Assam",
    "Tamil Nadu",
    "Kerala",
    "Sikkim",
    "Tripura",
    "Arunachal Pradesh"
  ],
  Coffee: [
    "Karnataka",
    "Kerala",
    "Tamil Nadu",
    "Andhra Pradesh",
    "Odisha"
  ],
  Rubber: [
    "Kerala",
    "Tamil Nadu",
    "Karnataka",
    "Goa",
    "Andhra Pradesh",
    "Odisha",
    "Sikkim",
    "Assam",
    "Arunachal Pradesh",
    "Nagaland",
    "Manipur",
    "Mizoram",
    "Tripura",
    "Meghalaya",
    "West Bengal",
    "Maharashtra",
    "The Andaman and Nicobar Islands"
  ],

  // Zaid Season Crops
  Watermelon: [
    "Uttar Pradesh",
    "Andhra Pradesh",
    "Karnataka",
    "West Bengal",
    "Tamil Nadu",
    "Odisha"
  ],
  Muskmelon: [
    "Uttar Pradesh",
    "Punjab",
    "Rajasthan",
    "Tamil Nadu",
    "Andhra Pradesh",
    "Maharashtra"
  ],
  "Moong Dal": [
    "Rajasthan",
    "Maharashtra",
    "Andhra Pradesh",
    "Karnataka",
    "Odisha",
    "Tamil Nadu"
  ],
  Cucumber: [
    "Uttar Pradesh",
    "Haryana",
    "Madhya Pradesh",
    "Karnataka",
    "Andhra Pradesh",
    "Tamil Nadu",
    "West Bengal",
    "Punjab"
  ]
};

  const CROP_FACTS = {
  // Rabi Season
  Mustard: {
    climate1: "Cool and dry climate.",
    climate2: "Temperature: 10-25°C.",
    climate3: "Sensitive to frost during flowering.",
    soil1: "Light loamy soil with good drainage.",
    variety1: "• Pusa Bold",
    variety2: "• Varuna",
    variety3: "• Kranti",
    variety4: "• RH-30",
    variety5: "• Pusa Mahak",
    variety6: "• Bio-902",
    fact1: "Sarson da Saag is a traditional, nutrient-dense Punjabi dish made from fresh mustard greens (sarson) and other leafy greens,",
    fact2: "typically enjoyed in the winter season."
  },
  Wheat: {
    climate1: "Cool and moist weather during growing period,",
    climate2: "warm and dry during ripening.",
    climate3: "Temperature: 10-25°C",
    soil1: "Well-drained loamy soil with good organic content.",
    variety1: "• HD-2967",
    variety2: "• PBW-343",
    variety3: "• Lok-1",
    variety4: "• GW-322",
    variety5: "• Sharbati",
    variety6: "• Kalyan Sona",
    fact1: "Punjab and Haryana are called the 'Breadbasket of India' because they",
    fact2: "produce nearly 50% of the country's wheat."
  },
  Barley: {
    climate1: "Cool dry climate.",
    climate2: "Can tolerate frost better than wheat.",
    climate3: "Temperature: 12-25°C",
    soil1: "Well-drained sandy loam to loamy soil.",
    soil2: "Can tolerate saline and alkaline conditions.",
    variety1: "• Jyoti",
    variety2: "• Ratna",
    variety3: "• Vijaya",
    variety4: "• Dolma",
    variety5: "• BH-393",
    variety6: "• RD-2503",
    fact1: "Barley was one of the first grains cultivated in the Indus Valley Civilization",
    fact2: "around 3000 BCE."
  },
  Chickpea: {
    climate1: "Cool dry climate with 20-25°C during growth.",
    climate2: "Rainfall: 60-90 cm annually",
    climate3: "",
    soil1: "Well-drained sandy loam to clay loam.",
    soil2: "Cannot tolerate waterlogging",
    variety1: "• Pusa-256",
    variety2: "• JG-11",
    variety3: "• Vijay",
    variety4: "• JAKI-9218",
    variety5: "• KAK-2",
    variety6: "• Vishal",
    fact1: "Chickpeas are the main ingredient in beloved dishes like chole bhatura, hummus, and falafel.",
    fact2: "Chickpea flour (besan) is used to make popular Indian snacks like pakoras, dhokla, and sev."
  },
  Peas: {
    climate1: "Cool and humid climate.",
    climate2: "Temperature: 10-18°C.",
    climate3: "Cannot tolerate frost during flowering.",
    soil1: "Well-drained loamy soil rich in organic matter.",
    variety1: "• Arkel",
    variety2: "• Bonneville",
    variety3: "• Azad Pea-1",
    variety4: "• Pusa Pragati",
    variety5: "• Lincoln",
    variety6: "• Jawahar Matar",
    fact1: "Matar paneer and aloo matar are among India's most popular vegetarian dishes,",
    fact2: "making green peas a staple in North Indian cuisine. Peas were one of the first vegetables to be canned and frozen commercially."
  },

  // Kharif Season
  "Paddy (Rice)": {
    climate1: "Hot and humid climate.",
    climate2: "Temperature: 20-35°C.",
    climate3: "Requires high rainfall (150-200 cm) or irrigation.",
    soil1: "Clay or clay loam soil that can retain water.",
    soil2: "Slightly acidic soil preferred.",
    variety1: "• Basmati",
    variety2: "• Sona Masuri",
    variety3: "• Ponni",
    variety4: "• IR-64",
    variety5: "• Swarna",
    variety6: "• Pusa-1121",
    variety7: "• Gobindobhog",   // extra if needed, or adjust UI
    fact1: "India has over 6,000 varieties of rice!",
    fact2: "West Bengal's Gobindobhog rice was traditionally offered to Lord Krishna at temples."
  },
  Sugarcane: {
    climate1: "Hot and humid climate.",
    climate2: "Temperature: 25-35°C.",
    climate3: "Usually flowers in 10-15 months.",
    soil1: "Deep rich loamy soil.",
    soil2: "Well-drained but moisture retentive.",
    variety1: "• Co-86032",
    variety2: "• CoC-671",
    variety3: "• Co-0238",
    variety4: "• CoS-767",
    variety5: "• Co-91010",
    variety6: "• CoJ-64",
    fact1: "Gur (jaggery) made from sugarcane has been used in India for over 3,000 years.",
    fact2: "India is the second-largest sugar producer after Brazil."
  },
  Cotton: {
    climate1: "Warm climate with temperature 21-30°C.",
    climate2: "Requires 50-100 cm rainfall.",
    climate3: "Clear sunny days during boll formation.",
    soil1: "Black cotton soil (regur) is ideal.",
    soil2: "Deep, well-drained soil.",
    variety1: "• Suvin",
    variety2: "• MCU-5",
    variety3: "• Shankar-6",
    variety4: "• Bunny",
    variety5: "• DCH-32",
    variety6: "• Bt Cotton",
    fact1: "India is the largest producer of cotton in the world!",
    fact2: "Gujarat alone contributes to about 35% of India's cotton production."
  },
  Jute: {
    climate1: "Hot and humid climate with temperature 24-37°C.",
    climate2: "Requires high rainfall of 150-200 cm or adequate irrigation.",
    climate3: "High humidity (70-90%) during growth is essential.",
    soil1: "Alluvial or loamy soil enriched with annual floods.",
    soil2: "Well-drained sandy loam near river banks.",
    variety1: "• JRO-524 (Navin)",
    variety2: "• JRO-8432 (Shakti)",
    variety3: "• JRO-128 (Naveen)",
    variety4: "• S-19",
    variety5: "• JRC-212",
    variety6: "• JRC-321 (Sonali)",
    variety7: "• Padma",
    fact1: "Jute is called the \"Golden Fibre\" because of its shiny golden colour and high cash value.",
    fact2: "Hooghly river belt is known as the \"Jute Belt of India.\""
  },
  Tea: {
    climate1: "Warm and humid climate with temperature 20-30°C.",
    climate2: "Requires heavy and well-distributed rainfall of 150-300 cm annually.",
    climate3: "High humidity and frequent showers are ideal.",
    soil1: "The soil must be very fertile.",
    soil2: "Sandy loams rich in nitrogen and iron are best suited for tea bushes.",
    variety1: "• Assam Tea",
    variety2: "• Darjeeling Tea",
    variety3: "• Nilgiri Tea",
    variety4: "• Kangra Tea",
    variety5: "• Munnar Tea",
    fact1: "Assam tea is the world's largest single tea-growing region.",
    fact2: "Darjeeling tea is often called the \"Champagne of Teas\" with a protected Geographical Indication (GI) tag."
  },
  Coffee: {
    climate1: "Warm and moist climate with temperature 15-28°C.",
    climate2: "Requires moderate rainfall of 150-200 cm, well-distributed throughout the year.",
    climate3: "Cannot tolerate frost or extreme heat.",
    soil1: "Rich, well-drained forest loamy soil with high organic matter.",
    soil2: "Volcanic laterite soil of Western Ghats is ideal.",
    variety1: "• Arabica",
    variety2: "• Robusta",
    variety3: "• Chandragiri",
    variety4: "• Peaberry",
    fact1: "Baba Budan Hills in Karnataka are where coffee cultivation in India began!",
    fact2: "Legend says a 17th-century Sufi saint named Baba Budan smuggled seven coffee beans from Yemen in his beard and planted them in these hills."
  },
  Rubber: {
    climate1: "Hot and humid climate with temperature 20-35°C.",
    climate2: "Requires heavy and well-distributed rainfall of 200-300 cm annually.",
    climate3: "High humidity (80% or above) throughout the year is essential.",
    soil1: "Deep, well-drained laterite soil rich in iron and aluminium.",
    soil2: "Red laterite and alluvial soils of coastal plains work well.",
    variety1: "• RRII 105",
    variety2: "• RRII 414",
    variety3: "• RRII 430",
    variety4: "• RRII 208",
    variety5: "• Tjir 1",
    variety6: "• GT 1",
    variety7: "• PB 235",
    variety8: "• PB 260",
    fact1: "Kerala is called the \"Land of Rubber\".",
    fact2: "It takes about 7 years for a rubber tree to mature before it can be tapped for latex, and a single tree can produce latex for up to 30 years!"
  },

  // Zaid Season
  Watermelon: {
    climate1: "Hot and dry climate.",
    climate2: "Temperature: 25-35°C.",
    climate3: "Long sunny days required.",
    soil1: "Sandy loam soil with good drainage.",
    variety1: "• Sugar Baby",
    variety2: "• Asahi Yamato",
    variety3: "• Durgapura Meetha",
    variety4: "• Arka Jyoti",
    variety5: "• Arka Manik",
    variety6: "• Pusa Bedana",
    fact1: "Watermelon is 92% water!",
    fact2: "The riverbed cultivation of watermelon along Yamuna and Ganga is a unique practice in North India."
  },
  Muskmelon: {
    climate1: "Hot and dry climate.",
    climate2: "Temperature: 24-30°C.",
    climate3: "Low humidity preferred.",
    soil1: "Well-drained sandy loam soil.",
    variety1: "• Pusa Sharbati",
    variety2: "• Hara Madhu",
    variety3: "• Punjab Sunehri",
    variety4: "• Arka Rajhans",
    variety5: "• Arka Jeet",
    variety6: "• Durgapura Madhu",
    fact1: "Muskmelons get their name from their musky aroma!",
    fact2: "Lucknow is famous for its aromatic \"Mitha\" muskmelons."
  },
  "Moong Dal": {
    climate1: "Warm climate with temperature 25-35°C.",
    climate2: "Can tolerate drought.",
    climate3: "Short duration crop (60-75 days).",
    soil1: "Well-drained loamy to sandy loam soil.",
    soil2: "Cannot tolerate waterlogging.",
    variety1: "• Pusa Vishal",
    variety2: "• SML-668",
    variety3: "• IPM-02-3",
    variety4: "• Pusa Ratna",
    variety5: "• Samrat",
    variety6: "• Virat",
    fact1: "Moong dal sprouts can increase their vitamin C content by 600%.",
    fact2: "It's known as the \"Queen of Pulses\" due to its easy digestibility."
  },
  Cucumber: {
    climate1: "Warm and humid climate.",
    climate2: "Temperature: 20-30°C.",
    climate3: "Frost sensitive.",
    soil1: "Rich loamy soil with good organic content.",
    variety1: "• Pusa Sanyog",
    variety2: "• Poona Khira",
    variety3: "• Japanese Long Green",
    variety4: "• Pusa Uday",
    variety5: "• Swarna Ageti",
    variety6: "• Swarna Poorna",
    fact1: "Cucumbers are 96% water - even more than watermelons!",
    fact2: "They've been cultivated in India for over 3,000 years."
  }
};

  let currentState = {
    season: null,
    crop: null,
    selectedStates: new Set(),
    isAnswerRevealed: false,
  };

  // Cache: path DOM element → state name (built lazily on first click when map is visible)
  const pathStateCache = new WeakMap();
  let pathStateCacheBuilt = false;

  // Elements
  const elements = {
    homeScreen: document.getElementById("btn-home-screen"),
    btnRabiHome: document.getElementById("Group_1591"),
    btnKharifHome: document.getElementById("Group_1590"),
    btnZaidHome: document.getElementById("Group_1589"),

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
    homeBtn: document.getElementById("Group_1592"),

    feedbackIncorrectPopup: document.getElementById("feedback-incorrect-state"),
    gotItIncorrectBtn: document.getElementById("Group_16141"),

    feedbackCorrectPopup: document.getElementById("feedback-end-crop"),
    feedbackCorrectText: document.getElementById("You_Nailed_It_Congratulations_You_have_identified_all_13_major_Wheat_producing_states_"),
    factsheetBtn: document.getElementById("Group_1616"),
    factsheetBtnText: document.getElementById("Wheat_Factsheet"),

    factsheet: document.getElementById("popup-factsheet"),
    factsheetTitle: document.getElementById("Wheat_Factsheet1"),
    factsheetClimate: document.getElementById("Required_Climatic_Condition:_Cool_and_moist_weather_during_growing_period_warm_and_dry_during_ripening._Temperature:_10-25_C"),
    factsheetSoil: document.getElementById("Suitable_Soil:_Well-drained_loamy_soil_with_good_organic_content."),
    factsheetVariety: document.getElementById("Variety_in_India_:_HD-2967_PBW-343_Lok-1_GW-322_Sharbati_Kalyan_Sona"),
    factsheetFact: document.getElementById("Fact:_Punjab_and_Haryana_are_called_the_Breadbasket_of_India_because_they_produce_nearly_50_of_the_country_s_wheat."),
    factsheetStates: document.getElementById("States:_Jammu_and_Kashmir_Himachal_Pradesh_Uttarakhand_Punjab_Haryana_Rajasthan_Uttar_Pradesh_Bihar_Jharkhand_West_Bengal_Madhya_Pradesh_Gujarat_Maharashtra"),

    tryAnotherCropBtn: document.getElementById("Group_16161"),

    mapContainer: document.getElementById("state-map-clickable"),
    croplabel: document.getElementById("crop-label"),
    panel01buttons: document.getElementById("panel-01-buttons"),
    itextActivity: document.getElementById("i-text-activity"),
    panel02map: document.getElementById("panel-02-map"),
    itextcropmap: document.getElementById("i-text-crop-map"),
    iTextHomeScreen: document.getElementById("i-text-home-screen"),
    Got_it_1 : document.getElementById("Got_it_1"),
  };

  // Initialize visibility
  const hideAll = () => {
    [
      elements.homeScreen,
      // elements.panelRabi,
      // elements.panelKharif,
      // elements.panelZaid,
      //elements.globalButtons,
      elements.homeBtn,
      elements.submitBtn,
      elements.showAnswerBtn,
      elements.cropPromptContainer,
      elements.feedbackIncorrectPopup,
      elements.feedbackCorrectPopup,
      elements.factsheet,
    ].forEach((el) => {
      if (el) {
        // el.style.display = "none";
        el.classList.add("st170"); // Ensure it takes the CSS property if present
      }
    });
  };
  const showHome = () => {
    hideAll();

    if (elements.homeScreen) {
      elements.homeScreen.style.display = "block";
      elements.homeScreen.classList.remove("st170");
    }

    if (elements.iTextHomeScreen) {
      elements.iTextHomeScreen.style.display = "block";
      elements.iTextHomeScreen.classList.remove("st170");
    }
    if (elements.panel01buttons) {

      elements.panel01buttons.classList.add("st170");
    }
    if (elements.panel02map) {

      elements.panel02map.classList.add("st170");
    }
    if (elements.mapContainer) {

      elements.mapContainer.classList.add("st170");
    }
    if (elements.croplabel) {

      elements.croplabel.classList.add("st170");
    }
    if (elements.itextActivity) {
      elements.itextActivity.classList.add("st170");
    }
    if (elements.itextcropmap) {
      elements.itextcropmap.classList.add("st170");
    }

    resetMapHighlights();

    ['btn-rabi-selected', 'btn-Kharif-selected', 'btn-Zaid-selected'].forEach(id => {
      const selectedContainer = document.getElementById(id);
      if (selectedContainer) {
        selectedContainer.style.display = "none";
        selectedContainer.classList.add("st170");
      }
    });

    // Reset opacity on base buttons
    ['btn-rabi', 'btn-Kharif', 'btn-Zaid'].forEach(id => {
      const baseContainer = document.getElementById(id);
     
      baseContainer.classList.add("st170"); // hide the entire base button group
      if (baseContainer) {
        Array.from(baseContainer.children).forEach(childGroup => {
          childGroup.style.opacity = "0";
          childGroup.style.display = "none";
        });
      }
    });

    currentState = {
      season: null,
      crop: null,
      selectedStates: new Set(),
      isAnswerRevealed: false,
    };

    if (elements.homeBtn) {

      elements.homeBtn.classList.add("st170");
    }
    const tspan = elements.showAnswerBtn?.querySelector("tspan");
    if (tspan) tspan.textContent = "Show Answer";
  };

  // All valid Indian state/UT names that can appear on the map
  const VALID_STATE_NAMES = new Set([
    ...Object.values(CROP_DATA).flat(),
    "Jammu and Kashmir", "Ladakh", "Goa", "Sikkim", "Arunachal Pradesh",
    "Meghalaya", "Nagaland", "Tripura", "Manipur", "Mizoram",
    "Uttarakhand", "Chhattisgarh", "Jharkhand", "Telangana",
    "Himachal Pradesh", "Lakshadweep Is.", "Andaman and Nicobar Is.",
  ]);

  // Collect all reference points from DOM attributes — no visibility needed.
  // Connector circles (line+circle groups) are placed by the designer inside
  // the state's actual territory. Label text positions serve as fallback.
  let _refPoints = null;
  const getRefPoints = () => {
    if (_refPoints) return _refPoints;
    _refPoints = [];

    // Label text positions: name → {x, y}
    const labelMap = new Map();
    document.querySelectorAll("g[id].st37").forEach((g) => {
      const name = g.id.replace(/_/g, " ");
      if (!VALID_STATE_NAMES.has(name)) return;
      const text = g.querySelector("text");
      if (!text) return;
      const m = (text.getAttribute("transform") || "").match(
        /translate\(([^,\s)]+)[,\s]+([^)]+)\)/
      );
      if (!m) return;
      const x = parseFloat(m[1]), y = parseFloat(m[2]);
      labelMap.set(name, { x, y });
      _refPoints.push({ name, x, y, isConnector: false });
    });

    // Connector circles — assign to nearest state label by default,
    // then use the line's far endpoint (label-side) as a tiebreaker when
    // the circle-based nearest label is a large state whose label sits directly
    // inside its territory (no connector needed), like Ladakh.
    document.querySelectorAll('g[id^="Group_"]').forEach((g) => {
      if (!g.querySelector("line") || !g.querySelector("circle")) return;
      const circle = g.querySelector("circle");
      const line = g.querySelector("line");
      const cx = parseFloat(circle.getAttribute("cx"));
      const cy = parseFloat(circle.getAttribute("cy"));

      // Primary: nearest label to circle endpoint
      let nearest = null, minDist = Infinity;
      labelMap.forEach(({ x, y }, name) => {
        const d = Math.hypot(cx - x, cy - y);
        if (d < minDist) { minDist = d; nearest = name; }
      });

      // Tiebreaker: use the line's far endpoint (label-side) when the primary
      // nearest label belongs to a state with no connector line (large states
      // like Ladakh whose labels are directly inside their territory).
      // For those states the connector actually belongs to the adjacent smaller
      // state whose label is farther away but whose territory contains the circle.
      if (nearest && line) {
        const lx1 = parseFloat(line.getAttribute("x1"));
        const ly1 = parseFloat(line.getAttribute("y1"));
        const lx2 = parseFloat(line.getAttribute("x2"));
        const ly2 = parseFloat(line.getAttribute("y2"));
        // The far endpoint is whichever line end is farthest from the circle
        const d1 = Math.hypot(cx - lx1, cy - ly1);
        const d2 = Math.hypot(cx - lx2, cy - ly2);
        const farX = d1 > d2 ? lx1 : lx2;
        const farY = d1 > d2 ? ly1 : ly2;

        // Find nearest label to the far (label-side) endpoint
        let nearestFar = null, minDistFar = Infinity;
        labelMap.forEach(({ x, y }, name) => {
          const d = Math.hypot(farX - x, farY - y);
          if (d < minDistFar) { minDistFar = d; nearestFar = name; }
        });

        // If circle-nearest and far-nearest disagree AND the circle-nearest
        // state also appears as a label-type refPoint (meaning it sits directly
        // on its state — no connector needed), trust the far-endpoint result.
        if (nearestFar && nearestFar !== nearest) {
          const circleNearestHasOwnLabel = _refPoints.some(
            r => !r.isConnector && r.name === nearest
          );
          const circleNearestAlreadyHasConnector = _refPoints.some(
            r => r.isConnector && r.name === nearest
          );
          // Only override when:
          // 1. The circle-nearest state has its own label (sits inside its territory)
          // 2. It has no prior connector (it doesn't need a pointer line)
          // 3. The far-endpoint nearest label is CLOSER to the far endpoint than
          //    the circle-nearest label is to the circle — meaning the far endpoint
          //    is genuinely nearer to the state it labels (e.g. J&K label is close
          //    to the J&K connector line's label-side end).
          const distFarNearestToCircle = Math.hypot(cx - (labelMap.get(nearestFar)?.x ?? Infinity), cy - (labelMap.get(nearestFar)?.y ?? Infinity));
          if (
            circleNearestHasOwnLabel &&
            !circleNearestAlreadyHasConnector &&
            minDistFar < minDist &&         // far-endpoint is closer to its label than circle is to its label
            distFarNearestToCircle > minDist // the far-endpoint's label is farther from the circle (confirms circle is in "wrong" territory)
          ) {
            nearest = nearestFar;
          }
        }
      }

      if (nearest) _refPoints.push({ name: nearest, x: cx, y: cy, isConnector: true });
    });

    return _refPoints;
  };

  // Convert a screen click to SVG coordinates, then find the nearest
  // reference point. Click is guaranteed inside the clicked state, so the
  // nearest connector/label should identify that state correctly.
  const getStateFromClick = (clientX, clientY) => {
    const svgEl = document.querySelector("svg");
    if (!svgEl) return null;
    const ctm = svgEl.getScreenCTM();
    if (!ctm) return null;

    const pt = svgEl.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const svgPt = pt.matrixTransform(ctm.inverse());

    const refs = getRefPoints();
    // Use connectors where available; labels only for states without connectors
    const connectorStates = new Set(refs.filter(r => r.isConnector).map(r => r.name));
    const candidates = refs.filter(r => r.isConnector || !connectorStates.has(r.name));

    let nearest = null, minDist = Infinity;
    candidates.forEach((ref) => {
      const d = Math.hypot(svgPt.x - ref.x, svgPt.y - ref.y);
      if (d < minDist) { minDist = d; nearest = ref; }
    });
    return nearest ? nearest.name : null;
  };

  // For Show Answer: build cache mapping one path per state using isPointInFill
  // with the smallest-bbox-area constraint to avoid large background fills.
  const buildPathStateCache = () => {
    if (pathStateCacheBuilt || !elements.mapContainer) return;
    const svgEl = document.querySelector("svg");
    if (!svgEl) return;

    const refs = getRefPoints();
    const connectorStates = new Set(refs.filter(r => r.isConnector).map(r => r.name));
    const sampleRefs = refs.filter(r => r.isConnector || !connectorStates.has(r.name));
    const cachedStates = new Set();
    const paths = Array.from(elements.mapContainer.querySelectorAll("path"));

    sampleRefs.forEach((ref) => {
      if (cachedStates.has(ref.name)) return;
      const pt = svgEl.createSVGPoint();
      pt.x = ref.x; pt.y = ref.y;

      let smallestArea = Infinity, bestPath = null;
      paths.forEach((p) => {
        if (pathStateCache.has(p)) return;
        try {
          if (p.isPointInFill(pt)) {
            const bbox = p.getBBox();
            const area = bbox.width * bbox.height;
<<<<<<< HEAD
            if (area > 0 && area < smallestArea && !p.id.includes("Kerala") && !p.id.includes("Meghalaya")) { smallestArea = area; bestPath = p; }
=======
            if (area > 0 && area < smallestArea) { smallestArea = area; bestPath = p; }
>>>>>>> parent of 7764bd53 (Merge pull request #414 from tce-ce6/deploy-sushant)
          }
        } catch (_) {}
      });
      if (bestPath) { pathStateCache.set(bestPath, ref.name); cachedStates.add(ref.name); }
    });

    pathStateCacheBuilt = true;
  };

  const highlightState = (stateName, isCorrect) => {
    const paths = Array.from(elements.mapContainer.querySelectorAll("path"));
    paths.forEach((p) => {
      // Only highlight paths that are definitively mapped to this state via cache
      if (pathStateCache.get(p) === stateName) {
        p.style.fill = isCorrect ? "#44ff64" : "#F44336";
        p.style.opacity = isCorrect ? "1" : "0.7";
        p.classList.remove("st170");
      }
       if (p.id=== stateName) {
        p.style.fill = isCorrect ? "#44ff64" : "#F44336";
        p.style.opacity = isCorrect ? "1" : "0.7";
        p.classList.remove("st170");
      }

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

    // Identify state from the click coordinates in SVG space.
    // Using the click point (guaranteed inside the clicked state) → nearest
    // connector circle or label gives correct state without proximity issues.
    let stateName =""
    if(VALID_STATE_NAMES.has(e.target.id)){ 
      stateName = e.target.id;
    } else {
       stateName = getStateFromClick(e.clientX, e.clientY);
    }
    
    if (!stateName) return;

    console.log("Clicked state:", stateName);

    const correctStates = CROP_DATA[currentState.crop] || [];
    if (correctStates.includes(stateName)) {
      if (!currentState.selectedStates.has(stateName)) {
        currentState.selectedStates.add(stateName);
        // Highlight ONLY the exact path the user clicked — no cache lookup
        // over all paths, which was the source of multi-state highlighting.
        path.style.fill = "#44ff64";
        path.style.opacity = "1";
        path.classList.remove("st170");
        updateSubmitButtonState();
      }
    } else {
      // Highlight only this path red; popup tells user it's wrong
      path.style.fill = "#F44336";
      path.style.opacity = "0.7";
      path.classList.remove("st170");
      if (elements.feedbackIncorrectPopup) {
        const tspans = Array.from(elements.feedbackIncorrectPopup.querySelectorAll("text tspan"));
        tspans[1].textContent = `This is not a  ${currentState.crop}`;
        elements.feedbackIncorrectPopup.style.display = "block";
        elements.feedbackIncorrectPopup.classList.remove("st170");
      }
    }
  };

  const selectSeason = (season) => {
    console.log("Selecting season:", season);
    currentState.season = season;
    hideAll();
    let panel;
    if (season === "Rabi"){ panel = elements.panelRabi;}
    if (season === "Kharif"){ panel = elements.panelKharif;}
    if (season === "Zaid") {panel = elements.panelZaid;}

    if (panel) {
      panel.style.display = "block";
      panel.classList.remove("st170");

      // Hide selected crop groups until a crop is picked
      ['btn-rabi-selected', 'btn-Kharif-selected', 'btn-Zaid-selected'].forEach(id => {
        const selectedContainer = document.getElementById(id);
        if (selectedContainer) {
          selectedContainer.style.display = "none";
          selectedContainer.classList.add("st170");
        }
      });

        
      // Reset base buttons opacity/display
      ['btn-rabi', 'btn-Kharif', 'btn-Zaid'].forEach(id => {
        const baseContainer = document.getElementById(id);
        if (baseContainer) {
          Array.from(baseContainer.children).forEach(childGroup => {
            childGroup.style.opacity = "1";
            childGroup.style.display = "block";
          });
        }
      });

      elements.croplabel.classList.remove("st170");
      const labelTspan = elements.croplabel.querySelector("tspan");
      if (labelTspan) labelTspan.textContent = `${season} season`;
      elements.iTextHomeScreen.classList.add("st170");
      elements.itextActivity.classList.remove("st170");
      elements.panel02map.classList.remove("st170");
      elements.itextcropmap.classList.add("st170"); // Hide until Got It is clicked
      // elements.globalButtons.classList.add("st170"); // Hide until Got It is clicked
      elements.mapContainer.classList.remove("st170");
      elements.panel01buttons.classList.remove("st170");
      elements.homeBtn.classList.remove("st170"); // ensure home button is visible back to home screen
    }
  };

  const selectCrop = (crop) => {
    console.log("Selecting crop:", crop);
    currentState.crop = crop;

    // Show only the selected crop's proper SVG group designed by artists
    ['btn-rabi-selected', 'btn-Kharif-selected', 'btn-Zaid-selected'].forEach(id => {
      const selectedContainer = document.getElementById(id);
      if (selectedContainer) {
        selectedContainer.style.display = "block";
        selectedContainer.classList.remove("st170"); // ensure wrapper is visible

        Array.from(selectedContainer.children).forEach(childGroup => {
          let hasMatch = false;
          childGroup.querySelectorAll("tspan").forEach(tspan => {
            // Trim and match crop name
            if (tspan.textContent.trim() === crop) {
              hasMatch = true;
            }
          });
          childGroup.style.display = hasMatch ? "block" : "none";
        });
      }
    });

    // Dim the unselected base buttons and hide the base version of the selected button
    ['btn-rabi', 'btn-Kharif', 'btn-Zaid'].forEach(id => {
      const baseContainer = document.getElementById(id);
      if (baseContainer) {
        Array.from(baseContainer.children).forEach(childGroup => {
          let hasMatch = false;
          childGroup.querySelectorAll("tspan").forEach(tspan => {
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
    elements.showAnswerBtn.classList.remove("st170");
    elements.submitBtn.classList.remove("st170");
     elements.showAnswerBtn.style.display = "block";
    elements.submitBtn.style.display = "block";
    if (elements.cropPromptContainer) {
      elements.cropPromptContainer.style.display = "block";
      elements.cropPromptContainer.classList.remove("st170");

      const count = CROP_DATA[crop]?.length || 0;
      const promptTexts = elements.cropPromptText?.querySelectorAll("text tspan");
      if (promptTexts && promptTexts.length >= 4) {
        promptTexts[0].textContent = `${crop} selected! `;
        promptTexts[1].textContent = `This crop is majorly grown in ${count} states/UTs `;
      }

      const titleText = elements.cropPromptTitle?.querySelector("text tspan");
      if (titleText) {
        titleText.textContent = crop;
      }

      const mapPromptTexts = elements.itextcropmap?.querySelectorAll("text tspan");
      if (elements.itextcropmap) {
        // Re-center all text elements in the prompt container manually
        // We set the parent 'text' element to center alignment so tspans don't overlap
        const texts = elements.itextcropmap.querySelectorAll("text");
        texts.forEach(text => text.setAttribute("text-anchor", "middle"));

        if (mapPromptTexts && mapPromptTexts.length >= 3) {
          mapPromptTexts[0].textContent = `Identify and Tap ${count} major `;
          mapPromptTexts[1].textContent = `${crop.toLowerCase()} `;
        }
      }

      // Update success popup texts
      // Popup box width=535, usable≈490. Compress the crop line if too long.
      if (elements.feedbackCorrectText) {
        const successTexts = elements.feedbackCorrectText.querySelectorAll("text tspan");
        if (successTexts && successTexts.length >= 4) {
          const cropLine = `identified all ${count} major ${crop} `;
          successTexts[2].textContent = cropLine;
          successTexts[2].setAttribute('x', '0');
          if (cropLine.trim().length > 30) {
            successTexts[2].setAttribute('textLength', 470);
            successTexts[2].setAttribute('lengthAdjust', 'spacingAndGlyphs');
          } else {
            successTexts[2].removeAttribute('textLength');
            successTexts[2].removeAttribute('lengthAdjust');
          }
        }
      }

      // Factsheet button text — button pill width=233, usable≈210.
      // Compress for long crop names (e.g. "Paddy (Rice) Factsheet").
      if (elements.factsheetBtnText) {
        const btnText = elements.factsheetBtnText.querySelector("text tspan");
        if (btnText) {
          const label = `${crop} Factsheet`;
          btnText.textContent = label;
          btnText.setAttribute('x', '0');
          if (label.length > 16) {
            btnText.setAttribute('textLength', 210);
            btnText.setAttribute('lengthAdjust', 'spacingAndGlyphs');
          } else {
            btnText.removeAttribute('textLength');
            btnText.removeAttribute('lengthAdjust');
          }
        }
      }

      const centerSVGText = (tspan, xPosition) => {
        if (!tspan) return;
        const textNode = tspan.closest('text');
        if (textNode) {
          textNode.setAttribute('text-anchor', 'middle');
          const transform = textNode.getAttribute('transform');
          if (transform) {
            const match = transform.match(/translate\(([-\d.]+)[,\s]+([-\d.]+)\)/);
            if (match) {
              textNode.setAttribute('transform', `translate(${xPosition} ${match[2]})`);
            }
          }
        }
        tspan.setAttribute('x', '0');
      };

      // Set text on a tspan, centering its parent <text> at xCenter.
      // If content exceeds charThreshold, compress horizontally using textLength
      // so it stays within the box without overflowing.
      const fitTextInBox = (tspan, content, xCenter, boxUsableWidth, charThreshold = 40) => {
        if (!tspan) return;
        tspan.textContent = content || '';
        const textEl = tspan.closest('text');
        if (textEl) {
          textEl.setAttribute('text-anchor', 'middle');
          const transform = textEl.getAttribute('transform');
          if (transform) {
            const m = transform.match(/translate\(([-\d.]+)[,\s]+([-\d.]+)\)/);
            if (m) textEl.setAttribute('transform', `translate(${xCenter} ${m[2]})`);
          }
        }
        tspan.setAttribute('x', '0');
        if (content && content.length > charThreshold) {
          tspan.setAttribute('textLength', boxUsableWidth);
          tspan.setAttribute('lengthAdjust', 'spacingAndGlyphs');
        } else {
          tspan.removeAttribute('textLength');
          tspan.removeAttribute('lengthAdjust');
        }
      };

      // Word-wrap content into the LAST <text> element of a group by replacing
      // its tspans. Safe only when no other <text> element follows at a fixed y.
      const wrapLastTextEl = (textEl, content, xCenter, maxChars = 65, lineHeight = 32) => {
        if (!textEl) return;
        Array.from(textEl.querySelectorAll('tspan')).forEach(t => t.remove());
        if (!content) return;
        const words = content.split(' ');
        const lines = [];
        let line = '';
        words.forEach(w => {
          const candidate = line ? `${line} ${w}` : w;
          if (candidate.length <= maxChars) { line = candidate; }
          else { if (line) lines.push(line); line = w; }
        });
        if (line) lines.push(line);
        const ns = 'http://www.w3.org/2000/svg';
        lines.forEach((l, i) => {
          const t = document.createElementNS(ns, 'tspan');
          t.setAttribute('x', '0');
          if (i > 0) t.setAttribute('dy', String(lineHeight));
          t.textContent = l;
          textEl.appendChild(t);
        });
        textEl.setAttribute('text-anchor', 'middle');
        const transform = textEl.getAttribute('transform');
        if (transform) {
          const m = transform.match(/translate\(([-\d.]+)[,\s]+([-\d.]+)\)/);
          if (m) textEl.setAttribute('transform', `translate(${xCenter} ${m[2]})`);
        }
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
          const tspans = Array.from(elements.factsheetStates.querySelectorAll("text tspan"));
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

        // Climate — each line in its own fixed-y <text> element; use textLength
        // compression so long lines stay inside the box without overlapping neighbours.
        // Climate box width=503, usable ≈ 479.
        if (elements.factsheetClimate) {
          const tspans = Array.from(elements.factsheetClimate.querySelectorAll("text tspan"));
          // tspans[0] = title, tspans[1-3] = content lines
          if (tspans.length >= 4) {
            fitTextInBox(tspans[1], facts.climate1, 1534, 479);
            fitTextInBox(tspans[2], facts.climate2, 1534, 479);
            fitTextInBox(tspans[3], facts.climate3, 1534, 479);
          }
        }

        // Soil — same box size as Climate (width=503, usable ≈ 479).
        if (elements.factsheetSoil) {
          const tspans = Array.from(elements.factsheetSoil.querySelectorAll("text tspan"));
          // tspans[0] = title, tspans[1-2] = content lines
          if (tspans.length >= 3) {
            fitTextInBox(tspans[1], facts.soil1, 1534, 479);
            fitTextInBox(tspans[2], facts.soil2, 1534, 479);
          }
        }

        // Variety — short items, just center; clear unused slots
        if (elements.factsheetVariety) {
          const tspans = Array.from(elements.factsheetVariety.querySelectorAll("text tspan"));
          const varieties = ['variety1','variety2','variety3','variety4','variety5','variety6'];
          varieties.forEach((key, i) => {
            if (tspans[i + 1] !== undefined) {
              tspans[i + 1].textContent = facts[key] || "";
              centerSVGText(tspans[i + 1], 1534);
            }
          });
        }

        // Fact — fact box width=838, usable ≈ 810.
        // fact1 is short → compress only if needed.
        // fact2 may be long → word-wrap within the last <text> element (safe, no
        // following fixed-y element to overlap). Extra dy lines stay inside the box.
        if (elements.factsheetFact) {
          const texts = Array.from(elements.factsheetFact.querySelectorAll("text"));
          // texts[0] = "Fact:" title, texts[1] = fact1, texts[2] = fact2
          if (texts.length >= 3) {
            const fact1Tspan = texts[1].querySelector('tspan');
            fitTextInBox(fact1Tspan, facts.fact1, 1370, 810, 70);
            wrapLastTextEl(texts[2], facts.fact2, 1370, 68);
          }
        }
      }
    }
  };

  // Event Listeners for Season Buttons (Home Screen)
  resetMapHighlights(); 
  elements.btnRabiHome?.addEventListener("click", () => selectSeason("Rabi"));
  elements.btnKharifHome?.addEventListener("click", () =>
    selectSeason("Kharif"),
  );
  elements.btnZaidHome?.addEventListener("click", () => selectSeason("Zaid"));

  // Event Listeners for Crop Buttons
  // Rabi
  document
    .getElementById("Wheat")
    ?.addEventListener("click", () => selectCrop("Wheat"));
  document
    .getElementById("Barley")
    ?.addEventListener("click", () => selectCrop("Barley"));
  document
    .getElementById("Mustard")
    ?.addEventListener("click", () => selectCrop("Mustard"));
  document
    .getElementById("Chickpea")
    ?.addEventListener("click", () => selectCrop("Chickpea"));
  document
    .getElementById("Peas")
    ?.addEventListener("click", () => selectCrop("Peas"));

  // Kharif
  const riceBtn =
    document.getElementById("Paddy_Rice_") ||
    document.getElementById("Paddy_Rice_1");
  riceBtn?.addEventListener("click", () => selectCrop("Paddy (Rice)"));
  document
    .getElementById("Sugarcane")
    ?.addEventListener("click", () => selectCrop("Sugarcane"));
  document
    .getElementById("Cotton")
    ?.addEventListener("click", () => selectCrop("Cotton"));
  document
    .getElementById("Jute")
    ?.addEventListener("click", () => selectCrop("Jute"));
  document
    .getElementById("Tea")
    ?.addEventListener("click", () => selectCrop("Tea"));
  document
    .getElementById("Coffee")
    ?.addEventListener("click", () => selectCrop("Coffee"));
  document
    .getElementById("Rubber")
    ?.addEventListener("click", () => selectCrop("Rubber"));

  // Zaid
  document
    .getElementById("Watermelon")
    ?.addEventListener("click", () => selectCrop("Watermelon"));
  document
    .getElementById("Muskmelon")
    ?.addEventListener("click", () => selectCrop("Muskmelon"));
  document
    .getElementById("Moong_Dal")
    ?.addEventListener("click", () => selectCrop("Moong Dal"));
  document
    .getElementById("Cucumber")
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
    // if (elements.globalButtons) {
    //   elements.globalButtons.style.display = "block";
    //   elements.globalButtons.classList.remove("st170");
    // }
    elements.submitBtn.style.opacity = "0.5";
    elements.submitBtn.style.pointerEvents = "none";
  });

  elements.gotItIncorrectBtn?.addEventListener("click", () => {
    if (elements.feedbackIncorrectPopup) {
      elements.feedbackIncorrectPopup.style.display = "none";
      elements.feedbackIncorrectPopup.classList.add("st170");
    }
    // Clear any red (incorrect) highlights from the map
    if (elements.mapContainer) {
      elements.mapContainer.querySelectorAll("path").forEach((p) => {
        if (p.style.fill === "rgb(244, 67, 54)" || p.style.fill === "#F44336") {
          p.style.fill = "";
          p.style.opacity = "";
        }
      });
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
    // Hide factsheet and all popups
    [elements.factsheet, elements.feedbackCorrectPopup, elements.feedbackIncorrectPopup,
     elements.cropPromptContainer, elements.submitBtn, elements.showAnswerBtn].forEach(el => {
      if (el) { el.style.display = "none"; el.classList.add("st170"); }
    });

    // Reset map
    resetMapHighlights();

    // Reset state
    currentState.crop = null;
    currentState.selectedStates = new Set();
    currentState.isAnswerRevealed = false;

    // Reset Show Answer button text
    const tspan = elements.showAnswerBtn?.querySelector("tspan");
    if (tspan) tspan.textContent = "Show Answer";

    // Restore all crop buttons: hide selected variants, restore base buttons to full opacity
    ['btn-rabi-selected', 'btn-Kharif-selected', 'btn-Zaid-selected'].forEach(id => {
      const el = document.getElementById(id);
      if (el) { el.style.display = "none"; el.classList.add("st170"); }
    });
    ['btn-rabi', 'btn-Kharif', 'btn-Zaid'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        Array.from(el.children).forEach(child => {
          child.style.display = "block";
          child.style.opacity = "1";
        });
      }
    });
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
    const tspan = elements.showAnswerBtn.querySelector("tspan");
    if (!currentState.isAnswerRevealed) {
      // Show answer
      buildPathStateCache();
      const correctStates = CROP_DATA[currentState.crop] || [];
      correctStates.forEach((s) => highlightState(s, true));
      currentState.isAnswerRevealed = true;
      if (tspan) tspan.textContent = "Hide Answer";
    } else {
      // Hide answer — remove only the green highlights added by Show Answer
      if (elements.mapContainer) {
        elements.mapContainer.querySelectorAll("path").forEach((p) => {
          if (!currentState.selectedStates.has(pathStateCache.get(p))) {
            p.style.fill = "";
            p.style.opacity = "";
          }
        });
      }
      currentState.isAnswerRevealed = false;
      if (tspan) tspan.textContent = "Show Answer";
    }
  });

  elements.homeBtn?.addEventListener("click", () => {
    showHome();
  });

  if (elements.mapContainer) {
    elements.mapContainer.addEventListener("click", handleStateClick);
  }


});
