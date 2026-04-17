// ── Spiral holes
(function () {
  var c = document.getElementById("spiralHoles");
  var n = Math.ceil(window.innerHeight / 80);
  for (var i = 0; i < n; i++) {
    var h = document.createElement("div");
    h.className = "spiral-hole";
    h.style.top = 40 + i * 80 + "px";
    c.appendChild(h);
  }
})();

// ── Data
var PHRASAL_VERBS = [
  {
    head: "get",
    verb: "get along",
    meaning: "have a friendly relationship",
    example:
      "My brother and I didn't always get along, but now we play together every day.",
    fib: "My brother and I didn't always ___ , but now we play together every day.",
  },
  {
    head: "get",
    verb: "get over",
    meaning: "recover from",
    example: "It took me a week to get over the flu and go back to school.",
    fib: "It took me a week to ___ the flu and go back to school.",
  },
  {
    head: "get",
    verb: "get into",
    meaning: "become interested in",
    example: "My cousin has really got into badminton this year.",
    fib: "My cousin has really ___ badminton this year.",
  },
  {
    head: "get",
    verb: "get through",
    meaning: "finish something difficult",
    example:
      "I need to get through this pile of homework before Wednesday.",
    fib: "I managed to ___ the entire plate of karela because Amma was watching.",
  },
  {
    head: "get",
    verb: "get off",
    meaning: "leave a vehicle",
    example: "Don't forget to get off at the next stop — that's our school.",
    fib: "Don't forget to ___ at the next stop — that's our school.",
  },
  {
    head: "go",
    verb: "go on",
    meaning: "continue",
    example: "The rain went on all day and we couldn't step outside even once.",
    fib: "The rain ___ all day and we couldn't step outside even once.",
  },
  {
    head: "go",
    verb: "go off",
    meaning: "ring or sound an alarm",
    example: "My alarm didn't go off this morning and I was late for school.",
    fib: "My alarm didn't ___ this morning and I was late for school.",
  },
  {
    head: "go",
    verb: "go through",
    meaning: "examine carefully",
    example: "We had to go through all our notes before the test.",
    fib: "We had to ___ all our notes before the test.",
  },
  {
    head: "go",
    verb: "go ahead",
    meaning: "proceed",
    example: "The coach said we could go ahead and start warming up.",
    fib: "The coach said we could ___ and start warming up.",
  },
  {
    head: "go",
    verb: "go out",
    meaning: "stop burning / be extinguished",
    example: "The candle went out because of the strong wind during the storm.",
    fib: "The candle ___ because of the strong wind during the storm.",
  },
  {
    head: "come",
    verb: "come up",
    meaning: "arise / be mentioned",
    example: "The topic of our summer holiday plans came up at dinner.",
    fib: "The topic of our summer holiday plans ___ at dinner.",
  },
  {
    head: "come",
    verb: "come across",
    meaning: "find by chance",
    example: "I came across my old skipping rope while cleaning my cupboard.",
    fib: "I ___ my old skipping rope while cleaning my cupboard.",
  },
  {
    head: "come",
    verb: "come along",
    meaning: "accompany",
    example: "Would you like to come along to the cricket match this evening?",
    fib: "Would you like to ___ to the cricket match this evening?",
  },
  {
    head: "come",
    verb: "come over",
    meaning: "visit someone's home",
    example:
      "My best friend is coming over after school to work on our project.",
    fib: "My best friend is ___ after school to work on our project.",
  },
  {
    head: "come",
    verb: "come down with",
    meaning: "become ill with",
    example: "Half the class came down with a cold after the rainy week.",
    fib: "Half the class ___ a cold after the rainy week.",
  },
  {
    head: "take",
    verb: "take off",
    meaning: "remove clothing",
    example: "Take off your muddy shoes before entering the kitchen.",
    fib: "___ your muddy shoes before entering the kitchen.",
  },
  {
    head: "take",
    verb: "take off",
    meaning: "leave the ground",
    example: "We watched excitedly as the plane took off from the runway.",
    fib: "We watched excitedly as the plane ___ from the runway.",
  },
  {
    head: "take",
    verb: "take up",
    meaning: "start a new activity",
    example: "My sister has taken up swimming during the summer holidays.",
    fib: "My sister has ___ swimming during the summer holidays.",
  },
  {
    head: "take",
    verb: "take over",
    meaning: "assume control",
    example: "The vice-captain had to take over when the captain got injured.",
    fib: "The vice-captain had to ___ when the captain got injured.",
  },
  {
    head: "take",
    verb: "take after",
    meaning: "resemble a family member",
    example:
      "Everyone says I take after my grandmother — we both love reading.",
    fib: "Everyone says I ___ my grandmother — we both love reading.",
  },
  {
    head: "take",
    verb: "take in",
    meaning: "absorb or understand",
    example:
      "The guide spoke so fast that it was hard to take in everything about the monument.",
    fib: "The guide spoke so fast that it was hard to ___ everything about the monument.",
  },
  {
    head: "put",
    verb: "put on",
    meaning: "wear",
    example: "Put on your raincoat — it looks like it might pour any minute.",
    fib: "___ your raincoat — it looks like it might pour any minute.",
  },
  {
    head: "put",
    verb: "put off",
    meaning: "postpone",
    example: "The sports day has been put off because of the rain.",
    fib: "The sports day has been ___ because of the rain.",
  },
  {
    head: "put",
    verb: "put away",
    meaning: "store in the proper place",
    example: "Please put away your toys before dinner.",
    fib: "Please ___ your toys before dinner.",
  },
  {
    head: "put",
    verb: "put up with",
    meaning: "tolerate",
    example: "I can't put up with the noise when my brother plays the drums.",
    fib: "I can't ___ the noise when my brother plays the drums.",
  },
  {
    head: "put",
    verb: "put down",
    meaning: "criticise or belittle",
    example: "A good friend would never put you down in front of others.",
    fib: "A good friend would never ___ you in front of others.",
  },
  {
    head: "turn",
    verb: "turn up",
    meaning: "arrive",
    example: "He turned up late for practice and the coach was not happy.",
    fib: "He ___ late for practice and the coach was not happy.",
  },
  {
    head: "turn",
    verb: "turn up",
    meaning: "increase volume or intensity",
    example: "Can you turn up the volume? I can barely hear the song.",
    fib: "Can you ___ the volume? I can barely hear the song.",
  },
  {
    head: "turn",
    verb: "turn down",
    meaning: "refuse",
    example:
      "I had to turn down the invitation because I had a test the next day.",
    fib: "I had to ___ the invitation because I had a test the next day.",
  },
  {
    head: "turn",
    verb: "turn into",
    meaning: "become or transform",
    example:
      "The empty plot near our school has turned into a beautiful garden.",
    fib: "The empty plot near our school has ___ a beautiful garden.",
  },
  {
    head: "turn",
    verb: "turn around",
    meaning: "improve a bad situation",
    example:
      "Our team was losing, but we turned around the match in the second half.",
    fib: "Our team was losing, but we ___ the match in the second half.",
  },
  {
    head: "give",
    verb: "give up",
    meaning: "stop trying",
    example: "Don't give up even if the race seems impossible to win.",
    fib: "Don't ___ even if the race seems impossible to win.",
  },
  {
    head: "give",
    verb: "give in",
    meaning: "agree reluctantly",
    example:
      "After much arguing, my parents gave in and let me go for the school trip.",
    fib: "After much arguing, my parents ___ and let me go for the school trip.",
  },
  {
    head: "give",
    verb: "give away",
    meaning: "donate",
    example: "We gave away our old clothes to the charity drive at school.",
    fib: "We ___ our old clothes to the charity drive at school.",
  },
  {
    head: "give",
    verb: "give out",
    meaning: "distribute",
    example: "The teacher asked me to give out the test papers to the class.",
    fib: "The teacher asked me to ___ the test papers to the class.",
  },
  {
    head: "look",
    verb: "look up",
    meaning: "search for information",
    example: "I looked up the meaning of the word in the dictionary.",
    fib: "I ___ the meaning of the word in the dictionary.",
  },
  {
    head: "look",
    verb: "look after",
    meaning: "take care of",
    example: "My grandmother looks after us when our parents travel for work.",
    fib: "My grandmother ___ us when our parents travel for work.",
  },
  {
    head: "look",
    verb: "look out",
    meaning: "be careful",
    example: "Look out! The road is slippery because of the rain.",
    fib: "___ ! The road is slippery because of the rain.",
  },
  {
    head: "look",
    verb: "look forward to",
    meaning: "feel excited about something future",
    example: "I am looking forward to the school picnic next month.",
    fib: "I am ___ the school picnic next month.",
  },
  {
    head: "look",
    verb: "look into",
    meaning: "investigate",
    example: "The doctor promised to look into why I keep getting headaches.",
    fib: "The doctor promised to ___ why I keep getting headaches.",
  },
  {
    head: "look",
    verb: "look over",
    meaning: "review or examine",
    example: "Could you look over my essay before I submit it?",
    fib: "Could you ___ my essay before I submit it?",
  },
  {
    head: "make",
    verb: "make up",
    meaning: "become friends again",
    example:
      "The two friends had a fight but made up before the end of the day.",
    fib: "The two friends had a fight but ___ before the end of the day.",
  },
  {
    head: "make",
    verb: "make up for",
    meaning: "compensate",
    example:
      "He tried to make up for missing practice by training extra hard at home.",
    fib: "He tried to ___ missing practice by training extra hard at home.",
  },
  {
    head: "make",
    verb: "make do with",
    meaning: "manage with what is available",
    example:
      "We ran out of bread, so we had to make do with leftover chapatis for breakfast.",
    fib: "We ran out of bread, so we had to ___ leftover chapatis for breakfast.",
  },
  {
    head: "make",
    verb: "make off with",
    meaning: "steal and escape",
    example:
      "The monkey made off with my sandwich while we were on the school picnic!",
    fib: "The monkey ___ my sandwich while we were on the school picnic!",
  },
  {
    head: "run",
    verb: "run out of",
    meaning: "have none left",
    example: "We ran out of milk this morning, so I had my cereal dry.",
    fib: "We ___ milk this morning, so I had my cereal dry.",
  },
  {
    head: "run",
    verb: "run into",
    meaning: "meet by chance",
    example: "I ran into my old classmate at the bookshop yesterday.",
    fib: "I ___ my old classmate at the bookshop yesterday.",
  },
  {
    head: "run",
    verb: "run over",
    meaning: "review quickly",
    example: "Let me run over the main points before the quiz begins.",
    fib: "Let me ___ the main points before the quiz begins.",
  },
  {
    head: "run",
    verb: "run through",
    meaning: "practise or rehearse",
    example:
      "We ran through the dance steps one final time before the annual day.",
    fib: "We ___ the dance steps one final time before the annual day.",
  },
  {
    head: "pick",
    verb: "pick up",
    meaning: "collect someone",
    example: "My mother picks me up from school every day at 3 o'clock.",
    fib: "My mother ___ me from school every day at 3 o'clock.",
  },
  {
    head: "pick",
    verb: "pick on",
    meaning: "bully or tease",
    example: "It's not right to pick on someone just because they are new.",
    fib: "It's not right to ___ someone just because they are new.",
  },
  {
    head: "pick",
    verb: "pick out",
    meaning: "choose or select",
    example: "It took me ages to pick out which flavour of ice cream I wanted.",
    fib: "It took me ages to ___ which flavour of ice cream I wanted.",
  },
  {
    head: "pick",
    verb: "pick at",
    meaning: "eat very little",
    example:
      "You've been picking at your food all evening — are you feeling unwell?",
    fib: "You've been ___ your food all evening — are you feeling unwell?",
  },
  {
    head: "pick",
    verb: "pick up",
    meaning: "learn casually",
    example: "She picked up a few words of French from her neighbour.",
    fib: "She ___ a few words of French from her neighbour.",
  },
  {
    head: "bring",
    verb: "bring up",
    meaning: "raise a topic",
    example: "She brought up an interesting question during the science class.",
    fib: "She ___ an interesting question during the science class.",
  },
  {
    head: "bring",
    verb: "bring up",
    meaning: "raise a child",
    example:
      "My grandparents brought up five children in a small town in Kerala.",
    fib: "My grandparents ___ five children in a small town in Kerala.",
  },
  {
    head: "bring",
    verb: "bring about",
    meaning: "cause to happen",
    example: "Regular exercise brought about a big improvement in his stamina.",
    fib: "Regular exercise ___ a big improvement in his stamina.",
  },
  {
    head: "bring",
    verb: "bring back",
    meaning: "recall memories",
    example:
      "The smell of fresh jalebis always brings back memories of visiting my nani's house.",
    fib: "The smell of fresh jalebis always ___ memories of visiting my nani's house.",
  },
  {
    head: "bring",
    verb: "bring in",
    meaning: "introduce",
    example:
      "The school has brought in a new rule about wearing ID cards every day.",
    fib: "The school has ___ a new rule about wearing ID cards every day.",
  },
  {
    head: "bring",
    verb: "bring out",
    meaning: "reveal a quality",
    example: "Playing in a team really brings out the best in everyone.",
    fib: "Playing in a team really ___ the best in everyone.",
  },
  {
    head: "break",
    verb: "break down",
    meaning: "stop working (machine)",
    example:
      "The school bus broke down near the highway and we had to wait an hour.",
    fib: "The school bus ___ near the highway and we had to wait an hour.",
  },
  {
    head: "break",
    verb: "break down",
    meaning: "lose control emotionally",
    example:
      "She broke down in tears when she heard she had won the scholarship.",
    fib: "She ___ in tears when she heard she had won the scholarship.",
  },
  {
    head: "break",
    verb: "break up",
    meaning: "disperse",
    example:
      "The clouds finally broke up and the sun came out in the afternoon.",
    fib: "The clouds finally ___ and the sun came out in the afternoon.",
  },
  {
    head: "break",
    verb: "break in",
    meaning: "use something new until comfortable",
    example: "It takes a few days to break in a new pair of school shoes.",
    fib: "It takes a few days to ___ a new pair of school shoes.",
  },
  {
    head: "break",
    verb: "break into",
    meaning: "suddenly start doing",
    example:
      "The whole class broke into laughter when the teacher cracked a joke.",
    fib: "The whole class ___ laughter when the teacher cracked a joke.",
  },
  {
    head: "break",
    verb: "break out",
    meaning: "start suddenly",
    example:
      "A fight broke out during the football match and the referee stopped the game.",
    fib: "A fight ___ during the football match and the referee stopped the game.",
  },
  {
    head: "hold",
    verb: "hold on",
    meaning: "wait",
    example: "Hold on — let me grab my water bottle before we start running.",
    fib: "___ — let me grab my water bottle before we start running.",
  },
  {
    head: "hold",
    verb: "hold up",
    meaning: "delay",
    example:
      "The traffic held us up and we were late for the morning assembly.",
    fib: "The traffic ___ us and we were late for the morning assembly.",
  },
  {
    head: "hold",
    verb: "hold back",
    meaning: "restrain emotions",
    example: "She tried to hold back her tears when she didn't win the prize.",
    fib: "She tried to ___ her tears when she didn't win the prize.",
  },
  {
    head: "hold",
    verb: "hold off",
    meaning: "delay doing something",
    example: "Let's hold off on the picnic until the weather clears up.",
    fib: "Let's ___ on the picnic until the weather clears up.",
  },
  {
    head: "keep",
    verb: "keep up",
    meaning: "maintain the same pace",
    example: "She walks so fast that it's hard to keep up with her.",
    fib: "She walks so fast that it's hard to ___ with her.",
  },
  {
    head: "keep",
    verb: "keep on",
    meaning: "continue doing",
    example: "The coach told us to keep on practising until we got it right.",
    fib: "The coach told us to ___ practising until we got it right.",
  },
  {
    head: "keep",
    verb: "keep out",
    meaning: "prevent from entering",
    example: "We put a cloth over the food to keep out the flies.",
    fib: "We put a cloth over the food to ___ the flies.",
  },
  {
    head: "keep",
    verb: "keep away from",
    meaning: "avoid",
    example: "The doctor told him to keep away from spicy food for a week.",
    fib: "The doctor told him to ___ spicy food for a week.",
  },
  {
    head: "keep",
    verb: "keep up with",
    meaning: "not fall behind",
    example:
      "It's important to keep up with your homework even during festivals.",
    fib: "It's important to ___ your homework even during festivals.",
  },
  {
    head: "keep",
    verb: "keep off",
    meaning: "stay away from",
    example:
      "The groundskeeper put up signs asking everyone to keep off the wet grass.",
    fib: "The groundskeeper put up signs asking everyone to ___ the wet grass.",
  },
  {
    head: "set",
    verb: "set up",
    meaning: "arrange or prepare",
    example: "We helped set up the tent at the campsite before it got dark.",
    fib: "We helped ___ the tent at the campsite before it got dark.",
  },
  {
    head: "set",
    verb: "set off",
    meaning: "begin a journey",
    example: "We set off early in the morning to avoid traffic on the highway.",
    fib: "We ___ early in the morning to avoid traffic on the highway.",
  },
  {
    head: "set",
    verb: "set out",
    meaning: "begin with a purpose",
    example: "She set out to finish the entire project before the weekend.",
    fib: "She ___ to finish the entire project before the weekend.",
  },
  {
    head: "set",
    verb: "set back",
    meaning: "delay or hinder",
    example: "The heavy rain set back our plans for the outdoor sports event.",
    fib: "The heavy rain ___ our plans for the outdoor sports event.",
  },
  {
    head: "set",
    verb: "set in",
    meaning: "begin and seem likely to continue",
    example:
      "The monsoon has set in early this year — it's been raining all week.",
    fib: "The monsoon has ___ early this year — it's been raining all week.",
  },
  {
    head: "carry",
    verb: "carry on",
    meaning: "continue",
    example: "We carried on playing even after it started drizzling.",
    fib: "We ___ playing even after it started drizzling.",
  },
  {
    head: "carry",
    verb: "carry out",
    meaning: "perform or complete a task",
    example:
      "The students carried out the science experiment under the teacher's supervision.",
    fib: "The students ___ the science experiment under the teacher's supervision.",
  },
  {
    head: "carry",
    verb: "carry away",
    meaning: "get overly excited",
    example: "Don't get carried away celebrating — the match isn't over yet!",
    fib: "Don't get ___ celebrating — the match isn't over yet!",
  },
  {
    head: "throw",
    verb: "throw up",
    meaning: "vomit",
    example: "My younger brother threw up during the car journey to Shimla.",
    fib: "My younger brother ___ during the car journey to Shimla.",
  },
  {
    head: "throw",
    verb: "throw out",
    meaning: "expel",
    example: "The umpire threw out the player for arguing with the referee.",
    fib: "The umpire ___ the player for arguing with the referee.",
  },
  {
    head: "throw",
    verb: "throw off",
    meaning: "confuse or mislead",
    example:
      "The sudden change in weather threw off our picnic plans completely.",
    fib: "The sudden change in weather ___ our picnic plans completely.",
  },
  {
    head: "throw",
    verb: "throw together",
    meaning: "prepare quickly with whatever is available",
    example:
      "Amma threw together a quick meal with leftover rice and some curd.",
    fib: "Amma ___ a quick meal with leftover rice and some curd.",
  },
  {
    head: "cut",
    verb: "cut down on",
    meaning: "reduce consumption",
    example: "The doctor advised my father to cut down on sugary drinks.",
    fib: "The doctor advised my father to ___ sugary drinks.",
  },
  {
    head: "cut",
    verb: "cut off",
    meaning: "disconnect",
    example: "Our internet connection was cut off because of the heavy storm.",
    fib: "Our internet connection was ___ because of the heavy storm.",
  },
  {
    head: "cut",
    verb: "cut out",
    meaning: "stop doing something",
    example:
      "The teacher told the class to cut out the chatter during the test.",
    fib: "The teacher told the class to ___ the chatter during the test.",
  },
  {
    head: "cut",
    verb: "cut back on",
    meaning: "reduce spending or consumption",
    example: "We need to cut back on ordering food from outside.",
    fib: "We need to ___ ordering food from outside.",
  },
  {
    head: "cut",
    verb: "cut in",
    meaning: "interrupt",
    example: "It's rude to cut in when your friend is telling a story.",
    fib: "It's rude to ___ when your friend is telling a story.",
  },
  {
    head: "check",
    verb: "check in",
    meaning: "register arrival",
    example:
      "We need to check in at the airport counter two hours before the flight.",
    fib: "We need to ___ at the airport counter two hours before the flight.",
  },
  {
    head: "check",
    verb: "check out",
    meaning: "examine with interest",
    example: "Check out this amazing goal — I've never seen anything like it!",
    fib: "___ this amazing goal — I've never seen anything like it!",
  },
  {
    head: "check",
    verb: "check up on",
    meaning: "monitor wellbeing",
    example:
      "My mother calls every evening to check up on my grandmother's health.",
    fib: "My mother calls every evening to ___ my grandmother's health.",
  },
  {
    head: "check",
    verb: "check off",
    meaning: "mark as complete",
    example:
      "Please check off each item on the list as you pack your school bag.",
    fib: "Please ___ each item on the list as you pack your school bag.",
  },
];
var PRACTICE_SENTENCES = [
  {
    id: 1,
    head: "get",
    verb: "get along",
    sentence:
      "Priya and Sahil didn't ________ at first, but they became good friends after working on the science project together.",
    options: ["get through", "get along", "get over"],
    correct: "get along",
  },
  {
    id: 2,
    head: "get",
    verb: "get over",
    sentence:
      "It took Grandpa a few weeks to ________ his bad cough this winter.",
    options: ["get over", "get into", "get along"],
    correct: "get over",
  },
  {
    id: 3,
    head: "get",
    verb: "get into",
    sentence:
      "After watching the nature documentary, my younger brother really ________ birdwatching.",
    options: ["got along", "got off", "got into"],
    correct: "got into",
  },
  {
    id: 4,
    head: "get",
    verb: "get through",
    sentence:
      "The comprehension passage was very long, but Arun managed to ________ it before the bell rang.",
    options: ["get over", "get through", "get into"],
    correct: "get through",
  },
  {
    id: 5,
    head: "get",
    verb: "get off",
    sentence:
      "The conductor reminded all passengers to ________ at the last stop near the temple.",
    options: ["get off", "get along", "get through"],
    correct: "get off",
  },
  {
    id: 6,
    head: "go",
    verb: "go on",
    sentence:
      "Even though the lights flickered, the actors ________ with the play without stopping.",
    options: ["went through", "went out", "went on"],
    correct: "went on",
  },
  {
    id: 7,
    head: "go",
    verb: "go off",
    sentence:
      "The fire alarm ________ during the lunch break and everyone rushed out of the building.",
    options: ["went off", "went on", "went through"],
    correct: "went off",
  },
  {
    id: 8,
    head: "go",
    verb: "go through",
    sentence:
      "Amma asked me to ________ my bag and check if I had packed my tiffin box.",
    options: ["go on", "go through", "go ahead"],
    correct: "go through",
  },
  {
    id: 9,
    head: "go",
    verb: "go ahead",
    sentence:
      "The principal gave us permission to ________ with the tree-planting drive on Saturday.",
    options: ["go ahead", "go off", "go out"],
    correct: "go ahead",
  },
  {
    id: 10,
    head: "go",
    verb: "go out",
    sentence:
      "During the power cut, the candles ________ one by one because of the breeze from the window.",
    options: ["went on", "went through", "went out"],
    correct: "went out",
  },
  {
    id: 11,
    head: "come",
    verb: "come up",
    sentence:
      "During the morning assembly, the topic of water conservation ________ in the principal's speech.",
    options: ["came along", "came across", "came up"],
    correct: "came up",
  },
  {
    id: 12,
    head: "come",
    verb: "come across",
    sentence:
      "While tidying the bookshelf, I ________ an old photo album from my parents' college days.",
    options: ["came across", "came up", "came over"],
    correct: "came across",
  },
  {
    id: 13,
    head: "come",
    verb: "come along",
    sentence:
      "Neha asked if I wanted to ________ to the book fair at Pragati Maidan.",
    options: ["come over", "come along", "come up"],
    correct: "come along",
  },
  {
    id: 14,
    head: "come",
    verb: "come over",
    sentence:
      "My cousins are ________ this Sunday for a family lunch at our place.",
    options: ["coming along", "coming up", "coming over"],
    correct: "coming over",
  },
  {
    id: 15,
    head: "come",
    verb: "come down with",
    sentence:
      "Three students in our class ________ chickenpox last month and had to stay home.",
    options: ["came down with", "came across", "came along"],
    correct: "came down with",
  },
  {
    id: 16,
    head: "take",
    verb: "take off",
    sentence: "Please ________ your cap before entering the prayer hall.",
    options: ["take after", "take off", "take over"],
    correct: "take off",
  },
  {
    id: 17,
    head: "take",
    verb: "take off",
    sentence:
      "The helicopter ________ from the field behind the hospital during the rescue operation.",
    options: ["took in", "took up", "took off"],
    correct: "took off",
  },
  {
    id: 18,
    head: "take",
    verb: "take up",
    sentence:
      "During the summer camp, many children ________ pottery for the first time.",
    options: ["took up", "took off", "took after"],
    correct: "took up",
  },
  {
    id: 19,
    head: "take",
    verb: "take over",
    sentence:
      "When the class monitor was absent, Deepika was asked to ________ her duties for the day.",
    options: ["take after", "take in", "take over"],
    correct: "take over",
  },
  {
    id: 20,
    head: "take",
    verb: "take after",
    sentence:
      "People often say I ________ my mother because we both have the same smile.",
    options: ["take over", "take after", "take off"],
    correct: "take after",
  },
  {
    id: 21,
    head: "take",
    verb: "take in",
    sentence:
      "The museum had so many exhibits that it was hard to ________ everything in one visit.",
    options: ["take in", "take up", "take after"],
    correct: "take in",
  },
  {
    id: 22,
    head: "put",
    verb: "put on",
    sentence:
      "The weather has turned chilly — don't forget to ________ a warm jacket before stepping out.",
    options: ["put away", "put down", "put on"],
    correct: "put on",
  },
  {
    id: 23,
    head: "put",
    verb: "put off",
    sentence:
      "The annual quiz competition has been ________ until next Friday because the hall is being repaired.",
    options: ["put off", "put away", "put down"],
    correct: "put off",
  },
  {
    id: 24,
    head: "put",
    verb: "put away",
    sentence:
      "After using the art supplies, the teacher reminded everyone to ________ everything neatly.",
    options: ["put off", "put away", "put up with"],
    correct: "put away",
  },
  {
    id: 25,
    head: "put",
    verb: "put up with",
    sentence:
      "Living near a busy road means we have to ________ the noise of traffic every morning.",
    options: ["put off", "put up with", "put away"],
    correct: "put up with",
  },
  {
    id: 26,
    head: "put",
    verb: "put down",
    sentence:
      "A true team player would never ________ a teammate's effort, even after a loss.",
    options: ["put on", "put off", "put down"],
    correct: "put down",
  },
  {
    id: 27,
    head: "turn",
    verb: "turn up",
    sentence:
      "We had almost given up waiting when Arjun finally ________ with his cricket bat.",
    options: ["turned around", "turned into", "turned up"],
    correct: "turned up",
  },
  {
    id: 28,
    head: "turn",
    verb: "turn up",
    sentence:
      "Could you ________ the radio a little? I can't hear the commentary from the kitchen.",
    options: ["turn up", "turn down", "turn around"],
    correct: "turn up",
  },
  {
    id: 29,
    head: "turn",
    verb: "turn down",
    sentence:
      "Meera had to ________ the party invitation because her exams were starting the next day.",
    options: ["turn into", "turn down", "turn up"],
    correct: "turn down",
  },
  {
    id: 30,
    head: "turn",
    verb: "turn into",
    sentence:
      "The small caterpillar we kept in a jar slowly ________ a beautiful butterfly.",
    options: ["turned up", "turned around", "turned into"],
    correct: "turned into",
  },
  {
    id: 31,
    head: "turn",
    verb: "turn around",
    sentence:
      "The kabaddi team was trailing badly, but they ________ the game in the last five minutes.",
    options: ["turned around", "turned into", "turned down"],
    correct: "turned around",
  },
  {
    id: 32,
    head: "give",
    verb: "give up",
    sentence:
      "The puzzle was tricky, but Sana refused to ________ and finally solved it after many attempts.",
    options: ["give away", "give up", "give out"],
    correct: "give up",
  },
  {
    id: 33,
    head: "give",
    verb: "give in",
    sentence:
      "After we promised to be careful, our teacher finally ________ and allowed us to use the sports equipment.",
    options: ["gave up", "gave out", "gave in"],
    correct: "gave in",
  },
  {
    id: 34,
    head: "give",
    verb: "give away",
    sentence:
      "Our school organised a drive where students could ________ books they no longer needed.",
    options: ["give away", "give up", "give in"],
    correct: "give away",
  },
  {
    id: 35,
    head: "give",
    verb: "give out",
    sentence:
      "The class monitor ________ the corrected test papers to each student one by one.",
    options: ["gave in", "gave out", "gave away"],
    correct: "gave out",
  },
  {
    id: 36,
    head: "look",
    verb: "look up",
    sentence: "Armaan __________ the capitals of countries in the atlas.",
    options: ["looked up", "looked into", "looked after"],
    correct: "looked up",
  },
  {
    id: 37,
    head: "look",
    verb: "look after",
    sentence:
      "When Mother had to travel for work, our neighbour Aunty kindly ________ us for two days.",
    options: ["looked into", "looked over", "looked after"],
    correct: "looked after",
  },
  {
    id: 38,
    head: "look",
    verb: "look out",
    sentence: "________! There's a big puddle right in front of you.",
    options: ["Look over", "Look out", "Look into"],
    correct: "Look out",
  },
  {
    id: 39,
    head: "look",
    verb: "look forward to",
    sentence: "All the students are ________ the annual sports day next week.",
    options: ["looking after", "looking into", "looking forward to"],
    correct: "looking forward to",
  },
  {
    id: 40,
    head: "look",
    verb: "look into",
    sentence:
      "The class teacher promised to ________ why the library books had gone missing.",
    options: ["look into", "look up", "look over"],
    correct: "look into",
  },
  {
    id: 41,
    head: "look",
    verb: "look over",
    sentence:
      "Before submitting the project file, ask a friend to ________ it for any mistakes.",
    options: ["look after", "look over", "look into"],
    correct: "look over",
  },
  {
    id: 42,
    head: "make",
    verb: "make up",
    sentence:
      "After arguing over whose turn it was to bat, the two boys quickly ________.",
    options: ["made off", "made do", "made up"],
    correct: "made up",
  },
  {
    id: 43,
    head: "make",
    verb: "make up for",
    sentence:
      "Vikram practised extra hard all week to ________ the session he had missed.",
    options: ["make up for", "make up", "make do with"],
    correct: "make up for",
  },
  {
    id: 44,
    head: "make",
    verb: "make do with",
    sentence:
      "The art room had run out of paintbrushes, so we had to ________ sponges instead.",
    options: ["make up", "make do with", "make off with"],
    correct: "make do with",
  },
  {
    id: 45,
    head: "make",
    verb: "make off with",
    sentence:
      "A cheeky crow ________ a piece of roti from the kitchen windowsill!",
    options: ["made up for", "made do with", "made off with"],
    correct: "made off with",
  },
  {
    id: 46,
    head: "run",
    verb: "run out of",
    sentence:
      "We ________ glue sticks halfway through the craft activity and had to share.",
    options: ["ran out of", "ran into", "ran through"],
    correct: "ran out of",
  },
  {
    id: 47,
    head: "run",
    verb: "run into",
    sentence:
      "At the railway station, I ________ my old neighbour who had moved to Pune last year.",
    options: ["ran through", "ran into", "ran out of"],
    correct: "ran into",
  },
  {
    id: 48,
    head: "run",
    verb: "run over",
    sentence:
      "The teacher asked us to ________ the key dates once more before the history test.",
    options: ["run into", "run out of", "run over"],
    correct: "run over",
  },
  {
    id: 49,
    head: "run",
    verb: "run through",
    sentence: "Let's ________ the skit one last time before the judges arrive.",
    options: ["run through", "run over", "run into"],
    correct: "run through",
  },
  {
    id: 50,
    head: "pick",
    verb: "pick up",
    sentence: "Baba usually ________ from the bus stop when it rains heavily.",
    options: ["picks us on", "picks us at", "picks us up"],
    correct: "picks us up",
  },
  {
    id: 51,
    head: "pick",
    verb: "pick on",
    sentence:
      "The teacher spoke to the class about why it's wrong to ________ someone who is shy or quiet.",
    options: ["pick up", "pick on", "pick out"],
    correct: "pick on",
  },
  {
    id: 52,
    head: "pick",
    verb: "pick out",
    sentence:
      "At the stationery shop, it took me ages to ________ the perfect notebook for my journal.",
    options: ["pick out", "pick at", "pick up"],
    correct: "pick out",
  },
  {
    id: 53,
    head: "pick",
    verb: "pick at",
    sentence:
      "Jordyn just ________ his lunch today — I think he might not be feeling well.",
    options: ["picked up", "picked out", "picked at"],
    correct: "picked at",
  },
  {
    id: 54,
    head: "pick",
    verb: "pick up",
    sentence:
      "My grandmother ________ a few English phrases just by watching television serials.",
    options: ["picked at", "picked up", "picked on"],
    correct: "picked up",
  },
  {
    id: 55,
    head: "bring",
    verb: "bring up",
    sentence:
      "During the student council meeting, Aisha ________ the need for more dustbins in the corridors.",
    options: ["brought up", "brought out", "brought back"],
    correct: "brought up",
  },
  {
    id: 56,
    head: "bring",
    verb: "bring up",
    sentence: "My siblings and I were ________ in a village near Madurai.",
    options: ["brought in", "brought about", "brought up"],
    correct: "brought up",
  },
  {
    id: 57,
    head: "bring",
    verb: "bring about",
    sentence:
      "The new reading programme has ________ a noticeable change in students' vocabulary.",
    options: ["brought back", "brought about", "brought up"],
    correct: "brought about",
  },
  {
    id: 58,
    head: "bring",
    verb: "bring back",
    sentence:
      "The sound of temple bells always ________ memories of summer holidays at my grandparents' house.",
    options: ["brings back", "brings in", "brings out"],
    correct: "brings back",
  },
  {
    id: 59,
    head: "bring",
    verb: "bring in",
    sentence:
      "For the first time, our school has ________ a buddy system where older students help the younger ones settle in.",
    options: ["brought out", "brought back", "brought in"],
    correct: "brought in",
  },
  {
    id: 60,
    head: "bring",
    verb: "bring out",
    sentence:
      "Working on the group mural ________ everyone's artistic side, even those who said they couldn't draw.",
    options: ["brought up", "brought out", "brought about"],
    correct: "brought out",
  },
  {
    id: 61,
    head: "break",
    verb: "break down",
    sentence:
      "The water purifier ________ just before the guests arrived, and we had to boil water quickly.",
    options: ["broke down", "broke into", "broke out"],
    correct: "broke down",
  },
  {
    id: 62,
    head: "break",
    verb: "break down",
    sentence:
      "When the team won the championship after years of trying, the coach ________ and started crying.",
    options: ["broke out", "broke up", "broke down"],
    correct: "broke down",
  },
  {
    id: 63,
    head: "break",
    verb: "break up",
    sentence:
      "The crowd near the school gate slowly ________ once the results were announced.",
    options: ["broke into", "broke up", "broke down"],
    correct: "broke up",
  },
  {
    id: 64,
    head: "break",
    verb: "break in",
    sentence:
      "My new canvas shoes felt stiff at first, but they were much better once I ________ .",
    options: ["broke them down", "broke them out", "broke them in"],
    correct: "broke them in",
  },
  {
    id: 65,
    head: "break",
    verb: "break into",
    sentence:
      "When the magician pulled a rabbit out of the hat, the audience ________ loud applause.",
    options: ["broke into", "broke up", "broke in"],
    correct: "broke into",
  },
  {
    id: 66,
    head: "break",
    verb: "break out",
    sentence:
      "A loud argument ________ between two teams during the quiz competition, and the teacher had to step in.",
    options: ["broke in", "broke down", "broke out"],
    correct: "broke out",
  },
  {
    id: 67,
    head: "hold",
    verb: "hold on",
    sentence:
      "________ — I just need to tie my shoelaces before we start the race.",
    options: ["Hold back", "Hold up", "Hold on"],
    correct: "Hold on",
  },
  {
    id: 68,
    head: "hold",
    verb: "hold up",
    sentence:
      "A fallen tree on the road ________ our school bus for nearly half an hour.",
    options: ["held up", "held on", "held off"],
    correct: "held up",
  },
  {
    id: 69,
    head: "hold",
    verb: "hold back",
    sentence:
      "Even though she was disappointed about not getting the lead role, Kavya managed to ________ her tears.",
    options: ["hold on", "hold back", "hold off"],
    correct: "hold back",
  },
  {
    id: 70,
    head: "hold",
    verb: "hold off",
    sentence:
      "Let's ________ the kite-flying until the wind picks up — there's no point wasting time now.",
    options: ["hold back", "hold up", "hold off"],
    correct: "hold off",
  },
  {
    id: 71,
    head: "keep",
    verb: "keep up",
    sentence:
      "The hiking trail was steep, and some of us found it hard to ________ with the group leader.",
    options: ["keep up", "keep on", "keep off"],
    correct: "keep up",
  },
  {
    id: 72,
    head: "keep",
    verb: "keep on",
    sentence:
      "Even after stumbling twice, the little girl ________ running until she reached the finish line.",
    options: ["kept out", "kept on", "kept up with"],
    correct: "kept on",
  },
  {
    id: 73,
    head: "keep",
    verb: "keep out",
    sentence: "Mother stored the sweets in a tin box to ________ the ants.",
    options: ["keep off", "keep away from", "keep out"],
    correct: "keep out",
  },
  {
    id: 74,
    head: "keep",
    verb: "keep away from",
    sentence:
      "The sign near the pond warned children to ________ the deep end.",
    options: ["keep away from", "keep out", "keep up with"],
    correct: "keep away from",
  },
  {
    id: 75,
    head: "keep",
    verb: "keep up with",
    sentence:
      "Revising a little every day helps you ________ the lessons easily.",
    options: ["keep on", "keep up with", "keep up"],
    correct: "keep up with",
  },
  {
    id: 76,
    head: "keep",
    verb: "keep off",
    sentence:
      "After the heavy rain, the gardener asked us to ________ the freshly planted flower beds.",
    options: ["keep up", "keep out", "keep off"],
    correct: "keep off",
  },
  {
    id: 77,
    head: "set",
    verb: "set up",
    sentence:
      "The students helped ________ the science exhibition in the school hall the evening before.",
    options: ["set up", "set off", "set back"],
    correct: "set up",
  },
  {
    id: 78,
    head: "set",
    verb: "set off",
    sentence:
      "We ________ at dawn so that we could reach the hill station before the afternoon heat.",
    options: ["set back", "set off", "set in"],
    correct: "set off",
  },
  {
    id: 79,
    head: "set",
    verb: "set out",
    sentence:
      "Nandini ________ to read fifty books this year, and she's already halfway there.",
    options: ["set back", "set up", "set out"],
    correct: "set out",
  },
  {
    id: 80,
    head: "set",
    verb: "set back",
    sentence:
      "The unexpected power cut ________ our rehearsal by almost an hour.",
    options: ["set back", "set in", "set off"],
    correct: "set back",
  },
  {
    id: 81,
    head: "set",
    verb: "set in",
    sentence: "Dark clouds gathered after lunch, and soon the rain ________.",
    options: ["set off", "set in", "set up"],
    correct: "set in",
  },
  {
    id: 82,
    head: "carry",
    verb: "carry on",
    sentence:
      "Even after the bell rang, the students were so interested that they asked to ________ with the discussion.",
    options: ["carry out", "carry away", "carry on"],
    correct: "carry on",
  },
  {
    id: 83,
    head: "carry",
    verb: "carry out",
    sentence:
      "The nature club ________ a survey of all the trees on the school campus.",
    options: ["carried out", "carried on", "carried away"],
    correct: "carried out",
  },
  {
    id: 84,
    head: "carry",
    verb: "carry away",
    sentence:
      "Rohan got so ________ by the festival music that he started dancing in the corridor.",
    options: ["carried on", "carried away", "carried out"],
    correct: "carried away",
  },
  {
    id: 85,
    head: "throw",
    verb: "throw up",
    sentence:
      "The boat rocked so much during the ride that two children felt sick and nearly ________.",
    options: ["threw out", "threw off", "threw up"],
    correct: "threw up",
  },
  {
    id: 86,
    head: "throw",
    verb: "throw out",
    sentence:
      "The referee ________ a player from the match for repeated rough tackles.",
    options: ["threw out", "threw together", "threw up"],
    correct: "threw out",
  },
  {
    id: 87,
    head: "throw",
    verb: "throw off",
    sentence:
      "The riddle was worded in such a tricky way that it ________ almost everyone in the class.",
    options: ["threw together", "threw off", "threw out"],
    correct: "threw off",
  },
  {
    id: 88,
    head: "throw",
    verb: "throw together",
    sentence:
      "With only rice and some vegetables left, Amma ________ a delicious pulao in no time.",
    options: ["threw off", "threw out", "threw together"],
    correct: "threw together",
  },
  {
    id: 89,
    head: "cut",
    verb: "cut down on",
    sentence:
      "Our teacher suggested we ________ the amount of paper we waste by using both sides.",
    options: ["cut down on", "cut in", "cut off"],
    correct: "cut down on",
  },
  {
    id: 90,
    head: "cut",
    verb: "cut off",
    sentence:
      "The telephone line got ________ during the thunderstorm and we couldn't call anyone.",
    options: ["cut back on", "cut off", "cut out"],
    correct: "cut off",
  },
  {
    id: 91,
    head: "cut",
    verb: "cut out",
    sentence:
      "The librarian asked the noisy group to ________ the whispering immediately.",
    options: ["cut off", "cut back on", "cut out"],
    correct: "cut out",
  },
  {
    id: 92,
    head: "cut",
    verb: "cut back on",
    sentence:
      "To save up for the school trip, our family decided to ________ eating at restaurants.",
    options: ["cut back on", "cut off", "cut in"],
    correct: "cut back on",
  },
  {
    id: 93,
    head: "cut",
    verb: "cut in",
    sentence:
      "Ankit kept trying to ________ while the teacher was giving instructions.",
    options: ["cut off", "cut in", "cut out"],
    correct: "cut in",
  },
  {
    id: 94,
    head: "check",
    verb: "check in",
    sentence: "The receptionist asked us to ________ at the front desk.",
    options: ["check off", "check out", "check in"],
    correct: "check in",
  },
  {
    id: 95,
    head: "check",
    verb: "check out",
    sentence:
      "________ this beautiful rangoli that the junior students made for the festival!",
    options: ["Check out", "Check in", "Check off"],
    correct: "Check out",
  },
  {
    id: 96,
    head: "check",
    verb: "check up on",
    sentence:
      "My aunt calls every weekend to ________ how we are doing after the move to the new city.",
    options: ["check off", "check up on", "check in"],
    correct: "check up on",
  },
  {
    id: 97,
    head: "check",
    verb: "check off",
    sentence:
      "As we finished packing each item for the picnic, we ________ on the list.",
    options: ["checked up", "checked it out", "checked it off"],
    correct: "checked it off",
  },
];

var HEAD_VERBS = [];
(function () {
  var s = {};
  PHRASAL_VERBS.forEach(function (p) {
    s[p.head] = 1;
  });
  HEAD_VERBS = Object.keys(s).sort();
})();

function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}
function verbCount(h) {
  return PHRASAL_VERBS.filter(function (p) {
    return p.head === h;
  }).length;
}

// ── Confetti
function launchConfetti() {
  var c = document.getElementById("confetti");
  var colors = [
    "#FFF59D",
    "#F48FB1",
    "#81D4FA",
    "#C8E6C9",
    "#FFAB91",
    "#CE93D8",
    "#EF5350",
    "#42A5F5",
    "#66BB6A",
    "#FFA726",
  ];
  for (var i = 0; i < 45; i++) {
    var p = document.createElement("div");
    p.className = "confetti-piece";
    var col = colors[Math.floor(Math.random() * colors.length)];
    var sz = 6 + Math.random() * 10;
    p.style.left = Math.random() * 100 + "%";
    p.style.top = "15%";
    p.style.width = sz + "px";
    p.style.height = sz + "px";
    p.style.animationDelay = Math.random() * 0.5 + "s";
    p.style.animationDuration = 1 + Math.random() * 0.8 + "s";
    p.style.background = col;
    if (Math.random() > 0.5) p.style.borderRadius = "50%";
    c.appendChild(p);
  }
  setTimeout(function () {
    c.innerHTML = "";
  }, 2500);
}

// ── State
var state = {
  screen: "home",
  filter: null,
  filterIsManual: false,
  filterDeck: [],
  menuOpen: false,
  learnDeck: [],
  learnIndex: 0,
  revealStage: 0,
  slideDir: "right",
  practiceDeck: [],
  practiceIndex: 0,
  practiceChosen: null,
  practiceWrong1: null,
  practiceOptions: [],
  practiceCorrectIdx: null,
  scoreCorrect: 0,
  scoreIncorrect: 0,
};

function getNextFilter() {
  if (state.filterDeck.length === 0) {
    state.filterDeck = shuffle(HEAD_VERBS);
  }
  // If the first item in our deck is the current filter, move it to the end to avoid repetition
  if (state.filterDeck.length > 1 && state.filterDeck[0] === state.filter) {
    var f = state.filterDeck.shift();
    state.filterDeck.push(f);
  }
  return state.filterDeck.shift();
}

function getFiltered() {
  return state.filter
    ? PHRASAL_VERBS.filter(function (p) {
      return p.head === state.filter;
    })
    : PHRASAL_VERBS.slice();
}
function startLearn() {
  if (state.screen === "home") {
    state.filter = getNextFilter();
    state.filterIsManual = false;
  }
  state.screen = "learn";
  state.learnDeck = shuffle(getFiltered());
  state.learnIndex = 0;
  state.revealStage = 0;
  state.menuOpen = false;
  render();
}
function startPractice() {
  if (state.screen === "home") {
    state.filter = getNextFilter();
    state.filterIsManual = false;
  }
  state.screen = "practice";
  var src = state.filter
    ? PRACTICE_SENTENCES.filter(function (p) { return p.head === state.filter; })
    : PRACTICE_SENTENCES.slice();
  state.practiceDeck = shuffle(src);
  state.practiceIndex = 0;
  state.practiceChosen = null;
  state.practiceWrong1 = null;
  state.scoreCorrect = 0;
  state.scoreIncorrect = 0;
  state.menuOpen = false;
  setupPracticeQ();
  render();
}
function setupPracticeQ() {
  var cur = state.practiceDeck[state.practiceIndex];
  if (!cur) return;
  var opts = shuffle(cur.options.slice());
  state.practiceOptions = opts;
  state.practiceCorrectIdx = opts.indexOf(cur.correct);
  state.practiceChosen = null;
  state.practiceWrong1 = null;
}
function goHome() {
  state.screen = "home";
  state.menuOpen = false;
  render();
}
function setFilter(h) {
  state.filter = h;
  state.filterIsManual = h !== null;
  state.menuOpen = false;
  if (state.screen === "learn") startLearn();
  else if (state.screen === "practice") startPractice();
  else render();
}
function toggleMenu() {
  state.menuOpen = !state.menuOpen;
  render();
}
function closeMenu() {
  state.menuOpen = false;
  render();
}

function advanceReveal() {
  if (state.revealStage < 2) {
    state.revealStage++;
    var s2 = document.querySelector(".section-example");
    var s3 = document.querySelector(".section-meaning");
    var d1 = document.querySelector(".divider-1");
    var d2 = document.querySelector(".divider-2");
    var prompt = document.getElementById("tap-prompt");
    if (state.revealStage === 1) {
      if (s2) s2.classList.add("visible");
      if (d1) d1.classList.add("visible");
      if (prompt) prompt.textContent = "Tap again to see the meaning";
    } else if (state.revealStage === 2) {
      if (s3) s3.classList.add("visible");
      if (d2) d2.classList.add("visible");
      if (prompt) prompt.textContent = "";
    }
  }
}

function advanceReveal1() {
  if (state.revealStage >= 2) return;

  state.revealStage++;
  const prompt = document.getElementById("tap-prompt");

  if (state.revealStage === 1) {
    // Show Meaning
    document.querySelector(".section-meaning")?.classList.add("visible");
    document.querySelector(".divider-1")?.classList.add("visible");
    if (prompt) prompt.textContent = "Tap again to see the example";
  } else if (state.revealStage === 2) {
    // Show Example
    document.querySelector(".section-example")?.classList.add("visible");
    document.querySelector(".divider-2")?.classList.add("visible");
    if (prompt) prompt.textContent = "";
  }
}
function learnPrev() {
  if (state.learnIndex > 0) {
    state.learnIndex--;
    state.revealStage = 0;
    state.slideDir = "left";
    render();
  }
}
function learnNext() {
  if (state.learnIndex < state.learnDeck.length - 1) {
    state.learnIndex++;
    state.revealStage = 0;
    state.slideDir = "right";
    render();
  }
}
function choosePractice(i) {
  if (state.practiceChosen !== null) return;
  var ok = i === state.practiceCorrectIdx;
  if (ok) {
    state.practiceChosen = i;
    state.scoreCorrect++;
    setTimeout(launchConfetti, 100);
    render();
  } else {
    if (state.practiceWrong1 === null) {
      // First wrong attempt — give another chance
      state.practiceWrong1 = i;
      state.scoreIncorrect++;
      setTimeout(function () {
        var card = document.querySelector(".practice-sentence");
        if (card) {
          card.classList.add("shake");
          setTimeout(function () {
            card.classList.remove("shake");
          }, 500);
        }
      }, 50);
      render();
    } else {
      // Second wrong attempt — lock and reveal correct answer
      state.practiceChosen = i;
      render();
    }
  }
}
function practiceNext() {
  if (state.practiceIndex < state.practiceDeck.length - 1) {
    state.practiceIndex++;
    setupPracticeQ();
    render();
  }
}

// ── Icons
var iconHome =
  '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
var iconArrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';

// ── Render
function render() {
  var app = document.getElementById("app");
  var html = "";

  if (state.screen === "home") {
    html +=
      '<div class="landing">' +
      //   '<div class="landing-doodle">\u270F\uFE0F</div>' +
      "<h1>Phrasal Verbs</h1>" +
      '<div class="landing-buttons">' +
      '<button class="landing-btn btn-learn" onclick="startLearn()">Learn</button>' +
      '<button class="landing-btn btn-practice" onclick="startPractice()">Practise</button>' +
      "</div></div>";
  } else {
    var ml = state.screen === "learn" ? "Learn" : "Practise";
    html +=
      '<div class="top-bar">' +
      //   '<span class="top-bar-title">' +
      //   ml +
      //   "</span>" +
      "</div>";
    if (state.screen === "learn") html += renderLearn();
    else html += renderPractice();
  }

  // Show/hide fixed home button
  var homeBtn = document.getElementById("homeBtn");
  if (homeBtn)
    homeBtn.style.display = state.screen === "home" ? "none" : "flex";

  // Side menu
  var oc = state.menuOpen ? "open" : "";
  var items =
    '<div class="menu-item menu-item-all ' +
    (state.filter === null ? "active" : "") +
    '" onclick="setFilter(null)">All verbs <span class="count">' +
    PHRASAL_VERBS.length +
    "</span></div>";
  HEAD_VERBS.forEach(function (h) {
    items +=
      '<div class="menu-item ' +
      (state.filter === h ? "active" : "") +
      '" onclick="setFilter(\'' +
      h +
      "')\">" +
      h +
      ' <span class="count">' +
      verbCount(h) +
      "</span></div>";
  });
  html +=
    '<div class="side-menu-overlay ' +
    oc +
    '" onclick="closeMenu()"></div>' +
    '<div class="side-menu ' +
    oc +
    '">' +
    "<h3>Phrasal Verbs</h3>" +
    '<div class="menu-sub">Choose a verb to filter</div>' +
    items +
    "</div>";

  // Menu trigger
  if (state.screen !== "home") {
    html +=
      '<button class="menu-trigger ' +
      oc +
      '" onclick="toggleMenu()" title="Filter by verb">' +
      iconArrow +
      "</button>";
  }

  app.innerHTML = html;
}

function renderLearn() {
  var deck = state.learnDeck;
  if (deck.length === 0)
    return '<div style="text-align:center;padding:40px 0;color:var(--text-muted);">No phrasal verbs found for this filter.</div>';
  var idx = state.learnIndex;
  var item = deck[idx];
  var fp =
    state.filter && state.filterIsManual
      ? '<span class="filter-pill">' + state.filter + "</span>"
      : "";
  var sc = state.slideDir === "right" ? "slide-right" : "slide-left";
  var st = state.revealStage;

  var exVis = st >= 1 ? " visible" : "";
  var meVis = st >= 2 ? " visible" : "";
  var d1Vis = st >= 1 ? " visible" : "";
  var d2Vis = st >= 2 ? " visible" : "";

  var promptText = "";
  if (st === 0) promptText = "Tap the card to see an example";
  else if (st === 1) promptText = "Tap again to see the meaning";

  return (
    '<div class="learn-view">' +
    '<span class="mode-label learn">Learn</span>' +
    fp +
    '<div class="learn-prompt">What do you think this phrasal verb means?</div>' +
    '<div class="card-wrapper ' +
    sc +
    '">' +
    '<div class="reveal-card" onclick="advanceReveal()">' +
    // Section 1: Verb (always visible)
    '<div class="reveal-section section-verb">' +
    '<div class="tape tape-tl"></div><div class="tape tape-tr"></div>' +
    '<div class="flashcard-verb">' +
    item.verb +
    "</div>" +
    "</div>" +
    // Divider 1
    '<hr class="reveal-divider divider-1' +
    d1Vis +
    '" />' +
    // Section 2: Example
    '<div class="reveal-section section-example' +
    exVis +
    '">' +
    '<div class="flashcard-example">' +
    item.example +
    "</div>" +
    "</div>" +
    // Divider 2
    '<hr class="reveal-divider divider-2' +
    d2Vis +
    '" />' +
    // Section 3: Meaning
    '<div class="reveal-section section-meaning' +
    meVis +
    '">' +
    '<div class="meaning-label">Meaning</div>' +
    '<div class="meaning-text">' +
    item.meaning +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class="tap-prompt" id="tap-prompt">' +
    promptText +
    "</div>" +
    "</div>" +
    '<div class="nav-row">' +
    '<button class="nav-btn" onclick="learnPrev()" ' +
    (idx === 0 ? "disabled" : "") +
    ">← Previous</button>" +
    '<span class="card-counter">' +
    (idx + 1) +
    " / " +
    deck.length +
    "</span>" +
    '<button class="nav-btn" onclick="learnNext()" ' +
    (idx === deck.length - 1 ? "disabled" : "") +
    ">Next →</button>" +
    "</div></div>"
  );
}

function renderPractice() {
  var deck = state.practiceDeck;
  if (deck.length === 0)
    return '<div style="text-align:center;padding:40px 0;color:var(--text-muted);">No phrasal verbs found for this filter.</div>';
  var idx = state.practiceIndex;
  var item = deck[idx];
  var fp =
    state.filter && state.filterIsManual
      ? '<span class="filter-pill">' + state.filter + "</span>"
      : "";
  var answered = state.practiceChosen !== null;
  var firstWrong = !answered && state.practiceWrong1 !== null;
  var isCorrect = answered && state.practiceChosen === state.practiceCorrectIdx;

  // Build sentence with blank using item.sentence (blanks are ___+)
  var blankRe = /_{3,}/;
  var sentHTML;
  if (answered) {
    var fillClass = isCorrect ? "blank correct-fill" : "blank incorrect-fill";
    var fillText = state.practiceOptions[state.practiceChosen];
    sentHTML = item.sentence.replace(blankRe, '<span class="' + fillClass + '">' + fillText + "</span>");
  } else if (firstWrong) {
    var fillText0 = state.practiceOptions[state.practiceWrong1];
    sentHTML = item.sentence.replace(blankRe, '<span class="blank incorrect-fill">' + fillText0 + "</span>");
  } else {
    sentHTML = item.sentence.replace(blankRe, '<span class="blank"></span>');
  }

  var choicesHTML = "";
  state.practiceOptions.forEach(function (opt, i) {
    var cls = "choice-btn";
    if (answered) {
      if (i === state.practiceChosen && isCorrect) cls += " chosen correct";
      else if (i === state.practiceChosen && !isCorrect) cls += " chosen incorrect";
      if (i === state.practiceCorrectIdx && !isCorrect) cls += " reveal-correct";
      if (i !== state.practiceChosen && i !== state.practiceCorrectIdx) cls += " disabled";
    } else if (firstWrong) {
      if (i === state.practiceWrong1) cls += " chosen incorrect disabled";
    }
    choicesHTML += '<button class="' + cls + '" onclick="choosePractice(' + i + ')">' + opt + "</button>";
  });

  var feedbackHTML = "";
  if (answered) {
    var fbC = isCorrect ? "correct" : "incorrect";
    var fbT = isCorrect ? "\u2713 Correct!" : "\u2717 Not quite!";
    var btnL = idx < deck.length - 1 ? "Next \u2192" : "Finish";
    var btnA = idx < deck.length - 1 ? "practiceNext()" : "goHome()";
    feedbackHTML =
      '<div class="feedback-row">' +
      '<span class="feedback-text ' + fbC + '">' + fbT + "</span>" +
      '<button class="next-btn practice-next" onclick="' + btnA + '">' + btnL + "</button>" +
      "</div>";
  } else if (firstWrong) {
    feedbackHTML =
      '<div class="feedback-row">' +
      '<span class="feedback-text incorrect">\u2717 Try again!</span>' +
      "</div>";
  }

  return (
    '<div class="practice-view">' +
    '<span class="mode-label practice">Practise</span>' +
    fp +
    '<div class="score-bar">' +
    '<span class="score-correct">Correct: <span>' +
    state.scoreCorrect +
    "</span></span>" +
    '<span class="card-counter">' +
    (idx + 1) +
    " / " +
    deck.length +
    "</span>" +
    '<span class="score-incorrect">Incorrect: <span>' +
    state.scoreIncorrect +
    "</span></span>" +
    "</div>" +
    '<div class="slide-right">' +
    '<div class="practice-sentence">' +
    '<div class="pin pin-blue" style="top:-6px;left:20px;"></div>' +
    '<div class="sentence-label">Fill in the blank</div>' +
    '<div class="sentence-text">' +
    sentHTML +
    "</div></div>" +
    '<div class="choices">' +
    choicesHTML +
    "</div>" +
    feedbackHTML +
    "</div></div>"
  );
}

// ── Init
render();
