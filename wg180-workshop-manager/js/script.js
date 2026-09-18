
(function () {
  function $(id) { return document.getElementById(id); }
  function setDisplay(el, value) { if (el) el.style.display = value; }

  /* ---------- screen flow ---------- */

  var startShift = function () {
    setDisplay($('intro'), 'none');
    setDisplay($('game-screen'), 'block');
    setDisplay($('stage'), 'block');
    startMission(0);
    setDisplay(document.querySelector('.prod-schedule-wrapper'), 'block');
    setDisplay(document.querySelector('.grid-card-wrapper'), 'block');
    setDisplay(document.querySelector('.start-shift-wrapper'), 'none');
    setDisplay(document.querySelector('.start-shift-btn'), 'none');
  };

  FEEDBACKDATA = {
  "mission-1": {
    "beyondYourReach": {
      "title": "Beyond your reach.",
      "message": "That plan sits outside the curve; 6 workers cannot get there. Look for a spot exactly on the green line."
    },
    "somethingIsIdle": {
      "title": "Something is idle.",
      "message": "That plan sits inside the curve, so capacity is being wasted. Move the dot up onto the green line itself."
    },
    "wellManaged": {
      "title": "Well managed.",
      "message": "The plan sits on the curve: nothing wasted, every resource in use."
    }
  },
  "mission-2": {
    "notEfficient": {
      "title": "Not quite.",
      "message": "Efficient plans sit on the green line. This dot is well below it. Try again."
    },
    "itIsInefficient": {
      "title": "Well managed.",
      "message": "This plan sits inside the curve: some workers or machines are idle, so the workshop could make more of both goods without giving anything up."
    },
    "itIsUnattainable": {
      "title": "Not quite.",
      "message": "Unattainable plans sit outside the curve. This dot is inside it. Try again."
    }
  },
  "mission-3": {
    "planLocated": {
      "title": "Plan located: 4 bats, 12 sticks.",
      "message": "This point lies outside the curve. The schedule proves it: with 4 bats, the most sticks the workshop can make is 5, not 12. What do you tell the client?"
    },
    "acceptTheOrder": {
      "title": "Risky call.",
      "message": "The plan is unattainable with current resources. Promising it means failing the client tomorrow. Choose again."
    },
    "declineAndOfferPointEInstead": {
      "title": "Honest and smart.",
      "message": "Declining an unattainable order protects the workshop. Point E (4 bats, 5 sticks) is the best you can truthfully offer with 4 bats."
    },
    "notTheOrderedPlan": {
      "title": "Not the ordered plan.",
      "message": "The client asked for 4 bats and 12 sticks. Line the dot up with 4 on the bats axis and 12 on the sticks axis."
    }
  },
  "mission-4": {
    "confirmed": {
      "title": "Confirmed.",
      "message": "Check the table: sticks fell from 12 to 9, exactly 3 sticks given up for the 3rd bat, just as you predicted."
    },
    "notPointDYet": {
      "title": "Not point D yet.",
      "message": "Point D is 3 bats and 9 sticks. Drag the dot there and release."
    },
    "tryAgain": {
      "title": "Not quite.",
      "message": "Compare the sticks at point C with the sticks at point D, one bat to the right. Try again."
    }
  }

}

  var showHowToPlay = function () {
    setDisplay($('how-to-play-summary'), 'block');
  };

  var hideHowToPlay = function () {
    setDisplay($('how-to-play-summary'), 'none');
  };

  var startBtn = document.querySelector('.start-shift-btn');
  if (startBtn) startBtn.addEventListener('click', startShift);

  var howBtn = document.querySelector('.how-to-play-btn');
  if (howBtn) howBtn.addEventListener('click', showHowToPlay);

  var closeBtn = document.getElementById('close-btn');
  if (closeBtn) closeBtn.addEventListener('click', hideHowToPlay);

  var prodScheduleBtn = document.querySelector('.production-schedule-btn');
  if (prodScheduleBtn) {
    prodScheduleBtn.addEventListener('click', function () {
      setDisplay($('production_popup'), 'block');
    });
  }

  var scheduleCloseBtn = document.getElementById('schedule-close-btn');
  if (scheduleCloseBtn) {
    scheduleCloseBtn.addEventListener('click', function () {
      setDisplay($('production_popup'), 'none');
    });
  }

  /* ---------- chart card logic (from test.html) ---------- */

  var sched = [[0, 15], [1, 14], [2, 12], [3, 9], [4, 5], [5, 0]];
  var X0 = 70, X1 = 600, Y0 = 340, Y1 = 20, XMAX = 6, YMAX = 16;
  var px = function (x) { return X0 + (x / XMAX) * (X1 - X0); };
  var py = function (y) { return Y0 - (y / YMAX) * (Y0 - Y1); };

  var grid = $('grid'), axisLabels = $('axisLabels'), curve = $('curve'), pts = $('pts');
  if (grid) {
    var g = '';
    for (var i = 1; i <= XMAX; i++) g += '<line x1="' + px(i) + '" y1="' + Y1 + '" x2="' + px(i) + '" y2="' + Y0 + '" stroke="#7dcb80" stroke-width="1"/>';
    for (var j = 2; j <= YMAX; j += 2) g += '<line x1="' + X0 + '" y1="' + py(j) + '" x2="' + X1 + '" y2="' + py(j) + '" stroke="#7dcb80" stroke-width="1"/>';
    grid.innerHTML = g;
  }
  if (axisLabels) {
    var al = '';
    for (var m = 0; m <= XMAX; m++) al += '<text x="' + px(m) + '" y="' + (Y0 + 20) + '" text-anchor="middle" style="font:12px \'Atkinson Hyperlegible\',sans-serif; fill:#000000">' + m + '</text>';
    for (var n = 0; n <= YMAX; n += 2) al += '<text x="' + (X0 - 10) + '" y="' + (py(n) + 4) + '" text-anchor="end" style="font:12px \'Atkinson Hyperlegible\',sans-serif; fill:#000000">' + n + '</text>';
    axisLabels.innerHTML = al;
  }
  if (curve) {
    curve.setAttribute('d', sched.map(function (p, i) { return (i ? 'L' : 'M') + px(p[0]) + ' ' + py(p[1]); }).join(' '));
  }
  if (pts) {
    var names = 'ABCDEF';
    pts.innerHTML = sched.map(function (p, i) {
      return '<circle cx="' + px(p[0]) + '" cy="' + py(p[1]) + '" r="4" fill="#6b4315"/>' +
             '<text x="' + (px(p[0]) + 10) + '" y="' + (py(p[1]) - 8) + '" style="font:12px \'Atkinson Hyperlegible\',sans-serif; fill:#5C6B5E">' + names[i] + '</text>';
    }).join('');
  }

  function curveY(x) {
    if (x < 0) x = 0;
    if (x > 5) return null;
    var i = Math.min(Math.floor(x), 4);
    var a = sched[i], b = sched[i + 1];
    return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
  }

  var lx = 1.5, ly = 7, mission = 0, phase = '', dragEnabled = true;
  var done = [false, false, false, false];
  var workOrders = ['work_order_1', 'work_order_2', 'work_order_3', 'work_order_4'];
  var hideList = ['mission_cleared', 'next-mission-btn', 'collect-badge-btn',
    'mission2_buttons', 'mission3_buttons', 'mission4_buttons',
    'Group_1114', 'Group_11141', 'Group_11142'];
  function resetFeedback() {
    hideList.forEach(function (id) { setDisplay($(id), 'none'); });
    setDisplay(document.querySelector('.feedback-wrapper'), 'none');
  }

  function showFeedback(cat, key, ok) {
    var d = FEEDBACKDATA[cat] && FEEDBACKDATA[cat][key];
    var titleEl = document.getElementById('feedback-label');
    var textEl = document.getElementById('feedback-text');
    if (titleEl && d) titleEl.textContent = d.title;
    if (textEl && d) textEl.textContent = d.message;
    var wrap = document.querySelector('.feedback-wrapper');
    if (!wrap) return;
    setDisplay(wrap, 'block');
    var color = ok ? '#056e1c' : '#912f20';
    wrap.style.borderColor = color;
    if (titleEl) titleEl.style.color = color;
    if (textEl) textEl.style.color = color;
  }

  function clearHighlights() {
    ['unattainable-highlight', 'inefficient-highlight', 'efficient-highlight',
      'decline-highlight', 'accept-highlight',
      'stick-1-highlight', 'stick-2-highlight', 'stick-3-highlight', 'stick-4-highlight']
      .forEach(function (id) { setDisplay($(id), 'none'); });
  }

  function startMission(i) {
    if (i === 0) {
      done = [false, false, false, false];
      clearMission();
      setDisplay($('stage_complete'), 'none');
      setDisplay($('stage-1-complete'), 'none');
      setDisplay($('stage-2-complete'), 'none');
      setDisplay($('stage-3-complete'), 'none');
      setDisplay($('stage-4-complete'), 'none');
      setDisplay($('badge-screen'), 'none');
    }
    mission = i;
    phase = '';
    workOrders.forEach(function (id) { setDisplay($(id), 'none'); });
    resetFeedback();
    Object.keys(missionGroups).forEach(enableOptions);
    clearHighlights();
    setDisplay($(workOrders[i]), 'block');
    if (i === 0) { dragEnabled = true; setDot(1.5, 7); }
    if (i === 1) {
      dragEnabled = false; setDot(2, 6);
      setDisplay($('mission2_buttons'), 'block');
      setDisplay($('Group_1114'), 'none');
    }
    if (i === 2) {
      dragEnabled = true; setDot(1.5, 7);
      setDisplay($('mission3_buttons'), 'block');
      setDisplay($('Group_11141'), 'none');
    }
    if (i === 3) {
      dragEnabled = true; setDot(2, 12); phase = 'predict';
      setDisplay($('mission4_buttons'), 'block');
      setDisplay($('Group_11142'), 'none');
    }
  }

  function setDot(x, y) {
    lx = x; ly = y;
    if ($('handle')) {
      $('handle').setAttribute('cx', px(x));
      $('handle').setAttribute('cy', py(y));
    }
    var coordsBox = $('coords');
    if (coordsBox) {
      var b = coordsBox.querySelector('#bats');
      var s = coordsBox.querySelector('#sticks');
      if (b) b.textContent = (Math.round(x * 10) / 10).toString();
      if (s) s.textContent = (Math.round(y * 10) / 10).toString();
    }
  }

  function clearMission() {
    resetFeedback();
    setDisplay($('mission_cleared'), 'none');
    setDisplay($('collect-badge-btn'), 'none');
  }

  function revealStage() {
    var el = $('stage-' + (mission + 1) + '-complete');
    if (el) {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
      el.style.display = 'block';
    }
  }

  var nextMissionBtn = $('next-mission-btn');
  if (nextMissionBtn) {
    nextMissionBtn.addEventListener('click', function () {
      if (mission < 3) startMission(mission + 1);
    });
  }

  var collectBadgeBtn = $('collect-badge-btn');
  if (collectBadgeBtn) {
    collectBadgeBtn.addEventListener('click', function () {
      dragEnabled = false;
      var ids = ['intro', 'game-screen', 'stage', 'stage_complete', 'work_order_1',
        'work_order_2', 'work_order_3', 'work_order_4', 'production_popup',
        'how-to-play-summary'];
      ids.forEach(function (id) { setDisplay($(id), 'none'); });
      workOrders.forEach(function (id) { setDisplay($(id), 'none'); });
      resetFeedback();
      setDisplay(document.querySelector('.prod-schedule-wrapper'), 'none');
      setDisplay(document.querySelector('.grid-card-wrapper'), 'none');
      setDisplay(document.querySelector('.start-shift-wrapper'), 'none');
      setDisplay(document.querySelector('.start-shift-btn'), 'none');
      setDisplay(document.querySelector('.play-btn-wrapper'), 'none');
      setDisplay(document.querySelector('.how-to-play-btn'), 'none');
      setDisplay($('badge-screen'), 'block');
    });
  }

  var playAgainBtn = $('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', function () {
      startMission(0);
      workOrders.forEach(function (id) { setDisplay($(id), 'none'); });
      setDisplay($('badge-screen'), 'none');
      setDisplay($('game-screen'), 'none');
      setDisplay($('stage'), 'none');
      setDisplay($('intro'), 'block');
      setDisplay(document.querySelector('.play-btn-wrapper'), 'block');
      setDisplay(document.querySelector('.how-to-play-btn'), 'block');
      setDisplay(document.querySelector('.prod-schedule-wrapper'), 'none');
      setDisplay(document.querySelector('.grid-card-wrapper'), 'none');
      setDisplay(document.querySelector('.start-shift-wrapper'), 'block');
      setDisplay(document.querySelector('.start-shift-btn'), 'block');
      dragEnabled = true;
    });
  }

  var missionGroups = {
    mission2_buttons: [
      ['unattainable', 'unattainable-highlight'],
      ['inefficient', 'inefficient-highlight'],
      ['efficient', 'efficient-highlight']
    ],
    mission3_buttons: [
      ['decline-btn', 'decline-highlight'],
      ['accept-btn', 'accept-highlight']
    ],
    mission4_buttons: [
      ['stick-1-btn', 'stick-1-highlight'],
      ['stick-2-btn', 'stick-2-highlight'],
      ['stick-3-btn', 'stick-3-highlight'],
      ['stick-4-btn', 'stick-4-highlight']
    ]
  };

  function wireMissionButtons(groupId, onPick) {
    var pairs = missionGroups[groupId] || [];
    pairs.forEach(function (pair) {
      var btn = $(pair[0]);
      if (btn) {
        btn.addEventListener('click', function () {
          pairs.forEach(function (p) { setDisplay($(p[1]), 'none'); });
          setDisplay($(pair[1]), 'block');
          if (onPick) onPick(pair[0]);
        });
      }
    });
  }

  function disableOptions(groupId, keepId) {
    var pairs = missionGroups[groupId] || [];
    pairs.forEach(function (pair) {
      var b = $(pair[0]);
      if (b && pair[0] !== keepId) {
        b.style.pointerEvents = 'none';
        b.style.cursor = 'default';
      }
    });
  }

  function enableOptions(groupId) {
    var pairs = missionGroups[groupId] || [];
    pairs.forEach(function (pair) {
      var b = $(pair[0]);
      if (b) { b.style.pointerEvents = ''; b.style.cursor = 'pointer'; }
    });
  }

  wireMissionButtons('mission2_buttons', function (id) {
    if (mission !== 1 || done[1]) return;
    if (id === 'inefficient') {
      done[1] = true;
      disableOptions('mission2_buttons', id);
      showFeedback('mission-2', 'itIsInefficient', true);
      revealStage();
      setDisplay($('next-mission-btn'), 'block');
    } else if (id === 'unattainable') {
      showFeedback('mission-2', 'itIsUnattainable', false);
    } else if (id === 'efficient') {
      showFeedback('mission-2', 'notEfficient', false);
    }
  });

  wireMissionButtons('mission3_buttons', function (id) {
    if (mission !== 2 || done[2]) return;
    if (id === 'decline-btn') {
      done[2] = true;
      dragEnabled = false;
      disableOptions('mission3_buttons', id);
      showFeedback('mission-3', 'declineAndOfferPointEInstead', true);
      revealStage();
      setDisplay($('next-mission-btn'), 'block');
    } else if (id === 'accept-btn') {
      showFeedback('mission-3', 'acceptTheOrder', false);
    }
  });

  wireMissionButtons('mission4_buttons', function (id) {
    if (mission !== 3 || done[3]) return;
    if (id === 'stick-3-btn') {
      done[3] = true;
      dragEnabled = false;
      disableOptions('mission4_buttons', id);
      showFeedback('mission-4', 'confirmed', true);
      revealStage();
      setDisplay($('collect-badge-btn'), 'block');
    } else {
      showFeedback('mission-4', 'tryAgain', false);
    }
  });

  function onRelease(x, y) {
    if (mission === 0 && !done[0]) {
      var cy = curveY(x);
      if (cy === null || y - cy > 0.5) {
        showFeedback('mission-1', 'beyondYourReach', false);
      } else if (cy - y > 0.5) {
        showFeedback('mission-1', 'somethingIsIdle', false);
      } else {
        done[0] = true;
        dragEnabled = false;
        showFeedback('mission-1', 'wellManaged', true);
        revealStage();
        setDisplay($('mission_cleared'), 'block');
        setDisplay($('next-mission-btn'), 'block');
      }
    }
    if (mission === 2 && !done[2]) {
      if (Math.abs(x - 4) <= 0.35 && Math.abs(y - 12) <= 0.9) {
        setDisplay($('mission3_buttons'), 'block');
        showFeedback('mission-3', 'planLocated', true);
      } else {
        showFeedback('mission-3', 'notTheOrderedPlan', false);
      }
    }
  }

  var svg = $('ppc'), overlay = $('overlay'), handle = $('handle'), drag = false;
  if (overlay) overlay.style.cursor = 'pointer';
  if (handle) handle.setAttribute('cursor', 'pointer');
  function toXY(ev) {
    var r = svg.getBoundingClientRect();
    var sx = (ev.clientX - r.left) * 640 / r.width;
    var sy = (ev.clientY - r.top) * 400 / r.height;
    return [
      Math.max(0, Math.min(XMAX, (sx - X0) / (X1 - X0) * XMAX)),
      Math.max(0, Math.min(YMAX, (Y0 - sy) / (Y0 - Y1) * YMAX))
    ];
  }

  if (overlay) {
    overlay.addEventListener('pointerdown', function (ev) {
      if (!dragEnabled) return;
      var p = toXY(ev);
      drag = true;
      clearHighlights();
      setDot(p[0], p[1]);
      if (overlay.setPointerCapture) overlay.setPointerCapture(ev.pointerId);
    });
    overlay.addEventListener('pointermove', function (ev) {
      if (drag) {
        var p = toXY(ev);
        clearHighlights();
        setDot(p[0], p[1]);
      }
    });
    overlay.addEventListener('pointerup', function () {
      if (drag) { drag = false; onRelease(lx, ly); }
    });
    overlay.addEventListener('pointercancel', function () { drag = false; });
  }

  if (handle) {
    handle.addEventListener('keydown', function (ev) {
      if (!dragEnabled) return;
      var step = ev.shiftKey ? 1 : 0.25;
      var nx = lx, ny = ly, used = true;
      if (ev.key === 'ArrowLeft') nx = Math.max(0, lx - step);
      else if (ev.key === 'ArrowRight') nx = Math.min(XMAX, lx + step);
      else if (ev.key === 'ArrowUp') ny = Math.min(YMAX, ly + step);
      else if (ev.key === 'ArrowDown') ny = Math.max(0, ly - step);
      else if (ev.key === 'Enter') { onRelease(lx, ly); ev.preventDefault(); return; }
      else used = false;
      if (used) { ev.preventDefault(); clearHighlights(); setDot(nx, ny); }
    });
  }

  setDot(1.5, 7);
})();