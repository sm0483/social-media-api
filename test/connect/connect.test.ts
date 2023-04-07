import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import DbHelper from '../helper/db.helper';
import createServer from '../helper/server.helper';
import AuthHelper from '../helper/auth.helper';
import userData from '../data/user.data';
import UserHelper from '../helper/createUser.helper';

const server = createServer();
const db = new DbHelper();
let token: string;
let userId: string;

beforeAll(async () => {
  await db.connectDb();
  const authHelper = new AuthHelper();
  const userHelper = new UserHelper();
  token = await authHelper.createUserAccessToken(userData.user1);
  userId = await userHelper.createUser(userData.user2);
});

beforeEach(async () => {
  await db.clearDb();
});

afterAll(async () => {
  await db.clearDb();
  await db.closeDb();
  server.close();
});

describe('Test suite for the follow route', () => {
  test('Successfully follow a user using their user id', async () => {
    const response = await supertest(server)
      .patch(`/api/v1/follows/follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('following');
    expect(response.body.following[0]).toBe(userId.toString());
  });

  test('Error when following already followed user', async () => {
    await supertest(server)
      .patch(`/api/v1/follows/follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(server)
      .patch(`/api/v1/follows/follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toHaveProperty('error');
  });

  test('remove follow from followed user', async () => {
    await supertest(server)
      .patch(`/api/v1/follows/follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(server)
      .patch(`/api/v1/follows/remove-follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.OK);
  });

  test('Error when removing not following user', async () => {
    await supertest(server)
      .patch(`/api/v1/follows/follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    await supertest(server)
      .patch(`/api/v1/follows/remove-follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(server)
      .patch(`/api/v1/follows/remove-follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toHaveProperty('error');
  });
});
