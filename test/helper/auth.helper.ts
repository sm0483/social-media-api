import UserHelper from './createUser.helper';
import TokenHelper from './token.helper';

class AuthHelper {
  private userHelper = new UserHelper();
  private tokenHelper = new TokenHelper();

  createUserRefreshToken = async (data: object) => {
    const userId = await this.userHelper.createUser(data);
    const token = this.tokenHelper.createTokenRefresh(userId, true);
    return token;
  };

  createUserAccessToken = async (data: object) => {
    const userId = await this.userHelper.createUser(data);
    const token = this.tokenHelper.createTokenAccess(userId, true);
    return token;
  };
}

export default AuthHelper;
