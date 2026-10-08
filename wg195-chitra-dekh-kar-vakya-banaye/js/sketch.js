(function(){

  var scenes = (typeof SCENES !== "undefined" && SCENES) ? SCENES : [];

  var sceneCycle = [];      // shuffled order of scene indices
  var scenePos = 0;         // number of pictures shown in the current cycle
  var sceneIndex = 0;       // index of the current scene in scenes
  var sentenceOrder = [];   // shuffled order of sentence indices for current scene
  var currentIdx = 0;       // position in sentenceOrder
  var completed = [];       // completed sentence texts for current scene
  var slots = [];
  var refs = {};
  var bank = [];
  var hintTile = -1;
  var checkCount = 0;
  var wrongCheckCount = 0;
  var sentenceAudio = null;

  function byId(id){ return document.getElementById(id); }

  function setHidden(id, hidden){
    var el = byId(id);
    if (el) el.classList.toggle('hidden', hidden);
  }

  function shuffle(arr){
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  function allSceneIndices(){
    var out = [];
    for (var i = 0; i < scenes.length; i++) out.push(i);
    return out;
  }

  function currentScene(){ return scenes[sceneIndex]; }
  function currentSentences(){ return currentScene().sentences; }

  // Pick the next picture index without repeating until all pictures are used
  function nextSceneIndex(){
    if (scenePos >= sceneCycle.length){
      sceneCycle = shuffle(allSceneIndices());
      scenePos = 0;
    }
    var index = sceneCycle[scenePos];
    scenePos++;
    return index;
  }

  function setStars(filled){
    var ids = ['Path_3912','Path_4230','Path_4231','Path_4232','Path_4233'];
    for (var i = 0; i < ids.length; i++){
      var p = document.getElementById(ids[i]);
      if (p) p.setAttribute('class', i < filled ? 'st31' : 'st9');
    }
  }

  function updateProgressLabel(){
    var text = completed.length + '/' + currentSentences().length;
    var prog = byId('progressLabel');
    if (prog){
      prog.textContent = 'वाक्य ' + text;
    } else {
      var tspan = document.querySelector('#_1_5 tspan');
      if (tspan) tspan.textContent = text;
    }
    setStars(completed.length);
  }

  function pad2(n){ return (n < 10 ? '0' : '') + n; }

  function currentAudioSrc(){
    var pic = sceneIndex + 1;
    var vak = sentenceOrder[currentIdx] + 1;
    return 'assets/audio/picture' + pad2(pic) + '_vakya' + pad2(vak) + '.mp3';
  }

  function updateAudioBtn(){
    var btn = byId('audioBtn');
    if (!btn) return;
    btn.classList.remove('disabled');
    btn.setAttribute('aria-disabled', 'false');
  }

  function playSentenceAudio(){
    var src = currentAudioSrc();
    var btn = byId('audioBtn');
    if (btn) btn.setAttribute('data-src', src);
    if (!sentenceAudio) sentenceAudio = new Audio();
    sentenceAudio.pause();
    sentenceAudio.src = src;
    var p = sentenceAudio.play();
    if (p && p.catch) p.catch(function(){});
  }

  function updateMainNextBtn(){
    var btn = byId('mainNextBtn');
    if (btn) btn.disabled = false;
  }

  function loadScene(index){
    sceneIndex = index;
    completed = [];
    sentenceOrder = shuffle(currentSentences().map(function(_, i){ return i; }));
    currentIdx = 0;

    var labelEl = byId('sceneLabel');
    if (labelEl){
      labelEl.textContent = currentScene().label + ' — ' + currentScene().title;
    }

    var img = byId('sceneImage');
    if (img) img.src = currentScene().image;

    var overlayScene = byId('overlayScene');
    if (overlayScene){
      overlayScene.style.display = 'none';
      overlayScene.innerHTML = '';
    }

    updateProgressLabel();
    updateMainNextBtn();
    renderOverlayList();
    var list = byId('overlayList');
    if (list) list.style.visibility = 'hidden';
    updateOverlayTitleBtn();
    startCurrent();
  }

  function startCurrent(){
    checkCount = 0;
    wrongCheckCount = 0;
    updateAudioBtn();
    var abtn = byId('audioBtn');
    if (abtn) { abtn.classList.remove('hint'); abtn.classList.remove('shake'); }
    var s = currentSentences()[sentenceOrder[currentIdx]];
    slots = new Array(s.words.length + 1).fill(null);
    refs = {};
    var pool = shuffle(s.words.concat(s.distractors).concat(['।']));
    bank = pool.map(function(w){ return { word: w, used: false }; });
    hintTile = bank.findIndex(function(t){ return t.word === s.words[0]; });

    var numberEl = byId('activeNumber');
    if (numberEl) numberEl.textContent = (currentIdx + 1) + '.';

    var rowEl = byId('activeRow');
    if (rowEl) rowEl.classList.remove('correct');

    renderSlots();
    renderBank();
    updateCheckBtn();
  }

  function renderSlots(){
    var container = byId('activeSlots');
    if (!container) return;
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
    var container = byId('activeBank');
    if (!container) return;
    container.innerHTML = '';
    bank.forEach(function(tile, ti){
      var btn = document.createElement('button');
      btn.className = 'tile' + (tile.used ? ' used' : '');
      if (ti === hintTile && !tile.used) btn.classList.add('hint');
      btn.textContent = tile.word;
      btn.type = 'button';
      btn.disabled = tile.used;
      btn.addEventListener('click', function(){ placeTile(ti); });
      container.appendChild(btn);
    });
  }

  function stopAudioBtnShake(){
    var ab = byId('audioBtn');
    if (ab) ab.classList.remove('shake');
  }

  function placeTile(tileIndex){
    stopAudioBtnShake();
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
    stopAudioBtnShake();
    var tileRef = refs[slotIdx];
    if (tileRef !== undefined) bank[tileRef].used = false;
    slots[slotIdx] = null;
    delete refs[slotIdx];
    var rowEl = byId('activeRow');
    if (rowEl) rowEl.classList.remove('correct');
    document.querySelectorAll('#activeSlots .slot').forEach(function(s){ s.classList.remove('wrong','right'); });
    renderSlots();
    renderBank();
    updateCheckBtn();
  }

  function updateCheckBtn(){
    var btn = byId('checkBtn');
    if (!btn) return;
    var count = slots.filter(function(v){ return v !== null; }).length;
    btn.disabled = (count !== currentSentences()[sentenceOrder[currentIdx]].words.length + 1);
  }

  function checkSentence(){
    checkCount++;
    updateAudioBtn();
    var s = currentSentences()[sentenceOrder[currentIdx]];
    var slotEls = document.querySelectorAll('#activeSlots .slot');
    var allCorrect = true;
    var expected = s.words.concat(['।']);
    for (var i = 0; i < expected.length; i++){
      if (slots[i] === expected[i]){
        slotEls[i].classList.add('right');
        slotEls[i].classList.remove('wrong');
      } else {
        slotEls[i].classList.add('wrong');
        allCorrect = false;
      }
    }
    if (allCorrect){
      var rowEl = byId('activeRow');
      if (rowEl) rowEl.classList.add('correct');
      var checkBtn = byId('checkBtn');
      if (checkBtn) checkBtn.disabled = true;
      completed.push(s.text);
      updateProgressLabel();
      updateMainNextBtn();
      renderOverlayList();
      updateOverlayTitleBtn();
      setTimeout(function(){
        if (currentIdx < currentSentences().length - 1){
          currentIdx++;
          startCurrent();
        }
      }, 800);
    } else {
      wrongCheckCount++;
      if (wrongCheckCount >= 2){
        var ab = byId('audioBtn');
        if (ab){
          ab.classList.remove('hint');
          ab.classList.add('shake');
        }
      }
      setTimeout(function(){
        document.querySelectorAll('#activeSlots .slot.wrong').forEach(function(el){ el.classList.remove('wrong'); });
        // Keep slot 0 in place only if it has the correct first word; otherwise return it too
        var expectedFirst = currentSentences()[sentenceOrder[currentIdx]].words[0];
        for (var i = 0; i < slots.length; i++){
          if (slots[i] === null) continue;
          if (i === 0 && slots[i] === expectedFirst) continue;
          var ref = refs[i];
          if (ref !== undefined) bank[ref].used = false;
          slots[i] = null;
          delete refs[i];
        }
        renderSlots();
        renderBank();
        updateCheckBtn();
      }, 500);
    }
  }

  function renderOverlayList(){
    var list = byId('overlayList');
    if (!list) return;
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

  function updateOverlayTitleBtn(){
    var btn = byId('overlayTitle');
    if (btn) btn.disabled = completed.length < 1;
    var list = byId('overlayList');
    if (list && completed.length > 0) list.style.visibility = 'visible';
  }

  function loadNextScene(){
    loadScene(nextSceneIndex());
  }

  var checkBtn = byId('checkBtn');
  if (checkBtn) checkBtn.addEventListener('click', checkSentence);

  var mainNextBtn = byId('mainNextBtn');
  if (mainNextBtn) mainNextBtn.addEventListener('click', loadNextScene);

  var audioBtn = byId('audioBtn');
  if (audioBtn) audioBtn.addEventListener('click', playSentenceAudio);
  updateAudioBtn();

  var overlayTitle = byId('overlayTitle');
  if (overlayTitle){
    overlayTitle.addEventListener('click', function(){
      if (completed.length < 1) return;
      var list = byId('overlayList');
      if (list) list.style.visibility = 'visible';
    });
  }

  if (scenes.length > 0) loadNextScene();
})();