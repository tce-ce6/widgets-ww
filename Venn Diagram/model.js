class VennModel {
    constructor() {
        // Define the questions with their corresponding answers and hints
        this.questions = [
            {
                id: 1,
                text: "Select the parts of the Venn diagram that make up the set: A",
                correctRegions: ['leftOnly', 'intersection'],
                hint: "A is the entire left circle, including the intersection with B"
            },
            {
                id: 2,
                text: "Select the parts of the Venn diagram that make up the set: B",
                correctRegions: ['rightOnly', 'intersection'],
                hint: "B is the entire right circle, including the intersection with A"
            },
            {
                id: 3,
                text: "Select the parts of the Venn diagram that make up the set: A - B",
                correctRegions: ['leftOnly'],
                hint: "A - B is the difference of A and B: elements in A but not in B"
            },
            {
                id: 4,
                text: "Select the parts of the Venn diagram that make up the set: A'",
                correctRegions: ['rightOnly', 'outside'],
                hint: "A' (complement of A) is everything in the universal set that is not in A"
            },
            {
                id: 5,
                text: "Select the parts of the Venn diagram that make up the set: A ∪ B",
                correctRegions: ['leftOnly', 'rightOnly', 'intersection'],
                hint: "A ∪ B (union) includes all elements in either A or B or both"
            },
            {
                id: 6,
                text: "Select the parts of the Venn diagram that make up the set: B'",
                correctRegions: ['leftOnly', 'outside'],
                hint: "B' (complement of B) is everything in the universal set that is not in B"
            },
            {
                id: 7,
                text: "Select the parts of the Venn diagram that make up the set: B - A",
                correctRegions: ['rightOnly'],
                hint: "B - A is the difference of B and A: elements in B but not in A"
            },
            {
                id: 8,
                text: "Select the parts of the Venn diagram that make up the set: A ∩ B",
                correctRegions: ['intersection'],
                hint: "A ∩ B (intersection) includes only elements that are in both A and B"
            }
        ];

        // State variables
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedRegions = [];
        this.checkAttempts = 0;
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestionIndex];
    }

    selectRegion(region) {
        const index = this.selectedRegions.indexOf(region);
        if (index === -1) {
            // Region not selected, add it
            this.selectedRegions.push(region);
        } else {
            // Region already selected, remove it
            this.selectedRegions.splice(index, 1);
        }
        return this.selectedRegions;
    }

    checkAnswer() {
        const currentQuestion = this.getCurrentQuestion();
        
        // Sort both arrays to ensure order doesn't matter
        const sortedSelected = [...this.selectedRegions].sort();
        const sortedCorrect = [...currentQuestion.correctRegions].sort();
        
        // Check if arrays are the same length and have the same elements
        const isCorrect = 
            sortedSelected.length === sortedCorrect.length && 
            sortedSelected.every((region, i) => region === sortedCorrect[i]);
        
        this.checkAttempts++;
        
        if (isCorrect) {
            this.score++;
            return {
                isCorrect: true,
                message: 'Correct!',
                correctRegions: currentQuestion.correctRegions
            };
        } else {
            return {
                isCorrect: false,
                message: 'Incorrect. Try again.',
                correctRegions: this.checkAttempts >= 2 ? currentQuestion.correctRegions : null
            };
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.selectedRegions = [];
            this.checkAttempts = 0;
            return true;
        }
        return false;
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.selectedRegions = [];
            this.checkAttempts = 0;
            return true;
        }
        return false;
    }

    resetCurrent() {
        this.selectedRegions = [];
        this.checkAttempts = 0;
    }

    getScore() {
        return {
            current: this.score,
            total: this.questions.length
        };
    }
}
