import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import AuthHelper from '../helper/auth.helper';
import userData from '../data/user.data';
import createServer from '../helper/server.helper';
import postData from '../data/post.data';
import DbHelper from '../helper/db.helper';
import path from 'path';
import UserHelper from '../helper/createUser.helper';
import PostHelper from '../helper/post.helper';
import TokenHelper from '../helper/token.helper';
import StorageMock from '../mocks/storage.mocks';

let server: any;
const storageMock = new StorageMock();

let token: string;
let postId: string;
let userId: string;
let token1: string;

beforeAll(async () => {
  const db = new DbHelper();
  await db.connectDb();
  server = await createServer();
  const userHelper = new UserHelper();
  const tokenHelper = new TokenHelper();
  const authHelper = new AuthHelper();
  token = await authHelper.createUserAccessToken(userData.user1);
  userId = await userHelper.createUser(userData.user2);
  const postHelper = new PostHelper();
  postId = await postHelper.createPost({
    ...postData.post,
    userId,
    postImage: 'some radom string',
  });
  token1 = tokenHelper.createTokenAccess(userId, true);
});

afterAll(async () => {
  const db = new DbHelper();
  await db.clearDb();
  await db.closeDb();
  await new Promise((resolve) => server.close(resolve));
});

describe('Test suite for  post route', () => {
  test('Should fail due not data present a new post', async () => {
    const response = await supertest(server)
      .post('/api/v1/posts')
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toHaveProperty('error');
  });

  test('Creating a new post with an image and data should be successful', async () => {
    const postImagePath = path.join(__dirname, '../assets/post.png');
    const response = await supertest(server)
      .post('/api/v1/posts')
      .set('authorization', `Bearer ${token}`)
      .attach('postImage', postImagePath)
      .field('data', JSON.stringify(postData.post));
    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('likes');
    expect(response.body).toHaveProperty('postImage');
    expect(response.body).toHaveProperty('location');
    expect(response.body).toHaveProperty('description');
    expect(storageMock.uploadImageMock).toHaveBeenCalledTimes(1);
  });

  test('Get all post should be fail without token', async () => {
    const response = await supertest(server).get('/api/v1/posts');
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body).toHaveProperty('error');
  });

  test('Get all posts operation should succeed ', async () => {
    const response = await supertest(server)
      .get('/api/v1/posts')
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  test('Delete post should be fail without token', async () => {
    const response = await supertest(server).delete(`/api/v1/posts/${postId}`);
    expect(response.status).toBe(StatusCodes.UNAUTHORIZED);
    expect(response.body).toHaveProperty('error');
  });

  test('Delete post operation should be succeed', async () => {
    const response = await supertest(server)
      .delete(`/api/v1/posts/${postId}`)
      .set('authorization', `Bearer ${token1}`);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status');
    expect(response.body.message).toBe('Successfully deleted');
    expect(response.status).toBe(StatusCodes.OK);
  });

  test('Get post by userId should be succeed', async () => {
    const response = await supertest(server)
      .get(`/api/v1/posts/${userId}`)
      .set('authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.OK);
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});
