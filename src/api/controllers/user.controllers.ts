import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';
import User from '../models/user.models';
import CustomError from '../utils/customError.utils';
import { v4 as uuid } from 'uuid';

class userController {
  public getUser = async (req: IRequestWithFileAndUser, res: Response) => {
    const id: string = req.user.id;
    let user = await User.findById(id);
    if (!user) throw new CustomError('No user found', StatusCodes.NOT_FOUND);
    user = user?.toObject();
    delete user?.password;
    res.status(StatusCodes.OK).json(user);
  };
  public editUser = async (req: IRequestWithFileAndUser, res: Response) => {
    const id: string = req.user.id;
    const checkUser = await User.findById(id);
    if (!checkUser)
      throw new CustomError('No user found', StatusCodes.NOT_FOUND);
  };
}

export default userController;
