document.addEventListener("DOMContentLoaded", function() {
    const startJourneyBtn = document.getElementById("start-journey");
    const step1 = document.getElementById("step-1");
    const step2 = document.getElementById("step-2");
    const container = document.getElementById("container");

    if (startJourneyBtn) {
        startJourneyBtn.addEventListener("click", function() {
            if (step1) step1.style.display = "none";
            if (step2) step2.style.display = "block";
            if (container) {
                container.classList.remove("step-1");
                container.classList.add("step-2");
            }
        });
    }

    const eventItems = document.querySelectorAll("[data-event]");
    const selectedOption = document.getElementById("selected-option");
    const eventWrapperEl = document.getElementById("event-wtapper");
    const lineWrapperEl = document.getElementById("line-wrapper");
    const contextEl = document.getElementById("context");
    const questionEl = document.getElementById("question");
    const eventImgEl = document.getElementById("event-img");
    const iTextEl = document.querySelector(".i-text");
    
    const feedbackModalWrap = document.getElementById("feedback-modal-wrap");
    const feedbackModal = document.getElementById("feedback-modal");
    const statusImg = document.getElementById("status-img");
    const feedbackAnimEl = document.getElementById("fedback-anim");
    const answerStatus = document.getElementById("answer-status");
    const feedbackTxt = document.getElementById("feedback");
    const continueBtn = document.getElementById("continue-btn");
    
    const btnWrapper = document.getElementById("btn-wrapper");
    const insightBtn = document.getElementById("insight-btn");
    const insightModal = document.getElementById("insight-modal");
    const closeBtn = document.getElementById("close-btn");
    
    const restartBtnWrap = document.getElementById("restart-btn-wrap");
    const restartBtn = document.getElementById("restart-btn");
    
    if (restartBtnWrap) restartBtnWrap.style.display = "none";
    
    let activeEventLi = null;
    let feedbackAnimInstance = null;

    if (continueBtn) {
        continueBtn.addEventListener("click", function() {
            if (feedbackModalWrap) feedbackModalWrap.style.display = "none";
            if (selectedOption) selectedOption.style.filter = "none";
            if (btnWrapper) btnWrapper.style.display = "block";
            if (insightBtn) insightBtn.style.opacity = "1";
            
            if (feedbackModal && feedbackModal.classList.contains("correct")) {
                if (selectedOption) selectedOption.style.display = "none";
                if (lineWrapperEl) lineWrapperEl.classList.remove("open-modal");
                if (eventWrapperEl) eventWrapperEl.classList.remove("open-modal");
                document.body.classList.remove("modal-open");
                if (iTextEl) iTextEl.textContent = "Click on the key event below to make your decision.";
                if (activeEventLi) {
                    activeEventLi.classList.add("completed");
                    if (restartBtnWrap) restartBtnWrap.style.display = "block";
                    const currentEventId = parseInt(activeEventLi.getAttribute("data-event"));
                    const nextEventLi = document.querySelector(`[data-event="${currentEventId + 1}"]`);
                    if (nextEventLi) {
                        nextEventLi.style.visibility = "visible";
                    }
                }
            }
        });
    }
    if (insightBtn) {
        insightBtn.addEventListener("click", function() {
            if (insightModal) insightModal.style.display = "block";
            document.body.classList.add("modal-open");
            const step2Elements = document.querySelectorAll("#step-2 > foreignObject, #step-2 > g");
            step2Elements.forEach(el => {
                if (el.id !== "insight-modal") {
                    el.style.filter = "brightness(.4)";
                }
            });
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", function() {
            if (insightModal) insightModal.style.display = "none";
            document.body.classList.remove("modal-open");
            const step2Elements = document.querySelectorAll("#step-2 > foreignObject, #step-2 > g");
            step2Elements.forEach(el => {
                if (el.id !== "insight-modal") {
                    el.style.filter = "";
                }
            });
        });
    }

    if (restartBtn) {
        restartBtn.addEventListener("click", function() {
            // Reset all data events
            eventItems.forEach(item => {
                item.classList.remove("completed");
                const evtId = parseInt(item.getAttribute("data-event"));
                if (evtId === 1) {
                    item.style.visibility = "visible";
                } else {
                    item.style.visibility = "hidden";
                }
                const starEl = document.getElementById(`star-${evtId}`);
                if (starEl) {
                    starEl.setAttribute("opacity", "0");
                }
            });
            
            // Hide modals and wrappers
            if (restartBtnWrap) restartBtnWrap.style.display = "none";
            if (selectedOption) selectedOption.style.display = "none";
            if (feedbackModalWrap) feedbackModalWrap.style.display = "none";
            if (lineWrapperEl) lineWrapperEl.classList.remove("open-modal");
            if (eventWrapperEl) eventWrapperEl.classList.remove("open-modal");
            document.body.classList.remove("modal-open");
            if (insightBtn) insightBtn.style.opacity = "1";
            if (btnWrapper) btnWrapper.style.display = "block";
            
            // Stay on step 2
            if (step1) step1.style.display = "none";
            if (step2) step2.style.display = "block";
            if (container) {
                container.classList.remove("step-1");
                container.classList.add("step-2");
            }
        });
    }

    // Attempt fetching data
    let eventData = [];
    fetch('./data.json')
        .then(response => response.json())
        .then(data => {
            if (data && data.events) {
                eventData = data.events;
            }
        })
        .catch(err => console.error("Error fetching data:", err));

    eventItems.forEach(item => {
        item.addEventListener("click", function() {
            activeEventLi = this;
            const eventId = parseInt(this.getAttribute("data-event"));
            const currentEvent = eventData.find(e => e.id === eventId);
            
            if (currentEvent) {
                if (selectedOption) {
                    selectedOption.style.display = "block";
                    document.body.classList.add("modal-open");
                    if (eventWrapperEl) eventWrapperEl.classList.add("open-modal");
                    if (lineWrapperEl) lineWrapperEl.classList.add("open-modal");
                    if (iTextEl) iTextEl.textContent = "Read the scenario carefully and tap the correct answer below: ALLOWED or VIOLATION?";
                }
                
                if (eventImgEl) eventImgEl.setAttribute("src", `./assets/event-${eventId}.svg`);
                
                if (contextEl) contextEl.textContent = currentEvent.context;
                if (questionEl) questionEl.textContent = currentEvent.question;
                
                // update options dynamically
                for (let i = 1; i <= 4; i++) {
                    const optEl = document.getElementById(`option-${i}`);
                    if (optEl) {
                        const optionData = currentEvent.options[i-1];
                        if (optionData) {
                            optEl.textContent = optionData.text;
                            optEl.onclick = function() {
                                if (feedbackModalWrap) feedbackModalWrap.style.display = "block";
                                if (selectedOption) selectedOption.style.filter = "brightness(0.5)";
                                if (btnWrapper) btnWrapper.style.display = "none";
                                if (insightBtn) insightBtn.style.opacity = "0.1";
                                if (optionData.correct) {
                                    if (feedbackAnimInstance) {
                                        feedbackAnimInstance.destroy();
                                        feedbackAnimInstance = null;
                                    }
                                    if (feedbackAnimEl) {
                                        feedbackAnimEl.style.display = "block";
                                        feedbackAnimInstance = lottie.loadAnimation({
                                            container: feedbackAnimEl,
                                            renderer: "svg",
                                            loop: false,
                                            autoplay: true,
                                            path: "./lottie/correct.json"
                                        });
                                    }
                                    if (statusImg) statusImg.src = "./assets/correct-icon.svg";
                                    if (answerStatus) answerStatus.textContent = "Correct!";
                                    if (feedbackModal) {
                                        feedbackModal.classList.remove("wrong");
                                        feedbackModal.classList.add("correct");
                                    }
                                    const starEl = document.getElementById(`star-${eventId}`);
                                    if (starEl) {
                                        starEl.setAttribute("opacity", "1");
                                    }
                                } else {
                                    if (feedbackAnimInstance) {
                                        feedbackAnimInstance.destroy();
                                        feedbackAnimInstance = null;
                                    }
                                    if (feedbackAnimEl) feedbackAnimEl.style.display = "none";
                                    if (statusImg) statusImg.src = "./assets/wrong-icon.svg";
                                    if (answerStatus) answerStatus.textContent = "Incorrect!";
                                    if (feedbackModal) {
                                        feedbackModal.classList.remove("correct");
                                        feedbackModal.classList.add("wrong");
                                    }
                                }
                                if (feedbackTxt) feedbackTxt.textContent = optionData.feedback;
                            };
                        } else {
                            optEl.textContent = "";
                            optEl.onclick = null;
                        }
                    }
                }
            }
        });
    });
});
