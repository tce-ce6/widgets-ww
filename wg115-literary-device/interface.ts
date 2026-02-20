export interface Root {
    id: string
    title: string
    order: number
    description: string
    example: Example
    player: Player
}

export interface Example {
    sentence: Sentence[]
    mapping: {
        [key: string]: Mapping
    }
}

export interface Sentence {
    words: string
    type?: string | null
}


export interface Mapping {
    title: string
    background: string
}

export interface Player {
    combinations: Combination[][]
    correctAnswers: Answer[]
}

export interface Combination {
    id: number
    title: string
}

export interface Answer {
    answer: string
    explanation?: string
    title?: string
}
