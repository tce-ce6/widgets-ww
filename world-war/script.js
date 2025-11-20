window.addEventListener("DOMContentLoaded", () => {
  const svgElem = document.querySelector(".svg-container svg");        // actual SVG
  const worldMap = document.getElementById("world-map-wrapper");       // <g> inside SVG

  // PANZOOM APPLY ON G
  const panzoom = Panzoom(worldMap, {
    maxScale: 8,
    minScale: 1,
    step: 0.25,
    excludeClass: "no-pan"
  });

  svgElem.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);

  // ======== SVG DRAG LOGIC ==========
  const flag = document.getElementById("flag-1");
  const russia = document.getElementById("russia");

  let isDragging = false;

  flag.addEventListener("pointerdown", (e) => {
    isDragging = true;
    flag.classList.add("no-pan"); 
    const pt = svgElem.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const cursor = pt.matrixTransform(svgElem.getScreenCTM().inverse());

    flag.dragOffsetX =
      cursor.x - (flag.transform?.baseVal[0]?.matrix.e || 0);
    flag.dragOffsetY =
      cursor.y - (flag.transform?.baseVal[0]?.matrix.f || 0);

    flag.setPointerCapture(e.pointerId);
  });

  flag.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const pt = svgElem.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const cursor = pt.matrixTransform(svgElem.getScreenCTM().inverse());

    const dx = cursor.x - flag.dragOffsetX;
    const dy = cursor.y - flag.dragOffsetY;

    flag.setAttribute("transform", `translate(${dx}, ${dy})`);
  });

  flag.addEventListener("pointerup", (e) => {
    isDragging = false;
    flag.releasePointerCapture(e.pointerId);

    const flagBox = flag.getBBox();
    const russiaBox = russia.getBBox();

    const overlap =
      flagBox.x < russiaBox.x + russiaBox.width &&
      flagBox.x + flagBox.width > russiaBox.x &&
      flagBox.y < russiaBox.y + russiaBox.height &&
      flagBox.y + flagBox.height > russiaBox.y;

    if (overlap) {
      russia.style.fill = "red";
    }
  });
});
