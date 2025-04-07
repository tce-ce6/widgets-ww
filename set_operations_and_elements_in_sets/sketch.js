let model, view, controller;

class Model {
  constructor() {
    this.setA = [];
    this.setB = [];
    this.question = '';
    this.correctSet = [];
    this.selectedElements = [];
    this.attempt = 0;
    this.generateProblem();
    this.newbuttoncheck = document.getElementById('new-check');
    this.newproblembutton = document.getElementById('new-problem');
  }

  generateRandomSet(size = 6) {
    let set = new Set();
    while (set.size < size) {
      set.add(Math.floor(Math.random() * 90) + 10);
    }
    return [...set];
  }

  generateProblem() {
    this.setA = this.generateRandomSet();
    this.setB = this.generateRandomSet();
    const operations = ['A ∪ B', 'A - B', 'B - A', 'A ∩ B'];
    this.question = random(operations);
    this.selectedElements = [];
    this.attempt = 0;
    this.computeCorrectSet();
  }

  computeCorrectSet() {
    const A = this.setA;
    const B = this.setB;
    if (this.question === 'A ∪ B') {
      this.correctSet = [...new Set([...A, ...B])];
    } else if (this.question === 'A - B') {
      this.correctSet = A.filter(x => !B.includes(x));
    } else if (this.question === 'B - A') {
      this.correctSet = B.filter(x => !A.includes(x));
    } else if (this.question === 'A ∩ B') {
      this.correctSet = A.filter(x => B.includes(x));
    }
  }

  checkAnswer() {
    return this.selectedElements.sort().toString() === this.correctSet.sort().toString();
  }

  getHint() {
    if (this.question === 'A ∪ B') return 'Hint: Take all unique elements from both sets.';
    if (this.question === 'A - B') return 'Hint: Only those in A but not in B.';
    if (this.question === 'B - A') return 'Hint: Only those in B but not in A.';
    if (this.question === 'A ∩ B') return 'Hint: Common elements between A and B.';
  }
}

class View {
  constructor() {
    createCanvas(900, 500).parent('canvas-container');
  }

  draw(model) {
    background(255);
    fill(0);
    textSize(15);
    textAlign(LEFT);
    stroke(0);
    textSize(15);
    text(`Set Operation Interactive Tool`, 230 ,10)
    noStroke();
    text(`Question: Select elements for ${model.question}`, 20, 40);

    // Draw Set A
    text('A = {', 20, 70);
    model.setA.forEach((val, i) => {
      fill(model.selectedElements.includes(val) ? '#dcdcdc' : '#ff5c8a'); // Pink background
      rect(65 + i * 40, 55, 30, 25, 5);
      noStroke();
      fill(0);
      text(val, 70 + i * 40, 70);
    });
    text('}', 70 + model.setA.length * 40, 70);
    // Draw Set B
    text('B = {', 20, 110);
    model.setB.forEach((val, i) => {
      fill(model.selectedElements.includes(val) ? '#dcdcdc' : '#ff5c8a'); // Pink background
      rect(65 + i * 40, 95, 30, 25, 5);
      noStroke();
      fill(0);
      text(val, 70 + i * 40, 110);
    });
    text('}', 70 + model.setB.length * 40, 110);

    // Draw Selected Elements Box
    text(`${model.question}: {`, 90, 150);
    model.selectedElements.forEach((val, i) => {
    noStroke();
    fill('#ff5c8a'); // Draw pink background for selected values
    rect(155 + i * 40, 135, 30, 25, 5); 
    fill(0);// Draw the text over the pink background
    text(val, 160 + i * 40, 150);
    });
    text('}',160 + model.selectedElements.length * 40, 150);


    // Check Button
    fill('#4a4be7');
    rect(20, 340, 100, 40, 10);
    fill(255);
    textAlign(CENTER, CENTER);
    text('CHECK', 70, 360);

    // Display Hint or Solution
    if (model.attempt === 1) {
      
      fill('red');
      text('❌ Try again!', 100, 250);

    } else if (model.attempt === 2) {
      fill('red');
      text(model.getHint(), 150, 250);
    } else if (model.attempt >= 3) {
      fill('green');
      text(`✅ Correct Solution: { ${model.correctSet.join(', ')} }` ,250, 250);
      this.drawVennDiagram(model);
    }

    // New Problem Button
    if (model.attempt >= 3 || model.checkAnswer()) {
      fill('#4a4be7');
      rect(140, 340, 160, 40, 10);
      fill(255);
      text('NEW PROBLEM', 220, 360);
    }
  }
  drawVennDiagram(model) {
    noStroke();
    
    // Define sets
    const Aonly = model.setA.filter(x => !model.setB.includes(x));
    const Bonly = model.setB.filter(x => !model.setA.includes(x));
    const intersection = model.setA.filter(x => model.setB.includes(x));

    // Highlight the correct region
    noStroke(2, 15, 4);
    fill('#6ded80'); // Green background for correct answer region
    if (model.question === 'A ∪ B') {
        ellipse(650, 180, 150, 150); // Union (both circles covered)
        ellipse(750, 180, 150, 150);
    } else if (model.question === 'A - B') {
        ellipse(650, 180, 150, 150); // A only
    } else if (model.question === 'B - A') {
        ellipse(750, 180, 150, 150); // B only
    } else if (model.question === 'A ∩ B') {
        ellipse(700, 180, 60, 100); // Intersection only
    }
    noStroke();
    // Draw actual Venn circles
    fill(255, 150); // Semi-transparent white to differentiate
    stroke(0);
    ellipse(650, 180, 150, 150); // A
    ellipse(750, 180, 150, 150); // B
    // Place values in correct locations
    this.drawValuesInCircle(650, 180, 60, Aonly, 'black'); // A only
    this.drawValuesInCircle(750, 180, 60, Bonly, 'black'); // B only
    this.drawValuesInCircle(700, 180, 40, intersection, 'red'); // Intersection
}
drawValuesInCircle(cx, cy, radius, values, color) {
  textAlign(CENTER, CENTER);
  let total = values.length;
  for (let i = 0; i < total; i++) {
    let angle = map(i, 0, total, PI / 2, TWO_PI + PI / 2); // Spread values in a circular pattern
    let x = cx + cos(angle) * (radius * 0.4); // Adjust spacing
    let y = cy + sin(angle) * (radius * 0.4);
    // Check if the value is part of the correct solution
    if (model.correctSet.includes(values[i])) {
      noStroke(); // No border
      // fill('#9bc53d'); // Green background
      // rect(x - 10, y - 10, 20, 20, 5); // Background box
    }
    // Draw text on top of the background
    fill(color);
    text(values[i], x, y);
  }
}
}
class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    document.getElementById("new-check").addEventListener("click", this.handleClick('value'));
  }
 
  handleClick(value) {
    console.log('Function hit')
    let clickedValue = null;

    // Check if user clicked a value in Set A
    if (mouseY > 60 && mouseY < 80) {
      const index = Math.floor((mouseX - 70) / 40);
      if (index >= 0 && index < this.model.setA.length) {
        clickedValue = this.model.setA[index];
      }
    }
    // Check if user clicked a value in Set B
    else if (mouseY > 100 && mouseY < 120) {
      const index = Math.floor((mouseX - 70) / 40);
      if (index >= 0 && index < this.model.setB.length) {
        clickedValue = this.model.setB[index];
      }
    }
    // Check if user clicked a value in the Answer Set
    else if (mouseY > 140 && mouseY < 160) {
      const index = Math.floor((mouseX - 140) / 40);
      if (index >= 0 && index < this.model.selectedElements.length) {
        clickedValue = this.model.selectedElements[index];
      }
    }

    // If a value was clicked, move it between sets and answer set
    if (clickedValue !== null) {
      this.toggleSelection(clickedValue);
    }

    // Check button functionality
    if (mouseX > 20 && mouseX < 120 && mouseY > 340 && mouseY < 380) {
      const correct = this.model.checkAnswer();
      if (!correct) {
        this.model.attempt++;
      } else {
        this.model.attempt = 3; // If correct, show solution immediately
      }
    }

    // New Problem Button
    if (mouseX > 140 && mouseX < 300 && mouseY > 340 && mouseY < 380 && (this.model.attempt >= 3 || this.model.checkAnswer())) {
      this.model.generateProblem();
    }

    if(value == checkAnswer){
      if(!correct){
        this.model.attempt++;
      }else{
        this.model.attempt =3;
      }
    }

    
  }
  

  toggleSelection(value) {
    const selectedIndex = this.model.selectedElements.indexOf(value);

    // Move value to answer set if not already selected
    if (selectedIndex === -1) {
      this.model.selectedElements.push(value);
    } 
    // Move value back to original sets
    else {
      this.model.selectedElements.splice(selectedIndex, 1);
    }
  }
}
function setup() {
  model = new Model();
  view = new View();
  controller = new Controller(model, view);
}
function draw() {
  view.draw(model);
}

function mousePressed() {
  controller.handleClick();
}