import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import DbHelper from '../helper/db.helper';
import createServer from '../helper/server.helper';
import userData from '../data/user.data';
import AuthHelper from '../helper/auth.helper';
import PostHelper from '../helper/post.helper';
import postData from '../data/post.data';

let server: any;
const db = new DbHelper();
let token: string;
let postId: string;
let token1: string;

beforeAll(async () => {
  await db.connectDb();
  server = await createServer();
  const authHelper = new AuthHelper();
  const postHelper = new PostHelper();
  token = await authHelper.createUserAccessToken(userData.user1);
  postId = await postHelper.createPost({
    ...postData.post,
    userId: '5f9f1c1b9c9d2b2b8c8b8b8b',
    postImage: 'some radom string',
  });

  token1 = await authHelper.createUserAccessToken(userData.user2);
});

afterAll(async () => {
  await db.clearDb();
  await db.closeDb();
  await new Promise((resolve) => server.close(resolve));
});

describe('Test suite for  like route', () => {
  test('Should be successfully like post', async () => {
    const response = await supertest(server)
      .patch(`/api/v1/likes/like/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status');
    expect(response.status).toBe(StatusCodes.OK);
  });

  test('Like post operation should fail', async () => {
    await supertest(server)
      .patch(`/api/v1/likes/like/${postId}`)
      .set('Authorization', `Bearer ${token1}`);

    const response = await supertest(server)
      .patch(`/api/v1/likes/like/${postId}`)
      .set('Authorization', `Bearer ${token1}`);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toHaveProperty('error');
  });

  test('Should  remove like from  post', async () => {
    await supertest(server)
      .patch(`/api/v1/likes/like/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    const response = await supertest(server)
      .patch(`/api/v1/likes/remove-like/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('status');
    expect(response.body.message).toBe('Like removed successfully');
    expect(response.status).toBe(StatusCodes.OK);
  });

  test('Remove like from post operation should fail', async () => {
    await supertest(server)
      .patch(`/api/v1/likes/like/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    await supertest(server)
      .patch(`/api/v1/likes/remove-like/${postId}`)
      .set('Authorization', `Bearer ${token}`);

    const response = await supertest(server)
      .patch(`/api/v1/likes/remove-like/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    expect(response.body).toHaveProperty('error');
  });
});
