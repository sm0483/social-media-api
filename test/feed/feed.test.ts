import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import DbHelper from '../helper/db.helper';
import createServer from '../helper/server.helper';
import PostHelper from '../helper/post.helper';
import postData from '../data/post.data';
import userData from '../data/user.data';
import AuthHelper from '../helper/auth.helper';
import UserHelper from '../helper/createUser.helper';

let server: any;
const db = new DbHelper();
let token: string;

beforeAll(async () => {
  await db.connectDb();
  server = await createServer();
  const postHelper = new PostHelper();
  const authHelper = new AuthHelper();
  const userHelper = new UserHelper();
  token = await authHelper.createUserAccessToken(userData.user1);
  const userId = await userHelper.createUser(userData.user2);
  postData.posts.forEach((post) => {
    post.userId = userId;
  });
  await postHelper.createPost(postData.posts);
});

afterAll(async () => {
  await db.clearDb();
  await db.closeDb();
  await server.close();
});

describe('Test suite for feed route', () => {
  test('Retrieve feed', async () => {
    const response = await supertest(server)
      .get('/api/v1/feeds')
      .set('Authorization', `Bearer ${token}`);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.status).toBe(StatusCodes.OK);
  });

  test('Retrieve feed with pagination (page=1 and pageSize=5)', async () => {
    const response = await supertest(server)
      .get('/api/v1/feeds?page=1&pageSize=5')
      .set('Authorization', `Bearer ${token}`);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(5);
    expect(response.status).toBe(StatusCodes.OK);
  });

  test('Retrieve feed with pagination (pageSize=2)', async () => {
    const response = await supertest(server)
      .get('/api/v1/feeds?pageSize=2')
      .set('Authorization', `Bearer ${token}`);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBe(2);
    expect(response.status).toBe(StatusCodes.OK);
  });

  test('Unauthorized error when retrieving feed without token', async () => {
    const response = await supertest(server).get('/api/v1/feeds?pageSize=2');
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
  });
});
