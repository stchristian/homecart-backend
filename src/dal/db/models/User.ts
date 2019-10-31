import mongoose, { Schema, Document } from "mongoose";
import { addressSchema } from "./Address";

enum UserRoles {
  ADMIN = "ADMIN",
  COURIER = "COURIER",
}

export interface IUser {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  biography: string;
  phoneNumber: string;
  balance: number;
  addresses: any[];
  roles: UserRoles[] ;
}

export interface IUserDocument extends Document, IUser {

}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  roles: {
    type: [{
      type: String,
      enum: ["ADMIN", "COURIER"],
    }],
  },
  addresses: [addressSchema],
  orders: [{
      type: Schema.Types.ObjectId,
      ref: "Order",
  }],
  courierOrders: [{
    type: Schema.Types.ObjectId,
    ref: "Order",
  }],
  biography: {
    type: String,
    required: false,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model<IUserDocument>("User", userSchema);

export {
  User,
};
