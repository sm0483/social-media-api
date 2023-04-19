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

  public fetchFollowers = async (id: string) => {
    const userId = new mongoose.Types.ObjectId(id);
    const followersData = await Connect.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'users',
          localField: 'followers',
          foreignField: '_id',
          as: 'followers',
        },
      },
      {
        $project: {
          'followers._id': 1,
          'followers.name': 1,
          'followers.followerCount': 1,
          'followers.place': 1,
          'followers.jobDescription': 1,
          'followers.profileImage': 1,
          'followers.isFollowing': 1,
        },
      },
    ]);

    return (followersData as any)[0].followers;
  };

  public fetchFollowing = async (id: string) => {
    const userId = new mongoose.Types.ObjectId(id);
    const followingData = await Connect.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: 'users',
          localField: 'following',
          foreignField: '_id',
          as: 'following',
        },
      },

      {
        $addFields: {
          'following.isFollowing': true,
        },
      },
      {
        $project: {
          'following._id': 1,
          'following.name': 1,
          'following.followerCount': 1,
          'following.place': 1,
          'following.jobDescription': 1,
          'following.profileImage': 1,
          'following.isFollowing': 1,
        },
      },
    ]);

    return (followingData as any)[0].following;
  };
}

export default ConnectServices;
