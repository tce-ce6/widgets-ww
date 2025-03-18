# Simulation Guidelines

## 📂 Folder Structure
- **Folder Name:** Use lowercase with hyphens, e.g., `simulation-project`.
- **Required Files:** Include the following files:
```
    /project-name 
        ├── styles.css # Custom project-specific styles 
        ├── global.css # Global theme and reset styles 
        ├── script.js # Custom JavaScript for the simulation 
        ├── index.html # Main HTML file with simulation and to-do list  
        └── dependency-version.min.js # Local dependency files
```

## 🎨 Canvas Specifications
- **Aspect Ratio:** Maintain a fixed aspect ratio of `9:6` (e.g., 900x600 or 1200x800).
- **Responsive Design:** The canvas should dynamically adjust its size to fit the screen while maintaining the aspect ratio.
- **No Scrolling:** Ensure that the canvas and content do not introduce scrolling.

## 📄 HTML Guidelines
- **Layout:** Create a **single-page layout** that includes a canvas and a to-do list.
- **To-Do List:** 
  - Include a to-do list within `index.html` to track the simulation progress.
  - Mark items as completed by applying a strike-through on completion.
- **Dependencies:** Use locally stored dependency files and avoid external CDN links.

## Recommended Dependacies
- **Graph:** JSX-graph
- **Canvas:** p5
- **Math Equations:** MathJax 