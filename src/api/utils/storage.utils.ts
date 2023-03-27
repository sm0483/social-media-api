import { StatusCodes } from 'http-status-codes';
import storage from '../config/storage.config';
import CustomError from './customError.utils';
import { v4 as uuid } from 'uuid';
import keys from '../../config/key.config';
import fs from 'fs';
import { Readable } from 'stream';
import { DeleteObjectOutput } from 'aws-sdk/clients/s3';

class Storage {
  public async uploadImage(
    path: string,
    key: string
  ): Promise<string | CustomError> {
    try {
      const readStream = fs.createReadStream(path);
      const response = await storage
        .upload({
          Bucket: keys.S3_BUCKET_NAME,
          Key: key,
          Body: readStream,
        })
        .promise();
      fs.unlinkSync(path);
      return response.Key;
    } catch (err) {
      throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // download image from s3

  public async readImage(key: string): Promise<Readable | CustomError> {
    try {
      const response = storage
        .getObject({
          Key: key,
          Bucket: keys.S3_BUCKET_NAME,
        })
        .createReadStream();

      return response;
    } catch (err) {
      throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // delete image from s3
  public async deleteImage(
    key: string
  ): Promise<DeleteObjectOutput | CustomError> {
    try {
      const response = await storage
        .deleteObject({
          Bucket: keys.S3_BUCKET_NAME,
          Key: key,
        })
        .promise();

      return response;
    } catch (err) {
      throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default Storage;
