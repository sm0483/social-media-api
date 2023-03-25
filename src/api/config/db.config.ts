import mongoose from 'mongoose';
import key from '../../config/key.config';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(key.MONGO_URI);
    console.log(`MongoDB Connected`);
  } catch (err) {
    console.error(err);
  }
};

export default connectDB;