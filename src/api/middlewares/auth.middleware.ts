import { Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import CustomError from '../utils/customError.utils';
import JwtOperations from '../utils/jwt.utils';
import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';

const verifyToken = (
  req: IRequestWithFileAndUser,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    throw new CustomError('Token not present', StatusCodes.UNAUTHORIZED);
  }
  const jwtOperations = new JwtOperations();
  try {
    const tokenResponse = jwtOperations.isTokenValid(token);
    if (!tokenResponse) {
      throw new CustomError('Invalid token', StatusCodes.UNAUTHORIZED);
    }
    req.user = { id: (tokenResponse as any).payload.id };
    return next();
  } catch (err) {
    throw new CustomError(err.message, StatusCodes.FORBIDDEN);
  }
};

export default verifyToken;
