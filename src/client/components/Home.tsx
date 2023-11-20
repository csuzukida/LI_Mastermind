import axios from 'axios';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, Button } from '@mui/joy';
import { Box } from '@mui/material';
import { GameContext } from '../contexts';
import Logo from './Logo';
import { boxStyle, buttonContainerStyle } from '../utils';

const Home = () => {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(GameContext);

  const handleSignOut = async () => {
    try {
      await axios.post('/api/users/logout');
      setIsLoggedIn(false);
      alert('You were successfully signed out!');
    } catch (error) {
      alert('Something went wrong, please try again later!');
      console.error(error);
    }
  };

  return (
    <Box sx={boxStyle}>
      {!isLoggedIn ? (
        <Box sx={buttonContainerStyle}>
          <Button variant="plain" size="sm" onClick={() => navigate('/signup')} color="primary">
            Sign up
          </Button>
          <Button variant="plain" size="sm" onClick={() => navigate('/signin')} color="primary">
            Sign in
          </Button>
        </Box>
      ) : (
        <Box sx={buttonContainerStyle}>
          <Button variant="plain" size="sm" onClick={handleSignOut}>
            Sign out
          </Button>
          <Avatar>Test {/*This is a placeholder for an avatar image*/}</Avatar>
        </Box>
      )}
      <Box sx={{ marginTop: '7rem' }}>
        <Logo />
      </Box>
      <Button
        color="primary"
        sx={{ width: '30%', marginTop: '2rem' }}
        onClick={() => navigate(`/game`)}
      >
        Play
      </Button>
      <Box sx={{ flexDirection: 'row', marginTop: '2rem' }}>
        <Button variant="plain" size="sm" onClick={() => navigate('/instructions')} color="primary">
          How to Play
        </Button>
        <Button variant="plain" size="sm" onClick={() => navigate('/settings')} color="primary">
          Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Home;
