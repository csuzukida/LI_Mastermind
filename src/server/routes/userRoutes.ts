import express, { Request, Response } from 'express';
import { authController, userController } from '../controllers';

const userRouter = express.Router();

// create user
userRouter.post('/users', userController.createUser, (req: Request, res: Response) => {
  res.sendStatus(201);
});

// login user
userRouter.post('/users/login', authController.loginUser);

// logout user
userRouter.post('/users/logout', authController.logoutUser);

// get all users
userRouter.get(
  '/users/all-users',
  authController.isAuthenticated,
  userController.getAllUsers,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.users);
  }
);

// get a specific user by id
userRouter.get(
  '/users/:id',
  authController.isAuthenticated,
  userController.getUser,
  (req: Request, res: Response) => {
    res.status(200).json(res.locals.user);
  }
);

// delete a specific user by id
userRouter.delete(
  '/users/:id',
  authController.isAuthenticated,
  userController.deleteUser,
  (req: Request, res: Response) => {
    res.sendStatus(204);
  }
);

export default userRouter;
