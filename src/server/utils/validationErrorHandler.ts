import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validationErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const result = validationResult(req);
  return result.isEmpty() ? next() : res.status(400).json({ errors: result.array() });
};
