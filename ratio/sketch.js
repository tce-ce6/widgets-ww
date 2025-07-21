let apples = 0, oranges = 0;
let applePositions = [], orangePositions = [];
let showSolution = false;
let userCorrect = 0;
let lastCorrect = false;

function setup() {
    let canvas = createCanvas(600, 250);
    canvas.parent("mainCanvas");
    generateProblem();
    document.getElementById("newProblemButton").onclick = () => {
        showSolution = false;
        // document.getElementById("feedback").textContent = "";
        document.getElementById("solutionArea").innerHTML = "";
        // document.getElementById("ratioInput").value = "";
        generateProblem();
        redraw();
    };
    document.getElementById("showSolutionButton").onclick = () => {
        showSolution = true;
        checkAnswer();
        redraw();
    };
    noLoop();
}

function generateProblem() {
    apples = Math.floor(Math.random() * 5) + 8;   // 7-11 apples
    oranges = Math.floor(Math.random() * 5) + 8;  // 7-11 oranges
    applePositions = [];
    orangePositions = [];
    let allPositions = [];
    let cols = 6, rows = 4;
    for (let i = 0; i < cols * rows; i++) allPositions.push(i);
    allPositions = shuffle(allPositions);

    for (let i = 0; i < apples; i++) {
        let idx = allPositions.pop();
        let x = 80 + 70 * (idx % cols);
        let y = 60 + 40 * Math.floor(idx / cols);
        applePositions.push({x, y, n: i+1});
    }
    for (let i = 0; i < oranges; i++) {
        let idx = allPositions.pop();
        let x = 80 + 70 * (idx % cols);
        let y = 60 + 40 * Math.floor(idx / cols);
        orangePositions.push({x, y, n: i+1});
    }
}

function draw() {
    background(255);
    // Draw box
    stroke(0);
    strokeWeight(3);
    noFill();
    rect(40, 30, 520, 170, 0, 0, 0, 0);

    // Draw oranges
    for (let o of orangePositions) drawOrange(o.x, o.y, o.n);
    // Draw apples
    for (let a of applePositions) drawApple(a.x, a.y, a.n);
}

function drawApple(x, y, n) {
    // Apple body
    fill(120, 200, 80);
    stroke(60, 120, 40);
    strokeWeight(2);
    ellipse(x, y, 32, 36);
    // Stem
    stroke(100, 60, 20);
    strokeWeight(2);
    line(x, y-18, x, y-28);
    // Leaf
    noStroke();
    fill(40, 160, 60);
    ellipse(x+7, y-22, 10, 5);
    // Number
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(n, x, y);
}

function drawOrange(x, y, n) {
    // Orange body
    fill(255, 140, 0);
    stroke(200, 100, 0);
    strokeWeight(2);
    ellipse(x, y, 32, 32);
     // Stem
     stroke(100, 60, 20);
     strokeWeight(2);
     line(x, y-18, x, y-28);
     // Leaf
     noStroke();
     fill(40, 160, 60);
     ellipse(x+7, y-22, 10, 5);
    // Number
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(18);
    text(n, x, y);
}

function checkAnswer() {
    // let input = document.getElementById("ratioInput").value;
    // let feedback = document.getElementById("feedback");
    // let solutionArea = document.getElementById("solutionArea");
    // let correctRatio = oranges / apples;
    let reduced = reduceFraction(oranges, apples);
    // let userRatio = Number(input);

    // if (userRatio === reduced.num / reduced.den) {
    //     feedback.innerHTML = "<span style='color:green'>✔ Correct!</span>";
    //     lastCorrect = true;
    //     userCorrect++;
    // } else {
    //     feedback.innerHTML = "<span style='color:#c00'>✗ Maybe next time</span>";
    //     lastCorrect = false;
    // }

    // Show solution
    if (showSolution) {
        solutionArea.innerHTML = `
            <div style='font-weight:bold; color:#176d4b;'>Possible Solution</div>
            Number of apples = <span class='green'>${apples}</span>. Number of oranges = <span class='orange'>${oranges}</span>.<br>
            <span class='math'>
                Ratio of oranges to apples =
                <span class='frac'>
                    <span class='num orange'>Number of oranges /</span>
                    <span class='den green'>Number of apples</span>
                </span>
                =
                <span class='frac'>
                    <span class='num orange'>${oranges} /</span>
                    <span class='den green'>${apples}</span>
                </span>
                = ${reduced.num === reduced.den ? 1 : `<span class='frac'><span class='num orange'>${reduced.num} / </span><span class='den green'>${reduced.den}</span></span>`}
                = <span class='green'>${(reduced.num / reduced.den).toFixed(2).replace(/\\.00$/, '')}</span>.
            </span>
            <br><br>
        `;
    }
}

function reduceFraction(n, d) {
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    let g = gcd(n, d);
    return { num: n / g, den: d / g };
}