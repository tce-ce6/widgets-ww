## Widget 48 – Implementation Prompt

### Generic Instructions

Develop an interactive **SVG/HTML/JavaScript** implementation based on the provided wireframe.

* Do **not modify** the existing UI layout or design inside the SVG in `index.html`, as this is the **final designer-approved layout**.
* Maintain the **exact UI as per the wireframe** and implement all required interactions strictly by **showing and hiding SVG elements**.
* Treat `index.html` as the **main boilerplate file** containing the SVG layout.

### SVG Preparation (Important)

Before implementing the functionality:

* **First analyze the SVG structure inside `index.html`.**
* Make the **necessary structural adjustments to support the widget functionality**.
* You may:

  * **Rename IDs**
  * **Rename or restructure SVG groups (`<g>` elements)**
  * **Organize elements logically for scripting**

However:

* **Do not change the visual layout, positions, sizes, or styling of any SVG elements.**
* The **UI appearance must remain exactly the same as the designer-approved layout.**

### JavaScript Structure

Create a separate JavaScript file: **`js/script.js`**

The script must:

* Follow a **modular, function-based structure**
* Store all **global variables inside a single global state object** (`WidgetState`) to track selections and current stage.
* Pre-cache all recurring DOM elements in an initialization function to improve performance (`UI.buttons`, `UI.stages`, etc.).
* Clearly define functions for stage transitions (`goToStage1()`, `goToStage2()`, etc.) that handle hiding/showing proper SVG groups.
* Use **plain (vanilla) JavaScript only**, without external libraries
* Include **clear and well-explained comments** throughout the code

### Widget-Specific Instructions

* **Target Folder**: `wg48-mendels-dihybrid-cross`

* **Adobe XD Wireframe**:
  [https://xd.adobe.com/view/3914218c-1ed0-48f6-8d26-9039805865af-6c47/](https://xd.adobe.com/view/3914218c-1ed0-48f6-8d26-9039805865af-6c47/)

* **Storyboard & References**:
  Use the files provided in the `ref_en_bio_10_wg48` directory to design the interaction flow and define the **functional logic**:

  * `en_bio_10_wg48.pptx` – Storyboard presentation
  * `Dihybrid Cross Combinations.docx` – Combination data reference

* **Functional Reference**:
  Refer to the working HTML mock provided by the content team:

  `ref_en_bio_10_wg48/en_bio_10_wg48_Ch8_Dihybrid Cross.html`

  Use this file to fully understand the **expected logic, combinations, and behavior** required for the **Mendel's Dihybrid Cross simulation**.
