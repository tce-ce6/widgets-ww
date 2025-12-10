let simulations = {};
// Diagnostic: confirm this updated script is loaded in the browser
console.log("script.js loaded: noUiSlider integration active");
window.__noUiSliderIntegrated = true;
let animationFrames = {};

// Pixels to inset the visual collision circle from the DOM bounding box.
// Increase this value if people look like circles inside larger square boxes
// and you want to require a closer visual contact before infection.
const CONTACT_RADIUS_OFFSET = 1; // px (tweakable)
window.CONTACT_RADIUS_OFFSET = CONTACT_RADIUS_OFFSET;

// Defensive shim: if some leftover code still calls the old rangeslider plugin
// provide a no-op that calls `onInit` and returns the jQuery object so `.on()` chaining works.
// 🔥 Safe global shim: prevents "$slider.rangeslider is not a function" errors
if (window.jQuery && typeof jQuery.fn.rangeslider !== "function") {
  jQuery.fn.rangeslider = function (opts) {
    // Simulate onInit
    if (opts && typeof opts.onInit === "function") {
      this.each(function () {
        try {
          opts.onInit.call(this);
        } catch (e) {}
      });
    }
    // Return jQuery object for chaining
    return this;
  };
}

let simulationStates = {};
// global debounce settings for sliders (used by native and polyfilled handlers)
window.__sliderResetTimers = window.__sliderResetTimers || {};
window.__SLIDER_DEBOUNCE = window.__SLIDER_DEBOUNCE || 150;

// const personEmojis = ['🧑', '👨', '👩', '🧒', '👦', '👧'];
// const surfaceEmojis = ['🪑', '🚪', '📱', '⌨️'];
// const vectorEmojis = ['🦟', '🪰'];
// const foodEmojis = ['🥤', '🍽️', '🥛', '🍲'];
const personImages = [
  "./assets/person1.svg",
  "./assets/person2.svg",
  "./assets/person3.svg",
  "./assets/person4.svg",
  "./assets/person5.svg",
];
const surfaceImages = [
  "./assets/surface1.svg",
  "./assets/surface2.svg",
  "./assets/surface3.svg",
  "./assets/surface4.svg",
];
const vectorImages = ["./assets/vector1.svg"];
const foodImages = ["./assets/food1.svg", "./assets/food2.svg"];

function switchTab(tabName, btn) {
  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active"));
  document
    .querySelectorAll(".tab-content")
    .forEach((content) => content.classList.remove("active"));

  if (btn && btn.classList) {
    btn.classList.add("active");
  }
  document.getElementById(tabName).classList.add("active");

  window.currentSimulationTab = tabName;

  // 🔥 Reset global button every time tab changes
  const globalButton = document.getElementById("global-start");
  globalButton.textContent = "Start";
  globalButton.classList.remove("pause-button");
  globalButton.classList.add("start-button");

  // 🔥 Stop running state for new tab
  if (simulationStates[tabName]) {
    simulationStates[tabName].running = false;
  }

  // 🔥 Add class on all .control-column
  const controlColumns = document.querySelectorAll(".control-column");

  controlColumns.forEach((col) => {
    col.classList.remove(
      "direct-contact",
      "indirect-contact",
      "airborne-contact",
      "food-contact",
      "vector-contact"
    );
  });

  const tabClassMap = {
    direct: "direct-contact",
    indirect: "indirect-contact",
    airborne: "airborne-contact",
    food: "food-contact",
    vector: "vector-contact",
  };

  controlColumns.forEach((col) => col.classList.add(tabClassMap[tabName]));

  if (!simulations[tabName]) {
    initializeSimulation(tabName);
  }
}
function resetSimulation(type) {
  console.log("Resetting simulation for:", type);

  // Stop animation frame if running
  if (animationFrames[type]) {
    cancelAnimationFrame(animationFrames[type]);
    animationFrames[type] = null;
  }

  // Reset running flag
  if (simulationStates[type]) {
    simulationStates[type].running = false;
  }

  // Reset start buttons UI
  const perTabButton = document.getElementById(`${type}-start`);
  const globalButton = document.getElementById("global-start");

  if (perTabButton) {
    perTabButton.textContent = "Start";
    perTabButton.classList.remove("pause-button");
    perTabButton.classList.add("start-button");
  }

  if (globalButton) {
    globalButton.textContent = "Start";
    globalButton.classList.remove("pause-button");
    globalButton.classList.add("start-button");
  }

  // Rebuild simulation with new slider values
  initializeSimulation(type);
}

function toggleSimulation(type) {
  const perTabButton = document.getElementById(`${type}-start`);
  const globalButton = document.getElementById("global-start");

  globalButton.textContent = "Start";
  globalButton.classList.remove("pause-button");
  globalButton.classList.add("start-button");

  if (!simulationStates[type]) {
    simulationStates[type] = { running: false };
  }

  if (simulationStates[type].running) {
    // Pause simulation
    simulationStates[type].running = false;
    if (perTabButton) {
      perTabButton.textContent = "Start";
      perTabButton.classList.remove("pause-button");
      perTabButton.classList.add("start-button");
    }
    if (globalButton) {
      globalButton.textContent = "Start";
      globalButton.classList.remove("pause-button");
      globalButton.classList.add("start-button");
    }
    if (animationFrames[type]) {
      cancelAnimationFrame(animationFrames[type]);
    }
  } else {
    // Start simulation
    simulationStates[type].running = true;
    if (perTabButton) {
      perTabButton.textContent = "Pause";
      perTabButton.classList.remove("start-button");
      perTabButton.classList.add("pause-button");
    }
    if (globalButton) {
      globalButton.textContent = "Pause";
      globalButton.classList.remove("start-button");
      globalButton.classList.add("pause-button");
    }

    if (!simulations[type]) {
      initializeSimulation(type);
    } else {
      startAnimation(type);
    }
  }
}

// Helpers for the shared/global start & reset buttons
function getActiveTab() {
  const active = document.querySelector(".tab-content.active");
  return active ? active.id : window.currentSimulationTab || "direct";
}

function toggleActiveSimulation() {
  const type = getActiveTab();
  toggleSimulation(type);
}

function resetActiveSimulation() {
  const type = getActiveTab();
  resetSimulation(type);
}

function initializeSimulation(type) {
  const sim = document.getElementById(`${type}-sim`);
  const densityElement = document.getElementById(`${type}-density`);

  if (!densityElement) {
    console.warn(`Density element with ID ${type}-density not found.`);
    return; // Exit the function if the element is missing
  }

  const densityValue = parseInt(densityElement.value);
  console.log("densityValue", densityValue);

  // Map 0,1,2 to 5,15,30
  const densityMap = [5, 15, 25];
  const density = densityMap[densityValue];

  sim.innerHTML = "";
  simulations[type] = { people: [], vectors: [], surfaces: [], particles: [] };

  // Create people
  for (let i = 0; i < density; i++) {
    const person = document.createElement("div");
    person.className = "person " + (i === 0 ? "infected" : "healthy");
    const img = document.createElement("img");
    img.src = personImages[Math.floor(Math.random() * personImages.length)];
    img.className = "icon-img";
    person.appendChild(img);
    person.style.left = Math.random() * (sim.offsetWidth - 40) + "px";
    person.style.top = Math.random() * (sim.offsetHeight - 40) + "px";
    person.dataset.vx = (Math.random() - 0.5) * 2;
    person.dataset.vy = (Math.random() - 0.5) * 2;
    sim.appendChild(person);
    simulations[type].people.push(person);
  }

  // Ensure people are visible initially
  sim.style.display = "block";

  // Add type-specific elements
  if (type === "vector") {
    addVectors(type, sim);
  } else if (type === "indirect") {
    addSurfaces(type, sim);
  } else if (type === "food") {
    addFoodItems(type, sim);
  } else if (type === "airborne") {
    addAirborneParticles(type, sim);
  }

  // Only start animation if simulation is running
  if (simulationStates[type] && simulationStates[type].running) {
    startAnimation(type);
  }

  updateStats(type);
}

function addVectors(type, sim) {
  const vectorValue = parseInt(
    document.getElementById("vector-population").value
  );
  // Map 0,1,2 to low/medium/high vector counts
  const vectorMap = [2, 5, 10];
  const vectorCount = vectorMap[vectorValue];
  for (let i = 0; i < vectorCount; i++) {
    const vector = document.createElement("div");
    vector.className = "vector";

    // Create image element (random vector image)
    const img = document.createElement("img");
    img.src = vectorImages[Math.floor(Math.random() * vectorImages.length)];
    img.className = "icon-img";
    vector.appendChild(img);

    // Random position
    vector.style.left = Math.random() * (sim.offsetWidth - 30) + "px";
    vector.style.top = Math.random() * (sim.offsetHeight - 30) + "px";

    // Movement speed
    vector.dataset.vx = (Math.random() - 0.5) * 4;
    vector.dataset.vy = (Math.random() - 0.5) * 4;

    sim.appendChild(vector);
    simulations[type].vectors.push(vector);
  }
}

function addSurfaces(type, sim) {
  const contaminationValue = parseInt(
    document.getElementById("indirect-contamination").value
  );
  // Always show 4 surfaces regardless of contamination level
  const surfaceCount = 4;

  // Visual class based on contamination level
  let visualClass = "";
  if (contaminationValue === 0) {
    visualClass = "surface-low";
  } else if (contaminationValue === 1) {
    visualClass = "surface-medium";
  } else {
    visualClass = "surface-high";
  }

  // Fixed positions for the 4 objects
  const fixedPositions = [
    { left: "15%", top: "20%" },
    { left: "75%", top: "25%" },
    { left: "25%", top: "70%" },
    { left: "80%", top: "75%" },
  ];

  for (let i = 0; i < surfaceCount; i++) {
    const surface = document.createElement("div");
    surface.className = "vector " + visualClass;

    // Create image just like person block
    const img = document.createElement("img");
    img.src = surfaceImages[i]; // Each image once
    img.className = "icon-img";
    surface.appendChild(img);

    // Fixed positions
    surface.style.left = fixedPositions[i].left;
    surface.style.top = fixedPositions[i].top;

    // Mark contaminated
    surface.dataset.contaminated = "true";

    sim.appendChild(surface);
    simulations[type].surfaces.push(surface);
  }
}

function addFoodItems(type, sim) {
  const sanitationValue = parseInt(
    document.getElementById("food-sanitation").value
  );
  // Always show 2 food items regardless of sanitation level
  const foodCount = 2;

  // Visual class based on sanitation level (inverse - low sanitation = high contamination)
  let visualClass = "";
  if (sanitationValue === 0) {
    visualClass = "food-low"; // Low sanitation = high contamination (bright, pulsating)
  } else if (sanitationValue === 1) {
    visualClass = "food-medium"; // Medium sanitation
  } else {
    visualClass = "food-high"; // High sanitation = low contamination (faded, safe)
  }

  // Fixed positions for the 2 food/water objects
  const fixedPositions = [
    { left: "30%", top: "40%" },
    { left: "65%", top: "55%" },
  ];

  for (let i = 0; i < foodCount; i++) {
    const food = document.createElement("div");
    food.className = "vector " + visualClass;

    // Create image element like others
    const img = document.createElement("img");
    img.src = foodImages[i]; // Use first 2 images
    img.className = "icon-img";
    food.appendChild(img);

    // Position
    food.style.left = fixedPositions[i].left;
    food.style.top = fixedPositions[i].top;

    // Contaminated flag
    food.dataset.contaminated = "true";

    sim.appendChild(food);
    simulations[type].surfaces.push(food);
  }
}

function addAirborneParticles(type, sim) {
  const ventilationValue = parseInt(
    document.getElementById("airborne-ventilation").value
  );
  // Map 0,1,2 to high/medium/low particle counts (inverse of ventilation quality)
  const particleMap = [40, 25, 15];
  const particleCount = particleMap[ventilationValue];

  // Add droplets and aerosols
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    const isDroplet = Math.random() > 0.5;
    particle.className = isDroplet ? "droplet" : "aerosol";

    particle.style.left = Math.random() * sim.offsetWidth + "px";
    particle.style.top = Math.random() * sim.offsetHeight + "px";
    particle.dataset.vx = (Math.random() - 0.5) * (isDroplet ? 1.5 : 2.5);
    particle.dataset.vy = (Math.random() - 0.5) * (isDroplet ? 1.5 : 2.5);

    sim.appendChild(particle);
    simulations[type].particles.push(particle);
  }
}

function startAnimation(type) {
  if (animationFrames[type]) {
    cancelAnimationFrame(animationFrames[type]);
  }

  function animate() {
    if (!simulationStates[type] || !simulationStates[type].running) {
      return;
    }

    const sim = document.getElementById(`${type}-sim`);
    const people = simulations[type].people;
    const vectors = simulations[type].vectors;
    const particles = simulations[type].particles || [];

    // 🔥 Determine movement speed multiplier for ALL simulation types
    let sliderVal = 1;
    switch (type) {
      case "direct":
        sliderVal = parseInt(document.getElementById("direct-contact").value);
        break;
      case "indirect":
        sliderVal = parseInt(
          document.getElementById("indirect-contamination").value
        );
        break;
      case "airborne":
        sliderVal = parseInt(
          document.getElementById("airborne-ventilation").value
        );
        break;
      case "food":
        sliderVal = parseInt(document.getElementById("food-sanitation").value);
        break;
      case "vector":
        sliderVal = parseInt(
          document.getElementById("vector-population").value
        );
        break;
    }

    let speedMultiplier;

    // Normal direction → Direct, Indirect, Vector
    if (type === "direct" || type === "indirect" || type === "vector") {
      const speedMap = { 0: 0.66, 1: 1.0, 2: 2.0 };
      speedMultiplier = speedMap[sliderVal] || 1;
    }

    // Reverse direction → Airborne, Food/Water
    else if (type === "airborne" || type === "food") {
      const speedMap = { 0: 2.0, 1: 1.0, 2: 0.66 };
      speedMultiplier = speedMap[sliderVal] || 1;
    }

    // Move people
    people.forEach((person) => {
      let x = parseFloat(person.style.left);
      let y = parseFloat(person.style.top);
      let vx = parseFloat(person.dataset.vx);
      let vy = parseFloat(person.dataset.vy);

      x += vx * speedMultiplier;
      y += vy * speedMultiplier;

      if (x <= 0 || x >= sim.offsetWidth - 40) {
        vx = -vx;
        person.dataset.vx = vx;
      }
      if (y <= 0 || y >= sim.offsetHeight - 40) {
        vy = -vy;
        person.dataset.vy = vy;
      }

      person.style.left = x + "px";
      person.style.top = y + "px";
    });

    // Move vectors
    vectors.forEach((vector) => {
      let x = parseFloat(vector.style.left);
      let y = parseFloat(vector.style.top);
      let vx = parseFloat(vector.dataset.vx);
      let vy = parseFloat(vector.dataset.vy);

      x += vx * speedMultiplier;
      y += vy * speedMultiplier;

      if (x <= 0 || x >= sim.offsetWidth - 30) {
        vx = -vx;
        vector.dataset.vx = vx;
      }
      if (y <= 0 || y >= sim.offsetHeight - 30) {
        vy = -vy;
        vector.dataset.vy = vy;
      }

      vector.style.left = x + "px";
      vector.style.top = y + "px";
    });
    // Move particles
    particles.forEach((particle) => {
      let x = parseFloat(particle.style.left);
      let y = parseFloat(particle.style.top);
      let vx = parseFloat(particle.dataset.vx);
      let vy = parseFloat(particle.dataset.vy);

      vx += (Math.random() - 0.5) * 0.3;
      vy += (Math.random() - 0.5) * 0.3;

      x += vx * speedMultiplier;
      y += vy * speedMultiplier;

      if (x <= 0 || x >= sim.offsetWidth - 6) {
        vx = -vx * 0.8;
        particle.dataset.vx = vx;
      }
      if (y <= 0 || y >= sim.offsetHeight - 6) {
        vy = -vy * 0.8;
        particle.dataset.vy = vy;
      }

      particle.style.left = x + "px";
      particle.style.top = y + "px";
    });

    // Check for transmission
    checkTransmission(type);

    animationFrames[type] = requestAnimationFrame(animate);
  }

  animate();
}

function checkTransmission(type) {
  const people = simulations[type].people;
  const infected = people.filter((p) => p.classList.contains("infected"));
  const healthy = people.filter((p) => p.classList.contains("healthy"));

  if (healthy.length === 0) return;

  let transmissionProbability = 0;

  switch (type) {
    case "direct":
      const contactValue = parseInt(
        document.getElementById("direct-contact").value
      );
      const contactMap = [0.003, 0.005, 0.008];
      transmissionProbability = contactMap[contactValue];
      break;
    case "indirect":
      const contaminationValue = parseInt(
        document.getElementById("indirect-contamination").value
      );
      // Different transmission rates for low/medium/high contamination
      const contaminationMap = [0.002, 0.005, 0.01];
      const surfaceTransmissionRate = contaminationMap[contaminationValue];

      // Check contact with contaminated surfaces
      const surfaces = simulations[type].surfaces;
      healthy.forEach((healthyPerson) => {
        surfaces.forEach((surface) => {
          const distance = calculateDistance(healthyPerson, surface);

          if (distance < 40 && Math.random() < surfaceTransmissionRate) {
            healthyPerson.classList.remove("healthy");
            healthyPerson.classList.add("infected");
          }
        });
      });
      // Also infect on contact with any vector (mosquito) elements.
      // This covers cases where vectors exist in the 'indirect' sim or in the global 'vector' sim.
      try {
        // Include any element with class 'vector' in the DOM so
        // vectors created in other simulation containers are also considered.
        const allVectors =
          Array.from(document.querySelectorAll(".vector")) || [];
        allVectors.forEach((vector) => {
          healthy.forEach((healthyPerson) => {
            if (elementsOverlap(vector, healthyPerson)) {
              healthyPerson.classList.remove("healthy");
              healthyPerson.classList.add("infected");
            }
          });
        });
      } catch (e) {
        // ignore if query selection fails for any reason
      }
      // Set low person-to-person transmission for indirect contact
      transmissionProbability = 0.001;
      break;
    case "airborne":
      const ventilationValue = parseInt(
        document.getElementById("airborne-ventilation").value
      );
      const ventilationMap = [0.008, 0.005, 0.003];
      transmissionProbability = ventilationMap[ventilationValue];
      // Immediate infection when airborne particles (droplets/aerosols)
      // overlap a person. This checks the particle elements added in
      // addAirborneParticles() and uses elementsOverlap() so the
      // circular visual must touch (respecting CONTACT_RADIUS_OFFSET).
      try {
        const particles = simulations[type].particles || [];
        particles.forEach((particle) => {
          healthy.forEach((healthyPerson) => {
            if (elementsOverlap(particle, healthyPerson)) {
              healthyPerson.classList.remove("healthy");
              healthyPerson.classList.add("infected");
            }
          });
        });
      } catch (e) {
        // ignore when simulation not fully initialized
      }
      break;
    case "food":
      const sanitationValue = parseInt(
        document.getElementById("food-sanitation").value
      );
      // Inverse relationship: low sanitation = high contamination = fast transmission
      const sanitationMap = [0.012, 0.006, 0.002]; // Low/Medium/High sanitation
      const foodTransmissionRate = sanitationMap[sanitationValue];

      // Check contact with contaminated food/water
      const foodItems = simulations[type].surfaces;
      healthy.forEach((healthyPerson) => {
        foodItems.forEach((food) => {
          const distance = calculateDistance(healthyPerson, food);

          if (distance < 40 && Math.random() < foodTransmissionRate) {
            healthyPerson.classList.remove("healthy");
            healthyPerson.classList.add("infected");
          }
        });
      });
      // Also infect on contact with any vector (mosquito) elements in the DOM
      try {
        const allVectors =
          Array.from(document.querySelectorAll(".vector")) || [];
        allVectors.forEach((vector) => {
          healthy.forEach((healthyPerson) => {
            if (elementsOverlap(vector, healthyPerson)) {
              healthyPerson.classList.remove("healthy");
              healthyPerson.classList.add("infected");
            }
          });
        });
      } catch (e) {
        // ignore if selection fails
      }
      // Set low person-to-person transmission for food-borne
      transmissionProbability = 0.001;
      break;
    case "vector":
      const vectorValue = parseInt(
        document.getElementById("vector-population").value
      );
      const vectorMap = [0.003, 0.006, 0.009];
      transmissionProbability = vectorMap[vectorValue];
      // Immediate infection on contact with any moving vector (mosquito)
      // Iterate current vectors and infect any healthy person whose circle overlaps a vector.
      try {
        const vectors = simulations[type].vectors || [];
        vectors.forEach((vector) => {
          healthy.forEach((healthyPerson) => {
            if (elementsOverlap(vector, healthyPerson)) {
              healthyPerson.classList.remove("healthy");
              healthyPerson.classList.add("infected");
            }
          });
        });
      } catch (e) {
        // ignore errors if sims not ready
      }
      break;
  }

  // Person-to-person transmission (works for all types now)
  // Person-to-person transmission (works for all types except 'vector')
  // In the 'vector' simulation, infection should only occur via vector contact.
  if (type !== "vector") {
    infected.forEach((infectedPerson) => {
      healthy.forEach((healthyPerson) => {
        // If their boundaries overlap even slightly, infect immediately
        if (elementsOverlap(infectedPerson, healthyPerson)) {
          healthyPerson.classList.remove("healthy");
          healthyPerson.classList.add("infected");
          return; // move to next healthy person
        }

        // Otherwise fall back to proximity-based probabilistic transmission
        const distance = calculateDistance(infectedPerson, healthyPerson);
        if (distance < 50 && Math.random() < transmissionProbability) {
          healthyPerson.classList.remove("healthy");
          healthyPerson.classList.add("infected");
        }
      });
    });
  }
}

function calculateDistance(elem1, elem2) {
  const x1 = parseFloat(elem1.style.left);
  const y1 = parseFloat(elem1.style.top);
  const x2 = parseFloat(elem2.style.left);
  const y2 = parseFloat(elem2.style.top);

  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
// Returns true when the rendered boundaries of two elements overlap at all.
function elementsOverlap(elem1, elem2) {
  // Use circle-based collision using element center and an inset radius
  // This avoids false positives from square DOM bounding boxes when visuals are circular.
  try {
    const r1 = elem1.getBoundingClientRect();
    const r2 = elem2.getBoundingClientRect();

    const w1 = r1.width,
      h1 = r1.height;
    const w2 = r2.width,
      h2 = r2.height;

    const cx1 = r1.left + w1 / 2;
    const cy1 = r1.top + h1 / 2;
    const cx2 = r2.left + w2 / 2;
    const cy2 = r2.top + h2 / 2;

    // Radius is half the smaller dimension (fits a circle inside the element)
    const rRad1 = Math.max(1, Math.min(w1, h1) / 2 - CONTACT_RADIUS_OFFSET);
    const rRad2 = Math.max(1, Math.min(w2, h2) / 2 - CONTACT_RADIUS_OFFSET);

    const dx = cx2 - cx1;
    const dy = cy2 - cy1;
    const dist = Math.hypot(dx, dy);

    // Allow a small epsilon so visually-touching elements are detected
    const EPS = 4; // pixels
    return dist <= rRad1 + rRad2 + EPS;
  } catch (e) {
    // Fallback to center-distance with a conservative threshold
    const d = calculateDistance(elem1, elem2);
    return d < 50 - CONTACT_RADIUS_OFFSET;
  }
}

function updateStats(type) {
  // Keep internal tracking but don't display
  const people = simulations[type].people;
  const healthy = people.filter((p) => p.classList.contains("healthy")).length;
  const infected = people.filter((p) =>
    p.classList.contains("infected")
  ).length;
}

// Initialize all sliders
["direct", "indirect", "airborne", "food", "vector"].forEach((type) => {
  const densitySlider = document.getElementById(`${type}-density`);

  // Debounce timers to avoid reinitialising DOM while user is dragging
  const resetTimers =
    window.__sliderResetTimers || (window.__sliderResetTimers = {});
  const DEBOUNCE_DELAY = 150;

  function clampSliderValue(slider) {
    const min = parseFloat(slider.getAttribute("min")) || 0;
    const max = parseFloat(slider.getAttribute("max")) || 100;
    let val = Number(slider.value);
    if (isNaN(val)) val = min;
    if (val < min) val = min;
    if (val > max) val = max;
    if (String(slider.value) !== String(val)) slider.value = val;
    return val;
  }

  function scheduleReset(type, slider) {
    if (slider) clampSliderValue(slider);
    if (resetTimers[type]) clearTimeout(resetTimers[type]);
    resetTimers[type] = setTimeout(() => {
      resetSimulation(type);
      resetTimers[type] = null;
    }, DEBOUNCE_DELAY);
  }

  if (densitySlider) {
    // debounce on input while dragging
    densitySlider.addEventListener("input", () =>
      scheduleReset(type, densitySlider)
    );

    // immediate on change (when user releases the handle)
    densitySlider.addEventListener("change", () => {
      clampSliderValue(densitySlider);
      if (resetTimers[type]) {
        clearTimeout(resetTimers[type]);
        resetTimers[type] = null;
      }
      resetSimulation(type);
    });
  } else {
    console.warn(`Element with ID ${type}-density not found.`);
  }

  let secondarySlider;
  switch (type) {
    case "direct":
      secondarySlider = document.getElementById("direct-contact");
      break;
    case "indirect":
      secondarySlider = document.getElementById("indirect-contamination");
      break;
    case "airborne":
      secondarySlider = document.getElementById("airborne-ventilation");
      break;
    case "food":
      secondarySlider = document.getElementById("food-sanitation");
      break;
    case "vector":
      secondarySlider = document.getElementById("vector-population");
      break;
  }

  if (secondarySlider) {
    secondarySlider.addEventListener("input", () => {
      if (["vector", "indirect", "food", "airborne"].includes(type))
        scheduleReset(type, secondarySlider);
    });
    // immediate on change (when user releases the handle)
    secondarySlider.addEventListener("change", () => {
      // clamp value and reset immediately
      const min = parseFloat(secondarySlider.getAttribute("min")) || 0;
      const max = parseFloat(secondarySlider.getAttribute("max")) || 100;
      let v = Number(secondarySlider.value);
      if (isNaN(v)) v = min;
      if (v < min) v = min;
      if (v > max) v = max;
      secondarySlider.value = v;
      resetSimulation(type);
    });
  } else {
    console.warn(`Secondary slider for ${type} not found.`);
  }
});

// Update stats periodically (removed display but keep internal tracking)
setInterval(() => {
  Object.keys(simulations).forEach((type) => {
    if (
      simulations[type] &&
      simulationStates[type] &&
      simulationStates[type].running
    ) {
      updateStats(type);
    }
  });
}, 100);

const defaultBtn = document.querySelector('button[onclick*="direct"]');
switchTab("direct", defaultBtn);

// Initialize noUiSlider instances for each native range input.
// The native input elements remain in the DOM and are kept in sync so
// existing input/change listeners work without change.
const noUiInstances = {};

document.querySelectorAll('input[type="range"]').forEach((input) => {
  const $input = $(input);
  const wrapper = input.closest(".slider-wrapper");
  if (!wrapper) return;

  // Hide native input visually but keep it for accessibility/event handling
  input.style.display = "none";

  const sliderDiv = document.createElement("div");
  sliderDiv.className = "no-ui-slider";
  wrapper.insertBefore(sliderDiv, input.nextSibling);

  const min = Number(input.getAttribute("min") || 0);
  const max = Number(input.getAttribute("max") || 2);
  const start = Number(input.value || min);
  const orientation =
    input.dataset.orientation === "vertical" ? "vertical" : "horizontal";

  noUiSlider.create(sliderDiv, {
    start: start,
    connect: [true, false],
    step: 1,
    range: { min: min, max: max },
    orientation: orientation,
    direction: orientation === "vertical" ? "rtl" : "ltr",
    behaviour: "tap-drag",
    tooltips: false,
  });

  const instance = sliderDiv.noUiSlider;
  if (input.id) noUiInstances[input.id] = instance;

  instance.on("update", function (values) {
    const v = Math.round(values[0]);
    if (String(input.value) !== String(v)) {
      input.value = v;
      const ev = new Event("input", { bubbles: true });
      input.dispatchEvent(ev);
    }

    const $output = $input.next("output");
    if ($output.length) $output.text(v);
  });

  instance.on("change", function (values) {
    const v = Math.round(values[0]);
    input.value = v;
    const ev = new Event("change", { bubbles: true });
    input.dispatchEvent(ev);
  });
});

$(document).on("click", ".high-pointer, .high-medium, .high-low", function () {
  const $col = $(this).closest(".control-column");
  const $input = $col.find('input[type="range"]');
  if (!$input.length) return;

  const input = $input[0];
  let target = null;
  if ($(this).hasClass("high-pointer")) target = 2;
  else if ($(this).hasClass("high-medium")) target = 1;
  else target = 0;

  // If we have a noUiSlider instance for this input, use it
  if (
    input &&
    input.id &&
    typeof noUiInstances !== "undefined" &&
    noUiInstances[input.id]
  ) {
    try {
      noUiInstances[input.id].set(target);
    } catch (e) {
      // fallback to updating native input
      input.value = target;
      $input.change();
    }
  } else {
    // fallback: update native input and trigger change
    input.value = target;
    $input.change();
  }
});
