
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
  var meterSettings = {
    carbs: { fill: "meter_fill_1", arrow: "carbohydrate-arrow", x: 127.23, max: 24, low: 7, high: 9, colour: "#ff9f22", summary: "carbohydrates", text: "carbohydrates-txt" },
    protein: { fill: "meter_fill_2", arrow: "protein-arrow", x: 307.23, max: 26, low: 7, high: 10, colour: "#27c63b", summary: "proteins", text: "proteins-txt" },
    vitamins: { fill: "meter_fill_3", arrow: "vitamin-arrow", x: 508.23, max: 48, low: 14, high: 20, colour: "#ff0f0f", summary: "vitamins", text: "vitamins-txt" }
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
    fill.style.setProperty("fill", setting.colour, "important");
    fill.setAttribute("fill", setting.colour);
    fill.removeAttribute("transform");
    fill.setAttribute("clip-path", "url(#" + clipId + ")");
    var clipRect = clip.firstChild;
    clipRect.setAttribute("x", setting.x);
    clipRect.setAttribute("y", bottom - height);
    clipRect.setAttribute("width", "94.3");
    clipRect.setAttribute("height", height);
    document.getElementById(setting.arrow).style.transform = "translateY(" + (-195 * scale) + "px)";
  }

  function setReady(enabled) {
    var button = document.getElementById("plate-ready-btn");
    button.style.opacity = enabled ? "1" : ".45";
    button.style.cursor = enabled ? "pointer" : "not-allowed";
    button.dataset.enabled = enabled ? "true" : "false";
  }

  function updateActivity() {
    var values = totals();
    Object.keys(meterSettings).forEach(function (key) { updateMeter(key, values[key]); });
    Object.keys(foodData).forEach(function (id) {
      var card = document.getElementById(id);
      var isSelected = selected.indexOf(id) !== -1;
      var wrapper = card && card.querySelector("g");
      var borderRects = wrapper ? wrapper.querySelectorAll("rect") : [];
      card.style.opacity = "1";
      card.style.filter = isSelected ? "drop-shadow(0 0 10px #22a7a9)" : "";
      Array.prototype.forEach.call(borderRects, function (border) {
        border.style.setProperty("stroke", isSelected ? "#22a7a9" : "", "important");
        border.style.setProperty("stroke-width", isSelected ? "8" : "", "important");
        border.style.strokeLinejoin = "round";
      });
    });
    var full = selected.length === MAX_FOODS;
    document.getElementById("girl-popup").style.display = full ? "block" : "none";
    document.getElementById("girl-popup-msg").style.display = full ? "block" : "none";
    setReady(full);
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
