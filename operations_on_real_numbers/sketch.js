// --- Global state for view management ---
let currentView = "operations"; // 'operations', 'explore', 'venn'

// --- UI elements for the main navigation toggle ---
let mainNavButtons = [];
let mainSliderX;
let targetMainSliderX;

// --- Variables for the Operations View ---
let currentOperation = "+";
let firstNumber = "";
let secondNumber = "";
let result = null;
let showResult = false;
let inputMode = "first";
let operationButtons = [];
let inputBoxes = [];
let randomNumberButton;
let presetNumbers = [
    { value: 2, type: "rational", display: "2" },
    { value: 3, type: "rational", display: "3" },
    { value: 0.5, type: "rational", display: "1/2" },
    { value: 0.75, type: "rational", display: "3/4" },
    { value: Math.sqrt(2), type: "irrational", display: "√2" },
    { value: Math.sqrt(3), type: "irrational", display: "√3" },
    { value: Math.PI, type: "irrational", display: "π" },
    { value: Math.E, type: "irrational", display: "e" },
];

// --- Variables for the Explore View ---
let explore;

// --- Variables for the Venn Diagram View ---
let vennLayout;

// --- On-screen Keyboard Variable ---
let keyboardContainer;

// --- Global Colors ---
let rationalColor,
    irrationalColor,
    neutralColor,
    highlightColor,
    primaryUIColor;

function setup() {
    let canvas = createCanvas(800, 500);
    canvas.parent("sketch-container");

    keyboardContainer = select('#keyboard-container');

    // Initialize colors
    rationalColor = color(52, 152, 219);
    irrationalColor = color(231, 76, 60);
    neutralColor = color(149, 165, 166);
    highlightColor = color(46, 204, 113);
    primaryUIColor = color(120, 81, 169);

    setupMainUI();
    setupOperationsUI();
    setupVennUI();
    setupExploreUI();

    setupKeyboardListeners();
}

// --- MODIFICATION: Redesigned the main navigation UI to be full-width ---
function setupMainUI() {
    let navX = 0; // Start from the left edge
    let navY = 0;
    let navW = width; // Take full canvas width
    let navH = 40; // Slightly taller for better look
    let segmentW = navW / 3;

    mainNavButtons = [
        {
            x: navX,
            y: navY,
            w: segmentW,
            h: navH,
            view: "operations",
            label: "Operations",
        },
        {
            x: navX + segmentW,
            y: navY,
            w: segmentW,
            h: navH,
            view: "explore",
            label: "Explore",
        },
        {
            x: navX + 2 * segmentW,
            y: navY,
            w: segmentW,
            h: navH,
            view: "venn",
            label: "Venn Diagram",
        },
    ];

    let initialIndex = mainNavButtons.findIndex(
        (btn) => btn.view === currentView
    );
    mainSliderX = mainNavButtons[initialIndex].x;
    targetMainSliderX = mainSliderX;
}

function setupOperationsUI() {
    let startX = 180;
    let yPos = 95;
    let spacing = 150;
    operationButtons = [
        { x: startX, y: yPos, op: "+", label: "Addition", radius: 8 },
        { x: startX + spacing, y: yPos, op: "-", label: "Subtraction", radius: 8 },
        { x: startX + spacing * 2, y: yPos, op: "*", label: "Multiplication", radius: 8 },
        { x: startX + spacing * 3, y: yPos, op: "/", label: "Division", radius: 8 },
    ];

    const inputBoxWidth = 150;
    const inputGap = 60; 
    const totalInputsWidth = (inputBoxWidth * 2) + inputGap;
    const firstInputX = (width - totalInputsWidth) / 2;
    const inputsY = 170;

    inputBoxes = [
        { x: firstInputX, y: inputsY, w: inputBoxWidth, h: 30, label: "First Number:" },
        { x: firstInputX + inputBoxWidth + inputGap, y: inputsY, w: inputBoxWidth, h: 30, label: "Second Number:" },
    ];

    const randomBtnWidth = 200;
    randomNumberButton = {
        x: (width - randomBtnWidth) / 2,
        y: inputsY + 30 + 20,
        w: randomBtnWidth,
        h: 30,
        label: "Generate Random Numbers",
    };

    let presetStartY = randomNumberButton.y + randomNumberButton.h + 25;
    let presetStartX = 50;
    let buttonWidth = 80;
    let buttonHeight = 30;
    let presetSpacing = 90;
    for (let i = 0; i < presetNumbers.length; i++) {
        presetNumbers[i].x = presetStartX + (i % 8) * presetSpacing;
        presetNumbers[i].y = presetStartY;
        presetNumbers[i].w = buttonWidth;
        presetNumbers[i].h = buttonHeight;
    }
}

function setupExploreUI() {
    explore = {
        mode: "analyzer",
        analyzer: {
            inputString: "",
            isActive: false,
            result: null,
            ui: {
                inputBox: { x: 200, y: 150, w: 300, h: 40 },
                button: { x: 520, y: 150, w: 100, h: 40, label: "Analyze" },
            },
        },
        challenge: {
            question: null,
            feedback: "",

            answered: false,
            askedQuestionIndices: new Set(),
            questionBank: [
                {
                    text: "Is the product of √2 and √8 rational or irrational?",
                    type: "mc",
                    options: ["Rational", "Irrational"],
                    answer: "Rational",
                },
                {
                    text: "True or False: All integers are also rational numbers.",
                    type: "tf",
                    options: ["True", "False"],
                    answer: "True",
                },
                {
                    text: "Is π + (-π) rational or irrational?",
                    type: "mc",
                    options: ["Rational", "Irrational"],
                    answer: "Rational",
                },
                {
                    text: "True or False: The set of real numbers is closed under subtraction.",
                    type: "tf",
                    options: ["True", "False"],
                    answer: "True",
                },
                {
                    text: "Is 0 a natural number?",
                    type: "tf",
                    options: ["True", "False"],
                    answer: "False",
                },
                { text: "Is the product of √2 and 3 rational or irrational?", type: "mc", options: ["Rational", "Irrational"], answer: "Irrational" },
                { text: "True or False: Real numbers are closed under subtraction.", type: "tf", options: ["True", "False"], answer: "True" },
                { text: "Is the sum of √2 and 5 rational or irrational?", type: "mc", options: ["Rational", "Irrational"], answer: "Irrational" },
                { text: "Is the product of √3 and √3 rational or irrational?", type: "mc", options: ["Rational", "Irrational"], answer: "Rational" },
                { text: "Is the square of √5 rational or irrational?", type: "mc", options: ["Rational", "Irrational"], answer: "Rational" },
                { text: "Is the sum of π and 2 rational or irrational?", type: "mc", options: ["Rational", "Irrational"], answer: "Irrational" },
                { text: "Is 7 divided by √2 rational or irrational?", type: "mc", options: ["Rational", "Irrational"], answer: "Irrational" },
                { text: "Is the product of a rational number and an irrational number always irrational?", type: "tf", options: ["True", "False"], answer: "False" },
                { text: "Is the sum of two irrational numbers always irrational?", type: "tf", options: ["True", "False"], answer: "False" },
                { text: "Is the square root of 49 rational or irrational?", type: "mc", options: ["Rational", "Irrational"], answer: "Rational" },
                { text: "Is √8 rational or irrational?", type: "mc", options: ["Rational", "Irrational"], answer: "Irrational" },
                { text: "Is the product of 0 and an irrational number rational or irrational?", type: "mc", options: ["Rational", "Irrational"], answer: "Rational" },
                { text: "True or False: Rational numbers are closed under addition.", type: "tf", options: ["True", "False"], answer: "True" },
                { text: "True or False: Irrational numbers are closed under multiplication.", type: "tf", options: ["True", "False"], answer: "False" },
                { text: "True or False: The sum of two rational numbers is always rational.", type: "tf", options: ["True", "False"], answer: "True" },
                { text: "True or False: Real numbers are closed under division.", type: "tf", options: ["True", "False"], answer: "False" },
                { text: "True or False: √2 is a rational number.", type: "tf", options: ["True", "False"], answer: "False" },
                { text: "True or False: The sum of a rational and an irrational number is irrational.", type: "tf", options: ["True", "False"], answer: "True" },
                { text: "True or False: All integers are rational numbers.", type: "tf", options: ["True", "False"], answer: "True" },
                { text: "True or False: Rational numbers are not closed under subtraction.", type: "tf", options: ["True", "False"], answer: "False" },
            ],
            ui: {
                questionBox: { x: 150, y: 160, w: 500, h: 100 },
                option1: { x: 250, y: 300, w: 140, h: 40 },
                option2: { x: 410, y: 300, w: 140, h: 40 },
                nextButton: { x: 330, y: 400, w: 140, h: 40, label: "Next Question" },
            },
        },
        modeButtons: {
            analyzer: { x: 280, y: 80, radius: 8, label: "Number Analyzer" },
            challenge: { x: 450, y: 80, radius: 8, label: "Challenge Mode" },
        },
    };
    generateChallengeQuestion();
}

function setupVennUI() {
    vennLayout = {};
    const canvasPadding = 20;
    const topMargin = 70; 
    const standingRectWidth = 80;
    const gap = 15;
    const bottomMarginForButton = 50;

    vennLayout.leftRect = {
        x: canvasPadding,
        y: topMargin + 20,
        w: standingRectWidth,
        h: height - topMargin - canvasPadding * 2 - bottomMarginForButton,
    };
    vennLayout.rightRect = {
        x: width - canvasPadding - standingRectWidth,
        y: topMargin + 20,
        w: standingRectWidth,
        h: height - topMargin - canvasPadding * 2 - bottomMarginForButton,
    };

    const universalSetX = vennLayout.leftRect.x + standingRectWidth + gap;
    const universalSetWidth = width - universalSetX - (width - vennLayout.rightRect.x) - gap;
    const universalSetHeight = height - topMargin - canvasPadding - bottomMarginForButton;

    vennLayout.universalSet = {
        x: universalSetX,
        y: topMargin,
        w: universalSetWidth,
        h: universalSetHeight,
    };

    const innerPadding = 10;
    const subsetY = vennLayout.universalSet.y + innerPadding + 20;
    const subsetH = vennLayout.universalSet.h - innerPadding * 2 - 20;
    const totalSubsetW = vennLayout.universalSet.w - innerPadding * 2;

    vennLayout.rationalSection = {
        x: vennLayout.universalSet.x + innerPadding,
        y: subsetY,
        w: totalSubsetW * 0.5,
        h: subsetH,
    };
    vennLayout.irrationalSection = {
        x: vennLayout.rationalSection.x + vennLayout.rationalSection.w,
        y: subsetY,
        w: totalSubsetW * 0.5,
        h: subsetH,
    };

    vennLayout.resetButton = {
        x: width / 2 - 50,
        y: height - 40,
        w: 100,
        h: 30,
        label: "Reset",
    };
    vennLayout.vennNumbers = [];
    vennLayout.placedNumbers = [];

    const rationalSpots = [];
    const ratX = vennLayout.rationalSection.x;
    const ratY = vennLayout.rationalSection.y;
    const ratW = vennLayout.rationalSection.w;
    const ratH = vennLayout.rationalSection.h;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
            rationalSpots.push({
                x: ratX + (ratW / 4) * (col + 1),
                y: ratY + (ratH / 5) * (row + 1),
                used: false,
            });
        }
    }

    const irrationalSpots = [];
    const irratX = vennLayout.irrationalSection.x;
    const irratY = vennLayout.irrationalSection.y;
    const irratW = vennLayout.irrationalSection.w;
    const irratH = vennLayout.irrationalSection.h;
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 3; col++) {
            irrationalSpots.push({
                x: irratX + (irratW / 4) * (col + 1),
                y: irratY + (irratH / 5) * (row + 1),
                used: false,
            });
        }
    }

    vennLayout.placementSpots = {
        rational: rationalSpots,
        irrational: irrationalSpots,
    };

    resetVennDiagram();
}

function draw() {
    background(248, 249, 250);
    mainSliderX = lerp(mainSliderX, targetMainSliderX, 0.2);

    if (currentView === 'explore' && explore.mode === 'analyzer' && explore.analyzer.isActive) {
        keyboardContainer.addClass('visible');
    } else {
        keyboardContainer.removeClass('visible');
    }

    drawMainNavigation();
    switch (currentView) {
        case "operations":
            drawOperationsView();
            break;
        case "explore":
            drawExploreView();
            break;
        case "venn":
            drawVennView();
            break;
    }
}

// --- MODIFICATION: Updated drawing logic for the full-width nav bar ---
function drawMainNavigation() {
    let navProps = mainNavButtons[0];
    let totalWidth = mainNavButtons.length * navProps.w;
    let cornerRadius = 0; // Radius for the slider

    noStroke();
    fill(primaryUIColor);
    // Draw a non-rounded background rect for a flush look
    rect(navProps.x, navProps.y, totalWidth, navProps.h);

    // Keep the slider rounded
    fill(255);
    rect(mainSliderX, navProps.y, navProps.w, navProps.h, cornerRadius);

    textAlign(CENTER, CENTER);
    textSize(16); // Slightly larger text
    for (let btn of mainNavButtons) {
        fill(currentView === btn.view ? primaryUIColor : 255);
        text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    }
}

function drawOperationsView() {
    drawOperationSelectors();
    drawInputSection();
    drawRandomNumberButton();
    drawNumberPresets();
    drawCalculationArea();
}

function drawPlaceholderView(title, description) {
    textAlign(CENTER, CENTER);
    fill(51);
    textSize(24);
    text(title, width / 2, height / 2 - 20);
    textSize(14);
    fill(100);
    text(description, width / 2, height / 2 + 20);
}

function drawExploreView() {
    for (const mode in explore.modeButtons) {
        const btn = explore.modeButtons[mode];
        const isSelected = explore.mode === mode;
        strokeWeight(2);
        stroke(neutralColor);
        noFill();
        ellipse(btn.x, btn.y, btn.radius * 2, btn.radius * 2);
        if (isSelected) {
            noStroke();
            fill(primaryUIColor);
            ellipse(btn.x, btn.y, btn.radius, btn.radius);
        }
        noStroke();
        fill(51);
        textAlign(LEFT, CENTER);
        textSize(14);
        text(btn.label, btn.x + 15, btn.y);
    }
    if (explore.mode === "analyzer") {
        drawAnalyzerUI();
    } else {
        drawChallengeUI();
    }
}

function drawAnalyzerUI() {
    const ui = explore.analyzer.ui;
    const isActive = explore.analyzer.isActive;
    fill(51);
    textSize(16);
    textAlign(CENTER, CENTER);
    text("Enter any number to see its properties", width / 2, 130);
    strokeWeight(isActive ? 2 : 1);
    stroke(isActive ? highlightColor : neutralColor);
    fill(255);
    rect(ui.inputBox.x, ui.inputBox.y, ui.inputBox.w, ui.inputBox.h, 3);
    fill(51);
    noStroke();
    textAlign(LEFT, CENTER);
    textSize(14);
    text(
        explore.analyzer.inputString +
        (isActive && frameCount % 60 < 30 ? "|" : ""),
        ui.inputBox.x + 10,
        ui.inputBox.y + ui.inputBox.h / 2
    );
    const btn = ui.button;
   const isHovered = (
        mouseX > btn.x && 
        mouseX < btn.x + btn.w &&
        mouseY > btn.y && 
        mouseY < btn.y + btn.h
    );
    
    stroke(neutralColor);
    strokeWeight(1);
    fill(isHovered ? 240 : 255);
    rect(btn.x, btn.y, btn.w, btn.h, 3);
    noStroke();
    fill(51);
    textAlign(CENTER, CENTER);
    text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    if (explore.analyzer.result) {
        const res = explore.analyzer.result;
        let yPos = 220;
        fill(51);
        textAlign(LEFT, TOP);
        for (const prop of res.properties) {
            fill(prop.value ? highlightColor : irrationalColor);
            text(`- ${prop.label}: ${prop.value}`, 200, yPos);
            yPos += 25;
        }
        fill(neutralColor);
        textSize(12);
        text(`Reason: ${res.reason}`, 200, yPos + 10, 400);
    }
}

function drawChallengeUI() {
    const q = explore.challenge.question;
    const ui = explore.challenge.ui;
    if (!q) return;
    stroke(neutralColor);
    strokeWeight(1);
    fill(253);
    rect(
        ui.questionBox.x,
        ui.questionBox.y,
        ui.questionBox.w,
        ui.questionBox.h,
        5
    );
    noStroke();
    fill(51);
    textSize(18);
    textAlign(CENTER, CENTER);
    text(
        q.text,
        ui.questionBox.x + 10,
        ui.questionBox.y + 10,
        ui.questionBox.w - 20,
        ui.questionBox.h - 20
    );
    for (let i = 0; i < q.options.length; i++) {
        const btn = i === 0 ? ui.option1 : ui.option2;
        btn.label = q.options[i];
        const isHovered =
            mouseX > btn.x &&
            mouseX < btn.x + btn.w &&
            mouseY > btn.y &&
            mouseY < btn.y + btn.h;
        stroke(neutralColor);
        strokeWeight(1);
        fill(isHovered ? 240 : 255);
        rect(btn.x, btn.y, btn.w, btn.h, 5);
        noStroke();
        fill(51);
        text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    }
    if (explore.challenge.feedback) {
        if (explore.challenge.feedback.includes("Correct")) {
            fill(highlightColor);
        } else {
            fill(irrationalColor);
        }
        textSize(16);
        text(explore.challenge.feedback, width / 2, 360);
    }
    if (explore.challenge.answered) {
        const btn = ui.nextButton;
        const isHovered =
            mouseX > btn.x &&
            mouseX < btn.x + btn.w &&
            mouseY > btn.y &&
            mouseY < btn.y + btn.h;
        fill(isHovered ? primaryUIColor : neutralColor);
        noStroke();
        rect(btn.x, btn.y, btn.w, btn.h, 5);
        fill(255);
        text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
    }
}

function drawVennView() {
    const layout = vennLayout;

    noStroke();
    fill(235);
    rect(layout.leftRect.x, layout.leftRect.y, layout.leftRect.w, layout.leftRect.h, 5);
    rect(layout.rightRect.x, layout.rightRect.y, layout.rightRect.w, layout.rightRect.h, 5);

    stroke(150);
    strokeWeight(2);
    noFill();
    rect(layout.universalSet.x, layout.universalSet.y, layout.universalSet.w, layout.universalSet.h, 5);

    const labelText = "Real Numbers";
    textSize(16);
    const labelWidth = textWidth(labelText) + 10;
    const labelX = layout.universalSet.x + (layout.universalSet.w - labelWidth) / 2;
    const labelY = layout.universalSet.y - 10;
    fill(248, 249, 250);
    noStroke();
    rect(labelX, labelY, labelWidth, 20);
    fill(51);
    textAlign(CENTER, CENTER);
    text(labelText, labelX + labelWidth / 2, labelY + 10);

    stroke(180);
    strokeWeight(1.5);
    fill(245);
    rect(layout.rationalSection.x, layout.rationalSection.y, layout.rationalSection.w, layout.rationalSection.h);
    fill(240);
    rect(layout.irrationalSection.x, layout.irrationalSection.y, layout.irrationalSection.w, layout.irrationalSection.h);

    noStroke();
    fill(51);
    textSize(18);
    textAlign(CENTER, TOP);
    text("Rational Numbers", layout.rationalSection.x + layout.rationalSection.w / 2, layout.rationalSection.y + 10);
    text("Irrational Numbers", layout.irrationalSection.x + layout.irrationalSection.w / 2, layout.irrationalSection.y + 10);

    for (const num of layout.vennNumbers) {
        const isHovered = mouseX > num.x && mouseX < num.x + num.w && mouseY > num.y && mouseY < num.y + num.h;
        fill(isHovered ? highlightColor : 255);
        stroke(180);
        rect(num.x, num.y, num.w, num.h, 3);
        noStroke();
        fill(51);
        textSize(14);
        textAlign(CENTER, CENTER);
        text(num.display, num.x + num.w / 2, num.y + num.h / 2);
    }

    for (const num of layout.placedNumbers) {
        const boxWidth = textWidth(num.display) + 10;
        const boxHeight = 22;
        noStroke();
        fill(255);
        rectMode(CENTER);
        rect(num.x, num.y, boxWidth, boxHeight, 3);
        const numColor = num.type === "irrational" ? irrationalColor : rationalColor;
        fill(numColor);
        textSize(14);
        textAlign(CENTER, CENTER);
        text(num.display, num.x, num.y);
    }

    rectMode(CORNER);
    const btn = layout.resetButton;
    const isHovered = mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h;
    fill(isHovered ? primaryUIColor : neutralColor);
    stroke(51);
    strokeWeight(1);
    rect(btn.x, btn.y, btn.w, btn.h, 5);
    noStroke();
    fill(255);
    textSize(14);
    textAlign(CENTER, CENTER); 
    text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
}

function drawOperationSelectors() {
    for (let btn of operationButtons) {
        stroke(150);
        strokeWeight(2);
        fill(255);
        ellipse(btn.x, btn.y, btn.radius * 2, btn.radius * 2);
        if (currentOperation === btn.op) {
            noStroke();
            fill(51);
            ellipse(btn.x, btn.y, btn.radius, btn.radius);
        }
        noStroke();
        fill(51);
        textSize(14);
        textAlign(LEFT, CENTER);
        text(btn.label, btn.x + 15, btn.y);
    }
}

// --- MODIFICATION: Added operation symbol between input boxes ---
function drawInputSection() {
    textAlign(LEFT, CENTER);
    textSize(12);

    for (let i = 0; i < inputBoxes.length; i++) {
        let box = inputBoxes[i];

        noStroke();
        fill(51);
        textAlign(CENTER, CENTER);
        text(box.label, box.x + box.w / 2, box.y - 15);

        if (inputMode === (i === 0 ? "first" : "second")) {
            stroke(primaryUIColor);
        } else {
            stroke(180);
        }
        strokeWeight(1.5);
        fill(255);
        rect(box.x, box.y, box.w, box.h, 3);

        noStroke();
        fill(51);
        textAlign(LEFT, CENTER);
        text(i === 0 ? firstNumber : secondNumber, box.x + 5, box.y + box.h / 2);
    }
    
    // This entire block is needed to draw the symbol
    let box1 = inputBoxes[0];
    let box2 = inputBoxes[1];
    let symbolX = box1.x + box1.w + (box2.x - (box1.x + box1.w)) / 2;
    let symbolY = box1.y + box1.h / 2;

    fill(51); 
    textSize(24);
    textAlign(CENTER, CENTER);
    noStroke();
    text(currentOperation, symbolX, symbolY);
}

function drawRandomNumberButton() {
    let btn = randomNumberButton;
    let isHovered = mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h;
    stroke(isHovered ? primaryUIColor : 180);
    strokeWeight(1.5);
    fill(isHovered ? 240 : 255);
    rect(btn.x, btn.y, btn.w, btn.h, 5);
    noStroke();
    fill(isHovered ? primaryUIColor : 51);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(btn.label, btn.x + btn.w / 2, btn.y + btn.h / 2);
}

function drawNumberPresets() {
    textAlign(CENTER, CENTER);
    textSize(11);
    for (let num of presetNumbers) {
        if (num.type === "rational") {
            fill(red(rationalColor), green(rationalColor), blue(rationalColor), 100);
            stroke(rationalColor);
        } else {
            fill(red(irrationalColor), green(irrationalColor), blue(irrationalColor), 100);
            stroke(irrationalColor);
        }
        strokeWeight(1);
        rect(num.x, num.y, num.w, num.h, 3);

        noStroke();
        fill(51);
        text(num.display, num.x + num.w / 2, num.y + num.h / 2);
    }
}

function drawCalculationArea() {
    if (!showResult || !result) return;
    let boxHeight = 140;
    let lastElement = presetNumbers[presetNumbers.length - 1];
    let startY = lastElement.y + lastElement.h + 20;
    let startX = 250
    let resultX = 370
    fill(245, 245, 245);
    stroke(200);
    strokeWeight(1);
    rect(50, startY, 700, boxHeight, 5);

    textAlign(LEFT, TOP);
    fill(51);
    textSize(14);
    text("Calculation & Result:", startX, startY + 10);

    let yPos = startY + 45;
    const ySpacing = 25;

    fill(51);
    text("Exact Form:", startX, yPos);
    text(result.exact, resultX, yPos);
    yPos += ySpacing;

    text("Conversion:", startX, yPos);
    text(result.conversion, resultX, yPos);
    yPos += ySpacing;

    let decimalString = result.isApproximate ? `≈ ${result.decimal}` : `${result.decimal}`;
    text("Decimal Form:", startX, yPos);
    text(` ${decimalString}`, resultX, yPos);
    yPos += ySpacing;

    if (result.type === "rational") {
        fill(rationalColor);
        text("Result:", startX, yPos);
        fill(rationalColor);
        text("RATIONAL", resultX, yPos);
    } else if (result.type === "irrational") {
        fill(irrationalColor);
        text("Result:", startX, yPos);
        fill(irrationalColor);
        text("IRRATIONAL", resultX, yPos);
    }
}

function drawPropertiesSection() {
    if (!showResult || !result) return;
    let lastElement = presetNumbers[presetNumbers.length - 1];
    let calcAreaEndY = lastElement.y + lastElement.h + 20 + 140;
    let startY = calcAreaEndY + 15;

    textAlign(LEFT, TOP);
    textSize(12);
    fill(51);
    text("Properties:", 60, startY);
    const propertiesToDraw = [
        { label: "Closure", applies: result.properties.closure },
        { label: "Commutative", applies: result.properties.commutative },
        { label: "Associative", applies: result.properties.associative },
        { label: "Distributive", applies: result.properties.distributive },
    ];
    let startX = 140;
    const spacing = 150;
    for (let i = 0; i < propertiesToDraw.length; i++) {
        let prop = propertiesToDraw[i];
        let x = startX + i * spacing;
        if (prop.applies) {
            fill(highlightColor);
            text(`✓ ${prop.label}`, x, startY);
        } else {
            fill(180);
            text(`○ ${prop.label}`, x, startY);
        }
    }
}

function setupKeyboardListeners() {
    const keys = selectAll('.key');
    for (let key of keys) {
        key.mousePressed(() => handleVirtualKeyPress(key));
    }
}

function handleVirtualKeyPress(key) {
    if (currentView !== 'explore' || explore.mode !== 'analyzer' || !explore.analyzer.isActive) return;

    const value = key.html();
    const action = key.attribute('data-action');

    if (action) {
        if (action === 'backspace') {
            if (explore.analyzer.inputString.length > 0) {
                explore.analyzer.inputString = explore.analyzer.inputString.slice(0, -1);
            }
        } else if (action === 'clear') {
            explore.analyzer.inputString = "";
            explore.analyzer.result = null;
        }
    } else {
        explore.analyzer.inputString += value;
    }
}

function analyzeNumber() {
    const str = explore.analyzer.inputString.trim();
    if (str === "") {
        explore.analyzer.result = null;
        return;
    }

    let value;
    let isFrac = false;
    let isSqrt = false;
    let reasonPrefix = "";

    if (str.startsWith('√')) {
        isSqrt = true;
        const numberPart = str.slice(1);
        const radicand = parseFloat(numberPart);

        if (!isNaN(radicand) && radicand >= 0) {
            value = Math.sqrt(radicand);
            if (value % 1 === 0) {
                reasonPrefix = `The input ${str} is a perfect square, resulting in ${value}. `;
            } else {
                reasonPrefix = `The input ${str} is not a perfect square. `;
            }
        } else {
            value = NaN;
        }
    } else if (str.includes("/")) {
        isFrac = true;
        const parts = str.split("/");
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1]) && +parts[1] !== 0) {
            value = parseFloat(parts[0]) / parseFloat(parts[1]);
        } else {
            value = NaN;
        }
    } else {
        value = parseFloat(str);
    }

    if (isNaN(value)) {
        explore.analyzer.result = { properties: [], reason: "Invalid number format." };
        return;
    }

    const isInt = Number.isInteger(value);
    const result = { properties: [], reason: "" };

    let isResultRational;
    if (isSqrt) {
        isResultRational = (value % 1 === 0);
    } else if (isIrrationalConstant(str)) {
        isResultRational = false;
    } else {
        isResultRational = true;
    }

    result.properties.push({ label: "Rational", value: isResultRational });
    result.properties.push({ label: "Irrational", value: !isResultRational });
    result.properties.push({ label: "Integer", value: isInt && isResultRational });
    result.properties.push({ label: "Whole", value: isInt && isResultRational && value >= 0 });
    result.properties.push({ label: "Natural", value: isInt && isResultRational && value > 0 });
    result.properties.push({ label: "Real", value: true });

    let finalReason = reasonPrefix;
    if (!isResultRational) {
        finalReason += "Its decimal representation is non-terminating and non-repeating.";
    } else if (isInt) {
        finalReason += "It is an integer, which can be written as a fraction with a denominator of 1.";
    } else if (isFrac) {
        finalReason += "It is expressed as a fraction of two integers.";
    } else {
        finalReason += "It has a terminating decimal representation.";
    }
    result.reason = finalReason;

    explore.analyzer.result = result;
}

function isIrrationalConstant(str) {
    return ["pi", "π", "e"].includes(str.toLowerCase());
}

function generateChallengeQuestion() {
    const bank = explore.challenge.questionBank;
    let availableIndices = [];
    for (let i = 0; i < bank.length; i++) {
        if (!explore.challenge.askedQuestionIndices.has(i)) {
            availableIndices.push(i);
        }
    }
    if (availableIndices.length === 0) {
        explore.challenge.askedQuestionIndices.clear();
        availableIndices = Array.from(Array(bank.length).keys());
    }
    const randomIndex = floor(random(availableIndices.length));
    const questionIndex = availableIndices[randomIndex];
    explore.challenge.question = bank[questionIndex];
    explore.challenge.askedQuestionIndices.add(questionIndex);
    explore.challenge.feedback = "";
    explore.challenge.answered = false;
}

function checkChallengeAnswer(answer) {
    if (explore.challenge.answered) return;
    if (answer === explore.challenge.question.answer) {
        explore.challenge.feedback = "Correct! ✅";
    } else {
        explore.challenge.feedback = `Incorrect. The correct answer is ${explore.challenge.question.answer}.`;
    }
    explore.challenge.answered = true;
}

function generateNumberForType(type, usedValues) {
    let attempts = 0;
    while (attempts < 50) {
        attempts++;
        let value, display;
        switch (type) {
            case "natural": value = floor(random(1, 100)); break;
            case "whole": value = 0; break;
            case "integer": value = floor(random(-100, -1)); break;
            case "rational":
                let num = floor(random(1, 20)), den = floor(random(2, 20));
                while (num % den === 0 || num / den > 5) {
                    den = floor(random(2, 20));
                    num = floor(random(1, 20));
                }
                value = num / den;
                display = `${num}/${den}`;
                break;
            case "irrational":
                const irrationals = [
                    { v: Math.sqrt(2), d: "√2" },
                    { v: Math.sqrt(3), d: "√3" },
                    { v: Math.sqrt(5), d: "√5" },
                    { v: Math.PI, d: "π" },
                    { v: Math.E, d: "e" },
                    { v: Math.PI / 2, d: "π/2" }
                ];
                const selected = random(irrationals);
                value = selected.v;
                display = selected.d;
                break;
        }
        if (!usedValues.has(value)) {
            return { value, display: display || value.toString() };
        }
    }
    return null;
}

function generateVennNumbers() {
    vennLayout.vennNumbers = [];
    const usedValues = new Set(vennLayout.placedNumbers.map((n) => n.value));
    const categoriesToGenerate = ["natural", "whole", "integer", "rational", "irrational", "natural", "integer", "rational", "irrational", "integer"];
    for (const type of categoriesToGenerate) {
        const placeType = classifyNumberToPlacementArea(type);
        if (vennLayout.placementSpots[placeType] && vennLayout.placementSpots[placeType].every((spot) => spot.used)) continue;
        const generated = generateNumberForType(type, usedValues);
        if (generated) {
            vennLayout.vennNumbers.push({ ...generated, type: classifyNumber(generated.value) });
            usedValues.add(generated.value);
        }
    }
    while (vennLayout.vennNumbers.length < 10) {
        const fallbackType = random(["natural", "integer", "rational", "irrational"]);
        const placeType = classifyNumberToPlacementArea(fallbackType);
        if (vennLayout.placementSpots[placeType] && vennLayout.placementSpots[placeType].every((spot) => spot.used)) continue;
        const generated = generateNumberForType(fallbackType, usedValues);
        if (generated) {
            vennLayout.vennNumbers.push({ ...generated, type: classifyNumber(generated.value) });
            usedValues.add(generated.value);
        } else {
            const fallbackNum = floor(random(201, 300));
            if (!usedValues.has(fallbackNum)) {
                vennLayout.vennNumbers.push({ value: fallbackNum, display: String(fallbackNum), type: "natural" });
                usedValues.add(fallbackNum);
            }
        }
    }
    const panelH = vennLayout.leftRect.h;
    const btnH = 40;
    const vGap = (panelH - 5 * btnH) / 6;
    for (let i = 0; i < 10; i++) {
        const num = vennLayout.vennNumbers[i];
        num.w = 60;
        num.h = btnH;
        const panelIndex = i % 5;
        if (i < 5) {
            num.x = vennLayout.leftRect.x + (vennLayout.leftRect.w - num.w) / 2;
            num.y = vennLayout.leftRect.y + vGap + panelIndex * (btnH + vGap);
        } else {
            num.x = vennLayout.rightRect.x + (vennLayout.rightRect.w - num.w) / 2;
            num.y = vennLayout.rightRect.y + vGap + panelIndex * (btnH + vGap);
        }
    }
}

function classifyNumber(num) {
    if ([Math.PI, Math.E, Math.PI / 2, Math.sqrt(2), Math.sqrt(3), Math.sqrt(5)].includes(num)) return "irrational";
    if (Number.isInteger(num)) {
        if (num > 0) return "natural";
        if (num === 0) return "whole";
        return "integer";
    }
    if (num > 0 && !Number.isInteger(Math.sqrt(num)) && num.toString().includes('.')) {
        let sqrtTest = Math.sqrt(num);
        if (sqrtTest % 1 !== 0) return "irrational";
    }
    return "rational";
}

function classifyNumberToPlacementArea(type) {
    if (type === "irrational") { return "irrational"; }
    return "rational";
}

function findPlacementPosition(type) {
    const placeType = classifyNumberToPlacementArea(type);
    if (!vennLayout.placementSpots[placeType]) return null;
    const spots = vennLayout.placementSpots[placeType];
    for (let i = 0; i < spots.length; i++) {
        if (!spots[i].used) {
            spots[i].used = true;
            return spots[i];
        }
    }
    return null;
}

function resetVennDiagram() {
    vennLayout.placedNumbers = [];
    for (const type in vennLayout.placementSpots) {
        vennLayout.placementSpots[type].forEach((spot) => (spot.used = false));
    }
    generateVennNumbers();
}

function setRandomNumbers() {
    let num1 = generateRandomNumber();
    let num2 = generateRandomNumber();
    firstNumber = num1.display;
    secondNumber = num2.display;
    showResult = false;
    result = null;
    if (firstNumber && secondNumber) {
        calculateResult();
    }
}

function generateRandomNumber() {
    if (random() > 0.5) {
        let irrationals = presetNumbers.filter((n) => n.type === "irrational");
        return random(irrationals);
    } else {
        if (random() > 0.5) {
            let val = floor(random(-100, 101));
            return { value: val, display: val.toString(), type: "rational" };
        } else {
            let num = floor(random(1, 20));
            let den = floor(random(2, 20));
            if (num === den) den++;
            return { value: num / den, display: `${num}/${den}`, type: "rational" };
        }
    }
}

function getValueFromString(str) {
    let preset = presetNumbers.find((p) => p.display === str);
    if (preset) return preset.value;
    if (str.includes("/")) {
        let parts = str.split("/");
        if (parts.length === 2) {
            let num = parseFloat(parts[0]);
            let den = parseFloat(parts[1]);
            if (!isNaN(num) && !isNaN(den) && den !== 0) return num / den;
        }
    }
    return parseFloat(str);
}

function calculateResult() {
    if (firstNumber === "" || secondNumber === "") return;
    let num1 = getValueFromString(firstNumber);
    let num2 = getValueFromString(secondNumber);
    if (isNaN(num1) || isNaN(num2)) return;
    let resultValue;
    let exact = `(${firstNumber}) ${currentOperation} (${secondNumber})`;
    const getPrecision = (n) => {
        const s = String(n);
        const dotIndex = s.indexOf(".");
        return dotIndex === -1 ? 0 : s.length - dotIndex - 1;
    };
    let p1 = getPrecision(num1);
    let p2 = getPrecision(num2);
    let type1 = getNumberType(firstNumber);
    let type2 = getNumberType(secondNumber);
    let maxPrecision = Math.max(p1, p2, 3);
    if (type1 === "irrational" || type2 === "irrational") { maxPrecision = 5; }
    let conversionStr = `(${num1.toFixed(maxPrecision)}) ${currentOperation} (${num2.toFixed(maxPrecision)})`;
    switch (currentOperation) {
        case "+": resultValue = num1 + num2; break;
        case "-": resultValue = num1 - num2; break;
        case "*": resultValue = num1 * num2; break;
        case "/":
            if (num2 === 0) {
                result = { exact: "Undefined", decimal: "Division by zero!", type: "undefined", conversion: "N/A", isApproximate: false, properties: checkProperties(num1, num2) };
                showResult = true;
                return;
            }
            resultValue = num1 / num2;
            break;
    }
    let resultType = determineResultType(type1, type2, currentOperation, resultValue);
    let isApproximate = type1 === "irrational" || type2 === "irrational";
    if (!isApproximate) { if (getPrecision(resultValue) > maxPrecision) { isApproximate = true; } }
    let decimalString = resultValue.toFixed(maxPrecision);
    result = { value: resultValue, exact: exact, decimal: decimalString, isApproximate: isApproximate, type: resultType, conversion: conversionStr, properties: checkProperties(num1, num2) };
    showResult = true;
}

function getNumberType(displayStr) {
    let preset = presetNumbers.find((p) => p.display === displayStr);
    if (preset) return preset.type;
    let num = getValueFromString(displayStr);
    return isRational(num) ? "rational" : "irrational";
}

function isRational(num) {
    if (isNaN(num)) return false;
    return (Number.isInteger(num) || (num.toString().split(".")[1] || "").length < 10);
}

function determineResultType(type1, type2, operation, resultValue) {
    if (isRational(resultValue)) return "rational";
    if (type1 === "irrational" || type2 === "irrational") return "irrational";
    return "rational";
}

function checkProperties(num1, num2) {
    let props = { closure: true, commutative: false, associative: false, distributive: false };
    if (currentOperation === "+" || currentOperation === "*") {
        props.commutative = true;
        props.associative = true;
    }
    if (currentOperation === "*") { props.distributive = true; }
    return props;
}

function mousePressed() {
    for (let btn of mainNavButtons) {
        if (mouseX >= btn.x && mouseX <= btn.x + btn.w && mouseY >= btn.y && mouseY <= btn.y + btn.h) {
            if (currentView !== btn.view) {
                currentView = btn.view;
                targetMainSliderX = btn.x;
                if (currentView !== "explore" || explore.mode !== "analyzer") {
                    explore.analyzer.isActive = false;
                }
            }
            return;
        }
    }
    if (currentView === "operations") {
        let rBtn = randomNumberButton;
        if (mouseX > rBtn.x && mouseX < rBtn.x + rBtn.w && mouseY > rBtn.y && mouseY < rBtn.y + rBtn.h) {
            setRandomNumbers();
            return;
        }
        for (let btn of operationButtons) {
            if (dist(mouseX, mouseY, btn.x, btn.y) < btn.radius * 2) {
                if (currentOperation !== btn.op) {
                    currentOperation = btn.op;
                    showResult = false;
                    result = null;
                    if (firstNumber !== "" && secondNumber !== "") calculateResult();
                }
                return;
            }
        }
        for (let i = 0; i < inputBoxes.length; i++) {
            let box = inputBoxes[i];
            if (mouseX >= box.x && mouseX <= box.x + box.w && mouseY >= box.y && mouseY <= box.y + box.h) {
                inputMode = i === 0 ? "first" : "second";
                return;
            }
        }
        for (let num of presetNumbers) {
            if (mouseX >= num.x && mouseX <= num.x + num.w && mouseY >= num.y && mouseY <= num.y + num.h) {
                if (inputMode === "first") {
                    firstNumber = num.display;
                    inputMode = "second";
                } else if (inputMode === "second") {
                    secondNumber = num.display;
                }
                showResult = false;
                if (firstNumber !== "" && secondNumber !== "") calculateResult();
                return;
            }
        }
    } else if (currentView === "venn") {
        const btn = vennLayout.resetButton;
        if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
            resetVennDiagram();
            return;
        }
        for (let i = vennLayout.vennNumbers.length - 1; i >= 0; i--) {
            const num = vennLayout.vennNumbers[i];
            if (mouseX > num.x && mouseX < num.x + num.w && mouseY > num.y && mouseY < num.y + num.h) {
                const pos = findPlacementPosition(num.type);
                if (pos) {
                    num.x = pos.x;
                    num.y = pos.y;
                    vennLayout.placedNumbers.push(num);
                    vennLayout.vennNumbers.splice(i, 1);
                } else {
                    alert(`The '${classifyNumberToPlacementArea(num.type)}' section is full. Please reset the diagram or place other numbers first.`);
                }
                return;
            }
        }
    } else if (currentView === "explore") {
        for (const mode in explore.modeButtons) {
            const btn = explore.modeButtons[mode];
            const clickWidth = textWidth(btn.label) + 25;
            if (mouseX > btn.x - btn.radius && mouseX < btn.x + clickWidth && mouseY > btn.y - btn.radius && mouseY < btn.y + btn.radius) {
                explore.mode = mode;
                if (mode !== "analyzer") {
                    explore.analyzer.isActive = false;
                }
                return;
            }
        }
        if (explore.mode === "analyzer") {
        console.log("🚀 ~ mousePressed ~ explore.mode:", explore.mode)
            
            const inputBox = explore.analyzer.ui.inputBox;
            const isClickInKeyboard = keyboardContainer.elt.contains(event.target);
             const analyzeBtn = explore.analyzer.ui.button;
            console.log("🚀 ~ mousePressed ~ analyzeBtn:", analyzeBtn)
          if ( mouseX > analyzeBtn.x && 
                mouseX < analyzeBtn.x + analyzeBtn.w &&
                mouseY > analyzeBtn.y && 
                mouseY < analyzeBtn.y + analyzeBtn.h) {
                console.log("Analyzing number:", explore.analyzer.inputString);
            analyzeNumber();
        }
        if (mouseX > inputBox.x && mouseX < inputBox.x + inputBox.w && 
            mouseY > inputBox.y && mouseY < inputBox.y + inputBox.h) {
            explore.analyzer.isActive = true;
            return;
        } else if (!isClickInKeyboard) {
            explore.analyzer.isActive = false;
            return;
        }
           
        } else {

            const q = explore.challenge.question;
            const ui = explore.challenge.ui;
            if (!explore.challenge.answered) {
                for (let i = 0; i < q.options.length; i++) {
                    const btn = i === 0 ? ui.option1 : ui.option2;
                    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
                        checkChallengeAnswer(q.options[i]);
                        return;
                    }
                }
            }
            if (explore.challenge.answered) {
                const btn = ui.nextButton;
                if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
                    generateChallengeQuestion();
                    return;
                }
            }
        }
    }
}

function keyPressed() {
    if (currentView === "operations") {
        if (keyCode === ENTER || keyCode === TAB) {
            if (inputMode === "first") {
                inputMode = "second";
            } else {
                calculateResult();
            }
        }
    } else if (currentView === "explore" && explore.mode === "analyzer" && explore.analyzer.isActive) {
        if (keyCode === BACKSPACE) {
            explore.analyzer.inputString = explore.analyzer.inputString.slice(0, -1);
        } else if (keyCode === ENTER) {
            analyzeNumber();
        }
    }
}

function keyTyped() {
    if (currentView === "explore" && explore.mode === "analyzer" && explore.analyzer.isActive) {
        const validChars = "0123456789./-√";
        if (validChars.includes(key)) {
            explore.analyzer.inputString += key;
        }
    }
}