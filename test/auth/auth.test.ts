import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import db from '../helper/db.helper';
import AuthHelper from '../helper/auth.helper';
import userData from '../data/user.data';
import createServer from '../helper/server.helper';


const server= createServer();
let token: string;

beforeAll(async () => {
  const authHelper = new AuthHelper();
  token = await authHelper.createUserRefreshToken(userData.user1);
});

afterAll(async () => {
  await db.clearDb();
  await db.closeDb();
  await server.close();
});

describe('Test the redirectAuth route', () => {
  test('should redirect to the auth URL', async () => {
    const response = await supertest(server).get('/api/v1/auth/google');
    expect(response.status).toBe(StatusCodes.MOVED_TEMPORARILY);
  });

  test('it should a give a accessToken in response', async () => {
    const response = await supertest(server)
      .get('/api/v1/auth/access-token')
      .set('Cookie', `refreshToken=${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('accessToken');
  });

  test('should return an error when provided with an invalid refreshToken', async () => {
    const response = await supertest(server)
      .get('/api/v1/auth/access-token')
      .set('Cookie', `refreshToken=${token}+x`);
    expect(response.status).toBe(StatusCodes.FORBIDDEN);
    expect(response.body).toHaveProperty('error');
  });
});
