import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

class DbHelper {
  public mongoServer: MongoMemoryServer;

  public connectDb = async () => {
    this.mongoServer = await MongoMemoryServer.create();
    const mongoUri = this.mongoServer.getUri();
    await mongoose.connect(mongoUri);
  };

  public clearDb = async () => {
    await mongoose.connection.db.dropDatabase();
  };

  public closeDb = async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    this.mongoServer.stop();
  };
}

export default DbHelper;
