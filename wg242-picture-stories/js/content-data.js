/* Picture Stories (wg242): content from the widget brief (Data Tables 1 to 7).
   Each rect is [x, y, width, height] on the 1920x1080 stage. */
window.PICTURE_STORIES = [
  {
    "image": "assets/images/picture-1.jpg",
    "alt": "A teenager stands beside a red bicycle with a broken chain on a winding hill road. Dark storm clouds and lightning fill the sky, a signpost reads Village 5 km, and a small brown dog watches from the roadside.",
    "details": [
      {
        "name": "The storm clouds",
        "question": "How long before the storm breaks?",
        "rects": [
          [
            952,
            212,
            473,
            110
          ]
        ]
      },
      {
        "name": "The broken chain",
        "question": "How will they get home now?",
        "rects": [
          [
            835,
            557,
            167,
            139
          ]
        ]
      },
      {
        "name": "The dog",
        "question": "Whose dog is it, and why is it watching?",
        "rects": [
          [
            562,
            508,
            170,
            174
          ]
        ]
      },
      {
        "name": "The signpost",
        "question": "Five kilometres to go. Can they make it?",
        "rects": [
          [
            1234,
            350,
            189,
            271
          ]
        ]
      }
    ],
    "background": [
      {
        "name": "Trees",
        "rect": [
          470,
          205,
          330,
          290
        ]
      },
      {
        "name": "Stones by the road",
        "rect": [
          470,
          530,
          90,
          115
        ]
      },
      {
        "name": "Stones by the road",
        "rect": [
          1205,
          630,
          160,
          85
        ]
      }
    ],
    "outline": [
      {
        "tag": "Doesn't fully connect to the picture",
        "correct": false,
        "hint": "Check each outline against the four details you found. Does it use all of them?",
        "parts": [
          "Nani waves goodbye as I set off on my bicycle, hoping to beat the rain.",
          "Up on the hill road, a loud snap tells me my chain has broken.",
          "My uncle happens to pass by on his scooter and stops to help.",
          "He gives me a lift home, and I'm dry before the storm arrives."
        ]
      },
      {
        "tag": "Correct",
        "correct": true,
        "feedback": "Every part uses the picture, and the narrator follows the dog to solve the problem. The ending also tells us whose dog it is.",
        "parts": [
          "Cycling home from Nani's village, I race the storm clouds up the hill road.",
          "My bicycle chain snaps, five kilometres from home.",
          "A small brown dog leads me down a narrow path.",
          "A farmer fixes my chain, and I find out whose dog it is."
        ]
      }
    ],
    "parts": [
      [
        {
          "text": "That morning, Papa had dropped me at Nani's village on his way to work. I spent the whole day there, picking guavas and helping Nani feed her hens. In the evening, I finally set off home on my bicycle along the hill road. A few clouds were gathering over the hills.",
          "tag": "Doesn't follow the outline",
          "correct": false,
          "hint": "What does the outline say happens at the beginning?"
        },
        {
          "text": "I had stayed too long at Nani's house, and now I had to race the rain home. The hill road was the quickest way, but it was steep and empty. Dark clouds were rolling over the hills. A signpost flashed past: Village 5 km. I pedalled harder.",
          "tag": "Correct",
          "correct": true,
          "feedback": "It sets the scene with the clouds, the hill road and the signpost, so the picture is there from the very first lines."
        }
      ],
      [
        {
          "text": "Then, on the steepest bend, I heard a loud crack. My pedals spun round and round, but the bicycle didn't move. The chain had snapped and was lying in the dust. Big drops of rain began to fall, and home was still five kilometres away.",
          "tag": "Correct",
          "correct": true,
          "feedback": "We hear the crack and see the chain in the dust, so the problem feels real."
        },
        {
          "text": "The worst thing happened when I was halfway up the hill. I felt so scared and worried, and my heart was full of fear. I was really upset, and I didn't know what to do. I kept thinking that I would never get home.",
          "tag": "Tells instead of shows",
          "correct": false,
          "hint": "Does this version show us the problem, or just tell us how the narrator felt?"
        }
      ],
      [
        {
          "text": "That was when I saw the dog. It was small and brown, with one floppy ear, and it was sitting by the road, watching me. It trotted towards a narrow path between the trees, then stopped and looked back, as if to say, ‘Follow me.’",
          "tag": "Correct",
          "correct": true,
          "feedback": "It matches the dog in the picture, and the dog's action moves the story forward."
        },
        {
          "text": "A dog came racing down the hill towards me, a huge black one with a shiny red collar. It barked twice, wagged its tail and ran off along a path between the trees. I pushed my bicycle and hurried after it, hoping it knew the way.",
          "tag": "Doesn't match the picture",
          "correct": false,
          "hint": "Compare this dog with the dog in the picture."
        }
      ],
      [
        {
          "text": "At the end of the path, an old farmer was herding goats out of the rain. He mended my chain with his pliers, and I thanked him and cycled off. By then, the dog was nowhere to be seen. I never did find out where it had come from.",
          "tag": "Leaves a question unanswered",
          "correct": false,
          "hint": "What question about the dog is still unanswered at the end?"
        },
        {
          "text": "The path led to a small farmhouse. A farmer was bringing his goats in from the rain. He fixed my chain in five minutes. ‘Bholu brings me all the lost travellers,’ he laughed, patting the dog. After that, I always waved to Bholu whenever I cycled up that hill.",
          "tag": "Correct",
          "correct": true,
          "feedback": "The problem is solved, and we finally find out whose dog it is."
        }
      ]
    ],
    "titles": [
      {
        "text": "Nani's Village",
        "tag": "Wrong focus",
        "correct": false,
        "hint": "Think about what this title tells the reader."
      },
      {
        "text": "The Farmer Who Fixed My Chain",
        "tag": "Gives the ending away",
        "correct": false,
        "hint": "Think about what this title tells the reader."
      },
      {
        "text": "The Dog on the Hill Road",
        "tag": "Works best",
        "correct": true,
        "feedback": "It points to the heart of the story without giving the ending away."
      }
    ]
  },
  {
    "image": "assets/images/picture-2.jpg",
    "alt": "A flooded lane in heavy monsoon rain. A girl on a doorstep sets a paper boat on the water, with more boats floating and a pile of newspaper beside her. A grey kitten crouches on the seat of a scooter standing in the water, and a shopkeeper stands at the door of a kirana store.",
    "details": [
      {
        "name": "The kitten",
        "question": "How did it get up there, and can it get down?",
        "rects": [
          [
            997,
            408,
            107,
            109
          ]
        ]
      },
      {
        "name": "The rising water",
        "question": "How deep will it get?",
        "rects": [
          [
            1081,
            581,
            341,
            141
          ]
        ]
      },
      {
        "name": "The paper boat",
        "question": "Who made it? Could it give someone an idea?",
        "rects": [
          [
            714,
            574,
            356,
            148
          ]
        ]
      },
      {
        "name": "The shopkeeper",
        "question": "Has he noticed the kitten?",
        "rects": [
          [
            1305,
            331,
            106,
            109
          ]
        ]
      }
    ],
    "background": [
      {
        "name": "Street light",
        "rect": [
          995,
          215,
          85,
          185
        ]
      },
      {
        "name": "Flower pot",
        "rect": [
          555,
          350,
          90,
          165
        ]
      }
    ],
    "outline": [
      {
        "tag": "Correct",
        "correct": true,
        "feedback": "The paper boat gives the narrator an idea, so the narrator solves the problem. Every part uses the picture.",
        "parts": [
          "On a monsoon afternoon, I float paper boats in our flooded lane.",
          "I spot a kitten stuck on a scooter as the water rises.",
          "My paper boat gives me an idea: I float Amma's plastic tub out to the kitten.",
          "With help from the shopkeeper, I pull the kitten safely back."
        ]
      },
      {
        "tag": "Doesn't fully connect to the picture",
        "correct": false,
        "hint": "Check each outline against the four details you found. Does it use all of them?",
        "parts": [
          "Heavy rain has flooded our lane, and school is closed for the day.",
          "From the doorstep, I notice a grey kitten trapped on a parked scooter.",
          "After an hour, the clouds clear and the water slowly goes down.",
          "The kitten jumps off the scooter and runs away down the lane."
        ]
      }
    ],
    "parts": [
      [
        {
          "text": "It had rained all morning, and our lane had turned into a river. I sat on the doorstep, folding paper boats out of old newspaper and setting them afloat. Across the lane, Ramesh Uncle stood at the door of his kirana store, frowning at the sky.",
          "tag": "Correct",
          "correct": true,
          "feedback": "It shows the flooded lane, the paper boats and the shopkeeper, so the picture is clear from the start."
        },
        {
          "text": "The morning rain had stopped, and the water in our lane had already drained away, leaving only small puddles. I sat on the doorstep with a pile of old newspapers, folding paper boats to sail later. Across the lane, Ramesh Uncle was pulling up the shutter of his kirana store.",
          "tag": "Doesn't match the picture",
          "correct": false,
          "hint": "Look at the lane in the picture."
        }
      ],
      [
        {
          "text": "Then I noticed a grey kitten sitting on a scooter seat across the lane. It looked a little wet, so it licked its fur and had a long stretch. The water around the scooter wasn't very deep, and after a while, the kitten hopped down and padded off along the wall.",
          "tag": "No real problem",
          "correct": false,
          "hint": "Is the kitten in any danger in this version?"
        },
        {
          "text": "Then I heard a tiny mew. A grey kitten was crouching on the seat of a parked scooter, and muddy water was swirling all around it. Every few minutes, the water crept a little higher. The kitten was shivering, and it was too scared to jump.",
          "tag": "Correct",
          "correct": true,
          "feedback": "We hear the kitten and see the water creeping higher, so the danger feels real."
        }
      ],
      [
        {
          "text": "Ramesh Uncle had seen it too. He rolled up his trousers, splashed across the lane in his rubber boots and lifted the kitten off the scooter. Then he waded over to our doorstep and placed the dripping kitten in my hands. ‘Look after it,’ he said with a smile.",
          "tag": "Doesn't follow the outline",
          "correct": false,
          "hint": "What does the outline say happens at the turning point?"
        },
        {
          "text": "I looked at my paper boat bobbing along, and suddenly I had an idea. I emptied Amma's plastic washing tub, tied a long rope to its handle and pushed it out into the water. It floated! Slowly, I guided it towards the scooter.",
          "tag": "Correct",
          "correct": true,
          "feedback": "The paper boat gives the narrator an idea, and the narrator acts on it. That's what makes this a strong turning point."
        }
      ],
      [
        {
          "text": "The kitten sniffed the tub, then hopped in. Ramesh Uncle grabbed the end of the rope and helped me pull it back. Amma wrapped the kitten in a towel, and soon it was purring in my lap. We named it Naav, which means ‘boat.’",
          "tag": "Correct",
          "correct": true,
          "feedback": "It finishes the rescue and links back to the paper boat with the kitten's name."
        },
        {
          "text": "Soon the kitten was safe and dry inside our house. Amma gave it a saucer of warm milk, and it lapped up every drop. This adventure taught me an important lesson: we must always be kind to animals, because every animal deserves to be safe and loved.",
          "tag": "Skips the real ending",
          "correct": false,
          "hint": "What does the outline say happens at the end? Is it in this version?"
        }
      ]
    ],
    "titles": [
      {
        "text": "Monsoon Pakoras",
        "tag": "Wrong focus",
        "correct": false,
        "hint": "Think about what this title tells the reader."
      },
      {
        "text": "The Rescue Boat",
        "tag": "Works best",
        "correct": true,
        "feedback": "It makes the reader curious and links to the idea at the heart of the story."
      },
      {
        "text": "How Naav Got Its Name",
        "tag": "Gives the ending away",
        "correct": false,
        "hint": "Think about what this title tells the reader."
      }
    ]
  },
  {
    "image": "assets/images/picture-3.jpg",
    "alt": "An evening Diwali mela with a crowd of people. A lit Ferris wheel, a balloon seller holding a bunch of balloons and, beside him, a little boy in a light blue shirt crying alone and holding a red balloon. There is a bangle stall on the right and string lights overhead.",
    "details": [
      {
        "name": "The crying boy",
        "question": "Why is he alone? Where is his family?",
        "rects": [
          [
            983,
            490,
            125,
            228
          ]
        ]
      },
      {
        "name": "The balloon seller",
        "question": "Did he sell the boy his balloon?",
        "rects": [
          [
            772,
            392,
            126,
            304
          ]
        ]
      },
      {
        "name": "The bangle stall",
        "question": "Who might be shopping there?",
        "rects": [
          [
            1205,
            276,
            226,
            419
          ]
        ]
      },
      {
        "name": "The Ferris wheel",
        "question": "What could you see from the top?",
        "rects": [
          [
            480,
            209,
            288,
            300
          ]
        ]
      }
    ],
    "background": [
      {
        "name": "String of lights",
        "rect": [
          930,
          205,
          370,
          65
        ]
      },
      {
        "name": "Bushes",
        "rect": [
          468,
          600,
          90,
          140
        ]
      }
    ],
    "outline": [
      {
        "tag": "Doesn't fully connect to the picture",
        "correct": false,
        "hint": "Check each outline against the four details you found. Does it use all of them?",
        "parts": [
          "The mela is packed, and my cousin and I spot a small boy sobbing by himself.",
          "He doesn't know where his family is, and he can only tell us his name.",
          "To cheer him up, we buy him jalebis and take him on the Ferris wheel.",
          "When we get off the ride, his mother happens to be waiting at the bottom."
        ]
      },
      {
        "tag": "Correct",
        "correct": true,
        "feedback": "The narrator solves the problem using a clue, and every part uses something from the picture.",
        "parts": [
          "At the Diwali mela with my cousin, I see a little boy crying beside the balloon seller.",
          "He's lost, and the balloon seller only remembers that his mother wore a yellow sari.",
          "From the top of the Ferris wheel, I spot a yellow sari near the bangle stall.",
          "We hurry to the bangle stall and find Chintu's mother."
        ]
      }
    ],
    "parts": [
      [
        {
          "text": "Meera Didi and I pushed our way through the crowded mela, past the bangle stall and the Ferris wheel. Fairy lights twinkled overhead, and the loudspeakers were playing film songs. Near the balloon seller, a little boy stood on his own, laughing and waving a big blue balloon.",
          "tag": "Doesn't match the picture",
          "correct": false,
          "hint": "Look closely at the little boy in the picture."
        },
        {
          "text": "The Diwali mela was so crowded that Meera Didi held my hand tightly. The Ferris wheel glittered, and loudspeakers played film songs. Then, beside the balloon seller, I saw a little boy standing all alone. He was holding a red balloon, and he was crying.",
          "tag": "Correct",
          "correct": true,
          "feedback": "It sets the scene at the mela and brings in the crying boy, the main detail in the picture."
        }
      ],
      [
        {
          "text": "We knelt down beside him and asked his name. He told us it was Chintu, so Meera Didi bought him a jalebi to stop him crying. He ate it happily, and soon he was smiling and chatting away about his school and his best friend.",
          "tag": "Loses the problem",
          "correct": false,
          "hint": "What is Chintu's problem? Is it still there in this version?"
        },
        {
          "text": "We knelt down beside him. ‘What's your name?’ asked Meera Didi. ‘Chintu,’ he sobbed. The balloon seller remembered selling him the red balloon. ‘His mother was wearing a yellow sari,’ he said. But there were hundreds of people at the mela. How could we find one yellow sari?",
          "tag": "Correct",
          "correct": true,
          "feedback": "Chintu's few words and the huge crowd show us how hard the problem is."
        }
      ],
      [
        {
          "text": "Then I looked up at the Ferris wheel. From the top, you could see the whole mela! Meera Didi bought tickets, and the three of us climbed in. As our seat reached the very top, I spotted a flash of yellow near the bangle stall. ‘There she is!’ I shouted.",
          "tag": "Correct",
          "correct": true,
          "feedback": "The narrator's idea gives a real clue, and it uses the balloon seller and the bangle stall from the picture."
        },
        {
          "text": "I thought hard about what we could do. We decided to walk round the whole mela, past every stall, looking carefully at every face. Our feet ached, and it took a very long time, but we kept going. In the end, we found the person we were looking for.",
          "tag": "Doesn't follow the outline",
          "correct": false,
          "hint": "What does the outline say happens at the turning point?"
        }
      ],
      [
        {
          "text": "As soon as we got off, we hurried to the bangle stall. A lady in a yellow sari was calling, ‘Chintu! Chintu!’ Chintu ran straight into her arms. She hugged him tightly and thanked us again and again. Before we left, she bought me a red balloon too.",
          "tag": "Correct",
          "correct": true,
          "feedback": "Chintu is safe, and the red balloon at the end links back to the beginning."
        },
        {
          "text": "A woman's voice suddenly called Chintu's name from somewhere near the stalls, and he ran off towards it, waving his balloon. I turned to tell Meera Didi, but she wasn't there. The crowd had swallowed her up, and now I was the one who was lost.",
          "tag": "Starts a new problem",
          "correct": false,
          "hint": "Is the story finished at the end of this version?"
        }
      ]
    ],
    "titles": [
      {
        "text": "The Yellow Sari",
        "tag": "Works best",
        "correct": true,
        "feedback": "It points to the clue at the heart of the story without giving the ending away."
      },
      {
        "text": "Fun at the Mela",
        "tag": "Too general",
        "correct": false,
        "hint": "Think about what this title tells the reader."
      },
      {
        "text": "Chintu Finds His Mother",
        "tag": "Gives the ending away",
        "correct": false,
        "hint": "Think about what this title tells the reader."
      }
    ]
  },
  {
    "image": "assets/images/picture-4.jpg",
    "alt": "An empty classroom after school. A volcano model lies smashed on a desk with orange lava spilled and a cricket ball in the wreckage. Broken glass lies on the desk and floor, and the window has a jagged hole. A poster reads Science Fair Tomorrow, the clock shows half past four, and two boys stare in shock.",
    "details": [
      {
        "name": "The broken model",
        "question": "What happened to it?",
        "rects": [
          [
            834,
            387,
            327,
            194
          ]
        ]
      },
      {
        "name": "The poster",
        "question": "The science fair is tomorrow! Can the model be ready in time?",
        "rects": [
          [
            917,
            220,
            158,
            162
          ]
        ]
      },
      {
        "name": "The broken window and the ball",
        "question": "Who hit the ball? Was it an accident?",
        "rects": [
          [
            1335,
            209,
            90,
            257
          ],
          [
            878,
            505,
            56,
            56
          ]
        ]
      },
      {
        "name": "The clock",
        "question": "Half past four. How much time is left?",
        "rects": [
          [
            1091,
            206,
            117,
            115
          ]
        ]
      }
    ],
    "background": [
      {
        "name": "Blackboard",
        "rect": [
          535,
          210,
          355,
          215
        ]
      },
      {
        "name": "School bag",
        "rect": [
          1305,
          575,
          132,
          165
        ]
      }
    ],
    "outline": [
      {
        "tag": "Doesn't fully connect to the picture",
        "correct": false,
        "hint": "Check each outline against the four details you found. Does it use all of them?",
        "parts": [
          "Arjun and I stay back after school to paint our science fair volcano.",
          "Arjun trips over a school bag, and the model crashes to the floor.",
          "We rush to the stationery shop and buy clay to make a new one.",
          "We finish it late at night, just in time for the fair."
        ]
      },
      {
        "tag": "Correct",
        "correct": true,
        "feedback": "It uses the ball, the window, the poster and the model, and the turning point brings in a new character who helps.",
        "parts": [
          "After school, Arjun and I finish our volcano model for tomorrow's science fair.",
          "A cricket ball crashes through the window and smashes our model.",
          "The boy who hit the ball comes to say sorry and offers to help us rebuild it.",
          "Our new volcano works perfectly at the fair, and we make a new friend."
        ]
      }
    ],
    "parts": [
      [
        {
          "text": "The classroom was empty except for Arjun and me. For two whole weeks, we had worked on our volcano model, and now it was finally finished. On the wall, a big yellow poster said: Science Fair – Tomorrow! The clock showed half past four.",
          "tag": "Correct",
          "correct": true,
          "feedback": "It shows the model, the poster and the clock, and it makes us feel how much the model matters."
        },
        {
          "text": "Arjun and I had finished our volcano model, and we were very happy and very proud. It was a really good model, and we thought it was the best one in the whole class. We were sure we would do very well at the science fair tomorrow.",
          "tag": "Tells instead of shows",
          "correct": false,
          "hint": "Can you picture the classroom from this version?"
        }
      ],
      [
        {
          "text": "Suddenly, there was a loud CRASH! A cricket ball flew through the window, shattered the glass and landed right on top of our volcano. When we looked down, our model lay in pieces. Outside, someone shouted, ‘Oh no!’ and footsteps came running.",
          "tag": "Correct",
          "correct": true,
          "feedback": "It uses the ball and the broken window from the picture, and the footsteps set up what happens next."
        },
        {
          "text": "As Arjun leant over to add a final dab of paint, his elbow knocked the desk. The volcano wobbled, slid off the edge and hit the floor. Two weeks of work lay in pieces at our feet, and neither of us could say a single word.",
          "tag": "Doesn't match the picture",
          "correct": false,
          "hint": "What does the picture show about how the model broke?"
        }
      ],
      [
        {
          "text": "Ma'am appeared at the door and saw the broken model. ‘Don't worry,’ she said kindly. ‘You can show your old project from last year instead.’ So we didn't need to make a new model after all, and we packed our bags and went home.",
          "tag": "The problem just disappears",
          "correct": false,
          "hint": "What does the outline say happens at the turning point?"
        },
        {
          "text": "A tall boy from Class 8 appeared at the door, out of breath. It was Kabir, the best batsman in the school. He saw the broken model and went red. ‘I'm really sorry,’ he said. ‘Let me help you fix it. I'm good with glue.’",
          "tag": "Correct",
          "correct": true,
          "feedback": "A new character turns up to make things right, and that changes the direction of the story."
        }
      ],
      [
        {
          "text": "With Kabir's help, we fixed the model, and it worked well at the fair the next day. This story teaches us two lessons: we should never play cricket near classrooms, and we must always say sorry when we make a mistake.",
          "tag": "Skips the real ending",
          "correct": false,
          "hint": "What does the outline say happens at the end? Is it in this version?"
        },
        {
          "text": "The three of us worked until the watchman locked the gates. The next day, our new volcano bubbled and foamed in front of the judges, even better than before. We didn't win first prize, but we did make a new friend. Kabir promised to hit his sixes somewhere else.",
          "tag": "Correct",
          "correct": true,
          "feedback": "The problem is solved, and the last line brings back the cricket ball with a smile."
        }
      ]
    ],
    "titles": [
      {
        "text": "My School Day",
        "tag": "Too general",
        "correct": false,
        "hint": "Think about what this title tells the reader."
      },
      {
        "text": "How Kabir Became Our Friend",
        "tag": "Gives the ending away",
        "correct": false,
        "hint": "Think about what this title tells the reader."
      },
      {
        "text": "The Six That Smashed Our Volcano",
        "tag": "Works best",
        "correct": true,
        "feedback": "It's lively and makes the reader curious, without giving away the ending."
      }
    ]
  },
  {
    "image": "assets/images/picture-5.jpg",
    "alt": "Rooftop terraces at sunset on Makar Sankranti, with the sky full of colourful kites. On the left terrace, a worried child holds a spool, and the string leads to a green kite with a yellow tail tangled in a big neem tree. On the right terrace, an old man sits on a chair, with a long bamboo pole leaning beside him.",
    "details": [
      {
        "name": "The kite in the tree",
        "question": "How will it be rescued?",
        "rects": [
          [
            1149,
            272,
            127,
            130
          ]
        ]
      },
      {
        "name": "The old man",
        "question": "Who is he, and why is he watching?",
        "rects": [
          [
            1238,
            475,
            127,
            160
          ]
        ]
      },
      {
        "name": "The bamboo pole",
        "question": "What might it be used for?",
        "rects": [
          [
            1356,
            337,
            75,
            138
          ]
        ]
      },
      {
        "name": "The kites in the sky",
        "question": "What festival is it?",
        "rects": [
          [
            533,
            213,
            450,
            201
          ]
        ]
      }
    ],
    "background": [
      {
        "name": "Water tank",
        "rect": [
          470,
          290,
          62,
          90
        ]
      },
      {
        "name": "Washing line",
        "rect": [
          1366,
          478,
          70,
          60
        ]
      }
    ],
    "outline": [
      {
        "tag": "Correct",
        "correct": true,
        "feedback": "The narrator is brave enough to ask for help, and the old man and the bamboo pole from the picture both matter.",
        "parts": [
          "On Makar Sankranti, I fly my brand-new kite from our terrace.",
          "It gets stuck in the neem tree beside grumpy Bhaskar Dada's terrace.",
          "I gather my courage and ask Bhaskar Dada for help.",
          "He frees my kite with his bamboo pole and turns out to be a kite champion."
        ]
      },
      {
        "tag": "Doesn't fully connect to the picture",
        "correct": false,
        "hint": "Check each outline against the four details you found. Does it use all of them?",
        "parts": [
          "It's Makar Sankranti, and I'm out on the terrace with my new green kite.",
          "A gust of wind blows it into the neem tree next to Bhaskar Dada's house.",
          "Too scared to ask grumpy Bhaskar Dada for help, I go downstairs to watch television.",
          "The next morning, Papa brings home a new kite for me."
        ]
      }
    ],
    "parts": [
      [
        {
          "text": "It was early on Makar Sankranti morning, and the sky was a clear, empty blue. Nobody else had come up to their rooftops yet. Holding my new green kite, I let the string out slowly and watched it climb, all alone above the quiet colony.",
          "tag": "Doesn't match the picture",
          "correct": false,
          "hint": "Look at the sky in the picture. Does this version match it?"
        },
        {
          "text": "On Makar Sankranti, the sky over our colony was full of kites. I stood on our terrace with my brand-new kite, a green one with a yellow tail. I let out the string, and up it went, higher and higher, dancing above the rooftops.",
          "tag": "Correct",
          "correct": true,
          "feedback": "It shows the festival and the sky full of kites, just like the picture."
        }
      ],
      [
        {
          "text": "Then a strong gust of wind caught it. My kite swooped down and got stuck in the branches of the big neem tree. The tree grew right beside Bhaskar Dada's terrace. I tugged the string, but the kite only got more tangled.",
          "tag": "Correct",
          "correct": true,
          "feedback": "We see the kite swoop and tangle, and the tree's position brings Bhaskar Dada into the story."
        },
        {
          "text": "Then my kite got stuck in the tree, which was a very big problem for me. I was very sad, because it was my brand-new kite and I really loved it. I did not know what to do next, and I felt so upset that I almost cried.",
          "tag": "Tells instead of shows",
          "correct": false,
          "hint": "Does this version show us the problem, or just tell us about it?"
        }
      ],
      [
        {
          "text": "Our neighbour, Bhaskar Dada, has lived in the colony for thirty years. He has a grey moustache and a walking stick, and every morning at exactly seven o'clock, he waters the tulsi plant beside his door. Most children are a little afraid of him.",
          "tag": "Nothing happens",
          "correct": false,
          "hint": "Does anything happen in this version?"
        },
        {
          "text": "Bhaskar Dada was sitting on his terrace, watching me. Everyone in the colony said he was grumpy. My heart was thumping, but I walked to the edge of our terrace. ‘Dada,’ I called, ‘could you please help me get my kite?’",
          "tag": "Correct",
          "correct": true,
          "feedback": "The narrator does something brave, and that's the moment the story turns."
        }
      ],
      [
        {
          "text": "To my surprise, Bhaskar Dada smiled. He picked up his long bamboo pole and freed my kite in a flash. ‘When I was your age, I was the kite champion of this whole colony,’ he said. That evening, we flew my kite together.",
          "tag": "Correct",
          "correct": true,
          "feedback": "It solves the problem with the bamboo pole and turns ‘grumpy’ Bhaskar Dada into a friend."
        },
        {
          "text": "Bhaskar Dada fetched his bamboo pole and poked at the branches until my kite came loose. I was so happy that I pulled the string too hard. It snapped, and my kite floated away over the rooftops, far out of sight. I never saw it again.",
          "tag": "Starts a new problem",
          "correct": false,
          "hint": "Is the story finished at the end of this version?"
        }
      ]
    ],
    "titles": [
      {
        "text": "Makar Sankranti",
        "tag": "Too general",
        "correct": false,
        "hint": "Think about what this title tells the reader."
      },
      {
        "text": "The Kite in the Neem Tree",
        "tag": "Works best",
        "correct": true,
        "feedback": "It points to the problem at the heart of the story and makes the reader curious."
      },
      {
        "text": "Bhaskar Dada, the Kite Champion",
        "tag": "Gives the ending away",
        "correct": false,
        "hint": "Think about what this title tells the reader."
      }
    ]
  }
];
