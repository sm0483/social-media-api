import { Router } from 'express';
import IndexController from '../controllers/index.controllers';
import { IRoute } from '../interfaces/vendors/IRoutes';
import verifyRefreshToken from '../middlewares/verifyRefresh.middleware';

class IndexRoute implements IRoute {
  public router: Router = Router();
  public path = '/';
  public indexController: IndexController = new IndexController();
  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`${this.path}`, this.indexController.index);
  }
}

export default IndexRoute;
