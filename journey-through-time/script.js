class EventLoader {
  constructor(jsonFile) {
    this.jsonFile = jsonFile;
    this.events = [];
    this.selectedEvents = [];
    this.selectedPoints = []; // Stores the selected SVG points
    this.bceDivs = document.querySelectorAll('[id^="bce-year-"]');
    this.ceDivs = document.querySelectorAll('[id^="ce-year-"]');
    this.bceTimelinePoints = document.querySelectorAll(
      '[id^="bce-timeline-point-"]'
    );
    this.ceTimelinePoints = document.querySelectorAll(
      '[id^="ce-timeline-point-"]'
    );
    this.leftImageDisplay = document.getElementById("left-show-image");
    this.rightImageDisplay = document.getElementById("right-show-image");
    this.year1Span = document.getElementById("year1");
    this.year2Span = document.getElementById("year2");
    this.yearFormula1Span = document.getElementById("formula-year1");
    this.yearFormula2Span = document.getElementById("formula-year2");

    this.operatorSpan = document.querySelector("#result-formula .operator");
    this.minusOneSpan = document.getElementById("minus-one");
    this.totalResultDiv = document.getElementById("total-result");
    this.formulaConditionSpan = document.querySelector(".formula-condition");
    this.showAnswerBtn = document.getElementById("show-example-btn");
    this.resetBtn = document.getElementById("reset-btn");
    this.yearCalculationWrapper = document.getElementById(
      "year-calculation-wrapper"
    );
    this.formulaNote = document.getElementById("note");
    this.yearFormulaDiv = document.getElementById("year-formula");

    // Add this line to get the instructions element
    this.instructionsDiv = document.getElementById("instructions");
  }

  async loadAndShuffle() {
    try {
      const response = await fetch(this.jsonFile);
      this.events = await response.json();
      this.processEvents();
      this.addTimelineListeners();
      this.addEventListeners();
      this.initializeState();
    } catch (error) {
      console.error("Error fetching or processing events:", error);
    }
  }

  initializeState() {
    if (this.yearCalculationWrapper) {
      this.yearCalculationWrapper.style.display = "none";
    }
    if (this.showAnswerBtn) {
      this.showAnswerBtn.disabled = true;
    }
    if (this.resetBtn) {
      this.resetBtn.disabled = true;
    }
    this.updateInstructions("initial");
  }

  // ... processEvents method (unchanged from last correct update)
  processEvents() {
    const bceEvents = this.events.filter((event) => event.era === "BCE");
    const ceEvents = this.events.filter((event) => event.era === "CE"); // SHUFFLE all available years (results in a NEW shuffled array)

    const shuffledAllBCEYears = this.shuffleArray(
      bceEvents.map((event) => event.year)
    );
    const shuffledAllCEYears = this.shuffleArray(
      ceEvents.map((event) => event.year)
    );

    const bceCount = this.bceDivs.length;
    const ceCount = this.ceDivs.length; // SELECT: Slice to pick a random, unique subset of years for the timeline

    const selectedBCEYears = shuffledAllBCEYears.slice(0, bceCount);
    const selectedCEYears = shuffledAllCEYears.slice(0, ceCount); // SORT: Sort the selected subset chronologically

    const orderedBCEYears = selectedBCEYears.sort(
      (a, b) => parseInt(b) - parseInt(a)
    );
    const orderedCEYears = selectedCEYears.sort(
      (a, b) => parseInt(a) - parseInt(b)
    ); // INSERT

    this.insertYears(orderedBCEYears, this.bceDivs);
    this.insertYears(orderedCEYears, this.ceDivs);
  }

  // New method to update instructions text
    updateInstructions(state) {
        if (!this.instructionsDiv) return;

        let text;
        switch (state) {
            case "initial":
                text = "Tap any two circles on the timeline.";
                break;
            case "selected":
                text =
                    "In your notebook, calculate the difference in years between the two events. Click on ‘Show Answer’ to verify calculation.";
                break;
            case "answered":
                text = "Click on ‘Reset’ to select another events.";
                break;
        }
        this.instructionsDiv.textContent = text;
    }

  updateFormulaText(event1, event2, isBCEOnly, isCEOnly) {
    if (!this.yearFormulaDiv) return;

    let textContent;
    const isDifferentEra = event1.era !== event2.era;

    if (isDifferentEra) {
      textContent = `Formula: <span>[Year A]</span> + <span>[Year B]</span> - 1`;
    } else if (isBCEOnly) {
      textContent = `Formula: <span>[Year A]</span> - <span>[Year B]</span> <div class="formula-subtxt"><span>(earlier event)</span> <span>(recent event)</span></div>`;
    } else {
      textContent = `Formula: <span>[Year A]</span> - <span>[Year B]</span> <div class="formula-subtxt"><span>(recent event)</span> <span>(earlier event)</span></div>`;
    }

    this.yearFormulaDiv.innerHTML = textContent;
  }

  insertYears(years, divs) {
    divs.forEach((div, index) => {
      if (years[index]) {
        div.textContent = years[index];
      }
    });
  }

  // Change this method:
  shuffleArray(array) {
    // Create a new copy of the array using spread syntax
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray; // Return the new, shuffled array
  }

  addTimelineListeners() {
    this.bceTimelinePoints.forEach((point) => {
      point.addEventListener("click", () =>
        this.handlePointClick(point, "bce-year-")
      );
    });
    this.ceTimelinePoints.forEach((point) => {
      point.addEventListener("click", () =>
        this.handlePointClick(point, "ce-year-")
      );
    });
  }

  addEventListeners() {
    if (this.showAnswerBtn) {
      this.showAnswerBtn.addEventListener("click", () =>
        this.handleShowAnswer()
      );
    }
    if (this.resetBtn) {
      this.resetBtn.addEventListener("click", () => this.handleReset());
    }
  }

  handlePointClick(clickedPoint, yearIdPrefix) {
    const pointIndex = clickedPoint.id.split("-").pop();
    const yearDivId = `${yearIdPrefix}${pointIndex}`;
    const yearDiv = document.getElementById(yearDivId);

    if (yearDiv) {
      const year = yearDiv.textContent;
      const era = yearIdPrefix.includes("bce") ? "BCE" : "CE";
      const eventToShow = this.events.find(
        (event) => event.year === year && event.era === era
      );

      this.addEvent(eventToShow, clickedPoint);
    }
  }

  addEvent(event, clickedPoint) {
        if (!event) return;

        // Check if the event is already selected (by its unique content)
        const isAlreadySelected = this.selectedEvents.some(
            (e) => e.id === event.id
        );
        if (isAlreadySelected) {
            console.log("Event already selected. Please choose another.");
            return;
        }

        // --- 1. Manage Selection State ---
        const previousLength = this.selectedEvents.length;

        if (previousLength < 2) {
            this.selectedEvents.push(event);
            this.selectedPoints.push(clickedPoint);
        } else {
            // If already 2, remove the oldest (the first in the array)
            this.removeCircle(this.selectedPoints[0]);
            this.selectedEvents.shift();
            this.selectedPoints.shift();
            this.selectedEvents.push(event);
            this.selectedPoints.push(clickedPoint);
        }

        this.drawCircle(clickedPoint);
        this.displayImages(); // Display the content

        // --- 2. Manage Visual Positioning (The New Logic) ---
        const currentLength = this.selectedEvents.length;
        this.leftImageDisplay.className = ''; // Reset classes
        this.rightImageDisplay.className = ''; // Reset classes

        if (currentLength === 1) {
            // STATE 1: First event selected (from any era) -> open both cards in the center
            this.leftImageDisplay.classList.add("active", "center");
            this.rightImageDisplay.classList.add("active", "center");
        } else if (currentLength === 2) {
            const ev1 = this.selectedEvents[0];
            const ev2 = this.selectedEvents[1];
            const isDifferentEra = ev1.era !== ev2.era;
            const isSameEra = !isDifferentEra;

            if (isDifferentEra) {
                // STATE 2: Second event from opposite era -> cards move to respective sides
                // Left card displays the BCE event, right card displays the CE event.
                const bceEvent = ev1.era === 'BCE' ? ev1 : ev2;
                const ceEvent = ev1.era === 'CE' ? ev1 : ev2;

                // Ensure the left image container gets the BCE event
                this.leftImageDisplay.innerHTML = this.createImageHTML(bceEvent);
                this.rightImageDisplay.innerHTML = this.createImageHTML(ceEvent);
                
                this.leftImageDisplay.classList.add("active", "left");
                this.rightImageDisplay.classList.add("active", "right");

            } else if (isSameEra) {
                // STATE 3: Second event from same era -> sort by year
                const sortedEvents = [ev1, ev2].sort((a, b) => {
                    return parseInt(b.year) - parseInt(a.year); // Sort Descending: Greater year first
                });

                const greaterYearEvent = sortedEvents[0]; // This is the earlier BCE year or the later CE year
                const smallerYearEvent = sortedEvents[1];

                // Greater year on the LEFT, Smaller year on the RIGHT.
                this.leftImageDisplay.innerHTML = this.createImageHTML(greaterYearEvent);
                this.rightImageDisplay.innerHTML = this.createImageHTML(smallerYearEvent);

                // For same era, keep them centered for now or determine final position
                this.leftImageDisplay.classList.add("active", "center");
                this.rightImageDisplay.classList.add("active", "center");
            }
        }
        
        // Final state management
        if (this.resetBtn) {
            this.resetBtn.disabled = false;
        }

        if (currentLength === 2) {
            this.showAnswerBtn.disabled = false;
            this.updateInstructions("selected");
        }
    }
    
    // Helper method to generate image HTML
    createImageHTML(event) {
        return `<img src="${event.image}" alt="${event.event}" />`;
    }

  drawCircle(point) {
    this.removeCircle(point);
    const originalPath = point.querySelector("path");
    if (!originalPath) return;

    const bbox = originalPath.getBBox();
    const cx = bbox.x + bbox.width / 2;
    const cy = bbox.y + bbox.height / 2;

    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("r", "22");
    circle.setAttribute("cx", cx);
    circle.setAttribute("cy", cy);
    circle.setAttribute("fill", "black");
    circle.classList.add("selected-circle");
    point.appendChild(circle);
  }

  removeCircle(point) {
    const existingCircle = point.querySelector(".selected-circle");
    if (existingCircle) {
      point.removeChild(existingCircle);
    }
  }

  handleShowAnswer() {
    if (this.selectedEvents.length < 2) return;

    this.calculateAndDisplayYears();
    if (this.yearCalculationWrapper) {
      this.yearCalculationWrapper.style.display = "block";
      this.yearCalculationWrapper.classList.add("show-animation");
    }
    this.showAnswerBtn.disabled = true;
    this.resetBtn.disabled = false;
    this.updateInstructions("answered"); // Update text after "Show Answer" is clicked
  }

    handleReset() {
        this.selectedEvents = [];
        this.leftImageDisplay.innerHTML = "";
        this.rightImageDisplay.innerHTML = "";

        // Remove ALL active/positioning classes on reset
        this.leftImageDisplay.className = '';
        this.rightImageDisplay.className = '';

        this.selectedPoints.forEach((point) => this.removeCircle(point));
        this.selectedPoints = [];
        if (this.yearCalculationWrapper) {
            this.yearCalculationWrapper.classList.remove("show-animation");
            this.yearCalculationWrapper.style.display = "none";
        }
        this.showAnswerBtn.disabled = true;
        this.resetBtn.disabled = true;
        this.updateInstructions("initial");

        // 🌟 NEW: Call processEvents to shuffle and insert new years 🌟
        this.processEvents(); 
    }

  displayImages() {
        // Clear existing content and remove ALL positioning classes
        this.leftImageDisplay.innerHTML = "";
        this.rightImageDisplay.innerHTML = "";
        this.leftImageDisplay.className = '';
        this.rightImageDisplay.className = '';

        // If only one event is selected, we place it in the center/left card
        if (this.selectedEvents.length === 1) {
            const event1 = this.selectedEvents[0];
            
            // Display only the first event's image in the left container
            this.leftImageDisplay.innerHTML = this.createImageHTML(event1);
            
            // Activate both cards for the center state (as per your request)
            this.leftImageDisplay.classList.add("active", "center");
            this.rightImageDisplay.classList.add("active", "center");
            
            // Keep the right image empty for the center state (it just acts as a second box)
            this.rightImageDisplay.innerHTML = " "; 

        } 
        // If two events are selected, the positioning logic is now handled entirely within addEvent()
        // We only need to display the images here if addEvent didn't already set the content.
        else if (this.selectedEvents.length === 2) {
            
            const ev1 = this.selectedEvents[0];
            const ev2 = this.selectedEvents[1];
            
            // If same era, content is set in addEvent for sorting purposes.
            if (ev1.era !== ev2.era) {
                 // Different era: We set content based on selection order, and addEvent handles class for era-specific move
                this.leftImageDisplay.innerHTML = this.createImageHTML(ev1);
                this.rightImageDisplay.innerHTML = this.createImageHTML(ev2);
            }
        }
    }

  // ... (inside EventLoader class)

  calculateAndDisplayYears() {
    if (this.selectedEvents.length < 2) return; // Use the events directly from the array; selectedEvents[0] is the FIRST selection.

    let event1 = this.selectedEvents[0];
    let event2 = this.selectedEvents[1]; // selectedEvents[1] is the SECOND selection. // Clear existing classes before adding new ones

    this.year1Span.classList.remove("primary-color", "secondary-color");
    this.year2Span.classList.remove("primary-color", "secondary-color");
    this.yearFormula1Span.classList.remove("primary-color", "secondary-color");
    this.yearFormula2Span.classList.remove("primary-color", "secondary-color");

    let year1 = parseInt(event1.year, 10);
    let year2 = parseInt(event2.year, 10);
    let result = 0;

    const isDifferentEra = event1.era !== event2.era;
    const isBCEOnly = event1.era === "BCE" && event2.era === "BCE";
    const isCEOnly = event1.era === "CE" && event2.era === "CE";
    this.updateFormulaText(event1, event2, isBCEOnly, isCEOnly);

    if (this.formulaNote) {
      if (isDifferentEra) {
        this.formulaNote.textContent =
          "Note: We subtract 1 because there is no year 0 in the BCE/CE system.";
      } else if (isBCEOnly) {
        this.formulaNote.textContent =
          "Note: BCE years count backwards, so the earlier event has the larger number.";
      } else if (isCEOnly) {
        this.formulaNote.textContent =
          "Note: Just subtract smaller (earlier) from larger (recent).";
      }
    }

    if (!isDifferentEra) {
      // Logic for Same Era (BCE-BCE or CE-CE) - This block forces the order for subtraction, which is correct for calculation.
      const sortedEvents = [event1, event2].sort((a, b) => {
        const aYear = a.era === "CE" ? parseInt(a.year) : -parseInt(a.year);
        const bYear = b.era === "CE" ? parseInt(b.year) : -parseInt(b.year);
        return aYear - bYear;
      });

      const earlierYear = parseInt(sortedEvents[0].year, 10);
      const recentYear = parseInt(sortedEvents[1].year, 10);

      if (isBCEOnly) {
        this.year1Span.textContent = earlierYear;
        this.year2Span.textContent = recentYear; // Assign colors based on BCE logic
        this.year1Span.classList.add("primary-color");
        this.year2Span.classList.add("primary-color");
        this.yearFormula1Span.classList.add("primary-color");
        this.yearFormula2Span.classList.add("primary-color");
      } else if (isCEOnly) {
        // Corrected block for CE only events
        this.year1Span.textContent = recentYear; // Set recent year as the first operand
        this.year2Span.textContent = earlierYear; // Set earlier year as the second operand
        this.year1Span.classList.add("secondary-color");
        this.year2Span.classList.add("secondary-color");
        this.yearFormula1Span.classList.add("secondary-color");
        this.yearFormula2Span.classList.add("secondary-color");
      }

      result = Math.abs(recentYear - earlierYear);
      this.operatorSpan.textContent = "-";
      if (this.minusOneSpan) {
        this.minusOneSpan.style.display = "none";
      }
      if (this.formulaConditionSpan) {
        this.formulaConditionSpan.style.display = "none";
      }
    } else {
      // Logic for DIFFERENT eras (BCE and CE)

      // 1. Display the years based on selection order
      this.year1Span.textContent = event1.year;
      this.year2Span.textContent = event2.year;

      // 2. Set colors based on the era of the selected events
      this.year1Span.classList.add(
        event1.era === "BCE" ? "primary-color" : "secondary-color"
      );
      this.year2Span.classList.add(
        event2.era === "BCE" ? "primary-color" : "secondary-color"
      );

      // 3. Keep the calculation logic correct (BCE + CE - 1)
      const bceYear =
        event1.era === "BCE" ? parseInt(event1.year) : parseInt(event2.year);
      const ceYear =
        event1.era === "CE" ? parseInt(event1.year) : parseInt(event2.year);
      result = Math.abs(bceYear + ceYear - 1);
      // 4. Set formula operators/conditions
      this.operatorSpan.textContent = "+";

      if (this.minusOneSpan) {
        this.minusOneSpan.style.display = "inline";
      }
      if (this.formulaConditionSpan) {
        this.formulaConditionSpan.style.display = "inline";
      }
    }

    if (this.totalResultDiv) {
      this.totalResultDiv.textContent = result;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const eventLoader = new EventLoader("./events.json");
  eventLoader.loadAndShuffle();
});
