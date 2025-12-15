document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------------------------
       GET X-RAY CONTAINERS SAFELY
  --------------------------------------------- */

  const xrayLeftContainer = document.getElementById("xray-left");
  const xrayRightContainer = document.getElementById("xray-right");
  const resetBtn = document.getElementById("global-reset");
  const xrayLeftImg = document.getElementById("xray-left-img");
const xrayRightImg = document.getElementById("xray-right-img");

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

function updateXrayImagesVisibility() {
  const xrayOn = document
    .getElementById("xray-button")
    .parentNode.classList.contains("turn-on");

  const magneticOn = document
    .getElementById("magnetic-button")
    .parentNode.classList.contains("turn-on");

  // CASE 1: X-ray ON + Magnetic OFF → show LOTTIE
  if (xrayOn && !magneticOn) {
    xrayLeftContainer.style.display = "block";
    xrayRightContainer.style.display = "block";

    xrayLeftImg.style.display = "none";
    xrayRightImg.style.display = "none";
    return;
  }

  // CASE 2: X-ray ON + Magnetic ON → show IMAGES
  if (xrayOn && magneticOn) {
    xrayLeftContainer.style.display = "none";
    xrayRightContainer.style.display = "none";

    xrayLeftImg.style.display = "block";
    xrayRightImg.style.display = "block";
    return;
  }

  // CASE 3: X-ray OFF → hide everything
  xrayLeftContainer.style.display = "none";
  xrayRightContainer.style.display = "none";
  xrayLeftImg.style.display = "none";
  xrayRightImg.style.display = "none";
}



  const pinLeftAnim = lottie.loadAnimation({
    container: document.getElementById("pin-left-animation"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "pin-animation.json",
  });

  const pinRightAnim = lottie.loadAnimation({
    container: document.getElementById("pin-right-animation"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "pin-animation.json",
  });

  const pinLeftAnimOne = lottie.loadAnimation({
    container: document.getElementById("pin-left-animation-one"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "pin-animation.json",
  });

  const pinRightAnimTwo = lottie.loadAnimation({
    container: document.getElementById("pin-right-animation-two"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "pin-animation.json",
  });
  /* ------------------------------------------------------
      GLOBAL RESET BUTTON
--------------------------------------------------------- */

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      /* 1️⃣ Turn off ALL buttons */
      document.querySelectorAll(".button-inner-wrapper").forEach((w) => {
        w.classList.remove("turn-on");
      });

      document.body.classList.remove("active");

      /* 2️⃣ Reset MATERIAL blocks to default */
      document.querySelectorAll(".material-block").forEach((el) => {
        el.classList.remove("hard-pole", "soft-pole");
        el.classList.add("hard-material", "soft-material");
      });

      /* 3️⃣ Hide pole names */
      document.querySelectorAll(".pole-names").forEach((el) => {
        el.style.display = "none";
      });

      /* 4️⃣ Hide labels */
      document.querySelectorAll(".label-main").forEach((el) => {
        el.style.display = "none";
      });

      /* 5️⃣ Hide X-Ray containers */
      xrayLeftContainer.style.display = "none";
      xrayRightContainer.style.display = "none";

      if (xrayLeftAnim) xrayLeftAnim.stop();
      if (xrayRightAnim) xrayRightAnim.stop();

      /* 6️⃣ Stop arrow animation */
      document.getElementById("arrow-container").style.display = "none";
      arrowAnim.stop();

      /* 7️⃣ Reset ALL pin animations to first frame */
      [pinLeftAnim, pinRightAnim, pinLeftAnimOne, pinRightAnimTwo].forEach(
        (anim) => {
          if (anim) {
            anim.stop();
            anim.goToAndStop(0, true);
          }
        }
      );

      resetBtn.disabled = true;
    });
  }

  

  /* ---------------------------------------------
       EXISTING BUTTON LOGIC (UNCHANGED)
  --------------------------------------------- */

  const buttons = document.querySelectorAll(".js-button");

  buttons.forEach((button) => {
    button.addEventListener("click", function (event) {
      resetBtn.disabled = false;

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
        updateXrayImagesVisibility();

        // ⭐ NEW: remove material classes
        document.querySelectorAll(".material-block").forEach((el) => {
          el.classList.remove("hard-material", "soft-material");
          el.classList.add("hard-pole", "soft-pole");
        });

        document.querySelectorAll(".pole-names").forEach((el) => {
          el.style.display = "block";
        });

        if (isTurningOn) {

            document.getElementById("material-btn").style.visibility = "hidden";

          // NEW PIN ANIMATIONS (play forward)
          pinLeftAnimOne.stop();
          pinRightAnimTwo.stop();

          setTimeout(() => {
            pinLeftAnimOne.setDirection(1);
            pinRightAnimTwo.setDirection(1);

            pinLeftAnimOne.goToAndPlay(0, true);
            pinRightAnimTwo.goToAndPlay(0, true);
          }, 50);

          document.getElementById("arrow-container").style.display = "block";
          arrowAnim.stop();

          setTimeout(() => arrowAnim.goToAndPlay(0, true), 50);

          pinLeftAnim.stop();
          pinRightAnim.stop();

          // Play forward
          setTimeout(() => {
            pinLeftAnim.setDirection(1);
            pinRightAnim.setDirection(1);

            pinLeftAnim.goToAndPlay(0, true);
            pinRightAnim.goToAndPlay(0, true);
          }, 50);

          // ⭐ Play reverse after 1 second
        } else {
          // ⭐ Reverse MAIN pin animations
          pinLeftAnim.setDirection(-1);
          pinRightAnim.setDirection(-1);

          pinLeftAnim.goToAndPlay(pinLeftAnim.totalFrames - 1, true);
          pinRightAnim.goToAndPlay(pinRightAnim.totalFrames - 1, true);

          // ⭐ UPDATED MATERIAL CLASS LOGIC
          const left = document.getElementById("left-material");
          const right = document.getElementById("right-material");

          [left, right].forEach((el) => {
            el.classList.remove(
              "hard-pole",
              "soft-pole",
              "hard-material",
              "soft-material"
            );
          });

          left.classList.add("soft-pole");
          right.classList.add("hard-material");

            document.getElementById("material-btn").style.visibility = "visible";


          document.getElementById("arrow-container").style.display = "none";
          document.querySelectorAll(".pole-names").forEach((el) => {
            el.style.display = "none";
          });
        }
      }

      /* ---------------------------------------------
           X-RAY BUTTON CLICKED
      --------------------------------------------- */

      if (event.target.id === "xray-button") {
        updateXrayImagesVisibility();

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
        } else {
          document.querySelectorAll(".label-main").forEach((el) => {
            el.style.display = "none";
          });
        }
      }
    });
  });
});
