Folder: 

wg97-find-the-dna-lengths
 

OBJECTIVE: 
1. Create a complete interaction flow plan. 
2. Build a small
slideshow-style POC to verify understanding. 
3. Refine the production
prompt based on verification. 
4. Update prompts.md in the root folder.

STEP 1 – INTERACTION FLOW PLANNING

Analyze: - Adobe XD wireframe link - https://xd.adobe.com/view/9f1031e9-82d6-4ce8-9a97-b6bee530029f-ca43/
storyboard file: 

en_bio_12_wg97.pptx

Generate:

1.  UI Structure Mapping

-   List all SVG elements.
-   Identify interactive elements.
-   Identify static elements.
-   Identify dynamic text placeholders.
-   Identify dynamic image placeholders.
-   Identify animation placeholders.
-   Identify where foreignObject may be required (justify).

2.  Interaction Flow

-   Step-by-step user journey.
-   Trigger events.
-   State transitions.
-   Validation logic.
-   Success conditions.
-   Error handling.
-   Reset logic.
-   Animation synchronization points.

3.  Technical Architecture Plan

All code must be inside a class named:

if the widget name is Wg97 
class Wg97

Required internal methods: 
- constructor() 
- init() 
- cacheDOM() 
- bindEvents() 
- updateUI() 
- validateStep() 
- handleAnimation() 
- updateText() 
- updateImage() 
- resetWidget()

No production code yet at this stage.

------------------------------------------------------------------------

STEP 2 – POC INTERACTIVE (SLIDESHOW STYLE)

Create a minimal working interaction: 
- Use existing index.html SVG. 
- Do NOT modify layout. 
- Use simple next-step progression. 
- Use show/hide logic. 
- Simulate state changes. 
- Demonstrate text updates and image swapping if applicable.

Written in pure vanilla javascript
All JavaScript must be inside:

class Wg97 { … }

Single instance only:

const WG97_WIDGET = new Wg97(); WG97_WIDGET.init();

No global function leakage.

------------------------------------------------------------------------

STEP 3 – REFINED PRODUCTION PROMPT

After POC: 
- Analyze correctness. 
- Identify mismatches. 
- Clarify state flow. 
- Clarify animation lifecycle. 
- Clarify dynamic content logic. 
- Remove ambiguity.

------------------------------------------------------------------------

STEP 4 – UPDATE prompts.md

Update prompts.md in root folder with: 
- Final verified production prompt. 
- Flow summary. 
- State architecture. 
- Animation notes. 
- Image handling notes. 
- foreignObject decisions. 
- Edge cases. 
- Performance notes.


# PPT Notes to be included in the prompt as widget specific instructions taken from the storyboard

The ppt notes slide wise:

Slide 2:

Objective:
To determine sample DNA fragment sizes by comparing their band positions with a standard DNA ladder on agarose gel electrophoresis.

Use Case and User Interaction:
Users can observe DNA band positions of four samples alongside a DNA ladder on simulated gel electrophoresis results.
Users can estimate and enter fragment sizes in base pairs (bps) by comparing sample band positions with ladder markers.
Immediate validation shows correct answers, helping users refine their measurement accuracy.
Five different sample sets provide varied practice scenarios for developing gel interpretation skills.

Slide 3:

1. The user can select any of the five tubes in any order. 
2. The user can press “Insight” button for having an insight about the widget’s topic. 

Slide 4:

1. If the user presses the “Insights” button, then the given information pops up. 
2. The user can close it by tapping on the cross button. 

Slide 5:

1. When the user selects any tube. It gets highlighted. 

Slide 6:

1. After selecting the tube, automatically a micropipette appears. 

Slide 7:

1. The mixture is sucked in the micropipette. 

Slide 8:

1. The micropipette goes to the Lane 1 for DNA ladder. (Note for DNA ladder the animation should always show the micropipette going to the Lane 1).

Slide 9:

1. The sample is loaded in the Lane 1 through animation. 

Slide 10:

1. After the first sample is loaded it is marked with a different colour. 
2. The user can then select the second sample. 

Slide 11:

1. Repeat the animation of slide 6. 

Slide 12:
1. Repeat the animation of slide 7. 

Slide 13:

For samples other than the DNA ladder, the animation should show that the micropipette going to the next lane of Ladder. 
2. NOTE: Although the samples (1 to 4) can be selected in any order, they should be loaded in the order from Lane 2 to Lane 5. 

Slide 14:

1. The sample is loaded in the Lane 2 through animation. 

Slide 15:

1. After the second sample is loaded it is marked with a different colour. 

Slide 16:

1. This way all the lanes are loaded with the sample.
2. All the sample tubes are marked with a different color. 

Slide 17:

1. After all the lanes are loaded, the Start and Reset button appear. 
2. If the user presses “Reset” button the user can again reload all the samples from slide 5 to slide 16. 

slide 18:

1. If the user presses “Start” button, the DNA samples start running and bands form. (Refer to the last slide [23] for the reference of animation).
2. Then the bands form.

Slide 19:

1.After the DNA bands form text boxes appear below the sample tubes, where the user has to manually enter the correct values.  

Slide 20:

1. For correct values the text boxes will appear green with a feedback message. 
2. For wrong values the text boxes will appear red with a feedback message. 

Slide 21:

1. After all the correct values are entered a success feedback message appears. 
2. The “Reset” button also appears 
3. Pressing the “Reset” button restarts the entire widget from slide 3, but with a new set of four samples, having completely different lengths of DNA. 
4. There are total 5 different sets of DNA samples which randomly appear. 

Slide 22:
Instruction for creation of sample Sets

Set 1:
Sample lengths: 500, 1000, 1400, 1700

Set 2:
Sample lengths: 300, 700, 1200, 2000

Set 3:
Sample lengths: 600, 800, 1900, 2100

Set 4:
Sample lengths: 100, 900, 1300, 1800

Set 5:
Sample lengths: 200, 600, 1100, 1500

The sets should appear randomly in the widget.  


