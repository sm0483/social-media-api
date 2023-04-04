import User from '../models/user.models';
import CustomError from '../utils/customError.utils';
import { StatusCodes } from 'http-status-codes';
import Storage from '../utils/storage.utils';
import keyConfig from '../../config/key.config';
import { v4 as uid } from 'uuid';
import Connect from '../models/connect.models';

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
    let newData = await User.findOneAndUpdate({ _id: id }, data, {
      new: true,
      runValidators: true,
    });
    newData = newData?.toObject();
    delete newData?.password;
    delete newData?.__v;
    return newData;
  };

  public getUsers = async (
    page: number,
    skip: number,
    pageSize: number,
    userId: string
  ) => {
    const connections = await Connect.findOne({ userId });
    const following = connections.following;
    const users = await User.aggregate([
      {
        $match: {
          _id: { $nin: [userId, ...following] },
        },
      },
      { $skip: skip },
      { $limit: pageSize },
      { $sort: { createdAt: -1 } },
      { $addFields: { isFollowing: false } },
      {
        $project: {
          password: 0,
          __v: 0,
          email: 0,
        },
      },
    ]);
    return users;
  };
}

export default userServices;
