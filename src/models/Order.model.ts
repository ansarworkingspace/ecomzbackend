import mongoose, { Schema, Document, Types } from "mongoose";

interface IOrderItem {
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  salePrice?: number;
  totalPrice: number;
}

interface IShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface IStatusHistory {
  status: string;
  timestamp: Date;
  note?: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  customerId: Types.ObjectId;
  items: IOrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
  shippingAddress: IShippingAddress;
  status: string;
  statusHistory: IStatusHistory[];
  createdAt: Date;
  updatedAt: Date;
  expectedDeliveryDate: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        variantId: { type: Schema.Types.ObjectId, ref: "Variant" },
        productName: String,
        sku: String,
        quantity: Number,
        price: Number,
        salePrice: Number,
        totalPrice: Number,
      },
    ],
    subtotal: Number,
    shippingCost: Number,
    tax: Number,
    discount: Number,
    totalAmount: Number,
    paymentMethod: { type: String, enum: ["cod"], default: "cod" },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    shippingAddress: {
      fullName: String,
      phone: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      pincode: String,
      country: String,
    },
    status: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
    statusHistory: [
      {
        status: String,
        timestamp: Date,
        note: String,
      },
    ],
    expectedDeliveryDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
