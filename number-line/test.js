// Function to run test cases with animation and update the view dynamically
function runTestCases(testCases, view) {
    console.log("Running Test Cases...");
    
    let testIndex = 0;
    let valueIndex = 0;
    
    function runNextTestCase() {
        if (testIndex >= testCases.length) {
            console.log("All Test Cases Completed.");
            return;
        }
        
        let testCase = testCases[testIndex];
        let model = new NumberLineModel(testCase.range, testCase.snappingRange);
        
        console.log(`Test Case ${testIndex + 1}:`);
        
        function animateNextValue() {
            if (valueIndex >= testCase.values.length) {
                testIndex++;
                valueIndex = 0;
                setTimeout(runNextTestCase, 1000); // Move to the next test case after a delay
                return;
            }
            
            let value = testCase.values[valueIndex];
            let targetX = model.mapValueToPixel(value);
            
            let interval = setInterval(() => {
                if (Math.abs(model.pointX - targetX) < 1) {
                    clearInterval(interval);
                    model.pointX = targetX;
                    let snappedValue = model.snapToNearest();
                    console.log(`  Input: ${value}, Mapped Pixel: ${model.pointX}, Snapped Value: ${snappedValue}`);
                    
                    // Update the view dynamically
                    if (view) {
                        view.update(model.pointX);
                    }
                    
                    valueIndex++;
                    setTimeout(animateNextValue, 1000); // Move to the next value after a delay
                } else {
                    model.pointX += (targetX - model.pointX) * 0.1; // Smooth transition
                    
                    // Update the view dynamically
                    if (view) {
                        view.update(model.pointX);
                    }
                }
            }, 50); // Animation update interval
        }
        
        animateNextValue();
    }
    
    runNextTestCase();
}

// Example JSON test cases
const testCases = [
    {
        "range": 10,
        "snappingRange": 30,
        "values": [-10, -5, 0, 5, 10] // Test with different values in the range
    },
    {
        "range": 20,
        "snappingRange": 40,
        "values": [-20, -10, 0, 10, 20] // Another range test
    }
];

