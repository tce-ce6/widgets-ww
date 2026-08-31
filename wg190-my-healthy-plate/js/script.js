
(function(){
"use strict";

/* Star amounts (0-4) from "Nutrients in Foods" reference document. */
var FOODS = {
  rice:    {name:"Rice",       e:"🍚", carb:4, prot:1, vitm:1},
  roti:    {name:"Roti",       e:"🫓", carb:3, prot:2, vitm:2},
  idli:    {name:"Idli",       e:"🍘", carb:3, prot:2, vitm:2},
  poha:    {name:"Poha",       e:"🍛", carb:4, prot:1, vitm:2},
  potato:  {name:"Potato",     e:"🥔", carb:3, prot:1, vitm:2},
  banana:  {name:"Banana",     e:"🍌", carb:3, prot:0, vitm:2},
  milk:    {name:"Milk",       e:"🥛", carb:1, prot:2, vitm:3},
  dal:     {name:"Dal",        e:"🍲", carb:2, prot:3, vitm:3},
  egg:     {name:"Egg",        e:"🥚", carb:0, prot:4, vitm:3},
  curd:    {name:"Curd",       e:"🥣", carb:1, prot:2, vitm:3},
  paneer:  {name:"Paneer",     e:"🧀", carb:1, prot:4, vitm:3},
  rajma:   {name:"Rajma",      e:"🫘", carb:2, prot:3, vitm:3},
  fish:    {name:"Fish",       e:"🐟", carb:0, prot:4, vitm:3},
  chicken: {name:"Chicken",    e:"🍗", carb:0, prot:4, vitm:2},
  carrot:  {name:"Carrot",     e:"🥕", carb:1, prot:0, vitm:4},
  orange:  {name:"Orange",     e:"🍊", carb:2, prot:0, vitm:4},
  palak:   {name:"Palak",      e:"🥬", carb:1, prot:1, vitm:4},
  guava:   {name:"Guava",      e:"🍈", carb:2, prot:0, vitm:4},
  fries:   {name:"French fries", e:"🍟", carb:4, prot:1, vitm:0, junk:true},
  cola:    {name:"Cold drink", e:"🥤", carb:4, prot:0, vitm:0, junk:true},
  choc:    {name:"Chocolate",  e:"🍫", carb:4, prot:1, vitm:1, junk:true},
  samosa:  {name:"Samosa",     e:"🥟", carb:3, prot:1, vitm:1, junk:true},
  icecream:{name:"Ice cream",  e:"🍨", carb:3, prot:1, vitm:1, junk:true},
  noodles: {name:"Noodles",    e:"🍜", carb:4, prot:1, vitm:1, junk:true},
  burger:  {name:"Burger",     e:"🍔", carb:3, prot:1, vitm:1, junk:true},
  pizza:   {name:"Pizza",      e:"🍕", carb:3, prot:1, vitm:1, junk:true},
  jalebi:  {name:"Jalebi",     e:"🥨", carb:4, prot:0, vitm:0, junk:true},
  biscuit: {name:"Cream biscuit", e:"🍪", carb:4, prot:1, vitm:0, junk:true}
};
var TRAY = ["rice","idli","milk","carrot","fries","dal","banana","pizza","roti","egg",
            "orange","samosa","fish","poha","paneer","guava","noodles","chicken","potato","curd","palak",
            "cola","rajma","burger","choc","jalebi","icecream","biscuit"];

var METERS = [
  {key:"carb", name:"Carbohydrates", tag:"Give me energy",          face:"🏃", fill:"var(--carb)", deep:"var(--carb-deep)", lo:7, hi:9,  scale:12},
  {key:"prot", name:"Proteins",      tag:"Build my body",           face:"💪", fill:"var(--prot)", deep:"var(--prot-deep)", lo:7, hi:10, scale:13},
  {key:"vitm", name:"Vitamins & minerals", tag:"Protect me from illnesses", face:"✨", fill:"var(--vitm)", deep:"var(--vitm-deep)", lo:14, hi:20, scale:24}
];

var PICKS = 6;
var picks = [];

var AMOUNT_WORDS = ["no","a little","a moderate amount of","lots of","rich amounts of"];

var metersEl = document.getElementById("meters");
var plateEl = document.getElementById("plate");
var trayEl = document.getElementById("tray");
var picksLeft = document.getElementById("picks-left");
var doneBtn = document.getElementById("done");
var resetBtn = document.getElementById("reset");
var bubble = document.getElementById("bubble");
var announcer = document.getElementById("announcer");
var traySection = document.getElementById("tray-section");
var resultEl = document.getElementById("result");

var SCREENS = ["screen-intro","screen-game","screen-result"];
function showScreen(id){
  SCREENS.forEach(function(s){
    document.getElementById(s).classList.toggle("show", s === id);
  });
  window.scrollTo(0,0);
}

document.getElementById("start").addEventListener("click", function(){
  showScreen("screen-game");
  bubble.textContent = "Tap 6 foods for my plate!";
  announce("Let's build a plate! Tap 6 foods from the tray.");
});

function buildMeters(){
  METERS.forEach(function(m){
    var loPct = (m.lo / m.scale) * 100;
    var hiPct = (m.hi / m.scale) * 100;
    var bandPct = ((m.hi - m.lo) / m.scale) * 100;
    var wrap = document.createElement("div");
    wrap.className = "meter";
    wrap.innerHTML =
      '<span class="face" id="face-'+m.key+'" aria-hidden="true">😴</span>' +
      '<div class="tube" role="img" id="tube-'+m.key+'" aria-label="">' +
        '<div class="band" style="bottom:'+loPct+'%;height:'+bandPct+'%"></div>' +
        '<div class="fill" id="fill-'+m.key+'" style="background:#F0C24B"></div>' +
        '<div class="line lo" style="bottom:'+loPct+'%"></div>' +
        '<div class="line hi" style="bottom:'+hiPct+'%"></div>' +
      '</div>' +
      '<span class="name" style="color:'+m.deep+'">'+m.face+' '+m.name+'</span>' +
      '<span class="tag">'+m.tag+'</span>' +
      '<span class="status low" id="status-'+m.key+'">Low</span>';
    metersEl.appendChild(wrap);
  });
}

function stateOf(m, val){
  if (val < m.lo) return "low";
  if (val > m.hi) return "excess";
  return "ok";
}

function levels(){
  var t = {carb:0,prot:0,vitm:0};
  picks.forEach(function(id){
    t.carb += FOODS[id].carb; t.prot += FOODS[id].prot; t.vitm += FOODS[id].vitm;
  });
  return t;
}

function renderPlate(){
  if (picks.length === 0){
    plateEl.innerHTML = '<span class="empty">Tap foods to fill me!</span>';
    plateEl.setAttribute("aria-label", "Ria's plate is empty.");
    return;
  }
  plateEl.innerHTML = picks.map(function(id){
    return '<span class="pf" title="'+FOODS[id].name+'">'+FOODS[id].e+'</span>';
  }).join("");
  plateEl.setAttribute("aria-label", "Ria's plate has: " + picks.map(function(id){return FOODS[id].name;}).join(", ") + ".");
}

var STATE_FILL = { low:"#F0C24B", ok:"#5FAF62" };

function updateMeters(){
  var t = levels();
  METERS.forEach(function(m){
    var val = Math.min(m.scale, t[m.key]);
    var fill = document.getElementById("fill-"+m.key);
    fill.style.height = (val/m.scale*100) + "%";
    var st = stateOf(m, t[m.key]);
    fill.classList.toggle("excess", st === "excess");
    if (st !== "excess") fill.style.background = STATE_FILL[st];
    var faces = { low:"😴", ok:"😄", excess:"😵" };
    var words = { low:"Low", ok:"Sufficient", excess:"Excess" };
    document.getElementById("face-"+m.key).textContent = faces[st];
    var status = document.getElementById("status-"+m.key);
    status.textContent = words[st];
    status.className = "status " + st;
    var say = st === "ok" ? "just right and happy"
            : st === "excess" ? "too much — that is more than my body needs"
            : "still low — my body needs more "+m.name.toLowerCase();
    document.getElementById("tube-"+m.key).setAttribute("aria-label", m.name+" meter is "+say+".");
  });
}

function dotRow(cls, label, val){
  var stars = "";
  for (var i=0;i<4;i++) stars += '<span class="d'+(i<val?' on':'')+'">'+(i<val?'★':'☆')+'</span>';
  return '<span class="lrow '+cls+'"><span class="lname">'+label+'</span>'+stars+'</span>';
}

function legendHTML(fd){
  return '<span class="legend" aria-hidden="true">' +
    dotRow("carb","C",fd.carb) +
    dotRow("prot","P",fd.prot) +
    dotRow("vitm","V",fd.vitm) +
  '</span>';
}

function profileWords(fd){
  return AMOUNT_WORDS[fd.carb]+" carbohydrates, "+
         AMOUNT_WORDS[fd.prot]+" proteins, and "+
         AMOUNT_WORDS[fd.vitm]+" vitamins and minerals";
}

function buildTray(){
  trayEl.innerHTML = "";
  TRAY.forEach(function(id){
    var fd = FOODS[id];
    var b = document.createElement("button");
    b.className = "food"; b.type = "button";
    b.setAttribute("aria-pressed","false");
    b.setAttribute("aria-label", fd.name+". Gives "+profileWords(fd)+".");
    b.dataset.id = id;
    b.innerHTML =
      '<span class="left">' +
        '<span class="fe" aria-hidden="true">'+fd.e+'</span>' +
        '<span class="fname">'+fd.name+'</span>' +
        '<span class="tick">On my plate ✓</span>' +
      '</span>' +
      legendHTML(fd);
    b.addEventListener("click", onFoodTap);
    trayEl.appendChild(b);
  });
  updatePickUI();
}

function onFoodTap(ev){
  var b = ev.currentTarget;
  var id = b.dataset.id;
  var fd = FOODS[id];
  var idx = picks.indexOf(id);
  if (idx > -1){
    picks.splice(idx,1);
    b.setAttribute("aria-pressed","false");
    announce(fd.name+" removed from the plate.");
  } else {
    if (picks.length >= PICKS) return;
    picks.push(id);
    b.setAttribute("aria-pressed","true");
    announce(fd.name+" added. It gives "+profileWords(fd)+". "+picks.length+" of "+PICKS+" foods on the plate.");
  }
  updatePickUI();
  updateMeters();
  renderPlate();
  liveCoach();
}

function updatePickUI(){
  var left = PICKS - picks.length;
  picksLeft.textContent = left === 0 ? "Plate full!" : ("Pick "+left+" more");
  doneBtn.disabled = left !== 0;
  resetBtn.disabled = picks.length === 0;
  var full = picks.length >= PICKS;
  Array.prototype.forEach.call(trayEl.children, function(b){
    var pressed = b.getAttribute("aria-pressed") === "true";
    b.disabled = full && !pressed;
  });
}

function liveCoach(){
  var t = levels();
  if (picks.length === 0){ bubble.textContent = "Tap 6 foods for my plate!"; return; }
  var excess = METERS.filter(function(m){ return stateOf(m, t[m.key]) === "excess"; });
  var low = METERS.filter(function(m){ return stateOf(m, t[m.key]) === "low"; });
  if (excess.length){
    bubble.textContent = "Oops — my "+excess[0].name.toLowerCase()+" meter has too much now. That is more than my body needs!";
  } else if (low.length){
    bubble.textContent = "My "+low[0].name.toLowerCase()+" meter is still low. Look for foods with more "+low[0].name.toLowerCase()+" stars!";
  } else {
    bubble.textContent = "Every meter is just right and smiling! Tap the big button!";
  }
}

doneBtn.addEventListener("click", function(){
  var t = levels();
  var okCount = METERS.filter(function(m){ return stateOf(m, t[m.key]) === "ok"; }).length;
  var low = METERS.filter(function(m){ return stateOf(m, t[m.key]) === "low"; });
  var excess = METERS.filter(function(m){ return stateOf(m, t[m.key]) === "excess"; });
  var junkPicked = picks.filter(function(id){ return FOODS[id].junk; }).length;
  var big = document.getElementById("result-big");
  var title = document.getElementById("result-title");
  var msg = document.getElementById("result-msg");
  var recap = document.getElementById("result-recap");
  var words = { low:"Low", ok:"Sufficient", excess:"Excess" };
  recap.innerHTML = METERS.map(function(m){
    var st = stateOf(m, t[m.key]);
    return '<span class="chip '+st+'">'+m.name+': '+words[st]+'</span>';
  }).join("");
  if (okCount === 3){
    big.textContent = "🎉🌟🎉";
    title.textContent = "Hooray! A super plate!";
    msg.textContent = junkPicked === 1
      ? "Every meter is just right — and you fitted in one treat and still balanced your plate. Smart planning!"
      : "Carbohydrates, proteins, vitamins and minerals — all just right. Your plate gave my body exactly what it needs!";
  } else {
    big.textContent = excess.length ? "😵" : "😴";
    title.textContent = "Almost there!";
    var parts = [];
    if (low.length){
      var reason = junkPicked >= 2
        ? "Junk foods give mostly carbohydrate stars and hardly any protein or vitamin stars."
        : "Look for foods with more "+low[0].name.toLowerCase()+" stars.";
      parts.push("My "+low.map(function(m){return m.name.toLowerCase();}).join(" and ")+" meter"+(low.length>1?"s are":" is")+" still low. "+reason);
    }
    if (excess.length){
      parts.push("My "+excess.map(function(m){return m.name.toLowerCase();}).join(" and ")+" meter"+(excess.length>1?"s have":" has")+" too much — try swapping some of those foods.");
    }
    msg.textContent = parts.join(" ") + " Try a new plate!";
  }
  showScreen("screen-result");
  announce(title.textContent+" "+msg.textContent);
});

document.getElementById("replay").addEventListener("click", function(){
  picks = [];
  buildTray();
  updateMeters();
  renderPlate();
  showScreen("screen-game");
  bubble.textContent = "A new plate! Tap 6 foods — read the stars to plan it well.";
  announce("New plate started. Pick 6 foods.");
});

resetBtn.addEventListener("click", function(){
  if (picks.length === 0) return;
  picks = [];
  buildTray();
  updateMeters();
  renderPlate();
  bubble.textContent = "Plate cleared! Tap 6 foods to start again.";
  announce("Plate cleared. Pick 6 foods.");
});

function announce(msg){ announcer.textContent = msg; }

buildMeters();
buildTray();
updateMeters();
renderPlate();
})();