import { Router } from 'express';
import ImageController from '../controllers/image.controller';
import { IRoute } from '../interfaces/vendors/IRoutes';
import verifyToken from '../middlewares/verifyTokenImage.middlewares';

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
      verifyToken,
      this.imageController.getImage
    );
  }
}

export default AuthRoute;
