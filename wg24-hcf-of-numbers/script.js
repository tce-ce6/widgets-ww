let challengeData = null;
let currentChallenge = null;
let shelfCount = 0;
let shelves = [];

document.addEventListener('DOMContentLoaded', async function () {
  // Load challenge data from JSON
  await loadChallengeData();

  // Get references to key elements
  const scrollContainer = document.querySelector('.scroll-container');
  const addShelfBtn = document.getElementById('btn-add');
  const removeShelfBtn = document.getElementById('btn-remove');
  const shelfCountDisplay = document.querySelector('#shelves-number-box text');
  const leftBgBackgroundTint = document.getElementById('left-bg-background-tint');

  // Clear the initial shelf from HTML
  scrollContainer.innerHTML = '';

  // Update shelf count display
  updateShelfCountDisplay();

  // Update challenge description
  updateChallengeDescription();

  // Update challenge labels
  updateChallengeLabels();

  // Update item icons
  await updateItemIcons();

  // Setup tab switching
  setupTabSwitching();

  // Add shelf button click handler
  if (addShelfBtn) {
    addShelfBtn.addEventListener('click', function () {
      shelfCount++;
      createNewShelf(shelfCount);
      updateShelfCountDisplay();
    });
  }

  // Remove shelf button click handler
  if (removeShelfBtn) {
    removeShelfBtn.addEventListener('click', function () {
      if (shelfCount > 0) {
        // Remove the last shelf
        const lastShelf = shelves.pop();
        if (lastShelf && lastShelf.elements.container) {
          lastShelf.elements.container.remove();
        }
        shelfCount--;
        updateShelfCountDisplay();
      }
    });
  }

  function updateShelfCountDisplay() {
    if (shelfCountDisplay) {
      shelfCountDisplay.textContent = shelfCount;
    }
  }
});

async function loadChallengeData() {
  try {
    const response = await fetch('data.json');
    challengeData = await response.json();

    // Get current challenge based on currentChallengeId
    const challengeId = challengeData.currentChallengeId || 1;
    currentChallenge = challengeData.challenges.find(c => c.id === challengeId);

    if (!currentChallenge) {
      console.error('Challenge not found');
      currentChallenge = challengeData.challenges[0]; // Fallback to first challenge
    }
  } catch (error) {
    console.error('Error loading challenge data:', error);
    // Fallback to default data
    currentChallenge = {
      item1: { name: "Science Books", bgColor: "#FFF8E3", borderColor: "#AF2D00", textColor: "#AF2D00" },
      item2: { name: "Math Books", bgColor: "#E4FFFC", borderColor: "#219393", textColor: "#104948" },
      containerName: "Shelf"
    };
  }
}

function updateChallengeDescription() {
  const descriptionElement = document.getElementById('challenge-description');
  if (descriptionElement && currentChallenge) {
    // Clear existing tspans
    descriptionElement.innerHTML = '';

    // Use descriptionLines if available, otherwise fall back to description
    const lines = currentChallenge.descriptionLines || [currentChallenge.description];

    // Create tspans for each line
    lines.forEach((line, index) => {
      const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      tspan.setAttribute('x', '297.577');

      // First line at y=255.17, second line at y=288.17 (33 pixels down)
      const yPos = 255.17 + (index * 33);
      tspan.setAttribute('y', yPos.toString());
      tspan.textContent = line;

      descriptionElement.appendChild(tspan);
    });
  }
}

function updateChallengeLabels() {
  if (!currentChallenge) return;

  // Update item1 label (Science Books / Chocolate Cookies / Red Roses)
  const item1LabelLeft = document.getElementById('item1-label-left');
  if (item1LabelLeft) {
    const tspan = item1LabelLeft.querySelector('tspan');
    if (tspan) tspan.textContent = currentChallenge.item1.name;
  }

  // Update item2 label (Math Books / Vanilla Cookies / Pink Tulips)
  const item2LabelLeft = document.getElementById('item2-label-left');
  if (item2LabelLeft) {
    const tspan = item2LabelLeft.querySelector('tspan');
    if (tspan) tspan.textContent = currentChallenge.item2.name;
  }

  // Update available items label (Available Books / Available Cookies / Available Flowers)
  const availableItemsLabel = document.getElementById('available-items-label');
  if (availableItemsLabel && currentChallenge.availableItemsLabel) {
    const tspan = availableItemsLabel.querySelector('tspan');
    if (tspan) tspan.textContent = currentChallenge.availableItemsLabel;
  }
}

async function updateItemIcons() {
  if (!currentChallenge) return;

  // Update item1 icons (Science Books / Chocolate Cookies / Red Roses)
  await renderItemGroup('science-book', currentChallenge.item1);

  // Update item2 icons (Math Books / Vanilla Cookies / Pink Tulips)
  await renderItemGroup('math-book', currentChallenge.item2);
}

async function renderItemGroup(containerId, itemData) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Clear existing items
  container.innerHTML = '';

  const total = itemData.total || 0;
  const icon = itemData.icon;

  // Determine positions based on container ID
  // Item 1 (top): x=184, y=433
  // Item 2 (bottom): x=270, y=706
  const isItem1 = containerId === 'science-book';
  const x = 160
  const y = isItem1 ? 423 : 696;
  const width = 720;
  const height = 200; // Approximate height based on shelf dimensions

  // If icon is an external SVG file, load it
  if (icon && icon.includes('.svg')) {
    try {
      const response = await fetch(icon);
      const svgText = await response.text();

      // Create foreignObject
      const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
      foreignObject.setAttribute('x', x);
      foreignObject.setAttribute('y', y);
      foreignObject.setAttribute('width', width);
      foreignObject.setAttribute('height', height);

      // Create container div
      const div = document.createElement('div');
      div.style.width = '100%';
      div.style.height = '100%';
      div.style.display = 'flex';
      div.style.flexWrap = 'wrap';
      div.style.justifyContent = 'center';
      div.style.alignContent = 'flex-start';
      div.style.gap = '5px'; // Small gap between items

      // Parse the SVG string once
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.querySelector('svg');

      if (svgElement) {
        // Ensure SVG scales correctly
        const svgELHeight = 60;
        console.log(itemData, "To identify the item")
        const svgELWidth = 55


        svgElement.setAttribute('width', svgELWidth);
        svgElement.setAttribute('height', svgELHeight);
        svgElement.style.display = 'block'; // Prevent inline spacing issues

        // Create items based on total
        for (let i = 0; i < total; i++) {
          const clone = svgElement.cloneNode(true);
          const iconDiv = document.createElement('div');
          iconDiv.appendChild(clone);
          div.appendChild(iconDiv);
        }
      }

      foreignObject.appendChild(div);
      container.appendChild(foreignObject);

    } catch (error) {
      console.error(`Error loading icon ${icon}:`, error);
    }
  }
}

function setupTabSwitching() {
  const tab1 = document.getElementById('tab-1');
  const tab2 = document.getElementById('tab-2');
  const tab3 = document.getElementById('tab-3');

  if (tab1) {
    tab1.style.cursor = 'pointer';
    tab1.addEventListener('click', () => switchChallenge(1));
  }

  if (tab2) {
    tab2.style.cursor = 'pointer';
    tab2.addEventListener('click', () => switchChallenge(2));
  }

  if (tab3) {
    tab3.style.cursor = 'pointer';
    tab3.addEventListener('click', () => switchChallenge(3));
  }

  // Update active tab styling
  updateActiveTab();
}

function updateActiveTab() {
  const tab1 = document.getElementById('tab-1');
  const tab2 = document.getElementById('tab-2');
  const tab3 = document.getElementById('tab-3');

  const cover1 = document.getElementById('tab-1-cover');
  const cover2 = document.getElementById('tab-2-cover');
  const cover3 = document.getElementById('tab-3-cover');

  // Reset all tabs to inactive color
  const inactiveColor = '#2C6AC9';
  const activeColor = '#ADE4FC';

  const borderColor = '#053378';

  if (tab1) {
    const tab1Path = tab1.querySelector('path');
    if (tab1Path) tab1Path.setAttribute('fill', currentChallenge.id === 1 ? activeColor : inactiveColor);
    if (cover1) cover1.setAttribute('fill', currentChallenge.id === 1 ? activeColor : borderColor);
  }

  if (tab2) {
    const tab2Path = tab2.querySelector('path');
    if (tab2Path) tab2Path.setAttribute('fill', currentChallenge.id === 2 ? activeColor : inactiveColor);
    if (cover2) cover2.setAttribute('fill', currentChallenge.id === 2 ? activeColor : borderColor);
  }

  if (tab3) {
    const tab3Path = tab3.querySelector('path');
    if (tab3Path) tab3Path.setAttribute('fill', currentChallenge.id === 3 ? activeColor : inactiveColor);
    if (cover3) cover3.setAttribute('fill', currentChallenge.id === 3 ? activeColor : borderColor);
  }
}

async function switchChallenge(challengeId) {
  // Update the current challenge
  currentChallenge = challengeData.challenges.find(c => c.id === challengeId);

  if (!currentChallenge) {
    console.error('Challenge not found');
    return;
  }

  // Clear all shelves
  const scrollContainer = document.querySelector('.scroll-container');
  scrollContainer.innerHTML = '';
  shelves = [];
  shelfCount = 0;

  // Update shelf count display
  const shelfCountDisplay = document.querySelector('#shelves-number-box text');
  if (shelfCountDisplay) {
    shelfCountDisplay.textContent = shelfCount;
  }

  // Update challenge description
  updateChallengeDescription();

  // Update challenge labels
  updateChallengeLabels();

  // Update item icons
  await updateItemIcons();

  // Update active tab styling
  updateActiveTab();
}

function createNewShelf(shelfNumber) {
  const scrollContainer = document.querySelector('.scroll-container');

  // Create new shelf div
  const newShelfDiv = document.createElement('div');
  newShelfDiv.style.marginBottom = '10px';
  newShelfDiv.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="705" height="162" viewBox="0 0 705 162" fill="none">
            <g id="Shelf-card-${shelfNumber}">
            <path id="Rectangle_30-${shelfNumber}" d="M687 0H18C8.05887 0 0 8.05887 0 18V144C0 153.941 8.05887 162 18 162H687C696.941 162 705 153.941 705 144V18C705 8.05887 696.941 0 687 0Z" fill="white"/>
            <g id="Shelf_${shelfNumber}">
            <g id="Group">
            <text id="Shelf-${shelfNumber}" fill="black" xml:space="preserve" style="white-space: pre" font-family="Roboto" font-size="22" font-weight="500" letter-spacing="0em"><tspan x="19" y="29.5195">${currentChallenge.containerName} ${shelfNumber}</tspan></text>
            </g>
            </g>
            <g id="item1-card-bg">
            <path id="Vector" d="M335.25 148H22.76C18.48 148 15.01 144.62 15.01 140.46V52.5302C15.01 48.3702 18.49 44.9902 22.76 44.9902H335.25C339.53 44.9902 343 48.3702 343 52.5302V140.46C343 144.62 339.52 148 335.25 148Z" fill="${currentChallenge.item1.bgColor}"/>
            <path id="Vector_2" d="M22.75 46C19.03 46 16 48.93 16 52.54V140.47C16 144.07 19.03 147.01 22.75 147.01H335.24C338.96 147.01 341.99 144.08 341.99 140.47V52.54C341.99 48.94 338.96 46 335.24 46H22.75ZM22.75 44H335.24C340.07 44 343.99 47.82 343.99 52.54V140.47C343.99 145.18 340.07 149.01 335.24 149.01H22.75C17.92 149.01 14 145.19 14 140.47V52.54C14 47.83 17.92 44 22.75 44Z" fill="${currentChallenge.item1.borderColor}"/>
            </g>
            <text id="item1-label-${shelfNumber}" fill="black" xml:space="preserve" style="white-space: pre" font-family="Roboto" font-size="22" font-weight="500" letter-spacing="0em"><tspan x="32" y="71.5195">${currentChallenge.item1.name}</tspan></text>
            <text 
  id="item1-count-${shelfNumber}" 
  fill="${currentChallenge.item1.textColor}"
  font-family="Roboto"
  font-size="60"
  font-weight="bold"
  text-anchor="middle"
>
  <tspan x="284.15" y="114.508">0</tspan>
</text>
            <path id="add-item1-bg" d="M166 85H44C37.3726 85 32 90.3726 32 97V123C32 129.627 37.3726 135 44 135H166C172.627 135 178 129.627 178 123V97C178 90.3726 172.627 85 166 85Z" fill="white"/>
            <g id="item1-remove-${shelfNumber}" style="cursor: pointer;">
            <path id="Rectangle_133-3" d="M44 85H82V135H44C37.37 135 32 129.63 32 123V97C32 90.37 37.37 85 44 85Z" fill="#2196F3"/>
            <g id="Group_1156-2">
            <g id="Path_1028-3">
            <path d="M68.7 109.99H45.28Z" fill="#2196F3"/>
            <path d="M68.7 109.99H45.28" stroke="white" stroke-width="4" stroke-linecap="round"/>
            </g>
            </g>
            </g>
            <g id="item1-add-${shelfNumber}" style="cursor: pointer;">
            <path id="Rectangle_134-3" d="M129 85H166C172.63 85 178 90.37 178 97V123C178 129.63 172.63 135 166 135H129V85Z" fill="#2196F3"/>
            <g id="Group_1157-2">
            <path id="Path_1027-2" d="M153.77 98.27V121.69" stroke="white" stroke-width="4" stroke-linecap="round"/>
            <path id="Path_1028-4" d="M165.48 109.99H142.06" stroke="white" stroke-width="4" stroke-linecap="round"/>
            </g>
            </g>
            <g id="item1-card">
           <text 
  id="item1-input-${shelfNumber}" 
  fill="black"
  font-family="Roboto"
  font-size="34"
  font-weight="bold"
  text-anchor="middle"
>
  <tspan x="106" y="120.621">0</tspan>
</text>
            <g id="item2-card-bg">
            <path id="Vector_3" d="M682.25 148H369.76C365.48 148 362.01 144.62 362.01 140.46V52.5302C362.01 48.3702 365.49 44.9902 369.76 44.9902H682.25C686.53 44.9902 690 48.3702 690 52.5302V140.46C690 144.62 686.52 148 682.25 148Z" fill="${currentChallenge.item2.bgColor}"/>
            <path id="Vector_4" d="M369.75 46C366.03 46 363 48.93 363 52.54V140.47C363 144.07 366.03 147.01 369.75 147.01H682.24C685.96 147.01 688.99 144.08 688.99 140.47V52.54C688.99 48.94 685.96 46 682.24 46H369.75ZM369.75 44H682.24C687.07 44 690.99 47.82 690.99 52.54V140.47C690.99 145.18 687.07 149.01 682.24 149.01H369.75C364.92 149.01 361 145.19 361 140.47V52.54C361 47.83 364.92 44 369.75 44Z" fill="${currentChallenge.item2.borderColor}"/>
            </g>
           <text 
  id="item2-count-${shelfNumber}" 
  fill="${currentChallenge.item2.textColor}"
  font-family="Roboto"
  font-size="60"
  font-weight="bold"
  text-anchor="middle"
>
  <tspan x="633.15" y="114.508">0</tspan>
</text>
            <path id="item2-add-bg" d="M513 85H391C384.373 85 379 90.3726 379 97V123C379 129.627 384.373 135 391 135H513C519.627 135 525 129.627 525 123V97C525 90.3726 519.627 85 513 85Z" fill="white"/>
            <g id="item2-remove-${shelfNumber}" style="cursor: pointer;">
            <path id="Rectangle_133-4" d="M391 85H429V135H391C384.37 135 379 129.63 379 123V97C379 90.37 384.37 85 391 85Z" fill="#2196F3"/>
            <g id="Group_1156-3">
            <g id="Path_1028-5">
            <path d="M415.7 109.99H392.28Z" fill="#2196F3"/>
            <path d="M415.7 109.99H392.28" stroke="white" stroke-width="4" stroke-linecap="round"/>
            </g>
            </g>
            </g>
            <g id="item2-add-${shelfNumber}" style="cursor: pointer;">
            <path id="Rectangle_134-4" d="M476 85H513C519.63 85 525 90.37 525 97V123C525 129.63 519.63 135 513 135H476V85Z" fill="#2196F3"/>
            <g id="Group_1157-3">
            <path id="Vector_5" d="M500.77 98.27V121.69M512.49 109.99H489.07" stroke="white" stroke-width="4" stroke-linecap="round"/>
            </g>
            </g>
          <text 
  id="item2-input-${shelfNumber}" 
  fill="black"
  font-family="Roboto"
  font-size="34"
  font-weight="bold"
  text-anchor="middle"
>
  <tspan x="452" y="120.621">0</tspan>
</text>
            <text id="item2-label-${shelfNumber}" fill="black" xml:space="preserve" style="white-space: pre" font-family="Roboto" font-size="22" font-weight="500" letter-spacing="0em"><tspan x="379" y="71.5195">${currentChallenge.item2.name}</tspan></text>
            </g>
            </g>
            </svg>
    `;

  scrollContainer.appendChild(newShelfDiv);

  // Create shelf object
  const newShelf = {
    id: shelfNumber,
    item1Count: 0,
    item2Count: 0,
    elements: {
      container: newShelfDiv,
      item1Count: newShelfDiv.querySelector(`#item1-count-${shelfNumber} tspan`),
      item2Count: newShelfDiv.querySelector(`#item2-count-${shelfNumber} tspan`),
      item1Input: newShelfDiv.querySelector(`#item1-input-${shelfNumber} tspan`),
      item2Input: newShelfDiv.querySelector(`#item2-input-${shelfNumber} tspan`),
      item1AddBtn: newShelfDiv.querySelector(`#item1-add-${shelfNumber}`),
      item1RemoveBtn: newShelfDiv.querySelector(`#item1-remove-${shelfNumber}`),
      item2AddBtn: newShelfDiv.querySelector(`#item2-add-${shelfNumber}`),
      item2RemoveBtn: newShelfDiv.querySelector(`#item2-remove-${shelfNumber}`)
    }
  };

  shelves.push(newShelf);
  attachShelfEventListeners(newShelf);

  return newShelf;
}

function attachShelfEventListeners(shelf) {
  // Item 1 add button
  shelf.elements.item1AddBtn.addEventListener('click', function () {
    shelf.item1Count++;
    updateShelfDisplay(shelf);
  });

  // Item 1 remove button
  shelf.elements.item1RemoveBtn.addEventListener('click', function () {
    if (shelf.item1Count > 0) {
      shelf.item1Count--;
      updateShelfDisplay(shelf);
    }
  });

  // Item 2 add button
  shelf.elements.item2AddBtn.addEventListener('click', function () {
    shelf.item2Count++;
    updateShelfDisplay(shelf);
  });

  // Item 2 remove button
  shelf.elements.item2RemoveBtn.addEventListener('click', function () {
    if (shelf.item2Count > 0) {
      shelf.item2Count--;
      updateShelfDisplay(shelf);
    }
  });
}

function updateShelfDisplay(shelf) {
  shelf.elements.item1Count.textContent = shelf.item1Count;
  shelf.elements.item2Count.textContent = shelf.item2Count;
  shelf.elements.item1Input.textContent = shelf.item1Count;
  shelf.elements.item2Input.textContent = shelf.item2Count;

  // Update the visual state of available items
  updateUsedItemVisuals();
}

// Find and attach button listeners
const resetBtn = document.getElementById('btn-reset');
if (resetBtn) {
  resetBtn.style.cursor = 'pointer';
  resetBtn.addEventListener('click', resetSimulation);
}

const checkAnswerBtn = document.getElementById('btn-check-answer');
if (checkAnswerBtn) {
  checkAnswerBtn.style.cursor = 'pointer';
  checkAnswerBtn.addEventListener('click', checkAnswer);
}

const showAnswerBtn = document.getElementById('btn-show-answer');
if (showAnswerBtn) {
  showAnswerBtn.style.cursor = 'pointer';
  showAnswerBtn.addEventListener('click', showAnswer);
}


function updateUsedItemVisuals() {
  if (!currentChallenge) return;

  // Calculate total used items
  let usedItem1 = 0;
  let usedItem2 = 0;

  shelves.forEach(shelf => {
    usedItem1 += shelf.item1Count;
    usedItem2 += shelf.item2Count;
  });

  // Function to apply styles to icons
  const styleIcons = (containerId, usedCount) => {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Access the icons inside foreignObject -> div -> div -> svg
    // The structure we built in renderItemGroup is foreignObject > div > div > svg (cloned)
    // We can just select all 'svg' elements within the container
    const icons = container.querySelectorAll('svg');

    icons.forEach((icon, index) => {
      // Logic: First 'usedCount' items are greyed out
      // Or last 'usedCount'? Usually "used" means taken from pile. 
      // User said: "increase number in shelf... three books will be greyed out".
      // Assuming simple 0 to usedCount-1 are greyed.
      if (index < usedCount) {
        icon.style.opacity = '0.3';
        icon.style.filter = 'grayscale(100%)';
      } else {
        icon.style.opacity = '1';
        icon.style.filter = 'none';
      }
    });
  };

  styleIcons('science-book', usedItem1);
  styleIcons('math-book', usedItem2);
}

function resetSimulation() {
  // Remove all shelves
  const scrollContainer = document.querySelector('.scroll-container');
  if (scrollContainer) scrollContainer.innerHTML = '';

  // Reset data
  shelves = [];
  shelfCount = 0;

  // Update shelf count display
  const shelfCountDisplay = document.querySelector('#shelves-number-box text');
  if (shelfCountDisplay) shelfCountDisplay.textContent = 0;

  // Reset visuals (gray styling)
  updateUsedItemVisuals();

  // Hide feedback message
  const feedbackMessage = document.getElementById('feedback-message');
  if (feedbackMessage) feedbackMessage.style.display = 'none';

  // Hide the black tint overlay
  const leftBgTint = document.getElementById('left-bg-tint');
  if (leftBgTint) leftBgTint.style.display = 'none';

  const solutionModal = document.getElementById('solution-modal');
  if (solutionModal) solutionModal.style.display = 'none';

  const leftBgBackgroundTint = document.getElementById('left-bg-background-tint');
  if (leftBgBackgroundTint) leftBgBackgroundTint.style.display = 'none';

  console.log("Simulation reset.");
}

function checkAnswer() {
  if (!currentChallenge) return;
  console.log("Checking answer...", currentChallenge);
  const feedbackMessage = document.getElementById('feedback-message');
  const feedbackText = document.getElementById('feedback-text');
  const feedbackContent = document.getElementById('feedback-content');
  const leftBgTint = document.getElementById('left-bg-tint');
  const leftBgBackgroundTint = document.getElementById('left-bg-background-tint');
  leftBgBackgroundTint.style.display = 'block';

  if (!feedbackMessage || !feedbackText || !feedbackContent || !leftBgTint) return;

  const answer = currentChallenge.answer;
  const hcf = answer.hcf;
  const item1Per = answer.item1PerContainer;
  const item2Per = answer.item2PerContainer;

  // Calculate total used items
  let usedItem1 = 0;
  let usedItem2 = 0;
  shelves.forEach(shelf => {
    usedItem1 += shelf.item1Count;
    usedItem2 += shelf.item2Count;
  });

  // Check if all items are placed
  const totalItem1 = currentChallenge.item1.total;
  const totalItem2 = currentChallenge.item2.total;

  let feedbackMessageText = '';
  let isCorrect = false;

  if (usedItem1 < totalItem1 || usedItem2 < totalItem2) {
    feedbackMessageText = "You need to place all items!";
    isCorrect = false;
  } else if (shelfCount !== hcf) {
    feedbackMessageText = `Incorrect. You used ${shelfCount} containers, but the answer requires ${hcf}.`;
    isCorrect = false;
  } else {
    // Check contents of each shelf
    let allCorrect = true;
    for (const shelf of shelves) {
      if (shelf.item1Count !== item1Per || shelf.item2Count !== item2Per) {
        allCorrect = false;
        break;
      }
    }

    if (allCorrect) {
      feedbackMessageText = currentChallenge.successMessage || `Perfect! Each ${currentChallenge.containerName.toLowerCase()} has ${item1Per} ${currentChallenge.item1.name} and ${item2Per} ${currentChallenge.item2.name}.`;
      isCorrect = true;
    } else {
      feedbackMessageText = `Incorrect distribution. Each container should have ${item1Per} ${currentChallenge.item1.name} and ${item2Per} ${currentChallenge.item2.name}.`;
      isCorrect = false;
    }
  }

  // Update feedback text
  feedbackText.textContent = feedbackMessageText;

  // Update styling based on correctness
  if (isCorrect) {
    feedbackContent.style.border = '4px dashed #66BB6A';
    feedbackText.style.color = '#2E7D32';
  } else {
    feedbackContent.style.border = '4px dashed #F44336';
    feedbackText.style.color = '#C62828';
  }

  // Show the feedback message
  feedbackMessage.style.display = 'block';

  // Show the black tint overlay
  leftBgTint.style.display = 'block';
}

function updateModalContent() {
  if (!currentChallenge || !currentChallenge.solution) return;

  const solution = currentChallenge.solution;
  const steps = solution.steps;

  // Extract data from steps array based on the pattern in data.json
  // steps[0]: Introduction text
  // steps[1]: Factors of item1
  // steps[2]: Factors of item2
  // steps[3]: Common factors
  // steps[4]: HCF = X
  // steps[5]: Answer: X containers
  // steps[6]: Each container will have...

  const modalIntroText = document.getElementById('modal-intro-text');
  const modalFactorsItem1 = document.getElementById('modal-factors-item1');
  const modalFactorsItem2 = document.getElementById('modal-factors-item2');
  const modalCommonFactors = document.getElementById('modal-common-factors');
  const modalHcf = document.getElementById('modal-hcf');
  const modalAnswer = document.getElementById('modal-answer');
  const modalAdditionalInfo = document.getElementById('modal-additional-info');

  if (modalIntroText && steps[0]) {
    modalIntroText.innerHTML = steps[0].replace(/Highest Common Factor \(HCF\)/g, '<strong>Highest Common Factor (HCF)</strong>');
  }

  if (modalFactorsItem1 && steps[1]) {
    const match1 = steps[1].match(/Factors of (\d+): (.+)/);
    if (match1) {
      modalFactorsItem1.innerHTML = `<strong>Factors of ${match1[1]}:</strong> ${match1[2]}`;
    }
  }

  if (modalFactorsItem2 && steps[2]) {
    const match2 = steps[2].match(/Factors of (\d+): (.+)/);
    if (match2) {
      modalFactorsItem2.innerHTML = `<strong>Factors of ${match2[1]}:</strong> ${match2[2]}`;
    }
  }

  if (modalCommonFactors && steps[3]) {
    const match3 = steps[3].match(/Common factors: (.+)/);
    if (match3) {
      modalCommonFactors.innerHTML = `<strong>Common factors:</strong> ${match3[1]}`;
    }
  }

  if (modalHcf && steps[4]) {
    modalHcf.textContent = steps[4]; // "HCF = X"
  }

  if (modalAnswer && steps[5]) {
    modalAnswer.textContent = steps[5]; // "Answer: X containers"
  }

  if (modalAdditionalInfo && steps[6]) {
    // Parse the additional info and make item names bold
    const text = steps[6];
    const regex = /(\d+)\s+(.+?)\s+and\s+(\d+)\s+(.+)/;
    const match = text.match(regex);

    if (match) {
      const count1 = match[1];
      const item1Name = match[2];
      const count2 = match[3];
      const item2Name = match[4];
      modalAdditionalInfo.innerHTML = `Each ${currentChallenge.containerName.toLowerCase()} will have <strong>${count1} ${item1Name}</strong> and <strong>${count2} ${item2Name}</strong>`;
    } else {
      modalAdditionalInfo.textContent = text;
    }
  }
}

function showAnswer() {
  if (!currentChallenge) return;

  const solutionModal = document.getElementById('solution-modal');
  const feedbackContainer = document.getElementById('feedback-container');

  if (!solutionModal) return;

  // Update modal content with current challenge data
  updateModalContent();

  // Show the modal
  solutionModal.style.display = 'block';

  // Hide feedback container when showing solution
  if (feedbackContainer) {
    feedbackContainer.style.display = 'none';
  }

  // Add event listener to close button
  const closeModalBtn = document.getElementById('close-modal');
  if (closeModalBtn) {
    closeModalBtn.onclick = function () {
      solutionModal.style.display = 'none';
      // Show feedback container again
      if (feedbackContainer) {
        feedbackContainer.style.display = 'block';
      }
    };
  }

  // Also allow clicking outside the modal content to close
  const modalOverlay = solutionModal.querySelector('div');
  if (modalOverlay) {
    modalOverlay.onclick = function (e) {
      // Only close if clicking the dark overlay, not the modal content
      if (e.target === modalOverlay) {
        solutionModal.style.display = 'none';
        // Show feedback container again
        if (feedbackContainer) {
          feedbackContainer.style.display = 'block';
        }
      }
    };
  }
}

// Expose functions to global scope
window.resetSimulation = resetSimulation;
window.checkAnswer = checkAnswer;
window.showAnswer = showAnswer;

