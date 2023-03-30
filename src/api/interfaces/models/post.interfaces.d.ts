import mongoose from 'mongoose';
import { Document } from 'mongoose';

interface IPost extends Document {
  userId: mongoose.Types.ObjectId;
  likes: number;
  postImage: string;
  location: string;
  description: string;
}

export { IPost };
