import argon2 from 'argon2';
import UserModel from '../models/UserModel';
import { Request, Response, NextFunction } from 'express';
import { ISession } from '../../types/ISession';

const userController = {
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const hashedPassword = await argon2.hash(password);
      const user = await UserModel.create({ email, password: hashedPassword });

      // sets the userId in the session
      (req.session as ISession).userId = user._id.toString();

      return res.sendStatus(201);
    } catch (error) {
      return next(error);
    }
  },

  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await UserModel.findOne({ email });

      // if the passwords match, sets the userId in the session
      if (user && (await argon2.verify(user.password, password))) {
        (req.session as ISession).userId = user._id.toString();
        return res.status(200).json({ message: 'login successful' });
      } else {
        return res.status(401).json({ message: 'login unsuccessful' });
      }
    } catch (error) {
      return next(error);
    }
  },

  logoutUser: (req: Request, res: Response) => {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ message: 'Could not log out' });
      } else {
        res.clearCookie('connect.sid');
        return res.status(200).json({ message: 'logout successful' });
      }
    });
  },

  getOwnData: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.session as ISession;
      if (!userId) {
        return res.status(400).json({ message: 'Missing userId' });
      }

      const user = await UserModel.findById(userId);
      if (user) return res.status(200).json({ email: user.email });

      return res.status(400).json({ message: 'User not found' });
    } catch (error) {
      return next(error);
    }
  },

  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
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
      return res.status(200).json(users);
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

      return res.sendStatus(204);
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
