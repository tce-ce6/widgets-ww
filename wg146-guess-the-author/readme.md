# WG146 - Guess the Author

An interactive HTML/SVG educational widget designed for CBSE/ICSE English Literature (Grades 9-12). Users are presented with a famous quote and must correctly identify the author from a multiple-choice tray to reveal a detailed biography and portrait.

## Features

- **Pure SVG UI**: Modifies the DOM entirely by targeting existing UI elements inside the pre-rendered `index.html` file using JavaScript without breaking the predefined wireframes and SVG coordinates.
- **Dynamic Content Wrapping**: Accurately calculates SVG string breakpoints and splits `<tspan>` rows automatically ensuring quotes and "Fun Facts" conform within graphical bounds (limited to exactly two bullet points where appropriately requested).
- **Persistent Disabled States**: Action items like "Meet the Author" securely dim with opacity instead of completely disappearing off the UI, preserving visual balance.
- **Auto-Aligned Hierarchy**: The "Fun Facts" block and generated "Why read this author?" title mathematically anchor their Y-offset directly onto where the "Works" section resolves—whether 1 line or 3 lines deep.
- **Validating Feedback**: Shaking logic handles incorrect guessing smoothly alongside correct outline styling locking immediately.

## Data Configuration

The questions and biographical strings are mapped at the very top of `js/script.js` inside the `window.Wg146.data` array structure. 
Each object in the array explicitly requires the following keys:
- `quote` (string)
- `correct` (string)
- `distractors` (array with 2 incorrect strings)
- `hint` (string)
- `alias`, `dates`, `country`, `whyRead` (strings)
- `works` (array of strings)
- `funFacts` (array of strings)
- `portraitId` (exact reference to the SVG group portrait tag)

## Usage & Debugging Tools

Given the extensive volume of authors and states, two browser console commands have been built into the global object so QA developers can thoroughly validate formatting and spacing without needing to manually play through every round:

### `Wg146.debugQuestions()`
Immediately cycles through all 14 authors' basic questions/prompts on the main dashboard, logging the successful mounting of each configuration string consecutively to the browser's console in order to sanity check strings before returning to normal functionality.

### `Wg146.debugMeetAuthor([popupNumber])`
A powerful alignment calibration tool handling displaying the "Meet the Author" modal sequentially.
- **No argument**: Call `Wg146.debugMeetAuthor()` natively to start a 3-second timed loop through all 14 panels sequentially to watch the dynamically anchored "Fun Facts" bounding engine in action.
- **Specific index**: Provide a specific digit (e.g. `Wg146.debugMeetAuthor(3)`) to instantly bypass the loop and snap directly to the popup layout for the third author array item (Sir Arthur Conan Doyle in this repository) to inspect padding easily.
