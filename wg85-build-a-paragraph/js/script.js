// Build a Paragraph Widget - Interactive Implementation

// Data for all 15 paragraph topics
const paragraphData = [
  {
    id: 1,
    topic: "A Honeybee's Day",
    image: "honeybee.svg",
    sentences: [
      "This hard work helps plants grow and gives us delicious honey.",
      "A honeybee's day starts early in the morning.",
      "After collecting enough, it returns to the hive.",
      "There, it stores the nectar, which later becomes honey.",
      "It flies from flower to flower, gathering sweet nectar."
    ],
    correctOrder: [2, 5, 3, 4, 1], // 1-indexed
    annotations: [
      { text: "Interesting opening sentence that makes readers curious", type: "Annotation 1", words: ["A honeybee's day starts early in the morning."] },
      { text: "Linking words that connect ideas", type: "Annotation 2", words: ["After", "There", "later"] },
      { text: "Concluding sentence", type: "Annotation 3", words: ["This hard work helps plants grow and gives us delicious honey."] }
    ],
    linkingWords: ["After", "There", "later"],
    summary: "A paragraph is a group of sentences on a single idea. Here, the paragraph describes a honeybee's day. Whenever you write a paragraph, try providing it a suitable title."
  },
  {
    id: 2,
    topic: "The Story of Chocolate",
    image: "chocolate.svg",
    sentences: [
      "Today, chocolate is enjoyed worldwide in candies, cakes, and ice cream, making it a favourite treat!",
      "Chocolate comes from cocoa beans that grow on trees in hot countries.",
      "Ancient people in Central America discovered cocoa and made a bitter drink from it.",
      "Later, sugar and milk were added to make it sweet."
    ],
    correctOrder: [2, 3, 4, 1],
    annotations: [
      { text: "Clear opening sentence that introduces the main topic", type: "Annotation 1", words: ["Chocolate comes from cocoa beans that grow on trees in hot countries."] },
      { text: "Linking words showcasing the sequence of events", type: "Annotation 2", words: ["Later", "Today"] },
      { text: "A concluding sentence that summarises the present-day importance of chocolate", type: "Annotation 3", words: ["Today, chocolate is enjoyed worldwide in candies, cakes, and ice cream, making it a favourite treat!"] }
    ],
    linkingWords: ["Later", "Today"],
    summary: "A paragraph is a group of sentences on a single idea. Here, all sentences focus on a single idea: the evolution of chocolate. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 3,
    topic: "Our Magnificent Sun",
    image: "sun.svg",
    sentences: [
      "Surprisingly, the Sun is so big that one million Earths could fit inside it!",
      "Indeed, our Sun is truly a magnificent star.",
      "Without the Sun, there would be no life on Earth.",
      "The Sun is a giant ball of hot, glowing gas that gives us light and heat.",
      "Every second, the Sun produces enough energy to power our planet for years."
    ],
    correctOrder: [4, 3, 1, 5, 2],
    annotations: [
      { text: "An introductory sentence that describes the Sun", type: "Annotation 1", words: ["The Sun is a giant ball of hot, glowing gas that gives us light and heat."] },
      { text: "Using words highlight the Sun's extraordinary qualities and importance", type: "Annotation 2", words: ["Without", "Surprisingly", "Every second"] },
      { text: "The concluding line celebrates the Sun's magnificence", type: "Annotation 3", words: ["Indeed, our Sun is truly a magnificent star."] }
    ],
    linkingWords: ["Without", "Surprisingly", "Every second"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence tells us what makes the Sun so special. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 4,
    topic: "The Mighty Himalayas",
    image: "himalaya.svg",
    sentences: [
      "Important rivers like the Ganga and Brahmaputra also begin from Himalayan glaciers.",
      "The Himalayan mountain range stretches across northern India like a protective wall.",
      "Every summer, tourists visit hill stations like Shimla and Darjeeling.",
      "The Himalayas are truly India's precious natural treasure.",
      "Among these peaks is Mount Everest, the world's tallest mountain."
    ],
    correctOrder: [2, 5, 1, 3, 4],
    annotations: [
      { text: "An opening sentence that helps readers visualise the Himalayas", type: "Annotation 1", words: ["The Himalayan mountain range stretches across northern India like a protective wall."] },
      { text: "Words and phrases that build flow", type: "Annotation 2", words: ["Among", "also", "Every summer"] },
      { text: "A concluding sentence that summarises the importance of the Himalayas", type: "Annotation 3", words: ["The Himalayas are truly India's precious natural treasure."] }
    ],
    linkingWords: ["Among", "also", "Every summer"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence shares something important about the Himalayan mountains. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 5,
    topic: "Chintu's Market Mishap",
    image: "chintu's-market.svg",
    sentences: [
      "As a result, the shopkeeper slipped and landed in a basket of tomatoes, turning as red as the vegetables themselves!",
      "A clever monkey named Chintu once sneaked into a vegetable market in Jaipur.",
      "He grabbed a bunch of bananas and started juggling them like a circus performer!",
      "When the shopkeeper chased him, Chintu threw a banana peel on the ground."
    ],
    correctOrder: [2, 3, 4, 1],
    annotations: [
      { text: "An opening sentence that introduces the main character and setting", type: "Annotation 1", words: ["A clever monkey named Chintu once sneaked into a vegetable market in Jaipur."] },
      { text: "Words that connect the ideas and show the sequence of events in the story", type: "Annotation 2", words: ["When", "As a result", "Jaipur"] },
      { text: "A concluding sentence that ends the story with humour", type: "Annotation 3", words: ["As a result, the shopkeeper slipped and landed in a basket of tomatoes, turning as red as the vegetables themselves!"] }
    ],
    linkingWords: ["When", "As a result", "Jaipur"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence follows Chintu's funny adventure in the market. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 6,
    topic: "My First Day at School",
    image: "first-day-school.svg",
    sentences: [
      "After she left, I sat quietly feeling lonely amongst unfamiliar faces.",
      "However, a friendly girl named Priya sat beside me and shared her tiffin.",
      "I still remember my first day at school vividly.",
      "By day's end, I had made three friends and realised school would be wonderful.",
      "When I entered the gate holding my mother's hand, my heart beat fast with nervousness."
    ],
    correctOrder: [3, 5, 1, 2, 4],
    annotations: [
      { text: "An engaging introduction that makes the topic personal and relatable", type: "Annotation 1", words: ["I still remember my first day at school vividly."] },
      { text: "Linking words that indicate sequence of events and change in feelings", type: "Annotation 2", words: ["When", "After", "However", "By day's end"] },
      { text: "A concluding line that reflects on the overall experience", type: "Annotation 3", words: ["By day's end, I had made three friends and realised school would be wonderful."] }
    ],
    linkingWords: ["When", "After", "However", "By day's end"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence takes us through the feelings and events of the first day at school. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 7,
    topic: "Postman on Duty",
    image: "postman.svg",
    sentences: [
      "The postman truly deserves our respect and gratitude.",
      "He also delivers birthday cards and important documents.",
      "The postman is an important person who delivers letters and parcels to our homes.",
      "Every day, he wears a khaki uniform and carries a heavy bag.",
      "Rain or shine, he walks through streets bringing us news from loved ones."
    ],
    correctOrder: [3, 4, 5, 2, 1],
    annotations: [
      { text: "An opening sentence that introduces the postman and his role", type: "Annotation 1", words: ["The postman is an important person who delivers letters and parcels to our homes."] },
      { text: "Expressions that emphasize the postman's dedication", type: "Annotation 2", words: ["Every day", "Rain or shine"] },
      { text: "A concluding sentence that expresses respect for the postman's service", type: "Annotation 3", words: ["The postman truly deserves our respect and gratitude."] }
    ],
    linkingWords: ["Every day", "Rain or shine"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence tells us about the postman and his dedicated work. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 8,
    topic: "The Magnificent Taj Mahal",
    image: "tajmahal.svg",
    sentences: [
      "It took 22 years to complete and features intricate carvings and precious stone inlays.",
      "Truly, the Taj Mahal is a timeless monument to love.",
      "Emperor Shah Jahan built this white marble monument in memory of his wife Mumtaz Mahal.",
      "The Taj Mahal in Agra is one of the Seven Wonders of the World and a symbol of eternal love.",
      "Every year, millions of tourists visit to admire its beauty."
    ],
    correctOrder: [4, 3, 1, 5, 2],
    annotations: [
      { text: "An Introductory sentence that highlight the importance of the Taj Mahal", type: "Annotation 1", words: ["The Taj Mahal in Agra is one of the Seven Wonders of the World and a symbol of eternal love."] },
      { text: "Words that add historical and descriptive detail", type: "Annotation 2", words: ["white marble monument", "intricate carvings", "precious stone inlays"] },
      { text: "A concluding statement that reveals its everlasting virtue", type: "Annotation 3", words: ["Truly, the Taj Mahal is a timeless monument to love."] }
    ],
    linkingWords: ["white marble monument", "intricate carvings", "precious stone inlays"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence describes the Taj Mahal's history and grandeur. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 9,
    topic: "The Floating Egg Experiment",
    image: "floating-egg.svg",
    sentences: [
      "This happens because salt water becomes denser than the egg, pushing it upwards.",
      "In normal tap water, a fresh egg sinks to the bottom because it's denser than water.",
      "Similarly, swimming in the ocean is easier than in a pool due to the salty water.",
      "However, when you add salt and stir, the egg begins to float!"
    ],
    correctOrder: [2, 4, 1, 3],
    annotations: [
      { text: "An opening sentence that tells us what happens in normal water", type: "Annotation 1", words: ["In normal tap water, a fresh egg sinks to the bottom because it's denser than water."] },
      { text: "Words that show cause, effect, and comparison", type: "Annotation 2", words: ["However", "This happens because", "Similarly"] },
      { text: "A concluding sentence that connects the experiment to real life", type: "Annotation 3", words: ["Similarly, swimming in the ocean is easier than in a pool due to the salty water."] }
    ],
    linkingWords: ["However", "This happens because", "Similarly"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence explains why an egg floats in salt water. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 10,
    topic: "The Sleepiest Animal",
    image: "sleepiest-animal.svg",
    sentences: [
      "Eucalyptus leaves provide very little energy, so koalas conserve strength by resting most of the time.",
      "Surely, koalas have mastered the art of relaxation!",
      "Koalas hold the record for sleeping the longest, snoozing up to 20 hours daily!",
      "During their brief waking hours, they eat, groom, and climb to different branches."
    ],
    correctOrder: [3, 1, 4, 2],
    annotations: [
      { text: "The opening sentence that introduces koalas' amazing sleeping habit", type: "Annotation 1", words: ["Koalas hold the record for sleeping the longest, snoozing up to 20 hours daily!"] },
      { text: "Words that show cause and add detail", type: "Annotation 2", words: ["so", "During"] },
      { text: "A concluding sentence that summarises koalas' relaxed lifestyle with humour", type: "Annotation 3", words: ["Surely, koalas have mastered the art of relaxation!"] }
    ],
    linkingWords: ["so", "During"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence is about why koalas sleep so much. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 11,
    topic: "The Joy of Sharing",
    image: "joy-sharing.svg",
    sentences: [
      "Even sharing our time by helping with homework shows we care.",
      "Sharing is a wonderful habit that makes everyone happy.",
      "At school, sharing lunch or stationery with friends strengthens our friendship.",
      "Remember, happiness multiplies when shared, making it a true blessing.",
      "When we share toys, books, or clothes with someone in need, it brings them comfort."
    ],
    correctOrder: [2, 3, 5, 1, 4],
    annotations: [
      { text: "An opening sentence that establishes sharing as a valuable quality", type: "Annotation 1", words: ["Sharing is a wonderful habit that makes everyone happy."] },
      { text: "Phrases that introduce different examples of sharing", type: "Annotation 2", words: ["At school", "When", "Even"] },
      { text: "A thoughtful conclusion", type: "Annotation 3", words: ["Remember, happiness multiplies when shared, making it a true blessing."] }
    ],
    linkingWords: ["At school", "When", "Even"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence shows us how sharing makes life better. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 12,
    topic: "The Beautiful Spring Season",
    image: "spring-season.svg",
    sentences: [
      "Also, the weather becomes pleasant, neither too hot nor too cold.",
      "Moreover, colourful butterflies and busy bees fly from flower to flower.",
      "It also reminds us that new beginnings are always beautiful.",
      "Spring is my favourite season when nature comes alive with colours.",
      "Finally, spring fills our hearts with happiness.",
      "During this time, flowers bloom in gardens and trees grow fresh green leaves."
    ],
    correctOrder: [4, 6, 1, 2, 5, 3],
    annotations: [
      { text: "A sentence that introduces the topic with enthusiasm", type: "Annotation 1", words: ["Spring is my favourite season when nature comes alive with colours"] },
      { text: "Words that add details and signal the ending", type: "Annotation 2", words: ["During", "Also", "Moreover", "Finally"] },
      { text: "A concluding sentence that shares the deeper meaning of spring", type: "Annotation 3", words: ["It also reminds us that new beginnings are always beautiful"] }
    ],
    linkingWords: ["During", "Also", "Moreover", "Finally"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence celebrates what makes spring special. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 13,
    topic: "Nature's Healthy Gifts",
    image: "fruits.svg",
    sentences: [
      "They are full of vitamins, minerals, and fibre our body needs.",
      "For example, mangoes provide Vitamin A, oranges give Vitamin C, and bananas offer instant energy.",
      "Therefore, we must eat fresh fruits daily to stay fit.",
      "Fruits are nature's gifts that keep us healthy and strong.",
      "Besides being nutritious, fruits taste delicious and come in many colours."
    ],
    correctOrder: [4, 1, 2, 5, 3],
    annotations: [
      { text: "An opening sentence that presents fruits as nature's gifts", type: "Annotation 1", words: ["Fruits are nature's gifts that keep us healthy and strong"] },
      { text: "Linking words that give examples and draw a conclusion", type: "Annotation 2", words: ["For example", "Besides", "Therefore"] },
      { text: "A concluding sentence that emphasises the benefit of eating fruits", type: "Annotation 3", words: ["Therefore, we must eat fresh fruits daily to stay fit"] }
    ],
    linkingWords: ["For example", "Besides", "Therefore"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence tells us why fruits are good for our health. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 14,
    topic: "The World of Decimals",
    image: "decimals.svg",
    sentences: [
      "The decimal point separates the whole number from the fractional part.",
      "Decimals are a special way of writing numbers that are not whole.",
      "And so, learning decimals makes our daily tasks simpler and more precise.",
      "For instance, when we buy 1.5 kilograms of apples or measure height as 4.2 feet, we use decimals.",
      "Decimals make calculations easier than fractions, especially with money."
    ],
    correctOrder: [2, 4, 1, 5, 3],
    annotations: [
      { text: "An opening sentence that defines decimals", type: "Annotation 1", words: ["Decimals are a special way of writing numbers that are not whole"] },
      { text: "Phrases that build flow in the paragraph", type: "Annotation 2", words: ["For instance", "especially"] },
      { text: "A concluding sentence highlighting importance of decimals", type: "Annotation 3", words: ["And so, learning decimals makes our daily tasks simpler and more precise"] }
    ],
    linkingWords: ["For instance", "especially"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence helps us understand what decimals are and why they matter. Whenever you write a paragraph, try providing a suitable title."
  },
  {
    id: 15,
    topic: "The Festival of Colours",
    image: "festival-colours.svg",
    sentences: [
      "During this celebration, people wear old clothes and play with bright coloured powders called gulal.",
      "Families prepare special treats like gujiya and thandai to share with neighbours.",
      "Indeed, Holi teaches us to celebrate life together with happiness.",
      "Holi is a joyful festival that marks the arrival of spring in India.",
      "Children and adults throw colours at each other, laughing and singing festive songs."
    ],
    correctOrder: [4, 1, 5, 2, 3],
    annotations: [
      { text: "An opening sentence that introduces the festival", type: "Annotation 1", words: ["Holi is a joyful festival that marks the arrival of spring in India"] },
      { text: "Words that build flow", type: "Annotation 2", words: ["During this celebration", "Indeed"] },
      { text: "A concluding sentence that captures the spirit of the festival", type: "Annotation 3", words: ["Indeed, Holi teaches us to celebrate life together with happiness"] }
    ],
    linkingWords: ["During this celebration", "Indeed"],
    summary: "A paragraph is a group of sentences on a single idea. Here, every sentence describes how people celebrate the colourful festival of Holi. Whenever you write a paragraph, try providing a suitable title."
  }
];

// Global state
let currentTopicIndex = 0;
let userOrder = [];
let isComplete = false;
let isAnswerShown = false;
let audioContext;

// Color mapping for sentence boxes
const sentenceColors = ['#FFE066', '#FFB3D9', '#A8D5FF', '#B3F5BC', '#FFB366', '#D4B3FF'];

// Initialize widget
document.addEventListener("DOMContentLoaded", () => {
  initAudio();
  // Shuffle all paragraphs initially (in-place)
  shuffleArray(paragraphData);
  loadTopic(currentTopicIndex);
  setupEventListeners();
  updateTopicNavigationButtons();
});


// Initialize audio context for sounds
function initAudio() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    console.log("Audio not supported");
  }
}

// Play sound (correct/incorrect)
function playSound(type) {
  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  if (type === 'correct') {
    oscillator.frequency.value = 800;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
  } else {
    oscillator.frequency.value = 200;
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  }
}

// Load topic data and update UI
function loadTopic(index) {
  const topic = paragraphData[index];
  currentTopicIndex = index;
  userOrder = [];
  isComplete = false;
  isAnswerShown = false;

  // Clear existing content
  clearExistingContent();

  // Update topic title
  updateTopicTitle(topic.topic);

  // Create sentence boxes dynamically
  createSentenceBoxes(topic);

  // Create paragraph slots
  createParagraphSlots(topic);

  // Hide completion elements
  hideCompletionScreen();

  // Show instruction screen
  showInstructionScreen();

  // Reset Show Answer button text
  updateAnswerButtonText('Show Answer');

  // Disable reset button initially
  updateResetButtonState();
}

// Clear existing static content
function clearExistingContent() {
  const sentenceBox = document.getElementById('para-sentence-box');
  if (sentenceBox) {
    sentenceBox.innerHTML = '';
  }

  const paraToc = document.getElementById('para-toc');
  if (paraToc) {
    paraToc.innerHTML = '';
  }

  const annotationToc = document.getElementById('Annotation-toc');
  if (annotationToc) {
    annotationToc.innerHTML = '';
    annotationToc.style.display = 'none';
  }

  const paraImage = document.getElementById('para-image');
  if (paraImage) {
    paraImage.innerHTML = '';
    paraImage.style.display = 'none';
  }

  const tocHighlights = document.getElementById('para-toc-highlights');
  if (tocHighlights) {
    tocHighlights.innerHTML = '';
    tocHighlights.style.display = 'none';
  }

  // Show next button with opacity
  const nextBtn = document.getElementById('Group_594-2');
  if (nextBtn) {
    nextBtn.style.display = 'block';
    nextBtn.style.opacity = '0.4';
    nextBtn.style.pointerEvents = 'none';
  }

  // Hide title
  const titleGroup = document.getElementById('para-title');
  if (titleGroup) {
    titleGroup.style.display = 'none';
  }

  // AGGRESSIVE: Hide all static topic groups from original SVG to prevent overlap
  const staticGroups = document.querySelectorAll('g[id^="The_"], g[id*="Taj_Mahal"], g[id*="Himalaya"], g[id*="Sun"], g[id*="Chocolate"], g[id*="Holi"], g[id*="Bee"], g[id*="Animal"], g[id*="School"], g[id*="Market"], g[id*="Sharing"], g[id*="Spring"], g[id*="Gifts"], g[id*="Decimal"]');
  staticGroups.forEach(g => g.style.display = 'none');
}

// Update topic title
function updateTopicTitle(title) {
  const titleGroup = document.getElementById('para-title');
  if (!titleGroup) return;

  titleGroup.innerHTML = '';

  // Hide title initially - will show when paragraph is complete
  titleGroup.style.display = 'none';

  const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
  text.setAttribute('transform', 'translate(854.73 238)');
  text.setAttribute('fill', '#181818');
  text.setAttribute('font-family', 'Roboto-Bold, Roboto');
  text.setAttribute('font-size', '30');
  text.setAttribute('font-weight', '700');
  text.textContent = title;

  titleGroup.appendChild(text);
}

// Create interactive sentence boxes
function createSentenceBoxes(topic) {
  const container = document.getElementById('para-sentence-box');
  if (!container) return;

  // Clear existing content
  container.innerHTML = '';

  // Shuffle sentence indices for random display
  const indices = topic.sentences.map((_, i) => i);
  const shuffled = shuffleArray([...indices]);

  // Create boxes for each sentence
  shuffled.forEach((sentenceIndex, displayIndex) => {
    const sentence = topic.sentences[sentenceIndex];
    const color = sentenceColors[displayIndex % sentenceColors.length];

    // Calculate position (vertical stack in left panel)
    const baseY = 186;
    const spacing = 15;
    let y = baseY;

    // Calculate height based on text length
    const estimatedLines = Math.ceil(sentence.length / 50);
    const height = Math.max(100, Math.min(188, 100 + estimatedLines * 20));

    // Add cumulative spacing for previous boxes
    for (let i = 0; i < displayIndex; i++) {
      const prevSentence = topic.sentences[shuffled[i]];
      const prevLines = Math.ceil(prevSentence.length / 50);
      const prevHeight = Math.max(100, Math.min(188, 100 + prevLines * 20));
      y += prevHeight + spacing;
    }

    const x = 84;
    const width = 499;

    // Create group for this sentence box
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute('class', 'sentence-box');
    g.setAttribute('data-sentence-index', sentenceIndex);
    g.style.cursor = 'pointer';

    // Create rectangle
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute('x', x);
    rect.setAttribute('y', y);
    rect.setAttribute('width', width);
    rect.setAttribute('height', height);
    rect.setAttribute('rx', 6);
    rect.setAttribute('ry', 6);
    rect.setAttribute('fill', color);
    rect.setAttribute('stroke', 'none');
    rect.setAttribute('stroke-width', 0);

    // Create text element with word wrapping
    const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    foreignObject.setAttribute('x', x + 10);
    foreignObject.setAttribute('y', y + 10);
    foreignObject.setAttribute('width', width - 20);
    foreignObject.setAttribute('height', height - 20);

    const div = document.createElement('div');
    div.style.fontSize = '22px';
    div.style.fontFamily = 'Roboto-Medium, Roboto';
    div.style.fontWeight = '500';
    div.style.color = '#181818';
    div.style.lineHeight = '1.5';
    div.style.display = 'flex';
    div.style.alignItems = 'center';
    div.style.height = '90%';
    div.style.border = '2px dashed white';
    div.style.padding = '0px';
    div.textContent = sentence;

    foreignObject.appendChild(div);
    g.appendChild(rect);
    g.appendChild(foreignObject);

    // Add click handler
    g.addEventListener('click', () => handleSentenceClick(sentenceIndex, g));

    container.appendChild(g);
  });
}

// Create paragraph slots (placeholder with instruction)
function createParagraphSlots(topic) {
  const container = document.getElementById('para-toc');
  if (!container) return;

  container.innerHTML = '';

  // Create foreignObject for instruction message
  const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreignObject.setAttribute('x', 661);
  foreignObject.setAttribute('y', 185);
  foreignObject.setAttribute('width', 745);
  foreignObject.setAttribute('height', 720);

  const div = document.createElement('div');
  div.style.fontSize = '28px';
  div.style.fontFamily = 'Roboto-Italic, Roboto';
  div.style.fontStyle = 'italic';
  div.style.lineHeight = '1.5';
  div.style.color = '#999';
  div.style.padding = '30px';
  div.style.paddingTop = '80px'; // Move text down to avoid overlap with header
  div.style.border = '3px dashed #fff';
  div.style.borderRadius = '18px';
  div.style.height = '100%';
  div.style.boxSizing = 'border-box';
  div.style.display = 'flex';
  div.style.alignItems = 'center';
  div.style.justifyContent = 'center';
  div.style.textAlign = 'center';
  //div.textContent = 'Arrange your paragraph here!';

  foreignObject.appendChild(div);
  container.appendChild(foreignObject);
}

// Handle sentence click
function handleSentenceClick(sentenceIndex, element) {
  if (isComplete) return;

  const topic = paragraphData[currentTopicIndex];
  const expectedPosition = userOrder.length;
  const correctIndex = topic.correctOrder[expectedPosition] - 1; // Convert to 0-indexed

  // Check if already used
  if (userOrder.includes(sentenceIndex)) {
    return;
  }

  if (sentenceIndex === correctIndex) {
    // Correct placement
    playSound('correct');
    userOrder.push(sentenceIndex);

    // Enable reset button when at least one sentence is selected
    updateResetButtonState();

    // Update UI
    markSentenceCorrect(element);

    // Build paragraph progressively after each correct sentence
    setTimeout(() => {
      buildParagraphProgressively();
    }, 200);
  } else {
    // Incorrect placement
    playSound('incorrect');
    showWrongFeedback(element);
  }
}

// Mark sentence as correct
function markSentenceCorrect(element) {
  element.classList.add('blurred');
  element.classList.add('correct');
  element.style.pointerEvents = 'none';
}


// Show wrong feedback
function showWrongFeedback(element) {
  const rect = element.querySelector('rect');

  // Red border
  rect.setAttribute('stroke', '#FF0000');
  rect.setAttribute('stroke-width', 5);

  // Shake animation
  element.style.animation = 'shake 0.5s';

  setTimeout(() => {
    rect.setAttribute('stroke', 'transparent');
    element.style.animation = '';
  }, 1000);
}

// Build paragraph progressively as user selects sentences
function buildParagraphProgressively() {
  const topic = paragraphData[currentTopicIndex];
  const container = document.getElementById('para-toc');
  if (!container) return;

  container.innerHTML = '';

  // Build paragraph text from sentences selected so far
  const selectedSentences = userOrder.map(index => topic.sentences[index]);
  const paragraphText = selectedSentences.join(' ');

  // Create foreignObject for paragraph
  const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreignObject.setAttribute('x', 661);
  foreignObject.setAttribute('y', 185);
  foreignObject.setAttribute('width', 745);
  foreignObject.setAttribute('height', 720);

  const div = document.createElement('div');
  div.style.fontSize = '26px';
  div.style.fontFamily = 'Roboto-Medium, Roboto';
  div.style.fontWeight = '500';
  div.style.lineHeight = '1.5';
  div.style.color = '#181818';
  div.style.padding = '30px';
  div.style.paddingTop = '50px';
  div.style.height = '100%';
  div.style.boxSizing = 'border-box';
  div.style.overflow = 'auto';
  div.style.display = 'flex';
  div.style.flexDirection = 'column';
  div.style.alignItems = 'center';

  const textDiv = document.createElement('div');
  textDiv.textContent = paragraphText;
  div.appendChild(textDiv);

  // If paragraph is complete, show title and clear left panel
  if (userOrder.length === topic.sentences.length) {
    // Clear left panel sentences after completion
    const sentenceBox = document.getElementById('para-sentence-box');
    if (sentenceBox) {
      sentenceBox.innerHTML = '';
    }

    // Auto-trigger completion screen and return early — do NOT render the plain paragraph below
    showCompletionScreen();
    return; // <-- CRITICAL: prevents the plain foreignObject from overwriting the highlighted completion view
  }


  foreignObject.appendChild(div);
  container.replaceChildren(foreignObject);
}


// Show completion screen
function showCompletionScreen() {
  isComplete = true;

  const topic = paragraphData[currentTopicIndex];

  // Show title when paragraph is complete and update its text
  const titleGroup = document.getElementById('para-title');
  if (titleGroup) {
    titleGroup.style.display = 'block';
    const textEl = titleGroup.querySelector('text');
    if (textEl) {
      textEl.innerHTML = `<tspan x="0" y="0" text-anchor="middle">${topic.topic}</tspan>`;
      // Re-center title in the middle panel
      textEl.setAttribute('transform', 'translate(1033.5 225)');
    }
  }

  // Hide sentence boxes and instruction
  const sentenceBoxContainer = document.getElementById('para-sentence-box');
  if (sentenceBoxContainer) {
    sentenceBoxContainer.style.display = 'none';
  }

  // Hide instruction text
  const iText = document.getElementById('i-text');
  if (iText) {
    iText.style.display = 'none';
  }

  // Show topic image (right panel)
  showTopicImage(topic.image);

  // Show complete paragraph with annotations (middle and left panels)
  showAnnotatedParagraph(topic);

  // Show NEXT or FINISH button
  showNavigationButton();
}

// Hide completion screen
function hideCompletionScreen() {
  const sentenceBoxContainer = document.getElementById('para-sentence-box');
  if (sentenceBoxContainer) {
    sentenceBoxContainer.style.display = 'block';
  }

  const imageContainer = document.getElementById('para-image');
  if (imageContainer) {
    imageContainer.style.display = 'none';
  }

  const arrowImg = document.getElementById('arrow-img');
  if (arrowImg) {
    arrowImg.style.display = 'none';
  }

  // Remove opacity from answer button when image is hidden
  const answerBtn = document.getElementById('answer-btn-text');
  if (answerBtn) {
    answerBtn.style.opacity = '1';
    answerBtn.style.pointerEvents = 'auto';

    // Also reset pointer-events on inner div
    const answerBtnDiv = answerBtn.querySelector('div');
    if (answerBtnDiv) {
      answerBtnDiv.style.pointerEvents = 'auto';
    }
  }

  // Reset pointer-events on the button group
  const buttonGroup = document.getElementById('Group_814');
  if (buttonGroup) {
    buttonGroup.style.pointerEvents = 'auto';
  }

  // Add opacity to next button when image is hidden
  const nextBtn = document.getElementById('Group_594-2');
  if (nextBtn) {
    nextBtn.style.opacity = '0.4';
    nextBtn.style.pointerEvents = 'none';
  }

  const annotationContainer = document.getElementById('para-toc-highlights');
  if (annotationContainer) {
    annotationContainer.style.display = 'none';
  }
}

// Show instruction screen
function showInstructionScreen() {
  // Show instruction text
  const iText = document.getElementById('i-text');
  if (iText) {
    iText.style.display = 'block';
  }
}

// Show topic image
function showTopicImage(imageName) {
  const imageContainer = document.getElementById('para-image');
  if (!imageContainer) return;

  imageContainer.style.display = 'block';
  imageContainer.innerHTML = '';

  const arrowImg = document.getElementById('arrow-img');
  if (arrowImg) {
    arrowImg.style.display = 'block';
  }

  // Add opacity to answer button when image is shown
  const answerBtn = document.getElementById('answer-btn-text');
  if (answerBtn) {
    answerBtn.style.opacity = '0.4';
    answerBtn.style.pointerEvents = 'none';

    // Also add pointer-events none to inner div
    const answerBtnDiv = answerBtn.querySelector('div');
    if (answerBtnDiv) {
      answerBtnDiv.style.pointerEvents = 'none';
    }
  }

  // Add pointer-events none to the button group itself
  const buttonGroup = document.getElementById('Group_814');
  if (buttonGroup) {
    buttonGroup.style.pointerEvents = 'none';
  }

  // Remove opacity from back button when image is shown
  const backBtn = document.getElementById('Group_594');
  if (backBtn) {
    backBtn.style.opacity = '1';
    backBtn.style.pointerEvents = 'auto';
  }

  // Remove opacity from next button when image is shown
  const nextBtn = document.getElementById('Group_594-2');
  if (nextBtn) {
    nextBtn.style.opacity = '1';
    nextBtn.style.pointerEvents = 'auto';
  }

  // Create image element using SVG image tag
  const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
  image.setAttribute('x', 1425);
  image.setAttribute('y', 334);
  image.setAttribute('width', 420);
  image.setAttribute('height', 420);
  image.setAttribute('href', `./assets/${imageName}`);
  image.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  imageContainer.appendChild(image);
}

// Show annotated paragraph
function showAnnotatedParagraph(topic) {
  const paraContainer = document.getElementById('para-toc');
  if (paraContainer) {
    paraContainer.innerHTML = '';
    showHighlightedParagraph(topic, paraContainer);
  }

  const annotationContainer = document.getElementById('para-toc-highlights');
  if (annotationContainer) {
    annotationContainer.style.display = 'block';
    showAnnotations(topic, annotationContainer);
  }
}

// Show highlighted paragraph in middle panel
function showHighlightedParagraph(topic, container) {
  const orderedSentences = topic.correctOrder.map(index => topic.sentences[index - 1]);
  const paragraphText = orderedSentences.join(' ');
  const highlightedHTML = getHighlightedParagraphHTML(topic, paragraphText);

  const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreignObject.setAttribute('x', 661);
  foreignObject.setAttribute('y', 185);
  foreignObject.setAttribute('width', 745);
  foreignObject.setAttribute('height', 720);

  const div = document.createElement('div');
  div.style.fontSize = '26px';
  div.style.fontFamily = 'Roboto-Medium, Roboto';
  div.style.fontWeight = '500';
  div.style.lineHeight = '1.5';
  div.style.color = '#181818';
  div.style.padding = '30px';
  div.style.paddingTop = '50px';
  div.style.height = '100%';
  div.style.boxSizing = 'border-box';
  div.style.overflow = 'auto';
  div.style.display = 'flex';
  div.style.flexDirection = 'column';
  div.style.alignItems = 'center';

  // Add paragraph with highlights
  const para = document.createElement('div');
  para.style.fontSize = '26px';
  para.style.fontFamily = 'Roboto-Medium, Roboto';
  para.style.fontWeight = '500';
  para.style.lineHeight = '1.5';
  para.innerHTML = highlightedHTML;
  div.appendChild(para);

  foreignObject.appendChild(div);
  container.replaceChildren(foreignObject);
  console.log('[WG85] foreignObject injected into para-toc. Children count:', container.children.length);
}


// Get highlighted paragraph HTML with color coding
function getHighlightedParagraphHTML(topic, paragraphText) {
  const colors = ['#FFFF00', '#FF00FF', '#00FFFF'];
  let html = paragraphText;

  // Process annotations: Yellow (0), Cyan (2), Pink (1) — layering order
  const annOrder = [0, 2, 1];

  annOrder.forEach(annIndex => {
    const ann = topic.annotations[annIndex];
    if (!ann || !ann.words) return;

    const phrases = Array.isArray(ann.words) ? ann.words : [ann.words];
    const color = colors[annIndex];

    phrases.forEach(phrase => {
      if (!phrase) return;
      const cleanPhrase = phrase.trim();
      const isShort = cleanPhrase.split(' ').length <= 3;
      const escapedPhrase = cleanPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

      let regex;
      if (isShort) {
        regex = new RegExp(`\\b(${escapedPhrase})[.,!?]?\\b`, 'gi');
      } else {
        regex = new RegExp(`(${escapedPhrase})`, 'gi');
      }

      html = html.replace(regex, `<span style="background: ${color}; padding: 0px 4px; border-radius: 4px;">$1</span>`);
    });
  });

  return html;
}




// Show annotations in left panel
function showAnnotations(topic, container) {
  container.innerHTML = '';

  // Color map
  const colors = ['#FFE066', '#FF9EE5', '#8AD8FF'];

  // Create foreignObject for annotations
  const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreignObject.setAttribute('x', 84);
  foreignObject.setAttribute('y', 186);
  foreignObject.setAttribute('width', 499);
  foreignObject.setAttribute('height', 808);

  const div = document.createElement('div');
  div.style.fontSize = '22px';
  div.style.fontFamily = 'Roboto-Bold, Roboto';
  div.style.fontWeight = '700';
  div.style.lineHeight = '1.4';
  div.style.color = '#181818';
  // div.style.background = '#FFF9E6';
  div.style.height = '100%';
  div.style.boxSizing = 'border-box';
  div.style.overflow = 'auto';

  // Add summary box
  const summaryBox = document.createElement('div');
  summaryBox.style.background = '#FFFACD';
  summaryBox.style.padding = '20px';
  summaryBox.style.borderRadius = '10px';
  summaryBox.style.marginBottom = '20px';
  summaryBox.style.padding = '30px';
  summaryBox.style.marginTop = '20px';
  summaryBox.style.borderTop = '1px solid #ddd';
  summaryBox.innerHTML = `
    <div style="font-size: 22px; color: #333; line-height: 1.4;">${topic.summary}</div>
  `;
  div.appendChild(summaryBox);

  // Add annotations with color boxes
  topic.annotations.forEach((ann, index) => {
    const annBox = document.createElement('div');
    annBox.style.marginBottom = '30px';
    annBox.style.display = 'flex';
    annBox.style.alignItems = 'flex-start';
    annBox.style.gap = '10px';

    // Color indicator
    const colorBox = document.createElement('div');
    colorBox.style.width = '30px';
    colorBox.style.height = '30px';
    colorBox.style.background = colors[index];
    colorBox.style.borderRadius = '4px';
    colorBox.style.flexShrink = '0';
    colorBox.style.marginTop = '5px';

    // Annotation text
    const textBox = document.createElement('div');
    textBox.style.flex = '1';
    textBox.style.color = '#181818';
    textBox.style.fontSize = '24px';
    textBox.style.fontFamily = 'Roboto-Regular, Roboto';
    textBox.style.fontWeight = '400';
    textBox.innerHTML = `${ann.text}`;

    annBox.appendChild(colorBox);
    annBox.appendChild(textBox);
    div.appendChild(annBox);
  });

  foreignObject.appendChild(div);
  container.appendChild(foreignObject);
}

// Show navigation button
function showNavigationButton() {
  const isLastTopic = currentTopicIndex === paragraphData.length - 1;
  const btnText = isLastTopic ? 'FINISH' : 'Next';

  // Use Group_594-2 as the Next button (it's positioned on the right)
  const nextBtn = document.getElementById('Group_594-2');
  if (nextBtn) {
    nextBtn.style.cursor = 'pointer';
    nextBtn.style.opacity = '1';
    nextBtn.style.pointerEvents = 'auto';

    // Update text if needed
    const textElement = nextBtn.querySelector('text');
    if (textElement) {
      textElement.textContent = btnText;
    }
  }
}

// Handle navigation click
function handleNavigationClick(e) {
  e.stopPropagation();

  const isLastTopic = currentTopicIndex === paragraphData.length - 1;

  if (isLastTopic) {
    // Show completion message
    alert('Congratulations! You have completed all paragraph building exercises!');
    currentTopicIndex = 0;
  } else {
    currentTopicIndex++;
  }

  // Reset next button opacity before loading next topic
  const nextBtn = document.getElementById('Group_594-2');
  if (nextBtn) {
    nextBtn.style.opacity = '0.4';
    nextBtn.style.pointerEvents = 'none';
  }

  loadTopic(currentTopicIndex);
}

// Setup event listeners
function setupEventListeners() {
  // Show Answer button
  const showAnswerBtn = document.getElementById('Group_814');
  if (showAnswerBtn) {
    showAnswerBtn.style.cursor = 'pointer';
    showAnswerBtn.addEventListener('click', handleShowAnswer);
  }

  // Show Answer button text (foreignObject)
  const answerBtnText = document.getElementById('answer-btn-text');
  if (answerBtnText) {
    answerBtnText.style.cursor = 'pointer';
    answerBtnText.addEventListener('click', handleShowAnswer);

    // Add click listener to inner div as well
    const answerBtnDiv = answerBtnText.querySelector('div');
    if (answerBtnDiv) {
      answerBtnDiv.style.cursor = 'pointer';
      answerBtnDiv.addEventListener('click', handleShowAnswer);
    }
  }

  // Reset button
  const resetBtn = document.getElementById('Group_829');
  if (resetBtn) {
    resetBtn.style.cursor = 'pointer';
    resetBtn.addEventListener('click', handleReset);
  }

  // Back button (Group_594)
  const backBtn = document.getElementById('Group_594');
  if (backBtn) {
    backBtn.style.cursor = 'pointer';
    backBtn.addEventListener('click', handleBackClick);
  }

  // Next button (Group_594-2) - initially with opacity 0.4
  const nextTopicBtn = document.getElementById('Group_594-2');
  if (nextTopicBtn) {
    nextTopicBtn.style.cursor = 'pointer';
    nextTopicBtn.style.opacity = '0.4';
    nextTopicBtn.style.pointerEvents = 'none';
    nextTopicBtn.addEventListener('click', handleNavigationClick);
  }
}

// Handle Back button click
function handleBackClick(e) {
  if (e) e.stopPropagation();

  // If we're on completion screen, go back to building screen
  if (isComplete) {
    hideCompletionScreen();

    // Show the built paragraph (not the completion view)
    buildParagraphProgressively();

    // Show sentence boxes again
    const sentenceBoxContainer = document.getElementById('para-sentence-box');
    if (sentenceBoxContainer) {
      sentenceBoxContainer.style.display = 'block';
    }

    // Show instruction text
    const iText = document.getElementById('i-text');
    if (iText) {
      iText.style.display = 'block';
    }

    // Add opacity to back and next buttons when going back to building stage
    const backBtn = document.getElementById('Group_594');
    if (backBtn) {
      backBtn.style.opacity = '0.4';
      backBtn.style.pointerEvents = 'none';
    }

    const nextBtn = document.getElementById('Group_594-2');
    if (nextBtn) {
      nextBtn.style.opacity = '0.4';
      nextBtn.style.pointerEvents = 'none';
    }

    isComplete = false;
    return;
  }

  // If building and have placed sentences, allow undoing last sentence
  if (userOrder.length > 0) {
    // Remove last placed sentence
    const lastIndex = userOrder[userOrder.length - 1];
    userOrder.pop();

    // Re-enable the sentence box
    const sentenceBox = document.querySelector(`.sentence-box[data-sentence-index="${lastIndex}"]`);
    if (sentenceBox) {
      sentenceBox.style.opacity = '1';
      sentenceBox.style.pointerEvents = 'auto';
      const rect = sentenceBox.querySelector('rect');
      if (rect) {
        const displayIndex = Array.from(document.querySelectorAll('.sentence-box')).indexOf(sentenceBox);
        const color = sentenceColors[displayIndex % sentenceColors.length];
        rect.setAttribute('fill', color);
        rect.setAttribute('stroke', 'none');
        rect.setAttribute('stroke-width', 0);
      }
    }

    // Rebuild paragraph with remaining sentences
    buildParagraphProgressively();

    // Update reset button state - disable if no sentences left
    updateResetButtonState();
    return;
  }

  // Otherwise, navigate to previous topic
  if (currentTopicIndex > 0) {
    currentTopicIndex--;
    loadTopic(currentTopicIndex);
  }

  // Update button visibility
  updateTopicNavigationButtons();
}

// Handle Next button click (for browsing topics, not completion)
function handleNextTopicClick(e) {
  if (e) e.stopPropagation();

  if (currentTopicIndex < paragraphData.length - 1) {
    currentTopicIndex++;
    loadTopic(currentTopicIndex);
  }

  // Update button visibility
  updateTopicNavigationButtons();
}

// Update topic navigation button visibility
function updateTopicNavigationButtons() {
  const backBtn = document.getElementById('Group_594');
  if (backBtn) {
    // Always enable back button so users can navigate backwards
    backBtn.style.opacity = '.4';
    backBtn.style.pointerEvents = 'auto';
  }

  // Don't show next button during normal play - only in completion screen
}

// Handle Show Answer
function handleShowAnswer() {
  const buttonText = document.getElementById('answer-btn-text');
  if (!buttonText) return;

  const textDiv = buttonText.querySelector('div');
  const currentText = textDiv ? textDiv.textContent.trim() : '';

  const topic = paragraphData[currentTopicIndex];

  if (currentText === 'Show Answer') {
    // If paragraph is already built or building, complete it
    while (userOrder.length < topic.sentences.length) {
      const position = userOrder.length;
      const correctIndex = topic.correctOrder[position] - 1;
      userOrder.push(correctIndex);

      const sentenceBox = document.querySelector(`.sentence-box[data-sentence-index="${correctIndex}"]`);
      if (sentenceBox) {
        markSentenceCorrect(sentenceBox);
      }
    }

    // Show completion screen which handles highlighted text and annotations
    setTimeout(() => {
      showCompletionScreen();
    }, 300);

    isAnswerShown = true;
    updateAnswerButtonText('Hide Answer');
  } else if (currentText === 'Hide Answer') {
    // Hide Answer - reset to initial state
    isAnswerShown = false;
    updateAnswerButtonText('Show Answer');
    loadTopic(currentTopicIndex);
  }
}


// Update Show Answer button text
function updateAnswerButtonText(text) {
  const buttonText = document.getElementById('answer-btn-text');
  if (buttonText) {
    const div = buttonText.querySelector('div');
    if (div) {
      div.textContent = text;
    } else {
      // If div not found, try to create/update it
      buttonText.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; height: 100%; font-size: 35px; font-weight: 500; color: #fff;">${text}</div>`;
    }
  }
}

// Update Reset button state based on whether sentences are selected
function updateResetButtonState() {
  const resetBtn = document.getElementById('Group_829');
  if (!resetBtn) return;

  if (userOrder.length > 0) {
    // Enable reset button when at least one sentence is selected
    resetBtn.style.opacity = '1';
    resetBtn.style.pointerEvents = 'auto';
  } else {
    // Disable reset button when no sentences are selected
    resetBtn.style.opacity = '0.4';
    resetBtn.style.pointerEvents = 'none';
  }
}

// Handle Reset
function handleReset() {
  if (isComplete) {
    // Hide completion screen and reload topic
    hideCompletionScreen();
  }

  loadTopic(currentTopicIndex);
}

// Utility: Shuffle array in-place
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Add shake animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
  }
`;
document.head.appendChild(style);
