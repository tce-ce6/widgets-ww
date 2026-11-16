const CATIONS=[
 {id:'H', html:'H', name:'Hydrogen', v:1, col:'#4f9a96'},
 {id:'K', html:'K', name:'Potassium', v:1, col:'#5b2d7a'},
 {id:'Ca',html:'Ca',name:'Calcium', v:2, col:'#7a5a3a'},
 {id:'Fe',html:'Fe',name:'Iron(III)', v:3, col:'#4c5e5a'},
 {id:'Na',html:'Na',name:'Sodium', v:1, col:'#1f6475'},
 {id:'Mg',html:'Mg',name:'Magnesium', v:2, col:'#4a5a63'},
 {id:'Al',html:'Al',name:'Aluminium', v:3, col:'#5c6f6a'},
 {id:'NH4',html:'NH<sub>4</sub>',name:'Ammonium', v:1, col:'#8a5aa0', poly:true, atoms:'1 N + 4 H'}
];
const ANIONS=[
 {id:'Cl', html:'Cl', name:'Chloride', v:1, col:'#4e8a3a'},
 {id:'O',  html:'O',  name:'Oxide', v:2, col:'#8a4a3c'},
 {id:'N',  html:'N',  name:'Nitride', v:3, col:'#7a6a2c'},
 {id:'SO4',html:'SO<sub>4</sub>',name:'Sulfate', v:2, col:'#6a5a40', poly:true, atoms:'1 S + 4 O'},
 {id:'OH', html:'OH', name:'Hydroxide', v:1, col:'#3e5a66', poly:true, atoms:'1 O + 1 H'},
 {id:'Br', html:'Br', name:'Bromide', v:1, col:'#6a4a2e'},
 {id:'S',  html:'S',  name:'Sulfide', v:2, col:'#7a8a2a'},
 {id:'NO3',html:'NO<sub>3</sub>',name:'Nitrate', v:1, col:'#9a3a30', poly:true, atoms:'1 N + 3 O'},
 {id:'CO3',html:'CO<sub>3</sub>',name:'Carbonate', v:2, col:'#1e4a80', poly:true, atoms:'1 C + 3 O'}
];
const SPECIAL={'H|O':'Water','H|SO4':'Sulfuric Acid','H|NO3':'Nitric Acid','H|CO3':'Carbonic Acid'};
const BLOCKED=new Set(['H|N','H|OH','NH4|N','NH4|O']);
let cat=null, an=null, applied=false, timers=[];
const later=(ms,fn)=>timers.push(setTimeout(fn,ms));
const stopAll=()=>{timers.forEach(clearTimeout);timers=[];};

const $=id=>document.getElementById(id);
const gcd=(a,b)=>b?gcd(b,a%b):a;
const chg=(ion,s)=>`${ion.v}${s}`;
function part(ion,n){ if(n===1) return ion.html; return ion.poly?`(${ion.html})<sub>${n}</sub>`:`${ion.html}<sub>${n}</sub>`; }
function calc(){ const a=cat.v,b=an.v,g=gcd(a,b);
  return {a,b,g,fc:b/g,fa:a/g,raw:part(cat,b)+part(an,a),fin:part(cat,b/g)+part(an,a/g)}; }
const cname=()=>SPECIAL[cat.id+'|'+an.id]||`${cat.name} ${an.name}`;

function fit(){const s=Math.min(innerWidth/1420,innerHeight/747);$('stage').style.transform=`scale(${s})`;}
addEventListener('resize',fit);

function buildTrays(){
  const mk=(list,tray,s,kind)=>list.forEach(ion=>{
    const b=document.createElement('button');
    b.className='tile'; b.style.setProperty('--c',ion.col); b.dataset.id=ion.id;
    b.innerHTML=`<b>${ion.html}</b><span>${chg(ion,s)}</span>`;
    b.onclick=()=>pick(kind,ion); $(tray).appendChild(b);
  });
  mk(CATIONS,'catTray','+','cat'); mk(ANIONS,'anTray','-','an');
}
function pick(kind,ion){
  if(applied) return;
  const c=kind==='cat'?ion:cat, a=kind==='an'?ion:an;
  if(c&&a&&BLOCKED.has(c.id+'|'+a.id)){
    toast(`${c.html} (${chg(c,'+')}) and ${a.html} (${chg(a,'-')}) do not form a compound here. Pick another ion.`); return;
  }
  if(kind==='cat') cat=ion; else an=ion;
  render();
}
let tt;
function toast(h){const t=$('toast');t.innerHTML='✘ '+h;t.classList.add('show');clearTimeout(tt);tt=setTimeout(()=>t.classList.remove('show'),2600);}

const ball=(ion,s,x,y,id)=>`<div class="ball ${ion.poly?'poly':''}" style="--c:${ion.col};${x!=null?`left:${x}px;top:${y}px`:''}"><b${id?` id="${id}"`:''}>${ion.html}</b><span>${chg(ion,s)}</span></div>`;

function chargeRow(){
  return `<div class="clbl">Charge</div>`+
    (cat?`<div class="chg c" style="left:80px">${chg(cat,'+')}</div>`:'')+
    (an?`<div class="chg a" style="left:280px">${chg(an,'-')}</div>`:'');
}
function selectionView(){ // before Apply: show the selected ion(s)
  let h='';
  if(cat||an) h+=chargeRow();
  if(cat) h+=ball(cat,'+',85,20)+(cat.poly?`<div class="cap" style="left:50px">(polyatomic ion)</div>`:'');
  if(an)  h+=ball(an,'-',285,20)+(an.poly?`<div class="cap" style="left:250px">(polyatomic ion)</div>`:'');
  return h;
}
function crossView(r){ // criss-cross animation
  const svg=`<svg class="cross">
    <path class="ln" pathLength="100" d="M175,200 L275.6,124.8" stroke="#000"/>
    <polygon class="hd" points="290,114 281,132 270.2,117.6" style="animation-delay:1.6s"/>
    <path class="ln" pathLength="100" d="M285,200 L184.4,124.8" stroke="#000" style="animation-delay:1.8s"/>
    <polygon class="hd" points="170,114 189.8,117.6 179,132" style="animation-delay:3.4s"/></svg>`;
  return `<div class="show">`+ball(cat,'+',85,20,'symA')+ball(an,'-',285,20,'symB')+
    chargeRow()+
    `<div class="cnt" id="cntB" style="left:250px;top:86px;color:#ff2a2a">${r.a}</div>`+
    `<div class="cnt second" id="cntA" style="left:146px;top:104px;color:#3a46ff">${r.b}</div>`+svg+`<div class="divl" id="divl">÷ ${r.g}</div></div>`;
}
function countView(r){ // after Apply: ions in one formula unit
  let h='<div class="row">';
  for(let i=0;i<r.fc;i++) h+=ball(cat,'+');
  for(let i=0;i<r.fa;i++) h+=ball(an,'-');
  h+=`</div><div class="ratio">${r.fc} ${cat.html}<sup>${cat.v>1?cat.v:''}+</sup> ion${r.fc>1?'s':''} : ${r.fa} ${an.html}<sup>${an.v>1?an.v:''}-</sup> ion${r.fa>1?'s':''}<br>Charges: (+${r.a} × ${r.fc}) + (−${r.b} × ${r.fa}) = 0</div>`;
  return h;
}
function explanation(r){
  const L=[];
  [cat,an].forEach(ion=>{ if(ion.poly) L.push(`• ${ion.html} is a group of atoms. It acts as one unit.`); });
  L.push(`• ${cat.html} gives its charge ${r.a} to ${an.html}.`);
  L.push(`• ${an.html} gives its charge ${r.b} to ${cat.html}.`);
  if(r.g>1) L.push(`• Ratio (${r.b}:${r.a}) simplifies down to (${r.fc}:${r.fa}).`);
  [[cat,r.fc],[an,r.fa]].forEach(([ion,n])=>{ if(!ion.poly) return;
    L.push(n>1?`• There are ${n} ${ion.html} groups, so put ${ion.html} in brackets.`:`• Only 1 ${ion.html}, so no brackets.`); });
  if(r.fc===1||r.fa===1) L.push(`• We do not write 1.`);
  return '<b>Explanation:</b><br>'+L.join('<br>')+`<br><b>Result: ${r.fin}</b>`;
}

function render(){
  document.querySelectorAll('#catTray .tile').forEach(b=>{b.classList.toggle('sel',!!cat&&b.dataset.id===cat.id);b.classList.toggle('dim',applied);});
  document.querySelectorAll('#anTray .tile').forEach(b=>{b.classList.toggle('sel',!!an&&b.dataset.id===an.id);b.classList.toggle('dim',applied);});
  $('apply').disabled=!(cat&&an)||applied;
  if(!applied){
    $('symArea').innerHTML=selectionView();
    $('bigF').innerHTML=''; $('resR').innerHTML='';
    $('resL').innerHTML=`<div>${cat&&an?'Tap <b>Apply criss cross method</b>':'Select a cation and an anion'}</div>`;
  }
}
function symHTML(ion,n){
  if(n===1) return ion.html;
  return ion.poly?`(${ion.html})<sub class="ns">${n}</sub>`:`${ion.html}<sub class="ns">${n}</sub>`;
}
function slide(cnt,sym,n){ // move crossed number down into subscript place
  const sc=$('stage').getBoundingClientRect().width/1410;
  const c=cnt.getBoundingClientRect(), t=sym.getBoundingClientRect();
  cnt.style.animation='none'; cnt.style.opacity='1'; void cnt.offsetWidth;
  cnt.style.transition='transform 1.1s ease, opacity 1.1s ease';
  cnt.style.transform=`translate(${(t.right-c.left)/sc}px,${(t.bottom-c.bottom)/sc+8}px) scale(.6)`;
  if(n===1) cnt.style.opacity='0';
}
$('apply').onclick=()=>{
  if(!(cat&&an)||applied) return;
  applied=true; render();
  const r=calc();
  $('symArea').innerHTML=crossView(r);
  stopAll();
  later(4300,()=>{ slide($("cntB"),$("symB"),r.a); slide($("cntA"),$("symA"),r.b); });
  later(5500,()=>{ $('cntA').style.opacity='0'; $('cntB').style.opacity='0';
    $('symA').innerHTML=symHTML(cat,r.b); $("symB").innerHTML=symHTML(an,r.a); });
  let t=5500;
  if(r.g>1){
    later(6300,()=>{ $('divl').style.opacity='1'; });
    later(7500,()=>{ $('symA').innerHTML=symHTML(cat,r.fc); $('symB').innerHTML=symHTML(an,r.fa); $('divl').style.opacity='0'; });
    t=7500;
  }
  later(t+600,()=>{
    $('bigF').innerHTML=r.fin;
    $('resL').innerHTML=`<div>Compound name: ${cname()}</div><div class="big">${r.fin}</div><div>(${r.fc}${cat.html} x ${r.fa}${an.html})</div>`;
    $('resR').innerHTML=explanation(r);
  });
};
$('tryBtn').onclick=()=>{stopAll();cat=null;an=null;applied=false;render();};
$('rules').onclick=()=>$('modal').classList.add('open');
$('close').onclick=()=>$('modal').classList.remove('open');
$('modal').onclick=e=>{ if(e.target===$('modal')) $('modal').classList.remove('open'); };
addEventListener('keydown',e=>{ if(e.key==='Escape') $('modal').classList.remove('open'); });
buildTrays(); fit(); render();
