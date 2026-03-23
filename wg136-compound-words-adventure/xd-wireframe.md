Folder for reference and code: @wg136-compound-words-adventure 

Develop an interactive SVG/HTML/JavaScript implementation based on the wireframe provided in the Adobe XD link below:
https://xd.adobe.com/view/5d067d07-ed5c-4271-b60f-9c6f5e73e908-0855/

Physical file: @wg136-compound-words-adventure/refs/en_en_04_wg136.xd 
Reference HTML (sample implementation by content team):@wg136-compound-words-adventure/refs/wg136-content flow.html 

Use the provided document as the storyboard reference to design the interaction flow and define the functional logic:
Doc: @wg136-compound-words-adventure/refs/en_en_04_wg136.docx 

Do not modify the existing UI layout or design. Maintain the UI exactly as shown in the wireframe. All interactions must be implemented strictly through showing and hiding and animation SVG elements.

Treat index.html as the main boilerplate file, which already contains the required SVG layout.

Write the logic in a separate JavaScript file using plain JavaScript. The implementation should be function-based, and all global variables must be encapsulated within a single global object.

Widget-specific instruction:
Extract the answer panels from the main SVG in index.html and use them to populate the right-hand side answer panel.

prompt 2:
After attempting the correct answer there should be a sound effect of a bird chirping and confetti animation should come out from the card and the correct answer should be added to the discovered words list, leaving a ghostly image of the correct answer, like in xd design.
check the snap for mis align of the items
the whole card should be clickable not only text
check the snap the exclamotory mark should be after the word selected now its overlapping on the word for some
The progress bar should be filled with green color after each correct as per xd design
the center image, the main word box card should not be clickable 
on rollover several buttons/cards are flickering, there should be no rollover effect at all as these are used in touch based IFP panels in classroom
just modified the main svg to add a background to the answer panel(id="answer_panel_bg") in right
just added a congratulation popup as(id="correct_end_popup") in the main svg as per xd design, implements its logic it should come after all 4 correct answer are given
The answer panels should be positioned from top to bottom as in xd design dynamically

prompt3
After Completing a Family:

Show the completion popup for 1–2 seconds.

No “Play Again” button is needed; automatically return to the Home screen after 2 seconds.

After Completing All 6 Families:

Display the same popup, but include a “Play Again” button that resets the game.

Trigger a celebration animation.

Update the message in id="correct_text" to:
“🏆 Congratulations! You've mastered all 24 compound words!”