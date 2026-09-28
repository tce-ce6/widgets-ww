/**
 * Wild About Articles — a / an (en_en_01_wg181) | Clean Minimal Production Engine
 */
(() => {
  'use strict';

  const ANIMALS = [
    ['alpaca', 'Alpaca', 'an', 'alpaca-cam.svg', 'alpaca-photo.svg'],
    ['eagle', 'Eagle', 'an', 'eagle-cam.svg', 'eagle-photo.svg'],
    ['elephant', 'Elephant', 'an', 'elephant-cam.svg', 'elephant-photo.svg'],
    ['octopus', 'Octopus', 'an', 'octopus-camera.svg', 'octopus-photo.svg'],
    ['orangutan', 'Orangutan', 'an', 'orangutan-cam.svg', 'orangutan-photo.svg'],
    ['ostrich', 'Ostrich', 'an', 'ostrich-cam.svg', 'ostrich-photo.svg'],
    ['otter', 'Otter', 'an', 'otter-cam.svg', 'otter-photo.svg'],
    ['owl', 'Owl', 'an', 'owl-cam.svg', 'owl-photo.svg'],
    ['flamingo', 'Flamingo', 'a', 'flamingo-cam.svg', 'flamingo-photo.svg'],
    ['giraffe', 'Giraffe', 'a', 'giraffe-cam.svg', 'giraffe-photo.svg'],
    ['hippo', 'Hippopotamus', 'a', 'hippo-cam.svg', 'hippo-photo.svg'],
    ['hyena', 'Hyena', 'a', 'hyena-cam.svg', 'hyena-photo.svg'],
    ['kangaroo', 'Kangaroo', 'a', 'kangaroo-camera.svg', 'kangaroo-photo.svg'],
    ['lion', 'Lion', 'a', 'lion-cam.svg', 'lion-photo.svg'],
    ['panda', 'Panda', 'a', 'panda-cam.svg', 'panda-photo.svg'],
    ['penguin', 'Penguin', 'a', 'penguin-cam.svg', 'penguin-photo.svg'],
    ['rhino', 'Rhino', 'a', 'rhino-cam.svg', 'rhino-photo.svg'],
    ['snake', 'Snake', 'a', 'snake-cam.svg', 'snake-photo.svg'],
    ['tiger', 'Tiger', 'a', 'tiger-cam.svg', 'tiger-photo.svg'],
    ['zebra', 'Zebra', 'a', 'zebra-cam.svg', 'zebra-photo.svg']
  ].map(([id, name, article, cam, photo]) => ({ id, name, article, camSvg: `assets/${cam}`, photoSvg: `assets/${photo}` }));

  let deck = [], currentIndex = 0, isTransitioning = false;
  const $ = id => document.getElementById(id);
  const [sIntro, sGame, sComp, btnStart, btnReplay, btnA, btnAn, camImg, lens, flash, cText, cPill, aGrid, fGrid, audio] =
    ['screen-intro', 'screen-game', 'screen-completion', 'btn-start', 'btn-replay', 'btn-choice-a', 'btn-choice-an', 'animal-cam-img', 'lens-aperture', 'flash-overlay', 'counter-text', 'counter-pill', 'album-grid', 'final-album-grid', 'audio-shutter'].map($);

  const setScreen = name => {
    [sIntro, sGame, sComp].forEach(s => s.classList.remove('active'));
    $(`screen-${name}`).classList.add('active');
    cPill.classList.toggle('hidden', name === 'intro');
    if (name === 'completion') cText.textContent = '20/20 snapped';
  };

  const initEmptyAlbum = () => {
    aGrid.innerHTML = Array.from({ length: 20 }, (_, i) =>
      `<div class="album-slot" id="slot-${i}" data-index="${i}"><img src="assets/photo-back.svg" alt="Slot ${i + 1}" class="slot-back-img"></div>`
    ).join('');
  };

  const updateCounter = () => { cText.textContent = `${String(currentIndex).padStart(2, '0')}/20 snapped`; };

  const loadCurrentAnimal = () => {
    if (currentIndex >= deck.length) return showCompletionScreen();
    camImg.src = deck[currentIndex].camSvg;
    camImg.alt = `${deck[currentIndex].name} in viewfinder`;
    updateCounter();
  };

  const startZooVisit = () => {
    deck = [...ANIMALS].sort(() => Math.random() - 0.5);
    currentIndex = 0;
    isTransitioning = false;
    initEmptyAlbum();
    loadCurrentAnimal();
    setScreen('game');
  };

  const handleChoice = article => {
    if (isTransitioning || currentIndex >= deck.length) return;
    const cur = deck[currentIndex];
    if (article === cur.article) {
      isTransitioning = true;
      if (audio) { audio.currentTime = 0; audio.play().catch(() => {}); }
      flash.classList.remove('flash'); void flash.offsetWidth; flash.classList.add('flash');
      const slot = $(`slot-${currentIndex}`);
      if (slot) slot.innerHTML = `<div class="polaroid-card"><div class="polaroid-img-box"><img src="${cur.photoSvg}" alt="${cur.name}" class="polaroid-img"></div></div>`;
      setTimeout(() => {
        currentIndex++;
        updateCounter();
        if (currentIndex < deck.length) { loadCurrentAnimal(); isTransitioning = false; }
        else { setTimeout(() => { showCompletionScreen(); isTransitioning = false; }, 350); }
      }, 420);
    } else {
      lens.classList.remove('shake'); void lens.offsetWidth; lens.classList.add('shake');
      setTimeout(() => lens.classList.remove('shake'), 450);
    }
  };

  const showCompletionScreen = () => {
    setScreen('completion');
    fGrid.innerHTML = deck.map((a, i) => `<div class="album-slot"><div class="polaroid-card" style="animation-delay:${i * 0.02}s"><div class="polaroid-img-box"><img src="${a.photoSvg}" alt="${a.name}" class="polaroid-img"></div></div></div>`).join('');
  };

  btnStart.addEventListener('click', startZooVisit);
  btnReplay.addEventListener('click', startZooVisit);
  btnA.addEventListener('click', () => handleChoice('a'));
  btnAn.addEventListener('click', () => handleChoice('an'));
  window.addEventListener('keydown', e => {
    if (!sGame.classList.contains('active')) return;
    const k = e.key.toLowerCase();
    if (k === 'a') handleChoice('a'); else if (k === 'n') handleChoice('an');
  });

  initEmptyAlbum();
  window.__WIDGET2_API__ = {
    getDeck: () => deck,
    getCurrentIndex: () => currentIndex,
    getCurrentAnimal: () => deck[currentIndex],
    handleChoice,
    startZooVisit,
    showCompletionScreen,
    getScreen: () => sIntro.classList.contains('active') ? 'intro' : sGame.classList.contains('active') ? 'game' : sComp.classList.contains('active') ? 'completion' : 'unknown'
  };
})();
