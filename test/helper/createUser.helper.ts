import AuthServices from '../../src/api/services/auth.services';

class UserHelper {
  public authServices: AuthServices = new AuthServices();
  public createUser = async (data: object) => {
    const user = await this.authServices.createUser(data);
    return user._id;
  };
}

export default UserHelper;
