import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';
import CustomError from '../utils/customError.utils';
import validation from '../validations/user.validations';
import Storage from '../utils/storage.utils';
import userServices from '../services/user.services';

class userController {
  private storage = new Storage();
  private userServices = new userServices();

  public getUser = async (req: IRequestWithFileAndUser, res: Response) => {
    const id: string = req.user.id;
    const user = await this.userServices.getUserById(id);
    res.status(StatusCodes.OK).json(user);
  };

  public editUser = async (req: IRequestWithFileAndUser, res: Response) => {
    const id: string = req.user.id;
    if (!id) throw new CustomError('No user found', StatusCodes.NOT_FOUND);
    const checkUser = await this.userServices.getUserById(id);
    if (!checkUser)
      throw new CustomError('No user found', StatusCodes.NOT_FOUND);
    const data: object = req.body.data && JSON.parse(req.body.data);
    let uploadData = {};

    if (data) {
      const { error } = validation.validateUserEdit(data);
      if (error) throw new CustomError(error.message, StatusCodes.BAD_REQUEST);
      uploadData = {
        ...data,
      };
    }

    const operations = [];
    if (req.file) {
      uploadData = this.userServices.uploadProfileImage(
        operations,
        checkUser,
        req.file.path,
        uploadData
      );
    }

    operations.push(this.userServices.updateUser(id, uploadData));
    const response = await Promise.all(operations);
    let dt = response[response.length - 1];
    dt = dt?.toObject();
    delete dt?.password;
    delete dt?.__v;
    res.json(dt);
  };
}

export default userController;
