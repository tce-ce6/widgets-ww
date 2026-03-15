lottie.setQuality("high");

const canvas = document.getElementById("grid");
const ctx = canvas.getContext("2d");

const min = -10;
const max = 10;


let A=null;
let stage=0;
let userPoint=null;
let correctPoint = null;

const question=document.getElementById("question");
const hintBox=document.getElementById("hintBox");
const stageIndicator=document.getElementById("stageIndicator");

const showAnswerBtn=document.getElementById("showAnswer");
const newPointBtn=document.getElementById("newPoint");
const hintBtn=document.getElementById("showHint");


function randomPoint(){

let x=0,y=0;

while(x===0) x=Math.floor(Math.random()*21)-10;
while(y===0) y=Math.floor(Math.random()*21)-10;

return {x,y};

}

function toCanvas(x,y){

const margin = 18;
const range = max - min;

const step = (canvas.width - margin*2) / range;

return{
x:(x-min)*step + margin,
y:canvas.height - ((y-min)*step + margin)
};

}

newPointBtn.addEventListener("click", generate);


function drawGrid(){

ctx.clearRect(0,0,canvas.width,canvas.height);

const range = max - min;
const margin = 18;
const step = (canvas.width - margin*2) / range;

const axis = (0 - min) * step + margin;

/* AXIS ARROWHEADS */

drawArrow(canvas.width - margin, axis, 0);
drawArrow(margin, axis, Math.PI);

drawArrow(axis, margin, -Math.PI/2);
drawArrow(axis, canvas.height - margin, Math.PI/2);

/* GRID LINES */

for(let i=min;i<=max;i++){

let pos = (i-min)*step + margin;

ctx.beginPath();

if(i===0){
ctx.strokeStyle="black";
ctx.lineWidth=3;
}else{
ctx.strokeStyle="#d0d0d0";
ctx.lineWidth=1;
}

ctx.moveTo(pos,margin);
ctx.lineTo(pos,canvas.height-margin);
ctx.stroke();

ctx.beginPath();

ctx.moveTo(margin,pos);
ctx.lineTo(canvas.width-margin,pos);
ctx.stroke();

}

/* TICKS + NUMBERS */

ctx.fillStyle="#333";
ctx.font = "bold 14px Arial";
ctx.textAlign="center";

for(let i=min;i<=max;i++){

if(i===0) continue;

let pos = (i-min)*step + margin;

/* X axis ticks */

ctx.beginPath();
ctx.moveTo(pos,axis-5);
ctx.lineTo(pos,axis+5);
ctx.stroke();

ctx.fillText(i,pos,axis+18);

/* Y axis ticks */

ctx.beginPath();
ctx.moveTo(axis-5,pos);
ctx.lineTo(axis+5,pos);
ctx.stroke();

ctx.textAlign="right";
ctx.fillText(-i,axis-8,pos+4);
ctx.textAlign="center";

}

ctx.lineWidth = 4;
ctx.strokeStyle = "#ff9800";

if(stage === 0){ // X-axis
ctx.beginPath();
ctx.moveTo(0,axis);
ctx.lineTo(canvas.width,axis);
ctx.stroke();
}

if(stage === 1){ // Y-axis
ctx.beginPath();
ctx.moveTo(axis,0);
ctx.lineTo(axis,canvas.height);
ctx.stroke();
}

if(stage === 2){ // origin
ctx.fillStyle="#ff9800";
ctx.beginPath();
ctx.arc(axis,axis,6,0,Math.PI*2);
ctx.fill();
}

/* ORIGIN */

ctx.fillStyle="#000";

ctx.beginPath();
ctx.arc(axis,axis,4,0,Math.PI*2);
ctx.fill();

ctx.fillText("0", axis + 12, axis + 18);

/* AXIS LABELS */

ctx.font="14px Arial";
ctx.fillText("x",canvas.width-15,axis-8);
ctx.fillText("x′",15,axis-8);

ctx.fillText("y",axis+10,15);
ctx.fillText("y′",axis+10,canvas.height-10);

ctx.lineCap = "round";
}




function drawPoint(p,color,label){

let c = toCanvas(p.x,p.y);

ctx.fillStyle = color;

ctx.beginPath();
ctx.arc(c.x,c.y,9,0,Math.PI*2);
ctx.fill();

ctx.fillStyle="#222";
ctx.font="14px Arial";

/* dynamic label positioning */

let offsetX = 10;
let offsetY = -10;

/* keep labels inside canvas */

if(c.x > canvas.width - 90){
offsetX = -80;
}

if(c.y < 30){
offsetY = 20;
}

if(c.y > canvas.height - 20){
offsetY = -20;
}

/* axis adjustments */

if(p.y === 0 || Math.abs(p.y) <= 1){
offsetY = -20;
}

if(p.x === 0 || Math.abs(p.x) <= 1){
offsetX = 14;
}

/* smart label positioning */

let textWidth = ctx.measureText(label).width;

let labelX = c.x + 10;
let labelY = c.y - 10;

/* near right edge → move label left */
if(c.x > canvas.width - textWidth - 20){
labelX = c.x - textWidth - 10;
}

/* near top edge → move label below point */
if(c.y < 20){
labelY = c.y + 20;
}

/* near bottom edge → move label above point */
if(c.y > canvas.height - 20){
labelY = c.y - 10;
}

ctx.fillStyle = "rgba(255,255,255,0.8)";
ctx.fillRect(labelX-3, labelY-12, textWidth+6, 14);

ctx.fillStyle = "#222";
ctx.fillText(label, labelX, labelY);

}

function drawDashedLine(p1,p2){

let c1 = toCanvas(p1.x,p1.y);
let c2 = toCanvas(p2.x,p2.y);

ctx.setLineDash([6,6]);
ctx.strokeStyle="#ff9800";
ctx.lineWidth=2;

ctx.beginPath();
ctx.moveTo(c1.x,c1.y);
ctx.lineTo(c2.x,c2.y);
ctx.stroke();

ctx.setLineDash([]);

}

function generate(){

correctPoint = null;

A = randomPoint();

stage = 0;
userPoint = null;

document.querySelector(".rule-card").style.display="none";

document.getElementById("feedback").style.display="none";
document.getElementById("feedbackCorrect").style.display="none";
document.getElementById("feedbackWrong").style.display="none";

newPointBtn.disabled = true;
hintBtn.disabled = false;
showAnswerBtn.disabled = false;

updateQuestion();
draw();

}

function startNewCycle(){
generatePoint();

newPointBtn.disabled = true;   // disable during cycle
stage = 1;                     // X-axis stage
}

function draw(){

drawGrid();

if(!A) return;

drawPoint(A,"blue",`A(${A.x}, ${A.y})`);

if(userPoint){
drawPoint(userPoint,"orange","");
drawDashedLine(A,userPoint);
}

if(correctPoint){
drawPoint(correctPoint,"green",`${reflectionLabel()}(${correctPoint.x}, ${correctPoint.y})`);
}

}




function expected(){

if(stage===0) return {x:A.x,y:-A.y};
if(stage===1) return {x:-A.x,y:A.y};
if(stage===2) return {x:-A.x,y:-A.y};

}

function nextStage(){

stage++;

userPoint = null;

document.getElementById("feedbackCorrect").style.display="none";
document.getElementById("feedbackWrong").style.display="none";

document.getElementById("confetti").innerHTML = "";

if(stage > 2){

document.getElementById("feedback").style.display="block";
document.getElementById("feedbackCorrect").style.display="block";

document.getElementById("correctText").textContent =
"Great! Click 'New Point' to try another reflection.";

newPointBtn.disabled = false;

hintBtn.disabled = true;
showAnswerBtn.disabled = true;   // ✅ disable only here

document.querySelector(".rule-card").style.display="none";

draw();

return;

}

document.getElementById("feedbackCorrect").style.display="none";
document.getElementById("feedbackWrong").style.display="none";

document.getElementById("feedback").style.display="none";
updateQuestion();
draw();

}

canvas.addEventListener("click",(e)=>{

const rect = canvas.getBoundingClientRect();

const scaleX = canvas.width / rect.width;
const scaleY = canvas.height / rect.height;

const x = (e.clientX - rect.left) * scaleX;
const y = (e.clientY - rect.top) * scaleY;

const margin = 18;
const range = max - min;
const step = (canvas.width - margin*2) / range;

const gx = Math.round((x - margin) / step) + min;
const gy = Math.round((canvas.height - y - margin) / step) + min;

userPoint = {x:gx, y:gy};

draw();
check();

});

function reflectionLabel(){

if(stage === 0) return "Mx";
if(stage === 1) return "My";
if(stage === 2) return "Mo";

return "Mo";   // prevents undefined

}

function check(){

let ans = expected();

if(userPoint.x === ans.x && userPoint.y === ans.y){

showAnswerBtn.disabled = false;

document.getElementById("feedback").style.display="block";
document.getElementById("feedbackCorrect").style.display="block";
document.getElementById("feedbackWrong").style.display="none";

document.getElementById("correctText").textContent =
`${reflectionLabel()}(${ans.x}, ${ans.y}) is correct!`;

correctPoint = ans;
draw();

showAnimation("correct");

/* move to next stage */

setTimeout(() => {

nextStage();

},2800);

}else{

document.getElementById("feedback").style.display="block";
document.getElementById("feedbackWrong").style.display="block";
document.getElementById("feedbackCorrect").style.display="none";

document.getElementById("wrongText").textContent =
`That point is not the correct reflection. Try again.`;

showAnimation("incorrect");


showAnswerBtn.disabled = false;

}

}

showAnswerBtn.onclick = function(){

let ans = expected();

userPoint = ans;

draw();

drawPoint(ans,"green",`${reflectionLabel()}(${ans.x}, ${ans.y})`);

document.getElementById("feedback").style.display="block";
document.getElementById("feedbackCorrect").style.display="block";
document.getElementById("feedbackWrong").style.display="none";

document.getElementById("correctText").textContent =
`Correct reflection is ${reflectionLabel()}(${ans.x}, ${ans.y})`;

showAnimation("correct");

/* If this is the last stage */
if(stage === 2){

showAnswerBtn.disabled = true;
hintBtn.disabled = true;

setTimeout(() => {

document.getElementById("correctText").textContent =
"Great! Click 'New Point' to try another reflection.";

},1200);

}

/* move to next stage */

setTimeout(() => {

stage++;

userPoint = null;

document.getElementById("feedback").style.display="none";

updateQuestion();
draw();

},2000);

};

function updateQuestion(){

document.getElementById("p1").style.color = stage===0 ? "#2ecc71" : "#999";
document.getElementById("p2").style.color = stage===1 ? "#2ecc71" : "#999";
document.getElementById("p3").style.color = stage===2 ? "#2ecc71" : "#999";

let ruleText = document.getElementById("ruleText");

if(stage===0){

stageIndicator.textContent="Stage 1: Reflection in X-axis";

question.textContent =
`Tap the grid to mark Mx — the reflection of A(${A.x}, ${A.y}) in the X-axis`;

ruleText.textContent="(x,y) → (x, −y)";

}

if(stage===1){

stageIndicator.textContent="Stage 2: Reflection in Y-axis";

question.textContent =
`Tap the grid to mark My — the reflection of A(${A.x}, ${A.y}) in the Y-axis`;

ruleText.textContent="(x,y) → (−x, y)";

}

if(stage===2){

stageIndicator.textContent="Stage 3: Reflection in Origin";

question.textContent =
`Tap the grid to mark M₀ — the reflection of A(${A.x}, ${A.y}) in the origin`;

ruleText.textContent="(x,y) → (−x, −y)";

}

}

hintBtn.onclick = function(){

const rule = document.querySelector(".rule-card");

rule.style.display = "block";

hintBtn.disabled = true;

}

function showAnimation(type){

let container;
let path;

if(type === "correct"){
container = document.getElementById("correctAnim");
path = "./emoji_happy-star.json";
}

if(type === "incorrect"){
container = document.getElementById("wrongAnim");
path = "./Emoji_Incorrect.json";
}

/* clear previous animation */
container.innerHTML = "";

/* load animation after container is visible */
requestAnimationFrame(() => {

lottie.loadAnimation({
container: container,
renderer: "svg",
loop: false,
autoplay: true,
path: path
});

});

}

function resizeCanvas(){

const rect = canvas.getBoundingClientRect();

canvas.width = rect.width;
canvas.height = rect.height;

draw();

}



window.addEventListener("load", () => {

setTimeout(() => {
    resizeCanvas();
    generate();
}, 50);

});

window.addEventListener("resize", resizeCanvas);

ctx.lineWidth = 3;

function drawArrow(x, y, angle){

const size = 8;

ctx.save();
ctx.translate(x, y);
ctx.rotate(angle);

ctx.beginPath();
ctx.moveTo(0,0);
ctx.lineTo(-size,-size/2);
ctx.lineTo(-size,size/2);
ctx.closePath();

ctx.fillStyle = "black";
ctx.fill();

ctx.restore();

}