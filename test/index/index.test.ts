import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import app from '../../src/index';

const server = app.listen(3000);

afterAll(() => {
  server.close();
});

describe('API availability test', () => {
  test('API should respond with a 200 status code', async () => {
    const indexResponse = await supertest(server).get('/api/v1/');
    expect(indexResponse.status).toBe(StatusCodes.OK);
  });
});