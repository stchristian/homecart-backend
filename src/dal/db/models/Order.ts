import mongoose, { Schema, Document } from "mongoose";
import { addressSchema } from "./Address";
import { OrderState } from "../../../models/Order";
import { OrderItem } from "../../../models/Order";
export interface IOrder {
  customerId: string;
  state: OrderState;
  items: OrderItem[];
  address: {
    city: string;
    zip: number;
    streetAddress: string;
  };
  courierId?: string;
  deadline: Date;
  preferredDeliveryTime: { start: Date, end: Date };
  createdAt: Date;
  tipPrice: number;
  totalPrice: number;
  realPrice: number;
  estimatedPrice: number;
}

export interface IOrderDocument extends IOrder, Document {

}

const orderItemSchema = new Schema({
  amount: {
    type: Number,
    required: true,
  },
  amountType: {
    type: String,
    enum: ["MASS", "PIECE", "LENGTH", "AREA"],
    required: true,
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const orderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  state: {
    type: String,
    enum: [
      "CREATED",
      "POSTED",
      "ASSIGNED",
      "PURCHASED",
      "COMPLETED",
      "EXPIRED",
    ],
  },
  items: [orderItemSchema],
  address: {
    type: addressSchema,
    required: true,
  },
  courier: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  deadline: {
    type: Date,
    required: true,
  },
  preferredDeliveryTime: {
    type: new Schema({
      start: {
        type: Date,
        required: true,
      },
      end: {
        type: Date,
        required: true,
      },
    }, { _id: false }),
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  realPrice: {
    type: Number,
    default: 0,
  },
  estimatedPrice: {
    type: Number,
    default: 0,
  },
  tipPrice: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Order = mongoose.model<IOrderDocument>("Order", orderSchema);

export {
  Order,
};
