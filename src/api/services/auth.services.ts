import auth from '../config/oauth2.config';
import key from '../../config/key.config';
import User from '../models/user.models';
import CustomError from '../utils/customError.utils';
import { StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import Connect from '../models/connect.models';

class AuthServices {
  
  public getUrl = () => {
    const url = auth.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
    });
    return url;
  };

  public getUserInfo = async (code: string) => {
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
  };

  public checkUser = async (userInfo: any) => {
    const checkUser = await User.findOne({
      email: userInfo.email,
    });
    return checkUser;
  };

  public createUser = async (userInfo: any) => {
    const response = await User.create({
      name: userInfo.name,
      email: userInfo.email,
      profileImage: userInfo.picture,
    });
    return response;
  };

  public attachCookie = (token: string, res: Response) => {
    res.cookie('refreshToken', token, {
      httpOnly: false,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
      secure: false,
      signed: false,
    });
  };

  public createConnect = async (userId: string) => {
    return await Connect.create({ userId, followers: [], following: [] });
  };
}

export default AuthServices;
