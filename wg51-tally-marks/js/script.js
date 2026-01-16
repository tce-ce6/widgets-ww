const data = [
  {
    id: "1",
    title:
      "A PE teacher surveyed 20 students about their favorite sport. Here are the responses in the order they were collected:",
    types: ["Table Tennis", "Football", "Cricket", "Chess", "Badminton"],
    raw_responses: [
      "Table Tennis",
      "Football",
      "Cricket",
      "Chess",
      "Badminton",
      "Football",
      "Cricket",
      "Football",
      "Badminton",
      "Football",
      "Badminton",
      "Chess",
      "Table Tennis",
      "Cricket",
      "Football",
      "Football",
      "Chess",
      "Cricket",
      "Cricket",
      "Football",
    ],
    note: "Record your results using tally marks in a table, then write how many students chose each sport.",
  },
  {
    id: "2",
    title:
      "The librarian recorded how many books students read during October. Here are the numbers in the order students reported:",
    types: ["0-2 books", "3-5 books", "6-8 books", "9-11 books"],
    raw_responses: [
      2, 5, 7, 1, 4, 3, 8, 0, 6, 4, 5, 3, 9, 7, 2, 5, 11, 6, 4, 8, 3, 5, 1, 6,
      7, 4, 10, 5, 8, 2,
    ],
    note: "Record your results using tally marks in a table, then write how many students chose each sport. Create a tally mark table with these reading ranges: 0-2 books, 3-5 books,…",
  },
  {
    id: "3",
    title:
      "Mr. Patel recorded the marks his students obtained out of 50 in a recent math test. Here are the scores:",
    types: [
      "0-10 Score",
      "11-20 Score",
      "21-30 Score",
      "31-40 Score",
      "41-50 Score",
    ],
    raw_responses: [
      15, 42, 28, 45, 38, 41, 33, 29, 44, 37, 31, 48, 26, 39, 43, 36, 30, 6, 34,
      40, 27, 38, 32, 47, 35,
    ],
    note: "Record your results using tally marks in a table, then write how many students chose each sport. Create a tally mark table with these score ranges: 0-10, 10-20,…",
  },
];
document.addEventListener("DOMContentLoaded", () => {
  let correctLottie = null;
  let incorrectLottie = null;
  const errorBeep = document.createElement("audio");
  errorBeep.src = "assets/beep_error.mp3"; // 👈 update path
  errorBeep.preload = "auto";

  // 🔹 GLOBAL VARIABLE – initially select id "1"
  let selectedActivityId = "1";
  let selectedActivityData = null;
  const listEl = document.getElementById("list-container");
  const noteEl = document.getElementById("note-txt");

  const titleEl = document.getElementById("activity-title");
  const selectEl = document.getElementById("category-wrap");
  const categorySelect = document.getElementById("category-wrap");
  const tableBody = document.getElementById("result-body");

  const checkAnsBtn = document.getElementById("check-ans");
  const globalResetBtn = document.getElementById("global-reset");
  const showAnswerBtn = document.getElementById("show-answer");

  const successModal = document.querySelector(".success-modal");
  const failureModal = document.querySelector(".faillure-modal");
  const leftCol = document.getElementById("left-col");

  const showAnswerTable = document.getElementById("answer-table");
  const answerBody = document.getElementById("answer-body");

  const closeBtn = document.getElementById("close-btn");
  const answerTableWrapper = document.getElementById("answer-table-wrapper");

  const resetAllCountBtn = document.getElementById("reset-all-count");
  const nextActivityBtn = document.getElementById("next-activity");
  const previousActivityBtn = document.getElementById("previous-activity");

  const MAX_TALLY = 15;

  // Initialize activity
  function loadActivity(activityId) {
    selectedActivityData = data.find((item) => item.id === activityId);
    if (!selectedActivityData) return;

    // ✅ Title
    titleEl.textContent = selectedActivityData.title;

    // ✅ Note
    noteEl.textContent = selectedActivityData.note;

    // ✅ Populate select
    selectEl.innerHTML =
      "<option selected disabled>Select a new category...</option>";
    if (selectedActivityData.types) {
      selectedActivityData.types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type;
        option.textContent = type;
        selectEl.appendChild(option);
      });
    }

    // ✅ Populate raw responses
    listEl.innerHTML = "";
    if (selectedActivityData.raw_responses) {
      selectedActivityData.raw_responses.forEach((response) => {
        const li = document.createElement("li");
        li.textContent = response;
        listEl.appendChild(li);
      });
    }
  }

  // 🔹 Initial load
  loadActivity(selectedActivityId);
  updateActionButtonsState();
  updateListContainerClass();

  // 🔹 Add empty placeholder row
  function addEmptyRow() {
    if (tableBody.querySelector(".empty-row")) return;

    const tr = document.createElement("tr");
    tr.classList.add("empty-row");
    tr.innerHTML = `
      <td colspan="4" style="text-align:center; opacity:0.6;line-height: 1.8;">
        Select a category
      </td>
    `;

    const totalRow = tableBody.querySelector(".total-row");

    // ✅ Insert ABOVE total row
    if (totalRow) {
      tableBody.insertBefore(tr, totalRow);
    } else {
      tableBody.appendChild(tr);
    }
  }

  function playCorrectLottie() {
    const container = document.getElementById("correct-emoji");
    if (!container) return;

    // Clear previous instance
    container.innerHTML = "";
    if (correctLottie) correctLottie.destroy();

    correctLottie = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "lottie/emoji_correct.json", // ✅ update path if needed
    });
  }

  function playIncorrectLottie() {
    const container = document.getElementById("incorrect-emoji");
    if (!container) return;

    // container.innerHTML = "";
    if (incorrectLottie) incorrectLottie.destroy();

    incorrectLottie = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: "lottie/emoji_incorrect.json", // ✅ update path if needed
    });
  }

  function removeEmptyRow() {
    const emptyRow = tableBody.querySelector(".empty-row");
    if (emptyRow) emptyRow.remove();
  }

  // Add placeholder on load
  addEmptyRow();

  categorySelect.addEventListener("change", () => {
    const selectedCategory = categorySelect.value;

    // ❌ Prevent duplicates
    const exists = [...tableBody.querySelectorAll("tr")].some(
      (row) => row.dataset.category === selectedCategory
    );
    if (exists) return;

    // ✅ Remove placeholder
    removeEmptyRow();

    const tr = document.createElement("tr");
    tr.dataset.category = selectedCategory;

    tr.innerHTML = `
      <td>${selectedCategory}</td>
      <td class="tally-cell"></td>
      <td><input type="text" class="count-input" value="0"></td>
      <td>
        <button class="action-btn add-btn"></button>
        <button class="action-btn minus-btn"></button>
        <button class="action-btn del-btn"></button>
      </td>
    `;

    // ✅ Always insert ABOVE total row
    const totalRow = tableBody.querySelector(".total-row");
    tableBody.insertBefore(tr, totalRow);

    categorySelect.selectedIndex = 0;

    updateActionButtonsState();
  });

  // 🔹 Handle + / − / delete using event delegation
  // 🔹 Handle + / − / delete using event delegation
  tableBody.addEventListener("click", (e) => {
    const row = e.target.closest("tr[data-category]");
    if (!row) return;

    const countInput = row.querySelector(".count-input");
    const tallyCell = row.querySelector(".tally-cell");
    const category = row.dataset.category;
    let currentCount = Number(countInput.value);

    // ➕ Add
    if (e.target.classList.contains("add-btn")) {
      if (currentCount >= MAX_TALLY) return;

      const correctCount = getCorrectCountForCategory(category);

      currentCount++;
      countInput.value = currentCount;

      // 🔊 Play sound ONLY when exceeding correct count
      if (currentCount > correctCount) {
        errorBeep.currentTime = 0;
        errorBeep.play().catch(() => {});
      }

      renderTally(tallyCell, currentCount, correctCount);
      syncCompletedListItems(category, Math.min(currentCount, correctCount));
      updateTotal();
    }

    // ➖ Minus
    if (e.target.classList.contains("minus-btn")) {
      currentCount = Math.max(0, currentCount - 1);
      countInput.value = currentCount;
      renderTally(
        tallyCell,
        currentCount,
        getCorrectCountForCategory(category)
      );
      syncCompletedListItems(category, currentCount); // ✅ NEW
      updateTotal();
    }

    // ❌ Delete
    if (e.target.classList.contains("del-btn")) {
      syncCompletedListItems(category, 0); // ✅ clear completed
      row.remove();
      updateTotal();
      checkEmptyTable();
      updateActionButtonsState();
    }
  });

  function checkEmptyTable() {
    if (!tableBody.querySelector("tr[data-category]")) {
      addEmptyRow();
    }
  }

  function updateTotal() {
    let total = 0;
    tableBody.querySelectorAll(".count-input").forEach((input) => {
      total += Number(input.value) || 0;
    });
    document.getElementById("total-count").value = total;
  }

  function renderTally(cell, count, correctCount = Infinity) {
    cell.innerHTML = "";

    let rendered = 0;

    while (rendered < count) {
      const group = document.createElement("div");
      group.classList.add("tally-group");

      for (let i = 0; i < 5 && rendered < count; i++) {
        // 5th line = cross
        if (i === 4) {
          const cross = document.createElement("div");
          cross.classList.add("tally-cross");

          if (rendered >= correctCount) {
            cross.classList.add("error");
          }

          group.appendChild(cross);
        } else {
          const line = document.createElement("div");
          line.classList.add("tally-line");

          if (rendered >= correctCount) {
            line.classList.add("error");
          }

          group.appendChild(line);
        }

        rendered++;
      }

      cell.appendChild(group);
    }
  }

  function getCorrectCountForCategory(category) {
    if (!selectedActivityData) return Infinity;

    let count = 0;

    // 🔹 ACTIVITY 1 – Sports (exact match)
    if (selectedActivityId === "1") {
      selectedActivityData.raw_responses.forEach((v) => {
        if (v === category) count++;
      });
    }

    // 🔹 ACTIVITY 2 – Library (range like "0-2 books")
    if (selectedActivityId === "2") {
      const match = category.match(/(\d+)\s*-\s*(\d+)/);
      if (!match) return 0;

      const min = Number(match[1]);
      const max = Number(match[2]);

      selectedActivityData.raw_responses.forEach((num) => {
        if (num >= min && num <= max) count++;
      });
    }

    // 🔹 ACTIVITY 3 – Math Test (range like "0-10 Score")
    if (selectedActivityId === "3") {
      const match = category.match(/(\d+)\s*-\s*(\d+)/);
      if (!match) return 0;

      const min = Number(match[1]);
      const max = Number(match[2]);

      selectedActivityData.raw_responses.forEach((score) => {
        if (score >= min && score <= max) count++;
      });
    }

    return count;
  }

  function syncCompletedListItems(category, count) {
    const allItems = [...listEl.querySelectorAll("li")];

    // 🔹 ACTIVITY 1 (Sports – string match)
    if (selectedActivityId === "1") {
      const matchingItems = allItems.filter(
        (li) => li.textContent.trim() === category
      );

      matchingItems.forEach((li, index) => {
        if (index < count) {
          li.classList.add("complete");
        } else {
          li.classList.remove("complete");
        }
      });

      return;
    }

    // 🔹 ACTIVITY 2 (Library – range match like "0-2 books")
    if (selectedActivityId === "2") {
      // Extract range numbers
      // "0-2 books" → [0, 2]
      const rangeMatch = category.match(/(\d+)\s*-\s*(\d+)/);
      if (!rangeMatch) return;

      const min = Number(rangeMatch[1]);
      const max = Number(rangeMatch[2]);

      // Get list items that fall inside range
      const matchingItems = allItems.filter((li) => {
        const value = Number(li.textContent.trim());
        return value >= min && value <= max;
      });

      matchingItems.forEach((li, index) => {
        if (index < count) {
          li.classList.add("complete");
        } else {
          li.classList.remove("complete");
        }
      });

      return;
    }

    // 🔹 ACTIVITY 3 (Math test – future-ready, no highlight logic yet)
    // 🔹 ACTIVITY 3 (Math test – range match like "0-10 Score")
    if (selectedActivityId === "3") {
      // Extract range numbers
      // "0-10 Score" → [0, 10]
      const rangeMatch = category.match(/(\d+)\s*-\s*(\d+)/);
      if (!rangeMatch) return;

      const min = Number(rangeMatch[1]);
      const max = Number(rangeMatch[2]);

      // Get list items that fall inside range
      const matchingItems = allItems.filter((li) => {
        const value = Number(li.textContent.trim());
        return value >= min && value <= max;
      });

      matchingItems.forEach((li, index) => {
        if (index < count) {
          li.classList.add("complete");
        } else {
          li.classList.remove("complete");
        }
      });

      return;
    }
  }

  function updateActionButtonsState() {
    if (!selectedActivityData || !selectedActivityData.types) return;
    if (!checkAnsBtn || !globalResetBtn || !showAnswerBtn) return;

    const totalCategories = selectedActivityData.types.length;
    const addedCategories =
      tableBody.querySelectorAll("tr[data-category]").length;

    const enable = addedCategories === totalCategories;

    checkAnsBtn.disabled = !enable;
    globalResetBtn.disabled = !enable;
    showAnswerBtn.disabled = !enable;
  }

  function isAnswerCorrect() {
    if (!selectedActivityData) return false;

    const rows = tableBody.querySelectorAll("tr[data-category]");
    if (!rows.length) return false;

    const correctCounts = {};

    // 🔹 ACTIVITY 1 – Sports (exact string match)
    if (selectedActivityId === "1") {
      selectedActivityData.raw_responses.forEach((value) => {
        correctCounts[value] = (correctCounts[value] || 0) + 1;
      });
    }

    // 🔹 ACTIVITY 2 – Library (range match: "0-2 books")
    if (selectedActivityId === "2") {
      selectedActivityData.types.forEach((type) => {
        correctCounts[type] = 0;
      });

      selectedActivityData.raw_responses.forEach((num) => {
        selectedActivityData.types.forEach((type) => {
          const match = type.match(/(\d+)\s*-\s*(\d+)/);
          if (!match) return;

          const min = Number(match[1]);
          const max = Number(match[2]);

          if (num >= min && num <= max) {
            correctCounts[type]++;
          }
        });
      });
    }

    // 🔹 ACTIVITY 3 – Math Test (range match: "0-10 Score")
    if (selectedActivityId === "3") {
      selectedActivityData.types.forEach((type) => {
        correctCounts[type] = 0;
      });

      selectedActivityData.raw_responses.forEach((score) => {
        selectedActivityData.types.forEach((type) => {
          const match = type.match(/(\d+)\s*-\s*(\d+)/);
          if (!match) return;

          const min = Number(match[1]);
          const max = Number(match[2]);

          if (score >= min && score <= max) {
            correctCounts[type]++;
          }
        });
      });
    }

    // 🔹 FINAL VALIDATION (same for all activities)
    for (const row of rows) {
      const category = row.dataset.category;
      const userCount = Number(row.querySelector(".count-input")?.value) || 0;
      const correctCount = correctCounts[category] || 0;

      if (userCount !== correctCount) {
        return false;
      }
    }

    return true;
  }

checkAnsBtn.addEventListener("click", () => {
  if (!successModal || !failureModal || !leftCol) return;

  // 🔹 FULL RESET FIRST
  successModal.style.display = "none";
  failureModal.style.display = "none";

  successModal.classList.remove("active", "correct");
  failureModal.classList.remove("active", "incorrect");

  // 🔹 Clear emojis
  const correctEmoji = document.getElementById("correct-emoji");
  const incorrectEmoji = document.getElementById("incorrect-emoji");

  if (correctEmoji) correctEmoji.innerHTML = "";
  if (incorrectEmoji) incorrectEmoji.innerHTML = "";

  if (correctLottie) {
    correctLottie.destroy();
    correctLottie = null;
  }
  if (incorrectLottie) {
    incorrectLottie.destroy();
    incorrectLottie = null;
  }

  const correct = isAnswerCorrect();
  leftCol.classList.add("active");

  if (correct) {
    // Ensure modal text exists (in case it was removed)
    const successTextEl = successModal.querySelector(".modal-text");
    if (successTextEl) successTextEl.textContent = "Well done!";

    successModal.style.display = "block";   // ✅ IMPORTANT
    successModal.classList.add("active", "correct");
    playCorrectLottie();
  } else {
    // Ensure modal text exists (in case it was removed)
    const failureTextEl = failureModal.querySelector(".modal-text");
    if (failureTextEl) failureTextEl.textContent = "Incorrect!";

    failureModal.style.display = "block";   // ✅ IMPORTANT
    failureModal.classList.add("active", "incorrect");
    playIncorrectLottie();
  }
});


function resetModals() {
  if (successModal) {
    successModal.classList.remove("active", "correct");
    successModal.style.display = "none";
  }

  if (failureModal) {
    failureModal.classList.remove("active", "incorrect");
    failureModal.style.display = "none";
  }

  const correctEmoji = document.getElementById("correct-emoji");
  const incorrectEmoji = document.getElementById("incorrect-emoji");

  if (correctEmoji) correctEmoji.innerHTML = "";
  if (incorrectEmoji) incorrectEmoji.innerHTML = "";

  if (correctLottie) {
    correctLottie.destroy();
    correctLottie = null;
  }
  if (incorrectLottie) {
    incorrectLottie.destroy();
    incorrectLottie = null;
  }
}



  function populateShowAnswerTable() {
    if (!selectedActivityData || !answerBody) return;

    answerBody.innerHTML = "";

    let correctCounts = {};
    let totalCount = 0;

    // 🔹 ACTIVITY 1 – Sports (exact string match)
    if (selectedActivityId === "1") {
      selectedActivityData.raw_responses.forEach((value) => {
        correctCounts[value] = (correctCounts[value] || 0) + 1;
      });
    }

    // 🔹 ACTIVITY 2 – Library (range buckets like "0-2 books")
    if (selectedActivityId === "2") {
      selectedActivityData.types.forEach((type) => {
        correctCounts[type] = 0;
      });

      selectedActivityData.raw_responses.forEach((num) => {
        selectedActivityData.types.forEach((type) => {
          const match = type.match(/(\d+)\s*-\s*(\d+)/);
          if (!match) return;

          const min = Number(match[1]);
          const max = Number(match[2]);

          if (num >= min && num <= max) {
            correctCounts[type]++;
          }
        });
      });
    }

    // 🔹 ACTIVITY 3 – Math Test (score ranges like "0-10", "10-20")
    // 🔹 ACTIVITY 3 – Math Test (score ranges like "0-10 Score")
    if (selectedActivityId === "3") {
      selectedActivityData.types.forEach((type) => {
        correctCounts[type] = 0;
      });

      selectedActivityData.raw_responses.forEach((score) => {
        selectedActivityData.types.forEach((type) => {
          const match = type.match(/(\d+)\s*-\s*(\d+)/);
          if (!match) return;

          const min = Number(match[1]);
          const max = Number(match[2]);

          if (score >= min && score <= max) {
            correctCounts[type]++;
          }
        });
      });
    }

    // 🔹 BUILD TABLE ROWS
    selectedActivityData.types.forEach((category) => {
      const count = correctCounts[category] || 0;
      totalCount += count;

      const tr = document.createElement("tr");

      // Tally cell
      const tallyTd = document.createElement("td");
      tallyTd.classList.add("tally-cell");
      renderTally(tallyTd, count);

      // Count input
      const countInput = document.createElement("input");
      countInput.type = "text";
      countInput.className = "count-input";
      countInput.value = count;
      countInput.readOnly = true;

      tr.innerHTML = `
      <td>${category}</td>
      <td></td>
      <td></td>
    `;

      tr.children[1].replaceWith(tallyTd);
      tr.children[2].appendChild(countInput);

      answerBody.appendChild(tr);
    });

    // 🔹 TOTAL ROW (NO TALLY)
    const totalRow = document.createElement("tr");
    totalRow.classList.add("total-row");

    const totalInput = document.createElement("input");
    totalInput.type = "text";
    totalInput.className = "count-input";
    totalInput.value = totalCount;
    totalInput.readOnly = true;

    totalRow.innerHTML = `
    <td><strong>Total</strong></td>
    <td></td>
    <td></td>
  `;

    totalRow.children[2].appendChild(totalInput);
    answerBody.appendChild(totalRow);
  }

  showAnswerBtn.addEventListener("click", () => {
    if (!showAnswerTable || !leftCol) return;

    // Hide feedback modals if open
    resetModals();

    // Populate correct answers
    populateShowAnswerTable();

    // Show table
    showAnswerTable.style.display = "block";
    document.getElementById("answer-table-wrapper").style.display = "block";
    // Activate left column
    leftCol.classList.add("active");
  });

  if (closeBtn && answerTableWrapper && leftCol) {
    closeBtn.addEventListener("click", () => {
      // Hide answer table modal
      answerTableWrapper.style.display = "none";

      // Optional: also hide table itself (extra safety)
      if (showAnswerTable) {
        showAnswerTable.style.display = "none";
      }

      // Remove active state from left column
      leftCol.classList.remove("active");
    });
  }

function resetActiveSimulation() {
  // Clear table rows
  const rows = document.querySelectorAll("#result-body tr[data-category]");
  rows.forEach((row) => row.remove());

  // Reset total
  const totalInput = document.getElementById("total-count");
  if (totalInput) totalInput.value = 0;

  // Clear raw response highlights
  document
    .querySelectorAll("#list-container li.complete")
    .forEach((li) => li.classList.remove("complete"));

  // Hide modals - use resetModals() for consistency
  resetModals();
  
  const answerWrapper = document.getElementById("answer-table-wrapper");
  if (answerWrapper) answerWrapper.style.display = "none";

  // Remove active state
  const leftCol = document.getElementById("left-col");
  if (leftCol) leftCol.classList.remove("active");

  // Disable buttons again
  document.getElementById("check-ans").disabled = true;
  document.getElementById("global-reset").disabled = true;
  document.getElementById("show-answer").disabled = true;

  // Re-add empty placeholder
  const tbody = document.getElementById("result-body");
  if (tbody && !tbody.querySelector(".empty-row")) {
    const tr = document.createElement("tr");
    tr.className = "empty-row";
    tr.innerHTML = `<td colspan="4" style="text-align:center;">Select a category</td>`;
    tbody.appendChild(tr);
  }
}

  globalResetBtn.addEventListener("click", resetActiveSimulation);

  if (resetAllCountBtn) {
    resetAllCountBtn.addEventListener("click", () => {
      // Reset each category row
      tableBody.querySelectorAll("tr[data-category]").forEach((row) => {
        const countInput = row.querySelector(".count-input");
        const tallyCell = row.querySelector(".tally-cell");
        const category = row.dataset.category;

        if (countInput) countInput.value = 0;
        if (tallyCell) tallyCell.innerHTML = "";

        // Clear completed list items for this category
        syncCompletedListItems(category, 0);
      });

      // Reset total count
      const totalInput = document.getElementById("total-count");
      if (totalInput) totalInput.value = 0;
    });
  }
  function resetActivityUI() {
    // Clear result table rows
    tableBody
      .querySelectorAll("tr[data-category]")
      .forEach((row) => row.remove());

    // Reset total
    const totalInput = document.getElementById("total-count");
    if (totalInput) totalInput.value = 0;

    // Clear list highlights
    listEl
      .querySelectorAll("li.complete")
      .forEach((li) => li.classList.remove("complete"));

    // Reset table placeholder
    addEmptyRow();

    // Hide modals
    resetModals();

    // Hide show-answer table
    const answerWrapper = document.getElementById("answer-table-wrapper");
    if (answerWrapper) answerWrapper.style.display = "none";

    // Remove active state
    leftCol.classList.remove("active");

    // Disable buttons
    checkAnsBtn.disabled = true;
    globalResetBtn.disabled = true;
    showAnswerBtn.disabled = true;
  }

  if (previousActivityBtn) {
    previousActivityBtn.addEventListener("click", () => {
      const currentIndex = data.findIndex(
        (item) => item.id === selectedActivityId
      );

      if (currentIndex <= 0) return;

      selectedActivityId = data[currentIndex - 1].id;

      resetActivityUI();
      loadActivity(selectedActivityId);

      updateListContainerClass();
      updateActionButtonsState();

      // 🔹 ENABLE Next button again when going back
      if (nextActivityBtn) {
        nextActivityBtn.disabled = false;
      }

      // Disable Previous if first activity
      if (currentIndex - 1 === 0) {
        previousActivityBtn.disabled = true;
      }
    });
  }

  if (nextActivityBtn) {
    nextActivityBtn.addEventListener("click", () => {
      const currentIndex = data.findIndex(
        (item) => item.id === selectedActivityId
      );

      // Stop if last activity
      if (currentIndex === -1 || currentIndex === data.length - 1) return;

      // Move to next activity
      selectedActivityId = data[currentIndex + 1].id;

      // 🔹 ENABLE Previous button
      if (previousActivityBtn) {
        previousActivityBtn.disabled = false;
      }

      // Reset previous UI
      resetActivityUI();

      // Load new activity
      loadActivity(selectedActivityId);

      updateListContainerClass();
      updateActionButtonsState();

      // 🔹 DISABLE Next button if last activity reached
      if (currentIndex + 1 === data.length - 1) {
        nextActivityBtn.disabled = true;
      }
    });
  }

  function updateListContainerClass() {
    // Remove all possible classes first
    listEl.classList.remove("sport", "library", "math-test");

    if (selectedActivityId === "1") {
      listEl.classList.add("sport");
    } else if (selectedActivityId === "2") {
      listEl.classList.add("library");
    } else if (selectedActivityId === "3") {
      listEl.classList.add("math-test");
    }
  }
  // 🔹 Close Success / Failure modal
document.addEventListener("click", (e) => {
  const closeBtn = e.target.closest(".close-modal-btn");
  if (!closeBtn) return;

  const modal = closeBtn.closest(".message-modal");
  if (modal) {
    modal.classList.remove("active", "correct", "incorrect");
    modal.style.display = "none";
  }

  // 🔹 Remove active state from left column
  const leftCol = document.getElementById("left-col");
  if (leftCol) {
    leftCol.classList.remove("active");
  }

  // 🔹 Clear emojis & destroy lottie safely
  const correctEmoji = document.getElementById("correct-emoji");
  const incorrectEmoji = document.getElementById("incorrect-emoji");

  if (correctEmoji) correctEmoji.innerHTML = "";
  if (incorrectEmoji) incorrectEmoji.innerHTML = "";

  if (typeof correctLottie !== "undefined" && correctLottie) {
    correctLottie.destroy();
    correctLottie = null;
  }

  if (typeof incorrectLottie !== "undefined" && incorrectLottie) {
    incorrectLottie.destroy();
    incorrectLottie = null;
  }
});

});
