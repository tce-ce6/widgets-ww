// Data to use for the sidebar links and images.
// NOTE: I've included the link you provided and placeholders for others.
const WIDGET_DATA = [
  {
    name: "Interactions between organisms",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/Interactions-between-organisms/index.html?test",
    imagePath: "./assets/interactions-between-organisms.png",
    creators: "sh-bd-02",
    status: "closed",
  },
  {
    name: "Plant's response to the direction of light​",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/nitin/plants-response-to-the-direction-of-light%E2%80%8B/index.html",
    imagePath: "./assets/plant-response.png",
    creators: "ni-bd-01",
    status: "closed",

  },
  {
    name: "Triangle Inequality",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/triangle-inequality/index.html",
    imagePath: "./assets/triangle-inequality.png",
    creators: "as-sr-09",
    status: "closed", 

  },
  {
    name: "Food Chain Population Simulator",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/food_chain_population_changes/index.html",
    imagePath: "./assets/food-chain.png",
    creators: "sh-nav-03",
    status: "WIP-With-Tech",

  },
  {
    name: "Build a Sentence",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/build-a-sentence/index.html",
    imagePath: "./assets/build-a-sentence.png",
    creators: "as-dg-05",
    status: "closed",

  },
  {
    name: "Sentence Construction",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/sentence-construction/index.html",
    imagePath: "./assets/word-wizard.png",
    creators: "as-he-06",
    status: "WIP-With-Tech",

  },
  {
    name: "Journey Through Time",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/nitin/journey-through-time/index.html",
    imagePath: "./assets/journey-through-time.png",
    creators: "ni-je-08",
    status: "closed",

  },
  {
    name: "Symmetry",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/symmetry-shapes/index.html",
    imagePath: "./assets/symmetry.png",
    creators: "sh-mr-10",
    status: "WIP-With-Tech",

  },
  {
    name: "Seed Germination Conditions",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/seed_germination_condition/index.html",
    imagePath: "./assets/seed-gemination.png",
    creators: "sh-su-11",
    status: "WIP-With-Tech",

  },
  {
    name: "Pair of Linear Equations​",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/pair-of-linear-equations/index.html",
    imagePath: "./assets/pair-of-linear-equation.png",
    creators: "as-sr-12",
    status: "WIP-With-Tech",

  },
  {
    name: "Roots of a Quadratic Equation",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/roots-of-quadratic-equations/index.html",
    imagePath: "./assets/roots-of-quadratic-equations.png",
    creators: "as-sr-14",
    status: "closed",

  },
  {
    name: "Triangles on Same Base, Between Same Parallels",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/triangle-on-same-base/index.html",
    imagePath: "./assets/triangle-on-same-base.png",
    creators: "as-ka-16",
    status: "closed",

  },
  {
    name: "Altitude and Temperature - A Cool Connection",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/altitude-temperature-cool-connection/index.html",
    imagePath: "./assets/altitude-and-temperature.png",
    creators: "sh-na-20",
    status: "WIP-With-Tech",

  },
  {
    name: "Build the Government",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/nitin/build-the-government/index.html",
    imagePath: "./assets/build-the-government.png",
    creators: "ni-ba-25",
    status: "closed",

  },
  {
    name: "सही चिह्न पहचानों",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/sahi-chinh-pehchano/index.html",
    imagePath: "./assets/find-correct-sign.png",
    creators: "as-so-27",
    status: "WIP-With-Tech",
  },
  {
    name: "Transparent, Translucent, and Opaque Materials",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/nitin/transparent-translucent-and-opaque-materials/index.html",
    imagePath: "./assets/transparent-translucent-and-opaque-materials.png",
    creators: "ni-su-21",
    status: "closed",
  },
  {
    name: "Make Your Own Plant",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/nitin/make-your-own-plant/index.html",
    imagePath: "./assets/make-your-own-plant.png",
    creators: "ni-ka-29",
    status: "closed",
  },
  {
    name: "Tangents from an External Point",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/tangents-from-an-external-point/index.html",
    imagePath: "./assets/tangents-from-an-external-point.png",
    creators: "as-ka-30",
    status: "closed",

  },
  {
    name: "Locating decimals",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/locating_decimals/index.html",
    imagePath: "./assets/locating-decimals.png",
    creators: "sh-mr-17",
    status: "WIP-With-Tech",
  },
  {
    name: "Reading Large numbers",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/large_numbers/index.html",
    imagePath: "./assets/large-numbers.png",
    creators: "sh-mr-22",
    status: "WIP-With-Tech",
  },
  
  {
    name: "Build a Molecule",
    link: "",
    imagePath: "./assets/not-assigned.png",
    creators: "sh-ka-13",
    status: "not-assigned",
  },
  

  // Add more widget objects here
];

document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.getElementById("sidebar");
  const toggleButton = document.getElementById("toggle-btn");
  const widgetListing = document.getElementById("widget-listing");
  const totalCount = document.getElementById("total");
  const iframe = document.querySelector("iframe");
  const filterDropdown = document.getElementById("filter");

  totalCount.textContent = WIDGET_DATA.length;

  function toggleSidebar() {
    sidebar.classList.toggle("active");
    toggleButton.textContent = sidebar.classList.contains("active") ? "Hide" : "Show";
  }

  toggleButton.addEventListener("click", toggleSidebar);

  // ------ Load Widget by Filter -------
function loadWidgetList(filterStatus = "closed") {
  widgetListing.innerHTML = "";

  const filteredWidgets = WIDGET_DATA
    .filter(widget => widget.status === filterStatus)
    .sort((a, b) => {
      const numA = parseInt(a.creators.split("-").pop());
      const numB = parseInt(b.creators.split("-").pop());
      return numA - numB; // Change to numB - numA for descending
    });

  filteredWidgets.forEach((widget) => {
    const listItem = document.createElement("li");
    listItem.dataset.widgetLink = widget.link;

    listItem.innerHTML = `
      <img src="${widget.imagePath}" alt="${widget.name} Thumbnail">
      <p class="widget-name">${widget.name}</p>
      <span class="creators">${widget.creators}</span>
    `;

    listItem.addEventListener("click", function () {
    sidebar.classList.toggle("active");

      iframe.src = this.dataset.widgetLink;

      document.querySelectorAll("#widget-listing li").forEach((li) => li.classList.remove("active"));
      this.classList.add("active");
    });

    widgetListing.appendChild(listItem);
  });

  if (filteredWidgets.length > 0) {
    iframe.src = filteredWidgets[0].link;
    const firstLi = document.querySelector("#widget-listing li");
    if (firstLi) firstLi.classList.add("active");
  } else {
    iframe.src = "";
  }

  totalCount.textContent = filteredWidgets.length;
}


  // Filter change event
  filterDropdown.addEventListener("change", function () {
    loadWidgetList(this.value);
  });

  // Load closed widgets by default
  loadWidgetList();
});
