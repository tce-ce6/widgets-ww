
const letterData = {

        "letters": [
            {
                "title": "careerChoiceParents",
                "sections": {
                    "senders_address": [
                        {
                            "id": 1,
                            "text": "Army Public Residential School,\nWardha Marg,\nNagpur – 440006.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "Wasim Kumar\nArmy Public Residential School,\nWardha Marg,\nNagpur – 440006.",
                            "is_correct": false,
                            "feedback": "The sender's name should not be included in the sender's address."
                        },
                        {
                            "id": 3,
                            "text": "Army Public Residential School\nWardha Marg\nNagpur – 440006.",
                            "is_correct": false,
                            "feedback": "Each line should end with a comma, except the last line."
                        }
                    ],
                    "date": [
                        {
                            "id": 1,
                            "text": "7 January, 2026.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "January 7, 2026.",
                            "is_correct": false,
                            "feedback": "The day should come before the month."
                        },
                        {
                            "id": 3,
                            "text": "7 01, 2026.",
                            "is_correct": false,
                            "feedback": "The month should be written in words, not numbers."
                        }
                    ],
                    "salutation": [
                        {
                            "id": 1,
                            "text": "Dear Mom and Dad",
                            "is_correct": false,
                            "feedback": "A comma should follow the salutation."
                        },
                        {
                            "id": 2,
                            "text": "Dear Mom and Dad,",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 3,
                            "text": "My dear Mother and Father,",
                            "is_correct": false,
                            "feedback": "This is too formal for an informal letter. Use 'Dear Mom and Dad' instead."
                        }
                    ],
                    "introduction": [
                        {
                            "id": 1,
                            "text": "I hope this letter finds you both in good health. I wanted to share something important with you regarding my future plans after completing my education here at the boarding school.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "Hi! How are you both doing? I'm doing well here at school and everything is good.",
                            "is_correct": false,
                            "feedback": "This introduction is too casual and vague."
                        },
                        {
                            "id": 3,
                            "text": "I am writing to apprise you of my future career aspirations and vocational objectives.",
                            "is_correct": false,
                            "feedback": "This sounds too formal for an informal letter to parents."
                        }
                    ],
                    "body_paragraph_1": [
                        {
                            "id": 1,
                            "text": "I have been thinking about environmental science because I like nature.",
                            "is_correct": false,
                            "feedback": "This paragraph is too casual and vague."
                        },
                        {
                            "id": 2,
                            "text": "After much thought, I have decided to pursue a career in environmental science and conservation. This choice stems from my deep love for the environment and my desire to address pressing environmental issues.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 3,
                            "text": "Climate change and deforestation are serious issues.",
                            "is_correct": false,
                            "feedback": "This discusses importance but does not clearly state the chosen career first."
                        }
                    ],
                    "body_paragraph_2": [
                        {
                            "id": 1,
                            "text": "Climate change, deforestation and habitat destruction are harmful, and I want to be part of the solution. I understand the challenges but am determined to work hard.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "There are lots of environmental problems and stuff.",
                            "is_correct": false,
                            "feedback": "This is too casual and lacks depth."
                        },
                        {
                            "id": 3,
                            "text": "I hope this letter finds you well.",
                            "is_correct": false,
                            "feedback": "This content belongs in the introduction."
                        }
                    ],
                    "conclusion": [
                        {
                            "id": 1,
                            "text": "I request your feedback regarding this career decision.",
                            "is_correct": false,
                            "feedback": "This sounds too formal and transactional."
                        },
                        {
                            "id": 2,
                            "text": "Your advice and support mean the world to me.",
                            "is_correct": false,
                            "feedback": "This does not clearly restate the field of environmental science."
                        },
                        {
                            "id": 3,
                            "text": "Your advice and support mean the world to me. I hope you will support my decision to pursue environmental science. With your guidance, I am confident I can excel in this field.",
                            "is_correct": true,
                            "feedback": ""
                        }
                    ],
                    "sign_off": [
                        {
                            "id": 1,
                            "text": "Yours lovingly,",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "With respect,",
                            "is_correct": false,
                            "feedback": "'With respect' is too formal for a letter to parents."
                        },
                        {
                            "id": 3,
                            "text": "Thanks,",
                            "is_correct": false,
                            "feedback": "'Thanks' is too abrupt."
                        }
                    ],
                    "senders_name": [
                        {
                            "id": 1,
                            "text": "Wasim,",
                            "is_correct": false,
                            "feedback": "A comma is not required after the sender’s name."
                        },
                        {
                            "id": 2,
                            "text": "Wasim Kumar",
                            "is_correct": false,
                            "feedback": "Full name is not typically used in informal letters."
                        },
                        {
                            "id": 3,
                            "text": "Wasim",
                            "is_correct": true,
                            "feedback": ""
                        }
                    ]
                }
            },
            {
                "title": "summerBreakGrandmother",
                "sections": {
                    "senders_address": [
                        {
                            "id": 1,
                            "text": "Skyline Residency,\nS.V. Road,\nMumbai – 400001.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "Katrina\nSkyline Residency,\nS.V. Road,\nMumbai – 400001.",
                            "is_correct": false,
                            "feedback": "The sender's name should not be included in the sender's address."
                        },
                        {
                            "id": 3,
                            "text": "Skyline Residency\nS.V. Road\nMumbai – 400001.",
                            "is_correct": false,
                            "feedback": "Each line should end with a comma, except the last line which ends with a full stop."
                        }
                    ],
                    "date": [
                        {
                            "id": 1,
                            "text": "6 June, 2026.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "06/06/2026",
                            "is_correct": false,
                            "feedback": "The date format is incorrect. Write the date in numbers, followed by the month in words, then the year."
                        },
                        {
                            "id": 3,
                            "text": "June 6th, 2026.",
                            "is_correct": false,
                            "feedback": "The day should come before the month."
                        }
                    ],
                    "salutation": [
                        {
                            "id": 1,
                            "text": "Grandmother,",
                            "is_correct": false,
                            "feedback": "Correct salutation is 'Dear Grandma,'."
                        },
                        {
                            "id": 2,
                            "text": "Dear Grandma,",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 3,
                            "text": "Dear Grandma",
                            "is_correct": false,
                            "feedback": "A comma should follow the salutation."
                        }
                    ],
                    "introduction": [
                        {
                            "id": 1,
                            "text": "I hope you are doing well and finding joy in each day. As I sit down to write this letter, I am filled with gratitude for the wonderful time I spent with you during my summer break.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "My days with you were filled with quiet joy and sweet memories.",
                            "is_correct": false,
                            "feedback": "This content belongs in the body paragraph, not the introduction."
                        },
                        {
                            "id": 3,
                            "text": "Hey! How are you? I'm back home now and school is starting soon.",
                            "is_correct": false,
                            "feedback": "This introduction is too casual and lacks emotional warmth."
                        }
                    ],
                    "body_paragraph_1": [
                        {
                            "id": 1,
                            "text": "My time with you was magical. From the aroma of your homemade cookies to our peaceful morning walks in the garden, every moment was precious.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "I trust this correspondence finds you in satisfactory health.",
                            "is_correct": false,
                            "feedback": "This is far too formal and belongs in the introduction."
                        },
                        {
                            "id": 3,
                            "text": "I had a good time at your house this summer.",
                            "is_correct": false,
                            "feedback": "This is too simple and lacks vivid emotional detail."
                        }
                    ],
                    "body_paragraph_2": [
                        {
                            "id": 1,
                            "text": "You told me lots of stories which were pretty interesting.",
                            "is_correct": false,
                            "feedback": "This paragraph is too casual and vague."
                        },
                        {
                            "id": 2,
                            "text": "What made this summer truly special were the life lessons you imparted. Your stories of resilience and optimism left a profound impact on me.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 3,
                            "text": "I hope you are doing well and will visit again soon.",
                            "is_correct": false,
                            "feedback": "This content belongs in the conclusion, not the body paragraph."
                        }
                    ],
                    "conclusion": [
                        {
                            "id": 1,
                            "text": "Okay, so that's about my visit. It was nice.",
                            "is_correct": false,
                            "feedback": "This conclusion is too casual and abrupt."
                        },
                        {
                            "id": 2,
                            "text": "You are not just my grandmother but my role model and constant inspiration. I cherish the lessons and memories from this summer and eagerly await our next meeting.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 3,
                            "text": "Your stories taught me resilience and perseverance.",
                            "is_correct": false,
                            "feedback": "This content belongs in the body paragraph, not the conclusion."
                        }
                    ],
                    "sign_off": [
                        {
                            "id": 1,
                            "text": "Best regards,",
                            "is_correct": false,
                            "feedback": "'Best regards' is too formal for a letter to one's grandmother."
                        },
                        {
                            "id": 2,
                            "text": "Love",
                            "is_correct": false,
                            "feedback": "A comma should follow 'Love'."
                        },
                        {
                            "id": 3,
                            "text": "Yours lovingly,",
                            "is_correct": true,
                            "feedback": ""
                        }
                    ],
                    "senders_name": [
                        {
                            "id": 1,
                            "text": "Katrina",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "Katrina,",
                            "is_correct": false,
                            "feedback": "A comma is not required after the sender's name."
                        },
                        {
                            "id": 3,
                            "text": "Katrina.",
                            "is_correct": false,
                            "feedback": "A full stop is not required after the sender’s name."
                        }
                    ]
                }
            },
            {
                "title": "familyVacationFriend",
                "sections": {
                    "senders_address": [
                        {
                            "id": 1,
                            "text": "42, Green Park,\nLinking Road,\nBengaluru – 560001.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "42, Green Park\nLinking Road\nBengaluru – 560001.",
                            "is_correct": false,
                            "feedback": "Each line should end with a comma, except the last line."
                        },
                        {
                            "id": 3,
                            "text": "Rajeev Sharma\n42, Green Park,\nLinking Road,\nBengaluru – 560001.",
                            "is_correct": false,
                            "feedback": "The sender's name should not be included in the sender's address."
                        }
                    ],
                    "date": [
                        {
                            "id": 1,
                            "text": "15/08/2026.",
                            "is_correct": false,
                            "feedback": "The date format is incorrect. Write the date in numbers, followed by the month in words, then the year."
                        },
                        {
                            "id": 2,
                            "text": "15 August, 2026.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 3,
                            "text": "August 15, 2026.",
                            "is_correct": false,
                            "feedback": "The day should come before the month."
                        }
                    ],
                    "salutation": [
                        {
                            "id": 1,
                            "text": "Dear Prateek,",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "Hi Prateek",
                            "is_correct": false,
                            "feedback": "This is too casual and a comma should follow the salutation."
                        },
                        {
                            "id": 3,
                            "text": "Dear Prateek",
                            "is_correct": false,
                            "feedback": "A comma should follow the salutation."
                        }
                    ],
                    "introduction": [
                        {
                            "id": 1,
                            "text": "I hope this letter finds you in great spirits. I have been meaning to tell you about the incredible family vacation we had in Shimla last month.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "I am writing to inform you about a recent excursion undertaken by my family.",
                            "is_correct": false,
                            "feedback": "This is far too formal for a letter to a friend."
                        },
                        {
                            "id": 3,
                            "text": "The moment we reached Shimla, I was captivated by its charm.",
                            "is_correct": false,
                            "feedback": "This content belongs in the body paragraph, not the introduction."
                        }
                    ],
                    "body_paragraph_1": [
                        {
                            "id": 1,
                            "text": "Shimla was nice and the mountains were big and pretty.",
                            "is_correct": false,
                            "feedback": "This is too brief and uses vague language."
                        },
                        {
                            "id": 2,
                            "text": "We enjoyed trekking and paragliding during our stay.",
                            "is_correct": false,
                            "feedback": "This describes activities, not scenery. Scenery should be described first."
                        },
                        {
                            "id": 3,
                            "text": "The moment we arrived in Shimla, I was mesmerised by the snow-capped mountains and fresh air. Each morning we admired the sunrise painting the sky in vibrant colours.",
                            "is_correct": true,
                            "feedback": ""
                        }
                    ],
                    "body_paragraph_2": [
                        {
                            "id": 1,
                            "text": "We enjoyed trekking, paragliding, rock climbing and bonfire evenings under the starry sky. The local cuisine was delightful too.",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "We did some activities and stuff. It was okay.",
                            "is_correct": false,
                            "feedback": "This lacks enthusiasm and vivid detail."
                        },
                        {
                            "id": 3,
                            "text": "We participated in various adventurous activities.",
                            "is_correct": false,
                            "feedback": "This reads like a checklist and lacks vivid descriptions."
                        }
                    ],
                    "conclusion": [
                        {
                            "id": 1,
                            "text": "I wish you had been there with us. How about we plan a trip together next summer? Let me know what you think!",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "Anyway, that's about my trip. It was good.",
                            "is_correct": false,
                            "feedback": "This is too casual and abrupt."
                        },
                        {
                            "id": 3,
                            "text": "The scenery in Shimla was beautiful and we enjoyed it.",
                            "is_correct": false,
                            "feedback": "This belongs in the body paragraph, not the conclusion."
                        }
                    ],
                    "sign_off": [
                        {
                            "id": 1,
                            "text": "Regards,",
                            "is_correct": false,
                            "feedback": "'Regards' is too formal for a close friend."
                        },
                        {
                            "id": 2,
                            "text": "See you",
                            "is_correct": false,
                            "feedback": "A proper sign-off phrase followed by a comma is required."
                        },
                        {
                            "id": 3,
                            "text": "With love,",
                            "is_correct": true,
                            "feedback": ""
                        }
                    ],
                    "senders_name": [
                        {
                            "id": 1,
                            "text": "Rajeev",
                            "is_correct": true,
                            "feedback": ""
                        },
                        {
                            "id": 2,
                            "text": "Rajeev Kumar",
                            "is_correct": false,
                            "feedback": "Full name is not used in informal letters to friends."
                        },
                        {
                            "id": 3,
                            "text": "Rajeev,",
                            "is_correct": false,
                            "feedback": "A comma is not required after the sender’s name."
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
        "senders-address-blank", "date-blank", "salutation-blank",
        "introduction-blank", "body-1-blank",
        "body-2-blank", "conclusion-blank", "sign-off-blank",
        "senders-name-blank"
    ]
};

const boxSequence = [
    'senders-address-box',
    'date-box',
    'salutation-box',
    'introduction-box',
    'body-1-box',
    'body-2-box',
    'conclusion-box',
    'sign-off-box',
    'senders-name-box'
];

const lottieContainer = document.getElementById('lottie-container');
const proceedBtn = document.getElementById('proceed-btn');
const practicePageEl = document.getElementById('practice-page');
const practiceResultEl = document.getElementById('practice-result');

const resultImageMap = {
    careerChoiceParents: 'practice-result-careerChoiceParents',
    summerBreakGrandmother: 'practice-result-summerBreakGrandmother',
    familyVacationFriend: 'practice-result-familyVacationFriend'
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
        if (suggestion) {
            suggestion.style.display = 'none';
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
    const topic = state.activeLetter?.title || 'careerChoiceParents';
    const imgId = resultImageMap[topic] || resultImageMap.careerChoiceParents;
    const img = document.getElementById(imgId);
    if (img) img.style.display = 'block';
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
    ['careerChoiceParents', 'summerBreakGrandmother', 'familyVacationFriend'].forEach(id => {
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
                suggestionBox.style.display = 'none';

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
                showFeedback(option.feedback || "Incorrect format. Try again!", suggestionBox);
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
        suggestionBox.style.display = 'block';
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
    //initializeLetterBox('receivers-address-box', 'receivers_address', 'receiversAddress-placeholder');
    initializeLetterBox('salutation-box', 'salutation', 'salutation-placeholder');
    initializeLetterBox('introduction-box', 'introduction', 'introduction-placeholder');
    initializeLetterBox('body-1-box', 'body_paragraph_1', 'bodyParagraph-1-placeholder');
    initializeLetterBox('body-2-box', 'body_paragraph_2', 'bodyParagraph-2-placeholder');
    initializeLetterBox('conclusion-box', 'conclusion', 'conclusion-placeholder');
    initializeLetterBox('sign-off-box', 'sign_off', 'sign-off-placeholder');
    initializeLetterBox('senders-name-box', 'senders_name', 'sendersName-placeholder');

}

// 4. UI Support Functions
function navigateTo(pageId) {
    const pages = ['home-page', 'learn-page', 'practice-page', 'practice-examples'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === pageId) ? 'block' : 'none';
    });

    if(pageId == 'practice-examples'){
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

/**
 * FUNCTION: Injects text into the center of the SVG group
 */
function addTextToSvg(groupElement, label) {
    // Get the bounding box of the paths to find the center
    const bbox = groupElement.getBBox();

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

function showFeedback(msg, anchorEl) {
    if (!anchorEl) return;
    let feedbackEl = anchorEl.querySelector('.feedback-text');
    if (!feedbackEl) {
        feedbackEl = document.createElement('div');
        feedbackEl.className = 'feedback-text';
        anchorEl.appendChild(feedbackEl);
    }
    feedbackEl.textContent = msg || 'Incorrect format. Try again!';
    feedbackEl.classList.add('is-visible');
    // const hide = () => {
    //     feedbackEl.classList.remove('is-visible');
    // };
    // const t = setTimeout(hide, 5000);
    // feedbackEl._hideTimeout = t;
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
        if (suggestion) {
            suggestion.style.display = 'none';
            hideFeedback(suggestion);
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