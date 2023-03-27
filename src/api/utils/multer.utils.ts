import multer from 'multer';
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, callback) {
    callback(null, '/home/user/Desktop/api/social-media-app/src/api/uploads');
  },
  filename: function (req: Request, file: Express.Multer.File, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

export default upload;
