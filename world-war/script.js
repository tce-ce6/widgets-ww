window.addEventListener("DOMContentLoaded", () => {
  const svgElem = document.querySelector(".svg-container #world-map-wrapper");

  const panzoom = Panzoom(svgElem, {
    maxScale: 8,
    minScale: 1,
    step: 0.25
  });

  svgElem.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);


  // ========== DRAG & DROP FLAG TO COUNTRY ==========
  const flag1 = document.getElementById("flag-1");
  flag1.setAttribute("draggable", true);

  flag1.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", "flag-1");
  });

  const russia = document.getElementById("russia");

  russia.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  russia.addEventListener("drop", (e) => {
    e.preventDefault();

    const dropped = e.dataTransfer.getData("text/plain");

    if (dropped === "flag-1") {
      russia.style.fill = "red";  // fill Russia in red
    }
  });
});
