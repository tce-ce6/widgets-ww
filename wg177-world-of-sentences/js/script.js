var entries=[
  {name:"India",loc:"Taj Mahal, Agra",cardImg:"./assets/india.svg",flag:"🇮🇳",bg:"bg-india",
   sentences:[
    {t:"The Taj Mahal is a huge white building made entirely of marble.",type:"d",exp:"This sentence tells us a fact. It makes a statement and ends with a full stop."},
    {t:"It was built by an emperor a very long time ago as a gift for his wife.",type:"d",exp:"This sentence gives information. It ends with a full stop."},
    {t:"What a long and tiring journey it was to reach Agra by train!",type:"e",exp:"This sentence begins with \"What\" and expresses a strong feeling. It ends with an exclamation mark."},
    {t:"How breathtaking it was to finally see it standing there in real life!",type:"e",exp:"This sentence begins with \"How\" and expresses wonder. It ends with an exclamation mark."},
    {t:"Is it really one of the seven wonders of the world?",type:"i",exp:"This sentence asks a question. It ends with a question mark."}
  ]},
  {name:"Kenya",loc:"Maasai Mara",cardImg:"./assets/kenya.svg",flag:"🇰🇪",bg:"bg-kenya",
   sentences:[
    {t:"Have I ever had a day as exciting as today?",type:"i",exp:"This sentence asks a question. It ends with a question mark."},
    {t:"The jeep drove slowly through tall golden grass as the sun came up.",type:"d",exp:"This sentence describes a scene. It ends with a full stop."},
    {t:"Was that really a lion sleeping under that tree just a few metres away?",type:"i",exp:"This sentence asks a question. It ends with a question mark."},
    {t:"A family of elephants walked right past us without even looking our way.",type:"d",exp:"This sentence states what happened. It ends with a full stop."},
    {t:"How incredible it was to be so close to such giant animals!",type:"e",exp:"This sentence begins with \"How\" and expresses amazement. It ends with an exclamation mark."}
  ]},
  {name:"Japan",loc:"Kyoto",cardImg:"./assets/japan.svg",flag:"🇯🇵",bg:"bg-japan",
   sentences:[
    {t:"What a surprise it was to see so many pink and white trees lining every street!",type:"e",exp:"This sentence begins with \"What\" and expresses surprise. It ends with an exclamation mark."},
    {t:"Kyoto is one of the oldest and most visited cities in Japan.",type:"d",exp:"This sentence states a fact. It ends with a full stop."},
    {t:"The streets were so quiet and clean that it felt like a different world.",type:"d",exp:"This sentence describes an observation. It ends with a full stop."},
    {t:"Do all Japanese cities look as neat and beautiful as this one?",type:"i",exp:"This sentence asks a question. It ends with a question mark."},
    {t:"Can cherry blossom trees really only bloom for one week every year?",type:"i",exp:"This sentence asks a question. It ends with a question mark."}
  ]},
  {name:"Brazil",loc:"Amazon Rainforest",cardImg:"./assets/brazil.svg",flag:"🇧🇷",bg:"bg-brazil",
   sentences:[
    {t:"The Amazon rainforest is the biggest forest in the whole world.",type:"d",exp:"This sentence states a fact. It ends with a full stop."},
    {t:"What a shock it was to see a bright blue parrot fly right past my head!",type:"e",exp:"This sentence begins with \"What\" and expresses shock. It ends with an exclamation mark."},
    {t:"Our guide showed us a giant leaf that was bigger than my entire body.",type:"d",exp:"This sentence describes what happened. It ends with a full stop."},
    {t:"Could any other forest in the world be as noisy and alive as this one?",type:"i",exp:"This sentence asks a question. It ends with a question mark."},
    {t:"The river we crossed was wide, dark, and a little bit scary.",type:"d",exp:"This sentence describes the river. It ends with a full stop."}
  ]},
  {name:"Norway",loc:"The Northern Lights",cardImg:"./assets/norway.svg",flag:"🇳🇴",bg:"bg-norway",
   sentences:[
    {t:"Will I ever again see something as magical as the Northern Lights?",type:"i",exp:"This sentence asks a question. It ends with a question mark."},
    {t:"Is this what people mean when they say something looks like a dream?",type:"i",exp:"This sentence asks a question. It ends with a question mark."},
    {t:"The sky slowly turned from black to green to purple right above my head.",type:"d",exp:"This sentence describes what Arjun saw. It ends with a full stop."},
    {t:"How wonderful it was to watch those colours swirl and shimmer in the dark!",type:"e",exp:"This sentence begins with \"How\" and expresses wonder. It ends with an exclamation mark."},
    {t:"I stayed outside as long as I could because I did not want it to end.",type:"d",exp:"This sentence states what Arjun did. It ends with a full stop."}
  ]},
  {name:"Egypt",loc:"The Pyramids, Giza",cardImg:"./assets/egypt.svg",flag:"🇪🇬",bg:"bg-egypt",
   sentences:[
    {t:"What a strange and wonderful feeling it was to touch stones so incredibly old!",type:"e",exp:"This sentence begins with \"What\" and expresses a strong feeling. It ends with an exclamation mark."},
    {t:"The pyramids of Giza are the oldest buildings I have ever seen in my life.",type:"d",exp:"This sentence states a fact. It ends with a full stop."},
    {t:"Did the ancient Egyptians really build these without any modern machines?",type:"i",exp:"This sentence asks a question. It ends with a question mark."},
    {t:"Nobody is completely sure how such enormous blocks of stone were moved.",type:"d",exp:"This sentence states a fact. It ends with a full stop."},
    {t:"Could something this massive really have been built by hand thousands of years ago?",type:"i",exp:"This sentence asks a question. It ends with a question mark."}
  ]},
  {name:"Canada",loc:"Niagara Falls",cardImg:"./assets/canada.svg",flag:"🇨🇦",bg:"bg-canada",
   sentences:[
    {t:"Standing at the edge of Niagara Falls, I could feel the ground shaking beneath my feet.",type:"d",exp:"This sentence describes what Arjun felt. It ends with a full stop."},
    {t:"How deafening it was to hear millions of litres of water crashing down every single second!",type:"e",exp:"This sentence begins with \"How\" and expresses overwhelm. It ends with an exclamation mark."},
    {t:"Niagara Falls sits on the border between Canada and the United States, making it one of the most visited natural wonders in the world.",type:"d",exp:"This sentence states a fact. It ends with a full stop."},
    {t:"Is there any sound on earth more powerful than the roar of a waterfall this size?",type:"i",exp:"This sentence asks a question. It ends with a question mark."},
    {t:"I was completely soaked within minutes, but I did not want to move an inch.",type:"d",exp:"This sentence states what Arjun did. It ends with a full stop."}
  ]}
];

var hlClass={d:"hl-d",e:"hl-e",i:"hl-i"};
var labels={d:"Declarative",e:"Exclamatory",i:"Interrogative"};
var state=entries.map(function(e){return e.sentences.map(function(){return {chosen:null,correct:null};});});
var bestStars=entries.map(function(){return 0;});
var current=-1;
var activeTool=null;
var submitted=false;

function buildGrid(){
  var grid=document.getElementById('cardGrid');
  grid.innerHTML='';
  entries.forEach(function(e,i){
    var stars=bestStars[i];
    var done=stars>0;
    var starsHtml='';
    if(done){
      for(var si=0;si<5;si++){
        starsHtml+='<img src="./assets/'+(si<stars?'star-fill.svg':'star-hollow.svg')+'" alt="">';
      }
    }
    var perfect=stars===5;
    var pillHtml=done?'<div class="card-retry'+(perfect?' completed':'')+'">'+(perfect?'Completed':'Try Again')+'</div>':'';
    var card=document.createElement('div');
    card.className='card'+(done?' done':'');
    card.innerHTML='<div class="card-top"><img src="'+e.cardImg+'"></div><div class="card-bot"><div class="card-stars">'+starsHtml+'</div>'+pillHtml+'</div>';
    card.onclick=function(){openEntry(i);};
    grid.appendChild(card);
  });
}

function openEntry(idx){
  current=idx;activeTool=null;submitted=false;
  state[idx]=entries[idx].sentences.map(function(){return {chosen:null,correct:null};});
  document.getElementById('eTitle').textContent=entries[idx].name+' — '+entries[idx].emoji;
  document.getElementById('eLoc').textContent=entries[idx].loc;
  document.getElementById('eImg').src=entries[idx].cardImg;
  document.getElementById('toolsBar').style.display='flex';
  document.getElementById('resultsCard').classList.remove('visible');
  document.querySelector('.main-wrapper').classList.remove('review-sec');
  document.querySelector('.entry-header').style.display='';
  document.querySelector('.entry-header').classList.remove('active');
  document.getElementById('entry-head').style.display='';
  document.getElementById('backdrop').style.display='none';
  document.querySelector('.legend-img').style.display='none';
  document.querySelector('#entry-head .meta-bar').textContent='Select a highlighter, then tap each sentence to classify it.';
  updateToolBtns();renderScroll();updateProgress();
  showView('entryView');
}

function goHome(){buildGrid();showView('homeView');current=-1;activeTool=null;document.getElementById('backdrop').style.display='none';}

function retryEntry(){
  submitted=false;activeTool=null;
  state[current]=entries[current].sentences.map(function(){return {chosen:null,correct:null};});
  document.getElementById('toolsBar').style.display='flex';
  document.getElementById('resultsCard').classList.remove('visible');
  document.querySelector('.main-wrapper').classList.remove('review-sec');
  document.querySelector('.entry-header').style.display='';
  document.querySelector('.entry-header').classList.remove('active');
  document.getElementById('entry-head').style.display='';
  document.getElementById('backdrop').style.display='none';
  document.querySelector('.legend-img').style.display='none';
  document.querySelector('#entry-head .meta-bar').textContent='Select a highlighter, then tap each sentence to classify it.';
  updateToolBtns();renderScroll();updateProgress();
}

function backToEdit(){
  submitted=false;activeTool=null;
  document.getElementById('toolsBar').style.display='flex';
  document.getElementById('resultsCard').classList.remove('visible');
  document.querySelector('.main-wrapper').classList.remove('review-sec');
  document.querySelector('.entry-header').style.display='';
  document.querySelector('.entry-header').classList.remove('active');
  document.getElementById('entry-head').style.display='';
  document.getElementById('backdrop').style.display='none';
  document.querySelector('.legend-img').style.display='none';
  document.querySelector('#entry-head .meta-bar').textContent='Select a highlighter, then tap each sentence to classify it.';
  updateToolBtns();renderScroll();updateProgress();
}

function selectTool(type){
  if(submitted)return;
  activeTool=activeTool===type?null:type;
  updateToolBtns();
}

function updateToolBtns(){
  ['d','e','i'].forEach(function(t){
    var btn=document.getElementById('tool'+t.toUpperCase());
    btn.className='tool-btn'+(activeTool===t?' active-'+t:'');
  });
}

function renderScroll(){
  var entry=entries[current];
  var st=state[current];
  var list=document.getElementById('sentenceList');
  list.innerHTML='';
  entry.sentences.forEach(function(s,i){
    var block=document.createElement('div');
    block.className='sentence-block';
    var span=document.createElement('span');
    var cls='sentence';
    if(st[i].chosen)cls+=' '+hlClass[st[i].chosen];
    if(submitted&&st[i].correct===false)cls+=' wrong-hl';
    span.className=cls;
    span.textContent=s.t;
    if(!submitted){
      (function(idx){
        span.onclick=function(){
          if(!activeTool)return;
          st[idx].chosen=st[idx].chosen===activeTool?null:activeTool;
          renderScroll();updateProgress();
        };
      })(i);
    }
    var marker=document.createElement('span');
    marker.className='marker';
    if(submitted&&st[i].correct!==null){
      marker.innerHTML='<img src="./assets/'+(st[i].correct?'correct.svg':'wrong.svg')+'" alt="">';
    }
    block.appendChild(span);
    block.appendChild(marker);
    if(submitted){
      var fb=document.createElement('div');
      if(st[i].correct===false){
        fb.className='feedback-inline wrong';
        fb.innerHTML='<strong>This is a '+labels[s.type]+' sentence.</strong> '+s.exp;
      } else if(st[i].correct===true){
        fb.className='feedback-inline correct open';
        fb.textContent=s.exp;
      }
      block.appendChild(fb);
    }
    list.appendChild(block);
  });
}

function updateProgress(){
  var st=state[current];
  var highlighted=st.filter(function(s){return s.chosen!==null;}).length;
  var total=st.length;
  document.getElementById('progCount').textContent=highlighted+' of '+total+' sentences highlighted';
  var bar=document.getElementById('progBar');
  bar.innerHTML='';
  st.forEach(function(s){
    var d=document.createElement('div');
    d.className='prog-dot'+(s.correct===true?' correct':s.correct===false?' wrong':s.chosen?' highlighted':'');
    bar.appendChild(d);
  });
  var checkBtn=document.getElementById('checkBtn');
  var allMarked=highlighted===total&&!submitted;
  checkBtn.className='check-btn '+(allMarked?'btn btn-primary active':'btn btn-primary inactive');
  checkBtn.disabled=!allMarked;
}

function checkAnswers(){
  if(submitted)return;
  var st=state[current];
  if(st.some(function(s){return s.chosen===null;}))return;
  submitted=true;
  var entry=entries[current];
  var correct=0;
  st.forEach(function(s,i){
    s.correct=s.chosen===entry.sentences[i].type;
    if(s.correct)correct++;
  });
  var stars=correct===5?5:correct===4?4:correct===3?3:correct===2?2:1;
  if(stars>bestStars[current])bestStars[current]=stars;
  activeTool=null;
  document.getElementById('toolsBar').style.display='none';
  document.querySelector('.main-wrapper').classList.add('review-sec');
  document.getElementById('entry-head').style.display='none';
  document.querySelector('.entry-header').style.display='';
  document.querySelector('.entry-header').classList.add('active');
  document.getElementById('backdrop').style.display='block';
  document.querySelector('.legend-img').style.display='block';
  renderScroll();updateProgress();
  document.getElementById('resultsTitle').textContent='Passage Complete!';
  var starsHtml='';
  for(var si=0;si<5;si++){
    starsHtml+='<img src="./assets/'+(si<stars?'star-fill.svg':'star-hollow.svg')+'" alt="">';
  }
  document.getElementById('resultsStars').innerHTML=starsHtml;
  document.getElementById('resultsScore').textContent=correct+'/5';
  document.getElementById('resultsAccuracy').textContent=Math.round((correct/5)*100)+'%';
  document.getElementById('resultsCard').classList.add('visible');
}

function showView(id){
  document.querySelectorAll('.view').forEach(function(v){v.classList.remove('active');});
  document.getElementById(id).classList.add('active');
  document.querySelector('.button-controls').style.display=id==='homeView'?'none':'flex';
}

buildGrid();
showView('homeView');