import { Router } from 'express';
import ConnectController from '../controllers/connect.controllers';
import { IRoute } from '../interfaces/vendors/IRoutes';
import verifyAccessToken from '../middlewares/verifyAccess.middlewares';

class ConnectRoute implements IRoute {
  public router: Router = Router();
  public path = '/follows';
  public connectController: ConnectController = new ConnectController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.patch(
      `${this.path}/follow/:followId`,
      verifyAccessToken,
      this.connectController.followUser
    );
    this.router.patch(
      `${this.path}/remove-follow/:followId`,
      verifyAccessToken,
      this.connectController.removeFollow
    );

    this.router.get(
      `${this.path}/followers`,
      verifyAccessToken,
      this.connectController.getFollowers
    );

    this.router.get(
      `${this.path}/following`,
      verifyAccessToken,
      this.connectController.getFollowing
    );
  }
}

export default ConnectRoute;
