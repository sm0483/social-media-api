import { Router } from 'express';
import ImageController from '../controllers/image.controller';
import { IRoute } from '../interfaces/vendors/IRoutes';
import verifyAccessToken from '../middlewares/verifyAccess.middlewares';

class AuthRoute implements IRoute {
  public router: Router = Router();
  public path = '/images';
  public imageController: ImageController = new ImageController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(
      `${this.path}/:key`,
      verifyAccessToken,
      this.imageController.getImage
    );
  }
}

export default AuthRoute;
