import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import db from '../helper/db.helper';
import ImageHelper from '../helper/saveImage.helper';
import AuthHelper from '../helper/auth.helper';
import userData from '../data/user.data';
import createServer from '../helper/server.helper';

const server = createServer();

let token: string;
let imageId: any;

beforeAll(async () => {
  const imageHelper = new ImageHelper();
  const authHelper = new AuthHelper();
  token = await authHelper.createUserAccessToken(userData.user1);
  imageId = await imageHelper.saveImage();
});

afterAll(async () => {
  await db.clearDb();
  await db.closeDb();
  await server.close();
});

describe('Test the image retrieval route', () => {
  test('should retrieve an image with the correct content type', async () => {
    const response = await supertest(server).get(
      `/api/v1/images/${imageId}?token=${token}`
    );
    expect(response.headers['content-type']).toMatch(/^image\/(jpeg|png|gif)/);
    expect(response.body).toBeTruthy();
    expect(response.status).toBe(StatusCodes.OK);
  });

  test('should return an error when provided with an invalid AccessToken', async () => {
    const response = await supertest(server).get(
      `/api/v1/images/${imageId}?token=${token}+x`
    );
    expect(response.body).toBeTruthy();
    expect(response.status).toBe(StatusCodes.FORBIDDEN);
  });
});
