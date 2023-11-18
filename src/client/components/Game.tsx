import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/joy';
import { Logo, VerificationForm } from '../components';
import { GameContext } from '../contexts';

const Game = () => {
  const [guess, setGuess] = useState('');
  const [error, setError] = useState('');
  const [guessCount, setGuessCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [almostCorrectCount, setAlmostCorrectCount] = useState(0);

  const { numDigits: difficultyLevel, maxGuesses, answer, setAnswer } = useContext(GameContext);

  const navigate = useNavigate();

  // fetch random numbers from server
  useEffect(() => {
    const getRandomNumbers = async () => {
      try {
        const response = await fetch(`/api/random-numbers/?difficulty=${difficultyLevel}`);
        const randomNumbers = await response.json();
        setAnswer(randomNumbers);
      } catch (error) {
        console.error('Something went wrong, please try again later!');
      }
    };
    getRandomNumbers();
  }, [difficultyLevel, setAnswer]);

  // helper function to compare user guess to answer
  const compareGuess = (userGuess: string) => {
    setGuessCount(guessCount + 1);

    if (userGuess === answer.join('') || maxGuesses === guessCount) {
      navigate('/game-over');
    }

    // map user guess to array of numbers
    const userGuessArray = userGuess.split('').map(Number);
    let localCorrectCount = 0;
    let localAlmostCorrectCount = 0;

    answer.forEach((num, i) => {
      if (num === userGuessArray[i]) {
        localCorrectCount++;
        userGuessArray[i] = -1;
      } else if (userGuessArray.includes(num)) {
        localAlmostCorrectCount++;
      }
    });

    setCorrectCount(localCorrectCount);
    setAlmostCorrectCount(localAlmostCorrectCount);
    setGuess('');
  };

  const handleSubmit = (userInput: string[]) => {
    const userGuess = userInput.join('');
    setGuess(userGuess);
    compareGuess(userGuess);
  };

  return (
    <>
      <Button onClick={() => navigate('/')}>Home</Button>
      <Logo />
      <div className="guess-box-container">
        <VerificationForm
          title="Enter your guess!"
          length={difficultyLevel}
          onFormSubmit={handleSubmit}
        />
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
};

export default Game;
