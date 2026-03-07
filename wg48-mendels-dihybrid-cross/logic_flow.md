# Mendel's Dihybrid Cross - Logical Flow (WG48)

## Overview
This document outlines the state-machine logic, sequence of events, and data structures driving the WG48 Dihybrid Cross simulation. The application is built using vanilla JavaScript, relying on a central `WidgetState` to track progress and a modular UI cache to handle interactive updates without re-querying the DOM.

## Stage 1: Trait Selection
**Initial State:** 
- `WidgetState.stage = 1`
- Selectable cards (Seed Shape, Seed Colour, Flower Colour, Pod Shape, Pod Colour, Flower Position, Stem Height) are displayed.
- The "Next" button is visible but requires a specific state to progress.

**Interaction Logic:**
- **User Action:** Clicks a trait card.
- **System Action:**
  1. Captures `pointerdown` event.
  2. Updates `WidgetState.selectedTraits` array (maximum of 2 traits).
  3. UI visually highlights selected cards (adds green border `st28`/custom styling).
- **Condition for progression:** Exactly 2 traits must be selected.
- **Navigation:** Click "Next". The `combinationId` (1 to 21) is calculated using `getCombinationId(t1, t2)`.
- **Transitioning via `goToStage2()`:**
  - Hides Stage 1 interface (`Cards_x5F_01_x5F_Default`, `Next` button).
  - Surfaces Stage 2 Base layout and specifically loads the correct pre-rendered combination group for the parents.

## Stage 2: Parental Generation (P)
**Current State:**
- `WidgetState.stage = 2`
- Combination cards for P1 (Dominant/Recessive allele matches) are shown, along with two drop zones (`p1DropZone`, `p2DropZone`).
- "Generate Gametes" button is disabled/low-opacity.

**Interaction Logic:**
- **Draggables:** The `Stage2-_Card_X` group contains active parent elements. 
- **User Action:** Drags Parent 1 and Parent 2 to their respective target boxes.
- **System Action:**
  - Tracks drag states via `WidgetState.activeDragCard` adjusting X/Y offset incrementally (`pointermove`).
  - Upon drop (`pointerup`), `checkCollision` verifies if bounding boxes loosely intersect. 
  - If placed successfully, locks the card (`cursor='default'`) and updates flags (`WidgetState.s2.p1Dropped` and `p2Dropped`).
- **Callback & Validation:** `checkS2Completion()` fires on every drop. When both cards are confirmed dropped, the "Generate Gametes" button is enabled.
- **Transitioning via `goToStage3()`:** Wait for user to click "Generate Gametes". Loads the gamete generation data (`s3Gametes[id]`) and hides Stage 2 elements.

## Stage 3: F1 Gametes & Punnett Square
**Current State:**
- `WidgetState.stage = 3`
- Gametes associated with the combinations are drawn above the F1 Punnett Square.
- The Punnett Square cells begin unpopulated.
- "Auto-fill F1 Punnett Square" button is visible.

**Interaction Logic:**
- **User Action:** Clicks "Auto-fill F1 Punnett Square".
- **System Action:** Instantly triggers transition `goToStage4()`. (In this widget workflow, the F1 filling is automatic and initiates the next stage where F1 traits are fully visible for self-pollination).

## Stage 4: F1 Self-Pollination & F2 Setup
**Current State:**
- `WidgetState.stage = 4`
- Resulting F1 Phenotypes/Genotypes (which are identically heterozygous dominant) are shown.
- F1 drop zones (`f1DropZone1`, `f1DropZone2`) are shown to simulate F1 x F1 crossing.
- "Generate F2 Gametes" button is visible but disabled.

**Interaction Logic:**
- **Draggables:** Similar to Stage 2, F1 offspring cards are mapped with bounding constraints.
- **User Action:** Drags both F1 seeds/plants to the F1 crossing target boxes.
- **System Action:** Updates `WidgetState.s4.f1_1Dropped` and `WidgetState.s4.f1_2Dropped`. 
- **Callback & Validation:** `checkS4Completion()` monitors if both variables are true. If so, enables "Generate F2 Gametes".
- **Transitioning via `goToStage5()`:** User clicks "Generate F2 Gametes". Hides Stage 4 constructs and displays the massive 16-cell F2 Punnett Square (`s5Base`).

## Stage 5: F2 Generation (Final Phase)
**Current State:**
- `WidgetState.stage = 5`
- Displays the full dihybrid combinations across 16 grid cells alongside their resulting phenotypes.
- The Genotypic Ratio and Phenotypic Ratio (fixed at 9:3:3:1 for all traits mathematically) appear conditionally depending on button states.

**Interaction Logic:**
- Usually triggered by an "Auto-fill F2 Punnett Square" (if implemented). In many standard builds of WG48, `goToStage5()` instantly renders the computed F2 visual blocks (`s5Gametes` and `s5Ratios`) to indicate the final cross probabilities.
- User can hit "Reset" or "Reset All" to revert everything to Stage 1. 

## Reset & Utility Mechanisms
**Reset Functions:**
- Resets all progression booleans.
- Re-initalizes `WidgetState.originalTransforms` mapping to restore SVGs to their starting coordinates without reloading the webpage.
- Resets selected index back up.

**CSS/Visibility Rule (`st656` blank screen bug resolution):**
SVG elements initially hidden with `display: none` natively applied inside classes (like `st656`) required a hard style override. By defining `el.style.display = 'block'` inside the `showElement()` logic sequence, the interaction flow systematically bypasses underlying static CSS restrictions, guaranteeing stages do not render blankly against backgrounds.
