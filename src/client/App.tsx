import { Suspense, useState, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { GameContext } from './contexts';

const Home = lazy(() => import('./components/Home'));
const Game = lazy(() => import('./components/Game'));
const GameOver = lazy(() => import('./components/GameOver'));
const Instructions = lazy(() => import('./components/Instructions'));
const Settings = lazy(() => import('./components/Settings'));
const Signin = lazy(() => import('./components/Signin'));
const Signup = lazy(() => import('./components/Signup'));
const ErrorPage = lazy(() => import('./components/ErrorPage'));

const App = () => {
  const DEFAULT_DIFFICULTY = 4;
  const [numDigits, setNumDigits] = useState(DEFAULT_DIFFICULTY);
  const [answer, setAnswer] = useState<number[]>([]);
  const [maxGuesses, setMaxGuesses] = useState<number>(10);
  const [timer, setTimer] = useState<number>(60000 * 5); // 5 minutes
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

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
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      <Suspense>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/game-over" element={<GameOver />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </GameContext.Provider>
  );
};

export default App;
