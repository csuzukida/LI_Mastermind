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

  checkRole: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    const { role } = res.locals.role;

    if (roles.includes(role)) {
      return next();
    }

    return res.status(403).json({ message: 'Access denied' });
  },
};

export default authController;
