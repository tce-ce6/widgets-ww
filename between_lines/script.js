// Utility Classes
class MathUtils {
  static lineIntersection(x1, y1, x2, y2, x3, y3, x4, y4) {
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    
    if (Math.abs(denom) < 1e-10) {
      return null; // Lines are parallel
    }
    
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    
    return {
      x: x1 + t * (x2 - x1),
      y: y1 + t * (y2 - y1)
    };
  }
  
  static getLineAngle(x1, y1, x2, y2) {
    return Math.atan2(y2 - y1, x2 - x1);
  }
  
  static normalizeAngle(angle) {
    while (angle < 0) angle += 2 * Math.PI;
    while (angle >= 2 * Math.PI) angle -= 2 * Math.PI;
    return angle;
  }
  
  static radiansToDegrees(radians) {
    return radians * 180 / Math.PI;
  }
  
  static getIntersectionAngles(line1Angle, line2Angle) {
    // Calculate the four angles formed at intersection
    const angles = [];
    
    // Normalize angles
    const angle1 = this.normalizeAngle(line1Angle);
    const angle2 = this.normalizeAngle(line2Angle);
    
    // Create four angles by rotating around the intersection point
    const baseAngles = [angle1, angle1 + Math.PI, angle2, angle2 + Math.PI];
    
    // Sort angles to get them in order around the circle
    baseAngles.sort((a, b) => this.normalizeAngle(a) - this.normalizeAngle(b));
    
    // Create angle objects with proper start and end angles
    for (let i = 0; i < 4; i++) {
      const startAngle = this.normalizeAngle(baseAngles[i]);
      const endAngle = this.normalizeAngle(baseAngles[(i + 1) % 4]);
      
      let angleMeasure;
      if (endAngle > startAngle) {
        angleMeasure = endAngle - startAngle;
      } else {
        angleMeasure = (2 * Math.PI - startAngle) + endAngle;
      }
      
      // Ensure we don't have angles larger than 180 degrees
      if (angleMeasure > Math.PI) {
        angleMeasure = 2 * Math.PI - angleMeasure;
      }
      
      angles.push({
        startAngle: startAngle,
        endAngle: endAngle,
        degrees: this.radiansToDegrees(angleMeasure),
        quadrant: i,
        id: i
      });
    }
    
    return angles;
  }
}

// Model Class
class GeometryModel {
  constructor() {
    // Line 1 endpoints
    this.line1 = {
      x1: 150, y1: 100,
      x2: 750, y2: 200
    };
    
    // Line 2 endpoints
    this.line2 = {
      x1: 100, y1: 300,
      x2: 700, y2: 400
    };
    
    // Transversal endpoints
    this.transversal = {
      x1: 200, y1: 50,
      x2: 600, y2: 450
    };
    
    this.areParallel = false;
    this.highlightMode = 'none'; // 'none', 'corresponding', 'alternate', 'cointerior'
    
    this.intersections = [];
    this.angles = [];
    
    this.updateIntersections();
    this.updateAngles();
  }
  
  updateIntersections() {
    // Find intersection of line1 with transversal
    const int1 = MathUtils.lineIntersection(
      this.line1.x1, this.line1.y1, this.line1.x2, this.line1.y2,
      this.transversal.x1, this.transversal.y1, this.transversal.x2, this.transversal.y2
    );
    
    // Find intersection of line2 with transversal
    const int2 = MathUtils.lineIntersection(
      this.line2.x1, this.line2.y1, this.line2.x2, this.line2.y2,
      this.transversal.x1, this.transversal.y1, this.transversal.x2, this.transversal.y2
    );
    
    this.intersections = [int1, int2].filter(p => p !== null);
  }
  
  updateAngles() {
    if (this.intersections.length < 2) return;
    
    const [int1, int2] = this.intersections;
    
    this.angles = [];
    
    // Calculate angles at intersection 1 (line1 with transversal)
    const angles1 = this.calculateAnglesAtIntersection(int1, this.line1, this.transversal, 1);
    // Calculate angles at intersection 2 (line2 with transversal)  
    const angles2 = this.calculateAnglesAtIntersection(int2, this.line2, this.transversal, 2);
    
    this.angles = [...angles1, ...angles2];
  }
  
  calculateAnglesAtIntersection(intersection, line, transversal, intersectionId) {
    // Get the four rays from the intersection point
    const rays = [
      // Line going left
      { angle: Math.atan2(line.y1 - intersection.y, line.x1 - intersection.x), name: 'line_left' },
      // Line going right  
      { angle: Math.atan2(line.y2 - intersection.y, line.x2 - intersection.x), name: 'line_right' },
      // Transversal going up
      { angle: Math.atan2(transversal.y1 - intersection.y, transversal.x1 - intersection.x), name: 'trans_up' },
      // Transversal going down
      { angle: Math.atan2(transversal.y2 - intersection.y, transversal.x2 - intersection.x), name: 'trans_down' }
    ];
    
    // Normalize angles to 0-2π
    rays.forEach(ray => {
      ray.angle = MathUtils.normalizeAngle(ray.angle);
    });
    
    // Sort rays by angle
    rays.sort((a, b) => a.angle - b.angle);
    
    // Create angles between consecutive rays
    const angles = [];
    for (let i = 0; i < 4; i++) {
      const startRay = rays[i];
      const endRay = rays[(i + 1) % 4];
      
      let angleMeasure = endRay.angle - startRay.angle;
      if (angleMeasure <= 0) angleMeasure += 2 * Math.PI;
      
      // Determine position relative to intersection
      const midAngle = MathUtils.normalizeAngle(startRay.angle + angleMeasure / 2);
      const position = this.getAnglePosition(midAngle, intersection, intersectionId);
      
      // Assign letters based on position and intersection
      let letter;
      if (intersectionId === 1) {
        if (position === 'top-left') letter = 'A';
        else if (position === 'top-right') letter = 'B';
        else if (position === 'bottom-right') letter = 'C';
        else if (position === 'bottom-left') letter = 'D';
      } else {
        if (position === 'top-left') letter = 'E';
        else if (position === 'top-right') letter = 'F';
        else if (position === 'bottom-right') letter = 'G';
        else if (position === 'bottom-left') letter = 'H';
      }
      
      angles.push({
        startAngle: startRay.angle,
        endAngle: endRay.angle,
        degrees: MathUtils.radiansToDegrees(angleMeasure),
        x: intersection.x,
        y: intersection.y,
        intersection: intersectionId,
        position: position,
        globalId: `${intersectionId}-${i}`,
        startRay: startRay.name,
        endRay: endRay.name,
        letter: letter
      });
    }
    
    return angles;
  }
  
  getAnglePosition(midAngle, intersection, intersectionId) {
    const transversal = this.transversal;
    const line = intersectionId === 1 ? this.line1 : this.line2;
    
    // Calculate vectors
    const mainVec = createVector(line.x1 - intersection.x, line.y1 - intersection.y);
    const transVec = createVector(transversal.x1 - intersection.x, transversal.y1 - intersection.y);
    const angleVec = createVector(Math.cos(midAngle), Math.sin(midAngle));
    
    // Calculate normals (perpendicular vectors)
    const mainNormal = createVector(-mainVec.y, mainVec.x);
    const transNormal = createVector(-transVec.y, transVec.x);
    
    // Determine side relative to lines using dot products
    const mainDot = angleVec.dot(mainNormal);
    const transDot = angleVec.dot(transNormal);
    
    // Classify based on dot products
    if (mainDot > 0) {
      return transDot > 0 ? 'top-left' : 'top-right';
    } else {
      return transDot > 0 ? 'bottom-left' : 'bottom-right';
    }
  }
  
  makeParallel() {
    // Calculate slope of line1
    const dx1 = this.line1.x2 - this.line1.x1;
    const dy1 = this.line1.y2 - this.line1.y1;
    
    // Calculate current length and direction of line2
    const dx2 = this.line2.x2 - this.line2.x1;
    const length2 = Math.sqrt(dx2 * dx2 + (this.line2.y2 - this.line2.y1) * (this.line2.y2 - this.line2.y1));
    
    // Normalize line1 direction
    const length1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
    const unitX = dx1 / length1;
    const unitY = dy1 / length1;
    
    // Make line2 parallel to line1 with same length as before
    this.line2.x2 = this.line2.x1 + unitX * length2;
    this.line2.y2 = this.line2.y1 + unitY * length2;
  }
  
  toggleParallel() {
    if (this.areParallel) {
      // Store original line2 position if we have it, otherwise just toggle
      this.areParallel = false;
    } else {
      this.areParallel = true;
      this.makeParallel();
    }
    this.updateIntersections();
    this.updateAngles();
  }
  
  setHighlightMode(mode) {
    this.highlightMode = mode;
  }
  
  getAngleRelationships() {
    if (this.angles.length < 8) return {};
    
    // Group angles by intersection
    const int1Angles = this.angles.filter(a => a.intersection === 1);
    const int2Angles = this.angles.filter(a => a.intersection === 2);
    
    // Find corresponding positions
    const findAngleByPosition = (angles, position) => 
      angles.find(a => a.position === position);
    
    return {
      corresponding: [
        [findAngleByPosition(int1Angles, 'top-left'), findAngleByPosition(int2Angles, 'top-left')],
        [findAngleByPosition(int1Angles, 'top-right'), findAngleByPosition(int2Angles, 'top-right')],
        [findAngleByPosition(int1Angles, 'bottom-left'), findAngleByPosition(int2Angles, 'bottom-left')],
        [findAngleByPosition(int1Angles, 'bottom-right'), findAngleByPosition(int2Angles, 'bottom-right')]
      ],
      alternate: [
        [findAngleByPosition(int1Angles, 'top-right'), findAngleByPosition(int2Angles, 'bottom-left')],
        [findAngleByPosition(int1Angles, 'bottom-left'), findAngleByPosition(int2Angles, 'top-right')]
      ],
      cointerior: [
        [findAngleByPosition(int1Angles, 'top-left'), findAngleByPosition(int2Angles, 'top-right')],
        [findAngleByPosition(int1Angles, 'bottom-right'), findAngleByPosition(int2Angles, 'bottom-left')]
      ]
    };
  }
}

// View Class
class GeometryView {
  constructor(model) {
    this.model = model;
    this.dragPoint = null;
    this.colors = {
      line1: [70, 130, 180],
      line2: [220, 20, 60],
      transversal: [34, 139, 34],
      intersection: [255, 140, 0],
      angle: [200, 200, 200, 80],
      corresponding: [255, 100, 100, 150],
      alternate: [100, 255, 100, 150],
      cointerior: [100, 100, 255, 150],
      text: [0, 0, 0],
      acute: [0, 200, 0, 200],       // Green for acute angles
      obtuse: [0, 0, 255, 200],      // Blue for obtuse angles
      right: [255, 165, 0, 200]      // Orange for right angles
    };
  }
  
  render() {
    this.drawGrid();
    this.drawLines();
    this.drawIntersections();
    this.drawAngles();
    this.drawDragPoints();
  }
  
  drawGrid() {
    stroke(240);
    strokeWeight(0.5);
    
    // Vertical lines
    for (let x = 0; x <= 900; x += 50) {
      line(x, 0, x, 500);
    }
    
    // Horizontal lines
    for (let y = 0; y <= 500; y += 50) {
      line(0, y, 900, y);
    }
  }
  
  drawLines() {
    // Line 1
    stroke(this.colors.line1);
    strokeWeight(3);
    this.drawExtendedLine(
      this.model.line1.x1, this.model.line1.y1,
      this.model.line1.x2, this.model.line1.y2,
      'Line 1'
    );
    
    // Line 2
    stroke(this.colors.line2);
    this.drawExtendedLine(
      this.model.line2.x1, this.model.line2.y1,
      this.model.line2.x2, this.model.line2.y2,
      'Line 2'
    );
    
    // Transversal
    stroke(this.colors.transversal);
    this.drawExtendedLine(
      this.model.transversal.x1, this.model.transversal.y1,
      this.model.transversal.x2, this.model.transversal.y2,
      'Transversal'
    );
  }
  
  drawExtendedLine(x1, y1, x2, y2, label) {
    // Extend line beyond control points
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = sqrt(dx * dx + dy * dy);
    const unitX = dx / length;
    const unitY = dy / length;
    
    const extension = 100;
    const extX1 = x1 - unitX * extension;
    const extY1 = y1 - unitY * extension;
    const extX2 = x2 + unitX * extension;
    const extY2 = y2 + unitY * extension;
    
    line(extX1, extY1, extX2, extY2);
    
    // Draw label
    fill(0);
    noStroke();
    textAlign(CENTER);
    textSize(12);
    text(label, (x1 + x2) / 2, (y1 + y2) / 2 - 10);
  }
  
  drawIntersections() {
    fill(this.colors.intersection);
    noStroke();
    
    this.model.intersections.forEach((intersection, index) => {
      if (intersection) {
        circle(intersection.x, intersection.y, 8);
        
        fill(0);
        textAlign(CENTER);
        textSize(10);
        text(`P${index + 1}`, intersection.x, intersection.y - 15);
        fill(this.colors.intersection);
      }
    });
  }
  
  drawAngles() {
    if (this.model.angles.length === 0) return;
    
    const relationships = this.model.getAngleRelationships();
    const highlightedAngles = this.getHighlightedAngles(relationships);
    
    // Define min and max for the arc radius
    const minArcRadius = 15;
    const maxArcRadius = 40;
    
    this.model.angles.forEach((angle, index) => {
      // Calculate dynamic arc radius based on angle measure
      const arcRadius = minArcRadius + (angle.degrees / 180) * (maxArcRadius - minArcRadius);
      const labelRadius = arcRadius + 15;
      
      const highlightInfo = highlightedAngles.find(h => h.angle === angle);
      const isHighlighted = highlightInfo !== undefined;
      
      // Set color for non-highlighted angles based on angle measure
      let angleColor;
      if (!isHighlighted) {
        if (angle.degrees < 90) {
          angleColor = this.colors.acute; // green
        } else if (angle.degrees > 90) {
          angleColor = this.colors.obtuse; // blue
        } else {
          angleColor = this.colors.right; // orange
        }
      }
      
      // Draw angle arc
      noFill();
      
      if (isHighlighted) {
        const colorKey = this.model.highlightMode;
        stroke(this.colors[colorKey]);
        strokeWeight(3);
      } else {
        stroke(angleColor);
        strokeWeight(1);
      }
      
      // Draw the angle arc properly
      let startAngle = angle.startAngle;
      let endAngle = angle.endAngle;
      
      // Handle angle wrapping
      if (endAngle < startAngle) {
        // Draw in two parts to handle the wrap-around
        arc(angle.x, angle.y, arcRadius * 2, arcRadius * 2, startAngle, TWO_PI);
        arc(angle.x, angle.y, arcRadius * 2, arcRadius * 2, 0, endAngle);
      } else {
        arc(angle.x, angle.y, arcRadius * 2, arcRadius * 2, startAngle, endAngle);
      }
      
      // Fill the angle sector if highlighted
      if (isHighlighted) {
        const colorKey = this.model.highlightMode;
        fill(this.colors[colorKey]);
        noStroke();
        
        // Draw filled sector
        beginShape();
        vertex(angle.x, angle.y);
        
        const steps = 20;
        let currentAngle = startAngle;
        const angleStep = (endAngle - startAngle) / steps;
        
        if (endAngle < startAngle) {
          // Handle wrap-around case
          const totalAngle = (TWO_PI - startAngle) + endAngle;
          const step = totalAngle / steps;
          
          for (let i = 0; i <= steps; i++) {
            let a = startAngle + i * step;
            if (a > TWO_PI) a -= TWO_PI;
            
            const x = angle.x + cos(a) * arcRadius;
            const y = angle.y + sin(a) * arcRadius;
            vertex(x, y);
          }
        } else {
          for (let i = 0; i <= steps; i++) {
            const a = startAngle + i * angleStep;
            const x = angle.x + cos(a) * arcRadius;
            const y = angle.y + sin(a) * arcRadius;
            vertex(x, y);
          }
        }
        
        vertex(angle.x, angle.y);
        endShape(CLOSE);
      }
      
      // Draw angle label
      const labelAngle = (startAngle + endAngle) / 2;
      if (endAngle < startAngle) {
        // Handle wrap-around for label positioning
        const totalAngle = (TWO_PI - startAngle) + endAngle;
        const midAngle = startAngle + totalAngle / 2;
        const normalizedMid = midAngle > TWO_PI ? midAngle - TWO_PI : midAngle;
        const labelX = angle.x + cos(normalizedMid) * labelRadius;
        const labelY = angle.y + sin(normalizedMid) * labelRadius;
        
        fill(isHighlighted ? [0, 0, 0] : this.colors.text); // black for better visibility on highlight
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(10);
        text(`∠${angle.letter}: ${Math.round(angle.degrees)}°`, labelX, labelY);
      } else {
        const labelX = angle.x + cos(labelAngle) * labelRadius;
        const labelY = angle.y + sin(labelAngle) * labelRadius;
        
        fill(isHighlighted ? [0, 0, 0] : this.colors.text); // black for better visibility on highlight
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(10);
        text(`∠${angle.letter}: ${Math.round(angle.degrees)}°`, labelX, labelY);
      }
    });
  }
  
  getHighlightedAngles(relationships) {
    if (this.model.highlightMode === 'none') return [];
    
    const currentRelations = relationships[this.model.highlightMode];
    if (!currentRelations) return [];
    
    const highlighted = [];
    
    // Only include pairs that have both angles defined
    const validPairs = currentRelations.filter(pair => 
      pair && pair.length === 2 && pair[0] && pair[1]
    );
    
    validPairs.forEach((pair, pairIndex) => {
      if (pair && pair.length === 2 && pair[0] && pair[1]) {
        pair.forEach(angle => {
          highlighted.push({
            angle: angle,
            pairIndex: pairIndex
          });
        });
      }
    });
    
    return highlighted;
  }
  
  drawDragPoints() {
    // Draw control points for lines
    fill(this.colors.line1);
    noStroke();
    
    // Line 1 endpoints
    circle(this.model.line1.x1, this.model.line1.y1, 10);
    circle(this.model.line1.x2, this.model.line1.y2, 10);
    
    // Line 2 endpoints
    fill(this.colors.line2);
    circle(this.model.line2.x1, this.model.line2.y1, 10);
    circle(this.model.line2.x2, this.model.line2.y2, 10);
    
    // Transversal control point (middle)
    fill(this.colors.transversal);
    const midX = (this.model.transversal.x1 + this.model.transversal.x2) / 2;
    const midY = (this.model.transversal.y1 + this.model.transversal.y2) / 2;
    circle(midX, midY, 12);
  }
  
  getDragPoint(x, y) {
    const threshold = 15;
    
    // Check line 1 endpoints
    if (dist(x, y, this.model.line1.x1, this.model.line1.y1) < threshold) {
      return { type: 'line1', point: 'start' };
    }
    if (dist(x, y, this.model.line1.x2, this.model.line1.y2) < threshold) {
      return { type: 'line1', point: 'end' };
    }
    
    // Check line 2 endpoints
    if (dist(x, y, this.model.line2.x1, this.model.line2.y1) < threshold) {
      return { type: 'line2', point: 'start' };
    }
    if (dist(x, y, this.model.line2.x2, this.model.line2.y2) < threshold) {
      return { type: 'line2', point: 'end' };
    }
    
    // Transversal control point (middle)
    const midX = (this.model.transversal.x1 + this.model.transversal.x2) / 2;
    const midY = (this.model.transversal.y1 + this.model.transversal.y2) / 2;
    if (dist(x, y, midX, midY) < threshold) {
      return { type: 'transversal', point: 'middle' };
    }
    
    return null;
  }
}

// Controller Class
class GeometryController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.dragState = {
      isDragging: false,
      dragPoint: null,
      lastMouseX: 0,
      lastMouseY: 0
    };
  }
  
  handleMousePressed(x, y) {
    const dragPoint = this.view.getDragPoint(x, y);
    
    if (dragPoint) {
      this.dragState.isDragging = true;
      this.dragState.dragPoint = dragPoint;
      this.dragState.lastMouseX = x;
      this.dragState.lastMouseY = y;
    }
  }
  
  handleMouseDragged(x, y) {
    if (!this.dragState.isDragging || !this.dragState.dragPoint) return;
    
    const dx = x - this.dragState.lastMouseX;
    const dy = y - this.dragState.lastMouseY;
    
    const { type, point } = this.dragState.dragPoint;
    
    if (type === 'line1') {
      if (point === 'start') {
        this.model.line1.x1 += dx;
        this.model.line1.y1 += dy;
      } else {
        this.model.line1.x2 += dx;
        this.model.line1.y2 += dy;
      }
      
      // If parallel mode is on and we're dragging line1, keep line2 parallel
      if (this.model.areParallel) {
        this.model.makeParallel();
      }
    } else if (type === 'line2') {
      if (point === 'start') {
        this.model.line2.x1 += dx;
        this.model.line2.y1 += dy;
      } else {
        this.model.line2.x2 += dx;
        this.model.line2.y2 += dy;
      }
      
      // If parallel mode is on and we're dragging line2, keep it parallel
      if (this.model.areParallel) {
        this.model.makeParallel();
      }
    } else if (type === 'transversal') {
      // Move entire transversal
      this.model.transversal.x1 += dx;
      this.model.transversal.y1 += dy;
      this.model.transversal.x2 += dx;
      this.model.transversal.y2 += dy;
    }
    
    // Update intersections and angles
    this.model.updateIntersections();
    this.model.updateAngles();
    
    // Update status displays
    document.getElementById('parallelStatus').textContent = 
      `Lines are ${this.model.areParallel ? 'PARALLEL' : 'NOT PARALLEL'}`;
    
    this.dragState.lastMouseX = x;
    this.dragState.lastMouseY = y;
  }
  
  handleMouseReleased() {
    this.dragState.isDragging = false;
    this.dragState.dragPoint = null;
  }
  
  toggleParallel() {
    this.model.toggleParallel();
    document.getElementById('parallelStatus').textContent = 
      `Lines are ${this.model.areParallel ? 'PARALLEL' : 'NOT PARALLEL'}`;
  }
  
  setHighlightMode(mode) {
    this.model.setHighlightMode(mode);
    document.getElementById('highlightStatus').textContent = 
      `Highlight Mode: ${this.model.highlightMode.toUpperCase()}`;
    updateHighlightButtons(mode);
  }
}

// Main Application
let model, view, controller;

window.setup = function() {
  const canvas = createCanvas(900, 500);
  canvas.parent('p5-container');
  
  // Initialize MVC components
  model = new GeometryModel();
  view = new GeometryView(model);
  controller = new GeometryController(model, view);
  
  // Setup UI event listeners
  setupUIControls();
  
  console.log("Geometry simulation initialized");
};

window.draw = function() {
  background(250);
  view.render();
  
  // Draw angle relationship explanations at top-right
  drawAngleExplanations();
};

window.mousePressed = function() {
  controller.handleMousePressed(mouseX, mouseY);
};

window.mouseDragged = function() {
  controller.handleMouseDragged(mouseX, mouseY);
};

window.mouseReleased = function() {
  controller.handleMouseReleased();
};

function setupUIControls() {
  const parallelToggle = document.getElementById('parallelToggle');
  const highlightCorresponding = document.getElementById('highlightCorresponding');
  const highlightAlternate = document.getElementById('highlightAlternate');
  const highlightCoInterior = document.getElementById('highlightCoInterior');
  const clearHighlight = document.getElementById('clearHighlight');
  
  parallelToggle.addEventListener('click', () => {
    controller.toggleParallel();
    updateParallelButton();
  });
  
  function updateParallelButton() {
    parallelToggle.textContent = model.areParallel ? 'Make Lines Non-Parallel' : 'Make Lines Parallel';
    parallelToggle.classList.toggle('active', model.areParallel);
  }
  
  // Initialize button state
  updateParallelButton();
  
  highlightCorresponding.addEventListener('click', () => {
    controller.setHighlightMode('corresponding');
  });
  
  highlightAlternate.addEventListener('click', () => {
    controller.setHighlightMode('alternate');
  });
  
  highlightCoInterior.addEventListener('click', () => {
    controller.setHighlightMode('cointerior');
  });
  
  clearHighlight.addEventListener('click', () => {
    controller.setHighlightMode('none');
  });
}

function updateHighlightButtons(activeMode) {
  const buttons = ['highlightCorresponding', 'highlightAlternate', 'highlightCoInterior', 'clearHighlight'];
  const modes = ['corresponding', 'alternate', 'cointerior', 'none'];
  
  buttons.forEach((buttonId, index) => {
    const button = document.getElementById(buttonId);
    button.classList.toggle('active', modes[index] === activeMode);
  });
}

// Draw angle explanations at top-right
function drawAngleExplanations() {
  const relationships = model.getAngleRelationships();
  const currentRelations = relationships[model.highlightMode] || [];
  const validPairs = currentRelations.filter(pair => pair && pair[0] && pair[1]);

  if (model.highlightMode !== 'none' && validPairs.length > 0) {
    fill(0);
    noStroke();
    textAlign(RIGHT);
    textSize(14);
    
    let y = 30;  // Start below the status bar
    const rightMargin = width - 20;

    // Display the rule based on the mode and parallel state
    if (model.areParallel) {
      switch(model.highlightMode) {
        case 'corresponding':
          text('Corresponding angles are EQUAL (parallel lines)', rightMargin, y);
          break;
        case 'alternate':
          text('Alternate interior angles are EQUAL (parallel lines)', rightMargin, y);
          break;
        case 'cointerior':
          text('Co-interior angles SUM TO 180° (parallel lines)', rightMargin, y);
          break;
      }
    } else {
      switch(model.highlightMode) {
        case 'corresponding':
          text('Corresponding angles are NOT equal (lines not parallel)', rightMargin, y);
          break;
        case 'alternate':
          text('Alternate interior angles are NOT equal (lines not parallel)', rightMargin, y);
          break;
        case 'cointerior':
          text('Co-interior angles do NOT sum to 180° (lines not parallel)', rightMargin, y);
          break;
      }
    }
    y += 25;

    const modeNames = {
      'corresponding': 'Corresponding Angles',
      'alternate': 'Alternate Interior Angles', 
      'cointerior': 'Co-Interior Angles'
    };
    text(`${modeNames[model.highlightMode]}:`, rightMargin, y);
    y += 25;

    validPairs.forEach((pair, index) => {
      const angle1 = pair[0];
      const angle2 = pair[1];
      const angle1Deg = Math.round(angle1.degrees);
      const angle2Deg = Math.round(angle2.degrees);
      
      if (model.highlightMode === 'cointerior') {
        const sum = angle1Deg + angle2Deg;
        const isSum180 = Math.abs(sum - 180) < 2;
        let equalitySymbol = isSum180 ? "=" : "≠";
        let note = "";
        
        if (isSum180 && !model.areParallel) {
          note = " (coincidental)";
        }
        
        text(`∠${angle1.letter} + ∠${angle2.letter}: ${angle1Deg}° + ${angle2Deg}° = ${sum}° ${equalitySymbol} 180°${note}`, rightMargin, y);
      } else {
        const equal = Math.abs(angle1Deg - angle2Deg) < 2;
        const equalitySymbol = equal ? "=" : "≠";
        let note = "";
        
        if (equal && !model.areParallel) {
          note = " (coincidental)";
        }
        
        text(`∠${angle1.letter} and ∠${angle2.letter}: ${angle1Deg}° ${equalitySymbol} ${angle2Deg}°${note}`, rightMargin, y);
      }
      y += 25;
    });
  }
}

// Vector helper functions for GeometryModel
function createVector(x, y) {
  return { x: x, y: y, 
           dot: function(v) { return this.x * v.x + this.y * v.y; } };
}