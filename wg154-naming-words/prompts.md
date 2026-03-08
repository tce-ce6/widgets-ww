Widget 154 – Implementation Prompt
Generic Instructions

Develop an interactive SVG/HTML/JavaScript implementation based on the provided wireframe.

Do not modify the main SVG inside index.html. This SVG represents the final designer-approved layout and must remain unchanged.

No elements should be added, removed, repositioned, resized, or visually modified within the main SVG.

Maintain the exact UI defined in the wireframe, and implement all interactions strictly by showing and hiding existing SVG elements.

Treat index.html as the primary boilerplate file that contains the complete SVG layout.

SVG Preparation (Important) but do not change the positions

Before implementing the functionality:

Carefully analyze the SVG structure within index.html.

Only perform minimal structural adjustments if absolutely necessary for scripting, such as:

Renaming element IDs

Renaming or logically grouping existing SVG <g> elements

Organizing references for easier JavaScript control

However:

Do not change the visual layout, positions, sizes, styling, or structure of the main SVG.

Do not redraw, recreate, or replace the SVG.

The UI appearance must remain exactly the same as the designer-approved layout present in index.html.

JavaScript Structure

Create a separate JavaScript file named js/script.js.

The script should:

Follow a modular, function-based architecture

Store all global variables within a single global state object (WidgetState) to manage selections and track the current stage

Pre-cache frequently used DOM elements in an initialization function to improve performance (e.g., UI.buttons, UI.stages)

Define clear stage transition functions (goToStage1(), goToStage2(), etc.) to control the visibility of the relevant SVG groups

Use plain (vanilla) JavaScript only, without any external libraries

Include clear, well-documented comments throughout the code for maintainability

Widget-Specific Instructions

Target Folder: @beautifulMention 

Adobe XD Wireframe:
https://xd.adobe.com/view/1c2f4182-0a7c-419a-afb5-209f2c62babb-497c/

XD file: @beautifulMention 

Storyboard & References:
Use the files available in the @beautifulMention  directory to design the interaction flow and define the functional logic.

Images Source: @beautifulMention 
@beautifulMention  – Storyboard for logic and text and notes needed for presentation

Functional Reference:
Refer to the XD file to clearly understand the expected logic, combinations, and behavior required for the Naming Words simulation.


phase 1:
Edit the required SVG elements inside the HTML first to enable the functionality of this widget.

Refer to the XD file for the layout and interaction flow: @beautifulMention
Adobe XD Wireframe:
https://xd.adobe.com/view/1c2f4182-0a7c-419a-afb5-209f2c62babb-497c/

Refer to the storyboard for the logic and data reference: @beautifulMention