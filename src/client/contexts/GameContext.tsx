import { createContext } from 'react';

interface IGameContext {
  numDigits: number;
  setNumDigits: (num: number) => void;
  minValue: number;
  setMinValue: (min: number) => void;
  maxValue: number;
  setMaxValue: (max: number) => void;
  answer: number[];
  setAnswer: (answer: number[]) => void;
  timerSetting: number;
  setTimerSetting: (timer: number) => void;
  maxGuesses: number;
  setMaxGuesses: (maxGuesses: number) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  shouldShowTimer: boolean;
  setShouldShowTimer: (shouldShowTimer: boolean) => void;
  time: number;
  setTime: (value: number | ((prevTime: number) => number)) => void;
}

const defaultContext: IGameContext = {
  numDigits: 4,
  setNumDigits: () => {},
  minValue: 0,
  setMinValue: () => {},
  maxValue: 7,
  setMaxValue: () => {},
  answer: [],
  setAnswer: () => {},
  timerSetting: 60000 * 5,
  setTimerSetting: () => {},
  maxGuesses: 10,
  setMaxGuesses: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  shouldShowTimer: false,
  setShouldShowTimer: () => {},
  time: 5 * 60 * 1000,
  setTime: () => {},
};

const GameContext = createContext<IGameContext>(defaultContext);

export default GameContext;
