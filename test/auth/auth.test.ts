import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import app from '../../src/index';

const server = app.listen(5000);

afterAll(() => {
  server.close();
});

describe('Test the redirectAuth route', () => {
  it('should redirect to the auth URL', async () => {
    const response = await supertest(server).get('/api/v1/auth/google');
    expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
  });
});
