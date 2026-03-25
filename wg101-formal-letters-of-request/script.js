
const letterData = {

    "letters": [
        {
            "title": "vocationalCourse",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "Jyoti Saraf\nJeevan Institution,\nManohar Nagar,\nRajkot – 360001.",
                        "is_correct": false,
                        "feedback": "Sender’s name is not included in the sender’s address."
                    },
                    {
                        "id": 2,
                        "text": "Jeevan Institution,\nManohar Nagar,\nRajkot – 360001.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Jeevan Institution\nManohar Nagar\nRajkot – 360001.",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma, except the last line."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "21 April, 2026.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "April 21, 2026.",
                        "is_correct": false,
                        "feedback": "The day should come before the month."
                    },
                    {
                        "id": 3,
                        "text": "21 04, 2026.",
                        "is_correct": false,
                        "feedback": "Month should be written in words not numbers."
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "The Principal\nJeevan Institution\nRajkot – 360001.",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma, except the last line."
                    },
                    {
                        "id": 2,
                        "text": "The Principal,\nJeevan Institution,\nRajkot – 360001.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "The Principal,\nJeevan Institution,\nRajkot",
                        "is_correct": false,
                        "feedback": "The pin code must be included in the address."
                    }
                ],
                "salutation": [
                    {
                        "id": 1,
                        "text": "Dear Madam",
                        "is_correct": false,
                        "feedback": "A comma should follow the salutation."
                    },
                    {
                        "id": 2,
                        "text": "Dear Madam,",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Dear Madam Principal,",
                        "is_correct": false,
                        "feedback": "Use just ‘Sir’ or ‘Madam’. Designation is not used in the salutation."
                    }
                ],
                "introduction": [
                    {
                        "id": 1,
                        "text": "I am writing to bring to your attention the importance of vocational skills and life skills education, which I believe could benefit our students greatly.",
                        "is_correct": false,
                        "feedback": "This introduction doesn't clearly state the purpose (to suggest/request introducing a course). It lacks specificity about what action is being requested."
                    },
                    {
                        "id": 2,
                        "text": "I am writing this letter to suggest introducing a vocational skills course for the students of Grade 10 of our school to help students develop life skills.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "I am writing this letter because I feel that our Grade 10 students really need a vocational skills course as I think life skills are very important for them to learn.",
                        "is_correct": false,
                        "feedback": "This introduction uses informal tone (‘I feel’, ‘I think’, ‘really need’) and repetitive first-person opinion."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "In today's ever-evolving world, academic knowledge alone is not enough to ensure a bright and prosperous career. A vocational skills course can empower students with practical abilities such as communication skills, problem-solving, teamwork, time management, and technical expertise.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "In today's competitive world, students need a lot of exposure. A vocational skills course would be very beneficial for their future.",
                        "is_correct": false,
                        "feedback": "The language used is informal and vague without specific examples of skills included in the course."
                    },
                    {
                        "id": 3,
                        "text": "In today's world, it is absolutely crucial and extremely important that we realise academic knowledge is simply not sufficient anymore.",
                        "is_correct": false,
                        "feedback": "The language is overly dramatic and makes exaggerated claims without supporting evidence."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "Besides, a vocational skills course would be good for students to explore their interests outside the classroom.",
                        "is_correct": false,
                        "feedback": "This paragraph uses repetitive and vague language and lacks sophistication."
                    },
                    {
                        "id": 2,
                        "text": "Besides, a vocational skills course would allow students to explore their interests beyond academics, unlike the current curriculum.",
                        "is_correct": false,
                        "feedback": "This paragraph introduces unnecessary criticism and negative tone."
                    },
                    {
                        "id": 3,
                        "text": "Besides, a vocational skills course would allow students to explore their interests and aptitudes beyond traditional classroom settings. Moreover, it promotes inclusivity by catering to diverse talents.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "The introduction of a vocational skills course will greatly benefit the students. Madam, I kindly request your consideration and support in implementing this program at our school.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "The introduction of a vocational skills course will greatly benefit the students, helping you to succeed in their future careers.",
                        "is_correct": false,
                        "feedback": "This shifts from third person to second person and uses redundant phrases."
                    },
                    {
                        "id": 3,
                        "text": "I am sure you will agree that a vocational skills course will greatly benefit our students.",
                        "is_correct": false,
                        "feedback": "This assumes agreement and sounds presumptuous."
                    }
                ],
                "complimentary_close": [
                    {
                        "id": 1,
                        "text": "Thanks a lot,\nYours truly,",
                        "is_correct": false,
                        "feedback": "‘Thanks a lot’ is too informal for a formal letter."
                    },
                    {
                        "id": 2,
                        "text": "Thank you\nRegards",
                        "is_correct": false,
                        "feedback": "A comma should follow ‘Thank you’. ‘Regards’ is too informal."
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
                        "text": "Jyoti Saraf,",
                        "is_correct": false,
                        "feedback": "A comma is not required after the sender’s name."
                    },
                    {
                        "id": 2,
                        "text": "Jyoti Saraf.",
                        "is_correct": false,
                        "feedback": "A full stop is not required after the sender’s name."
                    },
                    {
                        "id": 3,
                        "text": "Jyoti Saraf",
                        "is_correct": true,
                        "feedback": ""
                    }
                ]
            }
        },
        {
            "title": "excursionTour",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "Royal Heritage School\nDelhi – 110021.",
                        "is_correct": false,
                        "feedback": "The first line of sender’s address should end with a comma."
                    },
                    {
                        "id": 2,
                        "text": "Royal Heritage School,\nDelhi – 110021.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Perin Mistry\nRoyal Heritage School,\nDelhi – 110021.",
                        "is_correct": false,
                        "feedback": "The sender’s name should not be included in the sender’s address."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "15th 01, 2026",
                        "is_correct": false,
                        "feedback": "The month should be written in words."
                    },
                    {
                        "id": 2,
                        "text": "January 15th, 2026.",
                        "is_correct": false,
                        "feedback": "The day should come before the month."
                    },
                    {
                        "id": 3,
                        "text": "15th January, 2026.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "To,\nThe Principal,\nRoyal Heritage School,\nDelhi – 110021.",
                        "is_correct": false,
                        "feedback": "‘To’ is not required in receiver’s address."
                    },
                    {
                        "id": 2,
                        "text": "The Principal,\nRoyal Heritage School,\nDelhi",
                        "is_correct": false,
                        "feedback": "The PIN code is missing."
                    },
                    {
                        "id": 3,
                        "text": "The Principal,\nRoyal Heritage School,\nDelhi – 110021.",
                        "is_correct": true,
                        "feedback": ""
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
                        "text": "Hello Sir,",
                        "is_correct": false,
                        "feedback": "‘Hello’ is too informal for a formal letter. Use ‘Dear’ instead."
                    },
                    {
                        "id": 3,
                        "text": "Principal Sir,",
                        "is_correct": false,
                        "feedback": "Use ‘Dear Sir’ or ‘Dear Madam’ instead."
                    }
                ],
                "introduction": [
                    {
                        "id": 1,
                        "text": "I am writing this letter to request an excursion tour to the magnificent city of Hyderabad for the Class 10 students of our school. Excursions offer a unique learning experience beyond the classroom environment.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I am writing this letter because I really think our Class 10 students should go on an excursion tour to Hyderabad.",
                        "is_correct": false,
                        "feedback": "This introduction uses informal expressions and is overly opinion-based."
                    },
                    {
                        "id": 3,
                        "text": "I am writing to discuss the possibility of organising educational trips for our students.",
                        "is_correct": false,
                        "feedback": "This does not clearly state the specific request."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "Hyderabad is a city steeped in history and culture. It includes sites such as the Charminar, Golconda Fort and the Salar Jung Museum, offering students first-hand cultural experience.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Hyderabad is an absolutely amazing city with so much history and culture!",
                        "is_correct": false,
                        "feedback": "Overly enthusiastic and informal language has been used."
                    },
                    {
                        "id": 3,
                        "text": "Hyderabad is a very famous historical city with many monuments.",
                        "is_correct": false,
                        "feedback": "The language is simplistic and lacks specific details."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "Excursions are very useful for students as they learn many important things.",
                        "is_correct": false,
                        "feedback": "This paragraph uses vague language without specific examples."
                    },
                    {
                        "id": 2,
                        "text": "I have heard that excursions are really good for students.",
                        "is_correct": false,
                        "feedback": "Personal and subjective language has been used."
                    },
                    {
                        "id": 3,
                        "text": "It is widely acknowledged that excursions provide students opportunities for social and personal growth. They promote teamwork, independence and problem-solving skills.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "I kindly request your consideration and approval for this excursion to Hyderabad. I believe this trip will be a valuable educational experience.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I am sure this trip will be really enjoyable and fun for all of us.",
                        "is_correct": false,
                        "feedback": "This uses overly casual tone."
                    },
                    {
                        "id": 3,
                        "text": "Please give your approval for this excursion.",
                        "is_correct": false,
                        "feedback": "This sounds abrupt and impolite."
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
                        "text": "Thanks and Regards,",
                        "is_correct": false,
                        "feedback": "Too informal for a formal letter."
                    },
                    {
                        "id": 3,
                        "text": "Thanking you,\n\nYour’s sincerely,",
                        "is_correct": false,
                        "feedback": "An apostrophe is not used in ‘Yours’."
                    }
                ],
                "senders_name": [
                    {
                        "id": 1,
                        "text": "Perin Mistry,",
                        "is_correct": false,
                        "feedback": "A comma is not required after the sender’s name."
                    },
                    {
                        "id": 2,
                        "text": "Perin Mistry",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Perin Mistry.",
                        "is_correct": false,
                        "feedback": "A full stop is not required after the sender’s name."
                    }
                ]
            }
        },
        {
            "title": "sportsEventSponsorship",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "Grande Housing Society,\nRawat Road,\nMumbai – 402 015.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Grande Housing Society\nRawat Road\nMumbai – 402 015.",
                        "is_correct": false,
                        "feedback": "Commas after the first two lines of the address are missing."
                    },
                    {
                        "id": 3,
                        "text": "Grande Housing Society,\nRawat Road,\nMumbai 402 015.",
                        "is_correct": false,
                        "feedback": "The PIN code should include a hyphen."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "02 May, 2026.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "02 May, 26.",
                        "is_correct": false,
                        "feedback": "The year needs to be written in full."
                    },
                    {
                        "id": 3,
                        "text": "May 02, 2026.",
                        "is_correct": false,
                        "feedback": "The date format is incorrect. The day should come first."
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "The Manager\nMilind Sports Emporium\nDesai Road\nMumbai – 402 015.",
                        "is_correct": false,
                        "feedback": "The commas at the end of each line are missing."
                    },
                    {
                        "id": 2,
                        "text": "Milind Sports Emporium,\nDesai Road,\nMumbai – 402 015.",
                        "is_correct": false,
                        "feedback": "The designation (The Manager) is missing."
                    },
                    {
                        "id": 3,
                        "text": "The Manager,\nMilind Sports Emporium,\nDesai Road,\nMumbai – 402 015.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "salutation": [
                    {
                        "id": 1,
                        "text": "Hello Sir,",
                        "is_correct": false,
                        "feedback": "This is too informal."
                    },
                    {
                        "id": 2,
                        "text": "Dear Sir,",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Dear Sir/Madam",
                        "is_correct": false,
                        "feedback": "A comma should follow the salutation."
                    }
                ],
                "introduction": [
                    {
                        "id": 1,
                        "text": "I am Rita Andrews, a resident of Grande Housing Society. I am writing to seek your sponsorship for our upcoming Annual Sports Event, scheduled for 20 December, 2023.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I am writing to request sponsorship for our sports event.",
                        "is_correct": false,
                        "feedback": "This introduction lacks specific details and sounds vague."
                    },
                    {
                        "id": 3,
                        "text": "I am Reva Arora, a resident of Grande Housing Society for five years.",
                        "is_correct": false,
                        "feedback": "This includes irrelevant and excessive information."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "Our sports event is a cherished tradition bringing together residents of all ages to participate in badminton, table tennis and mini marathon.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Our sports event is very popular and many residents participate.",
                        "is_correct": false,
                        "feedback": "This lacks specific details and uses simplistic vocabulary."
                    },
                    {
                        "id": 3,
                        "text": "Our sports event is wonderful and everyone has so much fun.",
                        "is_correct": false,
                        "feedback": "Personal opinion and informal phrases have been used."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "We need financial support for equipment and prizes.",
                        "is_correct": false,
                        "feedback": "This sounds demanding and lacks formal tone."
                    },
                    {
                        "id": 2,
                        "text": "Furthermore, we are seeking financial support to cover expenses such as equipment and prizes. In return, we will display your logo on banners and promotional materials.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "We believe you would be an ideal sponsor and will display your logo.",
                        "is_correct": false,
                        "feedback": "The structure is illogical and places benefits before explaining the need."
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "For any queries, please contact our society office. Thank you for considering our request. We look forward to partnering with you.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Call us if you have questions. We are waiting for your reply.",
                        "is_correct": false,
                        "feedback": "This is abrupt and lacks professional tone."
                    },
                    {
                        "id": 3,
                        "text": "We are confident that you will agree to sponsor our event.",
                        "is_correct": false,
                        "feedback": "This assumes approval and sounds presumptuous."
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
                        "text": "With warm regards,",
                        "is_correct": false,
                        "feedback": "Too informal for a formal letter."
                    },
                    {
                        "id": 3,
                        "text": "Thanking you\n\nYours sincerely",
                        "is_correct": false,
                        "feedback": "The commas are missing."
                    }
                ],
                "senders_name": [
                    {
                        "id": 1,
                        "text": "Rita Andrews",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Ms. Rita Andrews",
                        "is_correct": false,
                        "feedback": "‘Ms.’ is not added to the sender’s name."
                    },
                    {
                        "id": 3,
                        "text": "Rita Andrews,",
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
    vocationalCourse: 'practice-result-vocationalCourse',
    excursionTour: 'practice-result-excursionTour',
    sportsEventSponsorship: 'practice-result-sportsEventSponsorship'
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
    const topic = state.activeLetter?.title || 'vocationalCourse';
    const imgId = resultImageMap[topic] || resultImageMap.vocationalCourse;
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
    ['vocationalCourse', 'excursionTour', 'sportsEventSponsorship'].forEach(id => {
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
        .forEach(p => { p.style.display = "none"; if (p.parentElement && p.parentElement.tagName.toLowerCase() === 'foreignobject') p.parentElement.style.display = "none"; });

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
        .forEach(p => { p.style.display = "none"; if (p.parentElement && p.parentElement.tagName.toLowerCase() === 'foreignobject') p.parentElement.style.display = "none"; });

    const popup = document.getElementById(popupId);
    console.log(popup);

    if (popup) { popup.style.display = "block"; if (popup.parentElement && popup.parentElement.tagName.toLowerCase() === 'foreignobject') popup.parentElement.style.display = "block"; }
}

/**
 * FUNCTION: Injects text into the center of the SVG group
 */
function addTextToSvg(groupElement, label) {
    // Get the bounding box of the paths to find the center
    // const bbox = groupElement.getBBox();
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
    document.querySelectorAll(".svg-popup")
        .forEach(p => { p.style.display = "none"; if (p.parentElement && p.parentElement.tagName.toLowerCase() === 'foreignobject') p.parentElement.style.display = "none"; });

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
            .forEach(p => { p.style.display = "none"; if (p.parentElement && p.parentElement.tagName.toLowerCase() === 'foreignobject') p.parentElement.style.display = "none"; });
    });

});