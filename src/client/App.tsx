import axios from 'axios';
import { Suspense, useEffect, useState, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { GameContext } from './contexts';

const Home = lazy(() => import('./components/Home'));
const Account = lazy(() => import('./components/Account'));
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
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(7);
  const [answer, setAnswer] = useState<number[]>([]);
  const [maxGuesses, setMaxGuesses] = useState(10);
  const [timerSetting, setTimerSetting] = useState(60000 * 5); // 5 minutes
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [shouldShowTimer, setShouldShowTimer] = useState(false);
  const [time, setTime] = useState(timerSetting);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get('/api/auth/check-session');
        if (response.status === 200 && response.data.isAuthenticated) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response && error.response.status === 401) {
            setIsLoggedIn(false);
          } else {
            console.error(`An error occurred: ${error.message}`);
          }
        } else {
          console.error(`An error occurred: ${error}`);
        }
      }
    };

    checkSession();
  }, []);

  return (
    <GameContext.Provider
      value={{
        numDigits,
        setNumDigits,
        minValue,
        setMinValue,
        maxValue,
        setMaxValue,
        answer,
        setAnswer,
        timerSetting,
        setTimerSetting,
        shouldShowTimer,
        setShouldShowTimer,
        maxGuesses,
        setMaxGuesses,
        isLoggedIn,
        setIsLoggedIn,
        time,
        setTime,
      }}
    >
      <Suspense>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
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
