/* ================= CONFIG ================= */

const padding = { top: 20, right: 40, bottom: 0, left: 0 };
const w = 670 - padding.left - padding.right;
const h = 670 - padding.top - padding.bottom;
const r = Math.min(w, h) / 2;

let rotation = 0;
let oldrotation = 0;
let picked = 100000;
let oldpick = [];

const wheelSoundEl = document.getElementById("wheelSound");
const selectedWordEl = document.getElementById("selectedWord");
const mainWordImg = document.getElementById("main-word");

/* ================= COLORS ================= */

const sliceColors = [
  "#43C200",
  "#FFDD00",
  "#F97325",
  "#FFA600",
  "#C56DFC",
  "#D9D9CC",
];

/* ================= DATA ================= */

const ALL_DATA = [
  { word: "दिन", realWord: "din", opposite: "रात", oppositeWord: "raat" },
  { word: "बड़ा", realWord: "bada", opposite: "छोटा", oppositeWord: "chota" },
  { word: "अच्छा", realWord: "achha", opposite: "बुरा", oppositeWord: "bura" },
  { word: "अंदर", realWord: "andar", opposite: "बाहर", oppositeWord: "bahar" },
  { word: "आना", realWord: "aanaa", opposite: "जाना", oppositeWord: "jaana" },
  { word: "ऊपर", realWord: "upar", opposite: "नीचे", oppositeWord: "niche" },
  { word: "काला", realWord: "kala", opposite: "सफ़ेद", oppositeWord: "safed" },
  { word: "पास", realWord: "paas", opposite: "दूर", oppositeWord: "dur" },
  { word: "गरम", realWord: "garam", opposite: "ठंडा", oppositeWord: "thandaa" },
  { word: "खुश", realWord: "khush", opposite: "दुखी", oppositeWord: "dukhi" },
  { word: "सही", realWord: "sahee", opposite: "गलत", oppositeWord: "galat" },
  {
    word: "नया",
    realWord: "nayaa",
    opposite: "पुराना",
    oppositeWord: "puranaa",
  },
  { word: "आगे", realWord: "aage", opposite: "पीछे", oppositeWord: "piche" },
  { word: "खाली", realWord: "khali", opposite: "भरा", oppositeWord: "bharaa" },
  {
    word: "हल्का",
    realWord: "halkaa",
    opposite: "भारी",
    oppositeWord: "bharee",
  },
  {
    word: "हँसना",
    realWord: "hasanaa",
    opposite: "रोना",
    oppositeWord: "rona",
  },
  { word: "जीत", realWord: "jeet", opposite: "हार", oppositeWord: "haar" },
  { word: "गीला", realWord: "gila", opposite: "सूखा", oppositeWord: "sukha" },
  { word: "तेज़", realWord: "tez", opposite: "धीमा", oppositeWord: "dhima" },
  { word: "साफ़", realWord: "saaf", opposite: "गंदा", oppositeWord: "gandha" },
  { word: "खुला", realWord: "khula", opposite: "बंद", oppositeWord: "band" },
  { word: "एक", realWord: "ek", opposite: "अनेक", oppositeWord: "anek" },
  { word: "दाँए", realWord: "daye", opposite: "बाएँ", oppositeWord: "baye" },
  { word: "सुबह", realWord: "subah", opposite: "शाम", oppositeWord: "shaam" },
  { word: "कोमल", realWord: "komal", opposite: "कठोर", oppositeWord: "kathor" },
  {
    word: "उठना",
    realWord: "uthana",
    opposite: "बैठना",
    oppositeWord: "baithana",
  },
  {
    word: "अँधेरा",
    realWord: "andhera",
    opposite: "उजाला",
    oppositeWord: "ujala",
  },
  { word: "मोटा", realWord: "mota", opposite: "पतला", oppositeWord: "patala" },
  { word: "पूरा", realWord: "pura", opposite: "आधा", oppositeWord: "aadha" },
  { word: "सोना", realWord: "sona", opposite: "जागना", oppositeWord: "jagana" },
];

let data = getRandomSix(ALL_DATA);


const optionTextEls = [
  document.getElementById("option-1"),
  document.getElementById("option-2"),
  document.getElementById("option-3")
];

const optionImgEls = [
  document.getElementById("optionImg-1"),
  document.getElementById("optionImg-2"),
  document.getElementById("optionImg-3")
];



/* ================= HELPERS ================= */

function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

function setOptionsForPickedWord(pickedIndex) {
  const correctItem = data[pickedIndex];

  // ❌ remove correct item from wrong pool
  const wrongPool = ALL_DATA.filter(
    item => item.opposite !== correctItem.opposite
  );

  // 🎲 pick 2 random wrong options
  const wrongOptions = d3.shuffle(wrongPool).slice(0, 2);

  // ✅ final 3 options (object form)
  const finalOptions = d3.shuffle([
    {
      text: correctItem.opposite,
      img: correctItem.oppositeWord,
      correct: true
    },
    {
      text: wrongOptions[0].opposite,
      img: wrongOptions[0].oppositeWord,
      correct: false
    },
    {
      text: wrongOptions[1].opposite,
      img: wrongOptions[1].oppositeWord,
      correct: false
    }
  ]);

  // 🎯 render to DOM
  finalOptions.forEach((opt, i) => {
    // text
    optionTextEls[i].textContent = opt.text;
    optionTextEls[i].dataset.correct = opt.correct;

    // image
    optionImgEls[i].src = `./assets/words/${opt.img}.svg`;
    optionImgEls[i].dataset.correct = opt.correct;
  });
}


function getRandomSix(list) {
  return d3.shuffle(list.slice()).slice(0, 6);
}

function resetWheel() {
  d3.select("#chart svg").remove();
  oldpick = [];
  rotation = 0;
  oldrotation = 0;
  data = getRandomSix(ALL_DATA);
  // re-init wheel if needed
}

/* ================= SVG ================= */

const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", w + padding.left + padding.right)
  .attr("height", h + padding.top + padding.bottom);

const container = svg
  .append("g")
  .attr("class", "chartholder")
  .attr(
    "transform",
    `translate(${w / 2 + padding.left}, ${h / 2 + padding.top})`
  );

const vis = container.append("g");

/* ================= PIE ================= */

const pie = d3.layout
  .pie()
  .sort(null)
  .value(() => 1);
const arc = d3.svg.arc().outerRadius(r);

const arcs = vis
  .selectAll("g.slice")
  .data(pie(data))
  .enter()
  .append("g")
  .attr("class", "slice");

/* ================= PATHS ================= */

arcs
  .append("path")
  .attr("fill", (_, i) => sliceColors[i])
  .attr("d", arc);

/* ================= TEXT ================= */

arcs
  .append("text")
  .attr("class", "slice-text")
  .attr("data-base-transform", (d) => {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;

    return `rotate(${(d.angle * 180) / Math.PI - 90}) translate(${
      d.outerRadius - 50
    }, 15)`;
  })
  .attr("transform", function () {
    return d3.select(this).attr("data-base-transform");
  })
  .attr("text-anchor", "end")
  .style("fill", "#000")
  .style("font-size", "50px")
  .style("font-weight", "600")
  .style("pointer-events", "none")
  .text((_, i) => data[i].word);

/* ================= SPIN ================= */

container.on("click", spin);

function spin() {
  container.on("click", null);
  if (wheelSoundEl) {
    wheelSoundEl.style.display = "none";
  }

  if (oldpick.length === data.length) return;

  const ps = 360 / data.length;
  const rng = Math.floor(Math.random() * 1440 + 360);

  rotation = Math.round(rng / ps) * ps;

  picked = Math.round(data.length - (rotation % 360) / ps);
  picked = picked >= data.length ? picked % data.length : picked;

  if (oldpick.includes(picked)) {
    spin();
    return;
  }

  oldpick.push(picked);
  rotation += 90 - Math.round(ps / 2);

  vis
    .transition()
    .duration(1500)
    .ease("cubic-out")
    .attrTween("transform", rotTween)
    .each("end", () => {
      oldrotation = rotation;

      highlightPickedSlice(picked); // existing scale
      moveSelectedSliceText(picked); // ⭐ text translate only

        if (mainWordImg) {
    mainWordImg.src = `./assets/words/${data[picked].realWord}.svg`;
  }

      if (selectedWordEl) {
        selectedWordEl.textContent = data[picked].word;
      }
      setOptionsForPickedWord(picked);

      if (wheelSoundEl) {
        setTimeout(() => {
          wheelSoundEl.style.display = "block";
        }, 500); // ⏱ 500 ms delay
      }

      container.on("click", spin);
    });
}

/* ================= IMAGES ================= */

container
  .append("image")
  .attr("xlink:href", "./assets/spin-bg.svg")
  .attr("x", -50)
  .attr("y", -50)
  .attr("width", 133.5)
  .attr("height", 103.89)
  .style("cursor", "pointer");

container
  .insert("image", ":first-child")
  .attr("xlink:href", "./assets/wheel-bg.svg")
  .attr("x", -372)
  .attr("y", -370)
  .attr("width", 747.79)
  .attr("height", 747.79)
  .style("cursor", "pointer");

/* ================= ROTATE ================= */

function rotTween() {
  const i = d3.interpolate(oldrotation % 360, rotation);
  return (t) => `rotate(${i(t)})`;
}
function highlightPickedSlice(index) {
  vis
    .selectAll(".slice")
    .transition()
    .duration(500)
    .attr("transform", (d, i) => {
      return i === index ? "scale(1.2)" : "scale(1)";
    });
}

function moveSelectedSliceText(index) {
  vis
    .selectAll(".slice-text")
    .transition()
    .duration(300)
    .style("font-size", (_, i) => (i === index ? "60px" : "50px"))
    .attr("transform", function (_, i) {
      const base = d3.select(this).attr("data-base-transform");

      return i === index ? `${base} translate(-35,10)` : base;
    });
}
