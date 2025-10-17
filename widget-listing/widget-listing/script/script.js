// Data to use for the sidebar links and images.
// NOTE: I've included the link you provided and placeholders for others.
const WIDGET_DATA = [
  {
    name: "Interactions between organisms",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/Interactions-between-organisms/index.html",
    imagePath: "./assets/interactions-between-organisms.png",
    creators: "sh-bd-02",
  },
  {
    name: "Plant's response to the direction of light​",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/nitin/plants-response-to-the-direction-of-light%E2%80%8B/index.html",
    imagePath: "./assets/plant-response.png",
    creators: "nc-bd-01",
  },
//   {
//     name: "Triangle Inequality",
//     link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/triangle-inequality/index.html",
//     imagePath: "./assets/triangle-inequality.png",
//     creators: "",
//   },
  {
    name: "Food Chain Population Simulator",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/food_chain_population_changes/index.html",
    imagePath: "./assets/food-chain.png",
    creators: "sh-nav-03",
  },
  {
    name: "Build a Sentence",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/build-a-sentence/index.html",
    imagePath: "./assets/build-a-sentence.png",
    creators: "ag-dg-05",
  },
  {
    name: "Sentence Construction",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/sentence-construction/index.html",
    imagePath: "./assets/word-wizard.png",
    creators: "ag-he-06",
  },
  {
    name: "Journey Through Time",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/nitin/journey-through-time/index.html",
    imagePath: "./assets/journey-through-time.png",
    creators: "ni-je-08",
  },
  {
    name: "Symmetry",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/symmetry-shapes/index.html",
    imagePath: "./assets/symmetry.png",
    creators: "sh-mr-10",
  },
  {
    name: "Seed Germination Conditions",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/seed_germination_condition/index.html",
    imagePath: "./assets/seed-gemination.png",
    creators: "sh-su-11",
  },
//   {
//     name: "Pair of Linear Equations​",
//     link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/pair-of-linear-equations/index.html",
//     imagePath: "./assets/pair-of-linear-equation.png",
//     creators: "as-sr-12",
//   },
//   {
//     name: "Roots of a Quadratic Equation",
//     link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/triangle-inequality/index.html",
//     imagePath: "./assets/triangle-inequality-1.png",
//     creators: "as-sr-14",
//   },
//   {
//     name: "Triangles on Same Base, Between Same Parallels",
//     link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/triangle-on-same-base/index.html",
//     imagePath: "./assets/triangle-on-same-base.png",
//     creators: "as-ka-16",
//   },
  {
    name: "Altitude and Temperature - A Cool Connection",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/altitude-temperature-cool-connection/index.html",
    imagePath: "./assets/altitude-and-temperature.png",
    creators: "as-na-20",
  },
  {
    name: "Build the Government",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/nitin/build-the-government/index.html",
    imagePath: "./assets/build-the-government.png",
    creators: "ni-ba-25",
  },

  // Add more widget objects here
];

document.addEventListener("DOMContentLoaded", function () {
  // ... (existing code for element references and toggleSidebar function) ...
  const sidebar = document.getElementById("sidebar");
  const toggleButton = document.getElementById("toggle-btn");
  const widgetListing = document.getElementById("widget-listing");
  const totalCount = document.getElementById("total");
  const iframe = document.querySelector("iframe"); // Select the iframe element

  totalCount.textContent = WIDGET_DATA.length;
    
  function toggleSidebar() {
    sidebar.classList.toggle("active");

    // OPTIONAL: Update the button text
    if (sidebar.classList.contains("active")) {
      toggleButton.textContent = "Hide";
    } else {
      toggleButton.textContent = "Show";
    }
  }

  toggleButton.addEventListener("click", toggleSidebar);

  // --- Dynamic Widget Loading Functionality ---

  function loadWidgetList() {
    // Clear any existing list items
    widgetListing.innerHTML = "";

    WIDGET_DATA.forEach((widget) => {
      // 1. Create the new list item and set its data attribute
      const listItem = document.createElement("li");

      // Store the link on the element using a data attribute
      listItem.dataset.widgetLink = widget.link;

      // 2. Populate the content (image and text)
      listItem.innerHTML = `
                <img src="${widget.imagePath}" alt="${widget.name} Thumbnail">
                <p class="widget-name">${widget.name}</p>
                <span class="creators">${widget.creators}</span>
            `;

      // 3. Attach the click handler to update the iframe
      listItem.addEventListener("click", function () {
        const newSrc = this.dataset.widgetLink;

        // CRITICAL STEP: Update the iframe's src attribute
        iframe.src = newSrc;

        // Optional: Highlight the selected list item
        document.querySelectorAll("#widget-listing li").forEach((li) => {
          // CHANGE 1: Remove 'active' instead of 'selected'
          li.classList.remove("active");
        });
        // CHANGE 2: Add 'active' instead of 'selected'
        this.classList.add("active");

        console.log(`Iframe source updated to: ${newSrc}`);
      });

      // 4. Append the new item to the list
      widgetListing.appendChild(listItem);
    });

    // Optional: Pre-select and load the first widget on page load
    if (WIDGET_DATA.length > 0) {
      iframe.src = WIDGET_DATA[0].link;
      // Add 'active' class to the first li element after they are created
      const firstLi = document.querySelector("#widget-listing li");
      if (firstLi) {
        // CHANGE 3: Add 'active' instead of 'selected'
        firstLi.classList.add("active");
      }
    }
  }

  // Call the function to build the list when the DOM is ready
  loadWidgetList();
});
