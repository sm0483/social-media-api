import app from '../../src/index';
import * as portFinder from 'portfinder';

const createServer = async () => {
  const port = await portFinder.getPortPromise();
  const server = app.listen(port);
  return server;
};

export default createServer;
