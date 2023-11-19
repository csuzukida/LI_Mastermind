import express, { Request, Response } from 'express';
import { authController, userController } from '../controllers';

const userRouter = express.Router();

// create user
userRouter.post('/signup', userController.createUser, (req: Request, res: Response) => {
  res.sendStatus(201);
});

// login user
userRouter.post('/login', authController.loginUser);

// logout user
userRouter.post('/logout', authController.logoutUser);

// get all users
userRouter.get(
  '/all-users',
  authController.isAuthenticated,
  userController.getAllUsers,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.users);
  }
);

// get a specific user by id
userRouter.get(
  '/:id',
  authController.isAuthenticated,
  userController.getUser,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.user);
  }
);

// delete a specific user by id
userRouter.delete(
  '/:id',
  authController.isAuthenticated,
  userController.deleteUser,
  (req: Request, res: Response) => {
    res.sendStatus(204);
  }
);

export default userRouter;
