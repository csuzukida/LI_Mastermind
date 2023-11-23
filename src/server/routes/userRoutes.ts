import express from 'express';
import { param } from 'express-validator';
import { authController, userController } from '../controllers';
import { validationErrorHandler } from '../utils/validationErrorHandler';

const userRouter = express.Router();

userRouter.post('/signup', userController.createUser);
userRouter.post('/login', userController.loginUser);
userRouter.post('/logout', userController.logoutUser);
userRouter.post('/verify-password', authController.verifyPassword);
userRouter.post('/change-password', authController.changePassword);

userRouter.get('/me', authController.isAuthenticated, userController.getOwnData); // get email of logged in user
userRouter.get(
  '/all-users',
  authController.isAuthenticated,
  authController.checkRole(['admin']),
  userController.getAllUsers
);
userRouter.get(
  '/:id',
  param('id').isMongoId(),
  validationErrorHandler,
  authController.isAuthenticated,
  authController.checkRole(['admin']),
  userController.getUser
);

userRouter.delete(
  '/:id',
  param('id').isMongoId(),
  validationErrorHandler,
  authController.isAuthenticated,
  userController.deleteUser
);

export default userRouter;
