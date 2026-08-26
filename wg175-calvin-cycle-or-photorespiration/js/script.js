
const playLottie = (optionEl) => {
    if (!window.lottie || !optionEl) return;

    // ❌ Prevent duplicate stars
    if (optionEl.querySelector(".star-lottie")) return;

    // ⭐ Create container
    const starDiv = document.createElement("div");
    starDiv.className = "star-lottie";
    optionEl.appendChild(starDiv);

    // ⭐ Load animation
    const starAnim = window.lottie.loadAnimation({
      container: starDiv,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "./lottie/star-animation.json",
    });
    starAnim.setSpeed(0.3); // 🔥 make animation slower

    // ✅ When animation finishes → hide/remove star
    starAnim.addEventListener("complete", () => {
      starDiv.style.display = "none"; // hides it

      // (Optional — better) remove from DOM completely:
      setTimeout(() => {
        starAnim.destroy(); // cleanup lottie instance
        starDiv.remove(); // remove element
      }, 100);
    });
  };




document.addEventListener('DOMContentLoaded', () => {
	const insights = document.getElementById('insights');
	const insightsButton = document.getElementById('insights-btn');
	const closeButton = document.getElementById('close-btn');
	const toggleButtons = [0, 1, 2].map((index) => document.getElementById(`toggle-btn-${index}`));
	const toggleCircles = [0, 1, 2].map((index) => document.getElementById(`circle-${index}`));
  const startButton = document.getElementById('start-btn');
  const resetButton = document.getElementById('reset-btn');
  const togglePanel = document.getElementById('toggle-panel');
  const ribiscoBubble = document.getElementById('ribisco-bubble');
  const mainBubblePage = document.getElementById('main-bubble-page');
  const moleculeGroups = [...document.querySelectorAll('.o2-bubble, .co2-bubble')];
  const initialMoleculeStyles = moleculeGroups.map((group) => ({
    group,
    transform: group.style.transform,
    opacity: group.style.opacity
  }));
  const lottieForeignObject = document.querySelector('.lottie-container');
  const lottieContainer = document.getElementById('lottie-container');
  let activeAnimation = null;
  let selectedGas = null;
  let transitionTimer = null;
  let moleculeMotionTimer = null;
  let moleculeMotionStart = 0;
  let settled = false;

  if (!insights || !insightsButton || !closeButton || !startButton || !resetButton || !togglePanel || !ribiscoBubble || !mainBubblePage || toggleButtons.some((button) => !button)) return;

	insights.style.display = 'none';
  if (lottieForeignObject) lottieForeignObject.style.display = 'none';

  const playAnimation = (animationPath) => {
    if (!window.lottie || !lottieContainer || !lottieForeignObject) return;

    activeAnimation?.destroy();
    lottieContainer.replaceChildren();
    lottieForeignObject.style.display = 'block';
    activeAnimation = window.lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: false,
      autoplay: true,
      path: animationPath
    });
    activeAnimation.addEventListener('complete', () => {
      resetButton.style.pointerEvents = 'auto';
    });
  };

  const setButtonState = (button, enabled) => {
    button.style.opacity = enabled ? '1' : '0.45';
    button.style.pointerEvents = enabled ? 'auto' : 'none';
  };

  const moveMolecules = (timestamp) => {
    if (!moleculeMotionStart) moleculeMotionStart = timestamp;
    const elapsed = timestamp - moleculeMotionStart;
    const angle = (elapsed / 2600) * Math.PI * 2;

    moleculeGroups.forEach((group, index) => {
      const phase = (index / moleculeGroups.length) * Math.PI * 2;
      const offsetX = Math.sin(angle + phase) * 14;
      const offsetY = Math.sin((angle + phase) * 2) * 8;
      group.style.transition = 'none';
      group.style.transform = `translate(${offsetX.toFixed(2)}px, ${offsetY.toFixed(2)}px) ${initialMoleculeStyles[index].transform}`.trim();
    });

    moleculeMotionTimer = requestAnimationFrame(moveMolecules);
  };

  const startMoleculeMotion = () => {
    cancelAnimationFrame(moleculeMotionTimer);
    moleculeMotionStart = 0;
    moleculeMotionTimer = requestAnimationFrame(moveMolecules);
  };

  const showInitialMolecules = () => {
    const visibleCount = { 'o2-bubble': 0, 'co2-bubble': 0 };
    moleculeGroups.forEach((group, index) => {
      group.style.transition = '';
      group.style.transform = initialMoleculeStyles[index].transform;
      const gas = group.classList.contains('o2-bubble') ? 'o2-bubble' : 'co2-bubble';
      group.style.opacity = visibleCount[gas] < 6 ? (initialMoleculeStyles[index].opacity || '1') : '0';
      visibleCount[gas] += 1;
    });
  };

  const attachSelectedMolecule = () => {
    const selectedMolecule = moleculeGroups.find((group) => group.classList.contains(selectedGas));
    if (!selectedMolecule) return;
    const moleculeBox = selectedMolecule.getBBox();
    const ribiscoBox = ribiscoBubble.getBBox();
    const borderX = selectedGas === 'o2-bubble' ? ribiscoBox.x + ribiscoBox.width : ribiscoBox.x;
    const offsetX = borderX - (moleculeBox.x + moleculeBox.width / 2);
    const offsetY = ribiscoBox.y + ribiscoBox.height / 2 - (moleculeBox.y + moleculeBox.height / 2);
    selectedMolecule.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  };

  const resetWidget = () => {
    clearTimeout(transitionTimer);
    cancelAnimationFrame(moleculeMotionTimer);
    moleculeMotionTimer = null;
    moleculeMotionStart = 0;
    selectedGas = null;
    settled = false;
    mainBubblePage.style.display = 'block';
    setButtonState(startButton, false);
    setButtonState(resetButton, false);
    togglePanel.style.opacity = '1';
    togglePanel.style.pointerEvents = 'auto';
    toggleButtons.forEach((button, index) => {
      button.style.display = 'block';
      button.style.opacity = index === 0 ? '1' : '0';
      button.style.pointerEvents = index === 0 ? 'auto' : 'none';
    });
    toggleCircles.forEach((circle) => {
      if (circle) circle.style.display = 'none';
    });
    if (toggleCircles[0]) toggleCircles[0].style.display = 'block';
    ribiscoBubble.style.display = 'block';
    showInitialMolecules();
    activeAnimation?.destroy();
    activeAnimation = null;
    lottieContainer?.replaceChildren();
    if (lottieForeignObject) lottieForeignObject.style.display = 'none';
  };

  const settleSelection = () => {
    cancelAnimationFrame(moleculeMotionTimer);
    moleculeMotionTimer = null;
    moleculeMotionStart = 0;
    settled = true;
    togglePanel.style.opacity = '0.45';
    togglePanel.style.pointerEvents = 'none';
    moleculeGroups.forEach((group) => {
      group.style.opacity = '0.2';
    });
    moleculeGroups
      .filter((group) => group.classList.contains(selectedGas))
      .slice(0, 1)
      .forEach((group) => {
        group.style.opacity = '1';
      });
    attachSelectedMolecule();
    ribiscoBubble.style.display = 'block';
    setButtonState(startButton, true);
  };

	insightsButton.addEventListener('click', () => {
		insights.style.display = 'block';
	});

	closeButton.addEventListener('click', () => {
		insights.style.display = 'none';
    // activeAnimation?.destroy();
    // activeAnimation = null;
    // if (lottieForeignObject) lottieForeignObject.style.display = 'none';
	});

  resetButton.addEventListener('click', resetWidget);
  startButton.addEventListener('click', () => {
    if (!settled || !selectedGas) return;
    mainBubblePage.style.display = 'none';
    setButtonState(startButton, false);
    playAnimation(selectedGas === 'o2-bubble' ? './lottie/photorespiration.json' : './lottie/calvin-cycle.json');
    setButtonState(resetButton, true);
  });

  togglePanel.addEventListener('click', (event) => {
    if (settled) return;
    const panelBounds = togglePanel.getBoundingClientRect();
    const clickedButton = event.target.closest('[id^="toggle-btn-"]');
    const neutralCircleBounds = toggleCircles[0]?.getBoundingClientRect();
    const clickedIndex = clickedButton ? Number(clickedButton.id.replace('toggle-btn-', '')) : 0;
    const nextIndex = clickedIndex === 0
      ? neutralCircleBounds
        ? event.clientX < neutralCircleBounds.left + neutralCircleBounds.width / 2 ? 2 : 1
        : event.clientX - panelBounds.left < panelBounds.width / 2 ? 2 : 1
      : clickedIndex;
    if (![1, 2].includes(nextIndex)) return;
    selectedGas = nextIndex === 1 ? 'o2-bubble' : 'co2-bubble';

    toggleButtons.forEach((button, index) => {
      button.style.display = 'block';
      button.style.opacity = index === nextIndex ? '0.45' : '0';
      button.style.pointerEvents = index === nextIndex ? 'auto' : 'none';
    });
    toggleCircles.forEach((circle, circleIndex) => {
      if (circle) circle.style.display = circleIndex === nextIndex ? 'block' : 'none';
    });
    moleculeGroups
      .filter((group) => group.classList.contains(selectedGas))
      .forEach((group) => {
        group.style.opacity = '1';
      });
    startMoleculeMotion();
    transitionTimer = setTimeout(settleSelection, 5000);
  });

  resetWidget();
});
