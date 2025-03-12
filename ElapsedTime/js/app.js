// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const model = new TimeModel();
    const view = new TimeView();
    const controller = new TimeController(model, view,'app.js file calling ');
}); 