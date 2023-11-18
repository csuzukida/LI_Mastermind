import { createContext } from 'react';

interface IGameContext {
  numDigits: number;
  setNumDigits: (num: number) => void;
  answer: number[];
  setAnswer: (answer: number[]) => void;
  timer: number;
  setTimer: (timer: number) => void;
  maxGuesses: number;
  setMaxGuesses: (maxGuesses: number) => void;
}

const defaultContext: IGameContext = {
  numDigits: 4,
  setNumDigits: () => {},
  answer: [],
  setAnswer: () => {},
  timer: 60000 * 5,
  setTimer: () => {},
  maxGuesses: 10,
  setMaxGuesses: () => {},
};

const GameContext = createContext<IGameContext>(defaultContext);

export default GameContext;
