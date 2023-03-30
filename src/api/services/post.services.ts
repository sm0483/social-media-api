import Storage from '../utils/storage.utils';
import Post from '../models/post.models';

class PostServices {
  private storage: Storage = new Storage();
  public storeImage = async (operation: any[], path: string, key: string) => {
    operation.push(this.storage.uploadImage(path, key));
    return key;
  };
  public createPost = async (data: object, operations: any[]) => {
    operations.push(Post.create(data));
  };

  public getPosts = async (userId: string) => {
    return await Post.find({ userId });
  };

  public deletePost = async (postId: string, userId: string) => {
    return await Post.findOneAndDelete({ _id: postId, userId });
  };
}

export default PostServices;
