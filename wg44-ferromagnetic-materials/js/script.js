document.addEventListener("DOMContentLoaded", () => {

  /* ---------------------------------------------
       GET X-RAY CONTAINERS SAFELY
  --------------------------------------------- */

  const xrayLeftContainer = document.getElementById("xray-left");
  const xrayRightContainer = document.getElementById("xray-right");

  console.log("XRAY containers:", xrayLeftContainer, xrayRightContainer);

  let xrayLeftAnim, xrayRightAnim;

  /* ------------------------------------------------------
        FIX: foreignObject renders late → delay Lottie load
  --------------------------------------------------------- */

  function initXrayAnimations() {
    console.log("Initializing X-RAY Lottie animations...");

    xrayLeftAnim = lottie.loadAnimation({
      container: xrayLeftContainer,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "xray-left.json"
    });

    xrayRightAnim = lottie.loadAnimation({
      container: xrayRightContainer,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "xray-right.json"
    });
  }

  // Delay ensures foreignObject HTML is fully rendered
  setTimeout(initXrayAnimations, 150);


  /* ---------------------------------------------
       LOAD ARROW ANIMATION
  --------------------------------------------- */

  const arrowAnim = lottie.loadAnimation({
    container: document.getElementById("arrow-container"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "arrow-animation.json"
  });

  /* ---------------------------------------------
       LOAD PIN ANIMATIONS
  --------------------------------------------- */

  const pinLeftAnim = lottie.loadAnimation({
    container: document.getElementById("pin-left-animation"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "pin-left-animation.json"
  });

  const pinRightAnim = lottie.loadAnimation({
    container: document.getElementById("pin-right-animation"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "pin-right-animation.json"
  });


  /* ---------------------------------------------
       EXISTING BUTTON LOGIC (UNCHANGED)
  --------------------------------------------- */

  const buttons = document.querySelectorAll(".js-button");

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {

      let parentNode = event.target.parentNode;
      let isTurningOn = !parentNode.classList.contains("turn-on");

      // Turn OFF all buttons
      document.querySelectorAll(".button-inner-wrapper").forEach((wrapper) => {
        wrapper.classList.remove("turn-on");
      });

      // Turn ON clicked button
      if (isTurningOn) parentNode.classList.add("turn-on");

      // Body active toggle
      const anyActive = document.querySelector(".button-inner-wrapper.turn-on");
      if (anyActive) document.body.classList.add("active");
      else document.body.classList.remove("active");


      /* ---------------------------------------------
           MAGNETIC BUTTON CLICKED
      --------------------------------------------- */

      if (event.target.id === "magnetic-button") {

        if (isTurningOn) {
          document.getElementById("arrow-container").style.display = "block";
          arrowAnim.stop();

          setTimeout(() => arrowAnim.goToAndPlay(0, true), 50);

          pinLeftAnim.stop();
          pinRightAnim.stop();

          setTimeout(() => {
            pinLeftAnim.goToAndPlay(0, true);
            pinRightAnim.goToAndPlay(0, true);
          }, 50);

        } else {
          document.getElementById("arrow-container").style.display = "none";
          arrowAnim.stop();
          pinLeftAnim.stop();
          pinRightAnim.stop();
        }
      }


      /* ---------------------------------------------
           X-RAY BUTTON CLICKED (existing behavior)
      --------------------------------------------- */

      if (event.target.id === "xray-button") {
        document.getElementById("arrow-container").style.display = "none";
        arrowAnim.stop();
      }

    });
  });


  /* ------------------------------------------------------
      FIXED X-RAY PLAYBACK LISTENER (NO CHANGE TO LOGIC)
  --------------------------------------------------------- */

  const xrayClickable = document.querySelector("#xray-button");

  if (xrayClickable) {
    xrayClickable.addEventListener("click", () => {

      if (!xrayLeftAnim || !xrayRightAnim) {
        console.warn("X-RAY animations not ready yet");
        return;
      }

      // Show both sides
      xrayLeftContainer.style.display = "block";
      xrayRightContainer.style.display = "block";

      // Restart animations
      xrayLeftAnim.stop();
      xrayRightAnim.stop();

      xrayLeftAnim.goToAndPlay(0, true);
      xrayRightAnim.goToAndPlay(0, true);
    });
  } else {
    console.error("ERROR: #xray-button not found in DOM");
  }

});
