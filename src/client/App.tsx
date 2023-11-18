import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
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
  const [difficultyLevel, setDifficultyLevel] = useState(DEFAULT_DIFFICULTY);
  const [answer, setAnswer] = useState<number[]>([]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/game"
        element={<Game difficultyLevel={difficultyLevel} answer={answer} setAnswer={setAnswer} />}
      />
      <Route path="/create-account" element={<CreateAccount />} />
      <Route path="/game-over" element={<GameOver answer={answer} />} />
      <Route path="/instructions" element={<Instructions />} />
      <Route path="/settings" element={<Settings setDifficultyLevel={setDifficultyLevel} />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
