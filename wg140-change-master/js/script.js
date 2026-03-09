const startBtn = document.getElementById("startBtn");
const startPage = document.getElementById("startPage");
const gamePage = document.getElementById("gamePage");


document.addEventListener("DOMContentLoaded", () => {
    startBtn.addEventListener("click", () => {
        startPage.style.display = "none";
        gamePage.style.display = "block";
    });
});
