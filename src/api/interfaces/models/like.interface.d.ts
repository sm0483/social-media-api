import mongoose from 'mongoose';

interface ILike extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  postId: [mongoose.Schema.Types.ObjectId];
}

export { ILike };
