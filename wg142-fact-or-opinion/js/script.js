/**
 * Fact or Opinion - Interactive library widget
 * 5 categories, 2 passages each, 6 sentences per passage.
 * Blue = Fact, Green = Opinion. Check → feedback → Next / Activity Complete.
 */

(function () {
  const SENTENCE_COUNT = 6;
  const CATEGORY_IDS = ["book-01", "book-02", "book-03", "book-04", "book-05"];

  const CONTENT = [
    {
      name: "Current Events & News",
      passages: [
        {
          title: "India Hosts the Chess Olympiad",
          sentences: [
            { text: "The 44th Chess Olympiad was held in Mahabalipuram, Tamil Nadu, in July and August 2022.", type: "fact", correctFeedback: "The date and venue of the event are verifiable facts.", incorrectFeedback: "This is a fact. Date and venue are verifiable." },
            { text: "The opening ceremony was the most spectacular event Indian sports has ever hosted.", type: "opinion", correctFeedback: "'Most spectacular' is a personal judgment; different people may consider other sporting events more impressive.", incorrectFeedback: "This is an opinion. 'Most spectacular' is a personal judgment." },
            { text: "Over 180 countries participated in the tournament, making it one of the largest Chess Olympiads in history.", type: "fact", correctFeedback: "The number of participating countries is documented in FIDE's official tournament records.", incorrectFeedback: "This is a fact. The number is documented in official records." },
            { text: "India's men's team and women's team both won bronze medals at the event.", type: "fact", correctFeedback: "Medal results are officially recorded by FIDE and widely reported in the news.", incorrectFeedback: "This is a fact. Medal results are officially recorded." },
            { text: "Hosting the Olympiad has done more for Indian chess than any coaching programme ever could.", type: "opinion", correctFeedback: "'More than any coaching programme ever could' is a personal belief that cannot be measured or proven.", incorrectFeedback: "This is an opinion. It is a personal belief that cannot be proven." },
            { text: "The government should host more international sporting events in smaller cities rather than only in metros.", type: "opinion", correctFeedback: "'Should' expresses a recommendation or value judgment, not a verifiable fact.", incorrectFeedback: "This is an opinion. 'Should' expresses a recommendation." }
          ]
        },
        {
          title: "Local News Roundup",
          sentences: [
            { text: "The new library opened on Monday with over 10,000 books.", type: "fact", correctFeedback: "Opening date and book count are verifiable facts.", incorrectFeedback: "This is a fact." },
            { text: "The library is the best addition to our town in decades.", type: "opinion", correctFeedback: "'Best' is a subjective judgment.", incorrectFeedback: "This is an opinion." },
            { text: "Mayor Chen attended the ribbon-cutting ceremony.", type: "fact", correctFeedback: "Attendance at a public event can be verified.", incorrectFeedback: "This is a fact." },
            { text: "Everyone should visit the library at least once a week.", type: "opinion", correctFeedback: "'Should' expresses a recommendation.", incorrectFeedback: "This is an opinion." },
            { text: "Funding for the library came from a state grant of $2 million.", type: "fact", correctFeedback: "Funding sources and amounts are verifiable.", incorrectFeedback: "This is a fact." },
            { text: "The building design is more beautiful than any other in the county.", type: "opinion", correctFeedback: "'More beautiful' is a subjective judgment.", incorrectFeedback: "This is an opinion." }
          ]
        }
      ]
    },
    {
      name: "Science & Discovery",
      passages: [
        {
          title: "Mars Rover Mission",
          sentences: [
            { text: "The rover landed on Mars in February 2021.", type: "fact", correctFeedback: "Landing date is a verifiable fact.", incorrectFeedback: "This is a fact." },
            { text: "Exploring Mars is the most important goal for space agencies today.", type: "opinion", correctFeedback: "'Most important' is a value judgment.", incorrectFeedback: "This is an opinion." },
            { text: "The rover collected 20 rock samples in its first year.", type: "fact", correctFeedback: "Sample counts can be verified from mission data.", incorrectFeedback: "This is a fact." },
            { text: "Scientists believe the Jezero Crater once held water.", type: "opinion", correctFeedback: "'Believe' indicates a conclusion based on evidence, not a proven fact.", incorrectFeedback: "This expresses a belief." },
            { text: "The mission cost approximately $2.7 billion.", type: "fact", correctFeedback: "Mission costs are documented and verifiable.", incorrectFeedback: "This is a fact." },
            { text: "Human missions to Mars would be more exciting than robotic ones.", type: "opinion", correctFeedback: "'More exciting' is subjective.", incorrectFeedback: "This is an opinion." }
          ]
        },
        {
          title: "Climate Data",
          sentences: [
            { text: "Global average temperature has risen by about 1.1°C since pre-industrial times.", type: "fact", correctFeedback: "Temperature change is measured and reported by scientific bodies.", incorrectFeedback: "This is a fact." },
            { text: "Climate change is the worst crisis humanity has ever faced.", type: "opinion", correctFeedback: "'Worst crisis' is a value judgment.", incorrectFeedback: "This is an opinion." },
            { text: "Carbon dioxide levels in the atmosphere exceed 400 ppm.", type: "fact", correctFeedback: "CO₂ levels are directly measured.", incorrectFeedback: "This is a fact." },
            { text: "Governments should do more to reduce emissions.", type: "opinion", correctFeedback: "'Should' expresses a recommendation.", incorrectFeedback: "This is an opinion." },
            { text: "The last decade was the warmest on record.", type: "fact", correctFeedback: "Temperature records are verifiable.", incorrectFeedback: "This is a fact." },
            { text: "Renewable energy is clearly the best solution.", type: "opinion", correctFeedback: "'Best solution' is a judgment.", incorrectFeedback: "This is an opinion." }
          ]
        }
      ]
    },
    {
      name: "Book Reviews & Blogs",
      passages: [
        {
          title: "Bestseller Review",
          sentences: [
            { text: "The book was published in March 2023 and has 320 pages.", type: "fact", correctFeedback: "Publication date and page count are verifiable.", incorrectFeedback: "This is a fact." },
            { text: "It is the most gripping novel of the year.", type: "opinion", correctFeedback: "'Most gripping' is subjective.", incorrectFeedback: "This is an opinion." },
            { text: "The author has written five previous novels.", type: "fact", correctFeedback: "Bibliographic information can be verified.", incorrectFeedback: "This is a fact." },
            { text: "Readers will find the ending deeply satisfying.", type: "opinion", correctFeedback: "Predicting reader response is an opinion.", incorrectFeedback: "This is an opinion." },
            { text: "The book spent 12 weeks on the bestseller list.", type: "fact", correctFeedback: "Bestseller list data is verifiable.", incorrectFeedback: "This is a fact." },
            { text: "This is a must-read for everyone.", type: "opinion", correctFeedback: "'Must-read' is a recommendation.", incorrectFeedback: "This is an opinion." }
          ]
        },
        {
          title: "Blog Post",
          sentences: [
            { text: "The blog was updated three times last week.", type: "fact", correctFeedback: "Update frequency can be verified.", incorrectFeedback: "This is a fact." },
            { text: "The writer's style is more engaging than most.", type: "opinion", correctFeedback: "'More engaging' is subjective.", incorrectFeedback: "This is an opinion." },
            { text: "The post includes 15 links to external sources.", type: "fact", correctFeedback: "Link count is verifiable.", incorrectFeedback: "This is a fact." },
            { text: "Everyone should follow this blog.", type: "opinion", correctFeedback: "'Should' is a recommendation.", incorrectFeedback: "This is an opinion." },
            { text: "Comments were disabled after 500 were received.", type: "fact", correctFeedback: "This can be verified on the site.", incorrectFeedback: "This is a fact." },
            { text: "The topic is the most important one for our times.", type: "opinion", correctFeedback: "'Most important' is a judgment.", incorrectFeedback: "This is an opinion." }
          ]
        }
      ]
    },
    {
      name: "History & Biography",
      passages: [
        {
          title: "Historical Event",
          sentences: [
            { text: "The treaty was signed on 15 August 1947.", type: "fact", correctFeedback: "Dates of historical events are verifiable.", incorrectFeedback: "This is a fact." },
            { text: "That day was the greatest day in the nation's history.", type: "opinion", correctFeedback: "'Greatest' is a value judgment.", incorrectFeedback: "This is an opinion." },
            { text: "Three leaders gave speeches at the ceremony.", type: "fact", correctFeedback: "Attendance and roles can be verified.", incorrectFeedback: "This is a fact." },
            { text: "The speeches were more inspiring than any before or since.", type: "opinion", correctFeedback: "'More inspiring' is subjective.", incorrectFeedback: "This is an opinion." },
            { text: "The document is 12 pages long and written in two languages.", type: "fact", correctFeedback: "Document length and language are verifiable.", incorrectFeedback: "This is a fact." },
            { text: "Historians consider this the most significant treaty of the century.", type: "opinion", correctFeedback: "'Most significant' is an interpretive judgment.", incorrectFeedback: "This is an opinion." }
          ]
        },
        {
          title: "Biography Excerpt",
          sentences: [
            { text: "She was born in 1920 and lived in five countries.", type: "fact", correctFeedback: "Birth year and places can be verified.", incorrectFeedback: "This is a fact." },
            { text: "She was the bravest person of her generation.", type: "opinion", correctFeedback: "'Bravest' is a subjective judgment.", incorrectFeedback: "This is an opinion." },
            { text: "Her first book was published when she was 30.", type: "fact", correctFeedback: "Publication and age are verifiable.", incorrectFeedback: "This is a fact." },
            { text: "That book remains the best introduction to the subject.", type: "opinion", correctFeedback: "'Best' is subjective.", incorrectFeedback: "This is an opinion." },
            { text: "She received three major awards during her lifetime.", type: "fact", correctFeedback: "Awards can be verified.", incorrectFeedback: "This is a fact." },
            { text: "Her legacy is more important than that of any of her peers.", type: "opinion", correctFeedback: "'More important' is a judgment.", incorrectFeedback: "This is an opinion." }
          ]
        }
      ]
    },
    {
      name: "Travel & Culture",
      passages: [
        {
          title: "Travel Guide",
          sentences: [
            { text: "The temple was built in the 12th century and has 50 pillars.", type: "fact", correctFeedback: "Historical and architectural details are verifiable.", incorrectFeedback: "This is a fact." },
            { text: "It is the most beautiful temple in the region.", type: "opinion", correctFeedback: "'Most beautiful' is subjective.", incorrectFeedback: "This is an opinion." },
            { text: "The site is open from 9 a.m. to 6 p.m. daily.", type: "fact", correctFeedback: "Opening hours can be verified.", incorrectFeedback: "This is a fact." },
            { text: "Visitors should allow at least two hours for a full tour.", type: "opinion", correctFeedback: "'Should' and 'full' involve recommendation and judgment.", incorrectFeedback: "This is an opinion." },
            { text: "Entry fee is 200 rupees for adults.", type: "fact", correctFeedback: "Entry fees are verifiable.", incorrectFeedback: "This is a fact." },
            { text: "This is the most rewarding day trip you can take.", type: "opinion", correctFeedback: "'Most rewarding' is subjective.", incorrectFeedback: "This is an opinion." }
          ]
        },
        {
          title: "Cultural Festival",
          sentences: [
            { text: "The festival runs for 10 days each spring.", type: "fact", correctFeedback: "Duration and timing are verifiable.", incorrectFeedback: "This is a fact." },
            { text: "It is the most exciting event of the year.", type: "opinion", correctFeedback: "'Most exciting' is subjective.", incorrectFeedback: "This is an opinion." },
            { text: "Over 100 artists performed last year.", type: "fact", correctFeedback: "Participant numbers can be verified.", incorrectFeedback: "This is a fact." },
            { text: "The music is more authentic than at other festivals.", type: "opinion", correctFeedback: "'More authentic' is a judgment.", incorrectFeedback: "This is an opinion." },
            { text: "The festival was first held in 1985.", type: "fact", correctFeedback: "Historical dates are verifiable.", incorrectFeedback: "This is a fact." },
            { text: "Everyone would enjoy attending at least once.", type: "opinion", correctFeedback: "Predicting enjoyment is an opinion.", incorrectFeedback: "This is an opinion." }
          ]
        }
      ]
    }
  ];
  let currentCategoryIndex = 0;
  let currentPassageIndex = 0;
  let currentTool = null; // 'fact' or 'opinion'
  let userSelections = new Array(SENTENCE_COUNT).fill(null);
  const state = {
    screen: "library",
    categoryIndex: 0,
    passageIndex: 0,
    selectedHighlighter: null,
    sentenceClassifications: [],
    submitted: false,
    passageData: null
  };

  const UI = {};
  let confettiAnim = null;

  function cacheDOM() {
    UI.svg = document.querySelector("#svg-container svg");
    UI.container = document.getElementById("svg-container");
    UI.books = CATEGORY_IDS.map(id => document.getElementById(id));
    UI.factHighlighter = document.getElementById("fact-highlighter");
    UI.opinionHighlighter = document.getElementById("opinion-highlighter");
    UI.checkBtn = document.getElementById("button-_check_answer");
    UI.sentenceNumber = document.getElementById("sentence-number");
    UI.sentenceCountText = document.querySelector("#sentence-number text[tspan]");
    UI.passageNumber = document.getElementById("passage-number");
    UI.passageLabel = document.querySelector("#Passage_1_of_2 text");
    UI.textBg = document.getElementById("text-bg");
    UI.textPanel = document.getElementById("text-panel");
    UI.feedbackText = document.getElementById("feedback_text");
    UI.iText01 = document.getElementById("i-text-01");
    UI.iText02 = document.getElementById("i-text-02");
    UI.darkPatch = document.getElementById("dark-patch");
    UI.completeBgPanel = document.getElementById("complete-bg-panel");
    UI.textPassageComplete = document.getElementById("text-passage-complete");
    UI.scoreText = document.getElementById("score-text");
    UI.starBg = document.getElementById("star-bg");
    UI.star = document.getElementById("star");
    UI.buttonLibrary = document.getElementById("button-library");
    UI.nuttonLibrary = document.getElementById("nutton-library");
    UI.buttonNextPassage = document.getElementById("button-next_passage");
    UI.passageContent = document.getElementById("passage-content");
    UI.passageTitleEl = document.getElementById("passage-title");
    UI.labelChoosBook = document.getElementById("label-choos_book");
    UI.bodyText = document.getElementById("body-text");
    UI.commonBG = document.getElementById("common-BG");
    UI.book01Thumbnail = document.getElementById("book-01-thumbnail");
    UI.bookCoverPath = document.querySelector("#book-01-thumbnail #Path_8157-2");
    UI.bookSpinePath = document.querySelector("#book-01-thumbnail #Path_8158-2");
    UI.bookThumbnailLabel = document.getElementById("book-thumbnail-label");
    UI.bookStamp = document.getElementById("book-stamp");
    UI.btnCheck = document.getElementById("button-check") || document.getElementById("Group_1719");
    UI.btnFact = document.getElementById("fact-highlighter") || document.getElementById("Group_1537");
    UI.btnOpinion = document.getElementById("opinion-highlighter") || document.getElementById("Group_1538");
    UI.lottieWrapper = document.getElementById("lottie-wrapper");
    UI.lottieConfetti = document.getElementById("lottie-confetti");
    UI.sentenceRows = [];
    for (let i = 0; i < SENTENCE_COUNT; i++) {
      const el = document.getElementById("sentence-row-" + i);
      if (el) UI.sentenceRows.push(el);
    }
  }

  function showLibrary() {
    state.screen = "library";
    state.submitted = false;
    state.sentenceClassifications = [];
    state.selectedHighlighter = null;
    hide(UI.textPanel);
    hide(UI.feedbackText);
    hide(UI.factHighlighter);
    hide(UI.opinionHighlighter);
    hide(UI.checkBtn);
    hide(UI.sentenceNumber);
    hide(UI.passageNumber);
    hide(UI.iText01);
    hide(UI.iText02);
    hide(UI.darkPatch);
    hide(UI.completeBgPanel);
    hide(UI.textPassageComplete);
    hide(UI.scoreText);
    hide(UI.starBg);
    hide(UI.star);
    hide(UI.buttonLibrary);
    hide(UI.nuttonLibrary);
    hide(UI.buttonNextPassage);
    hide(UI.commonBG);
    hide(UI.book01Thumbnail);
    hide(UI.bookStamp);
    hide(UI.textPanel)
    hide(UI.bodyText);
    hide(UI.textBg);
    show(UI.labelChoosBook);
    UI.books.forEach((book, i) => {
      if (book) {
        book.style.display = "";
        book.style.pointerEvents = "auto";
        book.style.cursor = "pointer";
      }
    });
  }

  function showPassageScreen() {
    state.screen = "passage";
    state.submitted = false;
    state.sentenceClassifications = Array(SENTENCE_COUNT).fill(null);
    state.selectedHighlighter = null;
    state.passageData = CONTENT[state.categoryIndex].passages[state.passageIndex];

    UI.books.forEach(b => { if (b) { b.style.display = "none"; } });
    show(UI.textPanel);
    show(UI.commonBG);
    show(UI.buttonLibrary);
    show(UI.book01Thumbnail);
    show(UI.bookStamp);
    show(UI.factHighlighter);
    show(UI.opinionHighlighter);
    show(UI.sentenceNumber);
    show(UI.passageNumber);
    show(UI.iText01);
    hide(UI.iText02);
    hide(UI.feedbackText);
    hide(UI.darkPatch);
    hide(UI.completeBgPanel);
    show(UI.checkBtn);
    UI.checkBtn.style.opacity = "0.5";
    UI.checkBtn.style.pointerEvents = "none";
    // hide(UI.buttonLibrary);
    hide(UI.nuttonLibrary);
    hide(UI.buttonNextPassage);

    // (reverted) remove badge-book <use> behavior and console logging

    setPassageContent(state.passageData);
    updateSentenceCount();
    updatePassageLabel();
    updateHighlighterSelection();
    if (UI.passageContent) UI.passageContent.classList.remove("review-mode");
    const passageForeign = document.getElementById("passage-foreign");
    if (passageForeign) passageForeign.style.display = "";
    if (UI.bookThumbnailLabel) {
      UI.bookThumbnailLabel.textContent = CONTENT[state.categoryIndex].name;

    }
  }
  function showPassageScreen1() {
    state.screen = "passage";
    state.submitted = false;
    state.sentenceClassifications = Array(SENTENCE_COUNT).fill(null);
    state.selectedHighlighter = null;
    state.passageData = CONTENT[state.categoryIndex].passages[state.passageIndex];

    UI.books.forEach(b => { if (b) { b.style.display = "none"; } });
    show(UI.textPanel);
    show(UI.commonBG);
    show(UI.buttonLibrary);
    show(UI.book01Thumbnail);
    show(UI.bookStamp);
    show(UI.factHighlighter);
    show(UI.opinionHighlighter);
    show(UI.sentenceNumber);
    show(UI.passageNumber);
    show(UI.iText01);
    hide(UI.iText02);
    hide(UI.darkPatch);
    hide(UI.completeBgPanel);
    show(UI.checkBtn);

    UI.checkBtn.style.opacity = "0.5";
    UI.checkBtn.style.pointerEvents = "none";
    hide(UI.nuttonLibrary);
    hide(UI.buttonNextPassage);

    // (reverted) remove thumbnail text hack and logging

    setPassageContent(state.passageData);
    updateSentenceCount();
    updatePassageLabel();
    updateHighlighterSelection();
    if (UI.passageContent) UI.passageContent.classList.remove("review-mode");
  }

  function setPassageContent(passage) {
    if (UI.passageTitleEl) {
      UI.passageTitleEl.querySelector("text").textContent = passage.title;
      //UI.passageTitleEl.textContent = passage.title;
    }
    passage.sentences.forEach((s, i) => {
      const row = UI.sentenceRows[i];
      if (row) {
        const textEl = row.querySelector(".sentence-text");
        if (textEl) textEl.textContent = s.text;
        row.dataset.sentenceIndex = String(i);
        row.dataset.correctType = s.type;
        row.dataset.correctFeedback = s.correctFeedback || "";
        row.dataset.incorrectFeedback = s.incorrectFeedback || "";
        row.classList.remove("highlight-fact", "highlight-opinion", "correct", "incorrect");
        row.style.pointerEvents = "";
      }
    });
  }

  function updateSentenceCount() {
    const n = state.sentenceClassifications.filter(Boolean).length;
    const counterGroup = document.getElementById("_0_of_6_sentences_highlighted");
    if (counterGroup) {
      const firstText = counterGroup.querySelector("text");
      const tspan = firstText && firstText.querySelector("tspan");
      if (tspan) tspan.textContent = String(n);
    }
    const checkBtn = UI.checkBtn;
    if (checkBtn) {
      if (n === SENTENCE_COUNT) {
        checkBtn.style.pointerEvents = "auto";
        checkBtn.style.opacity = "1";
        checkBtn.style.cursor = "pointer";
      } else {
        checkBtn.style.pointerEvents = "none";
        checkBtn.style.opacity = "0.5";
      }
    }
  }

  function updatePassageLabel() {
    const passageGroup = document.getElementById("Passage_1_of_2");
    if (passageGroup) {
      const texts = passageGroup.querySelectorAll("text");
      const numText = texts[1];
      if (numText) {
        const tspan = numText.querySelector("tspan");
        if (tspan) tspan.textContent = String(state.passageIndex + 1);
      }
    }
  }

  function updateHighlighterSelection() {
    if (UI.factHighlighter) {
      UI.factHighlighter.style.opacity = state.selectedHighlighter === "fact" ? "1" : "0.6";
    }
    if (UI.opinionHighlighter) {
      UI.opinionHighlighter.style.opacity = state.selectedHighlighter === "opinion" ? "1" : "0.6";
    }
  }

  function onBookClick(index) {
    if (state.screen !== "library") return;
    state.categoryIndex = index;
    state.passageIndex = 0;
    hide(UI.labelChoosBook);
    show(UI.bodyText);
    showPassageScreen();
  }

  function onHighlighterClick(type) {
    if (state.submitted) return;
    state.selectedHighlighter = type;
    updateHighlighterSelection();
  }

  function onSentenceClick(index) {
    if (state.submitted) {
      const row = UI.sentenceRows[index];
      if (!row) return;
      const isCorrect = row.dataset.isCorrect === "1";
      const msg = isCorrect ? (row.dataset.correctFeedback || "") : (row.dataset.incorrectFeedback || "");
      const detail = document.getElementById("feedback-detail");
      if (detail) {
        detail.textContent = msg;
        detail.style.display = msg ? "block" : "none";
      }
      return;
    }
    if (!state.selectedHighlighter) return;
    const current = state.sentenceClassifications[index];
    if (current === state.selectedHighlighter) {
      state.sentenceClassifications[index] = null;
    } else {
      state.sentenceClassifications[index] = state.selectedHighlighter;
    }
    const row = UI.sentenceRows[index];
    if (row) {
      row.classList.remove("highlight-fact", "highlight-opinion");
      const v = state.sentenceClassifications[index];
      if (v) row.classList.add("highlight-" + v);
    }
    updateSentenceCount();
  }

  function onCheckClick() {
    const n = state.sentenceClassifications.filter(Boolean).length;
    if (n !== SENTENCE_COUNT) return;
    state.submitted = true;

    hide(UI.factHighlighter);
    hide(UI.opinionHighlighter);
    hide(UI.checkBtn);
    const passageForeign = document.getElementById("passage-foreign");
    if (passageForeign) passageForeign.style.display = "none";

    if (UI.passageContent) UI.passageContent.classList.add("review-mode");

    // Show SVG feedback layer (expected design behavior)
    show(UI.feedbackText);
    renderFeedbackLayer();
    show(UI.textBg)
    show(UI.iText02);
    hide(UI.iText01);

    const passage = state.passageData;
    let correct = 0;
    passage.sentences.forEach((s, i) => {
      const row = UI.sentenceRows[i];
      if (!row) return;
      const userChoice = state.sentenceClassifications[i];
      const isCorrect = userChoice === s.type;
      if (isCorrect) correct++;
      row.classList.remove("highlight-fact", "highlight-opinion", "correct", "incorrect");
      row.classList.add(isCorrect ? "correct" : "incorrect");
      row.dataset.isCorrect = isCorrect ? "1" : "0";
      row.dataset.correctType = s.type;
      row.dataset.correctFeedback = s.correctFeedback || "";
      row.dataset.incorrectFeedback = s.incorrectFeedback || "";
    });

    showFeedbackIconsAndBoxes();
  }

  function showFeedbackIconsAndBoxes() {
    const passage = state.passageData;
    if (!passage) return;
    passage.sentences.forEach((s, i) => {
      const row = UI.sentenceRows[i];
      if (!row) return;
      const isCorrect = state.sentenceClassifications[i] === s.type;
      row.dataset.isCorrect = isCorrect ? "1" : "0";
      row.dataset.correctFeedback = s.correctFeedback || "";
      row.dataset.incorrectFeedback = s.incorrectFeedback || "";
    });
  }

  function renderFeedbackLayer() {
    const fb = document.getElementById("feedback-content");
    const passage = state.passageData;
    if (!fb || !passage) return;

    const rowsHtml = passage.sentences.map((s, i) => {
      const userChoice = state.sentenceClassifications[i];
      const isCorrect = userChoice === s.type;
      const chosen = userChoice || "fact";
      const explText = isCorrect ? (s.correctFeedback || "") : (s.incorrectFeedback || "");
      const explHtml = isCorrect
        ? ""
        : `<div class="fb-expl" data-expl-for="${i}"><strong>${s.type === "fact" ? "This is a fact." : "This is an opinion."}</strong> ${escapeHtml(explText)}</div>`;
      return `
        <div class="fb-row ${chosen} ${isCorrect ? "correct" : "incorrect"}" data-sentence-index="${i}" data-is-correct="${isCorrect ? "1" : "0"}">
          <div class="fb-text">${escapeHtml(s.text)}</div>
          <div class="fb-icon ${isCorrect ? "ok" : "no"}">${isCorrect ? "✓" : "✗"}</div>
        </div>
        ${explHtml}
      `;
    }).join("");

    fb.innerHTML = `<div class="fb-title">${escapeHtml(passage.title)}</div>${rowsHtml}`;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#039;");
  }

  function onNextPassage() {
    state.passageIndex = 1;
    state.submitted = false;
    state.sentenceClassifications = Array(SENTENCE_COUNT).fill(null);
    state.selectedHighlighter = null;
    state.passageData = CONTENT[state.categoryIndex].passages[state.passageIndex];
    setPassageContent(state.passageData);
    updateSentenceCount();
    updatePassageLabel();
    show(UI.factHighlighter);
    show(UI.opinionHighlighter);
    show(UI.checkBtn);
    hide(UI.feedbackText);
    hide(UI.iText02);
    show(UI.iText01);
    hide(UI.darkPatch);
    hide(UI.completeBgPanel);
    hide(UI.textPassageComplete);
    hide(UI.scoreText);
    hide(UI.starBg);
    hide(UI.star);
    hide(UI.buttonNextPassage);
    hide(UI.nuttonLibrary);
    hide(UI.textBg);
    if (UI.passageContent) UI.passageContent.classList.remove("review-mode");
    const passageForeign = document.getElementById("passage-foreign");
    if (passageForeign) passageForeign.style.display = "";
  }

  function showResults() {
    const passage = state.passageData;
    const correctCount = passage.sentences.filter((s, i) => state.sentenceClassifications[i] === s.type).length;
    const pct = Math.round((correctCount / SENTENCE_COUNT) * 100);

    show(UI.darkPatch);
    show(UI.completeBgPanel);
    show(UI.textPassageComplete);
    show(UI.scoreText);
    show(UI.starBg);

    const scoreTexts = UI.scoreText && UI.scoreText.querySelectorAll("text");
    if (scoreTexts && scoreTexts[1]) {
      const t = scoreTexts[1].querySelector("tspan");
      if (t) t.textContent = correctCount + "/6";
    }
    if (scoreTexts && scoreTexts[3]) {
      const t = scoreTexts[3].querySelector("tspan");
      if (t) t.textContent = pct + "%";
    }

    const stars = UI.starBg && UI.starBg.querySelectorAll("g[clip-path]");
    if (stars && stars.length >= 5) {
      const filled = Math.round((correctCount / SENTENCE_COUNT) * 5);
      stars.forEach((s, i) => {
        const path = s.querySelector("path");
        if (path) path.setAttribute("fill", i < filled ? "#ffef99" : "#7f4619");
      });
    }

    if (state.passageIndex === 0) {
      show(UI.buttonNextPassage);
      hide(UI.nuttonLibrary);
    } else {
      hide(UI.buttonNextPassage);
      show(UI.nuttonLibrary);
      const completeTextEl = UI.textPassageComplete && UI.textPassageComplete.querySelector("text");
      if (completeTextEl) completeTextEl.textContent = "Activity Complete! ";
    }
  }

  function hide(el) {
    if (el) {
      el.style.display = "none";
      if (el.style) el.style.pointerEvents = "none";
    }
  }

  function show(el) {
    if (el) {
      el.style.display = "block";
      if (el.style) el.style.pointerEvents = "";
    }
  }

  function bindEvents() {
    UI.books.forEach((book, i) => {
      if (book) {
        book.addEventListener("click", () => onBookClick(i));
      }
    });
    CATEGORY_IDS.forEach((id, index) => {
      const book = document.getElementById(id);
      if (book) {
        book.style.cursor = "pointer";
        book.addEventListener("click", () => startCategory(index));
      }
    });
    if (UI.factHighlighter) {
      UI.factHighlighter.addEventListener("click", () => onHighlighterClick("fact"));
      UI.factHighlighter.style.cursor = "pointer";
      UI.factHighlighter.style.pointerEvents = "auto";
    }
    if (UI.opinionHighlighter) {
      UI.opinionHighlighter.addEventListener("click", () => onHighlighterClick("opinion"));
      UI.opinionHighlighter.style.cursor = "pointer";
      UI.opinionHighlighter.style.pointerEvents = "auto";
    }

    if (UI.checkBtn) {
      UI.checkBtn.addEventListener("click", () => {
        if (state.sentenceClassifications.filter(Boolean).length !== SENTENCE_COUNT) return;
        playConfetti();
        onCheckClick();
        showResults();
      });
      UI.checkBtn.style.cursor = "pointer";
    }

    UI.sentenceRows.forEach((row, i) => {
      if (row) {
        row.addEventListener("click", () => onSentenceClick(i));
        row.style.cursor = "pointer";
      }
    });

    const nextBtn = document.getElementById("button-next_passage");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        onNextPassage();
      });
      nextBtn.style.cursor = "pointer";
    }
    const libBtn2 = document.getElementById("nutton-library");
    if (libBtn2) {
      libBtn2.addEventListener("click", () => showLibrary());
      libBtn2.style.cursor = "pointer";
    }

    const libBtn = document.getElementById("button-library") || document.getElementById("nutton-library");
    if (libBtn) {
      libBtn.addEventListener("click", () => showLibrary());
      libBtn.style.cursor = "pointer";
    }
    if (UI.btnFact) {
      UI.btnFact.addEventListener("click", () => {
        currentTool = "fact";
        highlightTool("fact");
      });
    }
    if (UI.btnOpinion) {
      UI.btnOpinion.addEventListener("click", () => {
        currentTool = "opinion";
        highlightTool("opinion");
      });
    }

    // Check Button
    if (UI.btnCheck) {
      UI.btnCheck.addEventListener("click", () => {
        playConfetti();
        checkAnswers();
      });
    }
  }

  function playConfetti() {
    if (!UI.lottieWrapper || !UI.lottieConfetti || !window.lottie) return;
    UI.lottieWrapper.style.display = "block";

    if (!confettiAnim) {
      confettiAnim = window.lottie.loadAnimation({
        container: UI.lottieConfetti,
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "./assets/Animation/confetti-anim-02.json"
      });
      confettiAnim.addEventListener("complete", () => {
        UI.lottieWrapper.style.display = "none";
      });
    }

    confettiAnim.stop();
    confettiAnim.play();
  }

  function init() {
    cacheDOM();
    if (!UI.passageContent) createPassageContainer();
    bindEvents();
    showLibrary();
  }
  function highlightTool(type) {
    // Reset visual state of markers
    [UI.btnFact, UI.btnOpinion].forEach(b => b.style.opacity = "0.6");
    if (type === "fact") UI.btnFact.style.opacity = "1";
    if (type === "opinion") UI.btnOpinion.style.opacity = "1";
  }
  function createPassageContainer1() {
    const textPanel = document.getElementById("text-panel");
    if (!textPanel) return;
    const foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    show(UI.bodyText);
    foreign.setAttribute("x", "277");
    foreign.setAttribute("y", "121");
    foreign.setAttribute("width", "1367");
    foreign.setAttribute("height", "642");
    foreign.setAttribute("id", "passage-foreign");
    const div = document.createElement("div");
    div.id = "passage-content";
    div.className = "passage-scroll";
    div.innerHTML = '<h3 id="passage-title"></h3>' +
      [0, 1, 2, 3, 4, 5].map(i => `<div id="sentence-row-${i}" class="sentence-row" data-sentence-index="${i}"><span class="sentence-text"></span></div>`).join("");
    foreign.appendChild(div);
    textPanel.appendChild(foreign);
    cacheDOM();
    UI.sentenceRows.forEach((row, i) => {
      if (row) {
        row.addEventListener("click", () => onSentenceClick(i));
        row.style.cursor = "pointer";
      }
    });
  }
  // Replace your existing createPassageContainer function with this one
  let currentSelectionMode = null; // 'fact' or 'opinion'

  // Update this in your bindEvents or where you click the highlighters
  function bindHighlighterEvents() {
    const factHighlighter = document.getElementById('fact-highlighter-id'); // Update with your actual ID
    const opinionHighlighter = document.getElementById('opinion-highlighter-id');

    factHighlighter.addEventListener('click', () => {
      currentSelectionMode = 'fact';
      // Add visual 'active' class to highlighter if needed
    });

    opinionHighlighter.addEventListener('click', () => {
      currentSelectionMode = 'opinion';
    });
  }

  function createPassageContainer() {
    const textPanel = document.getElementById("text-panel");
    if (!textPanel) return;

    // Remove existing if any
    const old = document.getElementById("passage-foreign");
    if (old) old.remove();

    const foreign = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    foreign.setAttribute("x", "290"); // Adjusted for book margins
    foreign.setAttribute("y", "150");
    foreign.setAttribute("width", "1340");
    foreign.setAttribute("height", "650");
    foreign.setAttribute("id", "passage-foreign");

    const div = document.createElement("div");
    div.id = "passage-content";
    div.className = "passage-scroll";

    // Use a fragment for performance
    const fragment = document.createDocumentFragment();

    const title = document.createElement("h2");
    title.id = "passage-title";
    title.style.textAlign = "center";
    fragment.appendChild(title);

    const textWrapper = document.createElement("div");
    textWrapper.className = "text-wrapper"; // Will have display: inline in CSS

    for (let i = 0; i < SENTENCE_COUNT; i++) {
      const sentenceContainer = document.createElement("div");
      sentenceContainer.className = "sentence-block";

      // The clickable sentence
      const span = document.createElement("span");
      span.id = `sentence-${i}`;
      span.className = "sentence-item";
      span.onclick = () => handleSentenceClick(i);

      // The feedback box (Accordion)
      const feedbackDiv = document.createElement("div");
      feedbackDiv.id = `feedback-row-${i}`;
      feedbackDiv.className = "feedback-row";

      // Inner content for feedback
      feedbackDiv.innerHTML = `
            <span class="feedback-type" id="feedback-type-${i}"></span>
            <span class="feedback-explanation" id="feedback-explanation-${i}"></span>
        `;

      sentenceContainer.appendChild(span);
      sentenceContainer.appendChild(feedbackDiv);
      div.appendChild(sentenceContainer);// Space between sentences
      // Space between sentences
    }


    foreign.appendChild(div);
    textPanel.appendChild(foreign);

    UI.passageContent = div;
    UI.passageTitle = title;
  }


  function handleSentenceClick(index) {
    if (isChecked) {
      // Toggle explanation on tap after checking
      const row = document.getElementById(`feedback-row-${i}`);
      row.style.display = row.style.display === "block" ? "none" : "block";
    } else {
      if (!currentTool) return; // User must select a marker first

      const span = document.getElementById(`sentence-${index}`);

      // Clear old classes
      span.classList.remove("mark-fact", "mark-opinion");

      // Apply new class
      span.classList.add(`mark-${currentTool}`);
      userSelections[index] = currentTool;
    }
  }


  function startCategory(index) {
    currentCategoryIndex = index;
    currentPassageIndex = 0;
    loadPassage();
    // Hide library, show activity screen
    document.getElementById("i-library").style.display = "none";
    document.getElementById("text-panel").style.display = "block";
  }

  function loadPassage() {
    const passage = CONTENT[currentCategoryIndex].passages[currentPassageIndex];
    UI.passageTitleEl.innerText = passage.title;

    userSelections.fill(null); // Reset choices

    for (let i = 0; i < SENTENCE_COUNT; i++) {
      const span = document.getElementById(`sentence-${i}`);
      if (span) {
        span.innerText = passage.sentences[i].text;
        span.className = "sentence-item"; // Reset highlights
      }
    }
  }

  function checkAnswers() {
    isChecked = true;
    const passage = CONTENT[currentCategoryIndex].passages[currentPassageIndex];

    passage.sentences.forEach((s, i) => {
      const span = document.getElementById(`sentence-${i}`);
      const feedbackRow = document.getElementById(`feedback-row-${i}`);
      const typeLabel = document.getElementById(`feedback-type-${i}`);
      const explanationLabel = document.getElementById(`feedback-explanation-${i}`);

      const isCorrect = userSelections[i] === s.type;

      // 1. Mark sentence border
      span.classList.add(isCorrect ? "correct-check" : "wrong-check");

      // 2. Set feedback content
      typeLabel.innerText = s.type === "fact" ? "This is a fact. " : "This is an opinion. ";
      explanationLabel.innerText = isCorrect ? s.correctFeedback : s.incorrectFeedback;

      // 3. Auto-show feedback for wrong answers (as per Image 1)
      if (!isCorrect) {
        feedbackRow.style.display = "block";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
