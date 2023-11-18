import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/joy';
import Logo from './Logo';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button variant="plain" onClick={() => navigate('/create-account')} color="primary">
        Create Account
      </Button>
      <Logo />
      <Button variant="plain" onClick={() => navigate(`/game`)} color="primary">
        Play
      </Button>
      <Button variant="plain" onClick={() => navigate('/instructions')} color="primary">
        Instructions
      </Button>
      <Button variant="plain" onClick={() => navigate('/settings')} color="primary">
        Settings
      </Button>
      <Button variant="plain" onClick={() => navigate('/signin')} color="primary">
        Sign in
      </Button>
    </>
  );
};

export default Home;
