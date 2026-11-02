// Content for "Dance Forms of India" (from en_geo_05_wg215.docx).
// key       image file name (assets/images/dancers|cutouts|silhouettes/<key>.png)
// name      dance name shown on the buttons and tiles
// state     state / UT it comes from (fact card, spoken text)
// shape     key of that state in map-data.js
// fact      "Did you know?" text on the fact card
// word      dance name to decode on screen 3; pattern: "_" is a blank the player fills
// decoys    extra letters mixed in with the missing ones on screen 3
// clue      clue text on screen 3
window.DANCES = [
  { key: 'garba', name: 'Garba', state: 'Gujarat', shape: 'gujarat',
    fact: 'Danced in circles around a lamp during Navratri. The circle stands for the cycle of life.',
    word: 'GARBA', pattern: 'G _ R B _', decoys: 'EO', clue: 'This dance originated in Gujarat.' },
  { key: 'bihu', name: 'Bihu', state: 'Assam', shape: 'assam',
    fact: 'Danced during Bohag Bihu, the Assamese New Year in April, to welcome spring and the new farming season.',
    word: 'BIHU', pattern: 'B _ H _', decoys: 'AO', clue: 'This dance originated in Assam.' },
  { key: 'bhangra', name: 'Bhangra', state: 'Punjab', shape: 'punjab',
    fact: 'Farmers danced Bhangra to celebrate the harvest, especially at Baisakhi, to the loud beat of the dhol.',
    word: 'BHANGRA', pattern: 'B _ A N _ R _', decoys: 'KE', clue: 'This dance originated in Punjab.' },
  { key: 'ghoomar', name: 'Ghoomar', state: 'Rajasthan', shape: 'rajasthan',
    fact: 'From ghoomna, meaning to spin. Women twirl in long, flowing skirts that spread out like flowers.',
    word: 'GHOOMAR', pattern: 'G _ O O _ A _', decoys: 'NU', clue: 'This dance originated in Rajasthan.' },
  { key: 'mohiniyattam', name: 'Mohiniyattam', state: 'Kerala', shape: 'kerala',
    fact: 'Named after Mohini, a graceful enchantress from legends. Its soft swaying is said to look like palm trees moving in the breeze.',
    word: 'MOHINIYATTAM', pattern: 'M O _ _ N _ _ A _ _ A _', decoys: 'EU', clue: 'This dance originated in Keralam (earlier Kerala).' },
  { key: 'bharatanatyam', name: 'Bharatanatyam', state: 'Tamil Nadu', shape: 'tamil-nadu',
    fact: 'This dance was performed in the great temples of Tamil Nadu. Its poses are carved on the walls of the Chidambaram temple!',
    word: 'BHARATANATYAM', pattern: 'B _ A _ A _ _ N _ T _ A _', decoys: 'EO', clue: 'This dance originated in Tamil Nadu.' },
  { key: 'kathak', name: 'Kathak', state: 'Uttar Pradesh', shape: 'uttar-pradesh',
    fact: 'Kathak comes from katha, meaning story. Storytellers travelled from village to village, telling tales through dance.',
    word: 'KATHAK', pattern: 'K _ T H _ K', decoys: 'EI', clue: 'This dance originated in Uttar Pradesh.' },
  { key: 'odissi', name: 'Odissi', state: 'Odisha', shape: 'odisha',
    fact: 'One of India’s oldest dances. Its poses are carved on ancient temples like the Konark Sun Temple.',
    word: 'ODISSI', pattern: 'O _ I S _ I', decoys: 'AT', clue: 'This dance originated in Odisha.' },
  { key: 'manipuri', name: 'Manipuri', state: 'Manipur', shape: 'manipur',
    fact: 'A gentle, flowing dance where feet barely stamp the ground. Dancers often act out stories of Krishna and Radha.',
    word: 'MANIPURI', pattern: 'M _ N I _ U _ I', decoys: 'EO', clue: 'This dance originated in Manipur.' },
  { key: 'kuchipudi', name: 'Kuchipudi', state: 'Andhra Pradesh', shape: 'andhra-pradesh',
    fact: 'Named after a village called Kuchipudi. Dancers sometimes perform while balancing on the edge of a brass plate!',
    word: 'KUCHIPUDI', pattern: 'K _ C H _ P _ D _', decoys: 'AE', clue: 'This dance originated in Andhra Pradesh.' },
  { key: 'lezim', name: 'Lezim', state: 'Maharashtra', shape: 'maharashtra',
    fact: 'Dancers hold a lezim, a wooden stick with jingling metal discs. It is often danced in processions during Ganesh Chaturthi.',
    word: 'LEZIM', pattern: 'L _ Z I _', decoys: 'AN', clue: 'This dance originated in Maharashtra.' },
  { key: 'garhwali', name: 'Garhwali', state: 'Uttarakhand', shape: 'uttarakhand',
    fact: 'The people of the Garhwal hills dance together at village fairs and festivals, often in a circle, to the beat of the dhol and damau.',
    word: 'GARHWALI', pattern: 'G _ R H _ A _ I', decoys: 'EN', clue: 'This dance originated in Uttarakhand.' },
  { key: 'dhunuchi-nritya', name: 'Dhunuchi Nritya', state: 'West Bengal', shape: 'west-bengal',
    fact: 'Danced during Durga Puja while holding a dhunuchi, a clay pot with smoking incense, to the beat of the dhak drum.',
    word: 'DHUNUCHI NRITYA', pattern: 'D _ _ N _ C H _ N _ _ T _ A', decoys: 'KS', clue: 'This dance originated in West Bengal.' },
  { key: 'rouf-dance', name: 'Rouf Dance', state: 'Jammu and Kashmir', shape: 'jammu-kashmir',
    fact: 'Women stand in rows facing each other, arms linked, and sway gently. It is danced to welcome spring and at festivals like Eid.',
    word: 'ROUF', pattern: 'R _ U _', decoys: 'AE', clue: 'This dance originated in Jammu and Kashmir.' },
  { key: 'yakshagana', name: 'Yakshagana', state: 'Karnataka', shape: 'karnataka',
    fact: 'A dance-drama with huge, colourful headgear! Performances can go on all night, telling stories from the epics.',
    word: 'YAKSHAGANA', pattern: 'Y _ K S _ A _ A N _', decoys: 'EO', clue: 'This dance originated in Karnataka.' }
];

// Screen 1: three rounds of five dancers each (the order of the dancers on the screen).
window.ROUNDS = [
  ['garba', 'ghoomar', 'mohiniyattam', 'bihu', 'bhangra'],
  ['bharatanatyam', 'kathak', 'odissi', 'manipuri', 'kuchipudi'],
  ['lezim', 'garhwali', 'dhunuchi-nritya', 'rouf-dance', 'yakshagana']
];

// Screen 2: the order of the dancers in the list.
window.MAP_ORDER = [
  'garba', 'bihu', 'bhangra', 'ghoomar', 'mohiniyattam',
  'bharatanatyam', 'kathak', 'odissi', 'manipuri', 'kuchipudi',
  'lezim', 'garhwali', 'dhunuchi-nritya', 'rouf-dance', 'yakshagana'
];

// Screen 3: how many dances have to be decoded.
window.DECODE_COUNT = 6;
