import keys from '../../config/key.config';
import { S3 } from '@aws-sdk/client-s3';

const s3 = new S3({
  credentials: {
    accessKeyId: keys.S3_ACCESS_KEY,
    secretAccessKey: keys.S3_SECRET_KEY,
  },
  region: keys.S3_BUCKET_REGION,
});

export default s3;
