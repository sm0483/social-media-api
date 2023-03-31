import Like from '../models/like.models';
import Post from '../models/post.models';

class LikeService {
  public checkLike = async (userId: string) => {
    return await Like.findOne({ userId });
  };
  public checkPost = async (postId: string) => {
    return await Post.findById(postId);
  };
  public createLike = async (userId: string) => {
    const like = await Like.create({ userId });
    return like;
  };
  public addLike = async (userId: string, postId: string) => {
    const like = await Promise.all([
      Like.findOneAndUpdate(
        { userId },
        { $push: { postId: postId } },
        { new: true, runValidators: true }
      ),
      Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true, runValidators: true }
      ),
    ]);
    return like;
  };

  public removeLike = async (userId: string, postId: string) => {
    const like = await Promise.all([
      Like.findOneAndUpdate(
        { userId },
        { $pull: { postId: postId } },
        { new: true, runValidators: true }
      ),
      Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true, runValidators: true }
      ),
    ]);

    return like;
  };
}

export default LikeService;
