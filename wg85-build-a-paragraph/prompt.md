# Project Prompt: WG85 Build a Paragraph Widget

## Objective
Finalize the interactive "Build a Paragraph" widget where students arrange scrambled sentences into a cohesive paragraph and then see a detailed annotation of grammar concepts (Opening, Linking, Concluding).

## Technical Requirements
- **Core Technology**: HTML, CSS, Javascript (with SVG-based interactive panels).
- **Data Structure**: `paragraphData` (15 total topics) includes:
  - `sentences`: Array of text strings.
  - `correctOrder`: 1-indexed integers defining the narrative flow.
  - `annotations`: Mapping of color keys to labelled descriptions and specific `words` arrays for highlighting.
- **Visual Design**:
  - **Left Panel (Building)**: Shuffled sentence buttons; once clicked correctly, button blurs (`2px`) and disabled (greyed-out).
  - **Left Panel (Completion)**: Detailed Annotation Legend (Yellow, Pink, Cyan color boxes) with grammar concept descriptions.
  - **Middle Panel (Building)**: Text grows sentence-by-sentence as correct buttons are clicked. `paddingTop: 80px` to prevent header overlap.
  - **Middle Panel (Completion)**: Full paragraph with color-coded highlights and a topic image at the top.
  - **Right Panel**: Topic-specific image appears only upon 100% completion.

## Highlighting Logic
1.  **Annotation 1 (Yellow - #FFFF00)**: Opening/Introductory sentence.
2.  **Annotation 2 (Pink - #FF00FF)**: Linking words/phrases (must appear on top of other highlights).
3.  **Annotation 3 (Cyan - #00FFFF)**: Concluding/Summary sentence.
- Use Regex with word boundaries for short linking phrases.
- Processing Order: Yellow -> Cyan -> Pink (final layer).

## Interactivity & Shuffling
- **Paragraph Shuffling**: Topic order should be randomized at start using deep-copy or in-place Fisher-Yates.
- **Sentence Shuffling**: Button order shuffles on every load/reset.
- **Dynamic Title**: Update the SVG `<text>` (ID: `para-title`) to reflect the current topic name upon completion.
- **Immediate Transitions**: Completion should trigger `showCompletionScreen()` instantly after the last sentence is placed correctly.

## Layout Specs
- Paragraph box location: `x=661, y=185, width=745, height=720`.
- Text Styling: `Roboto-Bold`, `26px`, `line-height: 1.5`, `color: #181818`.
- Header: `para-title` centered at `x=1033.5, y=150` in completion state.
