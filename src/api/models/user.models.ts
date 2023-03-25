import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from '../interfaces/models/user.interfaces';

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    default: '',
  },
  followerCount: {
    type: Number,
    default: 0,
  },
  place: {
    type: String,
    default: '',
  },
  jobDescription: {
    type: String,
    default: '',
  },
  profileImage: {
    type: String,
    default: '',
  },
});

userSchema.pre('save', async function (): Promise<void> {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

const User = mongoose.model<IUser>('User', userSchema);
export default User;
