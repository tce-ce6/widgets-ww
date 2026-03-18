let letterData = [
  {
    "letter": "अ",
    "answers": ["अनार", "अंगूर"],
    "options": ["अनार", "अंगूर", "अनानास", "आठ"],
    "question": "‘अ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  {
    "letter": "आ",
    "answers": ["आलू", "आकाश"],
    "options": ["आलू", "आकाश", "अनाज", "अचार"],
    "question": "‘आ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  {
    "letter": "इ",
    "answers": ["इडली", "इमली"],
    "options": ["इडली", "इमली", "ईद", "ईमानदार"],
    "question": "‘इ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  {
    "letter": "ई",
    "answers": ["ईख", "ईल"],
    "options": ["ईख", "ईल", "इमारत", "इलाज"],
    "question": "‘ई’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  {
    "letter": "उ",
    "answers": ["उपहार", "उनचास"],
    "options": ["उपहार", "उनचास", "ऊनी", "ऊसर"],
    "question": "‘उ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  {
    "letter": "ऊ",
    "answers": ["ऊन", "ऊदबिलाव"],
    "options": ["ऊन", "ऊदबिलाव", "उपमा", "उदास"],
    "question": "‘ऊ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  {
    "letter": "ऋ",
    "answers": ["ऋषि", "ऋतु"],
    "options": ["ऋषि", "ऋतु", "एड़ी", "ऊपर"],
    "question": "‘ऋ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  {
    "letter": "ए",
    "answers": ["एक", "एकतारा"],
    "options": ["एक", "एकतारा", "ऐलान", "ऐंठना"],
    "question": "‘ए’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  {
    "letter": "ऐ",
    "answers": ["ऐनक", "ऐरावत"],
    "options": ["ऐनक", "ऐरावत", "ऋषभ", "एकता"],
    "question": "‘ऐ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  {
    "letter": "ओ",
    "answers": ["ओढ़नी", "ओखली"],
    "options": ["ओढ़नी", "ओखली", "औलाद", "औषधालय"],
    "question": "‘ओ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  {
    "letter": "औ",
    "answers": ["औरत", "औषधि"],
    "options": ["औरत", "औषधि", "ओस", "ओले"],
    "question": "‘औ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  {
    "letter": "अं",
    "answers": ["अंडा", "अंजीर"],
    "options": ["अंडा", "अंजीर", "आम", "इत्र"],
    "question": "‘अं’ की ध्वनि वाले शब्दों को पहचानिए।"
  }
]


const swars = document.querySelectorAll(".swars");
const homePage = document.getElementById('home');
const gamePage = document.getElementById('gamePage');
const homeBtn = document.getElementById('home-btn');


swars.forEach(el => {
  el.addEventListener("click", function () {
    gamePage.style.display = 'block';
    homePage.style.display = 'none';
    const value = this.getAttribute("data-value");
    console.log("Clicked:", value);
  });
});

document.addEventListener('DOMContentLoaded', function () {

  homeBtn.addEventListener('click', () => {
    homePage.style.display = 'block';
    gamePage.style.display = 'none';
  });
});
