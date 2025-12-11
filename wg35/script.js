window.addEventListener("DOMContentLoaded", () => {
    // Check if group exists. If not, the script will likely fail later.
    const group = document.getElementById("animal-group");
    if (!group) {
        console.error("The SVG element with id='animal-group' was not found.");
        return;
    }
    console.log("SVG loaded:", group);
    
    let currentBorder = null;
    let selectedAnimalData = null; // Store the data of the currently selected animal

    // Get the target container for selected animals
    const selectedAnimalsGroup = document.getElementById("selected-animals");
    if (!selectedAnimalsGroup) {
        console.error("The SVG element with id='selected-animals' was not found.");
        return;
    }

    // 1. Define JSON
    const animals = [
        { id: "lion", src: "assets/lion.svg", x: 1350, y: 140 },
        { id: "rabbit", src: "assets/Rabbit.svg", x: 1530, y: 140 },
        { id: "butterfly", src: "assets/butterfly.svg", x: 1710, y: 140 },
        { id: "crow", src: "assets/crow.svg", x: 1350, y: 320 },
        { id: "goat", src: "assets/Goat.svg", x: 1530, y: 320 },
        { id: "frog", src: "assets/frog.svg", x: 1710, y: 320 },
        { id: "snake", src: "assets/snake.svg", x: 1350, y: 500 },
        { id: "deer", src: "assets/Deer.svg", x: 1530, y: 500 },
        { id: "plant", src: "assets/plant.svg", x: 1710, y: 500 },
        { id: "catterpiller", src: "assets/catterpiller.svg", x: 1350, y: 680 },
        { id: "grasshopper", src: "assets/grasshopper.svg", x: 1530, y: 680 },
        { id: "lizard", src: "assets/lizard.svg", x: 1710, y: 680 },
        { id: "tiger", src: "assets/tiger.svg", x: 1530, y: 860 }
    ];

    // Coordinates for the center of the buckets based on your example (x for foreignObject)
    const bucketPositions = {
        "1st-bucket": { x: 90, y: 520 },
        "2nd-bucket": { x: 485, y: 520 },
        "3rd-bucket": { x: 875, y: 520 }
    };
    
    // --- Animal Icon Generation ---
    animals.forEach(a => {
        const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        fo.setAttribute("x", a.x);
        fo.setAttribute("y", a.y);
        fo.setAttribute("width", "100%");
        fo.setAttribute("height", "100%");

        const img = document.createElement("img");
        img.src = a.src;
        img.id = a.id;
        img.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");
        
        img.style.cursor = "pointer";

        // Pass the animal data to the click handler
        img.addEventListener("click", () => selectAnimal(a)); 

        fo.appendChild(img);
        group.appendChild(fo);
    });
    
    // --- Animal Selection Function ---
    function selectAnimal(animal) {
        // 1. Store the selected animal's data
        selectedAnimalData = animal;

        // 2. Remove previous border
        if (currentBorder) {
            currentBorder.remove(); // Use .remove() for simplicity
            currentBorder = null;
        }

        // 3. Create new border
        const border = document.createElementNS("http://www.w3.org/2000/svg", "image");
        border.setAttributeNS("http://www.w3.org/1999/xlink", "href", "assets/yellow-border.svg");

        // 4. Position border slightly around icon
        border.setAttribute("x", animal.x - 20);
        border.setAttribute("y", animal.y - 20);
        border.setAttribute("width", '180px');
        border.setAttribute("height", '180px');

        // 5. Place border after animals (on top)
        group.appendChild(border);

        // 6. Save reference
        currentBorder = border;
    }

    // --- Bucket Click Handler ---
    function placeAnimalInBucket(bucketId) {
        if (!selectedAnimalData) {
            console.log("No animal selected yet.");
            return; // Exit if no animal is selected
        }
        
        const position = bucketPositions[bucketId];
        if (!position) {
            console.error("Invalid bucket ID:", bucketId);
            return;
        }

        // 1. Create the new foreignObject based on the required structure
        const fo = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        // Use the exact x and y from the example for positioning within the bucket
        fo.setAttribute("x", position.x); 
        fo.setAttribute("y", position.y);
        fo.setAttribute("width", "100%");
        fo.setAttribute("height", "100%");

        // 2. Create the new image element
        const img = document.createElement("img");
        img.src = selectedAnimalData.src; // Use the stored src
        img.id = selectedAnimalData.id; 
        
        // Use the exact width and height from the example for the bucket image
        img.setAttribute("width", "270px"); 
        img.setAttribute("height", "270px"); 
        img.setAttribute("alt", selectedAnimalData.id + " icon");
        img.setAttribute("xmlns", "http://www.w3.org/1999/xhtml");

        // 3. Append the image to the foreignObject
        fo.appendChild(img);

        // Optional: Remove any existing animal in this bucket position before placing the new one
        // This is a simple way to replace the contents. A more robust solution might check for a data attribute.
        // For simplicity, we'll clear the 'selected-animals' group and re-add all, or find a way to manage children.
        // Let's go with a simple replacement for this specific position.
        
        // Check if an element for this bucket already exists (e.g., by ID, though the bucket path has the ID, not the fo)
        // A better approach is to manage a collection of placed animals. For this request, we'll allow multiple placements 
        // until a replacement logic is requested.
        
        // 4. Append the foreignObject to the target group
        selectedAnimalsGroup.appendChild(fo);
        console.log(`Placed ${selectedAnimalData.id} into ${bucketId} at x=${position.x}, y=${position.y}`);
    }

    // --- Event Listeners for Buckets ---
    const bucketIds = ["1st-bucket", "2nd-bucket", "3rd-bucket"];
    
    bucketIds.forEach(id => {
        const bucket = document.getElementById(id);
        if (bucket) {
            bucket.style.cursor = "pointer"; // Add visual cue for clicking
            bucket.addEventListener("click", () => placeAnimalInBucket(id));
        } else {
            console.error(`Bucket element with id='${id}' not found.`);
        }
    });
});