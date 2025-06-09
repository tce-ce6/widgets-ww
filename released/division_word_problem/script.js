// MODEL
// MODEL
class DivisionModel {
  constructor() {
    this.question = {};
    this.items = [];
    this.containers = [];
    this.currentStep = 0;
    this.maxStep = 0;
    
    // Constants
    this.CONTAINERS_PER_ROW = 5;
    this.CONTAINER_WIDTH = 90;
    this.CONTAINER_HEIGHT = 110;
    this.ITEM_SIZE = 20;
    this.ITEM_SPACING = 22;
    
    // Available data for randomization
    this.totals = [20, 30, 40];
    this.divisors = [2, 3, 5, 4, 6, 7, 8, 10];
    this.itemsData = [
      { name: 'bee plushies', emoji: '🐝', containerType: 'hive' },
      { name: 'apples', emoji: '🍎', containerType: 'bag' },
      { name: 'marbles', emoji: '🟠', containerType: 'jar' },
      { name: 'balls', emoji: '⚽', containerType: 'box' },
    ];
    this.containersData = ['toy hives', 'bags', 'jars', 'boxes'];
  }
  
 // In DivisionModel class, modify the generateQuestion method:

generateQuestion() {
  const sentenceTemplates = [
    {
      type: 'apples-bags',
      text: (total, divisor) =>
        `A farmer puts ${total} apples equally in ${divisor} bags. How many apples are there in each bag?`,
      itemName: 'apples',
      emoji: '🍎',
      containerName: 'bags',
      containerType: 'bag',
      invertDivision: false
    },
    {
      type: 'marbles-jars',
      text: (total, divisor) =>
        `${total} marbles are divided equally into ${divisor} jars. How many marbles are in each jar?`,
      itemName: 'marbles',
      emoji: '🟠',
      containerName: 'jars',
      containerType: 'jar',
      invertDivision: false
    },
    {
      type: 'bees-hives',
      text: (total, divisor) =>
        `A toymaker has ${total} bee plushies and ${divisor} toy hives. How many bees can be placed in each hive?`,
      itemName: 'bee plushies',
      emoji: '🐝',
      containerName: 'toy hives',
      containerType: 'hive',
      invertDivision: false
    },
    {
      type: 'jars-needed',
      text: (itemsPerContainer, totalItems) =>
        `Each jar can hold ${itemsPerContainer} marbles. A teacher has ${totalItems} marbles. How many jars can she fill?`,
      itemName: 'marbles',
      emoji: '🟠',
      containerName: 'jars',
      containerType: 'jar',
      invertDivision: true
    }
  ];

  let template = this.getRandomElement(sentenceTemplates);
  let total, divisor, quotient;

  if (template.invertDivision) {
    // For capacity problems: "Each jar can hold X marbles. Teacher has Y marbles. How many jars?"
    // Make sure Y is divisible by X with no remainder
    divisor = this.getRandomElement(this.divisors); // This is "capacity per container"
    quotient = this.getRandomElement([1, 2, 3, 4, 5]); // Small number of containers to fill
    total = divisor * quotient; // Total items will always be divisible by capacity
  } else {
    // Standard division problems: "X items divided by Y containers = Z items per container"
    // Ensure X is divisible by Y with no remainder
    do {
      total = this.getRandomElement(this.totals);
      divisor = this.getRandomElement(this.divisors);
      quotient = total / divisor;
    } while (total % divisor !== 0 || total >= 70);
  }
  
  // Store for drawing and calculation
  if (template.invertDivision) {
    // Inverse problems: X items per container, Y total items
    // How many containers? Y ÷ X
    this.itemsPerContainer = divisor;
    this.numberOfContainers = quotient;
    
    // For display purposes
    this.question = {
      total, // total items
      divisor, // capacity per container
      quotient, // number of containers needed
      itemName: template.itemName,
      emoji: template.emoji,
      containerName: template.containerName,
      containerType: template.containerType,
      sentence: template.text(divisor, total),
      invertDivision: true
    };
  } else {
    // Normal division: total items ÷ number of containers = items per container
    this.itemsPerContainer = quotient;
    this.numberOfContainers = divisor;
    
    this.question = {
      total,
      divisor,
      quotient,
      itemName: template.itemName,
      emoji: template.emoji,
      containerName: template.containerName,
      containerType: template.containerType,
      sentence: template.text(total, divisor),
      invertDivision: false
    };
  }

  this.currentStep = 0;
  this.maxStep = this.numberOfContainers;

  this.generateItems();
  this.generateContainers();

  return {
    question: this.question,
    maxStep: this.maxStep
  };
}
  
  generateItems() {
    this.items = [];
    const itemsPerGroup = this.itemsPerContainer;
    const totalGroups = this.numberOfContainers;
    
    // Calculate total items
    const totalItems = itemsPerGroup * totalGroups;
    
    for (let i = 0; i < totalItems; i++) {
      let col = i % 14;
      let row = Math.floor(i / 14);
      this.items.push({
        x: 30 + col * this.ITEM_SPACING,
        y: 90 + row * this.ITEM_SPACING,
        baseX: 30 + col * this.ITEM_SPACING,
        baseY: 90 + row * this.ITEM_SPACING,
        groupIndex: Math.floor(i / itemsPerGroup) // Group items based on items per container
      });
    }
    return this.items;
  }
  
  generateContainers() {
    this.containers = [];
    const numContainers = this.numberOfContainers;
    for (let i = 0; i < numContainers; i++) {
      let row = Math.floor(i / this.CONTAINERS_PER_ROW);
      let col = i % this.CONTAINERS_PER_ROW;
      let x = 160 + col * (this.CONTAINER_WIDTH + 40);
      let y = 250 + row * (this.CONTAINER_HEIGHT + 30);
      this.containers.push({ 
        x, 
        y,
        visible: false // Initially all containers are invisible
      });
    }
    return this.containers;
  }
  
  setCurrentStep(step) {
    this.currentStep = step;
    // Update container visibility based on current step
    for (let i = 0; i < this.containers.length; i++) {
      this.containers[i].visible = i < this.currentStep;
    }
    return this.currentStep;
  }
  
  updateItemPositions() {
    const itemsPerContainer = this.itemsPerContainer;
    const numberOfContainers = this.numberOfContainers;
    
    // Create item groups
    const groups = [];
    for (let i = 0; i < numberOfContainers; i++) {
      groups.push([]);
    }
    
    // Assign items to their groups
    for (let i = 0; i < this.items.length; i++) {
      const groupIndex = Math.floor(i / itemsPerContainer);
      if (groupIndex < groups.length) {
        groups[groupIndex].push(this.items[i]);
      }
    }
    
    // Move groups to containers
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
      const group = groups[groupIndex];
      const isMoving = groupIndex < this.currentStep;
      
      if (isMoving && groupIndex < this.containers.length) {
        const container = this.containers[groupIndex];
        container.visible = true;
        
        // Position items in a nice grid within the container
        const gridSize = Math.ceil(Math.sqrt(itemsPerContainer));
        
        for (let i = 0; i < group.length; i++) {
          const item = group[i];
          const col = i % gridSize;
          const row = Math.floor(i / gridSize);
          
          // Calculate target position based on container type
          let targetX = container.x;
          let targetY = container.y;
          
          // Adjust positioning based on container type
          switch(this.question.containerType) {
            case 'hive':
              // Place in circular arrangement for hive
              targetX += (col - (gridSize - 1) / 2) * 22;
              targetY += (row - (gridSize - 1) / 2) * 22 + 10;
              break;
            case 'bag':
              // Grid arrangement for bag
              targetX += (col - (gridSize - 1) / 2) * 22;
              targetY += (row - (gridSize - 1) / 2) * 22 + 10;
              break;
            case 'jar':
              // Grid arrangement for jar
              targetX += (col - (gridSize - 1) / 2) * 22;
              targetY += (row - (gridSize - 1) / 2) * 22;
              break;
            case 'box':
              // Grid arrangement for box
              targetX += (col - (gridSize - 1) / 2) * 22;
              targetY += (row - (gridSize - 1) / 2) * 22;
              break;
          }
          
          // Smooth movement
          item.x += (targetX - item.x) * 0.2;
          item.y += (targetY - item.y) * 0.2;
        }
      } else {
        // Return items to base position if not moving
        for (let i = 0; i < group.length; i++) {
          const item = group[i];
          item.x += (item.baseX - item.x) * 0.2;
          item.y += (item.baseY - item.y) * 0.2;
        }
      }
    }
    
    return this.items;
  }
  
  getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  
  getData() {
    return {
      question: this.question,
      items: this.items,
      containers: this.containers,
      currentStep: this.currentStep,
      maxStep: this.maxStep
    };
  }
}

// VIEW
class DivisionView {
  constructor()  {
    // Reference existing HTML elements
    this.slider = document.getElementById('slider');
    this.newProblemBtn = document.getElementById('newProblemBtn1');
    this.canvas = null;
  }
  
  setup() {
    this.canvas = createCanvas(900, 500);
    this.canvas.parent('sketch-container');
    textFont('Arial');
  }
  
  draw(data) {
    background(255);
    
    // Draw question text
    this.drawQuestionText(data.question, data.currentStep, data.maxStep);
    
    // Draw containers (only visible ones)
    this.drawContainers(data.containers, data.question.containerType);
    
    // Draw items
    this.drawItems(data.items, data.question.emoji);
  }
  
  drawQuestionText(question, currentStep, maxStep) {
    fill(0);
    textSize(22);
    noStroke();
    textAlign(LEFT);
    
    // Draw main question
    text(question.sentence, 30, 30);
    
    // Draw equation and answer based on division type
    if (currentStep == maxStep) {
      noStroke();
      fill(0);
      textSize(16);
      
      if (question.invertDivision) {
        // For inverted division problems (jars needed)
        text(`${question.total} ÷ ${question.divisor} = ${question.quotient}`, 30, 60);
        text(`She can fill ${question.quotient} ${question.containerName}.`, 30, 85);
      } else {
        // For standard division problems (items per container)
        text(`${question.total} ÷ ${question.divisor} = ${question.quotient}`, 30, 60);
        
        // Use the correct pronoun based on the problem type
        const pronoun = question.sentence.includes("teacher") ? "She" : 
                        question.sentence.includes("toymaker") ? "He" : 
                        "They";
        
        text(`${pronoun} can place ${question.quotient} ${question.itemName} in each ${question.containerName.slice(0, -1)}.`, 30, 85);
      }
    } else {
      // Show only the division operation (not the result) while animating
      if (question.invertDivision) {
        text(`${question.total} ÷ ${question.divisor} =`, 30, 60);
      } else {
        text(`${question.total} ÷ ${question.divisor} =`, 30, 60);
      }
    }
  }
  
  drawContainers(containers, containerType) {
    // Draw only visible containers with the appropriate shape
    containers.forEach(container => {
      if (container.visible) {
        switch(containerType) {
          case 'hive':
            this.drawHive(container.x, container.y);
            break;
          case 'bag':
            this.drawBag(container.x, container.y);
            break;
          case 'jar':
            this.drawJar(container.x, container.y);
            break;
          case 'box':
            this.drawBox(container.x, container.y);
            break;
        }
      }
    });
  }
  
  drawHive(x, y) {
    push();
    translate(x, y);
  
    // Hanging string
    stroke(0);
    strokeWeight(2);
    line(0, -30, 0, -50);
  
    // Draw layered arcs to form a beehive look
    let layers = 6;
    let baseColor = color(255, 220, 100, 200);
    noStroke();
    for (let i = 0; i < layers; i++) {
      let shade = lerpColor(baseColor, color(200, 150, 50, 200), i / layers);
      fill(shade);
      ellipse(0, -20 + i * 15, 80 - i * 10, 20);
      strokeWeight(1);
      stroke(60, 40, 10, 150);
    }
  
    // Add outline
    noFill();
   // stroke(60, 40, 10, 150);
    strokeWeight(0);
    ellipse(0, 10, 80, 100);
  
    // Central entrance hole
    fill(40, 20, 10);
    noStroke(60, 40, 10, 150);
    strokeWeight(1);
    ellipse(0, 0, 15, 25);
  
    // Highlights
    fill(255, 255, 200, 150);
    noStroke(60, 40, 10, 150);
    strokeWeight(1);
    //ellipse(20, -40, 20, 6);
    ellipse(-10, 0, 15, 4);
    ellipse(5, 50, 18, 5);
  
    pop();
  }
  
  drawBag(x, y) {
    // Draw a bag shape
    stroke(139, 69, 19);
    strokeWeight(2);
    fill(255, 250, 220, 30);
    
    // Bag body - now larger at 120×140
    rect(x - 60, y - 70, 120, 140, 5, 5, 10, 10);
    
    // Bag opening - span the full width of the bag
    line(x - 60, y - 70, x + 60, y - 70);
    
    // Bag string - adjusted to match the wider bag
    stroke(139, 69, 19);
    strokeWeight(1);
    line(x - 55, y - 70, x - 20, y - 85); // Left string
    line(x + 55, y - 70, x + 20, y - 85); // Right string
    line(x - 20, y - 85, x + 20, y - 85); // Top connecting string
  }
  drawJar(x, y) {
    // Draw a jar shape
    const jarWidth = 100;
    const jarHeight = 120;
    
    // Jar body
    stroke(0, 130, 130);
    strokeWeight(2);
    fill(240, 255, 255, 30);
    
    // Draw the jar body
    beginShape();
    vertex(x - jarWidth/2, y - jarHeight/2 + 20);
    
    // Left side down
    vertex(x - jarWidth/2, y + jarHeight/2);
    
    // Bottom curve
    bezierVertex(
      x - jarWidth/2, y + jarHeight/2 + 5,
      x + jarWidth/2, y + jarHeight/2 + 5,
      x + jarWidth/2, y + jarHeight/2
    );
    
    // Right side up
    vertex(x + jarWidth/2, y - jarHeight/2 + 20);
    
    // Top of the jar
    bezierVertex(
      x + jarWidth/2, y - jarHeight/2 + 10,
      x - jarWidth/2, y - jarHeight/2 + 10,
      x - jarWidth/2, y - jarHeight/2 + 20
    );
    
    endShape(CLOSE);
    
    // Jar lid
    stroke(0, 130, 130);
    fill(0, 160, 160, 180);
    rect(x - jarWidth/2 - 5, y - jarHeight/2, jarWidth + 10, 20, 5, 5, 0, 0);
  }
  
  drawBox(x, y) {
    // Draw a box shape
    stroke(80, 80, 80);
    strokeWeight(2);
    fill(245, 245, 245, 30);
    
    // Box body
    rect(x - 40, y - 40, 80, 80, 5);
    
    // Box lid lines
    line(x - 40, y - 15, x + 40, y - 15);
    
    // Box decoration
    stroke(150, 150, 150);
    strokeWeight(1);
    line(x - 20, y + 40, x - 20, y - 40);
    line(x + 20, y + 40, x + 20, y - 40);
  }
  
  drawItems(items, emoji) {
    textAlign(CENTER, CENTER);
    textSize(20);
    items.forEach(item => {
      text(emoji, item.x, item.y);
    });
  }
  
  setupEventListeners(controller) {
    // Use the existing slider element
    this.slider.oninput = function() {
      controller.updateStep(parseInt(this.value));
    };
    
    // Use the existing button
    this.newProblemBtn.onclick = function() {
      controller.generateNewQuestion();
    };
  }
  
  updateSlider(maxValue, currentValue) {
    this.slider.setAttribute('max', maxValue);
    this.slider.value = currentValue;
  }
}

// CONTROLLER
class DivisionController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
  
  initialize() {
    this.view.setup();
    this.view.setupEventListeners(this);
    this.generateNewQuestion();
  }
  
  generateNewQuestion() {
    const questionData = this.model.generateQuestion();
    this.view.updateSlider(questionData.maxStep, 0);
  }
  
  updateStep(step) {
    this.model.setCurrentStep(step);
  }
  
  update() {
    this.model.updateItemPositions();
    const data = this.model.getData();
    this.view.draw(data);
  }
}

// Main execution
let divisionModel, divisionView, divisionController;

function setup() {
  divisionModel = new DivisionModel();
  divisionView = new DivisionView();
  divisionController = new DivisionController(divisionModel, divisionView);
  divisionController.initialize();
}

function draw() {
  divisionController.update();
}

// These functions are required by p5.js
window.setup = setup;
window.draw = draw;