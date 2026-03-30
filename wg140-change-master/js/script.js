// // --- Global Data and Element Selectors ---

// // Dummy item data (51 items total)
const ITEMS_DATA = [
    { "name": "Pencil", "price": 12, "path": "pencil.svg" },
    { "name": "Ballpoint Pen", "price": 28, "path": "ballpoint_pen.svg" },
    { "name": "Fountain Pen", "price": 125, "path": "fountain_pen.svg" },
    { "name": "Eraser", "price": 9, "path": "eraser.svg" },
    { "name": "Sharpener", "price": 14, "path": "sharpener.svg" },
    { "name": "Notebook (Single)", "price": 90, "path": "notebook_single.svg" },
    { "name": "Notebook (Pack of 5)", "price": 450, "path": "notebook_set.svg" },
    { "name": "Geometry Box", "price": 185, "path": "geometry_box.svg" },
    { "name": "Ruler (12 inch)", "price": 19, "path": "ruler.svg" },
    { "name": "Sketch Pen Set (12)", "price": 120, "path": "sketch_pen_set.svg" },
    { "name": "Crayons (Box of 16)", "price": 90, "path": "crayons.svg" },
    { "name": "Highlighter", "price": 32, "path": "highlighter.svg" },
    { "name": "Glue Stick", "price": 25, "path": "glue_stick.svg" },
    { "name": "Sticky Notes", "price": 63, "path": "sticky_notes.svg" },
    { "name": "Coloring Book", "price": 97, "path": "coloring_book.svg" },
    { "name": "Watercolor Set", "price": 198, "path": "water_color_set.svg" },
    { "name": "Marker Set", "price": 223, "path": "marker_set.svg" },
    { "name": "Stapler", "price": 287, "path": "stapler.svg" },
    { "name": "Paper Punch", "price": 256, "path": "paper_punch.svg" },
    { "name": "Whiteboard Marker", "price": 48, "path": "whiteboard_marker.svg" },
    // { "name": "Whiteboard", "price": 976, "path": "whiteboard.svg" },
    { "name": "Teddy Bear", "price": 403, "path": "teddy_bear.svg" },
    { "name": "Action Figure", "price": 249, "path": "action_figure.svg" },
    { "name": "Toy Car", "price": 107, "path": "toy_car.svg" },
    { "name": "Doll", "price": 352, "path": "doll.svg" },
    { "name": "Kite", "price": 53, "path": "kite.svg" },
    { "name": "Yo-Yo", "price": 34, "path": "yo_yo.svg" },
    { "name": "Puzzle Set", "price": 207, "path": "puzzle_set.svg" },
    { "name": "Board Game", "price": 489, "path": "board_game.svg" },
    // { "name": "Remote Control Car", "price": 975, "path": "remote_control_car.svg" },
    { "name": "Bag of Apples (1 kg)", "price": 250, "path": "bag_of_apples.svg" },
    { "name": "1 kg Rice", "price": 80, "path": "rice.svg" },
    { "name": "Milk Packet", "price": 73, "path": "milk.svg" },
    { "name": "Papaya", "price": 30, "path": "papaya.svg" },
    { "name": "Icecream", "price": 37, "path": "icecream.svg" },
    // { "name": "Pair of shoe", "price": 675, "path": "shoes.svg" },
    // { "name": "T shirt", "price": 898, "path": "t_shirt.svg" },
    // { "name": "Sleepers", "price": 850, "path": "sleeper.svg" },
    { "name": "Hand gloves", "price": 25, "path": "hand_gloves.svg" },
    // { "name": "Dumbbells", "price": 649, "path": "dumbbell.svg" },
    // { "name": "Birthday Cake", "price": 755, "path": "cake.svg" },
    { "name": "Water bottle", "price": 350, "path": "water_bottle.svg" },
    // { "name": "Sipper bottle", "price": 749, "path": "sipper_bottle.svg" },
    // { "name": "School bag", "price": 995, "path": "school_bag.svg" },
    { "name": "Scissors", "price": 49, "path": "scissors.svg" },
    { "name": "Bucket", "price": 76, "path": "bucket.svg" },
    { "name": "Skipping rope", "price": 99, "path": "skipping_rope.svg" },
    { "name": "Tiffin bag", "price": 453, "path": "tiffin_bag.svg" },
    { "name": "Coffee mug", "price": 234, "path": "coffee_mug.svg" }
];

const CURRENCY_VALUES = [500, 200, 100, 50, 20, 10, 5, 2, 1];
const NOTE_VALUES = [500, 200, 100, 50];
const COIN_VALUES = [5, 2, 1];
const SVG_BASE_PATH = "assets/items/";

// // --- Global State Variables ---
let payment = []; // Array of currency values (e.g., [500, 50, 5])
let isCorrect = false;
let currencyDisplayArea = "";
let MAX_ITEM = 15;
let itemPrice, currencyNote;

let currentIndex = -1; // Start before the first item so the first call to updateItem starts at index 0
let changeValue = 0;

const startBtn = document.getElementById("startBtn");
const startPage = document.getElementById("startPage");
const gameScreen = document.getElementById("gameScreen");

const itemImg = document.getElementById("itemImg");
const continueBtn = document.getElementById('continueBtn');
const changeScreen = document.getElementById('changeScreen');

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const checkButton = document.getElementById('checkButton');
const thinkAgain = document.getElementById('thinkAgain');
const tryAgainBtn = document.getElementById('tryAgainBtn');

const changePanel = document.getElementById('change-panel');
const popupNoThanks = document.getElementById('popup-no-thank-you');

const fiftyNote = document.getElementById('fiftyNote');
const fiveHundredNote = document.getElementById('fiveHundredNote');
const hundredNote = document.getElementById('hundredNote');
const twoHundredNote = document.getElementById('twoHundredNote');

const itemValue = document.getElementById('itemValue');
let currencyValue = document.getElementById('currencyValue');
const notes = document.querySelectorAll(".note");

const insufficintWarning = document.getElementById('warningImg');
const correctFeedback = document.getElementById('feedback-correct');
const incorrectFeedback = document.getElementById('feedback-incorrect')
const showAnswerBtn = document.getElementById('showAnswerBtn');
const howToPlayBtn = document.getElementById('howToPlayBtn');
const howToPlayMsg = document.getElementById('howToPlayMsg');
const howToPlayCross = document.getElementById('howToPlayCross');
const rectFade = document.getElementById('rect-fade');
const rects = document.querySelectorAll(".currency-rect");

const happyLottie = document.getElementById("happyLottieDiv");
const sadLottie = document.getElementById("sadLottieDiv");

let totalCurrency = 0;

// // --- Constants ---
const ANIMATION_PATH_BASE = 'assets/anim/'; // Adjust this path if necessary
const LOTTIE_CONTAINER_ID = 'lottieWrapper'; // ID of the SVG group/DIV where Lottie renders

const LOTTIE_ANIMATION_MAP = {
    "success": "emoji-happy.json",
    "wrong": "emoji-sad.json"
};

// /**
//  * Loads the Lottie animation for the current word and sets it to the initial state (Frame 0).
//  */
let happyLottieInstance = null;
let sadLottieInstance = null;

function loadLottieAnimations() {

    happyLottieInstance = lottie.loadAnimation({
        container: document.getElementById("lottieWrapperHappy"),
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: ANIMATION_PATH_BASE + LOTTIE_ANIMATION_MAP["success"]
    });

    sadLottieInstance = lottie.loadAnimation({
        container: document.getElementById("lottieWrapperSad"),
        renderer: "svg",
        loop: true,
        autoplay: false,
        path: ANIMATION_PATH_BASE + LOTTIE_ANIMATION_MAP["wrong"]
    });

}

function playHappy() {
    happyLottieInstance.goToAndStop(0, true);
    happyLottieInstance.play();
}

function playSad() {
    sadLottieInstance.goToAndStop(0, true);
    sadLottieInstance.play();
}

function resetState() {
    payment = [];
    isCorrect = false;
    currencyDisplayArea.innerHTML = " ";

    totalCurrency = 0;
    changeValue = 0;
    currencyNote = 0;

    changePanel.style.display = 'none';
    changeScreen.style.display = 'none';
    gameScreen.style.transform = "translateX(555px)";
    howToPlayMsg.style.display = 'none';
    howToPlayCross.style.display = 'none';
    rectFade.style.display = 'none';

    checkButton.style.cursor = 'auto';
    checkButton.style.opacity = 0.3;

    rects.forEach(r => {
        r.setAttribute("stroke", "#3f3f3f");
        r.setAttribute("stroke-width", "1");
        r.style.cursor = 'pointer';
        r.style.pointerEvents = 'auto';
    });
    highlightNote();

    notes.forEach(element => {
        element.style.cursor = 'pointer';
        element.style.pointerEvents = 'auto';
    });

    const totalValElem = document.getElementById("totalValue");
    if (totalValElem) totalValElem.textContent = totalCurrency;

    const moneyWrapper = document.querySelector(".money-wrapper");
    if (moneyWrapper) moneyWrapper.innerHTML = "";

    if (checkButton) checkButton.disabled = false;

    if (correctFeedback) correctFeedback.style.display = 'none';
    if (incorrectFeedback) incorrectFeedback.style.display = 'none';
    if (insufficintWarning) insufficintWarning.style.display = 'none';

    const feedbackShowAnswer = document.getElementById('feedback-show-answer');
    if (feedbackShowAnswer) feedbackShowAnswer.style.display = 'none';

    if (typeof tryAgain !== 'undefined' && tryAgain) tryAgain.style.display = 'none';

    sadLottie.style.display = 'none';
    happyLottie.style.display = 'none';
}

// /**
//  * Updates the image source and detail displays based on the current item index.
//  * @param {number} index - The index of the item in ITEMS_DATA to display.
//  */
function updateItem(index) {
    if (index >= 0 && index < ITEMS_DATA.length) {
        const item = ITEMS_DATA[index];

        // 1. Construct the full path
        const fullPath = SVG_BASE_PATH + item.path;

        // 2. Update the image tag (src and alt)
        itemImg.src = fullPath;
        itemImg.alt = item.name;
        itemValue.innerText = `₹${item.price}`;
        itemPrice = item.price;
        // currencyValue.textContent = `${item.price}`;

        continueBtn.style.opacity = 0.3;
        continueBtn.style.cursor = 'auto';
        notes.forEach(element => {
            element.style.cursor = 'pointer';
        });


    } else {
        console.error("Index is out of bounds for ITEMS_DATA.");
    }
    // hideLottieAnimation();
}

function cycleNextItem() {
    // 1. Increment the index
    currentIndex++;

    // 2. Wrap the index around using the modulo operator (%)
    // If currentIndex is 50, and ITEMS_DATA.length is 50, (50 % 50) = 0
    if (currentIndex >= ITEMS_DATA.length) {
        currentIndex = 0;
    }

    // 3. Call the update function with the new index
    updateItem(currentIndex);
}

// // 1. Initial load: Call cycleNextItem once to display the first item
cycleNextItem();

// // 2. Attach the function to the 'Next Item' button click event
//nextBtn.addEventListener('click', cycleNextItem);
checkButton.addEventListener('click', checkPayment);
tryAgainBtn.addEventListener('click', () => {
    incorrectFeedback.style.display = 'none';
    sadLottie.style.display = 'none';
});



// /**
//  * Handles the 'Check' button action.
//  */
function checkPayment() {
    const currentItem = ITEMS_DATA[currentIndex];
    const total = totalCurrency;
    const price = currentItem.price;
    console.log(total, price, changeValue);

    if (total === changeValue) {
        correctFeedback.style.display = 'block';
        checkButton.disabled = true;
        happyLottie.style.display = 'block';
        playHappy();
    } else {
        incorrectFeedback.style.display = 'block';
        sadLottie.style.display = 'block';
        playSad();
    }
}


function showAnswer() {
    document.getElementById('currencyPaid').textContent = currencyNote;
    document.getElementById('currencyRecieve').textContent = itemPrice;
    let finalValue = currencyNote - itemPrice;
    document.getElementById('changePaid').textContent = finalValue;
    document.getElementById('finalChange').textContent = finalValue
}

showAnswerBtn.addEventListener('click', () => {
    document.getElementById('feedback-show-answer').style.display = 'block';
    showAnswer();
});

document.querySelectorAll(".change").forEach(note => {
    note.addEventListener("click", function (e) {

        const g = e.currentTarget;
        const value = Number(g.dataset.value);

        totalCurrency += value;

        document.getElementById("totalValue").textContent = totalCurrency;

        const moneyWrapper = document.querySelector(".money-wrapper");
        if (moneyWrapper) {
            const li = document.createElement("li");

            const valueSpan = document.createElement("span");
            valueSpan.textContent = value;
            li.appendChild(valueSpan);

            const closeMark = document.createElement("span");
            closeMark.className = "close-mark";

            closeMark.addEventListener("click", function (event) {
                event.stopPropagation();
                li.remove();
                totalCurrency -= value;
                document.getElementById("totalValue").textContent = totalCurrency;

                if (totalCurrency == 0) {
                    checkButton.style.cursor = 'auto';
                    checkButton.style.opacity = 0.3;
                }
            });

            li.appendChild(closeMark);
            moneyWrapper.appendChild(li);
        }
        checkButton.style.cursor = 'pointer';
        checkButton.style.opacity = 1;
    });
});


function checkValue() {
    console.log(currencyNote, itemPrice);
    if (currencyNote < itemPrice) {
        insufficintWarning.style.display = "block";
        setTimeout(() => {
            insufficintWarning.style.display = "none";
        }, 2000);
        continueBtn.style.opacity = 0.3;
        continueBtn.style.cursor = 'auto';
    } else {
        insufficintWarning.style.display = "none";
        continueBtn.style.opacity = 1;
        continueBtn.style.cursor = 'pointer';
    }
}

function highlightNote(selectedValue = null) {
    rects.forEach(r => {
        r.setAttribute("stroke", "#3f3f3f");
        r.setAttribute("stroke-width", "1");
    });

    if (selectedValue === null || typeof selectedValue === "undefined") return;

    const selectedNote = document.querySelector(`.note[data-value="${selectedValue}"]`);
    const selectedRect = selectedNote ? selectedNote.querySelector(".currency-rect") : null;
    if (selectedRect) {
        selectedRect.setAttribute("stroke", "blue");
        selectedRect.setAttribute("stroke-width", "4");
    }
}


document.addEventListener("DOMContentLoaded", () => {

    // // 1. Initial load: Call cycleNextItem once to display the first item
    cycleNextItem();

    document.querySelectorAll('.nextItemBtn').forEach(button => {
        button.addEventListener('click', function () {
            cycleNextItem();
            resetState();
            changeScreen.style.display = 'none';
            gameScreen.style.transform = "translateX(555px)";
        });
    });

    startBtn.addEventListener("click", () => {
        startPage.style.display = "none";
        gameScreen.style.display = "block";
    });

    continueBtn.addEventListener('click', () => {
        changeScreen.style.display = 'block';
        gameScreen.style.transform = "translateX(0px)";
        noBtn.style.opacity = 1;
        noBtn.style.cursor = 'pointer';
        notes.forEach(element => {
            element.style.cursor = 'auto';
            element.style.pointerEvents = 'none';
        });

        rects.forEach(r => {
            r.style.cursor = 'auto';
            r.style.pointerEvents = 'none';
        });

    });

    yesBtn.addEventListener('click', () => {
        changePanel.style.display = 'block';
        noBtn.style.opacity = 0.3;
        noBtn.style.cursor = 'auto';
    });
    noBtn.addEventListener('click', () => {
        popupNoThanks.style.display = 'block';
        noBtn.style.opacity = 0.3;
        noBtn.style.cursor = 'auto';
    });

    thinkAgain.addEventListener('click', () => {
        popupNoThanks.style.display = 'none';
        noBtn.style.opacity = 1;
        noBtn.style.cursor = 'pointer';
    });


    notes.forEach(note => {
        note.addEventListener("click", function () {
            currencyNote = this.dataset.value;
            console.log(currencyNote);
            highlightNote(currencyNote);

            currencyValue.textContent = currencyNote;
            console.log(itemPrice);
            changeValue = currencyNote - itemPrice;
            checkValue();
        });
    });

    howToPlayBtn.addEventListener('click', () => {
        howToPlayMsg.style.display = 'block';
        howToPlayCross.style.display = 'block';
        rectFade.style.display = 'block';
    });

    howToPlayCross.addEventListener('click', () => {
        howToPlayMsg.style.display = 'none';
        howToPlayCross.style.display = 'none';
        rectFade.style.display = 'none';
    });
    highlightNote();
    loadLottieAnimations();
});