import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IRoom extends Document {
  owner: Types.ObjectId;
  name: string;
  width: number;
  height: number;
  shape: 'rectangle' | 'l-shape';
  wallColour: string;
  furnitureCount: number;
  thumbnailDataUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema<IRoom>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
    },
    width: {
      type: Number,
      required: [true, 'Room width is required'],
      min: [1, 'Width must be at least 1 metre'],
    },
    height: {
      type: Number,
      required: [true, 'Room height is required'],
      min: [1, 'Height must be at least 1 metre'],
    },
    shape: {
      type: String,
      enum: ['rectangle', 'l-shape'],
      default: 'rectangle',
    },
    wallColour: {
      type: String,
      default: '#FFFFFF',
    },
    furnitureCount: {
      type: Number,
      default: 0,
    },
    thumbnailDataUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IRoom>('Room', RoomSchema);
