(function () {
  "use strict";

  /* ===========================
     INTERNAL JSON DATA
  =========================== */

 const OBJECTS_DATA = [
  { id: 19, name: "Flower", src: "assets-2/flower-new.svg", symmetry: 5 },
  { id: 13, name: "Swastik", src: "assets-2/swasktik-new.svg", symmetry: 4 },
  { id: 12, name: "Fidget Spinner", src: "assets-2/fidget-spinner-new.svg", symmetry: 6 },
  { id: 1, name: "Kite", src: "assets-2/kite-main-new.svg", symmetry: 1 },

  { id: 22, name: "Nut", src: "assets-2/nut-new.svg", symmetry: 6 },
  { id: 4, name: "Rectangle", src: "assets-2/rectangle-new.svg", symmetry: 2 },
  { id: 9, name: "X", src: "assets-2/x-new.svg", symmetry: 2 },
  { id: 20, name: "Regular Hexagon", src: "assets-2/hexagon-new.svg", symmetry: 6 },
  { id: 7, name: "Oval", src: "assets-2/oval-new.svg", symmetry: 2 },
  { id: 11, name: "Recycling Symbol", src: "assets-2/recycling-new.svg", symmetry: 3 },
  { id: 25, name: "Ninja Star", src: "assets-2/ninja-star-new.svg", symmetry: 8 },
  { id: 6, name: "Rhombus", src: "assets-2/rhombus-new.svg", symmetry: 2 },
  { id: 2, name: "Key", src: "assets-2/key-new.svg", symmetry: 1 },
  { id: 15, name: "Four-pointed Star", src: "assets-2/four-pointed-star-new.svg", symmetry: 4 },
  { id: 3, name: "Trapezoid", src: "assets-2/trapezoid-new-main.svg", symmetry: 1 },
  { id: 5, name: "Parallelogram", src: "assets-2/parallelogram-new.svg", symmetry: 2 },
  { id: 14, name: "Square", src: "assets-2/square-new.svg", symmetry: 4 },

  // { id: 8, name: "H", src: "assets-2/h-new.svg", symmetry: 2 },
  // { id: 10, name: "Equilateral Triangle", src: "assets-2/equilateral-triangle-new.svg", symmetry: 3 },
  // { id: 16, name: "Windmill", src: "assets-2/windmill-new.svg", symmetry: 4 },
  // { id: 17, name: "Regular Pentagon", src: "assets-2/pentagon-new.svg", symmetry: 5 },
  // { id: 18, name: "Starfish", src: "assets-2/starfish-new.svg", symmetry: 5 },
  // { id: 21, name: "Snowflake", src: "assets-2/snowflake-new.svg", symmetry: 6 },
  // { id: 23, name: "Regular Heptagon", src: "assets-2/heptagon-new.svg", symmetry: 7 },
  // { id: 24, name: "Stop Sign", src: "assets-2/stop-sign-new.svg", symmetry: 8 },
  // { id: 26, name: "Gears", src: "assets-2/gears-new.svg", symmetry: 9 },
  // { id: 27, name: "Regular Nonagon", src: "assets-2/nonagon-new.svg", symmetry: 9 },
  // { id: 28, name: "Regular Decagon", src: "assets-2/decagon-new.svg", symmetry: 10 },
];

  let currentObjectIndex = 0;
  let OBJECT = OBJECTS_DATA[currentObjectIndex];

  /* ===========================
     ELEMENTS
  =========================== */
  const rotatingImage = document.getElementById("rotating-image");
  const referenceImage = document.getElementById("reference-image");
  const slider = document.getElementById("ploygon-slider");

  const degreeText = document.getElementById("degree-rotation-value-raw");
  const symmetryText = document.getElementById("symmetry-container-value-raw");
  const correctOrderText = document.getElementById("correct-order-value-raw");
  const objectNameText = document.getElementById("object-name-value-raw");
  const matchesText = document.getElementById("matches-order-value-raw");

  const incrementBtn = document.getElementById("increment-btn");
  const rotationGroup = document.getElementById("rotation-group");

  let rotationCenter = { x: 0, y: 0 };
  
  const decrementBtn = document.getElementById("decrement-btn");
  const resetBtn = document.getElementById("reset-btn");
  const checkAnswerBtn = document.getElementById("check-answer-btn");
  const showAnswerBtn = document.getElementById("show-answer-btn");
  const nextObjectBtn = document.getElementById("next-object-btn");
  const nextCircleButton = document.getElementById("next-circle-btn");

  const showAnswerFeedback = document.getElementById("show-answer-feedback");
  const correctFeedback = document.getElementById("show-correct-feedback");
  const incorrectFeedback = document.getElementById("show-incorrect-feedback");

  if (!rotatingImage || !slider) return;

  /* ===========================
     SLIDER RANGE
  =========================== */
  const SLIDER_MIN_X = 287;
  const SLIDER_MAX_X = 910;
  const SLIDER_RANGE = SLIDER_MAX_X - SLIDER_MIN_X;

  /* ===========================
     STATE
  =========================== */
  let isDragging = false;
  let currentAngle = 0;
  let userSymmetryOrder = 0;

  /* ===========================
     HELPERS
  =========================== */
  function getClientX(e) {
    if (e.touches && e.touches.length) return e.touches[0].clientX;
    return e.clientX;
  }

  function hideMatchText() {
    if (matchesText) {
      matchesText.textContent = "";
      matchesText.style.display = "none";
    }
  }

  function getRotationCenter(element) {
  const svg = element.ownerSVGElement;

  const bbox = element.getBoundingClientRect();
  const svgRect = svg.getBoundingClientRect();

  const cx = bbox.left + bbox.width / 2;
  const cy = bbox.top + bbox.height / 2;

  const pt = svg.createSVGPoint();
  pt.x = cx;
  pt.y = cy;

  const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());
  return { x: svgPoint.x, y: svgPoint.y };
}


  function hideCorrectOrder() {
    if (correctOrderText) {
      correctOrderText.textContent = "";
      correctOrderText.style.display = "none";
    }
  }

  function hideAllFeedback() {
    showAnswerFeedback && (showAnswerFeedback.style.display = "none");
    correctFeedback && (correctFeedback.style.display = "none");
    incorrectFeedback && (incorrectFeedback.style.display = "none");
  }

  function showMatchText() {
    hideAllFeedback();
    hideCorrectOrder();
    if (matchesText) {
      matchesText.textContent = "It matches the original figure!";
      matchesText.style.display = "block";
    }
  }

  /* ===========================
     INIT OBJECT
  =========================== */

function initObject() {
  OBJECT = OBJECTS_DATA[currentObjectIndex];

  rotatingImage.src = OBJECT.src;
  referenceImage && (referenceImage.src = OBJECT.src);
  objectNameText && (objectNameText.textContent = OBJECT.name);

  currentAngle = 0;
  userSymmetryOrder = 0;

  requestAnimationFrame(() => {
    rotationCenter = getRotationCenter(rotationGroup);
    setRotation(0);
  });

  setSliderByAngle(0);
  updateSymmetryUI();

  hideMatchText();
  hideCorrectOrder();
  hideAllFeedback();
}

  /* ===========================
     ROTATION
  =========================== */
function setRotation(angle) {
  currentAngle = angle;

  rotationGroup.setAttribute(
    "transform",
    `rotate(${angle} ${rotationCenter.x} ${rotationCenter.y})`
  );

  degreeText && (degreeText.textContent = `${Math.round(angle)}°`);
}


  function setSliderByAngle(angle) {
    slider.setAttribute("x", SLIDER_MIN_X + (angle / 360) * SLIDER_RANGE);
  }

  function snapAngle(angle) {
    const step = 360 / OBJECT.symmetry;
    return Math.round(angle / step) * step;
  }

  function checkRotationMatch() {
    const step = 360 / OBJECT.symmetry;
    const remainder = Math.abs(currentAngle % step);

    if (remainder < 0.5 || Math.abs(remainder - step) < 0.5) {
      showMatchText();
    }
  }

  /* ===========================
     SYMMETRY UI
  =========================== */
  const SYMMETRY_BASE_X = Number(symmetryText.getAttribute("x"));

  function updateSymmetryUI() {
    userSymmetryOrder = Math.max(0, Math.min(99, userSymmetryOrder));
    symmetryText.textContent = userSymmetryOrder;

    symmetryText.setAttribute(
      "x",
      userSymmetryOrder >= 10 ? SYMMETRY_BASE_X - 5 : SYMMETRY_BASE_X
    );
  }

  /* ===========================
     SLIDER DRAG (MOUSE + TOUCH)
  =========================== */
  function onPointerMove(e) {
    if (!isDragging) return;

    const svg = slider.ownerSVGElement;
    const pt = svg.createSVGPoint();
    pt.x = getClientX(e);
    pt.y = 0;

    const cursor = pt.matrixTransform(svg.getScreenCTM().inverse());
    const x = Math.max(SLIDER_MIN_X, Math.min(cursor.x, SLIDER_MAX_X));
    const angle = ((x - SLIDER_MIN_X) / SLIDER_RANGE) * 360;

    slider.setAttribute("x", x);
    setRotation(angle);
  }




  function stopDrag() {
    if (!isDragging) return;
    isDragging = false;

    const snapped = snapAngle(currentAngle);
    setRotation(snapped);
    setSliderByAngle(snapped);
    checkRotationMatch();

    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", stopDrag);
    window.removeEventListener("touchmove", onPointerMove);
    window.removeEventListener("touchend", stopDrag);
    window.removeEventListener("mousemove", onPointerMove);
    window.removeEventListener("mouseup", stopDrag);
  }

  function startDrag(e) {
    e.preventDefault();
    hideMatchText();
    isDragging = true;

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopDrag);
    window.addEventListener("touchmove", onPointerMove, { passive: false });
    window.addEventListener("touchend", stopDrag);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", stopDrag);
  }

  slider.addEventListener("pointerdown", startDrag);
  slider.addEventListener("touchstart", startDrag, { passive: false });
  slider.addEventListener("mousedown", startDrag);

  /* ===========================
     BUTTONS
  =========================== */
  incrementBtn?.addEventListener("click", () => {
    hideMatchText();
    hideCorrectOrder();
    hideAllFeedback();

    userSymmetryOrder++;
    updateSymmetryUI();
  });

  decrementBtn?.addEventListener("click", () => {
    hideMatchText();
    hideCorrectOrder();
    hideAllFeedback();

    userSymmetryOrder--;
    updateSymmetryUI();
  });

  resetBtn?.addEventListener("click", initObject);

  checkAnswerBtn?.addEventListener("click", () => {
    hideMatchText();
    hideCorrectOrder();
    hideAllFeedback();

    if (userSymmetryOrder === OBJECT.symmetry) {
      correctFeedback && (correctFeedback.style.display = "block");
    } else {
      incorrectFeedback && (incorrectFeedback.style.display = "block");
    }
  });

  showAnswerBtn?.addEventListener("click", () => {
    hideMatchText();
    hideAllFeedback();

    showAnswerFeedback && (showAnswerFeedback.style.display = "block");
    correctOrderText.textContent = OBJECT.symmetry;
    correctOrderText.style.display = "block";
  });

  nextObjectBtn?.addEventListener("click", (evt) => {
      evt.stopPropagation();
    currentObjectIndex = (currentObjectIndex + 1) % OBJECTS_DATA.length;
    initObject();
  });


  nextCircleButton?.addEventListener("click", (evt) => {
  
    currentObjectIndex = (currentObjectIndex + 1) % OBJECTS_DATA.length;
    initObject();
  });

  /* ===========================
     INIT
  =========================== */
  initObject();
})();


        