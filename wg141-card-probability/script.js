let spadeCards = 10;
let heartCards = 15;

let stats = {
spades:0,
hearts:0,
total:0
};

function manualInput(){

spadeCards = Math.max(1, Math.min(15, parseInt(document.getElementById("spadeInput").value) || 1));
heartCards = Math.max(1, Math.min(15, parseInt(document.getElementById("heartInput").value) || 1));

document.getElementById("spadeInput").value = spadeCards;
document.getElementById("heartInput").value = heartCards;

update();
resetStats();

}

function changeCards(type,delta){

const prob = document.getElementById("probabilities");
if(prob) prob.style.display="none";

if(type==="spade"){
spadeCards = Math.max(1, Math.min(15, spadeCards + delta));
}

if(type==="heart"){
heartCards = Math.max(1, Math.min(15, heartCards + delta));
}

document.getElementById("spadeInput").value = spadeCards;
document.getElementById("heartInput").value = heartCards;

update();
resetStats();

}

function update(){

document.getElementById("spadeCount").innerText=spadeCards;
document.getElementById("heartCount").innerText=heartCards;

const total = spadeCards + heartCards;
document.getElementById("cardSummary").innerHTML =
`${spadeCards} Spades + ${heartCards} Hearts = ${total} Total cards`;


let spProb = 0;
let hProb = 0;

if(total > 0){
spProb = (spadeCards/total)*100;
hProb = (heartCards/total)*100;
}

document.getElementById("spadeProb").innerText=spProb.toFixed(1)+"%";
document.getElementById("heartProb").innerText=hProb.toFixed(1)+"%";

document.getElementById("spadeFrac").innerText=spadeCards+"/"+total;
document.getElementById("heartFrac").innerText=heartCards+"/"+total;

const spadeWord = spadeCards === 1 ? "spade card" : "spade cards";
const heartWord = heartCards === 1 ? "heart card" : "heart cards";

document.getElementById("questionText").innerHTML =
`If there are <b class="spade-text">${spadeCards} ${spadeWord}</b> and <b class="heart-text">${heartCards} ${heartWord}</b> in a box, and one card is drawn at random, what is the probability that the card is a <b class="spade-text">spade</b>?`;

const spExp = document.getElementById("spadeExpected");
const htExp = document.getElementById("heartExpected");

if(spExp) spExp.innerText = spProb.toFixed(1) + "%";
if(htExp) htExp.innerText = hProb.toFixed(1) + "%";

renderCards();
}

function renderCards(){

const box = document.getElementById("cardsBox");

if(!box) return; // stop if element not found

box.innerHTML = "";

for(let i = 0; i < spadeCards; i++){
  const c = document.createElement("div");
  c.className = "card spade";
  c.innerHTML = "♠";
  box.appendChild(c);
}

for(let i = 0; i < heartCards; i++){
  const c = document.createElement("div");
  c.className = "card heart";
  c.innerHTML = "♥";
  box.appendChild(c);
}

}

function drawCards(n){


disableCardControls();   // disable card counters

const total = spadeCards + heartCards;

if(total === 0){
alert("Add cards first.");
return;
}

/* show stacked cards graphic for multiple draws */

if(n > 1){

document.getElementById("drawCard").innerHTML =
`
<div class="multi-draw">
<div class="card c1">♠</div>
<div class="card heart c2">♥</div>
<div class="card c3">♠</div>
<div class="card heart c4">♥</div>
<div class="card c5">♠</div>
</div>
`;

document.getElementById("drawText").innerText =
"Multiple cards drawn!";
document.getElementById("drawText").style.fontWeight="600";

}else{

const r = Math.random();

if(r < spadeCards/total){
stats.spades++;
showCard("♠");
}else{
stats.hearts++;
showCard("♥");
}

stats.total++;

updateStats();

document.querySelector(".stats").style.display = "block";

return;

}

/* perform draws */

for(let i=0;i<n;i++){

const r = Math.random();

if(r < spadeCards/total){
stats.spades++;
}else{
stats.hearts++;
}

stats.total++;

}

updateStats();

document.querySelector(".stats").style.display="block";

}

function showCard(symbol){

const card = document.getElementById("drawCard");

card.innerHTML = symbol;

if(symbol === "♠"){
card.className = "draw-card spade";
document.getElementById("drawText").innerHTML = "You drew a Spade ♠!";
}
else{
card.className = "draw-card heart";
document.getElementById("drawText").innerHTML =
'You drew a Heart <span class="heart-symbol">♥</span>!';
}

}

function updateStats(){

document.getElementById("spadeDrawn").innerText = stats.spades;
document.getElementById("heartDrawn").innerText = stats.hearts;
document.getElementById("totalDraws").innerText = stats.total;

if(stats.total === 0){
document.getElementById("spadeActual").innerText = "0%";
document.getElementById("heartActual").innerText = "0%";
return;
}

const sp = (stats.spades / stats.total) * 100;
const hp = (stats.hearts / stats.total) * 100;

document.getElementById("spadeActual").innerText = sp.toFixed(1) + "%";
document.getElementById("heartActual").innerText = hp.toFixed(1) + "%";

/* check if results match expected */

const expectedSp = spadeCards/(spadeCards+heartCards)*100;

if(Math.abs(sp - expectedSp) < 5 && stats.total >= 10){

document.getElementById("resultPopup").style.display="block";

}
}

document.getElementById("answerInput").addEventListener("input", function(){

this.classList.remove("correct","wrong");

const empty = this.value.trim() === "";

document.getElementById("showAnswerBtn").disabled = empty;
document.getElementById("submitBtn").disabled = empty;

});

function resetStats(){

stats={spades:0,hearts:0,total:0};

updateStats();

document.getElementById("resultPopup").style.display="none";

}

function showAnswer(){

const total = spadeCards + heartCards;
if(total === 0) return;

const correctAnswer = ((spadeCards / total) * 100).toFixed(1);

const input = document.getElementById("answerInput");

/* remove old styles */

input.classList.remove("correct","wrong");

/* Only fill answer if textbox is empty */

if(input.value.trim() === ""){
input.value = correctAnswer;
}

/* show theoretical probabilities */

document.getElementById("probabilities").style.display = "flex";

/* show popup */

document.getElementById("probabilityPopup").classList.add("active");

}

function submitAnswer(){

const total = spadeCards + heartCards;
if(total === 0) return;

const correctAnswer = Math.round((spadeCards / total) * 100);
const input = document.getElementById("answerInput");

const userAnswer = Number(input.value);

/* remove previous styles */

input.classList.remove("correct","wrong");

if(userAnswer === correctAnswer){

input.classList.add("correct");

}else{

input.classList.add("wrong");

}

}

document.getElementById("probabilityPopup").onclick=function(){

this.classList.remove("active");

document.getElementById("probabilities").style.display="none";

}

function resetExperiment(){

enableCardControls();

document.getElementById("submitBtn").disabled = true;
document.getElementById("showAnswerBtn").disabled = true;

/* restore default card counts */

spadeCards = 10;
heartCards = 15;

/* update input boxes */

document.getElementById("spadeInput").value = spadeCards;
document.getElementById("heartInput").value = heartCards;

/* reset experiment statistics */

stats = {spades:0, hearts:0, total:0};

/* update statistics UI */

updateStats();

/* hide statistics panel */

document.querySelector(".stats").style.display = "none";

/* clear drawn card */

const card = document.getElementById("drawCard");
card.innerHTML = "";
card.className = "draw-card";

/* reset message */

document.getElementById("drawText").innerText = "Draw a card to begin";

/* hide popup */

document.getElementById("resultPopup").style.display = "none";

/* hide probability popup */

document.getElementById("probabilityPopup").classList.remove("active");
document.getElementById("probabilities").style.display = "none";

/* reset answer box */

const answerBox = document.getElementById("answerInput");
answerBox.value = "";
answerBox.classList.remove("correct","wrong");

/* disable Show Answer button */

document.getElementById("showAnswerBtn").disabled = true;

/* IMPORTANT: redraw cards and probabilities */

document.getElementById("answerFeedback").innerText = "";
document.getElementById("answerFeedback").innerHTML = "";

update();

}

document.querySelector(".result-popup").style.display = "none";

function initializeWidget(){

/* sync inputs */

document.getElementById("spadeInput").value = spadeCards;
document.getElementById("heartInput").value = heartCards;

/* reset answer area */

document.getElementById("answerInput").value = "";
document.getElementById("answerInput").placeholder = "---";
document.getElementById("showAnswerBtn").disabled = true;

/* reset draw area */

document.getElementById("drawText").innerText = "Draw a card to begin";
document.getElementById("drawCard").innerHTML = "";

/* hide popup */

document.getElementById("probabilityPopup").classList.remove("active");

}

function submitAnswer(){

const total = spadeCards + heartCards;
if(total === 0) return;

const correctAnswer = (spadeCards / total) * 100;

const input = document.getElementById("answerInput");
const feedback = document.getElementById("answerFeedback");

const userAnswer = Number(input.value);

/* reset styles */

input.classList.remove("correct","wrong");

const tolerance = 0.2;   // allow small rounding difference

if(Math.abs(userAnswer - correctAnswer) <= tolerance){

input.classList.add("correct");

feedback.innerHTML = "✓ Correct!";
feedback.style.color = "#1b7a2c";

}else{

input.classList.add("wrong");

feedback.innerHTML = "✗ Incorrect. Try again.";
feedback.style.color = "#d93025";

}

}

function disableCardControls(){

document.querySelectorAll(".counter-btn").forEach(btn=>{
btn.disabled = true;
btn.style.opacity = "0.5";
btn.style.cursor = "not-allowed";
});

document.getElementById("spadeInput").disabled = true;
document.getElementById("heartInput").disabled = true;

}

function enableCardControls(){

document.querySelectorAll(".counter-btn").forEach(btn=>{
btn.disabled = false;
btn.style.opacity = "1";
btn.style.cursor = "pointer";
});

document.getElementById("spadeInput").disabled = false;
document.getElementById("heartInput").disabled = false;

}

document.addEventListener("DOMContentLoaded", function(){

initializeWidget();
update();       // calculates values
renderCards();  // forces cards to render

});

