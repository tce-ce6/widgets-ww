/* 
 * Guess the Author - Interactive Widget Logic 
 * Board: CBSE/ICSE | Grade: 9-12 | Subject: English Literature
 */

// Stores all global variables inside a single global object
window.Wg146 = {
  data: [
    {
      quote: "All the world’s a stage…",
      correct: "William Shakespeare",
      distractors: ["Leo Tolstoy", "Charles Dickens"],
      hint: "He is known as the greatest playwright in the English Language",
      alias: "‘the bard of Avon’",
      dates: "1562-1616",
      country: "England",
      works: ["The Merchant of Venice", "Julius Caesar", "Macbeth", "A Midsummer’s Night Dream", "Othello"],
      funFacts: ["Invented more than 1700 words in the English Language", "Founded the Globe Theatre", "Wrote many famous plays and poems"],
      whyRead: "His stories about love, jealousy, ambition and magic are still exciting today!",
      portraitId: "portrait-william-shakespeare"
    },
    {
      quote: "Where the mind is without fear and the head is held high…",
      correct: "Rabindranath Tagore",
      distractors: ["Sarojini Naidu", "R.K.Narayan"],
      hint: "This poet wrote the national anthem of India.",
      alias: "",
      dates: "1861-1941",
      country: "West Bengal, India",
      works: ["Gitanjali", "Kabuliwala", "The Postmaster"],
      funFacts: ["First Asian to win the Nobel Prize in literature", "Wrote the national anthem of India and Bangladesh", "Founded the Shantiniketan school in West Bengal"],
      whyRead: "His poems and stories are full of love, nature, and the beauty of everyday Indian life.",
      portraitId: "portrait-rabindranath-tagore"
    },
    {
      quote: "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
      correct: "Sir Arthur Conan Doyle",
      distractors: ["Sir Rudyard Kipling", "Sir Ian Rankin"],
      hint: "This author created the famous detective, Sherlock Holmes.",
      alias: "‘father of detective fiction’",
      dates: "1859-1930",
      country: "Scotland",
      works: ["The Hound of Baskervilles", "A Study in Scarlet", "The Adventures of Sherlock Holmes"],
      funFacts: ["Created Sherlock Holmes, the world’s most famous detective", "Was a real doctor before becoming a writer", "Based Holmes’ observational skills on his medical professor", "Killed off Sherlock Holmes in one of his books but had to bring him back due to fan demand"],
      whyRead: "His detective stories are fun and engaging to this day. They teach you to observe, think and solve mysteries.",
      portraitId: "portrait-sir-arthur-conan-doyle"
    },
    {
      quote: "A book is a friend that never lets you down.",
      correct: "Ruskin Bond",
      distractors: ["R.K.Narayan", "Roald Dahl"],
      hint: "The author lives in the hills of Mussoorie.",
      alias: "",
      dates: "1934-present",
      country: "India",
      works: ["The Blue Umbrella", "The Cherry Tree", "The Room on the Roof"],
      funFacts: ["Started writing at the age of 16", "Has lived in Mussoorie for more than 50 years", "Loves nature"],
      whyRead: "He has revolutionised children’s literature in India.",
      portraitId: "portrait-ruskin-bond"
    },
    {
      quote: "I wandered lonely as a cloud…",
      correct: "William Wordsworth",
      distractors: ["John Keats", "P.B.Shelley"],
      hint: "He wrote a poem on daffodils.",
      alias: "",
      dates: "1770-1850",
      country: "England",
      works: ["Daffodils", "Tintern Abbey", "Solitary Reaper"],
      funFacts: ["Pioneered the romantic movement in English literature", "Known as Poet Laureate for his contribution to literature", "Popularised using common language to write poetry"],
      whyRead: "His works on nature and his use of common language make his works memorable and worth a read.",
      portraitId: "portrait-william-wordsworth"
    },
    {
      quote: "Two roads diverged in a yellow wood and sorry I could not travel both…",
      correct: "Robert Frost",
      distractors: ["Mark Twain", "Edgar Allan Poe"],
      hint: "This poet wrote the poem ‘The Road not Taken.’",
      alias: "",
      dates: "1874-1963",
      country: "USA",
      works: [], 
      funFacts: ["Won 4 Pulitzer Prizes", "Recited his poem at Kennedy’s inaugural speech"],
      whyRead: "His poems about choices, nature and life make you think about your own journey.",
      portraitId: "portrait-robert-frost"
    },
    {
      quote: "We bear her along like a pearl on a string.",
      correct: "Sarojini Naidu",
      distractors: ["Nissim Ezekiel", "Munshi Premchand"],
      hint: "This poetess wrote the poem ‘The Palanquin Bearers.’",
      alias: "",
      dates: "1879-1949",
      country: "India",
      works: [],
      funFacts: ["Known as the ‘Nightingale of India’", "Fought as a freedom fighter alongside Mahatma Gandhi", "Her poems celebrate Indian culture."],
      whyRead: "Her musical poems bring alive the colours, sounds and spirit of India.",
      portraitId: "portrait-sarojini-naidu"
    },
    {
      quote: "Please, sir. I want some more.",
      correct: "Charles Dickens",
      distractors: ["Mark Twain", "O’Henry"],
      hint: "He wrote about an orphan boy named Oliver.",
      alias: "",
      dates: "1812-1870",
      country: "England",
      works: [],
      funFacts: ["Worked in a factory as a child", "Helped make ‘Merry Christmas’ a popular greeting", "Wrote about orphan boys making good fortune at the end"],
      whyRead: "His stories about poor children fighting for better lives are powerful and touching.",
      portraitId: "portrait-charles-dickens"
    },
    {
      quote: "All happy families resemble one another, each unhappy family is unhappy in its own way.",
      correct: "Leo Tolstoy",
      distractors: ["Charles Dickens", "Rudyard Kipling"],
      hint: "This author wrote War and Peace.",
      alias: "",
      dates: "1828-1910",
      country: "Russia",
      works: ["War and Peace", "Anna Karenina"],
      funFacts: ["Inspired Mahatma Gandhi", "Served in the Crimean war", "Wrote some of the greatest works of Russian Literature"],
      whyRead: "",
      portraitId: "portrait-leo-tolstoy"
    },
    {
      quote: "A thing of beauty is a joy forever.",
      correct: "John Keats",
      distractors: ["William Wordsworth", "Alfred Tennyson"],
      hint: "This poet wrote beautiful odes to a nightingale and the autumn season.",
      alias: "",
      dates: "1795-1821",
      country: "England",
      works: ["Ode to Autumn", "Ode to a Grecian Urn", "Ode to the Nightingale", "Eve of St. Agnes"],
      funFacts: ["Wrote all his famous poems before the age of 25", "Trained to be a doctor first", "Died very young", "Called ‘Brightstar’"],
      whyRead: "His poems about beauty and nature are some of the most musical ones in literature.",
      portraitId: "portrait-john-keats"
    },
    {
      quote: "April is the cruellest month.",
      correct: "T. S. Eliot",
      distractors: ["Robert Frost", "Mark Twain"],
      hint: "This poet wrote about a railway cat named Skimbleshanks",
      alias: "",
      dates: "1888-1965",
      country: "USA",
      works: ["The Love Song of J.Alfred Prufrock", "The Wasteland"],
      funFacts: ["Pioneered the Modernist movement in Literature", "Became a citizen of England", "Won the Nobel Prize for literature"],
      whyRead: "His exceptionally erudite poems are a study in modernism.",
      portraitId: "portrait-t-s-eliot"
    },
    {
      quote: "Life is made up of sobs, sniffles, and smiles, with sniffles predominating.",
      correct: "O’Henry",
      distractors: ["Rabindranath Tagore", "Charles Dickens"],
      hint: "He is the author of the story ‘Gift of the Magi.’",
      alias: "",
      dates: "1862-1910",
      country: "USA",
      works: ["The Gift of the Magi", "The Last Leaf"],
      funFacts: ["Started writing stories while in jail!", "Real name was William Porter", "Famous for surprise endings"],
      whyRead: "His short stories have the best surprise endings that make you go 'Wow!'",
      portraitId: "portrait-o-henry"
    },
    {
      quote: "Now we will count to twelve and we will all keep still.",
      correct: "Pablo Neruda",
      distractors: ["Federico Lorca", "Carlos Fuentes"],
      hint: "This author wrote a poem on keeping quiet.",
      alias: "",
      dates: "1904-1973",
      country: "Chile",
      works: ["Twenty one Love Poems and a Song of Despair", "Odas Elementas"],
      funFacts: ["One of the best known poets from Chile", "Was a senator in the Chilean government", "Stayed in hiding after criticising the Chilean Prime Minister at the time"],
      whyRead: "His poems are simple, quiet reflections of life in general.",
      portraitId: "portrait-pablo-neruda"
    },
    {
      quote: "Because I could not stop for death, he kindly stopped for me.",
      correct: "Emily Dickinson",
      distractors: ["Charlotte Bronte", "Jane Austen"],
      hint: "This poet wrote a poem about death arriving in a carriage as a gentleman caller.",
      alias: "",
      dates: "1830-1886",
      country: "USA",
      works: ["The Poems of Emily Dickinson"],
      funFacts: ["One of the leading 19th century poets", "Though she wrote over 1800 poems, only a few were published in the lifetime."],
      whyRead: "Her deeply personal poems resonate with the reader every time.",
      portraitId: "portrait-emily-dickinson"
    }
  ],

  currentIndex: 0,
  isHintActive: false,
  isMeetAuthorActive: false,

  UI: {},

  init: function() {
    this.cacheDOMElements();
    this.bindEvents();
    
    // Hide all elements initially
    this.hideAll();
    
    // Initiate the game layout shortly after start
    setTimeout(() => {
        this.startGame();
    }, 100);
  },

  cacheDOMElements: function() {
    this.UI = {
      btns: [
        document.getElementById("author_btn_1"),
        document.getElementById("author_btn_2"),
        document.getElementById("author_btn_3")
      ],
      overallHighlights: [
        document.getElementById("incorrect_answer_outline"),
        document.getElementById("correct_answer_outline")
      ],
      quoteText: document.getElementById("txt"),
      hintPanel: document.getElementById("hint_panel"),
      hintPanelGroup: document.querySelector("#hint_panel .st35"),
      meetAuthorPanel: document.getElementById("meet_author_panel"),

      meetAuthorBtn: document.getElementById("meet_author_btn"),
      nextQuoteBtn: document.getElementById("next_quote_btn"),
      hintBtn: document.getElementById("hint_button"),

      silhouette: document.getElementById("author_silhouette"),
      imagesGroup: document.getElementById("author_images"),
      maTexts: document.querySelectorAll("#meet_author_panel .st35 text"),
      
      hintPanelCloseBtn: document.getElementById("Group_5791"),
      hintPanelBg: document.querySelector("#hint_panel .st245"),
      meetAuthorCloseBtn: document.getElementById("Group_579"),
      meetAuthorBg: document.querySelector("#meet_author_panel .st245")
    };
  },

  hideAll: function() {
    if (this.UI.meetAuthorPanel) this.UI.meetAuthorPanel.style.display = "none";
    if (this.UI.hintPanel) this.UI.hintPanel.style.display = "none";
    
    // Buttons remain visible but are disabled initially
    if (this.UI.meetAuthorBtn) {
        this.UI.meetAuthorBtn.style.opacity = "0.5";
        this.UI.meetAuthorBtn.style.pointerEvents = "none";
    }
    if (this.UI.nextQuoteBtn) {
        this.UI.nextQuoteBtn.style.opacity = "0.5";
        this.UI.nextQuoteBtn.style.pointerEvents = "none";
    }
    if (this.UI.hintBtn) {
        this.UI.hintBtn.style.opacity = "0.5";
        this.UI.hintBtn.style.pointerEvents = "none";
    }
    
    if (this.UI.imagesGroup) {
      const portraits = this.UI.imagesGroup.querySelectorAll('[id^="portrait-"]');
      portraits.forEach(p => p.style.display = "none");
    }
    
    this.UI.overallHighlights.forEach(h => { if(h) h.style.display = "none"; });
    
    this.UI.btns.forEach(btn => {
      if(!btn) return;
      btn.style.opacity = "0.5";
      btn.style.pointerEvents = "none";
      const correctHlight = btn.querySelector('[id^="correct_hlight"]');
      const incorrectHlight = btn.querySelector('[id^="incorrect_hlight"]');
      if (correctHlight) correctHlight.style.display = "none";
      if (incorrectHlight) incorrectHlight.style.display = "none";
      btn.style.cursor = "default";
    });
    
    if(this.UI.quoteText) this.UI.quoteText.innerHTML = "";
    if(this.UI.silhouette) this.UI.silhouette.style.display = "none";
  },

  startGame: function() {
      this.shuffleArray(this.data);
      this.currentIndex = 0;
      this.loadQuestion();
  },

  loadQuestion: function() {
      // 1. Reset state
      this.isHintActive = false;
      this.isMeetAuthorActive = false;
      
      // Hide panels
      if (this.UI.meetAuthorPanel) this.UI.meetAuthorPanel.style.display = "none";
      if (this.UI.hintPanel) this.UI.hintPanel.style.display = "none";
      
      // Action buttons disabled state
      if (this.UI.meetAuthorBtn) {
          this.UI.meetAuthorBtn.style.opacity = "0.5";
          this.UI.meetAuthorBtn.style.pointerEvents = "none";
      }
      if (this.UI.nextQuoteBtn) {
          this.UI.nextQuoteBtn.style.opacity = "0.5";
          this.UI.nextQuoteBtn.style.pointerEvents = "none";
      }
      
      // Show required default states for a question
      if (this.UI.silhouette) this.UI.silhouette.style.display = "block";
      if (this.UI.hintBtn) {
          this.UI.hintBtn.style.pointerEvents = "auto";
          this.UI.hintBtn.style.opacity = "1";
          this.UI.hintBtn.style.cursor = "pointer";
      }

      if (this.UI.imagesGroup) {
          const portraits = this.UI.imagesGroup.querySelectorAll('[id^="portrait-"]');
          portraits.forEach(p => p.style.display = "none");
      }

      const author = this.data[this.currentIndex];

      // 2. Set Quote
      this.setQuote(author.quote);

      // 3. Set Options
      let options = [author.correct, ...author.distractors];
      this.shuffleArray(options);

      this.UI.btns.forEach((btn, idx) => {
          if (!btn) return;
          btn.style.pointerEvents = "auto";
          btn.style.opacity = "1"; // Reset styling
          btn.classList.add("option"); // Make sure option class is there for shake animation
          btn.classList.remove('wrong');

          const correctHlight = btn.querySelector('[id^="correct_hlight"]');
          const incorrectHlight = btn.querySelector('[id^="incorrect_hlight"]');
          if (correctHlight) correctHlight.style.display = "none";
          if (incorrectHlight) incorrectHlight.style.display = "none";

          const textNode = btn.querySelector('text.st30');
          if (textNode) {
              textNode.setAttribute('text-anchor', 'middle');
              let currentY = 676.88; 
              const match = textNode.getAttribute('transform')?.match(/translate\([\d.]+\s+([\d.]+)\)/);
              if (match) currentY = parseFloat(match[1]);
              const transforms = [774.11, 1224.11, 1674.11];
              textNode.setAttribute('transform', `translate(${transforms[idx]} ${currentY})`);
              
              const tspan = textNode.querySelector('tspan');
              if (tspan) {
                  const safeText = options[idx] ? options[idx] : "";
                  tspan.textContent = safeText;
                  tspan.setAttribute('x', '0');
              }
          }
          
          btn.setAttribute("data-option", options[idx]);
      });
  },

  bindEvents: function() {
      const self = this;

      this.UI.btns.forEach((btn) => {
          if(!btn) return;
          btn.addEventListener('click', function() {
              self.handleOptionClick(this);
          });
      });

      if(this.UI.hintBtn) {
          this.UI.hintBtn.style.cursor = 'pointer';
          this.UI.hintBtn.addEventListener('click', () => this.showHint());
      }

      if(this.UI.meetAuthorBtn) {
          this.UI.meetAuthorBtn.style.cursor = 'pointer';
          this.UI.meetAuthorBtn.addEventListener('click', () => this.showMeetAuthor());
      }
      
      if(this.UI.nextQuoteBtn) {
          this.UI.nextQuoteBtn.style.cursor = 'pointer';
          this.UI.nextQuoteBtn.addEventListener('click', () => this.nextQuote());
      }

      // Close events for Hint panel
      const closeHint = () => {
          if (this.UI.hintPanel) this.UI.hintPanel.style.display = "none";
          this.isHintActive = false;
      };
      if (this.UI.hintPanelCloseBtn) {
          this.UI.hintPanelCloseBtn.style.cursor = 'pointer';
          this.UI.hintPanelCloseBtn.addEventListener('click', closeHint);
      }
      if (this.UI.hintPanelBg) {
          this.UI.hintPanelBg.addEventListener('click', closeHint);
      }

      // Close events for Meet Author panel
      const closeMeetAuthor = () => {
          if (this.UI.meetAuthorPanel) this.UI.meetAuthorPanel.style.display = "none";
          this.isMeetAuthorActive = false;
      };
      if (this.UI.meetAuthorCloseBtn) {
          this.UI.meetAuthorCloseBtn.style.cursor = 'pointer';
          this.UI.meetAuthorCloseBtn.addEventListener('click', closeMeetAuthor);
      }
      if (this.UI.meetAuthorBg) {
          this.UI.meetAuthorBg.addEventListener('click', closeMeetAuthor);
      }
  },

  handleOptionClick: function(btn) {
      if (btn.style.pointerEvents === "none") return;
      
      const author = this.data[this.currentIndex];
      const selectedOption = btn.getAttribute("data-option");

      const correctHlight = btn.querySelector('[id^="correct_hlight"]');
      const incorrectHlight = btn.querySelector('[id^="incorrect_hlight"]');

      if (selectedOption === author.correct) {
          // Correct Answer
          if (correctHlight) correctHlight.style.display = "block";
          // Also hide incorrect if user tried multiple times and click correct, wait, they're separate buttons
          
          // Reveal silhouette
          if (this.UI.silhouette) this.UI.silhouette.style.display = "none";
          const portrait = document.getElementById(author.portraitId);
          if (portrait) portrait.style.display = "block";

          // Lock all choices
          this.UI.btns.forEach(b => {
              if(!b) return;
              b.style.pointerEvents = "none";
          });
          if (this.UI.hintBtn) {
              this.UI.hintBtn.style.pointerEvents = "none";
              this.UI.hintBtn.style.opacity = "0.5";
          }
          
          // Hide hint panel if open
          if (this.UI.hintPanel) this.UI.hintPanel.style.display = "none";

          // Enable 'Meet the Author' & 'Next Quote'
          if (this.UI.meetAuthorBtn) {
              this.UI.meetAuthorBtn.style.opacity = "1";
              this.UI.meetAuthorBtn.style.pointerEvents = "auto";
              this.UI.meetAuthorBtn.style.cursor = "pointer";
          }
          if (this.UI.nextQuoteBtn) {
              this.UI.nextQuoteBtn.style.opacity = "1";
              this.UI.nextQuoteBtn.style.pointerEvents = "auto";
              this.UI.nextQuoteBtn.style.cursor = "pointer";
          }

      } else {
          // Incorrect Answer
          // Apply shake class and highlight
          if (incorrectHlight) incorrectHlight.style.display = "block";
          
          btn.style.pointerEvents = "none";
          
          // Simple JS triggered animation
          btn.style.animation = "none";
          setTimeout(() => { btn.style.animation = "shake 0.3s"; }, 10);
      }
  },

  showHint: function() {
      if (!this.UI.hintBtn || this.UI.hintBtn.style.pointerEvents === "none") return;
      
      const author = this.data[this.currentIndex];
      this.isHintActive = !this.isHintActive;
      
      if (this.isHintActive) {
          // Show Hint Panel
          if (this.UI.hintPanel) this.UI.hintPanel.style.display = "block";
          const hintLines = this.wrapText(author.hint, 40);
          if (this.UI.hintPanelGroup) {
              this.UI.hintPanelGroup.innerHTML = "";
              let startY = 909; 
              hintLines.forEach((line, index) => {
                  const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
                  txt.setAttribute("class", "st43");
                  txt.setAttribute("transform", `translate(1258 ${startY + index * 46})`);
                  const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                  tspan.setAttribute("x", "0");
                  tspan.setAttribute("y", "0");
                  tspan.textContent = line;
                  txt.appendChild(tspan);
                  this.UI.hintPanelGroup.appendChild(txt);
              });
          }
      } else {
          if (this.UI.hintPanel) this.UI.hintPanel.style.display = "none";
      }
  },

  showMeetAuthor: function() {
      if (this.UI.meetAuthorPanel) this.UI.meetAuthorPanel.style.display = "block";
      const author = this.data[this.currentIndex];
      
      // Update Texts matching exactly the HTML structure
      if (this.UI.maTexts && this.UI.maTexts.length >= 12) {
          // Center align header texts
          [1, 2, 3].forEach(idx => {
              if (this.UI.maTexts[idx]) {
                  this.UI.maTexts[idx].setAttribute("text-anchor", "middle");
                  const match = this.UI.maTexts[idx].getAttribute('transform')?.match(/translate\([\d.]+\s+([\d.]+)\)/);
                  let currentY = match ? parseFloat(match[1]) : (idx === 1 ? 226.72 : (idx === 2 ? 262.72 : 292.72));
                  this.UI.maTexts[idx].setAttribute("transform", `translate(954.94 ${currentY})`);
              }
          });

          this.UI.maTexts[1].innerHTML = `<tspan x="0" y="0">${author.correct}</tspan>`;
          this.UI.maTexts[2].innerHTML = author.alias ? `<tspan x="0" y="0">${author.alias}</tspan>` : "";
          this.UI.maTexts[3].innerHTML = author.dates ? `<tspan x="0" y="0">${author.dates}</tspan>` : "";
          this.UI.maTexts[5].innerHTML = author.country ? `<tspan x="0" y="0">: ${author.country}</tspan>` : "";
          
          // Works handling
          let worksLineCount = 0;
          if (author.works && author.works.length > 0) {
              this.UI.maTexts[6].innerHTML = `<tspan x="0" y="0">Works</tspan>`;
              this.UI.maTexts[7].innerHTML = `<tspan x="0" y="0">:</tspan>`;
              let worksHtml = "";
              let lineY = 0;
              let linesArr = [];
              author.works.forEach(w => { linesArr.push(w); });
              let worksSubset = linesArr.slice(0, 2);
              worksLineCount = worksSubset.length;
              worksSubset.forEach(w => {
                 worksHtml += `<tspan x="0" y="${lineY}">${w}</tspan>`;
                 lineY += 31.2;
              });
              this.UI.maTexts[10].innerHTML = worksHtml;
          } else {
              this.UI.maTexts[6].innerHTML = "";
              this.UI.maTexts[7].innerHTML = "";
              this.UI.maTexts[10].innerHTML = "";
          }

          // Ensure vertical continuity between Works and Fun Facts
          let funFactsStartY = 412.72; // Default if no Works section
          if (worksLineCount > 0) {
              // Works header starts at 412.72, list at 442.72
              // List ends after its lines, plus we add a single line break buffer (15px)
              funFactsStartY = 442.72 + (worksLineCount * 31.2) + 15;
          }
          if (this.UI.maTexts[8]) this.UI.maTexts[8].setAttribute('transform', `translate(635.71 ${funFactsStartY})`);
          if (this.UI.maTexts[9]) this.UI.maTexts[9].setAttribute('transform', `translate(746.21 ${funFactsStartY})`);
          
          let funFactsListY = funFactsStartY + 30; // standard 30px gap below local heading
          if (this.UI.maTexts[11]) this.UI.maTexts[11].setAttribute('transform', `translate(635.71 ${funFactsListY})`);

          // Fun Facts handling
          let funFactsHtml = "";
          let lineY = 0;
          if (author.funFacts && author.funFacts.length > 0) {
              let fLines = [];
              author.funFacts.forEach(f => {
                   fLines.push(...this.wrapText("• " + f, 45)); // wrap tighter
              });
              // Limit the fun facts text spans to EXACTLY two
              fLines.slice(0, 2).forEach((l) => {
                   let indent = l.startsWith("• ") ? 0 : 15;
                   funFactsHtml += `<tspan x="${indent}" y="${lineY}">${l}</tspan>`;
                   lineY += 31.2;
              });
          }
          this.UI.maTexts[11].innerHTML = funFactsHtml;
      }
  },

  nextQuote: function() {
      this.currentIndex++;
      if (this.currentIndex >= this.data.length) {
          // Restart from begining
          this.shuffleArray(this.data);
          this.currentIndex = 0;
      }
      this.loadQuestion();
  },

  setQuote: function(quoteStr) {
      if (!this.UI.quoteText) return;
      let cleanedQuote = quoteStr.replace(/^‘|’$/g, '');
      const lines = this.wrapText("‘" + cleanedQuote + "’", 50); 
      this.UI.quoteText.innerHTML = "";
      // Center align quote text
      this.UI.quoteText.setAttribute('text-anchor', 'middle');
      
      // Determine vertical center Y. Original was 418.45 for a single line text.
      // We keep 418.45 as starting point to cleanly mimic the storyboard visuals.
      // Horizontal center aligns flawlessly at 1224.11 which matches the background envelope.
      let currentY = 418.45;
      const match = this.UI.quoteText.getAttribute('transform')?.match(/translate\([\d.]+\s+([\d.]+)\)/);
      if (match) currentY = parseFloat(match[1]);
      this.UI.quoteText.setAttribute('transform', `translate(1224.11 ${currentY})`);

      lines.forEach((line, index) => {
          const tspan = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
          tspan.setAttribute("x", "0"); 
          tspan.setAttribute("y", index * 48); 
          tspan.textContent = line;
          this.UI.quoteText.appendChild(tspan);
      });
  },

  wrapText: function(text, maxChars) {
      let words = text.split(" ");
      let lines = [];
      let currentLine = "";
      words.forEach(word => {
          if ((currentLine + word).length > maxChars && currentLine.trim().length > 0) {
              lines.push(currentLine.trim());
              currentLine = word + " ";
          } else {
              currentLine += word + " ";
          }
      });
      if (currentLine.trim().length > 0) lines.push(currentLine.trim());
      return lines;
  },

  shuffleArray: function(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
  },

  debugQuestions: function() {
      console.log("--- DEBUG START: ALL QUESTIONS ---");
      let originalIndex = this.currentIndex;
      for (let i = 0; i < this.data.length; i++) {
          console.log(`[DEBUG] Loading Question ${i+1}/${this.data.length}: Correct Author - ${this.data[i].correct}`);
          this.currentIndex = i;
          this.loadQuestion();
      }
      this.currentIndex = originalIndex;
      this.loadQuestion();
      console.log("--- DEBUG END: ALL QUESTIONS ---");
  },

  debugMeetAuthor: function(popupNumber) {
      console.log("--- DEBUG START: MEET AUTHOR PANELS ---");
      if (this.data.length === 0) return;
      
      const self = this;

      if (typeof popupNumber === 'number' && popupNumber >= 1 && popupNumber <= this.data.length) {
          let i = popupNumber - 1;
          console.log(`[DEBUG] Displaying specific Meet Author panel ${i+1}/${self.data.length}: ${self.data[i].correct}`);
          self.currentIndex = i;
          self.showMeetAuthor();
          console.log("--- DEBUG END: MEET AUTHOR PANELS ---");
          return;
      }

      let i = 0;
      
      function showNextPanel() {
          if (i >= self.data.length) {
              console.log("--- DEBUG END: MEET AUTHOR PANELS ---");
              if (self.UI.meetAuthorPanel) self.UI.meetAuthorPanel.style.display = "none";
              return;
          }
          console.log(`[DEBUG] Displaying Meet Author panel ${i+1}/${self.data.length}: ${self.data[i].correct}`);
          self.currentIndex = i;
          self.showMeetAuthor();
          i++;
          // Wait 3 seconds to let visual validation happen sequentially
          setTimeout(showNextPanel, 3000);
      }
      
      showNextPanel();
  }
};

window.onload = function() {
    Wg146.init();
};
