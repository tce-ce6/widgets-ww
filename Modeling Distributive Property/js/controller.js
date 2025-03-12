export class Controller {
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
