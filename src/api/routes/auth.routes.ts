import { Router } from 'express';
import AuthController from '../controllers/auth.controllers';
import { IRoute } from '../interfaces/vendors/IRoutes';
import verifyRefreshToken from '../middlewares/verifyRefresh.middleware';

class AuthRoute implements IRoute {
  public router: Router = Router();
  public path = '/auth';
  public authController: AuthController = new AuthController();
  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`${this.path}/google`, this.authController.redirectAuth);
    this.router.get(
      `${this.path}/google/callback`,
      this.authController.callbackAuth
    );
    this.router.get(
      `${this.path}/access-token`,
      verifyRefreshToken,
      this.authController.getAccessToken
    );
  }
}

export default AuthRoute;
