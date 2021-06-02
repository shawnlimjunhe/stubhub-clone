import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // middleware to ensure consistent structure for error responses
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeError() });
  }

  res.status(400).send({ errors: [{ message: 'Something went wrong' }] });
};
