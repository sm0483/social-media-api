import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import DbHelper from '../helper/db.helper';
import createServer from '../helper/server.helper';
import userData from '../data/user.data';
import AuthHelper from '../helper/auth.helper';
import path from 'path';
import UserHelper from '../helper/createUser.helper';
import StorageMock from '../mocks/storage.mocks';

let server: any;
const storageMock = new StorageMock();

const db = new DbHelper();
let token: string;
let userId: string;

beforeAll(async () => {
  await db.connectDb();
  server = await createServer();
  const authHelper = new AuthHelper();
  const userHelper = new UserHelper();
  token = await authHelper.createUserAccessToken(userData.user1);
  await authHelper.createUserAccessToken(userData.user2);
  userId = await userHelper.createUser(userData.user4);
});

afterAll(async () => {
  await db.clearDb();
  await db.closeDb();
  await new Promise((resolve) => server.close(resolve));
});

describe('Test suite for user route', () => {
  test('Retrieve user details with token', async () => {
    const response = await supertest(server)
      .get('/api/v1/users/')
      .set('authorization', `Bearer ${token}`);
    expect(response.body.email).toBe(userData.user1.email);
    expect(response.body.name).toBe(userData.user1.name);
    expect(response.status).toBe(StatusCodes.OK);
  });

  test('Verify that all users except the authenticated user are returned.', async () => {
    const name = userData.user1.name;
    const response = await supertest(server)
      .get('/api/v1/users/all')
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.some((user: any) => user.name !== name)).toBe(true);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Verify that all users except following users are returned', async () => {
    await supertest(server)
      .patch(`/api/v1/follows/follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);
    const response = await supertest(server)
      .get('/api/v1/users/all')
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    userId = userId.toString();
    expect(response.body.some((user: any) => user._id !== userId)).toBe(true);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Retrieve user details with invalid token', async () => {
    const response = await supertest(server)
      .get('/api/v1/users/')
      .set('authorization', `Bearer ${token}123`);
    expect(response.status).toBe(StatusCodes.FORBIDDEN);
  });

  test("Update user's descriptive details via API endpoint", async () => {
    const response = await supertest(server)
      .patch('/api/v1/users/')
      .set('authorization', `Bearer ${token}`)
      .field('data', JSON.stringify(userData.user3));
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.place).toBe(userData.user3.place);
    expect(response.body.jobDescription).toBe(userData.user3.jobDescription);
  });

  test("Update user's image and descriptive details via API endpoint", async () => {
    const postImagePath = path.join(__dirname, '../assets/post.png');
    const response = await supertest(server)
      .patch('/api/v1/users/')
      .set('authorization', `Bearer ${token}`)
      .attach('profileImage', postImagePath)
      .field('data', JSON.stringify(userData.user3));
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.place).toBe(userData.user3.place);
    expect(response.body.jobDescription).toBe(userData.user3.jobDescription);
    expect(storageMock.uploadImageMock).toBeCalledTimes(1);
  });

  test("Update user's image via API endpoint", async () => {
    const postImagePath = path.join(__dirname, '../assets/post.png');
    const response = await supertest(server)
      .patch('/api/v1/users/')
      .set('authorization', `Bearer ${token}`)
      .attach('profileImage', postImagePath);
    expect(response.status).toBe(StatusCodes.OK);
    expect(storageMock.uploadImageMock).toBeCalledTimes(1);
  });

  test('Get user by user id', async () => {
    await supertest(server)
      .patch(`/api/v1/follows/follow/${userId}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(server)
      .get(`/api/v1/users/${userId}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.body._id).toBe(userId.toString());
    expect(response.body.isFollowing).toBe(true);
    expect(response.body.followerCount).toBe(1);
    expect(response.status).toBe(StatusCodes.OK);
  });
});
