import argon2 from 'argon2';
import UserModel from '../models/UserModel';
import { Request, Response, NextFunction } from 'express';
import { ISession } from '../../types/ISession';

const userController = {
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        console.error('userController.createUser: Missing email or password');
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const hashedPassword = await argon2.hash(password);
      const user = await UserModel.create({ email, password: hashedPassword });

      // sets the userId in the session
      (req.session as ISession).userId = user._id.toString();

      return res.sendStatus(201);
    } catch (error) {
      console.error(`userController.createUser: Error creating user: ${error}`);
      return next(error);
    }
  },

  loginUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        console.error('userController.loginUser: Missing email or password');
        return res.status(400).json({ message: 'Email and password are required' });
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        console.error(`userController.loginUser: No user found with email: ${email}`);
        return res.status(401).json({ message: 'login unsuccessful' });
      }

      // if the passwords match, saves the userId in the session
      if (await argon2.verify(user.password, password)) {
        (req.session as ISession).userId = user._id.toString();
        return res.status(200).json({ message: 'login successful' });
      } else {
        console.error(`userController.loginUser: Incorrect password for email: ${email}`);
        return res.status(401).json({ message: 'login unsuccessful' });
      }
    } catch (error) {
      console.error(`userController.loginUser: Error logging in user: ${error}`);
      return next(error);
    }
  },

  logoutUser: (req: Request, res: Response) => {
    req.session.destroy((error) => {
      if (error) {
        console.error(`userController.logoutUser: Error destroying session: ${error}`);
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
        console.error('userController.getOwnData: Missing userId');
        return res.status(400).json({ message: 'Missing userId' });
      }

      const user = await UserModel.findById(userId);
      if (!user) {
        console.error(`userController.getOwnData: No user found with id: ${userId}`);
        return res.status(400).json({ message: 'User not found' });
      }

      return res.status(200).json({ email: user.email });
    } catch (error) {
      console.error(`userController.getOwnData: Error getting own data: ${error}`);
      return next(error);
    }
  },

  getUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        console.error('userController.getUser: Missing id');
        return res.status(400).json({ message: 'Missing id or malformed request' });
      }

      const user = await UserModel.findById(id);
      if (!user) {
        console.error(`userController.getUser: No user found with id: ${id}`);
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(`userController.getUser: Error getting user: ${error}`);
      return next(error);
    }
  },

  getAllUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await UserModel.find({});
      return res.status(200).json(users);
    } catch (error) {
      console.error(`userController.getAllUsers: Error getting all users: ${error}`);
      return next(error);
    }
  },

  deleteUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      if (!id) {
        console.error('userController.deleteUser: Missing id');
        return res.status(400).json({ message: 'Missing id or malformed request' });
      }

      const deletedUser = await UserModel.findByIdAndDelete(id);
      if (!deletedUser) {
        console.error(`userController.deleteUser: No user found with id: ${id}`);
        return res.status(404).json({ message: 'User not found' });
      }

      return res.sendStatus(204);
    } catch (error) {
      console.error(`userController.deleteUser: Error deleting user: ${error}`);
      return next(error);
    }
  },

  deleteOwnAccount: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.session as ISession;
      if (!userId) {
        console.error('userController.deleteOwnAccount: Missing userId');
        return res.status(400).json({ message: 'Missing userId' });
      }

      const deletedUser = await UserModel.findByIdAndDelete(userId);
      if (!deletedUser) {
        console.error(`userController.deleteOwnAccount: No user found with id: ${userId}`);
        return res.status(404).json({ message: 'User not found' });
      }

      // since the user is deleted, need to destroy the session
      req.session.destroy((error) => {
        if (error) {
          // even if there's an error destroying the session, still need to clear the cookie to better sync state between client and server
          res.clearCookie('connect.sid');

          console.error(`userController.deleteOwnAccount: Error destroying session: ${error}`);

          return res
            .status(200)
            .json({ message: 'User account deleted, but session could not be logged out' });
        } else {
          res.clearCookie('connect.sid');
          return res.status(200).json({ message: 'User account deleted successfully' });
        }
      });
    } catch (error) {
      console.error(`userController.deleteOwnAccount: Error deleting own account: ${error}`);
      return next(error);
    }
  },
};

export default userController;
