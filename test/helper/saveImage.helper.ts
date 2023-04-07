import Storage from '../../src/api/utils/storage.utils';
import path from 'path';
import { v4 as uid } from 'uuid';
import fs from 'fs';

class ImageHelper {
  public createFile = () => {
    fs.writeFileSync(path.join(__dirname, '../assets/test.png'), '');
  };
  public saveImage = async () => {
    this.createFile();
    const storage = new Storage();
    const imageId = await storage.uploadImage(
      path.join(__dirname, '../assets/test.png'),
      uid()
    );
    return imageId;
  };
}

export default ImageHelper;
