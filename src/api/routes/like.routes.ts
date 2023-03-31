import { Router } from 'express';
import LikeController from '../controllers/like.controllers';
import { IRoute } from '../interfaces/vendors/IRoutes';
import verifyAccessToken from '../middlewares/verifyAccess.middlewares';

class LikeRoute implements IRoute {
  public router: Router = Router();
  public path = '/likes';
  public likeController: LikeController = new LikeController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.patch(
      `${this.path}/like/:postId`,
      verifyAccessToken,
      this.likeController.likePost
    );
    this.router.patch(
      `${this.path}/remove-like/:postId`,
      verifyAccessToken,
      this.likeController.removeLike
    );
  }
}

export default LikeRoute;
