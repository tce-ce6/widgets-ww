document.addEventListener("DOMContentLoaded", () => {

  const data = {
  "first_digit": [
    { "id": "fd-1", "x": 1127, "y": 400, "fill": "#000000", "value": 0, "band_group": "fd" },
    { "id": "fd-2", "x": 1127, "y": 441, "fill": "#CC3C00", "value": 1, "band_group": "fd" },
    { "id": "fd-3", "x": 1127, "y": 482, "fill": "#F80000", "value": 2, "band_group": "fd" },
    { "id": "fd-4", "x": 1127, "y": 523, "fill": "#FF8800", "value": 3, "band_group": "fd" },
    { "id": "fd-5", "x": 1127, "y": 564, "fill": "#FFFF00", "value": 4, "band_group": "fd" },
    { "id": "fd-6", "x": 1127, "y": 605, "fill": "#00E617", "value": 5, "band_group": "fd" },
    { "id": "fd-7", "x": 1127, "y": 646, "fill": "#0066FF", "value": 6, "band_group": "fd" },
    { "id": "fd-8", "x": 1127, "y": 687, "fill": "#9100FF", "value": 7, "band_group": "fd" },
    { "id": "fd-9", "x": 1127, "y": 728, "fill": "#D2D2D2", "value": 8, "band_group": "fd" },
    { "id": "fd-10", "x": 1127, "y": 769, "fill": "#FFFFFF", "value": 9, "band_group": "fd" }
  ],

  "second_digit": [
    { "id": "sd-1", "x": 1297, "y": 400, "fill": "#000000", "value": 0, "band_group": "sd" },
    { "id": "sd-2", "x": 1297, "y": 441, "fill": "#CC3C00", "value": 1, "band_group": "sd" },
    { "id": "sd-3", "x": 1297, "y": 482, "fill": "#F80000", "value": 2, "band_group": "sd" },
    { "id": "sd-4", "x": 1297, "y": 523, "fill": "#FF8800", "value": 3, "band_group": "sd" },
    { "id": "sd-5", "x": 1297, "y": 564, "fill": "#FFFF00", "value": 4, "band_group": "sd" },
    { "id": "sd-6", "x": 1297, "y": 605, "fill": "#00E617", "value": 5, "band_group": "sd" },
    { "id": "sd-7", "x": 1297, "y": 646, "fill": "#0066FF", "value": 6, "band_group": "sd" },
    { "id": "sd-8", "x": 1297, "y": 687, "fill": "#9100FF", "value": 7, "band_group": "sd" },
    { "id": "sd-9", "x": 1297, "y": 728, "fill": "#D2D2D2", "value": 8, "band_group": "sd" },
    { "id": "sd-10", "x": 1297, "y": 769, "fill": "#FFFFFF", "value": 9, "band_group": "sd" }
  ],

  "multiplier": [
    { "id": "mul-1", "x": 1467, "y": 400, "fill": "#000000", "value": "×1", "band_group": "mul" },
    { "id": "mul-2", "x": 1467, "y": 441, "fill": "#CC3C00", "value": "×10", "band_group": "mul" },
    { "id": "mul-3", "x": 1467, "y": 482, "fill": "#F80000", "value": "×100", "band_group": "mul" },
    { "id": "mul-4", "x": 1467, "y": 523, "fill": "#FF8800", "value": "×1k", "band_group": "mul" },
    { "id": "mul-5", "x": 1467, "y": 564, "fill": "#FFFF00", "value": "×10k", "band_group": "mul" },
    { "id": "mul-6", "x": 1467, "y": 605, "fill": "#00E617", "value": "×100k", "band_group": "mul" },
    { "id": "mul-7", "x": 1467, "y": 646, "fill": "#0066FF", "value": "×1M", "band_group": "mul" },
    { "id": "mul-8", "x": 1467, "y": 687, "fill": "#9100FF", "value": "×10M", "band_group": "mul" },
    { "id": "mul-9", "x": 1467, "y": 728, "fill": "#D2D2D2", "value": "×100M", "band_group": "mul" },
    { "id": "mul-10", "x": 1467, "y": 769, "fill": "#FFFFFF", "value": "×1G", "band_group": "mul" },
    { "id": "mul-11", "x": 1467, "y": 810, "fill": "url(#paint2_linear_5135_217)", "value": "×0.1", "band_group": "mul" },
    { "id": "mul-12", "x": 1467, "y": 851, "fill": "url(#paint3_linear_5135_217)", "value": "×0.01", "band_group": "mul" }
  ],

  "tolerance": [
    { "id": "tol-1", "x": 1638, "y": 400, "fill": "url(#paint2_linear_5135_217)", "value": "±5%", "band_group": "tol" },
    { "id": "tol-2", "x": 1638, "y": 441, "fill": "url(#paint3_linear_5135_217)", "value": "±10%", "band_group": "tol" },
    { "id": "tol-3", "x": 1638, "y": 482, "fill": "#FDE4C6", "value": "±20%", "band_group": "tol" }
  ]
}

  const container = document.getElementById("color-code-container");
  if (!container) return;

  // Define the highlight path with increased dimensions
  // NOTE: The SVG dimensions will be slightly larger to accommodate the path's coordinates.
  const HIGHLIGHT_PATH = `
    <path 
      d="M158 -2 H-2 V45.25 H158 V-2 Z" 
      stroke="#EEFF00" 
      stroke-width="12" 
      fill="none" 
      data-highlight="true"
    />
  `;

  // Define the SVG width and height needed to contain the expanded highlight path
  const HIGHLIGHT_SVG_WIDTH = 160;  // Original 156 + 2px border on each side (approx)
  const HIGHLIGHT_SVG_HEIGHT = 43; // Original 44 + 2px border on each side (approx)


  // Store references to the currently selected highlight SVGs to easily remove them
  const selectedHighlights = { "fd": null, "sd": null, "mul": null, "tol": null };


  const createSVG = ({ id, x, y, fill, value, band_group }) => {
    const wrapper = document.createElement("div");
    console.log(fill,"TO check the fill")
    wrapper.innerHTML = `
      <svg
        width="156"
        height="44"
        x="${x}"
        y="${y}"
        viewBox="0 0 156 44"
        xmlns="http://www.w3.org/2000/svg"
        id="${id}"
        data-id="${id}"
        data-value="${value}"
        data-band-group="${band_group}"
      >
        <path d="M156 0H0V43.25H156V0Z" id="filler" fill="${fill}" />
        <path d="M155 1H1V42.25H155V1Z" stroke="white" stroke-width="2" />
      </svg>
    `;
    return wrapper.firstElementChild;
  };
  
  // --- Click Handler Functionality ---

  const handleSVGClick = (event) => {
    const clickedSVG = event.currentTarget;
    const bandGroup = clickedSVG.dataset.bandGroup;
    const x = clickedSVG.getAttribute('x');
    const y = clickedSVG.getAttribute('y');
    
    // 1. Remove the previous highlight SVG element for this band group
    if (selectedHighlights[bandGroup]) {
      selectedHighlights[bandGroup].remove();
    }

    // 2. Create the highlight as a NEW, separate SVG element
    const highlightWrapper = document.createElement("div");
    highlightWrapper.innerHTML = `
      <svg
        width="${HIGHLIGHT_SVG_WIDTH}" 
        height="${HIGHLIGHT_SVG_HEIGHT}"
        x="${x - 2}"  y="${y - 2}"  viewBox="0 0 156 44"
        xmlns="http://www.w3.org/2000/svg"
        data-band-group-highlight="${bandGroup}"
      >
        ${HIGHLIGHT_PATH}
      </svg>
    `;
    const highlightSVG = highlightWrapper.firstElementChild;
    
    // 3. Append the highlight SVG to the parent container, OUTSIDE the original SVG
    container.appendChild(highlightSVG);
    
    // 4. Update the tracking object
    selectedHighlights[bandGroup] = highlightSVG;
  };
  
  // --- Rendering and Attaching Listeners ---

  Object.values(data).flat().forEach(item => {
    // Add band_group property to item for easier tracking
    item.band_group = item.id.split('-')[0];

    const svgElement = createSVG(item);
    
    // Attach the click handler to the SVG element
    svgElement.addEventListener('click', handleSVGClick);
    
    container.appendChild(svgElement);
  });

});