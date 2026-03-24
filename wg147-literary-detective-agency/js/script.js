let gameData = null;
let currentCaseIndex = 0;
let currentPassageIndex = 0;
let currentLottieAnimation = null;
let stageWinnerLottieAnimation = null;
let restartLottieAnimation = null;

document.addEventListener('DOMContentLoaded', () => {
  const mainBtn = document.getElementById('main-btn');
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');

  // Fetch data
  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      gameData = data;
    })
    .catch(error => console.error('Error loading data:', error));

  mainBtn.addEventListener('click', () => {
    if (mainBtn.textContent.trim() === 'Accept Mission') {
      step1.style.display = 'none';
      step2.style.display = 'block';
      mainBtn.style.display = 'none';
    } else if (mainBtn.textContent.trim() === 'File Report') {
        const toneOptions = document.getElementById('tone-options');
        const moodOptions = document.getElementById('mood-options');
        const caseData = gameData.cases[currentCaseIndex];
        const passageData = caseData.passages[currentPassageIndex];
        const feedback = passageData.feedback || {};

        // Find current selections from header text or dataset
        const toneLabelValue = document.getElementById('tone-type').textContent;
        const moodLabelValue = document.getElementById('mood-type').textContent;

        const toneAlreadyCorrect = toneOptions.classList.contains('disabled-wrapper');
        const moodAlreadyCorrect = moodOptions.classList.contains('disabled-wrapper');

        const isToneCorrect = toneAlreadyCorrect || (toneLabelValue === passageData.correctTone);
        const isMoodCorrect = moodAlreadyCorrect || (moodLabelValue === passageData.correctMood);

        if (isToneCorrect && isMoodCorrect) {
            // Apply locking and success styles only when BOTH are correct
            document.getElementById('tone-type').classList.add('correct');
            toneOptions.classList.add('disabled-wrapper');
            toneOptions.querySelectorAll('li').forEach(li => li.classList.add('disabled'));

            document.getElementById('mood-type').classList.add('correct');
            moodOptions.classList.add('disabled-wrapper');
            moodOptions.querySelectorAll('li').forEach(li => li.classList.add('disabled'));

            const currentProgress = document.getElementById(`progress-step-${currentPassageIndex + 1}`);
            if (currentProgress) currentProgress.setAttribute('opacity', '1');
            showPopup('correct', 'Excellent!', feedback.bothCorrect || "Excellent detective work!");
        } else {
            let title = (!isToneCorrect && !isMoodCorrect) ? "Incorrect tone and mood:" : (!isToneCorrect ? "Incorrect tone:" : "Incorrect mood:");
            let msg = feedback.bothIncorrect || "Let’s review the clues together, detective.";
            
            if (isToneCorrect && !isMoodCorrect) {
                title = "Incorrect mood:";
                msg = feedback.incorrectMood || "Good catch on the tone! But let’s reexamine the mood.";
            } else if (!isToneCorrect && isMoodCorrect) {
                title = "Incorrect tone:";
                msg = feedback.incorrectTone || "Good catch on the mood! But let’s reexamine the tone.";
            }
            showPopup('wrong', title, msg);
        }
    } else if (mainBtn.textContent.trim() === 'Next Passage') {
        const caseData = gameData.cases[currentCaseIndex];
        if (currentPassageIndex + 1 < caseData.passages.length) {
            currentPassageIndex++;
            populateStep3(currentCaseIndex, currentPassageIndex);
        } else {
            showStageWinnerPopup();
        }
    }
  });

  // Handle case selection from step-2
  const caseItems = document.querySelectorAll('.case-wrapper li');
  caseItems.forEach(item => {
    item.addEventListener('click', (e) => {
      if (!gameData) return;
      if (item.classList.contains('completed')) return;

      const caseNumber = parseInt(item.getAttribute('data-case'), 10);
      currentCaseIndex = caseNumber - 1;
      currentPassageIndex = 0; // Load the first passage of the case

      // Reset progress steps transparency for the new case
      [1, 2, 3].forEach(stepNum => {
        const pStep = document.getElementById(`progress-step-${stepNum}`);
        if (pStep) pStep.setAttribute('opacity', '0.5');
      });

      populateStep3(currentCaseIndex, currentPassageIndex);

      step2.style.display = 'none';
      step3.style.display = 'block';
      mainBtn.style.display = 'block';
      mainBtn.textContent = 'File Report';
    });
  });

  document.getElementById('closePopup-btn').addEventListener('click', () => {
    const isCorrect = document.querySelector('.message-wrapper').classList.contains('correct');
    closePopup();
    if (isCorrect) {
      mainBtn.textContent = 'Next Passage';
    }
  });

  document.getElementById('nextPassage-btn').addEventListener('click', () => {
    closePopup();
    const caseData = gameData.cases[currentCaseIndex];
    if (currentPassageIndex + 1 < caseData.passages.length) {
      currentPassageIndex++;
      populateStep3(currentCaseIndex, currentPassageIndex);
    } else {
      showStageWinnerPopup();
    }
  });

  document.getElementById('next-case').addEventListener('click', () => {
    document.getElementById('stage-winner-popup').style.display = 'none';
    document.querySelector('body').classList.remove('modal-open');
    if (stageWinnerLottieAnimation) {
      stageWinnerLottieAnimation.destroy();
    }

    // Check if all cases are completed
    const remainingCases = document.querySelectorAll('.case-wrapper li:not(.completed)');
    if (remainingCases.length === 0) {
      document.getElementById('restart-wrapper').style.display = 'block';
      document.querySelector('body').classList.add('modal-open');
      mainBtn.style.display = 'none';
      const restartLottieContainer = document.getElementById('restart-lottie');
      if (restartLottieAnimation) {
        restartLottieAnimation.destroy();
      }
      restartLottieAnimation = lottie.loadAnimation({
        container: restartLottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: './lottie/over.json'
      });
    } else {
      step3.style.display = 'none';
      mainBtn.style.display = 'none';
      step2.style.display = 'block';
    }
  });

  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      document.getElementById('restart-wrapper').style.display = 'none';
      document.querySelector('body').classList.remove('modal-open');
      if (restartLottieAnimation) {
         restartLottieAnimation.destroy();
      }
      
      // Reset all progress
      document.querySelectorAll('.case-wrapper li').forEach(item => {
        item.classList.remove('completed');
      });
      [1, 2, 3, 4, 5].forEach(stepNum => {
        const caseSvgElement = document.getElementById(`case-${stepNum}`);
        if (caseSvgElement) {
          caseSvgElement.setAttribute('opacity', '0.5');
        }
      });
      
      currentCaseIndex = 0;
      currentPassageIndex = 0;
      step3.style.display = 'none';
      step2.style.display = 'block';
      mainBtn.style.display = 'none';
    });
  }

  document.getElementById('hint-btn').addEventListener('click', () => {
    const caseData = gameData.cases[currentCaseIndex];
    if (!caseData) return;
    const passageData = caseData.passages[currentPassageIndex];
    if (passageData && passageData.hint) {
      document.querySelector('.passage-text').innerHTML = wrapHighlights(passageData.text, passageData.hint);
    }
  });

  function showStageWinnerPopup() {
    const completedCase = document.querySelector(`.case-wrapper li[data-case="${currentCaseIndex + 1}"]`);
    if (completedCase) {
      completedCase.classList.add('completed');
    }

    const caseSvgElement = document.getElementById(`case-${currentCaseIndex + 1}`);
    if (caseSvgElement) {
      caseSvgElement.setAttribute('opacity', '1');
    }

    // Check if all cases are completed
    const remainingCases = document.querySelectorAll('.case-wrapper li:not(.completed)');
    if (remainingCases.length === 0) {
      document.getElementById('restart-wrapper').style.display = 'block';
      document.querySelector('body').classList.add('modal-open');
      mainBtn.style.display = 'none';
      const restartLottieContainer = document.getElementById('restart-lottie');
      if (restartLottieAnimation) {
        restartLottieAnimation.destroy();
      }
      restartLottieAnimation = lottie.loadAnimation({
        container: restartLottieContainer,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: './lottie/over.json'
      });
      return;
    }

    document.getElementById('stage-winner-popup').style.display = 'block';
    document.querySelector('body').classList.add('modal-open');

    const lottieStage = document.getElementById('lottie-stage');
    if (stageWinnerLottieAnimation) {
      stageWinnerLottieAnimation.destroy();
    }
    stageWinnerLottieAnimation = lottie.loadAnimation({
      container: lottieStage,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: './lottie/case-animation.json'
    });
  }

  function populateStep3(caseIdx, passageIdx) {
    mainBtn.textContent = 'File Report';
    const caseData = gameData.cases[caseIdx];
    const passageData = caseData.passages[passageIdx];

    document.getElementById('case-number').textContent = (caseIdx + 1).toString();
    document.getElementById('caseTitle').textContent = caseData.caseTitle;
    
    const passageNumberSpan = document.getElementById('passage-number');
    if (passageNumberSpan) {
      passageNumberSpan.textContent = passageData.id || (passageIdx + 1);
    }
    document.getElementById('passage-title').textContent = passageData.title;
    document.querySelector('.passage-text').textContent = passageData.text;

    // Reset tone and mood texts
    const toneType = document.getElementById('tone-type');
    const moodType = document.getElementById('mood-type');
    toneType.textContent = 'Select a tone below';
    moodType.textContent = 'Select a mood below';
    toneType.classList.remove('correct');
    moodType.classList.remove('correct');

    // Populate Tone options
    const toneOptionsUl = document.getElementById('tone-options');
    toneOptionsUl.innerHTML = '';
    toneOptionsUl.classList.remove('disabled-wrapper');
    passageData.toneOptions.forEach(opt => {
      const li = document.createElement('li');
      li.textContent = opt;
      li.addEventListener('click', () => handleOptionSelection('tone', li, opt, passageData.correctTone, toneOptionsUl));
      toneOptionsUl.appendChild(li);
    });

    // Populate Mood options
    const moodOptionsUl = document.getElementById('mood-options');
    moodOptionsUl.innerHTML = '';
    moodOptionsUl.classList.remove('disabled-wrapper');
    passageData.moodOptions.forEach(opt => {
      const li = document.createElement('li');
      li.textContent = opt;
      li.addEventListener('click', () => handleOptionSelection('mood', li, opt, passageData.correctMood, moodOptionsUl));
      moodOptionsUl.appendChild(li);
    });
  }

  function handleOptionSelection(type, liElement, selectedOption, correctOption, parentUl) {
    if (liElement.classList.contains('disabled') || parentUl.classList.contains('disabled-wrapper')) return;

    // Update label text to indicate choice (no color/locking yet)
    const typeElement = document.getElementById(`${type}-type`);
    typeElement.textContent = selectedOption;
    typeElement.classList.remove('correct');
  }

  function showPopup(type, title, text) {
    const popup = document.getElementById('message-popup');
    const wrapper = popup.querySelector('.message-wrapper');
    const titleEl = document.getElementById('message-title');
    const textEl = document.getElementById('feedback-text');
    const nextBtn = document.getElementById('nextPassage-btn');
    const svgContainer = document.getElementById('svg-container');

    wrapper.className = `message-wrapper ${type}`;
    titleEl.textContent = title;
    textEl.textContent = text;

    const lottieContainer = document.getElementById('lottie-animation');
    if (currentLottieAnimation) {
      currentLottieAnimation.destroy();
    }
    currentLottieAnimation = lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: type === 'correct' ? './lottie/correct.json' : './lottie/wrong.json'
    });

    if (type === 'correct') {
      nextBtn.style.display = 'block';
      nextBtn.textContent = 'Next Passage';
    } else {
      nextBtn.style.display = 'none';
    }

    popup.style.display = 'block';
    document.querySelector("body").classList.add('modal-open');
  }

  function closePopup() {
    document.getElementById('message-popup').style.display = 'none';
    document.querySelector("body").classList.remove('modal-open');
  }

  function wrapHighlights(text, hint) {
    if (!hint) return text;
    const parts = text.split(/(\b\w+\b)/);
    const hintWords = hint.match(/\b\w+\b/g) || [];
    
    let hIdx = 0;
    let res = "";
    let inHighlight = false;
    
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (/\b\w+\b/.test(part)) { 
            if (hIdx < hintWords.length && part.toLowerCase() === hintWords[hIdx].toLowerCase()) {
                if (!inHighlight) {
                    res += '<span class="highlight">';
                    inHighlight = true;
                }
                res += part;
                hIdx++;
            } else {
                if (inHighlight) {
                    res += '</span>';
                    inHighlight = false;
                }
                res += part;
            }
        } else {
            res += part;
        }
    }
    if (inHighlight) {
        res += '</span>';
    }
    return res;
  }
});
