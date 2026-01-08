window.addEventListener("DOMContentLoaded", () => {
  const svgElem = document.querySelector(".map-wrapper svg");
  const worldMap = document.getElementById("world-map-wrapper");
  const mapWrapper = document.querySelector(".map-wrapper");

  const flag1 = document.getElementById("flag-1");
  const flag2 = document.getElementById("flag-2");

  const austriaHungary = document.getElementById("Austria-Hungary");

  /* ================== PANZOOM ================== */
  const panzoom = Panzoom(worldMap, {
    maxScale: 8,
    minScale: 1,
    step: 0.25,
    excludeClass: "no-pan",
  });

  svgElem.parentElement.addEventListener("wheel", panzoom.zoomWithWheel);

  /* ================== DRAG CONFIG ================== */
  const DRAG_IMG_SIZE = 40;
  const DRAG_ANCHOR_X = 8.5; // left offset
  const DRAG_ANCHOR_Y = 40.5; // top offset (flag above cursor)

  let draggedFlag = null;

  /* ================== DRAG START ================== */
  [flag1, flag2].forEach((flag) => {
    flag.setAttribute("draggable", "true");
    flag.style.cursor = "grab";

    flag.addEventListener("dragstart", (e) => {
      draggedFlag = flag;
      flag.style.cursor = "grabbing";

      const img = flag.querySelector("img");

      // Static drag image (not affected by zoom)
      const dragImg = img.cloneNode(true);
      dragImg.style.width = `${DRAG_IMG_SIZE}px`;
      dragImg.style.height = `${DRAG_IMG_SIZE}px`;

      document.body.appendChild(dragImg);

      // Cursor anchor offset
      e.dataTransfer.setDragImage(
        dragImg,
        DRAG_ANCHOR_X,
        DRAG_ANCHOR_Y
      );

      e.dataTransfer.effectAllowed = "move";

      setTimeout(() => document.body.removeChild(dragImg), 0);
    });

    flag.addEventListener("dragend", () => {
      flag.style.cursor = "grab";
      draggedFlag = null;
    });
  });

  /* ================== DROP ZONE ================== */
  mapWrapper.addEventListener("dragover", (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  });

  mapWrapper.addEventListener("drop", (e) => {
    e.preventDefault();
    if (!draggedFlag) return;

    const FLAG_SIZE = 45;

    /* ---- Screen → SVG Root ---- */
    const pt = svgElem.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;

    const svgRootPoint = pt.matrixTransform(
      svgElem.getScreenCTM().inverse()
    );

    /* ---- SVG Root → worldMap (<g>) ---- */
    const worldMapPoint = svgRootPoint.matrixTransform(
      worldMap.getCTM().inverse()
    );

    /* ---- Drag anchor compensation ---- */
    const offsetX = DRAG_ANCHOR_X - DRAG_IMG_SIZE / 2;
    const offsetY = DRAG_ANCHOR_Y - DRAG_IMG_SIZE / 2;

    const finalX = worldMapPoint.x - FLAG_SIZE / 2 - offsetX;
    const finalY = worldMapPoint.y - FLAG_SIZE / 2 - offsetY;

    /* ---- Place flag ---- */
    const foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );

    foreignObject.setAttribute("x", finalX);
    foreignObject.setAttribute("y", finalY);
    foreignObject.setAttribute("width", FLAG_SIZE);
    foreignObject.setAttribute("height", FLAG_SIZE);
    foreignObject.setAttribute("class", "placed-flag no-pan");

    const div = document.createElement("div");
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.display = "flex";
    div.style.alignItems = "center";
    div.style.justifyContent = "center";
    div.innerHTML = draggedFlag.querySelector("img").outerHTML;

    foreignObject.appendChild(div);
    worldMap.appendChild(foreignObject);

    /* ================== HIT TEST ================== */
    if (draggedFlag === flag1 && austriaHungary) {
      const hitPoint = svgElem.createSVGPoint();
      hitPoint.x = worldMapPoint.x;
      hitPoint.y = worldMapPoint.y;

      const pathCTM = austriaHungary.getCTM();
      if (pathCTM) {
        const localPoint = hitPoint.matrixTransform(
          pathCTM.inverse()
        );

        if (austriaHungary.isPointInFill(localPoint)) {
          austriaHungary.style.fill = "red";
        }
      }
    }

    draggedFlag.style.visibility = "hidden";

    console.log(
      `✅ FINAL DROP: ${finalX.toFixed(2)}, ${finalY.toFixed(2)}`
    );
  });

  mapWrapper.addEventListener("dragenter", (e) => e.preventDefault());
  mapWrapper.addEventListener("dragleave", (e) => e.preventDefault());
});
