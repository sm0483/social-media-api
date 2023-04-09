import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import DbHelper from '../helper/db.helper';
import AuthHelper from '../helper/auth.helper';
import userData from '../data/user.data';
import createServer from '../helper/server.helper';
import StorageMock from '../mocks/storage.mocks';
import { Server } from 'http';
const storageMock = new StorageMock();

let token: string;
let imageId: any;
const db = new DbHelper();
let server: Server;

beforeAll(async () => {
  await db.connectDb();
  server = await createServer();
  const authHelper = new AuthHelper();
  token = await authHelper.createUserAccessToken(userData.user1);
  imageId = 'some random value';
});

afterAll(async () => {
  await server.close();
  await db.clearDb();
  await db.closeDb();
});


describe('Test suite form image route', () => {
  test('Should retrieve an image with the correct content type', async () => {
    const response = await supertest(server).get(
      `/api/v1/images/${imageId}?token=${token}`
    );
    expect(response.headers['content-type']).toMatch(/^image\/(jpeg|png|gif)/);
    expect(response.body).toBeTruthy();
    expect(response.status).toBe(StatusCodes.OK);
    expect(storageMock.readImageMock).toBeCalledTimes(1);
    expect(response.headers['cache-control']).toBe('public, max-age=300');
  });

  test('Should return an error when provided with an invalid AccessToken', async () => {
    const response = await supertest(server).get(
      `/api/v1/images/${imageId}?token=${token}+x`
    );
    expect(response.body).toBeTruthy();
    expect(response.status).toBe(StatusCodes.FORBIDDEN);
  });
});
