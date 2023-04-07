import db from './db.helper';
import UserHelper from './createUser.helper';
import TokenHelper from './token.helper';

class AuthHelper {
  private userHelper = new UserHelper();
  private tokenHelper = new TokenHelper();

  createUserRefreshToken = async (data: object) => {
    await db.connectDb();
    const userId = await this.userHelper.createUser(data);
    const token = this.tokenHelper.createTokenRefresh(userId, true);
    return token;
  };

  createUserAccessToken = async (data: object) => {
    await db.connectDb();
    const userId = await this.userHelper.createUser(data);
    const token = this.tokenHelper.createTokenAccess(userId, true);
    return token;
  };
}

export default AuthHelper;
