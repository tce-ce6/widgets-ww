class VennModel {
    constructor() {
        this.questions = [
            {
                question: "Select the part of Venn diagram that represents set A",
                correctSet: "A",
                correctRegions: ["region-A", "intersection"],
                hint: "Click on the entire left circle A (including its intersection with B)"
            },
            {
                question: "Select the part of Venn diagram that represents set B",
                correctSet: "B",
                correctRegions: ["region-B", "intersection"],
                hint: "Click on the entire right circle B (including its intersection with A)"
            },
            {
                question: "Select the part of Venn diagram that represents set A - B",
                correctSet: "A - B",
                correctRegions: ["region-A"],
                hint: "Click only the part of circle A that does not overlap with B"
            },
            {
                question: "Select the part of Venn diagram that represents set A'",
                correctSet: "A'",
                correctRegions: ["universal-set", "region-B"],
                excludeRegions: ["region-A", "intersection"],
                hint: "Click on everything outside circle A (the universal set and the non-overlapping part of B)"
            },
            {
                question: "Select the part of Venn diagram that represents set A ∪ B",
                correctSet: "A ∪ B",
                correctRegions: ["region-A", "region-B", "intersection"],
                hint: "Click all parts of both circles A and B"
            },
            {
                question: "Select the part of Venn diagram that represents set B'",
                correctSet: "B'",
                correctRegions: ["universal-set", "region-A"],
                excludeRegions: ["region-B", "intersection"],
                hint: "Click on everything outside circle B (the universal set and the non-overlapping part of A)"
            },
            {
                question: "Select the part of Venn diagram that represents set B - A",
                correctSet: "B - A",
                correctRegions: ["region-B"],
                hint: "Click only the part of circle B that does not overlap with A"
            },
            {
                question: "Select the part of Venn diagram that represents set A ∩ B",
                correctSet: "A ∩ B",
                correctRegions: ["intersection"],
                hint: "Click only the overlapping region between circles A and B"
             },
            // {
            //     question: "Select the part of Venn diagram that represents (A ∪ B)'",
            //     correctSet: "(A ∪ B)'",
            //     correctRegions: ["universal-set"],
            //     excludeRegions: ["region-A", "region-B", "intersection"],
            //     hint: "Click only the part of universal set that is outside both circles"
            // },
            // {
            //     question: "Select the part of Venn diagram that represents (A ∩ B)'",
            //     correctSet: "(A ∩ B)'",
            //     correctRegions: ["universal-set", "region-A", "region-B"],
            //     excludeRegions: ["intersection"],
            //     hint: "Click everything except the intersection of A and B"
            // }
        ];
        
        this.currentQuestion = 0;
        this.selectedRegions = new Set();
        this.attempts = 0;
        this.correctAnswers = 0;
        this.MAX_ATTEMPTS = 3;
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestion];
    }

    selectRegion(region) {
        if (this.selectedRegions.has(region)) {
            this.selectedRegions.delete(region);
            return false;
        } else {
            this.selectedRegions.add(region);
            return true;
        }
    }

    selectUniversalSet() {
        if (this.selectedRegions.has("universal-set")) {
            this.selectedRegions.delete("universal-set");
            return false;
        } else {
            this.selectedRegions.add("universal-set");
            return true;
        }
    }

    checkAnswer() {
        const currentQ = this.questions[this.currentQuestion];
        this.attempts++;
        
        // Check if all required regions are selected
        const hasAllRequired = currentQ.correctRegions.every(region => 
            this.selectedRegions.has(region));
        
        // Check if no excluded regions are selected
        const hasNoExcluded = !currentQ.excludeRegions || 
            currentQ.excludeRegions.every(region => 
                !this.selectedRegions.has(region));
        
        // Check if no extra regions are selected
        const hasNoExtra = Array.from(this.selectedRegions).every(region => 
            currentQ.correctRegions.includes(region));
        
        return hasAllRequired && hasNoExcluded && hasNoExtra;
    }

    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion >= this.questions.length) {
            this.currentQuestion = 0;
            this.correctAnswers = 0;
        }
        this.resetQuestion();
    }

    resetQuestion() {
        this.selectedRegions.clear();
        this.attempts = 0;
    }

    incrementCorrectAnswers() {
        this.correctAnswers++;
    }

    getProgress() {
        return {
            current: this.correctAnswers,
            total: this.questions.length
        };
    }

    isMaxAttemptsReached() {
        return this.attempts >= this.MAX_ATTEMPTS;
    }

    getAttempts() {
        return this.attempts;
    }
}

// Export the model for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VennModel;
} 