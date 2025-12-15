const data =[
   {
    "id": "1",
    "title": "A PE teacher surveyed 20 students about their favorite sport. Here are the responses in the order they were collected:",
    "types":["Table Tennis", "Football", "Cricket", "Chess", "Badminton"],
    "raw_responses": [
      "Table Tennis", "Football", "Cricket", "Chess", "Badminton", "Football", 
      "Cricket", "Football", "Badminton", "Football", "Badminton", "Chess", 
      "Table Tennis", "Cricket", "Football", "Football", "Chess", "Cricket", 
      "Cricket", "Football"
    ],
    "note":"Record your results using tally marks in a table, then write how many students chose each sport."
  },
  {
    "id": "2",
    "title": "The librarian recorded how many books students read during October. Here are the numbers in the order students reported:",
    "types":["0-2 books", "3-5 books", "6-8 books", "9-11 books",],
    "raw_responses": [
      15, 42, 28, 45, 38, 41, 33, 29, 44, 37, 31, 48, 26, 39, 43, 36, 30, 6, 34, 40, 27, 38, 32, 47, 35
    ],
    "note":"Record your results using tally marks in a table, then write how many students chose each sport. Create a tally mark table with these reading ranges: 0-2 books, 3-5 books,…"
  },
  {
    "id": "3",
    "title": "Mr. Patel recorded the marks his students obtained out of 50 in a recent math test. Here are the scores:",
    "raw_responses": [
      2, 5, 7, 1, 4, 3, 8, 0, 6, 4, 5, 3, 9, 7, 2, 5, 11, 6, 4, 8, 3, 5, 1, 6, 7, 4, 10, 5, 8, 2
    ],
    "note":"Record your results using tally marks in a table, then write how many students chose each sport. Create a tally mark table with these score ranges: 0-10, 10-20,…"
  }
]
document.addEventListener("DOMContentLoaded", () => {


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

const MAX_TALLY = 15;


// Initialize activity
function loadActivity(activityId) {
  selectedActivityData = data.find(item => item.id === activityId);
  if (!selectedActivityData) return;

  // ✅ Title
  titleEl.textContent = selectedActivityData.title;

  // ✅ Note
  noteEl.textContent = selectedActivityData.note;

  // ✅ Populate select
  selectEl.innerHTML = '<option selected disabled>Select a new category...</option>';
  if (selectedActivityData.types) {
    selectedActivityData.types.forEach(type => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      selectEl.appendChild(option);
    });
  }

  // ✅ Populate raw responses
  listEl.innerHTML = "";
  if (selectedActivityData.raw_responses) {
    selectedActivityData.raw_responses.forEach(response => {
      const li = document.createElement("li");
      li.textContent = response;
      listEl.appendChild(li);
    });
  }
}

// 🔹 Initial load
loadActivity(selectedActivityId);
updateActionButtonsState();

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

function removeEmptyRow() {
  const emptyRow = tableBody.querySelector(".empty-row");
  if (emptyRow) emptyRow.remove();
}

// Add placeholder on load
addEmptyRow();



categorySelect.addEventListener("change", () => {
  const selectedCategory = categorySelect.value;

  // ❌ Prevent duplicates
  const exists = [...tableBody.querySelectorAll("tr")]
    .some(row => row.dataset.category === selectedCategory);
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
      <button class="action-btn add-btn">+</button>
      <button class="action-btn minus-btn">−</button>
      <button class="action-btn del-btn">✕</button>
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

    currentCount++;
    countInput.value = currentCount;
    renderTally(tallyCell, currentCount);
    syncCompletedListItems(category, currentCount); // ✅ NEW
    updateTotal();
  }

  // ➖ Minus
  if (e.target.classList.contains("minus-btn")) {
    currentCount = Math.max(0, currentCount - 1);
    countInput.value = currentCount;
    renderTally(tallyCell, currentCount);
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
  tableBody.querySelectorAll(".count-input").forEach(input => {
    total += Number(input.value) || 0;
  });
  document.getElementById("total-count").value = total;
}

function renderTally(cell, count) {
  cell.innerHTML = "";

  const groupsOfFive = Math.floor(count / 5);
  const remainder = count % 5;

  // Full groups of 5
  for (let i = 0; i < groupsOfFive; i++) {
    const group = document.createElement("div");
    group.classList.add("tally-group");

    // 4 vertical lines
    for (let j = 0; j < 4; j++) {
      const line = document.createElement("div");
      line.classList.add("tally-line");
      group.appendChild(line);
    }

    // diagonal cross
    const cross = document.createElement("div");
    cross.classList.add("tally-cross");
    group.appendChild(cross);

    cell.appendChild(group);
  }

  // Remaining lines (<5)
  for (let i = 0; i < remainder; i++) {
    const line = document.createElement("div");
    line.classList.add("tally-line");
    cell.appendChild(line);
  }
}

function syncCompletedListItems(category, count) {
  const matchingItems = [...listEl.querySelectorAll("li")]
    .filter(li => li.textContent.trim() === category);

  matchingItems.forEach((li, index) => {
    if (index < count) {
      li.classList.add("complete");
    } else {
      li.classList.remove("complete");
    }
  });
}

function updateActionButtonsState() {
  if (!selectedActivityData || !selectedActivityData.types) return;
  if (!checkAnsBtn || !globalResetBtn || !showAnswerBtn) return;

  const totalCategories = selectedActivityData.types.length;
  const addedCategories = tableBody.querySelectorAll("tr[data-category]").length;

  const enable = addedCategories === totalCategories;

  checkAnsBtn.disabled = !enable;
  globalResetBtn.disabled = !enable;
  showAnswerBtn.disabled = !enable;
}

function isAnswerCorrect() {
  if (!selectedActivityData) return false;

  // Build correct counts from raw_responses
  const correctCounts = {};

  selectedActivityData.raw_responses.forEach(value => {
    correctCounts[value] = (correctCounts[value] || 0) + 1;
  });

  // Check each category row against correct count
  const rows = tableBody.querySelectorAll("tr[data-category]");

  for (const row of rows) {
    const category = row.dataset.category;
    const userCount = Number(row.querySelector(".count-input").value) || 0;
    const correctCount = correctCounts[category] || 0;

    if (userCount !== correctCount) {
      return false;
    }
  }

  return true;
}

checkAnsBtn.addEventListener("click", () => {
  if (!successModal || !failureModal || !leftCol) return;

  // Clear previous state
  resetModals();

  const correct = isAnswerCorrect();

  // Always activate left column
  leftCol.classList.add("active");

  if (correct) {
    successModal.style.display = "block";
    successModal.classList.add("active", "correct");
  } else {
    failureModal.style.display = "block";
    failureModal.classList.add("active", "incorrect");
  }
});


function resetModals() {
  if (successModal) {
    successModal.style.display = "none";
    successModal.classList.remove("correct", "active");
  }

  if (failureModal) {
    failureModal.style.display = "none";
    failureModal.classList.remove("incorrect", "active");
  }
}

function populateShowAnswerTable() {
  if (!selectedActivityData || !answerBody) return;

  answerBody.innerHTML = "";

  // Build correct counts
  const correctCounts = {};
  selectedActivityData.raw_responses.forEach(value => {
    correctCounts[value] = (correctCounts[value] || 0) + 1;
  });

  // Use category order from `types`
  selectedActivityData.types.forEach(category => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${category}</td>
      <td>${correctCounts[category] || 0}</td>
    `;
    answerBody.appendChild(tr);
  });
}

showAnswerBtn.addEventListener("click", () => {
  if (!showAnswerTable || !leftCol) return;

  // Hide feedback modals if open
  resetModals();

  // Populate correct answers
  populateShowAnswerTable();

  // Show table
  showAnswerTable.style.display = "block";

  // Activate left column
  leftCol.classList.add("active");
});



});