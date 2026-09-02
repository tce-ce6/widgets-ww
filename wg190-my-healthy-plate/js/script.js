
(function(){
"use strict";

const RESULT_DATA = {
  "nutrients": {
    "carbohydrate": {
      "low": {
        "value": "Low",
        "message": "My carbohydrates meter is still low. Look for foods with more carbohydrates stars."
      },
      "high": {
        "value": "Excess",
        "message": "My carbohydrates meter has too much — try swapping some of the foods."
      },
      "justRight": {
        "value": "Sufficient"
      }
    },
    "protein": {
      "low": {
        "value": "Low",
        "message": "My proteins meter is low. Look for foods with more proteins stars."
      },
      "high": {
        "value": "Excess",
        "message": "My proteins meter has too much — try swapping some of the foods."
      },
      "justRight": {
        "value": "Sufficient"
      }
    },
    "vitamin": {
      "low": {
        "value": "Low",
        "message": "My vitamins and minerals meter is still low. Look for foods with more vitamins and minerals stars."
      },
      "high": {
        "value": "Excess",
        "message": "My vitamins and minerals meter has too much — try swapping some of the foods."
      },
      "justRight": {
        "value": "Sufficient"
      }
    }
  },
  "overallResults": {
    "allSufficient": {
      "message": "Hooray! A super plate — everything just right!",
      "badge": "🥇 Balanced Plate Champion Badge",
      "stars": 5
    },
    "allSufficientWithOneTreat": {
      "message": "You fitted in one treat and still balanced your plate. Smart!",
      "badge": "🥇 Balanced Plate Champion Badge",
      "stars": 5
    },
    // "anyLow": {
    //   "message": "Nutrient meter is still low. Look for foods with more nutrients stars."
    // },
    // "anyExcess": {
    //   "message": "Nutrient meter has too much — try swapping some of the foods."
    // },
    "allHigh": {
      "message": "All the nutrient meters have too much – try swapping some of the foods."
    },
    "allLow": {
      "message": "All the nutrient meters are still low – try swapping some of the foods."
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var pages = {
    intro: document.getElementById("intro-page"),
    activity: document.getElementById("activity-page"),
    summary: document.getElementById("summary-page")
  };
  var selected = [];
  var foodData = {};
  var MAX_FOODS = 6;
  var LEVEL_COLOURS = {
    low: "#3e93f3",
    medium: "#f3dd15",
    high: "#ff0fc6"
  };
  var YELLOW_LINE_Y = 573;
  var PINK_LINE_Y = 524;

  function getFoodImageSrc(id) {
    var map = {
      rice: "rice", idli: "idli", milk: "milk", carrot: "carrot", french_fries: "french-fries",
      dal: "dal", banana: "banana", pizza: "pizza", roti: "roti", egg: "egg", orange: "orange",
      samosa: "samosa", fish: "fish", poha: "poha", paneer: "paneer", Guava: "guava",
      noodles: "noodles", chicken: "chicken", potato: "potato", curd: "curd",
      cold_drink: "cold-drink", rajma: "rajma", burger: "burger", chocolate: "chocolate",
      jaebi: "jalebi", ice_cream: "ice-cream", cream_biscuit: "cream-biscuit"
    };
    var file = map[id];
    return file ? "assets/image/elements/" + file + ".svg" : "";
  }

  function updatePlateImages() {
    var imgs = document.querySelectorAll("#full-plate img");
    Array.prototype.forEach.call(imgs, function (img, index) {
      var id = selected[index];
      var src = id ? getFoodImageSrc(id) : "";
      img.removeAttribute("src");
      if (id && src) img.setAttribute("src", src);
      img.style.display = id && src ? "block" : "none";
    });
  }

  var meterSettings = {
    carbs: { fill: "meter_fill_1", arrow: "carbohydrate-arrow", x: 127.23, max: 24, low: 7, high: 9, summary: "carbohydrates", text: "carbohydrates-txt" },
    protein: { fill: "meter_fill_2", arrow: "protein-arrow", x: 307.23, max: 26, low: 7, high: 10, summary: "proteins", text: "proteins-txt" },
    vitamins: { fill: "meter_fill_3", arrow: "vitamin-arrow", x: 508.23, max: 48, low: 14, high: 20, summary: "vitamins", text: "vitamins-txt" }
  };

  function showPage(name) {
    Object.keys(pages).forEach(function (key) {
      pages[key].style.display = key === name ? "block" : "none";
    });
  }

  function totals() {
    return selected.reduce(function (sum, id) {
      var food = foodData[id];
      sum.carbs += food.carbs;
      sum.protein += food.protein;
      sum.vitamins += food.vitamins;
      return sum;
    }, { carbs: 0, protein: 0, vitamins: 0 });
  }

  function statusFor(value, setting) {
    return value < setting.low ? "Low" : value > setting.high ? "Excess" : "Just right";
  }

  function updateMeter(key, value) {
    var setting = meterSettings[key];
    var fill = document.getElementById(setting.fill);
    var scale = Math.min(value / setting.max, 1);
    var bottom = 671.17;
    var height = 194.96 * scale;
    var fillTop = bottom - height;
    var colour = fillTop <= PINK_LINE_Y ? LEVEL_COLOURS.high : fillTop <= YELLOW_LINE_Y ? LEVEL_COLOURS.medium : LEVEL_COLOURS.low;
    var clipId = "meter-clip-" + key;
    var clip = document.getElementById(clipId);
    if (!clip) {
      clip = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
      clip.id = clipId;
      clip.setAttribute("clipPathUnits", "userSpaceOnUse");
      clip.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "rect"));
      fill.ownerSVGElement.querySelector("defs").appendChild(clip);
    }
    fill.style.display = "block";
    fill.style.setProperty("fill", colour, "important");
    fill.setAttribute("fill", colour);
    fill.removeAttribute("transform");
    fill.setAttribute("clip-path", "url(#" + clipId + ")");
    var clipRect = clip.firstChild;
    clipRect.setAttribute("x", setting.x);
    clipRect.setAttribute("y", bottom - height);
    clipRect.setAttribute("width", "94.3");
    clipRect.setAttribute("height", height);
    var arrow = document.getElementById(setting.arrow);
    if (arrow) {
      arrow.style.setProperty("fill", colour, "important");
      arrow.setAttribute("fill", colour);
      arrow.style.transform = "translateY(" + (-195 * scale) + "px)";
    }
  }

  function setReady(enabled) {
    var button = document.getElementById("plate-ready-btn");
    button.style.opacity = enabled ? "1" : ".45";
    button.style.cursor = enabled ? "pointer" : "not-allowed";
    button.dataset.enabled = enabled ? "true" : "false";
  }

  function setResetEnabled(enabled) {
    var button = document.getElementById("reset-btn");
    button.style.opacity = enabled ? "1" : ".45";
    button.style.cursor = enabled ? "pointer" : "not-allowed";
    button.dataset.enabled = enabled ? "true" : "false";
  }

  function updateActivity() {
    var values = totals();
    Object.keys(meterSettings).forEach(function (key) { updateMeter(key, values[key]); });
    updatePlateImages();
    var full = selected.length === MAX_FOODS;
    Object.keys(foodData).forEach(function (id) {
      var card = document.getElementById(id);
      var isSelected = selected.indexOf(id) !== -1;
      var wrapper = card && card.querySelector("g");
      var borderRects = wrapper ? wrapper.querySelectorAll("rect") : [];
      card.style.opacity = "1";
      // Once all 6 foods are selected, disable the remaining (non-selected) cards
      var disabled = full && !isSelected;
      card.dataset.disabled = disabled ? "true" : "false";
      card.style.pointerEvents = disabled ? "none" : "auto";
      card.style.opacity = disabled ? ".45" : "1";
      Array.prototype.forEach.call(borderRects, function (border) {
        border.style.setProperty("stroke", isSelected ? "#1dbf4d" : "", "important");
        border.style.setProperty("stroke-width", isSelected ? "4" : "", "important");
        border.style.strokeLinejoin = "round";
      });
    });
    document.getElementById("girl-popup").style.display = full ? "block" : "none";
    document.getElementById("girl-popup-msg").style.display = full ? "block" : "none";
    setReady(full);
    setResetEnabled(selected.length > 0);
  }

  function resetPlate() {
    selected = [];
    updateActivity();
  }

  function updateSummary() {
    var values = totals();
    var nutrientKeys = { carbs: "carbohydrate", protein: "protein", vitamins: "vitamin" };
    var labelByKey = { carbs: "Carbohydrates", protein: "Proteins", vitamins: "Vitamins & minerals" };
    var badgeClassByKey = { carbs: "carbohydrates", protein: "proteins", vitamins: "vitamins-minerals" };
    var levels = {};

    Object.keys(meterSettings).forEach(function (key) {
      var status = statusFor(values[key], meterSettings[key]);
      levels[key] = status === "Low" ? "low" : status === "Excess" ? "high" : "justRight";
    });

    var allLow = levels.carbs === "low" && levels.protein === "low" && levels.vitamins === "low";
    var allHigh = levels.carbs === "high" && levels.protein === "high" && levels.vitamins === "high";
    var allSufficient = levels.carbs === "justRight" && levels.protein === "justRight" && levels.vitamins === "justRight";

    var titleEl = document.querySelector("#feedback-msg .minerals-title");
    var textContainer = document.getElementById("feedback-msg-text-container");

    if (allSufficient) {
      titleEl.textContent = RESULT_DATA.overallResults.allSufficient.message;
      textContainer.style.display = "none";
    } else if (allHigh) {
      titleEl.textContent = RESULT_DATA.overallResults.allHigh.message;
      textContainer.style.display = "none";
    } else if (allLow) {
      titleEl.textContent = RESULT_DATA.overallResults.allLow.message;
      textContainer.style.display = "none";
    } else {
      titleEl.textContent = "Almost there!";
      textContainer.style.display = "block";
    }

    Object.keys(meterSettings).forEach(function (key) {
      var level = levels[key];
      var nutrient = RESULT_DATA.nutrients[nutrientKeys[key]];
      var badge = document.querySelector("#minerals-scale-container .minerals." + badgeClassByKey[key]);
      if (badge) badge.textContent = labelByKey[key] + ": " + nutrient[level].value;

      var txtEl = document.getElementById(meterSettings[key].text);
      if (txtEl) {
        var message = nutrient[level].message;
        if (message) {
          txtEl.textContent = message;
          txtEl.style.display = "block";
        } else {
          txtEl.textContent = "";
          txtEl.style.display = "none";
        }
      }
    });
  }

  function bindFoodCards() {
    Object.keys(foodData).forEach(function (id) {
      var card = document.getElementById(id);
      if (!card) return;
      card.addEventListener("click", function () {
        if (card.dataset.disabled === "true") return;
        var index = selected.indexOf(id);
        if (index !== -1) selected.splice(index, 1);
        else if (selected.length < MAX_FOODS) selected.push(id);
        updateActivity();
      });
    });
  }

  function initialise() {
    bindFoodCards();
    document.getElementById("fill-plate-btn").addEventListener("click", function () { showPage("activity"); });
    document.getElementById("reset-btn").addEventListener("click", resetPlate);
    document.getElementById("plate-ready-btn").addEventListener("click", function () {
      if (this.dataset.enabled !== "true") return;
      updateSummary();
      showPage("summary");
    });
    document.getElementById("try-new-plate-btn").addEventListener("click", function () {
      resetPlate();
      showPage("activity");
    });
    showPage("intro");
    updateActivity();
  }

  showPage("intro");

  fetch("./js/foods.json")
    .then(function (response) { if (!response.ok) throw new Error("Food data could not load"); return response.json(); })
    .then(function (data) { foodData = data; initialise(); })
    .catch(function (error) { console.error(error); });
});

})();
