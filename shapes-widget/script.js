// --- NEW: Texture Variables ---
let metalTexture, waffleTexture, icecreamTexture, giftTexture, footballTexture, metalBowlTexture, plasticTexture, canvasTexture,candleTexture,chocolateTexture, pillarTexture, roadRollerTexture;

// --- NEW: State for cylinder cases ---
let currentCylinderCaseIndex = 0;

function randomFloat(min, max, decimals = 1) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random parameters for each shape
function generateRandomParams(shapeType, caseKey = null) {
    switch (shapeType) {
        case 'cylinder':
            // --- MODIFIED: Handle multiple cases for cylinder ---
            if (caseKey === 'candle') {
                return {
                    radius: randomInt(7, 9),
                    height: randomInt(20, 25),
                    burnRate: randomInt(11, 15),
                    smallRadius: 3.5,
                    smallHeight: 4
                };
            } else if (caseKey === 'pillar') {
                return {
                    pillarCount: randomInt(10, 15),
                    height: randomInt(4, 6), // in m
                    diameter: randomInt(60, 80), // in cm
                    whitewashCost: randomInt(12, 18), // per m²
                    paintCost: randomInt(4, 7), // per m²
                    rodRadius: randomInt(8, 12), // in cm
                    rodHeight: randomInt(2, 3) // in m
                };
            } else if (caseKey === 'roadRoller') {
                 return {
                    diameter: randomFloat(1.0, 1.4), // in m
                    length: randomFloat(2.0, 2.5),   // in m
                    revolutions: randomInt(450, 550),
                    roadWidth: randomInt(6, 9),      // in m
                    costPerSqm: randomInt(45, 60)    // per m²
                };
            }
            // Default case: Water Tank
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

// --- MODIFIED: Calculate solutions with detailed steps ---
function calculateSolutions(shapeType, params, caseKey = null) {
    const PI = Math.PI;
    let solutions = [];

    switch (shapeType) {
        case 'cylinder': {
            if (caseKey === 'roadRoller') {
                const { diameter, length, revolutions, roadWidth, costPerSqm } = params;
                const r = diameter / 2;

                // Q1: CSA of the roller
                const csa = 2 * PI * r * length;
                solutions.push({
                    answer: csa.toFixed(2) + " m²",
                    calculation: `A = 2π × ${r.toFixed(1)} × ${length} = ${csa.toFixed(2)} m²`,
                    steps: [
                        { text: "The area covered in one revolution is the roller's CSA.", content: "A = 2πr × length" },
                        { text: `Convert diameter ${diameter} m to radius ${r.toFixed(1)} m.`, content: `r = ${diameter} / 2` },
                        { text: "Substitute radius (r) and length.", content: `A = 2π × ${r.toFixed(1)} × ${length}` },
                        { text: "Compute the area.", content: `A ≈ ${csa.toFixed(2)} m²` }
                    ]
                });

                // Q2: Area of road leveled
                const totalArea = csa * revolutions;
                solutions.push({
                    answer: totalArea.toFixed(2) + " m²",
                    calculation: `${csa.toFixed(2)} × ${revolutions} = ${totalArea.toFixed(2)} m²`,
                    steps: [
                        { text: "Multiply the area per revolution (CSA) by the number of revolutions.", content: "Total Area = CSA × Revolutions" },
                        { text: "Substitute the calculated CSA and given revolutions.", content: `Total Area = ${csa.toFixed(2)} × ${revolutions}` },
                        { text: "Calculate the total area leveled.", content: `Total Area ≈ ${totalArea.toFixed(2)} m²` }
                    ]
                });
                
                // Q3: Length of road leveled
                const roadLength = totalArea / roadWidth;
                 solutions.push({
                    answer: roadLength.toFixed(2) + " m",
                    calculation: `${totalArea.toFixed(2)} / ${roadWidth} = ${roadLength.toFixed(2)} m`,
                    steps: [
                        { text: "The area of a rectangle is Length × Width.", content: "Area = L × W  =>  L = Area / W" },
                        { text: "Substitute the total area leveled and the road width.", content: `Length = ${totalArea.toFixed(2)} / ${roadWidth}` },
                        { text: "Calculate the length of the road.", content: `Length ≈ ${roadLength.toFixed(2)} m` }
                    ]
                });

                // Q4: Cost of construction
                const totalCost = totalArea * costPerSqm;
                 solutions.push({
                    answer: "₹" + totalCost.toFixed(2),
                    calculation: `${totalArea.toFixed(2)} × ${costPerSqm} = ₹${totalCost.toFixed(2)}`,
                    steps: [
                        { text: "Multiply the total area of the road by the cost per m².", content: `Cost = Total Area × Rate`},
                        { text: "Substitute the total area and the given rate.", content: `Cost = ${totalArea.toFixed(2)} × ${costPerSqm}` },
                        { text: "Calculate the total construction cost.", content: `Cost ≈ ₹${totalCost.toFixed(2)}` }
                    ]
                });
            }
            else if (caseKey === 'pillar') {
                const { pillarCount, height: h, diameter, whitewashCost, paintCost, rodRadius, rodHeight } = params;
                const r = (diameter / 2) / 100;

                const csaOne = 2 * PI * r * h;
                solutions.push({
                    answer: csaOne.toFixed(2) + " m²",
                    calculation: `A = 2π × ${r.toFixed(2)} × ${h} = ${csaOne.toFixed(2)} m²`,
                    steps: [{ text: "Use the formula for Curved Surface Area.", content: "A = 2πrh" }, { text: `Convert diameter ${diameter} cm to radius ${r.toFixed(2)} m.`, content: `r = (${diameter}/2) / 100` }, { text: "Substitute radius (r) and height (h).", content: `A = 2π × ${r.toFixed(2)} × ${h}` }, { text: "Compute the area.", content: `A ≈ ${csaOne.toFixed(2)} m²` }]
                });

                const totalCSA = csaOne * pillarCount;
                const totalWhitewashCost = totalCSA * whitewashCost;
                solutions.push({
                    answer: "₹" + totalWhitewashCost.toFixed(2),
                    calculation: `(${csaOne.toFixed(2)} × ${pillarCount}) × ${whitewashCost} = ₹${totalWhitewashCost.toFixed(2)}`,
                    steps: [{ text: "Find the total CSA for all pillars.", content: `Total Area = ${csaOne.toFixed(2)} × ${pillarCount} ≈ ${totalCSA.toFixed(2)} m²` }, { text: "Multiply the total area by the cost per m².", content: "Cost = Total Area × Rate" }, { text: "Calculate the final cost.", content: `Cost = ${totalCSA.toFixed(2)} × ${whitewashCost} ≈ ₹${totalWhitewashCost.toFixed(2)}` }]
                });
                
                const baseAreaOne = PI * r * r;
                const totalBaseArea = baseAreaOne * pillarCount;
                const totalPaintCost = totalBaseArea * paintCost;
                 solutions.push({
                    answer: "₹" + totalPaintCost.toFixed(2),
                    calculation: `(π × ${r.toFixed(2)}²) × ${pillarCount} × ${paintCost} = ₹${totalPaintCost.toFixed(2)}`,
                    steps: [{ text: "Find the area of one circular base.", content: `Base Area = πr² ≈ ${baseAreaOne.toFixed(2)} m²`}, { text: "Calculate the total base area for all pillars.", content: `Total Base Area = ${baseAreaOne.toFixed(2)} × ${pillarCount} ≈ ${totalBaseArea.toFixed(2)} m²` }, { text: "Multiply the total base area by the painting cost.", content: `Cost = ${totalBaseArea.toFixed(2)} × ${paintCost} ≈ ₹${totalPaintCost.toFixed(2)}` }]
                });

                const volumeOnePillar = PI * r * r * h;
                const totalVolume = volumeOnePillar * pillarCount;
                const rr = rodRadius / 100;
                const volumeOneRod = PI * rr * rr * rodHeight;
                const rodCount = Math.floor(totalVolume / volumeOneRod);
                 solutions.push({
                    answer: rodCount + " rods",
                    calculation: `(${volumeOnePillar.toFixed(2)} × ${pillarCount}) / ${volumeOneRod.toFixed(2)} = ${rodCount}`,
                    steps: [{ text: "Calculate the volume of one pillar.", content: `V_p = πr²h ≈ ${volumeOnePillar.toFixed(2)} m³`}, { text: "Calculate the total volume of all pillars.", content: `Total V = ${volumeOnePillar.toFixed(2)} × ${pillarCount} ≈ ${totalVolume.toFixed(2)} m³`}, { text: "Calculate the volume of one new rod.", content: `V_r = π(${rr})²(${rodHeight}) ≈ ${volumeOneRod.toFixed(3)} m³` }, { text: "Divide total volume by rod volume.", content: `Count = ${totalVolume.toFixed(2)} / ${volumeOneRod.toFixed(3)} ≈ ${rodCount}` }]
                });

            } else if (caseKey === 'candle') {
                const { radius: r, height: h, burnRate, smallRadius: sr, smallHeight: sh } = params;
                const volume = PI * r * r * h;
                const timeMinutes = volume / burnRate;
                const hours = Math.floor(timeMinutes / 60);
                const minutes = Math.round(timeMinutes % 60);
                const csa = 2 * PI * r * h;
                const smallVolume = PI * sr * sr * sh;
                const count = Math.floor(volume / smallVolume);
                solutions = [
                    {
                        answer: volume.toFixed(2) + " cm³",
                        calculation: `V = π × ${r}² × ${h} = ${volume.toFixed(2)} cm³`,
                        steps: [{ text: "Use the formula for the volume of a cylinder.", content: "V = πr²h" }, { text: "Substitute the given values.", content: `V = π × ${r}² × ${h}` }, { text: "Compute the final volume.", content: `V ≈ ${volume.toFixed(2)} cm³` }]
                    },
                    {
                        answer: `≈ ${hours} h ${minutes} min`,
                        calculation: `Time = ${volume.toFixed(2)} / ${burnRate} ≈ ${timeMinutes.toFixed(2)} min`,
                        steps: [{ text: "Use the formula: Time = Total Volume / Burn Rate.", content: "t = V / rate" }, { text: "Substitute the volume and burn rate.", content: `t = ${volume.toFixed(2)} / ${burnRate}` }, { text: "Convert minutes to hours and minutes.", content: `≈ ${hours} h ${minutes} min` }]
                    },
                    {
                        answer: csa.toFixed(2) + " cm²",
                        calculation: `CSA = 2π × ${r} × ${h} = ${csa.toFixed(2)} cm²`,
                        steps: [{ text: "Use the formula for Curved Surface Area (CSA).", content: "A = 2πrh" }, { text: "Substitute the given values.", content: `A = 2π × ${r} × ${h}` }, { text: "Compute the area.", content: `A ≈ ${csa.toFixed(2)} cm²` }]
                    },
                    {
                        answer: count + " candles",
                        calculation: `Count = (${volume.toFixed(0)}) / (${smallVolume.toFixed(0)}) = ${count}`,
                        steps: [{ text: "Find the volume of one small candle.", content: `V_s = π × ${sr}² × ${sh} ≈ ${smallVolume.toFixed(2)} cm³` }, { text: "Divide the total wax volume by the small candle volume.", content: `Count = V / V_s` }, { text: "Calculate the number of candles.", content: `Count ≈ ${count}` }]
                    }
                ];

            } else { // --- EXISTING: Water Tank case ---
                const { radius: r, height: h } = params;
                const cylCSA = 2 * PI * r * h;
                const hemiCSA = 2 * PI * r * r;
                const totalArea = cylCSA + hemiCSA;
                const cost = totalArea * 75;
                solutions = [
                    {
                        answer: cylCSA.toFixed(2) + " m²",
                        calculation: `2π × ${r} × ${h} = ${cylCSA.toFixed(2)} m²`,
                        steps: [{ text: "Use the formula for the Curved Surface Area (CSA) of a cylinder.", content: "CSA = 2πrh" }, { text: "Substitute the given values for radius (r) and height (h).", content: `CSA = 2 × π × ${r} × ${h}` }, { text: "Calculate the result.", content: `CSA = ${cylCSA.toFixed(2)} m²` }]
                    },
                    {
                        answer: hemiCSA.toFixed(2) + " m²",
                        calculation: `2π × ${r}² = ${hemiCSA.toFixed(2)} m²`,
                        steps: [{ text: "Use the formula for the CSA of a hemisphere.", content: "CSA = 2πr²" }, { text: "Substitute the given value for radius (r).", content: `CSA = 2 × π × ${r}²` }, { text: "Calculate the result.", content: `CSA = ${hemiCSA.toFixed(2)} m²` }]
                    },
                    {
                        answer: "₹" + cost.toFixed(2),
                        calculation: `${totalArea.toFixed(2)} × 75 = ₹${cost.toFixed(2)}`,
                        steps: [{ text: "First, find the total area by adding the two surface areas.", content: `Total Area = ${cylCSA.toFixed(2)} + ${hemiCSA.toFixed(2)} = ${totalArea.toFixed(2)} m²` }, { text: "Multiply the total area by the cost per m².", content: "Cost = Total Area × Rate" }, { text: "Calculate the final cost.", content: `Cost = ${totalArea.toFixed(2)} × 75 = ₹${cost.toFixed(2)}` }]
                    }
                ];
            }
            break;
        }
        case 'cone': {
            const { radius: r, height: h } = params;
            const slantHeight = Math.sqrt(r * r + h * h);
            const csa = PI * r * slantHeight;
            const cost = csa * 0.50;
            solutions = [ { answer: slantHeight.toFixed(2) + " cm", calculation: `√(${r}² + ${h}²) = ${slantHeight.toFixed(2)} cm`, steps: [ { text: "The slant height (l) is found using the Pythagorean theorem.", content: "l = √(r² + h²)" }, { text: "Substitute the values for radius (r) and height (h).", content: `l = √(${r}² + ${h}²)` }, { text: "Calculate the result for the slant height.", content: `l = ${slantHeight.toFixed(2)} cm` } ] }, { answer: csa.toFixed(2) + " cm²", calculation: `π × ${r} × ${slantHeight.toFixed(2)} = ${csa.toFixed(2)} cm²`, steps: [ { text: "Use the formula for the Curved Surface Area (CSA) of a cone.", content: "CSA = πrl" }, { text: "Substitute the values for radius (r) and slant height (l).", content: `CSA = π × ${r} × ${slantHeight.toFixed(2)}` }, { text: "Calculate the final area.", content: `CSA = ${csa.toFixed(2)} cm²` } ] }, { answer: "₹" + cost.toFixed(2), calculation: `${csa.toFixed(2)} × 0.50 = ₹${cost.toFixed(2)}`, steps: [ { text: "To find the cost, multiply the surface area by the coating rate.", content: "Cost = Area × Rate" }, { text: "Substitute the calculated area and the given rate.", content: `Cost = ${csa.toFixed(2)} × 0.50` }, { text: "Calculate the final cost.", content: `Cost = ₹${cost.toFixed(2)}` } ] } ];
            break;
        }
        case 'cube': {
            const { side: a } = params;
            const area = 5 * a * a;
            const cost = area * 2;
            const volume = a * a * a;
            const chocolates = Math.floor(volume * 0.9);
            solutions = [ { answer: area + " cm²", calculation: `5 × ${a}² = ${area} cm²`, steps: [ { text: "A cube has 6 faces. Since it has no lid and the bottom is not painted, we paint 5 faces.", content: "Area = 5 × (side)²" }, { text: "Substitute the value for the side (a).", content: `Area = 5 × ${a}²` }, { text: "Calculate the total area to be painted.", content: `Area = ${area} cm²` } ] }, { answer: "₹" + cost, calculation: `${area} × 2 = ₹${cost}`, steps: [ { text: "Multiply the painted area by the cost per cm².", content: "Cost = Area × Rate" }, { text: "Substitute the area and the given rate.", content: `Cost = ${area} × 2` }, { text: "Calculate the total cost.", content: `Cost = ₹${cost}` } ] }, { answer: chocolates + " chocolates", calculation: `90% of ${volume} = ${chocolates} chocolates`, steps: [ { text: "First, find the total volume of the cube.", content: "Volume = a³ = " + a + "³ = " + volume + " cm³" }, { text: "The box is filled to 90% of its capacity.", content: "Capacity = 0.90 × Volume" }, { text: "Calculate the number of chocolates.", content: `Chocolates = 0.90 × ${volume} = ${chocolates}` } ] } ];
            break;
        }
        case 'sphere': {
            const { radius: r } = params;
            const area = 4 * PI * r * r;
            const cost = area * 1.20;
            const volume = (4/3) * PI * r * r * r;
            solutions = [ { answer: area.toFixed(0) + " cm²", calculation: `4π × ${r}² = ${area.toFixed(0)} cm²`, steps: [ { text: "Use the formula for the surface area of a sphere.", content: "Area = 4πr²" }, { text: "Substitute the value for the radius (r).", content: `Area = 4 × π × ${r}²` }, { text: "Calculate the result.", content: `Area = ${area.toFixed(0)} cm²` } ] }, { answer: "₹" + cost.toFixed(2), calculation: `${area.toFixed(0)} × 1.20 = ₹${cost.toFixed(2)}`, steps: [ { text: "Multiply the surface area by the cost of leather per cm².", content: "Cost = Area × Rate" }, { text: "Substitute the area and the given rate.", content: `Cost = ${area.toFixed(0)} × 1.20` }, { text: "Calculate the total cost.", content: `Cost = ₹${cost.toFixed(2)}` } ] }, { answer: volume.toFixed(0) + " cm³", calculation: `(4/3)π × ${r}³ = ${volume.toFixed(0)} cm³`, steps: [ { text: "Use the formula for the volume of a sphere.", content: "Volume = (4/3)πr³" }, { text: "Substitute the value for the radius (r).", content: `Volume = (4/3) × π × ${r}³` }, { text: "Calculate the volume.", content: `Volume = ${volume.toFixed(0)} cm³` } ] } ];
            break;
        }
        case 'hemisphere': {
            const { radius: r } = params;
            const csa = 2 * PI * r * r;
            const cost = csa * 0.80;
            const volume = (2/3) * PI * r * r * r;
            solutions = [ { answer: csa.toFixed(0) + " cm²", calculation: `2π × ${r}² = ${csa.toFixed(0)} cm²`, steps: [ { text: "Use the formula for the Curved Surface Area (CSA) of a hemisphere.", content: "CSA = 2πr²" }, { text: "Substitute the value for the radius (r).", content: `CSA = 2 × π × ${r}²` }, { text: "Calculate the area.", content: `CSA = ${csa.toFixed(0)} cm²` } ] }, { answer: "₹" + cost.toFixed(2), calculation: `${csa.toFixed(0)} × 0.80 = ₹${cost.toFixed(2)}`, steps: [ { text: "Multiply the inner surface area by the polishing cost per cm².", content: "Cost = Area × Rate" }, { text: "Substitute the area and the given rate.", content: `Cost = ${csa.toFixed(0)} × 0.80` }, { text: "Calculate the total cost.", content: `Cost = ₹${cost.toFixed(2)}` } ] }, { answer: volume.toFixed(2) + " cm³", calculation: `(2/3)π × ${r}³ = ${volume.toFixed(2)} cm³`, steps: [ { text: "Use the formula for the volume of a hemisphere.", content: "Volume = (2/3)πr³" }, { text: "Substitute the value for the radius (r).", content: `Volume = (2/3) × π × ${r}³` }, { text: "Calculate the volume.", content: `Volume = ${volume.toFixed(2)} cm³` } ] } ];
            break;
        }
        case 'frustum': {
            const { topRadius: R, bottomRadius: r, height: h } = params;
            const slantHeight = Math.sqrt((R - r) * (R - r) + h * h);
            const csa = PI * (R + r) * slantHeight;
            const baseArea = PI * r * r;
            solutions = [ { answer: slantHeight.toFixed(0) + " cm", calculation: `√((${R}-${r})² + ${h}²) = ${slantHeight.toFixed(0)} cm`, steps: [ { text: "The formula for the slant height (l) of a frustum is:", content: "l = √((R-r)² + h²)" }, { text: "Substitute the values for R, r, and h.", content: `l = √((${R}-${r})² + ${h}²)` }, { text: "Calculate the result.", content: `l = ${slantHeight.toFixed(0)} cm` } ] }, { answer: csa.toFixed(0) + " cm²", calculation: `π(${R}+${r}) × ${slantHeight.toFixed(0)} = ${csa.toFixed(0)} cm²`, steps: [ { text: "Use the formula for the Curved Surface Area (CSA) of a frustum.", content: "CSA = π(R+r)l" }, { text: "Substitute the values for R, r, and l.", content: `CSA = π(${R}+${r}) × ${slantHeight.toFixed(0)}` }, { text: "Calculate the area.", content: `CSA = ${csa.toFixed(0)} cm²` } ] }, { answer: baseArea.toFixed(0) + " cm²", calculation: `π × ${r}² = ${baseArea.toFixed(0)} cm²`, steps: [ { text: "The base is a circle. Use the formula for the area of a circle.", content: "Area = πr²" }, { text: "Substitute the value for the bottom radius (r).", content: `Area = π × ${r}²` }, { text: "Calculate the base area.", content: `Area = ${baseArea.toFixed(0)} cm²` } ] } ];
            break;
        }
        case 'compound': {
            const { radius: r, cylinderHeight: ch, coneHeight: conh } = params;
            const cylCSA = 2 * PI * r * ch;
            const coneSlantHeight = Math.sqrt(r * r + conh * conh);
            const coneCSA = PI * r * coneSlantHeight;
            const totalCost = (cylCSA + coneCSA) * 2;
            solutions = [ { answer: cylCSA.toFixed(0) + " cm²", calculation: `2π × ${r} × ${ch} = ${cylCSA.toFixed(0)} cm²`, steps: [ { text: "Use the formula for the Curved Surface Area (CSA) of a cylinder.", content: "CSA = 2πrh" }, { text: "Substitute the values for radius (r) and cylinder height (ch).", content: `CSA = 2 × π × ${r} × ${ch}` }, { text: "Calculate the area.", content: `CSA = ${cylCSA.toFixed(0)} cm²` } ] }, { answer: coneSlantHeight.toFixed(2) + " cm", calculation: `√(${r}² + ${conh}²) = ${coneSlantHeight.toFixed(2)} cm`, steps: [ { text: "Find the slant height (l) of the conical part using Pythagorean theorem.", content: "l = √(r² + h²)" }, { text: "Substitute the values for radius (r) and cone height (conh).", content: `l = √(${r}² + ${conh}²)` }, { text: "Calculate the slant height.", content: `l = ${coneSlantHeight.toFixed(2)} cm` } ] }, { answer: "₹" + totalCost.toFixed(0), calculation: `(${cylCSA.toFixed(0)} + ${coneCSA.toFixed(0)}) × 2 = ₹${totalCost.toFixed(0)}`, steps: [ { text: "First, find the CSA of the conical part: πrl", content: `Cone CSA = π × ${r} × ${coneSlantHeight.toFixed(2)} = ${coneCSA.toFixed(0)} cm²` }, { text: "Find the total area by adding the cylinder and cone CSAs.", content: `Total Area = ${cylCSA.toFixed(0)} + ${coneCSA.toFixed(0)}` }, { text: "Multiply the total area by the cloth cost per cm².", content: `Cost = (${cylCSA.toFixed(0)} + ${coneCSA.toFixed(0)}) × 2 = ₹${totalCost.toFixed(0)}` } ] } ];
            break;
        }
    }
    return solutions;
}

// Generate wrong options for multiple choice
function generateOptions(correctAnswer, type = 'numeric') {
    const options = [correctAnswer];
    const correctValue = parseFloat(correctAnswer.replace(/[^\d.-]/g, '').trim());
    while (options.length < 4) {
        let wrongValue;
        if (type === 'cost') {
            wrongValue = correctValue * (0.7 + Math.random() * 0.6);
            wrongValue = "₹" + wrongValue.toFixed(2);
        } else if (type === 'area') {
            const unit = correctAnswer.match(/cm²|m²|cm³|m³/) || [''];
            wrongValue = correctValue * (0.8 + Math.random() * 0.4);
            wrongValue = wrongValue.toFixed(correctAnswer.includes('.') ? 2 : 0) + " " + unit[0];
        } else if (correctAnswer.includes('h') && correctAnswer.includes('min')) {
            const totalMinutes = correctValue;
            const wrongMinutes = totalMinutes * (0.8 + Math.random() * 0.4);
            const hours = Math.floor(wrongMinutes / 60);
            const minutes = Math.round(wrongMinutes % 60);
            wrongValue = `≈ ${hours} h ${minutes} min`;
        } else {
            const suffix = correctAnswer.replace(/[\d.,≈\s-]/g, '');
            wrongValue = correctValue * (0.8 + Math.random() * 0.4);
            wrongValue = Math.round(wrongValue) + " " + suffix;
        }
        if (!options.includes(wrongValue) && wrongValue !== correctAnswer) { options.push(wrongValue); }
    }
    for (let i = options.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [options[i], options[j]] = [options[j], options[i]]; }
    return options;
}

// Initialize shape data with random parameters
function initializeShapeData() {
    const baseShapeData = {
        cylinder: {
            name: "Cylinder",
            cases: [
                {
                    key: 'waterTank',
                    title: "Water Tank Construction",
                    scenario: "Mr. Sharma is constructing a water tank for his farmhouse. The tank consists of a cylinder with a hemispherical dome on top. He wants to paint the outer surface excluding the base. Cost of painting = ₹75 per m²",
                    formulas: ["CSA = 2πrh", "Hemisphere CSA = 2πr²", "Total CSA = 2πrh + 2πr²"],
                    questionTemplates: [ "What is the Curved Surface Area (CSA) of the cylindrical part?", "What is the Curved Surface Area of the hemispherical dome?", "What is the total painting cost?" ]
                },
                {
                    key: 'candle',
                    title: "Cylindrical Candle",
                    scenario: "A decorative candle is in the shape of a cylinder. You need to calculate its volume, burn time, and other properties based on the given dimensions.",
                    formulas: ["Volume V = πr²h", "Time = Volume / Rate", "CSA = 2πrh", "Count = V_large / V_small"],
                    questionTemplates: [ "Find the volume of wax used in making the candle.", "If the candle burns uniformly at the rate of [burnRate] cm³ of wax per minute, how long will it take to burn completely?", "If a label is pasted around the curved surface of the candle, find the area of paper needed.", "Suppose the candle is melted and recast into small cylindrical candles of radius [smallRadius] cm and height [smallHeight] cm. How many such candles can be made?" ]
                },
                {
                    key: 'pillar',
                    title: "Cylindrical Pillar",
                    scenario: "A hall has a number of cylindrical pillars. Calculations are required for painting costs and for recasting the material into smaller rods.",
                    formulas: ["CSA = 2πrh", "Total Cost = Total Area × Rate", "Base Area = πr²", "Volume = πr²h"],
                    questionTemplates: [ "Find the curved surface area of one pillar.", "Find the total cost of whitewashing all pillars at ₹[whitewashCost] per m².", "If the base of each pillar is painted with a golden paint at ₹[paintCost] per m², find the total cost for all pillars.", "If all pillars are melted and recast into cylindrical rods of [rodRadius] cm radius and [rodHeight] m height, how many rods can be made?" ]
                },
                 {
                    key: 'roadRoller',
                    title: "Cylindrical Road Roller",
                    scenario: "A road roller, cylindrical in shape, is used to level a road. You need to calculate the area it covers and the associated construction costs.",
                    formulas: ["CSA = 2πr × length", "Total Area = CSA × Revolutions", "Length = Area / Width", "Cost = Area × Rate"],
                    questionTemplates: [
                        "Find the curved surface area of the roller.",
                        "If it takes [revolutions] revolutions to level a road, find the area of the road leveled.",
                        "If the road has a width of [roadWidth] m, find the length of road leveled in [revolutions] revolutions.",
                        "If the cost of road-laying is ₹[costPerSqm] per m², find the cost of constructing the road of the above dimensions."
                    ]
                }
            ]
        },
        cone: { name: "Cone", title: "Ice Cream Cone Design", scenario: "A local ice cream factory is designing wafer cones. They want to calculate the area for chocolate coating and volume of ice cream. Chocolate coating rate = ₹0.50 per cm²", formulas: ["Slant height l = √(r² + h²)", "CSA = πrl", "Volume = ⅓πr²h"], questionTemplates: [ "What is the slant height of the cone?", "What is the curved surface area to be coated?", "What is the cost of chocolate coating per cone?" ] },
        cube: { name: "Cube", title: "Birthday Gift Box", scenario: "Diya is making a cube-shaped sweet box with no lid for her friend's birthday. She will paint the outer surface (except bottom) and fill 90% with chocolates. Painting cost = ₹2 per cm²", formulas: ["Surface area of 5 faces = 5a²", "Volume = a³", "90% volume for chocolates"], questionTemplates: [ "What is the surface area to be painted?", "What is the total painting cost?", "How many chocolates can fit (90% volume)?" ] },
        sphere: { name: "Sphere", title: "Football Manufacturing", scenario: "A sports company manufactures spherical footballs. The surface is synthetic leather costing ₹1.20 per cm². They need to calculate leather cost and air volume.", formulas: ["Surface area = 4πr²", "Volume = ⁴⁄₃πr³"], questionTemplates: [ "What is the surface area of the football?", "What is the cost of leather for one football?", "What is the volume of air inside?" ] },
        hemisphere: { name: "Hemisphere", title: "Steel Serving Bowls", scenario: "A factory manufactures hemispherical steel bowls, open at top. They need polishing on inner curved surface. Polishing cost = ₹0.80 per cm²", formulas: ["Curved surface area = 2πr²", "Volume = ²⁄₃πr³"], questionTemplates: [ "What is the inner curved surface area to be polished?", "What is the polishing cost per bowl?", "What volume can the bowl hold?" ] },
        frustum: { name: "Frustum", title: "Water Bucket Design", scenario: "A company designs frustum-shaped buckets. They paint inner curved surface and base. Painting cost = ₹1.50 per cm²", formulas: ["Slant height l = √((R-r)² + h²)", "CSA = π(R+r)l", "Base area = πr²"], questionTemplates: [ "What is the slant height of the bucket?", "What is the inner curved surface area?", "What is the base area?" ] },
        compound: { name: "Compound", title: "Miniature Tent Model", scenario: "Students create a tent model: cylinder with conical top. Made of cloth covering curved surfaces only. Cloth cost = ₹2 per cm²", formulas: ["Cylinder CSA = 2πrh", "Cone slant height = √(r² + h²)", "Cone CSA = πrl"], questionTemplates: [ "What is the curved surface area of the cylindrical part?", "What is the slant height of the conical part?", "What is the total cloth cost?" ] }
    };

    const shapeData = {};
    for (const [key, shape] of Object.entries(baseShapeData)) {
        let currentCase = null, questionTemplates = shape.questionTemplates, formulas = shape.formulas;
        if (key === 'cylinder') { currentCase = shape.cases[0]; questionTemplates = currentCase.questionTemplates; formulas = currentCase.formulas; }
        const caseKey = currentCase ? currentCase.key : null;
        const randomParams = generateRandomParams(key, caseKey);
        const solutions = calculateSolutions(key, randomParams, caseKey);
        shapeData[key] = { ...shape, parameters: randomParams, questions: questionTemplates.map((template, index) => {
                const correctAnswer = solutions[index].answer;
                const options = generateOptions(correctAnswer, correctAnswer.includes('₹') ? 'cost' : correctAnswer.includes('²') || correctAnswer.includes('³') ? 'area' : correctAnswer.includes('min') ? 'time' : 'numeric');
                let questionText = template.replace('[burnRate]', randomParams.burnRate).replace('[smallRadius]', randomParams.smallRadius).replace('[smallHeight]', randomParams.smallHeight).replace('[whitewashCost]', randomParams.whitewashCost).replace('[paintCost]', randomParams.paintCost).replace('[rodRadius]', randomParams.rodRadius).replace('[rodHeight]', randomParams.rodHeight).replace('[revolutions]', randomParams.revolutions).replace('[roadWidth]', randomParams.roadWidth).replace('[costPerSqm]', randomParams.costPerSqm);
                return { id: `${key}_${index + 1}`, question: questionText, options: options, correctAnswer: correctAnswer, explanation: `Using the formula: ${solutions[index].calculation}`, formula: formulas[index] || "", calculation: solutions[index].calculation, steps: solutions[index].steps };
            }) };
    }
    return shapeData;
}

// --- GLOBAL STATE & UI DEFINITIONS ---
let shapeData = initializeShapeData();
let currentShapeKey = 'cylinder';
let currentQuestionIndex = 0;
let selectedAnswer = null;
let ui = {};
let pg;
let rotationX = -0.3;
let rotationY = 0;
let autoRotationY = 0;
let helpModeActive = false;
let currentHelpStep = 0;

// --- P5.JS PRELOAD FUNCTION ---
function preload() {
    try {
        metalTexture = loadImage('assets/metal_texture.jpg');
        waffleTexture = loadImage('assets/waffle_texture.png');
        icecreamTexture = loadImage('assets/icecream_texture.jpg');
        giftTexture = loadImage('assets/wrapping_paper.jpg');
        footballTexture = loadImage('assets/football_texture.png');
        metalBowlTexture = loadImage('assets/brushed_metal.jpg');
        plasticTexture = loadImage('assets/plastic_texture.jpg');
        canvasTexture = loadImage('assets/canvas_texture.jpg');
        chocolateTexture = loadImage('assets/chocolate_texture.jpg');
        pillarTexture = loadImage('assets/pillar_texture.jpg'); 
        candleTexture = loadImage('assets/candle_texture.png');
        roadRollerTexture = loadImage('assets/road_roller_texture.jpg'); // New texture
    } catch (e) { console.error("Error loading textures.", e); }
}

// --- P5.JS SETUP ---
function setup() {
    createCanvas(900, 600).parent('canvas-container');
    pg = createGraphics(420, 420, WEBGL);
    textFont('Arial');
    ui.tabs = [];
    const shapeKeys = Object.keys(shapeData), tabWidth = 80, tabSpacing = 10;
    const totalTabsWidth = shapeKeys.length * (tabWidth + tabSpacing) - tabSpacing;
    const tabsStartX = (width - totalTabsWidth) / 2;
    shapeKeys.forEach((key, i) => { ui.tabs.push({ key: key, x: tabsStartX + i * (tabWidth + tabSpacing), y: 20, w: tabWidth, h: 40 }); });
    ui.mainPanel = { x: 20, y: 80, w: width - 40, h: height - 100 };
    ui.leftPanel = { x: 40, y: 100, w: 400, h: 460 };
    ui.rightPanel = { x: 460, y: 100, w: 420, h: 460 };
}

// --- P5.JS DRAW LOOP ---
function draw() {
    background('#f8f9fa');
    noStroke(); fill('#ffffff'); rect(ui.mainPanel.x, ui.mainPanel.y, ui.mainPanel.w, ui.mainPanel.h, 10);
    stroke('#dee2e6'); noFill(); rect(ui.mainPanel.x, ui.mainPanel.y, ui.mainPanel.w, ui.mainPanel.h, 10);
    drawTabs();
    drawLeftPanel();
    drawRightPanel();
    if (selectedAnswer) { drawFeedbackOverlay(); } else if (helpModeActive) { drawHelpOverlay(); }
}

// --- UI DRAWING FUNCTIONS ---
function drawTabs() {
    ui.tabs.forEach(tab => {
        const isActive = (tab.key === currentShapeKey);
        stroke(isActive ? '#007bff' : '#ced4da'); fill(isActive ? '#007bff' : '#f8f9fa'); rect(tab.x, tab.y, tab.w, tab.h, 20);
        noStroke(); fill(isActive ? '#ffffff' : '#495057'); textAlign(CENTER, CENTER); textSize(14); text(shapeData[tab.key].name, tab.x + tab.w / 2, tab.y + tab.h / 2);
    });
}

function drawLeftPanel() {
    const shape = shapeData[currentShapeKey], question = shape.questions[currentQuestionIndex], panel = ui.leftPanel;
    let yPos = panel.y + 15;
    let currentCase = shape;
    if (currentShapeKey === 'cylinder') { currentCase = shape.cases[currentCylinderCaseIndex]; }
    let updatedScenario = currentCase.scenario;
    const params = shape.parameters;
    switch (currentShapeKey) {
        case 'cylinder':
            if (currentCylinderCaseIndex === 0) updatedScenario = `Mr. Sharma is constructing a water tank with a cylinder (radius = ${params.radius} m, height = ${params.height} m) and a hemispherical dome. Cost of painting = ₹75 per m²`;
            else if (currentCylinderCaseIndex === 1) updatedScenario = `A decorative candle is a cylinder with radius = ${params.radius} cm and height = ${params.height} cm. You need to calculate its properties.`;
            else if (currentCylinderCaseIndex === 2) updatedScenario = `A hall has ${params.pillarCount} cylindrical pillars, each of height ${params.height} m and diameter ${params.diameter} cm. Calculations are required for painting and recasting.`;
            else updatedScenario = `A road roller with a ${params.diameter} m diameter and ${params.length} m length is used to level a road. Calculate the area covered and construction costs.`;
            break;
        case 'cone': updatedScenario = `An ice cream cone has radius = ${params.radius} cm, height = ${params.height} cm. Chocolate coating rate = ₹0.50 per cm²`; break;
        case 'cube': updatedScenario = `A cube-shaped gift box (side = ${params.side} cm) with no lid is painted (except bottom) and filled 90% with chocolates. Painting cost = ₹2 per cm²`; break;
        case 'sphere': updatedScenario = `A spherical football (radius = ${params.radius} cm) is made of leather costing ₹1.20 per cm².`; break;
        case 'hemisphere': updatedScenario = `A hemispherical steel bowl (radius = ${params.radius} cm) needs polishing on its inner surface. Polishing cost = ₹0.80 per cm²`; break;
        case 'frustum': updatedScenario = `A frustum-shaped bucket (R=${params.topRadius} cm, r=${params.bottomRadius} cm, h=${params.height} cm) is painted inside. Painting cost = ₹1.50 per cm²`; break;
        case 'compound': updatedScenario = `A tent model is a cylinder (r=${params.radius} cm, h=${params.cylinderHeight} cm) with a conical top (h=${params.coneHeight} cm). Cloth cost = ₹2 per cm²`; break;
    }
    fill('#e7f5ff'); stroke('#bde0fe'); rect(panel.x, yPos, panel.w, 110, 8);
    noStroke(); fill('#0c63e4'); textAlign(LEFT, TOP); textSize(16); textStyle(BOLD); text(currentCase.title, panel.x + 15, yPos + 15);
    fill('#555'); textSize(13); textStyle(NORMAL); text(updatedScenario, panel.x + 15, yPos + 40, panel.w - 30);
    yPos += 125;
    fill('#ffffff'); stroke('#dee2e6'); const questionBlockHeight = 160 + question.options.length * 45 + 45; rect(panel.x, yPos, panel.w, questionBlockHeight, 8);
    noStroke(); fill('#212529'); textAlign(LEFT, TOP); textSize(15); textStyle(BOLD); text(`Question ${currentQuestionIndex + 1}/${shape.questions.length}`, panel.x + 15, yPos + 15);
    ui.qNavDots = [];
    for (let i = 0; i < shape.questions.length; i++) {
        const dotX = panel.x + panel.w - (shape.questions.length - i) * 30 - 10, dotY = yPos + 10;
        ui.qNavDots.push({ x: dotX, y: dotY, w: 24, h: 24 });
        fill(i === currentQuestionIndex ? '#007bff' : '#e9ecef'); ellipse(dotX + 12, dotY + 12, 24, 24);
        fill(i === currentQuestionIndex ? '#ffffff' : '#495057'); textAlign(CENTER, CENTER); textSize(12); text(i + 1, dotX + 12, dotY + 12);
    }
    fill('#212529'); textAlign(LEFT, TOP); textStyle(NORMAL); textSize(14); text(question.question, panel.x + 15, yPos + 50, panel.w - 30);
    let optY = yPos + 100;
    ui.options = [];
    question.options.forEach((option, index) => {
        const optBox = { x: panel.x + 15, y: optY, w: panel.w - 30, h: 35 };
        ui.options.push({ ...optBox, text: option });
        let bgColor = '#f8f9fa', strokeColor = '#ced4da';
        if (selectedAnswer && selectedAnswer.option === option) { bgColor = selectedAnswer.isCorrect ? '#d1e7dd' : '#f8d7da'; strokeColor = selectedAnswer.isCorrect ? '#a3cfbb' : '#f5c2c7'; }
        stroke(strokeColor); fill(bgColor); rect(optBox.x, optBox.y, optBox.w, optBox.h, 5);
        noStroke(); fill('#212529'); textAlign(LEFT, CENTER); text(option, optBox.x + 15, optBox.y + optBox.h / 2);
        optY += 45;
    });
    const btnX = panel.x + 15, btnY = optY, btnW = panel.w - 30, btnH = 40;
    ui.helpButton = {x: btnX, y: btnY, w: btnW, h: btnH};
    stroke('#007bff'); fill('#e0f7fa'); rect(btnX, btnY, btnW, btnH, 5);
    noStroke(); fill('#0056b3'); textAlign(CENTER, CENTER); textSize(16); textStyle(NORMAL); text("Help Me Solve This", btnX + btnW / 2, btnY + btnH / 2);
}

function drawRightPanel() {
    const panel = ui.rightPanel, shape = shapeData[currentShapeKey];
    autoRotationY += 0.005;
    pg.background(0); pg.ambientLight(10); pg.directionalLight(128, 128, 128, -1, 1, -1); pg.pointLight(200, 200, 255, 200, -150, 200); pg.directionalLight(255, 200, 200, 1, -1, 1);
    pg.push(); pg.translate(0, 20, 0); pg.rotateX(rotationX); pg.rotateY(rotationY + autoRotationY);
    drawShape(pg, currentShapeKey, shape.parameters);
    pg.pop();
    image(pg, panel.x, panel.y, panel.w, panel.h);
    drawParameters(this, currentShapeKey, shape.parameters);
}

function drawFeedbackOverlay() {
    const question = shapeData[currentShapeKey].questions[currentQuestionIndex], isCorrect = selectedAnswer.isCorrect;
    fill(0,0,0,150); noStroke(); rect(0,0,width,height);
    const boxW = 450, boxH = 280, boxX = (width-boxW)/2, boxY = (height-boxH)/2;
    fill('#ffffff'); stroke('#dee2e6'); rect(boxX,boxY,boxW,boxH,12);
    const headerH = 60; fill(isCorrect?'#d1e7dd':'#f8d7da'); noStroke(); rect(boxX,boxY,boxW,headerH,12,12,0,0);
    fill(isCorrect?'#0f5132':'#842029'); textSize(24); textStyle(BOLD); textAlign(CENTER,CENTER); text(isCorrect?"Correct!":"Incorrect",boxX+boxW/2,boxY+headerH/2);
    textAlign(LEFT,TOP); textStyle(NORMAL); fill('#212529'); textSize(14); text("Explanation:",boxX+20,boxY+headerH+20);
    fill('#f8f9fa'); stroke('#e9ecef'); rect(boxX+20,boxY+headerH+45,boxW-40,90,5);
    fill('#6c757d'); textFont('monospace'); textSize(14); text(`${question.formula}\n\n${question.calculation}`,boxX+30,boxY+headerH+55,boxW-60); textFont('Arial');
    const btnW=150,btnH=40,btnX=boxX+(boxW-btnW)/2,btnY=boxY+boxH-btnH-20;
    ui.nextButton={x:btnX,y:btnY,w:btnW,h:btnH};
    fill('#007bff'); noStroke(); rect(btnX,btnY,btnW,btnH,5);
    fill('#ffffff'); textSize(16); textStyle(BOLD); textAlign(CENTER,CENTER); text("Next Question",btnX+btnW/2,btnY+btnH/2);
}

function drawHelpOverlay() {
    const question=shapeData[currentShapeKey].questions[currentQuestionIndex],steps=question.steps;
    fill(0,0,0,180); noStroke(); rect(0,0,width,height);
    const boxW=550,boxH=400,boxX=(width-boxW)/2,boxY=(height-boxH)/2;
    fill('#ffffff'); stroke('#dee2e6'); rect(boxX,boxY,boxW,boxH,12);
    const headerH=60; fill('#e7f5ff'); noStroke(); rect(boxX,boxY,boxW,headerH,12,12,0,0);
    fill('#0c63e4'); textSize(20); textStyle(BOLD); textAlign(CENTER,CENTER); text("Let's Solve This Step-by-Step",boxX+boxW/2,boxY+headerH/2);
    textAlign(LEFT,TOP); textStyle(NORMAL); fill('#6c757d'); textSize(14); text(question.question,boxX+20,boxY+headerH+15,boxW-40);
    let yPos=boxY+headerH+50;
    for(let i=0;i<=currentHelpStep && i<steps.length;i++){
        const step=steps[i];
        fill('#007bff'); noStroke(); ellipse(boxX+30,yPos+10,20,20);
        fill('#ffffff'); textAlign(CENTER,CENTER); text(i+1,boxX+30,yPos+10);
        textAlign(LEFT,TOP); fill('#212529'); textSize(14); text(step.text,boxX+50,yPos,boxW-70); yPos+=30;
        fill('#f8f9fa'); stroke('#e9ecef'); rect(boxX+50,yPos,boxW-70,40,5);
        fill('#d63384'); textFont('monospace'); textAlign(CENTER,CENTER); text(step.content,boxX+50+(boxW-70)/2,yPos+20); textFont('Arial'); yPos+=55;
    }
    const isLastStep=(currentHelpStep>=steps.length-1);
    const closeBtnW=120,closeBtnH=40,closeBtnX=boxX+boxW-closeBtnW-20,closeBtnY=boxY+boxH-closeBtnH-20;
    ui.helpCloseButton={x:closeBtnX,y:closeBtnY,w:closeBtnW,h:closeBtnH};
    fill(isLastStep?'#0d6efd':'#6c757d'); noStroke(); rect(closeBtnX,closeBtnY,closeBtnW,closeBtnH,5);
    fill('#ffffff'); textSize(16); textStyle(BOLD); textAlign(CENTER,CENTER); text(isLastStep?"Got It!":"Close",closeBtnX+closeBtnW/2,closeBtnY+closeBtnH/2);
    if(!isLastStep){
        const nextBtnW=120,nextBtnH=40,nextBtnX=closeBtnX-nextBtnW-10,nextBtnY=closeBtnY;
        ui.helpNextButton={x:nextBtnX,y:nextBtnY,w:nextBtnW,h:nextBtnH};
        fill('#198754'); noStroke(); rect(nextBtnX,nextBtnY,nextBtnW,nextBtnH,5);
        fill('#ffffff'); text("Next Step",nextBtnX+nextBtnW/2,nextBtnY+nextBtnH/2);
    } else { ui.helpNextButton=null; }
}

function regenerateCurrentValues() {
    const shape = shapeData[currentShapeKey];
    let caseKey = null, questionTemplates, formulas;
    if (currentShapeKey === 'cylinder') {
        const currentCase = shape.cases[currentCylinderCaseIndex];
        caseKey = currentCase.key; questionTemplates = currentCase.questionTemplates; formulas = currentCase.formulas;
    } else { questionTemplates = shape.questionTemplates; formulas = shape.formulas; }
    const newParams = generateRandomParams(currentShapeKey, caseKey);
    const newSolutions = calculateSolutions(currentShapeKey, newParams, caseKey);
    shape.parameters = newParams;
    shape.questions = questionTemplates.map((template, index) => {
        const correctAnswer = newSolutions[index].answer;
        const options = generateOptions(correctAnswer, correctAnswer.includes('₹')?'cost':correctAnswer.includes('²')||correctAnswer.includes('³')?'area':correctAnswer.includes('min')?'time':'numeric');
        let questionText = template.replace('[burnRate]',newParams.burnRate).replace('[smallRadius]',newParams.smallRadius).replace('[smallHeight]',newParams.smallHeight).replace('[whitewashCost]',newParams.whitewashCost).replace('[paintCost]',newParams.paintCost).replace('[rodRadius]',newParams.rodRadius).replace('[rodHeight]',newParams.rodHeight).replace('[revolutions]',newParams.revolutions).replace('[roadWidth]',newParams.roadWidth).replace('[costPerSqm]',newParams.costPerSqm);
        return {id:`${currentShapeKey}_${index+1}`,question:questionText,options:options,correctAnswer:correctAnswer,explanation:`Using the formula: ${newSolutions[index].calculation}`,formula:formulas[index]||"",calculation:newSolutions[index].calculation,steps:newSolutions[index].steps};
    });
    currentQuestionIndex = 0; selectedAnswer = null; helpModeActive = false;
}

function mousePressed() {
    if(helpModeActive){ const question=shapeData[currentShapeKey].questions[currentQuestionIndex]; const btnNext=ui.helpNextButton,btnClose=ui.helpCloseButton; if(btnNext&&mouseX>btnNext.x&&mouseX<btnNext.x+btnNext.w&&mouseY>btnNext.y&&mouseY<btnNext.y+btnNext.h){if(currentHelpStep<question.steps.length-1)currentHelpStep++;return;} if(btnClose&&mouseX>btnClose.x&&mouseX<btnClose.x+btnClose.w&&mouseY>btnClose.y&&mouseY<btnClose.y+btnClose.h){helpModeActive=false;currentHelpStep=0;return;} return;}
    if(selectedAnswer){ const btn=ui.nextButton; if(btn&&mouseX>btn.x&&mouseX<btn.x+btn.w&&mouseY>btn.y&&mouseY<btn.y+btn.h){currentQuestionIndex=(currentQuestionIndex+1)%shapeData[currentShapeKey].questions.length;selectedAnswer=null;} return;}
    const regenButton=ui.regenButton; if(regenButton&&mouseX>regenButton.x&&mouseX<regenButton.x+regenButton.w&&mouseY>regenButton.y&&mouseY<regenButton.y+regenButton.h){if(currentShapeKey==='cylinder')currentCylinderCaseIndex=(currentCylinderCaseIndex+1)%shapeData.cylinder.cases.length;regenerateCurrentValues();return;}
    const helpBtn=ui.helpButton; if(helpBtn&&mouseX>helpBtn.x&&mouseX<helpBtn.x+helpBtn.w&&mouseY>helpBtn.y&&mouseY<helpBtn.y+helpBtn.h){helpModeActive=true;currentHelpStep=0;return;}
    for(const tab of ui.tabs){if(mouseX>tab.x&&mouseX<tab.x+tab.w&&mouseY>tab.y&&mouseY<tab.y+tab.h){currentShapeKey=tab.key;currentQuestionIndex=0;currentCylinderCaseIndex=0;regenerateCurrentValues();selectedAnswer=null;helpModeActive=false;return;}}
    if(ui.qNavDots){for(let i=0;i<ui.qNavDots.length;i++){const dot=ui.qNavDots[i];if(dist(mouseX,mouseY,dot.x+dot.w/2,dot.y+dot.h/2)<dot.w/2){currentQuestionIndex=i;selectedAnswer=null;helpModeActive=false;return;}}}
    if(!selectedAnswer&&ui.options){for(const opt of ui.options){if(mouseX>opt.x&&mouseX<opt.x+opt.w&&mouseY>opt.y&&mouseY<opt.y+opt.h){selectedAnswer={option:opt.text,isCorrect:(opt.text===shapeData[currentShapeKey].questions[currentQuestionIndex].correctAnswer)};return;}}}
}

function mouseDragged() {
    if (selectedAnswer || helpModeActive) return;
    if (mouseX > ui.rightPanel.x && mouseX < ui.rightPanel.x + ui.rightPanel.w && mouseY > ui.rightPanel.y && mouseY < ui.rightPanel.y + ui.rightPanel.h) {
        rotationX -= (pmouseY - mouseY) * 0.01;
        rotationY -= (pmouseX - mouseX) * 0.01;
        rotationX = constrain(rotationX, -PI / 2, PI / 2);
    }
}

// --- MODIFIED: drawShape includes a model for all cylinder cases ---
function drawShape(p, shapeType, params) {
    const scale = 25;
    p.noStroke();

    switch (shapeType) {
        case 'cylinder': {
            if (currentCylinderCaseIndex === 3) { // Case 4: Road Roller
                const rollerRadius = 5 * scale;
                const rollerLength = 10 * scale;
                const frameColor = color(80, 80, 90); // A dark metal color for the frame

                p.push();
                p.rotateZ(PI / 2); // Orient the whole assembly horizontally

                // 1. Roller Drum
                p.push();
                p.specularMaterial(200); // Gives it a metallic shine
                p.shininess(40);
                p.texture(roadRollerTexture); // Make sure 'road_roller_texture.jpg' is in your /assets folder
                p.cylinder(rollerRadius, rollerLength);
                p.pop();

                // 2. Frame and Handle Assembly
                const axleRadius = 8;
                const handleHeight = rollerRadius + 40;

                // Axle that goes through the roller's center
                p.push();
                p.fill(frameColor);
                p.noStroke();
                p.cylinder(axleRadius, rollerLength + 40); // Axle is slightly longer than the roller
                p.pop();

                // U-shaped handle connected to the axle
                // Left vertical arm
                p.push();
                p.fill(frameColor);
                p.noStroke();
                p.translate(0, handleHeight / 2, -rollerLength / 2 - 15);
                p.box(20, handleHeight, 20);
                p.pop();

                // Right vertical arm
                p.push();
                p.fill(frameColor);
                p.noStroke();
                p.translate(0, handleHeight / 2, rollerLength / 2 + 15);
                p.box(20, handleHeight, 20);
                p.pop();

                // Top connecting handlebar
                p.push();
                p.fill(frameColor);
                p.noStroke();
                p.translate(0, handleHeight, 0); // Position at the top of the arms
                p.rotateX(PI / 2);
                p.cylinder(12, rollerLength + 50);
                p.pop();

                p.pop(); // End of main assembly push

            }
            else if (currentCylinderCaseIndex === 2) {
                const pillarRadius = 2 * scale;
                const pillarHeight = 12 * scale;
                p.push();
                p.ambientMaterial(200);
                p.shininess(10);
                p.texture(pillarTexture);
                p.cylinder(pillarRadius, pillarHeight);
                p.translate(0, -pillarHeight / 2, 0);
                p.cylinder(pillarRadius * 1.2, 10);
                p.translate(0, pillarHeight, 0);
                p.cylinder(pillarRadius * 1.2, 10);
                p.pop();
            } else if (currentCylinderCaseIndex === 1) {
                const candleRadius = 4.5 * scale;
                const candleHeight = 10 * scale;
                p.push();
                p.ambientMaterial(255, 250, 220);
                p.specularMaterial(255, 255, 255);
                p.shininess(30);
                p.texture(candleTexture);
                p.cylinder(candleRadius, candleHeight);
                p.push();
                p.translate(0, -candleHeight / 2, 0);
                p.fill(40, 40, 40);
                p.noStroke();
                p.cylinder(3, 12);
                p.pop();
                p.pop();
            } else {
                const r = 5 * scale;
                const h = 6 * scale;
                p.push();
                p.translate(0, h / 4, 0);
                p.specularMaterial(200);
                p.shininess(100);
                p.texture(metalTexture);
                p.cylinder(r, h, 24, 1, true, true);
                p.translate(0, -h / 2, 0);
                p.sphere(r, 24, 12);
                p.pop();
            }
            break;
        }
        case 'cone': { const r = 3.5*scale*0.9, h = 12*scale*0.9; p.push(); p.translate(0,h/4,0); p.specularMaterial(150); p.shininess(5); p.texture(waffleTexture); p.cone(r,h); p.translate(0,-h/2-r*0.5,0); p.specularMaterial(255); p.shininess(80); p.texture(icecreamTexture); p.pop(); break; }
        case 'cube': { const s = 10*scale*0.8; p.push(); p.specularMaterial(255); p.shininess(50); p.texture(giftTexture); p.box(s); p.noStroke(); p.specularMaterial(255,215,0); p.shininess(100); p.box(s*1.05,s*0.15,s*0.15); p.box(s*0.15,s*1.05,s*0.15); p.box(s*0.15,s*0.15,s*1.05); p.translate(0,-s/2-10,0); p.rotateX(PI/4); p.torus(15,5,24,16); p.pop(); break; }
        case 'sphere': { const r = 6.5*scale*0.8; p.push(); p.rotateX(PI/2); p.specularMaterial(200); p.shininess(40); p.texture(footballTexture); p.sphere(r,24,24); p.pop(); break; }
        case 'hemisphere': { const r = 4*scale*1.5, detail = 32; p.push(); p.rotateX(PI); p.fill(255); p.texture(metalBowlTexture); p.shininess(90); p.beginShape(p.TRIANGLES); for(let i=0;i<detail;i++){ for(let j=0;j<detail/2;j++){ const u1=i/detail,u2=(i+1)/detail,v1=j/(detail/2),v2=(j+1)/(detail/2); const theta1=u1*TWO_PI,theta2=u2*TWO_PI,phi1=PI/2+v1*PI/2,phi2=PI/2+v2*PI/2; const x1=r*sin(phi1)*cos(theta1),y1=r*cos(phi1),z1=r*sin(phi1)*sin(theta1); const x2=r*sin(phi1)*cos(theta2),y2=r*cos(phi1),z2=r*sin(phi1)*sin(theta2); const x3=r*sin(phi2)*cos(theta1),y3=r*cos(phi2),z3=r*sin(phi2)*sin(theta1); const x4=r*sin(phi2)*cos(theta2),y4=r*cos(phi2),z4=r*sin(phi2)*sin(theta2); p.vertex(x1,y1,z1,u1*metalBowlTexture.width,v1*metalBowlTexture.height);p.vertex(x2,y2,z2,u2*metalBowlTexture.width,v1*metalBowlTexture.height);p.vertex(x3,y3,z3,u1*metalBowlTexture.width,v2*metalBowlTexture.height); p.vertex(x2,y2,z2,u2*metalBowlTexture.width,v1*metalBowlTexture.height);p.vertex(x4,y4,z4,u2*metalBowlTexture.width,v2*metalBowlTexture.height);p.vertex(x3,y3,z3,u1*metalBowlTexture.width,v2*metalBowlTexture.height); } } p.endShape(); p.pop(); break; }
        case 'frustum': { const h=12*scale*0.5,r1=12*scale*0.5,r2=6*scale*0.5,segments=32; p.push(); p.texture(plasticTexture); p.beginShape(p.TRIANGLE_STRIP); for(let i=0;i<=segments;i++){const angle=(i*TWO_PI)/segments,u=i/segments;p.normal(cos(angle),0,sin(angle));p.vertex(r1*cos(angle),-h/2,r1*sin(angle),u,0);p.vertex(r2*cos(angle),h/2,r2*sin(angle),u,1);} p.endShape(); p.beginShape(p.TRIANGLE_FAN); p.vertex(0,h/2,0,0.5,0.5); for(let i=0;i<=segments;i++){const angle=(i*TWO_PI)/segments,u=0.5+0.5*cos(angle),v=0.5+0.5*sin(angle);p.normal(0,1,0);p.vertex(r2*cos(angle),h/2,r2*sin(angle),u,v);} p.endShape(); p.pop(); p.push(); p.noFill(); p.stroke(100); p.strokeWeight(5); p.beginShape(); for(let i=0;i<=180;i++){const angle=radians(i),x=r1*cos(angle),y=-h/2-r1*sin(angle)*0.8;p.vertex(x,y,0);} p.endShape(); p.pop(); break; }
        case 'compound': { const r=5*scale,cH=5*scale,coneH=5*scale; p.push(); p.rotateX(PI); p.specularMaterial(100); p.shininess(60); p.texture(canvasTexture); p.translate(0,coneH/2-80,0); p.cylinder(r,cH,100); p.translate(0,cH/2+coneH/2,0); p.cone(r,coneH,100); p.pop(); break; }
        default: p.fill(100); p.box(50);
    }
}

function drawParameters(p, shapeType, params) {
    p.push();
    p.fill(255, 255, 255, 220); p.stroke(200, 200, 200); p.strokeWeight(1); p.rect(ui.rightPanel.x + 10, ui.rightPanel.y + 10, 180, 150, 8);
    p.fill(30, 30, 30); p.noStroke(); p.textAlign(p.LEFT, p.TOP); p.textSize(14); p.textStyle(p.BOLD); p.text("Dimensions:", ui.rightPanel.x + 20, ui.rightPanel.y + 25);
    p.textStyle(p.NORMAL); p.textSize(12);
    let yOffset = ui.rightPanel.y + 45, xOffset = ui.rightPanel.x + 25;
    const lines = [];
    switch (shapeType) {
        case 'cylinder':
            if (currentCylinderCaseIndex === 0) lines.push(`Radius: ${params.radius} m`, `Height: ${params.height} m`); 
            else if (currentCylinderCaseIndex === 1) lines.push(`Radius: ${params.radius} cm`, `Height: ${params.height} cm`);
            else if (currentCylinderCaseIndex === 2) lines.push(`Pillars: ${params.pillarCount}`, `Height: ${params.height} m`, `Diameter: ${params.diameter} cm`);
            else lines.push(`Diameter: ${params.diameter} m`, `Length: ${params.length} m`);
            break;
        case 'cone': lines.push(`Radius: ${params.radius} cm`, `Height: ${params.height} cm`); break;
        case 'cube': lines.push(`Side: ${params.side} cm`); break;
        case 'sphere': lines.push(`Radius: ${params.radius} cm`); break;
        case 'hemisphere': lines.push(`Radius: ${params.radius} cm`); break;
        case 'frustum': lines.push(`Top Radius: ${params.topRadius} cm`, `Bottom Radius: ${params.bottomRadius} cm`, `Height: ${params.height} cm`); break;
        case 'compound': lines.push(`Radius: ${params.radius} cm`, `Cylinder Height: ${params.cylinderHeight} cm`, `Cone Height: ${params.coneHeight} cm`); break;
    }
    lines.forEach((line, index) => { p.text(line, xOffset, yOffset + (index * 18)); });

    // const changeValuesButton = { x: ui.rightPanel.x + 20, y: ui.rightPanel.y + ui.rightPanel.h - 125, w: 160, h: 35 };
    // ui.changeValuesButton = changeValuesButton;
    // p.fill(23, 162, 184); p.stroke(20, 130, 150); p.strokeWeight(2); p.rect(changeValuesButton.x, changeValuesButton.y, changeValuesButton.w, changeValuesButton.h, 5);
    // p.fill(255); p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textSize(12); p.textStyle(p.BOLD); p.text("Change Values", changeValuesButton.x + changeValuesButton.w / 2, changeValuesButton.y + changeValuesButton.h / 2);

    const regenButton = { x: ui.rightPanel.x + 20, y: ui.rightPanel.y + ui.rightPanel.h - 80, w: 160, h: 35 };
    ui.regenButton = regenButton;
    const regenButtonText = shapeType === 'cylinder' ? "Generate New Case" : "Generate New Problem";
    p.fill(0, 123, 255); p.stroke(0, 100, 200); p.strokeWeight(2); p.rect(regenButton.x, regenButton.y, regenButton.w, regenButton.h, 5);
    p.fill(255); p.noStroke(); p.textAlign(p.CENTER, p.CENTER); p.textSize(12); p.textStyle(p.BOLD); p.text(regenButtonText, regenButton.x + regenButton.w / 2, regenButton.y + regenButton.h / 2);

    p.fill(100, 100, 100); p.textAlign(p.LEFT, p.TOP); p.textSize(10); p.textStyle(p.NORMAL); p.text("Drag to rotate", ui.rightPanel.x + 20, ui.rightPanel.y + ui.rightPanel.h - 35);
    p.pop();
}

function keyPressed() {
    if (selectedAnswer || helpModeActive) return;
    if (key === 'r' || key === 'R') regenerateCurrentValues();
    else if (keyCode === LEFT_ARROW) { if (currentQuestionIndex > 0) { currentQuestionIndex--; selectedAnswer = null; } }
    else if (keyCode === RIGHT_ARROW) { if (currentQuestionIndex < shapeData[currentShapeKey].questions.length - 1) { currentQuestionIndex++; selectedAnswer = null; } }
}