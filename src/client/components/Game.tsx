import axios from 'axios';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Unstable_Grid2';
import { Button, Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { Logo, VerificationForm } from '../components';
import { GameContext } from '../contexts';
import { boxStyle, getCorrectCounts } from '../utils';

type GuessHistoryType = [string, number, number][] | [];

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

  const checkSolution = async (userGuess: string) => {
    // check if user guessed correctly
    if (userGuess === answer.join('')) {
      navigate('/game-over', {
        state: { win: true, message: "Great job, you're a masterful code breaker!" },
      });
    }

    // check if user ran out of guesses
    if (guessCount + 1 >= maxGuesses) {
      navigate('/game-over', {
        state: { win: false, message: 'Sorry, better luck next time!' },
      });
    }

    // increment guess count
    setGuessCount(guessCount + 1);

    // reset "no matching numbers" message
    setNoneCorrect(false);

    // map user guess to array of numbers
    const userGuessArray = userGuess.split('').map(Number);

    // compare user guess to answer and get correct counts
    const [localCorrectCount, localCorrectLocationCount] = getCorrectCounts(answer, userGuessArray);

    console.log('localCorrectCount', localCorrectCount);
    console.log('localCorrectLocationCount', localCorrectLocationCount);

    // if no correct or almost correct numbers, display message
    if (localCorrectCount === 0 && localCorrectLocationCount === 0) {
      setNoneCorrect(true); // display message if no matching numbers
    }

    // add user guess to guess history
    setGuessHistory((prevState) => [
      ...prevState,
      [userGuess, localCorrectCount, localCorrectLocationCount],
    ]);
    setCorrectCount(localCorrectCount);
    setcorrectLocationCount(localCorrectLocationCount);
  };

  const handleSubmit = (userInput: string[]) => {
    const userGuess = userInput.join('');
    checkSolution(userGuess);
  };

  return (
    <Box sx={boxStyle}>
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
          <Box
            bgcolor="white"
            py={5}
            px={{ xs: 2.5, md: 5.5 }}
            borderRadius="16px"
            boxShadow={3}
            sx={{ flex: 1, maxHeight: '8rem', overflowY: 'scroll' }}
          >
            <Typography level="body-lg">Guess History</Typography>
            {guessHistory
              .map((el, i) => {
                const [guess, correct, correctLocation] = el;
                return (
                  <div key={i}>
                    <Typography level="body-sm" color="primary">
                      Guess {i + 1}: {guess}
                    </Typography>
                    <Typography level="body-sm" sx={{ marginLeft: 2 }}>
                      {correct} correct number{correct > 1 ? 's' : ''}, {correctLocation} correct
                      location
                    </Typography>
                  </div>
                );
              })
              .reverse()}
          </Box>
        </Grid>

        <Grid xs={5} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box
            bgcolor="white"
            py={5}
            px={{ xs: 2.5, md: 5.5 }}
            borderRadius="16px"
            boxShadow={3}
            sx={{ flex: 1, maxHeight: '8rem' }}
          >
            <Typography level="body-lg">Guess Stats</Typography>
            <Typography level="body-sm">Guesses Left: {maxGuesses - guessCount}</Typography>
            <Typography level="body-sm">
              {correctCount} correct number{correctCount > 1 ? 's' : ''}
            </Typography>
            <Typography level="body-sm">{correctLocationCount} correct location</Typography>
            {noneCorrect && (
              <Typography level="body-sm" color="danger">
                All incorrect!
              </Typography>
            )}
          </Box>
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
export { Game as default, getCorrectCounts };
