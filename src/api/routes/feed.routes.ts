import { Router } from 'express';
import FeedController from '../controllers/feed.controllers';
import { IRoute } from '../interfaces/vendors/IRoutes';
import verifyAccessToken from '../middlewares/verifyAccess.middlewares';

class FeedRoute implements IRoute {
  public router: Router = Router();
  public path = '/feeds';
  public feedController: FeedController = new FeedController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      `${this.path}`,
      verifyAccessToken,
      this.feedController.getFeed
    );
  }
}

export default FeedRoute;
