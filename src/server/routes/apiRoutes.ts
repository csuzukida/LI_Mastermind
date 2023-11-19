import express, { Request, Response } from 'express';
import { dataController } from '../controllers';
import { userRouter } from '../routes';

const apiRouter = express.Router();

// data routes
apiRouter.get(
  '/random-numbers/',
  dataController.getRandomNumbers,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.randomNumbersArray);
  }
);

// user routes
apiRouter.use('/users', userRouter);

// 404 for /api endpoints
apiRouter.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

export default apiRouter;
