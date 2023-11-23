import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

const dataController = {
  getRandomNumbers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const difficulty = req.query.difficulty as string;
      const min = req.query.min as string;
      const max = req.query.max as string;

      if (parseInt(min) >= parseInt(max)) {
        return res.status(400).json({ message: 'Min cannot be greater than max' });
      }

      const response = await axios.get(
        `https://www.random.org/integers/?num=${difficulty}&min=${min}&max=${max}&col=${difficulty}&base=10&format=plain&rnd=new`
      );
      const randomNumbersArray = response.data.split('\t').map((char: string) => parseInt(char));

      return res.status(200).json(randomNumbersArray);
    } catch (error) {
      return next(error);
    }
  },
};

export default dataController;
