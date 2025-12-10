document.addEventListener("DOMContentLoaded", () => {
  const torchBtn = document.getElementById("torch-btn");

  const torchAnim = lottie.loadAnimation({
    container: document.getElementById("xray-container"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "xray-lottie.json",
  });

  // Wait for Lottie JSON to load before using frames
  torchAnim.addEventListener("DOMLoaded", () => {
    const totalFrames = torchAnim.totalFrames;
    const durationInSec = torchAnim.getDuration(true);
    const fps = totalFrames / durationInSec;

    const startFrame = 0;
    const endFrame = 50;
    let segmentStarted = false; // 👈 Track if we've started the main segment

  });
  
  const button = document.getElementsByClassName("js-button")[0];
button.addEventListener("click", function (event) {
  let parentNode = event.target.parentNode;
  if (parentNode.classList.contains("turn-on")) {
    event.target.parentNode.classList.remove("turn-on");
    document.body.classList.remove("active");
  } else {
    event.target.parentNode.classList.add("turn-on");
    document.body.classList.add("active");
  }
});


});
