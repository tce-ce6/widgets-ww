export const literaryDevices = [
    {
        "id": "simile",
        "title": "Simile",
        "order": 0,
        "description": "A simile compares two unlike objects using the words ‘as’ or ‘like’. In a line, look for two objects of comparison and for the words ‘as’ or ‘like’. Similes create a significant impact by connecting unfamiliar ideas to familiar ones.",
        "example": {
            "sentence": [
                {
                    "words": "He",
                    "type": "object"
                },
                {
                    "words": " was ",
                    "type": null
                },
                {
                    "words": "as",
                    "type": "word-of-comparison"
                },
                {
                    "words": " ",
                    "type": null
                },
                {
                    "words": "heavy",
                    "type": "compared-quality"
                },
                {
                    "words": " ",
                    "type": null
                },
                {
                    "words": "as",
                    "type": "word-of-comparison"
                },
                {
                    "words": " ",
                    "type": null
                },
                {
                    "words": "horse",
                    "type": "object"
                }
            ],
            "mapping": {
                "object": {
                    "title": "Object",
                    "background": "pink"
                },
                "word-of-comparison": {
                    "title": "Word Of Comparison",
                    "background": "#35F90C"
                },
                "compared-quality": {
                    "title": "Compared Quality",
                    "background": "#FDEC14"
                }
            }
        },
        "player": {
            "combinations": [
                [
                    {
                        "id": 0,
                        "title": "Her anger"
                    },
                    {
                        "id": 1,
                        "title": "The silence"
                    },
                    {
                        "id": 2,
                        "title": "His words"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "was like"
                    },
                    {
                        "id": 1,
                        "title": "was as"
                    },
                    {
                        "id": 2,
                        "title": "hit like"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "a volcano about to erupt."
                    },
                    {
                        "id": 1,
                        "title": "heavy as a thick blanket."
                    },
                    {
                        "id": 2,
                        "title": "a tidal wave"
                    }
                ]
            ],
            "correctAnswers": [
                {
                    "answer": "000",
                    "explanation": "Here, the woman’s anger has been compared to a volcano using like."
                },
                {
                    "answer": "111",
                    "explanation": "Here, silence has been compared to a thick blanket using as."
                },
                {
                    "answer": "222",
                    "explanation": "Here, his words has been compared to a tidal wave using like."
                }
            ]
        }
    },
    {
        "id": "personification",
        "title": "Personification",
        "order": 1,
        "description": "Personification is a literary device where human qualities are given to non-human objects. In a line, look for the non-human object/thing and the human qualities. This device helps readers connect emotionally with objects or ideas. It creates vivid imagery and builds atmosphere.",
        "example": {
            "sentence": [
                {
                    "words": "The ",
                    "type": null
                },
                {
                    "words": "wind",
                    "type": "non-human-object"
                },
                {
                    "words": " ",
                    "type": null
                },
                {
                    "words": "stood up",
                    "type": "human-qualities"
                },
                {
                    "words": " and ",
                    "type": null
                },
                {
                    "words": "gave a shout.",
                    "type": "human-qualities"
                }
            ],
            "mapping": {
                "human-qualities": {
                    "title": "Human Qualities",
                    "background": "#FDEC14"
                },
                "non-human-object": {
                    "title": "Non Human Object",
                    "background": "#35F90C"
                }
            }
        },
        "player": {
            "combinations": [
                [
                    {
                        "id": 0,
                        "title": "The wind"
                    },
                    {
                        "id": 1,
                        "title": "The mountains"
                    },
                    {
                        "id": 2,
                        "title": "Time"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "danced gracefully"
                    },
                    {
                        "id": 1,
                        "title": "wept quietly"
                    },
                    {
                        "id": 2,
                        "title": "complained bitterly"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "through the empty streets."
                    },
                    {
                        "id": 1,
                        "title": "during the long winter."
                    },
                    {
                        "id": 2,
                        "title": "when no one was watching."
                    }
                ]
            ],
            "correctAnswers": [
                {
                    "answer": "000",
                    "explanation": "Here, the wind has been given the human quality of dancing and being graceful."
                },
                {
                    "answer": "111",
                    "explanation": "Here, the mountains have been given the human quality of weeping and being quiet."
                },
                {
                    "answer": "222",
                    "explanation": "Here, time has been given the human quality of complaining and being bitter."
                }
            ]
        }
    },
    {
        "id": "transferred-epithet",
        "title": "Transferred Epithet",
        "order": 2,
        "description": "Transferred epithet is a literary device where an adjective used to describe a person’s feeling or state is placed next to an object or thing instead. In a line, look for an adjective which is placed next to an object. This device creates a striking description that reveals a character’s inner emotion through their surroundings. It adds depth and subtlety rather than telling how someone feels.",
        "example": {
            "sentence": [
                {
                    "words": "He took a ",
                    "type": null
                },
                {
                    "words": "thoughtful",
                    "type": "adjective"
                },
                {
                    "words": " ",
                    "type": null
                },
                {
                    "words": "sip",
                    "type": "act-of-sipping"
                },
                {
                    "words": " of his coffee.",
                    "type": null
                }
            ],
            "mapping": {
                "adjective": {
                    "title": "Adjective",
                    "background": "#35F90C"
                },
                "act-of-sipping": {
                    "title": "Act Of Sipping",
                    "background": "#FDEC14"
                }
            }
        },
        "player": {
            "combinations": [
                [
                    {
                        "id": 0,
                        "title": "The boy spent"
                    },
                    {
                        "id": 1,
                        "title": "They watched the"
                    },
                    {
                        "id": 2,
                        "title": "He worked with"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "sleepless"
                    },
                    {
                        "id": 1,
                        "title": "angry"
                    },
                    {
                        "id": 2,
                        "title": "anxious"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "night."
                    },
                    {
                        "id": 1,
                        "title": "sky."
                    },
                    {
                        "id": 2,
                        "title": "fingers."
                    }
                ]
            ],
            "correctAnswers": [
                {
                    "answer": "000",
                    "explanation": "Here, the quality of sleeplessness has been transferred. It is the boy who is sleep deprived rather than the night."
                },
                {
                    "answer": "111",
                    "explanation": "Here, the quality of anger has been transferred. The sky cannot feel angry but during a storm can look angry."
                },
                {
                    "answer": "222",
                    "explanation": "Here, the fingers are not anxious but the person working with him."
                }
            ]
        }
    },
    {
        "id": "metaphor",
        "title": "Metaphor",
        "order": 3,
        "description": "A metaphor directly compares two unlikely objects without using ‘as’ or ‘like’. In a line look for two unlikely objects for comparison. Metaphors create powerful imagery by merging two ideas into one. They add layers of meaning and invite readers to think deeply.",
        "example": {
            "sentence": [
                {
                    "words": "She",
                    "type": "object"
                },
                {
                    "words": " has a ",
                    "type": null
                },
                {
                    "words": "heart of stone.",
                    "type": "metaphor"
                }
            ],
            "mapping": {
                "object": {
                    "title": "Object",
                    "background": "#FDEC14"
                },
                "metaphor": {
                    "title": "Metaphor",
                    "background": "#35F90C"
                }
            }
        },
        "player": {
            "combinations": [
                [
                    {
                        "id": 0,
                        "title": "Time"
                    },
                    {
                        "id": 1,
                        "title": "Her heart"
                    },
                    {
                        "id": 2,
                        "title": "Life"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "is"
                    },
                    {
                        "id": 1,
                        "title": "was"
                    },
                    {
                        "id": 2,
                        "title": "can be"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "a thief."
                    },
                    {
                        "id": 1,
                        "title": "a locked door."
                    },
                    {
                        "id": 2,
                        "title": "a winding road."
                    }
                ]
            ],
            "correctAnswers": [
                {
                    "answer": "000",
                    "explanation": "Here, time has been compared to being like a thief."
                },
                {
                    "answer": "111",
                    "explanation": "Here, her heart has been compared to a locked door."
                },
                {
                    "answer": "222",
                    "explanation": "Here, life has been compared to a winding road."
                }
            ]
        }
    },
    {
        "id": "oxymoron",
        "title": "Oxymoron",
        "order": 4,
        "description": "Oxymoron is a literary device where two words with opposite meaning side by side in a line. In a line, look for two contradicting words. This device is used to capture complex emotions through contradiction. It surprises readers and provokes thought.",
        "example": {
            "sentence": [
                {
                    "words": "The comedian’s jokes were met with ",
                    "type": null
                },
                {
                    "words": "serious laughter.",
                    "type": "contradictory-word"
                }
            ],
            "mapping": {
                "contradictory-word": {
                    "title": "Contradictory Words",
                    "background": "#FDEC14"
                }
            }
        },
        "player": {
            "combinations": [
                [
                    {
                        "id": 0,
                        "title": "They sat in"
                    },
                    {
                        "id": 1,
                        "title": "Their parting was"
                    },
                    {
                        "id": 2,
                        "title": "She looked like the"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "deafening"
                    },
                    {
                        "id": 1,
                        "title": "bitter"
                    },
                    {
                        "id": 2,
                        "title": "living"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "silence."
                    },
                    {
                        "id": 1,
                        "title": "sweet."
                    },
                    {
                        "id": 2,
                        "title": "dead."
                    }
                ]
            ],
            "correctAnswers": [
                {
                    "answer": "000",
                    "explanation": "Here, the words ‘deafening’ and ‘silence’ contradict each other in meaning."
                },
                {
                    "answer": "111",
                    "explanation": "Here, the ‘bitter’ and ‘sweet’ are opposite in meaning."
                },
                {
                    "answer": "222",
                    "explanation": "Here, the words ‘living’ and ‘dead’ are in complete contrast with each other."
                }
            ]
        }
    },
    {
        "id": "alliteration",
        "title": "Alliteration",
        "order": 5,
        "description": "Alliteration is a literary device where the words beginning with the same consonant sounds have been repeated in the line. In a line, look for the words which begin with the same consonant sounds. Alliteration is used to enhance the musical quality of the poem.",
        "example": {
            "sentence": [
                {
                    "words": "The ",
                    "type": null
                },
                {
                    "words": "c",
                    "type": "highlight"
                },
                {
                    "words": "amera ",
                    "type": null
                },
                {
                    "words": "c",
                    "type": "highlight"
                },
                {
                    "words": "aptured her ",
                    "type": null
                },
                {
                    "words": "c",
                    "type": "highlight"
                },
                {
                    "words": "andid ",
                    "type": null
                },
                {
                    "words": "c",
                    "type": "highlight"
                },
                {
                    "words": "harm.",
                    "type": null
                }
            ],
            "mapping": {
                "highlight": {
                    "title": "",
                    "background": "yellow"
                }
            }
        },
        "player": {
            "combinations": [
                [
                    {
                        "id": 0,
                        "title": "Peter"
                    },
                    {
                        "id": 1,
                        "title": "The serpent"
                    },
                    {
                        "id": 2,
                        "title": "Brave "
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "picked "
                    },
                    {
                        "id": 1,
                        "title": "slithered"
                    },
                    {
                        "id": 2,
                        "title": "birds"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "peppers in the garden."
                    },
                    {
                        "id": 1,
                        "title": "sinuously through the grass."
                    },
                    {
                        "id": 2,
                        "title": "built nests on boards."
                    }
                ]
            ],
            "correctAnswers": [
                {
                    "answer": "000",
                    "explanation": "Here, the letter ‘p’ has been repeated in the sentence."
                },
                {
                    "answer": "111",
                    "explanation": "Here, the letter ‘s’ has been repeated in the sentence."
                },
                {
                    "answer": "222",
                    "explanation": "Here, the letter ‘b’ has been repeated in the sentence."
                }
            ]
        }
    },
    {
        "id": "onomatopoeia",
        "title": "Onomatopoeia",
        "order": 6,
        "description": "This device refers to words that imitate the natural sounds they describe. In a line, look for the words that mimic a particular sound. This device is used to create an immersive experience for the reader by engaging their sense of hearing.",
        "example": {
            "sentence": [
                {
                    "words": "The food ",
                    "type": null
                },
                {
                    "words": "sizzled",
                    "type": "onomatopoeic"
                },
                {
                    "words": " in the hot pan.",
                    "type": null
                }
            ],
            "mapping": {
                "onomatopoeic": {
                    "title": "Onomatopoeic Words",
                    "background": "#35F90C"
                }
            }
        },
        "player": {
            "combinations": [
                [
                    {
                        "id": 0,
                        "title": "The thunder"
                    },
                    {
                        "id": 1,
                        "title": "The bees"
                    },
                    {
                        "id": 2,
                        "title": "The door"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "crashed"
                    },
                    {
                        "id": 1,
                        "title": "buzzed"
                    },
                    {
                        "id": 2,
                        "title": "creaked"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "across the sky."
                    },
                    {
                        "id": 1,
                        "title": "in the garden."
                    },
                    {
                        "id": 2,
                        "title": "on its rusty hinges."
                    }
                ]
            ],
            "correctAnswers": [
                {
                    "answer": "000",
                    "explanation": "In this line, the word ‘crashed’ mimics the sound of thunder."
                },
                {
                    "answer": "111",
                    "explanation": "Here, the word ‘buzzed’ mimics the sound of bees buzzing."
                },
                {
                    "answer": "222",
                    "explanation": "Here, the word ‘creaked’ mimics the sound the creaking when opened. "
                }
            ]
        }
    },
    {
        "id": "hyperbole",
        "title": "Hyperbole",
        "order": 7,
        "description": "Hyperbole is a literary device that is used to create emphasis through extreme exaggeration. In a line for an object and the phrase which show exaggeration. This device is used to add drama, humour and intensity. It helps readers feel the magnitude of an emotion or situation by stretching reality to its limits.",
        "example": {
            "sentence": [
                {
                    "words": "They cried ",
                    "type": null
                },
                {
                    "words": "an ocean of tears",
                    "type": "exaggerated-phrase"
                },
                {
                    "words": " on the eve of their departure.",
                    "type": null
                }
            ],
            "mapping": {
                "exaggerated-phrase": {
                    "title": "Exaggerated Phrase",
                    "background": "#35F90C"
                }
            }
        },
        "player": {
            "combinations": [
                [
                    {
                        "id": 0,
                        "title": "I am so hungry"
                    },
                    {
                        "id": 1,
                        "title": "She was so tired"
                    },
                    {
                        "id": 2,
                        "title": "The bag was so heavy"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "I could"
                    },
                    {
                        "id": 1,
                        "title": "her bones"
                    },
                    {
                        "id": 2,
                        "title": "it weighed"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "eat a horse."
                    },
                    {
                        "id": 1,
                        "title": "turned to dust."
                    },
                    {
                        "id": 2,
                        "title": "more than the sun."
                    }
                ]
            ],
            "correctAnswers": [
                {
                    "answer": "000",
                    "explanation": "The phrase ‘could eat a horse’ exaggerates the person’s hunger."
                },
                {
                    "answer": "111",
                    "explanation": "Here, the phrase ‘bones tuned to dust’ exaggerates the nature of tiredness felt by the woman."
                },
                {
                    "answer": "222",
                    "explanation": "Here, the heaviness of the bag has been exaggerated."
                }
            ]
        }
    },
    {
        "id": "tautology",
        "title": "Tautology",
        "order": 8,
        "description": "Tautology is a literary device where there is unnecessary repetition of meaning using different words that say the same thing. In a line or sentence, look for words similar in meaning which has been used in succession. This device is used for emphasis, rhythm as well to stress the importance of an idea.",
        "example": {
            "sentence": [
                {
                    "words": "They ",
                    "type": null
                },
                {
                    "words": "gathered together",
                    "type": "similar"
                },
                {
                    "words": " for the ceremony.",
                    "type": null
                }
            ],
            "mapping": {
                "similar": {
                    "title": "words that sound similar in meaning",
                    "background": "#35F90C"
                }
            }
        },
        "player": {
            "combinations": [
                [
                    {
                        "id": 0,
                        "title": "The company offered a"
                    },
                    {
                        "id": 1,
                        "title": "The experiment had"
                    },
                    {
                        "id": 2,
                        "title": "Her promotion came as an"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "free gift"
                    },
                    {
                        "id": 1,
                        "title": "end results"
                    },
                    {
                        "id": 2,
                        "title": "unexpected surprise"
                    }
                ],
                [
                    {
                        "id": 0,
                        "title": "to every employee."
                    },
                    {
                        "id": 1,
                        "title": "that surprised everyone."
                    },
                    {
                        "id": 2,
                        "title": "to the team."
                    }
                ]
            ],
            "correctAnswers": [
                {
                    "answer": "000",
                    "title": "free. So the phrasing is redundant here."
                },
                {
                    "answer": "111",
                    "title": "Results by definition mean an end. So, the phrasing is redundant."
                },
                {
                    "answer": "222",
                    "title": "‘Unexpected’ and ‘surprise’ are very similar in meaning so the use of both the words is repetitive and redundant."
                }
            ]
        }
    }
];
