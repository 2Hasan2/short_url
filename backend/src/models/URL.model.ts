import mongoose, { Document, Schema } from 'mongoose';
import { z } from 'zod';

export const URLValidation = z.object({
  originalUrl: z.string().url('Invalid URL').min(1, 'Original URL is required'),
  shortUrl: z
    .string()
    .min(8, 'Short URL is must be at least 8 characters long')
    .optional(),
  userId: z.string(),
});

interface IUrl extends Document {
  shortUrl: string;
  originalUrl: string;
  userId?: mongoose.Schema.Types.ObjectId;
  clicks: number;
  geoData: { country: string; clicks: number }[];
}

const UrlSchema: Schema = new Schema({
  shortUrl: { type: String, required: true, unique: true },
  originalUrl: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clicks: { type: Number, default: 0 },
  geoData: [
    {
      country: String,
      clicks: Number,
    },
  ],
});

export const URL = mongoose.model<IUrl>('Url', UrlSchema);
