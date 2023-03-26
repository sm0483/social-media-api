import AuthRoutes from './api/routes/auth.routes';
import UserRoutes from './api/routes/user.routes';
import ImageRoutes from './api/routes/image.routes';
import App from './app';

const app = new App([new AuthRoutes(), new UserRoutes(),new ImageRoutes()], '/api/v1/');
app.listen();

