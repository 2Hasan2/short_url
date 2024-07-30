import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

export const UserValidation = z.object({
  username: z
    .string()
    .min(3, 'Username is required')
    .max(30, 'Username must be at most 30 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .min(5, 'Email is required')
    .max(100, 'Email must be at most 100 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 5,
    maxlength: 100,
  },
  password: { type: String, required: true, minlength: 6 },
  createdAt: { type: Date, default: Date.now },
});

UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
