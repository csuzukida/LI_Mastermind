import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

const dataController = {
  getRandomNumbers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      // type assert params as string because parseInt expects a string
      const length = req.query.length as string;
      const min = req.query.min as string;
      const max = req.query.max as string;

      if (parseInt(min) >= parseInt(max)) {
        console.error('dataController.getRandomNumbers: Min cannot be greater than max');
        return res.status(400).json({ message: 'Min cannot be greater than max' });
      }
      // get random numbers from random.org
      const response = await axios.get(
        `https://www.random.org/integers/?num=${length}&min=${min}&max=${max}&col=${length}&base=10&format=plain&rnd=new`
      );
      // splits the response string into an array of numbers
      const randomNumbersArray = response.data.split('\t').map((char: string) => parseInt(char));

      return res.status(200).json(randomNumbersArray);
    } catch (error) {
      console.error(`dataController.getRandomNumbers: Error getting random numbers: ${error}`);
      return next(error);
    }
  },
};

export default dataController;
