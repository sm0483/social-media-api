import mongoose from 'mongoose';
import { IConnect } from '../interfaces/models/connect.interface';

const connectSchema = new mongoose.Schema<IConnect>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const Connect = mongoose.model<IConnect>('Connect', connectSchema);

export default Connect;
