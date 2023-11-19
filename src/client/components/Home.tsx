import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/joy';
import Logo from './Logo';

// TODO: If user is logged in, do not show signup and signin buttons, show icon and log out button instead

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Button variant="plain" onClick={() => navigate('/signup')} color="primary">
        Create Account
      </Button>
      <Button variant="plain" onClick={() => navigate('/signin')} color="primary">
        Sign in
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
    </>
  );
};

export default Home;
