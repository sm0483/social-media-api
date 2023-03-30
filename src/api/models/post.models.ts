import mongoose from 'mongoose';
import {IPost} from '../interfaces/models/post.interfaces'


const postSchema = new mongoose.Schema<IPost>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  likes: {
    type: Number,
    default: 0,
  },
  postImage: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
});

const Post = mongoose.model<IPost>('Post', postSchema);

export default Post;
