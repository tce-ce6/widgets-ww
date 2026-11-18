
"use strict";
const SVGNS="http://www.w3.org/2000/svg";
const MODULE=5;                 // tooth size; same for all gears so any two can mesh
const BASE_OMEGA=1.55;          // driver angular speed (rad/s) at 1x
const MESH_TOL=15;              // px tolerance for rim-to-rim snap
const COMPOUND_RATIO=0.42;      // fraction of smaller pitch radius for centre snap
const PALETTE=[
  {key:"amber",  fill:"#e7b13f",lo:"#f4cf6d",hi:"#a9760f",label:"Amber"},
  {key:"steel",  fill:"#9fb3c0",lo:"#cad7df",hi:"#6c8392",label:"Steel"},
  {key:"teal",   fill:"#2f8d98",lo:"#54bcc7",hi:"#1d6770",label:"Teal"},
  {key:"slate",  fill:"#5c7cb0",lo:"#8aa6d2",hi:"#3d5985",label:"Slate"},
  {key:"olive",  fill:"#aabf3a",lo:"#cada63",hi:"#7d8f1f",label:"Olive"},
  {key:"rose",   fill:"#c76b8e",lo:"#e29ab4",hi:"#9c4767",label:"Rose"},
];

// Canvas (viewBox 0 0 560 511, same shape as the stage so it fills it).
// Gears are kept inside BOUNDS: the top band is under the question, the
// bottom band is under the status line and the Help / Insights buttons.
const VB_W=560, VB_H=511;
const BOUNDS={x0:6, y0:50, x1:VB_W-6, y1:VB_H-46};
const LABEL_GAP=4;              // min space between speed labels
const MIN_TEETH=6, MAX_TEETH=30; // teeth range for the inspector stepper

// ---------- state ----------
let gears=[];        // {id,teeth,x,y,colorIdx,angle(deg),omega(rad/s)}
let edges=[];        // {a,b,type:'mesh'|'compound',angle(rad, a->b)}
let driverId=null;
let driverDir=1;     // +1 = clockwise (screen), -1 = counter-clockwise
let selectedId=null;
let running=false;
let showSpeed=false;
let nextId=1;
let colorCursor=0;

const svg=document.getElementById("svg");
const layer=document.getElementById("layer");
const spinRefs=new Map();   // id -> spin <g>

// ---------- geometry ----------
const pitchR =g=>MODULE*g.teeth/2;
const outerR =g=>pitchR(g)+MODULE;
const byId   =id=>gears.find(g=>g.id===id);

function gearPath(teeth){
  const pitch=MODULE*teeth/2;
  const outer=pitch+MODULE;
  const root=Math.max(pitch-1.25*MODULE,4);
  const step=Math.PI*2/teeth;
  const frac=[0,0.22,0.40,0.62];
  const rad=[root,outer,outer,root];
  let d="";
  for(let i=0;i<teeth;i++){
    for(let k=0;k<4;k++){
      const a=(i+frac[k])*step-Math.PI/2;
      const x=(Math.cos(a)*rad[k]).toFixed(2);
      const y=(Math.sin(a)*rad[k]).toFixed(2);
      d+=(i===0&&k===0?"M":"L")+x+" "+y+" ";
    }
  }
  return d+"Z";
}

// ---------- graph helpers ----------
function neighbors(id){
  const out=[];
  for(const e of edges){
    if(e.a===id) out.push({id:e.b,edge:e,sign:1});
    else if(e.b===id) out.push({id:e.a,edge:e,sign:-1});
  }
  return out;
}
function componentOf(id){
  const seen=new Set([id]),q=[id];
  while(q.length){
    for(const n of neighbors(q.pop())) if(!seen.has(n.id)){seen.add(n.id);q.push(n.id);}
  }
  return seen;
}
function edgeExists(a,b){return edges.some(e=>(e.a===a&&e.b===b)||(e.a===b&&e.b===a));}

// place every gear of a component using stored edge angles + current radii
function relayout(startId){
  const comp=componentOf(startId);
  let anchor=(driverId&&comp.has(driverId))?driverId:[...comp][0];
  const placed=new Set([anchor]);
  const q=[anchor];
  while(q.length){
    const u=byId(q.shift());
    for(const n of neighbors(u.id)){
      if(placed.has(n.id)) continue;
      const v=byId(n.id), e=n.edge;
      if(e.type==="compound"){ v.x=u.x; v.y=u.y; }
      else{
        const dir=(e.a===u.id)?e.angle:e.angle+Math.PI;
        const dist=pitchR(u)+pitchR(v);
        v.x=u.x+Math.cos(dir)*dist;
        v.y=u.y+Math.sin(dir)*dist;
      }
      placed.add(n.id); q.push(n.id);
    }
  }
}

// Keep every gear train fully on the canvas. Snapping and teeth changes move
// whole trains (relayout), which could push gears past the edge.
function keepInBounds(){
  const done=new Set();
  for(const g of gears){
    if(done.has(g.id)) continue;
    const comp=[...componentOf(g.id)].map(byId);
    comp.forEach(c=>done.add(c.id));
    let l=Infinity,t=Infinity,r=-Infinity,b=-Infinity;
    for(const c of comp){
      l=Math.min(l,c.x-outerR(c)); r=Math.max(r,c.x+outerR(c));
      t=Math.min(t,c.y-outerR(c)); b=Math.max(b,c.y+outerR(c));
    }
    let dx=0,dy=0;
    const bw=BOUNDS.x1-BOUNDS.x0, bh=BOUNDS.y1-BOUNDS.y0;
    // too big to fit: centre it; otherwise nudge back inside
    if(r-l>bw) dx=(BOUNDS.x0+bw/2)-(l+r)/2;
    else if(l<BOUNDS.x0) dx=BOUNDS.x0-l;
    else if(r>BOUNDS.x1) dx=BOUNDS.x1-r;
    if(b-t>bh) dy=(BOUNDS.y0+bh/2)-(t+b)/2;
    else if(t<BOUNDS.y0) dy=BOUNDS.y0-t;
    else if(b>BOUNDS.y1) dy=BOUNDS.y1-b;
    if(dx||dy) comp.forEach(c=>{c.x+=dx;c.y+=dy;});
  }
}

// ---------- physics: assign angular velocities ----------
function computeSpeeds(){
  gears.forEach(g=>g.omega=0);
  let jammed=false;
  if(!driverId||!byId(driverId)) return {jammed};
  const d=byId(driverId);
  d.omega=driverDir*BASE_OMEGA;
  const seen=new Set([driverId]),q=[driverId];
  while(q.length){
    const u=byId(q.shift());
    for(const n of neighbors(u.id)){
      const v=byId(n.id);
      const w=(n.edge.type==="compound")
        ? u.omega
        : -u.omega*(u.teeth/v.teeth);
      if(seen.has(v.id)){
        if(Math.abs(v.omega-w)>1e-6) jammed=true;
      }else{
        v.omega=w; seen.add(v.id); q.push(v.id);
      }
    }
  }
  return {jammed};
}

function validity(){
  if(gears.length===0) return {ok:false,reason:"No gears yet."};
  if(!driverId) return {ok:false,reason:"No driver gear."};
  const comp=componentOf(driverId);
  const loose=gears.filter(g=>!comp.has(g.id));
  if(loose.length) return {ok:false,reason:`${loose.length} gear${loose.length>1?"s":""} not snapped into the train.`};
  if(computeSpeeds().jammed) return {ok:false,reason:"Gears are jammed — this loop can't turn."};
  return {ok:true,reason:gears.length===1?"Ready — one gear, free to spin.":"All gears snapped. Ready to run."};
}

// ---------- coordinate helper ----------
function toSvg(evt){
  const pt=svg.createSVGPoint();
  pt.x=evt.clientX; pt.y=evt.clientY;
  const p=pt.matrixTransform(svg.getScreenCTM().inverse());
  return {x:p.x,y:p.y};
}
function hitGear(p){
  let best=null,bestD=Infinity;
  for(const g of gears){
    const d=Math.hypot(p.x-g.x,p.y-g.y);
    if(d<=outerR(g)+2 && d<bestD){best=g;bestD=d;}
  }
  return best;
}

// ---------- rendering ----------
function makeEl(tag,attrs){
  const el=document.createElementNS(SVGNS,tag);
  for(const k in attrs) el.setAttribute(k,attrs[k]);
  return el;
}
function speedInfo(g){
  const dRef=driverId?byId(driverId):null;
  const base=dRef?Math.abs(dRef.omega):0;
  const mult=base>0?Math.abs(g.omega)/base:0;
  const cw=g.omega>0;
  return {mult,cw,spinning:Math.abs(g.omega)>1e-6};
}

// Speed labels, drawn so they never sit on top of each other:
// - gears stacked on one axle (compound) always turn at the same speed, so
//   they share ONE label (the first one, i.e. the largest gear's);
// - a label that would overlap one already placed moves down below it.
function drawSpeedLabels(labels){
  const H=22;
  const seen=new Set(), placed=[];
  for(const l of labels){
    if(seen.has(l.key)) continue;
    seen.add(l.key);
    placed.push(l);
  }
  placed.sort((a,b)=>a.y-b.y||a.x-b.x);
  const done=[];
  for(const l of placed){
    let moved=true;
    while(moved){
      moved=false;
      for(const o of done){
        if(Math.abs(l.x-o.x)<(l.w+o.w)/2+LABEL_GAP && Math.abs(l.y-o.y)<H+LABEL_GAP){
          l.y=o.y+H+LABEL_GAP; moved=true;
        }
      }
    }
    done.push(l);
  }
  for(const l of done){
    const bg=makeEl("g",{transform:`translate(${l.x.toFixed(1)} ${l.y.toFixed(1)})`,"pointer-events":"none"});
    bg.appendChild(makeEl("rect",{x:(-l.w/2).toFixed(1),y:-12,width:l.w.toFixed(1),height:H,rx:6,
      fill:l.fastest?"var(--signal)":"#15232c"}));
    const t=makeEl("text",{x:0,y:3,"text-anchor":"middle",
      "font-family":"var(--mono)","font-size":"12.5","font-weight":"600",fill:"#fff"});
    t.textContent=l.txt;
    bg.appendChild(t);
    layer.appendChild(bg);
  }
}

function render(){
  spinRefs.clear();
  layer.replaceChildren();

  // draw edges (connection cues) under gears
  for(const e of edges){
    const a=byId(e.a),b=byId(e.b);
    if(!a||!b||e.type==="compound") continue;
    layer.appendChild(makeEl("line",{
      x1:a.x,y1:a.y,x2:b.x,y2:b.y,
      stroke:"#9fb3c0",
      "stroke-width":"2","stroke-dasharray":"1 6","stroke-linecap":"round","opacity":"0.5"
    }));
  }

  computeSpeeds();
  const speeds=gears.map(speedInfo);
  const maxMult=Math.max(0,...speeds.filter(s=>s.spinning).map(s=>s.mult));
  // smaller gears drawn on top so compound inner gear is selectable
  const order=[...gears].sort((a,b)=>outerR(b)-outerR(a));
  const labels=[];

  for(const g of order){
    const col=PALETTE[g.colorIdx];
    const grpId="grad"+g.id;
    const grad=makeEl("radialGradient",{id:grpId,cx:"38%",cy:"34%",r:"75%"});
    grad.appendChild(makeEl("stop",{offset:"0%","stop-color":col.lo}));
    grad.appendChild(makeEl("stop",{offset:"58%","stop-color":col.fill}));
    grad.appendChild(makeEl("stop",{offset:"100%","stop-color":col.hi}));
    layer.appendChild(grad);

    const grp=makeEl("g",{transform:`translate(${g.x.toFixed(2)} ${g.y.toFixed(2)})`,style:"cursor:pointer"});
    grp.dataset.id=g.id;

    // selection / fastest rings
    if(g.id===selectedId){
      grp.appendChild(makeEl("circle",{r:outerR(g)+7,fill:"none",stroke:"var(--ink)","stroke-width":"2","stroke-dasharray":"5 5",opacity:"0.8"}));
    }
    const s=speedInfo(g);
    const isFastest=showSpeed&&s.spinning&&gears.length>1&&Math.abs(s.mult-maxMult)<1e-6&&maxMult>0;
    if(isFastest){
      grp.appendChild(makeEl("circle",{r:outerR(g)+3,fill:"none",stroke:"var(--signal)","stroke-width":"3",opacity:"0.9"}));
    }

    // spinning group: teeth + spoke
    const spin=makeEl("g",{transform:`rotate(${g.angle})`});
    spin.appendChild(makeEl("path",{
      d:gearPath(g.teeth),
      fill:`url(#${grpId})`,
      stroke:col.hi,"stroke-width":"1.4","stroke-linejoin":"round"
    }));
    spin.appendChild(makeEl("circle",{r:(pitchR(g)*0.62).toFixed(1),fill:"none",stroke:"rgba(255,255,255,.30)","stroke-width":"1.4"}));
    // reference spoke (shows rotation, like the spec diagram)
    spin.appendChild(makeEl("line",{
      x1:0,y1:0,x2:(pitchR(g)*0.86).toFixed(1),y2:0,
      stroke:"rgba(20,35,45,.5)","stroke-width":"2","stroke-dasharray":"2 4","stroke-linecap":"round"
    }));
    spin.appendChild(makeEl("circle",{cx:(pitchR(g)*0.86).toFixed(1),cy:0,r:3.4,fill:"rgba(20,35,45,.6)"}));
    grp.appendChild(spin);
    spinRefs.set(g.id,spin);

    // axle hole (static, on top)
    grp.appendChild(makeEl("circle",{r:Math.max(6,pitchR(g)*0.12),fill:"#fff",stroke:col.hi,"stroke-width":"2"}));

    // driver badge
    if(g.id===driverId){
      grp.appendChild(makeEl("circle",{r:Math.max(6,pitchR(g)*0.12)-2.5,fill:"var(--amber)"}));
    }

    // speed readout: collected here, drawn after all gears (see below)
    if(showSpeed && s.spinning){
      const txt=`${s.cw?"↻":"↺"} ${s.mult.toFixed(2)}×`;
      labels.push({key:`${g.x.toFixed(1)},${g.y.toFixed(1)}`, x:g.x, y:g.y+outerR(g)+18,
        txt, w:txt.length*7.4+14, fastest:isFastest});
    }

    layer.appendChild(grp);
  }

  drawSpeedLabels(labels);

  // driver direction buttons near the driver gear
  if(driverId&&byId(driverId)&&!running){
    const d=byId(driverId);
    const y=d.y-outerR(d)-30;
    const ctrl=makeEl("g",{});
    const mk=(cx,dir,sym)=>{
      const active=driverDir===dir;
      const gb=makeEl("g",{transform:`translate(${cx} ${y})`,style:"cursor:pointer"});
      gb.dataset.dir=dir;
      gb.classList.add("dirbtn");
      gb.appendChild(makeEl("circle",{r:15,fill:active?"var(--ink)":"#fff",stroke:active?"var(--ink)":"var(--panel-edge)","stroke-width":"1.5",filter:""}));
      const t=makeEl("text",{x:0,y:6,"text-anchor":"middle","font-size":"18","font-family":"var(--display)",
        fill:active?"#fff":"var(--ink-soft)"});
      t.textContent=sym;
      gb.appendChild(t);
      return gb;
    };
    ctrl.appendChild(mk(d.x-19,-1,"↺"));
    ctrl.appendChild(mk(d.x+19, 1,"↻"));
    const cap=makeEl("text",{x:d.x,y:y-22,"text-anchor":"middle","font-family":"var(--mono)","font-size":"15","fill":"#000","letter-spacing":"0.1em"});
    cap.textContent="DRIVE";
    ctrl.appendChild(cap);
    layer.appendChild(ctrl);
  }

  updateChrome();
}

function updateChrome(){
  document.getElementById("emptyHint").style.display=gears.length?"none":"grid";
  const v=validity();
  const runBtn=document.getElementById("runBtn");
  runBtn.disabled=!v.ok && !running;
  const status=document.getElementById("status");
  document.getElementById("statusText").textContent=running?"Running.":v.reason;
  status.className="status"+(running?" run":(v.ok?" ok":(gears.length?" warn":"")));

  // answer chip
  const chip=document.getElementById("answerChip");
  if(showSpeed&&v.ok&&gears.length>1){
    computeSpeeds();
    let best=null,bestM=-1;const dRef=byId(driverId);const base=Math.abs(dRef.omega);
    for(const g of gears){const m=base>0?Math.abs(g.omega)/base:0;if(m>bestM+1e-9){bestM=m;best=g;}}
    if(best&&bestM>0){
      const col=PALETTE[best.colorIdx];
      chip.innerHTML=`<span class="swatch" style="background:${col.fill}"></span>${col.label} gear · ${best.teeth}T · ${bestM.toFixed(2)}×`;
      chip.classList.add("on");
    }else chip.classList.remove("on");
  }else chip.classList.remove("on");

  renderInspector();
}

// ---------- inspector ----------
function renderInspector(){
  const box=document.getElementById("inspector");
  const g=selectedId?byId(selectedId):null;
  box.classList.toggle("disabled",!g);
  const chip=document.querySelector("#inspector .chip"),
        name=document.getElementById("inspName"),
        role=document.getElementById("inspRole"),
        teethInp=document.getElementById("teethInput"),
        speed=document.getElementById("inspSpeed"),
        actDriver=document.getElementById("actDriver"),
        actDetach=document.getElementById("actDetach"),
        incBtn=document.querySelector('.stepper [data-act="inc"]'),
        decBtn=document.querySelector('.stepper [data-act="dec"]');
  if(!g){
    chip.style.background=getComputedStyle(document.body).getPropertyValue("--ink-faint")||"#b7bec2";
    name.textContent="No gear yet";
    role.textContent="Add a gear to begin";
    role.className="role";
    teethInp.value="";
    incBtn.disabled=false;
    decBtn.disabled=false;
    speed.textContent="—";
    actDriver.hidden=true;
    actDetach.hidden=true;
    return;
  }
  const col=PALETTE[g.colorIdx];
  const isDriver=g.id===driverId;
  chip.style.background=col.fill;
  name.textContent=`${col.label} gear`;
  role.textContent=isDriver?"Driver":`Gear #${g.id}`;
  role.className=isDriver?"role driver":"role";
  teethInp.value=g.teeth;
  // + stops at MAX_TEETH, − stops at MIN_TEETH
  incBtn.disabled=g.teeth>=MAX_TEETH;
  decBtn.disabled=g.teeth<=MIN_TEETH;
  computeSpeeds();
  const s=speedInfo(g);
  speed.textContent=s.spinning?`${s.cw?"↻":"↺"} ${s.mult.toFixed(2)}×`:"—";
  actDriver.hidden=isDriver;
  actDetach.hidden=componentOf(g.id).size<=1;
}
function inspAction(act){
  const g=byId(selectedId); if(!g) return;
  if(act==="inc") setTeeth(g.teeth+1);
  else if(act==="dec") setTeeth(g.teeth-1);
  else if(act==="driver"){ driverId=g.id; afterChange(g.id); }
  else if(act==="detach") detachGear(g.id);
  else if(act==="delete") deleteGear(g.id);
}
function setTeeth(n){
  if(running) return;
  const g=byId(selectedId); if(!g) return;
  n=Math.max(MIN_TEETH,Math.min(MAX_TEETH,n||g.teeth));
  g.teeth=n;
  if(componentOf(g.id).size>1) relayout(g.id);
  keepInBounds();
  afterChange(g.id);
}

// ---------- actions ----------
function freeSpot(r){
  for(let tries=0;tries<160;tries++){
    const x=BOUNDS.x0+r+Math.random()*(BOUNDS.x1-BOUNDS.x0-2*r);
    const y=BOUNDS.y0+r+Math.random()*(BOUNDS.y1-BOUNDS.y0-2*r);
    let ok=true;
    for(const g of gears){ if(Math.hypot(x-g.x,y-g.y)<outerR(g)+r+18){ok=false;break;} }
    if(ok) return {x,y};
  }
  return {x:BOUNDS.x0+r+gears.length*8, y:BOUNDS.y0+r+gears.length*8};
}
function addGear(){
  if(running) return;
  const teeth=[12,16,20,24][gears.length%4];
  const r=MODULE*teeth/2+MODULE;
  const {x,y}=freeSpot(r);
  const g={id:nextId++,teeth,x,y,colorIdx:colorCursor%PALETTE.length,angle:0,omega:0};
  colorCursor++;
  gears.push(g);
  if(!driverId) driverId=g.id;
  selectedId=g.id;
  render();
}
function deleteGear(id){
  if(running) return;
  edges=edges.filter(e=>e.a!==id&&e.b!==id);
  gears=gears.filter(g=>g.id!==id);
  if(driverId===id) driverId=gears.length?gears[0].id:null;
  if(selectedId===id) selectedId=null;
  render();
}
function detachGear(id){
  if(running) return;
  edges=edges.filter(e=>e.a!==id&&e.b!==id);
  render();
}
function clearAll(){
  if(running) toggleRun();
  gears=[];edges=[];driverId=null;selectedId=null;colorCursor=0;nextId=1;
  render();
}
function afterChange(focus){ if(focus)selectedId=focus; render(); }

// ---------- snapping ----------
function findSnap(g){
  const comp=componentOf(g.id);
  let bestComp=null,bestMesh=null;
  for(const t of gears){
    if(comp.has(t.id)) continue;
    const dist=Math.hypot(g.x-t.x,g.y-t.y);
    const rgt=pitchR(g)+pitchR(t);
    // compound: dragged centre lands in the target's hub zone — generous so it's easy to hit
    const cThresh=Math.max(30,Math.min(pitchR(g),pitchR(t))*0.7);
    if(dist<cThresh){
      if(!bestComp||dist<bestComp.dist) bestComp={type:"compound",target:t,dist};
    }
    // mesh: rim to rim, only outside the hub zone
    else if(Math.abs(dist-rgt)<MESH_TOL){
      const score=Math.abs(dist-rgt);
      if(!bestMesh||score<bestMesh.score) bestMesh={type:"mesh",target:t,score};
    }
  }
  return bestComp||bestMesh;   // a centre hit always wins over a rim hit
}
function applySnap(g,snap){
  if(edgeExists(g.id,snap.target.id)) return;
  const t=snap.target;
  if(snap.type==="compound"){
    edges.push({a:t.id,b:g.id,type:"compound",angle:0});
  }else{
    const ang=Math.atan2(g.y-t.y,g.x-t.x);
    edges.push({a:t.id,b:g.id,type:"mesh",angle:ang});
  }
  relayout(t.id);
  keepInBounds();
}

// ---------- pointer interaction ----------
let drag=null;
svg.addEventListener("pointerdown",e=>{
  const p=toSvg(e);

  // direction buttons
  const dirBtn=e.target.closest?.(".dirbtn");
  if(dirBtn){ driverDir=parseInt(dirBtn.dataset.dir,10); render(); return; }

  const g=hitGear(p);
  if(!g){ selectedId=null; render(); return; }
  selectedId=g.id; render();
  if(running) return;

  const solo=componentOf(g.id).size===1;
  drag={
    grabId:g.id, solo,
    members:solo?[g.id]:[...componentOf(g.id)],
    startPos:gears.filter(x=>true).reduce((m,x)=>{m[x.id]={x:x.x,y:x.y};return m;},{}),
    ox:p.x, oy:p.y, moved:false
  };
  svg.setPointerCapture(e.pointerId);
});
svg.addEventListener("pointermove",e=>{
  if(!drag) return;
  const p=toSvg(e);
  let dx=p.x-drag.ox, dy=p.y-drag.oy;
  if(Math.abs(dx)>3||Math.abs(dy)>3) drag.moved=true;
  // Never let the dragged gear(s) leave the gear area: stop at its edges.
  let l=Infinity,t=Infinity,r=-Infinity,b=-Infinity;
  for(const id of drag.members){
    const g=byId(id),s=drag.startPos[id],R=outerR(g);
    l=Math.min(l,s.x-R); r=Math.max(r,s.x+R);
    t=Math.min(t,s.y-R); b=Math.max(b,s.y+R);
  }
  dx=Math.min(Math.max(dx,BOUNDS.x0-l),BOUNDS.x1-r);
  dy=Math.min(Math.max(dy,BOUNDS.y0-t),BOUNDS.y1-b);
  for(const id of drag.members){
    const g=byId(id),s=drag.startPos[id];
    g.x=s.x+dx; g.y=s.y+dy;
  }
  render();
  if(drag.solo){
    const g=byId(drag.grabId);
    const snap=findSnap(g);
    if(snap){
      const t=snap.target;
      if(snap.type==="compound"){
        // concentric ghost + crosshair: "stack on this axle"
        layer.appendChild(makeEl("circle",{cx:t.x,cy:t.y,r:outerR(g),fill:"none",
          stroke:"var(--go)","stroke-width":"2.5","stroke-dasharray":"7 6",opacity:"0.95"}));
        layer.appendChild(makeEl("circle",{cx:t.x,cy:t.y,r:6,fill:"var(--go)"}));
        const lbl=makeEl("text",{x:t.x,y:t.y-outerR(t)-10,"text-anchor":"middle",
          "font-family":"var(--mono)","font-size":"11","font-weight":"600",fill:"var(--go)"});
        lbl.textContent="stack on axle";
        layer.appendChild(lbl);
      }else{
        layer.appendChild(makeEl("circle",{cx:t.x,cy:t.y,r:outerR(t)+5,fill:"none",
          stroke:"var(--go)","stroke-width":"2.5","stroke-dasharray":"6 5",opacity:"0.9"}));
        const lbl=makeEl("text",{x:t.x,y:t.y-outerR(t)-10,"text-anchor":"middle",
          "font-family":"var(--mono)","font-size":"11","font-weight":"600",fill:"var(--go)"});
        lbl.textContent="mesh";
        layer.appendChild(lbl);
      }
    }
  }
});
svg.addEventListener("pointerup",e=>{
  if(!drag) return;
  if(drag.solo&&drag.moved){
    const g=byId(drag.grabId);
    const snap=findSnap(g);
    if(snap) applySnap(g,snap);
  }
  drag=null;
  keepInBounds();
  render();
});
svg.addEventListener("pointercancel",()=>{drag=null;render();});

// keyboard delete
window.addEventListener("keydown",e=>{
  if((e.key==="Delete"||e.key==="Backspace")&&selectedId&&!running){
    const tag=document.activeElement?.tagName;
    if(tag==="INPUT") return;
    deleteGear(selectedId);
  }
});

// ---------- run loop ----------
let last=0,rafId=null;
function toggleRun(){
  const v=validity();
  if(!running&&!v.ok) return;
  running=!running;
  const btn=document.getElementById("runBtn");
  btn.classList.toggle("stop",running);
  document.getElementById("runLabel").textContent=running?"Stop":"Run";
  document.getElementById("runIcon").innerHTML=running
    ?'<rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/>'
    :'<path d="M8 5v14l11-7z"/>';
  ["addBtn","clearBtn"].forEach(i=>document.getElementById(i).disabled=running);
  render();
  if(running){ last=performance.now(); rafId=requestAnimationFrame(tick); }
  else if(rafId){ cancelAnimationFrame(rafId); rafId=null; }
}
function tick(now){
  const dt=Math.min(0.05,(now-last)/1000); last=now;
  for(const g of gears){
    if(Math.abs(g.omega)>1e-6){
      g.angle=(g.angle+g.omega*dt*(180/Math.PI))%360;
      const spin=spinRefs.get(g.id);
      if(spin) spin.setAttribute("transform",`rotate(${g.angle})`);
    }
  }
  if(running) rafId=requestAnimationFrame(tick);
}

// ---------- wire up ----------
document.getElementById("addBtn").addEventListener("click",addGear);
document.getElementById("clearBtn").addEventListener("click",clearAll);
document.getElementById("runBtn").addEventListener("click",toggleRun);
const helpPopup=document.getElementById("help-popup");
const insightPopup=document.getElementById("insight-popup");
document.getElementById("help-btn").addEventListener("click",()=>{
  helpPopup.style.display="block";
});
// Insights: the gears animation (gears.json) plays while the panel is open.
let insightAnim=null;
function playInsightAnim(){
  if(!window.lottie||!window.INSIGHT_ANIM) return;
  if(!insightAnim){
    insightAnim=lottie.loadAnimation({
      container:document.getElementById("insight-anim"),
      renderer:"svg",loop:true,autoplay:true,
      animationData:JSON.parse(JSON.stringify(window.INSIGHT_ANIM))
    });
  }else{
    insightAnim.goToAndPlay(0,true);
  }
}
document.getElementById("insight-btn").addEventListener("click",()=>{
  insightPopup.style.display="block";
  playInsightAnim();
});
helpPopup.querySelector(".close-btn").addEventListener("click",()=>{
  helpPopup.style.display="none";
});
insightPopup.querySelector(".close-btn").addEventListener("click",()=>{
  insightPopup.style.display="none";
  if(insightAnim) insightAnim.pause();
});
document.getElementById("speedToggle").addEventListener("click",function(){
  showSpeed=!showSpeed;
  this.classList.toggle("on",showSpeed);
  render();
});

// inspector controls are static markup now — bind once
const inspBox=document.getElementById("inspector");
inspBox.querySelectorAll("[data-act]").forEach(b=>b.addEventListener("click",()=>inspAction(b.dataset.act)));
const teethInp=document.getElementById("teethInput");
teethInp.addEventListener("change",()=>setTeeth(parseInt(teethInp.value,10)));
teethInp.addEventListener("keydown",e=>{if(e.key==="Enter")teethInp.blur();});

// initial chrome state (empty canvas: inspector disabled)
updateChrome();