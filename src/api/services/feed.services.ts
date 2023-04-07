import Connect from '../models/connect.models';
import Post from '../models/post.models';
import Like from '../models/like.models';
import mongoose from 'mongoose';

class FeedService {
  public findConnect = async (userId: string) => {
    let connect: unknown = await Connect.findOne({ userId });
    if (!connect) connect = { followers: [], following: [] };
    return connect;
  };

  public findLiked = async (userId: string) => {
    let liked: unknown = await Like.findOne({ userId });
    if (!liked) liked = { postId: [] };
    return liked;
  };

  public getFeed = async (
    connect: any,
    postId: any[],
    skip: number,
    pageSize: number
  ) => {
    const posts = await Post.aggregate([
      { $sample: { size: 10 } },
      {
        $addFields: {
          isFollowing: { $in: ['$userId', connect.following] },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
      {
        $addFields: {
          isLiked: {
            $in: ['$_id', postId.map((id) => new mongoose.Types.ObjectId(id))],
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          'userDetails.name': 1,
          'userDetails._id': 1,
          'userDetails.profileImage': 1,
          likes: 1,
          postImage: 1,
          location: 1,
          description: 1,
          isFollowing: 1,
          isLiked: 1,
        },
      },
    ]);
    return posts;
  };
}

export default FeedService;
