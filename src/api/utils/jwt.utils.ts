import jwt from 'jsonwebtoken';
import tokenConfig from '../../config/key.config';

class JwtOperation {
  public createJwt(payload: object): string {
    const token = jwt.sign({ payload }, tokenConfig.TOKEN_KEY, {
      expiresIn: tokenConfig.EXPIRES,
    });
    return token;
  }

  public isTokenValid(token: string): boolean {
    try {
      jwt.verify(token, tokenConfig.TOKEN_KEY);
      return true;
    } catch (err) {
      return false;
    }
  }
}

export default JwtOperation;
