// Base Layouts for the 4 Geometric Shapes
const layouts = {
  square: [
    {
      solution_id: 1,
      positions: {
        red_rect: { x: 0, y: 0, rot: 0 },
        green_rect: { x: 190, y: 0, rot: 0 },
        blue_triangle: { x: 0, y: 190, rot: 0 },
        yellow_triangle: { x: 0, y: 190, rot: 0 },
        orange_triangle: { x: 190, y: 190, rot: 360 },
      },
    },
    {
      solution_id: 2,
      positions: {
        red_rect: { x: 0, y: 0, rot: 0 },
        green_rect: { x: 190, y: 0, rot: 0 },
        blue_triangle: { x: 0, y: 190, rot: 0 },
        yellow_triangle: { x: 380, y: 190, rot: 90 },
        orange_triangle: { x: 0, y: 380, rot: 270 },
      },
    },
    {
      solution_id: 3,
      positions: {
        red_rect: { x: 0, y: 190, rot: 0 },
        green_rect: { x: 190, y: 190, rot: 0 },
        blue_triangle: { x: 0, y: 0, rot: 0 },
        yellow_triangle: { x: 0, y: 0, rot: 0 },
        orange_triangle: { x: 190, y: 0, rot: 360 },
      },
    },
    {
      solution_id: 4,
      positions: {
        red_rect: { x: 0, y: 190, rot: 0 },
        green_rect: { x: 190, y: 190, rot: 0 },
        blue_triangle: { x: 0, y: 0, rot: 0 },
        yellow_triangle: { x: 380, y: 0, rot: 90 },
        orange_triangle: { x: 0, y: 190, rot: 270 },
      },
    },
    {
      solution_id: 5,
      positions: {
        red_rect: { x: 0, y: 190, rot: 0 },
        green_rect: { x: 190, y: 190, rot: 0 },
        blue_triangle: { x: 0, y: 0, rot: 0 },
        yellow_triangle: { x: 0, y: 0, rot: 0 },
        orange_triangle: { x: 190, y: 0, rot: 0 },
      },
    },
  ],
  rectangle: [
    {
      // Option 1: Red, Green, Triangles
      solution_id: 1,
      positions: {
        red_rect: { x: 0, y: 0, rot: 0 },
        green_rect: { x: 190, y: 0, rot: 0 },
        blue_triangle: { x: 380, y: 0, rot: 0 },
        yellow_triangle: { x: 380, y: 0, rot: 0 },
        orange_triangle: { x: 570, y: 0, rot: 0 },
      },
    },
    {
      // Option 2: Triangles, Red, Green
      solution_id: 2,
      positions: {
        blue_triangle: { x: 0, y: 0, rot: 0 },
        yellow_triangle: { x: 0, y: 0, rot: 0 },
        orange_triangle: { x: 190, y: 0, rot: 0 },
        red_rect: { x: 380, y: 0, rot: 0 },
        green_rect: { x: 570, y: 0, rot: 0 },
      },
    },
    {
      // Option 3: Red, Triangles, Green
      solution_id: 3,
      positions: {
        red_rect: { x: 0, y: 0, rot: 0 },
        blue_triangle: { x: 190, y: 0, rot: 0 },
        yellow_triangle: { x: 190, y: 0, rot: 0 },
        orange_triangle: { x: 380, y: 0, rot: 0 },
        green_rect: { x: 570, y: 0, rot: 0 },
      },
    },
    {
      solution_id: 4,
      positions: {
        red_rect: { x: 0, y: 0, rot: 0 },
        green_rect: { x: 190, y: 0, rot: 0 },
        blue_triangle: { x: 380, y: 0, rot: 0 },
        yellow_triangle: { x: 760, y: 0, rot: 90 },
        orange_triangle: { x: 380, y: 190, rot: 270 },
      },
    },
    {
      solution_id: 5,
      positions: {
        red_rect: { x: 0, y: 0, rot: 0 },
        blue_triangle: { x: 190, y: 0, rot: 0 },
        yellow_triangle: { x: 570, y: 0, rot: 90 },
        orange_triangle: { x: 190, y: 190, rot: 270 },
        green_rect: { x: 570, y: 0, rot: 0 },
      },
    },
    {
      solution_id: 6,
      positions: {
        blue_triangle: { x: 0, y: 0, rot: 0 },
        yellow_triangle: { x: 380, y: 0, rot: 90 },
        orange_triangle: { x: 0, y: 190, rot: 270 },
        red_rect: { x: 380, y: 0, rot: 0 },
        green_rect: { x: 570, y: 0, rot: 0 },
      },
    },
  ],
  triangle: [
    {
      solution_id: 1,
      positions: {
        blue_triangle: { x: 190, y: 0, rot: 0 },
        red_rect: { x: 190, y: 190, rot: 0 },
        green_rect: { x: 380, y: 190, rot: 0 },
        yellow_triangle: { x: 190, y: 380, rot: 180 },
        orange_triangle: { x: 760, y: 380, rot: 180 },
      },
    },
    {
      solution_id: 2,
      positions: {
        blue_triangle: { x: 190, y: 0, rot: 0 },
        red_rect: { x: 190, y: 190, rot: 0 },
        green_rect: { x: 380, y: 190, rot: 0 },
        yellow_triangle: { x: 570, y: 380, rot: 270 },
        orange_triangle: { x: 190, y: 190, rot: 90 },
      },
    },
  ],
  parallelogram: [
    {
      solution_id: 1,
      positions: {
        yellow_triangle: { x: 380, y: 0, rot: 90 },
        red_rect: { x: 570, y: 0, rot: 0 },
        green_rect: { x: 380, y: 0, rot: 0 },
        orange_triangle: { x: 760, y: 190, rot: 270 },
        blue_triangle: { x: 0, y: 0, rot: 0 },
      },
    },
    {
      solution_id: 2,
      positions: {
        yellow_triangle: { x: 760, y: 0, rot: 0 },
        red_rect: { x: 570, y: 0, rot: 0 },
        green_rect: { x: 380, y: 0, rot: 0 },
        orange_triangle: { x: 190, y: 0, rot: 0 },
        blue_triangle: { x: 0, y: 0, rot: 0 },
      },
    },
  ],
};

const solutionFeedback = {
  square_to_rectangle: {
    title: "Square → Rectangle",
    explanation:
      "A square (10×10) can be rearranged into a rectangle (20×5). The square is more compact and symmetrical, while the rectangle is elongated. Both use the formula base × height, showing that the same area can have very different proportions!",
  },

  square_to_triangle: {
    title: "Square → Triangle",
    explanation:
      "A square (10×10) can transform into a triangle (base 20, height 10) because the triangle's area formula is (base × height) ÷ 2. To get the same area as the square, the triangle needs double the base-height product (20×10 = 200), then divided by 2 equals 100. The triangle has twice the base of the square's side!",
  },

  square_to_parallelogram: {
    title: "Square → Parallelogram",
    explanation:
      "A square (10×10) can become a parallelogram (base 20, height 5) by slanting the sides. While the square has all sides equal and all angles 90°, the parallelogram has slanted sides but uses the same area formula: base × height. The perpendicular height (5) is what matters, not the slanted side length!",
  },

  rectangle_to_triangle: {
    title: "Rectangle → Triangle",
    explanation:
      "A rectangle (20×5) can transform into a triangle (base 20, height 10) because triangles occupy half the area of a rectangle with the same base and height. Since our triangle needs area 100, it requires base 20 and height 10 (200 ÷ 2 = 100), while the rectangle achieves 100 with base 20 and height 5. Notice the triangle needs double the height!",
  },

  rectangle_to_parallelogram: {
    title: "Rectangle → Parallelogram",
    explanation:
      "A rectangle (20×5) and parallelogram (base 20, height 5) are very closely related they share the exact same dimensions and area formula (base × height)! The only difference is that the parallelogram's sides are slanted while the rectangle's are perpendicular. Both have parallel opposite sides and equal areas of 100 square units.",
  },

  triangle_to_parallelogram: {
    title: "Triangle → Parallelogram",
    explanation:
      "A triangle (base 20, height 10) can transform into a parallelogram (base 20, height 5) through an elegant relationship: a parallelogram is exactly double the area of a triangle with the same base and height! Since we want equal areas, our parallelogram needs half the height. The triangle divides by 2 in its formula, the parallelogram doesn't so they balance out!",
  },

  square_to_square: {
    title: "Square → Square",
    explanation:
      "A square (10×10) rearranged into another square still keeps the same area of 100 square units. Even if the pieces are moved or rotated, the total area does not change because area depends only on base × height. The shape remains perfectly symmetrical and compact!",
  },

  rectangle_to_rectangle: {
    title: "Rectangle → Rectangle",
    explanation:
      "A rectangle (20×5) rearranged into another rectangle still maintains the same area of 100 square units. Even if the pieces are reorganized, the formula base × height remains constant, so the total area stays exactly the same.",
  },

  triangle_to_triangle: {
    title: "Triangle → Triangle",
    explanation:
      "A triangle (base 20, height 10) rearranged into another triangle keeps the same area because the formula (base × height) ÷ 2 still equals 100. Even if the orientation changes, the total area remains unchanged.",
  },

  parallelogram_to_parallelogram: {
    title: "Parallelogram → Parallelogram",
    explanation:
      "A parallelogram (base 20, height 5) rearranged into another parallelogram keeps the same area of 100 square units. Even if the sides are slanted differently, the area formula base × height ensures the total area remains constant.",
  },

  // REVERSE TRANSFORMATIONS

  rectangle_to_square: {
    title: "Rectangle → Square",
    explanation:
      "A rectangle (20×5) can be rearranged into a square (10×10) because both shapes have the same area of 100 square units. While the rectangle is longer and thinner, the square is compact and balanced, yet both use the formula base × height.",
  },

  triangle_to_square: {
    title: "Triangle → Square",
    explanation:
      "A triangle (base 20, height 10) can be rearranged into a square (10×10) because its area is 100 square units. The triangle uses (base × height) ÷ 2, while the square uses side × side. Even though their formulas differ, their total area can be equal.",
  },

  parallelogram_to_square: {
    title: "Parallelogram → Square",
    explanation:
      "A parallelogram (base 20, height 5) can transform into a square (10×10) because both shapes have an area of 100 square units. The slanted sides of the parallelogram do not affect the area—only the perpendicular height matters.",
  },

  triangle_to_rectangle: {
    title: "Triangle → Rectangle",
    explanation:
      "A triangle (base 20, height 10) can transform into a rectangle (20×5) because a triangle has half the area of a rectangle with the same base and height. By adjusting the height, both shapes can represent the same total area of 100 square units.",
  },

  parallelogram_to_rectangle: {
    title: "Parallelogram → Rectangle",
    explanation:
      "A parallelogram (base 20, height 5) can be rearranged into a rectangle (20×5) because both use the exact same area formula: base × height. The only difference is that the parallelogram’s sides are slanted while the rectangle’s sides are perpendicular.",
  },

  parallelogram_to_triangle: {
    title: "Parallelogram → Triangle",
    explanation:
      "A parallelogram (base 20, height 5) can transform into a triangle by understanding that a triangle with the same base and height has exactly half the area. By adjusting the height accordingly, both shapes can represent the same total area of 100 square units.",
  },
};
let allSnapSolutions = [];
let rotationState = {};

function createSnapZones() {
  allSnapSolutions = [];

  const target = document.getElementById("target-shape").value;
  const solutions = layouts[target];

  const targetX = window.currentDropX;
  const targetY = window.currentDropY;

  solutions.forEach((sol) => {
    const solutionZones = {
      solution_id: sol.solution_id,
      zones: {
        rect: [],
        big_tri: [],
        small_tri: [],
      },
    };

    for (const [id, pos] of Object.entries(sol.positions)) {
      const type = id.includes("rect")
        ? "rect"
        : id.includes("blue")
          ? "big_tri"
          : "small_tri";

      solutionZones.zones[type].push({
        x: targetX + pos.x,
        y: targetY + pos.y,
        rot: pos.rot,
        width: 190,
        height: 190,
      });
    }

    allSnapSolutions.push(solutionZones);
  });

  console.log("Snap Solutions Built:", allSnapSolutions.length);
}
const gameData = {
  game_metadata: {
    piece_ids: [
      "green_rect",
      "red_rect",
      "blue_triangle",
      "yellow_triangle",
      "orange_triangle",
    ],
    snap_tolerance: 25,
  },
  combinations: {
    square_to_square: layouts.square,
    rectangle_to_square: layouts.square,
    triangle_to_square: layouts.square,
    parallelogram_to_square: layouts.square,

    square_to_rectangle: layouts.rectangle,
    rectangle_to_rectangle: layouts.rectangle,
    triangle_to_rectangle: layouts.rectangle,
    parallelogram_to_rectangle: layouts.rectangle,

    square_to_triangle: layouts.triangle,
    rectangle_to_triangle: layouts.triangle,
    triangle_to_triangle: layouts.triangle,
    parallelogram_to_triangle: layouts.triangle,

    square_to_parallelogram: layouts.parallelogram,
    rectangle_to_parallelogram: layouts.parallelogram,
    triangle_to_parallelogram: layouts.parallelogram,
    parallelogram_to_parallelogram: layouts.parallelogram,
  },
};
const shapes = {
  square: {
    width: 380,
    height: 380,
    name: "Square",
    type: "rect",
    offsetX: 62,
    offsetY: 97,
  },
  rectangle: {
    width: 760,
    height: 190,
    name: "Rectangle",
    type: "rect",
    offsetX: -127,
    offsetY: 192,
  },
  triangle: {
    width: 760,
    height: 380,
    name: "Triangle",
    type: "poly",
    points: "0,380 380,0 760,380",
    offsetX: -127,
    offsetY: 97,
  },
  parallelogram: {
    name: "Parallelogram",
    type: "polygon",
    points: "190,0 950,0 760,190 0,190",
    width: 950,
    height: 190,
  },
};
const shapeDimensions = {
  square: "10 × 10 = 100",
  rectangle: "20 × 5 = 100",
  triangle: "20 × 5 = 100",
  parallelogram: "20 × 5 = 100",
};
let selectedElement = null;
let offset = { x: 0, y: 0 };

document.addEventListener("DOMContentLoaded", () => {
  initGame();
});

function getMousePosition(evt) {
  const CTM = svg.getScreenCTM();
  let clientX, clientY;
  if (evt.touches && evt.touches.length > 0) {
    clientX = evt.touches[0].clientX;
    clientY = evt.touches[0].clientY;
  } else {
    clientX = evt.clientX;
    clientY = evt.clientY;
  }
  return {
    x: (clientX - CTM.e) / CTM.a,
    y: (clientY - CTM.f) / CTM.d,
  };
}
function initGame() {
  const draggables = document.querySelectorAll(".draggable");

  draggables.forEach((el) => {
    el.addEventListener("mousedown", startDrag);
    el.addEventListener("touchstart", startDrag, { passive: false });
    el.addEventListener("dblclick", rotatePiece);
    el.style.cursor = "grab";
  });

  document
    .getElementById("source-shape")
    .addEventListener("change", updateGameTable);
  document
    .getElementById("target-shape")
    .addEventListener("change", updateGameTable);
  document.querySelector(".reset-btn").addEventListener("click", resetPieces);

  document.getElementById("Group_1587").addEventListener("click", checkAnswer);
  document.getElementById("Group_1588").addEventListener("click", showAnswer);

  document
    .getElementById("close-solution")
    .addEventListener("click", closeSolutionBanner);
  document.querySelectorAll(".rotate-btn").forEach((btn) => {
    btn.addEventListener("pointerdown", function (e) {
      e.stopPropagation();
      e.preventDefault();
      const piece = this.closest(".draggable");
      rotateSpecificPiece(piece);
    });
  });
  updateGameTable();
}
function rotateSpecificPiece(el) {
  const id = el.id;

  if (rotationState[id] === undefined) rotationState[id] = 0;
  rotationState[id] = (rotationState[id] + 90) % 360;

  const transformAttr = el.getAttribute("transform") || "";
  const translateMatch = transformAttr.match(
    /translate\(([^,)]+)[, ]+([^,)]+)\)/,
  );

  let tx = 0,
    ty = 0;
  if (translateMatch) {
    tx = translateMatch[1];
    ty = translateMatch[2];
  }

  el.setAttribute(
    "transform",
    `translate(${tx}, ${ty}) rotate(${rotationState[id]})`,
  );
}
function updateGameTable() {
  const sType = document.getElementById("source-shape").value;
  const tType = document.getElementById("target-shape").value;
  const targetGroup = document.getElementById("drop-zone-target");
  targetGroup.innerHTML = "";

  const sourceData = shapes[sType];
  const targetData = shapes[tType];
  const sourceDimElement = document.querySelector("#source-dimension tspan");
  if (sourceDimElement) {
    sourceDimElement.textContent = shapeDimensions[sType];
  }

  const targetDimElement = document.querySelector("#target-dimension tspan");
  if (targetDimElement) {
    targetDimElement.textContent = shapeDimensions[tType];
  }
  document
    .getElementById("source-shape-name")
    .querySelector("div").textContent = shapes[sType].name;

  document
    .getElementById("target-shape-name")
    .querySelector("div").textContent = shapes[tType].name;
  const baseSourceX = 161 + 525 / 2;
  const baseTargetX = 748 + 1012 / 2;
  const centerY = 332 + 574 / 2;

  const dynamicStartX = 748 + (1012 - targetData.width) / 2;
  if (targetData.name === "Parallelogram") {
    var finalStartX = 748 + (1012 - 950) / 2;
  } else {
    var finalStartX = dynamicStartX;
  }

  const finalStartY =
    332 +
    (574 - (tType === "rectangle" || tType === "parallelogram" ? 190 : 380)) /
      2;

  let visualElement;
  if (targetData.type === "rect") {
    visualElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "rect",
    );
    visualElement.setAttribute("x", finalStartX);
    visualElement.setAttribute("y", finalStartY);
    visualElement.setAttribute("width", targetData.width);
    visualElement.setAttribute("height", targetData.height);
  } else {
    visualElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polygon",
    );
    const offsetPoints = targetData.points
      .split(" ")
      .map((p) => {
        const [px, py] = p.split(",");
        return `${parseFloat(px) + finalStartX},${parseFloat(py) + finalStartY}`;
      })
      .join(" ");
    visualElement.setAttribute("points", offsetPoints);
  }

  visualElement.setAttribute("fill", "none");
  visualElement.setAttribute("stroke", "#E54D42");
  visualElement.setAttribute("stroke-width", "4");
  visualElement.setAttribute("stroke-dasharray", "10,8");
  targetGroup.appendChild(visualElement);

  window.currentDropX = finalStartX;
  window.currentDropY = finalStartY;

  createSnapZones();
  resetPieces();
}
function resetPieces() {
  const sType = document.getElementById("source-shape").value;
  const sourceData = shapes[sType];
  const sourceLayout = layouts[sType][0].positions;

  const boxX = 161;
  const boxY = 332;
  const boxWidth = 525;
  const boxHeight = 574;

  const padding = 25;

  const layoutWidth = sourceData.width || 1;
  const layoutHeight = sourceData.height || 1;

  const effectiveBoxWidth = boxWidth - 2 * padding;
  const effectiveBoxHeight = boxHeight - 2 * padding;

  const scaleX = effectiveBoxWidth / layoutWidth;
  const scaleY = effectiveBoxHeight / layoutHeight;
  const scale = Math.min(scaleX, scaleY, 1);

  const startX = boxX + padding + (effectiveBoxWidth - layoutWidth * scale) / 2;
  const startY =
    boxY + padding + (effectiveBoxHeight - layoutHeight * scale) / 2;

  // 1. Find or create a group to hold the ghost pieces
  let ghostGroup = document.getElementById("ghost-pieces");
  if (!ghostGroup) {
    ghostGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    ghostGroup.setAttribute("id", "ghost-pieces");

    // Insert it right before the first draggable so it renders underneath them
    const firstDraggable = document.querySelector(".draggable");
    if (firstDraggable && firstDraggable.parentNode) {
      firstDraggable.parentNode.insertBefore(ghostGroup, firstDraggable);
    }
  }

  // 2. Clear any existing ghosts from previous shape selections
  ghostGroup.innerHTML = "";

  for (const [id, pos] of Object.entries(sourceLayout)) {
    const el = document.getElementById(id);

    const transformStr = `translate(${startX + pos.x * scale}, ${startY + pos.y * scale}) scale(${scale}) rotate(${pos.rot})`;

    // Position the active, draggable element
    el.setAttribute("transform", transformStr);
    rotationState[id] = pos.rot;

    // 3. Create the light-colored background ghost
    const ghost = el.cloneNode(true);
    ghost.removeAttribute("id"); // Prevent ID duplication issues
    ghost.classList.remove("draggable");
    ghost.setAttribute("opacity", "0.3"); // Makes it light colored
    ghost.style.pointerEvents = "none"; // Ensures it can't be dragged or clicked

    // 4. Add the ghost to our background group
    ghostGroup.appendChild(ghost);
  }
}

function startDrag(evt) {
  evt.preventDefault();
  selectedElement = evt.currentTarget;
  selectedElement.style.cursor = "grabbing";
  const transforms = selectedElement.transform.baseVal;
  const svgP = getSVGPoint(evt);

  offset.x = svgP.x - transforms.getItem(0).matrix.e;
  offset.y = svgP.y - transforms.getItem(0).matrix.f;

  document.addEventListener("mousemove", drag);
  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchmove", drag, { passive: false });
  document.addEventListener("touchend", endDrag);
}
function drag(evt) {
  if (!selectedElement) return;

  const svgP = getSVGPoint(evt);
  const nx = svgP.x - offset.x;
  const ny = svgP.y - offset.y;

  const transforms = selectedElement.transform.baseVal;
  let rot = 0;

  if (transforms.numberOfItems > 1) {
    rot = transforms.getItem(1).angle;
  }

  selectedElement.setAttribute(
    "transform",
    `translate(${nx}, ${ny}) rotate(${rot})`,
  );

  const pieceId = selectedElement.id;

  const type = pieceId.includes("rect")
    ? "rect"
    : pieceId.includes("blue")
      ? "big_tri"
      : "small_tri";

  let snapped = false;

  allSnapSolutions.forEach((solution) => {
    if (snapped) return;

    const zones = solution.zones[type];

    zones.forEach((zone) => {
      if (snapped) return;

      const centerX = nx + 95;
      const centerY = ny + 95;

      const dx = centerX - (zone.x + zone.width / 2);
      const dy = centerY - (zone.y + zone.height / 2);

      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 40) {
        selectedElement.setAttribute(
          "transform",
          `translate(${zone.x}, ${zone.y}) rotate(${zone.rot})`,
        );
        snapped = true;
      }
    });
  });
}
function endDrag() {
  if (!selectedElement) return;

  selectedElement.style.cursor = "grab";
  selectedElement = null;

  document.removeEventListener("mousemove", drag);
  document.removeEventListener("mouseup", endDrag);
  document.removeEventListener("touchmove", drag);
  document.removeEventListener("touchend", endDrag);
}
function rotatePiece(evt) {
  const el = evt.currentTarget;
  const id = el.id;

  if (!rotationState[id]) rotationState[id] = 0;

  rotationState[id] = (rotationState[id] + 90) % 360;

  const matrix = el.transform.baseVal.getItem(0).matrix;

  el.setAttribute(
    "transform",
    `translate(${matrix.e}, ${matrix.f}) rotate(${rotationState[id]})`,
  );
}

function getSVGPoint(evt) {
  const svg = document.querySelector("svg");
  const pt = svg.createSVGPoint();

  if (evt.touches && evt.touches.length > 0) {
    pt.x = evt.touches[0].clientX;
    pt.y = evt.touches[0].clientY;
  } else {
    pt.x = evt.clientX;
    pt.y = evt.clientY;
  }

  return pt.matrixTransform(svg.getScreenCTM().inverse());
}

function checkAnswer() {
  let solved = false;
  let matchedSolution = null;

  allSnapSolutions.forEach((solution) => {
    if (solved) return;

    let matchCount = 0;

    gameData.game_metadata.piece_ids.forEach((id) => {
      const el = document.getElementById(id);
      const matrix = el.transform.baseVal.getItem(0).matrix;

      const x = Math.round(matrix.e);
      const y = Math.round(matrix.f);

      const type = id.includes("rect")
        ? "rect"
        : id.includes("blue")
          ? "big_tri"
          : "small_tri";

      const zones = solution.zones[type];

      const matched = zones.some(
        (zone) => Math.abs(x - zone.x) < 5 && Math.abs(y - zone.y) < 5,
      );

      if (matched) matchCount++;
    });

    if (matchCount === 5) {
      solved = true;
      matchedSolution = solution;
    }
  });

  if (solved) {
    const source = document.getElementById("source-shape").value;
    const target = document.getElementById("target-shape").value;
    const comboKey = `${source}_to_${target}`;

    showSolutionBanner(comboKey, matchedSolution.solution_id);
  } else {
    showTryAgain();
  }
}
function showTryAgain() {
  const container = document.getElementById("try-again-container");

  container.style.display = "block";
  container.style.opacity = "0";
  container.style.transition = "opacity 0.3s ease";

  setTimeout(() => {
    container.style.opacity = "1";
  }, 10);

  setTimeout(() => {
    container.style.opacity = "0";
    setTimeout(() => {
      container.style.display = "none";
    }, 300);
  }, 2000);
}
function showAnswer() {
  const source = document.getElementById("source-shape").value;
  const target = document.getElementById("target-shape").value;

  const comboKey = `${source}_to_${target}`;

  showSolutionBanner(comboKey);
}

function showSolutionBanner(key, solutionId) {
  const banner = document.getElementById("solution-banner");
  const title = document.getElementById("solution-title");
  const explanation = document.getElementById("solution-explanation");

  const data = solutionFeedback[key];
  if (!data) return;

  title.textContent = data.title;
  explanation.textContent = data.explanation;

  const source = document.getElementById("source-shape").value;
  const target = document.getElementById("target-shape").value;

  renderSolutionVisual(source, target, solutionId);

  banner.style.display = "block";
  banner.style.opacity = 0;
  banner.style.transition = "opacity 0.4s ease";

  setTimeout(() => {
    banner.style.opacity = 1;
  }, 10);

  document.querySelector(".svg-container").style.pointerEvents = "none";
  banner.style.pointerEvents = "auto";
}

function closeSolutionBanner() {
  const banner = document.getElementById("solution-banner");

  banner.style.opacity = 0;

  setTimeout(() => {
    banner.style.display = "none";
  }, 300);

  document.querySelector(".svg-container").style.pointerEvents = "auto";
}
function renderSolutionVisual(source, target, solutionId) {
  const container = document.getElementById("solution-visual");
  container.innerHTML = "";

  function createLayoutPreview(shapeType, solutionId) {
    const wrapper = document.createElement("div");

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "260");
    svg.setAttribute("height", "200");

    const layoutObj =
      layouts[shapeType].find((l) => l.solution_id === solutionId) ||
      layouts[shapeType][0];

    const layoutPositions = layoutObj.positions;

    let maxX = 0;
    let maxY = 0;

    for (const [id, pos] of Object.entries(layoutPositions)) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

      group.setAttribute(
        "transform",
        `translate(${pos.x}, ${pos.y}) rotate(${pos.rot})`,
      );

      const original = document.getElementById(id).cloneNode(true);
      original.removeAttribute("transform");

      group.appendChild(original.firstElementChild.cloneNode(true));
      svg.appendChild(group);

      maxX = Math.max(maxX, pos.x + 380);
      maxY = Math.max(maxY, pos.y + 380);
    }

    svg.setAttribute("viewBox", `0 0 ${maxX + 50} ${maxY + 50}`);

    wrapper.appendChild(svg);
    return wrapper;
  }

  container.appendChild(createLayoutPreview(source, solutionId));
  container.appendChild(createLayoutPreview(target, solutionId));
}
