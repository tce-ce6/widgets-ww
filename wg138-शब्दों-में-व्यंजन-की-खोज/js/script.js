/**
 * WG136 Compound Words Adventure
 * Interactive SVG/HTML/JavaScript - all state and logic in single global object.
 * Interactions implemented by showing and hiding SVG elements only.
 */
(function () {
  'use strict';

  var WG136 = window.WG136 = window.WG136 || {};

  WG136.state = {
    currentFamily: null,
    completedFamilies: new Set(),
    elements: {},
    families: {
      sun: { discovered: [] },
      rain: { discovered: [] },
      snow: { discovered: [] },
      fire: { discovered: [] },
      sea: { discovered: [] },
      sand: { discovered: [] }
    },
    familyData: {
      sun: { name: 'SUN', correctIdx: [0, 3, 4, 5], distractorIdx: [1, 2] },
      rain: { name: 'RAIN', correctIdx: [0, 1, 2, 3], distractorIdx: [4, 5] },
      snow: { name: 'SNOW', correctIdx: [0, 2, 3, 4], distractorIdx: [1, 5] },
      fire: { name: 'FIRE', correctIdx: [1, 2, 3, 4], distractorIdx: [0, 5] },
      sea: { name: 'SEA', correctIdx: [0, 3, 4, 5], distractorIdx: [1, 2] },
      sand: { name: 'SAND', correctIdx: [0, 2, 4, 5], distractorIdx: [1, 3] }
    },
    /** Card slot IDs per family (6 options, order 0–5). Wireframe SVG structure. */
    cardIdsByFamily: {
      sun: ['Rectangle_46-7', 'Rectangle_742', 'Rectangle_743', 'Rectangle_744', 'Rectangle_745', 'Rectangle_746'],
      rain: ['Rectangle_46-8', 'Rectangle_742-2', 'Rectangle_743-2', 'Rectangle_744-2', 'Rectangle_745-2', 'Rectangle_746-2'],
      snow: ['Rectangle_46-9', 'Rectangle_742-3', 'Rectangle_743-3', 'Rectangle_744-3', 'Rectangle_745-3', 'Rectangle_746-3'],
      fire: ['Rectangle_46-10', 'Rectangle_742-4', 'Rectangle_743-4', 'Rectangle_744-4', 'Rectangle_745-4', 'Rectangle_746-4'],
      sea: ['Rectangle_46-11', 'Rectangle_742-5', 'Rectangle_743-5', 'Rectangle_744-5', 'Rectangle_745-5', 'Rectangle_746-5'],
      sand: ['Rectangle_46-12', 'Rectangle_742-6', 'Rectangle_743-6', 'Rectangle_744-6', 'Rectangle_745-6', 'Rectangle_746-6']
    },
    /** Center (cx,cy) of each of the 6 card slots and center card (for discovered row clones). */
    slotCenters: [
      { x: 616.5, y: 312.11 },
      { x: 378.5, y: 436.11 },
      { x: 377.5, y: 667.11 },
      { x: 616.5, y: 794.11 },
      { x: 855.5, y: 667.11 },
      { x: 854.5, y: 436.11 }
    ],
    centerCardCenter: { x: 616.5, y: 552.5 },
    HOME_MAPPINGS: {
      'Group_7999': 'sun',
      'Group_8000': 'snow',
      'Group_8001': 'rain',
      'Group_8002': 'sea',
      'Group_8003': 'fire',
      'Group_8004': 'sand'
    },
    isAnimating: false
  };

  WG136.WORD_MAPPINGS = {
    sun: { 0: 'sunflower', 3: 'sunglasses', 4: 'sunscreen', 5: 'sunlight' },
    rain: { 0: 'raincoat', 1: 'rainstorm', 2: 'rainbow', 3: 'raindrop' },
    snow: { 0: 'snowball', 2: 'snowflake', 3: 'snowsuit', 4: 'snowman' },
    fire: { 1: 'fireman', 2: 'fireplace', 3: 'firewood', 4: 'firefly' },
    sea: { 0: 'seafood', 3: 'seahorse', 4: 'seashell', 5: 'seaweed' },
    sand: { 0: 'sandpaper', 2: 'sandcastle', 4: 'sandstorm', 5: 'sandbox' }
  };

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = [
      '.wg136-interactive-card { transform-origin: center; cursor: pointer; }',
      '.wg136-interactive-card.wg136-used { visibility: hidden; pointer-events: none; }',
      '.wg136-interactive-card.wg136-wrong { animation: wg136-shake 0.4s; }',
      '@keyframes wg136-shake {',
      '  0% { transform: translateX(0); }',
      '  25% { transform: translateX(-12px); }',
      '  50% { transform: translateX(12px); }',
      '  75% { transform: translateX(-12px); }',
      '  100% { transform: translateX(0); }',
      '}',
      '.wg136-words-plus { font-family: "Roboto", sans-serif; }'
    ].join('\n');
    document.head.appendChild(style);
  }

  /** Get the 6 option card elements for a family (show/hide only, no reparenting). */
  function getCardElements(family) {
    var ids = WG136.state.cardIdsByFamily[family];
    if (!ids) return [];
    return ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);
  }

  function initGame() {
    injectStyles();

    Object.keys(WG136.state.HOME_MAPPINGS).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', function () {
          WG136.openFamily(WG136.state.HOME_MAPPINGS[id]);
        });
      }
    });

    var activityHome = document.getElementById('Group_1566');
    if (activityHome) {
      activityHome.style.cursor = 'pointer';
      activityHome.addEventListener('click', WG136.returnToMenu);
    }

    var activityBox = document.getElementById('activity-box');
    if (activityBox) {
      var wordsContainer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      wordsContainer.id = 'discovered-words-container';
      activityBox.appendChild(wordsContainer);
    }

    activityBox = document.getElementById('activity-box');
    if (activityBox) activityBox.style.display = 'none';

    ['sun', 'rain', 'snow', 'fire', 'sea', 'sand'].forEach(function (fam) {
      var el = document.getElementById(fam + '_family_assets');
      if (el) el.style.display = 'none';
    });

    bindAllCardClicks();
  }

  /** Bind click once to all 6 card slots per family (by SVG id). */
  function bindAllCardClicks() {
    var families = ['sun', 'rain', 'snow', 'fire', 'sea', 'sand'];
    families.forEach(function (family) {
      var cards = getCardElements(family);
      cards.forEach(function (card, idx) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function () {
          if (WG136.state.currentFamily !== family) return;
          handleOptionClick(family, idx);
        });
      });
    });
  }

  function openFamily(family) {
    if (WG136.state.isAnimating) return;
    WG136.state.currentFamily = family;

    var home = document.getElementById('home');
    if (home) home.style.display = 'none';

    ['sun', 'rain', 'snow', 'fire', 'sea', 'sand'].forEach(function (fam) {
      var el = document.getElementById(fam + '_family_assets');
      if (el) el.style.display = fam === family ? 'block' : 'none';
    });

    var box = document.getElementById('activity-box');
    if (box) box.style.display = 'block';

    var g = document.getElementById('Click_the_pictures_that_make_a_word_with_SUN_');
    if (g) {
      var texts = g.querySelectorAll('text');
      if (texts.length >= 2 && texts[1].querySelector('tspan')) {
        texts[1].querySelector('tspan').textContent = WG136.state.familyData[family].name;
      }
    }

    setCardVisibility(family);
    renderDiscoveredWords(family);
  }

  /** Show/hide card slots by family state (SVG show/hide only). */
  function setCardVisibility(family) {
    var discovered = WG136.state.families[family].discovered;
    var cards = getCardElements(family);
    cards.forEach(function (card, idx) {
      if (!card.classList.contains('wg136-interactive-card')) card.classList.add('wg136-interactive-card');
      card.classList.remove('wg136-wrong');
      if (discovered.indexOf(idx) !== -1) {
        card.classList.add('wg136-used');
        card.style.visibility = 'hidden';
        card.style.pointerEvents = 'none';
      } else {
        card.classList.remove('wg136-used');
        card.style.visibility = 'visible';
        card.style.pointerEvents = 'auto';
      }
      card.style.cursor = 'pointer';
    });
  }

  function handleOptionClick(family, idx) {
    if (WG136.state.isAnimating) return;

    var cards = getCardElements(family);
    var card = cards[idx];
    if (!card || card.classList.contains('wg136-used')) return;

    var isCorrect = WG136.state.familyData[family].correctIdx.indexOf(idx) !== -1;

    if (!isCorrect) {
      WG136.state.isAnimating = true;
      card.classList.add('wg136-wrong');
      setTimeout(function () {
        card.classList.remove('wg136-wrong');
        WG136.state.isAnimating = false;
      }, 400);
    } else {
      WG136.state.isAnimating = true;
      card.style.transition = 'opacity 0.6s';
      card.style.opacity = '0';
      card.style.pointerEvents = 'none';

      setTimeout(function () {
        card.classList.add('wg136-used');
        card.style.visibility = 'hidden';
        card.style.opacity = '';

        WG136.createConfetti();
        WG136.state.families[family].discovered.push(idx);
        renderDiscoveredWords(family);
        checkCompletion(family);
      }, 650);
    }
  }

  function renderDiscoveredWords(family) {
    var wordsContainer = document.getElementById('discovered-words-container');
    if (!wordsContainer) return;

    wordsContainer.innerHTML = '';
    var discovered = WG136.state.families[family].discovered;
    var wordMappings = WG136.WORD_MAPPINGS[family];
    var centerId = { sun: 'Rectangle_741', rain: 'Rectangle_741-2', snow: 'Rectangle_741-3', fire: 'Rectangle_741-4', sea: 'Rectangle_741-5', sand: 'Rectangle_741-6' }[family];
    var centerEl = document.getElementById(centerId);
    var cardIds = WG136.state.cardIdsByFamily[family];
    var centerC = WG136.state.centerCardCenter;
    var slotC = WG136.state.slotCenters;

    discovered.forEach(function (originalIdx, posIndex) {
      var wordX = 1060;
      var wordY = 320 + posIndex * 150;

      var rowGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');

      var bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bgRect.setAttribute('x', wordX - 10);
      bgRect.setAttribute('y', wordY - 60);
      bgRect.setAttribute('width', '580');
      bgRect.setAttribute('height', '120');
      bgRect.setAttribute('rx', '15');
      bgRect.setAttribute('fill', '#fff');
      bgRect.setAttribute('fill-opacity', '0.9');
      rowGroup.appendChild(bgRect);

      var familyWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      if (centerEl) {
        familyWrapper.setAttribute('transform', 'translate(' + (wordX + 40) + ',' + wordY + ') scale(0.25) translate(' + (-centerC.x) + ',' + (-centerC.y) + ')');
        var centerClone = centerEl.cloneNode(true);
        centerClone.style.visibility = 'visible';
        centerClone.style.opacity = '1';
        familyWrapper.appendChild(centerClone);
      }
      rowGroup.appendChild(familyWrapper);

      var plusSign = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      plusSign.setAttribute('x', wordX + 110);
      plusSign.setAttribute('y', wordY + 10);
      plusSign.setAttribute('font-size', '30');
      plusSign.setAttribute('fill', '#077077');
      plusSign.setAttribute('font-weight', 'bold');
      plusSign.setAttribute('text-anchor', 'middle');
      plusSign.setAttribute('class', 'wg136-words-plus');
      plusSign.textContent = '+';
      rowGroup.appendChild(plusSign);

      var optEl = document.getElementById(cardIds[originalIdx]);
      var pos = slotC[originalIdx];
      var optionWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      if (optEl && pos) {
        optionWrapper.setAttribute('transform', 'translate(' + (wordX + 180) + ',' + wordY + ') scale(0.25) translate(' + (-pos.x) + ',' + (-pos.y) + ')');
        var optClone = optEl.cloneNode(true);
        optClone.style.visibility = 'visible';
        optClone.style.opacity = '1';
        optClone.classList.remove('wg136-used', 'wg136-wrong');
        optionWrapper.appendChild(optClone);
      }
      rowGroup.appendChild(optionWrapper);

      var resultText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      resultText.setAttribute('x', wordX + 270);
      resultText.setAttribute('y', wordY + 10);
      resultText.setAttribute('font-size', '28');
      resultText.setAttribute('fill', '#077077');
      resultText.setAttribute('font-family', '"Roboto", sans-serif');
      resultText.setAttribute('font-weight', '500');
      resultText.setAttribute('class', 'wg136-words-plus');
      resultText.textContent = wordMappings[originalIdx] || '';
      rowGroup.appendChild(resultText);

      var resultIconWrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      if (optEl && pos) {
        resultIconWrapper.setAttribute('transform', 'translate(' + (wordX + 500) + ',' + wordY + ') scale(0.3) translate(' + (-pos.x) + ',' + (-pos.y) + ')');
        var iconClone = optEl.cloneNode(true);
        iconClone.style.visibility = 'visible';
        iconClone.style.opacity = '1';
        iconClone.classList.remove('wg136-used', 'wg136-wrong');
        resultIconWrapper.appendChild(iconClone);
      }
      rowGroup.appendChild(resultIconWrapper);

      wordsContainer.appendChild(rowGroup);
    });

    var tspanCount = document.querySelector('#_0_of_4 tspan');
    if (tspanCount) tspanCount.textContent = discovered.length + ' of 4';

    for (var i = 1; i <= 4; i++) {
      var ellipse = document.getElementById('Ellipse_' + i);
      if (ellipse) ellipse.setAttribute('fill', i <= discovered.length ? '#f6c248' : '#077077');
    }
  }

  function checkCompletion(family) {
    var discovered = WG136.state.families[family].discovered;
    if (discovered.length === 4) {
      WG136.state.completedFamilies.add(family);
      setTimeout(function () {
        if (WG136.state.completedFamilies.size === 6) {
          WG136.showPopupMsg('Congratulations!', "You've mastered all 24 compound words!", function () {
            WG136.resetGame();
          }, 'PLAY AGAIN');
        } else {
          WG136.showPopupMsg('Amazing!', 'You completed the ' + WG136.state.familyData[family].name + ' family!', function () {
            WG136.returnToMenu();
          });
        }
      }, 800);
    } else {
      WG136.state.isAnimating = false;
    }
  }

  function returnToMenu() {
    WG136.state.currentFamily = null;
    WG136.state.isAnimating = false;
    var box = document.getElementById('activity-box');
    if (box) box.style.display = 'none';

    ['sun', 'rain', 'snow', 'fire', 'sea', 'sand'].forEach(function (fam) {
      var el = document.getElementById(fam + '_family_assets');
      if (el) el.style.display = 'none';
    });

    var home = document.getElementById('home');
    if (home) home.style.display = 'block';
  }

  function resetGame() {
    ['sun', 'rain', 'snow', 'fire', 'sea', 'sand'].forEach(function (fam) {
      WG136.state.families[fam].discovered = [];
      var cards = getCardElements(fam);
      cards.forEach(function (card) {
        card.classList.remove('wg136-used', 'wg136-wrong');
        card.style.visibility = '';
        card.style.opacity = '';
        card.style.pointerEvents = '';
      });
    });
    WG136.state.completedFamilies.clear();
    WG136.state.currentFamily = null;
    WG136.state.isAnimating = false;
    WG136.returnToMenu();
  }

  function showPopupMsg(title, msg, onComplete, btnText) {
    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:2000;';
    var card = document.createElement('div');
    card.style.cssText = 'background:#fff;padding:40px 60px;border-radius:20px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.3);max-width:600px;';
    var emoji = document.createElement('div');
    emoji.textContent = title.indexOf('Amazing') !== -1 ? '\uD83C\uDF89' : '\uD83C\uDFC6';
    emoji.style.cssText = 'font-size:80px;margin-bottom:10px;';
    card.appendChild(emoji);
    var h2 = document.createElement('h2');
    h2.textContent = title;
    h2.style.cssText = 'color:#333;font-size:38px;margin:0 0 15px 0;font-family:"Roboto",sans-serif;';
    card.appendChild(h2);
    var p = document.createElement('p');
    p.textContent = msg;
    p.style.cssText = 'color:#666;font-size:26px;margin:0 0 35px 0;font-family:"Roboto",sans-serif;';
    card.appendChild(p);
    if (btnText) {
      var btn = document.createElement('button');
      btn.textContent = btnText;
      btn.style.cssText = 'padding:15px 40px;font-size:22px;font-weight:bold;background:#1e6bef;color:#fff;border:none;border-radius:30px;cursor:pointer;';
      btn.onclick = function () {
        overlay.remove();
        if (onComplete) onComplete();
      };
      card.appendChild(btn);
    } else {
      setTimeout(function () {
        overlay.style.transition = 'opacity 0.4s';
        overlay.style.opacity = '0';
        setTimeout(function () {
          overlay.remove();
          if (onComplete) onComplete();
        }, 400);
      }, 2200);
    }
    overlay.appendChild(card);
    var container = document.querySelector('.container');
    if (container) container.appendChild(overlay);
  }

  function createConfetti() {
    var colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
    var container = document.querySelector('.container');
    if (!container) return;
    for (var i = 0; i < 60; i++) {
      var confetti = document.createElement('div');
      confetti.style.cssText = 'position:absolute;width:' + (Math.random() < 0.5 ? 10 : 14) + 'px;height:' + (Math.random() < 0.5 ? 10 : 14) + 'px;';
      if (Math.random() < 0.5) confetti.style.borderRadius = '50%';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.top = '-20px';
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.zIndex = '1500';
      confetti.style.pointerEvents = 'none';
      container.appendChild(confetti);
      var duration = Math.random() * 1.5 + 1.5;
      var delay = Math.random() * 0.5;
      confetti.animate([
        { transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 },
        { transform: 'translate3d(' + (Math.random() * 200 - 100) + 'px, 100vh, 0) rotate(' + (Math.random() * 720) + 'deg)', opacity: 0 }
      ], {
        duration: duration * 1000,
        delay: delay * 1000,
        easing: 'cubic-bezier(.37,0,.63,1)',
        fill: 'forwards'
      });
      setTimeout(function (el) {
        if (el.parentNode) el.remove();
      }, (duration + delay) * 1000 + 100, confetti);
    }
  }

  WG136.injectStyles = injectStyles;
  WG136.getCardElements = getCardElements;
  WG136.initGame = initGame;
  WG136.openFamily = openFamily;
  WG136.setCardVisibility = setCardVisibility;
  WG136.returnToMenu = returnToMenu;
  WG136.resetGame = resetGame;
  WG136.showPopupMsg = showPopupMsg;
  WG136.createConfetti = createConfetti;

  document.addEventListener('DOMContentLoaded', function () {
    WG136.initGame();
  });
})();
