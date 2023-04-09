import Storage from '../../src/api/utils/storage.utils';
import fs from 'fs';
import path from 'path';
import { DeleteObjectOutput } from '@aws-sdk/client-s3';

class StorageMock {
  public readStream = fs.createReadStream(
    path.join(__dirname, '../assets/post.png')
  );
  public uploadImageMock = jest
    .spyOn(Storage.prototype, 'uploadImage')
    .mockResolvedValue('some-key');
  public readImageMock = jest
    .spyOn(Storage.prototype, 'readImage')
    .mockResolvedValue(this.readStream);
  public deleteImageMock = jest
    .spyOn(Storage.prototype, 'deleteImage')
    .mockResolvedValue({} as DeleteObjectOutput);
}

export default StorageMock;
