import mongoose, { Schema, Document, Types } from 'mongoose';

interface IAddress {
  _id: Types.ObjectId;
  type: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  image: string;
  password: string;
  phone: string;
  role: string;
  addresses: IAddress[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema<IAddress>(
  {
    type: String,
    fullName: String,
    phone: String,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    pincode: String,
    country: String,
    isDefault: Boolean
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    firstName: String,
    lastName: String,
    email: { type: String, required: true, unique: true },
    image: String,
    password: String,
    phone: String,
    role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
    addresses: [AddressSchema],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
