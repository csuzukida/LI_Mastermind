import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography } from '@mui/joy';
import { Box } from '@mui/material';
import { Logo, VerificationForm } from '../components';
import { GameContext } from '../contexts';
import Grid from '@mui/material/Unstable_Grid2';

const Game = () => {
  const [guessHistory, setGuessHistory] = useState<[string, number, number][] | []>([]);
  const [guessCount, setGuessCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [almostCorrectCount, setAlmostCorrectCount] = useState(0);
  const [noneCorrect, setNoneCorrect] = useState(false);

  const { numDigits, maxGuesses, answer, setAnswer } = useContext(GameContext);
  const navigate = useNavigate();

  // fetch random numbers from server
  useEffect(() => {
    const getRandomNumbers = async () => {
      try {
        const response = await fetch(`/api/random-numbers/?difficulty=${numDigits}`);
        const randomNumbers = await response.json();

        console.log('randomNumbers', randomNumbers);
        setAnswer(randomNumbers);
      } catch (error) {
        console.error('Something went wrong, please try again later!');
      }
    };
    getRandomNumbers();
  }, [numDigits, setAnswer]);

  // helper function to compare user guess to answer
  const compareGuess = (userGuess: string) => {
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

    // map user guess to array of numbers
    const userGuessArray = userGuess.split('').map(Number);
    let localCorrectCount = 0;
    let localAlmostCorrectCount = 0;

    // reset "no matching numbers" message
    setNoneCorrect(false);

    // iterate through answer and calculate num correct and almost correct
    answer.forEach((num, i) => {
      if (num === userGuessArray[i]) {
        localCorrectCount++;
        userGuessArray[i] = -1; // mark as used
      } else if (userGuessArray.includes(num)) {
        localAlmostCorrectCount++;
      }
    });

    // if no correct or almost correct numbers, display message
    if (localCorrectCount === 0 && localAlmostCorrectCount === 0) {
      setNoneCorrect(true); // display message if no matching numbers
    }

    // add user guess to guess history
    setGuessHistory((prevState) => [
      ...prevState,
      [userGuess, localCorrectCount, localAlmostCorrectCount],
    ]);
    setCorrectCount(localCorrectCount);
    setAlmostCorrectCount(localAlmostCorrectCount);
  };

  const handleSubmit = (userInput: string[]) => {
    const userGuess = userInput.join('');
    compareGuess(userGuess);
  };

  console.log('answer', answer);

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 500, margin: 'auto' }}>
      <Grid container spacing={2}>
        <Grid xs={6}>
          <Button onClick={() => navigate('/')}>Home</Button>
        </Grid>
        <Grid xs={6} sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <Button onClick={() => navigate('/settings')}>Settings</Button>
        </Grid>

        <Grid xs={12}>
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
                const [guess, correct, almostCorrect] = el;
                return (
                  <div key={i}>
                    <Typography level="body-sm" color="primary">
                      Guess {i + 1}: {guess}
                    </Typography>
                    <Typography level="body-sm" sx={{ marginLeft: 2 }}>
                      Correct: {correct}, Wrong Spot: {almostCorrect}
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
            sx={{ flex: 1, maxHeight: '8rem', overflowY: 'scroll' }}
          >
            <Typography level="body-lg">Guess Stats</Typography>
            <Typography level="body-sm">Guesses Left: {maxGuesses - guessCount}</Typography>
            <Typography level="body-sm">Correct: {correctCount}</Typography>
            <Typography level="body-sm">Wrong Spot: {almostCorrectCount}</Typography>
            {noneCorrect && (
              <Typography level="body-sm" color="danger">
                No matching numbers!
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

export default Game;
