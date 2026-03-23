# Compound Words Adventure Widget

An interactive educational widget where students discover compound words by matching icons to their corresponding family word (e.g., SUN + FLOWER = SUNFLOWER).

## Features
- **6 Word Families**: SUN, RAIN, SNOW, FIRE, SEA, SAND.
- **Dynamic Feedback**: Visual ghosting of used cards, confetti animations, and status indicators.
- **Completion Flows**: 
  - Individual family completion automatically returns to menu after 2 seconds.
  - Overall game completion triggers a special celebration trophy screen with a full reset option.

## Debugging & Testing
To speed up testing, a global `Debug` object is available in the browser's developer console (F12):

| Command | Action |
| --- | --- |
| `Debug.completeCurrent()` | Instantly completes the currently open family. |
| `Debug.completeAll()` | Marks all 6 families as completed and shows the final trophy screen. |
| `Debug.reset()` | Force-reloads the widget to reset all state. |

### How to use:
1. Open the widget in a browser.
2. Press `F12` to open the Developer Tools.
3. Select the **Console** tab.
4. Type any of the commands above and press `Enter`.
