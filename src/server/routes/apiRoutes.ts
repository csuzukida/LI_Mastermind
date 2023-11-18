import express, { Request, Response } from 'express';
import { dataController } from '../controllers';

const apiRouter = express.Router();

// data
apiRouter.get(
  '/random-numbers/:difficulty',
  dataController.getRandomNumbers,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.randomNumbers);
  }
);

// users
// TODO: implement user controller and user routes

// 404 for /api endpoints
apiRouter.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

export default apiRouter;
