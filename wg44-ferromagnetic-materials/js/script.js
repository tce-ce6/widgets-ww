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
      path: "xray-left.json",
    });

    xrayRightAnim = lottie.loadAnimation({
      container: xrayRightContainer,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: "xray-right.json",
    });
  }

  setTimeout(initXrayAnimations, 150);

  /* ---------------------------------------------
       LOAD ARROW ANIMATION
  --------------------------------------------- */

  const arrowAnim = lottie.loadAnimation({
    container: document.getElementById("arrow-container"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "arrow-animation.json",
  });

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

  /* ---------------------------------------------
       EXISTING BUTTON LOGIC (UNCHANGED)
  --------------------------------------------- */

  const buttons = document.querySelectorAll(".js-button");

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      let parentNode = event.target.parentNode;
      let isTurningOn = !parentNode.classList.contains("turn-on");

      if (!isTurningOn) {
        parentNode.classList.remove("turn-on");
      }

      if (isTurningOn) parentNode.classList.add("turn-on");

      const anyActive = document.querySelector(".button-inner-wrapper.turn-on");
      if (anyActive) document.body.classList.add("active");
      else document.body.classList.remove("active");

      /* ---------------------------------------------
           MAGNETIC BUTTON CLICKED
      --------------------------------------------- */

      if (event.target.id === "magnetic-button") {
        // ⭐ NEW: remove material classes
        document.querySelectorAll(".material-block").forEach((el) => {
          el.classList.remove("hard-material", "soft-material");
          el.classList.add("hard-pole", "soft-pole");
        });

        document.querySelectorAll(".pole-names").forEach((el) => {
          el.style.display = "block";
        });

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
          document.querySelectorAll(".material-block").forEach((el) => {
            el.classList.remove("hard-pole", "soft-pole");
            el.classList.add("hard-material", "soft-material");
          });
          document.getElementById("arrow-container").style.display = "none";
          document.querySelectorAll(".pole-names").forEach((el) => {
            el.style.display = "none";
          });
          arrowAnim.stop();
          pinLeftAnim.stop();
          pinRightAnim.stop();
        }
      }

      /* ---------------------------------------------
           X-RAY BUTTON CLICKED
      --------------------------------------------- */

      if (event.target.id === "xray-button") {
        if (isTurningOn) {
          xrayLeftContainer.style.display = "block";
          xrayRightContainer.style.display = "block";

          xrayLeftAnim.stop();
          xrayRightAnim.stop();
          xrayLeftAnim.goToAndPlay(0, true);
          xrayRightAnim.goToAndPlay(0, true);
        } else {
          xrayLeftContainer.style.display = "none";
          xrayRightContainer.style.display = "none";

          xrayLeftAnim.stop();
          xrayRightAnim.stop();
        }
      }

      if (event.target.id === "type-button") {
        if (isTurningOn) {
          document.querySelectorAll(".label-main").forEach((el) => {
            el.style.display = "block";
          });
        }else {
          document.querySelectorAll(".label-main").forEach((el) => {
            el.style.display = "none";
          });
        }
      }
    });
  });
});
