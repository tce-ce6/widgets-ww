# Commonly Confused Words (WG82)

## Description
This widget helps learners distinguish between commonly confused word pairs (e.g., *angel* vs. *angle*, *through* vs. *thorough*) by listening to contextual sentences.

## Key Features
- **Dynamic Puzzle Reveal**: Correct answers reveal pieces of a hidden background image (36 total).
- **Phonetic Reinforcement**: Dedicated audio icons for sentences and individual word options.
- **Celebration Feedback**: 
  - Individual correct answer: Lottie celebration emoji animation.
  - Puzzle completion: Full-screen confetti burst.
- **Interactive Logic**: 
  - Main buttons disable after an answer to prevent re-scoring.
  - Audio icons remain active for replay at any time.

## Debugging & Testing
### 1. Skip to the Final Question
To test the completion state, run this in the browser console:
```javascript
GlobalObj.piecesCollected = 35; 
loadQuestion();
```
*Answering the next (36th) question correctly will trigger the final puzzle reveal and hide the "Next" button.*

### 2. Preview Celebration Animation
To trigger the high-layer confetti animation manually:
```javascript
triggerEndAnimation();
```

## Technical Implementation Notes
- **Lottie Assets**: To bypass browser `file://` fetch restrictions, the Lottie JSON was transformed into a JavaScript object in `js/emoji_data.js` and loaded via a `<script>` tag.
- **Z-Index**: The confetti animation uses `zIndex: 9999` to remain above header and modal elements.
- **Positioning**: Lottie container is positioned at `top: 62.5%`, `left: 86.5%` to align center-vertically with the option buttons.
