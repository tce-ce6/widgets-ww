document.addEventListener("DOMContentLoaded", () => {

    let wwData = {};
    let currentCards = [];

    const step1 = document.getElementById("step-1");
    const step2 = document.getElementById("step-2");

    const europeBtn = document.getElementById("europe");
    const asiaBtn = document.getElementById("asia-pacific");

    const selectedBtn = document.getElementById("selected-btn");

    const cards = document.querySelectorAll("#card-wrapper li");
    const viewBtns = document.querySelectorAll("#card-wrapper li .view-btn");

    const infoModal = document.getElementById("info-modal");
    const popupIcon = document.getElementById("popup-icon");
    const popupTitle = document.getElementById("title-popup");
    const popupInsight = document.getElementById("insight-popup");

    const closeBtn = document.querySelector("#info-modal .close-btn");
    const body = document.body;
    const placeholders = document.querySelectorAll("#card-placeholder li");
    let draggedCard = null;
    const resetBtn = document.getElementById("reset-btn");
    const triggerBtn = document.getElementById("trigger-chain-btn");
    const cardPlaceholder = document.getElementById("card-placeholder");
    const errorModal = document.querySelector(".popup-wrapper.wrong").parentElement;
    const successModal = document.getElementById("success-modal");
    const correctLottie = document.getElementById("correct-lottie");
    const showAnswerBtn = document.getElementById("show-answer-btn");
    /* -------------------------
       Load JSON Data
    ------------------------- */

    fetch("./data.json")
        .then(res => res.json())
        .then(data => {
            wwData = data;
        })
        .catch(err => console.error("JSON load error:", err));


    /* -------------------------
       Title → Image Path
    ------------------------- */

    function getImagePath(title) {
        return "./assets/" +
            title
                .toLowerCase()
                .replace(/[^a-z0-9 ]/g, "")
                .replace(/\s+/g, "-") +
            ".svg";
    }


    /* -------------------------
       Title → Icon Path
    ------------------------- */

    function getIconPath(title) {
        return "./assets/" +
            title
                .toLowerCase()
                .replace(/[^a-z0-9 ]/g, "")
                .replace(/\s+/g, "-") +
            "-icon.svg";
    }


    /* -------------------------
       Load Cards
    ------------------------- */

    function loadCards(region) {

        currentCards = wwData[region];

        if (!currentCards) return;

        currentCards.forEach((card, index) => {

            const img = cards[index].querySelector("img");

            if (img) {

                img.src = getImagePath(card.title);
                img.alt = card.title;

            }

            // remember original position
            cards[index].dataset.index = index;
            cards[index].dataset.id = card.id; // important
        });

        enableDrag();

    }


    function enableDrag() {

        cards.forEach((card) => {

            card.setAttribute("draggable", true);

            card.addEventListener("dragstart", () => {

                draggedCard = card;

                setTimeout(() => {
                    card.style.opacity = "0.5";
                }, 0);

            });

            card.addEventListener("dragend", () => {

                card.style.opacity = "1";
                draggedCard = null;

            });

        });

    }


    function enableDrop() {

        placeholders.forEach((slot) => {

            slot.addEventListener("dragover", (e) => {
                e.preventDefault();
                slot.classList.add("drag-over");
            });

            slot.addEventListener("dragleave", () => {
                slot.classList.remove("drag-over");
            });

            slot.addEventListener("drop", (e) => {

                e.preventDefault();
                slot.classList.remove("drag-over");

                if (!draggedCard) return;

                if (slot.children.length > 0) return;

                const parent = draggedCard.parentNode;

                // create empty placeholder li
                const emptyLi = document.createElement("li");

                // insert empty li where card was
                parent.insertBefore(emptyLi, draggedCard);

                slot.appendChild(draggedCard);

                // enable reset button
                resetBtn.classList.remove("disabled");

                showAnswerBtn.classList.add("disabled");
                // check if all cards placed
                checkAllPlaced();

            });

        });

    }
    /* -------------------------
       Select Region
    ------------------------- */

    function selectRegion(regionName, jsonKey) {

        step1.style.display = "none";
        step2.style.display = "block";

        selectedBtn.textContent = regionName;

        loadCards(jsonKey);

    }


    /* -------------------------
       View Button Click
    ------------------------- */

    viewBtns.forEach((btn, index) => {

        btn.addEventListener("click", () => {

            const card = currentCards[index];

            if (!card) return;

            popupTitle.textContent = card.title;
            popupInsight.textContent = card.insight;

            popupIcon.src = getIconPath(card.title);

            infoModal.style.display = "block";

            body.classList.add("modal-open"); // ADD CLASS

        });

    });


    /* -------------------------
       Close Popup
    ------------------------- */

    if (closeBtn) {

        closeBtn.addEventListener("click", () => {

            infoModal.style.display = "none";

            body.classList.remove("modal-open"); // REMOVE CLASS

        });

    }


    /* -------------------------
       Region Click Events
    ------------------------- */

    europeBtn.addEventListener("click", () => {

        selectRegion("Europe", "europe");

    });

    asiaBtn.addEventListener("click", () => {

        selectRegion("Asia-Pacific", "asia_pacific");

    });


    /* -------------------------
       Home Button
    ------------------------- */

    const homeBtn = document.getElementById("home-btn");

    if (homeBtn) {

        homeBtn.addEventListener("click", () => {

            step2.style.display = "none";
            step1.style.display = "block";

            infoModal.style.display = "none";
            body.classList.remove("modal-open");

        });

    }
    enableDrop();

    if (resetBtn) {

        resetBtn.addEventListener("click", () => {

            if (resetBtn.classList.contains("disabled")) return;

            const cardWrapper = document.getElementById("card-wrapper");

            // 🔹 remove domino rotation
            const fallenCards = document.querySelectorAll("#card-placeholder li > li");
            fallenCards.forEach(card => {
                card.classList.remove("domino-fall");
            });

            placeholders.forEach((slot) => {

                const card = slot.querySelector("li");

                if (card) {

                    const originalIndex = card.dataset.index;
                    const targetSlot = cardWrapper.querySelectorAll("li")[originalIndex];

                    if (targetSlot) {
                        targetSlot.replaceWith(card);
                    }

                }

            });

            // remove empty li created during drag
            const emptyLis = cardWrapper.querySelectorAll("li:empty");
            emptyLis.forEach(li => li.remove());

            resetBtn.classList.add("disabled");
            triggerBtn.classList.add("disabled");   // disable trigger chain
            showAnswerBtn.classList.remove("disabled");
            cardPlaceholder.classList.remove("active");

        });

    }

    function checkAllPlaced() {

        const placedCards = document.querySelectorAll("#card-placeholder li > li").length;

        if (placedCards === placeholders.length) {
            triggerBtn.classList.remove("disabled");
        } else {
            triggerBtn.classList.add("disabled");
        }

    }

    if (triggerBtn) {

        triggerBtn.addEventListener("click", () => {

            if (triggerBtn.classList.contains("disabled")) return;

            cardPlaceholder.classList.add("active");

            const droppedCards = document.querySelectorAll("#card-placeholder li > li");

            let correctCount = 0;
            let expectedNumber = 1;

            for (let i = 0; i < droppedCards.length; i++) {

                const card = droppedCards[i];
                const cardNumber = parseInt(card.dataset.id.replace(/[A-Z]+/, ""));

                if (cardNumber === expectedNumber) {
                    correctCount++;
                    expectedNumber++;
                } else {
                    break;
                }

            }

            if (correctCount !== placeholders.length) {

                // animate correct prefix if exists
                for (let i = 0; i < correctCount; i++) {

                    const card = droppedCards[i];

                    setTimeout(() => {
                        card.classList.add("domino-fall");
                    }, i * 200);

                }

                // show error modal after animation
                setTimeout(() => {

                    errorModal.style.display = "block";
                    body.classList.add("modal-open");

                }, correctCount * 200 + 200);

                return;

            }
            for (let i = 0; i < correctCount; i++) {

                const card = droppedCards[i];

                setTimeout(() => {
                    card.classList.add("domino-fall");
                }, i * 200);

            }

            // ✅ if ALL cards correct show success
            if (correctCount === placeholders.length) {

                setTimeout(() => {

                    successModal.style.display = "block";
                    body.classList.add("modal-open");

                    playSuccessAnimation();

                }, correctCount * 200 + 300);

            }

        });

    }

    const errorCloseBtn = document.querySelector(".popup-wrapper.wrong .close-btn");

    if (errorCloseBtn) {

        errorCloseBtn.addEventListener("click", () => {

            errorModal.style.display = "none";
            body.classList.remove("modal-open");

        });

    }

    function playSuccessAnimation() {

        correctLottie.innerHTML = "";

        lottie.loadAnimation({
            container: correctLottie,
            renderer: "svg",
            loop: false,
            autoplay: true,
            path: "lottie/correct-anim.json"
        });

    }

    const successCloseBtn = document.querySelector("#success-modal .close-btn");

    if (successCloseBtn) {

        successCloseBtn.addEventListener("click", () => {

            successModal.style.display = "none";
            body.classList.remove("modal-open");

        });

    }
    let answerVisible = false;

    if (showAnswerBtn) {

        showAnswerBtn.addEventListener("click", () => {

            const cardWrapper = document.getElementById("card-wrapper");

            if (!answerVisible) {

                // change icon
                showAnswerBtn.src = "./assets/hide-answer.svg";

                // remove rotation if any
                const fallenCards = document.querySelectorAll("#card-placeholder li > li");
                fallenCards.forEach(card => card.classList.remove("domino-fall"));

                // clear placeholders but keep <li>
                placeholders.forEach(slot => {
                    slot.innerHTML = "";
                });

                // sort cards by numeric order (EU1..EU8 / AP1..AP8)
                const sortedCards = [...currentCards].sort((a, b) => {
                    const numA = parseInt(a.id.replace(/[A-Z]+/, ""));
                    const numB = parseInt(b.id.replace(/[A-Z]+/, ""));
                    return numA - numB;
                });

                // collect all cards first (prevents missing elements)
                const allCards = Array.from(document.querySelectorAll("#card-wrapper li, #card-placeholder li > li"));

                sortedCards.forEach((cardData, index) => {

                    const correctCard = allCards.find(card => card.dataset.id === cardData.id);

                    if (!correctCard) return;

                    const parent = correctCard.parentNode;

                    // keep empty li in card-wrapper if card comes from there
                    if (parent && parent.id === "card-wrapper") {

                        const emptyLi = document.createElement("li");
                        parent.insertBefore(emptyLi, correctCard);

                    }

                    placeholders[index].appendChild(correctCard);

                });

                // activate placeholder style
                cardPlaceholder.classList.add("active");

                // enable reset if needed
                resetBtn.classList.remove("disabled");

                answerVisible = true;

            } else {

                // restore icon
                showAnswerBtn.src = "./assets/show-answer.svg";

                // move cards back to wrapper
                placeholders.forEach(slot => {

                    const card = slot.querySelector("li");

                    if (card) {

                        const originalIndex = card.dataset.index;
                        const targetSlot = cardWrapper.querySelectorAll("li")[originalIndex];

                        if (targetSlot) {
                            targetSlot.replaceWith(card);
                        }

                    }

                });

                // remove empty li created during drag
                const emptyLis = cardWrapper.querySelectorAll("li:empty");
                emptyLis.forEach(li => li.remove());

                // remove domino rotation
                const fallenCards = document.querySelectorAll("#card-placeholder li > li");
                fallenCards.forEach(card => card.classList.remove("domino-fall"));

                // reset buttons
                resetBtn.classList.add("disabled");
                triggerBtn.classList.add("disabled");   // disable trigger chain
                showAnswerBtn.classList.remove("disabled");
                cardPlaceholder.classList.remove("active");

                cardPlaceholder.classList.remove("active");

                answerVisible = false;

            }

        });

    }
});