
(function(){
 
  var scenes = [
    {
      label: "चित्र 1",
      svg: pondScene,
      sentences: [
        {
          words: ["तालाब","के","किनारे","एक","पेड़","है"],
          distractors: ["नदी","बीच","दो","झाड़ी","था"],
          text: "तालाब के किनारे एक पेड़ है।"
        },
        {
          words: ["पेड़","पर","मीठे","फल","लगे","हैं"],
          distractors: ["नीचे","खट्टे","फूल","गिरे","था"],
          text: "पेड़ पर मीठे फल लगे हैं।"
        },
        {
          words: ["बंदर","पेड़","पर","बैठकर","फल","खा","रहा","है"],
          distractors: ["लोमड़ी","नीचे","सोकर","पानी","रही"],
          text: "बंदर पेड़ पर बैठकर फल खा रहा है।"
        },
        {
          words: ["पेड़","के","नीचे","एक","लोमड़ी","आराम","कर","रही","है"],
          distractors: ["तालाब","ऊपर","बंदर","दौड़","रहा"],
          text: "पेड़ के नीचे एक लोमड़ी आराम कर रही है।"
        },
        {
          words: ["तालाब","में","कुछ","मछलियाँ","तैर","रही","हैं"],
          distractors: ["नदी","सारी","कौवे","उड़"],
          text: "तालाब में कुछ मछलियाँ तैर रही हैं।"
        }
      ]
    }
  ];

  var sceneIdx = 0;
  var completed = [];
  var currentIdx = 0;
  var slots = [];
  var refs = {};
  var bank = [];

  function shuffle(arr){
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function currentScene(){ return scenes[sceneIdx]; }
  function currentSentences(){ return currentScene().sentences; }

  function updateMainNextBtn(){
    var hasNextScene = sceneIdx < scenes.length - 1;
    document.getElementById('mainNextBtn').disabled = !hasNextScene;
  }

  function loadScene(idx){
    sceneIdx = idx;
    completed = [];
    currentIdx = 0;
    document.getElementById('sceneLabel').textContent = currentScene().label;
    document.getElementById('mainScene').innerHTML = currentScene().svg;
    document.getElementById('overlayScene').innerHTML = currentScene().svg;
    updateCardStrip();
    updateMainNextBtn();
    hideOverlay();
    startCurrent();
  }

  function startCurrent(){
    var s = currentSentences()[currentIdx];
    slots = new Array(s.words.length).fill(null);
    refs = {};
    var pool = shuffle(s.words.concat(s.distractors));
    bank = pool.map(function(w){ return { word: w, used: false }; });
    document.getElementById('activeNumber').textContent = (currentIdx + 1) + '.';
    document.getElementById('progressLabel').textContent = 'वाक्य ' + (currentIdx + 1) + ' / ' + currentSentences().length;
    document.getElementById('activeRow').classList.remove('correct');
    renderSlots();
    renderBank();
    updateCheckBtn();
  }

  function renderSlots(){
    var container = document.getElementById('activeSlots');
    container.innerHTML = '';
    slots.forEach(function(val, i){
      var el = document.createElement('div');
      el.className = 'slot' + (val ? ' filled' : '');
      el.textContent = val || '';
      el.setAttribute('role','button');
      el.setAttribute('tabindex', val ? '0' : '-1');
      if (val){
        el.addEventListener('click', function(){ removeFromSlot(i); });
        el.addEventListener('keydown', function(e){ if(e.key==='Enter'||e.key===' ') removeFromSlot(i); });
      }
      container.appendChild(el);
    });
  }

  function renderBank(){
    var container = document.getElementById('activeBank');
    container.innerHTML = '';
    bank.forEach(function(tile, ti){
      var btn = document.createElement('button');
      btn.className = 'tile' + (tile.used ? ' used' : '');
      btn.textContent = tile.word;
      btn.type = 'button';
      btn.disabled = tile.used;
      btn.addEventListener('click', function(){ placeTile(ti); });
      container.appendChild(btn);
    });
  }

  function placeTile(tileIndex){
    var emptyIdx = slots.indexOf(null);
    if (emptyIdx === -1) return;
    bank[tileIndex].used = true;
    slots[emptyIdx] = bank[tileIndex].word;
    refs[emptyIdx] = tileIndex;
    renderSlots();
    renderBank();
    updateCheckBtn();
  }

  function removeFromSlot(slotIdx){
    var tileRef = refs[slotIdx];
    if (tileRef !== undefined) bank[tileRef].used = false;
    slots[slotIdx] = null;
    delete refs[slotIdx];
    document.getElementById('activeRow').classList.remove('correct');
    document.querySelectorAll('#activeSlots .slot').forEach(function(s){ s.classList.remove('wrong','right'); });
    renderSlots();
    renderBank();
    updateCheckBtn();
  }

  function updateCheckBtn(){
    var count = slots.filter(function(v){ return v !== null; }).length;
    document.getElementById('checkBtn').disabled = (count !== currentSentences()[currentIdx].words.length);
  }

  function updateCardStrip(){
    var strip = document.getElementById('cardStrip');
    if (completed.length === 0){
      strip.classList.add('hidden');
      return;
    }
    strip.classList.remove('hidden');
    document.getElementById('cardStripText').textContent = completed.length + ' वाक्य बने';
  }

  function checkSentence(){
    var s = currentSentences()[currentIdx];
    var slotEls = document.querySelectorAll('#activeSlots .slot');
    var allCorrect = true;
    for (var i = 0; i < s.words.length; i++){
      if (slots[i] === s.words[i]){
        slotEls[i].classList.add('right');
        slotEls[i].classList.remove('wrong');
      } else {
        slotEls[i].classList.add('wrong');
        allCorrect = false;
      }
    }
    if (allCorrect){
      document.getElementById('activeRow').classList.add('correct');
      document.getElementById('checkBtn').disabled = true;
      completed.push(s.text);
      updateCardStrip();
      setTimeout(function(){
        if (currentIdx < currentSentences().length - 1){
          currentIdx++;
          startCurrent();
        } else {
          showOverlay(true);
        }
      }, 800);
    } else {
      setTimeout(function(){
        document.querySelectorAll('#activeSlots .slot.wrong').forEach(function(el){ el.classList.remove('wrong'); });
      }, 500);
    }
  }

  function renderOverlayList(){
    var list = document.getElementById('overlayList');
    list.innerHTML = '';
    currentSentences().forEach(function(s, i){
      var li = document.createElement('li');
      if (i < completed.length){
        li.textContent = completed[i];
      } else {
        li.textContent = '............';
        li.classList.add('pending');
      }
      list.appendChild(li);
    });
  }

  function showOverlay(isFinal){
    renderOverlayList();
    document.getElementById('gameCard').classList.add('hidden');
    document.getElementById('cardStrip').classList.add('hidden');
    document.getElementById('overlayCard').classList.remove('hidden');
    var hasNextScene = sceneIdx < scenes.length - 1;
    document.getElementById('nextChitraBtn').classList.remove('hidden');
    document.getElementById('nextChitraBtn').disabled = !hasNextScene;
    if (isFinal){
      document.getElementById('overlayTitle').textContent = '🎉 शाबाश! आपने पूरा चित्र वर्णन कर लिया';
      document.getElementById('backBtn').classList.add('hidden');
      document.getElementById('restartBtn').classList.remove('hidden');
    } else {
      document.getElementById('overlayTitle').textContent = 'अब तक बने वाक्य';
      document.getElementById('backBtn').classList.remove('hidden');
      document.getElementById('restartBtn').classList.add('hidden');
    }
  }

  function hideOverlay(){
    document.getElementById('overlayCard').classList.add('hidden');
    document.getElementById('gameCard').classList.remove('hidden');
    if (completed.length > 0) document.getElementById('cardStrip').classList.remove('hidden');
  }

  function restart(){
    loadScene(sceneIdx);
  }

  function goToNextScene(){
    if (sceneIdx < scenes.length - 1){
      loadScene(sceneIdx + 1);
    }
  }

  function speak(text){
    try{
      if (!('speechSynthesis' in window)) return;
      var utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'hi-IN';
      utter.rate = 0.85;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }catch(e){}
  }

  document.getElementById('checkBtn').addEventListener('click', checkSentence);
  document.getElementById('audioBtn').addEventListener('click', function(){
    var partial = slots.filter(function(v){return v;}).join(' ');
    speak(partial || currentSentences()[currentIdx].text);
  });
  document.getElementById('cardStrip').addEventListener('click', function(){ showOverlay(false); });
  document.getElementById('backBtn').addEventListener('click', hideOverlay);
  document.getElementById('restartBtn').addEventListener('click', restart);
  document.getElementById('nextChitraBtn').addEventListener('click', goToNextScene);
  document.getElementById('mainNextBtn').addEventListener('click', goToNextScene);

  loadScene(0);
})();