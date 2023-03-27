import User from '../models/user.models';
import CustomError from '../utils/customError.utils';
import { StatusCodes } from 'http-status-codes';
import Storage from '../utils/storage.utils';
import keyConfig from '../../config/key.config';
import { v4 as uid } from 'uuid';

class userServices {
  private storage = new Storage();

  public getUserById = async (id: string) => {
    let user = await User.findById(id);
    if (!user) throw new CustomError('No user found', StatusCodes.NOT_FOUND);
    user = user?.toObject();
    delete user?.password;
    return user;
  };

  public uploadProfileImage = (
    operations: any[],
    checkUser: { profileImage: string },
    path: string,
    uploadData: object
  ) => {
    if (
      checkUser.profileImage &&
      checkUser.profileImage.includes(keyConfig.SERVER_DOMAIN)
    ) {
      const key: string = checkUser.profileImage.split('/')[6];
      operations.push(this.storage.deleteImage(key));
    }
    const storeKey: string = uid();
    operations.push(this.storage.uploadImage(path, storeKey));
    const profileImage = `${keyConfig.SERVER_DOMAIN}/images/${storeKey}`;
    uploadData = { ...uploadData, profileImage };
    return uploadData;
  };

  public updateUser = async (id: string, data: object) => {
    const newData = await User.findOneAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true,
    });

    return newData;
  };
}

export default userServices;
