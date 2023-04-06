import { StatusCodes } from 'http-status-codes';
import supertest from 'supertest';
import app from '../../src/index';
import db from '../helper/db.helper';
import createToken from '../helper/createToken.helper';
import ImageHelper from '../helper/saveImage.helper';

const port = 3300;
const server: any = app.listen(port);
let token: string;
let imageId: any;

beforeAll(async () => {
  const imageHelper = new ImageHelper();
  token = await createToken();
  imageId = await imageHelper.saveImage();
});

afterAll(async () => {
  await db.clearDb();
  await db.closeDb();
  await server.close();
});

describe('Test the image retrieval route', () => {
  it('should retrieve an image with the correct content type', async () => {
    const response = await supertest(server).get(
      `/api/v1/images/${imageId}?token=${token}`
    );
    expect(response.headers['content-type']).toMatch(/^image\/(jpeg|png|gif)/);
    expect(response.body).toBeTruthy();
    expect(response.status).toBe(StatusCodes.OK);
  });
});