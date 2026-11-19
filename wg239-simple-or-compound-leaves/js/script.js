/* =====================================================================
   REPLACEABLE ASSETS  (Simple or Compound?)
   Set "src" to a data URI (data:image/png;base64,...) or a relative path.
   Leave src "" to use the built-in drawing.
   twig_* cards: 400 x 400, stem on the left, node at (70,300).  bud [x,y] = axillary bud, as fractions.
   leaf_* / skel_*: 400 x 600, leaf upright, petiole at the bottom centre.
     leaf_* = whole green leaf; skel_* = veins only (skeleton leaf) on a transparent background.
   The Explore leaf is drawn by code because it changes shape as the slider moves.
   ===================================================================== */
const ASSETS = {
  background:      { src: "", frame: [1000, 680] },
  twig_mango:      { src: "", frame: [400, 400], bud: [0.215, 0.70] },
  twig_rose:       { src: "", frame: [400, 400], bud: [0.215, 0.70] },
  twig_banyan:     { src: "", frame: [400, 400], bud: [0.215, 0.70] },
  twig_silkcotton: { src: "", frame: [400, 400], bud: [0.215, 0.70] },
  twig_poppy:      { src: "", frame: [400, 400], bud: [0.215, 0.70] },
  twig_neem:       { src: "", frame: [400, 400], bud: [0.215, 0.70] },
  leaf_peepal:  { src: "", frame: [400, 600] }, skel_peepal: { src: "", frame: [400, 600] },
  leaf_mango:   { src: "", frame: [400, 600] }, skel_mango:  { src: "", frame: [400, 600] },
  leaf_banana:  { src: "", frame: [400, 600] }, skel_banana: { src: "", frame: [400, 600] },
  leaf_maize:   { src: "", frame: [400, 600] }, skel_maize:  { src: "", frame: [400, 600] },
  leaf_guava:   { src: "", frame: [400, 600] },
  leaf_grass:   { src: "", frame: [400, 600] }
};

/* ---------- leaf drawing engine (builds the default art) ---------- */
function rng(seed){ return function(){ seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
const SHAPES={
  lance:t=>Math.pow(t,0.55)*Math.pow(1-t,0.85),
  oval:t=>Math.pow(t,0.7)*Math.pow(1-t,0.6),
  ellipse:t=>Math.pow(t,0.6)*Math.pow(1-t,0.42),
  heart:t=>Math.pow(t,0.5)*Math.pow(1-t,1.55)*(1+0.35*Math.exp(-t*10)),
  oblong:t=>Math.pow(Math.min(1,t/0.08),0.5)*Math.pow(Math.min(1,(1-t)/0.12),0.6),
  strap:t=>Math.pow(t,0.12)*Math.pow(1-t,0.9),
  leaflet:t=>Math.pow(t,0.5)*Math.pow(1-t,0.7),
  ell:t=>Math.sqrt(Math.max(0,1-(2*t-1)*(2*t-1))),
  // peepal: broad ovate blade, cordate base, long drip tip
  peepal:t=>{ const b=Math.pow(t,0.55)*Math.pow(Math.max(0,1-t/0.8),1.05), c=0.075*Math.pow(1-t,1.1)*Math.min(1,t/0.5); return Math.sqrt(b*b+c*c); }
};
const NORM={}; for(const k in SHAPES){ let m=0; for(let i=1;i<400;i++) m=Math.max(m,SHAPES[k](i/400)); NORM[k]=m; }
const hw=(s,t)=>SHAPES[s](Math.min(1,Math.max(0,t)))/NORM[s];
const f1=n=>n.toFixed(1);
const fp=p=>f1(p[0])+" "+f1(p[1]);
/* leaf geometry: base at (0,0), tip at (0,-L). P(t,f,side) = point at height t, fraction f of the half-width.
   cord pulls the basal margin down into heart-shaped lobes. */
function mkGeo(shape,L,W,cord){
  const half=t=>W*hw(shape,t), dip=t=>cord&&t>0&&t<0.3?cord*L*Math.pow(Math.sin(Math.PI*t/0.3),1.2):0;
  return {L,W,half,P:(t,f,s)=>[s*f*half(t),-t*L+f*f*dip(t)]};
}
function bladePts(shape,L,W,serr,cord,wave){
  const g=mkGeo(shape,L,W,cord), N=90, R=[];
  for(let i=0;i<=N;i++){ const t=i/N; let w=g.half(t);
    if(serr){ const fr=(t*serr)%1; w*=1-0.1*(1-fr)*Math.min(1,t*6)*Math.min(1,(1-t)*6); }
    if(wave) w*=1+wave*Math.sin(t*Math.PI*23)*Math.min(1,t*5);
    R.push([w,g.P(t,1,1)[1]]); }
  return R;
}
function bladePath(shape,L,W,serr,cord,wave){
  const R=bladePts(shape,L,W,serr,cord,wave);
  return "M"+[...R,...R.slice().reverse().map(p=>[-p[0],p[1]])].map(fp).join(" L")+"Z";
}
/* one half of the blade, used as a soft shadow so the leaf reads as folded along the midrib */
function bladeHalf(shape,L,W,serr,cord,wave){
  const R=bladePts(shape,L,W,serr,cord,wave);
  return "M0 0 L"+R.map(fp).join(" L")+` L0 ${f1(-L)}Z`;
}
/* Reticulate (net) venation, pinnate and brochidodromous, as in peepal, mango, guava:
   tapering midrib -> secondary veins that arch towards the margin and loop into the next one ->
   cross-linking tertiary veins -> fine veinlets that close the net into small areoles (with free endings). */
function veinsNet(g,o){
  const r=rng(o.seed||1), L=g.L, wm=o.wm, top=o.top||0.97, D={s:"",l:"",t:"",q:""};
  const bz=(a,b,c,d,u)=>{const v=1-u;return [v*v*v*a[0]+3*v*v*u*b[0]+3*v*u*u*c[0]+u*u*u*d[0], v*v*v*a[1]+3*v*v*u*b[1]+3*v*u*u*c[1]+u*u*u*d[1]];};
  const qz=(a,c,b,u)=>{const v=1-u;return [v*v*a[0]+2*v*u*c[0]+u*u*b[0], v*v*a[1]+2*v*u*c[1]+u*u*b[1]];};
  const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  const near=(poly,p)=>{let bi=0,bd=1e9;poly.forEach((q,i)=>{const d=dist(q,p);if(d<bd){bd=d;bi=i;}});return poly[bi];};
  const list=(o.basal||[]).map(b=>({tA:b[0],tB:b[1],ang:b[2],reach:b[3],bEnd:b[4],basal:1}));
  const step=(o.te-o.ts)/Math.max(1,o.n-1);
  for(let j=0;j<o.n;j++){ const tA=o.ts+step*j; list.push({tA,tB:Math.min(0.975,tA+o.rise*(1-0.35*tA)),ang:o.ang+o.n*0.6-j*1.2,reach:o.reach}); }
  for(const s of [1,-1]){
    const secs=list.map(c=>{
      const sh=c.basal?0:(s<0?step*0.3:0)+(r()-0.5)*step*0.15;
      const tA=c.tA+sh, a=rad(Math.min(95,c.ang+(r()-0.5)*5));
      let tB=c.tB;
      if(!c.basal){ // run nearly straight along the starting angle until close to the margin
        const A=rad(c.ang+6); tB=tA;
        while(tB<0.975){ tB+=0.003; if((tB-tA)*L*Math.tan(A)>=c.reach*g.half(tB)) break; } }
      const O=[0,-tA*L], E=g.P(tB,c.reach,s), len=dist(O,E), b=rad(c.bEnd||(c.basal?c.ang*0.45:26));
      const C1=[s*Math.sin(a)*len*0.42, O[1]-Math.cos(a)*len*0.42], C2=[E[0]-s*Math.sin(b)*len*0.32, E[1]+Math.cos(b)*len*0.32];
      const poly=[]; for(let i=0;i<=24;i++) poly.push(bz(O,C1,C2,E,i/24));
      D.s+=`M${fp(O)}C${fp(C1)} ${fp(C2)} ${fp(E)}`;
      return {poly,E,C2,tA,tB};
    });
    secs.forEach((c,j)=>{
      const nx=secs[j+1];
      // the band above this secondary is closed by the next secondary, or by the midrib near the apex
      let up=nx?nx.poly:null, J;
      if(nx) J=nx.poly[19];
      else { const tT=Math.min(top,c.tB+0.1); J=g.P(tT,0.12,s); up=[]; for(let i=0;i<=24;i++) up.push([0,-(c.tA+(top-c.tA)*i/24)*L]); }
      // loop: the secondary arches up along the margin and joins the next one
      const tm=-(c.E[1]+J[1])/2/L, dl=dist(c.E,J)*0.5, ctl=[c.E[0]+(c.E[0]-c.C2[0])/(dist(c.E,c.C2)||1)*dl, c.E[1]+(c.E[1]-c.C2[1])/(dist(c.E,c.C2)||1)*dl];
      const lim=g.P(-ctl[1]/L,0.97,s); if(Math.abs(ctl[0])>Math.abs(lim[0])) ctl[0]=lim[0];
      D.l+=`M${fp(c.E)}Q${fp(ctl)} ${fp(J)}`;
      // small marginal loops outside the main loop
      const A=qz(c.E,ctl,J,0.18), B=qz(c.E,ctl,J,0.82), mc=g.P(tm,0.985,s);
      if(dist(A,B)>8) D.t+=`M${fp(A)}Q${fp(mc)} ${fp(B)}`;
      if(!o.tsp) return;
      // tertiary veins crossing the band between the two secondaries
      const len=c.poly.reduce((a,p,i)=>i?a+dist(p,c.poly[i-1]):0,0), m=Math.max(1,Math.round(len/o.tsp)), T=[];
      for(let k=1;k<=m;k++){
        const Pp=c.poly[Math.round(((k-0.5)/m*0.9+0.04+(r()-0.5)*0.03)*24)], Q=near(up,Pp), d=dist(Pp,Q);
        if(d<3) continue;
        const w=(r()-0.5)*d*0.35, mid=[(Pp[0]+Q[0])/2-(Q[1]-Pp[1])/d*w,(Pp[1]+Q[1])/2+(Q[0]-Pp[0])/d*w];
        D.t+=`M${fp(Pp)}Q${fp(mid)} ${fp(Q)}`; T.push([Pp,mid,Q]);
      }
      // veinlets join neighbouring tertiaries into a net of small areoles; some end freely
      for(let k=0;k<T.length-1;k++) for(let q=0;q<(o.quat||0);q++){
        const v=0.15+0.7*r(), a=qz(...T[k],v), b=qz(...T[k+1],Math.min(0.92,Math.max(0.08,v+(r()-0.5)*0.3))), d=dist(a,b);
        if(d<2) continue;
        const mid=[(a[0]+b[0])/2+(r()-0.5)*d*0.3,(a[1]+b[1])/2+(r()-0.5)*d*0.3];
        D.q+=`M${fp(a)}Q${fp(mid)} ${fp(b)}`;
        const an=r()*Math.PI*2, fl=d*(0.25+0.2*r());
        D.q+=`M${fp(mid)}l${f1(Math.cos(an)*fl)} ${f1(Math.sin(an)*fl)}`;
      }
    });
  }
  if(o.lobe) for(const s of [1,-1]){ // veins into the heart-shaped basal lobes
    const M=g.P(0.1,1,s), A=[0,-0.012*L], B=[M[0]*0.82,M[1]-0.018*L], C=[M[0]*0.35,-0.02*L]; D.l+=`M${fp(A)}Q${fp(C)} ${fp(B)}`;
    for(const u of [0.35,0.65]){ const p=[A[0]*(1-u)*(1-u)+2*u*(1-u)*C[0]+u*u*B[0], A[1]*(1-u)*(1-u)+2*u*(1-u)*C[1]+u*u*B[1]];
      const e=g.P(0.15+u*0.08,1,s), e2=[e[0]*0.93,e[1]+0.01*L]; D.t+=`M${fp(p)}Q${f1((p[0]+e2[0])/2)} ${f1(p[1]-0.01*L)} ${fp(e2)}`; } }
  // tapering midrib
  const mw=t=>wm*0.5*(1-0.85*t/top)+0.3, R=[], N=30;
  for(let i=0;i<=N;i++){ const t=top*i/N; R.push([mw(t),-t*L]); }
  const mid="M"+[...R,...R.slice().reverse().map(p=>[-p[0],p[1]])].map(fp).join(" L")+"Z";
  const layer=(col,k)=>`<g fill="none" stroke="${col}" stroke-linecap="round" stroke-linejoin="round">`+
    (D.q?`<path d="${D.q}" stroke-width="${f1(wm*0.13)}" opacity="${0.5*k}"/>`:"")+
    `<path d="${D.t}" stroke-width="${f1(wm*0.2)}" opacity="${Math.min(1,0.7*k)}"/><path d="${D.l}" stroke-width="${f1(wm*0.3)}" opacity="${Math.min(1,0.9*k)}"/>`+
    `<path d="${D.s}" stroke-width="${f1(wm*0.42)}"/></g><path d="${mid}" fill="${col}"/>`;
  const shade=o.shade?`<g transform="translate(.7 .9)" opacity=".2">${layer(o.shade,1)}</g>`:"";
  return shade+layer(o.col,o.skel?1.4:1);
}
/* Parallel venation running across the blade (banana): a thick midrib with many fine veins
   leaving it side by side and running, unbranched, to the margin. */
function veinsParLat(g,o){
  const L=g.L, wm=o.wm; let big="", fine="", i=0;
  const mw=t=>wm*1.7*(1-0.8*t)+0.8;
  for(let t=0.022;t<0.968;t+=0.0052,i++) for(const s of [1,-1]){
    const h=g.half(t), O=[s*mw(t)*0.9,-t*L], E=g.P(Math.min(0.995,t+0.028+0.02*(1-t)),0.993,s);
    const d=`M${fp(O)}C${f1(O[0]+s*h*0.12)} ${f1(O[1]-0.02*L)} ${f1(E[0]-s*h*0.4)} ${f1(E[1]+0.003*L)} ${fp(E)}`;
    if(i%5===0) big+=d; else fine+=d; }
  const R=[]; for(let j=0;j<=30;j++){ const t=0.985*j/30; R.push([mw(t),-t*L]); }
  const mid="M"+[...R,...R.slice().reverse().map(p=>[-p[0],p[1]])].map(fp).join(" L")+"Z";
  return `<g fill="none" stroke="${o.col}" stroke-linecap="round"><path d="${fine}" stroke-width="${f1(wm*0.13)}" opacity="${o.skel?0.9:0.55}"/><path d="${big}" stroke-width="${f1(wm*0.24)}" opacity="${o.skel?1:0.85}"/></g>`+
    `<path d="${mid}" fill="${o.mcol||o.col}" stroke="${o.col}" stroke-width="${f1(wm*0.25)}"/>`;
}
/* Parallel venation running along the blade (maize, grass): veins of three sizes run from the base
   to the tip side by side, converging at the apex, with a broad pale midrib. */
function veinsParLong(g,o){
  const L=g.L, k=o.k, wm=o.wm, S=["","",""];
  const mw=t=>Math.max(0,o.mid*g.W*(1-t/0.9));
  for(let j=1;j<=k;j++) for(const s of [1,-1]){ const fr=j/(k+0.7), pts=[];
    for(let t=0;t<=0.985;t+=0.0175){ const h=g.half(t)*0.97, m=Math.min(mw(t),h*0.6); pts.push([s*(m+fr*(h-m)),-t*L]); }
    pts.push([0,-0.99*L]);
    S[j%3===0?0:j%3===1?2:1]+="M"+pts.map(fp).join(" L"); }
  const R=[]; for(let j=0;j<=30;j++){ const t=0.9*j/30; R.push([Math.min(mw(t),g.half(t)*0.6),-t*L]); }
  const mid="M"+[...R,...R.slice().reverse().map(p=>[-p[0],p[1]])].map(fp).join(" L")+"Z";
  return `<path d="${mid}" fill="${o.mcol||o.col}" opacity="${o.skel?0.5:0.75}"/><g fill="none" stroke="${o.col}" stroke-linejoin="round">`+
    `<path d="${S[2]}" stroke-width="${f1(wm*0.12)}" opacity="${o.skel?0.85:0.5}"/><path d="${S[1]}" stroke-width="${f1(wm*0.2)}" opacity="${o.skel?0.95:0.7}"/><path d="${S[0]}" stroke-width="${f1(wm*0.3)}"/>`+
    `<path d="M0 0 L0 ${f1(-0.97*L)}" stroke-width="${f1(wm*0.45)}"/></g>`;
}
const LEAF_SPECS={
  peepal:{shape:"peepal",L:470,W:172,cord:0.14,vein:"ret",pet:40,lift:40,fill:"#3FA34D",
    net:{n:7,ts:0.1,te:0.58,ang:50,reach:0.88,basal:[[0.016,0.18,80,0.9]],lobe:1,tsp:14,quat:2,top:0.985,seed:7}},
  mango:{shape:"lance",L:470,W:82,vein:"ret",pet:40,fill:"#2F8F45",
    net:{n:15,ts:0.05,te:0.88,rise:0.075,ang:58,reach:0.9,tsp:9,quat:1,seed:11}},
  guava:{shape:"oval",L:380,W:125,vein:"ret",pet:30,fill:"#58A85A",
    net:{n:11,ts:0.06,te:0.85,rise:0.08,ang:64,reach:0.9,tsp:9,quat:1,seed:23}},
  banana:{shape:"oblong",L:500,W:150,vein:"plat",pet:40,fill:"#56A84A"},
  maize:{shape:"strap",L:520,W:44,vein:"plong",pet:30,fill:"#4E9E46",k:9,mid:0.17,wave:0.02,sheath:1},
  grass:{shape:"strap",L:520,W:22,vein:"plong",pet:24,fill:"#5DAE4F",k:4,mid:0.1,sheath:1}
};
function leafVeins(sp,g,o){
  return sp.vein==="ret"?veinsNet(g,Object.assign({},sp.net,o)):sp.vein==="plat"?veinsParLat(g,o):veinsParLong(g,Object.assign({k:sp.k,mid:sp.mid},o));
}
/* ---------- realistic 3D look: light from the top left, waxy sheen, fine surface grain, soft cast shadow ---------- */
function leafFx(id,blur,surf,shadow){
  return `<filter id="${id}" x="-12%" y="-12%" width="130%" height="130%" color-interpolation-filters="sRGB">
<feGaussianBlur in="SourceAlpha" stdDeviation="${blur}" result="b"/>
<feDiffuseLighting in="b" surfaceScale="${surf}" diffuseConstant="1.5" lighting-color="#fff" result="d"><feDistantLight azimuth="225" elevation="42"/></feDiffuseLighting>
<feComposite in="SourceGraphic" in2="d" operator="arithmetic" k1="1" result="lit"/>
<feSpecularLighting in="b" surfaceScale="${surf}" specularConstant=".85" specularExponent="26" lighting-color="#F4FFE2" result="s"><feDistantLight azimuth="225" elevation="42"/></feSpecularLighting>
<feComposite in="s" in2="SourceAlpha" operator="in" result="s2"/>
<feComposite in="lit" in2="s2" operator="arithmetic" k2="1" k3=".6" result="sh"/>
<feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="4" result="n"/>
<feColorMatrix in="n" type="matrix" values=".18 0 0 0 .87  .18 0 0 0 .87  .18 0 0 0 .87  0 0 0 0 1" result="gr"/>
<feComposite in="sh" in2="gr" operator="arithmetic" k1="1" result="tx"/>
<feComposite in="tx" in2="SourceAlpha" operator="in" result="body"/>
<feGaussianBlur in="SourceAlpha" stdDeviation="${shadow*0.8}" result="sb"/><feOffset in="sb" dx="${shadow*0.7}" dy="${shadow*1.2}" result="so"/>
<feFlood flood-color="#0E2A17" flood-opacity=".34"/><feComposite in2="so" operator="in" result="shd"/>
<feMerge><feMergeNode in="shd"/><feMergeNode in="body"/></feMerge></filter>`;
}
function fxDefs(){
  return leafFx("lf",5,4,8)+leafFx("skf",1.6,2,5)+
    `<filter id="soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>`+
    `<filter id="lbl" x="-20%" y="-40%" width="140%" height="200%"><feDropShadow dx="0" dy="2" stdDeviation="2.4" flood-color="#0B2A18" flood-opacity=".28"/></filter>`;
}
/* round green stem: shaded like a cylinder, with a soft cast shadow, a sheen and fine ridges */
function stemSVG(d,x0,w,id){
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${x0-w*0.55}" y1="0" x2="${x0+w*0.55}" y2="0">
<stop offset="0" stop-color="#2C3F18"/><stop offset=".18" stop-color="#52702C"/><stop offset=".38" stop-color="#8FB05C"/><stop offset=".5" stop-color="#A4C374"/><stop offset=".7" stop-color="#5D7B34"/><stop offset="1" stop-color="#263614"/></linearGradient>
<path d="${d}" transform="translate(${f1(w*0.35)} ${f1(w*0.15)})" stroke="#0E2A17" stroke-opacity=".3" stroke-width="${w}" fill="none" filter="url(#soft)"/>
<path d="${d}" stroke="url(#${id})" stroke-width="${w}" fill="none"/>
<path d="${d}" transform="translate(${f1(-w*0.26)} 0)" stroke="#3E5622" stroke-opacity=".25" stroke-width="${f1(w*0.05)}" fill="none"/>
<path d="${d}" transform="translate(${f1(w*0.24)} 0)" stroke="#2C3F18" stroke-opacity=".3" stroke-width="${f1(w*0.05)}" fill="none"/>
<path d="${d}" transform="translate(${f1(-w*0.09)} 0)" stroke="#F0FBD8" stroke-opacity=".32" stroke-width="${f1(w*0.1)}" fill="none"/>`;
}
/* the slight swelling of the stem at the node */
function nodeSVG(x,y,w,id){
  return `<radialGradient id="${id}" cx=".4" cy=".3" r=".75"><stop offset="0" stop-color="#B2CC84"/><stop offset=".55" stop-color="#617E38"/><stop offset="1" stop-color="#33471C"/></radialGradient>
<ellipse cx="${x}" cy="${y}" rx="${f1(w*0.64)}" ry="${f1(w*0.27)}" fill="url(#${id})"/>`;
}
/* axillary bud: a plump, glossy bud wrapped in scale leaves */
function budSVG(x,y,s,rot,id){
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">
<radialGradient id="${id}" cx=".34" cy=".28" r=".85"><stop offset="0" stop-color="#E6F8B4"/><stop offset=".42" stop-color="#9BCB50"/><stop offset="1" stop-color="#3C6620"/></radialGradient>
<radialGradient id="${id}b" cx=".7" cy=".3" r=".9"><stop offset="0" stop-color="#C9E88C"/><stop offset="1" stop-color="#4A7A27"/></radialGradient>
<ellipse cx="4" cy="4" rx="10" ry="15" fill="#0E2A17" opacity=".35" filter="url(#soft)"/>
<path d="M0 -18 C7 -11 10.5 -2 9.5 6 C8.5 13 4.5 16.5 0 16.5 C-4.5 16.5 -8.5 13 -9.5 6 C-10.5 -2 -7 -11 0 -18Z" fill="url(#${id})" stroke="#365C1C" stroke-width="1"/>
<path d="M0 -18 C5 -9 6.5 4 1.5 16.4 C5 16 8.5 13 9.5 6 C10.5 -2 7 -11 0 -18Z" fill="url(#${id}b)" opacity=".9"/>
<path d="M0 -18 C5 -9 6.5 4 1.5 16.4" fill="none" stroke="#365C1C" stroke-width="1.1" opacity=".75"/>
<path d="M-9.4 8 C-5 4.5 4 4.5 9.4 8 C8 13.5 4 16.5 0 16.5 C-4 16.5 -8 13.5 -9.4 8Z" fill="#5E8A32" opacity=".85"/>
<ellipse cx="-4" cy="-4" rx="2.2" ry="6" transform="rotate(14 -4 -4)" fill="#fff" opacity=".55"/></g>`;
}
/* petiole / stalk: a dark rounded stalk with a lit edge (the stalk points up from 0,0) */
function stalkSVG(len,w){
  if(len<=0) return "";
  return `<path d="M0 0 L0 ${-len}" stroke="#2B5B28" stroke-width="${w}" stroke-linecap="round"/>`+
    `<path d="M${f1(-w*0.14)} -1 L${f1(-w*0.14)} ${-len+1}" stroke="#5E9A45" stroke-width="${f1(w*0.5)}" stroke-linecap="round"/>`+
    `<path d="M${f1(-w*0.26)} -2 L${f1(-w*0.26)} ${-len+2}" stroke="#D4F0AA" stroke-width="${f1(w*0.13)}" stroke-linecap="round" opacity=".7"/>`;
}
function leafArt(name,skeleton){
  const sp=LEAF_SPECS[name], g=mkGeo(sp.shape,sp.L,sp.W,sp.cord), blade=bladePath(sp.shape,sp.L,sp.W,0,sp.cord,sp.wave);
  const stalkCol=skeleton?"#A87A40":"#2F6A2F", pw=sp.vein==="plat"?6:4.5;
  const stalk=sp.sheath
    ? `<path d="M${f1(-sp.W*0.42)} ${sp.pet} L${f1(-sp.W*0.3)} 0 L${f1(sp.W*0.3)} 0 L${f1(sp.W*0.42)} ${sp.pet}Z" fill="${skeleton?"#E2CFA8":"#6FAE55"}" stroke="${stalkCol}" stroke-width="1.5"/><path d="M${f1(-sp.W*0.3)} 0 L${f1(sp.W*0.3)} 0" stroke="${skeleton?"#C9A36A":"#E4F2C8"}" stroke-width="3" stroke-linecap="round"/>`
    : `<path d="M-${pw} ${sp.pet} Q-2.6 ${sp.pet*0.5} -2.4 0 L2.4 0 Q2.6 ${sp.pet*0.5} ${pw} ${sp.pet}Z" fill="${stalkCol}"/>`+
      `<path d="M${f1(-pw*0.35)} ${sp.pet-1} Q-1.2 ${sp.pet*0.5} -1 1" stroke="${skeleton?"#E3C792":"#9FD27A"}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".8"/>`;
  const body = skeleton
    ? `<g filter="url(#skf)">${stalk}<path d="${blade}" fill="#EAD7AE" fill-opacity=".3"/>`+
      `<path d="${blade}" fill="none" stroke="#9C6B30" stroke-width="1.6" opacity=".85"/>`+
      leafVeins(sp,g,{col:"#9C6B30",mcol:"#C2925A",wm:5.5,skel:1})+`</g>`
    : `<g filter="url(#lf)">${stalk}<path d="${blade}" fill="${sp.fill}"/>`+
      `<path d="${blade}" fill="url(#sheen)"/>`+
      `<path d="${bladeHalf(sp.shape,sp.L,sp.W,0,sp.cord,sp.wave)}" fill="#0B3A1E" opacity=".16"/>`+
      leafVeins(sp,g,{col:"#D6F0B8",mcol:"#C9E6A4",wm:4.6,shade:"#14472A"})+
      `<path d="${blade}" fill="none" stroke="#1D5530" stroke-width="1.5"/></g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><defs>${fxDefs()}<linearGradient id="sheen" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#EAF7B0" stop-opacity=".28"/><stop offset=".45" stop-color="#EAF7B0" stop-opacity="0"/><stop offset="1" stop-color="#0B3A1E" stop-opacity=".18"/></linearGradient></defs><g transform="translate(200 ${560-(sp.pet-40)-(sp.lift||0)})">${body}</g></svg>`;
}

/* compound and lobed leaf geometry (shared by the Explore morph and the cards) */
function smoothPath(pts,close){
  if(pts.length<3) return "";
  const p=pts, n=p.length; let d=`M${f1(p[0][0])} ${f1(p[0][1])}`;
  for(let i=0;i<n-(close?0:1);i++){
    const p0=p[(i-1+n)%n],p1=p[i],p2=p[(i+1)%n],p3=p[(i+2)%n];
    const c1=[p1[0]+(p2[0]-p0[0])/6,p1[1]+(p2[1]-p0[1])/6], c2=[p2[0]-(p3[0]-p1[0])/6,p2[1]-(p3[1]-p1[1])/6];
    d+=` C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d+(close?"Z":"");
}
const rad=a=>a*Math.PI/180;
function ellipseLobe(cx,cy,a,b,angDeg,fill,vein,veinCol,serr,fold=0.15){
  // lobe drawn along its own axis; angDeg measured from "up", clockwise
  let s=`<g transform="translate(${f1(cx)} ${f1(cy)}) rotate(${f1(angDeg)})">`;
  // the half turned away from the light is shaded, so each leaflet looks gently folded along its midrib
  const away=angDeg<0?-1:1;
  const fd=fold>0.005?(serr?`<path d="${bladeHalf("leaflet",2*a,b,serr)}" transform="translate(0 ${f1(a)}) scale(${away} 1)" fill="#0B3A1E" opacity="${fold.toFixed(3)}"/>`
    :`<path d="M0 ${f1(-a)} A${f1(b)} ${f1(a)} 0 0 ${away>0?1:0} 0 ${f1(a)}Z" fill="#0B3A1E" opacity="${fold.toFixed(3)}"/>`):"";
  s+= (serr ? `<path d="${bladePath("leaflet",2*a,b,serr)}" transform="translate(0 ${f1(a)})" fill="${fill}"/>`
           : `<ellipse cx="0" cy="0" rx="${f1(b)}" ry="${f1(a)}" fill="${fill}"/>`)+fd;
  if(vein){ const g=mkGeo(serr?"leaflet":"ell",2*a,b), n=Math.max(3,Math.min(7,Math.round(a/12)));
    s+=`<g transform="translate(0 ${f1(a)})">${veinsNet(g,{n,ts:0.1,te:0.78,rise:0.17,ang:52,reach:0.8,tsp:b>14?Math.max(7,a/7):0,quat:b>24?1:0,
      seed:Math.round(Math.abs(cx*7+cy*13))+3,col:veinCol,wm:a>45?3:a>30?2.4:1.9,top:0.94})}</g>`; }
  return s+`</g>`;
}
/* mode "mid": cuts towards the midrib (rose-like); "pet": cuts towards the petiole (silk-cotton-like).
   d = cut depth 0..1. Returns {svg, tip, marginPt, laminaPt, midribPt, leafletBases:[...] } in local coords
   (base of the blade at 0,0, pointing up). */
function morphLeaf(mode,d,o={}){
  const fill=o.fill||"#3FA34D", vc=o.veinCol||"#CDE8C4", compound=d>=0.995, k=1-d, fold=0.15*Math.pow(d,3); // lobes show their fold only once they separate
  let stalks="", lobes="", web="", veins="", spines="", info={leafletBases:[]};
  if(mode==="mid"){
    const Lr=o.Lr||360, gap=14, ang=58, pairs=[[0.2,80,34],[0.42,86,36],[0.64,70,30]];
    const tTerm=0.86, aT=64, bT=34, R=[[0,0]], lerp=(a,b,t)=>a+(b-a)*t;
    const S=Math.sin(rad(ang)), C=Math.cos(rad(ang));
    const geo=pairs.map(([tc,a])=>{ const by=-tc*Lr, L2=gap+2*a; return {by, a, tip:[L2*S, by-L2*C]}; });
    const sinus=[];
    geo.forEach((g,i)=>{
      if(i>0){ const p=geo[i-1];
        const y0=(p.tip[1]+g.tip[1])/2+12, x0=(p.tip[0]+g.tip[0])/2*0.93, y1=(p.by+g.by)/2;
        R.push([Math.max(0.5,x0*k), lerp(y0,y1,d)]); sinus.push([[0,y1+6],[x0*k,lerp(y0,y1,d)]]); }
      const jr=lerp(gap+2*g.a-4, gap+6, Math.pow(d,0.8)); R.push([jr*S, g.by-jr*C]);
    });
    { const p=geo[2], ty=-(tTerm*Lr); const y0=(p.tip[1]+ty)/2+8, y1=(p.by+ty+aT)/2;
      R.push([Math.max(0.5,(p.tip[0]*0.55+bT)*0.75*k), lerp(y0,y1,d)]); }
    R.push([Math.max(0.5,bT*0.95*k), -(tTerm*Lr)]);
    R.push([0, -(tTerm*Lr)-aT*0.6*k]);
    pairs.forEach(([tc,a,b0],i)=>{
      const my=-tc*Lr, b=b0*(1+1.1*Math.pow(k,1.5));
      for(const sd of [1,-1]){
        const dir=[sd*S,-C], cx=dir[0]*(gap+a), cy=my+dir[1]*(gap+a);
        stalks+=`<path d="M0 ${f1(my)} L${f1(dir[0]*(gap+4))} ${f1(my+dir[1]*(gap+4))}" stroke="#3B7A3A" stroke-width="4" stroke-linecap="round"/>`;
        lobes+=ellipseLobe(cx,cy,a,b,sd*ang,fill,true,vc,o.serr,fold);
        info.leafletBases.push([0,my]);
        if(o.spines){ const tip=[dir[0]*(gap+2*a),my+dir[1]*(gap+2*a)];
          for(const sa of [-30,0,30]){ const aa=rad(sd*ang+sa); spines+=`<path d="M${f1(tip[0])} ${f1(tip[1])} l${f1(Math.sin(aa)*14)} ${f1(-Math.cos(aa)*14)}" stroke="#F4EDCF" stroke-width="2" stroke-linecap="round"/>`; } }
      }
    });
    const pts=[...R, ...R.slice(1,-1).reverse().map(p=>[-p[0],p[1]])];
    if(!compound) web=`<path d="${smoothPath(pts,true)}" fill="${fill}"/>`;
    lobes+=ellipseLobe(0,-tTerm*Lr,aT,bT*(1+0.8*Math.pow(k,1.5)),0,fill,true,vc,o.serr,fold);
    if(o.spines){ const ty=-tTerm*Lr-aT; for(const sa of [-30,0,30]) spines+=`<path d="M0 ${f1(ty)} l${f1(Math.sin(rad(sa))*14)} ${f1(-Math.cos(rad(sa))*14)}" stroke="#F4EDCF" stroke-width="2" stroke-linecap="round"/>`; }
    if(!compound){
      // while the lamina is one piece, veins run from the midrib into each lobe and towards each sinus
      pairs.forEach(([tc])=>{ for(const sd of [1,-1]) web+=`<path d="M0 ${f1(-tc*Lr)} L${f1(sd*S*(gap+6))} ${f1(-tc*Lr-C*(gap+6))}" stroke="${vc}" stroke-width="2.6" stroke-linecap="round"/>`; });
      sinus.forEach(([b,p])=>{ for(const sd of [1,-1]){ const e=[sd*p[0]*0.86,b[1]+(p[1]-b[1])*0.86];
        if(Math.hypot(e[0],e[1]-b[1])>6) web+=`<path d="M0 ${f1(b[1])} Q${f1(e[0]*0.5)} ${f1(b[1]+(e[1]-b[1])*0.25)} ${fp(e)}" stroke="${vc}" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".85"/>`; } });
    }
    veins=`<path d="M0 0 L0 ${f1(-tTerm*Lr)}" stroke="${compound?"#3B7A3A":vc}" stroke-width="${compound?5:3.4}" stroke-linecap="round"/>`;
    info.tip=[0,-tTerm*Lr-aT]; info.midribPt=[0,-0.3*Lr];
    const dirR=[Math.sin(rad(ang)),-Math.cos(rad(ang))], my=-pairs[1][0]*Lr;
    info.laminaPt=[dirR[0]*(gap+pairs[1][1]), my+dirR[1]*(gap+pairs[1][1])];
    // a point exactly on the edge of the terminal lobe, clear of the side lobes
    const bTe=bT*(1+0.8*Math.pow(k,1.5));
    info.marginPt=[bTe*Math.sin(rad(70)), -tTerm*Lr-aT*Math.cos(rad(70))];
  } else {
    const gap=12, a=o.a||100, b=o.b||34, angs=[-64,-32,0,32,64], R=[[0,0]];
    const lerp=(p,q,t)=>p+(q-p)*t;
    angs.forEach((an,i)=>{
      if(i>0){ const sa=(angs[i-1]+an)/2, sd=lerp(0.9*(gap+2*a),0,d); R.push([Math.sin(rad(sa))*Math.max(0.5,sd), -Math.cos(rad(sa))*Math.max(0.5,sd)]); }
      const jr=lerp(gap+2*a-4,gap+6,Math.pow(d,0.8)); R.push([Math.sin(rad(an))*jr,-Math.cos(rad(an))*jr]);
      const dir=[Math.sin(rad(an)),-Math.cos(rad(an))];
      stalks+=`<path d="M0 0 L${f1(dir[0]*(gap+4))} ${f1(dir[1]*(gap+4))}" stroke="#3B7A3A" stroke-width="4" stroke-linecap="round"/>`;
      lobes+=ellipseLobe(dir[0]*(gap+a),dir[1]*(gap+a),a,b*(1+0.9*Math.pow(k,1.5)),an,fill,true,vc,o.serr,fold);
      info.leafletBases.push([0,0]);
    });
    R.push([0,0]);
    if(!compound){ web=`<path d="${smoothPath(R,true)}" fill="${fill}"/>`;
      // palmate veins: one into each lobe, a finer one towards each sinus
      angs.forEach(an=>{ web+=`<path d="M0 0 L${f1(Math.sin(rad(an))*(gap+6))} ${f1(-Math.cos(rad(an))*(gap+6))}" stroke="${vc}" stroke-width="2.6" stroke-linecap="round"/>`; });
      angs.slice(1).forEach((an,i)=>{ const sa=(angs[i]+an)/2, sd=lerp(0.9*(gap+2*a),0,d)*0.84;
        if(sd>8) web+=`<path d="M0 0 L${f1(Math.sin(rad(sa))*sd)} ${f1(-Math.cos(rad(sa))*sd)}" stroke="${vc}" stroke-width="1.3" stroke-linecap="round" opacity=".85"/>`; }); }
    info.tip=[0,-(gap+2*a)]; info.midribPt=[0,-(gap+a*0.5)];
    const dir=[Math.sin(rad(32)),-Math.cos(rad(32))];
    info.laminaPt=[dir[0]*(gap+a),dir[1]*(gap+a)];
    { // a point exactly on the free outer edge of the last lobe
      const be=b*(1+0.9*Math.pow(k,1.5)), d6=[Math.sin(rad(64)),-Math.cos(rad(64))], pp=[Math.cos(rad(64)),Math.sin(rad(64))], c=[d6[0]*(gap+a),d6[1]*(gap+a)];
      info.marginPt=[c[0]+d6[0]*a*Math.cos(rad(40))+pp[0]*be*Math.sin(rad(40)), c[1]+d6[1]*a*Math.cos(rad(40))+pp[1]*be*Math.sin(rad(40))]; }
  }
  info.svg=`${stalks}${web}${lobes}${veins}${spines}`;
  return info;
}

/* twig cards: stem on the left, one leaf at the node, axillary bud in the axil */
function twigArt(leafSvg,petiole,rot){
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><defs>${fxDefs()}
<linearGradient id="fadeG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".14" stop-color="#fff"/><stop offset=".86" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="fadeM" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="400"><rect width="400" height="400" fill="url(#fadeG)"/></mask></defs>
<g mask="url(#fadeM)">${stemSVG("M66 410 C64 300 72 150 70 -10",68,22,"stG")}</g>
${nodeSVG(70,300,22,"ndG")}
<g filter="url(#lf)"><g transform="translate(70 300) rotate(${rot||45})">${stalkSVG(petiole,7)}<g transform="translate(0 ${-petiole})">${leafSvg}</g></g></g>
${budSVG(86,280,0.75,22,"bdG")}</svg>`;
}
function pinnateCard(rachis,pairs,la,lb,serr,fill,terminal){
  let s=`<path d="M0 0 L0 ${-rachis}" stroke="#3B7A3A" stroke-width="5" stroke-linecap="round"/>`;
  for(let i=0;i<pairs;i++){ const y=-rachis*(0.12+0.78*i/Math.max(1,pairs-1)*(terminal?0.88:1));
    for(const sd of [1,-1]){ const an=sd*62, dir=[Math.sin(rad(an)),-Math.cos(rad(an))];
      s+=`<path d="M0 ${f1(y)} l${f1(dir[0]*6)} ${f1(dir[1]*6)}" stroke="#3B7A3A" stroke-width="3"/>`;
      s+=ellipseLobe(dir[0]*(6+la),y+dir[1]*(6+la),la,lb,an,fill,true,"#CDE8C4",serr); } }
  if(terminal) s+=ellipseLobe(0,-rachis-la,la,lb,0,fill,true,"#CDE8C4",serr);
  return s;
}
const CARD_NET={
  mango:{n:12,ts:0.06,te:0.86,rise:0.085,ang:58,reach:0.88,tsp:9,quat:1},
  banyan:{n:6,ts:0.13,te:0.76,rise:0.17,ang:52,reach:0.86,basal:[[0.012,0.24,74,0.86]],tsp:10,quat:1}
};
function simpleCard(name,L,W,shape,fill,seed,serr){
  return `<path d="${bladePath(shape,L,W,serr)}" fill="${fill}"/><path d="${bladeHalf(shape,L,W,serr)}" fill="#0B3A1E" opacity=".16"/>`+
    veinsNet(mkGeo(shape,L,W),Object.assign({seed,col:"#D6F0B8",wm:3.4,shade:"#14472A"},CARD_NET[name]))+
    `<path d="${bladePath(shape,L,W,serr)}" fill="none" stroke="#1D5530" stroke-width="1.4"/>`;
}
const DEFAULT_ART={
  // soft studio backdrop: a lit centre, out-of-focus foliage (bokeh) and a gentle vignette
  background:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 680"><defs>
<radialGradient id="g" cx=".42" cy=".36" r=".9"><stop offset="0" stop-color="#FCFEF6"/><stop offset=".5" stop-color="#EAF4E2"/><stop offset="1" stop-color="#C7DDC2"/></radialGradient>
<radialGradient id="v" cx=".5" cy=".45" r=".75"><stop offset=".6" stop-color="#0E2A17" stop-opacity="0"/><stop offset="1" stop-color="#0E2A17" stop-opacity=".22"/></radialGradient>
<radialGradient id="bk" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset=".7" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<filter id="b1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28"/></filter>
<filter id="b2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>
<rect width="1000" height="680" fill="url(#g)"/>
<g filter="url(#b1)" opacity=".7"><ellipse cx="900" cy="90" rx="150" ry="110" fill="#A9D48E"/><ellipse cx="985" cy="430" rx="110" ry="150" fill="#BFE0A0"/><ellipse cx="40" cy="610" rx="170" ry="110" fill="#9CC983"/><ellipse cx="600" cy="690" rx="260" ry="70" fill="#B5D79E"/><ellipse cx="380" cy="-10" rx="200" ry="60" fill="#D9EDC3"/></g>
<g filter="url(#b2)" opacity=".55"><circle cx="840" cy="210" r="26" fill="url(#bk)"/><circle cx="905" cy="300" r="15" fill="url(#bk)"/><circle cx="760" cy="80" r="18" fill="url(#bk)"/><circle cx="930" cy="560" r="22" fill="url(#bk)"/><circle cx="60" cy="470" r="20" fill="url(#bk)"/><circle cx="255" cy="640" r="14" fill="url(#bk)"/></g>
<rect width="1000" height="680" fill="url(#v)"/></svg>`,
  twig_mango:twigArt(simpleCard("mango",250,58,"lance","#2F8F45",11),32,45),
  twig_banyan:twigArt(simpleCard("banyan",215,92,"ellipse","#3E9A49",5),36,48),
  twig_rose:twigArt(pinnateCard(170,2,36,17,9,"#3FA34D",true),40,42),
  twig_neem:twigArt(pinnateCard(250,6,30,9,7,"#4DB35A",false),26,40),
  twig_silkcotton:twigArt(morphLeaf("pet",1,{a:58,b:17,fill:"#4DA455"}).svg,150,45),
  twig_poppy:twigArt(`<g transform="scale(.62)">${morphLeaf("mid",0.62,{fill:"#7FAE8E",veinCol:"#F2F6EE",spines:true}).svg}</g>`,0,42)
};
["peepal","mango","banana","maize"].forEach(n=>{ DEFAULT_ART["leaf_"+n]=leafArt(n,false); DEFAULT_ART["skel_"+n]=leafArt(n,true); });
["guava","grass"].forEach(n=>{ DEFAULT_ART["leaf_"+n]=leafArt(n,false); });
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
defs.innerHTML=fxDefs();
img("background",0,0,1000,680);
/* ---------- toast ---------- */
let toastTimer=null; const TOAST_MS=8000;
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



/* ---------- state ---------- */
const S={tab:"explore",
  ex:{d:0,mode:"mid",bud:false,parts:false,band:-1,asked:false},
  ven:{leaf:"peepal",rub:0,answered:{}},
  ch:{i:0,stars:0,got:{}}};

/* ---------- EXPLORE scene ---------- */
const gEx=el("g",{});
const NODE=[140,566], ROT={mid:56,pet:50}, PET={mid:70,pet:140}, SC=1.3;
el("g",{},gEx).innerHTML=stemSVG("M133 700 C130 560 142 300 138 -20",136,30,"stEx")+nodeSVG(NODE[0],NODE[1],32,"ndEx");
const exLeaf=el("g",{},el("g",{filter:"url(#lf)"},gEx)); // lit in scene space, so light and shadow stay fixed as the leaf turns
const BUD=[166,538];
el("g",{},gEx).innerHTML=budSVG(BUD[0],BUD[1],1,24,"bdEx");
const exMarks=el("g",{},gEx), exLabels=el("g",{},gEx);
function T(p){ // local leaf coords -> scene
  const m=S.ex.mode, r=rad(ROT[m]), x=p[0]*SC, y=(p[1]-PET[m])*SC;
  return [NODE[0]+x*Math.cos(r)-y*Math.sin(r), NODE[1]+x*Math.sin(r)+y*Math.cos(r)];
}
/* label tag: a pill at (pt + dx,dy), on the side given by the sign of dx, joined to the exact point by a leader
   that meets the near side of the pill. The pill is kept inside the scene. */
function label(pt,text,dx,dy,parent,col){
  col=col||"#17302A";
  const g=el("g",{},parent), left=dx<0, P=14, V=7;
  const halo=el("line",{stroke:"#fff","stroke-width":6,"stroke-linecap":"round",opacity:.9},g);
  const line=el("line",{stroke:col,"stroke-width":2.4,"stroke-linecap":"round"},g);
  const box=el("rect",{fill:"#fff",stroke:col,"stroke-width":2,filter:"url(#lbl)"},g);
  const t=el("text",{x:pt[0]+dx+(left?-P:P),y:pt[1]+dy+8.5,"text-anchor":left?"end":"start","font-size":24,"font-weight":800,fill:"#17302A",text},g);
  let bb=t.getBBox(), sx=0, sy=0;
  if(bb.x-P<8) sx=8-(bb.x-P); else if(bb.x+bb.width+P>992) sx=992-(bb.x+bb.width+P);
  if(bb.y-V<8) sy=8-(bb.y-V); else if(bb.y+bb.height+V>672) sy=672-(bb.y+bb.height+V);
  if(sx||sy){ t.setAttribute("x",+t.getAttribute("x")+sx); t.setAttribute("y",+t.getAttribute("y")+sy); bb=t.getBBox(); }
  const rx=bb.x-P, ry=bb.y-V, rw=bb.width+2*P, rh=bb.height+2*V, ex=left?rx+rw:rx, ey=ry+rh/2;
  Object.entries({x:rx,y:ry,width:rw,height:rh,rx:rh/2}).forEach(([k,v])=>box.setAttribute(k,f1(v)));
  [halo,line].forEach(l=>Object.entries({x1:pt[0],y1:pt[1],x2:ex,y2:ey}).forEach(([k,v])=>l.setAttribute(k,f1(v))));
  el("circle",{cx:pt[0],cy:pt[1],r:7.5,fill:"#fff",filter:"url(#lbl)"},g);
  el("circle",{cx:pt[0],cy:pt[1],r:4.5,fill:col},g);
}
function exDraw(){
  const E=S.ex, d=E.d/100, m=E.mode, info=morphLeaf(m,d);
  const comp=d>=0.995;
  exLeaf.setAttribute("transform",`translate(${NODE[0]} ${NODE[1]}) rotate(${ROT[m]}) scale(${SC})`);
  exLeaf.innerHTML=`${stalkSVG(PET[m],9)}<g transform="translate(0 ${-PET[m]})">${info.svg}</g>`;
  exMarks.innerHTML=""; exLabels.innerHTML="";
  if(E.bud){
    el("circle",{cx:BUD[0],cy:BUD[1],r:30,fill:"none",stroke:"#F2B33D","stroke-width":6},exMarks);
    if(comp){ const seen=new Set(); info.leafletBases.forEach((b,i)=>{
        const lb=m==="mid"?[[14*Math.sin(rad(58)),b[1]-14*Math.cos(rad(58))],[-14*Math.sin(rad(58)),b[1]-14*Math.cos(rad(58))]]:[[Math.sin(rad([-64,-32,0,32,64][i]))*16,-Math.cos(rad([-64,-32,0,32,64][i]))*16]];
        lb.forEach(p=>{ const key=p.map(v=>Math.round(v)).join(); if(seen.has(key))return; seen.add(key); const q=T(p);
          el("path",{d:`M${q[0]-8} ${q[1]-8} l16 16 M${q[0]+8} ${q[1]-8} l-16 16`,stroke:"#C2452D","stroke-width":4,"stroke-linecap":"round"},exMarks); }); }); }
  }
  if(E.parts){
    const P=m==="pet";
    // tags sit in the open space around the leaf; the bottom row (petiole, bud) is kept clear of the blade
    label(T(info.tip),"Apex",30,-40,exLabels);
    label(T(info.laminaPt),comp?"Leaflet":"Lamina",P?70:120,P?-120:-70,exLabels);
    label(T(info.marginPt),"Margin",P?110:110,P?0:4,exLabels);
    if(!P) label(T(info.midribPt),"Midrib",-30,-110,exLabels);
    else label(T([0,-40]),"Vein",-60,-140,exLabels);
    const pp=T([0,PET[m]*0.3]);
    label(pp,"Petiole",P?300-pp[0]:232-pp[0],P?600-pp[1]:600-pp[1],exLabels);
    label([BUD[0]+2,BUD[1]-2],"Axillary bud",32,112,exLabels,"#B8860B");
    label([NODE[0]-8,NODE[1]],"Node",-50,38,exLabels);
    label([140,170],"Stem",-60,-40,exLabels);
  }
  $("depthO").textContent=E.d+"%";
  setRangeFill($("depth"));
  hud(["Cut depth",E.d+"%"],["Lamina",comp?"in leaflets":"one piece"],["Leaf type",comp?"Compound":"Simple"]);
  $("h3").style.color=comp?"#C2452D":"";
}
function exBand(){ const d=S.ex.d; return d===0?0:d<45?1:d<100?2:3; }
function exMsg(){
  const b=exBand(), m=S.ex.mode;
  if(b===S.ex.band) return; S.ex.band=b;
  if(b===0) toast("");
  else if(b===1) toast("Shallow cuts in the margin. The lamina is still one piece, so it is still a simple leaf.","info",TOAST_MS);
  else if(b===2) toast(`Deep cuts, but they do not reach the ${m==="mid"?"midrib":"petiole"}. Still one lamina: a simple leaf, like the prickly poppy.`,"info",TOAST_MS);
  else { toast(m==="mid"?"The cuts reached the midrib. The lamina is now divided into leaflets: a compound leaf, like the rose.":"The cuts reached the petiole. The leaflets spread from the tip of the petiole: a compound leaf, like silk cotton.","ok",TOAST_MS);
    if(!S.ex.asked){ S.ex.asked=true; setTimeout(showExQ,1600); } }
}
const EX_Q={q:"A leaf has deep cuts that stop just short of the midrib. What type of leaf is it?",a:0,opts:[
  {t:"A simple leaf",why:"The cuts do not reach the midrib, so the lamina is still one piece: a simple leaf, like the prickly poppy."},
  {t:"A compound leaf",why:"In a compound leaf, the cuts reach all the way to the midrib or petiole and split the lamina into leaflets. Look at where these cuts stop."},
  {t:"A leaflet",why:"A leaflet is one small part of a compound leaf. Leaflets form only when the cuts reach the midrib or petiole."}]};
function showExQ(){ $("pane-explore").classList.add("asking"); $("exQ").hidden=false; mcq($("exQ"),EX_Q); }
function exReset(){
  Object.assign(S.ex,{d:0,mode:"mid",bud:false,parts:false,band:-1,asked:false});
  $("depth").value=0; segSet("cutTo","mid"); $("budBtn").setAttribute("aria-pressed","false"); $("partsBtn").setAttribute("aria-pressed","false");
  $("exQ").hidden=true; $("pane-explore").classList.remove("asking"); toast(""); exDraw(); exBand(); S.ex.band=0;
}

/* ---------- VENATION scene ---------- */
const gVen=el("g",{display:"none"});
const VBOX={x:300,y:20,w:400,h:600};
const venSkel=img("skel_peepal",VBOX.x,VBOX.y,VBOX.w,VBOX.h,gVen);
const venLeafImg=img("leaf_peepal",VBOX.x,VBOX.y,VBOX.w,VBOX.h,gVen);
const rubHand=el("g",{opacity:0},gVen);
el("ellipse",{cx:0,cy:0,rx:34,ry:22,fill:"#fff",stroke:"#17302A","stroke-width":3},rubHand);
el("text",{x:0,y:8,"text-anchor":"middle","font-size":22,"font-weight":800,fill:"#17302A",text:"rub"},rubHand);
const venNote=el("text",{x:500,y:660,"text-anchor":"middle","font-size":26,"font-weight":700,fill:"#55706A",text:""},gVen);
const VEN_INFO={
  peepal:{name:"Peepal",type:"ret"}, mango:{name:"Mango",type:"ret"}, banana:{name:"Banana",type:"par"}, maize:{name:"Maize",type:"par"}};
function venDraw(){
  const V=S.ven, inf=VEN_INFO[V.leaf];
  venSkel.setAttribute("href",src("skel_"+V.leaf)); venLeafImg.setAttribute("href",src("leaf_"+V.leaf));
  venLeafImg.setAttribute("opacity",(1-V.rub/100*0.94).toFixed(2));
  $("rubO").textContent=V.rub+"%"; setRangeFill($("rub"));
  venNote.textContent=V.rub>=70?"Only the veins are left: a skeleton leaf.":"";
  const ans=V.answered[V.leaf];
  hud(["Leaf",inf.name],["Green rubbed away",V.rub+"%"],["Venation",ans?(inf.type==="ret"?"Reticulate (net)":"Parallel"):"?"]);
  $("h3").style.color="";
}
let rubT=0;
function venRubAnim(){ rubT=1.2; }
function venTick(dt){
  if(rubT>0){ rubT-=dt; const p=1-rubT/1.2, x=VBOX.x+200+Math.sin(p*Math.PI*6)*80, y=VBOX.y+250+Math.cos(p*Math.PI*3)*60;
    rubHand.setAttribute("transform",`translate(${x} ${y})`); rubHand.setAttribute("opacity",Math.min(1,rubT*2).toFixed(2)); }
}
function venQ(){
  const V=S.ven, inf=VEN_INFO[V.leaf];
  if(V.rub<70 || $("venQ").dataset.leaf===V.leaf) { if(V.rub<70&&!V.answered[V.leaf]) { $("venQ").hidden=true; $("venQ").dataset.leaf=""; $("pane-ven").classList.remove("asking"); } return; }
  $("venQ").dataset.leaf=V.leaf; $("venQ").hidden=false; $("pane-ven").classList.add("asking");
  mcq($("venQ"),venItem(V.leaf,inf.name,inf.type),()=>{ V.answered[V.leaf]=true; venDraw(); });
}
function venItem(key,name,type){
  const ret=type==="ret";
  return {q:`How are the veins arranged in the ${name.toLowerCase()} leaf?`,a:ret?0:1,opts:[
    {t:"They form a net (reticulate venation)",why:ret?`The veins and veinlets of the ${name.toLowerCase()} leaf join up to form a network. This is reticulate venation, found in dicot plants such as peepal, mango and guava.`
      :"Follow one vein from the midrib out to the edge. Does it branch and join its neighbours, or run alongside them?"},
    {t:"They run side by side (parallel venation)",why:ret?"Look at the small veinlets between the larger veins. Do they stay separate, or do they join and cross each other?"
      :`The veins of the ${name.toLowerCase()} leaf run parallel to each other without forming a net. This is parallel venation, found in monocot plants such as banana, grass, maize and wheat.`}]};
}
function venSetLeaf(v){ S.ven.leaf=v; S.ven.rub=0; $("rub").value=0; $("venQ").hidden=true; $("venQ").dataset.leaf=""; $("pane-ven").classList.remove("asking"); venDraw(); }
function venReset(){ S.ven.answered={}; segSet("venLeaf","peepal"); venSetLeaf("peepal"); }

/* ---------- CHALLENGE ---------- */
const gCh=el("g",{display:"none"});
const chImg=el("image",{preserveAspectRatio:"xMidYMid meet"},gCh);
const chMarks=el("g",{},gCh);
const chName=el("text",{x:500,y:660,"text-anchor":"middle","font-size":30,"font-weight":800,fill:"#1F5E3B",text:""},gCh);
const SIMPLE_Q=(name)=>`Is the ${name} leaf a simple leaf or a compound leaf?`;
const CARDS=[
  {r:1,key:"twig_mango",name:"Mango",a:0,ok:"The mango leaf has one undivided lamina, with a bud in its axil. It is a simple leaf.",
    no:"A compound leaf has its lamina split into separate leaflets. Is this lamina split, or is it one piece?"},
  {r:1,key:"twig_rose",name:"Rose",a:1,ok:"The rose leaf's lamina is divided into leaflets along the midrib. There is only one bud, at the base of the whole leaf, so it is one compound leaf.",
    no:"A simple leaf has one undivided lamina. Count the green parts, and use Find the bud to see where the whole leaf begins."},
  {r:1,key:"twig_banyan",name:"Banyan",a:0,ok:"The banyan leaf has a single, undivided lamina. It is a simple leaf.",
    no:"Look at the lamina. Is it divided into small leaflets, or is it one whole piece?"},
  {r:1,key:"twig_silkcotton",name:"Silk cotton",a:1,ok:"The silk cotton leaf is divided right up to the petiole, so its leaflets spread from the petiole's tip. It is a compound leaf.",
    no:"Look where the green parts meet. Are they one lamina, or separate units on one petiole? Use Find the bud."},
  {r:1,key:"twig_poppy",name:"Prickly poppy",a:0,ok:"The cuts in the prickly poppy leaf do not reach the midrib, so its lamina is still one piece. It is a simple leaf.",
    no:"Follow one cut in from the margin. Does it reach all the way to the midrib?"},
  {r:1,key:"twig_neem",name:"Neem",a:1,ok:"Neem has many leaflets on one midrib and only one bud, at the base of the whole leaf. It is a compound leaf.",
    no:"Is there a bud at the base of each small green part, or only one bud for the whole thing? Use Find the bud."},
  {r:2,key:"leaf_peepal",name:"Peepal",v:"ret"},{r:2,key:"leaf_banana",name:"Banana",v:"par"},{r:2,key:"leaf_guava",name:"Guava",v:"ret"},
  {r:2,key:"leaf_maize",name:"Maize",v:"par"},{r:2,key:"leaf_mango",name:"Mango",v:"ret"},{r:2,key:"leaf_grass",name:"Grass",v:"par"}
];
function chItem(c){
  if(c.r===2) return venItem(c.key,c.name,c.v);
  const opts=[{t:"A simple leaf"},{t:"A compound leaf"}];
  opts[c.a].why=c.ok; opts[1-c.a].why=c.no;
  return {q:SIMPLE_Q(c.name),a:c.a,opts};
}
function chShowCard(){
  const c=CARDS[S.ch.i], twig=c.r===1;
  const box=twig?{x:230,y:40,w:560,h:560}:{x:300,y:20,w:400,h:600};
  Object.entries(box).forEach(([k,v])=>chImg.setAttribute(k==="w"?"width":k==="h"?"height":k,v));
  chImg.setAttribute("href",src(c.key)); chMarks.innerHTML=""; chName.textContent=c.name;
  $("taskNo").textContent=`Card ${S.ch.i+1} of ${CARDS.length}`;
  $("taskText").textContent=twig?"Round 1: Simple or compound?":"Round 2: Reticulate or parallel venation?";
  $("budRow").hidden=!twig; $("chBud").setAttribute("aria-pressed","false");
  $("chNav").hidden=true; $("endCard").hidden=true; $("endNav").hidden=true; $("mcqBox").hidden=false; $("chCard").hidden=false;
  toast("");
  hud(["Round",twig?"1 of 2":"2 of 2"],["Card",`${S.ch.i+1} of ${CARDS.length}`],["Stars",`★ ${S.ch.stars}`]);
  mcq($("mcqBox"),chItem(c),first=>{ if(first){ if(!S.ch.got[S.ch.i]){S.ch.got[S.ch.i]=true;S.ch.stars++;} }
    $("score").textContent=`★ ${S.ch.stars} / ${CARDS.length}`; hud(["Round",twig?"1 of 2":"2 of 2"],["Card",`${S.ch.i+1} of ${CARDS.length}`],["Stars",`★ ${S.ch.stars}`]);
    $("taskNext").textContent=S.ch.i===CARDS.length-1?"See my score":"Next card"; $("chNav").hidden=false; });
}
function chBud(on){
  chMarks.innerHTML=""; $("chBud").setAttribute("aria-pressed",on?"true":"false");
  if(!on){ toast(""); return; }
  const c=CARDS[S.ch.i], a=ASSETS[c.key], x=230+a.bud[0]*560, y=40+a.bud[1]*560;
  el("circle",{cx:x,cy:y,r:30,fill:"none",stroke:"#F2B33D","stroke-width":6},chMarks);
  toast("This is the only bud. It sits in the axil, where the whole leaf joins the stem.","info",TOAST_MS);
}
function chEnd(){
  chMarks.innerHTML=""; chImg.setAttribute("href",""); chName.textContent="";
  ["chCard","budRow","mcqBox","chNav"].forEach(id=>$(id).hidden=true); $("endCard").hidden=false; $("endNav").hidden=false;
  const s=S.ch.stars, n=CARDS.length;
  $("endStars").textContent=`★ ${s} / ${n}`;
  $("endText").textContent=s===n?"Perfect score! You can tell leaves apart like a botanist.":s>=8?`Well done. Go back to Explore or Venation to check the cards you missed.`:"Try Explore and Venation again, then play again.";
  hud(["Round","Finished"],["Cards",`${n} of ${n}`],["Stars",`★ ${s}`]); toast("");
}
function chStart(){ Object.assign(S.ch,{i:0,stars:0,got:{}}); $("score").textContent=`★ 0 / ${CARDS.length}`; chShowCard(); }

/* ---------- controls ---------- */
function setRangeFill(inp){ inp.style.setProperty("--p",((inp.value-inp.min)/(inp.max-inp.min)*100)+"%"); }
function segInit(id,cb){ const box=$(id); box.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ if(b.disabled)return; segSet(id,b.dataset.v); cb(b.dataset.v); })); }
function segSet(id,v){ $(id).querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===v?"true":"false")); }
$("toast").addEventListener("click",()=>{$("toast").hidden=true;});
$("depth").addEventListener("input",e=>{ S.ex.d=+e.target.value; exDraw(); exMsg(); });
segInit("cutTo",v=>{ S.ex.mode=v; S.ex.band=-1; exDraw(); exMsg(); });
$("budBtn").onclick=()=>{ S.ex.bud=!S.ex.bud; $("budBtn").setAttribute("aria-pressed",S.ex.bud); exDraw();
  if(S.ex.bud) toast(S.ex.d>=100?"There is still only one bud, at the base of the whole leaf. Leaflets have no buds in their axils (red crosses), so all the leaflets together make one compound leaf."
    :"There is always a bud in the axil of a leaf, where it joins the stem. One bud here means one leaf.","info",TOAST_MS); else { S.ex.band=-1; exMsg(); } };
$("partsBtn").onclick=()=>{ S.ex.parts=!S.ex.parts; $("partsBtn").setAttribute("aria-pressed",S.ex.parts); exDraw(); };
$("exReset").onclick=exReset;
segInit("venLeaf",v=>venSetLeaf(v));
$("rub").addEventListener("input",e=>{ const v=+e.target.value; if(v>S.ven.rub) venRubAnim(); S.ven.rub=v; venDraw(); venQ(); });
$("venReset").onclick=venReset;
$("chBud").onclick=()=>chBud($("chBud").getAttribute("aria-pressed")!=="true");
$("taskNext").onclick=()=>{ S.ch.i++; if(S.ch.i>=CARDS.length) chEnd(); else chShowCard(); };
$("again").onclick=chStart;

function setTab(tab){
  S.tab=tab; toast("");
  document.querySelectorAll("#tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===tab?"true":"false"));
  ["explore","ven","challenge"].forEach(t=>{ $("pane-"+t).classList.toggle("on",t===tab); });
  gEx.setAttribute("display",tab==="explore"?"inline":"none"); gVen.setAttribute("display",tab==="ven"?"inline":"none"); gCh.setAttribute("display",tab==="challenge"?"inline":"none");
  $("score").hidden=tab!=="challenge";
  if(tab==="explore"){ S.ex.band=-1; exDraw(); }
  else if(tab==="ven") venDraw();
  else chStart();
  maybeTour(tab);
}
document.querySelectorAll("#tabs button").forEach(b=>b.addEventListener("click",()=>{ if(!tourOn) setTab(b.dataset.tab); }));

/* ---------- HOW TO USE: guided tour ---------- */
const TOURS={
  explore:[
    {s:"#soundBtn",t:"Welcome to Simple or Compound?",x:"Find out what makes a leaf simple or compound, and how its veins are arranged. This quick tour takes under a minute. Sound plays for right and wrong answers; tap this speaker button to turn it off or on.",g:"tap"},
    {s:"#tabs",t:"Three parts, in order",x:"Start with Explore, then Venation, then Challenge. Tap a tab to move between them.",g:"tap",h:"#tabs button[data-tab='ven']"},
    {s:"#stagebox",t:"A twig with one leaf",x:"The leaf joins the stem at a node. A bud sits in the axil, the angle between the leaf and the stem."},
    {s:"#depth",t:"Cut into the lamina",x:"Drag the slider to cut deeper from the margin. Watch what happens when the cuts reach the midrib.",g:"drag"},
    {s:"#cutTo",t:"Where do the cuts go?",x:"Choose Midrib for a leaf like rose, or Petiole for a leaf like silk cotton.",g:"tap",h:"#cutTo button[data-v='pet']"},
    {s:"#budBtn",t:"Find the bud",x:"Shows the axillary bud. A whole leaf has a bud in its axil; a leaflet never does.",g:"tap"},
    {s:"#partsBtn",t:"Show parts",x:"Labels the apex, lamina, margin, midrib, petiole, node, stem and axillary bud.",g:"tap"},
    {s:"#hud",t:"Read the result",x:"These boxes show the cut depth and the type of leaf. A question appears once the simple leaf becomes compound."},
    {s:"#helpBtn",t:"See this again any time",x:"Tap Help (?) to replay the tour for the part you are on.",g:"tap"}],
  ven:[
    {s:"#venLeaf",t:"Pick a leaf",x:"Choose peepal, mango, banana or maize.",g:"tap",h:"#venLeaf button[data-v='mango']"},
    {s:"#rub",t:"Rub away the green",x:"Drag the slider to rub away the green part, like the soaked peepal leaf. Only the veins are left.",g:"drag"},
    {s:"#hud",t:"Name the venation",x:"When most of the green is gone, a question asks how the veins are arranged."}],
  challenge:[
    {s:"#chCard",t:"Twelve leaf cards",x:"Round 1: simple or compound leaf? Round 2: reticulate or parallel venation?"},
    {s:"#score",t:"Earn stars",x:"Each card answered correctly on the first try gives a star."},
    {s:"#budRow",t:"Use the clue",x:"In Round 1, Find the bud shows where the whole leaf joins the stem.",g:"tap",h:"#chBud"},
    {s:"#mcqBox",t:"Feedback helps you learn",x:"A wrong answer gives a hint that explains why, so you can try again."}]
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
  if(st.g){ const hr=st.h?rectIn(document.querySelector(st.h)):r; hand.style.left=(hr.x+hr.w/2-16)+"px"; hand.style.top=(hr.y+hr.h/2-2)+"px"; }
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
function loop(now){ const dt=Math.min(0.05,(now-last)/1000); last=now; if(S.tab==="ven") venTick(dt); requestAnimationFrame(loop); }
fit(); exReset(); venDraw(); setTab("explore");
requestAnimationFrame(loop);
