const QS = [
  {
    "stoneNo": 1,
    "q": "In most ancient dynasties, a prince's name revealed his father's identity. In this kingdom, hearing a prince's name would tell you his mother's name instead. What does this unusual naming tradition reveal about the society?",
    "opts": [
      "Women held significant status and influence",
      "Fathers were kept secret for safety",
      "Mothers chose the heir to the throne"
    ],
    "ans": 0,
    "info": "Gautamiputra Satakarni literally means 'son of Gautami'. His mother Gautami Balashri was powerful enough to donate land and carve royal inscriptions at Nashik."
  },
  {
    "stoneNo": 2,
    "q": "A queen whose husband has died performs a grand horse ritual that was traditionally reserved only for the most powerful kings. What does this act tell us about her position in the kingdom?",
    "opts": [
      "She was performing it as a religious obligation",
      "She wielded real political authority",
      "The kingdom had no male heirs left"
    ],
    "ans": 1,
    "info": "A Satavahana widow queen performed the ashvamedha yajna at the Naneghat caves near Pune — an extraordinary act of royal power for the era."
  },
  {
    "stoneNo": 3,
    "q": "Ancient coins found scattered across India — from the western coast of Gujarat all the way to the eastern coast of Andhra Pradesh — all bear the same dynasty's mark. What can historians conclude from this spread?",
    "opts": [
      "Coin collectors carried them across India",
      "The coins were used as religious offerings",
      "The kingdom had coast-to-coast trade reach"
    ],
    "ans": 2,
    "info": "Satavahana coins found from Gujarat to Andhra Pradesh prove their trade networks spanned India's entire width, connecting both coastlines."
  },
  {
    "stoneNo": 4,
    "q": "Several ancient coins show a detailed image of a two-masted sailing vessel. No king's face, no religious symbol — just a ship. Why would a ruler choose to put a ship on official currency instead of his own portrait?",
    "opts": [
      "The king personally loved sailing",
      "Maritime trade defined the kingdom's wealth",
      "Ships were considered sacred objects"
    ],
    "ans": 1,
    "info": "Ships on Satavahana coins reflect how central maritime trade was to their economy — it was their identity, not just an activity."
  },
  {
    "stoneNo": 5,
    "q": "A kingdom exports spices, textiles, sandalwood, gold-plated pearls, and ivory. In return, it imports glass and perfumed ointments. What does the nature of these imports tell us about the kingdom's own capabilities?",
    "opts": [
      "They had surplus wealth to spend on luxuries",
      "They lacked glassmaking and perfume technology",
      "Glass and perfume were considered sacred"
    ],
    "ans": 1,
    "info": "The Satavahanas imported glass and perfumed ointments from the Roman Empire — items they couldn't produce locally but could afford through booming exports."
  },
  {
    "stoneNo": 6,
    "q": "A kingdom's agriculture thrives in a fertile river delta, its ports buzz with international trade, and tolls on merchant caravans fill the royal treasury. Yet within a few centuries, it completely falls apart. How is that possible?",
    "opts": [
      "Trade profits attracted constant invasions from rival kingdoms",
      "Weak central control meant no one held the regions together",
      "Over-dependence on trade collapsed when Roman demand dropped"
    ],
    "ans": 1,
    "info": "The Satavahana Empire had every economic advantage — fertile rivers, booming ports, Roman trade. However, it fragmented in the 3rd century CE because weak central control left no one to hold the regions together."
  },
  {
    "stoneNo": 7,
    "q": "Cave inscriptions near Pune record a queen's generous donations given to priests, guests, workers, scholars, and monks of different faiths. What does this diversity of recipients reveal?",
    "opts": [
      "The kingdom supported multiple belief systems",
      "The queen was trying to buy political alliances",
      "Only wealthy people received royal donations"
    ],
    "ans": 0,
    "info": "The Naneghat cave inscriptions show a Satavahana queen donating to Vedic scholars, Jain monks, and Buddhist monks equally — true multi-faith patronage."
  },
  {
    "stoneNo": 8,
    "q": "A dynasty follows one particular deity devotedly, yet its kings regularly grant tax-free farmland to monks and scholars of completely different religions. Why would devout rulers fund rival belief systems?",
    "opts": [
      "Keeping religious groups dependent on royal land grants ensured their loyalty",
      "Supporting all faiths prevented religious conflicts that could destabilise the kingdom",
      "Land given to monks was infertile, so it cost the treasury nothing"
    ],
    "ans": 1,
    "info": "The Satavahana kings were devout followers of Vasudeva (Krishna), yet they granted tax-free agricultural land to Vedic scholars, Jain monks, and Buddhist monks alike — a deliberate policy of religious inclusion that kept diverse communities peaceful and the kingdom stable."
  },
  {
    "stoneNo": 9,
    "q": "Ancient inscriptions written in Brahmi script contain a few number symbols that look strikingly similar to the digits we use in classrooms today. What does this resemblance across two thousand years suggest?",
    "opts": [
      "Modern numerals trace their origin to India",
      "Europeans independently invented the same shapes",
      "The inscriptions were carved in modern times"
    ],
    "ans": 0,
    "info": "Numerals found in Satavahana-era Naneghat cave inscriptions are among the earliest evidence that our modern number system originated in India."
  },
  {
    "stoneNo": 10,
    "q": "This kingdom had not one but two famous capital cities at different times — one in the east and another further west. What does maintaining multiple capitals across a vast territory suggest about how they governed?",
    "opts": [
      "Both cities competed to be the real capital",
      "Power shifted as the empire's focus changed",
      "The first capital was destroyed by floods"
    ],
    "ans": 1,
    "info": "Amravati and Pratishthana (Paithan) served as Satavahana capitals at different periods, reflecting how the empire's centre of gravity shifted across the Deccan."
  },
  {
    "stoneNo": 11,
    "q": "A powerful queen donates land specifically to Buddhist monks and has a detailed inscription carved at Nashik to record it publicly. Why would a royal go through the trouble of permanently inscribing a donation in stone?",
    "opts": [
      "Stone was the only writing material available",
      "Buddhist monks demanded written proof",
      "To make the commitment permanent and public"
    ],
    "ans": 2,
    "info": "Gautami Balashri's Nashik inscription wasn't just a record — it was a public declaration of royal authority, religious patronage, and political influence carved to last centuries."
  },
  {
    "stoneNo": 12,
    "q": "For centuries, a fertile river system fed the kingdom's agriculture while coastal ports handled international trade. Then the empire's central authority weakened, and everything unravelled. Why would losing central control collapse an otherwise prosperous empire?",
    "opts": [
      "No one to coordinate regions, collect taxes, or defend borders",
      "The rivers changed course when the king lost power",
      "Trade partners refused to deal with a weak ruler"
    ],
    "ans": 0,
    "info": "The Satavahana Empire's disintegration in the 3rd century CE shows that economic prosperity without strong governance is like a ship without a rudder — it drifts and breaks apart."
  }
];

document.addEventListener('DOMContentLoaded', function () {
  var stormButton = document.getElementById('strom-btn');
  var homeButton = document.getElementById('home-btn');
  var introLayer = document.getElementById('intro-tos');
  var jengaBlocks = document.getElementById('jenga-blocks');
  var cholaBlocks = document.getElementById('chola-blocks');
  var questionPanel = document.getElementById('queation-options-default');
  var question = document.getElementById('question');
  var options = [
    document.getElementById('option-1'),
    document.getElementById('option-2'),
    document.getElementById('option-3')
  ];
  var feedback = document.getElementById('feedback-msg');
  var info = document.getElementById('info-msg');
  var infoText = info.querySelector('.text-wrapper');
  var nextStoneButton = document.getElementById('next-stone-btn');
  var numberBlocks = document.getElementById('number-blocks');
  var progressBlocks = [
    document.getElementById('prog-1'),
    document.getElementById('prog-2'),
    document.getElementById('prog-3')
  ];
  var summaryWrapper = document.getElementById('summary-wrapper');
  var summaryIncorrect = document.getElementById('summary-incorrect');
  var summaryHalfIncorrect = document.getElementById('summary-half-incorrect');
  var summaryCorrect = document.getElementById('summary-correct');
  var summaryHomeButton = document.getElementById('summary-home-btn');
  // lottie star container
  var starLottieFO = document.getElementById('star-lottie');
  var starLottieContainer = document.getElementById('lottie-wrapper');
  var starAnim = null;
  // collapse sound (placed in assets/audio)
  var collapseAudio = new Audio('assets/audio/collapse-audio.mp3');
  var maxWrongAnswers = 3;
  var completedQuestions = 0;
  var wrongAnswers = 0;
  var correctAnswers = 0;
  var totalQuestions = QS.length;
  var answeredStatus = {};
  var originalPositions = {};
  var activeStone = null;
  var hasAnswered = false;
  var summaryTimer = null;

  // save original filter for each block and set none initially
  try {
    document.querySelectorAll('[id$="-block"]').forEach(function (block) {
      var id = block.id;
      originalPositions[id] = originalPositions[id] || { parent: block.parentNode, nextSibling: block.nextSibling, display: block.style.display || '' };
      var attrFilter = block.getAttribute('filter');
      var styleFilter = block.style.filter;
      originalPositions[id].originalFilter = attrFilter || styleFilter || '';
      try { block.removeAttribute('filter'); } catch (e) {}
      block.style.filter = 'none';
    });
  } catch (e) {}

  function setOptionsLocked(locked) {
    options.forEach(function (option) {
      option.classList.toggle('is-locked', locked);
      option.style.cursor = locked ? 'default' : 'pointer';
    });
  }

  function hideAllBlockText() {
    try {
      document.querySelectorAll('#block-text').forEach(function (el) {
        el.style.display = 'none';
      });
    } catch (e) {}
  }

  function restoreAllBlockText() {
    try {
      document.querySelectorAll('#block-text').forEach(function (el) {
        el.style.display = '';
      });
    } catch (e) {}
  }

  function applyBlockFilter(stoneNo) {
    try {
      var id = stoneNo + '-block';
      var block = document.getElementById(id);
      if (!block) return;
      block.classList.add('is-selected');
      var pos = originalPositions[id] || {};
      var orig = pos.originalFilter || '';
      if (!orig) return;
      if (orig.indexOf && orig.indexOf('url(') === 0) {
        block.setAttribute('filter', orig);
        block.style.filter = '';
      } else {
        try { block.removeAttribute('filter'); } catch (e) {}
        block.style.filter = orig;
      }
    } catch (e) {}
  }

  function removeFilterForBlock(stoneNo) {
    try {
      var id = stoneNo + '-block';
      var block = document.getElementById(id);
      if (!block) return;
      block.classList.remove('is-selected');
      try { block.removeAttribute('filter'); } catch (e) {}
      block.style.filter = 'none';
    } catch (e) {}
  }

  function openQuestion(stoneNo) {
    var questionData = QS.find(function (item) {
      return item.stoneNo === stoneNo;
    });

    if (wrongAnswers >= maxWrongAnswers || !questionData || activeStone || document.getElementById(stoneNo + '-block').classList.contains('is-disabled')) {
      return;
    }

      activeStone = { number: stoneNo, data: questionData };
      hasAnswered = false;
      cholaBlocks.style.transform = 'translateX(-500px)';
      cholaBlocks.style.pointerEvents = 'none';
      questionPanel.style.display = 'block';
      question.textContent = questionData.q;
      options.forEach(function (option, index) {
        option.textContent = questionData.opts[index];
        option.style.backgroundColor = '';
        option.classList.remove('is-correct', 'is-incorrect');
      });
      feedback.style.display = 'none';
      feedback.textContent = '';
      info.style.display = 'none';
      infoText.textContent = questionData.info;
      nextStoneButton.style.display = 'none';
      nextStoneButton.classList.remove('is-disabled');
      nextStoneButton.style.pointerEvents = '';
      nextStoneButton.removeAttribute('aria-disabled');
      setOptionsLocked(false);
      // apply the block's original filter when question opens
      applyBlockFilter(stoneNo);
  }

  function disableBlock(stoneNo) {
    var completedBlock = document.getElementById(stoneNo + '-block');
    if (!completedBlock) {
      return;
    }
    completedBlock.classList.add('is-disabled');
    completedBlock.style.cursor = 'not-allowed';
    completedBlock.style.pointerEvents = 'none';
    // remove selection overlay and filter when disabling
    try { restoreBlockSelection(stoneNo); } catch (e) {}
    try { removeFilterForBlock(stoneNo); } catch (e) {}
  }

  function disableAllBlocks() {
    document.querySelectorAll('[id$="-block"]').forEach(function (block) {
      block.classList.add('is-disabled');
      block.style.cursor = 'not-allowed';
      block.style.pointerEvents = 'none';
    });
  }

  function collapseRemainingBlocks() {
    var baseGroup = document.getElementById('Group_813');
    if (!baseGroup) {
      return Promise.resolve();
    }

    var baseBox = baseGroup.getBBox();
    var baseX = baseBox.x + baseBox.width / 2;
    var baseY = baseBox.y - 20; // starting y above the base

    var allBlocks = Array.from(document.querySelectorAll('[id$="-block"]'));
    var flagEl = document.getElementById('flag');

    var toCollapse = [];
    // hide clicked blocks (they were left in background); save their state
    allBlocks.forEach(function (block) {
      var stoneNo = parseInt(block.id, 10);
      if (answeredStatus.hasOwnProperty(stoneNo)) {
        // save original display and parent for reset
        originalPositions[block.id] = {
          parent: block.parentNode,
          nextSibling: block.nextSibling,
          display: block.style.display || ''
        };
        block.style.display = 'none';
        return;
      }
      toCollapse.push(block);
    });

    if (flagEl) {
      originalPositions['flag'] = {
        parent: flagEl.parentNode,
        nextSibling: flagEl.nextSibling,
        display: flagEl.style.display || ''
      };
      toCollapse.push(flagEl);
    }

    // play collapse audio (ignore errors if playback blocked)
    try {
      collapseAudio.currentTime = 0;
      collapseAudio.play();
    } catch (e) {
      // playback may be blocked until user interaction
    }

    var transitions = [];
    toCollapse.forEach(function (block, idx) {
      // save original DOM position for reset
      if (!originalPositions[block.id]) {
        originalPositions[block.id] = {
          parent: block.parentNode,
          nextSibling: block.nextSibling,
          display: block.style.display || ''
        };
      }

      // hide any block text inside this block (id="block-text") so pile shows only shapes
      try {
        var textEl = block.querySelector('#block-text');
        if (textEl) {
          originalPositions[block.id] = originalPositions[block.id] || { parent: block.parentNode, nextSibling: block.nextSibling, display: block.style.display || '' };
          originalPositions[block.id].labelDisplay = textEl.style.display || '';
          textEl.style.display = 'none';
        }
      } catch (e) {}

      // ensure block is rendered on top of baseGroup
      if (cholaBlocks && cholaBlocks.appendChild) cholaBlocks.appendChild(block);

      var blockBox = block.getBBox();
      // Remove any disabled/faded appearance for the collapsed pile
      block.classList.remove('is-disabled');
      block.style.cursor = '';
      block.style.opacity = '';
      block.style.display = '';

      // Arrange collapsed blocks in rows of three: left / center / right
      var col = idx % 3; // 0:left,1:center,2:right
      var row = Math.floor(idx / 3);
      var xOffset;
      if (col === 0) {
        xOffset = -60 - Math.random() * 20; // left cluster (-80 to -60)
      } else if (col === 1) {
        xOffset = -10 + Math.random() * 20; // center cluster (-10 to +10)
      } else {
        xOffset = 60 + Math.random() * 20; // right cluster (60 to 80)
      }
      var yOffset = -(row * 30) - 10; // rows stacked by 30px
      var currentX = blockBox.x + blockBox.width / 2;
      var currentY = blockBox.y + blockBox.height / 2;
      var finalTranslateX = (baseX + xOffset) - currentX;
      var finalTranslateY = (baseY + yOffset) - currentY;
      var rotate = (Math.random() - 0.5) * 6;

      block.style.transformOrigin = 'center';
      block.style.transition = 'transform 3.5s cubic-bezier(0.22, 1, 0.36, 1)';
      block.style.transform = 'translate(0px,0px) rotate(0deg)';
      // force style flush so the transition will animate from the starting transform
      block.getBoundingClientRect();
      block.style.transform = 'translate(' + finalTranslateX + 'px,' + finalTranslateY + 'px) rotate(' + rotate + 'deg)';
      block.style.pointerEvents = 'none';

      transitions.push(new Promise(function (resolve) {
        var handler = function (event) {
          if (event.propertyName === 'transform') {
            block.removeEventListener('transitionend', handler);
            resolve();
          }
        };
        block.addEventListener('transitionend', handler);
      }));
    });

    return Promise.all(transitions);
  }

  function showGameBoard() {
    introLayer.style.display = 'none';
    jengaBlocks.style.display = 'block';
    cholaBlocks.style.display = 'block';
  }

  function hideSummary() {
    if (summaryWrapper) {
      summaryWrapper.style.display = 'none';
    }
    if (summaryIncorrect) {
      summaryIncorrect.style.display = 'none';
    }
    if (summaryHalfIncorrect) {
      summaryHalfIncorrect.style.display = 'none';
    }
    if (summaryCorrect) {
      summaryCorrect.style.display = 'none';
    }
  }

  function showSummary() {
    if (!summaryWrapper || !summaryIncorrect || !summaryHalfIncorrect || !summaryCorrect) {
      return;
    }

    introLayer.style.display = 'none';
    questionPanel.style.display = 'none';
    feedback.style.display = 'none';
    info.style.display = 'none';
    nextStoneButton.style.display = 'none';
    summaryWrapper.style.display = 'block';
    // play appropriate lottie animation at summary:
    // - sad.json when game over (3+ wrong)
    // - stars.json for all other summary cases (including 0,1,2 wrong)
    try {
      if (wrongAnswers >= maxWrongAnswers) {
        if (starLottieFO) starLottieFO.style.display = 'block';
        if (starAnim) { try { starAnim.destroy(); } catch (e) {} starAnim = null; }
        if (typeof lottie !== 'undefined' && starLottieContainer) {
          starAnim = lottie.loadAnimation({
            container: starLottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/json/sad.json'
          });
        }
      } else {
        if (starLottieFO) starLottieFO.style.display = 'block';
        if (starAnim) { try { starAnim.destroy(); } catch (e) {} starAnim = null; }
        if (typeof lottie !== 'undefined' && starLottieContainer) {
          starAnim = lottie.loadAnimation({
            container: starLottieContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'assets/json/stars.json'
          });
        }
      }
    } catch (e) {}
    if (homeButton) {
      homeButton.style.display = 'none';
      homeButton.style.pointerEvents = 'none';
    }

    // Show summary variant based on wrongAnswers:
    // 3 or more wrong -> fully incorrect, 1-2 wrong -> half incorrect, 0 wrong -> correct
    summaryIncorrect.style.display = 'none';
    summaryHalfIncorrect.style.display = 'none';
    summaryCorrect.style.display = 'none';
    if (wrongAnswers >= maxWrongAnswers) {
      summaryIncorrect.style.display = 'block';
    } else if (wrongAnswers === 1 || wrongAnswers === 2) {
      summaryHalfIncorrect.style.display = 'block';
    } else {
      summaryCorrect.style.display = 'block';
    }
  }

  function answerQuestion(selectedIndex) {
    if (!activeStone || hasAnswered) {
      return;
    }

    hasAnswered = true;
    completedQuestions += 1;
    var isCorrect = selectedIndex === activeStone.data.ans;
    answeredStatus[activeStone.number] = isCorrect ? 'correct' : 'wrong';
    if (isCorrect) {
      correctAnswers += 1;
      options[selectedIndex].classList.add('is-correct');
      feedback.textContent = '🌟 Wall Secured! 🌟';
      feedback.style.color = '#4cff00';
      info.style.display = 'block';
    } else {
      feedback.textContent = '⚠️Wall cracked!';
      options[selectedIndex].classList.add('is-incorrect');
      feedback.style.color = '#b6254f';
      info.style.display = 'none';
      wrongAnswers += 1;
      numberBlocks.style.transform = 'rotate(' + (wrongAnswers * 3) + 'deg)';
      if (wrongAnswers <= progressBlocks.length) {
        progressBlocks[wrongAnswers - 1].style.display = 'block';
      }
    }
    feedback.style.display = 'block';
    setOptionsLocked(true);
    nextStoneButton.style.display = 'block';
    if (wrongAnswers >= maxWrongAnswers) {
      disableBlock(activeStone.number);
      disableAllBlocks();
      questionPanel.style.display = 'none';
      cholaBlocks.style.pointerEvents = 'none';
      nextStoneButton.style.display = 'none';
      if (summaryTimer) {
        clearTimeout(summaryTimer);
      }
      // hide all block text labels at game end
      hideAllBlockText();
      if (homeButton) {
        homeButton.style.display = 'none';
        homeButton.style.pointerEvents = 'none';
      }
      collapseRemainingBlocks().then(function () {
        showSummary();
      });
    } else if (completedQuestions === totalQuestions) {
      disableBlock(activeStone.number);
      nextStoneButton.classList.add('is-disabled');
      nextStoneButton.style.pointerEvents = 'none';
      nextStoneButton.setAttribute('aria-disabled', 'true');
      if (summaryTimer) {
        clearTimeout(summaryTimer);
      }
      // hide block text labels at end of game before summary
      hideAllBlockText();
      summaryTimer = setTimeout(function () {
        showSummary();
      }, 1000);
    }
  }

  function closeQuestion() {
    if (!activeStone || !hasAnswered) {
      return;
    }

    disableBlock(activeStone.number);
    questionPanel.style.display = 'none';
    cholaBlocks.style.transform = '';
    cholaBlocks.style.pointerEvents = '';
    activeStone = null;
    hasAnswered = false;
  }

  function resetGame() {
    if (summaryTimer) {
      clearTimeout(summaryTimer);
      summaryTimer = null;
    }
    introLayer.style.display = 'block';
    jengaBlocks.style.display = 'none';
    questionPanel.style.display = 'none';
    cholaBlocks.style.display = 'none';
    cholaBlocks.style.transform = '';
    cholaBlocks.style.pointerEvents = '';
    feedback.style.display = 'none';
    feedback.textContent = '';
    info.style.display = 'none';
    infoText.textContent = '';
    nextStoneButton.style.display = 'none';
    nextStoneButton.classList.remove('is-disabled');
    nextStoneButton.style.pointerEvents = '';
    nextStoneButton.removeAttribute('aria-disabled');
    hideSummary();
    setOptionsLocked(false);
    progressBlocks.forEach(function (block) {
      block.style.display = 'none';
    });
    numberBlocks.style.transform = 'rotate(0deg)';
    options.forEach(function (option) {
      option.textContent = '';
      option.style.backgroundColor = '';
      option.classList.remove('is-correct', 'is-incorrect');
    });
    completedQuestions = 0;
    wrongAnswers = 0;
    correctAnswers = 0;
    answeredStatus = {};
    // restore original DOM order and display for collapsed elements
    Object.keys(originalPositions).forEach(function (id) {
      var pos = originalPositions[id];
      var el = document.getElementById(id);
      if (el && pos && pos.parent) {
        try {
          pos.parent.insertBefore(el, pos.nextSibling);
        } catch (e) {
          if (cholaBlocks && cholaBlocks.appendChild) cholaBlocks.appendChild(el);
        }
        el.style.display = pos.display || '';
      }
    });
    // restore any hidden block text labels (id="block-text")
    Object.keys(originalPositions).forEach(function (id) {
      var pos = originalPositions[id];
      if (pos && pos.labelDisplay !== undefined) {
        var el = document.getElementById(id);
        if (el) {
          try {
            var lbl = el.querySelector('#block-text');
            if (lbl) lbl.style.display = pos.labelDisplay || '';
          } catch (e) {}
        }
      }
    });
    // restore flag styles (flag is moved during collapse and should be reset)
    var flagEl = document.getElementById('flag');
    if (flagEl) {
      flagEl.style.transform = 'translateX(44px)';
      flagEl.style.transition = '';
      flagEl.style.pointerEvents = '';
      flagEl.style.transformOrigin = '';
    }
    // hide and destroy star lottie if present
    if (starAnim) {
      try { starAnim.destroy(); } catch (e) {}
      starAnim = null;
    }
    if (starLottieFO) {
      starLottieFO.style.display = 'none';
    }
    // restore any block text labels
    restoreAllBlockText();
    originalPositions = {};
    activeStone = null;
    hasAnswered = false;
    if (homeButton) {
      homeButton.style.display = '';
      homeButton.style.pointerEvents = '';
    }
    document.querySelectorAll('[id$="-block"]').forEach(function (block) {
      block.classList.remove('is-selected');
      block.classList.remove('is-disabled');
      block.style.cursor = 'pointer';
      block.style.pointerEvents = '';
      block.style.transform = '';
      block.style.opacity = '';
      block.style.transition = '';
    });
  }

  if (stormButton && introLayer && jengaBlocks) {
    stormButton.addEventListener('click', function () {
      showGameBoard();
    });
  }

  if (homeButton) {
    homeButton.addEventListener('click', resetGame);
  }

  if (summaryHomeButton) {
    summaryHomeButton.addEventListener('click', resetGame);
  }

  QS.forEach(function (item) {
    var block = document.getElementById(item.stoneNo + '-block');
    if (block) {
      block.addEventListener('click', function () {
        openQuestion(item.stoneNo);
      });
    }
  });

  options.forEach(function (option, index) {
    option.addEventListener('click', function () {
      answerQuestion(index);
    });
  });

  nextStoneButton.addEventListener('click', closeQuestion);
});
