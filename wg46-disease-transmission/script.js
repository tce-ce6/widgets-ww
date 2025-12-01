let simulations = {};
let animationFrames = {};
let simulationStates = {};

// const personEmojis = ['🧑', '👨', '👩', '🧒', '👦', '👧'];
// const vectorEmojis = ['🦟', '🪰'];
// const surfaceEmojis = ['🪑', '🚪', '📱', '⌨️'];
// const foodEmojis = ['🥤', '🍽️', '🥛', '🍲'];
const personImages = ['./assets/person1.svg', './assets/person2.svg', './assets/person3.svg', './assets/person4.svg', './assets/person5.svg'];
const vectorImages = ['./assets/vector1.png', './assets/vector2.png'];
const surfaceImages = ['./assets/surface1.png', './assets/surface2.png', './assets/surface3.png', './assets/surface4.png'];
const foodImages = ['./assets/food1.png', './assets/food2.png', './assets/food3.png', './assets/food4.png'];

function switchTab(tabName) {
  document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

  event.target.classList.add('active');
  document.getElementById(tabName).classList.add('active');

  if (!simulations[tabName]) {
    initializeSimulation(tabName);
  }
}

function toggleSimulation(type) {
  const button = document.getElementById(`${type}-start`);

  if (!simulationStates[type]) {
    simulationStates[type] = { running: false };
  }

  if (simulationStates[type].running) {
    // Pause simulation
    simulationStates[type].running = false;
    button.textContent = '▶ Start';
    button.classList.remove('pause-button');
    button.classList.add('start-button');
    if (animationFrames[type]) {
      cancelAnimationFrame(animationFrames[type]);
    }
  } else {
    // Start simulation
    simulationStates[type].running = true;
    button.textContent = '⏸ Pause';
    button.classList.remove('start-button');
    button.classList.add('pause-button');

    if (!simulations[type]) {
      initializeSimulation(type);
    } else {
      startAnimation(type);
    }
  }
}

function resetSimulation(type) {
  // Stop current animation
  if (animationFrames[type]) {
    cancelAnimationFrame(animationFrames[type]);
  }

  // Reset button state
  const button = document.getElementById(`${type}-start`);
  button.textContent = '▶ Start';
  button.classList.remove('pause-button');
  button.classList.add('start-button');

  // Reset simulation state
  simulationStates[type] = { running: false };

  // Reinitialize simulation
  initializeSimulation(type);
}

function initializeSimulation(type) {
  const sim = document.getElementById(`${type}-sim`);
  const densityElement = document.getElementById(`${type}-density`);

  if (!densityElement) {
    console.warn(`Density element with ID ${type}-density not found.`);
    return; // Exit the function if the element is missing
  }

  const densityValue = parseInt(densityElement.value);
  // Map 0,1,2 to 5,15,30
  const densityMap = [5, 15, 30];
  const density = densityMap[densityValue];

  sim.innerHTML = '';
  simulations[type] = { people: [], vectors: [], surfaces: [], particles: [] };

  // Create people
  for (let i = 0; i < density; i++) {
    const person = document.createElement('div');
    person.className = 'person ' + (i === 0 ? 'infected' : 'healthy');
    const img = document.createElement('img');
    img.src = personImages[Math.floor(Math.random() * personImages.length)];
    img.className = 'icon-img';
    person.appendChild(img);
    person.style.left = Math.random() * (sim.offsetWidth - 40) + 'px';
    person.style.top = Math.random() * (sim.offsetHeight - 40) + 'px';
    person.dataset.vx = (Math.random() - 0.5) * 2;
    person.dataset.vy = (Math.random() - 0.5) * 2;
    sim.appendChild(person);
    simulations[type].people.push(person);
  }

  // Ensure people are visible initially
  sim.style.display = 'block';

  // Add type-specific elements
  if (type === 'vector') {
    addVectors(type, sim);
  } else if (type === 'indirect') {
    addSurfaces(type, sim);
  } else if (type === 'food') {
    addFoodItems(type, sim);
  } else if (type === 'airborne') {
    addAirborneParticles(type, sim);
  }

  // Only start animation if simulation is running
  if (simulationStates[type] && simulationStates[type].running) {
    startAnimation(type);
  }

  updateStats(type);
}

function addVectors(type, sim) {
  const vectorValue = parseInt(document.getElementById('vector-population').value);
  // Map 0,1,2 to low/medium/high vector counts
  const vectorMap = [2, 5, 10];
  const vectorCount = vectorMap[vectorValue];
  for (let i = 0; i < vectorCount; i++) {
    const vector = document.createElement('div');
    vector.className = 'vector';
    vector.textContent = vectorEmojis[Math.floor(Math.random() * vectorEmojis.length)];
    vector.style.left = Math.random() * (sim.offsetWidth - 30) + 'px';
    vector.style.top = Math.random() * (sim.offsetHeight - 30) + 'px';
    vector.dataset.vx = (Math.random() - 0.5) * 4;
    vector.dataset.vy = (Math.random() - 0.5) * 4;
    sim.appendChild(vector);
    simulations[type].vectors.push(vector);
  }
}

function addSurfaces(type, sim) {
  const contaminationValue = parseInt(document.getElementById('indirect-contamination').value);
  // Always show 4 surfaces regardless of contamination level
  const surfaceCount = 4;

  // Visual class based on contamination level
  let visualClass = '';
  if (contaminationValue === 0) {
    visualClass = 'surface-low';
  } else if (contaminationValue === 1) {
    visualClass = 'surface-medium';
  } else {
    visualClass = 'surface-high';
  }

  // Fixed positions for the 4 objects
  const fixedPositions = [
    { left: '15%', top: '20%' },
    { left: '75%', top: '25%' },
    { left: '25%', top: '70%' },
    { left: '80%', top: '75%' }
  ];

  for (let i = 0; i < surfaceCount; i++) {
    const surface = document.createElement('div');
    surface.className = 'vector ' + visualClass;
    surface.textContent = surfaceEmojis[i]; // Use each emoji once
    surface.style.left = fixedPositions[i].left;
    surface.style.top = fixedPositions[i].top;
    surface.dataset.contaminated = 'true'; // Mark as contaminated
    sim.appendChild(surface);
    simulations[type].surfaces.push(surface);
  }
}

function addFoodItems(type, sim) {
  const sanitationValue = parseInt(document.getElementById('food-sanitation').value);
  // Always show 2 food items regardless of sanitation level
  const foodCount = 2;

  // Visual class based on sanitation level (inverse - low sanitation = high contamination)
  let visualClass = '';
  if (sanitationValue === 0) {
    visualClass = 'food-low'; // Low sanitation = high contamination (bright, pulsating)
  } else if (sanitationValue === 1) {
    visualClass = 'food-medium'; // Medium sanitation
  } else {
    visualClass = 'food-high'; // High sanitation = low contamination (faded, safe)
  }

  // Fixed positions for the 2 food/water objects
  const fixedPositions = [
    { left: '30%', top: '40%' },
    { left: '65%', top: '55%' }
  ];

  for (let i = 0; i < foodCount; i++) {
    const food = document.createElement('div');
    food.className = 'vector ' + visualClass;
    food.textContent = foodEmojis[i]; // Use first 2 emojis
    food.style.left = fixedPositions[i].left;
    food.style.top = fixedPositions[i].top;
    food.dataset.contaminated = 'true'; // Mark as contaminated
    sim.appendChild(food);
    simulations[type].surfaces.push(food);
  }
}

function addAirborneParticles(type, sim) {
  const ventilationValue = parseInt(document.getElementById('airborne-ventilation').value);
  // Map 0,1,2 to high/medium/low particle counts (inverse of ventilation quality)
  const particleMap = [40, 25, 15];
  const particleCount = particleMap[ventilationValue];

  // Add droplets and aerosols
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    const isDroplet = Math.random() > 0.5;
    particle.className = isDroplet ? 'droplet' : 'aerosol';

    particle.style.left = Math.random() * sim.offsetWidth + 'px';
    particle.style.top = Math.random() * sim.offsetHeight + 'px';
    particle.dataset.vx = (Math.random() - 0.5) * (isDroplet ? 1.5 : 2.5);
    particle.dataset.vy = (Math.random() - 0.5) * (isDroplet ? 1.5 : 2.5);

    sim.appendChild(particle);
    simulations[type].particles.push(particle);
  }
}

function startAnimation(type) {
  if (animationFrames[type]) {
    cancelAnimationFrame(animationFrames[type]);
  }

  function animate() {
    if (!simulationStates[type] || !simulationStates[type].running) {
      return;
    }

    const sim = document.getElementById(`${type}-sim`);
    const people = simulations[type].people;
    const vectors = simulations[type].vectors;
    const particles = simulations[type].particles || [];

    // Move people
    people.forEach(person => {
      let x = parseFloat(person.style.left);
      let y = parseFloat(person.style.top);
      let vx = parseFloat(person.dataset.vx);
      let vy = parseFloat(person.dataset.vy);

      x += vx;
      y += vy;

      if (x <= 0 || x >= sim.offsetWidth - 40) {
        vx = -vx;
        person.dataset.vx = vx;
      }
      if (y <= 0 || y >= sim.offsetHeight - 40) {
        vy = -vy;
        person.dataset.vy = vy;
      }

      person.style.left = x + 'px';
      person.style.top = y + 'px';
    });

    // Move vectors
    vectors.forEach(vector => {
      let x = parseFloat(vector.style.left);
      let y = parseFloat(vector.style.top);
      let vx = parseFloat(vector.dataset.vx);
      let vy = parseFloat(vector.dataset.vy);

      x += vx;
      y += vy;

      if (x <= 0 || x >= sim.offsetWidth - 30) {
        vx = -vx;
        vector.dataset.vx = vx;
      }
      if (y <= 0 || y >= sim.offsetHeight - 30) {
        vy = -vy;
        vector.dataset.vy = vy;
      }

      vector.style.left = x + 'px';
      vector.style.top = y + 'px';
    });

    // Move particles (for airborne)
    particles.forEach(particle => {
      let x = parseFloat(particle.style.left);
      let y = parseFloat(particle.style.top);
      let vx = parseFloat(particle.dataset.vx);
      let vy = parseFloat(particle.dataset.vy);

      // Add slight brownian motion for realism
      vx += (Math.random() - 0.5) * 0.3;
      vy += (Math.random() - 0.5) * 0.3;

      x += vx;
      y += vy;

      if (x <= 0 || x >= sim.offsetWidth - 6) {
        vx = -vx * 0.8;
        particle.dataset.vx = vx;
      }
      if (y <= 0 || y >= sim.offsetHeight - 6) {
        vy = -vy * 0.8;
        particle.dataset.vy = vy;
      }

      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
    });

    // Check for transmission
    checkTransmission(type);

    animationFrames[type] = requestAnimationFrame(animate);
  }

  animate();
}

function checkTransmission(type) {
  const people = simulations[type].people;
  const infected = people.filter(p => p.classList.contains('infected'));
  const healthy = people.filter(p => p.classList.contains('healthy'));

  if (healthy.length === 0) return;

  let transmissionProbability = 0;

  switch (type) {
    case 'direct':
      const contactValue = parseInt(document.getElementById('direct-contact').value);
      const contactMap = [0.003, 0.005, 0.008];
      transmissionProbability = contactMap[contactValue];
      break;
    case 'indirect':
      const contaminationValue = parseInt(document.getElementById('indirect-contamination').value);
      // Different transmission rates for low/medium/high contamination
      const contaminationMap = [0.002, 0.005, 0.010];
      const surfaceTransmissionRate = contaminationMap[contaminationValue];

      // Check contact with contaminated surfaces
      const surfaces = simulations[type].surfaces;
      healthy.forEach(healthyPerson => {
        surfaces.forEach(surface => {
          const distance = calculateDistance(healthyPerson, surface);

          if (distance < 40 && Math.random() < surfaceTransmissionRate) {
            healthyPerson.classList.remove('healthy');
            healthyPerson.classList.add('infected');
          }
        });
      });
      return; // Exit early for indirect transmission
    case 'airborne':
      const ventilationValue = parseInt(document.getElementById('airborne-ventilation').value);
      const ventilationMap = [0.008, 0.005, 0.003];
      transmissionProbability = ventilationMap[ventilationValue];
      break;
    case 'food':
      const sanitationValue = parseInt(document.getElementById('food-sanitation').value);
      // Inverse relationship: low sanitation = high contamination = fast transmission
      const sanitationMap = [0.012, 0.006, 0.002]; // Low/Medium/High sanitation
      const foodTransmissionRate = sanitationMap[sanitationValue];

      // Check contact with contaminated food/water
      const foodItems = simulations[type].surfaces;
      healthy.forEach(healthyPerson => {
        foodItems.forEach(food => {
          const distance = calculateDistance(healthyPerson, food);

          if (distance < 40 && Math.random() < foodTransmissionRate) {
            healthyPerson.classList.remove('healthy');
            healthyPerson.classList.add('infected');
          }
        });
      });
      return; // Exit early for food transmission
    case 'vector':
      const vectorValue = parseInt(document.getElementById('vector-population').value);
      const vectorMap = [0.003, 0.006, 0.009];
      transmissionProbability = vectorMap[vectorValue];
      break;
  }

  infected.forEach(infectedPerson => {
    healthy.forEach(healthyPerson => {
      const distance = calculateDistance(infectedPerson, healthyPerson);

      if (distance < 50 && Math.random() < transmissionProbability) {
        healthyPerson.classList.remove('healthy');
        healthyPerson.classList.add('infected');
      }
    });
  });
}

function calculateDistance(elem1, elem2) {
  const x1 = parseFloat(elem1.style.left);
  const y1 = parseFloat(elem1.style.top);
  const x2 = parseFloat(elem2.style.left);
  const y2 = parseFloat(elem2.style.top);

  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function updateStats(type) {
  // Keep internal tracking but don't display
  const people = simulations[type].people;
  const healthy = people.filter(p => p.classList.contains('healthy')).length;
  const infected = people.filter(p => p.classList.contains('infected')).length;
}

// Initialize all sliders
['direct', 'indirect', 'airborne', 'food', 'vector'].forEach(type => {
  const densitySlider = document.getElementById(`${type}-density`);

  if (densitySlider) { // Check if the element exists
    densitySlider.addEventListener('input', (e) => {
      resetSimulation(type);
    });
  } else {
    console.warn(`Element with ID ${type}-density not found.`);
  }

  let secondarySlider;
  switch (type) {
    case 'direct':
      secondarySlider = document.getElementById('direct-contact');
      break;
    case 'indirect':
      secondarySlider = document.getElementById('indirect-contamination');
      break;
    case 'airborne':
      secondarySlider = document.getElementById('airborne-ventilation');
      break;
    case 'food':
      secondarySlider = document.getElementById('food-sanitation');
      break;
    case 'vector':
      secondarySlider = document.getElementById('vector-population');
      break;
  }

  if (secondarySlider) { // Check if the secondary slider exists
    secondarySlider.addEventListener('input', (e) => {
      if (type === 'vector' || type === 'indirect' || type === 'food' || type === 'airborne') {
        resetSimulation(type);
      }
    });
  } else {
    console.warn(`Secondary slider for ${type} not found.`);
  }
});

// Update stats periodically (removed display but keep internal tracking)
setInterval(() => {
  Object.keys(simulations).forEach(type => {
    if (simulations[type] && simulationStates[type] && simulationStates[type].running) {
      updateStats(type);
    }
  });
}, 100);

// Initialize first tab
initializeSimulation('direct');

// slider js 
