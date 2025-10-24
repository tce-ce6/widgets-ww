// Data to use for the sidebar links and images.
// NOTE: I've included the link you provided and placeholders for others.
const WIDGET_DATA = [
  {
    name: "Interactions between organisms",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/Interactions-between-organisms/index.html",
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
//   {
//     name: "Triangle Inequality",
//     link: "https://ce-predev-school.devstudi.com/mathwidgets/ashish/release-2/triangle-inequality/index.html",
//     imagePath: "./assets/triangle-inequality.png",
//     creators: "as-sr-",
//   },
  {
    name: "Food Chain Population Simulator",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/food_chain_population_changes/index.html",
    imagePath: "./assets/food-chain.png",
    creators: "sh-nav-03",
    status: "closed",

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
    status: "closed",

  },
  {
    name: "Journey Through Time",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/nitin/journey-through-time/index.html",
    imagePath: "./assets/journey-through-time.png",
    creators: "ni-je-08",
    status: "closed",

  },
  // {
  //   name: "Symmetry",
  //   link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/symmetry-shapes/index.html",
  //   imagePath: "./assets/symmetry.png",
  //   creators: "sh-mr-10",
  // },
  {
    name: "Seed Germination Conditions",
    link: "https://ce-predev-school.devstudi.com/mathwidgets/shyam/seed_germination_condition/index.html",
    imagePath: "./assets/seed-gemination.png",
    creators: "sh-su-11",
    status: "closed",

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
    creators: "sh-na-20",
    status: "closed",

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
    status: "closed",
  },
  {
    name: "Transparent, Translucent, and Opaque Materials",
    link: "",
    imagePath: "./assets/wip.png",
    creators: "ni-su-21",
    status: "work-in-progress",
  },
  {
    name: "Locating decimals",
    link: "",
    imagePath: "./assets/wip.png",
    creators: "sh-mr-17",
    status: "work-in-progress",
  },
  {
    name: "Reading Large numbers",
    link: "",
    imagePath: "./assets/wip.png",
    creators: "sh-mr-22",
    status: "work-in-progress",
  },
  {
    name: "Tangents from an External Point",
    link: "",
    imagePath: "./assets/wip.png",
    creators: "sh-ka-30",
    status: "work-in-progress",
  },
  {
    name: "Build a Molecule",
    link: "",
    imagePath: "./assets/not-assigned.png",
    creators: "sh-ka-13",
    status: "not-assigned",
  },
  {
    name: "Make Your Own Plant",
    link: "",
    imagePath: "./assets/not-assigned.png",
    creators: "sh-ka-29",
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
