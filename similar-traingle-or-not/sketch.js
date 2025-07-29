
// Triangle Similarity Interactive Tool - Enhanced Version
let A, B, C;
let mathA, mathB, mathC;
let D, E, F;
let targetF = null;
let draggingF = false;
let offsetF = { x: 0, y: 0 };
let leftOrigin = { x: 150, y: 220 };
let rightOrigin = { x: 550, y: 220 };
let PIXEL_SCALE = 3;
let checkResult = null;
let errorMessage = null;
let targetRatio = 1;
let targetEF = 0;
let targetDF = 0;
let currentDE = 0;
let displayAnswer = false;

const ERROR_TOLERANCE = 0.15;
const MIN_TRIANGLE_SIDE = 5;
const MAX_TRIANGLE_SIDE = 70;



function setup() {
    let canvas = createCanvas(900, 400);
    canvas.parent("mainCanvas");
    console.log(2 + 5);
}


// function generateValidTrianglePair() {
//     // Step 1: Generate random triangle ABC with integer sides

//         // Generate random integer sides for triangle ABC
//         mathA = Math.floor(random(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE + 1));
//         mathB = Math.floor(random(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE + 1));
//         mathC = Math.floor(random(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE + 1));
        
//         // Check if it forms a valid triangle
//         if (!isValidTriangle(mathA, mathB, mathC)) continue;
        
//         // Calculate triangle ABC coordinates
//         if (!calculateTriangleABC(mathA, mathB, mathC)) continue;
        
//         // Step 2: Find a valid DE that creates integer EF and DF
//         const validRatios = [2, 3, 4, 5, 0.5, 0.333, 0.25, 0.2]; // Including fractions
        
//         for (let ratioAttempt = 0; ratioAttempt < 50; ratioAttempt++) {
//             // Try different DE values
//             currentDE = Math.floor(random(MIN_TRIANGLE_SIDE, MAX_TRIANGLE_SIDE + 1));
            
//             // Ensure DEF is different in shape from ABC
//             if (currentDE === mathC) continue;
            
//             // Calculate potential ratio
//             let ratio = currentDE / mathC;
            
//             // Check if this ratio would give integer sides
//             let potentialEF = mathA * ratio;
//             let potentialDF = mathB * ratio;
            
//             // Check if EF and DF would be integers (within small tolerance)
//             if (Math.abs(potentialEF - Math.round(potentialEF)) < 0.001 &&
//                 Math.abs(potentialDF - Math.round(potentialDF)) < 0.001) {
                
//                 targetEF = Math.round(potentialEF);
//                 targetDF = Math.round(potentialDF);
                
//                 // Ensure the target triangle is valid and within bounds
//                 if (isValidTriangle(currentDE, targetEF, targetDF) &&
//                     targetEF >= MIN_TRIANGLE_SIDE && targetEF <= MAX_TRIANGLE_SIDE &&
//                     targetDF >= MIN_TRIANGLE_SIDE && targetDF <= MAX_TRIANGLE_SIDE) {
                    
//                     targetRatio = ratio;
                    
//                     // Generate initial DEF triangle (not similar to start)
//                     if (generateInitialDEF()) {
//                         calculateTargetF();
//                         return true;
//                     }
//                 }
//             }
//         }
    
//     return false;
// }



function draw(){
    background(220);
    line(20, 100, 200, 100);
}