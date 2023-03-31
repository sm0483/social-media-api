import mongoose from 'mongoose';
import { ILike } from '../interfaces/models/like.interface';

const likeSchema = new mongoose.Schema<ILike>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true,
  },
  postId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

const Post = mongoose.model<ILike>('Like', likeSchema);

export default Post;
