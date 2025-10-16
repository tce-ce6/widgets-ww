// script.js

/**
 * LottieSVGAnimation Class
 * Manages loading and controlling a Lottie animation within an SVG <foreignObject>.
 */
class LottieSVGAnimation {
  // Set loop and autoplay defaults to false for controlled segment playback.
  constructor(containerId, jsonPath, loop = false, autoplay = false) {
    this.containerId = containerId;
    this.jsonPath = jsonPath;
    this.loop = loop;
    this.autoplay = autoplay;
    this.animation = null; 
  }

  init() {
    const container = document.getElementById(this.containerId);

    if (!container) {
      console.error(`Container with ID "${this.containerId}" not found.`);
      return;
    }

    // Create a <foreignObject> to host the Lottie animation inside the SVG group
    const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
    // Ensure width/height are either dynamic ("100%") or match your SVG/Group dimensions
    foreignObject.setAttribute("width", "400"); 
    foreignObject.setAttribute("height", "400");
    
    // Inner div for animation
    const div = document.createElement("div");
    div.setAttribute("id", `${this.containerId}-lottie`);
    div.style.width = "100%";
    div.style.height = "100%";

    foreignObject.appendChild(div);
    container.appendChild(foreignObject);

    // Load Lottie animation
    this.animation = lottie.loadAnimation({
      container: div,
      renderer: 'svg',
      loop: this.loop,
      autoplay: this.autoplay,
      path: this.jsonPath,
    });

    this.animation.addEventListener('DOMLoaded', () => {
      console.log(`Lottie animation loaded inside #${this.containerId}`);
    });
  }

  /**
   * Plays a specific segment of the Lottie animation.
   * @param {number} startFrame - The frame number to start the playback from.
   * @param {number} endFrame - The frame number to end the playback at.
   */
  playSegment(startFrame, endFrame) {
    if (this.animation) {
      // The segments parameter is an array like [startFrame, endFrame].
      // 'true' as the second argument (forceFlag) immediately starts the new segment.
      this.animation.playSegments([startFrame, endFrame], true);
    }
  }
}

// --- Implementation Logic ---

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize the Lottie animation.
  // Use the ID of the SVG <g> element where the Lottie animation will be loaded.
  const animationContainerId = 'plant-animation'; 
  const plantAnim = new LottieSVGAnimation(animationContainerId, './pot-animation.json');
  plantAnim.init();

  // 2. Define the frame segments for each button.
  // 👉 CUSTOMIZE THESE FRAME RANGES to match the segments in your pot-animation.json!
  const segments = {
    'position-1': [0, 600],    // Segment 1 Frames
    'position-2': [51, 100],  // Segment 2 Frames
    'position-3': [101, 150]  // Segment 3 Frames
  };

  // 3. Function to handle button clicks (from SVG <text> elements).
  function handleSegmentClick(event) {
    // currentTarget is used to correctly reference the element where the listener was attached (the <text> element).
    const buttonId = event.currentTarget.id; 
    const frames = segments[buttonId];

    if (frames) {
      const [startFrame, endFrame] = frames;
      console.log(`Playing segment for ${buttonId}: [${startFrame}, ${endFrame}]`);
      plantAnim.playSegment(startFrame, endFrame);
    }
  }

  // 4. Attach click event listeners to the SVG <text> elements by their IDs.
  document.getElementById('position-1')?.addEventListener('click', handleSegmentClick);
  document.getElementById('position-2')?.addEventListener('click', handleSegmentClick);
  document.getElementById('position-3')?.addEventListener('click', handleSegmentClick);
});