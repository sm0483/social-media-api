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

// "_id": "642693246885bb11d8f7358f",
// "userId": "64268ce4c5f32e2ca8f92407",
// "likes": 0,
// "postImage": "http://127.0.0.1:5000/api/v1/images/140cca0c-4a0f-49cd-b47b-a635dc24a586",
// "location": "New Jersey",
// "description": "A bustling metropolis on the East Coast of the United States",
// "__v": 0,
// "isFollowing": false,
// "isLiked": false,
export default FeedService;
