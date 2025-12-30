/**
 * Interactive Angle Explorer v12.1 (UI Layout Adjustments)
 *
 * - Shifted the main diagram (roads, angles, scenery) upwards to prevent overlap with the bottom tabs.
 * - Repositioned the "Help" button to be dynamically aligned above the first tab.
 */

// --- CONFIGURATION ---
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 500;

// Colors
const ROAD_OUTER_COLOR = '#6c757d';
const ROAD_INNER_COLOR = '#adb5bd';
const ROAD_DASH_COLOR = '#ffffff';
const INTERSECTION_BG_COLOR = [204, 193, 221, 100];
const ANGLE_HOVER_COLOR = [135, 114, 169, 200];
const ANGLE_SELECTED_COLOR = [108, 83, 148];
const ADJACENT_DRAG_COLOR = [227, 63, 95, 200]; // Red for adjacent
const ANGLE_PRIMED_COLOR = [108, 83, 148, 220];
const ANGLE_DRAG_COLOR = [108, 83, 148, 180];
const ANGLE_SNAP_COLOR = [42, 157, 143];
const ANGLE_DISABLED_COLOR = [200, 200, 200, 100];
const PRIMARY_TEXT_COLOR = [52, 58, 64];
const TAB_BG_COLOR = [248, 249, 250];
const TAB_BORDER_COLOR = [222, 226, 230];
const TAB_HOVER_COLOR = [233, 236, 239];
const TAB_ACTIVE_BG_COLOR = [108, 83, 148];
const TAB_TEXT_COLOR = [73, 80, 87];
const EXPLAIN_BORDER_COLOR = [108, 83, 148];
const HELP_BUTTON_COLOR = [0, 119, 182];

// --- STATE VARIABLES ---
let parallel1, parallel2, transversal;
let intersection1, intersection2;
let allAngles = [];
let scenery = [];

let selectedAngle = null;
let draggedAngle = null;
let primedState = null;
let isDragging = false;
let dragPhase = '';
let snapCorrect = false;
let snappedTargetId = -1;

let currentMode = 'VERTICAL';
let angleModes = [];
let explanations;

let tabs = [];

let helpButton; // MODIFIED: Declared here, but defined in setupTabs()
let isAutoSolving = false;
let autoSolveState = {};
const ANIMATION_DURATION = 1500; // ms for each phase

function setup() {
 const canvas = createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
        canvas.parent('p5-container');
  angleMode(RADIANS);

  angleModes = [
    { label: 'Vertically Opposite', mode: 'VERTICAL' },
    { label: 'Corresponding', mode: 'CORRESPONDING' },
    { label: 'Alternate Interior', mode: 'ALTERNATE_INTERIOR' },
    { label: 'Alternate Exterior', mode: 'ALTERNATE_EXTERIOR' },
    { label: 'Supplementary', mode: 'SUPPLEMENTARY' }
  ];

  explanations = {
    'VERTICAL': 'When two lines cross, the angles directly opposite each other are called vertically opposite angles. They are always equal.',
    'CORRESPONDING': 'Corresponding angles are in the same position at each intersection. When the lines are parallel, these angles are always equal.',
    'ALTERNATE_INTERIOR': 'Alternate interior angles are on opposite sides of the transversal and are *between* the two parallel lines. They are always equal.',
    'ALTERNATE_EXTERIOR': 'Alternate exterior angles are on opposite sides of the transversal and are *outside* the two parallel lines. They are always equal.',
    'SUPPLEMENTARY': 'Angles that form a straight line (180°) are supplementary. Here, moving the adjacent angle shows that consecutive interior angles are supplementary.'
  };
  
  setupTabs();
  setupGeometryAndAngles();
  setupScenery();
}

function setupTabs() {
    tabs = [];
    const tabHeight = 40;
    const tabPadding = 20;
    const tabSpacing = 10;
    const yPos = CANVAS_HEIGHT - 55;

    let totalWidth = 0;
    textSize(14);
    textStyle(BOLD);
    for (const mode of angleModes) {
        totalWidth += textWidth(mode.label) + tabPadding * 2;
    }
    totalWidth += tabSpacing * (angleModes.length - 1);

    let currentX = (CANVAS_WIDTH - totalWidth) / 2;

    for (const mode of angleModes) {
        const tabWidth = textWidth(mode.label) + tabPadding * 2;
        tabs.push({
            x: currentX, y: yPos, w: tabWidth, h: tabHeight,
            label: mode.label, mode: mode.mode
        });
        currentX += tabWidth + tabSpacing;
    }
    textStyle(NORMAL);
    
    // MODIFIED: Help button is now positioned relative to the first tab
    if (tabs.length > 0) {
        helpButton = {
            x: tabs[0].x,
            y: tabs[0].y - 40, // Positioned 10px above the tab (30px button height + 10px gap)
            w: 50,
            h: 30,
            label: 'Help'
        };
    }
}


function draw() {
  background('#f8f9fa');
  updateCursor();

  drawScenery();
  drawRoad(parallel1);
  drawRoad(parallel2);
  drawRoad(transversal);

  drawIntersection(intersection1);
  drawIntersection(intersection2);

  if (isAutoSolving) {
    updateAndDrawAutoSolve();
  } else if (draggedAngle && isDragging) {
    const color = (dragPhase === 'SLIDE_SUPPLEMENTARY') ? ADJACENT_DRAG_COLOR : ANGLE_DRAG_COLOR;
    drawAngle(draggedAngle, color);
  } else if (primedState && currentMode.includes('ALTERNATE')) {
    drawAngle(primedState.rotatedCopy, ANGLE_PRIMED_COLOR);
  } else if (snapCorrect) {
    if (currentMode === 'SUPPLEMENTARY' && selectedAngle) {
      const snappedAngle = allAngles.find(a => a.id === snappedTargetId);
      drawAngle(selectedAngle, ANGLE_SELECTED_COLOR);
      let finalPartner = { ...draggedAngle, pos: snappedAngle.pos };
      drawAngle(finalPartner, ANGLE_SNAP_COLOR);
    } else if (selectedAngle) {
      const finalAngle = allAngles.find(a => a.id === snappedTargetId);
      drawAngle(selectedAngle, ANGLE_SELECTED_COLOR);
      let displayAngle = { ...finalAngle };
      if (currentMode.includes('ALTERNATE')) {
        const original = allAngles.find(a => a.id === selectedAngle.id);
        displayAngle = { ...original, pos: finalAngle.pos, rotation: PI };
      }
      drawAngle(displayAngle, ANGLE_SNAP_COLOR);
    }
  }

  drawInstructions();
  drawHelpButton();
  drawTabs();

  if (snapCorrect) {
    drawExplanationBox();
  }
}

// MODIFIED: All Y coordinates shifted up by 50px
function setupScenery() {
  scenery.push({ type: 'tree', x: 350, y: 50 });
  scenery.push({ type: 'tree', x: 830, y: 350 });
  scenery.push({ type: 'bush', x: 800, y: 70 });
  scenery.push({ type: 'tree', x: 400, y: 350 });
}

// MODIFIED: All Y coordinates shifted up by 50px
function setupGeometryAndAngles() {
  allAngles = [];
  const diagram = { x: 300, w: 580, angleRadius: 70 };
  const yOffset = 50; // Amount to move everything up

  parallel1 = { x1: diagram.x, y1: 170 - yOffset, x2: diagram.x + diagram.w, y2: 170 - yOffset };
  parallel2 = { x1: diagram.x, y1: 330 - yOffset, x2: diagram.x + diagram.w, y2: 330 - yOffset };
  transversal = { x1: random(diagram.x + 100, diagram.x + 250), y1: 40 - yOffset, x2: random(diagram.x + 300, diagram.x + 450), y2: 460 - yOffset };

  intersection1 = lineLineIntersection(parallel1, transversal);
  intersection2 = lineLineIntersection(parallel2, transversal);

  if (!intersection1 || !intersection2) {
    setupGeometryAndAngles();
    return;
  }

  let transAngle = atan2(transversal.y2 - transversal.y1, transversal.x2 - transversal.x1);

  [intersection1, intersection2].forEach((intersection, i) => {
    let anglesData = [
      { start: PI, end: PI + transAngle }, { start: PI + transAngle, end: TWO_PI },
      { start: 0, end: transAngle }, { start: transAngle, end: PI }
    ];
    anglesData.forEach((data, j) => {
      const id = i * 4 + j;
      let otherI = (i === 0) ? 1 : 0;

      let alternateInteriorTarget = -1;
      if (i === 0 && j === 2) alternateInteriorTarget = 5;
      if (i === 0 && j === 3) alternateInteriorTarget = 4;
      if (i === 1 && j === 0) alternateInteriorTarget = 3;
      if (i === 1 && j === 1) alternateInteriorTarget = 2;

      let alternateExteriorTarget = -1;
      if (i === 0 && j === 0) alternateExteriorTarget = 7;
      if (i === 0 && j === 1) alternateExteriorTarget = 6;
      if (i === 1 && j === 2) alternateExteriorTarget = 1;
      if (i === 1 && j === 3) alternateExteriorTarget = 0;

      allAngles.push({
        id: id, pos: intersection, start: data.start, end: data.end, radius: diagram.angleRadius, rotation: 0,
        isOppositeOf: i * 4 + ((j + 2) % 4),
        isCorrespondingTo: otherI * 4 + j,
        isAlternateInteriorTo: alternateInteriorTarget,
        isAlternateExteriorTo: alternateExteriorTarget,
        isSupplementaryTo: i * 4 + ((j + 1) % 4),
      });
    });
  });
}

// --- DRAWING HELPERS ---

function drawScenery() {
  scenery.forEach(item => {
    if (item.type === 'tree') drawTree(item.x, item.y);
    if (item.type === 'bush') drawBush(item.x, item.y);
  });
}

function drawTree(x, y) {
  noStroke();
  fill(87, 58, 46); rect(x - 5, y, 10, 25);
  fill(34, 139, 34, 200);
  circle(x, y - 10, 40); circle(x - 12, y - 5, 30); circle(x + 12, y - 5, 30);
}

function drawBush(x, y) {
  noStroke();
  fill(34, 139, 34, 180);
  circle(x, y, 30); circle(x - 10, y + 5, 25); circle(x + 10, y + 5, 25);
}

function drawRoad(lineDef) {
  stroke(ROAD_OUTER_COLOR); strokeWeight(20); line(lineDef.x1, lineDef.y1, lineDef.x2, lineDef.y2);
  stroke(ROAD_INNER_COLOR); strokeWeight(15); line(lineDef.x1, lineDef.y1, lineDef.x2, lineDef.y2);
  stroke(ROAD_DASH_COLOR); strokeWeight(2); drawingContext.setLineDash([10, 15]);
  line(lineDef.x1, lineDef.y1, lineDef.x2, lineDef.y2);
  drawingContext.setLineDash([]);
}

function drawIntersection(pos) {
  fill(INTERSECTION_BG_COLOR); noStroke();
  if (allAngles.length > 0) circle(pos.x, pos.y, allAngles[0].radius * 2);

  let anglesInIntersection = allAngles.filter(a => a.pos === pos);
  anglesInIntersection.forEach(angle => {
    let isDisabled =
      (currentMode === 'ALTERNATE_INTERIOR' && angle.isAlternateInteriorTo === -1) ||
      (currentMode === 'ALTERNATE_EXTERIOR' && angle.isAlternateExteriorTo === -1);

    if (isDisabled) {
      drawAngle(angle, ANGLE_DISABLED_COLOR);
      return;
    }

    if (snapCorrect && selectedAngle && (angle.id === selectedAngle.id || angle.id === snappedTargetId)) {
      return;
    }

    if (isAutoSolving) return;

    let colorToDraw = null;
    if (primedState && currentMode === 'SUPPLEMENTARY') {
      if (angle.id === primedState.selectedAngle.id) colorToDraw = ANGLE_SELECTED_COLOR;
      else if (angle.id === primedState.partnerAngle.id) colorToDraw = ADJACENT_DRAG_COLOR;
    } else if (primedState && currentMode.includes('ALTERNATE')) {
      if (angle.id === primedState.original.id) {
        colorToDraw = ANGLE_SELECTED_COLOR;
      }
    } else if (isMouseInAngle(angle) && !isDragging && !primedState) {
      colorToDraw = ANGLE_HOVER_COLOR;
    } else if (selectedAngle && !primedState && angle.id === selectedAngle.id) {
      colorToDraw = ANGLE_SELECTED_COLOR;
    }

    if (colorToDraw) {
      drawAngle(angle, colorToDraw);
    }
  });
}

function drawAngle(angle, color) {
  push();
  translate(angle.pos.x, angle.pos.y);
  rotate(angle.rotation);

  drawingContext.shadowBlur = 10;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.2)';
  fill(color);
  noStroke();
  arc(0, 0, angle.radius * 2, angle.radius * 2, angle.start, angle.end);

  drawingContext.shadowBlur = 0;
  pop();
}

function drawTabs() {
    for (const tab of tabs) {
        const isActive = (tab.mode === currentMode);
        const isHovered = isHovering(tab);

        if (isActive) {
            fill(TAB_ACTIVE_BG_COLOR);
            noStroke();
        } else if (isHovered) {
            fill(TAB_HOVER_COLOR);
            stroke(TAB_BORDER_COLOR);
            strokeWeight(1);
        } else {
            fill(TAB_BG_COLOR);
            stroke(TAB_BORDER_COLOR);
            strokeWeight(1);
        }
        
        rect(tab.x, tab.y, tab.w, tab.h, 20);

        noStroke();
        fill(isActive ? 255 : TAB_TEXT_COLOR);
        textAlign(CENTER, CENTER);
        textSize(14);
        textStyle(BOLD);
        text(tab.label, tab.x + tab.w / 2, tab.y + tab.h / 2);
    }
    textStyle(NORMAL);
}

function drawHelpButton() {
  if (!helpButton) return; // Don't draw if not initialized yet
  const b = helpButton;
  if (isHovering(b)) {
    fill(1, 67, 98);
    stroke(EXPLAIN_BORDER_COLOR);
    strokeWeight(2);
  } else {
    fill(HELP_BUTTON_COLOR);
    noStroke();
  }
  rect(b.x, b.y, b.w, b.h, 8);

  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  textSize(14);
  text(b.label, b.x + b.w / 2, b.y + b.h / 2);
}

function drawInstructions() {
  let title = "Angle Explorer";
  noStroke(); textAlign(LEFT, TOP); fill(PRIMARY_TEXT_COLOR);
  textSize(24); textStyle(BOLD); text(title, 30, 20);

  let instruction = "Select an angle type below, then choose an angle to explore.";
  if (isAutoSolving) {
    instruction = "Watch the demonstration to see how the angles are related.";
  } else if (primedState) {
    if (currentMode === 'SUPPLEMENTARY') {
      instruction = "Now click the red adjacent angle to drag it.";
    } else {
      instruction = "Now click the glowing angle and drag it.";
    }
  } else if (isDragging) {
    if (currentMode === 'VERTICAL') instruction = "Rotate the angle to its opposite position.";
    if (currentMode === 'CORRESPONDING') instruction = "Drag the angle along the line.";
    if (currentMode.includes('ALTERNATE')) instruction = "Step 1: Rotate the angle 180 degrees.";
    if (currentMode === 'SUPPLEMENTARY') instruction = "Drag the red angle to its corresponding spot on the other line.";
  }
  if (snapCorrect) {
    instruction = `Correct! Click anywhere to reset.`;
  }

  fill(108, 117, 125); textSize(14); textStyle(NORMAL);
  text(instruction, 30, 60, 220);
}

function drawExplanationBox() {
  const msgBox = { x: 30, y: 110, w: 220, h: 200 };
  fill(255);
  stroke(EXPLAIN_BORDER_COLOR);
  strokeWeight(2);
  rect(msgBox.x, msgBox.y, msgBox.w, msgBox.h, 8);

  const title = "Explanation";
  noStroke();
  fill(EXPLAIN_BORDER_COLOR);
  textAlign(LEFT, TOP);
  textStyle(BOLD);
  textSize(16);
  text(title, msgBox.x + 15, msgBox.y + 15);

  fill(PRIMARY_TEXT_COLOR);
  textSize(14);
  textStyle(NORMAL);
  text(explanations[currentMode], msgBox.x + 15, msgBox.y + 45, msgBox.w - 30);
}

// --- INTERACTIVITY & LOGIC ---

function isMouseInAngle(angle) {
  if (!angle) return false;

  let mouseVec = createVector(mouseX - angle.pos.x, mouseY - angle.pos.y);
  mouseVec.rotate(-angle.rotation);
  const d = mouseVec.mag();

  if (d > angle.radius) return false;

  let mouseAngle = atan2(mouseVec.y, mouseVec.x);
  if (mouseAngle < 0) mouseAngle += TWO_PI;

  let start = angle.start % TWO_PI;
  let end = angle.end % TWO_PI;

  if (start < end) return mouseAngle >= start && mouseAngle <= end;
  else return mouseAngle >= start || mouseAngle <= end;
}

function isHovering(element) {
  if (!element) return false;
  return mouseX > element.x && mouseX < element.x + element.w && mouseY > element.y && mouseY < element.y + element.h;
}

function updateCursor() {
  if (isAutoSolving) { cursor(ARROW); return; }
  if (snapCorrect) { cursor(HAND); return; }
  if (isHovering(helpButton)) { cursor(HAND); return; }

  for (const tab of tabs) {
      if (isHovering(tab) && tab.mode !== currentMode) {
          cursor(HAND);
          return;
      }
  }

  if (primedState) {
    if (currentMode === 'SUPPLEMENTARY' && isMouseInAngle(primedState.partnerAngle)) { cursor(HAND); return; }
    if (currentMode.includes('ALTERNATE') && isMouseInAngle(primedState.rotatedCopy)) { cursor(HAND); return; }
  }

  let isDisabled = false;
  for (const angle of allAngles) {
    if (isMouseInAngle(angle)) {
      isDisabled =
        (currentMode === 'ALTERNATE_INTERIOR' && angle.isAlternateInteriorTo === -1) ||
        (currentMode === 'ALTERNATE_EXTERIOR' && angle.isAlternateExteriorTo === -1);
      if (!primedState && !isDisabled) {
        cursor(HAND);
        return;
      }
    }
  }
  cursor(ARROW);
}

function mousePressed() {
  if (isAutoSolving) return;
  if (snapCorrect) { fullReset(); return; }

  if (isHovering(helpButton)) {
    startAutoSolve();
    return;
  }

  for (const tab of tabs) {
      if (isHovering(tab)) {
          if (currentMode !== tab.mode) {
              currentMode = tab.mode;
              fullReset();
          }
          return;
      }
  }

  if (primedState) {
    if (currentMode === 'SUPPLEMENTARY' && isMouseInAngle(primedState.partnerAngle)) {
      isDragging = true;
      dragPhase = 'SLIDE_SUPPLEMENTARY';
      selectedAngle = primedState.selectedAngle;
      draggedAngle = { ...primedState.partnerAngle };
      primedState = null;
    } else if (currentMode.includes('ALTERNATE') && isMouseInAngle(primedState.rotatedCopy)) {
      isDragging = true;
      dragPhase = 'SLIDE_ALTERNATE';
      draggedAngle = { ...primedState.rotatedCopy };
      primedState = null;
    }
    return;
  }

  if (!isDragging) {
    for (const angle of allAngles) {
      if (isMouseInAngle(angle)) {
        let isDisabled =
          (currentMode === 'ALTERNATE_INTERIOR' && angle.isAlternateInteriorTo === -1) ||
          (currentMode === 'ALTERNATE_EXTERIOR' && angle.isAlternateExteriorTo === -1);
        if (isDisabled) continue;

        if (currentMode === 'SUPPLEMENTARY') {
          const partner = allAngles.find(a => a.id === angle.isSupplementaryTo);
          primedState = { selectedAngle: angle, partnerAngle: partner };
          selectedAngle = angle;
        } else {
          isDragging = true;
          selectedAngle = angle;
          draggedAngle = { ...angle };
          if (currentMode.includes('ALTERNATE') || currentMode === 'VERTICAL') {
            dragPhase = 'ROTATE';
          } else if (currentMode === 'CORRESPONDING') {
            dragPhase = 'SLIDE_CORRESPONDING';
          }
        }
        break;
      }
    }
  }
}

function mouseDragged() {
  if (isAutoSolving || !isDragging || !draggedAngle) return;

  if (dragPhase === 'ROTATE') {
    let mouseAngle = atan2(mouseY - selectedAngle.pos.y, mouseX - selectedAngle.pos.x);
    let initialAngle = (draggedAngle.start + draggedAngle.end) / 2;
    draggedAngle.rotation = mouseAngle - initialAngle;
  } else if (dragPhase.includes('SLIDE')) {
    let lineStart = createVector(transversal.x1, transversal.y1);
    let lineEnd = createVector(transversal.x2, transversal.y2);
    let mousePos = createVector(mouseX, mouseY);
    let lineVec = p5.Vector.sub(lineEnd, lineStart);
    let pointVec = p5.Vector.sub(mousePos, lineStart);

    lineVec.normalize();
    let projectionLength = pointVec.dot(lineVec);
    let totalLineLength = dist(lineStart.x, lineStart.y, lineEnd.x, lineEnd.y);
    projectionLength = constrain(projectionLength, 0, totalLineLength);
    let newPos = p5.Vector.add(lineStart, lineVec.mult(projectionLength));
    draggedAngle.pos = newPos;
  }
}

function mouseReleased() {
  if (isAutoSolving || !isDragging || !draggedAngle) { isDragging = false; return; }

  const rotationTolerance = 0.2;
  const targetRotation = PI;
  let snapDistance = 30;

  if (dragPhase === 'ROTATE') {
    if (abs(abs(draggedAngle.rotation) - targetRotation) < rotationTolerance) {
      if (currentMode.includes('ALTERNATE')) {
        primedState = { original: selectedAngle, rotatedCopy: { ...selectedAngle, rotation: PI } };
      } else {
        snapCorrect = true; snappedTargetId = selectedAngle.isOppositeOf;
      }
    } else { softReset(); }
  } else if (dragPhase === 'SLIDE_CORRESPONDING') {
    const targetAngle = allAngles.find(a => a.id === selectedAngle.isCorrespondingTo);
    if (targetAngle && dist(draggedAngle.pos.x, draggedAngle.pos.y, targetAngle.pos.x, targetAngle.pos.y) < snapDistance) {
      snapCorrect = true; snappedTargetId = selectedAngle.isCorrespondingTo;
    } else { softReset(); }
  } else if (dragPhase === 'SLIDE_ALTERNATE') {
    let targetId = (currentMode === 'ALTERNATE_INTERIOR') ? selectedAngle.isAlternateInteriorTo : selectedAngle.isAlternateExteriorTo;
    const targetAngle = allAngles.find(a => a.id === targetId);
    if (targetAngle && dist(draggedAngle.pos.x, draggedAngle.pos.y, targetAngle.pos.x, targetAngle.pos.y) < snapDistance) {
      snapCorrect = true; snappedTargetId = targetId;
    } else {
      primedState = { original: selectedAngle, rotatedCopy: { ...selectedAngle, rotation: PI } };
    }
  } else if (dragPhase === 'SLIDE_SUPPLEMENTARY') {
    const originalDraggedAngle = allAngles.find(a => a.id === draggedAngle.id);
    const targetAngle = allAngles.find(a => a.id === originalDraggedAngle.isCorrespondingTo);

    if (targetAngle && dist(draggedAngle.pos.x, draggedAngle.pos.y, targetAngle.pos.x, targetAngle.pos.y) < snapDistance) {
      snapCorrect = true;
      snappedTargetId = targetAngle.id;
    } else {
      softReset();
    }
  }

  isDragging = false;
  if (!primedState && !snapCorrect) {
    draggedAngle = null;
  }
}

function fullReset() {
  snapCorrect = false;
  selectedAngle = null;
  snappedTargetId = -1;
  primedState = null;
  draggedAngle = null;
  isDragging = false;
  dragPhase = '';
  isAutoSolving = false;
  autoSolveState = {};
  setupGeometryAndAngles();
}

function softReset() {
  draggedAngle = null;
  isDragging = false;
  dragPhase = '';
  selectedAngle = null;
  primedState = null;
}

function lineLineIntersection(line1, line2) {
  const den = (line1.x1 - line1.x2) * (line2.y1 - line2.y2) - (line1.y1 - line1.y2) * (line2.x1 - line2.x2);
  if (den === 0) return null;
  const t = ((line1.x1 - line2.x1) * (line2.y1 - line2.y2) - (line1.y1 - line2.y1) * (line2.x1 - line2.x2)) / den;
  const u = -((line1.x1 - line1.x2) * (line1.y1 - line2.y1) - (line1.y1 - line1.y2) * (line1.x1 - line2.x1)) / den;
  if (t > 0 && t < 1 && u > 0) return createVector(line1.x1 + t * (line1.x2 - line1.x1), line1.y1 + t * (line1.y2 - line1.y1));
  return null;
}

// --- AUTO-SOLVE ANIMATION LOGIC ---

function startAutoSolve() {
  if (isAutoSolving) return;
  fullReset();
  isAutoSolving = true;

  let startAngle, targetAngle;

  switch (currentMode) {
    case 'VERTICAL':
      startAngle = allAngles[0];
      targetAngle = allAngles.find(a => a.id === startAngle.isOppositeOf);
      autoSolveState = {
        phase: 1, startTime: millis(), startAngle: startAngle,
        targetAngle: targetAngle, animatedAngle: { ...startAngle },
      };
      break;
    case 'CORRESPONDING':
      startAngle = allAngles[0];
      targetAngle = allAngles.find(a => a.id === startAngle.isCorrespondingTo);
      autoSolveState = {
        phase: 1, startTime: millis(), startAngle: startAngle,
        targetAngle: targetAngle, animatedAngle: { ...startAngle },
      };
      break;
    case 'ALTERNATE_INTERIOR':
      startAngle = allAngles.find(a => a.isAlternateInteriorTo !== -1);
      targetAngle = allAngles.find(a => a.id === startAngle.isAlternateInteriorTo);
      autoSolveState = {
        phase: 1, startTime: millis(), startAngle: startAngle,
        targetAngle: targetAngle, animatedAngle: { ...startAngle },
      };
      break;
    case 'ALTERNATE_EXTERIOR':
      startAngle = allAngles.find(a => a.isAlternateExteriorTo !== -1);
      targetAngle = allAngles.find(a => a.id === startAngle.isAlternateExteriorTo);
      autoSolveState = {
        phase: 1, startTime: millis(), startAngle: startAngle,
        targetAngle: targetAngle, animatedAngle: { ...startAngle },
      };
      break;
    case 'SUPPLEMENTARY':
      startAngle = allAngles[0];
      let partnerAngle = allAngles.find(a => a.id === startAngle.isSupplementaryTo);
      targetAngle = allAngles.find(a => a.id === partnerAngle.isCorrespondingTo);
      autoSolveState = {
        phase: 1, startTime: millis(), startAngle: startAngle,
        partnerAngle: partnerAngle, targetAngle: targetAngle, animatedAngle: { ...partnerAngle }
      };
      break;
  }
}

function updateAndDrawAutoSolve() {
  let state = autoSolveState;
  let elapsed = millis() - state.startTime;
  let progress = constrain(elapsed / ANIMATION_DURATION, 0, 1);
  let easedProgress = progress < 0.5 ? 2 * progress * progress : 1 - pow(-2 * progress + 2, 2) / 2;

  switch (currentMode) {
    case 'VERTICAL':
      drawAngle(state.startAngle, ANGLE_SELECTED_COLOR);
      state.animatedAngle.rotation = lerp(0, PI, easedProgress);
      drawAngle(state.animatedAngle, ANGLE_DRAG_COLOR);
      if (progress >= 1) finishAutoSolve();
      break;
    case 'CORRESPONDING':
      drawAngle(state.startAngle, ANGLE_SELECTED_COLOR);
      state.animatedAngle.pos = p5.Vector.lerp(state.startAngle.pos, state.targetAngle.pos, easedProgress);
      drawAngle(state.animatedAngle, ANGLE_DRAG_COLOR);
      if (progress >= 1) finishAutoSolve();
      break;
    case 'ALTERNATE_INTERIOR':
    case 'ALTERNATE_EXTERIOR':
      drawAngle(state.startAngle, ANGLE_SELECTED_COLOR);
      if (state.phase === 1) {
        state.animatedAngle.rotation = lerp(0, PI, easedProgress);
        drawAngle(state.animatedAngle, ANGLE_PRIMED_COLOR);
        if (progress >= 1) {
          state.phase = 2;
          state.startTime = millis();
        }
      } else {
        state.animatedAngle.rotation = PI;
        state.animatedAngle.pos = p5.Vector.lerp(state.startAngle.pos, state.targetAngle.pos, easedProgress);
        drawAngle(state.animatedAngle, ANGLE_DRAG_COLOR);
        if (progress >= 1) finishAutoSolve();
      }
      break;
    case 'SUPPLEMENTARY':
      drawAngle(state.startAngle, ANGLE_SELECTED_COLOR);
      if (state.phase === 1) {
        drawAngle(state.partnerAngle, ADJACENT_DRAG_COLOR);
        if (progress >= 1) {
          state.phase = 2;
          state.startTime = millis();
        }
      } else {
        const targetPos = allAngles.find(a => a.id === state.partnerAngle.isCorrespondingTo).pos;
        state.animatedAngle.pos = p5.Vector.lerp(state.partnerAngle.pos, targetPos, easedProgress);
        drawAngle(state.animatedAngle, ADJACENT_DRAG_COLOR);
        if (progress >= 1) {
          selectedAngle = state.startAngle;
          draggedAngle = state.partnerAngle;
          snappedTargetId = state.targetAngle.id;
          isAutoSolving = false;
          snapCorrect = true;
        }
      }
      break;
  }
}

function finishAutoSolve() {
  isAutoSolving = false;
  snapCorrect = true;
  selectedAngle = autoSolveState.startAngle;
  snappedTargetId = autoSolveState.targetAngle.id;
  autoSolveState = {};
}