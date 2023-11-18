import { Route, Routes } from 'react-router-dom';
import { Home, Game, Login, ErrorPage } from './components';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/game/:difficulty" element={<Game />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default App;
