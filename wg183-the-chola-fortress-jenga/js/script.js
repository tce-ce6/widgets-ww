const QS = [
  {
    "stoneNo": 1,
    "q": "A devout Shiva-worshipping king lets a foreign ruler build a Buddhist monastery in his busiest port. Why?",
    "opts": [
      "To convert to Buddhism",
      "Diplomacy over personal belief",
      "The port needed more temples"
    ],
    "ans": 1,
    "info": "Rajaraja Chola, despite being a Shaivite, permitted a Srivijaya-funded Buddhist vihara at Nagapattinam to strengthen diplomatic ties."
  },
  {
    "stoneNo": 2,
    "q": "A navy crosses the Bay of Bengal, captures an enemy capital... then sails home without claiming any land. What was the point?",
    "opts": [
      "Punish and reopen trade routes",
      "The invasion failed midway",
      "Scout territory for later"
    ],
    "ans": 0,
    "info": "Rajendra Chola's Srivijaya expedition was a punitive campaign, backed by merchant guilds, to reopen the Strait of Malacca for China-bound trade."
  },
  {
    "stoneNo": 3,
    "q": "Private merchants fund an expensive overseas war. What would make businessmen pay for military action?",
    "opts": [
      "Loyalty to the king",
      "Hatred of a foreign religion",
      "A blocked route to China"
    ],
    "ans": 2,
    "info": "Indian merchant guilds supported the naval campaign because the Srivijaya Empire was blocking their profitable trade route through the Strait of Malacca."
  },
  {
    "stoneNo": 4,
    "q": "After winning battles near the Ganges, a king builds a new city named after that distant river. Why?",
    "opts": [
      "A permanent victory monument",
      "Old capital was destroyed",
      "He wanted to relocate north"
    ],
    "ans": 0,
    "info": "Rajendra Chola built Gangaikondacholapuram as a new capital whose name itself announced his conquest of the northern Gangetic region."
  },
  {
    "stoneNo": 5,
    "q": "Father conquers islands south. Son conquers lands north and launches ships east. What does this pattern reveal?",
    "opts": [
      "Random luck in battles",
      "Planned all-direction expansion",
      "Son fixing father's errors"
    ],
    "ans": 1,
    "info": "Rajaraja expanded southward to the Maldives and Sri Lanka, while Rajendra expanded northward to Bengal and eastward to Srivijaya."
  },
  {
    "stoneNo": 6,
    "q": "A massive temple carries two names — one for the god, another for the king. What does the royal name signal?",
    "opts": [
      "The king replaced the deity",
      "It was the king's house",
      "King's power equals divine power"
    ],
    "ans": 2,
    "info": "The Brihadishvara temple at Thanjavur was also called Rajarajeshvaram, linking Rajaraja Chola's identity directly to divine authority."
  },
  {
    "stoneNo": 7,
    "q": "An empire holds a foreign island for fifty years. A local king fights back and reclaims it. What lesson?",
    "opts": [
      "Distant conquests don't last",
      "Islands can never be taken",
      "Fifty years weakens armies"
    ],
    "ans": 0,
    "info": "Sri Lankan king Vijayabahu I successfully drove the Cholas out of northern Sri Lanka after approximately half a century of occupation."
  },
  {
    "stoneNo": 8,
    "q": "An empire builds roads, wells, canals — while fighting three rivals for decades. What happens eventually?",
    "opts": [
      "Empire becomes unbeatable",
      "Treasury drains despite growth",
      "Rivals surrender first"
    ],
    "ans": 1,
    "info": "Constant wars with the Western Chalukyas, Pandyas, and Sri Lankan rulers gradually emptied the Chola treasury despite impressive domestic infrastructure."
  },
  {
    "stoneNo": 9,
    "q": "Sending diplomats to China and defeating the empire blocking the sea route there. What connects both moves?",
    "opts": [
      "Preparing to invade China",
      "Spreading religion eastward",
      "Securing trade by all means"
    ],
    "ans": 2,
    "info": "Rajendra Chola used both diplomacy and military force to secure access to the lucrative China trade from two different directions simultaneously."
  },
  {
    "stoneNo": 10,
    "q": "An empire that once stretched from the Maldives to Bengal slowly fades and is eventually absorbed by a former rival. What was the primary cause of this decline?",
    "opts": [
      "Decades of multi-front wars",
      "One catastrophic earthquake",
      "A sudden palace revolution"
    ],
    "ans": 0,
    "info": "The Chola Empire declined over decades due to treasury-draining conflicts on multiple fronts and was finally absorbed by the Pandyas in the 13th century."
  },
  {
    "stoneNo": 11,
    "q": "Most empires build one great capital and rule from it forever. This empire moved its seat of power three times from Thanjavur to Gangaikondacholapuram to Kanchipuram. Why would a powerful empire keep shifting its capital?",
    "opts": [
      "The kings could never agree on a location",
      "Each capital marked a new era of power",
      "Every capital was destroyed by enemies"
    ],
    "ans": 1,
    "info": "Each capital marked a distinct phase of Chola power — Thanjavur under Rajaraja, Gangaikondacholapuram under Rajendra, and Kanchipuram in later years."
  },
  {
    "stoneNo": 12,
    "q": "Imagine you find an ancient coin from China in a south Indian port. Does that alone prove two empires were trading partners? Why do historians demand multiple types of evidence before declaring something as fact?",
    "opts": [
      "One source alone can mislead",
      "Written evidence is always more trustworthy",
      "Archaeological finds are more impressive than coins"
    ],
    "ans": 0,
    "info": "Historians use coins, inscriptions, and archaeological finds together because each source alone may be incomplete, and triangulating evidence builds a more reliable picture."
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
  }

  function disableBlock(stoneNo) {
    var completedBlock = document.getElementById(stoneNo + '-block');
    if (!completedBlock) {
      return;
    }
    completedBlock.classList.add('is-disabled');
    completedBlock.style.cursor = 'not-allowed';
    completedBlock.style.pointerEvents = 'none';
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
    // play star lottie animation at summary only if player got all answers correct
    try {
      if (correctAnswers === totalQuestions) {
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
      } else {
        if (starAnim) { try { starAnim.destroy(); } catch (e) {} starAnim = null; }
        if (starLottieFO) starLottieFO.style.display = 'none';
      }
    } catch (e) {}
    if (homeButton) {
      homeButton.style.display = 'none';
      homeButton.style.pointerEvents = 'none';
    }

    if (wrongAnswers >= maxWrongAnswers) {
      summaryIncorrect.style.display = 'block';
      summaryHalfIncorrect.style.display = 'none';
      summaryCorrect.style.display = 'none';
    } else if (correctAnswers <= 1) {
      summaryIncorrect.style.display = 'block';
      summaryHalfIncorrect.style.display = 'none';
      summaryCorrect.style.display = 'none';
    } else if (correctAnswers === 2) {
      summaryIncorrect.style.display = 'none';
      summaryHalfIncorrect.style.display = 'block';
      summaryCorrect.style.display = 'none';
    } else {
      summaryIncorrect.style.display = 'none';
      summaryHalfIncorrect.style.display = 'none';
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
      // if all answers are correct, play star lottie
      // if (correctAnswers === totalQuestions) {
      //   try {
      //     if (starLottieFO) starLottieFO.style.display = 'block';
      //     if (starAnim) {
      //       try { starAnim.destroy(); } catch (e) {}
      //       starAnim = null;
      //     }
      //     if (typeof lottie !== 'undefined' && starLottieContainer) {
      //       starAnim = lottie.loadAnimation({
      //         container: starLottieContainer,
      //         renderer: 'svg',
      //         loop: false,
      //         autoplay: true,
      //         path: 'assets/json/stars.json'
      //       });
      //     }
      //   } catch (e) {
      //     // ignore lottie errors
      //   }
      // } else {
      //   if (starLottieFO) starLottieFO.style.display = 'none';
      // }
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
