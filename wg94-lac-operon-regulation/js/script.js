document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const lottieContainer = document.getElementById('lottie-animation');

  const animation = lottie.loadAnimation({
    container: lottieContainer,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: './assets/start.json',
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid meet',
      clearCanvas: true
    }
  });

  startBtn.addEventListener('click', () => {
    animation.goToAndPlay(0, true);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      animation.stop();
    });
  }
});
