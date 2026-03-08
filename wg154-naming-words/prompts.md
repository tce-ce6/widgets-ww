## Widget 154 – Implementation Prompt

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

* **Target Folder**: `wg154-naming-words`

* **Adobe XD Wireframe**:
  https://xd.adobe.com/view/1c2f4182-0a7c-419a-afb5-209f2c62babb-497c/

* **Storyboard & References**:
  Use the files provided in the `ref_en_en_1_wg154` directory to design the interaction flow and define the **functional logic**:

  **for images get from** `ref_en_en_1_wg154/Asset/SVG/en_en_1_wg154_images.svg`

  * `ref_en_en_1_wg154/en_en_1_wg154.docx` – Storyboard presentation

* **Functional Reference**:
  Use the xd file to fully understand the **expected logic, combinations, and behavior** required for the **Naming Words simulation**.
