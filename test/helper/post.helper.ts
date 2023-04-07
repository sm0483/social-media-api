import Post from '../../src/api/models/post.models';

class PostHelper {
  public createPost = async (data: any) => {
    const post = await Post.create(data);
    return post._id;
  };
}

export default PostHelper;
