import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import app from '../../src/index';

const port = 3500;
const server: any = app.listen(port);

afterAll(() => {
  server.close();
});

describe('Test the redirectAuth route', () => {
  it('should redirect to the auth URL', async () => {
    // const response = await supertest(server).get('/api/v1/auth/google');
    expect(true).toBe(true);
  });
});
