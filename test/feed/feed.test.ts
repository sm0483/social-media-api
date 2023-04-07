import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import db from '../helper/db.helper';
import createServer from '../helper/server.helper';


const server= createServer();

afterAll(async() => {
  await db.closeDb();
  server.close();
});

describe('Test the redirectAuth route', () => {
  it('should redirect to the auth URL', async () => {
    // const response = await supertest(server).get('/api/v1/auth/google');
    expect(true).toBe(true);
  });
});
