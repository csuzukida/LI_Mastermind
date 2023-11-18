import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

const dataController = {
  getRandomNumbers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { difficulty } = req.params;
      const response = await axios.get(
        `https://www.random.org/integers/?num=${difficulty}&min=0&max=9&col=${difficulty}&base=10&format=plain&rnd=new`
      );
      const randomNumbersArray = response.data.split('\t').map((char: string) => parseInt(char));

      res.locals.randomNumbersArray = randomNumbersArray;

      return next();
    } catch (error) {
      return next(error);
    }
  },
};

export default dataController;
