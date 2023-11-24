type FrequencyMap = {
  [key: number]: number;
};

// main function to get the number of correct numbers and correct locations
export const getCorrectCounts = (answer: number[], guess: number[]) => {
  // create frequency maps for guess and answer
  const guessFreqMap: FrequencyMap = {};
  const answerFreqMap: FrequencyMap = {};
  let numCorrect = 0;
  let numCorrectLocation = 0;

  // populate frequency maps with occurences of each number
  answer.forEach((num) => {
    answerFreqMap[num] = (answerFreqMap[num] || 0) + 1;
  });
  guess.forEach((num, i) => {
    // check numbers in correct location to prevent an additional loop later
    if (num === answer[i]) numCorrectLocation++;
    guessFreqMap[num] = (guessFreqMap[num] || 0) + 1;
  });

  for (const num in guessFreqMap) {
    // if the number from the guess is in the answer, add the minimum of the two frequencies to the number of correct numbers
    if (num in answerFreqMap) {
      // this is because the number of correct numbers cannot exceed the number of occurences of that number in the answer
      numCorrect += Math.min(guessFreqMap[num], answerFreqMap[num]);
    }
  }

  return [numCorrect, numCorrectLocation];
};
