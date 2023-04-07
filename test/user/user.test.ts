import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import DbHelper from '../helper/db.helper';
import createServer from '../helper/server.helper';
import userData from '../data/user.data';
import AuthHelper from '../helper/auth.helper';
import path from 'path';

const server = createServer();

const db = new DbHelper();
let token: string;

beforeAll(async () => {
  await db.connectDb();
  const authHelper = new AuthHelper();
  token = await authHelper.createUserAccessToken(userData.user1);
  await authHelper.createUserAccessToken(userData.user2);
});

afterAll(async () => {
  await db.clearDb();
  await db.closeDb();
  server.close();
});

describe('Test user route', () => {
  test('Retrieve user details with token', async () => {
    const response = await supertest(server)
      .get('/api/v1/users/')
      .set('authorization', `Bearer ${token}`);
    expect(response.body.email).toBe(userData.user1.email);
    expect(response.body.name).toBe(userData.user1.name);
    expect(response.status).toBe(StatusCodes.OK);
  });

  test('Retrieve all user details', async () => {
    const response = await supertest(server)
      .get('/api/v1/users/all')
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body.length).toBe(1);
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
  });

  test("Update user's image via API endpoint", async () => {
    const postImagePath = path.join(__dirname, '../assets/post.png');
    const response = await supertest(server)
      .patch('/api/v1/users/')
      .set('authorization', `Bearer ${token}`)
      .attach('profileImage', postImagePath);
    expect(response.status).toBe(StatusCodes.OK);
  });
});
