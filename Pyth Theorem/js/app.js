/**
 * Main application file for the Pythagorean Theorem Checker
 * Initializes the MVC components
 */
document.addEventListener('DOMContentLoaded', () => {
    // Create model
    const model = new PythagoreanModel();
    
    // Create view
    const view = new PythagoreanView();
    
    // Create controller
    const controller = new PythagoreanController(model, view);
});
