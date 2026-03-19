document.addEventListener("DOMContentLoaded", () => {
  const questionsData = [
    {
      firstWord: "रस",
      firstWordSound: "../assets/audio/set-01/rus-cr.mp3",
      options: [
        {
          text: "बस",
          isCorrect: true,
          sound: "../assets/audio/set-01/bus-cr.mp3",
        },
        {
          text: "फस",
          isCorrect: true,
          sound: "../assets/audio/set-01/fus-cr.mp3",
        },
        {
          text: "नस",
          isCorrect: true,
          sound: "../assets/audio/set-01/nus-cr.mp3",
        },
        {
          text: "कस",
          isCorrect: true,
          sound: "../assets/audio/set-01/kus-cr.mp3",
        },

        {
          text: "खत",
          isCorrect: false,
          sound: "../assets/audio/set-01/khut-wr.mp3",
        },
        {
          text: "कट",
          isCorrect: false,
          sound: "../assets/audio/set-01/cut-wr.mp3",
        },
        {
          text: "नम",
          isCorrect: false,
          sound: "../assets/audio/set-01/num-wr.mp3",
        },
        {
          text: "मन",
          isCorrect: false,
          sound: "../assets/audio/set-01/mun-wr.mp3",
        },
        {
          text: "कश",
          isCorrect: false,
          sound: "../assets/audio/set-01/kush-wr.mp3",
        },
      ],
    },

    {
      firstWord: "फूल",
      firstWordSound: "../assets/audio/set-02/ful-cr.mp3",
      options: [
        {
          text: "धूल",
          isCorrect: true,
          sound: "../assets/audio/set-02/dhul-cr.mp3",
        },
        {
          text: "मूल",
          isCorrect: true,
          sound: "../assets/audio/set-02/mul-cr.mp3",
        },
        {
          text: "कूल",
          isCorrect: true,
          sound: "../assets/audio/set-02/kul-cr.mp3",
        },

        {
          text: "भूत",
          isCorrect: false,
          sound: "../assets/audio/set-02/bhut-wr.mp3",
        },
        {
          text: "मोम",
          isCorrect: false,
          sound: "../assets/audio/set-02/mom-wr.mp3",
        },
        {
          text: "माली",
          isCorrect: false,
          sound: "../assets/audio/set-02/mali-wr.mp3",
        },
        {
          text: "काला",
          isCorrect: false,
          sound: "../assets/audio/set-02/kala-wr.mp3",
        },
        {
          text: "बूट",
          isCorrect: false,
          sound: "../assets/audio/set-02/but-wr.mp3",
        },
        {
          text: "घूम",
          isCorrect: false,
          sound: "../assets/audio/set-02/ghum-wr.mp3",
        },
      ],
    },

    {
      firstWord: "कल",
      firstWordSound: "../assets/audio/set-03/kal-cr.mp3",
      options: [
        {
          text: "पल",
          isCorrect: true,
          sound: "../assets/audio/set-03/pal-cr.mp3",
        },
        {
          text: "चल",
          isCorrect: true,
          sound: "../assets/audio/set-03/chal-cr.mp3",
        },
        {
          text: "फल",
          isCorrect: true,
          sound: "../assets/audio/set-03/fal-cr.mp3",
        },
        {
          text: "हल",
          isCorrect: true,
          sound: "../assets/audio/set-03/hal-cr.mp3",
        },
        {
          text: "नल",
          isCorrect: true,
          sound: "../assets/audio/set-03/nal-cr.mp3",
        },

        {
          text: "मत",
          isCorrect: false,
          sound: "../assets/audio/set-03/mat-wr.mp3",
        },
        {
          text: "फट",
          isCorrect: false,
          sound: "../assets/audio/set-03/fat-wr.mp3",
        },
        {
          text: "बत",
          isCorrect: false,
          sound: "../assets/audio/set-03/bat-wr.mp3",
        },
        {
          text: "नम",
          isCorrect: false,
          sound: "../assets/audio/set-03/nam-wr.mp3",
        },
        {
          text: "नक",
          isCorrect: false,
          sound: "../assets/audio/set-03/nak-wr.mp3",
        },
        {
          text: "पस",
          isCorrect: false,
          sound: "../assets/audio/set-03/pas-wr.mp3",
        },
      ],
    },

    {
      firstWord: "राजा",
      firstWordSound: "../assets/audio/set-04/raja-cr.mp3",
      options: [
        {
          text: "बाजा",
          isCorrect: true,
          sound: "../assets/audio/set-04/baja-cr.mp3",
        },
        {
          text: "ताजा",
          isCorrect: true,
          sound: "../assets/audio/set-04/taja-cr.mp3",
        },
        {
          text: "आजा",
          isCorrect: true,
          sound: "../assets/audio/set-04/aaja-cr.mp3",
        },
        {
          text: "खाजा",
          isCorrect: true,
          sound: "../assets/audio/set-04/khaja-cr.mp3",
        },

        {
          text: "छाता",
          isCorrect: false,
          sound: "../assets/audio/set-04/chata-wr.mp3",
        },
        {
          text: "नाला",
          isCorrect: false,
          sound: "../assets/audio/set-04/nala-wr.mp3",
        },
        {
          text: "पापा",
          isCorrect: false,
          sound: "../assets/audio/set-04/papa-wr.mp3",
        },
        {
          text: "मामा",
          isCorrect: false,
          sound: "../assets/audio/set-04/mama-wr.mp3",
        },
        {
          text: "खाला",
          isCorrect: false,
          sound: "../assets/audio/set-04/khala-wr.mp3",
        },
        {
          text: "टाटा",
          isCorrect: false,
          sound: "../assets/audio/set-04/tata-wr.mp3",
        },
        {
          text: "माना",
          isCorrect: false,
          sound: "../assets/audio/set-04/mana-wr.mp3",
        },
      ],
    },

    {
      firstWord: "सपना",
      firstWordSound: "../assets/audio/set-05/sapna-cr.mp3",
      options: [
        {
          text: "अपना",
          isCorrect: true,
          sound: "../assets/audio/set-05/apna-cr.mp3",
        },
        {
          text: "रचना",
          isCorrect: true,
          sound: "../assets/audio/set-05/rachna-cr.mp3",
        },
        {
          text: "सजना",
          isCorrect: true,
          sound: "../assets/audio/set-05/sajna-cr.mp3",
        },
        {
          text: "मचना",
          isCorrect: true,
          sound: "../assets/audio/set-05/machna-cr.mp3",
        },
        {
          text: "बचना ",
          isCorrect: true,
          sound: "../assets/audio/set-05/bachna-cr.mp3",
        },

        {
          text: "कचरा",
          isCorrect: false,
          sound: "../assets/audio/set-05/kachra-wr.mp3",
        },
        {
          text: "कमला",
          isCorrect: false,
          sound: "../assets/audio/set-05/kamla-wr.mp3",
        },
        {
          text: "बच्चा",
          isCorrect: false,
          sound: "../assets/audio/set-05/bachha-wr.mp3",
        },
        {
          text: "मटका",
          isCorrect: false,
          sound: "../assets/audio/set-05/matka-wr.mp3",
        },
        {
          text: "लड़की",
          isCorrect: false,
          sound: "../assets/audio/set-05/ladki-wr.mp3",
        },
      ],
    },

    {
      firstWord: "शहर",
      firstWordSound: "../assets/audio/set-06/shahar-cr.mp3",
      options: [
        {
          text: "पहर",
          isCorrect: true,
          sound: "../assets/audio/set-06/pahar-cr.mp3",
        },
        {
          text: "लहर",
          isCorrect: true,
          sound: "../assets/audio/set-06/lahar-cr.mp3",
        },
        {
          text: "नहर",
          isCorrect: true,
          sound: "../assets/audio/set-06/nahar-cr.mp3",
        },
        {
          text: "महर",
          isCorrect: true,
          sound: "../assets/audio/set-06/mahar-cr.mp3",
        },
        {
          text: "कहर",
          isCorrect: true,
          sound: "../assets/audio/set-06/kahar-cr.mp3",
        },

        {
          text: "कमल",
          isCorrect: false,
          sound: "../assets/audio/set-06/kamal-wr.mp3",
        },
        {
          text: "पलक",
          isCorrect: false,
          sound: "../assets/audio/set-06/palak-wr.mp3",
        },
        {
          text: "सनम",
          isCorrect: false,
          sound: "../assets/audio/set-06/sanam-wr.mp3",
        },
        {
          text: "कलश",
          isCorrect: false,
          sound: "../assets/audio/set-06/kalash-wr.mp3",
        },
        {
          text: "सरस",
          isCorrect: false,
          sound: "../assets/audio/set-06/saras-wr.mp3",
        },
        {
          text: "कटहल",
          isCorrect: false,
          sound: "../assets/audio/set-06/kathal-wr.mp3",
        },
      ],
    },

    {
      firstWord: "नानी",
      firstWordSound: "../assets/audio/set-07/nani-cr.mp3",
      options: [
        {
          text: "पानी",
          isCorrect: true,
          sound: "../assets/audio/set-07/pani-cr.mp3",
        },
        {
          text: "रानी",
          isCorrect: true,
          sound: "../assets/audio/set-07/rani-cr.mp3",
        },
        {
          text: "कहानी",
          isCorrect: true,
          sound: "../assets/audio/set-07/kahani-cr.mp3",
        },
        {
          text: "पुरानी",
          isCorrect: true,
          sound: "../assets/audio/set-07/purani-cr.mp3",
        },

        {
          text: "नाना",
          isCorrect: false,
          sound: "../assets/audio/set-07/nana-wr.mp3",
        },
        {
          text: "राजा",
          isCorrect: false,
          sound: "../assets/audio/set-07/raja-wr.mp3",
        },
        {
          text: "कविता",
          isCorrect: false,
          sound: "../assets/audio/set-07/kavita-wr.mp3",
        },
        {
          text: "नया",
          isCorrect: false,
          sound: "../assets/audio/set-07/naya-wr.mp3",
        },
        {
          text: "पाना",
          isCorrect: false,
          sound: "../assets/audio/set-07/pana-wr.mp3",
        },
      ],
    },

    {
      firstWord: "कमला",
      firstWordSound: "../assets/audio/set-08/kamla-cr.mp3",
      options: [
        {
          text: "गलमा",
          isCorrect: true,
          sound: "../assets/audio/set-08/galma-cr.mp3",
        },
        {
          text: "विमला",
          isCorrect: true,
          sound: "../assets/audio/set-08/vimla-cr.mp3",
        },
        {
          text: "सरला",
          isCorrect: true,
          sound: "../assets/audio/set-08/sarla-cr.mp3",
        },
        {
          text: "समला",
          isCorrect: true,
          sound: "../assets/audio/set-08/samla-cr.mp3",
        },
        {
          text: "हमला",
          isCorrect: true,
          sound: "../assets/audio/set-08/hamla-cr.mp3",
        },

        {
          text: "सलमा",
          isCorrect: false,
          sound: "../assets/audio/set-08/salma-wr.mp3",
        },
        {
          text: "कगना",
          isCorrect: false,
          sound: "../assets/audio/set-08/kagna-wr.mp3",
        },
        {
          text: "गगन",
          isCorrect: false,
          sound: "../assets/audio/set-08/gagan-wr.mp3",
        },
        {
          text: "सुनता",
          isCorrect: false,
          sound: "../assets/audio/set-08/sunta-wr.mp3",
        },
        {
          text: "लकड़ी",
          isCorrect: false,
          sound: "../assets/audio/set-08/lukdi-wr.mp3",
        },
        {
          text: "ममता",
          isCorrect: false,
          sound: "../assets/audio/set-08/mamta-wr.mp3",
        },
      ],
    },

    {
      firstWord: "रंग",
      firstWordSound: "../assets/audio/set-09/rang-cr.mp3",
      options: [
        {
          text: "भंग",
          isCorrect: true,
          sound: "../assets/audio/set-09/bhang-cr.mp3",
        },
        {
          text: "संग",
          isCorrect: true,
          sound: "../assets/audio/set-09/sang-cr.mp3",
        },
        {
          text: "उमंग",
          isCorrect: true,
          sound: "../assets/audio/set-09/umang-cr.mp3",
        },
        {
          text: "तरंग",
          isCorrect: true,
          sound: "../assets/audio/set-09/tarang-cr.mp3",
        },
        {
          text: "पतंग",
          isCorrect: true,
          sound: "../assets/audio/set-09/patang-cr.mp3",
        },
        {
          text: "पलंग ",
          isCorrect: true,
          sound: "../assets/audio/set-09/palang-cr.mp3",
        },

        {
          text: "रंजन",
          isCorrect: false,
          sound: "../assets/audio/set-09/ranjan-wr.mp3",
        },
        {
          text: "संगम",
          isCorrect: false,
          sound: "../assets/audio/set-09/sangam-wr.mp3",
        },
        {
          text: "दंगल",
          isCorrect: false,
          sound: "../assets/audio/set-09/dangal-wr.mp3",
        },
        {
          text: "रतन",
          isCorrect: false,
          sound: "../assets/audio/set-09/ratan-wr.mp3",
        },
        {
          text: "बंगला",
          isCorrect: false,
          sound: "../assets/audio/set-09/bangla-wr.mp3",
        },
      ],
    },
    {
      firstWord: "लकड़ी",
      firstWordSound: "../assets/audio/set-10/lakdi-cr.mp3",
      options: [
        {
          text: "मकड़ी",
          isCorrect: true,
          sound: "../assets/audio/set-10/makdi-cr.mp3",
        },
        {
          text: "ककड़ी",
          isCorrect: true,
          sound: "../assets/audio/set-10/kakdi-cr.mp3",
        },
        {
          text: "पगड़ी",
          isCorrect: true,
          sound: "../assets/audio/set-10/pagdi-cr.mp3",
        },
        {
          text: "अकड़ी",
          isCorrect: true,
          sound: "../assets/audio/set-10/akdi-cr.mp3",
        },
        {
          text: "जकड़ी",
          isCorrect: true,
          sound: "../assets/audio/set-10/jakdi-cr.mp3",
        },

        {
          text: "रोटी",
          isCorrect: false,
          sound: "../assets/audio/set-10/roti-wr.mp3",
        },
        {
          text: "मोसंबी",
          isCorrect: false,
          sound: "../assets/audio/set-10/mosambi-wr.mp3",
        },
        {
          text: "बिजली",
          isCorrect: false,
          sound: "../assets/audio/set-10/bijli-wr.mp3",
        },
        {
          text: "लड़की",
          isCorrect: false,
          sound: "../assets/audio/set-10/ladki-wr.mp3",
        },
        {
          text: "चलती",
          isCorrect: false,
          sound: "../assets/audio/set-10/chalti-wr.mp3",
        },
        {
          text: "सवारी",
          isCorrect: false,
          sound: "../assets/audio/set-10/sawari-wr.mp3",
        },
      ],
    },
    {
      firstWord: "मिठाई",
      firstWordSound: "../assets/audio/set-11/mithai-cr.mp3",
      options: [
        {
          text: "पिटाई",
          isCorrect: true,
          sound: "../assets/audio/set-11/pitai-cr.mp3",
        },
        {
          text: "खटाई",
          isCorrect: true,
          sound: "../assets/audio/set-11/khatai-cr.mp3",
        },
        {
          text: "चटाई",
          isCorrect: true,
          sound: "../assets/audio/set-11/chatai-cr.mp3",
        },
        {
          text: "चौड़ाई",
          isCorrect: true,
          sound: "../assets/audio/set-11/choudai-cr.mp3",
        },
        {
          text: "पढ़ाई",
          isCorrect: true,
          sound: "../assets/audio/set-11/padhai-cr.mp3",
        },

        {
          text: "खटिया",
          isCorrect: false,
          sound: "../assets/audio/set-11/khatai-cr.mp3",
        },
        {
          text: "साड़ी",
          isCorrect: false,
          sound: "../assets/audio/set-11/sadi-wr.mp3",
        },
        {
          text: "चपाती",
          isCorrect: false,
          sound: "../assets/audio/set-11/chapati-wr.mp3",
        },
        {
          text: "सिमरन",
          isCorrect: false,
          sound: "../assets/audio/set-11/simran-wr.mp3",
        },
        {
          text: "सितार",
          isCorrect: false,
          sound: "../assets/audio/set-11/sitar-wr.mp3",
        },
        {
          text: "दिवाकर",
          isCorrect: false,
          sound: "../assets/audio/set-11/divakar-wr.mp3",
        },
      ],
    },
  ];
  let firstWordTimer = null;
  let isShowingAnswers = false;
  let resultBeeAnim = null;
  let userSelectedMap = {}; // stores user's chosen answers
  let selectedCorrect = 0;
  let totalCorrect = 0;
  let correctSelectedElements = [];
  const optionIds = [
    "option1",
    "option2",
    "option3",
    "option4",
    "option5",
    "option6",
    "option7",
    "option8",
    "option9",
    "option10",
    "option11",
  ];
  const svgContainer = document.getElementById("svg-content");
  if (!svgContainer) return;

  const img = svgContainer.querySelector("img");
  if (!img) return;

  const src = img.getAttribute("src");
  if (!src) return;

  // Fetch the external SVG and replace the <img> with inline SVG so we can attach listeners
  fetch(src)
    .then((res) => res.text())
    .then((svgText) => {
      svgContainer.innerHTML = svgText;
    })
    .catch((err) => console.error("Failed to inline SVG:", err));

  // Populate question and options dynamically on each page load

  // helper to set class on option shell
  const setOptionShellClass = (optionId, className) => {
    const shellId = optionId + "-shell";
    const shell =
      document.getElementById(shellId) ||
      document.querySelector("#svg-content #" + shellId) ||
      document.querySelector("#" + shellId);

    if (!shell) return false;

    // always clear old state first
    shell.classList.remove("correct", "incorrect");

    // ✅ ONLY add class if it's valid
    if (className && className.trim() !== "") {
      shell.classList.add(className);
    }

    return true;
  };

  // helper to play a sound (returns the Audio instance)
  const playSound = (src) => {
    if (!src) return null;

    // Normalize incoming path by stripping leading ./ or ../ segments
    const rel = src.replace(/^(?:\.\/|\.\.\/)*/, "");

    // base path (directory of current page)
    const pageBase = window.location.pathname.replace(/\/[^\/]*$/, "/");

    const candidates = [rel, pageBase + rel, "/" + rel];

    const tryCandidate = async (i) => {
      if (i >= candidates.length) return null;
      const url = candidates[i];
      try {
        const res = await fetch(url, { method: "HEAD" });
        if (res.ok) {
          const a = new Audio(url);
          a.play().catch((err) =>
            console.warn("Audio play prevented or failed for", url, err),
          );
          console.log("Playing audio from", url);
          return a;
        }
      } catch (e) {
        // fetch HEAD failed, try next
      }
      return tryCandidate(i + 1);
    };

    // attempt synchronously but use promises internally
    try {
      // kick off attempts and return a placeholder (caller rarely needs the instance)
      tryCandidate(0).then((a) => {
        if (!a)
          console.warn(
            "Audio not found at candidate locations for",
            src,
            candidates,
          );
      });
    } catch (e) {
      console.warn("Error while attempting to play", src, e);
    }
    return null;
  };

  // preload and play (waits for canplaythrough or times out)
  const preloadAndPlay = async (src, timeout = 3000) => {
    if (!src) return null;
    const rel = src.replace(/^(?:\.\/|\.\.\/)*/, "");
    const pageBase = window.location.pathname.replace(/\/[^\/]*$/, "/");
    const candidates = [rel, pageBase + rel, "/" + rel];

    for (let i = 0; i < candidates.length; i++) {
      const url = candidates[i];
      try {
        const head = await fetch(url, { method: "HEAD" });
        if (!head.ok) continue;
      } catch (e) {
        continue;
      }

      try {
        const audio = new Audio(url);
        audio.preload = "auto";
        return await new Promise((resolve) => {
          let settled = false;
          const clean = () => {
            audio.removeEventListener("canplaythrough", onReady);
            audio.removeEventListener("loadedmetadata", onReady);
            audio.removeEventListener("error", onError);
            clearTimeout(timer);
          };
          const onReady = () => {
            if (settled) return;
            settled = true;
            audio.play().catch(() => { });
            clean();
            resolve(audio);
          };
          const onError = () => {
            if (settled) return;
            settled = true;
            clean();
            resolve(null);
          };
          audio.addEventListener("canplaythrough", onReady);
          audio.addEventListener("loadedmetadata", onReady);
          audio.addEventListener("error", onError);
          // timeout fallback: try to play after timeout even if canplaythrough didn't fire
          const timer = setTimeout(() => {
            if (settled) return;
            settled = true;
            audio.play().catch(() => { });
            clean();
            resolve(audio);
          }, timeout);
        });
      } catch (e) {
        continue;
      }
    }
    console.warn("No playable audio candidate found for", src);
    return null;
  };

  // simple path normalizer used for caching/preloading
  const normalizePath = (src) =>
    src ? src.replace(/^(?:\.\/|\.\.\/)*/, "") : src;

  // audio cache for preloaded Audio objects keyed by normalized path
  const audioCache = {};

  const playStarAnimation = (optionEl) => {
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
  let currentQuestion = null;
  let optionElementsMap = {}; // store optionId → optionData

  let beeIntroAnim = null;

  const playBeeIntro = () => {
    const beeContainer = document.getElementById("bee-intor");
    const wrapper = document.getElementById("lottie-wrapper");

    if (!beeContainer || !window.lottie) return;

    // show wrapper again
    if (wrapper) wrapper.style.display = "block";

    // destroy previous animation
    if (beeIntroAnim) {
      beeIntroAnim.destroy();
      beeIntroAnim = null;
    }

    // reset container
    beeContainer.innerHTML = "";

    const candidates = [
      "./lottie/bee-ntro.json",
      "./lottie/bee-intro.json",
      "./assets/bee-ntro.json",
      "./assets/bee-intro.json",
    ];

    const tryLoad = (i) => {
      if (i >= candidates.length) {
        console.warn("bee intro Lottie not found");
        return;
      }

      fetch(candidates[i])
        .then((res) => {
          if (!res.ok) throw new Error("not found");
          return res.json();
        })
        .then((animationData) => {
          beeIntroAnim = window.lottie.loadAnimation({
            container: beeContainer,
            renderer: "svg",
            loop: false,
            autoplay: true,
            animationData,
          });

          beeIntroAnim.addEventListener("complete", () => {
            if (wrapper) wrapper.style.display = "none";
          });
        })
        .catch(() => tryLoad(i + 1));
    };

    tryLoad(0);
  };

  const populateQuestion = () => {
    // 🔒 Disable Show Answer until firstWord is clicked
    const showAnsBtn = document.getElementById("showAns-btn");

    isShowingAnswers = false;
    userSelectedMap = {};
    optionElementsMap = {};

    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
      resetBtn.classList.add("disabled");
      resetBtn.style.pointerEvents = "none";
      resetBtn.style.opacity = "0.5";
    }

    if (showAnsBtn) {
      showAnsBtn.classList.add("disabled");
      showAnsBtn.style.pointerEvents = "none";
      showAnsBtn.style.opacity = "0.5"; // optional visual
    }
    if (showAnsBtn) {
      showAnsBtn.setAttribute("src", "./assets/show-ans.svg");
    }
    // 🧹 clear previous stars, classes, clicks
    document.querySelectorAll(".star-lottie").forEach((el) => el.remove());

    document.querySelectorAll(".options-txt").forEach((el) => {
      el.classList.remove("answered");
      el.style.pointerEvents = "auto";
    });

    // remove shell classes
    [
      "option1",
      "option2",
      "option3",
      "option4",
      "option5",
      "option6",
      "option7",
      "option8",
      "option9",
      "option10",
      "option11",
    ].forEach((id) => setOptionShellClass(id, ""));

    const firstShell = document.getElementById("firstWord-shell");
    if (firstShell) firstShell.classList.remove("active");

    totalCorrect = 0;
    selectedCorrect = 0;
    correctSelectedElements = [];
    currentQuestion =
      questionsData[Math.floor(Math.random() * questionsData.length)];

    const q = currentQuestion;
    if (!q) return;

    totalCorrect = q.options.filter((o) => o.isCorrect).length;
    selectedCorrect = 0;

    const firstEl = document.getElementById("firstWord");
    if (firstEl) {
      firstEl.textContent = q.firstWord || "";
      if (q.firstWordSound) {
        firstEl.dataset.sound = q.firstWordSound;
        if (firstEl) {
          firstEl.textContent = q.firstWord || "";

          if (q.firstWordSound) {
            firstEl.dataset.sound = q.firstWordSound;
          }

          firstEl.style.display = "none";

          // 👉 PLAY SOUND ON CLICK
          firstEl.onclick = () => {
            // 🔓 Enable Show Answer now (only if not finished)
            const showAnsBtn = document.getElementById("showAns-btn");
            if (showAnsBtn && selectedCorrect !== -999) {
              showAnsBtn.classList.remove("disabled");
              showAnsBtn.style.pointerEvents = "auto";
              showAnsBtn.style.opacity = "1";
            }
            // 🔓 unlock audio (important for mobile browsers)
            unlockAudio();

            // 🔊 play sound
            if (firstEl.dataset.sound) {
              playSound(firstEl.dataset.sound);
            }

            // ✏️ Change instruction text AFTER click
            const instruct = document.getElementById("itext-content");
            if (instruct) {
              instruct.textContent =
                "जो शब्द सुना उसके समान तुक वाले शब्दों को टैप करें।";
            }

            // 🌟 Show all options now (with 500ms delay)
            setTimeout(() => {
              optionIds.forEach((id) => {
                const el = document.getElementById(id);
                if (el && el.textContent.trim()) {
                  el.style.display = "block";
                }
              });
            }, 1000);

            // 🎯 add active class to shell
            const shell = document.getElementById("firstWord-shell");
            if (shell) shell.classList.add("active");
          };
        }
      }
      firstEl.style.display = "none";
    }

    if (firstEl) {
      firstEl.style.display = "none";
    }

    // shuffle options
    const shuffled = q.options
      ? q.options.slice().sort(() => 0.5 - Math.random())
      : [];

    optionIds.forEach((id, idx) => {
      const el = document.getElementById(id);
      const opt = shuffled[idx];
      if (!el) return;
      if (opt) {
        optionElementsMap[id] = opt;
        el.textContent = opt.text || "";
        el.dataset.isCorrect = opt.isCorrect ? "1" : "0";
        if (opt.sound) el.dataset.sound = opt.sound;
        el.style.display = "none";
        // attach click handler to mark shell correct/incorrect and play sound
        el.onclick = () => {
          // 🔊 ALWAYS PLAY SOUND (even after completion)
          if (el.dataset.sound) playSound(el.dataset.sound);

          // ❗ If already answered → don't evaluate again
          if (el.classList.contains("answered")) return;

          el.classList.add("answered");
          userSelectedMap[id] = {
            isCorrect: el.dataset.isCorrect === "1",
          };
          const isCorrect = el.dataset.isCorrect === "1";
          const cls = isCorrect ? "correct" : "incorrect";

          if (isCorrect) {
            selectedCorrect++;
            correctSelectedElements.push(el);
          }

          // apply visual shell
          setOptionShellClass(id, cls);

          // 🔓 Enable Reset button on first selection
          const resetBtn = document.getElementById("reset-btn");
          if (resetBtn && selectedCorrect !== -999) {
            resetBtn.classList.remove("disabled");
            resetBtn.style.pointerEvents = "auto";
            resetBtn.style.opacity = "1";
          }

          // ✅ Only run result logic ONCE
          if (selectedCorrect === totalCorrect) {
            // prevent re-triggering again
            selectedCorrect = -999;

            // 🔒 Disable Show Answer when all correct words collected
            const showAnsBtn = document.getElementById("showAns-btn");
            if (showAnsBtn) {
              showAnsBtn.classList.add("disabled");
              showAnsBtn.style.pointerEvents = "none";
              showAnsBtn.style.opacity = "0.5";
            }

            const resetBtn = document.getElementById("reset-btn");
            if (resetBtn) {
              resetBtn.classList.add("disabled");
              resetBtn.style.pointerEvents = "none";
              resetBtn.style.opacity = "0.5";
            }

            correctSelectedElements.forEach((optEl, index) => {
              setTimeout(() => {
                playStarAnimation(optEl);
              }, index * 150);
            });

            setTimeout(() => {
              showResultAnimation();
            }, 800);
          }
        };
      } else {
        el.textContent = "";
        el.removeAttribute("data-is-correct");
        el.removeAttribute("data-sound");
        el.style.display = "none";
      }
    });

    // Show instruction immediately
    const instruct = document.getElementById("itext-content");
    if (instruct) instruct.style.display = "block";

    // ⏱ Show firstWord after 3 seconds
    if (firstWordTimer) clearTimeout(firstWordTimer);

    firstWordTimer = setTimeout(() => {
      if (firstEl) {
        firstEl.style.display = "block";

        // ⭐ add active class when word becomes visible
        const addActiveToShell = () => {
          const shell =
            document.getElementById("firstWord-shell") ||
            document.querySelector("#svg-content #firstWord-shell");

          if (shell) {
            shell.classList.add("active");
            return true;
          }
          return false;
        };

        // Try immediately
        if (!addActiveToShell()) {
          // Retry if SVG not yet ready
          let attempts = 0;
          const iv = setInterval(() => {
            attempts++;
            if (addActiveToShell() || attempts > 20) {
              clearInterval(iv);
            }
          }, 100);
        }
      }
    }, 3000);
  };
  playBeeIntro();
  populateQuestion();
  let audioUnlocked = false;

  const stopResultAnimation = () => {
    const resultWrapper = document.getElementById("result-wrapper");
    const resultContainer = document.getElementById("result-bee");

    if (resultBeeAnim) {
      resultBeeAnim.destroy(); // stop animation
      resultBeeAnim = null;
    }

    if (resultContainer) resultContainer.innerHTML = "";
    if (resultWrapper) resultWrapper.style.display = "none";
  };
  const unlockAudio = () => {
    if (audioUnlocked) return;

    const silent = new Audio();
    silent.src = "data:audio/mp3;base64,//uQZAAAAAAAAAAAAAAAAAAAA"; // tiny silent sound
    silent.play().catch(() => { });
    audioUnlocked = true;

    document.removeEventListener("click", unlockAudio);
    document.removeEventListener("touchstart", unlockAudio);
  };
  const showResultAnimation = () => {
    const resultWrapper = document.getElementById("result-wrapper");
    const resultContainer = document.getElementById("result-bee");

    if (!resultWrapper || !resultContainer) return;

    resultWrapper.style.display = "block";

    // clear previous animation if any
    resultContainer.innerHTML = "";

    if (window.lottie) {
      // destroy previous if exists
      if (resultBeeAnim) {
        resultBeeAnim.destroy();
        resultBeeAnim = null;
      }

      resultBeeAnim = window.lottie.loadAnimation({
        container: resultContainer,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "./lottie/bee-thumb.json",
      });

      resultBeeAnim.addEventListener("complete", () => {
        resultWrapper.style.display = "none";
      });
    }
  };

  const newBtn = document.getElementById("newWords-btn");

  if (newBtn) {
    newBtn.addEventListener("click", () => {
      stopResultAnimation(); // 🛑 hide bee-thumb immediately

      playBeeIntro(); // 🐝 intro animation
      populateQuestion(); // load new question

      const instruct = document.getElementById("itext-content");
      if (instruct) {
        instruct.textContent = "शब्द को टैप करें और ऑडियो सुनें।";
      }
    });
  }

  const showAnsBtn = document.getElementById("showAns-btn");

  if (showAnsBtn) {
    showAnsBtn.addEventListener("click", () => {
      // ================================
      // 👉 IF ANSWERS ARE HIDDEN → SHOW THEM
      // ================================
      if (!isShowingAnswers) {
        isShowingAnswers = true;

        // 🔁 change icon to HIDE
        showAnsBtn.setAttribute("src", "./assets/hide-ans.svg");

        Object.keys(optionElementsMap).forEach((id) => {
          const el = document.getElementById(id);
          const opt = optionElementsMap[id];
          if (!el || !opt) return;

          el.style.display = "block";

          if (opt.isCorrect) {
            setOptionShellClass(id, "correct");
            playStarAnimation(el);
          } else {
            setOptionShellClass(id, "incorrect");
          }

          el.style.pointerEvents = "none";
        });

      }

      // ================================
      // 👉 IF ANSWERS ARE SHOWN → HIDE THEM
      // ================================
      else {
        isShowingAnswers = false;

        // 🔁 change icon back to SHOW
        showAnsBtn.setAttribute("src", "./assets/show-ans.svg");

        // remove stars
        document.querySelectorAll(".star-lottie").forEach((el) => el.remove());

        Object.keys(optionElementsMap).forEach((id) => {
          const el = document.getElementById(id);
          if (!el) return;

          // Was this option previously selected by user?
          if (userSelectedMap[id]) {
            el.classList.add("answered");

            const cls = userSelectedMap[id].isCorrect ? "correct" : "incorrect";

            setOptionShellClass(id, cls);
          } else {
            // user never touched this option
            el.classList.remove("answered");
            setOptionShellClass(id, "");
          }

          el.style.pointerEvents = "auto"; // allow interaction again
        });


      }
    });
  }
  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      // 🧹 Reset trial state
      userSelectedMap = {};
      selectedCorrect = 0;
      correctSelectedElements = [];

      // 🧹 UI cleanup (stars and selection visuals)
      document.querySelectorAll(".star-lottie").forEach((el) => el.remove());
      document.querySelectorAll(".options-txt").forEach((el) => {
        el.classList.remove("answered");
        el.style.pointerEvents = "auto";
        el.style.display = "none"; // 🔒 Hide options again
      });

      optionIds.forEach((id) => setOptionShellClass(id, ""));

      // 🐝 Intro animation
      playBeeIntro();

      // 🧹 Hide firstWord and re-run the 3-second timer (as like default)
      const firstEl = document.getElementById("firstWord");
      if (firstEl) {
        firstEl.style.display = "none";
        const firstShell = document.getElementById("firstWord-shell");
        if (firstShell) firstShell.classList.remove("active");

        if (firstWordTimer) clearTimeout(firstWordTimer);
        firstWordTimer = setTimeout(() => {
          firstEl.style.display = "block";

          // ⭐ add active class when word becomes visible
          const addActiveToShell = () => {
            const shell =
              document.getElementById("firstWord-shell") ||
              document.querySelector("#svg-content #firstWord-shell");

            if (shell) {
              shell.classList.add("active");
              return true;
            }
            return false;
          };

          // Try immediately
          if (!addActiveToShell()) {
            let attempts = 0;
            const iv = setInterval(() => {
              attempts++;
              if (addActiveToShell() || attempts > 20) {
                clearInterval(iv);
              }
            }, 100);
          }
        }, 3000);
      }

      // 🔒 Reset Show Answer button to initial state
      const showAnsBtn = document.getElementById("showAns-btn");
      if (showAnsBtn) {
        showAnsBtn.classList.add("disabled");
        showAnsBtn.style.pointerEvents = "none";
        showAnsBtn.style.opacity = "0.5";
        showAnsBtn.setAttribute("src", "./assets/show-ans.svg");
      }

      // 🔒 Disable reset again
      resetBtn.classList.add("disabled");
      resetBtn.style.pointerEvents = "none";
      resetBtn.style.opacity = "0.5";

      // ✏️ Reset instruction text
      const instruct = document.getElementById("itext-content");
      if (instruct) {
        instruct.textContent = "शब्द को टैप करें और ऑडियो सुनें।";
      }
    });
  }
});
