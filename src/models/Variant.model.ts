import mongoose, { Schema, Document, Types } from 'mongoose';

interface ISelectedOption {
  optionId: Types.ObjectId;
  optionName: string;
  selectedValue: string;
}

interface IDimensions {
  length: number;
  width: number;
  height: number;
}

export interface IVariant extends Document {
  productId: Types.ObjectId;
  sku: string;
  price: number;
  salePrice?: number;
  cost: number;
  quantity: number;
  lowStockThreshold: number;
  images: string[];
  description: string;
  dimensions: IDimensions;
  selectedOptions: ISelectedOption[];
  isActive: boolean;
}

const VariantSchema = new Schema<IVariant>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    cost: { type: Number },
    quantity: { type: Number },
    lowStockThreshold: { type: Number },
    images: [{ type: String }],
    description: { type: String },
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    selectedOptions: [
      {
        optionId: { type: Schema.Types.ObjectId, ref: 'Option' },
        optionName: String,
        selectedValue: String
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IVariant>('Variant', VariantSchema);
