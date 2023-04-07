import { StatusCodes } from 'http-status-codes';
import storage from '../config/storage.config';
import CustomError from './customError.utils';
import keys from '../../config/key.config';
import fs from 'fs';
import { Readable } from 'stream';
import { DeleteObjectOutput } from 'aws-sdk/clients/s3';
import { GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { blob } from 'aws-sdk/clients/codecommit';

class Storage {
  public async uploadImage(
    path: string,
    key: string
  ): Promise<string | CustomError> {
    try {
      const readStream = fs.createReadStream(path);
      await storage.putObject({
        Bucket: keys.S3_BUCKET_NAME,
        Key: key,
        Body: readStream,
      });
      fs.unlinkSync(path);
      return key;
    } catch (err) {
      throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // download image from s3

  public async readImage(
    key: string
  ): Promise<Readable | CustomError | ReadableStream | blob> {
    try {
      const response = await storage.send(
        new GetObjectCommand({
          Key: key,
          Bucket: keys.S3_BUCKET_NAME,
        })
      );
      return response.Body;
    } catch (err) {
      throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  // delete image from s3
  public async deleteImage(
    key: string
  ): Promise<DeleteObjectOutput | CustomError> {
    try {
      const response = await storage.send(
        new DeleteObjectCommand({
          Bucket: keys.S3_BUCKET_NAME,
          Key: key,
        })
      );

      return response;
    } catch (err) {
      throw new CustomError(err.message, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export default Storage;
