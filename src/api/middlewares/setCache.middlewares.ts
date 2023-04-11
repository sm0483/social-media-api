import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';
import { NextFunction, Response } from 'express';

const setCache = (
  req: IRequestWithFileAndUser,
  res: Response,
  next: NextFunction
) => {
  const maxAge = 60 * 60 * 24;
  if (req.method === 'GET') {
    res.set('Cache-Control', `public, max-age=${maxAge}`);
  } else {
    res.set('Cache-Control', 'no-store');
  }
  return next();
};

export default setCache;
