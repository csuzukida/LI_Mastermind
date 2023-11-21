import axios from 'axios';
import Grid from '@mui/material/Unstable_Grid2';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/joy';
import { Box } from '@mui/material';
import { GameContext } from '../contexts';
import { boxStyle, getCorrectCounts } from '../utils';
import { GuessHistory, GuessStats, Logo, VerificationForm } from '../components';

type GuessHistoryType = [string, number, number][] | [];

const gameBoxStyle = {
  ...boxStyle,
  flexGrow: 1,
  boxSizing: 'border-box',
  padding: '1.5rem',
};

const Game = () => {
  const [guessHistory, setGuessHistory] = useState<GuessHistoryType>([]);
  const [guessCount, setGuessCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [correctLocationCount, setcorrectLocationCount] = useState(0);
  const [noneCorrect, setNoneCorrect] = useState(false);

  const { numDigits, maxGuesses, answer, setAnswer } = useContext(GameContext);
  const navigate = useNavigate();

  // fetch random numbers from server
  useEffect(() => {
    const getRandomNumbers = async () => {
      try {
        const response = await axios.get(`/api/random-numbers/?difficulty=${numDigits}`);
        const randomNumbers: number[] = response.data;
        // logging for ease of code demo purposes
        console.log('randomNumbers', randomNumbers);
        setAnswer(randomNumbers);
      } catch (error) {
        console.error('Something went wrong, please try again later!');
      }
    };
    getRandomNumbers();
  }, [numDigits, setAnswer]);

  const checkGameOver = (userGuess: string) => {
    setGuessCount(guessCount + 1);
    // check if user guessed correctly
    if (userGuess === answer.join('')) {
      navigate('/game-over', {
        state: { win: true, message: "Great job, you're a masterful code breaker!" },
      });

    // check if user ran out of guesses
    if (guessCount + 1 >= maxGuesses) {
      navigate('/game-over', {
        state: { win: false, message: 'Sorry, better luck next time!' },
      });
    }
  };

  const checkSolution = async (userGuess: string) => {
    checkGameOver(userGuess);
    setNoneCorrect(false);

    // map user guess to array of numbers then get correct counts
    const userGuessArray = userGuess.split('').map(Number);
    const [localCorrectCount, localCorrectLocationCount] = getCorrectCounts(answer, userGuessArray);

    if (localCorrectCount === 0 && localCorrectLocationCount === 0) {
      setNoneCorrect(true); // display message if all incorrect
    }

    // add user guess to guess history and update correct counts in state
    setGuessHistory((prevState) => {
      return [...prevState, [userGuess, localCorrectCount, localCorrectLocationCount]];
    });
    setCorrectCount(localCorrectCount);
    setcorrectLocationCount(localCorrectLocationCount);
  };

  const handleSubmit = (userInput: string[]) => {
    const userGuess = userInput.join('');
    checkSolution(userGuess);
  };

  return (
    <Box sx={gameBoxStyle}>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <Button onClick={() => navigate('/')}>Home</Button>
        </Grid>
        <Grid xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Button onClick={() => navigate('/settings')}>Settings</Button>
        </Grid>

        <Grid xs={12} sx={{ marginTop: '-1rem' }}>
          <Logo />
        </Grid>

        <Grid xs={7} sx={{ display: 'flex', flexDirection: 'column' }}>
          <GuessHistory guessHistory={guessHistory} />
        </Grid>

        <Grid xs={5} sx={{ display: 'flex', flexDirection: 'column' }}>
          <GuessStats {...{ guessCount, correctCount, correctLocationCount, noneCorrect }} />
        </Grid>

        <Grid xs={12}>
          <div className="guess-box-container">
            <VerificationForm
              title="Crack the Code"
              length={numDigits}
              onFormSubmit={handleSubmit}
            />
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};

// export helper function to test
export default Game;
