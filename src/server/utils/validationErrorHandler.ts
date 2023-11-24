import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// middleware that checks for validation errors for use with express-validator
export const validationErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  // collect the validation errors from the request
  const result = validationResult(req);
  // if no errors, continue to the next middleware, otherwise send back errors
  return result.isEmpty() ? next() : res.status(400).json({ errors: result.array() });
};
