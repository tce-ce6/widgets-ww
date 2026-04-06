let practiceIndex = 0;
let earnedStars = 0;
let currentUserAnswer = [];
let practiceCompleted = false;
let answerVisible = false;
let answersVisible = false;
let sentenceAttempted = false;
let hintIndex = 0;

const categories = [

  {
    name: "Feelings",
    mode: "sentence",
    label: "hang-label-feeling-describewords.svg",
    words: [
    {
      word: "EXCITED",
      correct: ["We","were","excited","about","the","school","trip","."],
      jumbled: ["about","the","school","trip","excited","we","were","."]
    },
    {
      word: "NERVOUS",
      correct: ["I", "felt", "nervous", "before", "my", "first", "performance","."],
      jumbled: ["felt", "my", "first", "performance", "before", "nervous", "I","."]
    },
    {
      word: "PROUD",
      correct: ["She", "was", "proud", "after", "winning", "the", "competition","."],
      jumbled: ["the", "after", "winning", "competition", "proud", "she", "was","."]
    },
    {
      word: "LONELY",
      correct: ["The", "new", "student", "felt", "lonely", "without", "friends","."],
      jumbled: ["without", "friends", "felt", "the", "new", "student", "lonely","."]
    },
    {
      word: "JEALOUS",
      correct: ["Rohan", "felt", "jealous", "of", "his", "friend's", "bicycle","."],
      jumbled: ["bicycle", "felt", "of", "Rohan", "friend's", "jealous", "his","."]
    },
    {
      word: "CALM",
      correct: ["Taking", "a", "deep", "breath", "makes", "me", "calm","."],
      jumbled: ["a", "calm", "me", "deep", "makes", "breath", "taking","."]
    },
    {
      word: "ANGRY",
      correct: ["Amit", "got", "angry", "when", "his", "toy", "broke","."],
      jumbled: ["toy", "his", "broke", "angry", "got", "when", "Amit","."]
    },
    {
      word: "UPSET",
      correct: ["Losing", "her", "favourite", "book", "made", "Arya", "upset","."],
      jumbled: ["upset", "Arya", "made", "book", "favourite", "her", "losing","."]
    }
    ],

    grid: [
    ["Y","J","E","A","L","O","U","S","T","P"],
    ["U","W","V","B","N","O","G","S","Q","R"],
    ["P","V","M","T","A","G","P","V","N","O"],
    ["S","G","N","D","T","V","R","B","Z","U"],
    ["E","Y","L","O","N","E","L","Y","D","D"],
    ["T","W","I","Z","B","V","P","X","T","Y"],
    ["J","Y","E","X","W","N","C","J","J","C"],
    ["N","E","R","V","O","U","S","G","F","A"],
    ["S","E","Y","U","P","D","F","K","S","L"],
    ["E","X","C","I","T","E","D","L","C","M"]
  ]

  },

    {
  name: "Festivals",
  mode: "sentence",
  label: "hang-label-festivals-describewords.svg",
  words: [
    {
      word: "HOLY",
      jumbled: ["village","whole","the","united","festival","holy","the","."],
      correct: ["The","holy","festival","united","the","whole","village","."]
    },
    {
      word: "COLOURFUL",
      jumbled: ["rangoli","looked","the","colourful","so","pretty","."],
      correct: ["The","colourful","rangoli","looked","so","pretty","."]
    },
    {
      word: "FESTIVE",
      jumbled: ["mood","in","a","festive","was","everybody","."],
      correct: ["Everybody","was","in","a","festive","mood","."]
    },
    {
      word: "GRAND",
      jumbled: ["city","our","through","passed","procession","grand","the","."],
      correct: ["The","grand","procession","passed","through","our","city","."]
    },
    {
      word: "FRAGRANT",
      correct: ["We", "used", "fragrant", "flower", "garlands", "for", "decoration","."],
      jumbled: ["decoration", "flower", "fragrant", "used", "garlands", "for", "We","."]
    },
    {
      word: "SPECIAL",
      correct: ["Our", "family", "shared", "a", "special", "festival", "meal","."],
      jumbled: ["festival", "a", "shared", "family", "Our", "special", "meal","."]
    },
    {
      word: "LOUD",
      jumbled: ["sister","little","my","scared","firecrackers","loud","the","."],
      correct: ["The","loud","firecrackers","scared","my","little","sister","."]
    },
    {
      word: "FANCY",
      jumbled: ["Diwali","for","dress","fancy","her","wore","Diya","."],
      correct: ["Diya","wore","her","fancy","dress","for","Diwali","."]
    }

  ],

grid: [
["C","A","F","E","S","T","I","V","E","W"],
["O","F","R","R","W","O","M","P","E","A"],
["L","G","A","T","F","A","N","C","Y","F"],
["O","U","G","S","H","J","K","L","U","V"],
["U","W","R","T","H","O","L","Y","T","B"],
["R","Q","A","R","U","K","Q","Z","T","G"],
["F","M","N","W","B","M","T","A","R","R"],
["U","P","T","M","L","O","U","D","F","A"],
["L","T","D","E","C","V","Q","Z","A","N"],
["O","S","P","E","C","I","A","L","D","D"]
]
},
  {
  name: "Festivals",
  mode: "sentence",
  label: "hang-label-festival-actionwords.svg",
  words: [
    {
      word: "CELEBRATE",
      correct: ["We", "celebrate", "festivals", "with", "songs", "and", "dance","."],
      jumbled: ["songs", "and", "dance", "festivals", "celebrate", "we", "with","."]
    },
    {
      word: "LIGHT",
      correct: ["Children", "light", "colourful", "lamps","."],
      jumbled: ["children", "colourful", "light", "lamps","."]
    },
    {
      word: "PREPARE",
      correct: ["Our", "mother", "prepares", "sweets", "for", "the", "festival","."],
      jumbled: ["mother", "festival", "our", "the", "for", "prepares", "sweets","."]
    },
    {
      word: "GREET",
      correct: ["We", "greet", "our", "friends", "with", "warm", "wishes","."],
      jumbled: ["friends", "we", "greet", "our", "warm", "wishes", "with","."]
    },
    {
      word: "DECORATE",
      correct: ["They", "decorate", "the", "house", "with", "flowers","."],
      jumbled: ["decorate", "the", "house", "with", "flowers", "they","."]
    },
    {
      word: "FEAST",
      correct: ["Families", "feast", "on", "delicious", "food","."],
      jumbled: ["families", "delicious", "on", "food", "feast","."]
    },
    {
      word: "GATHER",
      correct: ["Relatives", "gather", "at", "home", "to", "celebrate", "festivals","."],
      jumbled: ["relatives", "gather", "celebrate", "at", "to", "home", "festivals","."]
    },
    {
      word: "ADORN",
      correct: ["People", "adorn", "their", "homes", "with", "lights","."],
      jumbled: ["adorn", "with", "lights", "people", "their", "homes","."]
    }

  ],
  grid: [
["W","Z","G","A","T","H","E","R","Q","D"],
["C","P","T","S","D","R","S","Q","T","G"],
["E","K","Z","G","P","O","Y","W","W","R"],
["L","I","G","H","T","T","R","O","A","E"],
["E","F","Z","C","C","G","V","N","C","E"],
["B","K","F","E","A","S","T","A","Q","T"],
["R","Z","Z","T","B","R","O","J","T","S"],
["A","G","P","R","E","P","A","R","E","M"],
["T","Z","T","E","O","N","B","D","P","T"],
["E","W","D","E","C","O","R","A","T","E"]
]
},

  {
    name: "Nature",
    mode: "image",
    label: "hang-label-nature-namingwords.svg",
    words: [
      {
      word: "MEADOW",
      correct: "Assets/images/Final images/Group_01/01_Meadow.svg",
      wrong: "Assets/images/Final images/Group_01/01_Desert.svg"
    },

    {
      word: "RAINBOW",
      correct: "Assets/images/Final images/Group_01/02_Rainbow.svg",
      wrong: "Assets/images/Final images/Group_01/02_ShootStar.svg"
    },

    {
      word: "PUDDLE",
      correct: "Assets/images/Final images/Group_01/03_MudPuddle.svg",
      wrong: "Assets/images/Final images/Group_01/03_Lake.svg"
    },

    {
      word: "CLOUD",
      correct: "Assets/images/Final images/Group_01/04_CloudsSky.svg",
      wrong: "Assets/images/Final images/Group_01/04_ClearSky.svg"
    },

    {
      word: "PEBBLE",
      correct: "Assets/images/Final images/Group_01/05_SmallPebble.svg",
      wrong: "Assets/images/Final images/Group_01/05_LargeRock.svg"
    },

    {
      word: "BREEZE",
      correct: "Assets/images/Final images/Group_01/06_Breaze.svg",
      wrong: "Assets/images/Final images/Group_01/06_TreeBending.svg"
    },

    {
      word: "DEW",
      correct: "Assets/images/Final images/Group_01/07_Dew.svg",
      wrong: "Assets/images/Final images/Group_01/07_Fog.svg"
    },

    {
      word: "FOREST",
      correct: "Assets/images/Final images/Group_01/08_Forest.svg",
      wrong: "Assets/images/Final images/Group_01/08_Grassland.svg"
    }
    ],
    grid: [
["F","O","R","E","S","T","W","D","E","W"],
["E","J","K","G","F","T","U","I","C","E"],
["S","M","E","A","D","O","W","E","E","C"],
["P","V","W","W","D","E","H","W","H","L"],
["U","R","P","E","B","B","L","E","P","O"],
["D","W","G","W","D","O","T","Q","C","U"],
["D","D","W","C","R","S","T","M","Q","D"],
["L","A","B","R","E","E","Z","E","B","U"],
["E","T","R","D","E","F","G","R","A","M"],
["X","R","A","I","N","B","O","W","M","Y"]
]
  },
   {
    name: "People",
    mode: "sentence",
    label: "hang-label-people-describewords.svg",
    words: [
      {
      word: "CARING",
      correct: ["My", "grandmother", "is", "a", "very", "caring", "person","."],
      jumbled: ["person", "caring", "very", "a", "is", "grandmother", "my","."]
    },
    {
      word: "LOVING",
      correct: ["Our", "loving", "parents", "always", "support", "us","."],
      jumbled: ["support", "always", "us", "our", "loving", "parents","."]
    },
    {
      word: "HELPFUL",
      correct: ["Our", "neighbour", "is", "always", "helpful", "with", "chores","."],
      jumbled: ["neighbour", "our", "with", "always", "is", "chores", "helpful","."]
    },
    {
      word: "PATIENT",
      correct: ["My", "teacher", "is", "very", "patient", "with", "students","."],
      jumbled: ["students", "my", "very", "teacher", "is", "patient", "with","."]
    },
    {
      word: "STRICT",
      correct: ["Our", "coach", "is", "strict", "about", "training","."],
      jumbled: ["about", "strict", "our", "training", "coach", "is","."]
    },
    {
      word: "GENTLE",
      correct: ["The", "doctor", "was", "gentle", "with", "the", "baby","."],
      jumbled: ["baby", "the", "with", "gentle", "was", "doctor", "the","."]
    },
    {
      word: "BRAVE",
      correct: ["The", "brave", "girl", "faced", "the", "robber", "alone","."],
      jumbled: ["robber", "the", "faced", "alone", "brave", "girl", "the","."]
    },
    {
      word: "WISE",
      correct: ["My", "wise", "grandmother", "always", "gives", "good", "advice","."],
      jumbled: ["advice", "always", "grandmother", "my", "wise", "gives", "good","."]
    }
    ],
    grid: [
["A","H","E","L","P","F","U","L","M","P"],
["F","G","Y","T","Y","K","J","O","N","A"],
["T","H","E","W","D","E","H","V","P","T"],
["S","T","R","I","C","T","E","I","Q","I"],
["W","L","S","S","A","S","D","N","W","E"],
["E","B","B","E","P","D","C","G","R","N"],
["Q","R","M","X","O","Z","X","X","T","T"],
["W","A","E","C","A","R","I","N","G","P"],
["Z","V","D","F","G","W","K","L","B","M"],
["G","E","N","T","L","E","V","X","H","L"]
]
  },
    {
    name: "Sports",
    mode: "image",
    label: "hang-label-sports-actionwords.svg",
    words: [
      {
      word: "SCORE",
      correct: "Assets/images/Final images/Group_02/01_FootballPost.svg",
      wrong: "Assets/images/Final images/Group_02/01_ChildRace.svg"
    },

    {
      word: "RACE",
      correct: "Assets/images/Final images/Group_02/02_ChildrenRace.svg",
      wrong: "Assets/images/Final images/Group_02/02_ChildrenBasketball.svg"
    },

    {
      word: "SKIP",
      correct: "Assets/images/Final images/Group_02/03_ChildSkipRope.svg",
      wrong: "Assets/images/Final images/Group_02/03_ChildHopscotch.svg"
    },

    {
      word: "LIFT",
      correct: "Assets/images/Final images/Group_02/04_weightlifter.svg",
      wrong: "Assets/images/Final images/Group_02/04_Boxing.svg"
    },

    {
      word: "BAT",
      correct: "Assets/images/Final images/Group_02/05_Batting.svg",
      wrong: "Assets/images/Final images/Group_02/05_Bowling.svg"
    },

    {
      word: "AIM",
      correct: "Assets/images/Final images/Group_02/06_Archer.svg",
      wrong: "Assets/images/Final images/Group_02/06_Gymnast.svg"
    },

    {
      word: "CLIMB",
      correct: "Assets/images/Final images/Group_02/07_Climb.svg",
      wrong: "Assets/images/Final images/Group_02/07_Hiking.svg"
    },

    {
      word: "CYCLE",
      correct: "Assets/images/Final images/Group_02/08_Cycling.svg",
      wrong: "Assets/images/Final images/Group_02/08_Rollerblading.svg"
    }
    ],

    grid: [
["B","A","T","S","S","K","I","P","F","R"],
["E","E","T","O","G","H","G","M","G","A"],
["G","B","J","U","W","Q","S","T","O","C"],
["L","I","F","T","F","E","H","B","M","E"],
["C","R","M","P","O","A","I","M","P","C"],
["C","J","P","Y","G","F","A","X","E","C"],
["Z","S","C","O","R","E","G","R","F","Y"],
["I","A","A","J","Y","O","C","P","G","C"],
["C","L","I","M","B","O","S","P","H","L"],
["F","X","W","L","K","U","T","F","S","E"]
]    
  },
      {
    name: "Animals",
    mode: "image",
    label: "hang-label-animal-sounds.svg",
    words: [
      {
      word: "ROAR",
      correct: "Assets/images/Final images/Group_03/01_LionRoaring.svg",
      wrong: "Assets/images/Final images/Group_03/01_Monkey.svg"
    },

    {
      word: "BARK",
      correct: "Assets/images/Final images/Group_03/02_DogBarking.svg",
      wrong: "Assets/images/Final images/Group_03/02_CatMewing.svg"
    },

    {
      word: "CHIRP",
      correct: "Assets/images/Final images/Group_03/03_BirdChirping.svg",
      wrong: "Assets/images/Final images/Group_03/03_OwlHooting.svg"
    },

    {
      word: "GROWL",
      correct: "Assets/images/Final images/Group_03/04_BearGrowling.svg",
      wrong: "Assets/images/Final images/Group_03/04_HorseNeighing.svg"
    },

    {
      word: "HOWL",
      correct: "Assets/images/Final images/Group_03/05_WolfHawling.svg",
      wrong: "Assets/images/Final images/Group_03/05_Hyena.svg"
    },

    {
      word: "HISS",
      correct: "Assets/images/Final images/Group_03/06_SnakeHissing.svg",
      wrong: "Assets/images/Final images/Group_03/06_BeeBuzzing.svg"
    },

    {
      word: "SQUEAK",
      correct: "Assets/images/Final images/Group_03/07_Mice.svg",
      wrong: "Assets/images/Final images/Group_03/07_Crow.svg"
    },

    {
      word: "TRUMPET",
      correct: "Assets/images/Final images/Group_03/08_Elephant.svg",
      wrong: "Assets/images/Final images/Group_03/08_Goat.svg"
    }
    ], 
    
    grid: [
["B","A","R","K","Q","X","C","B","L","H"],
["T","Q","M","W","W","A","P","A","K","O"],
["H","I","S","S","E","W","O","O","H","W"],
["V","J","Q","M","F","G","R","O","W","L"],
["V","L","U","V","B","W","O","A","P","A"],
["A","G","E","X","C","V","A","F","D","C"],
["Q","E","A","P","M","N","R","M","E","H"],
["V","B","K","V","R","F","M","D","Y","I"],
["M","C","T","I","R","W","H","Q","G","R"],
["T","R","U","M","P","E","T","Y","K","P"]
]

  },
      {
    name: "Animals",
    mode: "image",
    label: "hang-label-animal-describewords.svg",
    words: [
      {
      word: "FURRY",
      correct: "Assets/images/Final images/Group_04/01_Bear.svg",
      wrong: "Assets/images/Final images/Group_04/01_Cow.svg"
    },

    {
      word: "FIERCE",
      correct: "Assets/images/Final images/Group_04/02_Tiger.svg",
      wrong: "Assets/images/Final images/Group_04/02_Mice.svg"
    },

    {
      word: "FEATHERED",
      correct: "Assets/images/Final images/Group_04/03_Peacock.svg",
      wrong: "Assets/images/Final images/Group_04/03_Cat.svg"
    },

    {
      word: "STRIPED",
      correct: "Assets/images/Final images/Group_04/04_Zebra.svg",
      wrong: "Assets/images/Final images/Group_04/04_Cheetah.svg"
    },

    {
      word: "SPOTTED",
      correct: "Assets/images/Final images/Group_04/05_Leopard.svg",
      wrong: "Assets/images/Final images/Group_04/05_Lion.svg"
    },

    {
      word: "HORNED",
      correct: "Assets/images/Final images/Group_04/06_Deer.svg",
      wrong: "Assets/images/Final images/Group_04/06_Camel.svg"
    },

    {
      word: "WEBBED",
      correct: "Assets/images/Final images/Group_04/07_Duck.svg",
      wrong: "Assets/images/Final images/Group_04/07_Crane.svg"
    },

    {
      word: "POISONOUS",
      correct: "Assets/images/Final images/Group_04/08_Snake.svg",
      wrong: "Assets/images/Final images/Group_04/08_Fox.svg"
    }
    ], 

    grid: [
["Q","S","H","E","G","W","R","F","S","F"],
["S","P","O","T","T","E","D","G","E","E"],
["T","E","R","E","J","B","F","F","R","A"],
["R","F","N","F","H","B","E","I","H","T"],
["I","D","E","L","K","E","E","E","J","H"],
["P","S","D","P","O","D","R","R","K","E"],
["E","X","Y","A","J","Y","O","C","L","R"],
["D","S","V","A","J","Y","O","E","A","E"],
["Q","W","F","U","R","R","Y","Y","W","D"],
["P","O","I","S","O","N","O","U","S","W"]
]
  },
      {
    name: "Weather",
    mode: "sentence",
    label: "hang-label-weather-describewords.svg",
    words: [
      {
      word: "SUNNY",
      correct: ["We", "enjoyed", "a", "picnic", "in", "sunny", "weather","."],
      jumbled: ["sunny", "in", "weather", "enjoyed", "we", "a", "picnic","."]
    },
    {
      word: "RAINY",
      correct: ["It", "was", "a", "rainy", "day", "yesterday","."],
      jumbled: ["rainy", "was", "a", "it", "day", "yesterday","."]
    },
    {
      word: "CLOUDY",
      correct: ["The", "cloudy", "sky", "blocked", "the", "sun","."],
      jumbled: ["sun", "the", "blocked", "sky", "the", "cloudy","."]
    },
    {
      word: "WINDY",
      correct: ["The", "windy", "day", "made", "the", "leaves", "fly","."],
      jumbled: ["leaves", "fly", "the", "windy", "day", "made", "the","."]
    },
    {
      word: "STORMY",
      correct: ["We", "stayed", "indoors", "during", "the", "stormy", "weather","."],
      jumbled: ["stormy", "indoors", "the", "during", "we", "stayed", "weather","."]
    },
    {
      word: "FOGGY",
      correct: ["The", "foggy", "morning", "made", "driving", "difficult","."],
      jumbled: ["driving", "difficult", "the", "morning", "made", "foggy","."]
    },
    {
      word: "HOT",
      correct: ["We", "felt", "very", "hot", "in", "the", "sun","."],
      jumbled: ["sun", "felt", "in", "very", "the", "hot", "we","."]
    },
    {
      word: "HUMID",
      correct: ["The", "humid", "air", "made", "us", "sweat","."],
      jumbled: ["us", "made", "the", "sweat", "humid", "air","."]
    }
    ],

    grid: [
["H","U","M","I","D","U","Z","W","U","S"],
["O","Q","T","J","J","C","X","B","G","U"],
["T","E","R","A","I","N","Y","C","W","N"],
["R","W","G","H","O","P","K","L","C","N"],
["C","T","P","Z","T","W","I","N","D","Y"],
["L","G","S","D","E","Y","P","M","Q","U"],
["O","B","S","T","O","R","M","Y","Z","S"],
["U","V","D","E","R","F","T","H","U","J"],
["D","N","S","X","V","B","W","Q","L","N"],
["Y","L","F","O","G","G","Y","T","P","Z"]
]
  },

  {
  name: "Animal Groups",
  mode: "image",
  label: "hang-label-animalgroups-namingwords.svg",
  words: [
    {
      word: "GAGGLE",
      correct: "Assets/images/Final images/Group_05/01_GeeseGr.svg",
      wrong: "Assets/images/Final images/Group_05/01_ChickenGr.svg"
    },

    {
      word: "FLOCK",
      correct: "Assets/images/Final images/Group_05/02_Sheeps.svg",
      wrong: "Assets/images/Final images/Group_05/02_Cows.svg"
    },

    {
      word: "PACK",
      correct: "Assets/images/Final images/Group_05/03_Wolves.svg",
      wrong: "Assets/images/Final images/Group_05/03_Cats.svg"
    },

    {
      word: "SWARM",
      correct: "Assets/images/Final images/Group_05/04_Bees.svg",
      wrong: "Assets/images/Final images/Group_05/04_Dogs.svg"
    },

    {
      word: "PRIDE",
      correct: "Assets/images/Final images/Group_05/05_Lion.svg",
      wrong: "Assets/images/Final images/Group_05/05_Dolphins.svg"
    },

    {
      word: "SCHOOL",
      correct: "Assets/images/Final images/Group_05/06_Fish.svg",
      wrong: "Assets/images/Final images/Group_05/06_Elephants.svg"
    },

    {
      word: "TROOP",
      correct: "Assets/images/Final images/Group_05/07_Monkeys.svg",
      wrong: "Assets/images/Final images/Group_05/07_Zebras.svg"
    },

    {
      word: "COLONY",
      correct: "Assets/images/Final images/Group_05/08_AntColony.svg",
      wrong: "Assets/images/Final images/Group_05/08_Deers_EDIT.svg"
    }
  ],

  grid: [
["V","U","C","X","E","O","E","U","F","E"],
["P","D","W","S","C","H","O","O","L","C"],
["R","R","F","I","O","A","R","Q","O","F"],
["I","Y","T","G","L","U","M","K","C","P"],
["D","M","T","R","O","O","P","L","K","O"],
["E","W","S","A","N","I","A","F","X","S"],
["K","E","A","E","Y","L","C","E","V","W"],
["L","E","R","T","U","G","K","D","X","A"],
["Q","Z","F","T","Q","N","R","C","B","R"],
["G","A","G","G","L","E","W","G","M","M"]
]
}

];

let currentCategory = null;
let foundWords = [];
let selectedLetters = [];

const categoryGrid = document.getElementById("categoryGrid");
const categoryScreen = document.getElementById("categoryScreen");
const gridScreen = document.getElementById("gridScreen");
const practiceScreen = document.getElementById("practiceScreen");

const letterGrid = document.getElementById("letterGrid");
const foundWordsList = document.getElementById("foundWords");

const hintBtn = document.getElementById("hintBtn");
const showAllBtn = document.getElementById("showAllBtn");
const practiceBtn = document.getElementById("practiceBtn");
const showAnswerBtn = document.getElementById("showAnswerBtn");

const homeBtn = document.getElementById("homeBtn");


homeBtn.addEventListener("click", () => {
  resetApp();
});

function scaleStage() {

  const stage = document.getElementById("stage");

  const designWidth = 1280;
  const designHeight = 720;

  const scaleX = window.innerWidth / designWidth;
  const scaleY = window.innerHeight / designHeight;

  const scale = Math.min(scaleX, scaleY);

  stage.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

window.addEventListener("resize", scaleStage);
window.addEventListener("load", scaleStage);



function resetApp() {

  answersVisible = false;
  showAllBtn.textContent = "Show Answers";
  
   const starBar = document.getElementById("gridStarBar");
   if (starBar) starBar.innerHTML = "";

  showScreen("categoryScreen");

  // Reset state
  currentCategory = null;
  foundWords = [];
  selectedLetters = [];
  earnedStars = 0;
  practiceIndex = 0;

  // Clear grid
  letterGrid.innerHTML = "";

  // Clear word list
  foundWordsList.innerHTML = "";

  // Reset progress display
  const progress = document.getElementById("progressText");
  if (progress) progress.textContent = "";

  // Hide practice button
  hintBtn.classList.remove("hidden");
  showAllBtn.classList.remove("hidden");
  practiceBtn.classList.add("hidden");

  hintBtn.disabled = false;
  showAllBtn.disabled = false;
  practiceBtn.disabled = false;

  // Hide celebration
const celebration = document.getElementById("celebrationMessage");
if (celebration) celebration.classList.add("hidden");
  
}

categories.forEach((cat, index) => {

  const div = document.createElement("div");
  div.className = `category-card card-${index + 1}`;



const titleParts = cat.name.split("(");

div.innerHTML = `
  <div class="card-bg"></div>
  <div class="card-content"></div>
`;


  div.onclick = () => startCategory(cat);

  categoryGrid.appendChild(div);
});

function startCategory(cat) {

  hintIndex = 0;

  answersVisible = false;
  showAllBtn.textContent = "Show Answers";

  currentCategory = cat;

  foundWords = [];
  selectedLetters = [];

  earnedStars = 0;
  practiceIndex = 0;

  renderStars();

  showScreen("gridScreen");
  const label = document.getElementById("gridLabel");

  label.innerHTML = `
  <img src="Assets/images/${cat.label}" class="hang-label">
  `;

  currentCategory.grid = cat.grid;

  buildPathsFromGrid();

  renderGrid(cat.grid);

  updateProgress();
  renderGridStars();

document.querySelector(".progress").style.display = "none";


  hintBtn.classList.remove("hidden");
  showAllBtn.classList.remove("hidden");
  practiceBtn.classList.add("hidden");

  hintBtn.disabled = false;
  showAllBtn.disabled = false;
  practiceBtn.disabled = false;
}

function buildPathsFromGrid() {

  const grid = currentCategory.grid;
  const size = grid.length;

  const directions = [
    { dr:0, dc:1 },
    { dr:1, dc:0 },
    { dr:1, dc:1 }
  ];

  currentCategory.words.forEach(wordObj => {

    const word = wordObj.word;
    wordObj.path = null;

    for (let r=0; r<size; r++) {
      for (let c=0; c<size; c++) {

        for (let dir of directions) {

          const positions = [];

          for (let i=0; i<word.length; i++) {

            const nr = r + dir.dr*i;
            const nc = c + dir.dc*i;

            if (
              nr<0 || nr>=size ||
              nc<0 || nc>=size ||
              grid[nr][nc] !== word[i]
            ) break;

            positions.push([nr,nc]);
          }

          if (positions.length === word.length) {
            wordObj.path = positions;
            return;
          }

        }
      }
    }

  });

}

function isSafeCell(grid, r, c, size) {

  if (grid[r][c] !== "") return false;

  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {

      if (dr === 0 && dc === 0) continue;

      const nr = r + dr;
      const nc = c + dc;

      if (
        nr >= 0 && nr < size &&
        nc >= 0 && nc < size &&
        grid[nr][nc] !== ""
      ) {
        return false;
      }
    }
  }

  return true;
}




function renderGrid(grid) {

  letterGrid.innerHTML = "";

  grid.forEach((row, r) => {
    row.forEach((letter, c) => {

      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = letter;
      cell.dataset.row = r;
      cell.dataset.col = c;

      cell.onclick = () => selectLetter(cell);

      letterGrid.appendChild(cell);
    });
  });
}

function renderGridStars() {

  const starBar = document.getElementById("gridStarBar");
  starBar.innerHTML = "";

  const total = currentCategory.words.length;

  for (let i = 0; i < total; i++) {

    const star = document.createElement("span");
    star.textContent = "★";
    star.className = "grid-star";

    if (i < foundWords.length) {
      star.classList.add("filled");
    }

    starBar.appendChild(star);
  }
}

function clearAllTemporarySelections() {

  document.querySelectorAll(".cell.selected")
    .forEach(c => c.classList.remove("selected"));

  selectedLetters = [];
}

function selectLetter(cell) {

  // 🚨 If starting fresh
  if (selectedLetters.length === 0) {
    clearAllTemporarySelections();
  }

  // 🔁 TOGGLE behavior
  if (cell.classList.contains("selected")) {

    // ❌ DESELECT
    cell.classList.remove("selected");

    selectedLetters = selectedLetters.filter(c => c !== cell);

    return; // stop here
  }

  // 🔥 Remove hint styling if clicked
  if (cell.classList.contains("hint-cell")) {
    cell.classList.remove("hint-cell");
  }

  // ✅ Add selection (but don't override confirmed styling)
  if (!cell.classList.contains("confirmed")) {
    cell.classList.add("selected");
  }

  selectedLetters.push(cell);

  checkWordMatch();
}


function checkWordMatch() {

  if (selectedLetters.length < 2) return;

  const selected = selectedLetters.map(cell => ({
    row: parseInt(cell.dataset.row),
    col: parseInt(cell.dataset.col)
  }));

  let matchedWord = null;

  for (let wordObj of currentCategory.words) {

    if (foundWords.includes(wordObj.word)) continue;
    if (!wordObj.path) continue;

    const path = wordObj.path.map(p => ({
      row: p[0],
      col: p[1]
    }));

    // ❌ If extra letters selected → skip
    if (selected.length > path.length) continue;

    // ✅ EXACT SET MATCH (order-independent, no extras)
    const isMatch =
      selected.length === path.length &&
      selected.every(s =>
        path.some(p => p.row === s.row && p.col === s.col)
      );

    if (isMatch) {
      matchedWord = wordObj;
      break;
    }
  }

  // ✅ SUCCESS
  if (matchedWord) {

    selectedLetters.forEach(cell => {
      cell.classList.remove("selected");
      cell.classList.add("confirmed");
    });

    addFoundWord(matchedWord.word);
    selectedLetters = [];

    // 🔥 handle overlapping words
    checkAutoCompletedWords();

  } else {

    // ❌ Wrong selection cleanup (only if too long)
    const longest = Math.max(
      ...currentCategory.words.map(w => w.word.length)
    );

    if (selected.length > longest) {

      selectedLetters.forEach(cell => {
        cell.classList.add("wrong");
      });

      setTimeout(() => {
        selectedLetters.forEach(cell => {
          cell.classList.remove("wrong");
          cell.classList.remove("selected");
        });
        selectedLetters = [];
      }, 600);
    }
  }
}

function updateProgress() {
  const total = currentCategory.words.length;
  const count = foundWords.length;

  document.getElementById("progressText").textContent =
    `Words Found: ${count}/${total}`;
}

function addFoundWord(word) {
  if (foundWords.includes(word)) return;

  foundWords.push(word);

  updateProgress();
  renderGridStars();

  const li = document.createElement("li");
  li.className = "found-pill";

li.innerHTML = `
  <span class="pill-audio">🔊</span>
  <span class="pill-text">${word}</span>
`;

li.onclick = () => playAudio(word);

  foundWordsList.appendChild(li);

  // Small pop animation
  li.classList.add("pop-in");

  playAudio(word);

  if (foundWords.length === currentCategory.words.length) {
    hintBtn.classList.add("hidden");
    showAllBtn.classList.add("hidden");
    practiceBtn.classList.remove("hidden");
  }
}



function playAudio(word) {
  const path = `audio/${capitalize(word)}.mp3`;
  console.log("Trying:", path);

  const audio = new Audio(path);

  audio.onerror = () => {
    console.error("❌ Not found:", path);
  };

  audio.oncanplay = () => {
    console.log("✅ Can play:", path);
  };

  audio.play().catch(e => {
    console.error("⚠️ Play blocked:", e);
  });
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

hintBtn.onclick = () => {

  if (!currentCategory) return;

  const remainingWords = currentCategory.words.filter(
    w => !foundWords.includes(w.word)
  );

  if (remainingWords.length === 0) return;

  // 🔁 Reset if index exceeds remaining words
  if (hintIndex >= remainingWords.length) {
    hintIndex = 0;
  }

  // 🧹 Clear old hints
  document.querySelectorAll(".hint-cell")
    .forEach(c => c.classList.remove("hint-cell"));

  const wordObj = remainingWords[hintIndex];

  if (!wordObj.path) return;

  // 👉 Pick FIRST unconfirmed letter in that word
  let hintCell = null;

  for (let [row, col] of wordObj.path) {

    const cell = [...letterGrid.children].find(
      c => c.dataset.row == row && c.dataset.col == col
    );

    if (cell && !cell.classList.contains("confirmed")) {
      hintCell = cell;
      break;
    }
  }

  if (hintCell) {
    hintCell.classList.add("hint-cell");
  }

  // 👉 Move to next word for next click
  hintIndex++;
};

showAllBtn.onclick = () => {

  if (!currentCategory) return;

  if (!answersVisible) {

    // SHOW ANSWERS
    currentCategory.words.forEach(wordObj => {

      if (!wordObj.path) return;

      wordObj.path.forEach(([r,c]) => {

        const cell = [...letterGrid.children].find(
          cell => cell.dataset.row == r && cell.dataset.col == c
        );

        if (cell && !cell.classList.contains("confirmed")) {
          cell.classList.add("hint-cell");   // highlight only
        }

      });

    });

    showAllBtn.textContent = "Hide Answers";
    answersVisible = true;
    hintBtn.disabled = true;

  } else {

    // HIDE ANSWERS
    document.querySelectorAll(".hint-cell")
      .forEach(cell => cell.classList.remove("hint-cell"));

    showAllBtn.textContent = "Show Answers";
    answersVisible = false;
    hintBtn.disabled = false;

  }

};
practiceBtn.onclick = () => {
  showScreen("practiceScreen");
  startPractice();
};


function startPractice() {

  sentenceAttempted = false;

  answerVisible = false;
  showAnswerBtn.textContent = "Show Answer";

  const celebration = document.getElementById("celebrationMessage");
if (celebration) celebration.classList.add("hidden");

  practiceCompleted = false;

  practiceIndex = 0;
  earnedStars = 0;
  renderStars();

  nextBtn.disabled = false;
  backBtn.disabled = true;
  
  // ✅ RESET WORD STATE HERE (important!)
  currentCategory.words.forEach(word => {
    word._revealed = false;
    word._starAwarded = false;
  });

  const wordListBox = document.querySelector(".practice-wordlist");

  if (wordListBox) {
    wordListBox.classList.remove(
      "bg-1","bg-2","bg-3","bg-4","bg-5",
      "bg-6","bg-7","bg-8","bg-9","bg-10"
    );

    const categoryIndex = categories.indexOf(currentCategory);
    wordListBox.classList.add(`bg-${categoryIndex + 1}`);
  }

  const practiceLabel = document.getElementById("practiceLabel");

  practiceLabel.innerHTML = `
  <img src="Assets/images/${currentCategory.label}">
  `;

  renderWordList();
  loadPracticeWord();

  
}


function renderWordList() {

  const wordList = document.getElementById("wordList");
  wordList.innerHTML = "";

  currentCategory.words.forEach((w, index) => {

    const item = document.createElement("div");
    item.textContent = w.word;
    item.className = "word-item";

    if (index === practiceIndex) {
      item.classList.add("active");
    } else if (index < practiceIndex) {
      item.classList.add("completed");
    } else {
      item.classList.add("disabled");
    }

    wordList.appendChild(item);
  });
}


function loadPracticeWord() {

  answerVisible = false;
  showAnswerBtn.textContent = "Show Answer";

  const sentenceCard = document.querySelector(".practice-card-sentence");
  const imageCard = document.querySelector(".practice-card-image");
  const instruction = document.getElementById("practiceInstruction");
  const wrapper = document.querySelector(".practice-wrapper");

  // Reset card visibility
  sentenceCard.style.display = "none";
  imageCard.style.display = "none";

  // 🔥 Reset layout modes
  wrapper.classList.remove("sentence-mode", "image-mode");

  const wordObj = currentCategory.words[practiceIndex];
  wordObj._revealed = false;

  showAnswerBtn.disabled = false;
  nextBtn.disabled = true;

  if (currentCategory.mode === "sentence") {

    // Apply sentence layout
    wrapper.classList.add("sentence-mode");

    sentenceCard.style.display = "flex";
    instruction.textContent =
      "Tap the words in the correct order to make a sentence!";

    loadSentenceMode(wordObj);

  } else {

    // Apply image layout
    wrapper.classList.add("image-mode");

    imageCard.style.display = "flex";
    instruction.textContent =
      "Tap the correct image.";

    loadImageMode(wordObj);
  }

  backBtn.disabled = practiceIndex === 0;
  updateNextButtonState();
}


function loadImageMode(wordObj) {

  const title = document.getElementById("imageWord");
  const container = document.getElementById("imageOptions");
  const showAnswerBtn = document.getElementById("showAnswerBtn");

  title.textContent = wordObj.word;
  container.innerHTML = "";

  const img1 = createImageOption(wordObj.correct, true);
  const img2 = createImageOption(wordObj.wrong, false);

  if (Math.random() > 0.5) {
    container.append(img1, img2);
  } else {
    container.append(img2, img1);
  }

}


function createImageOption(src, isCorrect) {

  const wrapper = document.createElement("div");
  wrapper.className = "image-wrapper";
  wrapper.dataset.correct = isCorrect;   // ✅ store correct flag

  const img = document.createElement("img");
  img.src = src;
  img.className = "option-img";

  wrapper.appendChild(img);

  wrapper.onclick = () => {
    evaluateImageChoice(wrapper, isCorrect);
  };

  return wrapper;
}

function evaluateImageChoice(selectedWrapper, isCorrect) {

  const allWrappers = document.querySelectorAll(".image-wrapper");

  allWrappers.forEach(w => w.style.pointerEvents = "none");

  showAnswerBtn.disabled = true;

  const wordObj = currentCategory.words[practiceIndex];
  wordObj._revealed = true;
  sentenceAttempted = true;

  if (isCorrect) {

    selectedWrapper.appendChild(createBadge(true));

    earnedStars++;
    renderStars();

    //fireConfetti();              // ✅ FIX 1
    celebrateCorrectAnswer();

  } else {

    selectedWrapper.appendChild(createBadge(false));

    allWrappers.forEach(w => {
      if (w !== selectedWrapper) {
        w.appendChild(createBadge(true));
      }
    });

  }

  // ✅ FIX 2 (buttons enable)
  nextBtn.disabled = false;
  backBtn.disabled = practiceIndex === 0;
  showAnswerBtn.disabled = true;

  updateNextButtonState();
}

function evaluateOption(isCorrect, selectedImg, otherImg, forceShow = false) {

  // Disable further clicks
  document.querySelectorAll(".image-wrapper").forEach(wrapper => {
    wrapper.style.pointerEvents = "none";
  });

  const selectedWrapper = selectedImg.parentElement;
  const otherWrapper = otherImg.parentElement;

  // Remove old badges
  document.querySelectorAll(".correct-badge, .wrong-badge")
    .forEach(b => b.remove());

  if (isCorrect) {

    selectedWrapper.appendChild(createBadge(true));

    if (!forceShow) {
      earnedStars++;
      renderStars();
    }

  } else {

    selectedWrapper.appendChild(createBadge(false));
    otherWrapper.appendChild(createBadge(true));
  }

  setTimeout(() => {
    nextPracticeWord();
  }, 1500);
}

function createBadge(isCorrect) {
  const badge = document.createElement("div");
  badge.className = isCorrect ? "correct-badge" : "wrong-badge";
  badge.textContent = isCorrect ? "✔" : "✖";
  return badge;
}

function addBadge(image, symbol, className) {

  const badge = document.createElement("div");
  badge.className = className;
  badge.textContent = symbol;

  image.parentElement.appendChild(badge);
}

function showImageResult(isCorrect, selected, other) {

  if (isCorrect) {
    selected.style.border = "5px solid green";

    setTimeout(() => {
      nextPracticeWord();
    }, 1200);

  } else {
    selected.style.border = "5px solid red";
    other.style.border = "5px solid green";
  }

  
}



function loadSentenceMode(wordObj) {

  currentUserAnswer = [];

  const title = document.getElementById("sentenceWord");
  const slots = document.getElementById("sentenceSlots");
  const bank = document.getElementById("sentenceBank");

  title.textContent = wordObj.word;

  slots.innerHTML = "";
  bank.innerHTML = "";

  const slotContainer = document.createElement("div");
  slotContainer.className = "answer-slots";

  wordObj.correct.forEach((word,i) => {

  const slot = document.createElement("div");
  slot.className = "answer-slot";

  const line = document.createElement("div");
  line.className = "slot-line";
  //line.style.width = "80px";   // same width for all blanks

  slot.appendChild(line);
  slotContainer.appendChild(slot);

});

slots.appendChild(slotContainer);

  const words = [...wordObj.jumbled].sort(() => 0.5 - Math.random());

  words.forEach(word => {

  const btn = document.createElement("span");
  btn.textContent = word;
  btn.className = "word-chip";

    btn.onclick = () => {

  const nextIndex = currentUserAnswer.length;
  const correctWord = wordObj.correct[nextIndex];

  // ⭐ Handle full stop
  if (word === ".") {

  if (wordObj.correct[currentUserAnswer.length] === ".") {

    currentUserAnswer.push(".");

    const slotContainer = slots.querySelector(".answer-slots");
    const slot = slotContainer.children[currentUserAnswer.length - 1];

    const placed = document.createElement("span");
    placed.className = "placed-word";
    placed.textContent = ".";

    slot.appendChild(placed);

    btn.style.visibility = "hidden";

    setTimeout(() => {
      handleSentenceShowAnswer(false);
    }, 120);

  } else {

    btn.classList.add("wrong-blink");

    setTimeout(() => {
      btn.classList.remove("wrong-blink");
    }, 600);

  }

  return;
}

  // ✅ correct placement
  if (word.toLowerCase() === correctWord.toLowerCase()) {

    currentUserAnswer.push(word);


    const slotContainer = slots.querySelector(".answer-slots");
    const slot = slotContainer.children[currentUserAnswer.length - 1];

    const placed = document.createElement("span");
    placed.className = "placed-word";

    // ✅ Capitalize ONLY first word
    if (currentUserAnswer.length === 1) {
      placed.textContent = word.charAt(0).toUpperCase() + word.slice(1);
    } else {
      placed.textContent = word;
    }

    slot.appendChild(placed);

    btn.style.visibility = "hidden";

    
  } 
  
  // ❌ wrong word
  else {

    btn.classList.add("wrong-blink");

    setTimeout(() => {
      btn.classList.remove("wrong-blink");
    }, 600);

  }

};

bank.appendChild(btn);

  });

}

const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");

backBtn.onclick = () => {

  if (practiceIndex === 0) return;

  practiceIndex--;

  renderWordList();
  loadPracticeWord();

};

nextBtn.onclick = () => {

  const isLast = practiceIndex === currentCategory.words.length - 1;

  if (isLast) {

    if (earnedStars === currentCategory.words.length) {
      celebrate();
    }

    nextBtn.disabled = true;
    return;
  }

  nextPracticeWord();

};

function celebrate() {

  practiceCompleted = true;

  const celebration = document.getElementById("celebrationMessage");

  nextBtn.disabled = true;
  backBtn.disabled = true;
  showAnswerBtn.disabled = true;

  if (celebration) {
    celebration.classList.remove("hidden");
  }

  const audio = new Audio("celebration/applause.mp3");
  audio.play();

  setTimeout(() => {
    homeBtn.classList.add("blink-strong");
  }, 2000);

}

function nextPracticeWord() {

  if (!currentCategory) return;

  practiceIndex++;

  if (practiceIndex >= currentCategory.words.length) {

    nextBtn.disabled = true;

    if (earnedStars === currentCategory.words.length) {
      celebrate();
    }

    return;
  }

  renderWordList();
  loadPracticeWord();

  showAnswerBtn.disabled = false;
  backBtn.disabled = practiceIndex === 0;
}

showAnswerBtn.onclick = () => {

  const sentenceBar = document.querySelector(".answer-slots");
  const wordObj = currentCategory.words[practiceIndex];

  if (!answerVisible) {

    // SHOW ANSWER
    if (currentCategory.mode === "sentence") {

      sentenceBar.innerHTML = `
        <div class="final-sentence correct">
          ${formatSentence(wordObj.correct)}
          <span class="result-icon">✔</span>
        </div>
      `;

      // ⭐ fade and disable chips
      document.querySelectorAll(".word-chip").forEach(chip=>{
        chip.classList.add("faded");
      });

    }

    if (currentCategory.mode === "image") {
      handleImageShowAnswer();
    }

    showAnswerBtn.textContent = "Hide Answer";
    answerVisible = true;

  } else {

    // HIDE ANSWER
    loadPracticeWord();

    // ⭐ enable chips again
    document.querySelectorAll(".word-chip").forEach(chip=>{
      chip.classList.remove("faded");
    });

    showAnswerBtn.textContent = "Show Answer";
    answerVisible = false;

  }

};


function formatSentence(words) {

  return words
    .map((word, index) => {

      // keep proper nouns if already capitalised
      if (word[0] === word[0].toUpperCase() && word !== word.toLowerCase()) {
        return word;
      }

      return word.toLowerCase();

    })
    .join(" ");
}

function handleSentenceShowAnswer(isReveal = false) {

  const wordObj = currentCategory.words[practiceIndex];
  const sentenceBar = document.querySelector(".answer-slots");
  const correct = wordObj.correct;

  const periodPlaced = document.querySelector(".answer-slots .placed-word:last-child")?.textContent === ".";

  const sentenceText = correct.join(" ") + (periodPlaced ? "." : "");

  // SHOW ANSWER BUTTON
  if (isReveal) {

    sentenceBar.innerHTML = `
    <span class="final-sentence correct">
      ${formatSentence(correct)}
      <span class="result-icon">✔</span>
    </span>
  `;

    document.querySelectorAll(".word-chip")
      .forEach(w => w.style.pointerEvents = "none");

    wordObj._revealed = true;
    showAnswerBtn.disabled = true;

    updateNextButtonState();

    return;
  }

  // AUTO CHECK AFTER USER COMPLETES SENTENCE

  let userWasCorrect = true;

  if (currentUserAnswer.length !== correct.length) {
    userWasCorrect = false;
  } else {

    for (let i = 0; i < correct.length; i++) {
      if (currentUserAnswer[i].toLowerCase() !== correct[i].toLowerCase()) {
        userWasCorrect = false;
        break;
      }
    }

  }

sentenceBar.innerHTML = `
<div class="final-sentence ${userWasCorrect ? "correct" : "wrong"}">
  ${correct.join(" ")}
  <span class="result-icon">${userWasCorrect ? "✔" : "✖"}</span>
</div>
`;

// enable navigation after attempt
nextBtn.disabled = false;
backBtn.disabled = practiceIndex === 0;

// sentence attempt finished → enable navigation
wordObj._revealed = true;
sentenceAttempted = true;

updateNextButtonState();

if (userWasCorrect && !wordObj._starAwarded) {

  earnedStars++;
  renderStars();
  wordObj._starAwarded = true;

  //fireConfetti();
  celebrateCorrectAnswer();

  if (earnedStars === currentCategory.words.length) {
    celebrate();
    return;
  }

  showAnswerBtn.disabled = true;
}

  document.querySelectorAll(".word-chip")
    .forEach(w => w.style.pointerEvents = "none");
}

function handleImageShowAnswer() {

  const wrappers = document.querySelectorAll(".image-wrapper");

  wrappers.forEach(wrapper => {

    wrapper.style.pointerEvents = "none";

    // Remove old badges
    wrapper.querySelectorAll(".correct-badge, .wrong-badge")
      .forEach(b => b.remove());

    if (wrapper.dataset.correct === "true") {
      wrapper.appendChild(createBadge(true));
    } else {
      wrapper.appendChild(createBadge(false));
    }
  });

}

function renderStars() {
  const starBar = document.getElementById("starBar");
  starBar.innerHTML = "";

  const totalStars = currentCategory.words.length;

  for (let i = 0; i < totalStars; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.className = "star";

    if (i < earnedStars) {
      star.classList.add("filled");
    }

    starBar.appendChild(star);
  }
}



function updateNextButtonState() {

  if (practiceCompleted) {
    nextBtn.disabled = true;
    backBtn.disabled = true;
    showAnswerBtn.disabled = true;
    return;
  }

  const isLast = practiceIndex === currentCategory.words.length - 1;

  nextBtn.textContent = isLast ? "Finish" : "Next";

  const wordObj = currentCategory.words[practiceIndex];

  // ✅ KEY FIX: use _revealed instead of sentenceAttempted
  if (wordObj._revealed) {
    nextBtn.disabled = false;
    backBtn.disabled = practiceIndex === 0;
  } else {
    nextBtn.disabled = true;
    backBtn.disabled = true;
  }
}

function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach(s => 
    s.classList.remove("active")
  );

  document.getElementById(screenId).classList.add("active");

  const homeBtn = document.getElementById("homeBtn");

  const practiceLabel = document.getElementById("practiceLabel");

  if (screenId === "practiceScreen") {
    practiceLabel.style.display = "block";
  } else {
    practiceLabel.style.display = "none";
  }

  if (screenId !== "categoryScreen") {
    homeBtn.style.display = "block";
  } else {
    homeBtn.style.display = "none";
  }
}

function fireConfetti() {

  const duration = 700;
  const end = Date.now() + duration;

  const colors = ['#2ecc71', '#3498db', '#f1c40f', '#e74c3c'];

  (function frame() {

    const confetti = document.createElement("div");
    confetti.className = "confetti";

    confetti.style.left = Math.random() * window.innerWidth + "px";
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];

    document.body.appendChild(confetti);

    setTimeout(() => confetti.remove(), 1200);

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }

  })();
}

function playSuccessSound() {

  const audio = new Audio("audio/correct.mp3"); 
  audio.currentTime = 0;
  audio.play();

}

function celebrateCorrectAnswer() {

    const container = document.getElementById("lottieCorrect");

  container.innerHTML = ""; // reset animation

  lottie.loadAnimation({
    container: container,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: "Assets/animation/FinalAnswer_celebration.json"
  });

}

function checkAllStarsEarned(){

const stars = document.querySelectorAll("#starBar .star");
const filled = document.querySelectorAll("#starBar .star.filled");

if(stars.length > 0 && stars.length === filled.length){

const msg = document.getElementById("celebrationMessage");
if(msg) msg.classList.remove("hidden");

}

}

function isStraightLine(selection) {
  if (selection.length < 2) return true;

  const dr = selection[1].row - selection[0].row;
  const dc = selection[1].col - selection[0].col;

  for (let i = 1; i < selection.length; i++) {
    const currDr = selection[i].row - selection[i - 1].row;
    const currDc = selection[i].col - selection[i - 1].col;

    if (currDr !== dr || currDc !== dc) return false;
  }

  return true;
}

function autoDetectCompletedWords() {
  currentCategory.words.forEach(wordObj => {
    if (foundWords.includes(wordObj.word)) return;



    if (isCovered) {
      addFoundWord(wordObj.word);
    }
  });
}

function checkAutoCompletedWords() {

  currentCategory.words.forEach(wordObj => {

    if (foundWords.includes(wordObj.word)) return;
    if (!wordObj.path) return;

    const isFullyGreen = wordObj.path.every(([r, c]) => {

      const cell = [...letterGrid.children].find(
        el => el.dataset.row == r && el.dataset.col == c
      );

      return cell.classList.contains("confirmed");
    });

    if (isFullyGreen) {
      addFoundWord(wordObj.word);
    }

  });
}