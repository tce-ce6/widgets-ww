
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

    // speed readout
    if(showSpeed && s.spinning){
      const bg=makeEl("g",{transform:`translate(0 ${(outerR(g)+18).toFixed(1)})`});
      const txt=`${s.cw?"↻":"↺"} ${s.mult.toFixed(2)}×`;
      const w=txt.length*7.4+14;
      bg.appendChild(makeEl("rect",{x:(-w/2).toFixed(1),y:-12,width:w.toFixed(1),height:22,rx:6,
        fill:isFastest?"var(--signal)":"#15232c"}));
      const t=makeEl("text",{x:0,y:3,"text-anchor":"middle",
        "font-family":"var(--mono)","font-size":"12.5","font-weight":"600",fill:"#fff"});
      t.textContent=txt;
      bg.appendChild(t);
      grp.appendChild(bg);
    }

    layer.appendChild(grp);
  }

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
    const cap=makeEl("text",{x:d.x,y:y-22,"text-anchor":"middle","font-family":"var(--mono)","font-size":"10","fill":"var(--ink-faint)","letter-spacing":"0.1em"});
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
  if(!g){
    box.innerHTML='<div class="insp-empty">Click a gear on the canvas to change its teeth or remove it.</div>';
    return;
  }
  const col=PALETTE[g.colorIdx];
  const isDriver=g.id===driverId;
  const connected=componentOf(g.id).size>1;
  computeSpeeds();
  const s=speedInfo(g);
  box.innerHTML=`
    <div class="insp-head">
      <span class="chip" style="background:${col.fill}"></span>
      <div>
        <div class="name">${col.label} gear</div>
        <div class="role ${isDriver?"driver":""}">${isDriver?"Driver":"Gear"} #${g.id}</div>
      </div>
    </div>
    <div class="field">
      <span class="flbl">Teeth</span>
      <div class="stepper">
        <button data-act="dec" aria-label="Fewer teeth">−</button>
        <input type="number" id="teethInput" min="6" max="60" step="1" value="${g.teeth}">
        <button data-act="inc" aria-label="More teeth">+</button>
      </div>
    </div>
    <div class="insp-speed"><span>Speed</span><b>${s.spinning?`${s.cw?"↻":"↺"} ${s.mult.toFixed(2)}×`:"—"}</b></div>
    <div class="insp-actions">
      ${isDriver?"":'<button class="btn" data-act="driver">Make driver</button>'}
      ${connected?'<button class="btn" data-act="detach">Detach</button>':""}
      <button class="btn ghost-danger" data-act="delete">Delete</button>
    </div>`;
  box.querySelectorAll("[data-act]").forEach(b=>b.addEventListener("click",()=>inspAction(b.dataset.act)));
  const inp=box.querySelector("#teethInput");
  inp.addEventListener("change",()=>setTeeth(parseInt(inp.value,10)));
  inp.addEventListener("keydown",e=>{if(e.key==="Enter")inp.blur();});
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
  n=Math.max(6,Math.min(60,n||g.teeth));
  g.teeth=n;
  if(componentOf(g.id).size>1) relayout(g.id);
  afterChange(g.id);
}

// ---------- actions ----------
function freeSpot(r){
  for(let tries=0;tries<160;tries++){
    const x=80+Math.random()*740, y=80+Math.random()*460;
    if(x-r<10||x+r>890||y-r<10||y+r>610) continue;
    let ok=true;
    for(const g of gears){ if(Math.hypot(x-g.x,y-g.y)<outerR(g)+r+18){ok=false;break;} }
    if(ok) return {x,y};
  }
  return {x:140+gears.length*8,y:140};
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
  const dx=p.x-drag.ox, dy=p.y-drag.oy;
  if(Math.abs(dx)>3||Math.abs(dy)>3) drag.moved=true;
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
document.getElementById("speedToggle").addEventListener("click",function(){
  showSpeed=!showSpeed;
  this.classList.toggle("on",showSpeed);
  render();
});

// seed a small example: a meshed pair so the canvas isn't empty
(function seed(){
  addGear();                 // amber driver, 12 teeth
  const a=byId(driverId);
  // add a larger gear already meshed to the driver as a starting example
  const g2={id:nextId++,teeth:24,x:a.x,y:a.y,colorIdx:1,angle:0,omega:0};
  colorCursor=2;
  g2.x=a.x+pitchR(a)+pitchR(g2);
  gears.push(g2);
  edges.push({a:a.id,b:g2.id,type:"mesh",angle:0});
  relayout(a.id);
  selectedId=null;
  render();
})();