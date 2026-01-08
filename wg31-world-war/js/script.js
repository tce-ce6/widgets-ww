window.addEventListener("DOMContentLoaded", () => {
  const svgElem = document.querySelector(".map-wrapper svg"); // actual SVG
  const worldMap = document.getElementById("world-map-wrapper"); // <g> inside SVG

  const flag = document.getElementById("flag-1"); // HTML element
  const russia = document.getElementById("russia"); // SVG path

  /* ======== PANZOOM ========= */
  const panzoom = Panzoom(worldMap, {
    maxScale: 8,
    minScale: 1,
    step: 0.25,
    excludeClass: "no-pan"
  });

  svgElem.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);




});
