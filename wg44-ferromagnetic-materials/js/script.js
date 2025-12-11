document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------------------------
     LOAD BOTH LOTTIE ANIMATIONS
  --------------------------------------------- */

  // X-RAY animation
  const xrayAnim = lottie.loadAnimation({
    container: document.getElementById("xray-container"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "xray-lottie.json",
  });

  // Magnetic Field animation
  const magneticAnim = lottie.loadAnimation({
    container: document.getElementById("magnetic-container"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "magnetic-lottie.json",
  });

  xrayAnim.addEventListener("DOMLoaded", () => {
    console.log("X-ray Lottie Ready");
  });

  magneticAnim.addEventListener("DOMLoaded", () => {
    console.log("Magnetic Lottie Ready");
  });

  /* ---------------------------------------------
     BUTTON LOGIC
  --------------------------------------------- */

  const buttons = document.querySelectorAll(".js-button");

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      let parentNode = event.target.parentNode;
      let isTurningOn = !parentNode.classList.contains("turn-on");

      // 🔥 First, turn OFF all buttons (mutual exclusive)
      document.querySelectorAll(".button-inner-wrapper").forEach((wrapper) => {
        wrapper.classList.remove("turn-on");
      });

      // 🔥 Now turn ON only the clicked one (if it was not already ON)
      if (isTurningOn) parentNode.classList.add("turn-on");

      // -----------------------------------------
      // Update body active state
      const anyActive = document.querySelector(".button-inner-wrapper.turn-on");
      if (anyActive) document.body.classList.add("active");
      else document.body.classList.remove("active");
      // -----------------------------------------

      /* ---------------------------------------------
       X-RAY BUTTON CLICKED
    --------------------------------------------- */
      if (event.target.id === "xray-button") {
        if (isTurningOn) {
          // Show only X-ray
          document.getElementById("xray-container").style.display = "block";
          document.getElementById("magnetic-container").style.display = "none";

          magneticAnim.stop();

          setTimeout(() => {
            xrayAnim.goToAndPlay(0, true);
          }, 50);
        } else {
          // Turning X-ray off
          document.getElementById("xray-container").style.display = "none";
          xrayAnim.stop();
        }
      }

      /* ---------------------------------------------
       MAGNETIC BUTTON CLICKED
    --------------------------------------------- */
      if (event.target.id === "magnetic-button") {
        if (isTurningOn) {
          // Show only Magnetic
          document.getElementById("magnetic-container").style.display = "block";
          document.getElementById("xray-container").style.display = "none";

          xrayAnim.stop();

          setTimeout(() => {
            magneticAnim.goToAndPlay(0, true);
          }, 50);
        } else {
          // Turning Magnetic off
          document.getElementById("magnetic-container").style.display = "none";
          magneticAnim.stop();
        }
      }
    });
  });
});
