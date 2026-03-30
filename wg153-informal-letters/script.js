
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
                        "text": "Hi! How are you both doing? I'm doing well here at school and everything is good. I wanted to tell you about something I've been thinking about a lot lately regarding what I want to do after I finish school here.",
                        "is_correct": false,
                        "feedback": "This introduction is too casual with 'Hi!' and lacks the warmth appropriate for discussing an important decision. The phrase 'everything is good' is vague."
                    },
                    {
                        "id": 3,
                        "text": "I am writing to apprise you of my future career aspirations and vocational objectives. I trust this correspondence finds you in satisfactory health and elevated spirits.",
                        "is_correct": false,
                        "feedback": "This sounds too formal for an informal letter to parents. The tone should be warmer and more conversational."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "I have been thinking about what to do after school and I've decided on environmental science. I like nature and going outdoors, so I think this would be a good career for me. It seems interesting and I believe I would enjoy studying it.",
                        "is_correct": false,
                        "feedback": "This paragraph is too casual and vague. Phrases like 'I like nature' and 'going outdoors' don't demonstrate mature career thinking. It lacks specific reasons or deep understanding of the field."
                    },
                    {
                        "id": 2,
                        "text": "After much thought, I've decided to pursue a career in environmental science and conservation. This stems from my deep love for the environment and desire to make a positive impact on our planet, especially given the pressing environmental issues our world faces today.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Climate change, deforestation and habitat destruction are having harmful effects on our ecosystem, and I want to be part of the solution. I believe that I can contribute to the preservation of our planet for future generations.",
                        "is_correct": false,
                        "feedback": "This discusses why the career is important but doesn't state what career has been chosen. The specific career decision should be mentioned before explaining the reasons for choosing it."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "Climate change, deforestation and habitat destruction are harming our ecosystems, and I want to be part of the solution. I believe I can contribute to preserving our planet for future generations. Though challenges may arise, I'm determined to work hard and make a difference.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "There are lots of environmental problems like pollution and stuff. Climate change is really bad and I want to help fix these issues. I think it would be cool to work on saving the environment and making things better for everyone.",
                        "is_correct": false,
                        "feedback": "Phrases like 'lots of', 'and stuff', 'really bad', 'it would be cool' is inappropriate for discussing serious career goals. It lacks depth and specific understanding of environmental issues."
                    },
                    {
                        "id": 3,
                        "text": "I hope this letter finds you both in good health. I wanted to share something important with you regarding my future plans after completing my education here at the boarding school.",
                        "is_correct": false,
                        "feedback": "This content belongs in the introduction, not the body paragraph. Additionally, it is too formal for a letter to parents. The body should discuss career reasons, not repeat introductory greetings."
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "I request that you provide your feedback regarding this career decision. I anticipate your approval and support for pursuing this educational path. Please communicate your thoughts on this matter in due course. I remain grateful for your continued guidance throughout my academic endeavours.",
                        "is_correct": false,
                        "feedback": "This conclusion is too formal and transactional. Phrases like 'in due course' and 'I remain grateful' sound like business correspondence rather than a warm letter to parents seeking guidance and expressing love."
                    },
                    {
                        "id": 2,
                        "text": "Your advice and support mean the world to me. I hope you will consider my choice and help me achieve my goals. Thank you for always being there for me. Your unwavering support has been my greatest strength, and I know that with your guidance, I can excel in this field too.",
                        "is_correct": false,
                        "feedback": "This conclusion is missing the specific field name (environmental science). It's too vague about what the writer wants to achieve and doesn't clearly restate the request for support in pursuing environmental science."
                    },
                    {
                        "id": 3,
                        "text": "Your advice and support mean the world to me. I hope you'll consider my choice and help me achieve my goals in environmental science. Thank you for always nurturing my dreams. Your unwavering support has been my greatest strength, and with your guidance, I know I can excel in this field too.",
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
                        "text": "I hope you are doing well and finding joy in each day. As I sit down to write this letter, I am flooded with gratitude for the wonderful time I spent with you during my summer break.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "My days with you were filled with quiet joy. From the sweet smell of your baking drifting through the house to the reassurance of your gentle hugs, every instant felt special. I will always cherish our early walks in the garden, where you shared your love for each plant and taught me how to care for them with patience and pride.",
                        "is_correct": false,
                        "feedback": "This content belongs in the body paragraph, not the introduction. The introduction should greet the recipient and state the purpose of writing, not jump directly into describing specific memories."
                    },
                    {
                        "id": 3,
                        "text": "Hey! How are you? I'm back home now and school is starting soon. I just wanted to write and tell you that I had a really nice time at your place during the holidays. It was fun spending time with you.",
                        "is_correct": false,
                        "feedback": "This introduction is too casual with 'Hey!' and 'It was fun'. The phrase 'really nice time' is vague and doesn't convey the emotional depth appropriate for writing to a beloved grandmother."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "My time with you was nothing short of magical. From the aroma of your delicious homemade cookies to the warmth of your embrace, every moment felt like a treasure. The memories of our morning walks in the garden will forever be etched in my heart.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I trust this correspondence finds you in satisfactory health and good spirits. I am writing to express my appreciation for your hospitality during my recent visit to your residence throughout the duration of my summer vacation period.",
                        "is_correct": false,
                        "feedback": "This is far too formal for a letter to one's grandmother and belongs in the introduction, not the body. Words like 'correspondence', 'satisfactory health' and 'duration of my summer vacation period' sound cold. The body should describe specific memories, not repeat greetings."
                    },
                    {
                        "id": 3,
                        "text": "I had a good time at your house this summer. Your food was tasty and we did lots of things together every day. I liked the walks we took in the garden where you showed me the plants and told me their names.",
                        "is_correct": false,
                        "feedback": "This paragraph is too simple and brief. It lacks the vivid sensory details and emotional warmth that would make the memories come alive. Phrases like 'good time' and 'lots of things' are vague."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "You told me lots of stories about your life which were pretty interesting. I learnt some good things from you. Your advice was helpful and I'll try to remember what you told me when I need it.",
                        "is_correct": false,
                        "feedback": "This paragraph is too casual and vague. Phrases like 'pretty interesting', 'some good things' and 'I'll try to remember' don't convey genuine impact or specific lessons learnt from the grandmother."
                    },
                    {
                        "id": 2,
                        "text": "What made this summer truly special were the life lessons you imparted. Your stories of resilience during challenging times and your unwavering optimism have left a profound impact on me. Your wisdom has taught me the importance of perseverance, kindness and the value of family bonds.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "I hope you are doing well. Thank you for having me at your house this summer. I will visit again during the next holidays if possible. Please take care of yourself and stay healthy. I look forward to seeing you soon.",
                        "is_correct": false,
                        "feedback": "This content belongs in the conclusion, not the body paragraph. The body should discuss life lessons learnt, not closing remarks. These are concluding thoughts that should come at the end of the letter."
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "Okay, so that's about my visit. It was nice. I'll probably come again next holidays if I get time. Take care of yourself and eat properly. Say hi to everyone for me. Bye for now, talk to you later.",
                        "is_correct": false,
                        "feedback": "This conclusion is far too casual and abrupt. Phrases like 'Okay, so', 'It was nice', 'if I get time' and 'Bye for now' don't express genuine love, gratitude or emotional connection with the grandmother."
                    },
                    {
                        "id": 2,
                        "text": "I want you to know how much you mean to me. You're not just my grandmother but my role model and constant inspiration. Your love and guidance have shaped who I am today. As I return to my studies, I carry these cherished memories and cannot wait for our next meeting.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "What made this summer truly special were the life lessons you shared with me. Your stories taught me about resilience and perseverance. I have learnt so much from you about kindness and the importance of staying positive during difficult times.",
                        "is_correct": false,
                        "feedback": "This content belongs in the body paragraph, not the conclusion. The conclusion should express overall feelings and future hopes, not introduce new details about life lessons. These thoughts should have appeared earlier in the letter."
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
                        "text": "I hope this letter finds you in great spirits. I've been meaning to write to you about the incredible family vacation we had in Shimla last month. The experience was so amazing that I simply had to share it with you!",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I am writing to inform you about a recent excursion undertaken by my family to the hill station of Shimla. I trust you will find the details and particulars of our journey to be of some interest to you as my friend.",
                        "is_correct": false,
                        "feedback": "This is far too formal for a letter to a friend. Phrases like 'inform you about', 'excursion undertaken' and 'particulars of our journey' sound like a travel report rather than an enthusiastic letter."
                    },
                    {
                        "id": 3,
                        "text": "The moment we reached Shimla, I was captivated by its old-world charm. The rolling hills stretched endlessly, dotted with tall deodar trees that swayed gently in the cool breeze. The crisp air carried a hint of pine, making every breath feel pure and invigorating. We spent our days exploring the bustling Mall Road, sipping hot tea at cosy cafés, and watching the sunset paint the sky in shades of gold and pink.",
                        "is_correct": false,
                        "feedback": "This content belongs in the body paragraph, not the introduction. The introduction should greet the friend and mention the trip, not jump directly into detailed descriptions of the scenery."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "Shimla was nice. The mountains were big and pretty, and there was snow on them which looked cool. We went for walks and saw different things. The weather was good and we had a nice time there overall.",
                        "is_correct": false,
                        "feedback": "This paragraph is too brief and uses vague, simple language. Words like 'nice', 'big', 'pretty', 'cool' and 'different things' don't create vivid imagery or convey genuine excitement about the experience."
                    },
                    {
                        "id": 2,
                        "text": "We also enjoyed several adventurous activities. Trekking through the dense forests was thrilling, while paragliding with my dad was absolutely exhilarating! Rock climbing and zip-lining added even more excitement to our days. In the evenings, we would gather around a bonfire.",
                        "is_correct": false,
                        "feedback": "This describes activities, not scenery. The first body paragraph should focus on describing the breathtaking scenery of Shimla, while adventurous activities should be discussed in the second body paragraph."
                    },
                    {
                        "id": 3,
                        "text": "The moment we arrived in Shimla, I was mesmerised by the breathtaking scenery. Snow-capped mountains surrounded us, and the fresh mountain air was incredibly refreshing. We took numerous walks along picturesque trails that led us to hidden waterfalls and stunning viewpoints. Each morning, we woke up to the sight of the sun rising over the mountains, painting the sky in shades of orange and pink.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "We also indulged in several adventurous activities. Trekking through the dense forests was thrilling, and my dad and I tried paragliding, which was absolutely exhilarating! We also went for rock climbing and zip-lining. In the evenings, we would gather around a bonfire, sharing stories under the starry night sky. The local cuisine was delightful too!",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "We did some activities like trekking and stuff. It was fun. We also tried paragliding which was okay. At night we sat around a fire and talked. The food was alright, nothing special but we ate it anyway.",
                        "is_correct": false,
                        "feedback": "This paragraph lacks enthusiasm and detail. Phrases like 'and stuff', 'was okay', 'alright, nothing special' and 'we ate it anyway' don't convey excitement or make the experience sound memorable or worth sharing."
                    },
                    {
                        "id": 3,
                        "text": "We participated in various adventurous activities during our stay. We did trekking, paragliding, rock climbing and zip-lining. We also spent time in the evenings doing different activities. We tried the local food which included several traditional dishes of the region.",
                        "is_correct": false,
                        "feedback": "This paragraph reads like a checklist rather than an engaging account. It lacks vivid descriptions, personal emotions and specific sensory details that would make the experiences come alive for the friend. The writing is flat and fails to convey excitement."
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "Prateek, this trip made me realise how much I miss spending time with you. I wish you had been there to share these wonderful moments. How about we plan a vacation together during the next summer break? It would be amazing to explore a new place with you and create more unforgettable memories. Let me know what you think!",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Anyway, that's about my trip. It was good. Maybe we can go somewhere together sometime if you're free. Just let me know. Okay, I should go now. Catch you later. Bye!",
                        "is_correct": false,
                        "feedback": "This conclusion is too casual and abrupt. Phrases like 'Anyway', 'if you're free', 'Just let me know', 'I should go now' and 'Catch you later' don't express genuine desire to travel together or emotional connection."
                    },
                    {
                        "id": 3,
                        "text": "The scenery in Shimla was absolutely beautiful and breathtaking. The mountains, the fresh air and the stunning views made it a perfect vacation spot. We enjoyed every moment of our stay there and made wonderful family memories together.",
                        "is_correct": false,
                        "feedback": "This content belongs in the body paragraph, not the conclusion. The conclusion should express the desire to travel with the friend in the future, not continue describing the scenery and family experience."
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
    const topic = state.activeLetter?.title || 'careerChoiceParents';
    const imgId = resultImageMap[topic] || resultImageMap.careerChoiceParents;
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
            .forEach(p => { p.style.display = "none"; if (p.parentElement && p.parentElement.tagName.toLowerCase() === 'foreignobject') p.parentElement.style.display = "none"; });
    });

});