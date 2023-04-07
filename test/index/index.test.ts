import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import createServer from '../helper/server.helper';

const server = createServer();

afterAll(async () => {
  await server.close();
});

describe('API availability test', () => {
  test('API should respond with a 200 status code', async () => {
    const indexResponse = await supertest(server).get('/api/v1/');
    expect(indexResponse.status).toBe(StatusCodes.OK);
  });

  test('The API should return a 404 status code when accessing an invalid endpoint', async () => {
    const indexResponse = await supertest(server).get('/api/v1/random-path');
    expect(indexResponse.status).toBe(StatusCodes.NOT_FOUND);
  });
});
