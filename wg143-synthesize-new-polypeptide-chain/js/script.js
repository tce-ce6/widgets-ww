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
            // Row-level parent: make the entire row (rect + text) clickable
            parentG.style.cursor = "pointer";
            parentG.addEventListener("click", function () {
                codon = el.id.substring(0, 3);
                console.log("mRNA Codon selected:", codon);
            });
        } else {
            // Orphaned element (e.g. CUG_Leucine-2 with no row wrapper):
            // attach directly to the text group so only clicking the label fires
            el.style.cursor = "pointer";
            el.addEventListener("click", function () {
                codon = el.id.substring(0, 3);
                console.log("mRNA Codon selected:", codon);
            });
        }
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

    // ensure AUG
    const augIndex = Math.floor(Math.random() * totalGroups);
    selectedCodons[augIndex] = "AUG";

    // ensure STOP
    let stopIndex;
    do {
        stopIndex = Math.floor(Math.random() * totalGroups);
    } while (stopIndex === augIndex);

    selectedCodons[stopIndex] =
        stopCodons[Math.floor(Math.random() * stopCodons.length)];

    // random start
    let pointer = Math.floor(Math.random() * totalSlots);

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

    const codonHiddenBtn = document.getElementById("codon-frame-hidden");
    const codonVisibleBtn = document.getElementById("codon-frame-visible");
    const groupHighligh = document.querySelectorAll(".group-highlight");

    codonHiddenBtn.addEventListener("click", function () {
        codonHiddenBtn.style.display = "none";
        codonVisibleBtn.style.display = "block";
        groupHighligh.forEach(function (item) {
            item.style.display = "block";
        });
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
        } else {
            codonTable.style.display = "none";
        }
    }
    // Event listener for the codon table button
    codonTableBtn.addEventListener("click", toggleCodonTable);

    setupClick();

    const data = generateCircularMRNALetters();
    updateSVGLetters(data);
});