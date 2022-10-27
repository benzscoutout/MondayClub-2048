import { createGlobalState } from 'react-hooks-global-state';

export const { useGlobalState } = createGlobalState({
    score: 0, isEndGame: false, isWinner: false, name: '', mode: 'normal', timerEnd: false
});