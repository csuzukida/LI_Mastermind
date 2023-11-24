import express, { Request, Response } from 'express';
import { authController, dataController } from '../controllers';
import { query } from 'express-validator';
import { userRouter } from '../routes';
import { validationErrorHandler } from '../utils/validationErrorHandler';

const apiRouter = express.Router();

// data routes
apiRouter.get(
  '/random-numbers/',
  query('length').isInt({ min: 3, max: 10 }),
  query('min').isInt({ min: 0, max: 9 }),
  query('max').isInt({ min: 1, max: 9 }),
  validationErrorHandler,
  dataController.getRandomNumbers
);

// auth routes
apiRouter.get('/auth/check-session', authController.checkSession);

// user routes
apiRouter.use('/users', userRouter);

// 404 for /api endpoints
apiRouter.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

export default apiRouter;
