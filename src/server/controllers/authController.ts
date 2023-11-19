import argon2 from 'argon2';
import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/UserModel';
import { ISession } from '../../types/ISession';

const authController = {
  isAuthenticated: (req: Request, res: Response, next: NextFunction) => {
    if ((req.session as ISession).userId) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  },

  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email });

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

  checkRole: (roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      // grab the user id from the session
      const { userId } = req.session as ISession;

      // double check that the user is logged in
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // check if user is in the database
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      console.log('user.role', user.role);
      console.log('roles', roles);
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      return next();
    } catch (error) {
      return next(error);
    }
  },
};

export default authController;
