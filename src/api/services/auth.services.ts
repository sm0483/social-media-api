import auth from '../config/oauth2.config';
import key from '../../config/key.config';
import User from '../models/user.models';
import CustomError from '../utils/customError.utils';
import { StatusCodes } from 'http-status-codes';

class AuthServices {
  public async getUrl() {
    const url = auth.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
    });
    return url;
  }

  public async getUserInfo(code: string) {
    const tokens = (await auth.getToken(code)).tokens;
    if (!tokens)
      throw new CustomError('Invalid token', StatusCodes.INTERNAL_SERVER_ERROR);
    auth.setCredentials(tokens);
    try {
      const userInfoRes = await auth.request({
        url: key.GOOGLE_USER_INFO_URL,
      });
      return userInfoRes;
    } catch (err) {
      throw new CustomError('Invalid token', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  public async checkUser(userInfo: any) {
    const checkUser = await User.findOne({
      email: userInfo.email,
    });
    return checkUser;
  }

  public async createUser(userInfo: any) {
    const response = await User.create({
      name: userInfo.name,
      email: userInfo.email,
    });
    return response;
  }
}

export default AuthServices;
