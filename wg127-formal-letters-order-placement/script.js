
const letterData = {

    "letters": [
        {
            "title": "scienceExhibitionSupplies",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "Sunnydale School,\nSunshine Avenue,\nGwalior – 474001.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Saba Qureshi,\nSunnydale School,\nSunshine Avenue,\nGwalior – 474001.",
                        "is_correct": false,
                        "feedback": "The sender's name should not be included in the sender's address."
                    },
                    {
                        "id": 3,
                        "text": "Sunnydale School\nSunshine Avenue\nGwalior – 474001.",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma, except the last line."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "18th September, 2026.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "September 18th, 2026.",
                        "is_correct": false,
                        "feedback": "The day should come before the month."
                    },
                    {
                        "id": 3,
                        "text": "18 09, 2026.",
                        "is_correct": false,
                        "feedback": "The month should be written in words, not numbers."
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "The Manager,\nBrightminds Scientific Supplies,\nStation Road,\nGwalior.",
                        "is_correct": false,
                        "feedback": "The PIN code must be included in the address."
                    },
                    {
                        "id": 2,
                        "text": "The Manager,\nBrightminds Scientific Supplies,\nStation Road,\nGwalior – 474001.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Manager,\nBrightminds Scientific Supplies,\nStation Road,\nGwalior – 474001.",
                        "is_correct": false,
                        "feedback": "The designation should be preceded by 'The'."
                    }
                ],
                "salutation": [
                    {
                        "id": 1,
                        "text": "Dear Sir,",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Dear Sir",
                        "is_correct": false,
                        "feedback": "A comma should follow the salutation."
                    },
                    {
                        "id": 3,
                        "text": "Dear Manager Sir,",
                        "is_correct": false,
                        "feedback": "Use just ‘Sir’ or ‘Madam’. Designation is not used in the salutation."
                    }
                ],
                "introduction": [
                    {
                        "id": 1,
                        "text": "I am Saba Qureshi, a student of Sunnydale School. We are organising a Science Exhibition on 25 October 2026 and wish to place an order for scientific models and materials.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "We are organising a Science Exhibition and need to order scientific models and materials.",
                        "is_correct": false,
                        "feedback": "This introduction does not mention the sender's name and lacks a clear personal introduction."
                    },
                    {
                        "id": 3,
                        "text": "I really need to order scientific models for a school event happening on 25 October 2026.",
                        "is_correct": false,
                        "feedback": "This introduction uses casual language and lacks formal phrasing."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "We would like to order some science models including solar system and human body models.",
                        "is_correct": false,
                        "feedback": "Exact quantities are not specified for each item."
                    },
                    {
                        "id": 2,
                        "text": "We need the following: 2 Solar System Models, 1 Human Anatomy Model, 2 Volcano Models and 3 Electric Circuit Kits.",
                        "is_correct": false,
                        "feedback": "Items should be clearly listed with consistent format: 'item – number of units'."
                    },
                    {
                        "id": 3,
                        "text": "We would like to order the following items:\n\nSolar System Model – 2 units\nHuman Anatomy Model – 1 unit\nVolcano Eruption Model – 2 units\nElectric Circuit Kits – 3 units\n\nDate of delivery: 23 October 2026 at 9 a.m.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "Additionally, please inform us of the total cost including shipping, available discounts and return policy. Payment will be made by school cheque upon delivery.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "We need the items before our exhibition starts. Let us know if you have discounts.",
                        "is_correct": false,
                        "feedback": "This paragraph lacks specific delivery date and uses informal language."
                    },
                    {
                        "id": 3,
                        "text": "Kindly deliver by 23 October. Tell us the cost.",
                        "is_correct": false,
                        "feedback": "This paragraph is too brief and abrupt."
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "If you could provide this information at your earliest convenience, we would be grateful. We look forward to a prompt fulfilment of our order.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I hope you will send the items on time.",
                        "is_correct": false,
                        "feedback": "This focuses on the sender's needs rather than maintaining formal tone."
                    },
                    {
                        "id": 3,
                        "text": "Please reply quickly. Hope to hear from you soon!",
                        "is_correct": false,
                        "feedback": "Overly casual and demanding language with exclamation mark."
                    }
                ],
                "complimentary_close": [
                    {
                        "id": 1,
                        "text": "Thank you,\nRegards,",
                        "is_correct": false,
                        "feedback": "A comma should follow 'Thank you'. 'Regards' alone is too informal."
                    },
                    {
                        "id": 2,
                        "text": "With thanks,\nYours truly,",
                        "is_correct": false,
                        "feedback": "'With thanks' is not a standard complimentary close."
                    },
                    {
                        "id": 3,
                        "text": "Thanking you,\n\nYours sincerely,",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "senders_name": [
                    {
                        "id": 1,
                        "text": "Saba Qureshi",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Saba Qureshi.",
                        "is_correct": false,
                        "feedback": "A full stop is not required after the sender’s name."
                    },
                    {
                        "id": 3,
                        "text": "Student Saba Qureshi",
                        "is_correct": false,
                        "feedback": "Designations should not be added before the sender's name."
                    }
                ]
            }
        },
        {
            "title": "gymEquipmentOrder",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "Sanskriti International School,\nPune – 411002.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Sanskriti International School\nPune – 411002.",
                        "is_correct": false,
                        "feedback": "Commas at the end of each line (except the last) are missing."
                    },
                    {
                        "id": 3,
                        "text": "Mitali Nayan,\nSports Captain,\nSanskriti International School,\nPune – 411002.",
                        "is_correct": false,
                        "feedback": "The sender's name and designation should not be included in the sender's address."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "2 February, 2026.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "2nd Feb, 2026.",
                        "is_correct": false,
                        "feedback": "The month should be written in full, not abbreviated."
                    },
                    {
                        "id": 3,
                        "text": "February 2, 2026.",
                        "is_correct": false,
                        "feedback": "The day should come before the month."
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "The Supplier,\nNew Development Sports,\nPune – 411002.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Supplier\nNew Development Sports\nPune – 411002.",
                        "is_correct": false,
                        "feedback": "The designation should be preceded by 'The'. Each line should end with a comma, except the last line."
                    },
                    {
                        "id": 3,
                        "text": "The Supplier,\nNew Development Sports,\nPune.",
                        "is_correct": false,
                        "feedback": "The PIN code must be included in the address."
                    }
                ],
                "salutation": [
                    {
                        "id": 1,
                        "text": "Dear Sir/Madam,",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Dear Supplier",
                        "is_correct": false,
                        "feedback": "The designation is not used in the salutation."
                    },
                    {
                        "id": 3,
                        "text": "Hello",
                        "is_correct": false,
                        "feedback": "'Hello' is too informal for a formal letter. A comma should follow the salutation."
                    }
                ],
                "introduction": [
                    {
                        "id": 1,
                        "text": "I am writing on behalf of Sanskriti International School to place an order for new gym equipment. I am the Sports Captain of the school. We aim to enhance our physical education programme and were impressed by the quality of your products.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Our school needs new gym equipment. I am the Sports Captain, Mitali Nayan, and I want to order products from your company.",
                        "is_correct": false,
                        "feedback": "This introduction uses casual language and lacks proper organisational introduction."
                    },
                    {
                        "id": 3,
                        "text": "This is to inform you that we require gym equipment for our school.",
                        "is_correct": false,
                        "feedback": "This introduction sounds impersonal and lacks specific purpose statement."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "We require treadmills, stationary bikes, dumbbells, resistance bands and yoga mats.",
                        "is_correct": false,
                        "feedback": "Exact quantities are not specified for each item."
                    },
                    {
                        "id": 2,
                        "text": "We are interested in the following items:\n\nTreadmills – 3 units\nStationary bikes – 5 units\nDumbbells (various weights) – 10 sets\nResistance bands – 15 sets\nYoga mats – 20 units.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "We want to buy 3 treadmills and 5 bikes. Also send dumbbells and yoga mats in sufficient quantities.",
                        "is_correct": false,
                        "feedback": "This paragraph lists some quantities vaguely and uses informal language."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "Please send us your complete catalogue and detailed prices. We will inform you about delivery arrangements later.",
                        "is_correct": false,
                        "feedback": "This demonstrates poor planning and lacks professional detail."
                    },
                    {
                        "id": 2,
                        "text": "We would appreciate it if you could provide us with a catalogue and pricing details. If you have recommendations known for durability and safety, we will certainly consider them.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Send us details and tell us which brands are best.",
                        "is_correct": false,
                        "feedback": "This uses commanding language and lacks professional courtesy."
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "We hope to hear from you soon with the requested details.",
                        "is_correct": false,
                        "feedback": "This lacks clear professional next steps."
                    },
                    {
                        "id": 2,
                        "text": "Once we receive the details, our administrative manager will confirm delivery arrangements. I look forward to your prompt attention to this order.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Kindly respond at the earliest. We need this equipment urgently.",
                        "is_correct": false,
                        "feedback": "This focuses too much on urgency and lacks proper closing remarks."
                    }
                ],
                "complimentary_close": [
                    {
                        "id": 1,
                        "text": "Thanking you,\n\nYours sincerely,",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Thanking you\nYours sincerely",
                        "is_correct": false,
                        "feedback": "Commas are missing after 'Thanking you' and 'Yours sincerely'."
                    },
                    {
                        "id": 3,
                        "text": "With sincere thanks,\nYours truly,",
                        "is_correct": false,
                        "feedback": "'With sincere thanks' is not a standard complimentary close."
                    }
                ],
                "senders_name": [
                    {
                        "id": 1,
                        "text": "Ms. Mitali Nayan",
                        "is_correct": false,
                        "feedback": "Titles like 'Ms.' are not added to the sender's name."
                    },
                    {
                        "id": 2,
                        "text": "Mitali Nayan,\nSports Captain",
                        "is_correct": false,
                        "feedback": "A comma is not required and the designation should not be added."
                    },
                    {
                        "id": 3,
                        "text": "Mitali Nayan",
                        "is_correct": true,
                        "feedback": ""
                    }
                ]
            }
        },
        {
            "title": "artSuppliesOrder",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "Riverside School\nLake Road\nKolkata – 700001.",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma, except the last line."
                    },
                    {
                        "id": 2,
                        "text": "Riverside School,\nLake Road,\nKolkata – 700001.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Riverside School,\nLake Road,\nKolkata – 700001,\nIndia.",
                        "is_correct": false,
                        "feedback": "The country name is not required in domestic correspondence."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "05/03/2026.",
                        "is_correct": false,
                        "feedback": "The date should be written in the proper format: day in numbers, month in words and year."
                    },
                    {
                        "id": 2,
                        "text": "5th March, 2026.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "5 March 26.",
                        "is_correct": false,
                        "feedback": "The year should be written in full."
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "The Manager,\nCreative Art Supplies,\nPark Street,\nKolkata – 700001.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Manager,\nCreative Art Supplies,\nPark Street,\nKolkata – 700001.",
                        "is_correct": false,
                        "feedback": "The designation should be preceded by 'The'."
                    },
                    {
                        "id": 3,
                        "text": "The Manager,\nCreative Art Supplies,\nPark Street,\nKolkata",
                        "is_correct": false,
                        "feedback": "The complete address must include the PIN code."
                    }
                ],
                "salutation": [
                    {
                        "id": 1,
                        "text": "Dear Sir or Madam,",
                        "is_correct": false,
                        "feedback": "The correct format is 'Dear Sir/Madam' with a forward slash."
                    },
                    {
                        "id": 2,
                        "text": "Sir/Madam,",
                        "is_correct": false,
                        "feedback": "The salutation should begin with 'Dear'."
                    },
                    {
                        "id": 3,
                        "text": "Dear Sir/Madam,",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "introduction": [
                    {
                        "id": 1,
                        "text": "I am John Gomes, President of the Art Club at Riverside School. I am writing on behalf of our school to place an order for art materials.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "This letter is to place an order for art supplies needed at our school.",
                        "is_correct": false,
                        "feedback": "This introduction does not clearly mention the sender's name and designation at the beginning."
                    },
                    {
                        "id": 3,
                        "text": "I am the Art Club President and we need to buy art materials from your shop.",
                        "is_correct": false,
                        "feedback": "This uses casual language and lacks formal structure."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "We need acrylic paints, watercolour paper, brushes, canvas boards and pencils.",
                        "is_correct": false,
                        "feedback": "Items should be listed separately with consistent format and quantities."
                    },
                    {
                        "id": 2,
                        "text": "We would like to order the following items:\n\nAcrylic paints (assorted colours) – 20 sets\nWatercolour paper pads (A4 size) – 15 pads\nPaintbrushes (various sizes) – 25 sets\nCanvas boards (30 cm × 40 cm) – 10 units\nSketching pencils – 30 sets.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "We require various art supplies in approximate quantities.",
                        "is_correct": false,
                        "feedback": "Items and quantities are not clearly matched and specifications are unclear."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "Delivery should be completed by 20 March 2026 without fail.",
                        "is_correct": false,
                        "feedback": "This sounds abrupt and uses interrogative tone."
                    },
                    {
                        "id": 2,
                        "text": "Please deliver the supplies by 20 March 2026. We would appreciate a quotation including taxes and delivery charges, and details about bulk discounts and return policy.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Tell us the total price and apply discounts.",
                        "is_correct": false,
                        "feedback": "This uses commanding language and lacks courtesy."
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "Please send the quotation ASAP.",
                        "is_correct": false,
                        "feedback": "This uses overly casual and demanding language."
                    },
                    {
                        "id": 2,
                        "text": "We hope you can fulfil this order soon.",
                        "is_correct": false,
                        "feedback": "This uses casual tone and lacks professional formality."
                    },
                    {
                        "id": 3,
                        "text": "We request your prompt attention to this order. Once we receive the quotation, our accounts department will process the payment. We look forward to receiving the supplies.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "complimentary_close": [
                    {
                        "id": 1,
                        "text": "Thanking you,\n\nYours sincerely,",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Yours sincerely,\nThanking you,",
                        "is_correct": false,
                        "feedback": "The order should be reversed: 'Thanking you' should come before 'Yours sincerely'."
                    },
                    {
                        "id": 3,
                        "text": "Thanking you\n\nYour's sincerely",
                        "is_correct": false,
                        "feedback": "An apostrophe is not used in 'Yours'."
                    }
                ],
                "senders_name": [
                    {
                        "id": 1,
                        "text": "John Gomes\nPresident, Art Club",
                        "is_correct": false,
                        "feedback": "The designation should not be added below the sender's name."
                    },
                    {
                        "id": 2,
                        "text": "John Gomes.",
                        "is_correct": false,
                        "feedback": "A full stop is not required after the sender's name."
                    },
                    {
                        "id": 3,
                        "text": "John Gomes",
                        "is_correct": true,
                        "feedback": ""
                    }
                ]
            }
        }
    ]
}

/**
 * APP STATE
 * Centralized tracking of the user's progress
 */
// 2. Global State
const state = {
    currentStepIndex: 0,
    activeLeftId: null,
    activeLetter: null,
    letterBoxIndex: 0, // Tracks which letter box must be filled next (practice page)
    sequence: [
        "senders-address-blank", "date-blank", "recievers-address-blank",
        "salutation-blank", "introduction-blank", "body-1-blank",
        "body-2-blank", "conclusion-blank", "complimentary-close-blank",
        "senders-name-blank"
    ]
};

const boxSequence = [
    'senders-address-box',
    'date-box',
    'receivers-address-box',
    'salutation-box',
    'introduction-box',
    'body-1-box',
    'body-2-box',
    'conclusion-box',
    'complimentary-close-box',
    'senders-name-box'
];

const lottieContainer = document.getElementById('lottie-container');
const proceedBtn = document.getElementById('proceed-btn');
const practicePageEl = document.getElementById('practice-page');
const practiceResultEl = document.getElementById('practice-result');

const resultImageMap = {
    scienceExhibitionSupplies: 'practice-result-scienceExhibitionSupplies',
    gymEquipmentOrder: 'practice-result-gymEquipmentOrder',
    artSuppliesOrder: 'practice-result-artSuppliesOrder'
};


function playCompleteLottie() {
    const container = document.getElementById('completion-lottie');

    if (!container) {
        console.warn(`Container completion-lottie not found`);
        return;
    }

    const animationPath = `./animation/celebration.json`;

    // Clear previous animation
    container.innerHTML = '';
    container.style.display = 'block';

    const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: animationPath,
        rendererSettings: {
            hideOnTransparent: false,
            preserveAspectRatio: 'xMidYMid meet'
        }
    });

    // Ensure totalFrames is available
    anim.addEventListener('DOMLoaded', () => {
        anim.addEventListener('complete', () => {
            anim.goToAndStop(anim.totalFrames - 1, true);
        });
    });
}

function playSuccessLottie() {
    const container = document.getElementById('success-lottie-container');

    if (!container) {
        console.warn(`Container success-lottie-container not found`);
        return;
    }

    const animationPath = `./animation/celebration.json`;

    // Clear previous animation
    container.innerHTML = '';
    container.style.display = 'block';

    const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: animationPath,
        rendererSettings: {
            hideOnTransparent: false,
            preserveAspectRatio: 'xMidYMid meet'
        }
    });

    // Ensure totalFrames is available
    anim.addEventListener('DOMLoaded', () => {
        anim.addEventListener('complete', () => {
            anim.goToAndStop(anim.totalFrames - 1, true);
        });
    });
}

// 3. Navigation & Initialization
document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    initGameListeners();
    initProceedButton();
});

function initProceedButton() {
    if (!proceedBtn) return;
    proceedBtn.onclick = () => showPracticeResult();
}

function resetLetterBoxesAndRetry() {
    if (!state.activeLetter) return;

    /* 1. Reset letter box state */
    state.letterBoxIndex = 0;

    /* 2. Reset LETTER BOXES (practice fill-in UI) */
    document.querySelectorAll('.letter-box').forEach(box => {
        box.classList.remove('completed', 'letter-box-highlight');
        box.querySelector('.filled-text')?.remove();
        const suggestion = box.querySelector('.suggestion-answer');
        const wrapper = box.querySelector('.suggestion-wrapper');
        const displayBox = wrapper || suggestion;
        if (displayBox) {
            displayBox.style.display = 'none';
            // hideFeedback(suggestion);
        }
        box.style.height = "200px";
    });
    document.querySelectorAll('.placeholder-txt').forEach(el => el.style.display = 'block');

    /* 3. Hide proceed, result; show practice page */
    if (proceedBtn) proceedBtn.style.display = 'none';
    if (practiceResultEl) practiceResultEl.style.display = 'none';
    if (practicePageEl) practicePageEl.style.display = 'block';

    /* 4. Re-initialize letter boxes with same topic */
    startPracticeSession(state.activeLetter.title);
}

function showPracticeResult() {
    if (!practicePageEl || !practiceResultEl) return;
    practicePageEl.style.display = 'none';
    practiceResultEl.style.display = 'block';
    if (proceedBtn) proceedBtn.style.display = 'none';

    document.querySelectorAll('.practice-result-img').forEach(img => {
        img.style.display = 'none';
    });
    const topic = state.activeLetter?.title || 'scienceExhibitionSupplies';
    const imgId = resultImageMap[topic] || resultImageMap.scienceExhibitionSupplies;
    const img = document.getElementById(imgId);
    if (img) img.style.display = 'block';
    playSuccessLottie();
}

function initNavigation() {
    const navButtons = {
        'learn-btn': 'learn-page',
        'example-btn': 'practice-examples',
        'home-btn': 'home-page',
        'learn-example-btn': 'practice-examples',
        'practice-some-more': 'practice-examples'
    };

    Object.entries(navButtons).forEach(([id, page]) => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = () => {
                if (id === 'home-btn') {
                    resetPracticeSession(); // 🔥 RESET EVERYTHING
                    resetContainerScrolls();
                }
                navigateTo(page);
            };
        }
    });

    // Practice Some More: reset filled data and return to practice page with same topic
    // const practiceSomeMoreBtn = document.getElementById('practice-some-more');
    // if (practiceSomeMoreBtn) {
    //     practiceSomeMoreBtn.onclick = () => resetLetterBoxesAndRetry();
    // }

    // Practice Trigger Buttons
    ['scienceExhibitionSupplies', 'gymEquipmentOrder', 'artSuppliesOrder'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = () => {
                startPracticeSession(id);
                resetLetterBoxesAndRetry();
                navigateTo('practice-page');
            };
        }
    });
}

function highlightLetterBox(boxId) {
    document.querySelectorAll('.letter-box').forEach(box => {
        box.classList.remove('letter-box-highlight');
    });
    const box = document.getElementById(boxId);
    if (box) {
        box.classList.add('letter-box-highlight');
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => box.classList.remove('letter-box-highlight'), 800);
    }
}

function initializeLetterBox(boxId, dataKey, placeholder) {
    const mainBox = document.getElementById(boxId);
    if (!mainBox || !state.activeLetter) return;

    const suggestionBox = mainBox.querySelector('.suggestion-answer');
    if (!suggestionBox) {
        console.warn(`Missing .suggestion-answer inside #${boxId}`);
        return;
    }
    const suggestionWrapper = mainBox.querySelector('.suggestion-wrapper');
    const displayBox = suggestionWrapper || suggestionBox;
    const optionsData = state.activeLetter.sections[dataKey];
    if (!Array.isArray(optionsData)) return;

    optionsData.forEach((option, index) => {
        const optionDiv = suggestionBox.querySelector(`.text${index + 1}`);
        if (!optionDiv) return;

        const span = optionDiv.querySelector('span');
        if (span) span.innerText = option.text;

        optionDiv.onclick = (e) => {
            e.stopPropagation();

            if (option.is_correct) {
                // hideFeedback(suggestionBox);
                displayBox.style.display = 'none';

                let filled = mainBox.querySelector('.filled-text');
                if (!filled) {
                    document.getElementById(placeholder).style.display = 'none';
                    filled = document.createElement('div');
                    filled.className = 'filled-text';
                    mainBox.appendChild(filled);
                }

                filled.innerText = option.text;
                mainBox.style.height = "auto";
                mainBox.classList.add('completed');
                mainBox.classList.remove('letter-box-highlight');

                state.letterBoxIndex++;
                if (state.letterBoxIndex >= boxSequence.length && proceedBtn) {
                    proceedBtn.style.display = 'block';
                }
            } else {
                showFeedback(option.feedback || "Incorrect format. Try again!", displayBox, optionDiv);
            }
        };
    });

    mainBox.onclick = (e) => {
        if (mainBox.classList.contains('completed')) return;

        const expectedBoxId = boxSequence[state.letterBoxIndex];
        if (boxId !== expectedBoxId) {
            highlightLetterBox(expectedBoxId);
            return;
        }

        // hideFeedback(suggestionBox);
        displayBox.style.display = 'block';
    };
}


// How to trigger it for Senders Address
function startPracticeSession(matchId) {
    state.activeLetter = letterData.letters.find(l => l.title === matchId);
    state.currentStepIndex = 0;
    state.letterBoxIndex = 0;
    if (proceedBtn) proceedBtn.style.display = 'none';
    console.log(matchId, state.activeLetter);
    // Initialize specific components
    initializeLetterBox('senders-address-box', 'senders_address', 'sendersAddress-placeholder');
    initializeLetterBox('date-box', 'date', 'date-placeholder');
    initializeLetterBox('receivers-address-box', 'receivers_address', 'receiversAddress-placeholder');
    initializeLetterBox('salutation-box', 'salutation', 'salutation-placeholder');
    initializeLetterBox('introduction-box', 'introduction', 'introduction-placeholder');
    initializeLetterBox('body-1-box', 'body_paragraph_1', 'bodyParagraph-1-placeholder');
    initializeLetterBox('body-2-box', 'body_paragraph_2', 'bodyParagraph-2-placeholder');
    initializeLetterBox('conclusion-box', 'conclusion', 'conclusion-placeholder');
    initializeLetterBox('complimentary-close-box', 'complimentary_close', 'complimentary-placeholder');
    initializeLetterBox('senders-name-box', 'senders_name', 'sendersName-placeholder');

}

// 4. UI Support Functions
function navigateTo(pageId) {
    const pages = ['home-page', 'learn-page', 'practice-page', 'practice-examples'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === pageId) ? 'block' : 'none';
    });

    if (pageId == 'practice-examples') {
        document.getElementById('learn-example-btn').style.display = 'none';
        document.getElementById('practice-result').style.display = 'none';
        // document.getElementById('practice-some-more').style.display = 'none';
        resetPracticeSession();
    }
    document.getElementById('home-btn').style.display = (pageId === 'home-page') ? 'none' : 'block';
    resetContainerScrolls();
}

function resetContainerScrolls() {
    window.scrollTo(0, 0);
    // Add any specific scrollable containers here
    const letterArea = document.querySelector('.letter-container');
    if (letterArea) letterArea.scrollTop = 0;
}

/** * FUNCTION: Left Panel Interaction
 * Validates if the user is clicking the correct box in the sequence
 */
function handleBlankSelection(gElement) {
    const expectedId = state.sequence[state.currentStepIndex];
    document.querySelectorAll(".svg-popup")
        .forEach(p => p.style.display = "none");

    if (gElement.id !== expectedId) {
        applyRightVisualHighlight(expectedId);
        //  showFeedback(`Sequence Error: Please select the box for "${formatIdText(expectedId)}"`);
        return;
    }

    state.activeLeftId = gElement.id;
    applyVisualHighlight(gElement);
}

/** * FUNCTION: Right Panel Interaction
 * Checks if the selected option matches the active blank
 */
function handleOptionSelection(btnElement) {
    const expectedId = state.sequence[state.currentStepIndex];
    console.log("btnElement", btnElement);
    if (!state.activeLeftId) {
        // showFeedback("Select a section on the letter first!");
        applyRightVisualHighlight(expectedId);
        return;
    }

    // Matching logic: IDs or normalized strings
    const isMatch = validateMatch(state.activeLeftId, btnElement.id);

    if (isMatch) {
        processCorrectMatch(btnElement);
    } else {
        applyWrongVisualHighlight(btnElement);
        //   showFeedback("That component doesn't belong in this section.");
    }
}

/** * SUPPORT FUNCTIONS: Helpers for UI & Logic
 */
function validateMatch(leftId, rightId) {
    const normLeft = leftId.toLowerCase().replace('-blank', '');
    const normRight = rightId.toLowerCase().replace(/\s/g, '-');
    console.log(normLeft, normRight);
    return leftId === rightId || normLeft.includes(normRight);
}

function processCorrectMatch(btnElement) {
    const targetG = document.getElementById(state.activeLeftId);

    showPopupFromGElement(targetG.id);
    // 1. Update SVG Box Appearance
    targetG.querySelectorAll('path').forEach(p => {
        //p.setAttribute('fill', '#f8f9fa');
        //  p.setAttribute('stroke', '#28a745');
        p.setAttribute('stroke-width', '2');
        p.removeAttribute('stroke-dasharray');
        p.setAttribute("pointer-events", "none");
    });

    // 2. Add Text to the Box
    addTextToSvg(targetG, btnElement.innerText || btnElement.textContent);

    // 3. Disable Button
    btnElement.style.opacity = "0.3";
    btnElement.style.pointerEvents = "none";
    btnElement.style.filter = "grayscale(1)";

    // 4. Advance State
    state.currentStepIndex++;
    state.activeLeftId = null;

    if (state.currentStepIndex === state.sequence.length) {
        // showFeedback("Congratulations! You've completed the formal letter structure.");
        lottieContainer.style.display = 'block';
        document.getElementById('learn-example-btn').style.display = 'block';
        playCompleteLottie();
    }
}

function showPopupFromGElement(gElement) {

    if (!gElement) return;

    const popupId =
        "popup-" + gElement;

    document.querySelectorAll(".svg-popup")
        .forEach(p => p.style.display = "none");

    const popup = document.getElementById(popupId);
    console.log(popup);

    if (popup) popup.style.display = "block";
}

/**
 * FUNCTION: Injects text into the center of the SVG group
 */
function addTextToSvg(groupElement, label) {
    // Get the bounding box of the paths to find the center
    //const bbox = groupElement.getBBox();
    const path = groupElement.querySelector('path');
    const bbox = path ? path.getBBox() : groupElement.getBBox();

    // Create SVG Text element
    const textNode = document.createElementNS("http://www.w3.org/2000/svg", "text");

    // Set text position (center of the box)
    textNode.setAttribute("x", bbox.x + bbox.width / 2);
    textNode.setAttribute("y", bbox.y + bbox.height / 2);

    // Styling the text
    textNode.setAttribute("fill", "#333");
    textNode.setAttribute("font-size", "28px");
    textNode.setAttribute("font-weight", "500");
    textNode.setAttribute("font-family", "Roboto, sans-serif");
    textNode.setAttribute("text-anchor", "middle"); // Horizontal center
    textNode.setAttribute("dominant-baseline", "central"); // Vertical center    
    textNode.setAttribute("pointer-events", "none");
    textNode.textContent = label;
    console.log(label)
    // 2. Reset paths to original state (Remove Blue, Keep Dash)
    const paths = groupElement.querySelectorAll('path');
    paths.forEach(path => {
        // Reset to original grey from your SVG code
        path.setAttribute("stroke", "#707070");
        // Reset thickness to original
        path.setAttribute("stroke-width", "1");
        // Ensure the dash is visible (if it was removed during highlight)
        path.setAttribute("stroke-dasharray", "5 5");
    });

    groupElement.appendChild(textNode);
}

function applyVisualHighlight(el) {
    // Highlight selected one blue
    el.querySelectorAll('path').forEach(p => {
        p.setAttribute('stroke', '#007bff');
        p.setAttribute('stroke-width', '6');
        p.removeAttribute('stroke-dasharray');
    });
}

function applyRightVisualHighlight(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    el.querySelectorAll('path').forEach(p => {
        // STEP 1: Blue highlight
        p.setAttribute('stroke', '#007bff');
        p.setAttribute('stroke-width', '6');
        p.removeAttribute('stroke-dasharray');

        // STEP 2: Switch to grey dashed after 600ms
        setTimeout(() => {
            p.setAttribute('stroke', '#9e9e9e');      // grey
            p.setAttribute('stroke-width', '2');
            p.setAttribute('stroke-dasharray', '4 4'); // dashed
        }, 600);
    });
}



function applyWrongVisualHighlight(el) {
    el.querySelectorAll('path').forEach(p => {
        p.setAttribute('stroke', 'red');
        p.setAttribute('stroke-width', '6');

        setTimeout(() => {
            p.setAttribute('stroke', 'none');
            p.setAttribute('stroke-width', '0');
        }, 600);
    });
}

function formatIdText(id) {
    return id.replace('-blank', '').replace(/-/g, ' ').toUpperCase();
}

function showFeedback(msg, anchorEl, optionDiv) {
    if (!anchorEl) return;

    // Remove existing feedback texts so multiple don't stack
    document.querySelectorAll('.feedback-text').forEach(el => el.remove());

    // Remove blinking from all texts
    document.querySelectorAll('.wrong-blink').forEach(el => el.classList.remove('wrong-blink'));
    if (optionDiv) {
        optionDiv.classList.add('wrong-blink');
    }

    let feedbackEl = document.createElement('div');
    feedbackEl.className = 'feedback-text';
    anchorEl.appendChild(feedbackEl);

    feedbackEl.textContent = msg || 'Incorrect format. Try again!';
    // Slight timeout ensures CSS transition can trigger when class is added
    setTimeout(() => {
        feedbackEl.classList.add('is-visible');
    }, 10);
}

function hideFeedback(anchorEl) {
    if (!anchorEl) return;
    const feedbackEl = anchorEl.querySelector('.feedback-text');
    if (feedbackEl) {
        feedbackEl.classList.remove('is-visible');
        if (feedbackEl._hideTimeout) clearTimeout(feedbackEl._hideTimeout);
    }
}

function resetPracticeSession() {
    /* 1. Reset STATE */
    state.currentStepIndex = 0;
    state.activeLeftId = null;
    state.activeLetter = null;
    state.letterBoxIndex = 0;

    /* 2. Reset LEFT SVG BLANKS */
    document.querySelectorAll('.left-blanks > g').forEach(g => {
        // Remove added text nodes
        g.querySelectorAll('text').forEach(t => t.remove());

        // Restore path styles
        g.querySelectorAll('path').forEach(p => {
            p.setAttribute('stroke', '#707070');
            p.setAttribute('stroke-width', '1');
            p.setAttribute('stroke-dasharray', '5 5');
            p.setAttribute('pointer-events', 'auto');
        });
    });

    /* 3. Reset RIGHT OPTIONS */
    document.querySelectorAll('.right-option > g').forEach(btn => {
        btn.style.opacity = '1';
        btn.style.pointerEvents = 'auto';
        btn.style.filter = 'none';
    });

    /* 4. Reset LETTER BOXES (practice fill-in UI) */
    document.querySelectorAll('.letter-box').forEach(box => {
        box.classList.remove('completed', 'letter-box-highlight');

        // Remove filled text
        box.querySelector('.filled-text')?.remove();

        // Hide suggestions and feedback
        const suggestion = box.querySelector('.suggestion-answer');
        const wrapper = box.querySelector('.suggestion-wrapper');
        const displayBox = wrapper || suggestion;
        if (displayBox) {
            displayBox.style.display = 'none';
            hideFeedback(displayBox);
        }

        box.style.height = "200px";
    });

    /* 5. Reset LOTTIE */
    const completion = document.getElementById('completion-lottie');
    if (completion) {
        completion.innerHTML = '';
        completion.style.display = 'none';
    }

    const lottieWrapper = document.getElementById('lottie-container');
    if (lottieWrapper) {
        lottieWrapper.style.display = 'none';
    }

    /* 6. Hide learn-example button */
    const learnExampleBtn = document.getElementById('learn-example-btn');
    if (learnExampleBtn) {
        learnExampleBtn.style.display = 'none';
    }

    /* 7. Hide proceed button */
    if (proceedBtn) {
        proceedBtn.style.display = 'none';
    }

    /* 8. Hide practice-result, ensure practice-page hidden */
    if (practiceResultEl) {
        practiceResultEl.style.display = 'none';
    }
    if (practicePageEl) {
        practicePageEl.style.display = 'none';
    }

    document.querySelectorAll('.placeholder-txt')
        .forEach(el => el.style.display = 'block');

}

document.getElementById('home-btn').onclick = () => {
    resetPracticeSession();
    navigateTo('home-page');
};


function initGameListeners() {
    document.querySelectorAll('.left-blanks > g').forEach(g => {
        g.addEventListener('click', () => handleBlankSelection(g));
    });

    document.querySelectorAll('.right-option > g').forEach(btn => {
        btn.addEventListener('click', () => handleOptionSelection(btn));
    });

    document.querySelectorAll('.letter-box').forEach(box => {
        // Save the initial height
        box.dataset.defaultHeight = box.offsetHeight + 'px';
    });

}

document.querySelectorAll(".close-btn").forEach(btn => {

    btn.addEventListener("click", function (e) {

        e.stopPropagation();

        document.querySelectorAll(".svg-popup")
            .forEach(p => p.style.display = "none");
    });

});