import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import DbHelper from '../helper/db.helper';
import createServer from '../helper/server.helper';
import AuthHelper from '../helper/auth.helper';
import userData from '../data/user.data';
import UserHelper from '../helper/createUser.helper';
import TokenHelper from '../helper/token.helper';

let server: any;
const db = new DbHelper();
let token: string;
let userId: string;
const authHelper = new AuthHelper();
const userHelper = new UserHelper();
const tokenHelper = new TokenHelper();

beforeAll(async () => {
  await db.connectDb();
  server = await createServer();
  token = await authHelper.createUserAccessToken(userData.user1);
  userId = await userHelper.createUser(userData.user2);
});

beforeEach(async () => {
  await db.clearDb();
});

afterAll(async () => {
  await db.clearDb();
  await db.closeDb();
  await server.close();
});

describe('Test suite for the follow route', () => {
  test('Successfully follow a user using their user id', async () => {
    const response = await supertest(server)
      .patch(`/api/v1/follows/follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status');
    expect(response.body.message).toBe('Successfully followed');
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

  test('Remove follow from followed user', async () => {
    await supertest(server)
      .patch(`/api/v1/follows/follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(server)
      .patch(`/api/v1/follows/remove-follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status');
    expect(response.body.message).toBe('Successfully removed');
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

  test('Get all followers', async () => {
    token = await authHelper.createUserAccessToken(userData.user1);
    userId = await userHelper.createUser(userData.user2);
    const token1 = tokenHelper.createTokenAccess(userId, true);

    await supertest(server)
      .patch(`/api/v1/follows/follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(server)
      .get(`/api/v1/follows/followers`)
      .set('Authorization', `Bearer ${token1}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.length).toBe(1);
  });

  test('Get all following', async () => {
    token = await authHelper.createUserAccessToken(userData.user1);
    userId = await userHelper.createUser(userData.user2);
    const userId1 = await userHelper.createUser(userData.user4);

    await supertest(server)
      .patch(`/api/v1/follows/follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    await supertest(server)
      .patch(`/api/v1/follows/follow/${userId1}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(server)
      .get(`/api/v1/follows/following`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.length).toBe(2);
  });
});
