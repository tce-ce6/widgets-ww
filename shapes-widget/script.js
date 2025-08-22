// --- NEW: Texture Variables ---
let metalTexture, waffleTexture, icecreamTexture, giftTexture, footballTexture, metalBowlTexture, plasticTexture, canvasTexture;

function randomFloat(min, max, decimals = 1) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random parameters for each shape
function generateRandomParams(shapeType) {
    switch (shapeType) {
        case 'cylinder':
            return {
                radius: randomFloat(1.2, 2.0),
                height: randomFloat(3.5, 5.0)
            };
        case 'cone':
            return {
                radius: randomFloat(3.0, 4.5),
                height: randomFloat(10, 15)
            };
        case 'cube':
            return {
                side: randomInt(8, 12)
            };
        case 'sphere':
            return {
                radius: randomFloat(9.5, 12.0)
            };
        case 'hemisphere':
            return {
                radius: randomFloat(6.5, 8.0)
            };
        case 'frustum':
            return {
                topRadius: randomInt(12, 16),
                bottomRadius: randomInt(6, 9),
                height: randomInt(20, 28)
            };
        case 'compound':
            return {
                radius: randomFloat(5.5, 7.5),
                cylinderHeight: randomInt(8, 12),
                coneHeight: randomInt(9, 13)
            };
        default:
            return {};
    }
}

// Calculate solutions based on random parameters
function calculateSolutions(shapeType, params) {
    const PI = Math.PI;
    let solutions = [];

    switch (shapeType) {
        case 'cylinder': {
            const { radius: r, height: h } = params;
            const cylCSA = 2 * PI * r * h;
            const hemiCSA = 2 * PI * r * r;
            const totalArea = cylCSA + hemiCSA;
            const cost = totalArea * 75;

            solutions = [
                { answer: cylCSA.toFixed(2) + " m²", calculation: `2π × ${r} × ${h} = ${cylCSA.toFixed(2)} m²` },
                { answer: hemiCSA.toFixed(2) + " m²", calculation: `2π × ${r}² = ${hemiCSA.toFixed(2)} m²` },
                { answer: "₹" + cost.toFixed(2), calculation: `${totalArea.toFixed(2)} × 75 = ₹${cost.toFixed(2)}` }
            ];
            break;
        }
        case 'cone': {
            const { radius: r, height: h } = params;
            const slantHeight = Math.sqrt(r * r + h * h);
            const csa = PI * r * slantHeight;
            const cost = csa * 0.50;

            solutions = [
                { answer: slantHeight.toFixed(2) + " cm", calculation: `√(${r}² + ${h}²) = ${slantHeight.toFixed(2)} cm` },
                { answer: csa.toFixed(2) + " cm²", calculation: `π × ${r} × ${slantHeight.toFixed(2)} = ${csa.toFixed(2)} cm²` },
                { answer: "₹" + cost.toFixed(2), calculation: `${csa.toFixed(2)} × 0.50 = ₹${cost.toFixed(2)}` }
            ];
            break;
        }
        case 'cube': {
            const { side: a } = params;
            const area = 5 * a * a;
            const cost = area * 2;
            const volume = a * a * a;
            const chocolates = Math.floor(volume * 0.9);

            solutions = [
                { answer: area + " cm²", calculation: `5 × ${a}² = ${area} cm²` },
                { answer: "₹" + cost, calculation: `${area} × 2 = ₹${cost}` },
                { answer: chocolates + " chocolates", calculation: `90% of ${volume} = ${chocolates} chocolates` }
            ];
            break;
        }
        case 'sphere': {
            const { radius: r } = params;
            const area = 4 * PI * r * r;
            const cost = area * 1.20;
            const volume = (4/3) * PI * r * r * r;

            solutions = [
                { answer: area.toFixed(0) + " cm²", calculation: `4π × ${r}² = ${area.toFixed(0)} cm²` },
                { answer: "₹" + cost.toFixed(2), calculation: `${area.toFixed(0)} × 1.20 = ₹${cost.toFixed(2)}` },
                { answer: volume.toFixed(0) + " cm³", calculation: `(4/3)π × ${r}³ = ${volume.toFixed(0)} cm³` }
            ];
            break;
        }
        case 'hemisphere': {
            const { radius: r } = params;
            const csa = 2 * PI * r * r;
            const cost = csa * 0.80;
            const volume = (2/3) * PI * r * r * r;

            solutions = [
                { answer: csa.toFixed(0) + " cm²", calculation: `2π × ${r}² = ${csa.toFixed(0)} cm²` },
                { answer: "₹" + cost.toFixed(2), calculation: `${csa.toFixed(0)} × 0.80 = ₹${cost.toFixed(2)}` },
                { answer: volume.toFixed(2) + " cm³", calculation: `(2/3)π × ${r}³ = ${volume.toFixed(2)} cm³` }
            ];
            break;
        }
        case 'frustum': {
            const { topRadius: R, bottomRadius: r, height: h } = params;
            const slantHeight = Math.sqrt((R - r) * (R - r) + h * h);
            const csa = PI * (R + r) * slantHeight;
            const baseArea = PI * r * r;

            solutions = [
                { answer: slantHeight.toFixed(0) + " cm", calculation: `√((${R}-${r})² + ${h}²) = ${slantHeight.toFixed(0)} cm` },
                { answer: csa.toFixed(0) + " cm²", calculation: `π(${R}+${r}) × ${slantHeight.toFixed(0)} = ${csa.toFixed(0)} cm²` },
                { answer: baseArea.toFixed(0) + " cm²", calculation: `π × ${r}² = ${baseArea.toFixed(0)} cm²` }
            ];
            break;
        }
        case 'compound': {
            const { radius: r, cylinderHeight: ch, coneHeight: conh } = params;
            const cylCSA = 2 * PI * r * ch;
            const coneSlantHeight = Math.sqrt(r * r + conh * conh);
            const coneCSA = PI * r * coneSlantHeight;
            const totalCost = (cylCSA + coneCSA) * 2;

            solutions = [
                { answer: cylCSA.toFixed(0) + " cm²", calculation: `2π × ${r} × ${ch} = ${cylCSA.toFixed(0)} cm²` },
                { answer: coneSlantHeight.toFixed(2) + " cm", calculation: `√(${r}² + ${conh}²) = ${coneSlantHeight.toFixed(2)} cm` },
                { answer: "₹" + totalCost.toFixed(0), calculation: `(${cylCSA.toFixed(0)} + ${coneCSA.toFixed(0)}) × 2 = ₹${totalCost.toFixed(0)}` }
            ];
            break;
        }
    }
    return solutions;
}

// Generate wrong options for multiple choice
function generateOptions(correctAnswer, type = 'numeric') {
    const options = [correctAnswer];
    const correctValue = parseFloat(correctAnswer.replace(/[^\d.-]/g, ''));
    
    while (options.length < 4) {
        let wrongValue;
        if (type === 'cost') {
            wrongValue = correctValue * (0.7 + Math.random() * 0.6);
            wrongValue = "₹" + wrongValue.toFixed(2);
        } else if (type === 'area') {
            wrongValue = correctValue * (0.8 + Math.random() * 0.4);
            wrongValue = wrongValue.toFixed(correctAnswer.includes('.') ? 2 : 0) + (correctAnswer.includes('cm²') ? ' cm²' : correctAnswer.includes('m²') ? ' m²' : ' cm³');
        } else {
            wrongValue = correctValue * (0.8 + Math.random() * 0.4);
            wrongValue = wrongValue.toFixed(correctAnswer.includes('.') ? 2 : 0) + correctAnswer.replace(/[\d.-]/g, '').replace(/^[^a-zA-Z]*/, '');
        }
        
        if (!options.includes(wrongValue)) {
            options.push(wrongValue);
        }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    return options;
}

// Initialize shape data with random parameters
function initializeShapeData() {
    const baseShapeData = {
        cylinder: {
            name: "Cylinder",
            title: "Water Tank Construction",
            scenario: "Mr. Sharma is constructing a water tank for his farmhouse. The tank consists of a cylinder with a hemispherical dome on top. He wants to paint the outer surface excluding the base. Cost of painting = ₹75 per m²",
            formulas: ["CSA = 2πrh", "Hemisphere CSA = 2πr²", "Total CSA = 2πrh + 2πr²"],
            questionTemplates: [
                "What is the Curved Surface Area (CSA) of the cylindrical part?",
                "What is the Curved Surface Area of the hemispherical dome?",
                "What is the total painting cost?"
            ]
        },
        cone: {
            name: "Cone",
            title: "Ice Cream Cone Design",
            scenario: "A local ice cream factory is designing wafer cones. They want to calculate the area for chocolate coating and volume of ice cream. Chocolate coating rate = ₹0.50 per cm²",
            formulas: ["Slant height l = √(r² + h²)", "CSA = πrl", "Volume = ⅓πr²h"],
            questionTemplates: [
                "What is the slant height of the cone?",
                "What is the curved surface area to be coated?",
                "What is the cost of chocolate coating per cone?"
            ]
        },
        cube: {
            name: "Cube",
            title: "Birthday Gift Box",
            scenario: "Diya is making a cube-shaped sweet box with no lid for her friend's birthday. She will paint the outer surface (except bottom) and fill 90% with chocolates. Painting cost = ₹2 per cm²",
            formulas: ["Surface area of 5 faces = 5a²", "Volume = a³", "90% volume for chocolates"],
            questionTemplates: [
                "What is the surface area to be painted?",
                "What is the total painting cost?",
                "How many chocolates can fit (90% volume)?"
            ]
        },
        sphere: {
            name: "Sphere",
            title: "Football Manufacturing",
            scenario: "A sports company manufactures spherical footballs. The surface is synthetic leather costing ₹1.20 per cm². They need to calculate leather cost and air volume.",
            formulas: ["Surface area = 4πr²", "Volume = ⁴⁄₃πr³"],
            questionTemplates: [
                "What is the surface area of the football?",
                "What is the cost of leather for one football?",
                "What is the volume of air inside?"
            ]
        },
        hemisphere: {
            name: "Hemisphere",
            title: "Steel Serving Bowls",
            scenario: "A factory manufactures hemispherical steel bowls, open at top. They need polishing on inner curved surface. Polishing cost = ₹0.80 per cm²",
            formulas: ["Curved surface area = 2πr²", "Volume = ²⁄₃πr³"],
            questionTemplates: [
                "What is the inner curved surface area to be polished?",
                "What is the polishing cost per bowl?",
                "What volume can the bowl hold?"
            ]
        },
        frustum: {
            name: "Frustum",
            title: "Water Bucket Design",
            scenario: "A company designs frustum-shaped buckets. They paint inner curved surface and base. Painting cost = ₹1.50 per cm²",
            formulas: ["Slant height l = √((R-r)² + h²)", "CSA = π(R+r)l", "Base area = πr²"],
            questionTemplates: [
                "What is the slant height of the bucket?",
                "What is the inner curved surface area?",
                "What is the base area?"
            ]
        },
        compound: {
            name: "Compound",
            title: "Miniature Tent Model",
            scenario: "Students create a tent model: cylinder with conical top. Made of cloth covering curved surfaces only. Cloth cost = ₹2 per cm²",
            formulas: ["Cylinder CSA = 2πrh", "Cone slant height = √(r² + h²)", "Cone CSA = πrl"],
            questionTemplates: [
                "What is the curved surface area of the cylindrical part?",
                "What is the slant height of the conical part?",
                "What is the total cloth cost?"
            ]
        }
    };

    // Generate random parameters and questions for each shape
    const shapeData = {};
    for (const [key, shape] of Object.entries(baseShapeData)) {
        const randomParams = generateRandomParams(key);
        const solutions = calculateSolutions(key, randomParams);
        
        shapeData[key] = {
            ...shape,
            parameters: randomParams,
            questions: shape.questionTemplates.map((question, index) => {
                const correctAnswer = solutions[index].answer;
                const options = generateOptions(correctAnswer, 
                    correctAnswer.includes('₹') ? 'cost' : 
                    correctAnswer.includes('²') || correctAnswer.includes('³') ? 'area' : 'numeric'
                );
                
                return {
                    id: `${key}_${index + 1}`,
                    question: question,
                    options: options,
                    correctAnswer: correctAnswer,
                    explanation: `Using the formula: ${solutions[index].calculation}`,
                    formula: shape.formulas[index] || "",
                    calculation: solutions[index].calculation
                };
            })
        };
    }
    
    return shapeData;
}

// --- GLOBAL STATE & UI DEFINITIONS ---
let shapeData = initializeShapeData(); // Initialize with random data
let currentShapeKey = 'cylinder';
let currentQuestionIndex = 0;
let selectedAnswer = null;
let ui = {};
let pg; // Graphics buffer for 3D
let rotationX = -0.3;
let rotationY = 0;
let autoRotationY = 0;

// --- NEW: P5.JS PRELOAD FUNCTION ---
function preload() {
    // Load textures from the 'assets' folder
    // Make sure you have an 'assets' folder with these images
    try {
        metalTexture = loadImage('assets/metal_texture.png');
        waffleTexture = loadImage('assets/waffle_texture.png');
        icecreamTexture = loadImage('assets/icecream_texture.png');
        giftTexture = loadImage('assets/wrapping_paper.png');
        footballTexture = loadImage('assets/football_texture.png');
        metalBowlTexture = loadImage('assets/brushed_metal.png');
        plasticTexture = loadImage('assets/metal_texture.png');
        canvasTexture = loadImage('assets/canvas_texture.png');
    } catch (e) {
        console.error("Error loading textures. Make sure you have an 'assets' folder with all the required images.", e);
    }
}


// --- P5.JS SETUP ---
function setup() {
    createCanvas(900, 600).parent('canvas-container');
    pg = createGraphics(420, 420, WEBGL);
    textFont('Arial');

    // Define UI element geometries
    ui.tabs = [];
    const shapeKeys = Object.keys(shapeData);
    const tabWidth = 80;
    const tabSpacing = 10;
    const totalTabsWidth = shapeKeys.length * (tabWidth + tabSpacing) - tabSpacing;
    const tabsStartX = (width - totalTabsWidth) / 2;

    shapeKeys.forEach((key, i) => {
        ui.tabs.push({
            key: key,
            x: tabsStartX + i * (tabWidth + tabSpacing),
            y: 20,
            w: tabWidth,
            h: 40
        });
    });

    ui.mainPanel = { x: 20, y: 80, w: width - 40, h: height - 100 };
    ui.leftPanel = { x: 40, y: 100, w: 400, h: 460 };
    ui.rightPanel = { x: 460, y: 100, w: 420, h: 460 };
}

// --- P5.JS DRAW LOOP ---
function draw() {
    background('#f8f9fa');

    // Draw main container
    noStroke();
    fill('#ffffff');
    rect(ui.mainPanel.x, ui.mainPanel.y, ui.mainPanel.w, ui.mainPanel.h, 10);
    stroke('#dee2e6');
    noFill();
    rect(ui.mainPanel.x, ui.mainPanel.y, ui.mainPanel.w, ui.mainPanel.h, 10);

    drawTabs();
    drawLeftPanel();
    drawRightPanel();
    
    // --- MODIFICATION: Draw feedback overlay if an answer is selected ---
    if (selectedAnswer) {
        drawFeedbackOverlay();
    }
}

// --- UI DRAWING FUNCTIONS ---

function drawTabs() {
    ui.tabs.forEach(tab => {
        const isActive = (tab.key === currentShapeKey);

        stroke(isActive ? '#007bff' : '#ced4da');
        fill(isActive ? '#007bff' : '#f8f9fa');
        rect(tab.x, tab.y, tab.w, tab.h, 20);

        noStroke();
        fill(isActive ? '#ffffff' : '#495057');
        textAlign(CENTER, CENTER);
        textSize(14);
        text(shapeData[tab.key].name, tab.x + tab.w / 2, tab.y + tab.h / 2);
    });
}

function drawLeftPanel() {
    const shape = shapeData[currentShapeKey];
    const question = shape.questions[currentQuestionIndex];
    const panel = ui.leftPanel;
    let yPos = panel.y + 15;

    // Update scenario with current parameters
    let updatedScenario = shape.scenario;
    const params = shape.parameters;
    
    // Replace parameter values in scenario text
    switch (currentShapeKey) {
        case 'cylinder':
            updatedScenario = `Mr. Sharma is constructing a water tank for his farmhouse. The tank consists of a cylinder (radius = ${params.radius}m, height = ${params.height}m) with a hemispherical dome on top. He wants to paint the outer surface excluding the base. Cost of painting = ₹75 per m²`;
            break;
        case 'cone':
            updatedScenario = `A local ice cream factory is designing wafer cones. Each cone has radius = ${params.radius}cm, height = ${params.height}cm. They want to calculate the area for chocolate coating. Chocolate coating rate = ₹0.50 per cm²`;
            break;
        case 'cube':
            updatedScenario = `Diya is making a cube-shaped sweet box (side = ${params.side}cm) with no lid for her friend's birthday. She will paint the outer surface (except bottom) and fill 90% with chocolates. Painting cost = ₹2 per cm²`;
            break;
        case 'sphere':
            updatedScenario = `A sports company manufactures spherical footballs with radius = ${params.radius}cm. The surface is synthetic leather costing ₹1.20 per cm². They need to calculate leather cost and air volume.`;
            break;
        case 'hemisphere':
            updatedScenario = `A factory manufactures hemispherical steel bowls with radius = ${params.radius}cm, open at top. They need polishing on inner curved surface. Polishing cost = ₹0.80 per cm²`;
            break;
        case 'frustum':
            updatedScenario = `A company designs frustum-shaped buckets with top radius R = ${params.topRadius}cm, bottom radius r = ${params.bottomRadius}cm, height = ${params.height}cm. They paint inner curved surface and base. Painting cost = ₹1.50 per cm²`;
            break;
        case 'compound':
            updatedScenario = `Students create a tent model: cylinder (radius=${params.radius}cm, height=${params.cylinderHeight}cm) with conical top (height=${params.coneHeight}cm). Made of cloth covering curved surfaces only. Cloth cost = ₹2 per cm²`;
            break;
    }

    // Draw Scenario Block
    fill('#e7f5ff');
    stroke('#bde0fe');
    rect(panel.x, yPos, panel.w, 110, 8);

    noStroke();
    fill('#0c63e4');
    textAlign(LEFT, TOP);
    textSize(16);
    textStyle(BOLD);
    text(shape.title, panel.x + 15, yPos + 15);

    fill('#555');
    textSize(13);
    textStyle(NORMAL);
    text(updatedScenario, panel.x + 15, yPos + 40, panel.w - 30);

    yPos += 125;

    // Draw Question Block
    fill('#ffffff');
    stroke('#dee2e6');
    // --- MODIFICATION: Removed dynamic height calculation for explanation ---
    const questionBlockHeight = 150 + question.options.length * 45; 
    rect(panel.x, yPos, panel.w, questionBlockHeight, 8);

    // Question Header
    noStroke();
    fill('#212529');
    textAlign(LEFT, TOP);
    textSize(15);
    textStyle(BOLD);
    text(`Question ${currentQuestionIndex + 1}/${shape.questions.length}`, panel.x + 15, yPos + 15);

    // Question Nav Dots
    ui.qNavDots = [];
    for (let i = 0; i < shape.questions.length; i++) {
        const dotX = panel.x + panel.w - (shape.questions.length - i) * 30 - 10;
        const dotY = yPos + 10;
        ui.qNavDots.push({ x: dotX, y: dotY, w: 24, h: 24 });

        fill(i === currentQuestionIndex ? '#007bff' : '#e9ecef');
        ellipse(dotX + 12, dotY + 12, 24, 24);
        fill(i === currentQuestionIndex ? '#ffffff' : '#495057');
        textAlign(CENTER, CENTER);
        textSize(12);
        text(i + 1, dotX + 12, dotY + 12);
    }

    // Question Text
    fill('#212529');
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    textSize(14);
    text(question.question, panel.x + 15, yPos + 50, panel.w - 30);

    // Options
    let optY = yPos + 100;
    ui.options = [];
    question.options.forEach((option, index) => {
        const optBox = { x: panel.x + 15, y: optY, w: panel.w - 30, h: 35 };
        ui.options.push({ ...optBox, text: option });

        // --- MODIFICATION: Simplified styling as feedback is now in overlay ---
        let bgColor = '#f8f9fa';
        let strokeColor = '#ced4da';
        if (selectedAnswer && selectedAnswer.option === option) {
            bgColor = selectedAnswer.isCorrect ? '#d1e7dd' : '#f8d7da';
            strokeColor = selectedAnswer.isCorrect ? '#a3cfbb' : '#f5c2c7';
        }

        stroke(strokeColor);
        fill(bgColor);
        rect(optBox.x, optBox.y, optBox.w, optBox.h, 5);

        noStroke();
        fill('#212529');
        textAlign(LEFT, CENTER);
        text(option, optBox.x + 15, optBox.y + optBox.h / 2);

        optY += 45;
    });

    // --- MODIFICATION: The entire explanation block drawing logic is REMOVED from here ---
}

function drawRightPanel() {
    const panel = ui.rightPanel;
    const shape = shapeData[currentShapeKey];

    // Auto-rotation update
    autoRotationY += 0.005; // Slower rotation

    // --- NEW: Enhanced 3D Scene Lighting ---
    pg.background(0);
    pg.ambientLight(10); // Softer ambient light
    pg.directionalLight(128, 128, 128, -1, 1, -1); // Main key light (reduced)
    pg.pointLight(200, 200, 255, 200, -150, 200); // Cool fill light
    pg.directionalLight(255, 200, 200, 1, -1, 1); // Warm back light (rim light)


    pg.push();
    pg.translate(0, 20, 0);
    pg.rotateX(rotationX);
    pg.rotateY(rotationY + autoRotationY);

    drawShape(pg, currentShapeKey, shape.parameters);

    pg.pop();

    image(pg, panel.x, panel.y, panel.w, panel.h);

    // Draw parameters
    drawParameters(this, currentShapeKey, shape.parameters);
}

// --- NEW FUNCTION: To draw the feedback overlay ---
function drawFeedbackOverlay() {
    const question = shapeData[currentShapeKey].questions[currentQuestionIndex];
    const isCorrect = selectedAnswer.isCorrect;
    
    // 1. Draw semi-transparent background
    fill(0, 0, 0, 150); // Black with 150/255 transparency
    noStroke();
    rect(0, 0, width, height);
    
    // 2. Define overlay box dimensions
    const boxW = 450;
    const boxH = 280;
    const boxX = (width - boxW) / 2;
    const boxY = (height - boxH) / 2;
    
    // 3. Draw main overlay box
    fill('#ffffff');
    stroke('#dee2e6');
    rect(boxX, boxY, boxW, boxH, 12);
    
    // 4. Draw Header (Correct/Incorrect)
    const headerH = 60;
    fill(isCorrect ? '#d1e7dd' : '#f8d7da'); // Green for correct, Red for incorrect
    noStroke();
    rect(boxX, boxY, boxW, headerH, 12, 12, 0, 0);
    
    fill(isCorrect ? '#0f5132' : '#842029');
    textSize(24);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text(isCorrect ? "Correct!" : "Incorrect", boxX + boxW / 2, boxY + headerH / 2);
    
    // 5. Draw Explanation Content
    textAlign(LEFT, TOP);
    textStyle(NORMAL);
    
    fill('#212529');
    textSize(14);
    text("Explanation:", boxX + 20, boxY + headerH + 20);
    
    // Explanation Box
    fill('#f8f9fa');
    stroke('#e9ecef');
    rect(boxX + 20, boxY + headerH + 45, boxW - 40, 90, 5);
    
    fill('#6c757d');
    textFont('monospace');
    textSize(14);
    text(`${question.formula}\n\n${question.calculation}`, boxX + 30, boxY + headerH + 55, boxW - 60);
    textFont('Arial');
    
    // 6. Draw "Next Question" Button
    const btnW = 150;
    const btnH = 40;
    const btnX = boxX + (boxW - btnW) / 2;
    const btnY = boxY + boxH - btnH - 20;
    
    // Store button dimensions for mousePressed()
    ui.nextButton = { x: btnX, y: btnY, w: btnW, h: btnH };
    
    fill('#007bff');
    noStroke();
    rect(btnX, btnY, btnW, btnH, 5);
    
    fill('#ffffff');
    textSize(16);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("Next Question", btnX + btnW / 2, btnY + btnH / 2);
}


// --- INTERACTION ---
function mousePressed() {
    // --- MODIFICATION: If overlay is active, only check for Next Button click ---
    if (selectedAnswer) {
        const btn = ui.nextButton;
        if (btn && mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
            // Move to the next question
            const numQuestions = shapeData[currentShapeKey].questions.length;
            currentQuestionIndex = (currentQuestionIndex + 1) % numQuestions;
            selectedAnswer = null; // Hide the overlay
        }
        return; // Ignore other clicks when overlay is open
    }
    
    // Check regenerate button
    const regenButton = {
        x: ui.rightPanel.x + 20,
        y: ui.rightPanel.y + ui.rightPanel.h - 80,
        w: 160,
        h: 35
    };
    
    if (mouseX > regenButton.x && mouseX < regenButton.x + regenButton.w && 
        mouseY > regenButton.y && mouseY < regenButton.y + regenButton.h) {
        // Regenerate only the current shape's data
        const newParams = generateRandomParams(currentShapeKey);
        const newSolutions = calculateSolutions(currentShapeKey, newParams);
        
        shapeData[currentShapeKey].parameters = newParams;
        shapeData[currentShapeKey].questions = shapeData[currentShapeKey].questionTemplates.map((question, index) => {
            const correctAnswer = newSolutions[index].answer;
            const options = generateOptions(correctAnswer, 
                correctAnswer.includes('₹') ? 'cost' : 
                correctAnswer.includes('²') || correctAnswer.includes('³') ? 'area' : 'numeric'
            );
            
            return {
                id: `${currentShapeKey}_${index + 1}`,
                question: question,
                options: options,
                correctAnswer: correctAnswer,
                explanation: `Using the formula: ${newSolutions[index].calculation}`,
                formula: shapeData[currentShapeKey].formulas[index] || "",
                calculation: newSolutions[index].calculation
            };
        });
        
        currentQuestionIndex = 0;
        selectedAnswer = null;
        return;
    }

    // Check Tab clicks
    for (const tab of ui.tabs) {
        if (mouseX > tab.x && mouseX < tab.x + tab.w && mouseY > tab.y && mouseY < tab.y + tab.h) {
            currentShapeKey = tab.key;
            currentQuestionIndex = 0;
            selectedAnswer = null;
            return;
        }
    }

    // Check Question Nav Dot clicks
    if (ui.qNavDots) {
        for (let i = 0; i < ui.qNavDots.length; i++) {
            const dot = ui.qNavDots[i];
            if (dist(mouseX, mouseY, dot.x + dot.w / 2, dot.y + dot.h / 2) < dot.w / 2) {
                currentQuestionIndex = i;
                selectedAnswer = null;
                return;
            }
        }
    }

    // Check Option clicks
    if (!selectedAnswer && ui.options) {
        for (const opt of ui.options) {
            if (mouseX > opt.x && mouseX < opt.x + opt.w && mouseY > opt.y && mouseY < opt.y + opt.h) {
                const question = shapeData[currentShapeKey].questions[currentQuestionIndex];
                selectedAnswer = {
                    option: opt.text,
                    isCorrect: (opt.text === question.correctAnswer)
                };
                return;
            }
        }
    }
}

function mouseDragged() {
    if (mouseX > ui.rightPanel.x && mouseX < ui.rightPanel.x + ui.rightPanel.w &&
        mouseY > ui.rightPanel.y && mouseY < ui.rightPanel.y + ui.rightPanel.h) {
        // Prevent dragging the 3D model when the overlay is active
        if (!selectedAnswer) {
            rotationX -= (pmouseY - mouseY) * 0.01;
            rotationY -= (pmouseX - mouseX) * 0.01;
            rotationX = constrain(rotationX, -PI/2, PI/2); // Limit vertical rotation
        }
    }
}

// --- NEW: SUPER REALISTIC 3D DRAWING LOGIC ---

function drawShape(p, shapeType, params) {
    const scale = 25;
    p.noStroke(); // Disable strokes globally for textured objects unless needed

    switch (shapeType) {
        case 'cylinder': { // Water Tank
            const r =5 * scale;
            const h = 6 * scale;
            p.push();
            p.translate(0, h / 4, 0);
            
            p.specularMaterial(200); // Reflective material
            p.shininess(100);
            p.texture(metalTexture);
            
            // Cylinder Body
            p.cylinder(r, h, 24, 1, true, true);
            
            // Hemispherical Dome
            p.translate(0, -h  / 2, 0);
            p.sphere(r, 24, 12);
            
            p.pop();
            break;
        }
        case 'cone': { // Ice Cream Cone
            const r = 3.5 * scale * 0.9;
            const h = 12 * scale * 0.9;
            p.push();
            p.translate(0, h / 4, 0);
            
            // Cone (Wafer)
            p.specularMaterial(150);
            p.shininess(5);
            p.texture(waffleTexture);
            p.cone(r, h);
            
            // Ice Cream Scoop
            p.translate(0, -h / 2 - r * 0.5, 0);
            p.specularMaterial(255); // Wet look
            p.shininess(80);
            p.texture(icecreamTexture);
            // p.sphere(r * 1.05);
            
            p.pop();
            break;
        }
        case 'cube': { // Gift Box
            const s = 10 * scale * 0.8;
            p.push();
            
            // Box Body
            p.specularMaterial(255);
            p.shininess(50);
            p.texture(giftTexture);
            p.box(s);

            // Gold ribbon
            p.noStroke();
            p.specularMaterial(255, 215, 0); // Gold color
            p.shininess(100);
            
            // Ribbon Bands
            p.box(s * 1.05, s * 0.15, s * 0.15);
            p.box(s * 0.15, s * 1.05, s * 0.15);
            p.box(s * 0.15, s * 0.15, s * 1.05);

            // Bow on top
            p.translate(0, -s/2 - 10, 0);
            p.rotateX(PI/4);
            p.torus(15, 5, 24, 16);
            
            p.pop();
            break;
        }
        case 'sphere': { // Football
            const r = 6.5 * scale * 0.8;
            p.push();
            p.rotateX(PI/2); // Orient texture correctly
            p.specularMaterial(200);
            p.shininess(40);
            p.texture(footballTexture);
            p.sphere(r, 24, 24);
            p.pop();
            break;
        }
        case 'hemisphere': { // Steel Bowl
            const r = 4 * scale * 1.5;
            p.push();
            p.rotateX(PI); // Open at top
            
            p.specularMaterial(220); // Highly reflective
            p.shininess(90);
            p.texture(metalBowlTexture);
            p.sphere(r, 32, 16);
            
            p.pop();
            break;
        }
        case 'frustum': { // Water Bucket
            const h = 12 * scale * 0.5;
            const r1 = 12 * scale * 0.5;
            const r2 = 6 * scale * 0.5;

            p.specularMaterial(255);
            p.shininess(60);
            p.texture(plasticTexture);

            const segments = 32;
            p.beginShape(p.TRIANGLE_STRIP);
            for (let i = 0; i <= segments; i++) {
                const angle = (i * TWO_PI) / segments;
                const u = i / segments;
                p.vertex(r1 * cos(angle), -h / 2, r1 * sin(angle), u, 0);
                p.vertex(r2 * cos(angle), h / 2, r2 * sin(angle), u, 1);
            }
            p.endShape();

            // Base
            p.beginShape(p.TRIANGLE_FAN);
            p.vertex(0, h/2, 0, 0.5, 0.5);
            for (let i = 0; i <= segments; i++) {
                const angle = (i * TWO_PI) / segments;
                const u = 0.5 + 0.5 * cos(angle);
                const v = 0.5 + 0.5 * sin(angle);
                p.vertex(r2 * cos(angle), h / 2, r2 * sin(angle), u, v);
            }
            p.endShape();

            // Metal Handle
            p.noFill();
            p.stroke(100);
            p.strokeWeight(5);
            p.beginShape();
            for(let i = 0; i <= 180; i++) {
                const angle = radians(i);
                const x = r1 * cos(angle);
                const y = -h/2 - r1 * sin(angle) * 0.8;
                p.vertex(x, y, 0);
            }
            p.endShape();
            
            break;
        }
        case 'compound': { // Tent Model
            const r = 4 * scale;
            const cH = 7 * scale;
            const coneH = 6 * scale;
            p.push();
            p.translate(0, coneH / 2, 0);

            p.specularMaterial(100);
            p.shininess(5);
            p.texture(canvasTexture);

            // Cylindrical walls
            p.cylinder(r, cH, 24);
            
            // Conical roof
            p.translate(0, -cH / 2, 0);
            p.cone(r, coneH, 24);
            
            p.pop();
            break;
        }
        default:
            p.fill(100);
            p.box(50);
    }
}


function drawParameters(p, shapeType, params) {
    p.push();
    
    // Semi-transparent background for parameters
    p.fill(255, 255, 255, 220);
    p.stroke(200, 200, 200);
    p.strokeWeight(1);
    p.rect(ui.rightPanel.x + 10, ui.rightPanel.y + 10, 180, 120, 8);
    
    p.fill(30, 30, 30);
    p.noStroke();
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text("Dimensions:", ui.rightPanel.x + 20, ui.rightPanel.y + 25);
    
    p.textStyle(p.NORMAL);
    p.textSize(12);
    let yOffset = ui.rightPanel.y + 45;
    const xOffset = ui.rightPanel.x + 25;
    const lines = [];

    switch (shapeType) {
        case 'cylinder': 
            lines.push(`Radius: ${params.radius}m`, `Height: ${params.height}m`); 
            break;
        case 'cone': 
            lines.push(`Radius: ${params.radius}cm`, `Height: ${params.height}cm`); 
            break;
        case 'cube': 
            lines.push(`Side: ${params.side}cm`); 
            break;
        case 'sphere': 
            lines.push(`Radius: ${params.radius}cm`); 
            break;
        case 'hemisphere': 
            lines.push(`Radius: ${params.radius}cm`); 
            break;
        case 'frustum': 
            lines.push(`Top Radius: ${params.topRadius}cm`, `Bottom Radius: ${params.bottomRadius}cm`, `Height: ${params.height}cm`); 
            break;
        case 'compound': 
            lines.push(`Radius: ${params.radius}cm`, `Cylinder Height: ${params.cylinderHeight}cm`, `Cone Height: ${params.coneHeight}cm`); 
            break;
    }

    lines.forEach((line, index) => {
        p.text(line, xOffset, yOffset + (index * 18));
    });

    // Regenerate button
    p.fill(0, 123, 255);
    p.stroke(0, 100, 200);
    p.strokeWeight(2);
    p.rect(ui.rightPanel.x + 20, ui.rightPanel.y + ui.rightPanel.h - 80, 160, 35, 5);
    
    p.fill(255);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(12);
    p.textStyle(p.BOLD);
    p.text("Generate New Problem", ui.rightPanel.x + 100, ui.rightPanel.y + ui.rightPanel.h - 62);

    p.fill(100, 100, 100);
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.textStyle(p.NORMAL);
    p.text("Drag to rotate", ui.rightPanel.x + 20, ui.rightPanel.y + ui.rightPanel.h - 35);
    
    p.pop();
}

// Add keyboard shortcuts
function keyPressed() {
    if (key === 'r' || key === 'R') {
        // Regenerate current shape
        const newParams = generateRandomParams(currentShapeKey);
        const newSolutions = calculateSolutions(currentShapeKey, newParams);
        
        shapeData[currentShapeKey].parameters = newParams;
        shapeData[currentShapeKey].questions = shapeData[currentShapeKey].questionTemplates.map((question, index) => {
            const correctAnswer = newSolutions[index].answer;
            const options = generateOptions(correctAnswer, 
                correctAnswer.includes('₹') ? 'cost' : 
                correctAnswer.includes('²') || correctAnswer.includes('³') ? 'area' : 'numeric'
            );
            
            return {
                id: `${currentShapeKey}_${index + 1}`,
                question: question,
                options: options,
                correctAnswer: correctAnswer,
                explanation: `Using the formula: ${newSolutions[index].calculation}`,
                formula: shapeData[currentShapeKey].formulas[index] || "",
                calculation: newSolutions[index].calculation
            };
        });
        
        currentQuestionIndex = 0;
        selectedAnswer = null;
    } else if (keyCode === LEFT_ARROW) {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            selectedAnswer = null;
        }
    } else if (keyCode === RIGHT_ARROW) {
        if (currentQuestionIndex < shapeData[currentShapeKey].questions.length - 1) {
            currentQuestionIndex++;
            selectedAnswer = null;
        }
    }
}