import JwtOperation from '../../src/api/utils/jwt.utils';
import key from '../../src/config/key.config';

class TokenHelper {
  public jwtOperation: JwtOperation = new JwtOperation();
  public createTokenRefresh = (id: string, userLogin: boolean) => {
    const token = this.jwtOperation.createJwt(
      { id, userLogin },
      key.REFRESH_EXPIRES as string,
      key.REFRESH_TOKEN_KEY as string
    );
    return token;
  };

  public createTokenAccess = (id: string, accessToken: boolean) => {
    const token = this.jwtOperation.createJwt(
      { id, accessToken },
      key.ACCESS_EXPIRES as string,
      key.ACCESS_TOKEN_KEY as string
    );
    return token;
  };
}

export default TokenHelper;
