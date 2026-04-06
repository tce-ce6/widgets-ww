let exploredLocations = {};

const questionFlow = {

royal:{
question:"assets/btd-activity-question-01.svg",
feedback:{
pierre:"assets/btd-activity-question-01-feedback-1.svg",
henri:"assets/btd-activity-question-01-feedback-2.svg",
maurice:"assets/btd-activity-question-01-feedback-3.svg"
}
},

law:{
question:"assets/btd-activity-question-02.svg",
feedback:{
pierre:"assets/btd-activity-question-02-feedback-1.svg",
henri:"assets/btd-activity-question-02-feedback-2.svg",
maurice:"assets/btd-activity-question-02-feedback-3.svg"
}
},

education:{
question:"assets/btd-activity-question-03.svg",
feedback:{
pierre:"assets/btd-activity-question-03-feedback-1.svg",
henri:"assets/btd-activity-question-03-feedback-2.svg",
maurice:"assets/btd-activity-question-03-feedback-3.svg"
}
},

council:{
question:"assets/btd-activity-question-04.svg",
feedback:{
pierre:"assets/btd-activity-question-04-feedback-1.svg",
henri:"assets/btd-activity-question-04-feedback-2.svg",
maurice:"assets/btd-activity-question-04-feedback-3.svg"
}
},

gathering:{
question:"assets/btd-activity-question-05.svg",
feedback:{
pierre:"assets/btd-activity-question-05-feedback-1.svg",
henri:"assets/btd-activity-question-05-feedback-2.svg",
maurice:"assets/btd-activity-question-05-feedback-3.svg"
}
},

church:{
question:"assets/btd-activity-question-06.svg",
feedback:{
pierre:"assets/btd-activity-question-06-feedback-1.svg",
henri:"assets/btd-activity-question-06-feedback-2.svg",
maurice:"assets/btd-activity-question-06-feedback-3.svg"
}
},

press:{
question:"assets/btd-activity-question-07.svg",
feedback:{
pierre:"assets/btd-activity-question-07-feedback-1.svg",
henri:"assets/btd-activity-question-07-feedback-2.svg",
maurice:"assets/btd-activity-question-07-feedback-3.svg"
}
},

market:{
question:"assets/btd-activity-question-08.svg",
feedback:{
pierre:"assets/btd-activity-question-08-feedback-1.svg",
henri:"assets/btd-activity-question-08-feedback-2.svg",
maurice:"assets/btd-activity-question-08-feedback-3.svg"
}

}

};

const locationData = {

royal:{
title:"Royal Court",
subtitle:"Political Power",
icon:"assets/royal.png",
question:"Who can advise the King?"
},

law:{
title:"Court of Law",
subtitle:"Legal Rights",
icon:"assets/law.png",
question:"Who can influence legal decisions?"
},

education:{
title:"Education Hall",
subtitle:"Access To Learning",
icon:"assets/education.png",
question:"Who can study here?"
},

council:{
title:"Village Council",
subtitle:"Local Decision-making",
icon:"assets/council.png",
question:"Who can take part in local decisions?"
},

gathering:{
title:"Public Gathering",
subtitle:"Social Dignity",
icon:"assets/gathering.png",
question:"Who can speak in public?"
},

church:{
title:"Church Hall",
subtitle:"Moral Authority",
icon:"assets/church.png",
question:"Who can guide religious life?"
},

press:{
title:"Publishing House",
subtitle:"Freedom Of Ideas",
icon:"assets/press.png",
question:"Who can publish ideas?"
},

market:{
title:"Marketplace",
subtitle:"Fiscal Inequality",
icon:"assets/market.png",
question:"Who benefits from trade?"
}

};

const doorLogic = {

    royal: {
        pierre: "closed",
        henri: "open",
        maurice: "half"
    },

    law: {
        pierre: "closed",
        henri: "open",
        maurice: "half"
    },

    education: {
        pierre: "closed",
        henri: "open",
        maurice: "open"
    },

    council: {
        pierre: "closed",
        henri: "open",
        maurice: "half"
    },

    gathering: {
        pierre: "closed",
        henri: "open",
        maurice: "half"
    },

    church: {
        pierre: "closed",
        henri: "half",
        maurice: "open"
    },

    press: {
        pierre: "closed",
        henri: "closed",
        maurice: "half"
    },

    market: {
        pierre: "closed",
        henri: "open",
        maurice: "open"
    }

};

let visited = {};

let revealedCharacters = {};


/* OPEN A LOCATION */
let currentLocation = null;

function openLocation(location){

currentLocation = location;

revealedCharacters = {};

    // 🔥 ADD THIS LINE
    resetExploreScreen();

const question = document.getElementById("questionSVG");

/* load the correct question */
question.src = questionFlow[location].question;

/* once image loads, show screen */
question.onload = function(){
    showScreen("explore");

    requestAnimationFrame(()=>{
        initDoor();
    });
};

document.getElementById("feedback-pierre").innerHTML="";
document.getElementById("feedback-henri").innerHTML="";
document.getElementById("feedback-maurice").innerHTML="";
revealedCharacters = {};

}

function updateLocationUI(){

    const allLocations = [
        "royal","law","education","council",
        "gathering","church","press","market"
    ];

    allLocations.forEach(loc => {

        const hotspot = document.querySelector(`.location-hit.${loc}`);

        if(exploredLocations[loc]){
            hotspot.classList.add("explored");
        }
    });

    // show summary
    if(allLocations.every(loc => exploredLocations[loc])){
        document.getElementById("summaryBtn").classList.remove("hidden");
    }
}

/* BACK TO MAP */
function backToMap(){

    resetExploreScreen();   // 🔥 ADD THIS (critical)

    updateLocationUI();

    showScreen("locations");
}

const questionMap = {
royal: "01",
law: "02",
education: "03",
council: "04",
gathering: "05",
church: "06",
press: "07",
market: "08"
};

/* REVEAL CHARACTER */

function reveal(character){

    if(revealedCharacters[character]) return;

    revealedCharacters[character] = true;

    const el = document.querySelector(`.${character}-strip`);
    if(!el) return;

    // ✅ get door state dynamically
    const state = doorLogic[currentLocation][character];

    // ✅ animate door
    setDoorState(state);

    // ✅ apply character effect
    applyCharacterState(character, state, el);

    // ✅ feedback (same as your existing)
    const q = questionMap[currentLocation];

    let index = 1;
    if(character === "henri") index = 2;
    if(character === "maurice") index = 3;

    const img = document.createElement("img");
    img.className = "feedback-card";
    img.src = `assets/btd-activity-question-${q}-feedback-${index}.svg`;

    const slot = document.getElementById(`feedback-${character}`);
    slot.innerHTML = "";
    slot.appendChild(img);

    // ✅ completion check
    if(Object.keys(revealedCharacters).length === 3){

        exploredLocations[currentLocation] = true;

        const box = document.getElementById("insightBox");
        const text = document.getElementById("insightText");

        if(box && text){
            text.innerHTML = getInsightText(currentLocation);

            box.classList.remove("hidden");

            setTimeout(()=>{
                box.classList.add("show");
            }, 300);
        }
    }
}

/* RESET WIDGET */
function startOver(){
    location.reload();
}

/* VOICE FILES */
const voices = {
    pierre: new Audio("audio/pierre.mp3"),
    maurice: new Audio("audio/maurice.mp3"),
    henri: new Audio("audio/henri.mp3")
};

/* PLAY VOICE */
function playVoice(character){

    // stop all audio
    Object.values(voices).forEach(audio=>{
        audio.pause();
        audio.currentTime = 0;
    });

    // remove all highlights
    document.querySelectorAll(".speaker-pierre, .speaker-maurice, .speaker-henri")
        .forEach(btn=>btn.classList.remove("speaker-active"));

    const selected = voices[character];
    const btn = document.querySelector(`.speaker-${character}`);

    selected.play();
    btn.classList.add("speaker-active");

    // remove glow when audio ends
    selected.onended = ()=>{
        btn.classList.remove("speaker-active");
    };
}

function showScreen(id){

const screens = ["intro","locations","explore","summary"];

screens.forEach(screen=>{
document.getElementById(screen).classList.add("hidden");
});

document.getElementById(id).classList.remove("hidden");

}

showScreen("intro");



function showFeedback(){

const data = questionFlow[currentLocation];

document.getElementById("questionSVG").src = data.feedback;

}

function startOver(){
    showScreen('intro');   // go back to screen 1
}


function resetExploreScreen(){

    // ✅ reset revealed tracking
    revealedCharacters = {};

    // ✅ reset characters
    document.querySelectorAll(".strip-char").forEach(el=>{
        el.classList.remove("char-half", "char-full", "char-dim", "char-hidden");
        el.style.opacity = "1";   // 🔥 force reset
    });

    // ✅ reset Henri inside-door
    const henriInside = document.querySelector(".henri-inside-door");
    if(henriInside){
        henriInside.style.opacity = "0";
        henriInside.style.transform = "translateY(-50%) scale(0.9)";
    }

    // ✅ remove fades
    const strip = document.querySelector(".strip-actors");
    if(strip){
        strip.classList.remove("maurice-fade", "pierre-fade");
    }

    // ✅ reset door
    if(doorAnim){
        doorAnim.goToAndStop(0, true);
    }

    // ✅ clear feedback cards
    ["pierre","henri","maurice"].forEach(c=>{
        const slot = document.getElementById(`feedback-${c}`);
        if(slot) slot.innerHTML = "";
    });

    // ✅ hide insight
    const box = document.getElementById("insightBox");
    if(box){
        box.classList.remove("show");
        box.classList.add("hidden");
    }
}

function goToLocations(){

    // 🔇 stop all audio
    Object.values(voices).forEach(audio=>{
        audio.pause();
        audio.currentTime = 0;
    });

    // remove all highlights
    document.querySelectorAll(".speaker-active").forEach(el=>{
        el.classList.remove("speaker-active");
    });

    showScreen("locations");
}

let doorAnim = null;

function initDoor(){

    

    const container = document.getElementById("doorLottie");

    if(!container) return;

    // clear previous instance (important when reopening)
    if(doorAnim){
        doorAnim.destroy();
    }

    doorAnim = lottie.loadAnimation({
        container: container,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "./assets/door.json"
    });

    doorAnim.addEventListener("DOMLoaded", () => {
        console.log("Initializing door...");
        doorAnim.goToAndStop(0, true); // show closed door
        
    });
}

function setDoorState(state){

    if(!doorAnim) return;

    const icon = document.getElementById("doorClosedIcon");

    if(state === "closed"){
        doorAnim.goToAndStop(0, true);
        if(icon) icon.style.opacity = "1";   // ✅ SHOW
    }

    if(state === "half"){
        doorAnim.playSegments([0, 50], true);
        if(icon) icon.style.opacity = "0";   // ❌ HIDE
    }

    if(state === "open"){
        doorAnim.playSegments([0, 100], true);
        if(icon) icon.style.opacity = "0";   // ❌ HIDE
    }
}

function playDoorOpen(){
    doorAnim.playSegments([0, 100], true);
}

function getInsightText(location){

    const insights = {

        royal: "Political power was a birthright, not earned through talent or service. The King consulted whom he chose, and it was never Pierre.",

        law: "If different people follow different rules in the same court, can that system ever be called fair? Who do you think decided what the rules were?",

        education: "If access to learning depended on your birth and not merit, what does that tell you about how power stayed in the same families for generations?",

        council: "Think about the village you live in. If the rules about your land, water, and market were set by someone who did not live there — would you accept it? ",

        gathering: "When you walk into a room today, people treat you the same regardless of your family name. Was that always the case? What does it feel like to be invisible in your own city?",

        church: "The church touched every part of the daily life - your birth, marriage, weekly worship, and even death. If it also collected your money, how much power is that for one institution?",

        press: "If someone cannot read, can a printed idea ever reach them? Yet by 1789, revolutionary ideas were spreading faster through coffee houses, street readings, and whispered conversations than any censor could track.",

        market: "In the noise of the marketplace, the truth becomes clear. Pierre counts his last coins for a piece of bread, yet it is his empty pocket that the kingdom reaches into again. The wealthy sleep behind stone walls, but it is the hungry man who carries the weight of an entire economy."

    };

    return insights[location] || "";
}

function applyCharacterState(character, state, el){

    if(state === "closed"){
        el.style.opacity = "1";
        el.classList.add("char-full");
    }

    if(state === "half"){
        el.style.opacity = "0.5";
        el.classList.add("char-half");
    }

    if(state === "open"){
        el.style.opacity = "0.1";
        el.classList.add("char-dim");
    }
}