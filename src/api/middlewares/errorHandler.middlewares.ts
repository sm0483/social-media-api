/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Response } from 'express';
import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';
import errorGuard from '../guards/error.guards';
import CustomError from '../utils/customError.utils';
import { StatusCodes } from 'http-status-codes';

const errorHandler = (
  err: Error,
  req: IRequestWithFileAndUser,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError && errorGuard(err)) {
    return res
      .status(err.status)
      .json({ error: err.message, status: err.status });
  }
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: err.message,
    status: StatusCodes.INTERNAL_SERVER_ERROR,
  });
};

export default errorHandler;
