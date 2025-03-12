export class Model {
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
