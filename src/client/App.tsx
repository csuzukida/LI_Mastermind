import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { GameContext } from './contexts';
import {
  CreateAccount,
  Home,
  Game,
  GameOver,
  Instructions,
  Settings,
  Signin,
  ErrorPage,
} from './components';

const App = () => {
  const DEFAULT_DIFFICULTY = 4;
  const [numDigits, setNumDigits] = useState(DEFAULT_DIFFICULTY);
  const [answer, setAnswer] = useState<number[]>([]);
  const [maxGuesses, setMaxGuesses] = useState<number>(10);
  const [timer, setTimer] = useState<number>(60000 * 5); // 5 minutes

  return (
    <GameContext.Provider
      value={{
        numDigits,
        setNumDigits,
        answer,
        setAnswer,
        timer,
        setTimer,
        maxGuesses,
        setMaxGuesses,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/create-account" element={<CreateAccount />} />
        <Route path="/game-over" element={<GameOver />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </GameContext.Provider>
  );
};

export default App;
