
(function(){
"use strict";

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

  function statusColour(status) {
    return status === "Just right" ? "#5faf62" : status === "Excess" ? "#f0524c" : "#f2bb40";
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
    var messages = [];
    Object.keys(meterSettings).forEach(function (key) {
      var setting = meterSettings[key];
      var status = statusFor(values[key], setting);
      var label = key === "carbs" ? "Carbohydrates" : key === "protein" ? "Proteins" : "Vitamins & minerals";
      document.getElementById(setting.text).textContent = label + ": " + status;
      document.querySelector("#" + setting.summary + " path").style.fill = statusColour(status);
      messages.push(label + " is " + status.toLowerCase() + " (" + values[key] + ").");
    });
    var feedback = document.getElementById("feedback-msg");
    feedback.querySelectorAll("tspan").forEach(function (node, index) {
      node.textContent = messages[index] || "";
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
