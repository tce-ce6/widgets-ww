let wordPairs = [
    { "words": ["curious", "shoes"], "sentence": "The curious child wondered why her shoes made squeaky noises." },
    { "words": ["ordinary", "heroes"], "sentence": "The most ordinary people often turn out to be heroes." },
    { "words": ["forget", "kindness"], "sentence": "We must never forget the kindness shown to us during difficult times." },
    { "words": ["chess", "lantern"], "sentence": "We played chess under the old lantern when the lights went out." },
    { "words": ["park", "bicycle"], "sentence": "He rode his bicycle to the park every Saturday morning." },
    { "words": ["stubborn", "directions"], "sentence": "The stubborn driver refused to ask for directions." },
    { "words": ["football", "lemonade"], "sentence": "After playing football all afternoon, cold lemonade tasted especially sweet." },
    { "words": ["peacock", "blanket"], "sentence": "The blanket had a beautiful peacock printed on it." },
    { "words": ["curry", "notebook"], "sentence": "My notebook still smells of the curry that I dropped on it." },
    { "words": ["flute", "market"], "sentence": "The sound of a flute filled the market on weekends." },
    { "words": ["hungry", "bicycle"], "sentence": "The hungry student rode his bicycle to the cafeteria." },
    { "words": ["noise", "peace"], "sentence": "The constant noise made us treasure moments of peace." },
    { "words": ["goat", "slipper"], "sentence": "A goat wandered off with someone’s slipper near the field." },
    { "words": ["train", "flowers"], "sentence": "She bought fresh flowers from the market before catching the morning train to visit her grandmother." },
    { "words": ["guitar", "window"], "sentence": "Guitar melodies drifted through the window each evening." },
    { "words": ["night", "dawn"], "sentence": "The longest night often bring the most glorious dawn." },
    { "words": ["laughing", "umbrella"], "sentence": "The children were laughing as they shared one umbrella." },
    { "words": ["excited", "library"], "sentence": "The excited researcher spent hours in the quiet library." },
    { "words": ["calm", "thunder"], "sentence": "She remained calm despite the loud thunder outside." },
    { "words": ["sceptical", "advertisement"], "sentence": "She remained sceptical about the claims in the advertisement." },
    { "words": ["adventurous", "recipe"], "sentence": "The adventurous cook tried a complicated recipe." },
    { "words": ["patient", "technology"], "sentence": "The patient teacher helped students with the new technology." },
    { "words": ["hunger", "feast"], "sentence": "True hunger makes the simplest meal seem like a feast." },
    { "words": ["frustrated", "shoelaces"], "sentence": "The frustrated runner could not untie her wet shoelaces." },
    { "words": ["jealous", "piano"], "sentence": "He became jealous when his sister played the piano so beautifully." },
    { "words": ["lonely", "crowded"], "sentence": "She felt lonely even in the crowded restaurant." },
    { "words": ["poison", "antidote"], "sentence": "One person's poison often becomes another's antidote." },
    { "words": ["surprised", "laundry"], "sentence": "They were surprised to find a letter in the pocket of a pair of jeans in the laundry basket." },
    { "words": ["drum", "shelf"], "sentence": "The old drum was kept safely on the top shelf after the parade." },
    { "words": ["content", "rain"], "sentence": "Feeling content, he listened to the gentle rhythm of the rain against the window." },
    { "words": ["sandal", "river"], "sentence": "Her sandal slipped off and floated down the river during the picnic." },
    { "words": ["pastries", "holiday"], "sentence": "She baked chocolate pastries for the holiday party." },
    { "words": ["embarrassed", "parking"], "sentence": "He felt embarrassed about his terrible parking job." },
    { "words": ["delighted", "hardware"], "sentence": "She was delighted to find the right screws at the hardware store." },
    { "words": ["soap", "festival"], "sentence": "We made fragrant soap for the festival hampers this year." },
    { "words": ["mirror", "mistake"], "sentence": "Looking in the mirror, she realised her mistake and quickly fixed her hair before leaving." },
    { "words": ["construction", "peaceful"], "sentence": "The construction workers arrived early to disrupt the peaceful morning." },
    { "words": ["busy", "rain"], "sentence": "The busy road slowed down as evening rain started to fall." },
    { "words": ["restless", "homework"], "sentence": "The restless child couldn't concentrate on her homework." },
    { "words": ["hopeful", "interview"], "sentence": "She felt hopeful walking into the job interview." },
    { "words": ["pot", "cricket"], "sentence": "We used an old clay pot as stumps while playing cricket in our garden." },
    { "words": ["saree", "bus"], "sentence": "Her bright saree matched the colours of the school bus." },
    { "words": ["weak", "strong"], "sentence": "Although she felt weak at first, overcoming her fears made her remarkably strong." },
    { "words": ["overwhelmed", "cupboard"], "sentence": "He felt overwhelmed trying to organise his messy cupboard." },
    { "words": ["impatient", "coffee"], "sentence": "The impatient customer tapped her fingers waiting for coffee." },
    { "words": ["disappointed", "weather"], "sentence": "They were disappointed when bad weather cancelled the picnic." },
    { "words": ["grumpy", "breakfast"], "sentence": "He was grumpy until he had his morning breakfast." },
    { "words": ["suspicious", "delivery"], "sentence": "The suspicious neighbour watched the delivery truck." },
    { "words": ["optimistic", "surgery"], "sentence": "She remained optimistic despite needing a complicated surgery." },
    { "words": ["clock", "laughter"], "sentence": "Laughter filled the room as the clock struck midnight at the party." }
]


let currentIndex = 0;
let showSentence = false;

function svgBgColor() {

    let colors = ["#F8F7BA", '#77BEF0', "#F5BABB"];
    let bgColor = random(colors); // p5.js random()
    // Encode the SVG string into a data URI
    let svgCode = `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" version="1.1" viewBox="0 0 666.06 412.3">
  <!-- Generator: Adobe Illustrator 29.5.1, SVG Export Plug-In . SVG Version: 2.1.0 Build 141)  -->
  <defs>
    <style>
      .st0 {
        fill: #7eb7d7;
        isolation: isolate;
        opacity: .44;
      }

      .st1 {
        fill: ${bgColor};
      }
    </style>
  </defs>
  <g id="_176759046_2f796a56-713f-4ff2-bc03-7d475d479212">
    <g id="Group_16">
      <path id="Path_11-2" class="st1" d="M9,27.99v363.14c2.74,2.5,4.55,5.86,5.13,9.52.3,1.96.89,3.86,1.73,5.65h4.52c6.68-5.41,18.74-8.35,29.91-7.38,7.38-1.74,14.1-2.64,22.11-1.48,4.94.67,9.72,2.21,14.13,4.53.93.15,1.86.34,2.77.54,5.19-.2,10.36.52,15.29,2.15,7.12-1.67,14.54-1.63,21.64.12,9.86-4.6,23.89-4.72,35.19-.71,2.82-.45,5.68-.66,8.54-.64,4.57-.02,9.11.79,13.4,2.39,9.64-4.18,22.82-5.6,33.41-1.32,1.42.58,2.62,1.19,3.85,1.8h15.54c6.86-4.11,19.15-5.39,29.35-3.74,9.01-4.43,25.06-4.61,34.19-1.12,3.86,1.47,7.98,3.16,12.17,4.87h8.34c1.75-1.66,3.33-3.06,3.83-3.52,8.08-7.41,23.36-10.68,36.57-8.01,10.72-2.34,23.37-1.21,32.18,4.08,1,.6,2.4,1.44,3.64,2.13,10.99-3.59,22.91-2.96,33.47,1.75.25,0,.49-.02.74-.02,2.75.02,5.5.33,8.19.91,5.28-2.34,10.92-3.77,16.68-4.24,2.14-.16,4.3-.2,6.45-.13.2-.14.37-.28.58-.42,8.13-5.53,27.04-7.41,37.13-2.85.8.36,1.53.74,2.3,1.11,10.27-1.31,21.97.36,28.89,4.81.31.2.72.5,1.13.81.75-.25,1.5-.49,2.28-.7.17-.11.31-.23.48-.34,11.69-7.72,31.58-6.46,43.19.12,6.33-1.67,13.76-1.63,20.8-.36,10.01-5.02,25.18-5.56,36.27-1.58.14-.66.33-1.31.57-1.93,2.82-6.81,11.53-11.02,21.49-12.48V27.99H9Z"/>
      <path id="Path_13" class="st0" d="M240.57,16.76l-15.09-1.48,8.85-2.39-8.85-1v-5.88h203.67v18.79l-11.32,3.09,10.31,2.79-10.63,3.65,11.64,2.9v9.29h-203.67v-4.19l13.82-2.93-13.82-3.14,13.63-3.65-13.63-2.5v-11.31l15.09-2.02v-.02Z"/>
    </g>
  </g>
</svg>`;
    let encoded =
        "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgCode);
    svgBg = loadImage(encoded);
}

function preload() {
    svgBgColor();
}


function setup() {
    let canvas = createCanvas(600, 300);
    canvas.parent("mainCanvas");
    textAlign(CENTER, CENTER);
    textFont("Arial");
    textSize(20);

    // Button listeners
    document.getElementById("show-example-btn").addEventListener("click", () => {
        showSentence = true;
    });

    document.getElementById("next-btn").addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % wordPairs.length;
        showSentence = false;
        svgBgColor();
    });

    // document.getElementById("prev-btn").addEventListener("click", () => {
    //     currentIndex = (currentIndex - 1 + wordPairs.length) % wordPairs.length;
    //     showSentence = false;
    //     svgBgColor();
    // });
}

function drawCard(x, y, w, h, word) {
    // draw SVG background
    image(svgBg, x, y, w + 20, h + 20);

    // overlay text
    push();
    fill(0);
    textSize(24);
    textStyle(BOLD);
    text(word, x + w / 2 + 10, y + h / 2 + 10);
    pop();
}

// function draw() {
//     clear()
//     // background("transparent"); // light blue background

//     let pair = wordPairs[currentIndex];
//     drawCard(70, 40, 180, 100, pair.words[0]);
//     drawCard(350, 40, 180, 100, pair.words[1]);

//     if (showSentence) {
//         fill(255);
//         noStroke();
//         rect(70, 200, 480, 50, 10);

//         push();
//         fill(0);
//         textSize(12);
//         text(pair.sentence, 70, 200, 480, 50);
//         pop();
//     }
// }

function draw() {
    clear();

    let pair = wordPairs[currentIndex];
    drawCard(70, 40, 180, 100, pair.words[0]);
    drawCard(350, 40, 180, 100, pair.words[1]);


    if (showSentence) {
        // White background rect for sentence
        fill(255);
        noStroke();
        rect(70, 200, 480, 50, 10);

        push();
        textSize(12);
        textAlign(LEFT, TOP); // keep LEFT for manual positioning

        let rectX = 70;
        let rectY = 200;
        let rectW = 480;
        let rectH = 50;

        let padding = 10;
        let maxWidth = rectW - 2 * padding;
        let lineHeight = 18;

        // Split sentence into words
        let words = pair.sentence.split(" ");
        let lines = [];
        let currentLine = "";
        let testLine = "";

        // Build lines that fit within maxWidth
        for (let i = 0; i < words.length; i++) {
            testLine = currentLine === "" ? words[i] : currentLine + " " + words[i];
            if (textWidth(testLine) > maxWidth && currentLine !== "") {
                lines.push(currentLine);
                currentLine = words[i];
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine !== "") lines.push(currentLine);

        // Vertical centering: compute total text height
        let totalTextHeight = lines.length * lineHeight;
        let startY = rectY + (rectH - totalTextHeight) / 2;

        // Draw line by line, centered horizontally
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].split(" ");
            let lineWidth = textWidth(lines[i]);
            let x = rectX + (rectW - lineWidth) / 2; // center this line
            let y = startY + i * lineHeight;

            for (let w of line) {
                let clean = w.replace(/[^\w]/g, "");
                let wordWidth = textWidth(w + " ");

                // if (pair.words.includes(clean)) {
                //     fill("green");
                // } else {
                //     fill(0);
                // }

                // Case-insensitive check
                if (pair.words.some(word => word.toLowerCase() === clean.toLowerCase())) {
                    fill("green");
                } else {
                    fill(0);
                }

                text(w, x, y);
                x += wordWidth;
            }
        }

        pop();
    }

}
