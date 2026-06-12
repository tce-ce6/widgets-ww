RNADATA = {
    "genetic_code": [
        { "mRNA": "UUU", "tRNA": "AAA", "amino_acid": "Phenylalanine" },
        { "mRNA": "UUC", "tRNA": "AAG", "amino_acid": "Phenylalanine" },

        { "mRNA": "UUA", "tRNA": "AAU", "amino_acid": "Leucine" },
        { "mRNA": "UUG", "tRNA": "AAC", "amino_acid": "Leucine" },

        { "mRNA": "UCU", "tRNA": "AGA", "amino_acid": "Serine" },
        { "mRNA": "UCC", "tRNA": "AGG", "amino_acid": "Serine" },
        { "mRNA": "UCA", "tRNA": "AGU", "amino_acid": "Serine" },
        { "mRNA": "UCG", "tRNA": "AGC", "amino_acid": "Serine" },

        { "mRNA": "UAU", "tRNA": "AUA", "amino_acid": "Tyrosine" },
        { "mRNA": "UAC", "tRNA": "AUG", "amino_acid": "Tyrosine" },

        { "mRNA": "UAA", "tRNA": null, "amino_acid": "Stop" },
        { "mRNA": "UAG", "tRNA": null, "amino_acid": "Stop" },

        { "mRNA": "UGU", "tRNA": "ACA", "amino_acid": "Cysteine" },
        { "mRNA": "UGC", "tRNA": "ACG", "amino_acid": "Cysteine" },

        { "mRNA": "UGA", "tRNA": null, "amino_acid": "Stop" },
        { "mRNA": "UGG", "tRNA": "ACC", "amino_acid": "Tryptophan" },

        { "mRNA": "CUU", "tRNA": "GAA", "amino_acid": "Leucine" },
        { "mRNA": "CUC", "tRNA": "GAG", "amino_acid": "Leucine" },
        { "mRNA": "CUA", "tRNA": "GAU", "amino_acid": "Leucine" },
        { "mRNA": "CUG", "tRNA": "GAC", "amino_acid": "Leucine" },

        { "mRNA": "CCU", "tRNA": "GGA", "amino_acid": "Proline" },
        { "mRNA": "CCC", "tRNA": "GGG", "amino_acid": "Proline" },
        { "mRNA": "CCA", "tRNA": "GGU", "amino_acid": "Proline" },
        { "mRNA": "CCG", "tRNA": "GGC", "amino_acid": "Proline" },

        { "mRNA": "CAU", "tRNA": "GUA", "amino_acid": "Histidine" },
        { "mRNA": "CAC", "tRNA": "GUG", "amino_acid": "Histidine" },

        { "mRNA": "CAA", "tRNA": "GUU", "amino_acid": "Glutamine" },
        { "mRNA": "CAG", "tRNA": "GUC", "amino_acid": "Glutamine" },

        { "mRNA": "CGU", "tRNA": "GCA", "amino_acid": "Arginine" },
        { "mRNA": "CGC", "tRNA": "GCG", "amino_acid": "Arginine" },
        { "mRNA": "CGA", "tRNA": "GCU", "amino_acid": "Arginine" },
        { "mRNA": "CGG", "tRNA": "GCC", "amino_acid": "Arginine" },

        { "mRNA": "AUU", "tRNA": "UAA", "amino_acid": "Isoleucine" },
        { "mRNA": "AUC", "tRNA": "UAG", "amino_acid": "Isoleucine" },
        { "mRNA": "AUA", "tRNA": "UAU", "amino_acid": "Isoleucine" },

        { "mRNA": "AUG", "tRNA": "UAC", "amino_acid": "Methionine", "start": true },

        { "mRNA": "ACU", "tRNA": "UGA", "amino_acid": "Threonine" },
        { "mRNA": "ACC", "tRNA": "UGG", "amino_acid": "Threonine" },
        { "mRNA": "ACA", "tRNA": "UGU", "amino_acid": "Threonine" },
        { "mRNA": "ACG", "tRNA": "UGC", "amino_acid": "Threonine" },

        { "mRNA": "AAU", "tRNA": "UUA", "amino_acid": "Asparagine" },
        { "mRNA": "AAC", "tRNA": "UUG", "amino_acid": "Asparagine" },

        { "mRNA": "AAA", "tRNA": "UUU", "amino_acid": "Lysine" },
        { "mRNA": "AAG", "tRNA": "UUC", "amino_acid": "Lysine" },

        { "mRNA": "AGU", "tRNA": "UCA", "amino_acid": "Serine" },
        { "mRNA": "AGC", "tRNA": "UCG", "amino_acid": "Serine" },

        { "mRNA": "AGA", "tRNA": "UCU", "amino_acid": "Arginine" },
        { "mRNA": "AGG", "tRNA": "UCC", "amino_acid": "Arginine" },

        { "mRNA": "GUU", "tRNA": "CAA", "amino_acid": "Valine" },
        { "mRNA": "GUC", "tRNA": "CAG", "amino_acid": "Valine" },
        { "mRNA": "GUA", "tRNA": "CAU", "amino_acid": "Valine" },
        { "mRNA": "GUG", "tRNA": "CAC", "amino_acid": "Valine" },

        { "mRNA": "GCU", "tRNA": "CGA", "amino_acid": "Alanine" },
        { "mRNA": "GCC", "tRNA": "CGG", "amino_acid": "Alanine" },
        { "mRNA": "GCA", "tRNA": "CGU", "amino_acid": "Alanine" },
        { "mRNA": "GCG", "tRNA": "CGC", "amino_acid": "Alanine" },

        { "mRNA": "GAU", "tRNA": "CUA", "amino_acid": "Aspartate" },
        { "mRNA": "GAC", "tRNA": "CUG", "amino_acid": "Aspartate" },

        { "mRNA": "GAA", "tRNA": "CUU", "amino_acid": "Glutamate" },
        { "mRNA": "GAG", "tRNA": "CUC", "amino_acid": "Glutamate" },

        { "mRNA": "GGU", "tRNA": "CCA", "amino_acid": "Glycine" },
        { "mRNA": "GGC", "tRNA": "CCG", "amino_acid": "Glycine" },
        { "mRNA": "GGA", "tRNA": "CCU", "amino_acid": "Glycine" },
        { "mRNA": "GGG", "tRNA": "CCC", "amino_acid": "Glycine" }
    ]
};

let codon = "";

// ─── mRNA sequence state ───────────────────────────────────────────────────
let mRNAData = [];        // 33-slot array [{id, letter}] generated each round
let augSlotIndex = -1;    // 0-based slot index where AUG starts
let currentStep = 0;      // 0 = waiting for AUG; 1 = 2nd codon; etc.
let sequenceStarted = false;
let activeTRNAs = [];     // Array to track cloned tRNA symbols
let activeAminoAcids = []; // Array to track cloned amino acids
let pendingPeptideBondTxs = []; // Bond positions waiting for tRNA detachment
let activePeptideBonds = []; // Array to track cloned peptide bonds
let previousTx = 0;       // Track x-position of the last amino acid for the peptide bond
let onSequenceComplete = null;


const STOP_CODONS = ["UAA", "UAG", "UGA"];
const COMPLEMENT = { A: "U", U: "A", G: "C", C: "G" };
// Frame positions in the SVG: frame 0 = x 57, each frame 129px apart
const FRAME_STEP_PX = 129;

function setupClick() {
    const codonTable = document.getElementById("rna-codon-table");
    if (!codonTable) return;

    codonTable.querySelectorAll(".st37[id]").forEach(el => {
        const parentG = el.parentElement;
        if (!parentG) return;

        // A proper row group has EXACTLY 2 direct children:
        //   1) <rect> or <path>  (the coloured background)
        //   2) <g class="st37"> (this text label)
        // Container groups (e.g. the one CUG_Leucine-2 sits in) have many more children.
        // Attaching to a container fires on every click inside it → duplicate logs.
        if (parentG.children.length === 2) {
            parentG.style.cursor = "pointer";
            parentG.addEventListener("click", function () {
                codon = el.id.substring(0, 3);
                handleCodonSelection(codon);
            });
        } else {
            // Orphaned element (no row wrapper)
            el.style.cursor = "pointer";
            el.addEventListener("click", function () {
                codon = el.id.substring(0, 3);
                handleCodonSelection(codon);
            });
        }
    });
}

// ─── Sequence helper functions ────────────────────────────────────────────

/** Return the letter at a given slot index (wraps circularly). */
function slotLetter(index) {
    return mRNAData.length ? mRNAData[index % 33].letter : "";
}

/** Build the 3-letter codon string starting at a slot index. */
function getCodonAtSlot(startSlot) {
    return slotLetter(startSlot) + slotLetter(startSlot + 1) + slotLetter(startSlot + 2);
}

/** Find the slot index (0-32) where AUG first appears. Returns -1 if not found. */
function findAUGSlot(data) {
    // Only check frame boundaries (multiples of 3) to prevent finding accidental
    // cross-codon AUG formations.
    for (let i = 0; i < data.length; i += 3) {
        if (
            data[i].letter === "A" &&
            data[(i + 1) % 33].letter === "U" &&
            data[(i + 2) % 33].letter === "G"
        ) return i;
    }
    return -1;
}

/** Update the 3 tRNA anticodon letter elements inside #trna-sysmbol.
 *  Layout (left→right): mrna-3 (x≈65) | mrna-1 (x≈105) | mrna-2 (x≈150)
 *  matching mRNA slots:    codon[0]         codon[1]          codon[2]       */
function setAnticodonText(element, mrnaCodon) {
    const codonData = RNADATA.genetic_code.find(c => c.mRNA === mrnaCodon);
    // Use RNADATA if available, fallback to manual complement if missing
    const trnaString = codonData && codonData.tRNA ? codonData.tRNA :
        (COMPLEMENT[mrnaCodon[0]] + COMPLEMENT[mrnaCodon[1]] + COMPLEMENT[mrnaCodon[2]]);

    if (trnaString) {
        const leftSpan = element.querySelector("#mrna-3 tspan") || element.querySelector("#trna-3 tspan");
        const middleSpan = element.querySelector("#mrna-1 tspan") || element.querySelector("#trna-1 tspan");
        const rightSpan = element.querySelector("#mrna-2 tspan") || element.querySelector("#trna-2 tspan");

        if (leftSpan) leftSpan.textContent = trnaString[0];
        if (middleSpan) middleSpan.textContent = trnaString[1];
        if (rightSpan) rightSpan.textContent = trnaString[2];
    }
}

/** Show a feedback popup for `duration` ms then hide it. */
function flashPopup(id, duration) {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = "block";
    setTimeout(function () { el.style.display = "none"; }, duration);
}

/**
 * Called every time the user clicks a codon row in the RNA Codon Table.
 * – Before AUG is found : only "AUG" is accepted.
 * – After AUG            : accepts codons in order along the mRNA strand.
 * – STOP codon reached   : handles sequence completion.
 */
function handleCodonSelection(selectedCodon) {
    if (augSlotIndex === -1) return;   // mRNA not yet generated

    const codonTable = document.getElementById("rna-codon-table");
    const tableCross = document.getElementById("table-cross-img");

    // Determine what we expect at this step
    const expectedSlot = (augSlotIndex + currentStep * 3) % 33;
    const expectedCodon = getCodonAtSlot(expectedSlot);

    if (selectedCodon !== expectedCodon) {
        // ── Wrong selection ──
        flashPopup("wrong-popup", 1500);
        return;
    }

    // ── Correct selection ──
    if (!sequenceStarted) sequenceStarted = true;

    // Check if it's a stop codon (tRNA is null)
    const codonData = RNADATA.genetic_code.find(c => c.mRNA === selectedCodon);
    const isStopCodon = STOP_CODONS.includes(selectedCodon) || (codonData && codonData.tRNA === null);

    const frameIndex = Math.floor((expectedSlot % 33) / 3);
    const tx = frameIndex * FRAME_STEP_PX;
    const template = document.getElementById("trna-sysmbol");

    if (!isStopCodon) {
        // Clone the template tRNA
        if (template) {
            const clone = template.cloneNode(true);
            clone.removeAttribute("id");

            // Set text based on RNADATA
            setAnticodonText(clone, selectedCodon);

            // Remove inner IDs to prevent duplicates
            clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

            clone.style.display = "block";
            // Set transition for the tilt animation later
            clone.style.transition = "transform 0.8s ease, opacity 0.8s ease";
            clone.style.transformOrigin = `${tx + 120}px 450px`;

            // Apply initial position
            clone.setAttribute("transform", `translate(${tx}, 0)`);
            clone.style.transform = `translate(${tx}px, 0px)`;

            const codonTableEl = document.getElementById("rna-codon-table");
            if (codonTableEl) {
                template.parentNode.insertBefore(clone, codonTableEl);
            } else {
                template.parentNode.appendChild(clone);
            }
            activeTRNAs.push({ element: clone, tx: tx });
        }
    }

    // ─── AMINO ACID CLONING ───
    if (codonData && codonData.amino_acid && template) {
        let aaName = codonData.amino_acid;

        const aaTemplate = document.getElementById(aaName);
        if (aaTemplate) {
            const aaClone = aaTemplate.cloneNode(true);
            aaClone.removeAttribute("id");
            aaClone.style.display = "block";
            aaClone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

            // Position the amino acid
            aaClone.setAttribute("transform", `translate(${tx}, 0)`);
            aaClone.style.transform = `translate(${tx}px, 0px)`;

            const codonTableEl = document.getElementById("rna-codon-table");
            if (codonTableEl) {
                template.parentNode.insertBefore(aaClone, codonTableEl);
            } else {
                template.parentNode.appendChild(aaClone);
            }
            activeAminoAcids.push(aaClone);

            if (!isStopCodon && activeAminoAcids.length > 1) {
                pendingPeptideBondTxs.push(previousTx);
            }
            if (!isStopCodon) {
                previousTx = tx;
            }
        }
    }

    // If a 3rd tRNA attaches, attach the next peptide bond and detach the 1st tRNA
    if (activeTRNAs.length > 2) {
        if (pendingPeptideBondTxs.length > 0) {
            const bondTx = pendingPeptideBondTxs.shift();
            const pbTemplate = document.getElementById("peptide-bond");
            if (pbTemplate) {
                const pbClone = pbTemplate.cloneNode(true);
                pbClone.removeAttribute("id");
                pbClone.style.display = "block";
                pbClone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

                pbClone.setAttribute("transform", `translate(${bondTx}, 0)`);
                pbClone.style.transform = `translate(${bondTx}px, 0px)`;

                const firstAA = activeAminoAcids[0];
                if (firstAA && firstAA.parentNode) {
                    firstAA.parentNode.insertBefore(pbClone, firstAA);
                }
                activePeptideBonds.push(pbClone);
            }
        }

        const oldest = activeTRNAs.shift();
        // Detach by tilting and moving up/left, fading out
        oldest.element.style.transform = `translate(${oldest.tx - 60}px, -120px) rotate(-35deg)`;
        oldest.element.style.opacity = "0";

        setTimeout(() => {
            if (oldest.element.parentNode) {
                oldest.element.parentNode.removeChild(oldest.element);
            }
        }, 800);
    }

    // Close the codon table
    if (codonTable) codonTable.style.display = "none";
    if (tableCross) tableCross.style.display = "none";

    // Show correct popup
    flashPopup("correct-popup", 1500);

    // Advance to next codon
    currentStep++;

    // If we just processed a stop codon, attach any remaining peptide bonds and clear out remaining tRNAs
    if (isStopCodon) {
        while (pendingPeptideBondTxs.length > 0) {
            const bondTx = pendingPeptideBondTxs.shift();
            const pbTemplate = document.getElementById("peptide-bond");
            if (!pbTemplate) break;

            const pbClone = pbTemplate.cloneNode(true);
            pbClone.removeAttribute("id");
            pbClone.style.display = "block";
            pbClone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

            pbClone.setAttribute("transform", `translate(${bondTx}, 0)`);
            pbClone.style.transform = `translate(${bondTx}px, 0px)`;

            const firstAA = activeAminoAcids[0];
            if (firstAA && firstAA.parentNode) {
                firstAA.parentNode.insertBefore(pbClone, firstAA);
            }
            activePeptideBonds.push(pbClone);
        }

        activeTRNAs.forEach(trna => {
            trna.element.style.transform = `translate(${trna.tx - 60}px, -120px) rotate(-35deg)`;
            trna.element.style.opacity = "0";
            setTimeout(() => {
                if (trna.element.parentNode) {
                    trna.element.parentNode.removeChild(trna.element);
                }
            }, 800);
        });
        activeTRNAs = [];
        if (typeof onSequenceComplete === "function") {
            onSequenceComplete();
        }
    }
}

function playConfettiLottie() {
  const container = document.getElementById('lottie-confetti');

  if (!container) {
    console.warn(`Container lottie-confetti not found`);
    return;
  }

  const animationPath = `./assets/animation/confetti.json`;

  // Clear previous animation
  container.innerHTML = '';
  container.style.display = 'block';

  const anim = lottie.loadAnimation({
    container: container,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: animationPath,
    rendererSettings: {
      hideOnTransparent: false,
      preserveAspectRatio: 'xMidYMid meet'
    }
  });

  // Ensure totalFrames is available
  anim.addEventListener('DOMLoaded', () => {
    anim.addEventListener('complete', () => {
      anim.goToAndStop(anim.totalFrames - 1, true);
    });
  });
}


function generateCircularMRNALetters() {
    const totalSlots = 33;
    const groupSize = 3;
    const totalGroups = 11;

    const slots = Array.from({ length: totalSlots }, (_, i) => ({
        id: `l-${i + 1}`,
        letter: ""
    }));

    const codons = [
        "UUU", "UUC", "UUA", "UUG", "CUU", "CUC", "CUA", "CUG",
        "AUU", "AUC", "AUA", "GUU", "GUC", "GUA", "GUG",
        "UCU", "UCC", "UCA", "UCG", "CCU", "CCC", "CCA", "CCG",
        "ACU", "ACC", "ACA", "ACG", "GCU", "GCC", "GCA", "GCG",
        "UAU", "UAC", "CAU", "CAC", "CAA", "CAG",
        "AAU", "AAC", "AAA", "AAG", "GAU", "GAC", "GAA", "GAG",
        "UGU", "UGC", "UGG",
        "CGU", "CGC", "CGA", "CGG", "AGU", "AGC", "AGA", "AGG",
        "GGU", "GGC", "GGA", "GGG"
    ];

    const stopCodons = ["UAA", "UAG", "UGA"];

    // pick 11 codons
    let selectedCodons = [];
    for (let i = 0; i < totalGroups; i++) {
        selectedCodons.push(
            codons[Math.floor(Math.random() * codons.length)]
        );
    }

    // ensure AUG at codon positions 1 through 9 (0-based index 0–8)
    const augIndex = Math.floor(Math.random() * 9);
    selectedCodons[augIndex] = "AUG";

    // ensure STOP to the right of AUG with at least one codon gap
    const stopMinIndex = augIndex + 2;
    const stopIndex = Math.floor(Math.random() * (totalGroups - stopMinIndex)) + stopMinIndex;
    selectedCodons[stopIndex] =
        stopCodons[Math.floor(Math.random() * stopCodons.length)];

    // fixed start so codon positions 1..11 remain stable in the circular display
    let pointer = 0;

    // assign letters
    selectedCodons.forEach(codon => {
        codon.split("").forEach(letter => {
            slots[pointer].letter = letter;
            pointer = (pointer + 1) % totalSlots;
        });
    });

    return slots;
}

function updateSVGLetters(data) {
    data.forEach(item => {
        const g = document.getElementById(item.id);
        if (!g) return;

        const tspan = g.querySelector("tspan");
        if (tspan) {
            tspan.textContent = item.letter;
        }
    });
}



document.addEventListener('DOMContentLoaded', function () {

    const codonTableBtn = document.getElementById("rna-codon-table-button");
    const codonTable = document.getElementById("rna-codon-table");
    const newMRNABtn = document.getElementById("new-mrna-btn");

    const codonHiddenBtn = document.getElementById("codon-frame-hidden");
    const codonVisibleBtn = document.getElementById("codon-frame-visible");
    const groupHighligh = document.querySelectorAll(".group-highlight");
    let answerVisible = false;
    let savedActivityState = null;
    let completionMode = false;

    const insightImg = document.getElementById("insight-img");
    const crossImg = document.getElementById("cross-img");
    const insightBtn = document.getElementById("insight-button");

    const tableCrossBtn = document.getElementById("table-cross-img");
    const codonTableDragHandle = document.getElementById("rna-codon-table-drag-handle");

    function setupCodonTableDrag() {
        if (!codonTable || !codonTableDragHandle) return;

        const svg = codonTable.ownerSVGElement;
        let isDragging = false;
        let dragStart = null;
        let startTranslate = { x: 0, y: 0 };
        let tableTranslate = { x: 0, y: 0 };

        function getEventPoint(event) {
            return event.touches ? event.touches[0] : event;
        }

        function clientPointToSvgPoint(event) {
            const point = svg.createSVGPoint();
            const eventPoint = getEventPoint(event);
            point.x = eventPoint.clientX;
            point.y = eventPoint.clientY;
            return point.matrixTransform(svg.getScreenCTM().inverse());
        }

        function moveCodonTable() {
            const transform = `translate(${tableTranslate.x}, ${tableTranslate.y})`;
            codonTable.setAttribute("transform", transform);
            if (tableCrossBtn) tableCrossBtn.setAttribute("transform", transform);
        }

        function startDrag(event) {
            isDragging = true;
            dragStart = clientPointToSvgPoint(event);
            startTranslate = { x: tableTranslate.x, y: tableTranslate.y };
            codonTableDragHandle.style.cursor = "grabbing";
            event.preventDefault();
            event.stopPropagation();
        }

        function moveDrag(event) {
            if (!isDragging) return;

            const currentPoint = clientPointToSvgPoint(event);
            tableTranslate.x = startTranslate.x + currentPoint.x - dragStart.x;
            tableTranslate.y = startTranslate.y + currentPoint.y - dragStart.y;
            moveCodonTable();
            event.preventDefault();
        }

        function endDrag() {
            isDragging = false;
            codonTableDragHandle.style.cursor = "grab";
        }

        codonTableDragHandle.addEventListener("mousedown", startDrag);
        codonTableDragHandle.addEventListener("touchstart", startDrag, { passive: false });
        window.addEventListener("mousemove", moveDrag);
        window.addEventListener("touchmove", moveDrag, { passive: false });
        window.addEventListener("mouseup", endDrag);
        window.addEventListener("touchend", endDrag);
    }

    tableCrossBtn.addEventListener("click", function () {
        codonTable.style.display = "none";
        tableCrossBtn.style.display = "none";
    });

    insightBtn.addEventListener("click", function () {
        insightImg.style.display = "block";
        crossImg.style.display = "block";
    });

    crossImg.addEventListener("click", function () {
        insightImg.style.display = "none";
        crossImg.style.display = "none";
    });

    function showGroupHighlightsFromAUG() {
        const augFrame = augSlotIndex >= 0 ? Math.floor((augSlotIndex % 33) / 3) : -1;
        const highlightedFrames = new Set();

        if (augFrame >= 0) {
            for (let step = 0; step < groupHighligh.length; step++) {
                const slot = (augSlotIndex + step * 3) % 33;
                const codon = getCodonAtSlot(slot);
                highlightedFrames.add(Math.floor((slot % 33) / 3));

                if (STOP_CODONS.includes(codon)) break;
            }
        }

        groupHighligh.forEach(function (item, index) {
            item.style.display = highlightedFrames.has(index) ? "block" : "none";
        });
    }

    codonHiddenBtn.addEventListener("click", function () {
        codonHiddenBtn.style.display = "none";
        codonVisibleBtn.style.display = "block";
        showGroupHighlightsFromAUG();
    });

    codonVisibleBtn.addEventListener("click", function () {
        codonHiddenBtn.style.display = "block";
        codonVisibleBtn.style.display = "none";
        groupHighligh.forEach(function (item) {
            item.style.display = "none";
        });
    });

    function toggleCodonTable() {
        if (codonTable.style.display === "none") {
            codonTable.style.display = "block";
            tableCrossBtn.style.display = 'block';
        } else {
            codonTable.style.display = "none";
            tableCrossBtn.style.display = 'none';
        }
    }
    // Event listener for the codon table button
    codonTableBtn.addEventListener("click", toggleCodonTable);
    setupCodonTableDrag();

    setupClick();

    function clearActiveElements() {
        activeTRNAs.forEach(trna => {
            if (trna.element.parentNode) trna.element.parentNode.removeChild(trna.element);
        });
        activeAminoAcids.forEach(aa => {
            if (aa.parentNode) aa.parentNode.removeChild(aa);
        });
        activePeptideBonds.forEach(pb => {
            if (pb.parentNode) pb.parentNode.removeChild(pb);
        });
        activeTRNAs = [];
        activeAminoAcids = [];
        activePeptideBonds = [];
        pendingPeptideBondTxs = [];
    }

    function getActivityElements(state) {
        return state.activeTRNAs.map(trna => trna.element)
            .concat(state.activeAminoAcids, state.activePeptideBonds);
    }

    function saveAndHideActivityState() {
        savedActivityState = {
            activeTRNAs: activeTRNAs.slice(),
            activeAminoAcids: activeAminoAcids.slice(),
            activePeptideBonds: activePeptideBonds.slice(),
            pendingPeptideBondTxs: pendingPeptideBondTxs.slice(),
            currentStep: currentStep,
            previousTx: previousTx,
            sequenceStarted: sequenceStarted,
            displayStyles: []
        };

        getActivityElements(savedActivityState).forEach(element => {
            savedActivityState.displayStyles.push({
                element: element,
                display: element.style.display
            });
            element.style.display = "none";
        });

        activeTRNAs = [];
        activeAminoAcids = [];
        activePeptideBonds = [];
        pendingPeptideBondTxs = [];
    }

    function restoreSavedActivityState() {
        if (!savedActivityState) return;

        savedActivityState.displayStyles.forEach(item => {
            item.element.style.display = item.display;
        });

        activeTRNAs = savedActivityState.activeTRNAs;
        activeAminoAcids = savedActivityState.activeAminoAcids;
        activePeptideBonds = savedActivityState.activePeptideBonds;
        pendingPeptideBondTxs = savedActivityState.pendingPeptideBondTxs;
        currentStep = savedActivityState.currentStep;
        previousTx = savedActivityState.previousTx;
        sequenceStarted = savedActivityState.sequenceStarted;
        savedActivityState = null;
    }

    function clearSavedActivityState() {
        if (!savedActivityState) return;

        getActivityElements(savedActivityState).forEach(element => {
            if (element.parentNode) element.parentNode.removeChild(element);
        });
        savedActivityState = null;
    }

    function setShowAnswerButtonLabel(text) {
        const label = document.querySelector("#Show_Answer tspan");
        if (label) label.textContent = text;
    }

    const completionHiddenSelectors = [
        "#show-answer-btn",
        "#reset-btn",
        "#rna-codon-table-button",
        "#codon-frame-hidden",
        "#codon-frame-visible",
        "#rna-codon-table",
        "#table-cross-img",
        "#insight-button",
        "#insight-img",
        "#cross-img",
        "#wrong-popup",
        "#correct-popup",
        "#mrna-bar",
        "#mrna-bar-text",
        "#i-text-02",
        "#i-text-intro",
        ".group-highlight"
    ];
    const completionHiddenElements = Array.from(
        document.querySelectorAll(completionHiddenSelectors.join(","))
    );
    const initialCompletionDisplay = new Map(
        completionHiddenElements.map(element => [element, element.style.display])
    );

    function getTranslateX(element) {
        const transform = element.getAttribute("transform") || "";
        const match = transform.match(/translate\(\s*(-?\d+(?:\.\d+)?)/);
        return match ? Number(match[1]) : 0;
    }

    function centerCompletionAnswer() {
        const answerElements = activeAminoAcids.concat(activePeptideBonds);
        if (!answerElements.length) return;

        let minX = Infinity;
        let maxX = -Infinity;
        let minY = Infinity;

        answerElements.forEach(element => {
            const box = element.getBBox();
            const tx = getTranslateX(element);
            minX = Math.min(minX, box.x + tx);
            maxX = Math.max(maxX, box.x + box.width + tx);
            minY = Math.min(minY, box.y);
        });

        const svg = answerElements[0].ownerSVGElement;
        if (!svg || !Number.isFinite(minX) || !Number.isFinite(maxX)) return;

        const viewBox = svg.viewBox.baseVal;
        const centerOffset = (viewBox.x + viewBox.width / 2) - ((minX + maxX) / 2);
        const verticalOffset = 390 - minY;

        answerElements.forEach(element => {
            const tx = getTranslateX(element) + centerOffset;
            const transform = `translate(${tx}, ${verticalOffset})`;
            element.setAttribute("transform", transform);
            element.style.transform = `translate(${tx}px, ${verticalOffset}px)`;
        });
    }

    function setCompletionControlsVisible(isComplete) {
        completionHiddenElements.forEach(element => {
            element.style.display = isComplete ? "none" : initialCompletionDisplay.get(element);
        });

        const congratsImg = document.getElementById("congratulation-img");
        if (congratsImg) congratsImg.style.display = isComplete ? "block" : "none";

        const congratsConfetti = document.getElementById("congratulation-confetti");
        if (congratsConfetti) congratsConfetti.style.display = isComplete ? "block" : "none";

        if (!newMRNABtn) return;
        newMRNABtn.style.display = "block";

        if (isComplete) {
            const svg = newMRNABtn.ownerSVGElement;
            if (svg) {
                const viewBox = svg.viewBox.baseVal;
                const box = newMRNABtn.getBBox();
                const centerOffset = (viewBox.x + viewBox.width / 2) - (box.x + box.width / 2);
                newMRNABtn.setAttribute("transform", `translate(${centerOffset}, 0)`);
            }
        } else {
            newMRNABtn.removeAttribute("transform");
        }
    }

    function enterCompletionMode() {
        if (!answerVisible) showAnswer();
        centerCompletionAnswer();
        completionMode = true;
        setShowAnswerButtonLabel("Show Answer");
        setCompletionControlsVisible(true);
        playConfettiLottie();
    }

    function exitCompletionMode() {
        if (!completionMode) return;
        completionMode = false;
        setCompletionControlsVisible(false);
    }

    function resetWidget() {
        exitCompletionMode();
        clearActiveElements();
        clearSavedActivityState();
        currentStep = 0;
        previousTx = 0;
        sequenceStarted = false;
        answerVisible = false;
        setShowAnswerButtonLabel("Show Answer");

        // const data = generateCircularMRNALetters();
        // updateSVGLetters(data);
        // mRNAData = data;
        // augSlotIndex = findAUGSlot(data);

        if (codonTable) codonTable.style.display = "none";
        if (tableCrossBtn) tableCrossBtn.style.display = "none";

        codonHiddenBtn.style.display = "block";
        codonVisibleBtn.style.display = "none";
        groupHighligh.forEach(function (item) {
            item.style.display = "none";
        });

        // Hide popups
        const wrongPopup = document.getElementById("wrong-popup");
        if (wrongPopup) wrongPopup.style.display = "none";
        const correctPopup = document.getElementById("correct-popup");
        if (correctPopup) correctPopup.style.display = "none";
    }

    function newMRN() {
        exitCompletionMode();
        clearActiveElements();
        clearSavedActivityState();
        currentStep = 0;
        previousTx = 0;
        sequenceStarted = false;
        answerVisible = false;
        setShowAnswerButtonLabel("Show Answer");

        const data = generateCircularMRNALetters();
        updateSVGLetters(data);
        mRNAData = data;
        augSlotIndex = findAUGSlot(data);

        if (codonTable) codonTable.style.display = "none";
        if (tableCrossBtn) tableCrossBtn.style.display = "none";

        codonHiddenBtn.style.display = "block";
        codonVisibleBtn.style.display = "none";
        groupHighligh.forEach(function (item) {
            item.style.display = "none";
        });

        // Hide popups
        const wrongPopup = document.getElementById("wrong-popup");
        if (wrongPopup) wrongPopup.style.display = "none";
        const correctPopup = document.getElementById("correct-popup");
        if (correctPopup) correctPopup.style.display = "none";
    }

    function showAnswer() {
        if (completionMode) return;

        if (answerVisible) {
            clearActiveElements();
            restoreSavedActivityState();
            answerVisible = false;
            setShowAnswerButtonLabel("Show Answer");
            return;
        }

        saveAndHideActivityState();
        currentStep = 0;
        previousTx = 0;

        const template = document.getElementById("trna-sysmbol");
        const codonTableEl = document.getElementById("rna-codon-table");

        while (currentStep < 11) {
            const expectedSlot = (augSlotIndex + currentStep * 3) % 33;
            const expectedCodon = getCodonAtSlot(expectedSlot);
            const codonData = RNADATA.genetic_code.find(c => c.mRNA === expectedCodon);
            const isStopCodon = STOP_CODONS.includes(expectedCodon) || (codonData && codonData.tRNA === null);

            if (isStopCodon) break;

            const frameIndex = Math.floor((expectedSlot % 33) / 3);
            const tx = frameIndex * FRAME_STEP_PX;

            if (codonData && codonData.amino_acid && template) {
                let aaName = codonData.amino_acid;
                const aaTemplate = document.getElementById(aaName);

                if (aaTemplate) {
                    const aaClone = aaTemplate.cloneNode(true);
                    aaClone.removeAttribute("id");
                    aaClone.style.display = "block";
                    aaClone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

                    aaClone.setAttribute("transform", `translate(${tx}, 0)`);
                    aaClone.style.transform = `translate(${tx}px, 0px)`;

                    if (codonTableEl) {
                        template.parentNode.insertBefore(aaClone, codonTableEl);
                    } else {
                        template.parentNode.appendChild(aaClone);
                    }
                    activeAminoAcids.push(aaClone);

                    if (activeAminoAcids.length > 1) {
                        const pbTemplate = document.getElementById("peptide-bond");
                        if (pbTemplate) {
                            const pbClone = pbTemplate.cloneNode(true);
                            pbClone.removeAttribute("id");
                            pbClone.style.display = "block";
                            pbClone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));

                            pbClone.setAttribute("transform", `translate(${previousTx}, 0)`);
                            pbClone.style.transform = `translate(${previousTx}px, 0px)`;

                            template.parentNode.insertBefore(pbClone, activeAminoAcids[0]);
                            activePeptideBonds.push(pbClone);
                        }
                    }
                    previousTx = tx;
                }
            }
            currentStep++;
        }
        sequenceStarted = true;
        answerVisible = true;
        setShowAnswerButtonLabel("Hide Answer");
    }

    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) resetBtn.addEventListener("click", resetWidget);

    const showAnswerBtn = document.getElementById("show-answer-btn");
    if (showAnswerBtn) showAnswerBtn.addEventListener("click", showAnswer);

    if (newMRNABtn) newMRNABtn.addEventListener("click", newMRN);

    onSequenceComplete = enterCompletionMode;

    // Initial setup
   // resetWidget();
    newMRN();
});
