import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import DbHelper from '../helper/db.helper';
import AuthHelper from '../helper/auth.helper';
import userData from '../data/user.data';
import createServer from '../helper/server.helper';

const server = createServer();
let token: string;
const db = new DbHelper();

beforeAll(async () => {
  await db.connectDb();
  const authHelper = new AuthHelper();
  token = await authHelper.createUserRefreshToken(userData.user1);
});

afterAll(async () => {
  server.close();
  await db.clearDb();
  await db.closeDb();
});

describe('Test suite for auth route', () => {
  test('should redirect to the auth URL', async () => {
    const response = await supertest(server).get('/api/v1/auth/google');
    expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
  });

  test('It should a give a accessToken in response', async () => {
    const response = await supertest(server)
      .get('/api/v1/auth/access-token')
      .set('Cookie', `refreshToken=${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('accessToken');
  });

  test('Should return an error when provided with an invalid refreshToken', async () => {
    const response = await supertest(server)
      .get('/api/v1/auth/access-token')
      .set('Cookie', `refreshToken=${token}+x`);
    expect(response.status).toBe(StatusCodes.FORBIDDEN);
    expect(response.body).toHaveProperty('error');
  });
});
