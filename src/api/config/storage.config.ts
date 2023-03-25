import AWS from 'aws-sdk';
import keys from '../../config/key.config';

const S3 = AWS.S3;

const s3 = new S3({
  accessKeyId: keys.S3_ACCESS_KEY,
  secretAccessKey: keys.S3_SECRET_KEY,
  region: keys.S3_BUCKET_REGION,
});




export default s3;
