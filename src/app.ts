import morgan from 'morgan';
import cors from 'cors';
import key from './config/key.config';
import express from 'express';
import 'express-async-errors';

// Config
import connectDb from './api/config/db.config';

// Errors
import errorHandler from './api/middlewares/errorHandler.middlewares';
import pageNotFound from './api/middlewares/notFound.middlewares';

class App {
  public app: express.Application;
  public start: string;
  public port: number;

  constructor(routes: any[], start: string) {
    this.app = express();
    this.start = start;
    this.initRoutes(routes);
    this.initDb();
    this.port = key.PORT as number;
    this.initMiddleware();
  }

  private initMiddleware = () => {
    this.app.use(cors());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(pageNotFound);
    this.app.use(errorHandler);
  };

  private initRoutes = (routes: any[]) => {
    routes.forEach((route) => {
      this.app.use(this.start, route.router);
    });
  };

  private initDb = async () => {
    await connectDb();
  };

  public listen = () => {
    this.app.listen(this.port, () =>
      console.log(`connected to port ${this.port}`)
    );
  };
}

export default App;
