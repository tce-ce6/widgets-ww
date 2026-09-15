/*
 * Original prototype logic — kept (commented) for reference.
 * It was written against the HTML-DOM prototype (ppc_workshop_manager (final).html)
 * and references ids that do not exist inside the SVG index.html, so it is
 * disabled here. The SVG card logic below reuses the same flow.
 */
/*

const sched=[[0,15],[1,14],[2,12],[3,9],[4,5],[5,0]];
const X0=70,X1=600,Y0=340,Y1=20,XMAX=6,YMAX=16;
const px=x=>X0+(x/XMAX)*(X1-X0), py=y=>Y0-(y/YMAX)*(Y0-Y1);
const $=id=>document.getElementById(id);
let g='';
for(let i=1;i<=XMAX;i++) g+='<line x1="'+px(i)+'" y1="'+Y1+'" x2="'+px(i)+'" y2="'+Y0+'" stroke="#E2E7DE" stroke-width="1"/>';
for(let j=2;j<=YMAX;j+=2) g+='<line x1="'+X0+'" y1="'+py(j)+'" x2="'+X1+'" y2="'+py(j)+'" stroke="#E2E7DE" stroke-width="1"/>';
$('grid').innerHTML=g;
let al='';
for(let i=0;i<=XMAX;i++) al+='<text x="'+px(i)+'" y="'+(Y0+20)+'" text-anchor="middle" style="font:12px \'Atkinson Hyperlegible\',sans-serif; fill:#8B978C">'+i+'</text>';
for(let j=0;j<=YMAX;j+=2) al+='<text x="'+(X0-10)+'" y="'+(py(j)+4)+'" text-anchor="end" style="font:12px \'Atkinson Hyperlegible\',sans-serif; fill:#8B978C">'+j+'</text>';
$('axisLabels').innerHTML=al;
$('curve').setAttribute('d',sched.map((p,i)=>(i?'L':'M')+px(p[0])+' '+py(p[1])).join(' '));
const names='ABCDEF';
$('pts').innerHTML=sched.map((p,i)=>'<circle cx="'+px(p[0])+'" cy="'+py(p[1])+'" r="4" fill="#0A4A3B"/><text x="'+(px(p[0])+10)+'" y="'+(py(p[1])-8)+'" style="font:12px \'Atkinson Hyperlegible\',sans-serif; fill:#5C6B5E">'+names[i]+'</text>').join('');
function curveY(x){ if(x<0)x=0; if(x>5) return null; const i=Math.min(Math.floor(x),4); const a=sched[i],b=sched[i+1]; return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]); }

const screens=['s0','s1','game','done'];
function show(n){ screens.forEach((s,i)=>$(s).classList.toggle('hidden',i!==n)); }
let m=0, phase='', dragEnabled=true, done=[false,false,false,false];
function tracker(){ $('tracker').innerHTML=[0,1,2,3].map(i=>'<div class="punch '+(done[i]?'done':(i===m&&!$('game').classList.contains('hidden')?'now':''))+'">'+(done[i]?'\u2713':(i+1))+'</div>').join(''); }
tracker();

let lx=1.5, ly=7;
function setDot(x,y){ lx=x; ly=y; $('handle').setAttribute('cx',px(x)); $('handle').setAttribute('cy',py(y)); $('coords').textContent='Current plan: '+(Math.round(x*10)/10)+' bats, '+(Math.round(y*10)/10)+' sticks'; }
function fb(kind,head,text){ const el=$('fb'); el.className='fb '+kind; el.style.display='block'; $('fbhead').textContent=head; $('fbtext').textContent=text; }
function opts(list){ $('opts').innerHTML=''; list.forEach(pair=>{ const b=document.createElement('button'); b.textContent=pair[0]; b.onclick=pair[1]; $('opts').appendChild(b); }); }
function clearOpts(){ $('opts').innerHTML=''; }

const facts=[
 'Reward fact: every point on the curve is efficient. There is no single best plan; the right one depends on what customers want.',
 'Reward fact: during recessions, whole countries produce inside their curve. Workers want jobs and machines sit idle.',
 'Reward fact: the curve can shift outward over time with more workers, better machines, or new technology. Unattainable today can become efficient next year.',
 'Reward fact: the cost rises because workers differ in skill. The first bats come from bat specialists; the last ones pull away your best stick makers.'
];
function success(head,text){ done[m]=true; tracker(); $('stamp').classList.add('show'); fb('ok',head,text+' '+facts[m]); clearOpts(); $('nextBtn').textContent=m<3?'Next mission':'Collect your badge'; $('nextBtn').classList.remove('hidden'); }
function advance(){ $('nextBtn').classList.add('hidden'); $('fb').style.display='none'; $('stamp').classList.remove('show'); if(m<3) startMission(m+1); else { show(3); tracker(); } }

function startMission(i){ m=i; phase=''; if(i===0) done=[false,false,false,false]; show(2); tracker(); $('sched').open=(i===2); $('fb').style.display='none'; $('nextBtn').classList.add('hidden'); $('stamp').classList.remove('show'); clearOpts(); $('mtitle').innerHTML='Work order &middot; Mission '+(i+1)+' of 4';
 if(i===0){ dragEnabled=true; setDot(1.5,7); $('inst').textContent='The owner wants zero waste today. Drag the dot to any plan where every worker and machine is fully used, then release.'; }
 if(i===1){ dragEnabled=false; setDot(2,6); $('inst').textContent='The night shift left production at 2 bats and 6 sticks. Look at where this plan sits, then answer: what is wrong here?';
  opts([['It is efficient',function(){fb('no','Not quite.','Efficient plans sit on the green line. This dot is well below it. Try again.');}],
        ['It is inefficient',function(){success('Well managed.','This plan sits inside the curve: some workers or machines are idle, so the workshop could make more of both goods without giving anything up.');}],
        ['It is unattainable',function(){fb('no','Not quite.','Unattainable plans sit outside the curve. This dot is inside it. Try again.');}]]); }
 if(i===2){ dragEnabled=true; $('inst').textContent='A client orders 4 bats and 12 sticks for tomorrow. Drag the dot to that exact plan and release to test it. The production schedule below the chart shows what the workshop can really do.'; }
 if(i===3){ dragEnabled=true; setDot(2,12); phase='predict'; $('inst').textContent='The workshop is at point C: 2 bats, 12 sticks. The client wants a 3rd bat. Predict first: how many sticks must you give up?';
  const wrong=function(){fb('no','Check the curve.','Compare the sticks at point C with the sticks at point D, one bat to the right. Try again.');};
  opts([['1 stick',wrong],['2 sticks',wrong],['3 sticks',function(){ phase='confirm'; $('sched').open=true; fb('info','Good prediction. Now prove it.','The production schedule is now open below the chart. Drag the dot from C to point D (3 bats, 9 sticks) and release to confirm.'); clearOpts(); }],['4 sticks',wrong]]); }
}

function onRelease(x,y){
 if(m===0&&!done[0]){ const cy=curveY(x);
  if(cy===null||y-cy>0.5) fb('no','Beyond your reach.','That plan sits outside the curve; 6 workers cannot get there. Look for a spot exactly on the green line.');
  else if(cy-y>0.5) fb('no','Something is idle.','That plan sits inside the curve, so capacity is being wasted. Move the dot up onto the green line itself.');
  else success('Well managed.','The plan sits on the curve: nothing wasted, every resource in use.'); }
 if(m===2&&!done[2]){ if(Math.abs(x-4)<=0.35&&Math.abs(y-12)<=0.9){ fb('no','Plan located: 4 bats, 12 sticks.','This point lies outside the curve. The schedule proves it: with 4 bats, the most sticks the workshop can make is 5, not 12. What do you tell the client?');
   opts([['Accept the order',function(){fb('no','Risky call.','The plan is unattainable with current resources. Promising it means failing the client tomorrow. Choose again.');}],
         ['Decline and offer point E instead',function(){success('Honest and smart.','Declining an unattainable order protects the workshop. Point E (4 bats, 5 sticks) is the best you can truthfully offer with 4 bats.');}]]); }
  else fb('no','Not the ordered plan.','The client asked for 4 bats and 12 sticks. Line the dot up with 4 on the bats axis and 12 on the sticks axis.'); }
 if(m===3&&phase==='confirm'&&!done[3]){ if(Math.abs(x-3)<=0.35&&Math.abs(y-9)<=0.9) success('Confirmed.','Check the table: sticks fell from 12 to 9, exactly 3 sticks given up for the 3rd bat, just as you predicted.');
  else fb('no','Not point D yet.','Point D is 3 bats and 9 sticks. Drag the dot there and release.'); }
}

let drag=false; const svg=$('ppc'), overlay=$('overlay'), handle=$('handle');
function toXY(ev){ const r=svg.getBoundingClientRect(); const sx=(ev.clientX-r.left)*640/r.width, sy=(ev.clientY-r.top)*400/r.height; return [Math.max(0,Math.min(XMAX,(sx-X0)/(X1-X0)*XMAX)), Math.max(0,Math.min(YMAX,(Y0-sy)/(Y0-Y1)*YMAX))]; }
overlay.addEventListener('pointerdown',function(ev){ if(!dragEnabled) return; drag=true; overlay.setPointerCapture(ev.pointerId); const p=toXY(ev); setDot(p[0],p[1]); });
overlay.addEventListener('pointermove',function(ev){ if(drag){ const p=toXY(ev); setDot(p[0],p[1]); } });
overlay.addEventListener('pointerup',function(){ if(drag){ drag=false; onRelease(lx,ly); } });
handle.addEventListener('keydown',function(ev){ if(!dragEnabled) return; const step=ev.shiftKey?1:0.25; let nx=lx, ny=ly, used=true;
 if(ev.key==='ArrowLeft') nx=Math.max(0,lx-step);
 else if(ev.key==='ArrowRight') nx=Math.min(XMAX,lx+step);
 else if(ev.key==='ArrowUp') ny=Math.min(YMAX,ly+step);
 else if(ev.key==='ArrowDown') ny=Math.max(0,ly-step);
 else if(ev.key==='Enter'){ onRelease(lx,ly); ev.preventDefault(); return; }
 else used=false;
 if(used){ ev.preventDefault(); setDot(nx,ny); } });
setDot(1.5,7);
show(0);

*/

/*
 * wg180 SVG game model + card logic ported from test.html.
 *
 * Screen flow (SVG artwork in index.html):
 *   Initial: #intro visible; #play-screen, .prod-schedule-wrapper, #stage,
 *   #work_order_1, #how-to-play-summary hidden.
 *
 *   - .start-shift-btn  -> hide #intro + the start button; show #play-screen,
 *                          the production-schedule button, #stage and #work_order_1.
 *   - .how-to-play-btn  -> show #how-to-play-summary (close via #Group_1061).
 *
 * Card logic (the chart card inside .grid-card-wrapper, ids copied from test.html):
 *   - Builds the grid, axis labels, curve and labelled points A–F.
 *   - Draggable production-plan dot (#handle) on the chart (#ppc) with the pointer
 *     and the arrow keys; #coords shows the current plan.
 *   - On release, evaluates mission 1 against the curve and shows the matching
 *     SVG feedback panel (feedback-beyond / feedback-idle / feedback-well).
 */
(function () {
  function $(id) { return document.getElementById(id); }
  function setDisplay(el, value) { if (el) el.style.display = value; }

  /* ---------- screen flow ---------- */

  var startShift = function () {
    setDisplay($('intro'), 'none');
    setDisplay($('play-screen'), 'block');
    setDisplay($('stage'), 'block');
    setDisplay($('work_order_1'), 'block');
    setDisplay(document.querySelector('.prod-schedule-wrapper'), 'block');
    setDisplay(document.querySelector('.grid-card-wrapper'), 'block');
    setDisplay(document.querySelector('.start-shift-wrapper'), 'none');
    setDisplay(document.querySelector('.start-shift-btn'), 'none');
  };

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

  var closeBtn = document.getElementById('Group_1061');
  if (closeBtn) closeBtn.addEventListener('click', hideHowToPlay);

  /* ---------- chart card logic (from test.html) ---------- */

  var sched = [[0, 15], [1, 14], [2, 12], [3, 9], [4, 5], [5, 0]];
  var X0 = 70, X1 = 600, Y0 = 340, Y1 = 20, XMAX = 6, YMAX = 16;
  var px = function (x) { return X0 + (x / XMAX) * (X1 - X0); };
  var py = function (y) { return Y0 - (y / YMAX) * (Y0 - Y1); };

  var grid = $('grid'), axisLabels = $('axisLabels'), curve = $('curve'), pts = $('pts');
  if (grid) {
    var g = '';
    for (var i = 1; i <= XMAX; i++) g += '<line x1="' + px(i) + '" y1="' + Y1 + '" x2="' + px(i) + '" y2="' + Y0 + '" stroke="#E2E7DE" stroke-width="1"/>';
    for (var j = 2; j <= YMAX; j += 2) g += '<line x1="' + X0 + '" y1="' + py(j) + '" x2="' + X1 + '" y2="' + py(j) + '" stroke="#E2E7DE" stroke-width="1"/>';
    grid.innerHTML = g;
  }
  if (axisLabels) {
    var al = '';
    for (var m = 0; m <= XMAX; m++) al += '<text x="' + px(m) + '" y="' + (Y0 + 20) + '" text-anchor="middle" style="font:12px \'Atkinson Hyperlegible\',sans-serif; fill:#8B978C">' + m + '</text>';
    for (var n = 0; n <= YMAX; n += 2) al += '<text x="' + (X0 - 10) + '" y="' + (py(n) + 4) + '" text-anchor="end" style="font:12px \'Atkinson Hyperlegible\',sans-serif; fill:#8B978C">' + n + '</text>';
    axisLabels.innerHTML = al;
  }
  if (curve) {
    curve.setAttribute('d', sched.map(function (p, i) { return (i ? 'L' : 'M') + px(p[0]) + ' ' + py(p[1]); }).join(' '));
  }
  if (pts) {
    var names = 'ABCDEF';
    pts.innerHTML = sched.map(function (p, i) {
      return '<circle cx="' + px(p[0]) + '" cy="' + py(p[1]) + '" r="4" fill="#0A4A3B"/>' +
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

  var lx = 1.5, ly = 7, mission = 0, done1 = false;
  function setDot(x, y) {
    lx = x; ly = y;
    if ($('handle')) {
      $('handle').setAttribute('cx', px(x));
      $('handle').setAttribute('cy', py(y));
    }
    if ($('coords')) {
      $('coords').textContent = 'Current plan: ' + (Math.round(x * 10) / 10) + ' bats, ' + (Math.round(y * 10) / 10) + ' sticks';
    }
  }

  var feedbackGroups = ['feedback-idle', 'feedback-beyond', 'feedback-well'];
  function resetFeedback() {
    feedbackGroups.forEach(function (id) { setDisplay($(id), 'none'); });
  }

  function onRelease(x, y) {
    if (mission !== 0 || done1) return;
    var cy = curveY(x);
    resetFeedback();
    if (cy === null || y - cy > 0.5) {
      setDisplay($('feedback-beyond'), 'block');
    } else if (cy - y > 0.5) {
      setDisplay($('feedback-idle'), 'block');
    } else {
      done1 = true;
      setDisplay($('feedback-well'), 'block');
      setDisplay($('mission_cleared'), 'block');
      setDisplay($('button_next_mission'), 'block');
    }
  }

  var svg = $('ppc'), overlay = $('overlay'), handle = $('handle'), drag = false;
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
      var p = toXY(ev);
      drag = true;
      setDot(p[0], p[1]);
      if (overlay.setPointerCapture) overlay.setPointerCapture(ev.pointerId);
    });
    overlay.addEventListener('pointermove', function (ev) {
      if (drag) {
        var p = toXY(ev);
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
      var step = ev.shiftKey ? 1 : 0.25;
      var nx = lx, ny = ly, used = true;
      if (ev.key === 'ArrowLeft') nx = Math.max(0, lx - step);
      else if (ev.key === 'ArrowRight') nx = Math.min(XMAX, lx + step);
      else if (ev.key === 'ArrowUp') ny = Math.min(YMAX, ly + step);
      else if (ev.key === 'ArrowDown') ny = Math.max(0, ly - step);
      else if (ev.key === 'Enter') { onRelease(lx, ly); ev.preventDefault(); return; }
      else used = false;
      if (used) { ev.preventDefault(); setDot(nx, ny); }
    });
  }

  setDot(1.5, 7);
})();