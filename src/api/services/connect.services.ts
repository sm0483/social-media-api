import mongoose from 'mongoose';
import Connect from '../models/connect.models';
import User from '../models/user.models';

class ConnectServices {
  public findConnect = async (id: string) => {
    return await Connect.findOne({ userId: id });
  };
  public isFollowed = async (
    following: any[],
    id: mongoose.Schema.Types.ObjectId
  ) => {
    return following.includes(id);
  };

  public updateConnect = async (
    operation: boolean,
    id: string,
    followId: mongoose.Schema.Types.ObjectId
  ) => {
    return await Promise.all([
      Connect.findOneAndUpdate(
        { userId: id },
        { [operation ? '$push' : '$pull']: { following: followId } },
        { new: true, runValidators: true }
      ),
      Connect.findOneAndUpdate(
        { userId: followId },
        { [operation ? '$push' : '$pull']: { followers: id } },
        { new: true, runValidators: true }
      ),
      User.findOneAndUpdate(
        { _id: followId },
        { $inc: { followerCount: operation ? 1 : -1 } }
      ),
    ]);
  };

  public createConnect = async (userId: string) => {
    return await Connect.create({ userId, followers: [], following: [] });
  };
}

export default ConnectServices;
