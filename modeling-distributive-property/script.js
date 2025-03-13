
document.addEventListener('DOMContentLoaded', () => {
    const model = new Model();
    const view = new View();
    const controller = new Controller(model, view);
});

class View {
    constructor() {
        // Get equations
        this.dynamicEquation = document.getElementById('equation');
        this.leftEquation = document.getElementById('leftEquation');
        this.rightEquation = document.getElementById('rightEquation');
        
        // Get area model elements
        this.areaModel = document.querySelector('.area-model');
        this.leftArea = document.getElementById('leftArea');
        this.rightArea = document.getElementById('rightArea');
        
        // Get sliders and labels
        this.sliderA = document.getElementById('sliderA');
        this.sliderB = document.getElementById('sliderB');
        this.sliderC = document.getElementById('sliderC');
        this.sliderLabelA = document.getElementById('sliderLabelA');
        this.sliderLabelB = document.getElementById('sliderLabelB');
        this.sliderLabelC = document.getElementById('sliderLabelC');
        
        // Get dimension labels
        this.heightLabel = document.getElementById('heightLabel');
        this.widthLabelB = document.getElementById('widthLabelB');
        this.widthLabelC = document.getElementById('widthLabelC');
        
        // Get bottom indicators
        this.bottomLabelB = document.getElementById('bottomLabelB');
        this.bottomLabelC = document.getElementById('bottomLabelC');
        
        // Get show numbers button
        this.showNumbersBtn = document.getElementById('showNumbers');

        // Set constants
        this.UNIT_SIZE = 30; // pixels per unit
        this.MAX_A = 10; // Maximum value for a
        this.MAX_B = 10; // Maximum value for b
        this.MAX_C = 10; // Maximum value for c
    }

    update(model) {
        // Update dynamic equation
        const sum = model.b + model.c;
        
        if (model.showNumbers) {
            this.dynamicEquation.textContent = `${model.a}(${model.b}+${model.c})=${model.a}×${model.b}+${model.a}×${model.c}`;
            this.leftEquation.textContent = `${model.a}×${model.b}`;
            this.rightEquation.textContent = `${model.a}×${model.c}`;
            this.heightLabel.textContent = model.a;
            this.widthLabelB.textContent = model.b;
            this.widthLabelC.textContent = model.c;
            this.bottomLabelB.textContent = model.b;
            this.bottomLabelC.textContent = model.c;
            this.sliderLabelA.textContent = `a=${model.a}`;
            this.sliderLabelB.textContent = `b=${model.b}`;
            this.sliderLabelC.textContent = `c=${model.c}`;
            this.showNumbersBtn.textContent = 'SHOW LETTERS';
        } else {
            this.dynamicEquation.textContent = 'a(b+c)=a×b+a×c';
            this.leftEquation.textContent = 'a×b';
            this.rightEquation.textContent = 'a×c';
            this.heightLabel.textContent = 'a';
            this.widthLabelB.textContent = 'b';
            this.widthLabelC.textContent = 'c';
            this.bottomLabelB.textContent = 'b';
            this.bottomLabelC.textContent = 'c';
            this.sliderLabelA.textContent = 'a';
            this.sliderLabelB.textContent = 'b';
            this.sliderLabelC.textContent = 'c';
            this.showNumbersBtn.textContent = 'SHOW NUMBERS';
        }

        // Calculate height in pixels (directly proportional to a)
        const maxHeight = 200; // Max height in pixels (same as the CSS max-height)
        const heightPixels = Math.max(30, (model.a / this.MAX_A) * maxHeight); // Ensure minimum height
        
        // Calculate width proportions as percentages
        const totalWidthPercentage = ((model.b + model.c) / (this.MAX_B + this.MAX_C)) * 100;
        const leftWidthPercentage = (model.b / (model.b + model.c)) * 100;
        const rightWidthPercentage = (model.c / (model.b + model.c)) * 100;
        
        // Update area model dimensions
        this.areaModel.style.height = `${heightPixels}px`;
        this.areaModel.style.width = `${totalWidthPercentage}%`;
        
        // Update left area width as percentage of the total area model width
        this.leftArea.style.width = `${leftWidthPercentage}%`;
        
        // Update right area width and position as percentage
        this.rightArea.style.width = `${rightWidthPercentage}%`;
        this.rightArea.style.left = `${leftWidthPercentage}%`;

        // Update bottom indicators to align with the model sections
        const bottomIndicators = document.querySelector('.bottom-indicators');
        bottomIndicators.style.width = `${totalWidthPercentage}%`;
        
        const leftIndicator = document.querySelector('.left-indicator');
        const rightIndicator = document.querySelector('.right-indicator');
        
        // Set width and position to perfectly align with sections above
        leftIndicator.style.width = `${leftWidthPercentage}%`;
        rightIndicator.style.width = `${rightWidthPercentage}%`;
        rightIndicator.style.left = `${leftWidthPercentage}%`;
        
        // Update slider values
        this.sliderA.value = model.a;
        this.sliderB.value = model.b;
        this.sliderC.value = model.c;
    }

    bindSliderA(handler) {
        this.sliderA.addEventListener('input', event => handler(parseInt(event.target.value)));
    }

    bindSliderB(handler) {
        this.sliderB.addEventListener('input', event => handler(parseInt(event.target.value)));
    }

    bindSliderC(handler) {
        this.sliderC.addEventListener('input', event => handler(parseInt(event.target.value)));
    }

    bindShowNumbers(handler) {
        this.showNumbersBtn.addEventListener('click', handler);
    }
}

class Model {
    constructor() {
        this.a = 5;
        this.b = 5;
        this.c = 5;
        this.showNumbers = false;
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.update(this));
    }

    setA(value) {
        this.a = parseInt(value);
        this.notifyObservers();
    }

    setB(value) {
        this.b = parseInt(value);
        this.notifyObservers();
    }

    setC(value) {
        this.c = parseInt(value);
        this.notifyObservers();
    }

    toggleShowNumbers() {
        this.showNumbers = !this.showNumbers;
        this.notifyObservers();
    }

    getEquation() {
        if (this.showNumbers) {
            return `${this.a}(${this.b} + ${this.c}) = ${this.a * this.b} + ${this.a * this.c}`;
        }
        return 'a(b + c) = a × b + a × c';
    }
}


class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Bind event handlers
        this.view.bindSliderA(this.handleSliderA.bind(this));
        this.view.bindSliderB(this.handleSliderB.bind(this));
        this.view.bindSliderC(this.handleSliderC.bind(this));
        this.view.bindShowNumbers(this.handleShowNumbers.bind(this));

        // Initial render
        this.model.addObserver(this.view);
        this.model.notifyObservers();
    }

    handleSliderA(value) {
        this.model.setA(value);
    }

    handleSliderB(value) {
        this.model.setB(value);
    }

    handleSliderC(value) {
        this.model.setC(value);
    }

    handleShowNumbers() {
        this.model.toggleShowNumbers();
    }
}

