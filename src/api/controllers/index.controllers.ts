import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';

class IndexController {
  public index = (req: IRequestWithFileAndUser, res: Response) => {
    return res.status(StatusCodes.OK).json({ message: 'Welcome to the API' });
  };
}

export default IndexController;
