import mongoose from 'mongoose';
import key from '../../config/key.config';

const connectDB = async () => {
  try {
    await mongoose.connect(key.MONGO_URI);
    if (key.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('MongoDB connected');
    }
  } catch (err) {
    console.error(err);
  }
};



export default connectDB;
