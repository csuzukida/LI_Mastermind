type FrequencyMap = {
  [key: number]: number;
};

export const getCorrectCounts = (answer: number[], guess: number[]) => {
  const guessFreqMap: FrequencyMap = {};
  const answerFreqMap: FrequencyMap = {};
  let numCorrect = 0;
  let numCorrectLocation = 0;

  // create frequency maps of nums for guess and answer
  answer.forEach((num) => {
    answerFreqMap[num] = (answerFreqMap[num] || 0) + 1;
  });
  guess.forEach((num, i) => {
    if (num === answer[i]) numCorrectLocation++;
    guessFreqMap[num] = (guessFreqMap[num] || 0) + 1;
  });

  // get the number of correct numbers
  for (const num in guessFreqMap) {
    // check if the number is in the answer frequency map
    if (num in answerFreqMap) {
      // add the minimum of the two frequencies to the number of correct numbers because we can't have more correct numbers than the answer has
      numCorrect += Math.min(guessFreqMap[num], answerFreqMap[num]);
    }
  }

  return [numCorrect, numCorrectLocation];
};
