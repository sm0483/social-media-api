import multer from 'multer';
import { Request } from 'express';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, callback) {
    callback(null, path.join(__dirname, '../../api/uploads'));
  },
  filename: function (req: Request, file: Express.Multer.File, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

export default upload;
