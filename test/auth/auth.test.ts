import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import app from '../../src/index';
import db from '../helper/db.helper';
import createToken from '../helper/createToken.helper';

const port = 3000;
const server: any = app.listen(port);
let token: string;

beforeAll(async () => {
  token = await createToken();
});

afterAll(async () => {
  await db.clearDb();
  await db.closeDb();
  await server.close();
});

describe('Test the redirectAuth route', () => {
  it('should redirect to the auth URL', async () => {
    const response = await supertest(server).get('/api/v1/auth/google');
    expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
  });

  it('it should a give a accessToken in response', async () => {
    const response = await supertest(server)
      .get('/api/v1/auth/access-token')
      .set('Cookie', `refreshToken=${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('accessToken');
  });
});
