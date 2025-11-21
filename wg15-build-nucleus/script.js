document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#molecule-listing");

  // 1. Load JSON manually so we can read ln / nm
  const json = await fetch("nucleus-lottie.json").then(r => r.json());

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

        const cleanName = selectedAtom.split("_")[0];
        document.querySelector("#molecule-name").textContent = cleanName;
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
  const droppingWrapper = document.querySelector("#droping-wrapper");
  if (!droppingWrapper) return;

  const particleImg = document.createElement("img");
  particleImg.classList.add("nucleus-particle", type);
  
  // Set the source of the image from your asset folder
  // Assuming 'proton.png' for proton and 'neutron.png' for neutron are in your assets
  if (type === "proton") {
    particleImg.src = "assets/proton.svg"; 
  } else if (type === "neutron") {
    particleImg.src = "assets/neutron.svg"; 
  } else {
    return; // Stop if type is unknown
  }

  // Set size (adjust as needed based on your snapshot scale)
  particleImg.style.width = '50px';
  particleImg.style.height = '50px';
  
  // --- Position Logic for tight circular shape ---
  // To simulate the 3D tightly packed structure in 2D using static images,
  // we'll use an incremental offset and slight rotation for each particle.
  const particleCount = droppedParticles.length;
  
  // Simple offset based on index (You might need a more complex spiral/packing algorithm for a perfect sphere)
  const radius = 10; // Initial radius
  const angle = particleCount * 0.618034 * 2 * Math.PI; // Golden angle for even distribution
  
  // Calculate relative position to form a cluster
  const offsetX = radius * Math.sqrt(particleCount) * Math.cos(angle);
  const offsetY = radius * Math.sqrt(particleCount) * Math.sin(angle);
  
  // Apply a slight Z offset (simulating depth) and random rotation for the 3D look
  const zOffset = particleCount * 0.1; 
  const rotation = Math.random() * 360; 

  particleImg.style.position = 'absolute';
  particleImg.style.left = `calc(50% + ${offsetX}px)`; // Center + offset
  particleImg.style.top = `calc(50% + ${offsetY}px)`; // Center + offset
  
  // Use transform for positioning, scaling, and rotation to simulate depth
  particleImg.style.transform = `translate(-50%, -50%) translateZ(${zOffset}px) rotate(${rotation}deg)`;
  
  // Lower Z-index for older particles to appear behind newer ones, simulating depth
  particleImg.style.zIndex = 100 - particleCount; 
  
  droppingWrapper.appendChild(particleImg);
  droppedParticles.push(particleImg);
}

function removeParticle(type) {
  // Find the last added particle of the specified type
  const index = droppedParticles.findIndex(p => p.classList.contains(type));
  
  if (index !== -1) {
    const particleToRemove = droppedParticles.splice(index, 1)[0];
    particleToRemove.remove(); // Remove the image element from the DOM
  }
}



