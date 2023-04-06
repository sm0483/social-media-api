import db from './db.helper';
import UserHelper from './createUser.helper';
import TokenHelper from './token.helper';

const createToken = async () => {
  await db.connectDb();
  const userHelper = new UserHelper();
  const tokenHelper = new TokenHelper();
  const userId = await userHelper.createUser();
  const token = tokenHelper.createToken(userId, 'accessToken');
  return token;
};

export default createToken;
