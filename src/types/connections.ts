export type Difficulty = 'facile' | 'media' | 'difficile' | 'pro';

export interface ConnectionGroup {
    id: string;
    description: string;
    words: string[];
    difficulty: Difficulty;
}

export interface ConnectionPuzzle {
    id: string;
    date: string;
    groups: ConnectionGroup[];
}

export interface TileState {
    word: string;
    groupId: string;
    isSelected: boolean;
    isLocked: boolean; // se già indovinato
}