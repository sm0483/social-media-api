import morgan from 'morgan';
import cors from 'cors';
import key from './config/key.config';
import express from 'express';
import 'express-async-errors';
import cookieParser from 'cookie-parser';

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
    this.port = key.PORT as number;
    this.app = express();
    this.start = start;
    this.initDb();
    this.initMiddleware();
    this.initRoutes(routes);
    this.initErrorHandler();
  }

  private initMiddleware = () => {
    key.NODE_ENV !== 'test' && this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(cookieParser());
    this.app.use(express.json());
  };

  private initErrorHandler = () => {
    this.app.use(pageNotFound);
    this.app.use(errorHandler);
  };

  private initRoutes = (routes: any[]) => {
    routes.forEach((route) => {
      this.app.use(this.start, route.router);
    });
  };

  private initDb = async () => {
    key.NODE_ENV !== 'test' && await connectDb();
  };

  public listen = () => {
    this.app.listen(this.port, () => {
      if (key.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`connected to port ${this.port}`);
      }
    });
  };

  public getApp = () => {
    return this.app;
  };
}

export default App;
