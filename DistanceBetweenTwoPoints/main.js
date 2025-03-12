// main.js - Entry point for the application

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the model
    const model = new PointModel();
    
    // Initialize the view
    const view = new GraphView();
    
    // Initialize the controller with model and view
    const controller = new GraphController(model, view);
});