/**
 * Fact or Opinion - Interactive library widget
 * 5 categories, 2 passages each, 6 sentences per passage.
 * Blue = Fact, Green = Opinion. Check → feedback → Next / Activity Complete.
 */

(function () {
  const SENTENCE_COUNT = 6;
  const CATEGORY_IDS = ["book-01", "book-02", "book-03", "book-04", "book-05"];
  const booksList = [
    "book-01-thumbnail",
    "book-02-thumbnail",
    "book-03-thumbnail",
    "book-04-thumbnail",
    "book-05-thumbnail",
  ];

  // Thumbnail cover colours — matched to each book spine in the SVG
  const BOOK_COLORS = [
    { cover: "#e5005d", spine: "#c1055a", shadow: "#a00a59" }, // Book 1: Current Events & News
    { cover: "#3c73cd", spine: "#315eaf", shadow: "#124693" }, // Book 2: Science & Discovery
    { cover: "#46722d", spine: "#3b5e24", shadow: "#2c491a" }, // Book 3: Book Reviews & Blogs
    { cover: "#774791", spine: "#603579", shadow: "#4d2965" }, // Book 4: History & Biography
    { cover: "#f08e0f", spine: "#df6c09", shadow: "#b55200" }, // Book 5: Travel & Culture
  ];

  const CONTENT = [
    {
      id: "book-01-thumbnail",
      name: "Current Events & News",
      passages: [
        {
          title: "India Hosts the Chess Olympiad",
          sentences: [
            {
              text: "The 44th Chess Olympiad was held in Mahabalipuram, Tamil Nadu, in July and August 2022.",
              type: "fact",
              correctFeedback:
                "The dates and location of the Chess Olympiad are officially recorded by FIDE and can be verified.",
              incorrectFeedback:
                "The dates and location of the Chess Olympiad are officially recorded by FIDE and can be verified.",
            },
            {
              text: "The opening ceremony was the most spectacular event Indian sports has ever hosted.",
              type: "opinion",
              correctFeedback:
                "'Most spectacular' is a personal judgment—different people may consider other sporting events more impressive.",
              incorrectFeedback:
                "'Most spectacular' is a personal judgment—different people may consider other sporting events more impressive.",
            },
            {
              text: "Over 180 countries participated in the tournament, making it one of the largest Chess Olympiads in history.",
              type: "fact",
              correctFeedback:
                "The number of participating countries is documented in FIDE's official tournament records.",
              incorrectFeedback:
                "The number of participating countries is documented in FIDE's official tournament records.",
            },
            {
              text: "India's men's team and women's team both won bronze medals at the event.",
              type: "fact",
              correctFeedback:
                "Medal results are officially recorded by FIDE and widely reported in the news.",
              incorrectFeedback:
                "Medal results are officially recorded by FIDE and widely reported in the news.",
            },
            {
              text: "Hosting the Olympiad has done more for Indian chess than any coaching programme ever could.",
              type: "opinion",
              correctFeedback:
                "'More than any coaching programme ever could' is a personal belief that cannot be measured or proven.",
              incorrectFeedback:
                "'More than any coaching programme ever could' is a personal belief that cannot be measured or proven.",
            },
            {
              text: "The government should host more international sporting events in smaller cities rather than only in metros.",
              type: "opinion",
              correctFeedback:
                "'Should' signals a personal belief about policy—others may disagree about where events should be held.",
              incorrectFeedback:
                "'Should' signals a personal belief about policy—others may disagree about where events should be held.",
            },
          ],
        },
        {
          title: "India's G20 Presidency",
          sentences: [
            {
              text: "India held the presidency of the G20 from 1 December 2022 to 30 November 2023.",
              type: "fact",
              correctFeedback:
                "The dates of India's G20 presidency are officially documented and can be verified through G20 records.",
              incorrectFeedback:
                "The dates of India's G20 presidency are officially documented and can be verified through G20 records.",
            },
            {
              text: "India's handling of the presidency was far more impressive than any previous host nation's efforts.",
              type: "opinion",
              correctFeedback:
                "'Far more impressive' is a personal judgment—different analysts and nations may evaluate the presidency differently.",
              incorrectFeedback:
                "'Far more impressive' is a personal judgment—different analysts and nations may evaluate the presidency differently.",
            },
            {
              text: "The G20 summit was held in New Delhi on 9 and 10 September 2023, attended by leaders from the world's largest economies.",
              type: "fact",
              correctFeedback:
                "The summit dates, location, and attendance are officially recorded in G20 documentation.",
              incorrectFeedback:
                "The summit dates, location, and attendance are officially recorded in G20 documentation.",
            },
            {
              text: "During its presidency, India pushed for the African Union's inclusion as a permanent G20 member, which was officially accepted.",
              type: "fact",
              correctFeedback:
                "The African Union's inclusion is a documented outcome of India's G20 presidency that can be verified.",
              incorrectFeedback:
                "The African Union's inclusion is a documented outcome of India's G20 presidency that can be verified.",
            },
            {
              text: "Over 200 G20-related meetings were held across 60 cities in India during the presidency year.",
              type: "fact",
              correctFeedback:
                "The number of meetings and host cities are documented in official G20 presidency records.",
              incorrectFeedback:
                "The number of meetings and host cities are documented in official G20 presidency records.",
            },
            {
              text: "The New Delhi Declaration was the most important diplomatic achievement India has made in the 21st century.",
              type: "opinion",
              correctFeedback:
                "'Most important diplomatic achievement' is a personal evaluation—importance in diplomacy is subjective.",
              incorrectFeedback:
                "'Most important diplomatic achievement' is a personal evaluation—importance in diplomacy is subjective.",
            },
          ],
        },
      ],
    },
    {
      name: "Science & Discovery",
      id: "book-02-thumbnail",
      passages: [
        {
          title: "The Wonder of Water",
          sentences: [
            {
              text: "About 71% of the Earth's surface is covered by water.",
              type: "fact",
              correctFeedback:
                "This is a verifiable scientific figure supported by geographical data.",
              incorrectFeedback:
                "This is a verifiable scientific figure supported by geographical data.",
            },
            {
              text: "Water moves between the Earth's surface and the atmosphere through a process called the water cycle, which includes evaporation, condensation and precipitation.",
              type: "fact",
              correctFeedback:
                "This is a well-documented scientific process that can be observed and measured.",
              incorrectFeedback:
                "This is a well-documented scientific process that can be observed and measured.",
            },
            {
              text: "It is easily the most important substance on the planet, far more valuable than gold or diamonds.",
              type: "opinion",
              correctFeedback:
                "'Easily the most important' and 'far more valuable' are personal judgments—importance and value are subjective.",
              incorrectFeedback:
                "'Easily the most important' and 'far more valuable' are personal judgments—importance and value are subjective.",
            },
            {
              text: "Scientists believe the total amount of water on Earth has stayed roughly the same for over four billion years.",
              type: "fact",
              correctFeedback:
                "This is a widely accepted scientific estimate supported by research and geological evidence.",
              incorrectFeedback:
                "This is a widely accepted scientific estimate supported by research and geological evidence.",
            },
            {
              text: "The idea that we drink the same water dinosaurs once drank makes this the most amazing topic in science.",
              type: "opinion",
              correctFeedback:
                "'Most amazing' is a personal judgment—what's amazing varies from person to person.",
              incorrectFeedback:
                "'Most amazing' is a personal judgment—what's amazing varies from person to person.",
            },
            {
              text: "Governments should make water conservation their top priority above all other environmental issues.",
              type: "opinion",
              correctFeedback:
                "'Should' and 'top priority above all other' express personal beliefs about policy, not verifiable claims.",
              incorrectFeedback:
                "'Should' and 'top priority above all other' express personal beliefs about policy, not verifiable claims.",
            },
          ],
        },
        {
          title: "Life in the Rainforest",
          sentences: [
            {
              text: "Tropical rainforests are found near the equator in regions that receive over 200 centimetres of rainfall each year.",
              type: "fact",
              correctFeedback:
                "Rainfall levels and geographical distribution of rainforests are measurable and well-documented.",
              incorrectFeedback:
                "Rainfall levels and geographical distribution of rainforests are measurable and well-documented.",
            },
            {
              text: "They are home to more than half of all plant and animal species on Earth, despite covering only about 6% of the land surface.",
              type: "fact",
              correctFeedback:
                "These figures are supported by scientific research and biodiversity studies.",
              incorrectFeedback:
                "These figures are supported by scientific research and biodiversity studies.",
            },
            {
              text: "No other ecosystem on the planet is as important or as worth protecting as the rainforest.",
              type: "opinion",
              correctFeedback:
                "'No other ecosystem' and 'as important' express a personal value judgment—others may argue differently about ecosystem priorities.",
              incorrectFeedback:
                "'No other ecosystem' and 'as important' express a personal value judgment—others may argue differently about ecosystem priorities.",
            },
            {
              text: "Many rainforest plants are used in modern medicine, including treatments for malaria, heart disease and arthritis.",
              type: "fact",
              correctFeedback:
                "The medicinal use of rainforest plants is well-documented in scientific and pharmaceutical research.",
              incorrectFeedback:
                "The medicinal use of rainforest plants is well-documented in scientific and pharmaceutical research.",
            },
            {
              text: "Deforestation destroys approximately 4.7 million hectares of tropical forest every year.",
              type: "fact",
              correctFeedback:
                "Deforestation rates are tracked and published by organisations like the FAO and can be verified.",
              incorrectFeedback:
                "Deforestation rates are tracked and published by organisations like the FAO and can be verified.",
            },
            {
              text: "Losing the rainforests would be the biggest mistake humanity has ever made.",
              type: "opinion",
              correctFeedback:
                "'Biggest mistake' is a personal judgment—while deforestation is serious, ranking it against all of humanity's mistakes is subjective.",
              incorrectFeedback:
                "'Biggest mistake' is a personal judgment—while deforestation is serious, ranking it against all of humanity's mistakes is subjective.",
            },
          ],
        },
      ],
    },
    {
      id: "book-03-thumbnail",
      name: "Book Reviews & Blogs",
      passages: [
        {
          title: "Review: The White Tiger by Aravind Adiga",
          sentences: [
            {
              text: "Aravind Adiga's The White Tiger is the most powerful depiction of class divide in modern Indian fiction.",
              type: "opinion",
              correctFeedback:
                "'Most powerful' is a personal judgment—readers and critics may rank other novels differently.",
              incorrectFeedback:
                "'Most powerful' is a personal judgment—readers and critics may rank other novels differently.",
            },
            {
              text: "Published in 2008, the novel is written as a series of letters from the main character, Balram Halwai, to the Chinese Premier.",
              type: "fact",
              correctFeedback:
                "The publication date and narrative structure can be confirmed by reading the text and checking publisher records.",
              incorrectFeedback:
                "The publication date and narrative structure can be confirmed by reading the text and checking publisher records.",
            },
            {
              text: "The book won the Man Booker Prize in 2008, beating several well-known authors on the shortlist.",
              type: "fact",
              correctFeedback:
                "The Booker Prize winner is officially recorded and can be verified through award records.",
              incorrectFeedback:
                "The Booker Prize winner is officially recorded and can be verified through award records.",
            },
            {
              text: "Since its release, it has been translated into over 40 languages worldwide.",
              type: "fact",
              correctFeedback:
                "Translation figures are documented by the publisher and can be verified.",
              incorrectFeedback:
                "Translation figures are documented by the publisher and can be verified.",
            },
            {
              text: "Balram is a deeply unlikeable narrator, which makes the story difficult to enjoy.",
              type: "opinion",
              correctFeedback:
                "'Deeply unlikeable' and 'difficult to enjoy' are personal reactions—other readers may find Balram compelling.",
              incorrectFeedback:
                "'Deeply unlikeable' and 'difficult to enjoy' are personal reactions—other readers may find Balram compelling.",
            },
            {
              text: "No reader interested in understanding modern India should miss this novel.",
              type: "opinion",
              correctFeedback:
                "'No reader should miss' expresses a strong personal recommendation, not a verifiable claim.",
              incorrectFeedback:
                "'No reader should miss' expresses a strong personal recommendation, not a verifiable claim.",
            },
          ],
        },
        {
          title: "Review: Charlotte's Web by E.B. White",
          sentences: [
            {
              text: "Charlotte's Web by American author E. B. White was first published in 1952.",
              type: "fact",
              correctFeedback:
                "The author's nationality and the publication year are verifiable bibliographic details.",
              incorrectFeedback:
                "The author's nationality and the publication year are verifiable bibliographic details.",
            },
            {
              text: "It tells the story of Wilbur the pig and his friendship with a clever spider named Charlotte.",
              type: "fact",
              correctFeedback:
                "This summarises the plot and main characters, which can be confirmed by reading the book or a reliable synopsis.",
              incorrectFeedback:
                "This summarises the plot and main characters, which can be confirmed by reading the book or a reliable synopsis.",
            },
            {
              text: "White's writing feels warm and gentle, making even small moments surprisingly powerful.",
              type: "opinion",
              correctFeedback:
                "Descriptions like 'warm and gentle' and 'surprisingly powerful' are subjective reactions that may vary by reader.",
              incorrectFeedback:
                "Descriptions like 'warm and gentle' and 'surprisingly powerful' are subjective reactions that may vary by reader.",
            },
            {
              text: "The friendship at the heart of the book is so sincere that it's hard not to get emotionally attached.",
              type: "opinion",
              correctFeedback:
                "Phrases like 'so sincere' and 'hard not to get emotionally attached' reflect personal interpretation, not a provable claim.",
              incorrectFeedback:
                "Phrases like 'so sincere' and 'hard not to get emotionally attached' reflect personal interpretation, not a provable claim.",
            },
            {
              text: "It is one of the most comforting stories for young readers, staying meaningful long after you finish.",
              type: "opinion",
              correctFeedback:
                "Phrases like 'most comforting' and 'staying meaningful' are personal value judgments—not every reader might have the same experience.",
              incorrectFeedback:
                "Phrases like 'most comforting' and 'staying meaningful' are personal value judgments—not every reader might have the same experience.",
            },
            {
              text: "The book won a Newbery Honor in 1953.",
              type: "fact",
              correctFeedback:
                "Awards and dates are documented in official records and can be verified through reputable sources.",
              incorrectFeedback:
                "Awards and dates are documented in official records and can be verified through reputable sources.",
            },
          ],
        },
      ],
    },
    {
      id: "book-04-thumbnail",
      name: "History & Biography",
      passages: [
        {
          title: "Ashoka: From Warrior to Peacemaker",
          sentences: [
            {
              text: "Ashoka, the grandson of Chandragupta Maurya, became the emperor of the Mauryan Empire around 268 BCE.",
              type: "fact",
              correctFeedback:
                "This is historically documented with approximate dating confirmed by multiple sources.",
              incorrectFeedback:
                "This is historically documented with approximate dating confirmed by multiple sources.",
            },
            {
              text: "He fought the brutal Kalinga War around 261 BCE, which resulted in the deaths of over 100,000 soldiers and civilians.",
              type: "fact",
              correctFeedback:
                "These figures are referenced in Ashoka's own rock edicts and supported by historical accounts.",
              incorrectFeedback:
                "These figures are referenced in Ashoka's own rock edicts and supported by historical accounts.",
            },
            {
              text: "The suffering he witnessed during the war was the most transformative moment in ancient Indian history.",
              type: "opinion",
              correctFeedback:
                "'Most transformative' is a personal judgment—historians may view other events as equally significant.",
              incorrectFeedback:
                "'Most transformative' is a personal judgment—historians may view other events as equally significant.",
            },
            {
              text: "After the war, Ashoka converted to Buddhism and promoted the principles of non-violence and compassion through carved rock edicts across his empire.",
              type: "fact",
              correctFeedback:
                "Ashoka's conversion and his rock edicts are well-documented archaeological and historical evidence.",
              incorrectFeedback:
                "Ashoka's conversion and his rock edicts are well-documented archaeological and historical evidence.",
            },
            {
              text: "His decision to give up conquest in favour of peace was the wisest choice any ruler in the ancient world ever made.",
              type: "opinion",
              correctFeedback:
                "'Wisest choice' is a personal evaluation—wisdom in governance is subjective and debated by historians.",
              incorrectFeedback:
                "'Wisest choice' is a personal evaluation—wisdom in governance is subjective and debated by historians.",
            },
            {
              text: "The lion capital from one of his pillars at Sarnath was adopted as the national emblem of India in 1950.",
              type: "fact",
              correctFeedback:
                "This is an officially documented historical fact that can be verified through government records.",
              incorrectFeedback:
                "This is an officially documented historical fact that can be verified through government records.",
            },
          ],
        },
        {
          title: "Akbar and His Empire",
          sentences: [
            {
              text: "Akbar became the Mughal emperor in 1556 at the age of just thirteen.",
              type: "fact",
              correctFeedback:
                "Akbar's accession date and age are well-documented in historical records.",
              incorrectFeedback:
                "Akbar's accession date and age are well-documented in historical records.",
            },
            {
              text: "He expanded the empire through military conquest and controlled most of the Indian subcontinent by the end of his reign.",
              type: "fact",
              correctFeedback:
                "The extent of Akbar's empire is documented in historical records and maps from the period.",
              incorrectFeedback:
                "The extent of Akbar's empire is documented in historical records and maps from the period.",
            },
            {
              text: "Akbar established the Din-i-Ilahi, a syncretic faith that drew from Islam, Hinduism, Christianity and Zoroastrianism.",
              type: "fact",
              correctFeedback:
                "The Din-i-Ilahi and its syncretic nature are well-documented in historical texts.",
              incorrectFeedback:
                "The Din-i-Ilahi and its syncretic nature are well-documented in historical texts.",
            },
            {
              text: "His policy of religious tolerance, known as Sulh-i-Kul, was the most brilliant political strategy of the medieval period.",
              type: "opinion",
              correctFeedback:
                "'Most brilliant' is a personal judgment—historians may evaluate other strategies as equally or more effective.",
              incorrectFeedback:
                "'Most brilliant' is a personal judgment—historians may evaluate other strategies as equally or more effective.",
            },
            {
              text: "He was a better ruler than any other king in Indian history because he treated all religions equally.",
              type: "opinion",
              correctFeedback:
                "'Better ruler than any other' is a personal evaluation—comparing rulers across centuries involves subjective criteria.",
              incorrectFeedback:
                "'Better ruler than any other' is a personal evaluation—comparing rulers across centuries involves subjective criteria.",
            },
            {
              text: "The Mughal court at Fatehpur Sikri attracted scholars, artists and musicians from across Asia and Europe.",
              type: "fact",
              correctFeedback:
                "The cultural significance of Fatehpur Sikri and its visitors are documented in historical accounts.",
              incorrectFeedback:
                "The cultural significance of Fatehpur Sikri and its visitors are documented in historical accounts.",
            },
          ],
        },
      ],
    },
    {
      id: "book-05-thumbnail",
      name: "Travel & Culture",
      passages: [
        {
          title: "Exploring Rajasthan",
          sentences: [
            {
              text: "Rajasthan is the largest state in India by area, covering over 342,000 square kilometres.",
              type: "fact",
              correctFeedback:
                "This is a verifiable geographical measurement available in official records.",
              incorrectFeedback:
                "This is a verifiable geographical measurement available in official records.",
            },
            {
              text: "The state is home to several UNESCO World Heritage Sites, including the hill forts of Chittorgarh, Kumbhalgarh and Jaisalmer.",
              type: "fact",
              correctFeedback:
                "UNESCO World Heritage Site listings are officially documented and publicly accessible.",
              incorrectFeedback:
                "UNESCO World Heritage Site listings are officially documented and publicly accessible.",
            },
            {
              text: "Jaisalmer's golden sandstone fort is the most breathtaking sight a traveller can experience anywhere in India.",
              type: "opinion",
              correctFeedback:
                "'Most breathtaking' is a personal judgment—beauty and impact are subjective and vary from person to person.",
              incorrectFeedback:
                "'Most breathtaking' is a personal judgment—beauty and impact are subjective and vary from person to person.",
            },
            {
              text: "The food in Rajasthan is far tastier and more flavourful than the cuisine of any other Indian state.",
              type: "opinion",
              correctFeedback:
                "'Far tastier' and 'more flavourful than any other' express personal taste preferences, not verifiable claims.",
              incorrectFeedback:
                "'Far tastier' and 'more flavourful than any other' express personal taste preferences, not verifiable claims.",
            },
            {
              text: "Rajasthani cuisine includes dishes like dal baati churma, gatte ki sabzi and laal maas, many of which reflect the region's arid climate and limited water supply.",
              type: "fact",
              correctFeedback:
                "The dishes and their connection to the region's geography are well-documented cultural and culinary facts.",
              incorrectFeedback:
                "The dishes and their connection to the region's geography are well-documented cultural and culinary facts.",
            },
            {
              text: "Tourists should visit Rajasthan before any other destination in India because no other state offers such a rich cultural experience.",
              type: "opinion",
              correctFeedback:
                "'Should,' 'before any other,' and 'no other state' all express personal beliefs about travel priorities.",
              incorrectFeedback:
                "'Should,' 'before any other,' and 'no other state' all express personal beliefs about travel priorities.",
            },
          ],
        },
        {
          title: "Discovering Kerala",
          sentences: [
            {
              text: "Kerala is located on India's southwestern coast, stretching along the Malabar Coast for about 580 kilometres.",
              type: "fact",
              correctFeedback:
                "Kerala's location and coastal length are verifiable geographical facts.",
              incorrectFeedback:
                "Kerala's location and coastal length are verifiable geographical facts.",
            },
            {
              text: "The state's network of interconnected canals, rivers and lagoons, known as the backwaters, is one of the most unique geographical features in the country.",
              type: "opinion",
              correctFeedback:
                "'Most unique' is a personal judgment—uniqueness is subjective and other states may claim equally distinctive features.",
              incorrectFeedback:
                "'Most unique' is a personal judgment—uniqueness is subjective and other states may claim equally distinctive features.",
            },
            {
              text: "A houseboat ride through the backwaters is a far more relaxing experience than any luxury resort could offer.",
              type: "opinion",
              correctFeedback:
                "'Far more relaxing' is a personal preference—relaxation is subjective and varies from traveller to traveller.",
              incorrectFeedback:
                "'Far more relaxing' is a personal preference—relaxation is subjective and varies from traveller to traveller.",
            },
            {
              text: "Kerala was the first state in India to achieve a literacy rate of 100%, officially declared in 1991.",
              type: "fact",
              correctFeedback:
                "Kerala's literacy achievement is an officially documented milestone that can be verified through government records.",
              incorrectFeedback:
                "Kerala's literacy achievement is an officially documented milestone that can be verified through government records.",
            },
            {
              text: "Ayurvedic treatments in Kerala are better and more authentic than those available anywhere else in the world.",
              type: "opinion",
              correctFeedback:
                "'Better and more authentic' express personal beliefs about quality—authenticity and effectiveness are subjective.",
              incorrectFeedback:
                "'Better and more authentic' express personal beliefs about quality—authenticity and effectiveness are subjective.",
            },
            {
              text: "The state's cuisine, known for its use of coconut, curry leaves and fresh seafood, reflects the tropical climate and coastal geography of the region.",
              type: "fact",
              correctFeedback:
                "Kerala's culinary ingredients and their connection to the local geography are well-documented cultural facts.",
              incorrectFeedback:
                "Kerala's culinary ingredients and their connection to the local geography are well-documented cultural facts.",
            },
          ],
        },
      ],
    },
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
    passageData: null,
  };

  const UI = {};
  let confettiAnim = null;

  function cacheDOM() {
    UI.svg = document.querySelector("#svg-container svg");
    UI.container = document.getElementById("svg-container");
    UI.books = CATEGORY_IDS.map((id) => document.getElementById(id));
    UI.factHighlighter = document.getElementById("fact-highlighter");
    UI.opinionHighlighter = document.getElementById("opinion-highlighter");
    UI.checkBtn = document.getElementById("button-_check_answer");
    UI.sentenceNumber = document.getElementById("sentence-number");
    UI.sentenceCountText = document.querySelector(
      "#sentence-number text[tspan]",
    );
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
    UI.book02Thumbnail = document.getElementById("book-02-thumbnail");
    UI.book03Thumbnail = document.getElementById("book-03-thumbnail");
    UI.book04Thumbnail = document.getElementById("book-04-thumbnail");
    UI.book05Thumbnail = document.getElementById("book-05-thumbnail");
    UI.bookCoverPath = document.querySelector(
      "#book-01-thumbnail #Path_8157-2",
    );
    UI.bookSpinePath = document.querySelector(
      "#book-01-thumbnail #Path_8158-2",
    );
    UI.bookShadowPath = document.querySelector(
      "#book-01-thumbnail #Path_8163-2",
    );
    UI.bookThumbnailLabel = document.getElementById("book-thumbnail-label");
    UI.bookStamp = document.getElementById("book-stamp");
    UI.btnCheck =
      document.getElementById("button-check") ||
      document.getElementById("Group_1719");
    UI.btnFact =
      document.getElementById("fact-highlighter") ||
      document.getElementById("Group_1537");
    UI.btnOpinion =
      document.getElementById("opinion-highlighter") ||
      document.getElementById("Group_1538");
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
    document.querySelector("#idiom-wrapper .container").classList.remove("passage-bg");
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
    hide(UI.textPanel);
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
    booksList.forEach((book, i) => {
      let b = document.getElementById(book);
      if (b) {
        b.style.display = "none";
      }
    });
  }

  function showPassageScreen() {
    state.screen = "passage";
    state.submitted = false;
    state.sentenceClassifications = Array(SENTENCE_COUNT).fill(null);
    state.selectedHighlighter = null;
    state.passageData =
      CONTENT[state.categoryIndex].passages[state.passageIndex];

    UI.books.forEach((b) => {
      if (b) {
        b.style.display = "none";
      }
    });
    let panel = `book0${state.categoryIndex + 1}Thumbnail`;
    show(UI[panel]);
    // Fix: duplicate clipPath IDs in SVG defs cause wrong clipping on books 2-5
    if (UI[panel]) UI[panel].querySelectorAll("g").forEach(g => { g.style.clipPath = "none"; });
    show(UI.textPanel);
    show(UI.commonBG);
    show(UI.buttonLibrary);
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
    hide(UI.textBg);
    hide(UI.textPassageComplete)
    show(UI.checkBtn);
    hide(UI.scoreText);
    hide(UI.starBg);
    hide(UI.star);
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
    updateThumbnailColor();
  }
  function showPassageScreen1() {
    state.screen = "passage";
    state.submitted = false;
    state.sentenceClassifications = Array(SENTENCE_COUNT).fill(null);
    state.selectedHighlighter = null;
    state.passageData =
      CONTENT[state.categoryIndex].passages[state.passageIndex];

    UI.books.forEach((b) => {
      if (b) {
        b.style.display = "none";
      }
    });
    let panel1 = `book0${state.categoryIndex + 1}Thumbnail`;
    show(UI[panel1]);
    if (UI[panel1]) UI[panel1].querySelectorAll("g").forEach(g => { g.style.clipPath = "none"; });
    show(UI.textPanel);
    show(UI.commonBG);
    show(UI.buttonLibrary);
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
    updateThumbnailColor();
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
        row.classList.remove(
          "highlight-fact",
          "highlight-opinion",
          "correct",
          "incorrect",
        );
        row.style.pointerEvents = "";
      }
    });
  }

  function updateSentenceCount() {
    const n = state.sentenceClassifications.filter(Boolean).length;
    const counterGroup = document.getElementById(
      "_0_of_6_sentences_highlighted",
    );
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

  function updateThumbnailColor() {
    const colors = BOOK_COLORS[state.categoryIndex] || BOOK_COLORS[0];
    if (UI.bookCoverPath) UI.bookCoverPath.setAttribute("fill", colors.cover);
    if (UI.bookSpinePath) UI.bookSpinePath.setAttribute("fill", colors.spine);
    if (UI.bookShadowPath)
      UI.bookShadowPath.setAttribute("fill", colors.shadow);
  }

  function updateHighlighterSelection() {
    if (UI.factHighlighter) {
      UI.factHighlighter.style.opacity =
        state.selectedHighlighter === "fact" ? "1" : "0.6";
    }
    if (UI.opinionHighlighter) {
      UI.opinionHighlighter.style.opacity =
        state.selectedHighlighter === "opinion" ? "1" : "0.6";
    }
  }

  function onBookClick(index) {
    //   if (state.screen !== "library") return;
    state.categoryIndex = index;
    state.passageIndex = 0;
    hide(UI.labelChoosBook);
    show(UI.bodyText);
    //   document.querySelector("#idiom-wrapper .container").classList.add("passage-bg");
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
      const msg = isCorrect
        ? row.dataset.correctFeedback || ""
        : row.dataset.incorrectFeedback || "";
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
    hide(UI.buttonLibrary);
    const passageForeign = document.getElementById("passage-foreign");
    if (passageForeign) passageForeign.style.display = "none";

    if (UI.passageContent) UI.passageContent.classList.add("review-mode");

    // Show SVG feedback layer (expected design behavior)
    show(UI.feedbackText);
    renderFeedbackLayer();
    show(UI.textBg);
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
      row.classList.remove(
        "highlight-fact",
        "highlight-opinion",
        "correct",
        "incorrect",
      );
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

    const rowsHtml = passage.sentences
      .map((s, i) => {
        const userChoice = state.sentenceClassifications[i];
        const isCorrect = userChoice === s.type;
        const chosen = userChoice || "fact";
        const explHtml = `
        <div class="fb-expl ${isCorrect ? "correct-expl" : "incorrect-expl"}" data-expl-for="${i}">
          <strong>${s.type === "fact" ? "This is a fact." : "This is an opinion."}</strong> ${escapeHtml(isCorrect ? s.correctFeedback : s.incorrectFeedback)}
        </div>
      `;
        return `
        <div class="fb-row ${chosen} ${isCorrect ? "correct" : "incorrect"}" data-sentence-index="${i}" data-is-correct="${isCorrect ? "1" : "0"}">
          <div class="fb-text">${escapeHtml(s.text)}</div>
          <div class="fb-icon ${isCorrect ? "ok" : "no"}">${isCorrect ? "✓" : "✗"}</div>
        </div>
        ${explHtml}
      `;
      })
      .join("");

    fb.innerHTML = `<div class="fb-title">${escapeHtml(passage.title)}</div>${rowsHtml}`;
  }

  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function onNextPassage() {
    state.passageIndex = 1;
    state.submitted = false;
    state.sentenceClassifications = Array(SENTENCE_COUNT).fill(null);
    state.selectedHighlighter = null;
    state.passageData =
      CONTENT[state.categoryIndex].passages[state.passageIndex];
    setPassageContent(state.passageData);
    updateSentenceCount();
    updatePassageLabel();
    updateHighlighterSelection()
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
    const correctCount = passage.sentences.filter(
      (s, i) => state.sentenceClassifications[i] === s.type,
    ).length;
    const pct = Math.round((correctCount / SENTENCE_COUNT) * 100);

    show(UI.darkPatch);
    show(UI.completeBgPanel);
    show(UI.textPassageComplete);
    show(UI.scoreText);
    show(UI.starBg);
    show(UI.nuttonLibrary);

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
      let b = document.getElementById("Group_1752-3");
      b.style.display = "block";
      let b1 = document.getElementById("Group_1754-3");
      b1.style.display = "block";
      show(UI.buttonNextPassage);
      const nextText = UI.buttonNextPassage.querySelector("text");
      if (nextText) {
        nextText.innerHTML = '<tspan x="0" y="0">Next Passage</tspan>';
        nextText.setAttribute("transform", "translate(1275 914)");
      }
      show(UI.nuttonLibrary);
      const libText = UI.nuttonLibrary.querySelector("text");
      if (libText) {
        libText.innerHTML = '<tspan x="0" y="0">Library</tspan>';
        libText.setAttribute("transform", "translate(547.78 918.13)");
      }
      const completeTextEl =
        UI.textPassageComplete && UI.textPassageComplete.querySelector("text");
      if (completeTextEl) {
        const t = completeTextEl.querySelector("tspan");
        if (t) t.textContent = "Passage Complete! ";
      }
    } else {
      let b = document.getElementById("Group_1752-3");
      b.style.display = "none";
      let b1 = document.getElementById("Group_1754-3");
      b1.style.display = "none";
      show(UI.buttonNextPassage);
      const nextText = UI.buttonNextPassage.querySelector("text");
      if (nextText) {
        nextText.innerHTML = '<tspan x="0" y="0">Try Again</tspan>';
        nextText.setAttribute("transform", "translate(1310 914)");
      }

      show(UI.nuttonLibrary);
      const libText = UI.nuttonLibrary.querySelector("text");
      if (libText) {
        // Widen the background path for the longer text
        const path = UI.nuttonLibrary.querySelector("#Path_21-4-2");
        if (path) {
          path.setAttribute("d", "M400,857.63h350c25.68,0,46.5,20.82,46.5,46.5s-20.82,46.5-46.5,46.5h-350c-25.68,0-46.5-20.82-46.5-46.5s20.82-46.5,46.5-46.5Z");
        }
        libText.innerHTML = '<tspan x="0" y="2">Try Another Category</tspan>';
        libText.setAttribute("transform", "translate(400 918)");
      }

      const completeTextEl =
        UI.textPassageComplete && UI.textPassageComplete.querySelector("text");
      if (completeTextEl) {
        const t = completeTextEl.querySelector("tspan");
        if (t) t.textContent = "Activity Complete! ";
      }
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
      UI.factHighlighter.addEventListener("click", () =>
        onHighlighterClick("fact"),
      );
      UI.factHighlighter.style.cursor = "pointer";
      UI.factHighlighter.style.pointerEvents = "auto";
    }
    if (UI.opinionHighlighter) {
      UI.opinionHighlighter.addEventListener("click", () =>
        onHighlighterClick("opinion"),
      );
      UI.opinionHighlighter.style.cursor = "pointer";
      UI.opinionHighlighter.style.pointerEvents = "auto";
    }

    if (UI.checkBtn) {
      UI.checkBtn.addEventListener("click", () => {
        if (
          state.sentenceClassifications.filter(Boolean).length !==
          SENTENCE_COUNT
        )
          return;
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

    const libBtn2 = document.getElementById("nutton-library");
    if (libBtn2) {
      libBtn2.addEventListener("click", () => {
        if (state.passageIndex === 1 && state.submitted) {
          showLibrary();
        } else {
          showLibrary();
        }
      });
      libBtn2.style.cursor = "pointer";
    }

    const nextBtn = document.getElementById("button-next_passage");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (state.passageIndex === 1 && state.submitted) {
          // Try Again logic
          state.passageIndex = 0;
          state.submitted = false;
          onBookClick(state.categoryIndex);
        } else {
          onNextPassage();
        }
      });
      nextBtn.style.cursor = "pointer";
    }

    const libBtn =
      document.getElementById("button-library") ||
      document.getElementById("nutton-library");
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
        path: "./assets/Animation/confetti-anim-02.json",
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
    // Move book thumbnail & stamp to end of SVG so they render above dark-patch overlay
    if (UI.svg) {
      if (UI.bookStamp) UI.svg.appendChild(UI.bookStamp);
      [
        UI.book01Thumbnail,
        UI.book02Thumbnail,
        UI.book03Thumbnail,
        UI.book04Thumbnail,
        UI.book05Thumbnail,
      ].forEach((el) => {
        if (el) UI.svg.appendChild(el);
      });
    }
    bindEvents();
    showLibrary();
  }
  function highlightTool(type) {
    // Reset visual state of markers
    [UI.btnFact, UI.btnOpinion].forEach((b) => (b.style.opacity = "0.6"));
    if (type === "fact") UI.btnFact.style.opacity = "1";
    if (type === "opinion") UI.btnOpinion.style.opacity = "1";
  }
  function createPassageContainer1() {
    const textPanel = document.getElementById("text-panel");
    if (!textPanel) return;
    const foreign = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject",
    );
    show(UI.bodyText);
    foreign.setAttribute("x", "277");
    foreign.setAttribute("y", "121");
    foreign.setAttribute("width", "1367");
    foreign.setAttribute("height", "642");
    foreign.setAttribute("id", "passage-foreign");
    const div = document.createElement("div");
    div.id = "passage-content";
    div.className = "passage-scroll";
    div.innerHTML =
      '<h3 id="passage-title"></h3>' +
      [0, 1, 2, 3, 4, 5]
        .map(
          (i) =>
            `<div id="sentence-row-${i}" class="sentence-row" data-sentence-index="${i}"><span class="sentence-text"></span></div>`,
        )
        .join("");
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
    const factHighlighter = document.getElementById("fact-highlighter-id"); // Update with your actual ID
    const opinionHighlighter = document.getElementById(
      "opinion-highlighter-id",
    );

    factHighlighter.addEventListener("click", () => {
      currentSelectionMode = "fact";
      // Add visual 'active' class to highlighter if needed
    });

    opinionHighlighter.addEventListener("click", () => {
      currentSelectionMode = "opinion";
    });
  }

  function createPassageContainer() {
    const textPanel = document.getElementById("text-panel");
    if (!textPanel) return;

    // Remove existing if any
    const old = document.getElementById("passage-foreign");
    if (old) old.remove();

    const foreign = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject",
    );
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
      div.appendChild(sentenceContainer); // Space between sentences
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
    // // Hide library, show activity screen
    // document.getElementById("i-library").style.display = "none";
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
      const explanationLabel = document.getElementById(
        `feedback-explanation-${i}`,
      );

      const isCorrect = userSelections[i] === s.type;

      // 1. Mark sentence border
      span.classList.add(isCorrect ? "correct-check" : "wrong-check");

      // 2. Set feedback content
      typeLabel.innerText =
        s.type === "fact" ? "This is a fact. " : "This is an opinion. ";
      explanationLabel.innerText = isCorrect
        ? s.correctFeedback
        : s.incorrectFeedback;

      // 3. Auto-show feedback for wrong answers (as per Image 1)
      if (!isCorrect) {
        feedbackRow.style.display = "block";
      }
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
