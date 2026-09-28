# Wild About Articles — a / an (Widget 2)
**Component Code:** `en_en_01_wg181`  
**Grade Level:** Elementary / English Grammar  
**Standard Operating Procedure Compliance:** Level 1 Production Grade

---

## 1. Overview & Pedagogical Objectives

"Wild About Articles — a / an" is an interactive educational grammar widget designed to teach young learners the distinction between indefinite articles **"a"** and **"an"** through a zoo photography theme.

### Pedagogical Rules
- **"an"** is used before words that begin with a vowel sound (a, e, i, o, u).
- **"a"** is used before words that begin with a consonant sound.

### Animal Grammar Roster (20 Animals)
1. **an Alpaca** (Vowel 'a')
2. **an Eagle** (Vowel 'e')
3. **an Elephant** (Vowel 'e')
4. **a Flamingo** (Consonant 'f')
5. **a Giraffe** (Consonant 'g')
6. **a Hippopotamus** (Consonant 'h')
7. **a Hyena** (Consonant 'h')
8. **a Kangaroo** (Consonant 'k')
9. **a Lion** (Consonant 'l')
10. **an Octopus** (Vowel 'o')
11. **an Orangutan** (Vowel 'o')
12. **an Ostrich** (Vowel 'o')
13. **an Otter** (Vowel 'o')
14. **an Owl** (Vowel 'o')
15. **a Panda** (Consonant 'p')
16. **a Penguin** (Consonant 'p')
17. **a Rhino** (Consonant 'r')
18. **a Snake** (Consonant 's')
19. **a Tiger** (Consonant 't')
20. **a Zebra** (Consonant 'z')

---

## 2. Technical Architecture

### 100dvh Zero-Scroll Guarantee
- Uses the standard 1920×1080 stage constrained by:
  `width: min(calc(100vw - 16px), calc((100dvh - 16px) * 1920 / 1080))`
- The viewport is locked to `overflow: hidden; height: 100dvh;` on `html`, `body`, and outer container.
- Zero horizontal or vertical scrollbars appear on any screen size.

### Standalone & 100% Offline Capable
- Runs completely offline via direct `file:///` execution without requiring a local web server or internet connection.
- Dual audio engine: HTML5 `<audio>` for `sound-effect-614.mp3` with immediate Web Audio API synthesizer fallback.
- Vector graphics (`.svg`) reside locally in `assets/`.
- Local `lottie.min.js` and `lottie-data.js` bundled directly with zero CDN dependency.

---

## 3. Directory Structure

```
en_en_01_wg181/src/
├── index.html            # Main semantic HTML5 markup
├── styles.css            # Complete design system & zero-scroll layout
├── script.js             # State machine, grammar engine, audio & feedback
├── lottie.min.js         # Local offline Lottie player engine
├── lottie-data.js        # Bundled 40 Lottie JSON animation files
├── README.md             # Technical documentation & usage instructions
└── assets/               # Production assets
    ├── zoo-01.svg             # Welcome screen vector background
    ├── zoo-inner-view.svg      # Safari game view vector background
    ├── zoo-ticket.svg         # Interactive Admit One start button
    ├── photo-back.svg         # Empty polaroid slot placeholder
    ├── camera.svg             # Vintage safari camera body
    ├── camera-frame.svg       # Viewfinder framing SVG
    ├── sound-effect-614.mp3   # Camera shutter sound effect
    └── [animal]-cam.svg & [animal]-photo.svg (20 animal SVGs)
```

---

## 4. User Experience Flow

1. **Welcome Screen:**
   - Vector art featuring zoo animals and wooden sign (`zoo-01.svg`).
   - "Wild About Articles" sky blue pill header (`#0295fc`).
   - Instruction: *"You're visiting the zoo with your camera! Tap a or an to snap each animal you spot."*
   - Interactive Admit One ticket button with tilt and hover effects.
   - Clicking unlocks the audio engine and transitions to the Safari Screen.

2. **Safari Game Screen:**
   - Center viewfinder shows an animal randomized from the 20-animal deck.
   - Counter pill on top right tracks progress (e.g. `00/20 snapped`).
   - Choice buttons: **"a"** and **"an"** hot pink pill buttons (`#ff2c68`).
   - **Correct Answer:**
     - Mechanical shutter click sound plays.
     - Viewfinder flashes bright white (`flashPop`).
     - Corresponding polaroid drops into the 20-slot album on the right (`dropIn`).
     - Counter increments and next animal appears.
   - **Incorrect Answer:**
     - Viewfinder executes dynamic horizontal lens shake (`shakeBlur`) with red shadow.
     - Counter and animal remain intact; user tries again immediately.

3. **Completion Screen:**
   - Triggered when all 20 animals are snapped (`20/20 snapped`).
   - Trophy celebration card praising the user.
   - Full 20-slot polaroid album displaying all animals with their grammar captions (e.g. "an elephant", "a lion").
   - **"Play Again"** button (`#ff9900`) shuffles a new randomized run.
