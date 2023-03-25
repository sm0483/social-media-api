import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import authGuards from '../guards/auth.guards';
import CustomError from '../utils/customError.utils';
import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';
import JwtOperation from '../utils/jwt.utils';
import AuthServices from '../services/auth.services';
import { ParsedQs } from 'qs';

class AuthControllers {
  private jwtOperations = new JwtOperation();
  private authServices = new AuthServices();

  public redirectAuth = async (req: IRequestWithFileAndUser, res: Response) => {
    const url: string = await this.authServices.getUrl();
    res.redirect(url);
  };

  public callbackAuth = async (req: IRequestWithFileAndUser, res: Response) => {
    const code: string | ParsedQs | string[] | ParsedQs[] = req.query.code;
    if (!code) throw new CustomError('Invalid code', StatusCodes.BAD_REQUEST);
    const userInfoRes = await this.authServices.getUserInfo(code as string);
    const userInfo: unknown = userInfoRes.data;
    if (!authGuards.hasValidAuth(userInfo))
      throw new CustomError('Invalid user info ', StatusCodes.BAD_REQUEST);

    const checkUser = await this.authServices.checkUser(userInfo as any);
    let id: null | string = '';
    if (checkUser) id = (checkUser as any)._id;

    let userLogin: boolean = true;
    if (!checkUser) {
      const response = await this.authServices.createUser(userInfo as any);
      userLogin = false;
      if (!authGuards.hasValidUserResponse(response))
        throw new CustomError('Invalid user response', StatusCodes.BAD_GATEWAY);

      id = response._id;
    }
    const token = this.jwtOperations.createJwt({ id });
    res.status(StatusCodes.OK).json({ userLogin, token });
  };
}

export default AuthControllers;
