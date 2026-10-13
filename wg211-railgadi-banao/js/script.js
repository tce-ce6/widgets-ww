'use strict';

// In Electron with nodeIntegration, the UMD build of lottie assigns itself to
// module.exports instead of window.lottie — pick it up from there.
if (
  !window.lottie &&
  typeof module === 'object' &&
  module &&
  module.exports &&
  typeof module.exports.loadAnimation === 'function'
) {
  window.lottie = module.exports;
}

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     CONTENT
     ========================================================================== */

  const ITEXT = {
    level: 'कोई एक रेलगाड़ी चुनो और खेल शुरू करो।',
    game: 'समान अर्थ वाले शब्द ढूँढो। डिब्बों को इंजन से जोड़ो।',
  };

  // Word -> file name in assets/audio/ (without .mp3)
  const WORD_AUDIO = {
    'दीपक': 'dipak', 'दीया': 'diya', 'दीप': 'dip', 'तेल': 'tel', 'बाती': 'bati',
    'किताब': 'kitab', 'कलम': 'kalam', 'बस्ता': 'basta', 'ग्रंथ': 'granth', 'पुस्तक': 'pustak',
    'माँ': 'maa', 'जननी': 'janani', 'मौसी': 'mausi', 'बहन': 'bahan', 'माता': 'mata',
    'शाम': 'sham', 'दोपहर': 'dopahar', 'संध्या': 'sandhya', 'साँझ': 'sanz', 'सुबह': 'subah',
    'तोता': 'tota', 'सुआ': 'suaa', 'शुक': 'shuk', 'मैना': 'maina', 'कबूतर': 'kabutar',
    'गुस्सा': 'gussa', 'डर': 'dar', 'हँसी': 'hasi', 'क्रोध': 'krodh', 'रोष': 'rosh',
    'सिर': 'sir', 'बाल': 'baal', 'शीश': 'shish', 'मस्तक': 'mastak', 'गर्दन': 'gardan',
    'पेड़': 'ped', 'तरु': 'taru', 'पौधा': 'poudha', 'वृक्ष': 'vraksh', 'डाल': 'dal',
    'घड़ा': 'ghada', 'कलश': 'kalash', 'कटोरी': 'katori', 'थाली': 'thali', 'घट': 'ghut',
    'भाई': 'bhai', 'चाचा': 'chacha', 'भ्राता': 'bhrata', 'सहोदर': 'sahodar',
    'कौआ': 'kouva', 'काग': 'kaag', 'कोयल': 'koyal', 'चील': 'cheel', 'काक': 'kaak',
    'गाय': 'gay', 'बछड़ा': 'bachda', 'भैंस': 'bhais', 'गौ': 'gou', 'धेनु': 'dhenu',
    'चाँद': 'chand', 'शशि': 'shashi', 'सूरज': 'suraj', 'चंद्रमा': 'chandrama', 'तारा': 'tara',
    'हिरन': 'hiran', 'खरगोश': 'khargosh', 'मृग': 'mrug', 'बकरी': 'bakari', 'हरिण': 'harin',
    'मछली': 'machli', 'मेंढक': 'mendhak', 'मीन': 'min', 'मत्स्य': 'matsya', 'कछुआ': 'kachua',
    'बाग': 'baag', 'जंगल': 'jangal', 'उपवन': 'upawan', 'उद्यान': 'udyan', 'खेत': 'khet',
    'पत्थर': 'patthar', 'मिट्टी': 'mitti', 'पाषाण': 'pashan', 'रेत': 'ret', 'शिला': 'shila',
    'बंदर': 'bandar', 'गिलहरी': 'gilhari', 'वानर': 'vanar', 'कपि': 'kapi', 'भालू': 'bhalu',
    'भौंरा': 'boura', 'तितली': 'titli', 'मधुकर': 'madhukar', 'भ्रमर': 'bhramar', 'मधुमक्खी': 'madhumakkhi',
    'कोकिला': 'kokila', 'पिक': 'pik',
    'जीभ': 'jibh', 'होंठ': 'hoth', 'रसना': 'rasna', 'जिह्वा': 'jivha', 'दाँत': 'daat',
    'नदी': 'nadi', 'तटिनी': 'tatini', 'सरिता': 'sarita', 'नहर': 'nahar', 'किनारा': 'kinara',
    'हाथी': 'hathi', 'सूँड़': 'sund', 'ऊँट': 'unt', 'हस्ती': 'hasti', 'गज': 'gaj',
    'इच्छा': 'ichha', 'चाह': 'chah', 'अभिलाषा': 'abhilasha',
    'पहाड़': 'pahad', 'पर्वत': 'parvat', 'चट्टान': 'chattan', 'गिरि': 'giri', 'घाटी': 'ghati',
    'सवेरा': 'savera', 'भोर': 'bhor', 'धूप': 'dhup', 'प्रातः': 'pratah', 'रात': 'raat',
    'खुशी': 'khushi', 'आनंद': 'aanand', 'मुस्कान': 'muskan', 'दुख': 'dukh', 'प्रसन्नता': 'prasannata', 'हर्ष': 'harsh',
    'पिता': 'pita', 'बंधु': 'bandhu',
    'दुनिया': 'duniya', 'गाँव': 'gaav', 'शहर': 'shahar', 'जगत': 'jagat', 'विश्व': 'vishva', 'संसार': 'sansar', 'देश': 'desh',
    'बिजली': 'bijli', 'बारिश': 'barish', 'दामिनी': 'damini', 'गरज': 'garaj', 'तड़ित': 'tadit', 'विद्युत': 'vidyut', 'बादल': 'badal',
    'शरीर': 'sharir', 'चेहरा': 'chehra', 'देह': 'deh', 'हाथ': 'haath', 'मन': 'mann', 'काया': 'kaya', 'तन': 'tann',
    'आग': 'aag', 'अनल': 'anal', 'धुआँ': 'dhuaa', 'अग्नि': 'agni', 'राख': 'raakh', 'लकड़ी': 'lakdi', 'पावक': 'pavak',
    'तरंगिणी': 'tarangini', 'पुल': 'pul',
    'बेटा': 'beta', 'बेटी': 'beti', 'सुत': 'sut', 'तनय': 'tanay', 'पुत्र': 'putra',
    'समुद्र': 'samudra', 'लहर': 'lahar', 'जलधि': 'jaladhi', 'सिंधु': 'sindhu', 'सागर': 'sagar',
    'अरण्य': 'aranya', 'वन': 'van', 'कानन': 'kanan',
    'दुश्मन': 'dushman', 'पड़ोसी': 'padosi', 'सैनिक': 'sainik', 'शत्रु': 'shatru', 'बैरी': 'bairi', 'रिपु': 'ripu', 'मित्र': 'mitra',
    'सुरभि': 'surabhi',
    'घोड़ा': 'ghoda', 'गधा': 'gadha', 'खच्चर': 'khachhar', 'अश्व': 'ashwa', 'हय': 'hay', 'तुरंग': 'turang',
    'अमृत': 'amrut', 'सुधा': 'sudha', 'शहद': 'shahad', 'अमिय': 'amiy', 'दूध': 'dudh', 'विष': 'vish', 'पीयूष': 'piyush',
    'साँप': 'saap', 'सर्प': 'sarpa', 'बिच्छू': 'bichhu', 'नाग': 'naag', 'नेवला': 'nevla', 'भुजंग': 'bhujang', 'केंचुआ': 'kechuva',
    'सुंदर': 'sundar', 'सुरम्य': 'suramya', 'कोमल': 'komal', 'मनोहर': 'manohar', 'रमणीय': 'ramniy', 'चमकीला': 'chamkila', 'बड़ा': 'bada',
    'प्रस्तर': 'prastar', 'ईंट': 'it',
    'सोना': 'sona', 'गहना': 'gahna', 'कनक': 'kanak', 'लोहा': 'loha', 'कंचन': 'kanchan', 'चाँदी': 'chandi', 'स्वर्ण': 'swarna',
    'मेहनत': 'mehnat', 'आलस': 'aalas', 'आराम': 'aaram', 'श्रम': 'shram', 'खेल': 'khel', 'उद्यम': 'udyam', 'परिश्रम': 'parishram',
    'राजा': 'raja', 'नृप': 'nrup', 'मंत्री': 'mantri', 'भूप': 'bhup', 'रानी': 'rani', 'महीप': 'mahip', 'महल': 'mahal',
    'नाव': 'naav', 'पतवार': 'patwar', 'जहाज़': 'jahaj', 'नौका': 'nauka', 'तरणी': 'tarni', 'तरी': 'tari',
    'कोप': 'kop',
    'तालाब': 'talab', 'सरोवर': 'sarovar', 'ताल': 'tal', 'कुआँ': 'kuaa', 'झरना': 'zarna', 'जलाशय': 'jalashay',
    'आकाश': 'aakash', 'नभ': 'nabh', 'धरती': 'dharti', 'अंबर': 'ambar', 'गगन': 'gagan',
  };

  // w: word on the engine, ok: same-meaning words, no: distracters.
  // Revision words sit at positions 3, 8, 13, 18 and 23 of each level.
  const LEVELS = {
    choti: {
      platform: { w: 215, h: 244, gap: 25, top: 647 },
      trainScale: 1,
      rounds: [
        { w: 'दीपक', ok: ['दीया', 'दीप'], no: ['तेल', 'बाती'] },
        { w: 'किताब', ok: ['पुस्तक', 'ग्रंथ'], no: ['कलम', 'बस्ता'] },
        { w: 'माँ', ok: ['माता', 'जननी'], no: ['मौसी', 'बहन'] },
        { w: 'शाम', ok: ['संध्या', 'साँझ'], no: ['दोपहर', 'सुबह'] },
        { w: 'तोता', ok: ['शुक', 'सुआ'], no: ['मैना', 'कबूतर'] },
        { w: 'गुस्सा', ok: ['क्रोध', 'रोष'], no: ['डर', 'हँसी'] },
        { w: 'सिर', ok: ['शीश', 'मस्तक'], no: ['बाल', 'गर्दन'] },
        { w: 'पेड़', ok: ['वृक्ष', 'तरु'], no: ['पौधा', 'डाल'] },
        { w: 'घड़ा', ok: ['कलश', 'घट'], no: ['कटोरी', 'थाली'] },
        { w: 'भाई', ok: ['भ्राता', 'सहोदर'], no: ['चाचा', 'बहन'] },
        { w: 'कौआ', ok: ['काक', 'काग'], no: ['कोयल', 'चील'] },
        { w: 'गाय', ok: ['गौ', 'धेनु'], no: ['बछड़ा', 'भैंस'] },
        { w: 'चाँद', ok: ['चंद्रमा', 'शशि'], no: ['सूरज', 'तारा'] },
        { w: 'हिरन', ok: ['मृग', 'हरिण'], no: ['खरगोश', 'बकरी'] },
        { w: 'मछली', ok: ['मीन', 'मत्स्य'], no: ['मेंढक', 'कछुआ'] },
        { w: 'बाग', ok: ['उपवन', 'उद्यान'], no: ['जंगल', 'खेत'] },
        { w: 'पत्थर', ok: ['पाषाण', 'शिला'], no: ['मिट्टी', 'रेत'] },
        { w: 'बंदर', ok: ['वानर', 'कपि'], no: ['गिलहरी', 'भालू'] },
        { w: 'भौंरा', ok: ['भ्रमर', 'मधुकर'], no: ['तितली', 'मधुमक्खी'] },
        { w: 'कोयल', ok: ['कोकिला', 'पिक'], no: ['तोता', 'कौआ'] },
        { w: 'जीभ', ok: ['जिह्वा', 'रसना'], no: ['होंठ', 'दाँत'] },
        { w: 'नदी', ok: ['सरिता', 'तटिनी'], no: ['नहर', 'किनारा'] },
        { w: 'हाथी', ok: ['गज', 'हस्ती'], no: ['सूँड़', 'ऊँट'] },
        { w: 'इच्छा', ok: ['चाह', 'अभिलाषा'], no: ['गुस्सा', 'डर'] },
        { w: 'पहाड़', ok: ['पर्वत', 'गिरि'], no: ['चट्टान', 'घाटी'] },
      ],
    },
    badi: {
      platform: { w: 197, h: 223, gap: 22, top: 664 },
      trainScale: 0.92,
      rounds: [
        { w: 'सुबह', ok: ['प्रातः', 'सवेरा', 'भोर'], no: ['धूप', 'शाम', 'रात'] },
        { w: 'खुशी', ok: ['प्रसन्नता', 'हर्ष', 'आनंद'], no: ['मुस्कान', 'दुख', 'हँसी'] },
        { w: 'भाई', ok: ['भ्राता', 'सहोदर', 'बंधु'], no: ['बहन', 'पिता', 'चाचा'] },
        { w: 'दुनिया', ok: ['संसार', 'जगत', 'विश्व'], no: ['गाँव', 'शहर', 'देश'] },
        { w: 'बिजली', ok: ['विद्युत', 'तड़ित', 'दामिनी'], no: ['बारिश', 'गरज', 'बादल'] },
        { w: 'शरीर', ok: ['देह', 'तन', 'काया'], no: ['चेहरा', 'हाथ', 'मन'] },
        { w: 'आग', ok: ['अग्नि', 'अनल', 'पावक'], no: ['धुआँ', 'राख', 'लकड़ी'] },
        { w: 'नदी', ok: ['सरिता', 'तटिनी', 'तरंगिणी'], no: ['नहर', 'किनारा', 'पुल'] },
        { w: 'बेटा', ok: ['पुत्र', 'सुत', 'तनय'], no: ['बेटी', 'पिता', 'भाई'] },
        { w: 'समुद्र', ok: ['सागर', 'सिंधु', 'जलधि'], no: ['किनारा', 'लहर', 'नदी'] },
        { w: 'जंगल', ok: ['वन', 'कानन', 'अरण्य'], no: ['बाग', 'पेड़', 'खेत'] },
        { w: 'दुश्मन', ok: ['शत्रु', 'बैरी', 'रिपु'], no: ['पड़ोसी', 'सैनिक', 'मित्र'] },
        { w: 'गाय', ok: ['गौ', 'धेनु', 'सुरभि'], no: ['भैंस', 'बछड़ा', 'बकरी'] },
        { w: 'घोड़ा', ok: ['अश्व', 'हय', 'तुरंग'], no: ['गधा', 'खच्चर', 'ऊँट'] },
        { w: 'अमृत', ok: ['सुधा', 'पीयूष', 'अमिय'], no: ['शहद', 'दूध', 'विष'] },
        { w: 'साँप', ok: ['सर्प', 'नाग', 'भुजंग'], no: ['बिच्छू', 'नेवला', 'केंचुआ'] },
        { w: 'सुंदर', ok: ['मनोहर', 'रमणीय', 'सुरम्य'], no: ['कोमल', 'चमकीला', 'बड़ा'] },
        { w: 'पत्थर', ok: ['पाषाण', 'शिला', 'प्रस्तर'], no: ['ईंट', 'मिट्टी', 'रेत'] },
        { w: 'सोना', ok: ['स्वर्ण', 'कनक', 'कंचन'], no: ['गहना', 'लोहा', 'चाँदी'] },
        { w: 'मेहनत', ok: ['परिश्रम', 'श्रम', 'उद्यम'], no: ['आलस', 'आराम', 'खेल'] },
        { w: 'राजा', ok: ['नृप', 'भूप', 'महीप'], no: ['मंत्री', 'रानी', 'महल'] },
        { w: 'नाव', ok: ['नौका', 'तरणी', 'तरी'], no: ['पतवार', 'जहाज़', 'किनारा'] },
        { w: 'गुस्सा', ok: ['क्रोध', 'रोष', 'कोप'], no: ['हँसी', 'डर', 'दुख'] },
        { w: 'तालाब', ok: ['सरोवर', 'ताल', 'जलाशय'], no: ['कुआँ', 'नहर', 'झरना'] },
        { w: 'आकाश', ok: ['नभ', 'अंबर', 'गगन'], no: ['धरती', 'तारा', 'बादल'] },
      ],
    },
  };

  const COACH_COLORS = ['orange', 'blue', 'violet', 'pink', 'yellow', 'green'];

  /* ==========================================================================
     TRAIN GEOMETRY (unscaled px, measured from choti-gadi-01.svg)
     ========================================================================== */

  const STAGE_W = 1920;
  const STAGE_H = 1080;
  const TRACK_Y = 615; // y of the wheel bottoms on bg.svg
  const SLOT_W = 216.5;
  const SLOT_H = 245;
  const SLOT_STRIDE = 240.4;
  const COUPLER_X = 214; // coupler offset inside each slot stride
  const ENGINE_OFFSET = 211.5; // engine x relative to the last slot
  const ENGINE_W = 382;
  const DROP_LINE_Y = 640; // dropping a coach above this line means "on the train"

  const ENTER_MS = 2200;
  const EXIT_MS = 1800;
  const FLY_MS = 550;
  const REVEAL_GAP_MS = 650;

  /* ==========================================================================
     DOM
     ========================================================================== */

  const $ = (id) => document.getElementById(id);
  const stage = $('stage');
  const screens = {
    level: $('screen-level'),
    game: $('screen-game'),
    end: $('screen-end'),
  };
  const trainEl = $('train');
  const platformEl = $('platform');
  const answerBtn = $('answerBtn');
  const nextBtn = $('nextBtn');

  /* ==========================================================================
     STAGE SCALING
     ========================================================================== */

  let stageScale = 1;

  const fitStage = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    stageScale = Math.min(vw / STAGE_W, vh / STAGE_H);
    const x = (vw - STAGE_W * stageScale) / 2;
    const y = (vh - STAGE_H * stageScale) / 2;
    stage.style.transform = `translate(${x}px, ${y}px) scale(${stageScale})`;
  };

  fitStage();
  window.addEventListener('resize', fitStage);

  /* ==========================================================================
     AUDIO
     ========================================================================== */

  let voice = null;

  const stopVoice = () => {
    if (voice) {
      voice.pause();
      voice = null;
    }
    try {
      window.speechSynthesis && window.speechSynthesis.cancel();
    } catch (e) { /* not available */ }
  };

  const speak = (text) => {
    try {
      if (!('speechSynthesis' in window) || !text) return;
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'hi-IN';
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    } catch (e) { /* no speech engine */ }
  };

  // Plays a recording; falls back to the browser's Hindi voice when there is none.
  const playVoice = (src, fallbackText) => {
    stopVoice();
    if (!src) {
      speak(fallbackText);
      return;
    }
    const a = new Audio(src);
    a.addEventListener('error', () => console.warn('Audio failed to load:', src));
    a.play().catch((err) => {
      // AbortError just means a newer sound interrupted this one.
      if (err.name !== 'AbortError') console.warn('Audio play failed:', src, err.name);
    });
    voice = a;
  };

  const wordSrc = (word) => (WORD_AUDIO[word] ? `assets/audio/${WORD_AUDIO[word]}.mp3` : '');
  const playWord = (word) => playVoice(wordSrc(word), word);

  /* ==========================================================================
     STATE
     ========================================================================== */

  const state = {
    level: null, // LEVELS entry
    index: 0,
    filled: 0,
    mistake: false, // a wrong coach was chosen or Show Answer was used
    complete: false,
    busy: false, // train moving: no interaction
    perfect: 0, // trains built without a single mistake
    token: 0, // bumps on every round change so stale timers bail out
    timers: [],
    smokeAnim: null,
  };

  const later = (fn, ms) => {
    const token = state.token;
    state.timers.push(setTimeout(() => {
      if (token === state.token) fn();
    }, ms));
  };

  const clearTimers = () => {
    state.token++;
    state.timers.forEach(clearTimeout);
    state.timers = [];
  };

  // Resolves when a Web Animation ends. A timer backs up onfinish, which can
  // arrive late when frames are throttled (background tab, some exe shells).
  const animDone = (anim, ms) =>
    new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      anim.onfinish = done;
      anim.oncancel = done;
      setTimeout(() => {
        if (settled) return;
        try { anim.finish(); } catch (e) { /* already finished */ }
        done();
      }, ms + 120);
    });

  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  const showScreen = (name) => {
    Object.keys(screens).forEach((k) => screens[k].classList.toggle('is-active', k === name));
  };

  /* ==========================================================================
     TRAIN
     ========================================================================== */

  const trainGeom = (slots) => {
    const scale = state.level.trainScale;
    const width = (slots - 1) * SLOT_STRIDE + ENGINE_OFFSET + ENGINE_W;
    const left = (STAGE_W - width * scale) / 2;
    return { scale, width, left };
  };

  const setTrainX = (x) => {
    trainEl.style.transform = `translateX(${x}px) scale(${state.level.trainScale})`;
  };

  const coachEl = (word, color, isCorrect) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'coach';
    el.dataset.word = word;
    el.dataset.color = color;
    el.dataset.ok = isCorrect ? '1' : '0';
    el.setAttribute('aria-label', 'डिब्बा: ' + word);
    el.innerHTML = `<img src="assets/images/coach-${color}.svg" alt=""><span class="coach__word"></span>`;
    el.querySelector('.coach__word').textContent = word;
    return el;
  };

  const buildTrain = (round) => {
    const slots = round.ok.length;
    const { width, left } = trainGeom(slots);
    trainEl.innerHTML = '';
    trainEl.style.width = `${width}px`;
    trainEl.style.left = `${left}px`;

    for (let i = 0; i < slots; i++) {
      const slot = document.createElement('div');
      slot.className = 'train__slot';
      slot.style.left = `${i * SLOT_STRIDE}px`;
      slot.innerHTML = '<img src="assets/images/coach-empty.svg" alt="">';
      trainEl.appendChild(slot);
      if (i < slots - 1) {
        const coupler = document.createElement('div');
        coupler.className = 'train__coupler';
        coupler.style.left = `${i * SLOT_STRIDE + COUPLER_X}px`;
        trainEl.appendChild(coupler);
      }
    }

    const engine = document.createElement('div');
    engine.className = 'train__engine';
    engine.style.left = `${(slots - 1) * SLOT_STRIDE + ENGINE_OFFSET}px`;
    engine.innerHTML =
      '<div class="train__smoke"><img src="assets/images/smoke.svg" alt=""></div>' +
      '<img src="assets/images/engine.svg" alt=""><span class="train__engine-word"></span>';
    const engineWord = engine.querySelector('.train__engine-word');
    engineWord.textContent = round.w;
    engineWord.setAttribute('role', 'button');
    engineWord.tabIndex = 0;
    engineWord.setAttribute('aria-label', 'इंजन का शब्द सुनो: ' + round.w);
    engineWord.addEventListener('click', () => playWord(round.w));
    engineWord.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playWord(round.w);
      }
    });
    trainEl.appendChild(engine);
  };

  const puffSmoke = (on) => {
    const smoke = trainEl.querySelector('.train__smoke');
    if (state.smokeAnim) {
      state.smokeAnim.cancel();
      state.smokeAnim = null;
    }
    if (!smoke || !on) return;
    state.smokeAnim = smoke.animate(
      [
        { opacity: 0, transform: 'scale(0.4)' },
        { opacity: 1, transform: 'scale(0.85)', offset: 0.3 },
        { opacity: 0, transform: 'translateY(-24px) scale(1.1)' },
      ],
      { duration: 1100, iterations: Infinity, easing: 'ease-out' },
    );
  };

  const moveTrain = (fromX, toX, ms, easing) => {
    const s = state.level.trainScale;
    const anim = trainEl.animate(
      [
        { transform: `translateX(${fromX}px) scale(${s})` },
        { transform: `translateX(${toX}px) scale(${s})` },
      ],
      { duration: ms, easing },
    );
    setTrainX(toX);
    return animDone(anim, ms);
  };

  const trainEnter = () => {
    const { scale, width, left } = trainGeom(state.level.rounds[state.index].ok.length);
    puffSmoke(true);
    return moveTrain(-(left + width * scale + 40), 0, ENTER_MS, 'cubic-bezier(.2,.7,.35,1)').then(() => puffSmoke(false));
  };

  const trainExit = () => {
    const { left } = trainGeom(state.level.rounds[state.index].ok.length);
    puffSmoke(true);
    return moveTrain(0, STAGE_W - left + 40, EXIT_MS, 'cubic-bezier(.55,0,.8,.4)').then(() => puffSmoke(false));
  };

  // The empty slot nearest the engine (slots are ordered left -> right).
  const nextEmptySlot = () => {
    const slots = [...trainEl.querySelectorAll('.train__slot:not(.is-filled)')];
    return slots[slots.length - 1] || null;
  };

  /* ==========================================================================
     PLATFORM
     ========================================================================== */

  const buildPlatform = (round) => {
    const { w, h, gap, top } = state.level.platform;
    const words = shuffle([
      ...round.ok.map((word) => ({ word, ok: true })),
      ...round.no.map((word) => ({ word, ok: false })),
    ]);
    const colors = shuffle(COACH_COLORS);
    const total = words.length * w + (words.length - 1) * gap;
    const x0 = (STAGE_W - total) / 2;

    platformEl.innerHTML = '';
    words.forEach((item, i) => {
      const el = coachEl(item.word, colors[i % colors.length], item.ok);
      el.style.left = `${x0 + i * (w + gap)}px`;
      el.style.top = `${top}px`;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      enableDrag(el);
      platformEl.appendChild(el);
    });
  };

  const fadeRemaining = (onlyWrong) => {
    platformEl.querySelectorAll('.coach:not(.is-locked)').forEach((c) => {
      if (!onlyWrong || c.dataset.ok !== '1') c.classList.add('is-faded');
    });
  };

  /* ==========================================================================
     COACH INTERACTION (tap or drag)
     ========================================================================== */

  const canPlay = () => !state.busy && !state.complete;

  function enableDrag(el) {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (canPlay()) attempt(el, 0, 0);
      }
    });

    el.addEventListener('pointerdown', (e) => {
      if (!canPlay() || el.classList.contains('is-locked')) return;
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      let dx = 0;
      let dy = 0;
      let moved = false;
      try {
        el.setPointerCapture(e.pointerId);
      } catch (err) { /* pointer already released */ }
      el.classList.add('is-dragging');

      const onMove = (ev) => {
        if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 8) moved = true;
        if (!moved) return;
        dx = (ev.clientX - startX) / stageScale;
        dy = (ev.clientY - startY) / stageScale;
        el.style.transform = `translate(${dx}px, ${dy}px) rotate(-3deg)`;
      };

      const onUp = () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
        el.removeEventListener('pointercancel', onUp);
        el.classList.remove('is-dragging');
        el.style.transform = '';

        if (!moved) {
          if (canPlay()) attempt(el, 0, 0);
          return;
        }
        const dropY = parseFloat(el.style.top) + dy + el.offsetHeight / 2;
        if (canPlay() && dropY < DROP_LINE_Y) {
          attempt(el, dx, dy);
        } else {
          slideBack(el, dx, dy);
        }
      };

      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp);
      el.addEventListener('pointercancel', onUp);
    });
  }

  const slideBack = (el, dx, dy) => {
    if (!dx && !dy) return Promise.resolve();
    const a = el.animate(
      [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
      { duration: 250, easing: 'ease-out' },
    );
    return animDone(a, 250);
  };

  const shake = (el) => {
    el.classList.remove('is-shaking');
    void el.offsetWidth;
    el.classList.add('is-shaking');
    later(() => el.classList.remove('is-shaking'), 460);
  };

  const attempt = (el, dx, dy) => {
    const round = state.level.rounds[state.index];
    playWord(el.dataset.word);
    if (el.dataset.ok === '1') {
      attachCoach(el, dx, dy).then(() => {
        if (state.filled === round.ok.length) trainComplete(true);
      });
    } else {
      state.mistake = true;
      slideBack(el, dx, dy).then(() => shake(el));
    }
  };

  // Flies a platform coach into the empty slot nearest the engine.
  const attachCoach = (el, dx = 0, dy = 0) => {
    const slot = nextEmptySlot();
    if (!slot) return Promise.resolve();
    slot.classList.add('is-filled'); // reserve it straight away
    el.classList.add('is-locked');
    state.filled++;
    const token = state.token;

    const s = state.level.trainScale;
    const { left } = trainGeom(state.level.rounds[state.index].ok.length);
    const targetX = left + parseFloat(slot.style.left) * s;
    const targetY = TRACK_Y - SLOT_H * s;
    const fromX = parseFloat(el.style.left);
    const fromY = parseFloat(el.style.top);
    const sx = (SLOT_W * s) / el.offsetWidth;
    const sy = (SLOT_H * s) / el.offsetHeight;

    const a = el.animate(
      [
        { transform: `translate(${dx}px, ${dy}px)` },
        { transform: `translate(${targetX - fromX}px, ${targetY - fromY}px) scale(${sx}, ${sy})` },
      ],
      { duration: FLY_MS, easing: 'ease-in-out', fill: 'forwards' },
    );
    return animDone(a, FLY_MS).then(() => {
      if (token !== state.token) return new Promise(() => {}); // round changed: stop here
      const placed = coachEl(el.dataset.word, el.dataset.color, true);
      placed.tabIndex = -1;
      placed.classList.add('is-locked');
      slot.innerHTML = '';
      slot.appendChild(placed);
      el.style.visibility = 'hidden';
    });
  };

  // All slots filled: smoke from the chimney, fade what is left on the platform.
  const trainComplete = (byUser) => {
    if (state.complete) return;
    state.complete = true;
    answerBtn.disabled = true;
    nextBtn.disabled = false; // Next unlocks only once every correct coach is attached
    if (byUser && !state.mistake) state.perfect++;
    fadeRemaining(false);
    later(() => {
      puffSmoke(true);
      later(() => puffSmoke(false), 2200);
    }, 300);
  };

  const showAnswer = () => {
    if (!canPlay()) return;
    const round = state.level.rounds[state.index];
    state.mistake = true;
    answerBtn.disabled = true;
    fadeRemaining(true);
    const rest = [...platformEl.querySelectorAll('.coach:not(.is-locked)')].filter((c) => c.dataset.ok === '1');
    rest.forEach((c, i) => {
      later(() => {
        attachCoach(c).then(() => {
          if (state.filled === round.ok.length) trainComplete(false);
        });
      }, i * REVEAL_GAP_MS);
    });
  };

  /* ==========================================================================
     ROUND FLOW
     ========================================================================== */

  const setButtons = (enabled) => {
    answerBtn.disabled = !enabled;
    nextBtn.disabled = !enabled;
  };

  const loadRound = () => {
    clearTimers();
    const round = state.level.rounds[state.index];
    const total = state.level.rounds.length;
    state.filled = 0;
    state.mistake = false;
    state.complete = false;
    state.busy = true;

    nextBtn.textContent = state.index === total - 1 ? 'परिणाम देखें' : 'अगला उदाहरण';
    setButtons(false);

    buildTrain(round);
    buildPlatform(round);
    const token = state.token;
    trainEnter().then(() => {
      if (token !== state.token) return;
      state.busy = false;
      answerBtn.disabled = false; // Next stays locked until the train is complete
      playWord(round.w);
    });
  };

  const next = () => {
    if (state.busy || !state.complete) return;
    state.busy = true;
    clearTimers();
    stopVoice();
    setButtons(false);
    fadeRemaining(false);
    const token = state.token;
    trainExit().then(() => {
      if (token !== state.token) return;
      state.index++;
      if (state.index < state.level.rounds.length) loadRound();
      else finish();
    });
  };

  let trophyAnim = null;

  const finish = () => {
    state.busy = false;
    const total = state.level.rounds.length;
    $('scoreText').textContent = `${total} में से ${state.perfect} रेलगाड़ियाँ तुमने खुद, बिना गलती के तैयार कीं!`;
    showScreen('end');
    screens.game.classList.add('is-active'); // keep the scene visible behind the panel
    if (window.lottie && window.TROPHY_DATA) {
      if (trophyAnim) trophyAnim.destroy();
      trophyAnim = window.lottie.loadAnimation({
        container: $('trophy'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: window.TROPHY_DATA,
      });
    }
  };

  const startLevel = (key) => {
    stopVoice();
    state.level = LEVELS[key];
    state.index = 0;
    state.perfect = 0;
    showScreen('game');
    loadRound();
  };

  const goToLevelScreen = () => {
    clearTimers();
    stopVoice();
    trainEl.getAnimations().forEach((a) => a.cancel());
    puffSmoke(false);
    if (trophyAnim) {
      trophyAnim.destroy();
      trophyAnim = null;
    }
    trainEl.innerHTML = '';
    platformEl.innerHTML = '';
    state.busy = false;
    showScreen('level');
  };

  /* ==========================================================================
     TEST HELPER
     Jumps straight to the result screen, from the console:
       goToResult()              current level (or छोटी रेलगाड़ी), current score
       goToResult('badi')        बड़ी रेलगाड़ी, current score
       goToResult('choti', 18)   छोटी रेलगाड़ी, 18 perfect trains
     ========================================================================== */

  window.goToResult = (levelKey, perfect) => {
    const key = levelKey || Object.keys(LEVELS).find((k) => LEVELS[k] === state.level) || 'choti';
    if (!LEVELS[key]) {
      console.warn(`goToResult: unknown level "${key}". Use "choti" or "badi".`);
      return;
    }
    const levelChanged = state.level !== LEVELS[key];

    clearTimers();
    stopVoice();
    trainEl.getAnimations().forEach((a) => a.cancel());
    puffSmoke(false);

    state.level = LEVELS[key];
    state.index = state.level.rounds.length - 1;
    if (levelChanged) state.perfect = 0;
    if (typeof perfect === 'number') {
      state.perfect = Math.max(0, Math.min(state.level.rounds.length, Math.round(perfect)));
    }

    // Park the last station's train behind the result panel, as in a real finish.
    const lastRound = state.level.rounds[state.index];
    buildTrain(lastRound);
    buildPlatform(lastRound);
    setTrainX(0);
    nextBtn.textContent = 'परिणाम देखें';
    setButtons(false);

    finish();
    console.log(`Result screen: ${key}, ${state.perfect} / ${state.level.rounds.length}`);
  };

  /* ==========================================================================
     WIRING
     ========================================================================== */

  $('levelItext').textContent = ITEXT.level;
  $('gameItext').textContent = ITEXT.game;


  document.querySelectorAll('.level-panel').forEach((btn) => {
    btn.addEventListener('click', () => startLevel(btn.dataset.level));
  });

  answerBtn.addEventListener('click', showAnswer);
  nextBtn.addEventListener('click', next);
  $('homeBtn').addEventListener('click', goToLevelScreen);
  $('replayBtn').addEventListener('click', goToLevelScreen);
});
