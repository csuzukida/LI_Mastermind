import argon2 from 'argon2';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';

const userController = {
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await argon2.hash(password);

      // catch missing fields in the request body
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      await UserModel.create({ email, password: hashedPassword });

      return next();
    } catch (error) {
      return next(error);
    }
  },

  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      // catch missing id in the request params
      if (!id) {
        return res.status(400).json({ message: 'Missing id or malformed request' });
      }

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
      if (!id) {
        return res.status(400).json({ message: 'Missing id or malformed request' });
      }

      await UserModel.findByIdAndDelete(id);

      return next();
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
