
const letterData = {

    "letters": [
        {
            "title": "retailJob",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "Haseena Abubacker\nSunrise Apartments,\nSivan Chetty Gardens,\nBengaluru – 560042.",
                        "is_correct": false,
                        "feedback": "The sender's name should not be included in the sender's address."
                    },
                    {
                        "id": 2,
                        "text": "Sunrise Apartments,\nSivan Chetty Gardens,\nBengaluru – 560042.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Sunrise Apartments\nSivan Chetty Gardens\nBengaluru – 560042.",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma, except the last line."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "15th April, 2026.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "April 15th, 2026.",
                        "is_correct": false,
                        "feedback": "The day should come before the month."
                    },
                    {
                        "id": 3,
                        "text": "15 04, 2026.",
                        "is_correct": false,
                        "feedback": "The month should be written in words, not numbers."
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "The Store Manager\nLive Life Stores\nBengaluru – 560042.",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma, except the last line."
                    },
                    {
                        "id": 2,
                        "text": "The Store Manager,\nLive Life Stores,\nBengaluru – 560042.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "The Store Manager,\nLive Life Stores,\nBengaluru",
                        "is_correct": false,
                        "feedback": "The PIN code must be included in the address."
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
                        "text": "Dear Madam Manager,",
                        "is_correct": false,
                        "feedback": "Use just ‘Sir’ or ‘Madam’. Designation is not used in the salutation."
                    }
                ],
                "introduction": [
                    {
                        "id": 1,
                        "text": "My name is Haseena Abubacker and I am a Grade 10 student at Greenfield School. I am writing to apply for a part-time job at Live Life Stores during my upcoming summer break.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I am writing to apply for a part-time job during summer holidays. I am a student and I would like to work at your store.",
                        "is_correct": false,
                        "feedback": "This introduction lacks specific details such as the full name, school name and specific mention of the store name. It sounds vague and unprofessional."
                    },
                    {
                        "id": 3,
                        "text": "I really want to work at your store because I need a job during the summer. I am a good student, and I think I would be perfect for any position you have available.",
                        "is_correct": false,
                        "feedback": "This introduction uses overly casual language ('I really want', 'I think'). It sounds presumptuous ('perfect for any position')."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "I have always been enthusiastic about providing excellent customer service and fostering positive shopping experiences. I am drawn to Live Life Stores due to its reputation for high-quality products.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I really like shopping and I think working in a store would be fun. I am a friendly person and I get along with everyone. I am sure I would enjoy working at Live Life Stores because it is a popular store.",
                        "is_correct": false,
                        "feedback": "This paragraph uses informal language and focuses on personal enjoyment rather than professional skills. The reasoning is superficial and doesn't demonstrate understanding of customer service."
                    },
                    {
                        "id": 3,
                        "text": "I am interested in working at a store. I think I have some skills that might be useful. I am a student who needs work experience.",
                        "is_correct": false,
                        "feedback": "This paragraph is extremely vague and lacks specific details. It doesn't mention customer service skills, any qualities or enthusiasm for the role."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "Despite my age, I bring strong communication, teamwork, and organisational skills developed through school projects. I'm detail-oriented and committed to maintaining an appealing store environment. With my summer break starting 1 May, I'll have ample availability during store hours.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I have some skills from school that could help me in a retail job. I work well with others and I am quite organised. These skills would probably be useful in a store.",
                        "is_correct": false,
                        "feedback": "This paragraph uses tentative language ('some skills', 'could help', 'probably be useful'). It lacks confidence and specific examples. The statements do not convincingly demonstrate suitability for the role."
                    },
                    {
                        "id": 3,
                        "text": "I am a very hard-working person and I am always on time. I have never missed a day of school. I can lift heavy boxes and I am not afraid of hard work. I can work any hours you need me to work.",
                        "is_correct": false,
                        "feedback": "This paragraph focuses on basic expectations rather than relevant skills. It emphasises physical capabilities ('lift heavy boxes') over customer service skills. The tone sounds desperate rather than professional."
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "I am available to start work immediately and I can work any time. I hope you will give me a chance to prove myself. Please let me know as soon as possible if I get the job.",
                        "is_correct": false,
                        "feedback": "This conclusion sounds overly eager and lacks professionalism. Asking for immediate notification about getting the job is presumptuous."
                    },
                    {
                        "id": 2,
                        "text": "I would be thrilled to discuss my application further in an interview. I look forward to the opportunity to contribute to the exceptional service that Live Life Stores is known for.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "I really need this job for the summer, so I hope you will consider me. I promise I will work very hard if you hire me. Thank you for reading my letter.",
                        "is_correct": false,
                        "feedback": "This conclusion focuses on the applicant's need rather than what they can offer. The phrase 'I promise I will work very hard' sounds unprofessional. The tone is pleading rather than confident."
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
                        "text": "Thank you\nKind regards",
                        "is_correct": false,
                        "feedback": "A comma should follow ‘Thank you’. ‘Kind regards’ is too informal."
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
                        "text": "Haseena Abubacker,",
                        "is_correct": false,
                        "feedback": "A comma is not required after the sender’s name."
                    },
                    {
                        "id": 2,
                        "text": "Haseena Abubacker.",
                        "is_correct": false,
                        "feedback": "A full stop is not required after the sender’s name."
                    },
                    {
                        "id": 3,
                        "text": "Haseena Abubacker",
                        "is_correct": true,
                        "feedback": ""
                    }
                ]
            }
        },
        {
            "title": "newspaperInternship",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "Amit Kulkarni\nGarden View Apartments,\nMG Road,\nPune – 411001.",
                        "is_correct": false,
                        "feedback": "The sender's name should not be included in the sender's address."
                    },
                    {
                        "id": 2,
                        "text": "Garden View Apartments,\nMG Road,\nPune – 411001.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "Garden View Apartments\nMG Road\nPune – 411001.",
                        "is_correct": false,
                        "feedback": "Commas at the end of each line (except the last) are missing."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "10 May, 2026.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "May 10, 2026.",
                        "is_correct": false,
                        "feedback": "The day should come before the month."
                    },
                    {
                        "id": 3,
                        "text": "10/05/2026.",
                        "is_correct": false,
                        "feedback": "The date should be written in the proper format: day, month in words and year."
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "The Editor\nThe Pune Chronicle\nPune – 411001.",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma, except the last line."
                    },
                    {
                        "id": 2,
                        "text": "The Editor,\nThe Pune Chronicle,\nPune – 411001.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "The Editor,\nThe Pune Chronicle,\nPune",
                        "is_correct": false,
                        "feedback": "The PIN code is missing from the address."
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
                        "text": "Dear Editor,",
                        "is_correct": false,
                        "feedback": "Use 'Dear Sir', 'Dear Madam' or 'Dear Sir/Madam'. The designation is not used in the salutation."
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
                        "text": "My name is Amit Kulkarni and I am a Grade 10 student at Vidya Mandir School. I am writing to express my interest in a summer internship position as a junior reporter at The Pune Chronicle.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I am writing to apply for an internship at your newspaper. I am a student who is interested in journalism.",
                        "is_correct": false,
                        "feedback": "This introduction is too vague. It lacks specific details such as the applicant's full name, school name, grade and the exact position being applied for."
                    },
                    {
                        "id": 3,
                        "text": "I really love reading newspapers and I think it would be amazing to work at The Pune Chronicle. I am a Grade 10 student and I would love to get some experience in journalism during my summer holidays.",
                        "is_correct": false,
                        "feedback": "This introduction uses overly casual language ('really love', 'amazing', 'would love'). The tone is too enthusiastic rather than professional."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "I have a strong interest in journalism and writing. I have been an active member of our school newspaper committee for two years, where I have written articles on various topics including school events, social issues and student achievements. Additionally, I participated in an inter-school essay writing competition last year and secured second place.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I like writing and reading newspapers. I sometimes write for my school and I once participated in an essay competition. I think journalism is interesting.",
                        "is_correct": false,
                        "feedback": "This paragraph is too brief and lacks specific details. The language is casual ('I like', 'I think'). It doesn't provide concrete examples of experience or achievements."
                    },
                    {
                        "id": 3,
                        "text": "I am absolutely passionate about journalism and I have always dreamed of becoming a famous journalist. I write really well and everyone at school says my articles are the best. I am sure I would be an excellent addition to your team.",
                        "is_correct": false,
                        "feedback": "This paragraph uses exaggerated language ('absolutely passionate', 'always dreamed', 'famous journalist'). It sounds boastful ('everyone says my articles are the best') and presumptuous ('I am sure I would be an excellent addition')."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "I am particularly drawn to The Pune Chronicle because of its reputation for balanced reporting and community-focused journalism. Through this internship, I hope to gain practical experience in news gathering, interviewing and editorial work. I am available throughout the summer break from 1 June to 15 July. This internship would provide valuable insights into professional journalism and help me develop skills that align with my career goal of becoming a journalist.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I want to work at your newspaper because it is well-known. I am free during summer holidays and I want to learn about journalism. This internship would be good for my future career. I have always enjoyed reading newspapers and watching news on television. I think reporting would be an interesting job and I would like to try it out during my summer break to see if I like it.",
                        "is_correct": false,
                        "feedback": "This paragraph uses casual language ('I want', 'would be good', 'I would like to try it out'). It lacks specific details about availability dates and what the applicant hopes to learn. The tone is uncertain about commitment ('to see if I like it')."
                    },
                    {
                        "id": 3,
                        "text": "I think The Pune Chronicle is okay and I need some work experience for my summer break. I am available whenever you need me. An internship would look good on my resume and help me decide if I want to be a journalist or not. I don't have much experience yet but I am willing to learn. I believe working at a newspaper would be better than sitting at home during holidays.",
                        "is_correct": false,
                        "feedback": "This paragraph demonstrates lack of enthusiasm ('is okay'). It focuses on the applicant's needs ('I need', 'would look good on my resume') rather than what they can contribute. The tone is uncertain about career goals."
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "I know I would be perfect for this internship and I am sure you won't regret hiring me. I am available to start immediately. Looking forward to working with you soon.",
                        "is_correct": false,
                        "feedback": "This conclusion is presumptuous ('I know I would be perfect', 'won't regret hiring me'). It assumes the internship has been granted ('working with you soon')."
                    },
                    {
                        "id": 2,
                        "text": "I really hope you will give me this internship because I need the experience. Please let me know soon if I am selected. Thanks for reading my letter.",
                        "is_correct": false,
                        "feedback": "This conclusion sounds desperate ('I really hope', 'I need the experience'). The tone is too casual ('Thanks for reading')."
                    },
                    {
                        "id": 3,
                        "text": "I am eager to contribute my enthusiasm and dedication to The Pune Chronicle. I would welcome the opportunity to discuss this internship further in an interview. Thank you for considering my application. I look forward to your positive response.",
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
                        "text": "Thanks and best wishes,",
                        "is_correct": false,
                        "feedback": "This is too informal for a job application letter."
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
                        "text": "Amit Kulkarni",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Amit Kulkarni,",
                        "is_correct": false,
                        "feedback": "A comma is not required after the sender's name."
                    },
                    {
                        "id": 3,
                        "text": "Amit Kulkarni.",
                        "is_correct": false,
                        "feedback": "A full stop is not required after the sender’s name."
                    }
                ]
            }
        },
        {
            "title": "animalShelterVolunteer",
            "sections": {
                "senders_address": [
                    {
                        "id": 1,
                        "text": "Green Valley Apartments,\nRing Road,\nChennai – 600001.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Harini Raman\nGreen Valley Apartments,\nRing Road,\nChennai – 600001.",
                        "is_correct": false,
                        "feedback": "The sender's name should not be included in the sender's address."
                    },
                    {
                        "id": 3,
                        "text": "Green Valley Apartments\nRing Road\nChennai – 600001.",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma, except the last line."
                    }
                ],
                "date": [
                    {
                        "id": 1,
                        "text": "20 June, 2026.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "June 20, 2026.",
                        "is_correct": false,
                        "feedback": "The day should come before the month."
                    },
                    {
                        "id": 3,
                        "text": "20 06, 2026.",
                        "is_correct": false,
                        "feedback": "The month should be written in words, not numbers."
                    }
                ],
                "receivers_address": [
                    {
                        "id": 1,
                        "text": "The Manager\nHappy Paws Animal Shelter\nChennai – 600001.",
                        "is_correct": false,
                        "feedback": "Each line should end with a comma, except the last line."
                    },
                    {
                        "id": 2,
                        "text": "The Manager,\nHappy Paws Animal Shelter,\nChennai",
                        "is_correct": false,
                        "feedback": "The PIN code must be included in the address."
                    },
                    {
                        "id": 3,
                        "text": "The Manager,\nHappy Paws Animal Shelter,\nChennai – 600001.",
                        "is_correct": true,
                        "feedback": ""
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
                        "text": "Hello",
                        "is_correct": false,
                        "feedback": "'Hello' is too informal for a formal letter. A comma should follow the salutation."
                    },
                    {
                        "id": 3,
                        "text": "Dear Manager Sir/Madam,",
                        "is_correct": false,
                        "feedback": "Use 'Dear Sir', 'Dear Madam' or 'Dear Sir/Madam'. The designation is not used in the salutation."
                    }
                ],
                "introduction": [
                    {
                        "id": 1,
                        "text": "I am writing to apply for a volunteer job at your animal shelter. I am a student who likes animals.",
                        "is_correct": false,
                        "feedback": "This introduction lacks specific details such as the applicant's full name, school name and grade. It uses casual language ('likes animals') rather than demonstrating genuine interest."
                    },
                    {
                        "id": 2,
                        "text": "My name is Harini Raman and I am a Grade 10 student at St. Mary's School. I am writing to express my interest in applying for a volunteer position at Happy Paws Animal Shelter.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "I absolutely love animals and I think working at Happy Paws would be so much fun! I am in Grade 10 and I would really love to volunteer at your shelter.",
                        "is_correct": false,
                        "feedback": "This introduction uses overly enthusiastic and casual language ('absolutely love', 'so much fun', 'would really love'). The tone is too informal for a formal application."
                    }
                ],
                "body_paragraph_1": [
                    {
                        "id": 1,
                        "text": "I have always had a deep love and compassion for animals. I have a pet dog at home and I understand the importance of proper care, nutrition and attention that animals require. I have gained knowledge about animal behaviour through reading and online courses. I believe that every animal deserves love, care and a safe environment.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "I like animals and I have a dog. I think animals need care and food. I want to help at your shelter. Animals are nice to have around and they make people happy. I enjoy spending time with my pet and I think I would enjoy working with other animals too. I believe animals are important and someone should take care of them.",
                        "is_correct": false,
                        "feedback": "This paragraph is too simplistic and vague. It lacks depth and specific examples. The language is too casual ('I like', 'I think', 'nice to have around') and doesn't demonstrate genuine understanding of animal welfare."
                    },
                    {
                        "id": 3,
                        "text": "I am crazy about animals and I spend all my free time watching animal videos. I have two dogs and three cats at home. Animals are just so cute and adorable! I think it would be amazing to work with animals all day. My friends always say I should work with animals because I love them so much. I really enjoy playing with my pets and taking pictures of them for social media.",
                        "is_correct": false,
                        "feedback": "This paragraph uses overly casual language ('crazy about', 'just so cute', 'amazing'). It focuses on entertainment ('watching animal videos', 'taking pictures for social media') rather than serious commitment to animal welfare."
                    }
                ],
                "body_paragraph_2": [
                    {
                        "id": 1,
                        "text": "I am eager to contribute to Happy Paws Animal Shelter's mission of providing care and finding homes for animals in need. My patience, empathy and dedication would enable me to assist with daily tasks such as feeding, cleaning, socialising with animals and helping with adoption events. I am available on weekends and during school holidays throughout the year.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": " I want to help at your shelter because I like animals. I can come on weekends. I would be good at taking care of animals.",
                        "is_correct": false,
                        "feedback": "This paragraph is too brief and lacks specific details about what the applicant can contribute. The language is casual and doesn't mention specific qualities or availability details."
                    },
                    {
                        "id": 3,
                        "text": "I think working with animals would be more fun than my regular schoolwork. I am free most weekends when I don't have other plans. I am sure I would enjoy volunteering at Happy Paws and it would give me something interesting to do.",
                        "is_correct": false,
                        "feedback": "This paragraph demonstrates wrong motivation (escape from schoolwork, looking for entertainment). It shows lack of commitment ('when I don't have other plans'). The focus is on personal enjoyment rather than helping animals."
                    }
                ],
                "conclusion": [
                    {
                        "id": 1,
                        "text": "I really hope you will let me volunteer because I love animals so much. Please tell me soon if I can join. Thanks for reading my letter. I promise I will be a good volunteer and I won't let you down. I have always wanted to work with animals and this would be a great opportunity for me. I am really excited about the possibility of volunteering at your shelter.",
                        "is_correct": false,
                        "feedback": "This conclusion uses overly casual language ('I really hope', 'love animals so much', 'Thanks for reading', 'I promise I won't let you down'). It focuses on personal feelings and excitement rather than professional commitment."
                    },
                    {
                        "id": 2,
                        "text": "I am genuinely passionate about animal welfare and I believe my dedication would make me a valuable addition to your team. I would be grateful for the opportunity to discuss this position further. Thank you for considering my application. I look forward to contributing to the wonderful work being done at Happy Paws Animal Shelter.",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 3,
                        "text": "I know I would be perfect for this position and animals always love me. I am sure you need volunteers like me. I can start this weekend if you want. Everyone says I have a special connection with animals. I believe Happy Paws would be lucky to have me as a volunteer. I look forward to hearing from you very soon about when I can begin working with the animals at your shelter.",
                        "is_correct": false,
                        "feedback": "This conclusion is presumptuous ('I would be perfect', 'animals always love me', 'you need volunteers like me', 'would be lucky to have me'). It assumes approval has been granted ('when I can begin'). The tone lacks appropriate humility for an application."
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
                        "text": "Thanks so much,\nBest wishes,",
                        "is_correct": false,
                        "feedback": "This is too informal for a formal application letter."
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
                        "text": "Harini Raman",
                        "is_correct": true,
                        "feedback": ""
                    },
                    {
                        "id": 2,
                        "text": "Ms. Harini Raman",
                        "is_correct": false,
                        "feedback": "Titles like 'Ms.' are not added to the sender's name."
                    },
                    {
                        "id": 3,
                        "text": "Harini Raman,",
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
    retailJob: 'practice-result-retailJob',
    newspaperInternship: 'practice-result-newspaperInternship',
    animalShelterVolunteer: 'practice-result-newspaperInternship'
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
    const topic = state.activeLetter?.title || 'retailJob';
    const imgId = resultImageMap[topic] || resultImageMap.retailJob;
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
    ['retailJob', 'newspaperInternship', 'animalShelterVolunteer'].forEach(id => {
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

function hideAllSvgPopups() {
    document.querySelectorAll(".svg-popup").forEach(p => {
        p.style.display = "none";

        // Also hide the parent foreignObject so it doesn't block clicks.
        const fo = p.parentElement;
        if (fo && fo.tagName && fo.tagName.toLowerCase() === 'foreignobject') {
            fo.style.display = "none";
        }
    });
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
    const successLottieContainer = document.getElementById('success-lottie-container');
    if (successLottieContainer) {
        successLottieContainer.style.display = 'none';
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