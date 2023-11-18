import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/joy';
import { Logo, VerificationForm } from '../components';

interface GameProps {
  difficultyLevel: number;
  answer: number[];
  setAnswer: (answer: number[]) => void;
}

const Game = ({ difficultyLevel, answer, setAnswer }: GameProps) => {
  const [guess, setGuess] = useState('');
  const [error, setError] = useState('');
  const [guessCount, setGuessCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [almostCorrectCount, setAlmostCorrectCount] = useState(0);
  const [showSolution, setShowSolution] = useState(false);

  const navigate = useNavigate();

  const MAX_GUESSES = 10;

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

  const compareGuess = (userGuess: string) => {
    if (userGuess !== answer.join('') || MAX_GUESSES === guessCount) {
      navigate('/game-over');
    }

    setGuessCount(guessCount + 1);

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
          // answer={answer.map((num) => num.toString())}
          onFormSubmit={handleSubmit}
        />
        {error && <p className="error">{error}</p>}
      </div>
    </>
  );
};

export default Game;
