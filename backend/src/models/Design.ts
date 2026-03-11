import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IFurnitureItem {
  furnitureType: string;
  x: number;
  y: number;
  width: number;
  height: number;
  colour: string;
  rotation: number;
  label: string;
}

export interface IDesign extends Document {
  room: Types.ObjectId;
  furnitureItems: IFurnitureItem[];
  savedAt: Date;
  thumbnailDataUrl?: string | null;
}

const FurnitureItemSchema = new Schema<IFurnitureItem>(
  {
    furnitureType: { type: String, required: true },
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    colour: { type: String, default: '#8B7355' },
    rotation: { type: Number, default: 0 },
    label: { type: String, default: '' },
  },
  { _id: true }
);

const DesignSchema = new Schema<IDesign>(
  {
    room: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      unique: true,
    },
    furnitureItems: {
      type: [FurnitureItemSchema],
      default: [],
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
    thumbnailDataUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDesign>('Design', DesignSchema);
