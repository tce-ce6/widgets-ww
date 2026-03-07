# WG48 – Mendel's Dihybrid Cross: Interaction Flow Reference
**Version:** b3_wg48_260221  
**XD Prototype:** https://xd.adobe.com/view/3914218c-1ed0-48f6-8d26-9039805865af-6c47/  
**Reference HTML:** `ref_en_bio_10_wg48/en_bio_10_wg48_Ch8_Dihybrid Cross.html`

---

## Complete 6-Stage Flow

```
Stage 1 → Stage 2 → Stage 3 → Stage 4 → Stage 5 → Stage 6
  [Next]   [Gen Gametes]  [Auto-fill F1]  [Gen F2 Gametes]  [Next]
```

---

## Stage Details

### Stage 1: Trait Selection
**SVG Layer:** `Cards_x5F_01_x5F_Default`  
**Trait Card Group IDs:**
| Index | Group ID     | Trait Name       |
|-------|-------------|------------------|
| 0     | `Group_4-2`  | Seed Shape       |
| 1     | `Group_5-2`  | Seed Colour      |
| 2     | `Group_6-2`  | Flower Colour    |
| 3     | `Group_7-2`  | Pod Shape        |
| 4     | `Group_8-2`  | Pod Colour       |
| 5     | `Group_9-2`  | Flower Position  |
| 6     | `Group_10-2` | Stem Height      |

**Interaction:** Click any 2 cards to select them (highlights green border).  
**Button:** `id="Next"` (SVG group `Group_594` wrapper) → advances to Stage 2  
**Gate:** Exactly 2 traits must be selected  
**Combination ID:** Calculated via `getCombinationId(lo, hi)` → value 1–21

---

### Stage 2: Parental Generation (P)
**SVG Base:** `stage2_x5F_base`  
**Combination Cards:** `Stage2-_Card_1` … `Stage2-_Card_21`  
- Each card has **2 direct child `<g>` groups** = P1 plant and P2 plant (draggable)

**Drop Zones:** 2 × `.st235` rects inside `stage2_x5F_base`
- `UI.p1Drop` = rects[0] (left target — Dominant Parent)
- `UI.p2Drop` = rects[1] (right target — Recessive Parent)

**State Tracking:**
```js
WidgetState.s2.p1Dropped = false;
WidgetState.s2.p2Dropped = false;
```

**Button:** `id="Next1"` (SVG group `Next1` wrapping `Generate_Gametes` text)  
**Gate:** Both `p1Dropped` AND `p2Dropped` must be `true` → enables button  
**Transition:** `goToStage3()`

---

### Stage 3: Crossing-Over Area / F1 Punnett Square
**SVG Base:** `stage3_x5F_base`  
**Gamete Groups:** `stage3_x5F_Gametes01` … `stage3_x5F_Gametes21`  
- Shows the F1 Punnett Square grid (pre-rendered with genotypes for the selected combination)
- Also shows Parent 1 and Parent 2 gamete labels on the left panel

**AUTO-FILL GATE:** The F1 Punnett Square is revealed ONLY after the button is clicked.  
**Button:** `id="Next2"` (SVG group wrapping `Auto-fill_F1_Punnett_Square` text)  
**Transition:** `goToStage4()` — triggered only on explicit click, not automatically

---

### Stage 4: F1 Self-Pollination
**SVG Base:** `stage4_x5F_base`  
**Combination Cards:** `Stage4-_Card_1` … `Stage4-_Card_21`  
- Each card has **4 direct child `<g>` groups** = 4 × F1 Offspring (all heterozygous dominant)
- Only the **first 2** are made draggable

**Drop Zones:** 2 × `.st235` rects inside `stage4_x5F_base`
- `UI.f1Drop1` = rects[0] (left target)
- `UI.f1Drop2` = rects[1] (right target)

**State Tracking:**
```js
WidgetState.s4.f1_1Dropped = false;
WidgetState.s4.f1_2Dropped = false;
```

**Button:** `id="Next3"` (SVG group `Next3` wrapping `Generate_F2_Gametes` text)  
**Gate:** Both `f1_1Dropped` AND `f1_2Dropped` must be `true` → enables button  
**Transition:** `goToStage5()`

---

### Stage 5: F2 Punnett Square
**SVG Base:** `stage5_x5F_base`  
**F2 Gamete Groups:** `stage5_x5F_Gametes_01` … `stage5_x5F_Gametes_21`  
- Full 4×4 F2 Punnett Square with 16 genotype cells (pre-rendered per combination)
- Ratios panel kept hidden until "Next" is clicked

**Button:** `id="Next4"` (SVG group `Next4` wrapping `Next` text)  
**Transition:** `goToStage6()` — reveals the ratios panel

---

### Stage 6: Final Results
**Groups Shown:**  
- `stage5_x5F_Gametes_XX` (F2 Punnett — already visible from Stage 5)
- `stage5_x5F_Genotypic_Ratio_x5F_XX` (Genotypic & Phenotypic ratios)

**Result for all combinations:**
- Phenotypic Ratio: **9 : 3 : 3 : 1** (Dominant-Dominant : Dom-Rec : Rec-Dom : Rec-Rec)

---

## Combination Map (21 total)

| Traits (lo, hi) | ID |
|---|---|
| (0,1) Seed Shape + Seed Colour | 1 |
| (0,2) Seed Shape + Flower Colour | 2 |
| (0,3) Seed Shape + Pod Shape | 3 |
| (0,4) Seed Shape + Pod Colour | 4 |
| (0,5) Seed Shape + Flower Position | 5 |
| (0,6) Seed Shape + Stem Height | 6 |
| (1,2) Seed Colour + Flower Colour | 7 |
| (1,3) Seed Colour + Pod Shape | 8 |
| (1,4) Seed Colour + Pod Colour | 9 |
| (1,5) Seed Colour + Flower Position | 10 |
| (1,6) Seed Colour + Stem Height | 11 |
| (2,3) Flower Colour + Pod Shape | 12 |
| (2,4) Flower Colour + Pod Colour | 13 |
| (2,5) Flower Colour + Flower Position | 14 |
| (2,6) Flower Colour + Stem Height | 15 |
| (3,4) Pod Shape + Pod Colour | 16 |
| (3,5) Pod Shape + Flower Position | 17 |
| (3,6) Pod Shape + Stem Height | 18 |
| (4,5) Pod Colour + Flower Position | 19 |
| (4,6) Pod Colour + Stem Height | 20 |
| (5,6) Flower Position + Stem Height | 21 |

---

## Key SVG CSS Classes
| Class | Meaning |
|---|---|
| `st656` | `display: none` — default hidden state for all stage groups |
| `st235` | Drop zone rect styling (dashed border, transparent fill) |
| `st268` | Button background rect (pill shape) |
| `st28`  | Text group wrapper (uses SVG text styling) |

**Important:** `showElement()` must do `el.style.display = 'block'; el.classList.remove('st656')` to override the CSS class.

---

## Button IDs Summary
| SVG ID | Button Text | Action |
|---|---|---|
| `Next` | "Next" | Stage 1 → 2 |
| `Next1` | "Generate Gametes" | Stage 2 → 3 |
| `Next2` | "Auto-fill F1 Punnett Square" | Stage 3 → 4 (GATE: user must click) |
| `Next3` | "Generate F2 Gametes" | Stage 4 → 5 |
| `Next4` | "Next" | Stage 5 → 6 (reveals ratios) |
| `Reset` | "Reset" | Resets current session |
| `Reset_All` | "Reset All" | Full widget reset |

---

## Console Log Sequence (expected)
```
[WG48] DOMContentLoaded — init
[WG48] Cache summary: traitCards: 7 s2Cards: 21 ...
[WG48] resetWidget — returning to Stage 1
[WG48] Selected trait 0. Selection now: [0]
[WG48] Selected trait 1. Selection now: [0, 1]
[WG48] Next clicked. Stage: 1 Traits: [0, 1]
[WG48] Combination ID: 1
[WG48] ▶ Stage 2 — Parental Generation
[WG48] _setupDraggables: found 2 child groups, making 2 draggable
[WG48] Dropped s2P1 into target
[WG48] S2 check — P1:true P2:false
[WG48] Dropped s2P2 into target
[WG48] S2 check — P1:true P2:true
[WG48] Both parents dropped → Generate Gametes enabled
[WG48] Generate Gametes clicked → Stage 3
[WG48] ▶ Stage 3 — Crossing Over / F1 Punnett (empty)
[WG48] Auto-fill F1 clicked → Stage 4
[WG48] ▶ Stage 4 — F1 Self-Pollination
[WG48] Both F1 offspring dropped → Generate F2 Gametes enabled
[WG48] Generate F2 Gametes clicked → Stage 5
[WG48] ▶ Stage 5 — F2 Punnett Square
[WG48] Next (stage 5) clicked → Stage 6 ratios
[WG48] ▶ Stage 6 — Genotypic & Phenotypic Ratios
```

---

## Known Issues Fixed
1. **Blank Stage 2 screen**: Caused by `.st656 { display: none }` CSS class not being overridden. Fixed by `el.classList.remove('st656')` in `showElement()`.
2. **Auto-fill not gated**: Previously `goToStage4()` was called automatically in `goToStage3()`. Fixed by making transition only fire from the `btnAutoFillF1` click handler.
3. **Stage skip bug**: The widget was jumping from Stage 4 → Stage 6 skipping Stage 5. Fixed by restructuring `goToStage5()` to only show the F2 Punnett, with a separate `goToStage6()` triggered by `Next4` click.
