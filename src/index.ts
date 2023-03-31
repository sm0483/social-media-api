import AuthRoutes from './api/routes/auth.routes';
import UserRoutes from './api/routes/user.routes';
import ImageRoutes from './api/routes/image.routes';
import PostRoutes from './api/routes/post.routes';
import ConnectRoutes from './api/routes/connect.routes';
import FeedRoute from './api/routes/feed.routes';
import LikeRoute from './api/routes/like.routes';
import App from './app';

const app = new App(
  [
    new AuthRoutes(),
    new UserRoutes(),
    new ImageRoutes(),
    new PostRoutes(),
    new ConnectRoutes(),
    new FeedRoute(),
    new LikeRoute(),
  ],
  '/api/v1/'
);
app.listen();
