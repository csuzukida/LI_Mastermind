import argon2 from 'argon2';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';

const userController = {
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await argon2.hash(password);

      console.log('Creating user with data:', { email, password: hashedPassword });
      await UserModel.create({ email, password: hashedPassword });

      return next();
    } catch (error) {
      return next(error);
    }
  },

  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await UserModel.findById(id);

      res.locals.user = user;

      return next();
    } catch (error) {
      return next(error);
    }
  },

  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.find({});

      res.locals.users = users;

      return next();
    } catch (error) {
      return next(error);
    }
  },

  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await UserModel.findByIdAndDelete(id);

      return next();
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
