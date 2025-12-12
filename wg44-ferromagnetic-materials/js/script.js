document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------------------------
       LOAD ARROW LOTTIE ANIMATION
    --------------------------------------------- */

  const arrowAnim = lottie.loadAnimation({
    container: document.getElementById("arrow-container"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "arrow-animation.json",
  });

  arrowAnim.addEventListener("DOMLoaded", () =>
    console.log("Arrow Lottie Ready")
  );

  /* ---------------------------------------------
       LOAD PIN ANIMATIONS
    --------------------------------------------- */

  const pinLeftAnim = lottie.loadAnimation({
    container: document.getElementById("pin-left-animation"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "pin-left-animation.json",
  });

  const pinRightAnim = lottie.loadAnimation({
    container: document.getElementById("pin-right-animation"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "pin-right-animation.json",
  });

  // Track Lottie load status
  pinLeftAnim.isLoaded = false;
  pinRightAnim.isLoaded = false;

  pinLeftAnim.addEventListener("DOMLoaded", () => {
    pinLeftAnim.isLoaded = true;
    console.log("Pin Left Ready");
  });

  pinRightAnim.addEventListener("DOMLoaded", () => {
    pinRightAnim.isLoaded = true;
    console.log("Pin Right Ready");
  });

  /* ---------------------------------------------
       BUTTON LOGIC (UNCHANGED)
    --------------------------------------------- */

  const buttons = document.querySelectorAll(".js-button");

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      let parentNode = event.target.parentNode;
      let isTurningOn = !parentNode.classList.contains("turn-on");

      // TURN OFF all buttons
      document.querySelectorAll(".button-inner-wrapper").forEach((wrapper) => {
        wrapper.classList.remove("turn-on");
      });

      // TURN ON only clicked button
      if (isTurningOn) parentNode.classList.add("turn-on");

      // Body active state toggle
      const anyActive = document.querySelector(".button-inner-wrapper.turn-on");
      if (anyActive) document.body.classList.add("active");
      else document.body.classList.remove("active");

      /* ---------------------------------------------
           MAGNETIC BUTTON CLICKED
        --------------------------------------------- */
      if (event.target.id === "magnetic-button") {
        if (isTurningOn) {
          // Show arrow animation
          document.getElementById("arrow-container").style.display = "block";
          arrowAnim.stop();

          setTimeout(() => {
            arrowAnim.goToAndPlay(0, true);
          }, 50);

          // Play pins (ONLY if Lottie is loaded)
          pinLeftAnim.stop();
          pinRightAnim.stop();

          setTimeout(() => {
            if (pinLeftAnim.isLoaded) pinLeftAnim.goToAndPlay(0, true);
            if (pinRightAnim.isLoaded) pinRightAnim.goToAndPlay(0, true);
          }, 50);
        } else {
          // Turning OFF Magnetic
          document.getElementById("arrow-container").style.display = "none";
          arrowAnim.stop();

          pinLeftAnim.stop();
          pinRightAnim.stop();
        }
      }

      /* ---------------------------------------------
           X-RAY BUTTON CLICKED
        --------------------------------------------- */
      if (event.target.id === "xray-button") {
        document.getElementById("arrow-container").style.display = "none";
        arrowAnim.stop();
      }
    });
  });
});
