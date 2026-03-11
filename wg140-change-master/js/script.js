const startBtn = document.getElementById("startBtn");
const startPage = document.getElementById("startPage");
const gameScreen = document.getElementById("gameScreen");

document.addEventListener("DOMContentLoaded", () => {
    startBtn.addEventListener("click", () => {
        startPage.style.display = "none";
        gameScreen.style.display = "block";
    });
});
