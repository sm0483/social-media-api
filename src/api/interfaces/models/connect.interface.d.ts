import mongoose from 'mongoose';

interface IConnect extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  followers: [mongoose.Schema.Types.ObjectId];
  following: [mongoose.Schema.Types.ObjectId];
}

export { IConnect };
