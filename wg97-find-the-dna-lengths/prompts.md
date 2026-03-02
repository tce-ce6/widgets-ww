# WG97 – Find The DNA Lengths
## Production Development Prompt

You are tasked with building the JavaScript logic for an interactive educational widget (WG97 - Find The DNA Lengths). You must use pure vanilla JavaScript. **CRITICAL: You are NOT allowed to modify the provided `index.html` file.** The HTML contains the original SVG layout, but it lacks several IDs and elements needed for the interaction. You must map strictly to the existing SVG IDs and **dynamically inject** any missing elements (like the insights modal, inputs, or micropipette) via JavaScript.

────────────────────────────────────────────────────────────────
### WIDGET OBJECTIVE
────────────────────────────────────────────────────────────────
Students determine sample DNA fragment sizes (in base pairs, bps) by comparing the band positions of four unknown samples against a known DNA Ladder after simulating agarose gel electrophoresis.

────────────────────────────────────────────────────────────────
### SAMPLE SETS (Randomized)
────────────────────────────────────────────────────────────────
The widget must randomly cycle through 5 sample sets. Do not repeat a set until all 5 have been used.
- Set 1: [500, 1000, 1400, 1700]
- Set 2: [300,  700, 1200, 2000]
- Set 3: [600,  800, 1900, 2100]
- Set 4: [100,  900, 1300, 1800]
- Set 5: [200,  600, 1100, 1500]

Validation tolerance: ±50 bps counts as correct.

────────────────────────────────────────────────────────────────
### ORIGINAL DOM MAPPING (Must use these IDs)
────────────────────────────────────────────────────────────────
Because you cannot change the HTML, use the following existing IDs:

**Tubes & Slots:**
- DNA Ladder (Slot 0): Group `Group 1356`, BG Rect `Vector_8`, Liquid `Path 870_5`
- Sample 1 (Slot 1): Group `Group 1357`, BG Rect `Vector_4`, Liquid `Path 870`
- Sample 2 (Slot 2): Group `Group 1358`, BG Rect `Vector_5`, Liquid `Path 870_2`
- Sample 3 (Slot 3): Group `Group 1359`, BG Rect `Vector_6`, Liquid `Path 870_3`
- Sample 4 (Slot 4): Group `Group 1360`, BG Rect `Vector_7`, Liquid `Path 870_4`

**Gel Wells (Lanes 1-5):**
`Rectangle 219`, `Rectangle 219_2`, `Rectangle 219_3`, `Rectangle 219_4`, `Rectangle 219_5`

**Buttons:**
- Start Button: `Group 1110` (initially opacity 0.2)
- Reset Button: `Group 2` (initially opacity 0.2)
- Insights Button: `Button_Insite`

────────────────────────────────────────────────────────────────
### DYNAMIC ELEMENT INJECTION
────────────────────────────────────────────────────────────────
The following elements DO NOT exist in the original SVG and must be generated dynamically by your JavaScript and injected into the SVG (`appendChild`):

1. **Micropipette**: Construct an SVG group for the micropipette (with a tip and a liquid fill path) to be used for the animation.
2. **Well Fill Indicators**: Coloured rectangles to overlay the gel wells, showing they have been loaded.
3. **Electrophoresis Animation Overlay**: A semi-transparent overlay to simulate the running gel.
4. **DNA Bands**: The ladder bands (fixed positions) and sample bands (dynamically positioned based on the current sample set).
5. **Input Area (`<foreignObject>`)**: Text boxes below Lanes 2-5 for the user to manually enter the fragment sizes.
6. **Success Banner & Insights Modal**: The Insights popup card and the final "All Correct" success message.

────────────────────────────────────────────────────────────────
### INTERACTION FLOW & STATE MACHINE
────────────────────────────────────────────────────────────────
The widget must follow a strict state machine: `IDLE` → `LOADING` → `ALL_LOADED` → `RUNNING` → `INPUT` → `COMPLETE`.

1. **IDLE**: User can tap the 5 tubes in any order. Instruction text tells them to tap tubes.
2. **LOADING (Tube Clicked)**:
   - Tube gets highlighted.
   - Micropipette appears, moves to the clicked tube, and simulates sucking the liquid (liquid color matches tube's color).
   - *Rule*: DNA Ladder ALWAYS loads into Lane 1. Non-ladder samples load sequentially into Lanes 2 through 5, regardless of the order they were clicked.
   - Micropipette moves to the calculated lane, plunges, and dispenses the liquid (well fills with the corresponding tube's colour).
   - Once all 5 tubes are loaded, transition to `ALL_LOADED`.
3. **ALL_LOADED**: Set Start and Reset buttons to opacity 1, making them active.
4. **RUNNING (Start Clicked)**:
   - Electrophoresis animation plays: bands appear and travel down the gel. Delay ladder bands slightly before sample bands.
   - Y-position of bands is determined by logarithmic scale:
     `y = Math.round(908 - (Math.log(bps) - Math.log(100)) / (Math.log(2100) - Math.log(100)) * (908 - 623))`
5. **INPUT (Animation Finishes)**:
   - Input text boxes appear under Lanes 2-5. 
   - User types numerical estimations into these boxes. On submit (Enter or separate button), validate with ±50 bps tolerance against current Set's correct values.
   - Correct input: Box receives green styling. Incorrect input: Box receives red styling with 'Try again' feedback.
6. **COMPLETE**:
   - All 4 inputs are correct. Show a success banner.
   - Pressing Reset restarts the entire widget with a NEW randomized sample set, returning to `IDLE`.

────────────────────────────────────────────────────────────────
### TECHNICAL CONSTRAINTS
────────────────────────────────────────────────────────────────
- All code must be encapsulated inside `class Wg97 { ... }`.
- Single instance: `const WG97_WIDGET = new Wg97(); document.addEventListener('DOMContentLoaded', () => WG97_WIDGET.init());`
- Use CSS transitions (`transform: translate`) for micropipette animation, hooked to DOM events or `setTimeout` chains.
- Pure vanilla JS only. No external libraries besides the already included `lottie.min.js` (if used, though SVG CSS animation is preferred for pipette).
- Do NOT rewrite or overwrite the `index.html` file. Handle all UI modifications dynamically through JavaScript DOM manipulation.
