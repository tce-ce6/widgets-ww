const ASSETS = {
  background:     { src: "", frame: [1000, 680] },
  plant_broad:    { src: "", frame: [400, 500], leafZone: [0.24, 0.08, 0.76, 0.66], stem: [0.5, 0.22, 0.73], soil: [0.5, 0.724, 0.215] },
  plant_spines:   { src: "", frame: [400, 500], leafZone: [0.33, 0.28, 0.70, 0.72], stem: [0.5, 0.30, 0.73], soil: [0.5, 0.724, 0.215] },
  plant_noleaves: { src: "", frame: [400, 500], leafZone: [0.44, 0.22, 0.56, 0.70], stem: [0.5, 0.22, 0.73], soil: [0.5, 0.724, 0.215] },
  bag:            { src: "", frame: [400, 500], bagInside: [0.5, 0.41, 0.35, 0.37] },
  sun:            { src: "", frame: [200, 200] },
  fan_blades:     { src: "", frame: [200, 200] },
  scale:          { src: "", frame: [400, 160], display: [0.325, 0.45, 0.35, 0.325] }
};

/* ---------- built-in drawings (used when src is empty) ---------- */
const svgURI = s => "data:image/svg+xml;charset=utf-8," + encodeURIComponent(s);
/* terracotta pot with shaded body, rim and soil */
const POT_DEFS = `<linearGradient id="pt" x1="0" x2="1"><stop offset="0" stop-color="#94502F"/><stop offset=".28" stop-color="#D2885A"/><stop offset=".6" stop-color="#B9693F"/><stop offset="1" stop-color="#7A3E22"/></linearGradient>
<linearGradient id="rm" x1="0" x2="1"><stop offset="0" stop-color="#A65A35"/><stop offset=".3" stop-color="#E39A6B"/><stop offset=".65" stop-color="#C77A4C"/><stop offset="1" stop-color="#8A4727"/></linearGradient>
<radialGradient id="sl" cx=".45" cy=".35" r=".7"><stop offset="0" stop-color="#5C4030"/><stop offset="1" stop-color="#2B1C13"/></radialGradient>`;
const POT = `<ellipse cx="200" cy="493" rx="80" ry="6" fill="#3A2A1A" opacity=".25"/>
<path d="M124 380 H276 L261 487 Q260 491 255 491 H145 Q140 491 139 487 Z" fill="url(#pt)"/>
<path d="M124 380 H276 L273 401 H127 Z" fill="#4A2412" opacity=".3"/>
<path d="M150 406 L156 482" stroke="#F0B48A" stroke-width="5" opacity=".25" stroke-linecap="round"/>
<rect x="108" y="355" width="184" height="30" rx="6" fill="url(#rm)"/>
<path d="M114 360 H286" stroke="#F7C29C" stroke-width="2" opacity=".55" stroke-linecap="round"/>
<path d="M110 382 H290" stroke="#6B3519" stroke-width="2" opacity=".35"/>
<ellipse cx="200" cy="362" rx="86" ry="9" fill="url(#sl)"/>
${[[160,361],[178,364],[214,360],[236,363],[192,359],[250,361],[146,363]].map(([x,y],i)=>`<ellipse cx="${x}" cy="${y}" rx="${2.5+i%2}" ry="1.4" fill="${i%2?"#7A5A42":"#1E140D"}" opacity=".7"/>`).join("")}`;
/* leaf: shaded fold along the midrib, curved side veins, soft gloss */
const lg=(id,a,b,c)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".47" stop-color="${b}"/><stop offset=".5" stop-color="${c}"/><stop offset="1" stop-color="${a}"/></linearGradient>`;
const LEAF_DEFS = lg("lgA","#2B7334","#63BE66","#3E9446")+lg("lgB","#347E37","#74C870","#4AA24E")+lg("lgC","#23652E","#52A85A","#33863D");
function leaf(x,y,len,ang,g){
  const w=len*0.4, f1=n=>n.toFixed(1);
  const side=(f,s)=>{ const hw=w*Math.sin(Math.PI*(f+.17))*.62*s; return `M${f1(len*f)} 0 Q${f1(len*(f+.07))} ${f1(hw*.45)} ${f1(len*(f+.17))} ${f1(hw)}`; };
  const veins=[.14,.28,.42,.56,.68].map(f=>side(f,-1)+" "+side(f,1)).join(" ");
  return `<g transform="translate(${x} ${y}) rotate(${ang})"><path d="M-15 0 Q-7 -2 2 0" stroke="#3A6F2F" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M0 0 C${len*.2} ${-w*1.05},${len*.62} ${-w*.9},${len} 0 C${len*.62} ${w*.9},${len*.2} ${w*1.05},0 0Z" fill="url(#${g})" stroke="#1E5A2B" stroke-width="1.4"/>
<path d="${veins}" stroke="#CFE9BD" stroke-width="1.1" fill="none" opacity=".6" stroke-linecap="round"/>
<path d="M2 0 Q${len*.5} ${-w*.06} ${len-3} 0" stroke="#DDF0CC" stroke-width="2" fill="none" opacity=".85" stroke-linecap="round"/>
<path d="M${len*.18} ${-w*.42} Q${len*.45} ${-w*.78} ${len*.72} ${-w*.42}" stroke="#fff" stroke-width="3" fill="none" opacity=".18" stroke-linecap="round"/></g>`;
}
const STEM_DEFS = `<linearGradient id="st" gradientUnits="userSpaceOnUse" x1="194" x2="207"><stop offset="0" stop-color="#2C632B"/><stop offset=".45" stop-color="#6AA552"/><stop offset="1" stop-color="#28592A"/></linearGradient>`;
const STEM = `<path d="M200 362 C196 300 205 200 200 106" stroke="url(#st)" stroke-width="11" fill="none" stroke-linecap="round"/>`;
const LEAVES = [[214,322,95,-20,"lgA"],[186,292,100,-160,"lgB"],[214,252,105,-32,"lgC"],[186,216,100,-148,"lgA"],
  [212,176,95,-42,"lgB"],[188,142,90,-138,"lgC"],[204,110,80,-72,"lgA"],[196,110,76,-108,"lgB"]];
const DEFAULT_ART = {
  background: (()=>{
    const cloud=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="70" ry="22"/><ellipse cx="-30" cy="-14" rx="34" ry="24"/><ellipse cx="18" cy="-22" rx="40" ry="30"/><ellipse cx="52" cy="-6" rx="28" ry="18"/></g>`;
    const trees=[[64,466],[88,461],[112,459],[716,444],[742,441],[770,443]].map(([x,y])=>`<rect x="${x-1.5}" y="${y-4}" width="3" height="9"/><ellipse cx="${x}" cy="${y-12}" rx="10" ry="13"/>`).join("");
    const tufts=Array.from({length:25},(_,i)=>{const x=18+i*40+(i*37)%17;return `M${x} 601 q-3 -10 -7 -14 M${x} 601 q1 -12 2 -17 M${x} 601 q4 -9 8 -12`;}).join(" ");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 680"><defs>
<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8CC8EC"/><stop offset=".6" stop-color="#C7E6F4"/><stop offset="1" stop-color="#ECF6EE"/></linearGradient>
<linearGradient id="h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B6D7C3"/><stop offset="1" stop-color="#C9E2CF"/></linearGradient>
<linearGradient id="h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A6D294"/><stop offset="1" stop-color="#8FC27F"/></linearGradient>
<linearGradient id="h3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#86BC72"/><stop offset="1" stop-color="#6FA55E"/></linearGradient>
<linearGradient id="wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08F5C"/><stop offset=".5" stop-color="#A97A49"/><stop offset="1" stop-color="#8A5F36"/></linearGradient>
<filter id="bl" x="-20%" y="-60%" width="140%" height="220%"><feGaussianBlur stdDeviation="5"/></filter></defs>
<rect width="1000" height="600" fill="url(#s)"/>
<g fill="#fff" filter="url(#bl)" opacity=".85">${cloud(330,100,1)}${cloud(620,190,.7)}${cloud(480,50,.55)}</g>
<path d="M0 478 C120 438 260 446 380 466 C520 490 640 428 800 444 C900 454 960 466 1000 460 V600 H0Z" fill="url(#h1)"/>
<g fill="#93BFA2">${trees}</g>
<path d="M0 520 C150 455 300 472 430 505 C560 538 700 458 860 482 C930 492 970 500 1000 495 V600 H0Z" fill="url(#h2)"/>
<path d="M0 562 C200 524 380 562 520 550 C700 534 820 562 1000 542 V600 H0Z" fill="url(#h3)"/>
<path d="${tufts}" stroke="#5E944E" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
<rect y="600" width="1000" height="80" fill="url(#wd)"/>
<g fill="none" stroke="#6E4826" stroke-width="1.4" opacity=".22"><path d="M0 626 C200 620 400 632 600 624 S900 628 1000 622"/><path d="M0 648 C180 654 420 642 640 650 S880 644 1000 650"/><path d="M0 668 C220 662 460 672 700 664 S900 670 1000 666"/>
<ellipse cx="180" cy="655" rx="9" ry="4"/><ellipse cx="820" cy="640" rx="7" ry="3"/></g>
<path d="M333 610 V680 M667 610 V680" stroke="#5E3C1E" stroke-width="2" opacity=".35"/>
<rect y="600" width="1000" height="7" fill="#DDB07E"/><rect y="607" width="1000" height="3" fill="#6E4826" opacity=".5"/></svg>`;})(),
  plant_broad: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs>${STEM_DEFS}${LEAF_DEFS}${POT_DEFS}</defs>${STEM}
<path d="M200 110 q-6 -12 0 -22 q6 10 0 22Z" fill="#7CC66A" stroke="#2E7A35" stroke-width="1"/>${LEAVES.map(l=>leaf(...l)).join("")}${POT}</svg>`,
  plant_noleaves: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs>${STEM_DEFS}${POT_DEFS}</defs>${STEM}${LEAVES.map(([x,y,l,a])=>{
      const r=a*Math.PI/180, sx=x-Math.cos(r)*13, sy=y-Math.sin(r)*13, ex=x+Math.cos(r)*3, ey=y+Math.sin(r)*3;
      return `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} L${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#3E7834" stroke-width="4.5" stroke-linecap="round"/><circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="3.3" fill="#A88560" stroke="#6E5236" stroke-width="1"/>`;}).join("")}
<ellipse cx="200" cy="106" rx="5" ry="2.6" fill="#B89A72" stroke="#6E5236" stroke-width="1"/>${POT}</svg>`,
  plant_spines: (()=>{
    const top=d=>172-Math.sqrt(1296-d*d);
    const ribs=[-24,-12,0,12,24].map(d=>`M${200+d} ${(top(d)+5).toFixed(0)} V362`).join(" ");
    const ridges=[-18,-6,6,18].map(d=>`M${200+d} ${(top(d)+6).toFixed(0)} V362`).join(" ");
    const pts=[]; [-18,-6,6,18].forEach((d,j)=>{ for(let y=158+(j%2)*11;y<=348;y+=22) pts.push([200+d,y]); });
    [[258,206],[274,226],[258,246],[274,264],[134,254],[146,274],[134,294]].forEach(p=>pts.push(p));
    const sp=pts.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="2.3" fill="#EFE8CC"/><path d="M${x} ${y} l-8 -5 M${x} ${y} l8 -5 M${x} ${y} l0 -9 M${x} ${y} l-6 4 M${x} ${y} l6 4" stroke="#F6F1DC" stroke-width="1.1" stroke-linecap="round" opacity=".9"/>`).join("");
    const petals=Array.from({length:8},(_,i)=>`<ellipse cy="-9" rx="4.5" ry="10" transform="rotate(${i*45})" fill="url(#fl)" stroke="#C94A7E" stroke-width=".8"/>`).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs>${POT_DEFS}
<linearGradient id="cb" x1="0" x2="1"><stop offset="0" stop-color="#34703A"/><stop offset=".32" stop-color="#7DBB6B"/><stop offset=".62" stop-color="#5B9C50"/><stop offset="1" stop-color="#2A5C2E"/></linearGradient>
<radialGradient id="fl" cx=".5" cy=".9" r=".9"><stop offset="0" stop-color="#FFD1E2"/><stop offset="1" stop-color="#E8588F"/></radialGradient></defs>
<rect x="228" y="256" width="46" height="30" rx="15" fill="url(#cb)"/><rect x="250" y="188" width="32" height="92" rx="16" fill="url(#cb)"/>
<rect x="126" y="290" width="46" height="26" rx="13" fill="url(#cb)"/><rect x="126" y="240" width="27" height="72" rx="13.5" fill="url(#cb)"/>
<path d="M260 198 V272 M272 198 V272 M139.5 250 V306" stroke="#2C6430" stroke-width="1.8" opacity=".4"/>
<rect x="164" y="136" width="72" height="234" rx="36" fill="url(#cb)"/>
<path d="${ribs}" stroke="#2C6430" stroke-width="2.2" opacity=".45" fill="none"/><path d="${ridges}" stroke="#A8D98F" stroke-width="1.6" opacity=".35" fill="none"/>
<g transform="translate(200 132)">${petals}<circle r="5.5" fill="#F7D24A" stroke="#D9A82A"/></g>${sp}${POT}</svg>`;})(),
  bag: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs>
<radialGradient id="bf" cx=".5" cy=".42" r=".62"><stop offset="0" stop-color="#fff" stop-opacity=".03"/><stop offset=".7" stop-color="#F2F9FC" stop-opacity=".1"/><stop offset="1" stop-color="#DCEBF4" stop-opacity=".42"/></radialGradient></defs>
<path d="M118 380 C70 318 42 204 80 112 C102 58 150 18 200 15 C252 18 300 58 322 114 C358 204 330 318 282 380 Z" fill="url(#bf)" stroke="#94B4C6" stroke-width="2.2" stroke-opacity=".85" stroke-linejoin="round"/>
<g fill="none" stroke-linecap="round">
<path d="M112 128 Q132 210 116 300 M290 140 Q270 226 288 326 M162 40 Q178 72 166 104 M238 36 Q226 66 236 98 M196 30 Q206 120 194 220" stroke="#8FB0C3" stroke-width="1.6" opacity=".35"/>
<path d="M118 132 Q138 212 122 302 M284 146 Q264 228 282 326 M168 44 Q184 74 172 104" stroke="#fff" stroke-width="2.4" opacity=".45"/>
<path d="M92 292 C74 214 82 128 136 66" stroke="#fff" stroke-width="8" opacity=".55"/>
<path d="M104 300 C96 262 96 232 100 204" stroke="#fff" stroke-width="3" opacity=".4"/>
<path d="M304 98 C330 148 334 206 324 254" stroke="#fff" stroke-width="4" opacity=".45"/>
<path d="M150 36 C170 26 190 22 210 22" stroke="#fff" stroke-width="3" opacity=".5"/>
<path d="M132 380 L152 352 M164 382 L174 350 M200 383 L200 350 M236 382 L226 350 M268 380 L248 352" stroke="#8FB0C3" stroke-width="1.6" opacity=".6"/></g>
<path d="M108 386 Q200 398 292 386 L290 395 Q200 408 110 395 Z" fill="#fff" fill-opacity=".35" stroke="#94B4C6" stroke-opacity=".6"/>
<rect x="110" y="375" width="180" height="10" rx="5" fill="#C8A169"/>
<path d="${Array.from({length:22},(_,i)=>`M${116+i*8} 376 l5 8`).join(" ")}" stroke="#8E6B3C" stroke-width="1.4" opacity=".8"/>
<path d="M286 380 q16 -6 18 6 q-8 6 -18 -2 M288 384 q6 14 2 26 M292 384 q12 10 14 22" fill="none" stroke="#B48C55" stroke-width="2.6" stroke-linecap="round"/></svg>`,
  sun: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs>
<radialGradient id="h"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".9"/><stop offset=".45" stop-color="#FFD966" stop-opacity=".4"/><stop offset="1" stop-color="#FFD966" stop-opacity="0"/></radialGradient>
<radialGradient id="c" cx=".42" cy=".38" r=".65"><stop offset="0" stop-color="#FFFBE0"/><stop offset=".5" stop-color="#FFD84A"/><stop offset="1" stop-color="#F5A21B"/></radialGradient>
<linearGradient id="r" x1="0" x2="1"><stop offset="0" stop-color="#FFC93C"/><stop offset="1" stop-color="#FFD45A" stop-opacity=".15"/></linearGradient></defs>
<circle cx="100" cy="100" r="98" fill="url(#h)"/>
${Array.from({length:12},(_,i)=>`<path d="M54 -${i%2?5:7} L${i%2?84:96} 0 L54 ${i%2?5:7}Z" transform="translate(100 100) rotate(${i*30})" fill="url(#r)"/>`).join("")}
<circle cx="100" cy="100" r="48" fill="url(#c)"/><circle cx="100" cy="100" r="48" fill="none" stroke="#F7B731" stroke-width="2" opacity=".6"/></svg>`,
  fan_blades: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><defs>
<linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B4DDF2"/><stop offset="1" stop-color="#4F93BF"/></linearGradient>
<radialGradient id="hb" cx=".4" cy=".35"><stop offset="0" stop-color="#9DB0BA"/><stop offset="1" stop-color="#2F4450"/></radialGradient></defs>
<g fill="none" stroke="#9AA8B0" stroke-width="1.4" opacity=".7"><circle cx="100" cy="100" r="78"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="42"/></g>
${[0,120,240].map(a=>`<path transform="rotate(${a} 100 100)" d="M100 100 C76 80 68 34 92 16 C114 6 134 30 120 62 C114 78 106 90 100 100Z" fill="url(#b)" fill-opacity=".92" stroke="#3E7FAA" stroke-width="1.5"/>`).join("")}
<g fill="none" stroke="#C3CDD2" stroke-width="1.2" opacity=".55"><circle cx="100" cy="100" r="70"/><circle cx="100" cy="100" r="52"/><circle cx="100" cy="100" r="34"/></g>
<circle cx="100" cy="100" r="93" fill="none" stroke="#7E8E97" stroke-width="5"/><circle cx="100" cy="100" r="93" fill="none" stroke="#C8D2D7" stroke-width="1.5"/>
<circle cx="100" cy="100" r="16" fill="url(#hb)"/><circle cx="100" cy="100" r="6" fill="#C9D3D8"/></svg>`,
  scale: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 160"><defs>
<linearGradient id="bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F1F4F6"/><stop offset="1" stop-color="#AEBAC2"/></linearGradient>
<linearGradient id="pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBFCFD"/><stop offset=".6" stop-color="#D3DBE0"/><stop offset="1" stop-color="#A9B5BD"/></linearGradient>
<linearGradient id="lc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C3828"/><stop offset="1" stop-color="#0C1F15"/></linearGradient>
<radialGradient id="rb" cx=".4" cy=".35"><stop offset="0" stop-color="#F08A73"/><stop offset="1" stop-color="#A8331F"/></radialGradient>
<radialGradient id="gb" cx=".4" cy=".35"><stop offset="0" stop-color="#E4EAEE"/><stop offset="1" stop-color="#8996A0"/></radialGradient></defs>
<rect x="44" y="146" width="22" height="10" rx="3" fill="#4A555C"/><rect x="334" y="146" width="22" height="10" rx="3" fill="#4A555C"/>
<rect x="20" y="40" width="360" height="110" rx="18" fill="url(#bd)" stroke="#8C99A2" stroke-width="1.5"/>
<rect x="40" y="40" width="320" height="7" fill="#5E6A72" opacity=".25"/>
<rect x="36" y="20" width="328" height="22" rx="8" fill="url(#pf)" stroke="#97A3AB" stroke-width="1.5"/>
<path d="M46 25 H354" stroke="#fff" stroke-width="2" opacity=".8" stroke-linecap="round"/>
<rect x="122" y="64" width="156" height="68" rx="10" fill="#56646C"/><rect x="130" y="72" width="140" height="52" rx="6" fill="url(#lc)"/>
<path d="M134 76 H266 L250 92 H134Z" fill="#fff" opacity=".06"/>
<circle cx="320" cy="98" r="11" fill="url(#rb)" stroke="#7A2516"/><circle cx="80" cy="98" r="11" fill="url(#gb)" stroke="#6E7A82"/>
<g font-family="Arial,sans-serif" font-size="9" font-weight="700" fill="#5B6870" text-anchor="middle"><text x="80" y="124">TARE</text><text x="320" y="124">ON/OFF</text></g></svg>`
};
const src = k => ASSETS[k].src || svgURI(DEFAULT_ART[k]);


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

/* ---------- model ---------- */
const LEAF_F={broad:1,spines:0.12,none:0.04}, WIND_F={still:1,breeze:1.35,strong:1.7};
const LEAF_NAME={broad:"Broad",spines:"Spines",none:"None"}, WIND_NAME={still:"Still",breeze:"Breeze",strong:"Strong"};
const PLANT_KEY={broad:"plant_broad",spines:"plant_spines",none:"plant_noleaves"};
function rate(s){ return 10*LEAF_F[s.leaf]*(0.25+0.75*s.sun/100)*(0.4+1.1*(s.temp-10)/35)*WIND_F[s.wind]*(1.5-1.3*s.hum/100); }
const HOURS=6, SECS_FOR_RUN=12;
const reduceMotion=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- svg helpers ---------- */
const NS="http://www.w3.org/2000/svg", scene=document.getElementById("scene");
function el(tag,attrs={},parent=scene){ const n=document.createElementNS(NS,tag);
  for(const k in attrs){ if(k==="text") n.textContent=attrs[k]; else n.setAttribute(k,attrs[k]); } parent.appendChild(n); return n; }
function img(key,x,y,w,h,parent){ return el("image",{href:src(key),x,y,width:w,height:h,preserveAspectRatio:"xMidYMid meet"},parent); }
const defs=el("defs");
defs.innerHTML=`<radialGradient id="ckF" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#E2EAE8"/></radialGradient>
<linearGradient id="ckR" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#6A7976"/><stop offset=".5" stop-color="#2A3634"/><stop offset="1" stop-color="#121A19"/></linearGradient>
<linearGradient id="glass" x1="0" x2="1"><stop offset="0" stop-color="#E2EAEE"/><stop offset=".35" stop-color="#fff"/><stop offset="1" stop-color="#C5D2D8"/></linearGradient>
<radialGradient id="bulb" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#F49A8E"/><stop offset=".5" stop-color="#D9433B"/><stop offset="1" stop-color="#9C2620"/></radialGradient>
<linearGradient id="pole" x1="0" x2="1"><stop offset="0" stop-color="#5E6E76"/><stop offset=".4" stop-color="#C2CED4"/><stop offset="1" stop-color="#4F5D64"/></linearGradient>
<radialGradient id="fbase" cx=".45" cy=".3" r=".8"><stop offset="0" stop-color="#8A9AA3"/><stop offset="1" stop-color="#3E4C53"/></radialGradient>`;
img("background",0,0,1000,680);
const LABEL_EDGE={stroke:"#5A3A1E","stroke-width":5,"stroke-opacity":.45,"stroke-linejoin":"round","paint-order":"stroke"};
const dark=el("rect",{x:0,y:0,width:1000,height:600,fill:"#0E2A3D",opacity:0});

/* ---------- OBSERVE scene ---------- */
const gObs=el("g",{});
const obsSun=img("sun",850,18,130,130,gObs);
function clock(cx,cy,r,parent){
  const g=el("g",{},parent);
  el("circle",{cx:cx+2,cy:cy+4,r:r+5,fill:"#000",opacity:.15},g);
  el("circle",{cx,cy,r:r+5,fill:"url(#ckR)"},g);
  el("circle",{cx,cy,r,fill:"url(#ckF)",stroke:"#0E1514","stroke-width":1.5},g);
  for(let i=0;i<12;i++){const a=i*Math.PI/6;el("line",{x1:cx+Math.cos(a)*(r-6),y1:cy+Math.sin(a)*(r-6),x2:cx+Math.cos(a)*(r-14),y2:cy+Math.sin(a)*(r-14),stroke:"#17302A","stroke-width":i%3?2:4},g);}
  const hand=el("line",{x1:cx,y1:cy,x2:cx,y2:cy-r+18,stroke:"#2B8CC4","stroke-width":6,"stroke-linecap":"round"},g);
  el("circle",{cx,cy,r:5,fill:"#17302A"},g);
  return {set(h){hand.setAttribute("transform",`rotate(${h/12*360} ${cx} ${cy})`);}};
}
const obsClock=clock(95,85,58,gObs);
function obsPlant(x,plantKey,label,sub){
  const W=352,H=440,y=169, g=el("g",{},gObs);
  img(plantKey,x,y,W,H,g);
  const bi=ASSETS.bag.bagInside, cid="clip"+label.replace(/\s/g,"");
  const cp=el("clipPath",{id:cid},defs);
  el("ellipse",{cx:x+bi[0]*W,cy:y+bi[1]*H,rx:bi[2]*W,ry:bi[3]*H},cp);
  const vap=el("g",{"clip-path":`url(#${cid})`},g), drops=el("g",{"clip-path":`url(#${cid})`},g);
  img("bag",x,y,W,H,g);
  el("text",{x:x+W/2,y:640,"text-anchor":"middle","font-size":32,"font-weight":800,fill:"#fff",text:label,...LABEL_EDGE},g);
  el("text",{x:x+W/2,y:670,"text-anchor":"middle","font-size":23,fill:"#FFF3E0",text:sub,...LABEL_EDGE},g);
  return {x,y,W,H,vap,drops,lz:ASSETS[plantKey].leafZone,bi,dropCount:0,particles:[]};
}
const PA=obsPlant(140,"plant_broad","Plant A","with leaves");
const PB=obsPlant(540,"plant_noleaves","Plant B","leaves removed");

/* ---------- LAB scene ---------- */
const gLab=el("g",{display:"none"});
const haze=el("rect",{x:0,y:0,width:1000,height:600,fill:"#FFFFFF",opacity:.1},gLab);
const sunGlow=el("circle",{cx:115,cy:95,r:95,fill:"#FFE59A",opacity:.5},gLab);
const labSun=img("sun",40,20,150,150,gLab);
const hg=el("g",{},gLab);
el("path",{d:"M55 345 A60 60 0 0 1 175 345",fill:"none",stroke:"#BFE0F2","stroke-width":16,"stroke-linecap":"round"},hg);
const humArc=el("path",{d:"",fill:"none",stroke:"#2B8CC4","stroke-width":16,"stroke-linecap":"round"},hg);
const humTxt=el("text",{x:115,y:342,"text-anchor":"middle","font-size":30,"font-weight":800,fill:"#17302A",text:"60%"},hg);
el("text",{x:115,y:378,"text-anchor":"middle","font-size":24,"font-weight":700,fill:"#17302A",text:"Humidity"},hg);
const th=el("g",{},gLab);
el("rect",{x:219,y:236,width:24,height:256,rx:12,fill:"url(#glass)",stroke:"#6E8580","stroke-width":2.5},th);
el("circle",{cx:231,cy:506,r:22,fill:"url(#bulb)",stroke:"#6E8580","stroke-width":2.5},th);
const merc=el("rect",{x:225,y:300,width:12,height:200,rx:6,fill:"#D9433B"},th);
for(let i=0;i<=5;i++){const yy=480-i*44;el("line",{x1:243,y1:yy,x2:252,y2:yy,stroke:"#55706A","stroke-width":2},th);}
const tempTxt=el("text",{x:231,y:222,"text-anchor":"middle","font-size":30,"font-weight":800,fill:"#17302A",text:"28 °C"},th);
const fg=el("g",{},gLab);
el("ellipse",{cx:852,cy:600,rx:60,ry:8,fill:"#000",opacity:.18},fg);
el("rect",{x:844,y:300,width:12,height:292,fill:"url(#pole)"},fg);
el("ellipse",{cx:850,cy:594,rx:56,ry:11,fill:"url(#fbase)"},fg);
const fanBlades=img("fan_blades",765,215,170,170,fg);
const windG=el("g",{},gLab), streaks=[];
for(let i=0;i<9;i++){const s=el("path",{d:"",stroke:"#FFFFFF","stroke-width":4,"stroke-linecap":"round",fill:"none",opacity:0},windG);streaks.push({n:s,y:150+i*36+(i%2)*10,ph:Math.random()});}
const SC={x:310,y:465,w:360,h:144};
img("scale",SC.x,SC.y,SC.w,SC.h,gLab);
const dz=ASSETS.scale.display;
const scaleTxt=el("text",{x:SC.x+(dz[0]+dz[2]/2)*SC.w,y:SC.y+(dz[1]+dz[3]*0.72)*SC.h,"text-anchor":"middle","font-size":30,"font-weight":800,fill:"#7CF29A","font-family":"ui-monospace,Menlo,Consolas,monospace",text:"1250 g"},gLab);
const PL={x:318,y:64,W:344,H:430};
const plantSway=el("g",{},gLab);
const labPlant=img("plant_broad",PL.x,PL.y,PL.W,PL.H,plantSway);
const film=el("g",{},gLab), stemDrops=el("g",{},gLab), labVap=el("g",{},gLab);
const labClock=clock(918,78,52,gLab);
el("text",{x:490,y:652,"text-anchor":"middle","font-size":24,fill:"#FFF7EA",text:"Soil covered with plastic, so only the plant loses water",...LABEL_EDGE},gLab);

/* ---------- state ---------- */
const S={tab:"observe",view:"cond",
  obs:{light:"sun",t:0,running:false,done:false,wA:0,wB:0},
  lab:{sun:60,temp:28,wind:"still",hum:60,leaf:"broad",t:0,running:false,done:false,water:0,pts:[],trials:[],saved:false},
  ch:{active:false,i:0,stars:0,got:{},fails:0}};
const COLORS=["#2B8CC4","#D9822B","#7B5EA7","#C2417A","#3E9C8F","#8A8F2E"];
const $=id=>document.getElementById(id);
const fmtH=h=>(Math.round(h*10)/10)+" h";

/* ---------- toast ---------- */
let toastTimer=null;
function toast(msg,kind,ms){ const t=$("toast"); t.textContent=msg; t.className=kind||""; t.hidden=!msg; clearTimeout(toastTimer); if(msg&&ms) toastTimer=setTimeout(()=>t.hidden=true,ms); }

/* ---------- particles ---------- */
function spawnVapour(group,zone,list,opts={}){
  const [x0,y0,x1,y1]=zone;
  const c=el("circle",{cx:0,cy:0,r:4+Math.random()*5,fill:"#B5DDF4",stroke:"#3E8FC4","stroke-width":1.3,opacity:.85},group);
  list.push({n:c,x:x0+Math.random()*(x1-x0),y:y0+Math.random()*(y1-y0),vx:(opts.vx||0)+(Math.random()-.5)*12,vy:-(18+Math.random()*24),life:0,max:1.6+Math.random()*1.2});
}
function stepParticles(list,dt){
  for(let i=list.length-1;i>=0;i--){ const p=list[i]; p.life+=dt; p.x+=p.vx*dt; p.y+=p.vy*dt; const f=p.life/p.max;
    if(f>=1){p.n.remove();list.splice(i,1);continue;}
    p.n.setAttribute("cx",p.x.toFixed(1)); p.n.setAttribute("cy",p.y.toFixed(1)); p.n.setAttribute("opacity",(0.9*(1-f*f)).toFixed(2)); }
}
function clearParticles(list){ list.forEach(p=>p.n.remove()); list.length=0; }

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

/* ---------- OBSERVE ---------- */
const OBS_Q={q:"Why did water drops form only inside bag A?",a:1,opts:[
  {t:"Plant A was watered more.",why:"Both plants were watered in the same way before the bags were tied. Look again at what is different between Plant A and Plant B."},
  {t:"Most water leaves the plant through its leaves.",why:"Plant A has leaves, so it gave out water vapour. The vapour cooled on the bag and formed drops. This loss of water from the leaves is called transpiration."},
  {t:"The bag on Plant A was older.",why:"Both bags are the same clear polythene. A bag only collects the water; it cannot make water."}]};
const obsBase={sun:100,temp:28,wind:"still",hum:60};
function obsRates(){ const sun=S.obs.light==="sun"?100:20; return {a:rate({...obsBase,sun,leaf:"broad"}),b:rate({...obsBase,sun,leaf:"none"})}; }
function addDrop(P){
  const [bx,by,rx,ry]=P.bi; let x,y,n=0;
  do{const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random());x=bx+Math.cos(a)*rx*r;y=by+Math.sin(a)*ry*r;n++;}while(y>by+ry*0.55&&n<20);
  const X=P.x+x*P.W,Y=P.y+y*P.H,R=2.5+Math.random()*4,g=el("g",{},P.drops);
  el("circle",{cx:X,cy:Y,r:R,fill:"#A9D3EE","fill-opacity":.6,stroke:"#4F95C2","stroke-width":1.2},g);
  el("circle",{cx:X-R*.35,cy:Y-R*.35,r:R*.3,fill:"#fff"},g);
}
const obsDropsFor=w=>w<2?0:Math.floor(w*1.5);
const obsText=w=>{const d=obsDropsFor(w);return d===0?"no drops":d<20?"a few drops":"many drops";};
function obsView(){
  obsClock.set(S.obs.t);
  hud(["Hours passed",fmtH(S.obs.t)],["Inside bag A",obsText(S.obs.wA)],["Inside bag B",obsText(S.obs.wB)]);
  const sunOn=S.obs.light==="sun"; obsSun.setAttribute("opacity",sunOn?1:.3); dark.setAttribute("opacity",sunOn?0:.28);
}
function obsReset(){
  Object.assign(S.obs,{t:0,running:false,done:false,wA:0,wB:0});
  [PA,PB].forEach(P=>{P.drops.innerHTML="";P.dropCount=0;clearParticles(P.particles);});
  $("obsQ").hidden=true; $("pane-observe").classList.remove("asking");
  $("obsStart").disabled=false; $("obsPause").disabled=true; $("obsPause").textContent="Pause";
  setSegDisabled("obsLight",false); toast("");
  obsView();
}
function obsTick(dt){
  if(S.obs.running){
    const r=obsRates(), dh=dt*HOURS/SECS_FOR_RUN;
    S.obs.t=Math.min(HOURS,S.obs.t+dh); S.obs.wA+=r.a*dh; S.obs.wB+=r.b*dh;
    [[PA,S.obs.wA],[PB,S.obs.wB]].forEach(([P,w])=>{const want=obsDropsFor(w);while(P.dropCount<want){addDrop(P);P.dropCount++;}});
    const lz=PA.lz, zone=[PA.x+lz[0]*PA.W,PA.y+lz[1]*PA.H,PA.x+lz[2]*PA.W,PA.y+lz[3]*PA.H];
    if(Math.random()<dt*(reduceMotion?2:r.a*2.2)) spawnVapour(PA.vap,zone,PA.particles);
    if(S.obs.t>=HOURS){ S.obs.running=false; S.obs.done=true;
      $("obsStart").disabled=true; $("obsPause").disabled=true;
      $("pane-observe").classList.add("asking"); $("obsQ").hidden=false; mcq($("obsQ"),OBS_Q); }
    obsView();
  }
  stepParticles(PA.particles,dt);
}

/* ---------- LAB ---------- */
const labSettings=()=>{const L=S.lab;return {sun:L.sun,temp:L.temp,wind:L.wind,hum:L.hum,leaf:L.leaf};};
function setRangeFill(inp){ inp.style.setProperty("--p",((inp.value-inp.min)/(inp.max-inp.min)*100)+"%"); }
function labScene(){
  const L=S.lab;
  $("sunO").textContent=L.sun+"%"; $("tempO").textContent=L.temp+" °C"; $("humO").textContent=L.hum+"%";
  ["sun","temp","hum"].forEach(id=>setRangeFill($(id)));
  labSun.setAttribute("opacity",(0.2+0.8*L.sun/100).toFixed(2));
  sunGlow.setAttribute("opacity",(0.6*L.sun/100).toFixed(2)); sunGlow.setAttribute("r",(60+50*L.sun/100).toFixed(0));
  dark.setAttribute("opacity",((1-L.sun/100)*0.42).toFixed(2));
  const fill=L.temp/50*200; merc.setAttribute("y",500-fill); merc.setAttribute("height",fill); tempTxt.textContent=L.temp+" °C";
  const f=(L.hum-20)/70, a=Math.PI*(1-f);
  humArc.setAttribute("d",`M55 345 A60 60 0 0 1 ${(115+60*Math.cos(a)).toFixed(1)} ${(345-60*Math.sin(a)).toFixed(1)}`);
  humTxt.textContent=L.hum+"%";
  haze.setAttribute("opacity",(0.05+0.5*(L.hum-20)/70).toFixed(2));
  labPlant.setAttribute("href",src(PLANT_KEY[L.leaf]));
  const so=ASSETS[PLANT_KEY[L.leaf]].soil; film.innerHTML="";
  el("ellipse",{cx:PL.x+so[0]*PL.W,cy:PL.y+so[1]*PL.H,rx:so[2]*PL.W+6,ry:12,fill:"#E8F3FA","fill-opacity":.55,stroke:"#8FB3C8","stroke-width":2},film);
}
function labHud(){
  const L=S.lab; labClock.set(L.t); scaleTxt.textContent=Math.round(1250-L.water)+" g";
  if(L.t>0){ const r=rate(labSettings()), band=r<5?"Slow":r<15?"Medium":"Fast", cool=Math.min(8,r*0.25);
    const part=L.leaf==="none"?"Stem":L.leaf==="spines"?"Cactus":"Leaf";
    hud(["Water lost in "+fmtH(L.t),Math.round(L.water)+" mL"],["Rate: "+band,r.toFixed(1)+" mL/h"],[part+" is cooler by",cool.toFixed(1)+" °C"],Math.min(100,r/32*100));
  } else hud(["Water lost","0 mL"],["Rate","–"],["Cooling effect","–"],0);
}
function setView(v){ S.view=v; segSet("subTabs",v); $("viewCond").hidden=v!=="cond"; $("viewRes").hidden=v!=="res"; if(v==="res") $("resDot").hidden=true; updCondGraph(); }
function updCondGraph(){ $("condGraph").hidden = S.ch.active || S.view!=="cond" || !(S.lab.t>0 || S.lab.running || S.lab.trials.length); }
function setLabLocked(lock){
  ["sun","temp","hum"].forEach(id=>$(id).disabled=lock); setSegDisabled("wind",lock); setSegDisabled("leaf",lock);
}
const labParticles=[], stemList=[];
function labReset(keepMsg){
  Object.assign(S.lab,{t:0,running:false,done:false,water:0,pts:[],saved:false});
  clearParticles(labParticles); stemDrops.innerHTML=""; stemList.length=0;
  $("labRun").disabled=false; $("labPause").disabled=true; $("labPause").textContent="Pause"; $("labSave").disabled=true;
  setLabLocked(false); if(!keepMsg) toast("");
  labHud(); drawGraph(); if(typeof updCondGraph==="function") updCondGraph();
}
let fanAngle=0,swayT=0,streakT=0;
function labTick(dt){
  const L=S.lab, r=rate(labSettings());
  fanAngle=(fanAngle+{still:0,breeze:5,strong:11}[L.wind]*dt*57.3)%360;
  fanBlades.setAttribute("transform",`rotate(${fanAngle.toFixed(1)} 850 300)`);
  streakT+=dt*(L.wind==="strong"?1.2:0.7);
  const nS={still:0,breeze:5,strong:9}[L.wind];
  streaks.forEach((s,i)=>{ if(i>=nS){s.n.setAttribute("opacity",0);return;}
    const p=(streakT+s.ph)%1,x=760-p*560; s.n.setAttribute("d",`M${x} ${s.y} q -30 -10 -70 0`); s.n.setAttribute("opacity",(0.8*Math.sin(p*Math.PI)).toFixed(2)); });
  swayT+=dt; const amp=reduceMotion?0:{still:0,breeze:1.6,strong:3.5}[L.wind];
  plantSway.setAttribute("transform",`rotate(${(-amp*(0.6+0.4*Math.sin(swayT*3))).toFixed(2)} ${PL.x+PL.W/2} ${PL.y+PL.H*0.98})`);
  if(L.running){
    const dh=dt*HOURS/SECS_FOR_RUN; L.t=Math.min(HOURS,L.t+dh); L.water+=r*dh;
    if(!L.pts.length||L.t-L.pts[L.pts.length-1][0]>=0.1) L.pts.push([L.t,L.water]);
    const lz=ASSETS[PLANT_KEY[L.leaf]].leafZone, zone=[PL.x+lz[0]*PL.W,PL.y+lz[1]*PL.H,PL.x+lz[2]*PL.W,PL.y+lz[3]*PL.H];
    const perSec=Math.min(reduceMotion?6:40,0.6+r*1.3), vx=-{still:0,breeze:45,strong:95}[L.wind];
    let n=perSec*dt; while(n>0){ if(Math.random()<Math.min(1,n)) spawnVapour(labVap,zone,labParticles,{vx}); n-=1; }
    const st=ASSETS[PLANT_KEY[L.leaf]].stem;
    if(Math.random()<dt*Math.min(6,0.4+r*0.2)){ const c=el("ellipse",{cx:PL.x+st[0]*PL.W,cy:0,rx:4,ry:5.5,fill:"#2B8CC4"},stemDrops); stemList.push({n:c,y:PL.y+st[2]*PL.H,top:PL.y+st[1]*PL.H}); }
    if(L.t>=HOURS){ L.running=false; L.done=true; labFinish(); }
    labHud(); drawGraph();
  }
  const sp=40+r*3;
  for(let i=stemList.length-1;i>=0;i--){ const d=stemList[i]; d.y-=sp*dt; if(d.y<=d.top){d.n.remove();stemList.splice(i,1);continue;} d.n.setAttribute("cy",d.y.toFixed(1)); }
  stepParticles(labParticles,dt);
}
function labFinish(){
  $("labRun").disabled=true; $("labPause").disabled=true;
  const w=Math.round(S.lab.water);
  if(S.ch.active) checkLabTask(w);
  else { $("labSave").disabled=false; toast(`Done! The plant lost ${w} mL of water in 6 hours. Tap Save trial to keep it.`); }
}

/* ---------- graph + trials ---------- */
const GRAPHS=[$("graph"),$("graphC")];
const gx=h=>40+h/6*344, gy=w=>130-Math.min(w,200)/200*110;
function drawGraph(){ GRAPHS.forEach(drawGraphIn); drawLegend(); }
function drawLegend(){
  $("legend").innerHTML=S.lab.trials.map(t=>`<span><span class="sw" style="background:${t.color}"></span>T${t.no} ${t.w} mL</span>`).join("")
    +(!S.lab.saved&&S.lab.t>0?`<span><span class="sw" style="background:#17302A"></span>This run: ${Math.round(S.lab.water)} mL</span>`:"");
}
function drawGraphIn(graph){
  graph.innerHTML=""; const g=(t,a)=>el(t,a,graph);
  for(let w=0;w<=200;w+=50){ g("line",{x1:40,y1:gy(w),x2:384,y2:gy(w),stroke:"#E3ECE7"}); g("text",{x:34,y:gy(w)+5,"text-anchor":"end","font-size":13,fill:"#55706A",text:w}); }
  for(let h=0;h<=6;h++) g("text",{x:gx(h),y:146,"text-anchor":"middle","font-size":13,fill:"#55706A",text:h});
  g("line",{x1:40,y1:130,x2:384,y2:130,stroke:"#55706A","stroke-width":1.5}); g("line",{x1:40,y1:18,x2:40,y2:130,stroke:"#55706A","stroke-width":1.5});
  g("text",{x:384,y:159,"text-anchor":"end","font-size":13,fill:"#17302A",text:"Hours"});
  g("text",{x:4,y:12,"font-size":13,"font-weight":700,fill:"#17302A",text:"Water lost (mL)"}); g("text",{x:384,y:12,"text-anchor":"end","font-size":12,fill:"#55706A",text:"steeper line = faster loss"});
  const line=(pts,col,wd,dash)=>{ if(pts.length<2)return; g("polyline",{points:pts.map(p=>gx(p[0]).toFixed(1)+","+gy(p[1]).toFixed(1)).join(" "),fill:"none",stroke:col,"stroke-width":wd,"stroke-linejoin":"round","stroke-dasharray":dash||""}); };
  S.lab.trials.forEach(t=>line(t.pts,t.color,2.5));
  if(!S.lab.saved) line([[0,0],...S.lab.pts],"#17302A",3.5,S.lab.done?"":"6 4");
}
function drawTrials(){
  const b=$("trialBody");
  if(!S.lab.trials.length){ b.innerHTML=`<tr><td colspan="7" class="small" style="white-space:normal">No trials yet. Run the plant, then tap Save trial.</td></tr>`; return; }
  b.innerHTML=S.lab.trials.map(t=>`<tr><td><span class="sw" style="background:${t.color}"></span>${t.no}</td><td>${LEAF_NAME[t.s.leaf]}</td><td>${t.s.sun}%</td><td>${t.s.temp} °C</td><td>${WIND_NAME[t.s.wind]}</td><td>${t.s.hum}%</td><td><b>${t.w} mL</b></td></tr>`).join("");
}
let trialNo=0;
function saveTrial(){
  const L=S.lab, s=labSettings(), last=L.trials[L.trials.length-1], w=Math.round(L.water);
  let note=`Saved as trial ${trialNo+1}. Change one condition and run again.`, kind="";
  if(last){ const ks=Object.keys(s).filter(k=>s[k]!==last.s[k]);
    if(ks.length>1){ note=`Saved. You changed ${ks.length} things since the last trial. Change only one to see what it does.`; kind="info"; }
    else if(ks.length===1){ const nm={sun:"sunlight",temp:"temperature",wind:"wind",hum:"humidity",leaf:"leaf type"}[ks[0]];
      note=`Fair test: only the ${nm} changed. Water lost went ${w>last.w?"up":"down"} from ${last.w} to ${w} mL.`; } }
  trialNo++;
  L.trials.push({no:trialNo,s,w,pts:[[0,0],...L.pts],color:COLORS[(trialNo-1)%COLORS.length]});
  if(L.trials.length>6) L.trials.shift();
  L.saved=true; $("labSave").disabled=true;
  toast(note,kind); drawTrials(); drawGraph(); $("resDot").hidden=false;
}

/* ---------- CHALLENGE ---------- */
const TASKS=[
  {type:"lab",text:"Make the plant lose more than 120 mL of water in 6 hours.",
   check:w=>w>120, ok:w=>`Great! It lost ${w} mL. Sun, heat, wind and dry air all speed up transpiration.`,
   no:[w=>`It lost ${w} mL. Which conditions dry wet clothes the fastest? Tap Reset and try again.`,
       w=>`It lost ${w} mL. Try full sunlight, a temperature above 40 °C, strong wind and humidity at 20%.`]},
  {type:"lab",text:"Desert day! It is hot (42 °C), dry (20% humidity), sunny and windy. Pick the leaf type that loses less than 25 mL in 6 hours.",
   lock:{sun:100,temp:42,wind:"strong",hum:20}, leaves:["broad","spines"],
   check:(w,s)=>s.leaf==="spines"&&w<25, ok:w=>`Yes! With spines the cactus lost only ${w} mL. Spines are leaves that reduce transpiration.`,
   no:[w=>`It lost ${w} mL, far too much for the desert. Which leaf type has the least surface? Tap Reset and try again.`,
       w=>`It lost ${w} mL. Choose Spines (cactus): spines have very little surface, so they lose very little water.`]},
  {type:"mcq",q:"The air in a room becomes very humid. What happens to transpiration?",a:1,opts:[
    {t:"It speeds up.",why:"Think of wet clothes on a humid monsoon day. Do they dry faster than on a dry day?"},
    {t:"It slows down.",why:"Humid air already holds a lot of water vapour, so less water evaporates from the leaves."},
    {t:"It stays the same.",why:"Humidity does affect evaporation. Wet clothes dry at different speeds on a dry day and a humid day."}]},
  {type:"mcq",q:"Why do you feel cool under a tree on a hot afternoon?",a:1,opts:[
    {t:"The tree blocks all the wind.",why:"Blocking the wind would not cool you; a breeze actually helps you feel cool. Think about what the leaves give out."},
    {t:"Water evaporating from the leaves takes away heat.",why:"This is the cooling effect of transpiration. Evaporation takes heat from the leaves and cools the air around them."},
    {t:"The roots send cold air up the stem.",why:"Roots absorb water and minerals, not air. Think about what happens to water at the leaf surface."}]},
  {type:"mcq",q:"When the leaves lose more water, what do the roots do?",a:0,opts:[
    {t:"Absorb more water along with minerals.",why:"Water lost from the leaves pulls more water up from the roots. This transpirational pull also brings up minerals."},
    {t:"Stop absorbing water.",why:"If the roots stopped, the plant would wilt as the leaves keep losing water. Think about how the plant replaces lost water."},
    {t:"Push water back into the soil.",why:"Water moves one way in a plant: from the soil, up the stem, to the leaves. Think about what the plant needs when leaves lose water."}]}
];
function award(){ const ch=S.ch; if(!ch.got[ch.i]){ch.got[ch.i]=true;ch.stars++;} $("score").textContent=`★ ${ch.stars} / ${TASKS.length}`; }
function showOnly(ids){ ["subTabs","viewCond","condGraph","viewRes","mcqBox","endCard","labBtns","chNav","endNav","chCard"].forEach(id=>$(id).hidden=!ids.includes(id)); }
function showTask(){
  const ch=S.ch, t=TASKS[ch.i]; ch.fails=0;
  $("taskNo").textContent=`Task ${ch.i+1} of ${TASKS.length}`; $("taskFb").textContent=""; $("taskFb").className="fb"; toast("");
  ["c-sun","c-temp","c-hum","c-wind"].forEach(id=>$(id).hidden=false);
  $("leaf").querySelectorAll("button").forEach(b=>b.hidden=false);
  $("labSave").hidden=true;
  if(t.type==="lab"){
    $("taskText").textContent=t.text;
    showOnly(["chCard","viewCond","labBtns"]);
    if(t.lock){ Object.assign(S.lab,t.lock); S.lab.leaf="broad"; syncControls(); ["c-sun","c-temp","c-hum","c-wind"].forEach(id=>$(id).hidden=true); }
    if(t.leaves) $("leaf").querySelectorAll("button").forEach(b=>b.hidden=!t.leaves.includes(b.dataset.v));
    labScene(); labReset();
  } else {
    $("taskText").textContent="Choose the best answer.";
    showOnly(["chCard","mcqBox"]);
    mcq($("mcqBox"),t,first=>{ if(first) award(); $("chNav").hidden=false; });
  }
}
function checkLabTask(w){
  const t=TASKS[S.ch.i], ok=t.check(w,labSettings()), fb=$("taskFb");
  if(ok){ award(); Sound.play("ok"); toast(t.ok(w),"ok"); $("labBtns").hidden=true; $("chNav").hidden=false; }
  else { Sound.play("no"); toast(t.no[Math.min(S.ch.fails,1)](w),"no"); S.ch.fails++; }
}
function nextTask(){ S.ch.i++; if(S.ch.i>=TASKS.length) endChallenge(); else showTask(); }
function endChallenge(){
  showOnly(["endCard","endNav"]);
  const s=S.ch.stars; $("endStars").textContent="★".repeat(s)+"☆".repeat(TASKS.length-s);
  $("endText").textContent=s===5?"Perfect score! You are a transpiration expert.":s>=3?`You got ${s} stars. Go back to the Experiment tab to test the ideas you missed.`:`You got ${s} stars. Try the Experiment tab again, then play again.`;
}
function startChallenge(){ Object.assign(S.ch,{active:true,i:0,stars:0,got:{},fails:0}); $("score").textContent=`★ 0 / ${TASKS.length}`; showTask(); }

/* ---------- controls ---------- */
function segInit(id,cb){ const box=$(id); box.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{ if(b.disabled)return; segSet(id,b.dataset.v); cb(b.dataset.v); })); }
function segSet(id,v){ $(id).querySelectorAll("button").forEach(x=>x.setAttribute("aria-pressed",x.dataset.v===v?"true":"false")); }
function setSegDisabled(id,dis){ $(id).querySelectorAll("button").forEach(x=>x.disabled=dis); }
function syncControls(){ const L=S.lab; $("sun").value=L.sun; $("temp").value=L.temp; $("hum").value=L.hum; segSet("wind",L.wind); segSet("leaf",L.leaf); }
function onLabChange(){ if(S.lab.t>0&&!S.lab.running) labReset(); labScene(); }
["sun","temp","hum"].forEach(id=>$(id).addEventListener("input",e=>{S.lab[id]=+e.target.value;onLabChange();}));
segInit("wind",v=>{S.lab.wind=v;onLabChange();});
segInit("leaf",v=>{S.lab.leaf=v;onLabChange();});
segInit("obsLight",v=>{S.obs.light=v;obsView();});
segInit("subTabs",v=>setView(v));

$("obsStart").onclick=()=>{ S.obs.running=true; $("obsStart").disabled=true; $("obsPause").disabled=false; $("obsPause").textContent="Pause"; setSegDisabled("obsLight",true); };
$("obsPause").onclick=()=>{ if(S.obs.done)return; S.obs.running=!S.obs.running; $("obsPause").textContent=S.obs.running?"Pause":"Resume"; };
$("obsReset").onclick=obsReset;
$("labRun").onclick=()=>{ S.lab.running=true; $("labRun").disabled=true; $("labPause").disabled=false; $("labPause").textContent="Pause"; setLabLocked(true); toast(""); if(!S.ch.active) updCondGraph(); else {$("taskFb").textContent="";$("taskFb").className="fb";} };
$("labPause").onclick=()=>{ if(S.lab.done)return; S.lab.running=!S.lab.running; $("labPause").textContent=S.lab.running?"Pause":"Resume"; };
$("labReset").onclick=()=>{ labReset(); if(!S.ch.active) setView("cond"); };
$("labSave").onclick=saveTrial;
$("taskNext").onclick=()=>{toast("");nextTask();};
$("again").onclick=startChallenge;

function setTab(tab){
  S.obs.running=false; S.lab.running=false;
  if(S.obs.t>0&&!S.obs.done) $("obsPause").textContent="Resume";
  if(S.lab.t>0&&!S.lab.done) $("labPause").textContent="Resume";
  S.tab=tab; toast("");
  document.querySelectorAll("#tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===tab?"true":"false"));
  $("pane-observe").classList.toggle("on",tab==="observe"); $("pane-lab").classList.toggle("on",tab!=="observe");
  gObs.setAttribute("display",tab==="observe"?"inline":"none"); gLab.setAttribute("display",tab==="observe"?"none":"inline");
  $("score").hidden=tab!=="challenge";
  if(tab==="observe") obsView();
  else if(tab==="challenge") startChallenge();
  else {
    S.ch.active=false;
    showOnly(["subTabs","viewCond","labBtns"]); $("labSave").hidden=false;
    ["c-sun","c-temp","c-hum","c-wind"].forEach(id=>$(id).hidden=false);
    $("leaf").querySelectorAll("button").forEach(b=>b.hidden=false);
    syncControls(); labScene(); labReset(); setView("cond");
  }
  maybeTour(tab);
}
document.querySelectorAll("#tabs button").forEach(b=>b.addEventListener("click",()=>{ if(!tourOn) setTab(b.dataset.tab); }));

/* ---------- HOW TO USE: guided tour ---------- */
const TOURS={
  observe:[
    {s:"#soundBtn",t:"Welcome to Leaf Lab",x:"See how plants lose water through their leaves. This quick tour takes under a minute. Sound plays for right and wrong answers; tap this speaker button to turn it off or on.",g:"tap"},
    {s:"#tabs",t:"Three parts, in order",x:"Start with Observe, then Experiment, then Challenge. Tap a tab to move between them.",g:"tap",h:"#tabs button[data-tab='lab']"},
    {s:"#stagebox",t:"The experimental set-up",x:"Plant A has leaves and Plant B has its leaves removed. Both are covered with clear polythene bags."},
    {s:"#obsLight",t:"Sunlight or shade",x:"Choose where to keep the plants before you start.",g:"tap",h:"#obsLight button[data-v='shade']"},
    {s:"#obsStart",t:"Fast-forward 6 hours",x:"Tap Start. Six hours pass in about 12 seconds. A question then appears below your choice. Use Pause to stop and talk, and Reset to begin again.",g:"tap"},
    {s:"#hud",t:"What happened?",x:"These boxes show the time and the water collected in each bag. A question appears when the run ends."},
    {s:"#helpBtn",t:"See this again any time",x:"Tap Help (?) to replay the tour for the part you are on.",g:"tap"}],
  lab:[
    {s:"#viewCond",t:"Set the conditions",x:"Drag the sliders and tap the buttons to change sunlight, temperature, humidity, wind and leaf type. The scene changes as you go.",g:"drag",h:"#sun"},
    {s:"#labRun",t:"Run the experiment",x:"Tap Run 6 hours. The plant stands on a scale, so you see it get lighter. A graph of water lost appears below the conditions.",g:"tap"},
    {s:"#hud",t:"Read the results",x:"Water lost, the rate meter and the cooling effect update while the plant runs."},
    {s:"#labSave",t:"Save each trial",x:"When an experiment ends, tap Save trial. Then change only one condition and experiment again for a fair test.",g:"tap"},
    {s:"#subTabs",t:"Compare your trials",x:"Saved trials stay on the graph in their own colours. Results also lists every trial in a table.",g:"tap",h:"#subTabs button[data-v='res']"}],
  challenge:[
    {s:"#chCard",t:"Five tasks",x:"Read the task here. Two tasks use the lab and three are questions."},
    {s:"#score",t:"Earn stars",x:"Each task solved gives a star. For questions, the star counts only on the first try."},
    {s:"#panel",t:"Feedback helps you learn",x:"A wrong answer explains why it is wrong. After two wrong tries, the correct answer is shown with the reason."}]
};
let tourOn=false, tourSteps=[], tourI=0;
const seen={};
function storeGet(k){ try{return localStorage.getItem(k);}catch(e){return seen[k]||null;} }
function storeSet(k,v){ v=v||"1"; try{localStorage.setItem(k,v);}catch(e){} seen[k]=v; }
/* Tours play on every fresh launch (shared school devices): each tab's tour shows on its first visit in this session only. */
const toured={};
function maybeTour(tab){ if(!toured[tab]){ toured[tab]=true; setTimeout(()=>startTour(tab),250); } }
function startTour(tab){
  S.obs.running=false; S.lab.running=false;
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
  if(st.g){ const hr=st.h?rectIn(document.querySelector(st.h)):r; /* fingertip sits ~16px right of and ~4px below the hand's top-left corner */
    hand.style.left=(hr.x+hr.w/2-16)+"px"; hand.style.top=(hr.y+hr.h/2-2)+"px"; }
}
$("tNext").onclick=()=>{ if(tourI<tourSteps.length-1){tourI++;placeTour();} else endTour(); };
$("tBack").onclick=()=>{ if(tourI>0){tourI--;placeTour();} };
$("tskip").onclick=endTour;
$("soundBtn").onclick=()=>{ Sound.set(!Sound.on); storeSet("leaflab-sound",Sound.on?"on":"off"); if(Sound.on){Sound.ensure();Sound.play("ok");} };
Sound.set(storeGet("leaflab-sound")!=="off");
$("helpBtn").onclick=()=>{ if(!tourOn) startTour(S.tab); };
document.addEventListener("keydown",e=>{ if(!tourOn)return; if(e.key==="Escape")endTour(); if(e.key==="ArrowRight")$("tNext").click(); if(e.key==="ArrowLeft")$("tBack").click(); });

/* ---------- loop ---------- */
let last=performance.now();
function loop(now){ const dt=Math.min(0.05,(now-last)/1000); last=now;
  if(!tourOn){ if(S.tab==="observe") obsTick(dt); else labTick(dt); }
  requestAnimationFrame(loop); }
fit(); syncControls(); labScene(); labReset(); drawTrials(); setView("cond"); obsReset();
requestAnimationFrame(loop);
maybeTour("observe");
