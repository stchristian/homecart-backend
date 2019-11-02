import mongoose, { Schema, Document } from "mongoose";
import { addressSchema } from "./Address";
import { OrderState, AmountType } from "../../../enums";

/**
 * Interface of the document we get from mongodb. This should match with the schema
 */
export interface IOrder {
  customer: string;
  state: OrderState;
  items: Array<{
    product: string,
    amount: number,
    amountType: AmountType,
  }>;
  address: {
    city: string;
    zip: number;
    streetAddress: string;
  };
  courier: string | null;
  deadline: Date;
  preferredDeliveryTime: { start: Date, end: Date };
  createdAt: Date;
  updatedAt?: Date;
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
    type: String,
    ref: "Product",
    required: true,
  },
}, { _id: false });

const orderSchema = new Schema({
  _id: String,
  customer: {
    type: String,
    ref: "User",
    required: true,
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
    required: true,
  },
  items: [orderItemSchema],
  address: {
    type: addressSchema,
    required: true,
  },
  courier: {
    type: String,
    ref: "User",
    default: null,
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
