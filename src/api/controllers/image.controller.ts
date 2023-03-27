import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Readable } from 'stream';
import IRequestWithFileAndUser from '../interfaces/vendors/IRequestWithFileAndUser';
import CustomError from '../utils/customError.utils';
import Storage from '../utils/storage.utils';

class ImageController {
  private storage = new Storage();
  getImage = async (req: IRequestWithFileAndUser, res: Response) => {
    const key: string = req.params.key;
    if (!key) throw new CustomError('Key is required', StatusCodes.BAD_REQUEST);
    const imageStream = await this.storage.readImage(key);
    if (!imageStream) {
      throw new CustomError('Image not found', StatusCodes.NOT_FOUND);
    }
    if (imageStream instanceof Readable) {
      imageStream.pipe(res);
    }
  };
}

export default ImageController;
