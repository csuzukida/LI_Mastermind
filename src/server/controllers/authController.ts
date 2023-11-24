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

  checkRole: (roles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.session as ISession;
      const user = await UserModel.findById(userId);
      // if there's no user or user role is not allowed, need to return error
      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      return next();
    } catch (error) {
      return next(error);
    }
  },

  checkSession: (req: Request, res: Response) => {
    if ((req.session as ISession).userId) {
      return res.status(200).json({ message: 'Session active' });
    }
    return res.status(401).json({ message: 'Session expired' });
  },

  verifyPassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        // Avoid exposing whether email is registered
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isValidPassword = await argon2.verify(user.password, password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      return res.status(200).json({ isValidPassword: true });
    } catch (error) {
      return next(error);
    }
  },

  changePassword: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.session as ISession;
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ message: 'Password is required' });
      }

      const hashedPassword = await argon2.hash(password);
      await UserModel.findByIdAndUpdate(userId, { password: hashedPassword });

      return res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      return next(error);
    }
  },
};

export default authController;
