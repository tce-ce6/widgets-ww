
const letterData = {
    "letters": [
        {
            "title": "smartPhone",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "Windchime Apartments,\nAnantpur Road,\nRaipur – 300 102.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "James Fernandes,\nWindchime Apartments,\nAnantpur Road,\nRaipur – 300 102.",
                        "is_correct": false,
                        "feedback": "The sender’s name should not be included in the sender’s address."
                    },
                    {
                        "id": 3,
                        "text": "Windchime Apartments\nAnantpur Road\nRaipur – 300 102.",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma, except the last line."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "12 November, 2025.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "November, 12, 2025.",
                        "is_correct": false,
                        "feedback": "The day should come before the month."
                    },
                    {
                        "id": 3,
                        "text": "12 11, 2025.",
                        "is_correct": false,
                        "feedback": "The month should be written in words not numbers."
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "The Manager\nRingtone\nRaipur – 300 102.",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma, except the last line."
                    },
                    {
                        "id": 2,
                        "text": "The Manager,\nRingtone,\nRaipur – 300 102.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Mr Das\nThe Manager,\nRingtone,\nRaipur – 300 102.",
                        "is_correct": false,
                        "feedback": "The recipient’s name is not required when the designation is used."
                    }
                ],
                "salutation": [
                    {
                        "id": 1,
                        "text": "Dear Sir",
                        "is_correct": false,
                        "feedback": "A comma should follow the salutation."
                    },
                    {
                        "id": 2,
                        "text": "Dear Sir,",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Dear Mr. Manager,",
                        "is_correct": false,
                        "feedback": "Use ‘Sir’ or ‘Madam’ when the recipient’s name is unknown. ‘Mr. Manager’ is incorrect."
                    }
                ],
                "introduction": [
                    {
                        "id": 1,
                        "text": "I am writing to tell you about this phone I bought from your shop. On 25 October this year, I got a brand-new smartphone, model XP401, from your store, and honestly it has been giving me so many problems that I just had to write to you about it.",
                        "is_correct": false,
                        "feedback": "This option uses informal language such as ‘tell you’, ‘shop’, ‘got’ and ‘honestly’."
                    },
                    {
                        "id": 2,
                        "text": "I am writing to express my disappointment and frustration with a recent purchase I made at your electronics store. On 25th of October this year, I purchased a brand-new smartphone, model XP401, from your store. I regret to inform you that I have encountered a series of issues with the device.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "I wanted to drop you a quick note about a smartphone I picked up from your store recently. On 25 October this year, I purchased a brand-new model XP401, and I must say it has not been working properly at all, which is really quite annoying for me.",
                        "is_correct": false,
                        "feedback": "Phrases such as ‘drop you a quick note’, ‘picked up’ and ‘really quite annoying’ are too informal for a formal letter of complaint."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "Firstly, a bunch of apps on the phone keep crashing all the time, and I can’t get anything done properly because of this. Secondly, the battery is just terrible and dies super quickly even when I’m barely using it. Lastly, the phone keeps freezing and shutting down on its own, and I’ve lost so much of my important stuff because of it.",
                        "is_correct": false,
                        "feedback": "Expressions such as ‘a bunch of,’ ‘super quickly,’ ‘barely using’ and ‘so much of my important stuff.’ are informal."
                    },
                    {
                        "id": 2,
                        "text": "Firstly, the apps on this device are always giving me trouble and stopping suddenly, which is so frustrating when I am trying to do my work. Secondly, the battery runs out way too fast, like I have to charge it multiple times a day even if I don’t use it much. Lastly, the system keeps crashing out of nowhere and I end up losing all my data, which is really annoying.",
                        "is_correct": false,
                        "feedback": "Phrases like ‘giving me trouble,’ ‘way too fast,’ ‘like I have to,’ ‘out of nowhere’ and ‘really annoying’ are too conversational for a formal letter of complaint."
                    },
                    {
                        "id": 3,
                        "text": "Firstly, several pre-installed and downloaded applications on the device consistently crash, making it nearly impossible for me to perform essential tasks efficiently. Secondly, the battery life of the phone is alarmingly short-lived. Even with minimal usage, the battery drains rapidly. Lastly, the smartphone frequently experiences system crashes, resulting in data loss.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "I have performed factory resets on the device as suggested by your store’s support team. I would like to request a replacement or a refund, whichever you think is best for me. I am not sure if I still have the receipt, but I will try to find it and send it to you later if needed.",
                        "is_correct": false,
                        "feedback": "This option is incorrect because it lacks assertiveness and clarity."
                    },
                    {
                        "id": 2,
                        "text": "I have performed factory resets on the device as suggested by your store’s support team. I request a replacement smartphone of the same model that functions correctly, or I kindly request a full refund for the purchase price of the smartphone. I have enclosed copies of my purchase receipt.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "I have performed factory resets on the device as suggested by your store’s support team. I demand that you immediately replace my smartphone with a better model and also provide compensation for the trouble I have faced. I expect this matter to be resolved within two days or I will take legal action against your company.",
                        "is_correct": false,
                        "feedback": "The tone is too aggressive. Formal letters should always be polite even if they are a complaint."
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "I appreciate your attention to this matter and look forward to a prompt and positive response.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I trust you will look into this matter whenever you get the time. I hope to hear from you soon.",
                        "is_correct": false,
                        "feedback": "Phrases like ‘whenever you get the time’ and ‘hope to hear from you soon’ are too informal and undermine the seriousness of the complaint."
                    },
                    {
                        "id": 3,
                        "text": "I hope you will do something about this soon because I am really tired of dealing with this faulty phone. Please get back to me as quickly as possible.",
                        "is_correct": false,
                        "feedback": "Phrases like ‘do something about this’ and ‘really tired of dealing with,’ sound impatient rather than professionally courteous."
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
                        "feedback": "A comma should follow ‘Thank you’. ‘Regards’ is too informal for a formal letter."
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
                        "text": "James Fernandes,",
                        "is_correct": false,
                        "feedback": "A comma is not required after the sender’s name."
                    },
                    {
                        "id": 2,
                        "text": "James Fernandes.",
                        "is_correct": false,
                        "feedback": "A full stop is not required after the sender’s name."
                    },
                    {
                        "id": 3,
                        "text": "James Fernandes",
                        "is_correct": true,
                        "feedback": ""
                    }
                ]
            }
        },
        {
            "title": "parking",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "14 Lakshmi Nagar,\nMG Road,\nPune – 411 001.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "14 Lakshmi Nagar\nMG Road\nPune 411 001.",
                        "is_correct": false,
                        "feedback": "The first two lines should end with a comma. The PIN code should include a hyphen."
                    },
                    {
                        "id": 3,
                        "text": "Rohan Mehta\n14 Lakshmi Nagar,\nMG Road,\nPune – 411 001.",
                        "is_correct": false,
                        "feedback": "The sender’s name should not be included in the sender’s address."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "November 15, 25",
                        "is_correct": false,
                        "feedback": "The year should be written as 2025."
                    },
                    {
                        "id": 2,
                        "text": "November 15, 2025.",
                        "is_correct": false,
                        "feedback": "The day should come before the month."
                    },
                    {
                        "id": 3,
                        "text": "15 November, 2025.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "Traffic Police Commissioner\nPune Traffic Police\nPune",
                        "is_correct": false,
                        "feedback": "The PIN code is missing."
                    },
                    {
                        "id": 2,
                        "text": "To,\nThe Traffic Police Commissioner,\nPune City Traffic Police,\nRacecourse Road,\nPune – 460 001.",
                        "is_correct": false,
                        "feedback": "‘To’ is not required in receiver’s address."
                    },
                    {
                        "id": 3,
                        "text": "The Traffic Police Commissioner,\nPune City Traffic Police,\nRacecourse Road,\nPune – 460 001.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "salutation": [
                    {
                        "id": 1,
                        "text": "Dear Madam,",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Hello Madam,",
                        "is_correct": false,
                        "feedback": "Hello’ is too informal for a formal letter. Use ‘Dear’ instead."
                    },
                    {
                        "id": 3,
                        "text": "Respected Commissioner Madam,",
                        "is_correct": false,
                        "feedback": "This salutation is too elaborate. Use ‘Dear Sir’ or ‘Dear Madam’ instead."
                    }
                ],
                "introduction": [
                    {
                        "id": 1,
                        "text": "I am writing to bring to your attention the serious issue of illegal parking in our residential area. This problem has persisted for several months and has caused considerable inconvenience and safety concerns for all residents.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I am a resident of 14 Lakshmi Nagar, MG Road, and I wanted to tell you about the parking problem in our area. This has been happening for a few months now and it is really causing a lot of trouble for everyone living here.",
                        "is_correct": false,
                        "feedback": "Phrases such as ‘wanted to tell you,’ ‘really causing a lot of trouble’ are too informal for a formal letter."
                    },
                    {
                        "id": 3,
                        "text": "Vehicles are being parked illegally on our narrow roads, blocking traffic and emergency access. This has been happening for several months now, causing accidents and safety hazards. The local police station has not taken any action despite complaints from residents.",
                        "is_correct": false,
                        "feedback": "This option jumps directly into the complaint without introducing the writer or establishing context."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "Firstly, vehicles are parked all over the narrow roads in our area, making it almost impossible for people to drive through properly. Secondly, ambulances and fire engines cannot get through when there is an emergency because of all the cars blocking the way. Lastly, there have been a few small accidents already because drivers cannot see properly with so many parked vehicles everywhere.",
                        "is_correct": false,
                        "feedback": "Phrases such as ‘all over,’ ‘almost impossible’ and ‘all the cars’ are too informal for a formal letter."
                    },
                    {
                        "id": 2,
                        "text": "Firstly, vehicles are parked haphazardly along the narrow roads, obstructing the free flow of traffic and causing daily congestion. Secondly, emergency vehicles such as ambulances and fire engines are unable to access our area due to blocked roads, posing a serious threat to residents' safety. Lastly, several minor accidents have occurred because of reduced visibility and restricted movement caused by illegally parked vehicles.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Firstly, there are some parking issues on the roads in our area which are causing minor inconveniences to residents. Secondly, emergency vehicles sometimes find it a bit difficult to pass through when there are too many cars parked. Lastly, there have been a few incidents where vehicles have had slight difficulties manoeuvring through the narrow lanes.",
                        "is_correct": false,
                        "feedback": "This option uses vague language, understates the severity of the problem and lacks assertiveness."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "The residents have complained to the local police station a few times but not much has been done about it. It would be helpful if you could look into putting up some ‘No Parking’ signs in our area and maybe send some traffic officers to check on things regularly. We hope this issue will be resolved soon.",
                        "is_correct": false,
                        "feedback": "This option is too passive ‘a few times,’ ‘not much has been done,’ ‘maybe send,’ ‘we hope’ lack assertiveness and clarity."
                    },
                    {
                        "id": 2,
                        "text": "We have called the police station so many times about this, but nobody seems to care or take any action. I want you to put up ‘No Parking’ boards immediately and send traffic police to our area every day to fine people who park illegally. This needs to be fixed right away.",
                        "is_correct": false,
                        "feedback": "Phrases such as ‘so many times’, ‘nobody seems to care’ and ‘needs to be fixed right away’ are too informal. Also ‘I want you to’ is slightly aggressive."
                    },
                    {
                        "id": 3,
                        "text": "The residents have repeatedly lodged complaints with the local police station, but no effective action has been taken. I request you to install ‘No Parking’ signboards in our area and deploy traffic personnel to monitor and penalise illegal parking regularly.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "I urge you to take immediate action to address this issue and ensure the safety and convenience of residents.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "So please look into this and get back to me as soon as possible.",
                        "is_correct": false,
                        "feedback": "The tone is informal."
                    },
                    {
                        "id": 3,
                        "text": "I hope you will take this seriously and do something about it soon.",
                        "is_correct": false,
                        "feedback": "This is too vague. Also ‘do something’ is too casual."
                    }
                ],
                "complimentary_close": [
                    {
                        "id": 1,
                        "text": "Thanking you,\n\nYours faithfully,",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Thanks and Regards,",
                        "is_correct": false,
                        "feedback": "Thanks and Regards’ is too informal for a formal letter."
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
                        "text": "Rohan Mehta,",
                        "is_correct": false,
                        "feedback": "A comma is not required after the sender’s name."
                    },
                    {
                        "id": 2,
                        "text": "Rohan Mehta.",
                        "is_correct": false,
                        "feedback": "A full stop is not required after the sender’s name."
                    },
                    {
                        "id": 3,
                        "text": "Rohan Mehta",
                        "is_correct": true,
                        "feedback": ""
                    }
                ]
            }
        },
        {
            "title": "shopping",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "Iqbal Ahmed,\n25 Shanti Colony,\nSector 12,\nNavi Mumbai – 400 706.",
                        "is_correct": false,
                        "feedback": "The sender’s name should not be included in the sender’s address."
                    },
                    {
                        "id": 2,
                        "text": "25 Shanti Colony,\nSector 12,\nNavi Mumbai – 400 706.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "25, Shanti Colony,\nSector 12,\nNavi Mumbai 400706.",
                        "is_correct": false,
                        "feedback": "The PIN code should include a hyphen."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "18 January 26.",
                        "is_correct": false,
                        "feedback": "The year needs to be written in full."
                    },
                    {
                        "id": 2,
                        "text": "18 January, 2026.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "2026, January 18.",
                        "is_correct": false,
                        "feedback": "The date format is incorrect. The day should come first, followed by the month and the year."
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "Customer Service Manager\nQuickShop Online\nMumbai",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma. The PIN code is missing."
                    },
                    {
                        "id": 2,
                        "text": "To,\nThe Customer Service Manager,\nQuickShop Online Pvt. Ltd.,\nAndheri East,\nMumbai – 400 069.",
                        "is_correct": false,
                        "feedback": "‘To’ is not required before the receiver’s designation."
                    },
                    {
                        "id": 3,
                        "text": "The Customer Service Manager,\nQuickShop Online Pvt. Ltd.,\nAndheri East,\nMumbai – 400 069.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "salutation": [
                    {
                        "id": 1,
                        "text": "Hi there,",
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
                        "text": "I am writing to express my disappointment regarding an order I placed on your online shopping platform. On 23rd of December 2025, I ordered a digital camera, order number QS78934, but I regret to inform you that the item has not been delivered despite three weeks having passed since the order was placed.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I am Iqbal Ahmed and I picked up a camera from your website about three weeks ago. The order number is QS78934, and I placed it on 23 December, 2025, but I still have not received it even though the money was taken from my account.",
                        "is_correct": false,
                        "feedback": "Phrases such as ‘picked up an’, ‘about three weeks ago’ are too informal for a formal letter."
                    },
                    {
                        "id": 3,
                        "text": "The camera I ordered from your website has not arrived yet, and it has been three weeks already. I placed the order on 23 December, 2025, with order number QS78934, and I am extremely frustrated with your delivery service.",
                        "is_correct": false,
                        "feedback": "This introduction lacks proper self-introduction and starts with complaint rather than establishing context professionally."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "Firstly, the payment of Rs 18,500 was deducted from my bank account on the same day I placed the order, but I have not received any product yet. Secondly, the tracking information on your website has been showing ‘In Transit’ for over two weeks now without any updates. Lastly, I have not received any communication from your company explaining the delay or providing a revised delivery date.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Firstly, you took Rs 18,500 from my account right away when I ordered, but you still have not sent me the camera. Secondly, when I check the tracking it just says ‘In Transit’ for like two weeks and nothing is changing. Lastly, nobody from your company has even bothered to tell me what is going on or when I will get my order.",
                        "is_correct": false,
                        "feedback": "Phrases such as ‘you took’, ‘right away’, ‘like two weeks’ and ‘nobody has even bothered’ are too informal and aggressive for a formal letter."
                    },
                    {
                        "id": 3,
                        "text": "Firstly, there seems to have been some delay with the delivery as the payment was processed but the item has not arrived. Secondly, the tracking status appears to be stuck on ‘In Transit’ for quite some time now. Lastly, I have not received much information from your side regarding when the delivery might happen.",
                        "is_correct": false,
                        "feedback": "Too vague and passive; understates the seriousness of the issue; lacks specific details about payment amount and timeframe."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "I have been trying to reach your customer service people again and again by email, phone and chat, but everyone is giving me different answers and nobody is solving my problem. I want you to either send me my camera right now or give me back all my money within a week. I have all the proof of payment and order details if you need them.",
                        "is_correct": false,
                        "feedback": "Phrases such as ‘again and again’, ‘everyone is giving me different answers’, ‘right now’ and ‘give me back all my money’ are too informal and aggressive for a formal letter."
                    },
                    {
                        "id": 2,
                        "text": "I have tried contacting your customer service a few times, but the responses have been a bit unclear. It would be good if you could either deliver the product soon or perhaps consider refunding my payment. I think I have the order details somewhere that I can send if required.",
                        "is_correct": false,
                        "feedback": "Phrases such as ‘a few times’, ‘a bit unclear’, ‘perhaps consider’ and ‘I think I have’ lack assertiveness and professionalism in a formal letter."
                    },
                    {
                        "id": 3,
                        "text": "I have contacted your customer service team multiple times through email, phone calls and live chat, but I have received inconsistent responses with no clear resolution. I request either immediate delivery of the product I ordered or a full refund of Rs 18,500 to my account within seven working days. I have enclosed copies of my order confirmation, payment receipt and transaction details for your reference.",
                        "is_correct": true,
                        "feedback": ""
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "I trust you will treat this matter with urgency and provide a satisfactory resolution at the earliest.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "So please sort this out quickly and let me know what you plan to do about my order.",
                        "is_correct": false,
                        "feedback": "Beginning a sentence with ‘So’ is too informal for a formal letter. Phrases such as ‘sort this out’ and ‘what you plan to do’ are also too casual."
                    },
                    {
                        "id": 3,
                        "text": "I hope you will try to look into this issue when you get some time and maybe resolve it soon.",
                        "is_correct": false,
                        "feedback": "Phrases such as ‘when you get some time’ and ‘maybe resolve it soon’ do not convey urgency in a formal letter."
                    }
                ],
                "complimentary_close": [
                    {
                        "id": 1,
                        "text": "Thanking you,\n\nYours faithfully,",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "With warm regards,",
                        "is_correct": false,
                        "feedback": "‘With warm regards’ is too informal for a formal letter."
                    },
                    {
                        "id": 3,
                        "text": "Thanking you\n\nYours faithfully",
                        "is_correct": false,
                        "feedback": "The commas are missing."
                    }
                ],
                "senders_name": [
                    {
                        "id": 1,
                        "text": "Iqbal Ahmed",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Mr. Iqbal Ahmed",
                        "is_correct": false,
                        "feedback": "Mr. is not added to the sender’s name."
                    },
                    {
                        "id": 3,
                        "text": "Iqbal Ahmed,",
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
    sequence: [
        "senders-address-blank", "date-blank", "recievers-address-blank",
        "salutation-blank", "introduction-blank", "body-1-blank",
        "body-2-blank", "conclusion-blank", "complimentary-close-blank",
        "senders-name-blank"
    ]
};

const lottieContainer = document.getElementById('lottie-container');

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
});

function initNavigation() {
    const navButtons = {
        'learn-btn': 'learn-page',
        'example-btn': 'practice-examples',
        'home-btn': 'home-page',
        'learn-example-btn': 'practice-examples'
    };

    Object.entries(navButtons).forEach(([id, page]) => {
        const btn = document.getElementById(id);
        if (btn) btn.onclick = () => navigateTo(page);
    });

    // Practice Trigger Buttons
    ['smartPhone', 'parking', 'shopping'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.onclick = () => {
                startPracticeSession(id);
                navigateTo('practice-page');
            };
        }
    });
}

/**
 * FUNCTION: Prepares the specific letter data and UI
 */
function startPracticeSession(matchId) {
    state.activeLetter = letterData.letters.find(l => l.title === matchId);
    state.currentStepIndex = 0;
    state.activeLeftId = null;
    console.log(state.activeLetter);
}

/**
 * FUNCTION: Handles clicking the SVG boxes
 */
function handleBlankSelection(event) {
    // Use currentTarget to ensure we get the <g> element even if <path> is clicked
    const gElement = event.currentTarget;
    const expectedId = state.sequence[state.currentStepIndex];

    if (gElement.id !== expectedId) {
        showFeedback(`Please select the section: ${formatIdText(expectedId)}`);
        return;
    }

    state.activeLeftId = gElement.id;
    applyVisualHighlight(gElement);
}

/**
 * FUNCTION: Handles the selected option logic
 */
function handleOptionSelection(optionObj) {
    if (!state.activeLeftId) {
        showFeedback("First, click the highlighted box in the letter.");
        return;
    }

    if (optionObj.is_correct) {
        const targetG = document.getElementById(state.activeLeftId);
        addTextToSvg(targetG, optionObj.text);

        state.currentStepIndex++;
        state.activeLeftId = null;

        if (state.currentStepIndex < state.sequence.length) {
            renderOptions();
        } else {
            handleCompletion();
        }
    } else {
        showFeedback(optionObj.feedback || "That is not the correct format.");
    }
}

// 4. UI Support Functions
function navigateTo(pageId) {
    const pages = ['home-page', 'learn-page', 'practice-page', 'practice-examples'];
    pages.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = (id === pageId) ? 'block' : 'none';
    });
    document.getElementById('home-btn').style.display = (pageId === 'home-page') ? 'none' : 'block';
}

/** * FUNCTION: Left Panel Interaction
 * Validates if the user is clicking the correct box in the sequence
 */
function handleBlankSelection(gElement) {
    const expectedId = state.sequence[state.currentStepIndex];

    if (gElement.id !== expectedId) {
        showFeedback(`Sequence Error: Please select the box for "${formatIdText(expectedId)}"`);
        return;
    }

    state.activeLeftId = gElement.id;
    applyVisualHighlight(gElement);
}

/** * FUNCTION: Right Panel Interaction
 * Checks if the selected option matches the active blank
 */
function handleOptionSelection(btnElement) {
    if (!state.activeLeftId) {
        showFeedback("Select a section on the letter first!");
        return;
    }

    // Matching logic: IDs or normalized strings
    const isMatch = validateMatch(state.activeLeftId, btnElement.id);

    if (isMatch) {
        processCorrectMatch(btnElement);
    } else {
        showFeedback("That component doesn't belong in this section.");
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
    textNode.setAttribute("font-size", "32px");
    textNode.setAttribute("font-weight", "BOLD");
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
    // Reset all paths to default grey dash
    // document.querySelectorAll('.left-blanks path').forEach(p => p.setAttribute('stroke', '#707070'));
    // Highlight selected one blue
    el.querySelectorAll('path').forEach(p => p.setAttribute('stroke', '#007bff'));
}

function formatIdText(id) {
    return id.replace('-blank', '').replace(/-/g, ' ').toUpperCase();
}

function showFeedback(msg) {
    alert(msg); // Replace with a custom UI popup if preferred
}

/** * INITIALIZERS: Event Attachments
 */
// function initNavigation() {
//     document.getElementById('learn-btn').onclick = () => navigateTo('learn-page');
//     document.getElementById('example-btn').onclick = () => navigateTo('practice-examples');
//     document.getElementById('home-btn').onclick = () => navigateTo('home-page');
//     document.getElementById('smartPhone').onclick = () => navigateTo('practice-page');
//     document.getElementById('learn-example-btn').onclick = () => navigateTo('practice-examples');
// }

function initGameListeners() {
    document.querySelectorAll('.left-blanks > g').forEach(g => {
        g.addEventListener('click', () => handleBlankSelection(g));
    });

    document.querySelectorAll('.right-option > g').forEach(btn => {
        btn.addEventListener('click', () => handleOptionSelection(btn));
    });
}