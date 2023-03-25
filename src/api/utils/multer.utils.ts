const multer = require('multer');
import { Request } from 'express';

const storage = multer.diskStorage({
  destination: function (req: Request, file: Express.Multer.File, callback) {
    callback(null, './uploads');
  },
  filename: function (req: Request, file: Express.Multer.File, callback) {
    callback(null, file.fieldname + '-' + Date.now());
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
