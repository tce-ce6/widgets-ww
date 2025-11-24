let elementData = [];
const MAX_PROTONS = 20;
const MAX_NEUTRONS = 20;

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#molecule-listing");
  elementData = await fetch("atom-data.json").then(r => r.json());
  populateSidebarList();
  moleculeList.addEventListener("scroll", updateScrollDownButton);

  console.log("elementData", elementData);

  // 1. Load JSON manually so we can read ln / nm
  const json = await fetch("atom-lottie.json").then(r => r.json());

  // 2. Start animation using the JSON object
  const anim = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: false,
    autoplay: true,
    animationData: json
  });

  // 3. When SVG is built, replace ln → nm
  anim.addEventListener("DOMLoaded", () => {
    const svg = container.querySelector("svg");
    applyNameIds(json, svg);
  });

});
document.querySelector("#check-ans").addEventListener("click", checkAnswer);
document.querySelector("#reset-btn").addEventListener("click", resetStep2);

document.getElementById("sidebar-btn").addEventListener("click", () => {
  document.getElementById("sidebar-wrapper").classList.toggle("active");
});

const moleculeList = document.querySelector("#molecule-list");
const scrollDownBtn = document.querySelector(".scoll-down");


// =============================
// Convert ln → nm for all layers
// =============================
function applyNameIds(json, svg) {
  if (!json.layers) return;

  json.layers.forEach(layer => {
    const ln = layer.ln;
    const nm = layer.nm;

    if (!ln || !nm) return;

    const newId = nm
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]/g, "");

    const target = svg.getElementById(ln);

    if (target) {
      target.id = newId;
      target.style.cursor = "pointer";

      target.addEventListener("click", () => {
        selectedAtom = newId;

        document.querySelector("#step1").style.display = "none";
        document.querySelector("#step2").style.display = "block";
        document.querySelector("#btn-wrapper").style.display = "block";   // 👈 NEW

        const cleanName = selectedAtom.split("_")[0];
        document.querySelector("#molecule-name").textContent = cleanName;

        setActiveSidebarItem(cleanName);

        // Lookup symbol from your JSON
        const match = elementData.find(e => e.element.toLowerCase() === cleanName.toLowerCase());
        console.log("match.symbol", match.symbol);

        if (match) {
          document.querySelector("#selected-atom").textContent = match.symbol;
        } else {
          document.querySelector("#selected-atom").textContent = "?";
        }
      });

    }
  });
}


// =============================
// BUTTON ACTIONS
// =============================
document.querySelector("#add-proton-button").addEventListener("click", () => {
  addParticle("proton");
});

document.querySelector("#remove-proton-button").addEventListener("click", () => {
  removeParticle("proton");
});

document.querySelector("#add-neutron-button").addEventListener("click", () => {
  addParticle("neutron");
});

document.querySelector("#remove-neutron-button").addEventListener("click", () => {
  removeParticle("neutron");
});

// Global array to hold the DOM elements of the added particles
const droppedParticles = [];
// Keep track of the last particle's position for stacking
let lastParticlePosition = { x: 0, y: 0, z: 0 };

// =============================
// PARTICLE ADDITION LOGIC
// =============================
function addParticle(type) {
  const protonCount = droppedParticles.filter(p => p.classList.contains("proton")).length;
  const neutronCount = droppedParticles.filter(p => p.classList.contains("neutron")).length;

  // ===== LIMIT CHECKS =====
  if (type === "proton" && protonCount >= MAX_PROTONS) {
    document.querySelector("#limit-note").textContent = "Proton limit reached (20 max)";
    return;
  }

  if (type === "neutron" && neutronCount >= MAX_NEUTRONS) {
    document.querySelector("#limit-note").textContent = "Neutron limit reached (20 max)";
    return;
  }

  // Clear previous limit messages
  document.querySelector("#limit-note").textContent = "";

  resetFeedback();


  const droppingWrapper = document.querySelector("#droping-wrapper");
  if (!droppingWrapper) return;

  const particleImg = document.createElement("img");
  particleImg.classList.add("nucleus-particle", type);

  particleImg.addEventListener("click", () => {
    removeSingleParticle(particleImg);
  });

  if (type === "proton") {
    particleImg.src = "assets/proton.svg";
  } else if (type === "neutron") {
    particleImg.src = "assets/neutron.svg";
  } else {
    return;
  }

  particleImg.style.width = '50px';
  particleImg.style.height = '50px';

  const particleCount = droppedParticles.length;
  const radius = 20;
  const angle = particleCount * 0.618034 * 2 * Math.PI;

  const offsetX = radius * Math.sqrt(particleCount) * Math.cos(angle);
  const offsetY = radius * Math.sqrt(particleCount) * Math.sin(angle);

  const zOffset = particleCount * 0.1;
  const rotation = Math.random() * 360;

  particleImg.style.position = 'absolute';
  particleImg.style.left = `calc(50% + ${offsetX}px)`;
  particleImg.style.top = `calc(50% + ${offsetY}px)`;
  particleImg.style.transform = `translate(-50%, -50%) translateZ(${zOffset}px) rotate(${rotation}deg)`;
  particleImg.style.zIndex = 100 - particleCount;

  droppingWrapper.appendChild(particleImg);
  droppedParticles.push(particleImg);
  repositionParticles();

  updateCounters();
}


function removeParticle(type) {
  const index = droppedParticles.findIndex(p => p.classList.contains(type));

  if (index !== -1) {
    droppedParticles[index].remove();
    droppedParticles.splice(index, 1);
  }

  // Clear limit note
  document.querySelector("#limit-note").textContent = "";
  resetFeedback();
  repositionParticles();   // 👈 NEW
  updateCounters();
}


// =============================
// COUNTER UPDATE LOGIC
// =============================
function updateCounters() {
  const protonCount = droppedParticles.filter(p => p.classList.contains("proton")).length;
  const neutronCount = droppedParticles.filter(p => p.classList.contains("neutron")).length;

  document.querySelector("#protrons-count").textContent = protonCount;
  // document.querySelector("#neutrons").textContent = neutronCount;
  document.querySelector("#total-mass").textContent = protonCount + neutronCount;
}

function checkAnswer() {
  document.querySelector("#limit-note").textContent = "";

  const protonCount = droppedParticles.filter(p => p.classList.contains("proton")).length;
  const neutronCount = droppedParticles.filter(p => p.classList.contains("neutron")).length;

  const cleanName = selectedAtom.split("_")[0];

  // Find isotope from JSON
  const match = elementData.find(e =>
    e.element.toLowerCase() === cleanName.toLowerCase() &&
    e.protons === protonCount &&
    e.neutrons === neutronCount
  );

  const feedbackImg = document.querySelector("#feedback-image");

  if (match) {

    // Set indicator text (stable info)
    document.querySelector("#indicator-note").textContent = match.indicator;

    // Show stable image
    feedbackImg.src = "./assets/stable.svg";
    feedbackImg.style.display = "block";
  } else {
    // No match → isotope incorrect
    document.querySelector("#indicator-note").textContent =
      "This combination does not match any known isotope.";
    document.querySelector("#indicator-note").style.color = "red";

    // Show unstable image
    feedbackImg.src = "./assets/unstable.svg";
    feedbackImg.style.display = "block";
  }
}

function resetFeedback() {
  document.querySelector("#feedback-image").style.display = "none";
  document.querySelector("#indicator-note").textContent = "";
  document.querySelector("#limit-note").textContent = "";
}

function resetStep2() {
  droppedParticles.forEach(p => p.remove());
  droppedParticles.length = 0; // clear array
  updateCounters();
  document.querySelector("#feedback-image").style.display = "none";
  document.querySelector("#indicator-note").textContent = "";
  document.querySelector("#limit-note").textContent = "";
}

function repositionParticles() {
  const radius = 20;

  droppedParticles.forEach((particle, index) => {
    const angle = index * 0.618034 * 2 * Math.PI; // golden angle
    const offsetX = radius * Math.sqrt(index) * Math.cos(angle);
    const offsetY = radius * Math.sqrt(index) * Math.sin(angle);

    const zOffset = index * 0.1;
    const rotation = Math.random() * 360;

    particle.style.left = `calc(50% + ${offsetX}px)`;
    particle.style.top = `calc(50% + ${offsetY}px)`;
    particle.style.transform =
      `translate(-50%, -50%) translateZ(${zOffset}px) rotate(${rotation}deg)`;
    particle.style.zIndex = 100 - index;
  });
}
function removeSingleParticle(particle) {
  // Remove from DOM
  particle.remove();

  // Remove from droppedParticles array
  const index = droppedParticles.indexOf(particle);
  if (index !== -1) {
    droppedParticles.splice(index, 1);
  }

  // Reset UI
  resetFeedback();
  document.querySelector("#limit-note").textContent = "";

  // Reposition remaining particles
  repositionParticles();

  // Update counters
  updateCounters();
}
function populateSidebarList() {
  const list = document.querySelector("#molecule-list");
  list.innerHTML = ""; // clear first

  // Use unique element names only (Hydrogen, Helium, Lithium…)
  const uniqueElements = [...new Set(elementData.map(e => e.element))];

  uniqueElements.forEach(elementName => {
    const li = document.createElement("li");
    li.textContent = elementName;
    li.classList.add("molecule-item");

    // On click → behave like clicking the SVG atom
    li.addEventListener("click", () => handleElementSelection(elementName));

    list.appendChild(li);
  });
}
function handleElementSelection(elementName) {
  selectedAtom = elementName;

  // Switch steps
  document.querySelector("#step1").style.display = "none";
  document.querySelector("#step2").style.display = "block";
  document.querySelector("#btn-wrapper").style.display = "block";

  setActiveSidebarItem(elementName);

  // Update name
  document.querySelector("#molecule-name").textContent = elementName;

  // Find its symbol
  const match = elementData.find(e => e.element.toLowerCase() === elementName.toLowerCase());

  if (match) {
    document.querySelector("#selected-atom").textContent = match.symbol;
  } else {
    document.querySelector("#selected-atom").textContent = "?";
  }

  // Reset UI (recommended)
  resetStep2();
}

function setActiveSidebarItem(elementName) {
  const items = document.querySelectorAll("#molecule-list .molecule-item");

  items.forEach(li => {
    if (li.textContent.trim().toLowerCase() === elementName.toLowerCase()) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
  });
}

function updateScrollDownButton() {
  const scrollTop = moleculeList.scrollTop;
  const visibleHeight = moleculeList.clientHeight;
  const totalHeight = moleculeList.scrollHeight;

  scrollDownBtn.classList.remove("top", "bottom");

  // list not scrollable → no indicator at all
  if (totalHeight <= visibleHeight) {
    return;
  }

  const atTop = scrollTop <= 5;
  const atBottom = scrollTop + visibleHeight >= totalHeight - 5;

  if (atBottom) {
    scrollDownBtn.classList.add("top");     // show "scroll to top"
  } else if (atTop) {
    scrollDownBtn.classList.add("bottom");  // show "scroll to bottom"
  }
}

document.querySelector("#home-btn").addEventListener("click", () => {

  // Hide step2, show step1
  document.querySelector("#step2").style.display = "none";
  document.querySelector("#step1").style.display = "block";

  // Hide button wrapper
  document.querySelector("#btn-wrapper").style.display = "none";

  // Reset selected atom
  selectedAtom = null;

  // Reset all particles
  resetStep2();

  // Reset sidebar active highlight
  document.querySelectorAll("#molecule-list .molecule-item")
    .forEach(li => li.classList.remove("active"));

  // Reset scroll button state
  updateScrollDownButton();
});
