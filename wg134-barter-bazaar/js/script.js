document.addEventListener("DOMContentLoaded", () => {
  const enterBtn = document.getElementById("enter-btn");
  const launchScreen = document.getElementById("launch-screen");

  if (enterBtn && launchScreen) {
    enterBtn.addEventListener("click", () => {
      launchScreen.style.display = "none";
    });
  }
});
