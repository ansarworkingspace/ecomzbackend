import mongoose, { Schema, Document } from "mongoose";

export interface IOption extends Document {
  optionName: string;
  values: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OptionSchema = new Schema<IOption>(
  {
    optionName: { type: String, required: true },
    values: { type: [String], required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IOption>("Option", OptionSchema);
