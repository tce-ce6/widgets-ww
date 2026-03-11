document.addEventListener("DOMContentLoaded", () => {
  const svgContainer = document.getElementById("svg-container");
  const svg = svgContainer ? svgContainer.querySelector("svg") : null;
  const homeBtn = document.getElementById("home_enter_btn");
  const clockContainer = document.getElementById("clock-animation-container");

  if (!svg || !homeBtn) return;

  const clockAnim = lottie.loadAnimation({
    container: document.getElementById('clock-animation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: 'assets/clock.json'
  });

  // Hide all direct children of the SVG except home_enter_btn on load
  function applyHomeState() {
    Array.from(svg.children).forEach((child) => {
      if (child.tagName === "defs") return; // keep defs always
      if (child.id === "clock-animation-container") return; // keep clock visible
      if (child.id === "home_enter_btn") {
        child.style.display = "";
      } else {
        child.style.display = "none";
      }
    });
    if (clockContainer) clockContainer.style.display = "";
  }

  // Show all SVG children (full widget state)
  function applyWidgetState() {
    Array.from(svg.children).forEach((child) => {
      if (child.tagName === "defs") return;
      child.style.display = "";
    });
    // Hide the enter button once inside the widget
    homeBtn.style.display = "none";
  }

  // Set initial state
  applyHomeState();

  // Click on the enter button to reveal the full widget
  homeBtn.style.cursor = "pointer";
  homeBtn.addEventListener("click", () => {
    // Hide home button and show widget
    homeBtn.style.display = "none";
    applyWidgetState();
  });
});
