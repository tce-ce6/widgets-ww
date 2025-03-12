// Main entry point for the application
// Import model, view, and controller
import SpinnerModel from './js/model.js';
import SpinnerView from './js/view.js';
import SpinnerController from './js/controller.js';

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create instances
    const model = new SpinnerModel();
    const view = new SpinnerView();
    const controller = new SpinnerController(model, view);
});