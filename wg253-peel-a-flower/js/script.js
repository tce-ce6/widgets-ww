/* =====================================================================
   REPLACEABLE ASSETS  (Peel-a-Flower)
   Set "src" to a data URI (data:image/png;base64,...) or a relative path; "" = built-in drawing.
   The flower is built from five transparent layers that sit exactly on top of each other
   (600 x 600 each, flower upright, stalk at the bottom centre):
     layer_stalk (pedicel + thalamus), layer_corolla, layer_calyx, layer_androecium, layer_gynoecium.
   bbox = where that whorl sits in the frame [x0,y0,x1,y1] in pixels (used to place it in the tray).
   POINTS = where the arrows and magnifier point, in the same 600 x 600 frame.
   ===================================================================== */
const ASSETS = {
  background:      { src: "", frame: [1000, 680] },
  layer_stalk:     { src: "", frame: [600, 600] },
  layer_corolla:   { src: "", frame: [600, 600], bbox: [70, 154, 530, 438] },
  layer_calyx:     { src: "", frame: [600, 600], bbox: [174, 382, 426, 470] },
  layer_androecium:{ src: "", frame: [600, 600], bbox: [192, 168, 408, 434] },
  layer_gynoecium: { src: "", frame: [600, 600], bbox: [260, 166, 340, 434] }
};
const POINTS = { sepal:[236,436], petal:[120,232], anther:[214,256], filament:[253,345], stigma:[300,184],
                 style:[300,290], ovary:[300,396], thalamus:[300,474], pedicel:[300,548] };

const f1=n=>(+n).toFixed(1);
const svg600=b=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600">${b}</svg>`;
const MIR=`transform="translate(600 0) scale(-1 1)"`;
const stops=s=>s.map(([o,c,a])=>`<stop offset="${o}" stop-color="${c}"${a==null?"":` stop-opacity="${a}"`}/>`).join("");
const lg=(id,[x1,y1,x2,y2],s)=>`<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops(s)}</linearGradient>`;
const rg=(id,[cx,cy,r],s)=>`<radialGradient id="${id}" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">${stops(s)}</radialGradient>`;
const rgb=(id,s)=>`<radialGradient id="${id}" cx=".36" cy=".3" r=".78">${stops(s)}</radialGradient>`;   // for small round parts
/* 3D shading: a specular highlight from a bump map of the shape's own alpha, plus a soft cast shadow */
function lit(id,o={}){ const {blur=8,depth=12,k=.75,exp=22,az=235,elev=38,sh=.3,dx=2,dy=5,sb=5}=o;
  return `<filter id="${id}" filterUnits="userSpaceOnUse" x="0" y="0" width="600" height="600" color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="b"/>
<feSpecularLighting in="b" surfaceScale="${depth}" specularConstant="${k}" specularExponent="${exp}" lighting-color="#fff" result="s"><feDistantLight azimuth="${az}" elevation="${elev}"/></feSpecularLighting>
<feComposite in="s" in2="SourceAlpha" operator="in" result="sp"/>
<feComposite in="SourceGraphic" in2="sp" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lit"/>
<feGaussianBlur in="SourceAlpha" stdDeviation="${sb}" result="sb"/><feOffset in="sb" dx="${dx}" dy="${dy}" result="so"/>
<feComponentTransfer in="so" result="sh"><feFuncA type="linear" slope="${sh}"/></feComponentTransfer>
<feMerge><feMergeNode in="sh"/><feMergeNode in="lit"/></feMerge></filter>`; }

function petalSVG(){
  const SIDE="M292 436 C246 424 170 388 118 318 C92 282 74 238 78 200 C80 182 96 176 112 184 C136 196 158 214 180 242 C214 286 250 350 298 432Z";
  const CURL="M78 202 C77 184 92 172 112 182 C121 187 127 193 129 200 C112 196 93 198 78 202Z";
  const MID="M290 432 C252 382 200 304 186 234 C182 210 198 198 216 208 C248 232 272 302 300 430Z";
  const BACK="M284 432 C252 352 240 252 266 196 C278 170 290 160 300 156 C310 160 322 170 334 196 C360 252 348 352 316 432Z";
  const vein=(bx,by,ends,[ox,oy])=>ends.map(([x,y])=>`M${bx} ${by} Q${f1((bx+x)/2+ox)} ${f1((by+y)/2+oy)} ${x} ${y}`).join(" ");
  const vS=vein(292,430,[[132,336],[108,300],[92,266],[84,232],[86,206],[100,190],[124,194],[148,210],[170,232],[198,270],[230,322]],[-14,12]);
  const vM=vein(292,430,[[214,330],[198,284],[188,242],[192,214],[208,206],[226,232],[252,296]],[-8,6]);
  const vB=[[252,330],[246,276],[250,230],[262,196],[280,170],[300,158],[320,170],[338,196],[350,230],[354,276],[348,330]]
    .map(([x,y])=>`M300 430 Q${f1(300+(x-300)*.85)} ${f1((430+y)/2)} ${x} ${y}`).join(" ");
  const midS=`<path d="M294 430 C252 356 176 276 98 196" fill="none" stroke="#FFE3EC" stroke-width="2.6" stroke-opacity=".55"/>
<path d="M297 430 C256 357 181 278 102 198" fill="none" stroke="#7E1240" stroke-width="1.1" stroke-opacity=".35"/>`;
  const spots=[[262,392],[250,378],[268,374],[242,362],[257,354],[232,344],[247,334],[226,322],[212,310],[236,316]]
    .map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="2.8" ry="1.8" transform="rotate(-50 ${x} ${y})" fill="#5E0828" opacity=".7"/>`).join("");
  const curl=`<path d="${CURL}" fill="url(#curl)" stroke="#B83A6C" stroke-width="1" stroke-opacity=".6"/>`;
  const midB=`<path d="M300 428 C298 340 299 240 300 162" fill="none" stroke="#FFE3EC" stroke-width="2.4" stroke-opacity=".5"/>`;
  const petal=(id,d,fill,shade,veins,extra)=>`<clipPath id="c${id}"><path d="${d}"/></clipPath>
<g filter="url(#lp)"><path d="${d}" fill="url(#${fill})"/><g clip-path="url(#c${id})"><path d="${d}" fill="url(#${shade})"/><path d="${d}" fill="url(#throat)"/>
<path d="${veins}" fill="none" stroke="#7E1240" stroke-width="1.3" stroke-opacity=".3"/>${extra||""}</g>
<path d="${d}" fill="none" stroke="#6E0F31" stroke-opacity=".55" stroke-width="1.3"/></g>`;
  return `<defs>
${lg("gS",[294,432,92,192],[[0,"#6A0E2F"],[.2,"#AE245C"],[.48,"#DF5A8D"],[.78,"#F6A6C1"],[1,"#FDE1EA"]])}
${lg("shS",[128,372,214,296],[[0,"#3D0015",.42],[.28,"#ffffff",0],[.46,"#ffffff",.24],[.6,"#ffffff",0],[1,"#3D0015",.5]])}
${lg("gM",[292,432,200,204],[[0,"#4E0922"],[.3,"#8E1C4A"],[.7,"#C64D80"],[1,"#E592B3"]])}
${lg("shM",[212,330,262,310],[[0,"#3D0015",.35],[.5,"#ffffff",.1],[1,"#3D0015",.45]])}
${lg("gB",[300,432,300,156],[[0,"#6A0E2F"],[.28,"#B02A63"],[.62,"#E57AA2"],[1,"#FCD9E5"]])}
${lg("shB",[244,0,356,0],[[0,"#3D0015",.45],[.3,"#ffffff",.16],[.44,"#ffffff",0],[.75,"#3D0015",.08],[1,"#3D0015",.5]])}
${lg("curl",[80,178,126,202],[[0,"#FFEEF3"],[1,"#F2A0BB"]])}
${rg("throat",[300,440,120],[[0,"#F4E37A",.9],[.3,"#F2C860",.45],[1,"#F2C860",0]])}
${lit("lp",{blur:10,depth:14})}</defs>
<g ${MIR}>${petal("mR",MID,"gM","shM",vM)}</g>${petal("mL",MID,"gM","shM",vM)}
${petal("b",BACK,"gB","shB",vB,midB)}
${petal("sL",SIDE,"gS","shS",vS,midS+spots+curl)}<g ${MIR}>${petal("sR",SIDE,"gS","shS",vS,midS+spots+curl)}</g>`;
}
function calyxSVG(){
  const S="M294 458 C262 466 214 450 180 402 C175 394 180 386 189 388 C224 398 258 416 292 434Z";   // cups the petal bases from below
  const one=id=>`<clipPath id="${id}"><path d="${S}"/></clipPath><g filter="url(#ls)"><path d="${S}" fill="url(#gK)"/><g clip-path="url(#${id})"><path d="${S}" fill="url(#shK)"/>
<path d="M292 446 C256 444 216 424 186 396" fill="none" stroke="#D3EDB0" stroke-width="2" stroke-opacity=".75"/>
<path d="M292 450 Q240 452 196 412 M292 442 Q236 430 194 396 M290 454 Q256 460 222 440" fill="none" stroke="#1E3E10" stroke-width="1" stroke-opacity=".35"/></g>
<path d="${S}" fill="none" stroke="#1F4012" stroke-width="1.4" stroke-opacity=".7"/></g>`;
  return `<defs>${lg("gK",[292,446,182,394],[[0,"#1F4413"],[.35,"#3B7526"],[.75,"#6CAB45"],[1,"#A4D477"]])}
${lg("shK",[226,452,250,404],[[0,"#0B2404",.45],[.38,"#ffffff",.2],[.52,"#ffffff",0],[1,"#0B2404",.4]])}${lit("ls",{blur:6,depth:9})}</defs>
${one("kL")}<g ${MIR}>${one("kR")}</g>`;
}
function androeciumSVG(){
  const tips=[[214,256],[236,226],[264,208],[336,208],[364,226],[386,256]];
  let fil="", ant="";
  tips.forEach(([x,y],i)=>{ const bx=284+i*6.4, by=430, cx=(bx+x)/2+(x<300?8:-8), cy=(by+y)/2;
    const d=`M${f1(bx)} ${by} Q${f1(cx)} ${f1(cy)} ${x} ${y+8}`;
    fil+=`<path d="${d}" stroke="#B9A456" stroke-width="6.5"/><path d="${d}" stroke="#EDE2A6" stroke-width="4.2"/><path d="${d}" stroke="#FFFCEB" stroke-width="1.4" stroke-opacity=".9" transform="translate(-1 0)"/>`;
    const ang=Math.atan2(y+8-cy,x-cx)*180/Math.PI+90;      // anther lies along the tip of its filament
    ant+=`<g transform="translate(${x} ${y}) rotate(${f1(ang)})">
<ellipse cx="-5.6" cy="0" rx="7.2" ry="16" fill="url(#an)" stroke="#8A5604" stroke-width="1"/><ellipse cx="5.6" cy="0" rx="7.2" ry="16" fill="url(#an)" stroke="#8A5604" stroke-width="1"/>
<path d="M-5.6 -14 V14 M5.6 -14 V14" stroke="#9A6406" stroke-width="1" stroke-opacity=".7"/>
${[[-7,-8],[-4,2],[-8,7],[6,-9],[8,0],[4,8]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="1.5" fill="#FFF3B8"/>`).join("")}
<ellipse cx="-8" cy="-7" rx="1.8" ry="4.5" fill="#fff" opacity=".6"/>
${[[-9,-24],[3,-28],[10,-21],[-2,-35],[-12,-32]].map(([a,b])=>`<circle cx="${a}" cy="${b}" r="2.6" fill="url(#pl)"/>`).join("")}</g>`;
  });
  return `<defs>${rgb("an",[[0,"#FFF3B0"],[.35,"#F7C93A"],[.75,"#D18E0E"],[1,"#8F5A05"]])}${rgb("pl",[[0,"#FFFBD6"],[.55,"#F6CF3E"],[1,"#B8860B"]])}
${lit("la",{blur:3,depth:5,sb:3,dy:3,sh:.35})}</defs>
<g fill="none" stroke-linecap="round">${fil}</g><g filter="url(#la)">${ant}</g>`;
}
function gynoeciumSVG(){
  const OV="M300 350 C326 350 340 372 340 398 C340 420 324 434 300 434 C276 434 260 420 260 398 C260 372 274 350 300 350Z";
  const LOC="M300 362 C318 362 328 378 328 398 C328 414 316 424 300 424 C284 424 272 414 272 398 C272 378 282 362 300 362Z";
  const STY="M293 358 C294 300 295 240 295.5 196 L304.5 196 C305 240 306 300 307 358Z";
  const ovules=[[287,377],[313,377],[285,394],[315,394],[287,411],[313,411]].map(([x,y])=>{ const s=x<300?-1:1;
    return `<path d="M300 ${y} L${x} ${y}" stroke="#9BB46A" stroke-width="1.6"/><ellipse cx="${x+s}" cy="${y}" rx="7" ry="6" fill="url(#ov)" stroke="#A88A30" stroke-width=".9"/><circle cx="${x+s*6}" cy="${y}" r="1" fill="#A88A30"/>`; }).join("");
  return `<defs>${lg("gSt",[293,0,307,0],[[0,"#3F6E1E"],[.35,"#9CCB63"],[.55,"#D9F1B3"],[1,"#4F8126"]])}
${rg("gOv",[284,378,70],[[0,"#D6F0AA"],[.45,"#8CC456"],[1,"#3A671C"]])}
${rg("gLoc",[300,392,34],[[0,"#FCFFF4"],[.65,"#E6F4CF"],[1,"#B4D48A"]])}
${rgb("ov",[[0,"#FFFFFF"],[.5,"#FFF3C8"],[1,"#D4B25A"]])}${rgb("stg",[[0,"#FFE0B0"],[.4,"#F39345"],[1,"#9A4510"]])}${rgb("pl",[[0,"#FFFBD6"],[.55,"#F6CF3E"],[1,"#B8860B"]])}
${lit("lg",{blur:5,depth:8})}</defs>
<g filter="url(#lg)"><path d="${STY}" fill="url(#gSt)"/>
${[[289,191],[311,191],[300,180]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="10.5" fill="url(#stg)" stroke="#8A3C0C" stroke-width="1"/>`).join("")}
<path d="${OV}" fill="url(#gOv)" stroke="#355F18" stroke-width="1.5"/></g>
<path d="${LOC}" fill="url(#gLoc)"/><path d="${LOC}" fill="none" stroke="#4E7A2C" stroke-opacity=".5" stroke-width="2.2"/>
<path d="M300 366 V420" stroke="#C9DA9C" stroke-width="5" stroke-linecap="round"/><path d="M300 366 V420" stroke="#93AE5E" stroke-width="1.2"/>
${ovules}
${[[286,186],[308,186],[297,175]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="3" ry="2" fill="#fff" opacity=".7"/>`).join("")}
<circle cx="294" cy="171" r="2.6" fill="url(#pl)"/><circle cx="316" cy="183" r="2.4" fill="url(#pl)"/><circle cx="282" cy="198" r="2.3" fill="url(#pl)"/>`;
}
function stalkSVG(){
  const PED="M289 590 C290 556 290 520 288 486 L312 486 C310 520 310 556 311 590Z";
  const TH="M290 494 C287 476 262 466 247 453 C240 446 246 438 258 436 C276 432 290 431 300 431 C310 431 324 432 342 436 C354 438 360 446 353 453 C338 466 313 476 310 494Z";
  return `<defs>${lg("gP",[288,0,312,0],[[0,"#244A15"],[.3,"#5F9A3A"],[.46,"#A6D67C"],[.62,"#5F9A3A"],[1,"#1F4212"]])}
${rg("gT",[286,444,72],[[0,"#C8EA9F"],[.45,"#78B44F"],[1,"#2E5B1A"]])}${lit("lt",{blur:5,depth:7})}</defs>
<g filter="url(#lt)"><path d="${PED}" fill="url(#gP)"/><path d="${TH}" fill="url(#gT)" stroke="#2E5B1A" stroke-width="1.4"/></g>
<ellipse cx="300" cy="590" rx="11" ry="3.6" fill="#E3F2CD" stroke="#5F9A3A" stroke-width="1.2"/><circle cx="300" cy="590" r="1.6" fill="#9BC271"/>`;
}
const DEFAULT_ART={
  background:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 680"><defs><radialGradient id="g" cx=".36" cy=".46" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".6" stop-color="#F7FAF0"/><stop offset="1" stop-color="#E4EEDD"/></radialGradient>
<filter id="b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter></defs><rect width="1000" height="680" fill="url(#g)"/>
<g filter="url(#b)" opacity=".45"><circle cx="150" cy="110" r="90" fill="#FBD3E1"/><circle cx="560" cy="640" r="130" fill="#D2EAC2"/><circle cx="60" cy="600" r="90" fill="#FBE3B5"/></g></svg>`,
  layer_stalk:svg600(stalkSVG()), layer_corolla:svg600(petalSVG()), layer_calyx:svg600(calyxSVG()),
  layer_androecium:svg600(androeciumSVG()), layer_gynoecium:svg600(gynoeciumSVG())
};
const src=k=>ASSETS[k].src||("data:image/svg+xml;charset=utf-8,"+encodeURIComponent(DEFAULT_ART[k]));

/* ---------- fit the fixed canvas to any screen (no scrolling) ---------- */
const app=document.getElementById("app");
const SIZES={land:[1280,720],port:[480,1000]};
let SCALE=1, MODE="land";
/* IFT panels: Help, sound and full-screen buttons move from the top-right header to a dock at the bottom-left,
   so short teachers can reach them. Phones and tablets keep them in the header.
   Test override: add ?ift=1 (force dock) or ?ift=0 (force header) to the URL. */
function isPanel(){
  const q=new URLSearchParams(location.search).get("ift"); if(q==="1") return true; if(q==="0") return false;
  const ua=navigator.userAgent||"";
  if(/iPhone|iPad|iPod/.test(ua)||(/Macintosh/.test(ua)&&navigator.maxTouchPoints>1)) return false; // iOS / iPadOS
  if(/Mobile/.test(ua)) return false;                                                                  // phones
  const L=Math.max(screen.width,screen.height), S=Math.min(screen.width,screen.height), r=L/S;
  if(L>=1600&&S>=900) return true;                 // 1080p / 4K panels (DPR 1-2), large monitors
  return S>=700&&r>1.7&&r<1.8;                      // 16:9 panels with high scaling (e.g. 1280x720 CSS px)
}
const UTIL=["helpBtn","soundBtn","fsBtn"].map(id=>document.getElementById(id));
const UTIL_HOME=["soundBtn","helpBtn","fsBtn"].map(id=>document.getElementById(id));
function placeUtil(ift){
  app.classList.toggle("ift",ift);
  const host=ift?document.getElementById("dock"):document.querySelector(".acts");
  const order=ift?UTIL:UTIL_HOME;
  if(order.some(b=>b.parentNode!==host)) order.forEach(b=>host.appendChild(b));
}
function fit(){
  const cs=getComputedStyle(document.getElementById("safe"));
  const pl=parseFloat(cs.paddingLeft)||0, pr=parseFloat(cs.paddingRight)||0, pt=parseFloat(cs.paddingTop)||0, pb=parseFloat(cs.paddingBottom)||0;
  const vw=(window.visualViewport?visualViewport.width:innerWidth), vh=(window.visualViewport?visualViewport.height:innerHeight);
  const aw=vw-pl-pr, ah=vh-pt-pb;
  const mode = aw/ah >= 1 ? "land" : "port";
  if(mode!==MODE){ MODE=mode; app.className=mode; }
  placeUtil(mode==="land"&&isPanel());
  const [W,H]=SIZES[mode];
  SCALE=Math.min(aw/W, ah/H);
  const x=pl+(aw-W*SCALE)/2, y=pt+(ah-H*SCALE)/2;
  app.style.transform=`translate(${x}px,${y}px) scale(${SCALE})`;
  if(tourOn) placeTour();
}
addEventListener("resize",fit); addEventListener("pageshow",fit); document.addEventListener("fullscreenchange",fit); document.addEventListener("webkitfullscreenchange",fit); addEventListener("orientationchange",()=>setTimeout(fit,200));
if(window.visualViewport) visualViewport.addEventListener("resize",fit);
["gesturestart","gesturechange","gestureend"].forEach(ev=>document.addEventListener(ev,e=>e.preventDefault(),{passive:false}));
let lastTouch=0; document.addEventListener("touchend",e=>{const n=Date.now(); if(n-lastTouch<300&&e.target.type!=="range") e.preventDefault(); lastTouch=n;},{passive:false});
document.addEventListener("touchmove",e=>{ if(e.target.type!=="range") e.preventDefault(); },{passive:false});

/* ---------- full screen (where the browser supports it) ---------- */
const fsBtn=document.getElementById("fsBtn");
const fsOK=document.fullscreenEnabled||document.webkitFullscreenEnabled;
if(fsOK){ fsBtn.hidden=false; fsBtn.onclick=()=>{
  const d=document, r=d.documentElement;
  if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d);}
  else{(r.requestFullscreen||r.webkitRequestFullscreen).call(r);} }; }


const NS="http://www.w3.org/2000/svg", scene=document.getElementById("scene");
function el(tag,attrs={},parent=scene){ const n=document.createElementNS(NS,tag);
  for(const k in attrs){ if(k==="text") n.textContent=attrs[k]; else n.setAttribute(k,attrs[k]); } parent.appendChild(n); return n; }
const $=id=>document.getElementById(id);
const defs=el("defs");
/* ---------- toast ---------- */
let toastTimer=null;
function toast(msg,kind,ms){ const t=$("toast"); t.textContent=msg; t.className=kind||""; t.hidden=!msg; clearTimeout(toastTimer); if(msg&&ms) toastTimer=setTimeout(()=>t.hidden=true,ms); }


/* ---------- SOUND: right / wrong answer cues (Web Audio, no files, works offline) ---------- */
const Sound={on:true,ctx:null,
  ensure(){ const AC=window.AudioContext||window.webkitAudioContext; if(!this.ctx&&AC){ try{this.ctx=new AC();}catch(e){} }
    if(this.ctx&&this.ctx.state==="suspended") this.ctx.resume(); },
  tone(f,t,d,type,v){ const c=this.ctx,o=c.createOscillator(),g=c.createGain(); o.type=type; o.frequency.value=f;
    g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(v,t+0.015); g.gain.exponentialRampToValueAtTime(0.0001,t+d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t+d+0.05); },
  play(kind){ if(!this.on) return; this.ensure(); if(!this.ctx) return; const t=this.ctx.currentTime+0.03;
    if(kind==="ok") [523.25,659.25,783.99].forEach((f,i)=>this.tone(f,t+i*0.09,0.3,"sine",0.22));
    else [233.08,185].forEach((f,i)=>this.tone(f,t+i*0.16,0.28,"triangle",0.2)); },
  set(on){ this.on=on; $("soundBtn").setAttribute("aria-pressed",on?"true":"false"); $("soundBtn").setAttribute("aria-label",on?"Sound is on. Tap to turn off":"Sound is off. Tap to turn on"); }
};
["pointerdown","touchstart","keydown"].forEach(ev=>document.addEventListener(ev,()=>{ if(Sound.on) Sound.ensure(); },{once:true,passive:true}));

/* ---------- MCQ engine: rationale for each wrong choice; answer shown after 2 wrong tries ---------- */
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function shuffleOpts(item){ const right=item.opts[item.a]; shuffle(item.opts); item.a=item.opts.indexOf(right); return item; }
function mcq(box,item,onEnd){
  box.innerHTML=`<p>${item.q}</p>`+item.opts.map((o,i)=>`<button class="opt" data-i="${i}">${o.t}</button>`).join("")+`<div class="fb" aria-live="polite"></div>`;
  const fb=box.querySelector(".fb"), btns=[...box.querySelectorAll(".opt")]; let wrong=0;
  btns.forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i, o=item.opts[i];
    if(i===item.a){
      b.classList.add("right"); btns.forEach(x=>x.disabled=true);
      fb.className="fb ok"; fb.textContent=(wrong===0?"Correct! ":"That's right. ")+o.why; Sound.play("ok");
      onEnd&&onEnd(wrong===0);
    } else {
      wrong++; b.classList.add("wrong"); b.disabled=true; Sound.play("no");
      if(wrong<2){ fb.className="fb no"; fb.textContent="Not quite. "+o.why+" Try again."; }
      else { const c=item.opts[item.a]; btns[item.a].classList.add("right"); btns.forEach(x=>x.disabled=true);
        fb.className="fb info"; fb.textContent=`The correct answer is “${c.t}” ${c.why}`; onEnd&&onEnd(false); }
    }
  });
}

/* ---------- HUD ---------- */
function hud(a,b,c,meter){
  [["h1l","h1",a],["h2l","h2",b],["h3l","h3",c]].forEach(([l,v,d])=>{$(l).textContent=d[0];$(v).textContent=d[1];});
  $("hm").hidden=meter==null; if(meter!=null) $("needle").style.left=meter+"%";
}


const lerp=(a,b,t)=>a+(b-a)*t, ease=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;

/* ---------- shared flower ---------- */
const FX=83, FY=-14, FS=0.95;                // flower frame (600 x 600) position and scale in the scene
const P=k=>[FX+POINTS[k][0]*FS, FY+POINTS[k][1]*FS];
const LX=FX+60*FS, RX=FX+540*FS;            // label columns: right edge of the left column, left edge of the right one
defs.innerHTML=`<linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F4F6F6"/><stop offset=".45" stop-color="#9BA3A3"/><stop offset=".55" stop-color="#E7ECEC"/><stop offset="1" stop-color="#5D6666"/></linearGradient>
<linearGradient id="grip" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B4A48"/><stop offset=".35" stop-color="#6E807D"/><stop offset="1" stop-color="#1D2826"/></linearGradient>
<radialGradient id="glass" cx=".32" cy=".28" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".35" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#9FD6E8" stop-opacity=".18"/></radialGradient>
<filter id="blur6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#5A4A10" flood-opacity=".16"/></filter>`;
el("image",{href:src("background"),x:0,y:0,width:1000,height:680,preserveAspectRatio:"xMidYMid slice"});
const trayG=el("g",{});
el("rect",{x:712,y:14,width:280,height:412,rx:20,fill:"#fff",stroke:"#EAE3C6","stroke-width":2,filter:"url(#soft)"},trayG);
el("text",{x:852,y:48,"text-anchor":"middle","font-size":24,"font-weight":800,fill:"#17807A",text:"Peeled whorls"},trayG);
const ORDER=["calyx","corolla","androecium","gynoecium"];
const WH={
  calyx:{name:"Calyx",parts:"sepals",layer:"layer_calyx",slot:[782,126],col:"#3F8A2E",
    info:"Calyx: the outermost whorl, made of small green leaf-like sepals. In the bud stage, the sepals enclose and protect the growing flower."},
  corolla:{name:"Corolla",parts:"petals",layer:"layer_corolla",slot:[922,126],col:"#D0337A",
    info:"Corolla: the second whorl, made of petals. Petals are coloured or white, never green, and often fragrant. They attract insects for pollination."},
  androecium:{name:"Androecium",parts:"stamens",layer:"layer_androecium",slot:[782,300],col:"#C88A06",
    info:"Androecium: the third whorl, made of stamens. Each stamen has a thread-like filament with an anther at its tip. Anthers make pollen grains, which contain the male gametes. It is the male reproductive part."},
  gynoecium:{name:"Gynoecium",parts:"pistil",layer:"layer_gynoecium",slot:[922,300],col:"#17807A",
    info:"Gynoecium: the innermost whorl, the pistil (carpel). The stigma receives pollen grains, the style leads down to the ovary, and the ovary holds ovules with the female gametes. It is the female reproductive part."}
};
ORDER.forEach(w=>{ const [x,y]=WH[w].slot; el("rect",{x:x-62,y:y-62,width:124,height:166,rx:14,fill:"#FBFAF3",stroke:"#E2DAB8","stroke-width":1.5,"stroke-dasharray":"6 5"},trayG); });
const flowerOuter=el("g",{});
const flowerG=el("g",{transform:`translate(${FX} ${FY}) scale(${FS})`},flowerOuter);
el("ellipse",{cx:300,cy:594,rx:56,ry:8,fill:"#3A3A10",opacity:.25,filter:"url(#blur6)"},flowerG);
const stalkImg=el("image",{href:src("layer_stalk"),x:0,y:0,width:600,height:600},flowerG);
const L={};
// calyx is painted first so the petals overlap it, as on a real flower
["calyx","corolla","androecium","gynoecium"].forEach(w=>{ const g=el("g",{},flowerG); L[w]={g,img:el("image",{href:src(WH[w].layer),x:0,y:0,width:600,height:600},g)}; });
const trayLabels=el("g",{},trayG);
function trayTransform(w){
  const b=ASSETS[WH[w].layer].bbox, bw=b[2]-b[0], bh=b[3]-b[1], s=Math.min(1,112/(bw*FS),92/(bh*FS));
  const cx=(b[0]+b[2])/2, cy=(b[1]+b[3])/2, sx=(WH[w].slot[0]-FX)/FS, sy=(WH[w].slot[1]-4-FY)/FS;
  return {tx:sx-cx*s, ty:sy-cy*s, s};
}
function setLayerT(w,p){ const T=trayTransform(w), s=lerp(1,T.s,p);
  L[w].g.setAttribute("transform",`translate(${f1(lerp(0,T.tx,p))} ${f1(lerp(0,T.ty,p))}) scale(${s.toFixed(4)})`); }
const lensG=el("g",{}), labelsG=el("g",{}), arrowG=el("g",{});
/* labels sit in two tidy columns either side of the flower; each leader runs level from its label, then straight to the part */
const LBL=[["petal","Petal","corolla","L"],["anther","Anther","androecium","L"],["filament","Filament","androecium","L"],["sepal","Sepal","calyx","L"],
  ["pedicel","Pedicel","","L","(stalk)"],["stigma","Stigma","gynoecium","R"],["style","Style","gynoecium","R"],["ovary","Ovary","gynoecium","R"],["thalamus","Thalamus","","R"]];
function spread(items,gap,lo,hi){
  items.forEach((it,i)=>it.ly=Math.max(it.p[1],i?items[i-1].ly+gap:lo));
  for(let i=items.length-1;i>=0;i--){ const max=i===items.length-1?hi:items[i+1].ly-gap; if(items[i].ly>max) items[i].ly=max; }
}
function tag(it,parent){
  const g=el("g",{},parent), Lft=it.side==="L", x=Lft?LX:RX, y=it.ly, col=it.col, tx=Lft?x-12:x+12, anchor=Lft?"end":"start";
  const halo=el("polyline",{fill:"none",stroke:"#fff","stroke-width":6,"stroke-linejoin":"round","stroke-opacity":.85},g);
  const line=el("polyline",{fill:"none",stroke:col,"stroke-width":2.4,"stroke-linejoin":"round"},g);
  const t=el("text",{x:tx,y:it.sub?y-2:y+6.5,"text-anchor":anchor,"font-size":19,"font-weight":800,fill:"#1E2B2A",text:it.t},g);
  if(it.sub) el("text",{x:tx,y:y+15,"text-anchor":anchor,"font-size":14,"font-weight":600,fill:"#5F6F6D",text:it.sub},g);
  const tb=t.getBBox(), top=tb.y-5, h=it.sub?46:tb.height+10;
  let w=0; g.querySelectorAll("text").forEach(n=>w=Math.max(w,n.getBBox().width)); w+=20;
  const rx0=Lft?x-2-w:x+2;
  g.insertBefore(el("rect",{x:rx0,y:top,width:w,height:h,rx:10,fill:"#fff",stroke:col,"stroke-width":2,filter:"url(#soft)"},g),t);
  const sx=Lft?x-2:x+2, ex=Lft?x+14:x-14, pts=`${sx},${y} ${ex},${y} ${f1(it.p[0])},${f1(it.p[1])}`;
  halo.setAttribute("points",pts); line.setAttribute("points",pts);
  el("circle",{cx:it.p[0],cy:it.p[1],r:5,fill:col,stroke:"#fff","stroke-width":2},g);
}

/* ---------- PEEL ---------- */
const S={tab:"peel",peel:{off:[],anim:null,lens:false,labels:false,asked:false},build:{on:{calyx:true,corolla:true,androecium:true,gynoecium:true},seen:new Set(),asked:false},ch:{i:0,stars:0,got:{}}};
function nextWhorl(){ return ORDER.find(w=>!S.peel.off.includes(w)); }
function peelDraw(){
  const Pe=S.peel;
  document.querySelectorAll("#peelBtns button").forEach(b=>{ const off=Pe.off.includes(b.dataset.w); b.disabled=off||!!Pe.anim; b.setAttribute("aria-pressed",off?"true":"false"); });
  trayLabels.innerHTML="";
  Pe.off.forEach(w=>{ const [x,y]=WH[w].slot; el("text",{x,y:y+72,"text-anchor":"middle","font-size":20,"font-weight":800,fill:WH[w].col,text:WH[w].name},trayLabels); el("text",{x,y:y+93,"text-anchor":"middle","font-size":16,"font-weight":600,fill:"#5F6F6D",text:`(${WH[w].parts})`},trayLabels); });
  const left=4-Pe.off.length, nx=nextWhorl();
  const rep=(!Pe.off.includes("androecium")?1:0)+(!Pe.off.includes("gynoecium")?1:0);
  hud(["Whorls on the flower",`${left} of 4`],["Last peeled",Pe.off.length?WH[Pe.off[Pe.off.length-1]].name:"none yet"],["Next whorl",nx?"?":"all peeled"]);
  drawLabels(); drawLens();
}
function drawLabels(){
  labelsG.innerHTML=""; if(S.tab!=="peel"||!S.peel.labels) return;
  const off=S.peel.off;
  const items=LBL.filter(l=>!l[2]||!off.includes(l[2])).map(([k,t,w,side,sub])=>({p:P(k),t,sub,side,col:w?WH[w].col:"#5B6B4E"}));
  ["L","R"].forEach(side=>{ const col=items.filter(i=>i.side===side).sort((a,b)=>a.p[1]-b.p[1]); spread(col,50,40,640); col.forEach(it=>tag(it,labelsG)); });
}
function drawLens(){
  lensG.innerHTML=""; if(S.tab!=="peel"||!S.peel.lens) return;
  const off=S.peel.off, lenses=[];
  if(!off.includes("androecium")) lenses.push({key:"anther",layer:"layer_androecium",sc:4,cap:"Anther: pollen grains"});
  if(!off.includes("gynoecium")) lenses.push({key:"ovary",layer:"layer_gynoecium",sc:3.2,cap:"Ovary: ovules inside"});
  if(!lenses.length){ toast("Nothing left to magnify. Tap Put back to rebuild the flower.","info",TOAST_MS); return; }
  // one lens: big, low on the right; two lenses: side by side under the tray, staggered so the pointer lines don't cross
  // [cx, cy, R, handle angle]
  const spots=lenses.length===1?[[852,546,80,36]]:[[885,520,58,36],[730,555,58,144]];
  lenses.forEach((l,i)=>drawOneLens(l,...spots[i],i));
}
function drawOneLens({key,layer,sc,cap},cx,cy,R,ang,i){
  const [px,py]=POINTS[key], cid="lensClip"+i;
  const cp=el("clipPath",{id:cid},lensG); el("circle",{cx,cy,r:R},cp);
  const [sx,sy]=P(key), d=Math.hypot(sx-cx,sy-cy), ex=cx+(sx-cx)/d*(R+9), ey=cy+(sy-cy)/d*(R+9);
  el("line",{x1:sx,y1:sy,x2:ex,y2:ey,stroke:"#F4A62A","stroke-width":3.5,"stroke-dasharray":"8 6","stroke-linecap":"round"},lensG);
  el("circle",{cx:sx,cy:sy,r:18,fill:"rgba(244,166,42,.12)",stroke:"#F4A62A","stroke-width":3.5},lensG);
  const hg=el("g",{transform:`translate(${cx} ${cy}) rotate(${ang})`,filter:"url(#soft)"},lensG);
  el("rect",{x:R+4,y:-8,width:22,height:16,rx:3,fill:"url(#metal)"},hg); el("rect",{x:R+24,y:-11,width:50,height:22,rx:11,fill:"url(#grip)"},hg);
  el("circle",{cx,cy,r:R,fill:"#fff"},lensG);
  const g=el("g",{"clip-path":`url(#${cid})`},lensG);
  el("image",{href:src(layer),x:cx-px*sc,y:cy-py*sc,width:600*sc,height:600*sc},g);
  el("circle",{cx,cy,r:R,fill:"url(#glass)"},lensG);
  el("circle",{cx,cy,r:R+5,fill:"none",stroke:"url(#metal)","stroke-width":10,filter:"url(#soft)"},lensG);
  el("circle",{cx,cy,r:R,fill:"none",stroke:"rgba(0,0,0,.25)","stroke-width":1.5},lensG);
  if(R<80){ const [nm,sub]=cap.split(": ");   // small lens: caption on two lines so the pair fits side by side
    el("text",{x:cx,y:cy+R+26,"text-anchor":"middle","font-size":19,"font-weight":800,fill:"#1E2B2A",text:nm},lensG);
    el("text",{x:cx,y:cy+R+45,"text-anchor":"middle","font-size":16,"font-weight":600,fill:"#5F6F6D",text:sub},lensG); }
  else el("text",{x:cx,y:cy+R+36,"text-anchor":"middle","font-size":21,"font-weight":800,fill:"#1E2B2A",text:cap},lensG);
}
const TOAST_MS=9000;
function peel(w){
  const Pe=S.peel; if(Pe.anim||Pe.off.includes(w)) return;
  const nx=nextWhorl();
  if(w!==nx){ Sound.play("no"); toast(`The ${WH[w].name.toLowerCase()} is further inside. Peel the whorls from the outside in: which whorl is outermost now?`,"no",TOAST_MS); return; }
  Pe.anim={w,t:0}; Pe.off.push(w); peelDraw(); toast(""); $("peelInfo").textContent=WH[w].info;
}
function peelTick(dt){
  const Pe=S.peel; if(!Pe.anim) return;
  Pe.anim.t=Math.min(1,Pe.anim.t+dt/0.7); setLayerT(Pe.anim.w,ease(Pe.anim.t));
  if(Pe.anim.t>=1){ Pe.anim=null; peelDraw(); if(Pe.off.length===4&&!Pe.asked){ Pe.asked=true; setTimeout(peelAsk,1200); } }
}
const PEEL_Q={q:"Which whorl is the female reproductive part of the flower?",a:3,opts:[
  {t:"Calyx",why:"The calyx is made of sepals that protect the bud. Think about which whorl holds the ovules."},
  {t:"Corolla",why:"The petals attract insects but make no gametes. Think about which whorl holds the ovules."},
  {t:"Androecium",why:"The stamens make pollen grains with the male gametes. Look for the whorl with ovules."},
  {t:"Gynoecium",why:"The gynoecium (pistil) has the ovary, whose ovules contain the female gamete."}]};
function peelAsk(){ $("pane-peel").classList.add("asking"); $("peelQ").hidden=false; mcq($("peelQ"),PEEL_Q); }
function peelReset(){
  const Pe=S.peel; Pe.off=[]; Pe.anim=null; ORDER.forEach(w=>L[w].g.setAttribute("transform",""));
  $("peelQ").hidden=true; $("pane-peel").classList.remove("asking"); Pe.asked=false; toast(""); $("peelInfo").textContent=""; peelDraw();
}
document.querySelectorAll("#peelBtns button").forEach(b=>b.addEventListener("click",()=>peel(b.dataset.w)));
$("lensBtn").onclick=()=>{ S.peel.lens=!S.peel.lens; $("lensBtn").setAttribute("aria-pressed",S.peel.lens); drawLens(); };
$("labelBtn").onclick=()=>{ S.peel.labels=!S.peel.labels; $("labelBtn").setAttribute("aria-pressed",S.peel.labels); drawLabels(); };
$("peelReset").onclick=peelReset;

/* ---------- BUILD ---------- */
function buildState(){
  const o=S.build.on, n=ORDER.filter(w=>o[w]).length, m=o.androecium, f=o.gynoecium;
  const complete=n===4;
  const sex=m&&f?"Both":m?"Male only":f?"Female only":"None";
  return {n,complete,sex,m,f};
}
function buildDraw(){
  const o=S.build.on, st=buildState();
  ORDER.forEach(w=>{ L[w].g.setAttribute("opacity",o[w]?1:0.07); L[w].g.setAttribute("transform",""); });
  document.querySelectorAll("#buildBtns button").forEach(b=>b.setAttribute("aria-pressed",o[b.dataset.w]?"true":"false"));
  hud(["Whorls present",`${st.n} of 4`],["This flower is",st.complete?"Complete":"Incomplete"],["Reproductive parts",st.sex]);
  $("h3").style.color=(!st.m&&!st.f)?"#C2452D":"";
}
function buildMsg(w){
  const st=buildState(), o=S.build.on;
  let msg=`${o[w]?"Added":"Removed"} the ${WH[w].name.toLowerCase()}. `;
  msg+= st.complete?"All four whorls are present, so it is a complete flower. It has both stamens and a pistil, so it is bisexual."
    :`A whorl is missing, so it is an incomplete flower. `+(st.m&&st.f?"It still has both stamens and a pistil, so it is bisexual."
    :st.m?"It has stamens but no pistil, so it is a unisexual (male) flower."
    :st.f?"It has a pistil but no stamens, so it is a unisexual (female) flower."
    :"With no stamens and no pistil, it cannot make seeds.");
  $("buildInfo").textContent=msg; $("buildInfo").className="fb hideAsk2 "+(st.m||st.f?"info":"no");
  S.build.seen.add(ORDER.map(k=>o[k]?1:0).join(""));
  if(S.build.seen.size>=4&&!S.build.asked){ S.build.asked=true; setTimeout(buildAsk,1500); }
}
const BUILD_QS=[
  {q:"A flower has sepals, petals and a pistil, but no stamens. What kind of flower is it?",a:1,opts:[
    {t:"Complete and bisexual",why:"A complete flower has all four whorls, and a bisexual one has both stamens and a pistil. Count what is present here."},
    {t:"Incomplete and unisexual (female)",why:"The stamens are missing, so it is incomplete, and it has only the female part (pistil), so it is unisexual."},
    {t:"Incomplete and bisexual",why:"Bisexual flowers have both stamens and a pistil. Which reproductive part is missing?"},
    {t:"Complete and unisexual (male)",why:"The male part is the stamens. Check which whorls are present and which are missing."}]},
  {q:"A flower has sepals, petals and stamens, but no pistil. What kind of flower is it?",a:2,opts:[
    {t:"Incomplete and unisexual (female)",why:"The female part is the pistil, and that is the whorl that is missing here."},
    {t:"Complete and bisexual",why:"A complete flower needs all four whorls. One whorl is missing here."},
    {t:"Incomplete and unisexual (male)",why:"The pistil is missing, so it is incomplete, and it has only the male part (stamens), so it is unisexual."},
    {t:"Incomplete and bisexual",why:"Bisexual flowers have both stamens and a pistil. Which reproductive part is missing?"}]},
  {q:"A flower has no petals, but it has sepals, stamens and a pistil. What kind of flower is it?",a:0,opts:[
    {t:"Incomplete and bisexual",why:"The petals are missing, so it is incomplete, but it still has both stamens and a pistil, so it is bisexual."},
    {t:"Incomplete and unisexual",why:"Missing petals make it incomplete, but unisexual means one reproductive part is missing. Are both stamens and pistil there?"},
    {t:"Complete and bisexual",why:"A complete flower has all four whorls. Are the petals there?"},
    {t:"It cannot be a flower without petals",why:"Petals only attract insects. A flower can still reproduce without them."}]},
  {q:"A flower has all four whorls: sepals, petals, stamens and a pistil. What kind of flower is it?",a:3,opts:[
    {t:"Complete and unisexual",why:"It is complete, but unisexual flowers have only stamens or only a pistil. This one has both."},
    {t:"Incomplete and bisexual",why:"Incomplete means at least one whorl is missing. Are any missing here?"},
    {t:"Incomplete and unisexual",why:"All four whorls are present, and both reproductive parts are there. Think again about both words."},
    {t:"Complete and bisexual",why:"All four whorls are present, so it is complete, and it has both stamens and a pistil, so it is bisexual."}]},
  {q:"Which two whorls must a flower have to be bisexual?",a:1,opts:[
    {t:"Calyx and corolla",why:"Sepals and petals protect the bud and attract insects, but they make no gametes."},
    {t:"Androecium and gynoecium",why:"The androecium (stamens) is the male part and the gynoecium (pistil) is the female part. A bisexual flower has both."},
    {t:"Calyx and gynoecium",why:"The calyx makes no gametes. A bisexual flower needs both the male and the female part."},
    {t:"Corolla and androecium",why:"The corolla makes no gametes. A bisexual flower needs both the male and the female part."}]}];
function buildAsk(){
  const B=S.build;
  B.qs=shuffle(BUILD_QS.slice()); B.qi=0; $("pane-build").classList.add("asking"); $("buildQ").hidden=false; buildShowQ();
}
function buildShowQ(){
  const B=S.build, box=$("buildQ"), last=B.qi===B.qs.length-1;
  mcq(box,B.qs[B.qi],()=>{
    box.insertAdjacentHTML("beforeend",`<div class="row btns"><button class="btn primary">${last?"Build again":"Next question"}</button></div>`);
    box.querySelector(".btn.primary").onclick=()=>{ if(last) buildRestart(); else { B.qi++; buildShowQ(); } };
  });
  box.insertAdjacentHTML("afterbegin",`<div class="lab">Question ${B.qi+1} of ${B.qs.length}</div>`);
}
function buildRestart(){
  const B=S.build; ORDER.forEach(w=>B.on[w]=true); B.seen=new Set(); B.asked=false;
  $("buildQ").hidden=true; $("buildQ").innerHTML=""; $("pane-build").classList.remove("asking"); $("buildInfo").textContent=""; buildDraw();
}
document.querySelectorAll("#buildBtns button").forEach(b=>b.addEventListener("click",()=>{ const w=b.dataset.w; S.build.on[w]=!S.build.on[w]; buildDraw(); buildMsg(w); }));
$("buildReset").onclick=()=>{ ORDER.forEach(w=>S.build.on[w]=true); buildDraw(); $("buildInfo").textContent=""; };

/* ---------- CHALLENGE ---------- */
const QS=[
  {pt:"sepal",q:"What is the part marked by the arrow?",a:0,opts:[
    {t:"Sepal",why:"It is a small green leaf-like part of the outermost whorl, the calyx."},
    {t:"Petal",why:"Petals are coloured, never green. This part is green and on the outside."},
    {t:"Anther",why:"Anthers are at the tips of the stamens, inside the flower. This part is green and on the outside."},
    {t:"Stigma",why:"The stigma is at the top of the pistil, in the centre. This part is green and on the outside."}]},
  {pt:"anther",q:"The part marked by the arrow makes pollen grains. What is it called?",a:1,opts:[
    {t:"Filament",why:"The filament is the thin stalk of the stamen. Look at the swollen tip it carries."},
    {t:"Anther",why:"The anther at the tip of the stamen has pollen sacs that make pollen grains."},
    {t:"Stigma",why:"The stigma receives pollen; it does not make it. This part is on a stamen."},
    {t:"Ovary",why:"The ovary holds ovules, at the base of the pistil. This part is on a stamen."}]},
  {pt:"stigma",q:"What is the job of the part marked by the arrow?",a:2,opts:[
    {t:"It makes pollen grains",why:"Pollen grains are made in anthers, on the stamens. This part is at the top of the pistil."},
    {t:"It protects the bud",why:"Sepals protect the bud. This part sits at the very top of the pistil."},
    {t:"It receives pollen grains",why:"The stigma, at the tip of the pistil, receives the pollen grains."},
    {t:"It attracts insects",why:"Bright petals attract insects. This part is at the top of the pistil."}]},
  {pt:"ovary",q:"What is found inside the part marked by the arrow?",a:0,opts:[
    {t:"Ovules",why:"The ovary contains small, rounded ovules, which hold the female gamete."},
    {t:"Pollen grains",why:"Pollen grains are made in the anthers. This swollen part is at the base of the pistil."},
    {t:"Sepals",why:"Sepals are on the outside of the flower. This part is at the base of the pistil."},
    {t:"Filaments",why:"Filaments are the stalks of stamens. This swollen part is at the base of the pistil."}]},
  {pt:"thalamus",q:"The enlarged, flattened tip of the flower stalk, from which the whorls arise, is the…",a:3,opts:[
    {t:"Pedicel",why:"The pedicel is the stalk itself. Look at its enlarged tip."},
    {t:"Style",why:"The style is the tube of the pistil. Look lower down, at the tip of the stalk."},
    {t:"Filament",why:"A filament is part of a stamen. Look at the tip of the flower stalk."},
    {t:"Thalamus",why:"The thalamus is the enlarged, flattened tip of the stalk; all the whorls arise from it."}]},
  {pt:"petal",q:"Why are petals usually brightly coloured and fragrant?",a:1,opts:[
    {t:"To make food",why:"Petals are never green, so they do not make food. Think about who visits flowers."},
    {t:"To attract insects for pollination",why:"Bright, fragrant petals make the flower attractive to insects, which carry pollen."},
    {t:"To protect the bud",why:"Protection of the bud is the job of the sepals. Think about who visits flowers."},
    {t:"To store water",why:"Petals are thin and do not store water. Think about who visits flowers."}]},
  {pt:"filament",q:"Which whorl is the male reproductive part of a flower?",a:2,opts:[
    {t:"Gynoecium",why:"The gynoecium holds the ovules, so it is the female part. Which whorl makes pollen?"},
    {t:"Calyx",why:"The calyx protects the bud and makes no gametes. Which whorl makes pollen?"},
    {t:"Androecium",why:"The androecium is made of stamens, whose anthers make pollen grains with the male gametes."},
    {t:"Corolla",why:"The corolla attracts insects and makes no gametes. Which whorl makes pollen?"}]},
  {pt:null,q:"A flower has calyx, corolla, androecium and gynoecium. What is it called?",a:0,opts:[
    {t:"A complete flower",why:"All four whorls are present, so it is complete (and, with both reproductive parts, bisexual)."},
    {t:"An incomplete flower",why:"A flower is incomplete only if a whorl is missing. Count the whorls in this one."},
    {t:"A unisexual flower",why:"Unisexual flowers have only stamens or only a pistil. This one has both."},
    {t:"A male flower",why:"A male flower has stamens but no pistil. This one has both."}]},
  {pt:null,q:"A flower is unisexual. Which of these must also be true about it?",a:2,opts:[
    {t:"It is a complete flower",why:"A complete flower has all four whorls. A unisexual flower is missing either the stamens or the pistil."},
    {t:"It has no petals",why:"A unisexual flower can still have bright petals. What it lacks is one of the reproductive whorls."},
    {t:"It is an incomplete flower",why:"A unisexual flower is missing either the androecium or the gynoecium, so it can never have all four whorls."},
    {t:"It has both stamens and a pistil",why:"A flower with both stamens and a pistil is bisexual, not unisexual."}]},
  {pt:null,q:"A flower has a pistil but no stamens. Where must the pollen for its stigma come from?",a:3,opts:[
    {t:"From its own anthers",why:"This flower has no stamens, so it has no anthers of its own to make pollen."},
    {t:"From its own ovary",why:"The ovary holds ovules, not pollen. Pollen is made in anthers."},
    {t:"From its own petals",why:"Petals attract insects but make no pollen. Pollen is made in anthers."},
    {t:"From the stamens of another flower",why:"It is a unisexual (female) flower with no anthers, so pollen must be carried to it from the stamens of another flower."}]}
];
function chDraw(){
  const q=QS[S.ch.i]; arrowG.innerHTML="";
  ORDER.forEach(w=>{ L[w].g.setAttribute("opacity",1); L[w].g.setAttribute("transform",""); });
  if(q&&q.pt){ const [x,y]=P(q.pt), left=POINTS[q.pt][0]<290;
    // tail starts clear of the flower; the head is aimed along the shaft and stops at the ring round the part
    const tx=left?Math.min(LX-10,x-120):Math.max(RX+10,x+120), ty=y-36, a=Math.atan2(y-ty,x-tx), c=Math.cos(a), s=Math.sin(a);
    const hx=x-c*25, hy=y-s*25, bx=hx-c*24, by=hy-s*24, head=`${f1(hx)},${f1(hy)} ${f1(bx-s*13)},${f1(by+c*13)} ${f1(bx+s*13)},${f1(by-c*13)}`;
    const pulse=el("circle",{cx:x,cy:y,r:20,fill:"none",stroke:"#C2452D","stroke-width":3},arrowG);
    el("animate",{attributeName:"r",values:"20;34",dur:"1.4s",repeatCount:"indefinite"},pulse);
    el("animate",{attributeName:"opacity",values:".8;0",dur:"1.4s",repeatCount:"indefinite"},pulse);
    el("circle",{cx:x,cy:y,r:20,fill:"rgba(194,69,45,.1)",stroke:"#fff","stroke-width":8},arrowG);
    el("circle",{cx:x,cy:y,r:20,fill:"none",stroke:"#C2452D","stroke-width":4},arrowG);
    el("line",{x1:tx,y1:ty,x2:bx+c*4,y2:by+s*4,stroke:"#fff","stroke-width":13,"stroke-linecap":"round"},arrowG);
    el("polygon",{points:head,fill:"#fff",stroke:"#fff","stroke-width":7,"stroke-linejoin":"round"},arrowG);
    el("line",{x1:tx,y1:ty,x2:bx+c*4,y2:by+s*4,stroke:"#C2452D","stroke-width":7,"stroke-linecap":"round"},arrowG);
    el("polygon",{points:head,fill:"#C2452D",stroke:"#C2452D","stroke-width":2,"stroke-linejoin":"round"},arrowG); }
}
function chShow(){
  chDraw(); const q=QS[S.ch.i];
  $("taskNo").textContent=`Question ${S.ch.i+1} of ${QS.length}`;
  $("taskText").textContent=q.pt?"Look at the arrow and choose the best answer.":"Choose the best answer.";
  ["chCard","mcqBox"].forEach(id=>$(id).hidden=false); ["chNav","endCard","endNav"].forEach(id=>$(id).hidden=true); toast("");
  hud(["Question",`${S.ch.i+1} of ${QS.length}`],["Stars",`★ ${S.ch.stars}`],["Star rule","first try"]);
  mcq($("mcqBox"),q,first=>{ if(first&&!S.ch.got[S.ch.i]){S.ch.got[S.ch.i]=true;S.ch.stars++;}
    $("score").textContent=`★ ${S.ch.stars} / ${QS.length}`; hud(["Question",`${S.ch.i+1} of ${QS.length}`],["Stars",`★ ${S.ch.stars}`],["Star rule","first try"]);
    $("taskNext").textContent=S.ch.i===QS.length-1?"See my score":"Next question"; $("chNav").hidden=false; });
}
function chEnd(){
  arrowG.innerHTML=""; ["chCard","mcqBox","chNav"].forEach(id=>$(id).hidden=true); $("endCard").hidden=false; $("endNav").hidden=false;
  const s=S.ch.stars,n=QS.length; $("endStars").textContent=`★ ${s} / ${n}`;
  $("endText").textContent=s===n?"Perfect score! You know your flower inside out.":s>=6?"Well done. Go back to Peel or Build to check the parts you missed.":"Try Peel and Build again, then play again.";
  hud(["Questions","Finished"],["Stars",`★ ${s} / ${n}`],["",""]);
}
function chStart(){ shuffle(QS).forEach(shuffleOpts); Object.assign(S.ch,{i:0,stars:0,got:{}}); $("score").textContent=`★ 0 / ${QS.length}`; chShow(); }
$("taskNext").onclick=()=>{ S.ch.i++; if(S.ch.i>=QS.length) chEnd(); else chShow(); };
$("again").onclick=chStart;
$("toast").addEventListener("click",()=>{$("toast").hidden=true;});

function setTab(tab){
  S.tab=tab; toast(""); arrowG.innerHTML="";
  document.querySelectorAll("#tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===tab?"true":"false"));
  ["peel","build","challenge"].forEach(t=>$("pane-"+t).classList.toggle("on",t===tab));
  trayG.setAttribute("display",tab==="peel"?"inline":"none"); flowerOuter.setAttribute("transform",tab==="peel"?"":"translate(135 0)");
  arrowG.setAttribute("transform",tab==="peel"?"":"translate(135 0)");
  $("score").hidden=tab!=="challenge";
  if(tab==="peel"){ ORDER.forEach(w=>{ L[w].g.setAttribute("opacity",1); setLayerT(w,S.peel.off.includes(w)?1:0); }); peelDraw(); }
  else { labelsG.innerHTML=""; lensG.innerHTML=""; }
  if(tab==="build") buildDraw(); if(tab==="challenge") chStart();
  maybeTour(tab);
}
document.querySelectorAll("#tabs button").forEach(b=>b.addEventListener("click",()=>{ if(!tourOn) setTab(b.dataset.tab); }));

const TOURS={
  peel:[
    {s:"#soundBtn",t:"Welcome to Peel-a-Flower",x:"Take a flower apart, whorl by whorl, and learn what each part does. This quick tour takes under a minute. Sound plays for right and wrong answers; tap this speaker button to turn it off or on.",g:"tap"},
    {s:"#tabs",t:"Three parts, in order",x:"Start with Peel, then Build, then Challenge. Tap a tab to move between them.",g:"tap"},
    {s:"#stagebox",t:"A complete flower",x:"This flower is shown cut down the middle, so you can see every whorl from the stalk to the stigma."},
    {s:"#peelBtns",t:"Peel from the outside in",x:"Tap the whorl you think is outermost. If it is right, it moves to the tray and its job is explained.",g:"tap"},
    {s:"#lensBtn",t:"Magnify",x:"Look closely at the pollen grains on the anther and the ovules inside the ovary.",g:"tap"},
    {s:"#labelBtn",t:"Labels",x:"Names the pedicel, thalamus, sepal, petal, anther, filament, stigma, style and ovary.",g:"tap"},
    {s:"#hud",t:"Track your progress",x:"Shows how many whorls are left. A question appears when all four are peeled."},
    {s:"#helpBtn",t:"See this again any time",x:"Tap Help (?) to replay the tour for the part you are on.",g:"tap"}],
  build:[
    {s:"#buildBtns",t:"Switch whorls on and off",x:"Make different flowers by removing or adding whorls.",g:"tap"},
    {s:"#hud",t:"Name your flower",x:"See whether it is complete or incomplete, and bisexual or unisexual. A question appears after you try a few flowers."}],
  challenge:[
    {s:"#chCard",t:"Ten questions",x:"Most questions point at a part of the flower with an arrow."},
    {s:"#score",t:"Earn stars",x:"A star for each correct first answer."},
    {s:"#mcqBox",t:"Feedback helps you learn",x:"A wrong answer explains why. After two wrong tries, the correct answer is shown with the reason."}]
};
let tourOn=false, tourSteps=[], tourI=0;
const seen={};
function storeGet(k){ try{return localStorage.getItem(k);}catch(e){return seen[k]||null;} }
function storeSet(k,v){ v=v||"1"; try{localStorage.setItem(k,v);}catch(e){} seen[k]=v; }
/* Tours play on every fresh launch (shared school devices): each tab's tour shows on its first visit in this session only. */
const toured={};
function maybeTour(tab){ if(!toured[tab]){ toured[tab]=true; setTimeout(()=>startTour(tab),250); } }
function startTour(tab){
  tourSteps=TOURS[tab].filter(st=>!st.s||isVisible(document.querySelector(st.s))); tourI=0; tourOn=true;
  $("tour").hidden=false; placeTour(); $("tNext").focus();
}
function endTour(){ tourOn=false; $("tour").hidden=true; }
function isVisible(n){ return n&&n.offsetParent!==null&&!n.closest("[hidden]"); }
function rectIn(n){ /* panel mode: the HUD highlight covers only the info boxes, not the Help/sound/full-screen dock */
  if(n&&n.id==="hud"&&app.classList.contains("ift")){ const k=[...n.children].filter(c=>!c.classList.contains("dock")), A=rectIn(k[0]), B=rectIn(k[k.length-1]);
    return {x:A.x,y:Math.min(A.y,B.y),w:B.x+B.w-A.x,h:Math.max(A.y+A.h,B.y+B.h)-Math.min(A.y,B.y)}; }
  const a=app.getBoundingClientRect(), r=n.getBoundingClientRect();
  return {x:(r.left-a.left)/SCALE,y:(r.top-a.top)/SCALE,w:r.width/SCALE,h:r.height/SCALE}; }
function placeTour(){
  const st=tourSteps[tourI], [W,H]=SIZES[MODE], spot=$("spot"), card=$("tcard"), hand=$("hand");
  $("tTitle").textContent=st.t; $("tText").textContent=st.x;
  $("tCount").textContent=`${tourI+1} / ${tourSteps.length}`;
  $("tBack").hidden=tourI===0; $("tNext").textContent=tourI===tourSteps.length-1?"Got it":"Next";
  const cw=card.offsetWidth, ch=card.offsetHeight;
  if(!st.s){ spot.className="none"; card.style.left=(W-cw)/2+"px"; card.style.top=(H-ch)/2+"px"; hand.hidden=true; return; }
  const r=rectIn(document.querySelector(st.s)), pad=6;
  spot.className=""; Object.assign(spot.style,{left:r.x-pad+"px",top:r.y-pad+"px",width:r.w+pad*2+"px",height:r.h+pad*2+"px"});
  let cx,cy;
  if(MODE==="land"){
    cx = r.x+r.w+20+cw<=W-10 ? r.x+r.w+20 : r.x-20-cw>=10 ? r.x-20-cw : (W-cw)/2;
    cy = Math.max(70,Math.min(H-ch-10,r.y+r.h/2-ch/2));
    if(cx===(W-cw)/2) cy = r.y+r.h+20+ch<=H-10 ? r.y+r.h+20 : Math.max(10,r.y-20-ch);
  } else {
    cx=(W-cw)/2;
    cy = r.y+r.h+24+ch<=H-10 ? r.y+r.h+24 : r.y-24-ch>=10 ? r.y-24-ch : H-ch-10;
  }
  card.style.left=cx+"px"; card.style.top=cy+"px";
  hand.hidden=!st.g; hand.className=st.g||"";
  if(st.g){ const hr=st.h?rectIn(document.querySelector(st.h)):r; /* fingertip sits ~16px in and ~4px down inside the 46x58 hand: put it on the centre of the highlight */
    hand.style.left=(hr.x+hr.w/2-16)+"px"; hand.style.top=(hr.y+hr.h/2-4)+"px"; }
}
$("tNext").onclick=()=>{ if(tourI<tourSteps.length-1){tourI++;placeTour();} else endTour(); };
$("tBack").onclick=()=>{ if(tourI>0){tourI--;placeTour();} };
$("tskip").onclick=endTour;
$("soundBtn").onclick=()=>{ Sound.set(!Sound.on); storeSet("tce-c6bio-sound",Sound.on?"on":"off"); if(Sound.on){Sound.ensure();Sound.play("ok");} };
Sound.set(storeGet("tce-c6bio-sound")!=="off");
$("helpBtn").onclick=()=>{ if(!tourOn) startTour(S.tab); };
document.addEventListener("keydown",e=>{ if(!tourOn)return; if(e.key==="Escape")endTour(); if(e.key==="ArrowRight")$("tNext").click(); if(e.key==="ArrowLeft")$("tBack").click(); });



let last=performance.now();
function loop(now){ const dt=Math.min(0.05,(now-last)/1000); last=now; if(!tourOn&&S.tab==="peel") peelTick(dt); requestAnimationFrame(loop); }
fit(); setTab("peel");
requestAnimationFrame(loop);
