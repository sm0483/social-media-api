import AuthServices from '../../src/api/services/auth.services';

class UserHelper {
  public authServices: AuthServices = new AuthServices();
  public createUser = async () => {
    const user = await this.authServices.createUser({
      name: 'test',
      email: 'test@gmail.com',
      profileImage: 'https://www.google.com/image',
    });

    return user._id;
  };
}

export default UserHelper;
