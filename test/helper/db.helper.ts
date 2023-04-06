import mongoose from 'mongoose';
import key from '../../src/config/key.config';

const connectDb = async () => {
  try {
    await mongoose.connect(key.MONGO_URI as string);
    if (key.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.log('MongoDB connected');
    }
  } catch (err) {
    console.error(err);
  }
};

const closeDb = async () => {
  try {
    await mongoose.connection.close();
    if (key.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.log('MongoDB disconnected');
    }
  } catch (err) {
    console.error(err);
  }
};

const clearDb = async () => {
  try {
    await mongoose.connection.db.dropDatabase();
  } catch (err) {
    console.error(err);
  }
};

export default { closeDb, connectDb, clearDb };
