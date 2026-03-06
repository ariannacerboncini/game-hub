import { useState, useMemo, useCallback } from 'react';
import type { ConnectionGroup, ConnectionPuzzle, TileState } from '../types/connections';

export const useConnections = (puzzle: ConnectionPuzzle) => {
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [solvedGroupIds, setSolvedGroupIds] = useState<string[]>([]);
    const [attempts, setAttempts] = useState(4);

    const wordToGroup = useMemo(() => {
        const m = new Map<string, ConnectionGroup>();
        for (const g of puzzle.groups) {
            for (const w of g.words) {
                m.set(w, g);
            }
        }
        return m;
    }, [puzzle]);

    const solvedGroupIdsSet = useMemo(() => new Set(solvedGroupIds), [solvedGroupIds]);

    const allTiles = useMemo(() => {
        return puzzle.groups.flatMap(group =>
            group.words.map(word => ({
                word,
                groupId: group.id,
                isSelected: selectedWords.includes(word),
                isLocked: solvedGroupIdsSet.has(group.id),
            } as TileState))
        )
    }, [puzzle, selectedWords, solvedGroupIdsSet]);

    const toggleWord = useCallback((word: string) => {
        setSelectedWords(prev => {
            const exists = prev.includes(word);
            if (exists) {
                return prev.filter(w => w !== word);
            } else {
                if (prev.length >= 4) return prev;
                const group = wordToGroup.get(word);
                if (group && solvedGroupIdsSet.has(group.id)) return prev;
                return [...prev, word];
            }
        });
    }, [wordToGroup, solvedGroupIdsSet]);

    const submitSelection = useCallback((): boolean => {
        if (selectedWords.length !== 4) return false;

        const first = selectedWords[0];
        const targetGroup = wordToGroup.get(first);
        if (!targetGroup) {
            setAttempts(a => Math.max(0, a - 1));
            setSelectedWords([]);
            return false;
        }
        const allSame = selectedWords.every(w => {
            const g = wordToGroup.get(w);
            return g?.id === targetGroup?.id;
        });

        if (allSame) {
            setSolvedGroupIds(prev => (prev.includes(targetGroup.id) ? prev : [...prev, targetGroup.id]));
            setSelectedWords([]);
            return true;
        } else {
            setAttempts(a => Math.max(0, a - 1));
            return false;
        }

    }, [selectedWords, wordToGroup]);

    const resetSelection = useCallback(() => setSelectedWords([]), []);

    return {
    selectedWords,
    setSelectedWords, // se vuoi manipolarlo direttamente (opzionale)
    solvedGroupIds,   // id dei gruppi risolti
    attempts,
    allTiles,
    toggleWord,
    submitSelection,
    resetSelection,
  };
}