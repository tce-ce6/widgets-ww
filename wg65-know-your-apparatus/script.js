document.addEventListener("DOMContentLoaded", () => {
  const objectsData = [
    { id: "test-tube", path: "assets/test-tube.svg", x: 1037, y: 161 },
    { id: "beaker", path: "assets/beaker.svg", x: 1251, y: 161 },
    { id: "conical-flask", path: "assets/conical-flask.svg", x: 1465, y: 161 },
    { id: "measuring-cylinder", path: "assets/measuring-cylinder.svg", x: 1679, y: 161 },
    { id: "pipette", path: "assets/pipette.svg", x: 1037, y: 332 },
    { id: "burette", path: "assets/buretter.svg", x: 1251, y: 332 },
    { id: "funnel", path: "assets/funnel.svg", x: 1465, y: 332 },
    { id: "evaporating-dish", path: "assets/evaporating-dish.svg", x: 1679, y: 332 },
    { id: "watch-glass", path: "assets/watch-glass.svg", x: 1037, y: 503 },
    { id: "filter-paper", path: "assets/filter-paper.svg", x: 1251, y: 503 },
    { id: "bunsen-burner", path: "assets/bunsen-burner.svg", x: 1465, y: 503 },
    { id: "tripod-stand", path: "assets/tripod-stand.svg", x: 1679, y: 503 },
    { id: "test-tube-rack", path: "assets/test-tube-rack.svg", x: 1037, y: 674 },
    { id: "stirring-rod", path: "assets/stirring-rod.svg", x: 1251, y: 674 },
    { id: "dropper", path: "assets/dropper.svg", x: 1465, y: 674 },
    { id: "petri-dish", path: "assets/petri-dish.svg", x: 1679, y: 674 },
    { id: "thermometer", path: "assets/thermometer.svg", x: 1037, y: 845 },
    { id: "tongs", path: "assets/tongs.svg", x: 1251, y: 845 },
    { id: "volumetric-flask", path: "assets/valumetric-flask.svg", x: 1465, y: 845 },
    { id: "test-tube-holder", path: "assets/test-tube-holder.svg", x: 1679, y: 845 }
  ];

  const experimentsData = [
  {
    "id": "exp_1",
    "name": "Exp:1- Testing for starch in food",
    "x": 27,
    "y": 95
  },
  {
    "id": "exp_2",
    "name": "Exp:2- Making a salt solution",
    "x": 27,
    "y": 149
  },
  {
    "id": "exp_3",
    "name": "Exp:3- Observing a chemical reaction",
    "x": 27,
    "y": 203
  },
  {
    "id": "exp_4",
    "name": "Exp:4- Heating water to boiling point",
    "x": 27,
    "y": 257
  },
  {
    "id": "exp_5",
    "name": "Exp:5- Separating sand from water",
    "x": 27,
    "y": 311
  },
  {
    "id": "exp_6",
    "name": "Exp:6- Titration experiment",
    "x": 27,
    "y": 365
  },
  {
    "id": "exp_7",
    "name": "Exp:7- Crystallization of salt",
    "x": 27,
    "y": 419
  },
  {
    "id": "exp_8",
    "name": "Exp:8- Preparing a slandered solution",
    "x": 27,
    "y": 473
  },
  {
    "id": "exp_9",
    "name": "Exp:9- Testing pH of solution",
    "x": 27,
    "y": 527
  },
  {
    "id": "exp_10",
    "name": "Exp:10- Your experiment",
    "x": 27,
    "y": 581
  }
]

  const group = document.getElementById("object-group");
  const svg = document.querySelector("svg");
  const clearButton = document.getElementById("clear-bench-btn");
  const initialClosedButton = document.getElementById("initial-dropdown"); // initial-closed-dropdown
  const selectDropdown = document.getElementById('select-dropdown')
  const experimentGroup = document.getElementById("experiment-list"); 
  const defaultTextLabel = document.getElementById("default-text");
  const toggleDropdown = false
  group.innerHTML = "";

  let selectedElement = null;
  let offset = { x: 0, y: 0 };

  // Improved coordinate helper for both Mouse and Touch
  function getCoordinates(evt) {
    const CTM = svg.getScreenCTM();
    let clientX, clientY;

    if (evt.touches && evt.touches.length > 0) {
      clientX = evt.touches[0].clientX;
      clientY = evt.touches[0].clientY;
    } else {
      clientX = evt.clientX;
      clientY = evt.clientY;
    }

    return {
      x: (clientX - CTM.e) / CTM.a,
      y: (clientY - CTM.f) / CTM.d
    };
  }


  experimentsData.forEach((exp) => {
    // Create the SVG Text element
    const textNode = document.createElementNS("http://www.w3.org/2000/svg", "text");
    textNode.setAttribute("x", exp.x);
    textNode.setAttribute("y", exp.y);
    textNode.setAttribute("id", exp.id);
    textNode.setAttribute("font-size", "25");
    textNode.setAttribute("fill", "black");
    textNode.setAttribute("font-weight", "bold");
    textNode.setAttribute("cursor", "pointer");
    textNode.textContent = exp.name;

    // Handle Selection Logic
    textNode.addEventListener("click", () => {
      // 1. Update the default label with selected text
      if (defaultTextLabel) {
        defaultTextLabel.textContent = exp.name;
        defaultTextLabel.setAttribute("opacity", "1"); // Set opacity to 100%
      }

      // 2. Hide the dropdown
      if (selectDropdown) {
        selectDropdown.style.display = 'none';
      }

      console.log(`Experiment Selected: ${exp.id}`);
    });

    // Add hover effect for better UX
    textNode.addEventListener("mouseenter", () => textNode.setAttribute("fill", "#555"));
    textNode.addEventListener("mouseleave", () => textNode.setAttribute("fill", "black"));

    if (experimentGroup) {
        experimentGroup.appendChild(textNode);
    } else {
        svg.appendChild(textNode);
    }
  });

  objectsData.forEach((item) => {
    const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    foreignObject.setAttribute("x", item.x);
    foreignObject.setAttribute("y", item.y);
    foreignObject.setAttribute("width", 208);
    foreignObject.setAttribute("height", 165);
    foreignObject.setAttribute("id", item.id);
    foreignObject.style.cursor = "grab";
    foreignObject.style.touchAction = "none"; // Critical for mobile to prevent scrolling while dragging

    const img = document.createElement("img");
    img.src = item.path;
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.pointerEvents = "none"; 
    img.setAttribute("draggable", "false");

    const startDrag = (evt) => {
      // Prevent browser from scrolling or ghosting
      if (evt.cancelable) evt.preventDefault(); 
      
      selectedElement = foreignObject;
      const pos = getCoordinates(evt);
      offset.x = pos.x - parseFloat(selectedElement.getAttribute("x"));
      offset.y = pos.y - parseFloat(selectedElement.getAttribute("y"));
      
      group.appendChild(selectedElement);
    };

    // Attach both Mouse and Touch Start
    foreignObject.addEventListener("mousedown", startDrag);
    foreignObject.addEventListener("touchstart", startDrag, { passive: false });

    foreignObject.appendChild(img);
    group.appendChild(foreignObject);
  });

  const moveDrag = (evt) => {
    if (selectedElement) {
      const pos = getCoordinates(evt);
      selectedElement.setAttribute("x", pos.x - offset.x);
      selectedElement.setAttribute("y", pos.y - offset.y);
    }
  };

  const endDrag = (evt) => {
    if (selectedElement) {
      const pos = getCoordinates(evt);
      const apparatusIds = ["apparatus-1", "apparatus-2", "apparatus-3", "apparatus-4", "apparatus-5", "apparatus-6", "apparatus-7", "apparatus-8"];
      
      let snapped = false;
      const original = objectsData.find(d => d.id === selectedElement.id);

      apparatusIds.forEach(id => {
        const zone = document.getElementById(id);
        if (zone) {
          const bbox = zone.getBBox();
          if (pos.x > bbox.x && pos.x < bbox.x + bbox.width &&
              pos.y > bbox.y && pos.y < bbox.y + bbox.height) {
            selectedElement.setAttribute("x", bbox.x);
            selectedElement.setAttribute("y", bbox.y);
            snapped = true;
          }
        }
      });

      if (!snapped && original) {
        selectedElement.setAttribute("x", original.x);
        selectedElement.setAttribute("y", original.y);
      }

      selectedElement = null;
    }
  };
  clearButton.style.cursor = "pointer";
    clearButton.addEventListener('click', () => {
    const apparatusIds = ["apparatus-1", "apparatus-2", "apparatus-3", "apparatus-4", "apparatus-5", "apparatus-6", "apparatus-7", "apparatus-8"];
    const objects = group.children;
    Array.from(objects).forEach(object => {
      const original = objectsData.find(d => d.id === object.id);
      if (original) {
        object.setAttribute("x", original.x);
        object.setAttribute("y", original.y);
      }
    });


    console.log('Clear button clicked');
  });
const openDropDown = document.getElementById('opened-dropdown')



openDropDown.addEventListener('click',()=>{
        selectDropdown.style.display = 'none';

})
  initialClosedButton.addEventListener('click',()=>{
        selectDropdown.style.display = 'block';
    
  })
//   clearButton.addEventListener('click', () => {


//     console.log('Clear button clicked');
//   });


  

  // Global Listeners for smooth tracking
  window.addEventListener("mousemove", moveDrag);
  window.addEventListener("touchmove", moveDrag, { passive: false });
  window.addEventListener("mouseup", endDrag);
  window.addEventListener("touchend", endDrag);
});