document.addEventListener("DOMContentLoaded", () => {
  const questionsData = [
    {
      firstWord: "વન",
      firstWordSound: "../assets/audio/set-01/van-cr.mp3",
      options: [
        {
          text: "ધન",
          isCorrect: true,
          sound: "../assets/audio/set-01/rh-dhan.mp3",
        },
        {
          text: "મન",
          isCorrect: true,
          sound: "../assets/audio/set-01/rh-man.mp3",
        },
        {
          text: "ભજન",
          isCorrect: true,
          sound: "../assets/audio/set-01/rh-bhajan.mp3",
        },
        {
          text: "ગગન",
          isCorrect: true,
          sound: "../assets/audio/set-01/rh-gagan.mp3",
        },
        {
          text: "પટ",
          isCorrect: false,
          sound: "../assets/audio/set-01/dis-pat.mp3",
        },
        {
          text: "સમ",
          isCorrect: false,
          sound: "../assets/audio/set-01/dis-sam.mp3",
        },
        {
          text: "રમત",
          isCorrect: false,
          sound: "../assets/audio/set-01/dis-ramat.mp3",
        },
        {
          text: "નમ",
          isCorrect: false,
          sound: "../assets/audio/set-01/dis-nam.mp3",
        },
        {
          text: "નામ",
          isCorrect: false,
          sound: "../assets/audio/set-01/dis-naam.mp3",
        },
      ],
    },

    {
      firstWord: "નામ",
      firstWordSound: "../assets/audio/set-02/naam-cr.mp3",
      options: [
        {
          text: "કામ",
          isCorrect: true,
          sound: "../assets/audio/set-02/rh-kaam.mp3",
        },
        {
          text: "રામ",
          isCorrect: true,
          sound: "../assets/audio/set-02/rh-raam.mp3",
        },
        {
          text: "ગામ",
          isCorrect: true,
          sound: "../assets/audio/set-02/rh-gaam.mp3",
        },
        {
          text: "દામ",
          isCorrect: true,
          sound: "../assets/audio/set-02/rh-daam.mp3",
        },
        {
          text: "સાત",
          isCorrect: false,
          sound: "../assets/audio/set-02/dis-saat.mp3",
        },
        {
          text: "ઘર",
          isCorrect: false,
          sound: "../assets/audio/set-02/dis-ghar.mp3",
        },
        {
          text: "ફળ",
          isCorrect: false,
          sound: "../assets/audio/set-02/dis-phal.mp3",
        },
        {
          text: "ઝાડ",
          isCorrect: false,
          sound: "../assets/audio/set-02/dis-jhad.mp3",
        },
        {
          text: "ગાય",
          isCorrect: false,
          sound: "../assets/audio/set-02/dis-gaay.mp3",
        },
      ],
    },
    {
      firstWord: "મોર",
      firstWordSound: "../assets/audio/set-03/mor-cr.mp3",
      options: [
        { text: "દોર", isCorrect: true, sound: "../assets/audio/set-03/rh-dor.mp3" },
        { text: "શોર", isCorrect: true, sound: "../assets/audio/set-03/rh-shor.mp3" },
        { text: "બોર", isCorrect: true, sound: "../assets/audio/set-03/rh-bor.mp3" },
        { text: "જોર", isCorrect: true, sound: "../assets/audio/set-03/rh-jor.mp3" },
        { text: "હાથ", isCorrect: false, sound: "../assets/audio/set-03/dis-hath.mp3" },
        { text: "પાણી", isCorrect: false, sound: "../assets/audio/set-03/dis-pani.mp3" },
        { text: "ફૂલ", isCorrect: false, sound: "../assets/audio/set-03/dis-phul.mp3" },
        { text: "દીવો", isCorrect: false, sound: "../assets/audio/set-03/dis-divo.mp3" },
      ],
    },

    {
      firstWord: "રમવું",
      firstWordSound: "../assets/audio/set-04/ramvu-cr.mp3",
      options: [
        { text: "જમવું", isCorrect: true, sound: "../assets/audio/set-04/rh-jamvu.mp3" },
        { text: "કુદવું", isCorrect: true, sound: "../assets/audio/set-04/rh-kudvu.mp3" },
        { text: "ફરવું", isCorrect: true, sound: "../assets/audio/set-04/rh-farvu.mp3" },
        { text: "હસવું", isCorrect: true, sound: "../assets/audio/set-04/rh-hasvu.mp3" },
        { text: "વહન", isCorrect: false, sound: "../assets/audio/set-04/dis-vahan.mp3" },
        { text: "પાચન", isCorrect: false, sound: "../assets/audio/set-04/dis-pachan.mp3" },
        { text: "નમન", isCorrect: false, sound: "../assets/audio/set-04/dis-naman.mp3" },
        { text: "પોષણ", isCorrect: false, sound: "../assets/audio/set-04/dis-poshan.mp3" },
      ],
    },

    {
      firstWord: "દીકરી",
      firstWordSound: "../assets/audio/set-05/dikri-cr.mp3",
      options: [
        { text: "ચાકરી", isCorrect: true, sound: "../assets/audio/set-05/rh-chakri.mp3" },
        { text: "ચકરી", isCorrect: true, sound: "../assets/audio/set-05/rh-chkari.mp3" },
        { text: "બકરી", isCorrect: true, sound: "../assets/audio/set-05/rh-bakri.mp3" },
        { text: "શકરી", isCorrect: true, sound: "../assets/audio/set-05/rh-shakri.mp3" },
        { text: "કાલ", isCorrect: false, sound: "../assets/audio/set-05/dis-kal.mp3" },
        { text: "કમળ", isCorrect: false, sound: "../assets/audio/set-05/dis-kamal.mp3" },
        { text: "સરકી", isCorrect: false, sound: "../assets/audio/set-05/dis-sarki.mp3" },
        { text: "લપટી", isCorrect: false, sound: "../assets/audio/set-05/dis-lapti.mp3" },
      ],
    },

    {
      firstWord: "લોટો",
      firstWordSound: "../assets/audio/set-06/loto-cr.mp3",
      options: [
        { text: "મોટો", isCorrect: true, sound: "../assets/audio/set-06/rh-moto.mp3" },
        { text: "ખોટો", isCorrect: true, sound: "../assets/audio/set-06/rh-khoto.mp3" },
        { text: "ફોટો", isCorrect: true, sound: "../assets/audio/set-06/rh-photo.mp3" },
        { text: "ગોટો", isCorrect: true, sound: "../assets/audio/set-06/rh-goto.mp3" },
        { text: "આંબો", isCorrect: false, sound: "../assets/audio/set-06/dis-ambo.mp3" },
        { text: "દોરો", isCorrect: false, sound: "../assets/audio/set-06/dis-doro.mp3" },
        { text: "દૂધ", isCorrect: false, sound: "../assets/audio/set-06/dis-dudh.mp3" },
      ],
    },

    {
      firstWord: "રાણી",
      firstWordSound: "../assets/audio/set-07/rani-cr.mp3",
      options: [
        { text: "પાણી", isCorrect: true, sound: "../assets/audio/set-07/rh-pani.mp3" },
        { text: "વાણી", isCorrect: true, sound: "../assets/audio/set-07/rh-vani.mp3" },
        { text: "ઈન્દ્રાણી", isCorrect: true, sound: "../assets/audio/set-07/rh-indrani.mp3" },
        { text: "ભાણી", isCorrect: true, sound: "../assets/audio/set-07/rh-bhani.mp3" },
        { text: "ભણો", isCorrect: false, sound: "../assets/audio/set-07/dis-bhano.mp3" },
        { text: "ગણો", isCorrect: false, sound: "../assets/audio/set-07/dis-gano.mp3" },
        { text: "રણ", isCorrect: false, sound: "../assets/audio/set-07/dis-rann.mp3" },
      ],
    },

    {
      firstWord: "પંગત",
      firstWordSound: "../assets/audio/set-08/pangat-cr.mp3",
      options: [
        { text: "સંગત", isCorrect: true, sound: "../assets/audio/set-08/rh-sangat.mp3" },
        { text: "રંગત", isCorrect: true, sound: "../assets/audio/set-08/rh-rangat.mp3" },
        { text: "અંગત", isCorrect: true, sound: "../assets/audio/set-08/rh-angat.mp3" },
        { text: "પંકજ", isCorrect: false, sound: "../assets/audio/set-08/dis-pankaj.mp3" },
        { text: "ભાલ", isCorrect: false, sound: "../assets/audio/set-08/dis-bhaal.mp3" },
        { text: "ચંચળ", isCorrect: false, sound: "../assets/audio/set-08/dis-chanchal.mp3" },
        { text: "જળ", isCorrect: false, sound: "../assets/audio/set-08/dis-jal.mp3" },
      ],
    },

    {
      firstWord: "ગાડી",
      firstWordSound: "../assets/audio/set-09/gadi-cr.mp3",
      options: [
        { text: "વાડી", isCorrect: true, sound: "../assets/audio/set-09/rh-vadi.mp3" },
        { text: "સાડી", isCorrect: true, sound: "../assets/audio/set-09/rh-sadi.mp3" },
        { text: "નાડી", isCorrect: true, sound: "../assets/audio/set-09/rh-nadi.mp3" },
        { text: "લાડી", isCorrect: true, sound: "../assets/audio/set-09/rh-ladi.mp3" },
        { text: "સગડી", isCorrect: true, sound: "../assets/audio/set-09/rh-sagdi.mp3" },
        { text: "ચકલી", isCorrect: false, sound: "../assets/audio/set-09/dis-chakli.mp3" },
        { text: "સુંવાળી", isCorrect: false, sound: "../assets/audio/set-09/dis-suvali.mp3" },
        { text: "આગ", isCorrect: false, sound: "../assets/audio/set-09/dis-aag.mp3" },
        { text: "પીંછી", isCorrect: false, sound: "../assets/audio/set-09/dis-pinchi.mp3" },
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
  let questionQueue = [];
  let lastRandomQuestion = null;

  const getNextRandomQuestion = () => {
    if (questionQueue.length === 0) {
      questionQueue = questionsData.slice();

      for (let index = questionQueue.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [questionQueue[index], questionQueue[randomIndex]] = [
          questionQueue[randomIndex],
          questionQueue[index],
        ];
      }

      const nextQuestion = questionQueue[questionQueue.length - 1];
      if (nextQuestion === lastRandomQuestion && questionQueue.length > 1) {
        [questionQueue[questionQueue.length - 1], questionQueue[0]] = [
          questionQueue[0],
          questionQueue[questionQueue.length - 1],
        ];
      }
    }

    lastRandomQuestion = questionQueue.pop();
    return lastRandomQuestion;
  };

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

  const populateQuestion = (specificQuestion = null) => {
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
    currentQuestion = specificQuestion || getNextRandomQuestion();

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
                "જે શબ્દ નો ધ્વનિ સાંભળ્યો તેના પ્રાસ મળતા શબ્દો ને સ્પર્શ કરો.";
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
  // 🧪 Function for direct testing from console
  window.testWord = (word) => {
    const q = questionsData.find((item) => item.firstWord === word);
    if (q) {
      if (firstWordTimer) clearTimeout(firstWordTimer);
      stopResultAnimation();
      populateQuestion(q);
      console.log(`Test mode: Loading word "${word}"`);
    } else {
      console.warn(`Test word "${word}" not found.`);
    }
  };

  playBeeIntro();

  // 👉 Direct test for "कमला"
  const startQuest = questionsData.find(q => q.firstWord === "कमला");
  populateQuestion(startQuest);
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
        instruct.textContent = "શબ્દ  ને સ્પર્શ કરો અને ધ્વનિ સાંભળો.";
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
        instruct.textContent = "શબ્દ  ને સ્પર્શ કરો અને ધ્વનિ સાંભળો.";
      }
    });
  }
});
