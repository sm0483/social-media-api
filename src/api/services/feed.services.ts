import Connect from '../models/connect.models';
import Post from '../models/post.models';
import Like from '../models/like.models';
import mongoose from 'mongoose';

class FeedService {
  public findConnect = async (userId: string) => {
    let connect = await Connect.findOne({ userId });
    if (!connect) connect = { followers: [], following: [] } as any;
    return connect;
  };

  public findLiked = async (userId: string) => {
    let liked: unknown = await Like.findOne({ userId });
    if (!liked) liked = (liked as any).postId = [];
    return liked;
  };

  public getFeed = async (
    connect: { following: any[] },
    postId: any[],
    skip: number,
    pageSize: number
  ) => {
    const posts = await Post.aggregate([
      { $sample: { size: 10 } },
      { $addFields: { isFollowing: { $in: ['$userId', connect.following] } } },
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
    ]);
    return posts;
  };
}

export default FeedService;
