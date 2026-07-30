document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const introContainer = document.querySelector('.intro-page-container');
  const mainContainer = document.querySelector('.main-page-container');
  const foodStepImages = document.querySelectorAll('#foodFlow .step-image');

  // Map of organ selections to their matching blanks, data, and step indexes
  const organMap = {
    'mouth-organ': { blankId: 'mouth-blank', name: 'Mouth', imgSrc: 'assets/image/mouth.svg', stepIndex: 0 },
    'oesophagus-organ': { blankId: 'osephagus-blank', name: 'Oesophagus', imgSrc: 'assets/image/oesophagus.svg', stepIndex: 1 },
    'stomach-organ': { blankId: 'stomach-blank', name: 'Stomach', imgSrc: 'assets/image/stomach.svg', stepIndex: 2 },
    'small-intestine-organ': { blankId: 'small-intestine-blank', name: 'Small Intestine', imgSrc: 'assets/image/small-intestine.svg', stepIndex: 3 },
    'large-intestine-organ': { blankId: 'large-intestine-blank', name: 'Large Intestine', imgSrc: 'assets/image/large-intestine.svg', stepIndex: 4 },
    'rectum-organ': { blankId: 'rectum-blank', name: 'Rectum', imgSrc: 'assets/image/rectum.svg', stepIndex: 5 }
  };

  let selectedOrgan = null;
  let correctCount = 0;

  // Programmatically hide the ugly red debug borders on foreignObjects
  document.querySelectorAll('foreignObject').forEach(fo => {
    fo.style.border = 'none';
  });

  // Start button transition
  if (startButton) {
    startButton.addEventListener('click', () => {
      if (introContainer) introContainer.style.display = 'none';
      if (mainContainer) mainContainer.style.display = 'block';
    });
  }

  // Create a floating image follower element for custom organ cursor
  const follower = document.createElement('div');
  follower.id = 'organ-follower';
  follower.style.position = 'fixed';
  follower.style.pointerEvents = 'none';
  follower.style.zIndex = '99999';
  follower.style.width = '70px';
  follower.style.height = '70px';
  follower.style.display = 'none';
  follower.style.transform = 'translate(-50%, -50%)';
  follower.innerHTML = `<img src="" style="width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.35));" />`;
  document.body.appendChild(follower);

  // Manage custom cursor hides/shows on desktop & touch
  function setCustomCursor(active) {
    if (active) {
      document.body.style.cursor = 'none';
      document.querySelectorAll('.organ-blank, .organ-container').forEach(el => {
        el.style.cursor = 'none';
      });
    } else {
      document.body.style.cursor = 'default';
      document.querySelectorAll('.organ-blank').forEach(el => {
        el.style.cursor = 'pointer';
      });
      document.querySelectorAll('.organ-container').forEach(el => {
        if (!el.classList.contains('disabled')) {
          el.style.cursor = 'pointer';
        } else {
          el.style.cursor = 'not-allowed';
        }
      });
    }
  }

  // Update floating follower position on screen
  function updateFollowerPosition(e) {
    if (selectedOrgan) {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;
      follower.style.left = `${x}px`;
      follower.style.top = `${y}px`;
    }
  }
  window.addEventListener('mousemove', updateFollowerPosition);
  window.addEventListener('touchmove', updateFollowerPosition, { passive: true });

  // Handle organ selections in the chart
  document.querySelectorAll('.organ-container').forEach(container => {
    container.addEventListener('click', (e) => {
      e.stopPropagation();
      const organId = container.id;

      // If clicked organ is already selected, deselect it
      if (selectedOrgan === organId) {
        deselectOrgan();
        return;
      }

      // If already disabled/completed, do nothing
      if (container.classList.contains('disabled')) {
        return;
      }

      deselectOrgan();
      selectedOrgan = organId;
      container.classList.add('selected');

      const organData = organMap[organId];
      if (organData) {
        follower.querySelector('img').src = organData.imgSrc;
        follower.style.display = 'block';
        
        // Put the follower exactly where the cursor clicked immediately
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        if (clientX && clientY) {
          follower.style.left = `${clientX}px`;
          follower.style.top = `${clientY}px`;
        }
        
        setCustomCursor(true);
      }
    });
  });

  function deselectOrgan() {
    selectedOrgan = null;
    document.querySelectorAll('.organ-container').forEach(c => c.classList.remove('selected'));
    follower.style.display = 'none';
    setCustomCursor(false);
  }

  // Deselect selected organ if user clicks anywhere else
  document.addEventListener('click', (e) => {
    if (selectedOrgan && !e.target.closest('.organ-container') && !e.target.closest('.organ-blank')) {
      deselectOrgan();
    }
  });

  // Handle slot tapping
  document.querySelectorAll('.organ-blank').forEach(blank => {
    blank.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!selectedOrgan) return;

      const organData = organMap[selectedOrgan];
      if (!organData) return;

      if (blank.id === organData.blankId) {
        handleCorrectMatch(blank, selectedOrgan);
      } else {
        handleWrongMatch(blank);
      }
    });
  });

  function handleCorrectMatch(blankEl, organId) {
    const organData = organMap[organId];

    // Show contents in blank slot
    blankEl.classList.add('correct');
    blankEl.innerHTML = `
      <div class="filled-content">
        <img src="${organData.imgSrc}" alt="${organData.name}" />
        <span class="organ-name">${organData.name}</span>
        <span class="checkmark">✔</span>
      </div>
    `;

    // Disable matched organ in selection chart
    const organContainer = document.getElementById(organId);
    if (organContainer) {
      organContainer.classList.remove('selected');
      organContainer.classList.add('disabled');
    }

    // Reveal step image in the food flow
    if (foodStepImages[organData.stepIndex]) {
      foodStepImages[organData.stepIndex].style.visibility = 'visible';
    }

    deselectOrgan();
    correctCount++;

    // Trigger success when all 6 organs match
    if (correctCount === 6) {
      setTimeout(showSuccessScreen, 600);
    }
  }

  function handleWrongMatch(blankEl) {
    blankEl.classList.add('shake');
    setTimeout(() => {
      blankEl.classList.remove('shake');
    }, 400);
  }

  // Reset complete game state
  function resetGame() {
    correctCount = 0;
    deselectOrgan();

    // Reset all blanks
    document.querySelectorAll('.organ-blank').forEach(blank => {
      blank.classList.remove('correct', 'shake');
      blank.innerHTML = '';
    });

    // Reset selection chart
    document.querySelectorAll('.organ-container').forEach(c => {
      c.classList.remove('disabled', 'selected');
    });

    // Hide food flow step images
    foodStepImages.forEach(img => {
      img.style.visibility = 'hidden';
    });

    // Go back to intro screen
    if (introContainer) introContainer.style.display = 'block';
    if (mainContainer) mainContainer.style.display = 'none';
  }

  // Display success modal with clean HTML layout
  function showSuccessScreen() {
    const overlay = document.createElement('div');
    overlay.id = 'success-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(15, 23, 42, 0.85)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '999999';
    overlay.style.color = '#fff';
    overlay.style.fontFamily = '"Roboto", sans-serif';
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.webkitBackdropFilter = 'blur(8px)';

    const card = document.createElement('div');
    card.style.position = 'relative';
    card.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    card.style.padding = '48px 64px';
    card.style.borderRadius = '32px';
    card.style.textAlign = 'center';
    card.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.5)';
    card.style.border = '4px solid rgba(255, 255, 255, 0.4)';
    card.style.maxWidth = '550px';
    card.style.width = '90%';
    card.style.transform = 'scale(0.8)';
    card.style.opacity = '0';
    card.style.transition = 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';

    card.innerHTML = `
      <div style="font-size: 64px; margin-bottom: 16px;">🎉</div>
      <h1 style="font-size: 38px; margin: 0 0 12px 0; font-weight: 900; letter-spacing: -0.5px; text-shadow: 0 4px 6px rgba(0,0,0,0.15);">Fantastic Job!</h1>
      <p style="font-size: 18px; color: #ecfdf5; margin: 0 0 32px 0; font-weight: 500; line-height: 1.5;">You successfully mapped all parts of the digestive system!</p>
      <button id="restart-btn" style="background-color: #fff; color: #059669; font-size: 18px; font-weight: 800; padding: 16px 44px; border-radius: 50px; border: none; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); transition: all 0.2s ease;">Play Again</button>
    `;

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    requestAnimationFrame(() => {
      card.style.transform = 'scale(1)';
      card.style.opacity = '1';
    });

    const restartBtn = card.querySelector('#restart-btn');
    restartBtn.addEventListener('mouseenter', () => {
      restartBtn.style.transform = 'scale(1.05)';
      restartBtn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
    });
    restartBtn.addEventListener('mouseleave', () => {
      restartBtn.style.transform = 'scale(1)';
      restartBtn.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)';
    });
    restartBtn.addEventListener('click', () => {
      overlay.remove();
      resetGame();
    });
  }
});
