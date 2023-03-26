import dotenv from 'dotenv';
dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
  GOOGLE_USER_INFO_URL: process.env.GOOGLE_USER_INFO_URL,
  TOKEN_KEY: process.env.TOKEN_KEY,
  EXPIRES: process.env.EXPIRES,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
  S3_ACCESS_KEY: process.env.S3_ACCESS_KEY,
  S3_SECRET_KEY: process.env.S3_SECRET_KEY,
  S3_BUCKET_REGION: process.env.S3_BUCKET_REGION,
  CLIENT_URL: process.env.CLIENT_URL,
  COOKIE_SECRET: process.env.COOKIE_SECRET,
};
