import { Router } from 'express';
import PostController from '../controllers/post.controller';
import { IRoute } from '../interfaces/vendors/IRoutes';
import upload from '../utils/multer.utils';
import verifyAccessToken from '../middlewares/verifyAccess.middlewares';

class PostRoute implements IRoute {
  public router: Router = Router();
  public path = '/posts';
  public postController: PostController = new PostController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.post(
      `${this.path}`,
      verifyAccessToken,
      upload.single('postImage'),
      this.postController.createPost
    );
    this.router.get(
      `${this.path}`,
      verifyAccessToken,
      this.postController.getPosts
    );
    this.router.delete(
      `${this.path}/:postId`,
      verifyAccessToken,
      this.postController.deletePost
    );
    this.router.get(
      `${this.path}/:userId`,
      verifyAccessToken,
      this.postController.getPostByUserId
    );
  }
}

export default PostRoute;
