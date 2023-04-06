import Storage from '../utils/storage.utils';
import Post from '../models/post.models';
import mongoose from 'mongoose';

class PostServices {
  private storage: Storage = new Storage();
  public storeImage = async (operation: any[], path: string, key: string) => {
    operation.push(this.storage.uploadImage(path, key));
    return key;
  };
  public createPost = async (data: object, operations: any[]) => {
    operations.push(Post.create(data));
  };

  public getPosts = async (
    userId: string,
    connect,
    postId: any[],
    skip: number,
    pageSize: number
  ) => {
    const user = new mongoose.Types.ObjectId(userId);
    return await Post.aggregate([
      { $match: { userId: user } },
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
  };

  public deletePost = async (postId: string, userId: string) => {
    return await Post.findOneAndDelete({ _id: postId, userId });
  };

  public getPostByUserId = async (
    connect,
    postId: any[],
    skip: number,
    pageSize: number,
    userId: string
  ) => {
    const user = new mongoose.Types.ObjectId(userId);
    return await Post.aggregate([
      { $sample: { size: 10 } },
      {
        $addFields: {
          isFollowing: { $in: ['$userId', connect.following] },
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageSize },
      { $match: { userId: user } },
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
  };
}

export default PostServices;
