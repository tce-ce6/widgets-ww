// --- Global Variables ---
let game;

// Asset placeholders - will be replaced with actual image loading in a full implementation
let noteImages = {};
let coinImages = {};
let itemImages = {};
let checkButton, nextButton;

// Currency values available (Indian Rupees)
const CURRENCY_VALUES = [500, 200, 100, 50, 20, 10, 5, 2, 1];
const NOTE_VALUES = [500, 200, 100, 50, 20, 10]; // Blue, Green, Orange, etc.
const COIN_VALUES = [5, 2, 1]; // Yellow, etc.

// Dummy item data (50 items total)
const ITEMS_DATA = [
        {
          "name": "Pencil",
          "price": 12
        },
        {
          "name": "Ballpoint Pen",
          "price": 28
        },
        {
          "name": "Fountain Pen",
          "price": 125
        },
        {
          "name": "Eraser",
          "price": 9
        },
        {
          "name": "Sharpener",
          "price": 14
        },
        {
          "name": "Notebook (Single)",
          "price": 90
        },
        {
          "name": "Notebook (Pack of 5)",
          "price": 450
        },
        {
          "name": "Geometry Box",
          "price": 185
        },
        {
          "name": "Ruler (12 inch)",
          "price": 19
        },
        {
          "name": "Sketch Pen Set (12)",
          "price": 100
        },
        {
          "name": "Crayons (Box of 16)",
          "price": 90
        },
        {
          "name": "Highlighter",
          "price": 32
        },
        {
          "name": "Glue Stick",
          "price": 25
        },
        {
          "name": "Sticky Notes",
          "price": 63
        },
        {
          "name": "Drawing Sheet Pack",
          "price": 97
        },
        {
          "name": "Watercolor Set",
          "price": 198
        },
        {
          "name": "Marker Set",
          "price": 223
        },
        {
          "name": "Stapler",
          "price": 287
        },
        {
          "name": "Paper Punch",
          "price": 256
        },
        {
          "name": "Whiteboard Marker",
          "price": 48
        },
        {
          "name": "Whiteboard",
          "price": 976
        },
        {
          "name": "Teddy Bear",
          "price": 403
        },
        {
          "name": "Action Figure",
          "price": 249
        },
        {
          "name": "Toy Car",
          "price": 107
        },
        {
          "name": "Doll",
          "price": 352
        },
        {
          "name": "Kite",
          "price": 53
        },
        {
          "name": "Yo-Yo",
          "price": 34
        },
        {
          "name": "Puzzle Set",
          "price": 207
        },
        {
          "name": "Board Game",
          "price": 489
        },
        {
          "name": "Remote Control Car",
          "price": 975
        },
        {
          "name": "Bag of Apples (1 kg)",
          "price": 250
        },
        {
          "name": "1 kg Rice",
          "price": 80
        },
        {
          "name": "Milk Packet",
          "price": 73
        },
        {
          "name": "Papaya",
          "price": 30
        },
        {
          "name": "Icecream",
          "price": 37
        },
        {
          "name": "Pair of shoe",
          "price": 675
        },
        {
          "name": "T shirt",
          "price": 898
        },
        {
          "name": "Sleepers",
          "price": 850
        },
        {
          "name": "Hand gloves",
          "price": 25
        },
        {
          "name": "Dumbbells",
          "price": 649
        },
        {
          "name": "Birthday Cake",
          "price": 755
        },
        {
          "name": "Water bottle",
          "price": 350
        },
        {
          "name": "Sipper bottle",
          "price": 749
        },
        {
          "name": "School bag",
          "price": 995
        },
        {
          "name": "Scissors",
          "price": 49
        },
        {
          "name": "Bucket",
          "price": 76
        },
        {
          "name": "Skipping rope",
          "price": 99
        },
        {
          "name": "Tiffin bag",
          "price": 453
        },
        {
          "name": "Coffee mug",
          "price": 234
        },
        {
          "name": "Extra Item",
          "price": 1
        }
];

//DOM for buttons

checkButton = document.getElementById("check-btn");
nextButton = document.getElementById("next-btn");

checkButton.addEventListener('click', () => {
    game.checkPayment();
});

nextButton.addEventListener('click', () => {
        game.nextItem();
})
// Duplicate to reach 50 items for demonstration purposes
while (ITEMS_DATA.length < 50) {
    ITEMS_DATA.push({
        name: ITEMS_DATA[ITEMS_DATA.length % 10].name + ` (${ITEMS_DATA.length + 1})`,
        price: ITEMS_DATA[ITEMS_DATA.length % 10].price + (ITEMS_DATA.length % 10),
        dummyText: true
    });
}


// --- Classes ---

/**
 * Represents a piece of currency (note or coin) in the payment area.
 */
class CurrencyPiece {
    constructor(value, x, y) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.width = (value >= 10) ? 75 : 50; // Notes wider than coins
        this.height = 40;
        this.isNote = NOTE_VALUES.includes(value);

        // Define a color for visual representation (can be replaced by images)
        this.color = this.getColor(value);
    }

    getColor(value) {
        if (value === 500) return '#FF5733'; // Deep Orange
        if (value === 200) return '#FFC300'; // Gold
        if (value === 100) return '#2ECC71'; // Emerald Green
        if (value === 50) return '#FF8C00';  // Dark Orange
        if (value === 20) return '#3498DB';  // Bright Blue
        if (value === 10) return '#34495E';  // Dark Grayish Blue
        if (value === 5) return '#F39C12';   // Yellow-Orange (Coin)
        if (value === 2) return '#F1C40F';   // Yellow (Coin)
        if (value === 1) return '#E67E22';   // Orange (Coin)
        return '#CCCCCC';
    }

    draw() {
        // Main rectangle/circle for currency
        fill(this.color);
        noStroke();
        rect(this.x, this.y, this.width, this.height, 8);

        // Text display
        fill(255); // White text on color background
        textAlign(CENTER, CENTER);
        textSize(18);
        text(`₹${this.value}`, this.x + this.width / 2, this.y + this.height / 2);

        // 'x' removal button
        const removeX = this.x + this.width - 15;
        const removeY = this.y + 10;
        fill(255, 50); // Semi-transparent white
        ellipse(removeX, removeY, 20, 20);
        fill(255);
        textSize(16);
        text('×', removeX, removeY);
    }

    /**
     * Checks if the mouse is over the remove 'x' button.
     */
    isRemoveClicked(mx, my) {
        const removeX = this.x + this.width - 15;
        const removeY = this.y + 10;
        return dist(mx, my, removeX, removeY) < 10;
    }
}

/**
 * Manages the state and logic for the entire game.
 */
class Game {
    constructor(items) {
        this.items = items;
        this.currentItemIndex = 0;
        this.currentItem = this.items[this.currentItemIndex];
        this.payment = []; // Array of CurrencyPiece objects
        this.message = ""; // Feedback message
        this.isCorrect = false;

        // Payment area dimensions
        this.paymentAreaX = 100;
        this.paymentAreaY = 420;
        this.paymentAreaW = 800;
        this.paymentAreaH = 80;

        // "₹ Paid!" animation state
        this.animationActive = false;
        this.animationX = this.paymentAreaX + this.paymentAreaW / 2;
        this.animationY = this.paymentAreaY + this.paymentAreaH / 2;
        this.animationAlpha = 255;
    }

    /**
     * Calculates the total value of the currency in the payment area.
     */
    getTotalPayment() {
        return this.payment.reduce((sum, piece) => sum + piece.value, 0);
    }

    /**
     * Re-calculates the positions for all currency pieces in the payment area.
     */
    repositionPayment() {
        let currentX = this.paymentAreaX + 10;
        const startY = this.paymentAreaY + 20;
        const spacing = 10;

        for (const piece of this.payment) {
            piece.x = currentX;
            piece.y = startY;
            currentX += piece.width + spacing;

            // Simple overflow check (can be improved to wrap to next line)
            if (currentX > this.paymentAreaX + this.paymentAreaW - piece.width) {
                 // For now, stop adding to prevent drawing outside the box
                 piece.x = -100; // Move off-screen
            }
        }
    }

    /**
     * Adds a currency piece to the payment.
     */
    addCurrency(value) {
        if (this.isCorrect) return; // Prevent adding after correct payment

        const newPiece = new CurrencyPiece(value, 0, 0); // Position is calculated in repositionPayment
        this.payment.push(newPiece);
        this.repositionPayment();
        this.message = ""; // Clear any previous message
    }

    /**
     * Removes a currency piece at a specific index.
     */
    removeCurrency(index) {
        this.payment.splice(index, 1);
        this.repositionPayment();
        this.message = ""; // Clear any previous message
    }

    /**
     * Handles the 'Check' button action.
     */
    checkPayment() {
        const total = this.getTotalPayment();
        const price = this.currentItem.price;

        if (total === price) {
            this.message = "✅ Well done! Correct payment.";
            this.isCorrect = true;
            this.startAnimation();
        } else if (total > price) {
            this.message = `❌ Payment is too high! Total: ₹${total}. Price: ₹${price}. Try again.`;
            this.isCorrect = false;
        } else {
            this.message = `❌ Payment is too low! Total: ₹${total}. Price: ₹${price}. Try again.`;
            this.isCorrect = false;
        }
    }

    /**
     * Handles the 'Next Item' button action.
     */
    nextItem() {
        this.currentItemIndex = (this.currentItemIndex + 1) % this.items.length;
        this.currentItem = this.items[this.currentItemIndex];
        this.payment = [];
        this.message = "";
        this.isCorrect = false;
        this.animationActive = false;
    }

    startAnimation() {
        this.animationActive = true;
        this.animationX = this.paymentAreaX + this.paymentAreaW / 2;
        this.animationY = this.paymentAreaY + this.paymentAreaH / 2;
        this.animationAlpha = 255;
    }

    updateAnimation() {
        if (this.animationActive) {
            this.animationY -= 1.5; // Float upwards
            this.animationAlpha -= 5; // Fade out

            if (this.animationAlpha < 0) {
                this.animationActive = false;
                this.animationAlpha = 0;
            }
        }
    }

    draw() {
        this.updateAnimation();
        this.drawCurrencyButtons();
        this.drawItemArea();
        this.drawPaymentArea();
        this.drawFeedback();
        this.drawAnimation();
    }

    drawCurrencyButtons() {
        const btnY = 100;
        let btnX = 50;
        const btnSpacing = 10;

        // Draw Notes
        NOTE_VALUES.forEach(value => {
            const isSelected = value === 50 || value === 5; // Example from image
            const btnW = 75;
            const btnH = 40;

            fill(this.getColor(value, isSelected));
            stroke(isSelected ? 50 : 200);
            rect(btnX, btnY, btnW, btnH, 8);

            fill(0);
            textAlign(CENTER, CENTER);
            textSize(20);
            text(`₹${value}`, btnX + btnW / 2, btnY + btnH / 2);

            btnX += btnW + btnSpacing;
        });

        // Draw Coins (on next row)
        btnX = 50;
        const coinY = btnY + 60;
        COIN_VALUES.forEach(value => {
            const isSelected = value === 5; // Example from image
            const coinSize = 50;

            fill(this.getColor(value, isSelected));
            stroke(isSelected ? 50 : 200);
            ellipse(btnX + coinSize / 2, coinY + coinSize / 2, coinSize, coinSize);

            fill(0);
            textAlign(CENTER, CENTER);
            textSize(20);
            text(`₹${value}`, btnX + coinSize / 2, coinY + coinSize / 2);

            btnX += coinSize + btnSpacing;
        });
    }

    getColor(value, isSelected) {
        let baseColor;
        if (value === 500) baseColor = '#FF5733';
        else if (value === 200) baseColor = '#FFC300';
        else if (value === 100) baseColor = '#2ECC71';
        else if (value === 50) baseColor = '#FF8C00';
        else if (value === 20) baseColor = '#3498DB';
        else if (value === 10) baseColor = '#34495E';
        else if (COIN_VALUES.includes(value)) baseColor = '#F1C40F';
        else baseColor = '#CCCCCC';

        if (isSelected) {
            // Darken slightly for selected state
            const c = color(baseColor);
            c.setAlpha(200);
            return c;
        }
        return baseColor;
    }


    drawItemArea() {
        const itemX = 50;
        const itemY = 220;

        // Item Price Display
        fill(255);
        stroke(180);
        rect(itemX + 10, itemY + 50, 60, 30, 5); // Price box
        fill(0);
        textSize(16);
        textAlign(CENTER, CENTER);
        text(`₹${this.currentItem.price}`, itemX + 40, itemY + 65);

        // Dummy Item Image/Text
        textSize(24);
        textAlign(LEFT, TOP);
        text(this.currentItem.name, itemX + 150, itemY + 40); // Item Name
        textSize(14);
        text("Image Placeholder", itemX + 80, itemY + 90);

        // A simple toy car placeholder
        fill('#F1C40F');
        rect(itemX + 70, itemY + 50, 80, 40, 5); // Car body
        fill(50);
        ellipse(itemX + 85, itemY + 90, 20, 20); // Wheels
        ellipse(itemX + 135, itemY + 90, 20, 20);
    }

    drawPaymentArea() {
        // Payment Area Box
        fill(255);
        stroke(180);
        rect(this.paymentAreaX, this.paymentAreaY, this.paymentAreaW, this.paymentAreaH, 10);

        // "Payment:" label
        fill(50);
        textSize(18);
        textAlign(LEFT, TOP);
        text("Payment:", this.paymentAreaX + 10, this.paymentAreaY - 25);

        // Draw all currency pieces
        for (const piece of this.payment) {
            piece.draw();
        }
    }

    drawFeedback() {
        fill(50);
        textSize(16);
        textAlign(CENTER, TOP);
        // Feedback is drawn below the payment area
        text(this.message, width / 2, this.paymentAreaY + this.paymentAreaH + 20);

        // Draw "Check" and "Next Item" buttons here if not using HTML buttons
        // Assuming HTML buttons, but providing visual feedback for 'correct' state
        if (this.isCorrect) {
            fill(0, 150, 0); // Green for correct
            textSize(18);
            text("Click 'Next Item' to continue.", width / 2, this.paymentAreaY + this.paymentAreaH + 40);
        }
    }

    drawAnimation() {
        if (this.animationActive) {
            fill(0, 150, 0, this.animationAlpha);
            textSize(30);
            textAlign(CENTER, CENTER);
            text("₹ PAID!", this.animationX, this.animationY);
        }
    }

    /**
     * Handles mouse clicks for currency buttons and remove 'x' buttons.
     */
    handleMouseClick(mx, my) {
        // 1. Check Currency Buttons (Note: this is a basic check)
        const btnY = 100;
        let btnX = 50;
        const btnSpacing = 10;

        // Notes
        for (const value of NOTE_VALUES) {
            const btnW = 75;
            const btnH = 40;
            if (mx > btnX && mx < btnX + btnW && my > btnY && my < btnY + btnH) {
                this.addCurrency(value);
                return;
            }
            btnX += btnW + btnSpacing;
        }

        // Coins
        btnX = 50;
        const coinY = btnY + 60;
        const coinSize = 50;
        for (const value of COIN_VALUES) {
             // Check if click is inside the coin circle
            if (dist(mx, my, btnX + coinSize / 2, coinY + coinSize / 2) < coinSize / 2) {
                this.addCurrency(value);
                return;
            }
            btnX += coinSize + btnSpacing;
        }

        // 2. Check Remove 'x' buttons in payment area
        // Iterate backward to avoid indexing issues when removing
        for (let i = this.payment.length - 1; i >= 0; i--) {
            if (this.payment[i].isRemoveClicked(mx, my)) {
                this.removeCurrency(i);
                return;
            }
        }
    }
}

// --- P5.js Required Functions ---

function setup() {
    // Set a canvas size appropriate for the web application (e.g., 800x600)
    const canvas = createCanvas(1000, 600);
    canvas.parent('mainCanvas');

    // Initialize the game
    game = new Game(ITEMS_DATA);

    // Create and position HTML buttons (as requested by the prompt)
   // createButtons();
}

// function createButtons() {
//     // Styling the buttons to match the look in the image (basic p5.js button styling)

//     // CHECK Button
//     checkButton = createButton('Check');
//     checkButton.position(width / 2 - 50, 450);
//     checkButton.size(100, 35);
//     checkButton.style('background-color', '#4CAF50'); // Green
//     checkButton.style('color', 'white');
//     checkButton.style('font-size', '18px');
//     checkButton.style('border-radius', '8px');
//     checkButton.style('border', 'none');
//     checkButton.mousePressed(() => game.checkPayment());

//     // NEXT ITEM Button
//     nextButton = createButton('Next Item');
//     nextButton.position(width / 2 - 60, 500);
//     nextButton.size(120, 35);
//     nextButton.style('background-color', '#F39C12'); // Orange/Yellow
//     nextButton.style('color', 'white');
//     nextButton.style('font-size', '18px');
//     nextButton.style('border-radius', '8px');
//     nextButton.style('border', 'none');
//     nextButton.mousePressed(() => game.nextItem());
// }

function draw() {
    background('#E6EBF9'); // Light background color

    // Main title/instruction box
    fill(255);
    stroke(150);
    rect(200, 10, 600, 70, 10);
    fill(50);
    textSize(18);
    text("Choose the currency notes and coins to pay.", width / 2, 25);
    text("Click × to remove, then click 'Check' to see if you're right!", width / 2, 50);


    // Draw the main game elements
    if (game) {
        game.draw();
    }
}

function mousePressed() {
    if (game) {
        game.handleMouseClick(mouseX, mouseY);
    }
}