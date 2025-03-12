// Create instances of our MVC classes
const model = new VennModel();
const view = new VennView();
let controller;

// p5.js sketch
const sketch = (p) => {
    p.setup = function() {
        // Initialize the view
        view.setup(p);
        
        // Create the controller and link the view and model
        controller = new VennController(model, view);
    };
    
    p.draw = function() {
        // The view handles the drawing
        view.draw(p, model.selectedRegions);
    };
    
    p.mouseClicked = function() {
        // Check if mouse is within canvas bounds
        if (p.mouseX >= 0 && p.mouseX <= view.width && 
            p.mouseY >= 0 && p.mouseY <= view.height) {
            controller.handleCanvasClick(p.mouseX, p.mouseY);
            return false; // Prevent default
        }
    };
    
    p.mouseMoved = function() {
        // Check if mouse is within canvas bounds
        if (p.mouseX >= 0 && p.mouseX <= view.width && 
            p.mouseY >= 0 && p.mouseY <= view.height) {
            controller.handleCanvasHover(p.mouseX, p.mouseY);
        } else if (view.hoveredRegion) {
            // Mouse left canvas, reset hover state
            view.setHoveredRegion(null);
            view.draw(p, model.selectedRegions);
            view.canvas.elt.style.cursor = 'default';
        }
    };
};

// Create the p5 instance
new p5(sketch);
