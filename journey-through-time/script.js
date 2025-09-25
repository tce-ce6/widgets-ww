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
    this.resetBtn = document.getElementById("next-btn");
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
    this.updateInstructions("initial"); // Set initial text
  }

  processEvents() {
    const bceEvents = this.events.filter((event) => event.era === "BCE");
    const ceEvents = this.events.filter((event) => event.era === "CE");

    const shuffledBCEYears = this.shuffleArray(
      bceEvents.map((event) => event.year)
    );
    const shuffledCEYears = this.shuffleArray(
      ceEvents.map((event) => event.year)
    );

    this.insertYears(shuffledBCEYears, this.bceDivs);
    this.insertYears(shuffledCEYears, this.ceDivs);
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
        text = "In your notebook, calculate the difference in years between the two events. Click on ‘Show Answer’ to verify calculation.";
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
      textContent = `Formula: <span class="primary-color">[Year1]</span> + <span class="secondary-color">[Year2]</span> - 1`;
    }else if(isBCEOnly){
      textContent = `Formula: <span class="primary-color">[Year1]</span> - <span class="primary-color">[Year2]</span>`;
    } else {
      textContent = `Formula: <span class="secondary-color">[Year1]</span> - <span class="secondary-color">[Year2]</span>`;
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

  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
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

    const isAlreadySelected = this.selectedEvents.some(
      (e) => e.id === event.id
    );
    if (isAlreadySelected) {
      console.log("Event already selected. Please choose another.");
      return;
    }

    if (this.selectedEvents.length < 2) {
      this.selectedEvents.push(event);
      this.selectedPoints.push(clickedPoint);
    } else {
      this.removeCircle(this.selectedPoints[0]);
      this.selectedEvents.shift();
      this.selectedPoints.shift();
      this.selectedEvents.push(event);
      this.selectedPoints.push(clickedPoint);
    }

    this.drawCircle(clickedPoint);
    this.displayImages();

    if (this.selectedEvents.length === 2) {
      this.showAnswerBtn.disabled = false;
      this.updateInstructions("selected"); // Update text after two events are selected
    }
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
  
  // Remove the 'active' class from both image containers on reset
  this.leftImageDisplay.classList.remove('active');
  this.rightImageDisplay.classList.remove('active'); // Added this line
  
  this.selectedPoints.forEach((point) => this.removeCircle(point));
  this.selectedPoints = [];
  if (this.yearCalculationWrapper) {
    this.yearCalculationWrapper.classList.remove("show-animation");
    this.yearCalculationWrapper.style.display = "none";
  }
  this.showAnswerBtn.disabled = true;
  this.resetBtn.disabled = true;
  this.updateInstructions("initial");
}

  displayImages() {
  // Clear existing content and remove 'active' class from both containers
  this.leftImageDisplay.innerHTML = "";
  this.rightImageDisplay.innerHTML = "";
  this.leftImageDisplay.classList.remove('active');
  this.rightImageDisplay.classList.remove('active');

  // Display the first event's image
  if (this.selectedEvents[0] && this.leftImageDisplay) {
    const img1 = document.createElement("img");
    img1.src = this.selectedEvents[0].image;
    img1.alt = this.selectedEvents[0].event;
    this.leftImageDisplay.appendChild(img1);
    this.leftImageDisplay.classList.add('active');
  }

  // Display the second event's image
  if (this.selectedEvents[1] && this.rightImageDisplay) {
    const img2 = document.createElement("img");
    img2.src = this.selectedEvents[1].image;
    img2.alt = this.selectedEvents[1].event;
    this.rightImageDisplay.appendChild(img2);
    this.rightImageDisplay.classList.add('active'); // Add active class to the second image
  }
}

  calculateAndDisplayYears() {
  if (this.selectedEvents.length < 2) return;

  let event1 = this.selectedEvents[0];
  let event2 = this.selectedEvents[1];

  // Clear existing classes before adding new ones
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
  this.updateFormulaText(event1, event2 , isBCEOnly , isCEOnly);

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
    const sortedEvents = [event1, event2].sort((a, b) => {
        const aYear = a.era === "CE" ? parseInt(a.year) : -parseInt(a.year);
        const bYear = b.era === "CE" ? parseInt(b.year) : -parseInt(b.year);
        return aYear - bYear;
    });

    const earlierYear = parseInt(sortedEvents[0].year, 10);
    const recentYear = parseInt(sortedEvents[1].year, 10);

    if (isBCEOnly) {
        this.year1Span.textContent = earlierYear;
        this.year2Span.textContent = recentYear;
        // Assign colors based on BCE logic
        this.year1Span.classList.add("primary-color");
        this.year2Span.classList.add("primary-color");
        this.yearFormula1Span.classList.add("primary-color");
        this.yearFormula2Span.classList.add("primary-color");
    } else if(isCEOnly){
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
      // Logic for different eras
      const bceEvent = event1.era === "BCE" ? event1 : event2;
      const ceEvent = event1.era === "CE" ? event1 : event2;

      this.year1Span.textContent = bceEvent.year;
      this.year2Span.textContent = ceEvent.year;
      this.year1Span.classList.add("primary-color");
      this.year2Span.classList.add("secondary-color");
      
      result = Math.abs(parseInt(bceEvent.year) + parseInt(ceEvent.year) - 1);
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