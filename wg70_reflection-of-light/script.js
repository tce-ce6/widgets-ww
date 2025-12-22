const upArrow = document.getElementById('upArrow');
const downArrow = document.getElementById('downArrow');
const angleValue = document.getElementById('angleValue');
const torch = document.getElementById('torch');

const dimondImg = document.getElementById('dimond-img');
const waterImg = document.getElementById('water-img');
const glassImg = document.getElementById('glass-img');


let angle = 69.6;

function updateTorch() {
    // update number
    angleValue.textContent = angle.toFixed(1) + "°";

    // rotate SVG torch
    torch.setAttribute(
        "transform",
        `rotate(${angle} 560 420)`
    );
}

upArrow.addEventListener('click', () => {
    angle += 1;
    updateTorch();
});

downArrow.addEventListener('click', () => {
    angle -= 1;
    updateTorch();
});

document.addEventListener("DOMContentLoaded", () => {

    const dimondBtn = document.getElementById('dimond-btn');
    const waterBtn = document.getElementById('water-btn');
    const glassBtn = document.getElementById('glass-btn');

    const buttons = [dimondBtn, waterBtn, glassBtn];
    let activeBtn = null;

    function handleClick(btn) {
        // enable previously active button
        if (activeBtn && activeBtn !== btn) {
            activeBtn.disabled = false;
        }
    
        // disable current button
        btn.disabled = true;
        activeBtn = btn;
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            handleClick(btn);
            console.log("Hi")
    });
    });

    updateTorch();
});
