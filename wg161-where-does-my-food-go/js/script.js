FEEDBACKDATA = [
  {
    "organ": "Mouth",
    "dialogue": "😋 Crunch! Thanks! I can finally begin!"
  },
  {
    "organ": "Oesophagus",
    "dialogue": "Whoooooo!"
  },
  {
    "organ": "Stomach",
    "dialogue": "😂 This is a tummy washing machine!"
  },
  {
    "organ": "Small Intestine",
    "dialogue": "✨ Wow! The body is collecting nutrients!"
  },
  {
    "organ": "Large Intestine",
    "dialogue": "💧 The body is saving water."
  },
  {
    "organ": "Rectum",
    "dialogue": "👋 Goodbye!"
  }
];


// Intro screen and organ-matching controller

window.addEventListener('load', () => {
    const introPage = document.querySelector('.intro-page-container');
    const mainPage = document.querySelector('.main-page-container');
    const startButton = document.getElementById('startButton');

    if (!introPage || !mainPage || !startButton) return;

    // Every page load begins at the introduction screen.
    introPage.style.display = 'block';
    mainPage.style.display = 'none';

    startButton.addEventListener('click', () => {
        introPage.style.display = 'none';
        mainPage.style.display = 'block';
    });

    const organPairs = {
        mouth: { blankId: 'mouth-blank', stepId: 'step-1', image: 'assets/image/mouth.svg', name: 'Mouth' },
        oesophagus: { blankId: 'osephagus-blank', stepId: 'step-2', image: 'assets/image/oesophagus.svg', name: 'Oesophagus' },
        stomach: { blankId: 'stomach-blank', stepId: 'step-3', image: 'assets/image/stomach.svg', name: 'Stomach' },
        'small-intestine': { blankId: 'small-intestine-blank', stepId: 'step-4', image: 'assets/image/small-intestine.svg', name: 'Small intestine' },
        'large-intestine': { blankId: 'large-intestine-blank', stepId: 'step-5', image: 'assets/image/large-intestine.svg', name: 'Large intestine' },
        rectum: { blankId: 'rectum-blank', stepId: 'step-6', image: 'assets/image/rectum.svg', name: 'Rectum' }
    };
    const feedbackContainer = document.querySelector('.feedback-div');
    const feedbackImage = document.getElementById('feedbackImage');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const closeFeedbackButton = document.getElementById('cross-btn');
    const feedbackData = Array.isArray(window.FEEDBACKDATA) ? window.FEEDBACKDATA : [];
    const organSequence = Object.entries(organPairs);
    let currentStepIndex = 0;
    let selectedOrgan = null;

    const showFeedback = (isCorrect, correctDialogue = '') => {
        if (!feedbackContainer || !feedbackImage) return;

        feedbackImage.src = isCorrect
            ? 'assets/image/correct-feedback.svg'
            : 'assets/image/wrong-feedback.svg';
        feedbackImage.alt = isCorrect ? 'Correct answer' : 'Try again';
        if (feedbackMessage) {
            feedbackMessage.textContent = isCorrect
                ? correctDialogue || '"Crunch! Thanks! I can finally begin!"'
                : '"Hmm... I don\'t think I can jump there yet."';
        }
        feedbackContainer.style.display = 'block';
    };

    closeFeedbackButton?.addEventListener('click', () => {
        feedbackContainer.style.display = 'none';
    });

    const clearSelection = () => {
        document.querySelectorAll('.organ-container.selected').forEach((organ) => {
            organ.classList.remove('selected');
        });
        selectedOrgan = null;
    };

    document.querySelectorAll('.organ-container').forEach((organ) => {
        organ.addEventListener('click', () => {
            if (organ.classList.contains('disabled')) return;
            clearSelection();
            selectedOrgan = organ.id.replace('-organ', '');
            organ.classList.add('selected');
        });
    });

    organSequence.forEach(([organKey, pair]) => {
        const blank = document.getElementById(pair.blankId);
        const step = document.querySelector(`#foodFlow #${pair.stepId}`);
        if (!blank) return;

        blank.addEventListener('click', () => {
            if (!selectedOrgan || blank.classList.contains('correct')) return;

            const [expectedOrganKey] = organSequence[currentStepIndex] || [];
            if (selectedOrgan !== expectedOrganKey || organKey !== expectedOrganKey) {
                blank.classList.remove('shake');
                void blank.offsetWidth;
                blank.classList.add('shake');
                showFeedback(false);
                clearSelection();
                return;
            }

            blank.classList.add('correct');
            blank.innerHTML = `
                <div class="filled-content">
                    <img src="${pair.image}" alt="${pair.name}">
                    <span class="organ-name">${pair.name}</span>
                    <span class="checkmark">✓</span>
                </div>`;
            document.getElementById(`${organKey}-organ`)?.classList.add('disabled');
            if (step) step.style.visibility = 'visible';
            const dialogue = feedbackData.find((feedback) => feedback.organ === pair.name)?.dialogue;
            showFeedback(true, dialogue);
            clearSelection();
            currentStepIndex += 1;
        });
    });
});
