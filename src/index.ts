import AuthRoutes from './api/routes/auth.routes';
import UserRoutes from './api/routes/user.routes';
import ImageRoutes from './api/routes/image.routes';
import PostRoutes from './api/routes/post.routes';
import App from './app';

const app = new App(
  [new AuthRoutes(), new UserRoutes(), new ImageRoutes(), new PostRoutes()],
  '/api/v1/'
);
app.listen();
