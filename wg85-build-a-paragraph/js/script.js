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
      { text: "Interesting opening sentence that makes readers curious", type: "Annotation 1" },
      { text: "Linking words that connect ideas", type: "Annotation 2" },
      { text: "Concluding sentence", type: "Annotation 3" }
    ],
    summary: "All sentences on a single idea."
  },
  {
    id: 2,
    topic: "The Story of Chocolate",
    image: "chocolate.svg",
    sentences: [
      "Today, chocolate is enjoyed worldwide in candies, cakes, and ice cream, making it everyone's favourite treat!",
      "Chocolate comes from cocoa beans that grow on trees in hot countries.",
      "Ancient people in Mexico discovered cocoa and made a bitter drink from it.",
      "Later, sugar and milk were added to make it sweet."
    ],
    correctOrder: [2, 3, 4, 1],
    annotations: [
      { text: "Clear opening sentence that introduces the main topic", type: "Annotation 1" },
      { text: "Linking words showcasing the sequence of events", type: "Annotation 2" },
      { text: "A concluding sentence that summarises the present-day importance of chocolate", type: "Annotation 3" }
    ],
    summary: "All sentences focus on a single idea: the evolution of chocolate."
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
      { text: "An introductory sentence that describes the Sun", type: "Annotation 1" },
      { text: "Using words highlight the Sun's extraordinary qualities and importance", type: "Annotation 2" },
      { text: "The concluding line celebrates the Sun's magnificence", type: "Annotation 3" }
    ],
    summary: "The paragraph systematically presents the Sun's nature, significance, size, and energy."
  },
  {
    id: 4,
    topic: "The Mighty Himalayas",
    image: "himalaya.svg",
    sentences: [
      "Important rivers like the Ganga and Brahmaputra begin from Himalayan glaciers.",
      "The Himalayan mountain range stretches across northern India like a protective wall.",
      "Tourists visit hill stations like Shimla and Darjeeling during summer.",
      "The Himalayas are truly India's precious natural treasure.",
      "These peaks include Mount Everest, the world's tallest mountain."
    ],
    correctOrder: [2, 5, 1, 3, 4],
    annotations: [
      { text: "An opening sentence that helps readers visualise the Himalayas", type: "Annotation 1" },
      { text: "These words provide important facts about the Himalayas", type: "Annotation 2" },
      { text: "A concluding sentence that summarises the importance of the Himalayas", type: "Annotation 3" }
    ],
    summary: "Every sentence tells us about the Himalayan mountains."
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
      { text: "An opening sentence that introduces the main character and setting", type: "Annotation 1" },
      { text: "Words that connect the ideas and show the sequence of events in the story", type: "Annotation 2" },
      { text: "A concluding sentence that ends the story with humour", type: "Annotation 3" }
    ],
    summary: "The paragraph presents a light-hearted tale."
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
      { text: "An engaging introduction that makes the topic personal and relatable", type: "Annotation 1" },
      { text: "Link words that words indicate sequence of events for the day and feeling", type: "Annotation 2" },
      { text: "A concluding line that reflects on the overall experience", type: "Annotation 3" }
    ],
    summary: "The paragraph presents a complete narrative of the first day at school beginning to end."
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
      { text: "The opening line that introduces the main topic and explains his role", type: "Annotation 1" },
      { text: "Expressions that show the postman's daily routine and dedication", type: "Annotation 2" },
      { text: "A strong concluding sentence", type: "Annotation 3" }
    ],
    summary: "The paragraph presents accurately the postman's importance."
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
      { text: "An Introductory sentence that highlight the importance of the Taj Mahal", type: "Annotation 1" },
      { text: "Use of words that connect historical and descriptive details of the monument", type: "Annotation 2" },
      { text: "A concluding statement that reveals its everlasting virtue", type: "Annotation 3" }
    ],
    summary: "All the sentences describe the Taj Mahal as a global and magnificent beauty."
  },
  {
    id: 9,
    topic: "The Floating Egg Experiment",
    image: "floating-egg.svg",
    sentences: [
      "This happens because salt water becomes denser than the egg, pushing it upwards.",
      "In normal tap water, a fresh egg sinks to the bottom because it's denser than water.",
      "Similarly, swimming in the ocean is easier than in a pool due to the salty water.",
      "However, when you add salt and stir, the egg begins to float."
    ],
    correctOrder: [2, 4, 1, 3],
    annotations: [
      { text: "A sentence that introduces the main topic and explains what happens in normal water", type: "Annotation 1" },
      { text: "Linking word and phrase guiding us through the cause-and-effect relationship", type: "Annotation 2" },
      { text: "A concluding sentence that connects the experiment to a real-life example", type: "Annotation 3" }
    ],
    summary: "This paragraph explains how salt water makes objects float easily."
  },
  {
    id: 10,
    topic: "The Sleepiest Animal",
    image: "sleepiest-animal.svg",
    sentences: [
      "Eucalyptus leaves provide very little energy, so koalas conserve strength by resting most of the time.",
      "Surely, koalas have mastered the art of relaxation!",
      "Koalas hold the record for sleeping the longest, snoozing up to 22 hours daily!",
      "During their brief waking hours, they eat, groom, and climb to different branches."
    ],
    correctOrder: [3, 1, 4, 2],
    annotations: [
      { text: "The opening sentence that introduces koalas' amazing sleeping habit", type: "Annotation 1" },
      { text: "Expressions that explain why koalas sleep", type: "Annotation 2" },
      { text: "This concluding sentence summarises koalas' relaxed lifestyle with humour", type: "Annotation 3" }
    ],
    summary: "This paragraph explains why koalas sleep for very long hours"
  },
  {
    id: 11,
    topic: "The Joy of Sharing",
    image: "joy-sharing.svg",
    sentences: [
      "Even sharing our time by helping with homework shows we care",
      "Sharing is a wonderful habit that makes everyone happy.",
      "At school, sharing lunch or stationery with friends strengthens our friendship.",
      "Remember, happiness multiplies when shared, making it a true blessing.",
      "When we share toys, books, or clothes with someone in need, it brings them comfort."
    ],
    correctOrder: [2, 3, 5, 1, 4],
    annotations: [
      { text: "An opening sentence that establishes sharing as a valuable quality", type: "Annotation 1" },
      { text: "Use of words that connect various real-life contexts", type: "Annotation 2" },
      { text: "A sentence that shares thoughtful conclusion", type: "Annotation 3" }
    ],
    summary: "This paragraph explains how sharing makes everyone happy"
  },
  {
    id: 12,
    topic: "The Beautiful Spring Season",
    image: "spring-season.svg",
    sentences: [
      "Also, the weather becomes pleasant, neither too hot nor too cold. Moreover, colourful butterflies and busy bees fly from flower to flower.",
      "It also reminds us that new beginnings are always beautiful.",
      "Spring is my favourite season when nature comes alive with colours.",
      "Finally, spring fills our hearts with happiness.",
      "During this time, flowers bloom in gardens and trees grow fresh green leaves"
    ],
    correctOrder: [3, 5, 1, 4, 2],
    annotations: [
      { text: "A sentence that introduces the topic with enthusiasm", type: "Annotation 1" },
      { text: "Words that shows spring's emotional effect", type: "Annotation 2" },
      { text: "A concluding sentence that shares the deeper meaning of spring beautifully", type: "Annotation 3" }
    ],
    summary: "The paragraph celebrates spring's beauty."
  },
  {
    id: 13,
    topic: "Fruits Keep Us Healthy",
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
      { text: "An opening sentence that presents fruits as valuable natural resource", type: "Annotation 1" },
      { text: "Words that mention benefits of eating fruits", type: "Annotation 2" },
      { text: "A concluding sentence that emphasises on the benefit of eating fruits", type: "Annotation 3" }
    ],
    summary: "This paragraph explains why eating fruits daily keeps us healthy."
  },
  {
    id: 14,
    topic: "Understanding Decimals",
    image: "decimals.svg",
    sentences: [
      "The decimal point separates the whole number from the fractional part",
      "Decimals are a special way of writing numbers that are not whole.",
      "And so, learning decimals makes our daily tasks simpler and more precise.",
      "For instance, when we buy 1.5 kilograms of apples or measure height as 4.2 feet, we use decimals.",
      "Decimals make calculations easier than fractions, especially with money."
    ],
    correctOrder: [2, 4, 1, 5, 3],
    annotations: [
      { text: "A sentence that defines decimals", type: "Annotation 1" },
      { text: "Linking words/phrases that gives real-life decimal examples", type: "Annotation 2" },
      { text: "A concluding sentence highlighting importance of decimals", type: "Annotation 3" }
    ],
    summary: "This paragraph explains what decimals are and why they're useful."
  },
  {
    id: 15,
    topic: "The Festival of Colours",
    image: "festival-colours.svg",
    sentences: [
      "During this celebration, people wear old white clothes and play with bright coloured powders called gulal.",
      "Families prepare special sweets like gujiya and thandai to share with neighbours",
      "Indeed, Holi teaches us to celebrate life together with happiness.",
      "Holi is a joyful festival that marks the arrival of spring in India.",
      "Children and adults throw colours at each other, laughing and singing festive songs."
    ],
    correctOrder: [4, 1, 5, 2, 3],
    annotations: [
      { text: "An opening sentence that introduces Holi as a joyous occasion", type: "Annotation 1" },
      { text: "Key words that give an insight into the festival", type: "Annotation 2" },
      { text: "A concluding sentence that presents spirit of the festival", type: "Annotation 3" }
    ],
    summary: "This paragraph describes how people celebrate the colourful festival of Holi."
  }
];

// Global state
let currentTopicIndex = 0;
let userOrder = [];
let isComplete = false;
let audioContext;

// Color mapping for sentence boxes
const sentenceColors = ['#FFE066', '#FFB3D9', '#A8D5FF', '#B3F5BC', '#FFB366', '#D4B3FF'];

// Initialize widget
document.addEventListener("DOMContentLoaded", () => {
  initAudio();
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

  // Hide next button
  const nextBtn = document.getElementById('Group_594-2');
  if (nextBtn) {
    nextBtn.style.display = 'none';
  }

  // Hide title
  const titleGroup = document.getElementById('para-title');
  if (titleGroup) {
    titleGroup.style.display = 'none';
  }
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
    const height = Math.max(100, Math.min(188, 80 + estimatedLines * 20));

    // Add cumulative spacing for previous boxes
    for (let i = 0; i < displayIndex; i++) {
      const prevSentence = topic.sentences[shuffled[i]];
      const prevLines = Math.ceil(prevSentence.length / 50);
      const prevHeight = Math.max(100, Math.min(188, 80 + prevLines * 20));
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
    div.style.lineHeight = '1.3';
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
  div.style.lineHeight = '1.6';
  div.style.color = '#999';
  div.style.padding = '40px 30px';
  // div.style.background = '#FFFCD8';
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
  const rect = element.querySelector('rect');
  rect.setAttribute('fill', '#90EE90');
  rect.setAttribute('stroke', '#4CAF50');
  rect.setAttribute('stroke-width', 5);
  element.style.opacity = '0.6';
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
  foreignObject.setAttribute('y', 265);  // Start below title
  foreignObject.setAttribute('width', 745);
  foreignObject.setAttribute('height', 640);  // Adjusted height

  const div = document.createElement('div');
  div.style.fontSize = '26px';
  div.style.fontFamily = 'Roboto-Medium, Roboto';
  div.style.fontWeight = '500';
  div.style.lineHeight = '1.6';
  div.style.color = '#181818';
  div.style.padding = '30px';
  // div.style.background = '#FFFCD8';
  div.style.border = '3px dashed #fff';
  div.style.borderRadius = '18px';
  div.style.height = '100%';
  div.style.boxSizing = 'border-box';
  div.style.overflow = 'auto';
  div.textContent = paragraphText;

  // If paragraph is complete, make it clickable to show highlights and show title
  if (userOrder.length === topic.sentences.length) {
    div.style.cursor = 'pointer';
    div.addEventListener('click', () => {
      showCompletionScreen();
    });

    // Show title when paragraph is complete
    const titleGroup = document.getElementById('para-title');
    if (titleGroup) {
      titleGroup.style.display = 'block';
    }
  }

  foreignObject.appendChild(div);
  container.appendChild(foreignObject);
}

// Show completion screen
function showCompletionScreen() {
  isComplete = true;

  const topic = paragraphData[currentTopicIndex];

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
  // Clear and show para-toc for highlighted paragraph (middle panel)
  const paraContainer = document.getElementById('para-toc');
  if (paraContainer) {
    paraContainer.innerHTML = '';
    showHighlightedParagraph(topic, paraContainer);
  }

  // Show annotations on the left (using para-toc-highlights)
  const annotationContainer = document.getElementById('para-toc-highlights');
  if (annotationContainer) {
    annotationContainer.style.display = 'block';
    showAnnotations(topic, annotationContainer);
  }
}

// Show highlighted paragraph in middle panel
function showHighlightedParagraph(topic, container) {
  // Build complete paragraph with highlights
  const orderedSentences = topic.correctOrder.map(index => topic.sentences[index - 1]);
  const paragraphText = orderedSentences.join(' ');

  // Create foreignObject for paragraph
  const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  foreignObject.setAttribute('x', 661);
  foreignObject.setAttribute('y', 185);
  foreignObject.setAttribute('width', 745);
  foreignObject.setAttribute('height', 720);

  const div = document.createElement('div');
  div.style.fontSize = '26px';
  div.style.fontFamily = 'Roboto-Bold, Roboto';
  div.style.fontWeight = '700';
  div.style.lineHeight = '1.5';
  div.style.color = '#181818';
  //div.style.padding = '40px 30px';
  //div.style.background = '#FFFCD8';
  div.style.borderRadius = '18px';
  div.style.padding = '40px';
  div.style.height = '100%';
  div.style.boxSizing = 'border-box';
  div.style.overflow = 'auto';
  div.style.marginTop = '80px';

  // Add paragraph with highlights (no duplicate title)
  const para = document.createElement('p');
  para.style.fontSize = '26px';
  para.style.fontFamily = 'Roboto-Medium, Roboto';
  para.style.fontWeight = '500';
  para.style.lineHeight = '1.5';
  para.innerHTML = getHighlightedParagraphHTML(paragraphText);
  div.appendChild(para);

  foreignObject.appendChild(div);
  container.appendChild(foreignObject);
}

// Get highlighted paragraph HTML with color coding
function getHighlightedParagraphHTML(paragraphText) {
  // Color map for annotations
  const colors = ['#FFE066', '#FF9EE5', '#8AD8FF'];

  // Simple highlighting based on sentence positions
  let html = paragraphText;

  // Highlight key phrases based on annotations
  // Opening sentence
  const sentences = paragraphText.split('. ');
  if (sentences.length > 0) {
    const firstSentence = sentences[0] + '.';
    html = html.replace(firstSentence, `<span style="background: ${colors[0]}; padding: 2px 4px;">${firstSentence}</span>`);
  }

  // Middle sentences (linking words)
  const linkingWords = ['However', 'After', 'When', 'There', 'Besides', 'Later', 'Also', 'During', 'Similarly', 'For example', 'Therefore', 'Moreover', 'Finally', 'Indeed', 'Every second', 'Surprisingly', 'Eucalyptus', 'Ancient', 'Built by', 'Every year', 'In normal', 'Koalas hold'];
  linkingWords.forEach(word => {
    const regex = new RegExp(`(${word}[^.]*\\.)`, 'g');
    html = html.replace(regex, `<span style="background: ${colors[1]}; padding: 2px 4px;">$1</span>`);
  });

  // Concluding sentence (last sentence)
  if (sentences.length > 1) {
    const lastSentence = sentences[sentences.length - 1];
    if (lastSentence && !html.includes(`<span style="background: ${colors[2]}`)) {
      html = html.replace(lastSentence, `<span style="background: ${colors[2]}; padding: 2px 4px;">${lastSentence}</span>`);
    }
  }

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
  div.style.padding = '30px 24px';
  div.style.background = '#FFF9E6';
  div.style.borderRadius = '18px';
  div.style.height = '100%';
  div.style.boxSizing = 'border-box';
  div.style.overflow = 'auto';

  // Add summary box
  const summaryBox = document.createElement('div');
  summaryBox.style.background = '#FFFACD';
  summaryBox.style.padding = '20px';
  summaryBox.style.borderRadius = '10px';
  summaryBox.style.marginBottom = '20px';
  summaryBox.style.fontSize = '20px';
  summaryBox.innerHTML = `<strong>Summary:</strong><br/>${topic.summary}`;
  div.appendChild(summaryBox);

  // Add annotations with color boxes
  topic.annotations.forEach((ann, index) => {
    const annBox = document.createElement('div');
    annBox.style.marginBottom = '15px';
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
    textBox.style.fontSize = '18px';
    textBox.style.fontWeight = '500';
    textBox.innerHTML = `<strong>${ann.type}:</strong><br/>${ann.text}`;

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
    nextBtn.style.display = 'block';
    nextBtn.style.cursor = 'pointer';
    nextBtn.style.opacity = '1';
    nextBtn.style.pointerEvents = 'auto';

    // Update text if needed
    const textElement = nextBtn.querySelector('text');
    if (textElement) {
      textElement.textContent = btnText;
    }

    // Remove any existing click listeners and add new one
    const newBtn = nextBtn.cloneNode(true);
    nextBtn.parentNode.replaceChild(newBtn, nextBtn);
    newBtn.addEventListener('click', handleNavigationClick);
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

  // Hide next button before loading next topic
  const nextBtn = document.getElementById('Group_594-2');
  if (nextBtn) {
    nextBtn.style.display = 'none';
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

  // Next button (Group_594-2) - hidden by default, shown on completion
  const nextTopicBtn = document.getElementById('Group_594-2');
  if (nextTopicBtn) {
    nextTopicBtn.style.display = 'none';
  }
}

// Handle Back button click
function handleBackClick(e) {
  if (e) e.stopPropagation();

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
    backBtn.style.opacity = currentTopicIndex === 0 ? '0.3' : '1';
    backBtn.style.pointerEvents = currentTopicIndex === 0 ? 'none' : 'auto';
  }

  // Don't show next button during normal play - only in completion screen
}

// Handle Show Answer
function handleShowAnswer() {
  if (isComplete) return;

  const topic = paragraphData[currentTopicIndex];

  // Auto-fill remaining sentences in correct order
  while (userOrder.length < topic.sentences.length) {
    const position = userOrder.length;
    const correctIndex = topic.correctOrder[position] - 1;

    userOrder.push(correctIndex);

    // Find and mark the sentence box
    const sentenceBox = document.querySelector(`.sentence-box[data-sentence-index="${correctIndex}"]`);
    if (sentenceBox) {
      markSentenceCorrect(sentenceBox);
    }

  }

  // Show complete paragraph after Show Answer
  setTimeout(() => {
    buildParagraphProgressively();
  }, 500);
}

// Handle Reset
function handleReset() {
  if (isComplete) {
    // Hide completion screen and reload topic
    hideCompletionScreen();
  }

  loadTopic(currentTopicIndex);
}

// Utility: Shuffle array
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
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
