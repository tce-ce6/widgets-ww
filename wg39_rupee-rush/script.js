// --- Global Data and Element Selectors ---

// Dummy item data (51 items total)
const ITEMS_DATA = [
    { "name": "Pencil", "price": 12, "path": "pencil.svg" },
    { "name": "Ballpoint Pen", "price": 28, "path": "ballpoint_pen.svg" },
    { "name": "Fountain Pen", "price": 125, "path": "fountain_pen.svg" },
    { "name": "Eraser", "price": 9, "path": "eraser.svg" },
    { "name": "Sharpener", "price": 14, "path": "sharpener.svg" },
    { "name": "Notebook (Single)", "price": 90, "path": "notebook_(single).svg" },
    { "name": "Notebook (Pack of 5)", "price": 450, "path": "notebook_set.svg" },
    { "name": "Geometry Box", "price": 185, "path": "geometry_box.svg" },
    { "name": "Ruler (12 inch)", "price": 19, "path": "ruler.svg" },
    { "name": "Sketch Pen Set (12)", "price": 100, "path": "sketch_pen_set.svg" },
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
    { "name": "Whiteboard", "price": 976, "path": "whiteboard.svg" },
    { "name": "Teddy Bear", "price": 403, "path": "teddy_bear.svg" },
    { "name": "Action Figure", "price": 249, "path": "action_figure.svg" },
    { "name": "Toy Car", "price": 107, "path": "toy_car.svg" },
    { "name": "Doll", "price": 352, "path": "doll.svg" },
    { "name": "Kite", "price": 53, "path": "kite.svg" },
    { "name": "Yo-Yo", "price": 34, "path": "yo_yo.svg" },
    { "name": "Puzzle Set", "price": 207, "path": "puzzle_set.svg" },
    { "name": "Board Game", "price": 489, "path": "board_game.svg" },
    { "name": "Remote Control Car", "price": 975, "path": "remote_control_car.svg" },
    { "name": "Bag of Apples (1 kg)", "price": 250, "path": "bag_of_apples.svg" },
    { "name": "1 kg Rice", "price": 80, "path": "rice.svg" },
    { "name": "Milk Packet", "price": 73, "path": "milk.svg" },
    { "name": "Papaya", "price": 30, "path": "papaya.svg" },
    { "name": "Icecream", "price": 37, "path": "icecream.svg" },
    { "name": "Pair of shoe", "price": 675, "path": "shoe.svg" },
    { "name": "T shirt", "price": 898, "path": "t_shirt.svg" },
    { "name": "Sleepers", "price": 850, "path": "sleeper.svg" },
    { "name": "Hand gloves", "price": 25, "path": "hand_gloves.svg" },
    { "name": "Dumbbells", "price": 649, "path": "dumbbell.svg" },
    { "name": "Birthday Cake", "price": 755, "path": "cake.svg" },
    { "name": "Water bottle", "price": 350, "path": "water_bottle.svg" },
    { "name": "Sipper bottle", "price": 749, "path": "sipper_bottle.svg" },
    { "name": "School bag", "price": 995, "path": "school_bag.svg" },
    { "name": "Scissors", "price": 49, "path": "scissors.svg" },
    { "name": "Bucket", "price": 76, "path": "bucket.svg" },
    { "name": "Skipping rope", "price": 99, "path": "skipping_rope.svg" },
    { "name": "Tiffin bag", "price": 453, "path": "tiffin_bag.svg" },
    { "name": "Coffee mug", "price": 234, "path": "coffee_mug.svg" }
];

const CURRENCY_VALUES = [500, 200, 100, 50, 20, 10, 5, 2, 1];
const NOTE_VALUES = [500, 200, 100, 50, 20, 10];
const COIN_VALUES = [5, 2, 1];
const SVG_BASE_PATH = "Assets/Objects/";

// --- Global State Variables ---
let payment = []; // Array of currency values (e.g., [500, 50, 5])
let isCorrect = false;
let currencyDisplayArea = "";
let MAX_ITEM = 15;

let currentIndex = -1; // Start before the first item so the first call to updateItem starts at index 0

// Get references to the HTML elements
const svgImageElement = document.getElementById('svgImage');
const nextButton = document.getElementById('nextBtn');
const checkButton = document.getElementById('checkBtn');
const incorrectAnswer = document.getElementById('InCorrect_answer');
const correctAnswer = document.getElementById('correct_answer');
const tryAgain = document.getElementById('tryAgainBtn');
const text = document.getElementById('text');

// --- Utility Functions ---

/**
 * Updates the image source and detail displays based on the current item index.
 * @param {number} index - The index of the item in ITEMS_DATA to display.
 */
function updateItem(index) {
    if (index >= 0 && index < ITEMS_DATA.length) {
        payment = [];
        isCorrect = false;
        currencyDisplayArea.innerHTML = " ";
        const item = ITEMS_DATA[index];

        // 1. Construct the full path
        const fullPath = SVG_BASE_PATH + item.path;
        
        // 2. Update the image tag (src and alt)
        svgImageElement.src = fullPath;
        svgImageElement.alt = item.name;

        incorrectAnswer.style.display = 'none';
        correctAnswer.style.display = 'none';
        tryAgain.style.display = 'none';
        text.style.display = 'block';
            
        console.log(`Displaying: ${item.name} (${fullPath})`);
    } else {
        console.error("Index is out of bounds for ITEMS_DATA.");
    }
}

/**
 * Cycles to the next item in the ITEMS_DATA array.
 */
function cycleNextItem() {
    // 1. Increment the index
    currentIndex++;

    // 2. Wrap the index around using the modulo operator (%)
    // If currentIndex is 50, and ITEMS_DATA.length is 50, (50 % 50) = 0
    if (currentIndex >= ITEMS_DATA.length) {
        currentIndex = 0;
        payment = [];
        isCorrect = false;
        currencyDisplayArea.innerHTML = " ";
        incorrectAnswer.style.display = 'none';
        correctAnswer.style.display = 'none';
        tryAgain.style.display = 'none';
        text.style.display = 'block';
    }

    // 3. Call the update function with the new index
    updateItem(currentIndex);
}

// 1. Initial load: Call cycleNextItem once to display the first item
cycleNextItem(); 

// 2. Attach the function to the 'Next Item' button click event
nextButton.addEventListener('click', cycleNextItem);
checkButton.addEventListener('click', checkPayment);

// // A simple function to assign a color based on the note/coin value
// function getColor(value) {
//     if (value >= 500) return '#4A148C'; // Deep Purple (for 500)
//     if (value >= 200) return '#FF9800'; // Orange (for 200)
//     if (value >= 100) return '#00BCD4'; // Cyan (for 100)
//     if (value >= 50) return '#4CAF50';  // Green (for 50)
//     if (value >= 20) return '#FFEB3B'; // Yellow (for 20)
//     if (value >= 10) return '#795548'; // Brown (for 10)
//     if (value >= 5) return '#9E9E9E';  // Grey (for 5)
//     return '#BDBDBD';                  // Light Grey (for others)
// }

/**
 * Creates the HTML string for a currency piece (div/span).
 * @param {number} value - The numerical value of the currency piece (e.g., 500).
 * @returns {string} The HTML string for the currency piece.
 */
function createCurrencyPieceHTML(value) {
    // const isNote = NOTE_VALUES.includes(value);
    // const width = isNote ? 110 : 75;
    // const height = 65;
    // const color = getColor(value);

    // Using TailwindCSS classes (like md:top-0) requires Tailwind to be loaded, 
    // but the inline styles ensure the visual structure works without it.
    return `
        <div class="currency-piece cursor-pointer relative" data-value="${value}" style="
            background-color: #cdffcf;
            width: 142px;
            height: 55px;
            border-radius: 12px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
            border: 2px dotted #000;
        ">
            <span style="color: #000; font-weight: bold; font-size: 36px;">₹${value}</span>
            <span class="remove-btn" 
                data-value="${value}" title="Remove"></span>
        </div>
    `;
}

// --- 2. Event Handler and Logic ---

// Get the parent element containing all your currency images
const imageSelector = document.getElementById('imageSelector'); 
 currencyDisplayArea = document.getElementById('currencyDisplayArea');

/**
 * Extracts the numerical value from the image ID and inserts the new piece.
 * @param {Event} event - The click event object.
 */
function handleImageClick(event) {
    const valueString = event.target.dataset.value;

    if(valueString) {
        const value = parseInt(valueString, 10);
        console.log(value);
    
    // // Check if the click target is one of the currency images (by checking the ID format)
    // if (targetId && (targetId.startsWith('note_') || targetId.startsWith('coin_'))) {
    //     // Extract the numerical value from the ID (e.g., 'note_500' -> '500')
    //     const parts = targetId.split('_');
    //     const valueString = parts[parts.length - 1]; 
        
    //     // Handle the special case for coin_10/coin_20 if needed, otherwise it's just the number
    //     const value = parseInt(valueString, 10);

        if (!isNaN(value)) {
            addCurrency(value);
            if(currencyDisplayArea.children.length >= MAX_ITEM){
                return;
            }
            // Generate the HTML for the new currency piece
             newPieceHTML = createCurrencyPieceHTML(value);
            
            // Insert the new HTML into the display area
            currencyDisplayArea.insertAdjacentHTML('beforeend', newPieceHTML);
            correctAnswer.style.display = 'none';
            incorrectAnswer.style.display = 'none';
            tryAgain.style.display = 'none';
            text.style.display = 'block';
            }
        }
    }

// --- 3. Attach Event Listener to the Container ---

// Attach a single event listener to the parent element for better performance (Event Delegation)
if (imageSelector) {
    imageSelector.addEventListener('click', handleImageClick);
}

// --- Optional: Add functionality to remove pieces (for completeness) ---
currencyDisplayArea.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove-btn')) {
        // Find the parent currency-piece div and remove it
        const currencyPiece = event.target.closest('.currency-piece');
        if (currencyPiece) {
            // 1. Get the data-value attribute as a string
        const valueString = currencyPiece.dataset.value; 

        // 2. Convert the string to an integer
        const valueToRemove = parseInt(valueString, 10);
        removeCurrency(valueToRemove);
        correctAnswer.style.display = 'none';
        incorrectAnswer.style.display = 'none';
        tryAgain.style.display = 'none';
        text.style.display = 'block';
         currencyPiece.remove();
        }
    }
});

/**
 * Calculates the total value of the currency in the payment array.
 */
function getTotalPayment() {
    return payment.reduce((sum, value) => sum + value, 0);
}


/**
 * Adds a currency piece to the payment array.
 */
function addCurrency(value) {
    if (isCorrect) return;

    payment.push(value);
}

/**
 * Removes the FIRST occurrence of a specific currency value from the payment array.
 * @param {number} value - The currency value (e.g., 500, 10) to remove.
 */
function removeCurrency(value) {
    // 1. Find the index of the first occurrence of the value
    const indexToRemove = payment.indexOf(value);

    // 2. Check if the value was found (indexOf returns -1 if not found)
    if (indexToRemove !== -1) {
        // 3. Remove 1 element at the found index
        payment.splice(indexToRemove, 1);
    } else {
        console.warn(`Attempted to remove value ${value}, but it was not found in the payment array.`);
    }
}

/**
 * Handles the 'Check' button action.
 */
function checkPayment() {
    const currentItem = ITEMS_DATA[currentIndex];
    const total = getTotalPayment();
    const price = currentItem.price;
    console.log(total, price, currentItem);
    if (total === 0) {
        let message = "Please add some currency first.";
        console.log(message);
        return;
    }

    if (total === price) {
        correctAnswer.style.display = 'block';
        text.style.display = 'none';
        let message = "✅ Well done! Correct payment.";
        isCorrect = true;
        console.log(message);
    } else if (total > price) {
        incorrectAnswer.style.display = 'block';
        tryAgain.style.display = 'block';
        text.style.display = 'none';
        let message = `❌ Payment is too high! You need ₹${price}. You paid ₹${total}.`;
        isCorrect = false;
        console.log(message);

    } else { // total < price
        incorrectAnswer.style.display = 'block';
        tryAgain.style.display = 'block';
        text.style.display = 'none';
        let message = `❌ Payment is too low! You need ₹${price}. You only paid ₹${total}.`;
        isCorrect = false;
        console.log(message);
    }
}


tryAgain.addEventListener('click', () => {
    payment = [];
    isCorrect = false;
    currencyDisplayArea.innerHTML = "";
    incorrectAnswer.style.display = 'none';
    correctAnswer.style.display = 'none';
    tryAgain.style.display = 'none';
    text.style.display = 'block';
});
