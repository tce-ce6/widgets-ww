/* =====================================================================
   REPLACEABLE ASSETS  (Help the Plant Survive)
   Set "src" to a data URI (data:image/png;base64,...) or a relative path; "" = built-in drawing.
   plant_*: 400 x 500, plant standing on the ground line at 84% height (soil below it).
     top = where a climbing shoot starts; mouths = pitcher openings; drops = leaves that fall (Bryophyllum).
   trap_*_open / trap_*_closed: 400 x 400, same framing for both states; mouth = where the insect goes.
   bg_*: 1000 x 680 scene backgrounds, ground line at y = 520.
   ===================================================================== */
const ASSETS = {
  bg_climb:  { src: "", frame: [1000, 680] }, bg_desert: { src: "", frame: [1000, 680] },
  bg_hills:  { src: "", frame: [1000, 680] }, bg_season: { src: "", frame: [1000, 680] },
  bg_moist:  { src: "", frame: [1000, 680] }, bg_pond:   { src: "", frame: [1000, 680] },
  plant_ordinary: { src: "", frame: [400, 500], top: [0.5, 0.30] },
  plant_tendril:  { src: "", frame: [400, 500], top: [0.5, 0.22] },
  plant_spines:   { src: "", frame: [400, 500], top: [0.5, 0.30] },
  plant_scale:    { src: "", frame: [400, 500], top: [0.5, 0.22] },
  plant_pitcher:  { src: "", frame: [400, 500], top: [0.48, 0.24], mouths: [[0.75, 0.47], [0.24, 0.62], [0.76, 0.75]] },
  plant_buds:     { src: "", frame: [400, 500], top: [0.5, 0.28], drops: [[0.30, 0.52], [0.70, 0.40]] },
  trap_pitcher_open:  { src: "", frame: [400, 400], mouth: [0.5, 0.31] }, trap_pitcher_closed: { src: "", frame: [400, 400] },
  trap_flytrap_open:  { src: "", frame: [400, 400], mouth: [0.5, 0.45] }, trap_flytrap_closed: { src: "", frame: [400, 400] },
  trap_bladder_open:  { src: "", frame: [400, 400], mouth: [0.67, 0.54] }, trap_bladder_closed: { src: "", frame: [400, 400] }
};

/* ---------- drawing helpers ---------- */
const GR=520;
const f1=n=>(+n).toFixed(1), rad=a=>a*Math.PI/180, deg=r=>r*180/Math.PI;
const lerp=(a,b,t)=>a+(b-a)*t, clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ss=(a,b,x)=>{ const t=clamp((x-a)/(b-a),0,1); return t*t*(3-2*t); };
const OVAL=t=>Math.pow(t,0.6)*Math.pow(1-t,0.6)/0.5;
function blade(L,W,shape,serr){ // base 0,0 tip 0,-L; W = half-width
  const N=40,R=[],Lf=[]; const fn=shape||OVAL;
  for(let i=0;i<=N;i++){ const t=i/N; let w=W*fn(t); if(serr){ const fr=(t*serr)%1; w*=1-0.12*(1-fr)*Math.min(1,t*5)*Math.min(1,(1-t)*5); }
    R.push([w,-t*L]); Lf.push([-w,-t*L]); }
  return "M"+[...R,...Lf.reverse()].map(p=>f1(p[0])+" "+f1(p[1])).join(" L")+"Z";
}
function coil(x,y,r0,turns,dir){ let d=`M${f1(x)} ${f1(y)}`; const n=turns*24;
  for(let i=1;i<=n;i++){ const a=i/24*Math.PI*2*dir, r=r0*(1-i/n*0.85); d+=` L${f1(x+Math.sin(a)*r)} ${f1(y-r0+Math.cos(a)*r)}`; } return d; }
function rnd(seed){ let s=seed; return ()=>(s=s*16807%2147483647)/2147483647; }
const hx=c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16));
function mix(a,b,t){ t=clamp(t,0,1); const A=hx(a),B=hx(b); return "#"+A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,"0")).join(""); }
const svg400x500=b=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500">${b}</svg>`;
const svg400=b=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">${b}</svg>`;

/* polylines: smooth path, normals, offsets, arc length, point at length */
function smooth(P){ let d=`M${f1(P[0][0])} ${f1(P[0][1])}`;
  for(let i=1;i<P.length-1;i++) d+=` Q${f1(P[i][0])} ${f1(P[i][1])} ${f1((P[i][0]+P[i+1][0])/2)} ${f1((P[i][1]+P[i+1][1])/2)}`;
  const L=P[P.length-1]; return d+` L${f1(L[0])} ${f1(L[1])}`; }
function norms(P){ return P.map((p,i)=>{ const a=P[Math.min(i+1,P.length-1)], b=P[Math.max(i-1,0)], dx=a[0]-b[0], dy=a[1]-b[1], m=Math.hypot(dx,dy)||1; return [-dy/m,dx/m]; }); }
function offs(P,N,f){ const n=P.length-1||1; return P.map((p,i)=>{ const o=f(i/n); return [p[0]+N[i][0]*o,p[1]+N[i][1]*o]; }); }
function walk(P){ const c=[0]; for(let i=1;i<P.length;i++) c.push(c[i-1]+Math.hypot(P[i][0]-P[i-1][0],P[i][1]-P[i-1][1])); return c; }
function at(P,C,s){ let i=1; while(i<P.length-1&&C[i]<s) i++;
  const a=P[i-1], b=P[i], u=clamp((s-C[i-1])/((C[i]-C[i-1])||1),0,1);
  return {x:lerp(a[0],b[0],u), y:lerp(a[1],b[1],u), a:Math.atan2(b[1]-a[1],b[0]-a[0])}; }
function cut(P,C,s){ const o=[]; for(let i=0;i<P.length&&C[i]<s;i++) o.push(P[i]); const e=at(P,C,s); o.push([e.x,e.y]); return o; }
// grow a stem from x,y in direction a; turn(u) = bend per unit length at fraction u. A stem that bends down lies along the ground.
function chainFrom(x,y,a,len,steps,turn){ const seg=len/steps, P=[[x,y]]; let flat=false;
  for(let i=1;i<=steps;i++){ if(!flat) a+=turn((i-0.5)/steps)*seg; x+=Math.cos(a)*seg; y+=Math.sin(a)*seg;
    if(y>-3&&i>1){ y=-3; if(!flat){ flat=true; a=Math.cos(a)<0?Math.PI:0; } } P.push([x,y]); }
  return P; }
// tapered, shaded stem along a polyline
function tube(P,w0,w1,c,o={}){
  if(P.length<2) return "";
  const N=norms(P), hw=u=>lerp(w0,w1,u)/2, A=offs(P,N,hw), B=offs(P,N,u=>-hw(u)).reverse(), r=w1/2, e=B[0], avg=(w0+w1)/2;
  const d=smooth(A)+(o.cap?` A${f1(r)} ${f1(r)} 0 0 0 ${f1(e[0])} ${f1(e[1])}`:` L${f1(e[0])} ${f1(e[1])}`)+smooth(B).replace(/^M\S+ \S+/,"")+"Z";
  return `<path d="${d}" fill="${c}" stroke="${mix(c,"#0F2A12",.45)}" stroke-width="1.1" stroke-linejoin="round"/>`+
    `<path d="${smooth(offs(P,N,u=>-hw(u)*.42))}" stroke="#fff" stroke-opacity=".2" stroke-width="${f1(avg*.22)}" fill="none" stroke-linecap="round"/>`+
    `<path d="${smooth(offs(P,N,u=>hw(u)*.5))}" stroke="#000" stroke-opacity=".13" stroke-width="${f1(avg*.3)}" fill="none" stroke-linecap="round"/>`; }

/* ---------- living plants (plant units: stem base at 0,0, ground is y=0, up is -y) ---------- */
const PDEFS=`<linearGradient id="lfShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".42" stop-color="#fff" stop-opacity=".14"/><stop offset=".55" stop-color="#000" stop-opacity=".03"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></linearGradient>
<radialGradient id="bulbHi" cx=".36" cy=".32" r=".6"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<linearGradient id="pitBlush" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B2362F" stop-opacity=".85"/><stop offset=".5" stop-color="#B2362F" stop-opacity=".25"/><stop offset="1" stop-color="#B2362F" stop-opacity="0"/></linearGradient>
<radialGradient id="pitIn" cx=".5" cy=".3" r=".8"><stop offset="0" stop-color="#5A1A16"/><stop offset="1" stop-color="#1A0605"/></radialGradient>
<filter id="frot"><feColorMatrix type="matrix" values="0.45 0.25 0 0 0.06  0.3 0.25 0 0 0.04  0.12 0.1 0 0 0.02  0 0 0 1 0"/></filter>`;
const YEL="#D4C04C", DRY="#9A7744";
// colour of a part for the plant's state; k = 0 (base, oldest) .. 1 (tip): old leaves yellow first
function hue(c,st,k){ const y=clamp(st.yel*1.6-k*.7,0,1), d=clamp(st.dry*1.2-k*.2,0,1);
  return mix(mix(mix(c,YEL,y*.85),"#8C9B4C",st.wilt*.4),DRY,d); }
function leafM(L,W,c,o={}){
  if(L<1) return "";
  const d=blade(L,W,o.shape,o.serr), vein=mix(c,"#EEFAD8",.42), edge=o.edge||mix(c,"#0E2A12",.42);
  let v=`<path d="M0 0 Q${f1(W*.12)} ${f1(-L*.5)} 0 ${f1(-L*.93)}" stroke="${vein}" stroke-width="${f1(clamp(W*.14,.8,2.4))}" fill="none" opacity=".85"/>`;
  if(W>5) for(let k=.16;k<.84;k+=.15){ const w=W*OVAL(Math.min(k+.12,.95))*.8;
    v+=`<path d="M0 ${f1(-L*k)} q${f1(w*.5)} ${f1(-L*.03)} ${f1(w)} ${f1(-L*.12)} M0 ${f1(-L*k)} q${f1(-w*.5)} ${f1(-L*.03)} ${f1(-w)} ${f1(-L*.12)}" stroke="${vein}" stroke-width=".9" fill="none" opacity=".5"/>`; }
  const tr=o.curl?` transform="scale(${f1(1-.55*clamp(o.curl,0,1))} 1)"`:"";
  return `<g${tr}><path d="${d}" fill="${c}" stroke="${edge}" stroke-width="1.1" stroke-linejoin="round"/><path d="${d}" fill="url(#lfShade)"/>${v}${o.extra||""}</g>`; }
// a leaf on a node; leaves with an id can be detached (they fall in the "No seeds" problem)
function leafOn(out,id,x,y,dg,pet,L,W,c,o={}){
  if(id!=null&&out.detach.includes(id)) return "";
  const m=(pet>0?`<path d="M0 0 L0 ${f1(-pet)}" stroke="${o.petC||mix(c,"#2F5A1F",.35)}" stroke-width="${o.pw||2.6}" stroke-linecap="round"/>`:"")+`<g transform="translate(0 ${f1(-pet)})">${leafM(L,W,c,o)}</g>`;
  if(id!=null) out.drops.push({id,x,y,deg:dg,m,L:L+pet,W});
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(dg)})">${m}</g>`; }
// leaf direction in degrees from "up", from the stem angle; wilted leaves hang but never point into the ground
function ldeg(a,side,spread){ let d=deg(a)+90+side*spread; d=((d%360)+540)%360-180; return clamp(d,-128,128); }
const ROOTS=(()=>{ const r=rnd(7), a=[]; for(let i=0;i<7;i++) a.push([lerp(-62,62,i/6)+(r()-.5)*14,48+r()*40,r()]); return a; })();
function roots(g,c="#D9C9A3",spread=1){ let s=""; ROOTS.forEach(([ang,L,k])=>{ const l=L*lerp(.35,1,g), a=rad(ang*spread), ex=Math.sin(a)*l, ey=Math.cos(a)*l*(spread>1.2?.45:1);
  s+=`<path d="M0 1 Q${f1(ex*.3+(k-.5)*12)} ${f1(ey*.55)} ${f1(ex)} ${f1(ey)} M${f1(ex*.55)} ${f1(ey*.5)} l${f1((ex<0?-1:1)*l*.22)} ${f1(l*.18)}" stroke="${c}" stroke-width="${f1(lerp(2.4,1.2,k))}" fill="none" stroke-linecap="round"/>`; });
  return s; }
// stem bending: gentle wind sway, a weak stem flopping over, a wilting tip nodding
const stemTurn=(st,H,lean)=>u=>(lean+Math.sin(st.time*1.3+u*2.2)*.09*(1-st.dry)-st.flop*4.3*(.3+u)+(st.wilt*.8+st.dry*.6)*4.5*u*u*u)/H;
const OUT=st=>({svg:"",drops:[],mouths:[],detach:st.detach||[]});
const PLANT={};

PLANT.ordinary=st=>{
  const out=OUT(st), H=lerp(110,340,st.g), P=chainFrom(0,0,-Math.PI/2,H,30,stemTurn(st,H,0)), C=walk(P);
  let back="", front="";
  for(let s=24,k=0;s<H-12;s+=36,k++){
    const p=at(P,C,s), side=k%2?1:-1, age=clamp((H-s)/80,0,1), u=s/H;
    const L=lerp(14,88,age)*lerp(1,.75,u)*(1-.25*st.dry);
    const dg=ldeg(p.a,side,lerp(18,50,age)+75*st.wilt+45*st.dry)+Math.sin(st.time*2.1+k*1.9)*2.5*(1-st.dry);
    const c=hue(k%3?"#3F9C47":"#4CAB50",st,u);
    const m=leafOn(out,k,p.x,p.y,dg,8,L,L*.25,side<0?mix(c,"#0E2A12",.1):c,{curl:Math.max(st.wilt*.6,st.dry*.8)});
    if(side<0) back+=m; else front+=m; }
  const tp=at(P,C,C[C.length-1]), tc=hue("#62BE5A",st,1);
  front+=leafOn(out,null,tp.x,tp.y,ldeg(tp.a,1,12),1,14*(1-.3*st.dry),3.6,tc)+leafOn(out,null,tp.x,tp.y,ldeg(tp.a,-1,16),1,11*(1-.3*st.dry),3,tc);
  out.svg=roots(st.g)+back+tube(P,lerp(6,10,st.g),2.6,hue("#4E8A37",st,.3))+front;
  return out; };

const POLE_X=190; // the support stick, in plant units
const GUIDE=(()=>{ const P=[]; for(let i=0;i<=14;i++){ const u=i/14; P.push([(POLE_X-9)*u*u*u-Math.sin(u*Math.PI)*10,-u*180]); }
  for(let y=-190;y>=-482;y-=8) P.push([POLE_X+Math.sin(y/21)*8,y]); return P; })();
function peaFlower(x,y,dg,s){ if(s<=.02) return "";
  return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(dg)}) scale(${f1(s)})"><path d="M0 0 Q2 -8 0 -14" stroke="#5C9A44" stroke-width="2" fill="none"/><path d="M0 -12 C-17 -15 -18 -38 0 -35 C18 -38 17 -15 0 -12Z" fill="#F4A6C9" stroke="#C9578E" stroke-width=".9"/><path d="M0 -13 C-4 -22 -3 -30 0 -33 C3 -30 4 -22 0 -13" stroke="#E07AA9" stroke-width=".8" fill="none"/><path d="M0 -12 C-10 -13 -11 -24 -3 -25 L3 -25 C11 -24 10 -13 0 -12Z" fill="#E0679F"/><path d="M-1 -13 C-6 -17 -5 -21 0 -21 C5 -21 6 -17 1 -13Z" fill="#FBE3EE"/></g>`; }
function wrapTendril(t,age){ const y0=t.y-6; let d=`M${f1(t.x)} ${f1(t.y)} Q${f1((t.x+POLE_X)/2)} ${f1(y0-10)} ${f1(POLE_X-8)} ${f1(y0)}`;
  const n=Math.round(lerp(14,44,age)); for(let j=1;j<=n;j++){ const th=j/16*Math.PI*2; d+=` L${f1(POLE_X-Math.cos(th)*8)} ${f1(y0-j*1.05)}`; }
  return `<path d="${d}" stroke="#86BF55" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`; }
PLANT.tendril=st=>{
  const out=OUT(st); let P,H;
  if(st.climb){ const GC=walk(GUIDE); H=lerp(110,GC[GC.length-1],st.g); P=cut(GUIDE,GC,H); }
  else { H=lerp(110,360,st.g); P=chainFrom(0,0,-Math.PI/2,H,30,stemTurn(st,H,.12)); }
  const C=walk(P); let back="", front="", tend="";
  for(let s=30,k=0;s<H-10;s+=44,k++){
    const p=at(P,C,s), side=k%2?1:-1, age=clamp((H-s)/90,0,1), u=s/H, c=hue("#58A84A",st,u);
    front+=leafOn(out,null,p.x,p.y,ldeg(p.a,-side,62),0,lerp(6,15,age),lerp(3,7,age),mix(c,"#A7D47E",.12),{shape:t=>Math.pow(t,.45)*Math.pow(1-t,.9)*1.7});
    if(out.detach.includes(k)) continue;
    const dg=ldeg(p.a,side,lerp(25,55,age)+60*st.wilt+40*st.dry)+Math.sin(st.time*2.4+k*1.3)*3*(1-st.dry), R=lerp(10,58,age)*(1-.2*st.dry);
    let cl=`<path d="M0 0 L0 ${f1(-R)}" stroke="${mix(c,"#2F5A1F",.3)}" stroke-width="2" stroke-linecap="round"/>`;
    for(const [q,z] of [[.42,1],[.78,.85]]) for(const sd of [1,-1]) cl+=`<g transform="translate(0 ${f1(-R*q)}) rotate(${f1(sd*(55+45*st.wilt+30*st.dry))})">${leafM(lerp(7,28,age)*z*(1-.25*st.dry),lerp(3,7,age)*z,c,{curl:st.wilt*.5+st.dry*.6})}</g>`;
    const tip={x:p.x+Math.sin(rad(dg))*R, y:p.y-Math.cos(rad(dg))*R};
    if(st.climb&&tip.x>POLE_X-75&&age>.2) tend+=wrapTendril(tip,age);
    else { const tl=lerp(3,12,age), tc=st.dry>.5?DRY:"#86BF55";
      cl+=`<path d="M0 ${f1(-R)} L0 ${f1(-R-tl)}" stroke="${tc}" stroke-width="1.8"/><path d="${coil(0,-R-tl,lerp(3,10,age),lerp(.6,2.2,age),side)}" stroke="${tc}" stroke-width="1.8" fill="none" stroke-linecap="round"/>`; }
    out.drops.push({id:k,x:p.x,y:p.y,deg:dg,m:cl,L:R,W:20});
    const g=`<g transform="translate(${f1(p.x)} ${f1(p.y)}) rotate(${f1(dg)})">${cl}</g>`;
    if(side<0) back+=g; else front+=g;
    if(st.bloom>0&&s>H-120) front+=peaFlower(p.x,p.y,ldeg(p.a,-side,40),st.bloom*1.15*(1-st.dry)); }
  out.svg=roots(st.g)+back+tube(P,lerp(4,6.5,st.g),2,hue("#5E9E43",st,.3))+front+tend;
  return out; };

function spinesAt(x,y,a){ return `<g transform="translate(${f1(x)} ${f1(y)}) rotate(${f1(deg(a)+90)})"><path d="M0 0 l-6 -4 M0 0 l6 -4 M0 0 l-1 -8 M0 0 l-7 2 M0 0 l7 2" stroke="#F4EDD2" stroke-width="1.1" stroke-linecap="round"/><circle r="1.9" fill="#E9DFBD"/></g>`; }
function cactusTube(P,w0,w1,c){ if(P.length<2) return ""; let s=tube(P,w0,w1,c,{cap:1}); const N=norms(P), dk=mix(c,"#0E2A12",.45);
  [-.68,-.24,.2,.62].forEach((f,j)=>{ const R=offs(P,N,u=>lerp(w0,w1,u)/2*f), RC=walk(R), len=RC[RC.length-1];
    s+=`<path d="${smooth(R)}" stroke="${dk}" stroke-width="1.4" fill="none" opacity=".45"/>`;
    for(let d=7+j*5;d<len-2;d+=15){ const q=at(R,RC,d); s+=spinesAt(q.x,q.y,q.a); } });
  return s; }
function cactusFlower(x,y,b){ if(b<=.02) return ""; let p="";
  for(let i=0;i<12;i++) p+=`<ellipse cx="0" cy="-9" rx="3.6" ry="10" transform="rotate(${i*30})" fill="${i%2?"#F27BA6":"#F59ABB"}" stroke="#C94F7E" stroke-width=".6"/>`;
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(b)}) scale(1 .6)">${p}<circle r="5" fill="#F7D14C"/><circle r="2.2" fill="#E0A428"/></g>`; }
PLANT.spines=st=>{
  const out=OUT(st), H=lerp(90,250,st.g), w=lerp(44,66,st.g)*(1-.28*st.wilt-.15*st.dry), body=hue("#5E9E54",st,.4);
  const P=chainFrom(0,0,-Math.PI/2,H,18,u=>(Math.sin(st.time*1.1)*.02-st.flop*4*(.3+u)+st.wilt*1.4*u*u)/H), C=walk(P);
  // arms grow sideways out of the body, then turn upward
  const arm=(f,side,len)=>{ if(len<6) return ""; const p=at(P,C,H*f), a0=p.a+side*Math.PI/2, x=p.x+Math.cos(a0)*w*.3, y=p.y+Math.sin(a0)*w*.3;
    return cactusTube(chainFrom(x,y,a0-side*.2,len,14,u=>u>.2&&u<.55?-side*(Math.PI/2-.2)/(.35*len):0),w*.5,w*.42,mix(body,"#2F6B33",.08)); };
  let s=roots(st.g*.8,"#D8C8A4",1.5)+arm(.4,1,ss(.45,1,st.g)*125)+arm(.58,-1,ss(.65,1,st.g)*95)+cactusTube(P,w,w*.86,body);
  const tp=at(P,C,C[C.length-1]); s+=cactusFlower(tp.x+Math.cos(tp.a)*w*.4,tp.y+Math.sin(tp.a)*w*.4,st.bloom*(1-st.dry));
  // a cactus's leaves are its spines: one cluster can break off (it has no buds, so nothing grows from it)
  const sp=at(P,C,H*.5); out.drops.push({id:"spine",x:sp.x-w*.45,y:sp.y,deg:-70,m:`<g transform="scale(2.2)">${spinesAt(0,0,-Math.PI/2)}</g>`,L:18,W:8});
  out.svg=s; return out; };

function bulbPath(rx,ry){ return `M0 ${f1(-ry)} C${f1(rx*.3)} ${f1(-ry*.75)} ${f1(rx)} ${f1(-ry*.45)} ${f1(rx)} ${f1(ry*.12)} C${f1(rx)} ${f1(ry*.72)} ${f1(rx*.55)} ${f1(ry)} 0 ${f1(ry)} C${f1(-rx*.55)} ${f1(ry)} ${f1(-rx)} ${f1(ry*.72)} ${f1(-rx)} ${f1(ry*.12)} C${f1(-rx)} ${f1(-ry*.45)} ${f1(-rx*.3)} ${f1(-ry*.75)} 0 ${f1(-ry)}Z`; }
PLANT.scale=st=>{
  const out=OUT(st), f=st.food, rx=lerp(30,64,f), ry=rx*.9, cy=ry*.42, neck=cy-ry*.9;
  let lv="";
  for(let i=0;i<5;i++){ const id=i===0?"leaf":null, side=i%2?1:-1, sp=(i-2)*.17;
    if(id&&out.detach.includes(id)) continue;
    const len=lerp(70,300,st.g)*(1-Math.abs(sp)*.8)*(1-.45*st.dry);
    const bend=side*(.0012+st.wilt*.01+st.dry*.012+st.flop*.014)+Math.sin(st.time*1.4+i*1.7)*.0007*(1-st.dry);
    const P=chainFrom(sp*14,neck,-Math.PI/2+sp,len,18,u=>bend*(.3+u*1.7));
    const c=hue(i%2?"#4C9E4A":"#56A84E",st,.2+i*.1), k=Math.floor(P.length*.68);
    lv+=tube(P,11,2,c)+tube(P.slice(k),lerp(11,2,k/(P.length-1)),2,mix(c,DRY,.25+.55*Math.max(st.wilt,st.dry)));
    if(id) out.drops.push({id,x:sp*14,y:neck,deg:deg(sp),m:tube(chainFrom(0,0,-Math.PI/2,90,10,()=>.004),10,2,c),L:90,W:6}); }
  for(let j=0;j<3&&st.regrow>0;j++){ const len=lerp(0,[190,160,130][j],st.regrow), sp=(j-1)*.14;
    if(len>4) lv+=tube(chainFrom(sp*10,neck,-Math.PI/2+sp,len,14,u=>(j-1)*.0015*u+Math.sin(st.time*1.4+j)*.0006),9,2,"#5DBB4E"); }
  let b=`<g transform="translate(0 ${f1(cy)})"><path d="${bulbPath(rx,ry)}" fill="#BE8A57" stroke="#87582F" stroke-width="1.5"/>`;
  for(let i=1;i<=5;i++){ const k=1-i*.15; b+=`<path d="${bulbPath(rx*k*.96,ry*k)}" transform="translate(0 ${f1(ry*(1-k)*.4)})" fill="${i%2?"#F7E8EE":"#EDD0DC"}" stroke="#C690A9" stroke-width="1.2"/>`; }
  b+=`<path d="${bulbPath(rx,ry)}" fill="url(#bulbHi)"/><path d="M0 ${f1(ry*.3)} C-5 ${f1(-ry*.1)} -3 ${f1(-ry*.5)} 0 ${f1(-ry*.7)} C3 ${f1(-ry*.5)} 5 ${f1(-ry*.1)} 0 ${f1(ry*.3)}Z" fill="#A7D46A" opacity=".9"/>`;
  b+=`<rect x="${f1(-rx*.32)}" y="${f1(ry*.86)}" width="${f1(rx*.64)}" height="7" rx="3.5" fill="#B6966C"/></g>`;
  out.svg=`<g transform="translate(0 ${f1(cy+ry*.95)})">${roots(st.g,"#E3D6B6",.75)}</g>`+lv+b;
  return out; };

function pitcherM(x,y,s,c,dry){ const body="M-13 -76 C-17 -60 -11 -50 -17 -36 C-25 -18 -19 0 0 0 C19 0 25 -18 17 -36 C11 -50 17 -60 13 -76Z", dk=mix(c,"#1D3510",.45);
  return `<g transform="translate(${f1(x)} ${f1(y)}) scale(${f1(s)})"><path d="${body}" fill="${c}" stroke="${dk}" stroke-width="1.2"/><path d="${body}" fill="url(#pitBlush)" opacity="${f1(1-dry)}"/><path d="${body}" fill="url(#lfShade)"/>`+
`<circle cx="-6" cy="-30" r="2.4" fill="#8E2A24" opacity=".45"/><circle cx="5" cy="-18" r="3" fill="#8E2A24" opacity=".4"/><circle cx="-2" cy="-52" r="2" fill="#8E2A24" opacity=".45"/><circle cx="8" cy="-44" r="1.8" fill="#8E2A24" opacity=".4"/>`+
`<path d="M-4 -68 C-7 -45 -8 -25 -5 -6 M4 -68 C7 -45 8 -25 5 -6" stroke="${mix(c,"#1D3510",.35)}" stroke-width="2.4" stroke-dasharray="1 2.2" fill="none" opacity=".7"/>`+
`<ellipse cx="0" cy="-77" rx="13" ry="4.2" fill="url(#pitIn)"/><ellipse cx="0" cy="-77" rx="14" ry="4.8" fill="none" stroke="${mix("#B3352F",DRY,dry)}" stroke-width="3.2"/><ellipse cx="0" cy="-77" rx="14" ry="4.8" fill="none" stroke="#5E1512" stroke-width="3.2" stroke-dasharray="1 1.8" opacity=".5"/>`+
`<g transform="translate(5 -81) rotate(-28)"><ellipse cx="0" cy="-9" rx="11" ry="9" fill="${mix(c,"#A9433A",.3)}" stroke="${dk}" stroke-width="1"/></g></g>`; }
PLANT.pitcher=st=>{
  const out=OUT(st), H=lerp(110,330,st.g), P=chainFrom(0,0,-Math.PI/2,H,28,stemTurn(st,H,-.1)), C=walk(P);
  let back="", front="", pits="";
  for(let s=26,k=0;s<H-14;s+=52,k++){
    if(out.detach.includes(k)) continue;
    const p=at(P,C,s), side=k%2?1:-1, age=clamp((H-s)/90,0,1), a2=clamp((H-s-30)/130,0,1), u=s/H, c=hue("#5FA948",st,u);
    const dg=ldeg(p.a,side,lerp(30,62,age)+60*st.wilt+40*st.dry)+Math.sin(st.time*2+k*1.6)*2.4*(1-st.dry), L=lerp(18,80,age)*(1-.2*st.dry);
    const m=leafOn(out,k,p.x,p.y,dg,4,L,L*.14,c,{curl:Math.max(st.wilt*.6,st.dry*.8)});
    if(side<0) back+=m; else front+=m;
    if(a2>.02){ const tl=L+4, tx=p.x+Math.sin(rad(dg))*tl, ty=p.y-Math.cos(rad(dg))*tl, ps=lerp(.25,1,ss(0,1,a2))*(1-.25*st.dry)*.8;
      const bx=tx+side*lerp(6,22,a2), by=Math.min(ty+lerp(18,70,a2)+48*ps,-3), tc=st.dry>.5?DRY:"#7DAA45";
      pits+=`<path d="M${f1(tx)} ${f1(ty)} C${f1(tx+side*16)} ${f1(ty+20)} ${f1(bx+side*14)} ${f1(by+16)} ${f1(bx)} ${f1(by)}" stroke="${tc}" stroke-width="2" fill="none"/>`+pitcherM(bx,by,ps,hue("#8DB650",st,u),st.dry);
      if(ps>.4&&st.dry<.3) out.mouths.push([bx,by-77*ps]); } }
  out.svg=roots(st.g)+back+tube(P,lerp(6,9,st.g),2.6,hue("#6E8F3A",st,.3))+front+pits;
  return out; };

function budsM(L,W,s){ let p=""; for(const k of [.3,.52,.74]) for(const sd of [1,-1])
  p+=`<g transform="translate(${f1(W*OVAL(k)*sd)} ${f1(-L*k)}) rotate(${sd*70}) scale(${f1(s)})"><path d="M0 0 l-2 6 M0 0 l2 7" stroke="#E2D6B8" stroke-width=".9"/><path d="M0 0 C-6 -4 -7 -11 -1 -10Z" fill="#8BC34A"/><path d="M0 0 C6 -4 7 -11 1 -10Z" fill="#9CCC65"/></g>`;
  return p; }
PLANT.buds=st=>{
  const out=OUT(st), H=lerp(100,320,st.g), P=chainFrom(0,0,-Math.PI/2,H,28,stemTurn(st,H,0)), C=walk(P);
  let back="", front="";
  for(let s=22,k=0;s<H-12;s+=46,k++){
    const p=at(P,C,s), age=clamp((H-s)/90,0,1), u=s/H, c=hue("#69A85A",st,u);
    for(const side of [-1,1]){
      const L=lerp(14,86,age)*lerp(1,.8,u)*(1-.2*st.dry)*(k%2?.9:1), sp=lerp(20,55,age)+(k%2?8:0)+65*st.wilt+40*st.dry;
      const dg=ldeg(p.a,side,sp)+Math.sin(st.time*1.8+k+side)*1.8*(1-st.dry);
      const m=leafOn(out,k+(side<0?"L":"R"),p.x,p.y,dg,6,L,L*.3,side<0?mix(c,"#0E2A12",.08):c,
        {serr:9,edge:mix("#9A4A40",DRY,st.dry),pw:4,curl:Math.max(st.wilt*.5,st.dry*.7),extra:age>.8&&st.dry<.5?budsM(L,L*.3,ss(.8,1,age)):""});
      if(side<0) back+=m; else front+=m; } }
  out.svg=roots(st.g)+back+tube(P,lerp(9,14,st.g),5,hue("#7C8C55",st,.3))+front;
  return out; };

/* ---------- trap close-ups (400 x 400); c = 0 open .. 1 closed ---------- */
const TDEFS=`<linearGradient id="tpBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A9C25A"/><stop offset=".55" stop-color="#8DB04A"/><stop offset="1" stop-color="#6B9338"/></linearGradient>
<linearGradient id="tpBlush" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B83A31" stop-opacity=".9"/><stop offset=".5" stop-color="#B83A31" stop-opacity=".35"/><stop offset="1" stop-color="#B83A31" stop-opacity=".05"/></linearGradient>
<linearGradient id="tCyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".28"/><stop offset=".35" stop-color="#fff" stop-opacity=".16"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".32"/></linearGradient>
<radialGradient id="tpIn" cx=".5" cy=".35" r=".75"><stop offset="0" stop-color="#4B1511"/><stop offset="1" stop-color="#140504"/></radialGradient>
<radialGradient id="ftIn" cx=".3" cy=".6" r=".9"><stop offset="0" stop-color="#E2584F"/><stop offset=".7" stop-color="#B8322F"/><stop offset="1" stop-color="#8A2422"/></radialGradient>
<radialGradient id="blBody" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#E4F2C4" stop-opacity=".95"/><stop offset=".7" stop-color="#9FC46A" stop-opacity=".85"/><stop offset="1" stop-color="#5E8A3A" stop-opacity=".9"/></radialGradient>`;
function trapPitcherArt(c){
  const r=rnd(11), body="M150 132 C142 176 156 214 144 262 C128 324 150 398 200 402 C250 398 272 324 256 262 C244 214 258 176 250 132Z";
  let sp=""; for(let i=0;i<34;i++){ const y=150+r()*240, x=200+(r()-.5)*(y<220?100:150); sp+=`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(2+r()*6)}" ry="${f1(1.5+r()*3.5)}" fill="#8E2A24" opacity="${f1(.2+r()*.4)}"/>`; }
  const lc=mix("#C9574A","#8DB04A",ss(.35,.75,c)), cx=lerp(214,200,c), cy=lerp(66,121,c), rx=lerp(50,58,c), ry=lerp(36,17,c), rot=lerp(-14,0,c);
  let glands=""; if(c<.6) for(let i=0;i<14;i++) glands+=`<circle cx="${f1((r()-.5)*70)}" cy="${f1((r()-.5)*40)}" r="1.6" fill="#F4C9A8" opacity="${f1((1-c/.6)*.8)}"/>`;
  return `<defs><clipPath id="tpClip"><path d="${body}"/></clipPath></defs>
<g transform="translate(-6 118) rotate(78)">${leafM(150,22,"#5FA948")}</g>
<path d="M140 96 C92 130 88 330 138 390 C158 410 186 406 200 402" stroke="#7DAA45" stroke-width="5" fill="none" stroke-linecap="round"/>
<path d="${body}" fill="url(#tpBody)" stroke="#4E7A2C" stroke-width="2.5"/>
<g clip-path="url(#tpClip)">${sp}<path d="M100 120 H300 V420 H100Z" fill="url(#tpBlush)"/></g>
<path d="${body}" fill="url(#tCyl)"/>
<path d="M186 150 C178 230 180 320 192 392 M214 150 C222 230 220 320 208 392" stroke="#5D8A33" stroke-width="7" stroke-dasharray="1.6 4" fill="none" opacity=".75"/>
<ellipse cx="200" cy="129" rx="47" ry="11" fill="url(#tpIn)"/>
<ellipse cx="200" cy="128" rx="55" ry="16" fill="none" stroke="#B5312C" stroke-width="12"/>
<ellipse cx="200" cy="128" rx="55" ry="16" fill="none" stroke="#6B1512" stroke-width="12" stroke-dasharray="1.4 3" opacity=".55"/>
<ellipse cx="200" cy="122" rx="55" ry="14" fill="none" stroke="#F08E7E" stroke-width="1.6" opacity=".55"/>
<path d="M226 112 L246 96 L236 114Z" fill="#7E9E40"/>
<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(rot)})"><ellipse rx="${f1(rx)}" ry="${f1(ry)}" fill="${lc}" stroke="#4E7A2C" stroke-width="2"/><ellipse rx="${f1(rx)}" ry="${f1(ry)}" fill="url(#tCyl)" opacity=".6"/>${glands}</g>`; }
function jawArt(sd,ang){ let cil="", trig="";
  for(let i=0;i<14;i++){ const t=.1+i*.062, y=-158*t-4, x=sd*(8+Math.sin(t*Math.PI)*9);
    cil+=`<path d="M${f1(x)} ${f1(y)} q${f1(-sd*12)} -4 ${f1(-sd*28)} ${f1(-10-i*1.2)}" stroke="#A8CF68" stroke-width="2.6" fill="none" stroke-linecap="round"/>`; }
  for(const [x,y] of [[24,-50],[30,-88],[22,-118]]) trig+=`<path d="M${sd*x} ${y} l${sd*-5} -7" stroke="#5A1A16" stroke-width="1.6" stroke-linecap="round"/>`;
  const lobe=`M0 0 C${sd*70} -14 ${sd*80} -120 ${sd*6} -158 C${sd*22} -110 ${sd*22} -40 0 0Z`;
  return `<g transform="rotate(${f1(sd*ang)})"><path d="${lobe}" fill="#7DB04A" stroke="#4E7A2C" stroke-width="2.5"/><path d="${lobe}" fill="url(#tCyl)" opacity=".6"/>
<path d="M${sd*3} -10 C${sd*20} -50 ${sd*20} -110 ${sd*7} -150 C${sd*34} -110 ${sd*40} -50 ${sd*3} -10Z" fill="url(#ftIn)"/>${trig}${cil}</g>`; }
function trapFlytrapArt(c){ const a=lerp(38,2,c);
  return `<ellipse cx="200" cy="396" rx="190" ry="22" fill="#5E7F3E"/><ellipse cx="200" cy="392" rx="170" ry="14" fill="#7FA556" opacity=".7"/>
<g opacity=".55"><g transform="translate(70 330) rotate(-30) scale(.45)">${jawArt(-1,30)}${jawArt(1,30)}</g><g transform="translate(330 340) rotate(28) scale(.4)">${jawArt(-1,6)}${jawArt(1,6)}</g></g>
<path d="M200 395 C160 360 160 312 200 280 C240 312 240 360 200 395Z" fill="#7DB04A" stroke="#4E7A2C" stroke-width="2"/><path d="M200 392 L200 290" stroke="#5E8F35" stroke-width="2"/>
<g transform="translate(200 284)">${jawArt(-1,a)}${jawArt(1,a)}</g><circle cx="200" cy="284" r="6" fill="#4E7A2C"/>`; }
function bladderM(x,y,R,c){ const hx=x+R*.82, hy=y-R*.45, sw=R>20?2.4:1.5;
  return `<path d="M${f1(x-R*.2)} ${f1(y-R*.95)} Q${f1(x-R*.4)} ${f1(y-R-8)} ${f1(x-R*.3)} ${f1(y-R-16)}" stroke="#5E9A3E" stroke-width="${sw}" fill="none"/>
<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(R)}" fill="url(#blBody)" stroke="#4E7A2C" stroke-width="${sw}"/>
<ellipse cx="${f1(x-R*.35)}" cy="${f1(y-R*.38)}" rx="${f1(R*.28)}" ry="${f1(R*.16)}" transform="rotate(-30 ${f1(x-R*.35)} ${f1(y-R*.38)})" fill="#fff" opacity=".55"/>
<g transform="translate(${f1(hx)} ${f1(hy)}) rotate(-35)"><ellipse rx="${f1(R*.16)}" ry="${f1(R*.27)}" fill="#1F3D24" opacity="${f1(.75*(1-c))}"/><g transform="rotate(${f1(lerp(-75,0,c))} 0 ${f1(-R*.27)})"><path d="M0 ${f1(-R*.27)} Q${f1(R*.1)} 0 0 ${f1(R*.27)}" stroke="#3D6B2A" stroke-width="${f1(Math.max(1.5,R*.09))}" fill="none" stroke-linecap="round"/></g></g>
<path d="M${f1(hx)} ${f1(hy)} l${f1(R*.45)} ${f1(-R*.6)} l${f1(R*.12)} ${f1(-R*.22)} M${f1(hx+R*.45)} ${f1(hy-R*.6)} l${f1(R*.25)} ${f1(-R*.05)} M${f1(hx)} ${f1(hy)} l${f1(R*.7)} ${f1(-R*.15)} l${f1(R*.18)} ${f1(-R*.12)}" stroke="#6FAF5E" stroke-width="${f1(sw*.6)}" fill="none" stroke-linecap="round"/>`; }
function trapBladderArt(c){
  let s=`<path d="M0 196 C70 176 130 222 200 196 S320 168 400 194" stroke="#5E9A3E" stroke-width="5" fill="none" stroke-linecap="round"/>`;
  for(const [x,y,a] of [[40,188,-38],[96,198,30],[150,206,-26],[300,182,26],[352,186,-34],[70,192,152],[180,200,-155],[330,186,160]]){
    const r=rad(a), L=64; let d=`M${x} ${y} L${f1(x+Math.sin(r)*L)} ${f1(y-Math.cos(r)*L)}`;
    for(const k of [.35,.6,.85]) for(const sd of [-1,1]){ const px=x+Math.sin(r)*L*k, py=y-Math.cos(r)*L*k, r2=r+sd*.6; d+=` M${f1(px)} ${f1(py)} l${f1(Math.sin(r2)*20*(1.1-k))} ${f1(-Math.cos(r2)*20*(1.1-k))}`; }
    s+=`<path d="${d}" stroke="#6FAF5E" stroke-width="1.6" fill="none" stroke-linecap="round"/>`; }
  for(const [x,y,R] of [[92,236,13],[146,246,11],[322,232,14],[372,224,10]]) s+=bladderM(x,y,R,0);
  return s+bladderM(237,232,38*(1+.06*c),c); }
const TRAP_ART={pitcher:trapPitcherArt,flytrap:trapFlytrapArt,bladder:trapBladderArt};

/* ---------- backgrounds ---------- */
const BGDEFS=`<filter id="soft" x="-30%" y="-60%" width="160%" height="220%"><feGaussianBlur stdDeviation="4"/></filter><filter id="haze"><feGaussianBlur stdDeviation="1.5"/></filter>`;
const svgBg=b=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 680">${b}</svg>`;
function skyM(c1,c2){ return `<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient><rect width="1000" height="${GR}" fill="url(#sky)"/>`; }
function sunM(x,y,r,c){ return `<radialGradient id="sunG"><stop offset="0" stop-color="${c}" stop-opacity=".9"/><stop offset=".3" stop-color="${c}" stop-opacity=".45"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient><circle cx="${x}" cy="${y}" r="${r*3}" fill="url(#sunG)"/><circle cx="${x}" cy="${y}" r="${r}" fill="#FFF4C8"/>`; }
function cloudM(x,y,s,o){ return `<g transform="translate(${x} ${y}) scale(${s})" opacity="${o}" filter="url(#soft)"><ellipse cx="0" cy="6" rx="78" ry="16" fill="#E6EDF2"/><ellipse cx="-34" cy="-6" rx="36" ry="22" fill="#fff"/><ellipse cx="12" cy="-16" rx="42" ry="30" fill="#fff"/><ellipse cx="46" cy="-2" rx="30" ry="18" fill="#fff"/></g>`; }
function ridge(y,amp,seed,step=16){ const r=rnd(seed), a=r()*6, b=r()*6, c=r()*6; let d=`M0 ${GR+2}`;
  for(let x=0;x<=1000;x+=step) d+=` L${x} ${f1(y+Math.sin(x/170+a)*amp+Math.sin(x/61+b)*amp*.38+Math.sin(x/23+c)*amp*.12)}`; return d+` L1000 ${GR+2}Z`; }
function treeLine(seed,y,n,c,s=1){ const r=rnd(seed); let t=""; for(let i=0;i<n;i++){ const x=r()*1040-20, h=(30+r()*40)*s;
  t+=`<rect x="${f1(x-2*s)}" y="${f1(y-h*.4)}" width="${f1(4*s)}" height="${f1(h*.4+6)}" fill="${mix(c,"#3A2A1A",.35)}"/>`;
  for(let j=0;j<4;j++) t+=`<circle cx="${f1(x+(r()-.5)*h*.6)}" cy="${f1(y-h*.45-r()*h*.5)}" r="${f1(h*(.22+r()*.14))}" fill="${j%2?c:mix(c,"#FFFFFF",.08)}"/>`; } return t; }
function bushes(seed,y,n,cols){ const r=rnd(seed); let s=""; for(let i=0;i<n;i++){ const x=r()*1000, w=30+r()*40;
  for(let j=0;j<5;j++) s+=`<circle cx="${f1(x+(r()-.5)*w*1.4)}" cy="${f1(y-r()*w*.6)}" r="${f1(w*(.35+r()*.3))}" fill="${cols[j%cols.length]}"/>`; } return s; }
function soilM(seed,c1,c2,spk){ const r=rnd(seed); let s=`<linearGradient id="soil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient><rect y="${GR}" width="1000" height="${680-GR}" fill="url(#soil)"/>`;
  for(let i=0;i<160;i++){ const x=r()*1000, y=GR+5+r()*(675-GR), q=.7+r()*2.4; s+=`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(q*1.5)}" ry="${f1(q)}" fill="${spk[i%spk.length]}" opacity="${f1(.3+r()*.5)}"/>`; }
  for(let i=0;i<16;i++){ const x=r()*1000, y=GR+16+r()*140, w=4+r()*9; s+=`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${f1(w)}" ry="${f1(w*.62)}" fill="#9C8E7C"/><ellipse cx="${f1(x-w*.25)}" cy="${f1(y-w*.22)}" rx="${f1(w*.45)}" ry="${f1(w*.22)}" fill="#fff" opacity=".28"/>`; }
  return s+`<rect y="${GR}" width="1000" height="10" fill="#000" opacity=".1"/>`; }
function tuftsM(seed,n,cols,hmax=16){ const r=rnd(seed); let s=""; for(let i=0;i<n;i++){ const x=r()*1000; for(let j=0;j<5;j++){ const h=hmax*(.35+r()*.65), l=(r()-.5)*12;
  s+=`<path d="M${f1(x+j*2.2)} ${GR+3} q${f1(l*.25)} ${f1(-h*.6)} ${f1(l)} ${f1(-h)}" stroke="${cols[(i+j)%cols.length]}" stroke-width="1.7" fill="none" stroke-linecap="round"/>`; } } return s; }
function flowersM(seed,n,y0,y1){ const r=rnd(seed); let s=""; for(let i=0;i<n;i++){ const x=r()*1000, y=y0+r()*(y1-y0), c=["#FFFFFF","#F7D14C","#F29BC3"][i%3];
  s+=`<path d="M${f1(x)} ${f1(y)} l0 9" stroke="#5E9E4A" stroke-width="1.2"/><circle cx="${f1(x)}" cy="${f1(y)}" r="3" fill="${c}"/><circle cx="${f1(x)}" cy="${f1(y)}" r="1.1" fill="#E0A428"/>`; } return s; }
function fenceM(){ let f=`<linearGradient id="wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#A9784A"/><stop offset=".45" stop-color="#D3A874"/><stop offset="1" stop-color="#9C6D40"/></linearGradient>`;
  f+=`<rect y="338" width="1000" height="14" fill="#B88A58"/><rect y="352" width="1000" height="4" fill="#000" opacity=".12"/><rect y="432" width="1000" height="14" fill="#B88A58"/><rect y="446" width="1000" height="4" fill="#000" opacity=".12"/>`;
  for(let x=10;x<1000;x+=62) f+=`<path d="M${x} ${GR} V306 l15 -18 l15 18 V${GR}Z" fill="url(#wood)" stroke="#8A5E34" stroke-width="1.5"/><path d="M${x+9} 320 q2 60 -1 180 M${x+20} 330 q-2 70 1 170" stroke="#8A5E34" stroke-width=".8" opacity=".5" fill="none"/><path d="M${x+30} 306 V${GR}" stroke="#000" stroke-opacity=".12" stroke-width="5"/>`;
  return f; }
function fernM(x,y,s,c){ let f=""; for(const a of [-62,-34,-8,20,48]){ let d="M0 0 L0 -120"; for(let k=1;k<=10;k++) d+=` M0 ${-k*11} l${16-k*1.2} -6 M0 ${-k*11} l${-(16-k*1.2)} -6`;
  f+=`<path d="${d}" transform="rotate(${a})" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round"/>`; }
  return `<g transform="translate(${x} ${y}) scale(${s})">${f}</g>`; }
function bgPond(){ const r=rnd(51); let s="";
  for(const x of [120,330,560,780,930]) s+=`<path d="M${x} 0 L${x+50} 0 L${x-40} 680 L${x-130} 680Z" fill="#fff" opacity=".08" filter="url(#soft)"/>`;
  for(let i=0;i<70;i++) s+=`<circle cx="${f1(r()*1000)}" cy="${f1(40+r()*560)}" r="${f1(.6+r()*1.6)}" fill="#E8F6FA" opacity="${f1(.15+r()*.35)}"/>`;
  s+=`<path d="M0 612 C200 596 420 632 640 610 S900 600 1000 614 V680 H0Z" fill="#8A7350"/><path d="M0 626 C220 612 420 642 640 624 S900 616 1000 628 V680 H0Z" fill="#6E5A3C"/>`;
  for(let i=0;i<22;i++){ const x=r()*1000, w=4+r()*8; s+=`<ellipse cx="${f1(x)}" cy="${f1(630+r()*40)}" rx="${f1(w)}" ry="${f1(w*.6)}" fill="#9C8E7C"/>`; }
  for(let i=0;i<26;i++){ const x=r()*1000, h=110+r()*170, l=(r()-.5)*70; s+=`<path d="M${f1(x)} 640 q${f1(l)} ${f1(-h*.5)} ${f1(l*.4)} ${f1(-h)}" stroke="${["#4F8A4A","#5E9A52","#3E7440"][i%3]}" stroke-width="${f1(3+r()*3)}" fill="none" stroke-linecap="round" opacity=".75"/>`; }
  for(let i=0;i<14;i++){ const x=r()*1000, y=80+r()*500, q=2+r()*5; s+=`<circle cx="${f1(x)}" cy="${f1(y)}" r="${f1(q)}" fill="none" stroke="#fff" stroke-width="1" opacity=".55"/>`; }
  return svgBg(`<defs>${BGDEFS}<linearGradient id="w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86CDE2"/><stop offset=".55" stop-color="#3F8DAA"/><stop offset="1" stop-color="#245F7C"/></linearGradient></defs><rect width="1000" height="680" fill="url(#w)"/><rect width="1000" height="34" fill="#BFE7F3" opacity=".5"/><path d="M0 34 C120 28 240 40 360 33 S600 26 720 34 S900 40 1000 32" stroke="#E6F7FC" stroke-width="3" fill="none" opacity=".8"/>${s}`); }
function bgMoist(){ const r=rnd(61); let s="";
  for(const x of [90,360,640]) s+=`<path d="M${x} 0 L${x+90} 0 L${x+280} ${GR} L${x+130} ${GR}Z" fill="#FFF8D8" opacity=".2" filter="url(#soft)"/>`;
  for(const [x,w] of [[60,46],[250,34],[800,58],[930,38]]) s+=`<rect x="${x}" y="0" width="${w}" height="${GR}" fill="#6E5C48" opacity=".5" filter="url(#haze)"/>`;
  s+=`<path d="${ridge(440,12,41)}" fill="#7FA886" opacity=".8"/>`+fernM(130,505,.8,"#4F7F48")+fernM(860,505,.9,"#476F40")+fernM(300,510,.55,"#5A8A50")+fernM(700,512,.6,"#5A8A50");
  s+=bushes(42,508,18,["#3F6E3C","#4E7F47","#5C8E50"])+`<rect y="500" width="1000" height="22" fill="#4E7A3E"/>`+soilM(43,"#3E2E21","#261B13",["#4E3A2A","#2E2218","#5A4632"]);
  for(let i=0;i<30;i++){ const x=r()*1000, y=GR+4+r()*28, a=r()*180; s+=`<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="7" ry="3" transform="rotate(${f1(a)} ${f1(x)} ${f1(y)})" fill="${["#8A5A32","#A0703A","#6E4A2A"][i%3]}" opacity=".75"/>`; }
  for(let i=0;i<45;i++) s+=`<ellipse cx="${f1(r()*1000)}" cy="${f1(GR+8+r()*150)}" rx="1.6" ry="1.1" fill="#DDEFF7" opacity=".5"/>`;
  return svgBg(`<defs>${BGDEFS}</defs>${skyM("#B9D8C4","#E6F1E3")}${s}${tuftsM(44,90,["#5F9443","#7AB056","#4B7D38"],12)}`); }
function bgDesert(){ let s=`<path d="M0 ${GR} V372 L90 372 L110 352 L210 352 L232 380 L330 384 L350 362 L420 360 L440 390 L1000 392 V${GR}Z" fill="#D9A877" opacity=".6" filter="url(#haze)"/><path d="M610 ${GR} V368 L640 340 L760 338 L790 372 L1000 376 V${GR}Z" fill="#CF9D6B" opacity=".55" filter="url(#haze)"/>`;
  s+=`<path d="${ridge(420,22,8)}" fill="url(#dune)"/><path d="${ridge(462,12,9)}" fill="#E4B97E"/>`+soilM(10,"#E3B77A","#BF8C52",["#C99A60","#F1D3A2","#A87A45"]);
  for(let i=0;i<9;i++){ const y=GR+20+i*17; s+=`<path d="M0 ${y} C150 ${y-6} 300 ${y+6} 500 ${y} S850 ${y-5} 1000 ${y+3}" stroke="#C9955A" stroke-width="1.2" fill="none" opacity=".35"/>`; }
  s+=`<path d="M300 545 l30 8 l18 -6 l26 12 M330 553 l-6 20 M392 559 l20 18 l26 -4 M560 540 l24 14 l30 -10 M584 554 l4 24 M640 600 l30 10 l20 -8 M200 610 l26 -6 l22 10" stroke="#9C6E3E" stroke-width="1.6" fill="none" opacity=".7"/>`;
  for(const [x,sc] of [[150,1],[870,.8]]) s+=`<g transform="translate(${x} ${GR+2}) scale(${sc})" stroke="#8A6A3E" stroke-width="2" fill="none" stroke-linecap="round"><path d="M0 0 L-4 -30 L-18 -50 M-4 -30 L8 -52 L4 -66 M8 -52 L22 -60 M0 0 L14 -24 L30 -32"/></g>`;
  return svgBg(`<defs>${BGDEFS}<linearGradient id="dune" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0CB8E"/><stop offset="1" stop-color="#D9A86A"/></linearGradient></defs>${skyM("#F2C27A","#FDEBC6")}${sunM(840,110,46,"#FFD86A")}${s}${tuftsM(11,26,["#B8955A","#A07F48","#C8A86A"],13)}`); }
function bgSeason(){ let rows=""; for(let i=0;i<16;i++){ const x=i*70-40; rows+=`<path d="M${x} ${GR} L${f1(500+(x-500)*.35)} 420" stroke="#AECB82" stroke-width="3" opacity=".7"/>`; }
  return svgBg(`<defs>${BGDEFS}</defs>${skyM("#9FD2EE","#EDF7EA")}${sunM(820,100,32,"#FFE9A0")}${cloudM(300,100,1,.95)}${cloudM(600,150,.7,.85)}
<path d="${ridge(380,14,31)}" fill="#A7CBA5" opacity=".9"/><g filter="url(#haze)">${treeLine(32,404,22,"#7FAE78",.8)}</g>
<path d="M0 ${GR} V420 C300 408 700 414 1000 418 V${GR}Z" fill="#C3DC98"/>${rows}<rect y="498" width="1000" height="24" fill="#86B866"/>
${soilM(33,"#8A6A4A","#5E4430",["#6E5238","#A0805C","#4E3A28"])}${tuftsM(34,70,["#6AA650","#82BC62","#5A9446"])}`); }
const DEFAULT_ART={
  bg_climb: svgBg(`<defs>${BGDEFS}</defs>${skyM("#86C5EC","#E3F2F2")}${sunM(150,95,34,"#FFE9A0")}${cloudM(420,110,1,.95)}${cloudM(780,80,.8,.9)}${cloudM(620,200,.55,.8)}
<path d="${ridge(350,22,3)}" fill="#A8CDB4" opacity=".85"/><g filter="url(#haze)" opacity=".8">${treeLine(4,372,16,"#86B48A",.9)}</g><path d="${ridge(392,10,5)}" fill="#8DBE86"/>
${fenceM()}${bushes(6,515,14,["#4E8C45","#5F9F52","#6CAD5B","#447D3D"])}<rect y="500" width="1000" height="22" fill="#76AE5C"/>${flowersM(9,22,500,514)}
${soilM(7,"#8A6A4A","#5E4430",["#6E5238","#A0805C","#4E3A28"])}${tuftsM(8,70,["#5E9E4A","#78B85C","#4C8A3E"])}`),
  bg_desert: bgDesert(),
  bg_hills: svgBg(`<defs>${BGDEFS}</defs>${skyM("#A9C3D1","#E0EAEA")}${cloudM(260,120,1.2,.75)}${cloudM(720,90,1,.7)}
<path d="${ridge(300,40,21)}" fill="#A6C1BA"/><rect y="296" width="1000" height="60" fill="#fff" opacity=".45" filter="url(#soft)"/>
<path d="${ridge(360,30,22)}" fill="#86AA90"/><g opacity=".9">${treeLine(23,374,30,"#6F9A78",.8)}</g><rect y="392" width="1000" height="40" fill="#fff" opacity=".35" filter="url(#soft)"/>
<path d="${ridge(440,18,24)}" fill="#5F8B5E"/>${bushes(25,505,16,["#4D7B47","#5A8B50","#3F6B3B"])}<rect y="498" width="1000" height="24" fill="#567F45"/>
${soilM(26,"#4C3E2E","#2C241B",["#5E4C38","#3A2F23","#6B5A44"])}${tuftsM(27,70,["#5E8F45","#76A858","#4A7A3A"])}`),
  bg_season: bgSeason(), bg_moist: bgMoist(), bg_pond: bgPond()
};
const plantArt=(type,o={})=>svg400x500(`<defs>${PDEFS}</defs><ellipse cx="200" cy="424" rx="150" ry="12" fill="#7A5C3E" opacity=".25"/><g transform="translate(200 420)">${PLANT[type](Object.assign({g:1,wilt:0,yel:0,dry:0,flop:0,regrow:0,food:1,bloom:0,time:0,climb:false,detach:[]},o)).svg}</g>`);
const trapArt=(k,c)=>svg400(`<defs>${PDEFS}${TDEFS}</defs>${TRAP_ART[k](c)}`);
Object.assign(DEFAULT_ART,{
  plant_ordinary:plantArt("ordinary"), plant_tendril:plantArt("tendril",{bloom:1}), plant_spines:plantArt("spines",{bloom:1}),
  plant_scale:plantArt("scale"), plant_pitcher:plantArt("pitcher"), plant_buds:plantArt("buds"),
  trap_pitcher_open:trapArt("pitcher",0), trap_pitcher_closed:trapArt("pitcher",1),
  trap_flytrap_open:trapArt("flytrap",0), trap_flytrap_closed:trapArt("flytrap",1),
  trap_bladder_open:trapArt("bladder",0), trap_bladder_closed:trapArt("bladder",1)
});
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


/* ---------- svg helpers ---------- */
const NS="http://www.w3.org/2000/svg", scene=document.getElementById("scene");
function el(tag,attrs={},parent=scene){ const n=document.createElementNS(NS,tag);
  for(const k in attrs){ if(k==="text") n.textContent=attrs[k]; else n.setAttribute(k,attrs[k]); } parent.appendChild(n); return n; }
function img(key,x,y,w,h,parent){ return el("image",{href:src(key),x,y,width:w,height:h,preserveAspectRatio:"xMidYMid meet"},parent); }
const $=id=>document.getElementById(id);
const defs=el("defs");
defs.innerHTML=`<filter id="fwilt"><feColorMatrix type="matrix" values="0.55 0.45 0.1 0 0.06  0.35 0.42 0.1 0 0.03  0.18 0.2 0.12 0 0  0 0 0 1 0"/></filter>
<filter id="fyellow"><feColorMatrix type="matrix" values="0.9 0.7 0 0 0.06  0.25 0.95 0 0 0.04  0 0 0.25 0 0  0 0 0 1 0"/></filter>
${PDEFS}${TDEFS}<linearGradient id="bamboo" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B98F4E"/><stop offset=".4" stop-color="#E2C17F"/><stop offset="1" stop-color="#9E7638"/></linearGradient>`;
/* ---------- toast ---------- */
let toastTimer=null;
function toast(msg,kind,ms){ const t=$("toast"); t.innerHTML=msg; t.className=kind||""; t.hidden=!msg; clearTimeout(toastTimer);
  if(msg&&!ms){ const x=document.createElement("button"); x.className="x"; x.textContent="×"; x.setAttribute("aria-label","Close"); t.append(x); t.classList.add("closable"); } if(msg&&ms) toastTimer=setTimeout(()=>t.hidden=true,ms); }


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
function mcq(box,item,onEnd){
  box.innerHTML=`<p>${item.q}</p>`+item.opts.map((o,i)=>`<button class="opt" data-i="${i}">${o.t}</button>`).join("")+`<div class="fb" aria-live="polite"></div>`;
  const fb=box.querySelector(".fb"), btns=[...box.querySelectorAll(".opt")]; let wrong=0;
  btns.forEach(b=>b.onclick=()=>{
    const i=+b.dataset.i, o=item.opts[i];
    if(i===item.a){
      b.classList.add("right"); btns.forEach(x=>x.disabled=true);
      fb.className="fb ok"; fb.innerHTML=(wrong===0?"Correct! ":"That's right. ")+o.why; Sound.play("ok");
      onEnd&&onEnd(wrong===0);
    } else {
      wrong++; b.classList.add("wrong"); b.disabled=true; Sound.play("no");
      if(wrong<2){ fb.className="fb no"; fb.innerHTML="Not quite. "+o.why+" Try again."; }
      else { const c=item.opts[item.a]; btns[item.a].classList.add("right"); btns.forEach(x=>x.disabled=true);
        fb.className="fb info"; fb.innerHTML=`The correct answer is “${c.t}” ${c.why}`; onEnd&&onEnd(false); }
    }
  });
}

/* ---------- HUD ---------- */
function hud(a,b,c,meter){
  [["h1l","h1",a],["h2l","h2",b],["h3l","h3",c]].forEach(([l,v,d])=>{$(l).textContent=d[0];$(v).textContent=d[1];});
  $("hm").hidden=meter==null; if(meter!=null) $("needle").style.left=meter+"%";
}


/* ---------- state ---------- */
const S={tab:"explore",
  ex:{scen:"climb",leaf:"ordinary",t:0,running:false,done:false,saved:{}},
  tr:{plant:"pitcher",nit:20,n:0,nitro:0,busy:false,phase:-1,pt:0,asked:false,full:false},
  ch:{i:0,stars:0,got:{}}};

/* ---------- EXPLORE ---------- */
const SCEN={
  climb:{name:"Weak stem",bg:"bg_climb",ok:"tendril",text:"My stem is too weak to stand up. Help me climb the fence to reach the sunlight!",
    need:"something to hold on to the support",fail:"Its weak stem flopped over onto the ground, in the shade.",
    win:"Its leaflets became tendrils that coiled round the stick. The plant climbed up to the sunlight, just like the sweet pea!",metric:"Height reached"},
  desert:{name:"Hot desert",bg:"bg_desert",ok:"spines",text:"It is hot and dry here, and it hardly ever rains. Help me save water!",
    need:"to cut down the water lost from its leaves",fail:"It lost water quickly and wilted.",
    win:"Its leaves became spines, so very little water was lost. The cactus survived the desert!",metric:"Water in the plant"},
  hills:{name:"Poor soil",bg:"bg_hills",ok:"pitcher",text:"The soil in these hills has very few nitrates. Help me get the nitrogen I need!",
    need:"a way to get extra nitrogen",fail:"Without enough nitrates, its leaves turned yellow.",
    win:"Its leaves became pitchers that trapped insects. The plant got nitrogen from the insects, like pitcher plants in the Garo and Khasi Hills!",metric:"Nitrogen"},
  season:{name:"Dry season",bg:"bg_season",ok:"scale",text:"A long dry season is coming. Help me store food so I can grow again when the rains return!",
    need:"a store of food for the dry season",fail:"It dried up and had no stored food, so it could not grow again.",
    win:"Its thick, fleshy scale leaves stored food. When the rains returned, the onion grew again!",metric:"Food stored"},
  newplants:{name:"No seeds",bg:"bg_moist",ok:"buds",text:"I can't make seeds. Help me make new plants from my leaves!",
    need:"a way to make new plants from its leaves",fail:"The fallen leaf rotted, and no new plants grew.",
    win:"Buds on the leaf margin grew into tiny plantlets in the moist soil, just like <i>Bryophyllum</i>!",metric:"New plantlets"}
};
const LEAVES={ordinary:{name:"Ordinary leaf",does:"An ordinary leaf makes food, but it has no special job."},
  tendril:{name:"Tendrils",does:"Tendrils help a weak stem climb."},
  spines:{name:"Spines",does:"Spines cut down water loss."},
  scale:{name:"Scale leaves",does:"Fleshy scale leaves store food."},
  pitcher:{name:"Pitchers",does:"Pitchers trap insects for nitrogen."},
  buds:{name:"Margin buds",does:"Buds on the leaf margin grow into new plants."}};
// where the general failure message doesn't fit the plant, say what really happens to it
const FAIL_MSG={
  climb:{spines:"Spines cut down water loss. But this plant needed something to hold on to the support. A cactus cannot climb, so it stayed low in the shade of the fence.",
    scale:"Fleshy scale leaves store food. But this plant needed something to hold on to the support. An onion cannot climb, so its leaves stayed low in the shade of the fence."},
  season:{spines:"The cactus stayed healthy: its spines cut down water loss, so a dry season does not harm it much. But spines do not store food, and this plant needed a store of food to grow again when the rains return.",
    buds:"The <i>Bryophyllum</i> stayed healthy: its thick, juicy leaves make food and store water and some food, so a dry season does not harm it much. But the special job of its leaves is to grow new plants from the buds on their margin. This plant needed leaves modified mainly to store food, like the fleshy scale leaves of an onion."},
  newplants:{spines:"Spines cut down water loss. But this plant needed a way to make new plants from its leaves. A cactus's leaves are spines: a fallen spine has no buds, so no new plants grew."}};
const BASE=[480,GR], PSC=.84; // plant base in the scene, and plant-unit scale
const gEx=el("g",{});
const exBg=img("bg_climb",0,0,1000,680,gEx);
const seasonTint=el("rect",{x:0,y:0,width:1000,height:GR,fill:"#B9893F",opacity:0},gEx);
const rainSky=el("rect",{x:0,y:0,width:1000,height:GR,fill:"#4E5B68",opacity:0},gEx);
const wetGround=el("rect",{x:0,y:GR,width:1000,height:680-GR,fill:"#1E140C",opacity:0},gEx);
const glare=el("circle",{cx:840,cy:110,r:140,fill:"#FFD25A",opacity:0},gEx);
const pole=el("g",{},gEx);
pole.innerHTML=`<ellipse cx="640" cy="${GR+2}" rx="14" ry="4" fill="#000" opacity=".2"/><rect x="634" y="116" width="12" height="${GR-110}" rx="4" fill="url(#bamboo)" stroke="#8C6A35" stroke-width="1.2"/>`+[190,280,370,460].map(y=>`<rect x="633" y="${y}" width="14" height="4" rx="2" fill="#A07B40"/>`).join("");
const shadow=el("ellipse",{cx:BASE[0],cy:GR+3,rx:60,ry:7,fill:"#000",opacity:.18},gEx);
const fallen=el("g",{},gEx);
const plantG=el("g",{transform:`translate(${BASE[0]} ${BASE[1]}) scale(${PSC})`},gEx);
const bugs=el("g",{},gEx);
const rain=el("g",{},gEx), splash=el("g",{},gEx);
const seasonLabel=el("g",{display:"none"},gEx);
el("rect",{x:350,y:22,width:300,height:48,rx:24,fill:"#fff",opacity:.85},seasonLabel);
const seasonText=el("text",{x:500,y:57,"text-anchor":"middle","font-size":30,"font-weight":800,fill:"#17302A",text:""},seasonLabel);
let bugList=[], fallList=[], rainDrops=[], splashes=[], clock=0, lastOut=null, idleAcc=0;
function rainTick(dt,on){
  if(!on){ if(rainDrops.length||splashes.length){ rain.innerHTML=""; splash.innerHTML=""; rainDrops=[]; splashes=[]; } return; }
  if(!rainDrops.length) for(let i=0;i<110;i++) rainDrops.push({n:el("line",{stroke:"#A9CDEB","stroke-width":2,"stroke-linecap":"round",opacity:(.45+Math.random()*.4).toFixed(2)},rain),x:Math.random()*1080,y:Math.random()*GR,v:620+Math.random()*280});
  rainDrops.forEach(d=>{ d.y+=d.v*dt; d.x-=d.v*dt*.15;
    if(d.y>GR){ if(splashes.length<24) splashes.push({n:el("ellipse",{cx:f1(d.x),cy:GR+2,rx:2,ry:1,fill:"none",stroke:"#CFE6F6","stroke-width":1.4},splash),life:0});
      d.y-=GR+30; d.x=Math.random()*1080; }
    d.n.setAttribute("x1",f1(d.x)); d.n.setAttribute("y1",f1(d.y)); d.n.setAttribute("x2",f1(d.x-3.5)); d.n.setAttribute("y2",f1(d.y+22)); });
  splashes=splashes.filter(s=>{ s.life+=dt*3.5; if(s.life>=1){ s.n.remove(); return false; }
    s.n.setAttribute("rx",f1(2+s.life*9)); s.n.setAttribute("ry",f1(1+s.life*2.5)); s.n.setAttribute("opacity",f1(1-s.life)); return true; });
}
function exPlantKey(){ return "plant_"+S.ex.leaf; }
function exSetup(){
  const E=S.ex, sc=SCEN[E.scen];
  exBg.setAttribute("href",src(sc.bg));
  pole.setAttribute("display",E.scen==="climb"?"inline":"none");
  $("scenText").innerHTML=`<b>${sc.name}:</b> “${sc.text}”`;
  segSetChips("scen",E.scen); segSetChips("leafOpt",E.leaf);
  exReset(true);
}
function exReset(keep){
  const E=S.ex; Object.assign(E,{t:0,running:false,done:false,detach:[],caught:0,fedS:0,spawnT:0});
  [seasonTint,rainSky,wetGround,glare].forEach(n=>n.setAttribute("opacity",0)); seasonLabel.setAttribute("display","none");
  bugs.innerHTML=""; rainTick(0,false); fallen.innerHTML=""; bugList=[]; fallList=[]; pops=[];
  $("grow").disabled=false; lockEx(false); if(!keep) toast(""); exDraw(); exHud(); drawSaved();
}
function lockEx(l){ document.querySelectorAll("#scen button,#leafOpt button").forEach(b=>b.disabled=l); }
function success(){ return SCEN[S.ex.scen].ok===S.ex.leaf; }
function seasonHardy(){ return S.ex.leaf==="spines"||S.ex.leaf==="buds"; } // succulents that hold water through a dry season
function exHud(){
  const E=S.ex, t=E.t, ok=success(), sc=SCEN[E.scen]; let v="", m=null, health=100;
  const upright=E.leaf==="spines"||E.leaf==="scale"; // can't climb, but doesn't collapse either
  if(E.scen==="climb"){ const h=ok?30+150*t:30+5*t; v=Math.round(h)+" cm"; m=h/180*100; health=ok?100:lerp(100,upright?70:35,t); }
  if(E.scen==="desert"){ const w=ok?lerp(100,88,t):lerp(100,25,t); v=Math.round(w)+"%"; m=w; health=ok?96:lerp(100,25,t); }
  if(E.scen==="hills"){ const n=ok?lerp(30,100,E.fedS):lerp(30,10,t); v=Math.round(n)+"%"; m=n; health=ok?lerp(70,100,E.fedS):lerp(70,30,t); }
  if(E.scen==="season"&&seasonHardy()){ const b=E.leaf==="buds"; v=b?"Some":"None"; m=b?30:0; /* succulent leaves hold a little food, but are not a food store */ health=lerp(100,92,ss(.4,.7,t))+8*ss(.78,1,t); }
  else if(E.scen==="season"){ const f=ok?(t<0.35?t/0.35*100:t<0.75?100:lerp(100,55,(t-0.75)/0.25)):0; v=Math.round(f)+"%"; m=f;
    health=ok?(t<0.35?100:t<0.75?lerp(100,45,(t-0.35)/0.4):lerp(45,100,(t-0.75)/0.25)):(t<0.35?100:lerp(100,5,clamp((t-0.35)/0.4,0,1))); }
  if(E.scen==="newplants"){ const n=ok?Math.floor(clamp((t-0.45)/0.45,0,1)*6):0; v=n+" plantlet"+(n===1?"":"s"); m=n/6*100; health=100; }
  hud(["Day",Math.round(t*30)+" of 30"],[sc.metric,v],["Health",Math.round(health)+"%"],m);
  $("h3").style.color=health<50?"#C2452D":"";
}
function drawSaved(){
  $("saved").innerHTML="Plants saved: "+Object.keys(SCEN).map(k=>`<span class="pill ${S.ex.saved[k]?"on":""}">${S.ex.saved[k]?"✓ ":""}${SCEN[k].name}</span>`).join("");
}
/* how the plant looks on day t of 30: growth, wilting, yellowing, drying, flopping, regrowth */
function exState(){
  const E=S.ex, t=E.t, ok=success(), st={g:.35,wilt:0,yel:0,dry:0,flop:0,regrow:0,food:.35,bloom:0,climb:false,time:clock,detach:E.detach};
  switch(E.scen){
    case "climb": if(ok){ st.climb=true; st.g=ss(0,1,t); st.bloom=ss(.72,1,t); }
      else if(E.leaf==="spines"||E.leaf==="scale"){ st.g=lerp(.35,.5,t); st.yel=.35*ss(.3,1,t); } // stands, but stays low in the shade
      else { st.g=lerp(.35,.8,ss(0,1,t)); st.flop=ss(.12,.8,t); st.wilt=.25*ss(.4,1,t); st.yel=.35*ss(.3,1,t); } break;
    case "desert": if(ok){ st.g=lerp(.35,.85,ss(0,1,t)); st.bloom=ss(.55,.95,t); }
      else { st.g=lerp(.35,.48,t); st.wilt=ss(.06,.75,t); st.dry=.75*ss(.45,1,t); } break;
    case "hills": if(ok){ st.g=lerp(.35,1,E.fedS); st.yel=lerp(.3,0,E.fedS); } // grows only as it digests insects
      else { st.g=lerp(.35,.48,t); st.yel=lerp(.3,1,ss(0,.9,t)); st.wilt=.3*t; } break;
    case "season": if(seasonHardy()){ // succulents: barely troubled by a dry season (the cactus flowers after the rain)
        st.g=lerp(.35,.55,ss(0,1,t)); st.wilt=.12*ss(.4,.6,t)*(1-ss(.75,.9,t)); st.bloom=ss(.82,1,t); break; }
      st.g=lerp(.35,.8,ss(0,.35,t)); st.wilt=ss(.34,.5,t)*(1-ss(.5,.65,t))*.8; st.dry=ss(.38,.66,t);
      if(ok){ st.food=lerp(.35,1,ss(0,.4,t))-.3*ss(.78,1,t); st.regrow=ss(.77,1,t); } else st.flop=.35*ss(.5,.9,t); break;
    case "newplants": st.g=lerp(.35,.75,ss(0,1,t)); break; }
  if(E.leaf==="scale"&&E.scen!=="season") st.food=lerp(.35,.6,t);
  return st;
}
function exDraw(){
  const E=S.ex, key=exPlantKey(), st=exState(); let s;
  if(ASSETS[key].src){ // a replacement picture: show it, tinted and tipped over as the plant suffers
    const k=clamp(st.wilt+st.dry+st.yel,0,1), im=`x="-200" y="-420" width="400" height="500" href="${src(key)}"`;
    s=`<g transform="rotate(${f1(-75*st.flop)})"><image ${im}/><image ${im} filter="url(#${E.scen==="hills"?"fyellow":"fwilt"})" opacity="${f1(k)}"/></g>`; lastOut={drops:[],mouths:[]}; }
  else { lastOut=PLANT[E.leaf](st); s=lastOut.svg; }
  if(s!==plantG._s){ plantG.innerHTML=s; plantG._s=s; }
  shadow.setAttribute("rx",f1(lerp(40,90,st.g)*(1-.4*st.dry)));
}
function drawFly(g){ g.innerHTML=`<g class="wing"><ellipse cx="-2" cy="-6" rx="7.5" ry="3.2" transform="rotate(-25 -2 -6)" fill="#E6F3FA" fill-opacity=".7" stroke="#9AB0BB" stroke-width=".6"/></g><g class="wing"><ellipse cx="4" cy="-6" rx="7.5" ry="3.2" transform="rotate(25 4 -6)" fill="#E6F3FA" fill-opacity=".7" stroke="#9AB0BB" stroke-width=".6"/></g><path d="M-3 2 l-4 6 M0 3 l0 7 M3 2 l4 6" stroke="#222" stroke-width="1" fill="none"/><ellipse cx="2" cy="0" rx="7" ry="4.3" fill="#2E3438"/><path d="M-1 -3 v6 M3 -3.5 v7" stroke="#4A5359" stroke-width="1.2"/><circle cx="-6" cy="-1" r="3.6" fill="#7A2A1E"/><circle cx="-6.6" cy="-2" r="1.2" fill="#fff" opacity=".5"/>`; }
const FEED_N=6; // insects the pitcher plant needs to reach full size
let pops=[];
function spawnBug(lure){ const g=el("g",{},bugs), right=lure&&Math.random()<.5; drawFly(g);
  bugList.push({g,x:right?1030:-30,y:90+Math.random()*(lure?220:260),vx:(right?-1:1)*(70+Math.random()*40),ph:Math.random()*6,ti:null,sink:0,gone:false}); }
function popAt(x,y){ const n=el("text",{x:f1(x),y:f1(y),"text-anchor":"middle","font-size":17,"font-weight":800,fill:"#2E8B4E",stroke:"#fff","stroke-width":4,"paint-order":"stroke",text:"+ nitrogen"},bugs); pops.push({n,y,life:0}); }
function animBugs(dt,ok){
  const M=(lastOut?lastOut.mouths:[]).map(m=>[BASE[0]+m[0]*PSC,GR+m[1]*PSC]);
  pops=pops.filter(p=>{ p.life+=dt*.8; if(p.life>=1){ p.n.remove(); return false; } p.n.setAttribute("y",f1(p.y-30*p.life)); p.n.setAttribute("opacity",f1(1-p.life*p.life)); return true; });
  bugList.forEach(b=>{ if(b.gone) return; b.ph+=dt*8; let vx=b.vx, vy;
    if(ok&&b.ti==null&&M.length) b.ti=Math.floor(Math.random()*M.length); // lured by the pitchers' nectar
    if(b.ti!=null&&M.length){ const tg=M[b.ti%M.length], dx=tg[0]-b.x, dy=tg[1]-4-b.y, d=Math.hypot(dx,dy);
      if(d<6||b.sink>0){ b.sink+=dt*2.2; vx=0; vy=14; // slips in and is digested: the plant gets its nitrogen
        if(b.sink>=1){ b.gone=true; b.g.remove(); S.ex.caught++; popAt(tg[0],tg[1]-14); return; } }
      else { vx=dx/d*130; vy=dy/d*130+Math.sin(b.ph*1.7)*25; } }
    else { vy=Math.sin(b.ph)*40+Math.cos(b.ph*.37)*20; if(b.x>1040){ b.gone=true; b.g.remove(); return; } }
    b.x+=vx*dt; b.y+=vy*dt;
    b.g.setAttribute("transform",`translate(${f1(b.x)} ${f1(b.y)}) scale(${vx>=0?-1:1} 1) scale(${f1(1-b.sink*.7)})`); b.g.setAttribute("opacity",f1(1-b.sink*.6)); });
}
function sproutM(x,y,g){ const h=lerp(2,26,g), c="#6DBA4F";
  return `<g transform="translate(${f1(x)} ${f1(y)})"><path d="M0 0 q-3 ${f1(7*g)} -7 ${f1(15*g)} M0 0 q2 ${f1(8*g)} 5 ${f1(16*g)} M0 0 l0 ${f1(12*g)}" stroke="#E6DAB9" stroke-width="1.2" fill="none"/><path d="M0 0 Q1 ${f1(-h/2)} 0 ${f1(-h)}" stroke="#4E8A3A" stroke-width="2.2" fill="none"/><g transform="translate(0 ${f1(-h)}) rotate(-58)">${leafM(lerp(4,16,g),lerp(2,6,g),c)}</g><g transform="translate(0 ${f1(-h)}) rotate(58)">${leafM(lerp(4,15,g),lerp(2,6,g),mix(c,"#9FD27A",.2))}</g></g>`; }
const DROP_ID={ordinary:1,tendril:1,spines:"spine",scale:"leaf",pitcher:1,buds:"1L"};
/* No seeds: leaves break off, tumble to the soil, then grow plantlets or rot */
function fallTick(t,ok){
  const E=S.ex;
  if(E.running&&t>.12&&!fallList.length&&lastOut){
    (ok?["1L","1R"]:[DROP_ID[E.leaf]]).forEach((id,i,a)=>{ const d=lastOut.drops.find(x=>x.id===id); if(!d) return;
      E.detach.push(d.id); const dir=a.length>1&&i?1:-1;
      fallList.push({d,dir,X0:BASE[0]+d.x*PSC,Y0:GR+d.y*PSC,X1:dir<0?345:615,g:el("g",{},fallen)}); }); }
  fallList.forEach(f=>{
    const p=clamp((t-.12)/.3,0,1), e=ss(0,1,p), sw=Math.sin(p*Math.PI*2.6)*(1-p);
    const x=lerp(f.X0,f.X1,e)+sw*28, y=lerp(f.Y0,GR+6,Math.pow(p,1.35)), dg=lerp(f.d.deg,f.dir*90,e)+sw*34, sq=lerp(1,.6,ss(.82,1,p));
    const rot=ok||E.leaf==="spines"?0:ss(.45,.95,t), shr=1-.22*rot; // a dry spine just lies there
    let s=`<g transform="translate(${f1(x)} ${f1(y)}) scale(1 ${f1(sq)}) rotate(${f1(dg)}) scale(${f1(PSC*shr)} ${f1(PSC)})"><g opacity="${f1(1-rot*.15)}">${f.d.m}</g>${rot>0?`<g filter="url(#frot)" opacity="${f1(rot)}">${f.d.m}</g>`:""}</g>`;
    if(rot>.3) for(const k of [.3,.5,.7,.85]) s+=`<circle cx="${f1(f.X1+f.dir*k*f.d.L*PSC*shr)}" cy="${GR+3}" r="${f1(1.5+rot*2)}" fill="#E8E4D8" opacity="${f1(rot-.3)}"/>`;
    if(ok) [.38,.62,.86].forEach((k,i)=>{ const gp=ss(.45+i*.1,.8+i*.06,t); if(gp>0) s+=sproutM(f.X1+f.dir*k*f.d.L*PSC,GR+4,gp); });
    if(s!==f.g._s){ f.g.innerHTML=s; f.g._s=s; } });
}
function exTick(dt){
  const E=S.ex, ok=success(); clock+=dt;
  if(E.running) E.t=Math.min(1,E.t+dt/9);
  const t=E.t, shown=E.running||E.done;
  if(E.scen==="desert") glare.setAttribute("opacity",shown?(.16+.1*Math.sin(clock*5)).toFixed(2):0);
  if(E.scen==="season"&&shown){
    const dry=t<.35?0:t<.45?(t-.35)/.1:t<.7?1:t<.8?1-(t-.7)/.1:0;
    seasonTint.setAttribute("opacity",(.4*dry).toFixed(2));
    seasonLabel.setAttribute("display","inline"); seasonText.textContent=t<.35?"Growing season":t<.75?"Dry season":"Rains return";
    const raining=E.running&&t>=.75; rainTick(dt,raining);
    rainSky.setAttribute("opacity",raining?f1(.3*ss(.75,.79,t)):0); wetGround.setAttribute("opacity",f1(.22*ss(.76,.9,t)));
  }
  if(E.scen==="hills"){
    if(E.running){ if(!ok){ if(Math.random()<dt*1.4) spawnBug(false); }
      else if((E.spawnT-=dt)<=0&&t<.72){ spawnBug(true); E.spawnT=.5; } }
    animBugs(dt,ok);
    E.fedS+=(Math.min(1,E.caught/FEED_N)-E.fedS)*Math.min(1,dt*2.5); // each insect digested lets it grow a little more
    if(E.done&&ok) exHud(); }
  if(E.scen==="newplants") fallTick(t,ok);
  idleAcc+=dt; if(E.running||idleAcc>=1/30){ idleAcc=0; exDraw(); }
  if(E.running){ exHud(); if(t>=1){ E.running=false; E.done=true; exFinish(); } }
}
function exFinish(){
  const E=S.ex, sc=SCEN[E.scen], ok=success();
  if(ok){ E.saved[E.scen]=true; drawSaved(); Sound.play("ok"); toast("Saved! "+sc.win,"ok"); }
  else { const o=(FAIL_MSG[E.scen]||{})[E.leaf]; Sound.play("no");
    toast((o||`${LEAVES[E.leaf].does} But this plant needed ${sc.need}. ${sc.fail}`)+" Try another leaf.",E.scen==="season"&&seasonHardy()?"info":"no"); }
  lockEx(false);
}
function segSetChips(id,v){ $(id).querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===v?"true":"false")); }
document.querySelectorAll("#scen button").forEach(b=>b.addEventListener("click",()=>{ if(S.ex.running)return; S.ex.scen=b.dataset.v; exSetup(); }));
document.querySelectorAll("#leafOpt button").forEach(b=>b.addEventListener("click",()=>{ if(S.ex.running)return; S.ex.leaf=b.dataset.v; exSetup(); }));
$("grow").onclick=()=>{ exReset(); S.ex.running=true; $("grow").disabled=true; lockEx(true); };
$("exReset").onclick=()=>exReset();

/* ---------- TRAPS ---------- */
const gTr=el("g",{display:"none"});
const trBg=img("bg_hills",0,0,1000,680,gTr);
const TB={x:270,y:50,w:460,h:460};
const trOpen=img("trap_pitcher_open",TB.x,TB.y,TB.w,TB.h,gTr), trClosed=img("trap_pitcher_closed",TB.x,TB.y,TB.w,TB.h,gTr);
const trLive=el("g",{transform:`translate(${TB.x} ${TB.y}) scale(${TB.w/400})`},gTr);
const trBug=el("g",{},gTr), trBubbles=el("g",{},gTr);
const TRAPS={
  pitcher:{name:"Pitcher plant",short:"Pitcher",the:"the pitcher plant",bg:"bg_hills",medium:"soil",bug:"ant",
    how:"An insect such as an ant sits on the rim of the pitcher, and suddenly the lid closes. Juices at the bottom of the pitcher digest its protein."},
  flytrap:{name:"Venus flytrap",short:"Flytrap",the:"the Venus flytrap",bg:"bg_hills",medium:"soil",bug:"fly",
    how:"The fly touched the long, pointed hairs. The two halves of the leaf closed at the midrib, like a hinge, and trapped it. Digestive juices now digest it."},
  bladder:{name:"Bladderwort",short:"Bladderwort",the:"the bladderwort",bg:"bg_pond",medium:"water",bug:"flea",
    how:"A tiny water animal swam in through the bladder's entry point. The entry closed, so it cannot get out, and it is digested inside."}};
const nitWord=v=>v<35?"Poor":v<70?"Medium":"Rich";
// c = 0 open .. 1 closed; replacement pictures (if set) cross-fade instead
function trDraw(c){
  const custom=!!ASSETS[`trap_${S.tr.plant}_open`].src;
  [trOpen,trClosed].forEach(n=>n.setAttribute("display",custom?"inline":"none"));
  if(custom){ trClosed.setAttribute("opacity",f1(c)); trOpen.setAttribute("opacity",f1(1-c)); trLive.innerHTML=""; }
  else trLive.innerHTML=TRAP_ART[S.tr.plant](c);
}
function trSetup(){
  const T=S.tr, P=TRAPS[T.plant];
  trBg.setAttribute("href",src(P.bg)); trOpen.setAttribute("href",src(`trap_${T.plant}_open`)); trClosed.setAttribute("href",src(`trap_${T.plant}_closed`));
  $("nitLab").textContent=`Nitrates in the ${P.medium}`; trReset();
}
function trReset(){
  const T=S.tr; Object.assign(T,{n:0,busy:false,phase:-1,pt:0,full:false});
  trDraw(0); trBug.innerHTML=""; trBubbles.innerHTML="";
  $("release").disabled=false; toast(""); trHud();
}
function trNitro(){ return Math.min(100,Math.round(S.tr.nit*0.9+S.tr.n*22)); }
function trHud(){
  const T=S.tr, P=TRAPS[T.plant], N=trNitro();
  $("nitO").textContent=nitWord(T.nit); setRangeFill($("nit"));
  hud(["Plant",MODE==="port"?P.short:P.name],["Nitrogen (of need)",N+"%"],["Insects caught",String(T.n)],N);
  $("h2").style.color=N>=100?"#2E8B4E":"";
}
function drawBug(g,kind){
  if(kind==="ant") g.innerHTML=`<g class="legs"><path d="M-4 0 l-7 8 M0 0 l1 9 M4 0 l8 8 M-4 0 l-8 -7 M0 0 l1 -9 M4 0 l8 -7" stroke="#2A1C12" stroke-width="1.5" fill="none" stroke-linecap="round"/></g><path d="M-16 -2 q-6 -8 -12 -6 M-16 2 q-6 8 -12 6" stroke="#2A1C12" stroke-width="1.2" fill="none"/><ellipse cx="-13" cy="0" rx="5" ry="4.2" fill="#3A2618"/><ellipse cx="-3" cy="0" rx="5.5" ry="3.2" fill="#4A3020"/><ellipse cx="11" cy="0" rx="8.5" ry="6" fill="#3A2618"/><ellipse cx="9" cy="-2.5" rx="4" ry="1.8" fill="#fff" opacity=".22"/><ellipse cx="-14" cy="-1.5" rx="1.8" ry="1" fill="#fff" opacity=".25"/>`;
  else if(kind==="fly") drawFly(g);
  else g.innerHTML=`<path d="M-8 -6 l-8 -10 M-8 -6 l-12 -4 M-16 -16 l-4 2 M-16 -16 l2 -5" stroke="#5B8FA8" stroke-width="1.4" fill="none"/><ellipse cx="0" cy="0" rx="10" ry="8" fill="#E9F6FB" fill-opacity=".75" stroke="#5B8FA8" stroke-width="1.5"/><path d="M8 4 q8 6 10 12" stroke="#5B8FA8" stroke-width="1.4" fill="none"/><ellipse cx="2" cy="1" rx="4" ry="3" fill="#C9A86A" opacity=".7"/><circle cx="-6" cy="-3" r="2.6" fill="#1E3A4A"/>`;
}
function trMouth(){ const m=ASSETS[`trap_${S.tr.plant}_open`].mouth; return [TB.x+m[0]*TB.w, TB.y+m[1]*TB.h]; }
// the ant walks along the ground, climbs the outside of the pitcher and steps onto the rim
const ANT_PATH=[[1030,516],[600,516],[562,502],[570,466],[577,418],[566,351],[559,290],[556,240],[557,206],[530,197],[500,193]], ANT_C=walk(ANT_PATH);
let trStart=[0,0];
function trRelease(){
  const T=S.tr; if(T.busy) return; T.busy=true; T.phase=0; T.pt=0; $("release").disabled=true;
  drawBug(trBug,TRAPS[T.plant].bug); trBug.removeAttribute("opacity"); trStart=[-30,140+Math.random()*240];
  toast("");
}
function trTick(dt){
  const T=S.tr; if(!T.busy) return; T.pt+=dt;
  const m=trMouth();
  if(T.phase===0){
    if(TRAPS[T.plant].bug==="ant"){ const p=Math.min(1,T.pt/3.4), q=at(ANT_PATH,ANT_C,p*ANT_C[ANT_C.length-1]);
      trBug.setAttribute("transform",`translate(${f1(q.x)} ${f1(q.y)}) rotate(${f1(deg(q.a)+180)})`); if(p>=1){ T.phase=1; T.pt=0; } }
    else { const p=Math.min(1,T.pt/1.8), x=lerp(trStart[0],m[0],p), y=lerp(trStart[1],m[1],p)+Math.sin(p*14)*14*(1-p);
      trBug.setAttribute("transform",`translate(${f1(x)} ${f1(y)}) scale(-1 1)`); if(p>=1){ T.phase=1; T.pt=0; } } }
  else if(T.phase===1){ const p=Math.min(1,T.pt/.28); trDraw(1-Math.pow(1-p,3)); trBug.setAttribute("opacity",f1(1-p)); // snaps shut
    if(p>=1){ trBug.innerHTML=""; T.phase=2; T.pt=0; T.n++; trHud(); toast(TRAPS[T.plant].how,"info",8000); } }
  else if(T.phase===2){ if(Math.random()<dt*8){ const c=el("circle",{cx:m[0]+(Math.random()-0.5)*40,cy:m[1]+20,r:3+Math.random()*4,fill:"#fff",opacity:.8},trBubbles); setTimeout(()=>c.remove(),700); }
    if(T.pt>1.6){ T.phase=3; T.pt=0; } }
  else if(T.phase===3){ const p=Math.min(1,T.pt/1.1); trDraw(1-ss(0,1,p)); // reopens slowly
    if(p>=1){ T.busy=false; T.phase=-1; $("release").disabled=false; trAfter(); } }
}
function trAfter(){
  const T=S.tr, N=trNitro();
  if(N>=100&&!T.full){ T.full=true;
    toast(T.nit<35?`Enough nitrogen at last! In ${nitWord(T.nit).toLowerCase()} ${TRAPS[T.plant].medium}, ${TRAPS[T.plant].the} needed ${T.n} insects to make up for the missing nitrates.`
      :`Enough nitrogen. With more nitrates in the ${TRAPS[T.plant].medium}, the plant needed fewer insects (${T.n}).`,"ok",9000);
    if(!T.asked){ T.asked=true; setTimeout(trShowQ,1200); } }
}
const TR_Q={q:"Why do insectivorous plants trap insects?",a:1,opts:[
  {t:"To get water",why:"These plants grow in wet places with plenty of water. Think about what is missing from their soil."},
  {t:"To get the nitrogen missing from their soil",why:"Their soil is poor in nitrates, so they digest insects' protein to meet their nitrogen demand."},
  {t:"To get sunlight",why:"Insects don't supply light, and these plants still make food in their green parts. Think about what the soil lacks."},
  {t:"To spread their seeds",why:"Trapped insects are digested, so they cannot carry seeds away. Think about what the plant gains from digesting them."}]};
function trShowQ(){ $("pane-traps").classList.add("asking"); $("trapQ").hidden=false; $("release").disabled=true;
  mcq($("trapQ"),TR_Q,()=>{ setTimeout(()=>{ const fb=$("trapQ").querySelector(".fb"); toast(fb.textContent,fb.classList.contains("ok")?"ok":"info",9000);
    $("trapQ").hidden=true; $("pane-traps").classList.remove("asking"); $("release").disabled=S.tr.busy; },2600); }); }
segInit("trapPick",v=>{ if(S.tr.busy)return; S.tr.plant=v; trSetup(); });
$("nit").addEventListener("input",e=>{ S.tr.nit=+e.target.value; S.tr.full=trNitro()>=100&&S.tr.full; trHud();
  if(S.tr.nit>=70&&S.tr.n===0) toast(`Rich ${TRAPS[S.tr.plant].medium}: the plant already gets most of its nitrogen from the nitrates, so it needs few insects.`,"info",7000); });
$("release").onclick=trRelease;
$("trapReset").onclick=()=>{ S.tr.nit=20; $("nit").value=20; trReset(); };

/* ---------- CHALLENGE ---------- */
const gCh=el("g",{display:"none"});
el("rect",{x:0,y:0,width:1000,height:680,fill:"#EEF6F0"},gCh);
const chImg=el("image",{preserveAspectRatio:"xMidYMid meet"},gCh);
const QS=[
  {img:"plant_tendril",q:"The sweet pea climbs using these thin, coiled parts. What are they?",a:0,opts:[
    {t:"Leaf tendrils",why:"Its upper leaflets are modified into tendrils. They coil round a support and help the weak stem climb."},
    {t:"Roots",why:"Roots grow under the ground and absorb water. These coiled parts are on the shoot, where leaflets would be."},
    {t:"Spines",why:"Spines are stiff and pointed, and they reduce water loss. These parts are soft and coil round things."},
    {t:"Scale leaves",why:"Scale leaves store food or protect buds. These parts wrap round a support instead."}]},
  {img:"plant_spines",q:"Why are the leaves of a cactus modified into spines?",a:1,opts:[
    {t:"To store food",why:"Food is stored in fleshy parts, like onion scale leaves. Think about what is scarce in a desert."},
    {t:"To reduce water loss",why:"Spines have very little surface, so the cactus loses very little water in the dry desert."},
    {t:"To help it climb",why:"A cactus stands on its own and does not climb. Think about what a desert plant must save."},
    {t:"To trap insects",why:"Insect traps are found in plants of nitrate-poor soil. Think about the main problem in a desert."}]},
  {img:"plant_scale",q:"What is the job of the thick, fleshy scale leaves inside an onion?",a:2,opts:[
    {t:"To make food in sunlight",why:"These scale leaves sit inside the bulb, away from the light. Think about why they are so thick."},
    {t:"To help the onion climb",why:"An onion does not climb. Think about why its scale leaves are so thick and juicy."},
    {t:"To store food",why:"The fleshy scale leaves store food, which the onion uses to grow again."},
    {t:"To trap insects",why:"These leaves are tucked inside the bulb. Think about what their thickness is for."}]},
  {img:"plant_scale",q:"Ginger has thin, dry scale leaves. What is their job?",a:0,opts:[
    {t:"To protect the buds",why:"Thin, dry scale leaves cover and protect the buds."},
    {t:"To store water",why:"Thin, dry leaves hold very little water. Think about what they cover."},
    {t:"To make food",why:"They are thin, dry and not green, so they cannot make much food. Think about what they cover."},
    {t:"To trap insects",why:"Nothing about thin, dry scales could catch an insect. Think about what they cover."}]},
  {img:"trap_pitcher_open",q:"In the pitcher plant, which part of the leaf forms the lid?",a:3,opts:[
    {t:"The petiole",why:"In the pitcher plant, the petiole becomes flat and leaf-like and makes food. Look at the other end of the leaf."},
    {t:"The midrib",why:"The midrib runs through the middle of the lamina. Look at which end of the leaf the lid is at."},
    {t:"The axillary bud",why:"A bud grows into a new shoot, not a lid. The lid is part of the leaf itself."},
    {t:"The apex of the leaf",why:"The apex (tip) of the leaf forms the lid, and the lamina forms the pitcher."}]},
  {img:"trap_pitcher_closed",q:"Pitcher plants grow in the Garo and Khasi Hills of Meghalaya. What is missing from the soil there?",a:1,opts:[
    {t:"Water",why:"These hills get plenty of rain. Think about what a plant needs to make proteins."},
    {t:"Nitrates",why:"The soil there is poor in nitrates, so the plant gets nitrogen by digesting the protein in insects."},
    {t:"Sunlight",why:"Sunlight is not found in the soil. Think about a mineral that roots take up."},
    {t:"Oxygen",why:"Roots get oxygen from air spaces in the soil. Think about the mineral needed to make proteins."}]},
  {img:"trap_flytrap_open",q:"When a Venus flytrap leaf snaps shut, what acts like a hinge?",a:2,opts:[
    {t:"The long, pointed hairs",why:"The hairs sense the insect, but they do not fold the leaf. Look at the line between the two halves."},
    {t:"The petiole",why:"The petiole joins the leaf to the stem. Look at the line between the two halves."},
    {t:"The midrib",why:"The leaf has two halves with the midrib between them, and it works like a hinge."},
    {t:"The roots",why:"Roots are in the soil, far from the trap. Look at the line between the two halves of the leaf."}]},
  {img:"plant_buds",q:"How does <i>Bryophyllum</i> make new plants from its leaves?",a:0,opts:[
    {t:"Buds on the leaf margin grow into plantlets",why:"Buds along the margin grow into tiny plantlets when they fall on moist soil."},
    {t:"Its leaves make seeds",why:"Seeds form inside fruits, not on leaves. Look closely at the notches on the leaf margin."},
    {t:"Its spines take root",why:"<i>Bryophyllum</i> leaves have no spines. Look closely at the notches on the leaf margin."},
    {t:"Its tendrils grow into stems",why:"<i>Bryophyllum</i> has no tendrils. Look closely at the notches on the leaf margin."}]}
];
function chShow(){
  const q=QS[S.ch.i], tall=q.img.startsWith("plant");
  const b=tall?{x:280,y:15,w:440,h:550}:{x:240,y:40,w:520,h:520};
  chImg.setAttribute("x",b.x); chImg.setAttribute("y",b.y); chImg.setAttribute("width",b.w); chImg.setAttribute("height",b.h); chImg.setAttribute("href",src(q.img));
  $("taskNo").textContent=`Question ${S.ch.i+1} of ${QS.length}`;
  ["chCard","mcqBox"].forEach(id=>$(id).hidden=false); ["chNav","endCard","endNav"].forEach(id=>$(id).hidden=true); toast("");
  hud(["Question",`${S.ch.i+1} of ${QS.length}`],["Stars",`★ ${S.ch.stars}`],["First-try rule","1 star each"]);
  mcq($("mcqBox"),q,first=>{ if(first&&!S.ch.got[S.ch.i]){S.ch.got[S.ch.i]=true;S.ch.stars++;}
    $("score").textContent=`★ ${S.ch.stars} / ${QS.length}`; hud(["Question",`${S.ch.i+1} of ${QS.length}`],["Stars",`★ ${S.ch.stars}`],["First-try rule","1 star each"]);
    $("taskNext").textContent=S.ch.i===QS.length-1?"See my score":"Next question"; $("chNav").hidden=false; });
}
function chEnd(){
  chImg.setAttribute("href",""); ["chCard","mcqBox","chNav"].forEach(id=>$(id).hidden=true); $("endCard").hidden=false; $("endNav").hidden=false;
  const s=S.ch.stars,n=QS.length; $("endStars").textContent=`★ ${s} / ${n}`;
  $("endText").textContent=s===n?"Perfect score! Every plant is safe with you.":s>=5?"Well done. Go back to Explore or Traps to check the ideas you missed.":"Try Explore and Traps again, then play again.";
  hud(["Questions","Finished"],["Stars",`★ ${s} / ${n}`],["",""]);
}
function chStart(){ Object.assign(S.ch,{i:0,stars:0,got:{}}); $("score").textContent=`★ 0 / ${QS.length}`; chShow(); }
$("taskNext").onclick=()=>{ S.ch.i++; if(S.ch.i>=QS.length) chEnd(); else chShow(); };
$("again").onclick=chStart;

/* ---------- controls ---------- */
function setRangeFill(inp){ inp.style.setProperty("--p",((inp.value-inp.min)/(inp.max-inp.min)*100)+"%"); }
function segInit(id,cb){ const box=$(id); box.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ if(b.disabled)return; segSet(id,b.dataset.v); cb(b.dataset.v); })); }
function segSet(id,v){ $(id).querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===v?"true":"false")); }
$("toast").addEventListener("click",e=>{ if(!$("toast").querySelector(".x")||e.target.closest(".x")) $("toast").hidden=true; });

function setTab(tab){
  S.tab=tab; toast(""); S.ex.running=false;
  document.querySelectorAll("#tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===tab?"true":"false"));
  ["explore","traps","challenge"].forEach(t=>$("pane-"+t).classList.toggle("on",t===tab));
  gEx.setAttribute("display",tab==="explore"?"inline":"none"); gTr.setAttribute("display",tab==="traps"?"inline":"none"); gCh.setAttribute("display",tab==="challenge"?"inline":"none");
  $("score").hidden=tab!=="challenge";
  if(tab==="explore") exSetup(); else if(tab==="traps"){ if(S.tr.busy){S.tr.busy=false;} trSetup(); } else chStart();
  maybeTour(tab);
}
document.querySelectorAll("#tabs button").forEach(b=>b.addEventListener("click",()=>{ if(!tourOn) setTab(b.dataset.tab); }));

/* ---------- HOW TO USE: guided tour ---------- */
const TOURS={
  explore:[
    {s:"#soundBtn",t:"Welcome to Help the Plant Survive",x:"Plants change their leaves to solve problems. This quick tour takes under a minute. Sound plays for right and wrong answers; tap this speaker button to turn it off or on.",g:"tap"},
    {s:"#tabs",t:"Three parts, in order",x:"Start with Explore, then Traps, then Challenge. Tap a tab to move between them.",g:"tap"},
    {s:"#scen",t:"Choose a problem",x:"Each plant has a problem: a weak stem, a hot desert, poor soil, a dry season, or no seeds.",g:"tap"},
    {s:"#leafOpt",t:"Give the plant a leaf",x:"Pick the leaf modification you think will solve the problem.",g:"tap"},
    {s:"#grow",t:"Grow for 30 days",x:"Watch 30 days pass in a few seconds. You'll see whether your plant survives, and why.",g:"tap"},
    {s:"#hud",t:"Watch the plant",x:"These boxes show the day, what the plant needs most, and its health."},
    {s:"#saved",t:"Save all five plants",x:"Each plant you save is ticked here. Try wrong leaves too, to see what goes wrong."},
    {s:"#helpBtn",t:"See this again any time",x:"Tap Help (?) to replay the tour for the part you are on.",g:"tap"}],
  traps:[
    {s:"#trapPick",t:"Pick an insect-eating plant",x:"Choose the pitcher plant, Venus flytrap or bladderwort.",g:"tap"},
    {s:"#nit",t:"Set the nitrates",x:"Drag to make the soil (or water) poor or rich in nitrates.",g:"drag"},
    {s:"#release",t:"Release an insect",x:"Watch how the leaf traps it. Each insect adds nitrogen. How many does the plant need?",g:"tap"},
    {s:"#hud",t:"Nitrogen meter",x:"Shows how much of its nitrogen need the plant has met."}],
  challenge:[
    {s:"#chCard",t:"Eight questions",x:"Look at the picture and answer each question."},
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
  if(st.g){ const hr=st.h?rectIn(document.querySelector(st.h)):r; hand.style.left=(hr.x+hr.w/2-6)+"px"; hand.style.top=(hr.y+hr.h/2+4)+"px"; }
}
$("tNext").onclick=()=>{ if(tourI<tourSteps.length-1){tourI++;placeTour();} else endTour(); };
$("tBack").onclick=()=>{ if(tourI>0){tourI--;placeTour();} };
$("tskip").onclick=endTour;
$("soundBtn").onclick=()=>{ Sound.set(!Sound.on); storeSet("tce-c6bio-sound",Sound.on?"on":"off"); if(Sound.on){Sound.ensure();Sound.play("ok");} };
Sound.set(storeGet("tce-c6bio-sound")!=="off");
$("helpBtn").onclick=()=>{ if(!tourOn) startTour(S.tab); };
document.addEventListener("keydown",e=>{ if(!tourOn)return; if(e.key==="Escape")endTour(); if(e.key==="ArrowRight")$("tNext").click(); if(e.key==="ArrowLeft")$("tBack").click(); });



/* ---------- loop + start ---------- */
let last=performance.now();
function loop(now){ const dt=Math.min(0.05,(now-last)/1000); last=now;
  if(!tourOn){ if(S.tab==="explore") exTick(dt); else if(S.tab==="traps") trTick(dt); }
  requestAnimationFrame(loop); }
fit(); setTab("explore");
requestAnimationFrame(loop);
