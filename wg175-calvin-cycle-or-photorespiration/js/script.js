
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
  const lottieForeignObject = document.querySelector('.lottie-container');
  const lottieContainer = document.getElementById('lottie-container');
  let activeAnimation = null;

	if (!insights || !insightsButton || !closeButton || toggleButtons.some((button) => !button)) return;

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
  };

	insightsButton.addEventListener('click', () => {
		insights.style.display = 'block';
	});

	closeButton.addEventListener('click', () => {
		insights.style.display = 'none';
    activeAnimation?.destroy();
    activeAnimation = null;
    if (lottieForeignObject) lottieForeignObject.style.display = 'none';
	});

	toggleButtons.forEach((button, index) => {
		button.addEventListener('click', () => {
			const nextIndex = index === 0 ? 1 : index === 1 ? 2 : 1;

			toggleButtons[index].style.display = 'none';
			toggleButtons[nextIndex].style.display = 'block';
			toggleCircles.forEach((circle, circleIndex) => {
				if (circle) circle.style.display = circleIndex === nextIndex ? 'block' : 'none';
			});

      if (nextIndex === 1) playAnimation('./lottie/photorespiration.json');
      if (nextIndex === 2) playAnimation('./lottie/calvin-cycle.json');
		});
	});
});
