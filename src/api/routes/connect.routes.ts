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
      `${this.path}/follow`,
      verifyAccessToken,
      this.connectController.followUser
    );
    this.router.patch(
      `${this.path}/remove-follow`,
      verifyAccessToken,
      this.connectController.removeFollow
    );
  }
}

export default ConnectRoute;
