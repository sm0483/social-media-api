import { Router } from 'express';
import UserController from '../controllers/user.controllers';
import { IRoute } from '../interfaces/vendors/IRoutes';
import upload from '../utils/multer.utils';
import verifyToken from '../middlewares/auth.middleware';

class AuthRoute implements IRoute {
  public router: Router = Router();
  public path = '/users';
  public userController: UserController = new UserController();

  constructor() {
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`${this.path}`, verifyToken, this.userController.getUser);
    this.router.patch(
      `${this.path}`,
      verifyToken,
      upload.single('profileImage'),
      this.userController.editUser
    );
  }
}

export default AuthRoute;
