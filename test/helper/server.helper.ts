import app from '../../src/index';

const createSever = () => {
  const port = 3000;
  const server: any = app.listen(port);

  return server;
};

export default createSever;
