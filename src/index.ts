import AuthRoutes from './api/routes/auth.routes';
import App from './app';

const app = new App([new AuthRoutes()], '/api/v1/');
app.listen();
