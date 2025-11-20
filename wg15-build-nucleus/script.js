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
let selectedAtom = ""; // GLOBAL

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
        // Store selected atom
        selectedAtom = newId;
        console.log("Selected Atom:", selectedAtom);

        // 🔥 Hide step 1, show step 2
        document.querySelector("#step1").style.display = "none";
        document.querySelector("#step2").style.display = "block";
      });
    }
  });
}


