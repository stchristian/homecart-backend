import mongoose, { Schema, Document } from "mongoose";
import { addressSchema } from "./Address";
import { UserRoles } from "../../../enums";

export interface IUserDoc {
  _id: string;
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

const userSchema = new Schema({
  _id: String,
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
      enum: Object.values(UserRoles),
    }],
  },
  addresses: [addressSchema],
  orders: [{
      type: String,
      ref: "Order",
  }],
  courierOrders: [{
    type: String,
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

const User = mongoose.model("User", userSchema);

export {
  User,
};
