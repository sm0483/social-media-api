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

  updateConnect = async (
    operation: boolean,
    id: string,
    followData: { follow: mongoose.Schema.Types.ObjectId }
  ) => {
    return await Promise.all([
      Connect.findOneAndUpdate(
        { userId: id },
        { [operation ? '$push' : '$pull']: { following: followData.follow } },
        { new: true, runValidators: true }
      ),
      Connect.findOneAndUpdate(
        { userId: followData.follow },
        { [operation ? '$push' : '$pull']: { followers: id } },
        { new: true, runValidators: true }
      ),
      User.findOneAndUpdate(
        { _id: followData.follow },
        { $inc: { followerCount: operation ? 1 : -1 } }
      ),
    ]);
  };
}

export default ConnectServices;
