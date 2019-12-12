import mongoose, { Schema, Document } from "mongoose";
import { addressSchema } from "./Address";
import { OrderState } from "../../../enums";

/**
 * Interface of the document we get from mongodb. This should match with the schema
 */
export interface IOrderDoc {
  _id: string;
  customer: string;
  state: OrderState;
  items: Array<{
    product: string,
    amount: number,
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

const orderItemSchema = new Schema({
  amount: {
    type: Number,
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
    enum: Object.values(OrderState),
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

orderSchema.pre("find", function () {
  // @ts-ignore
  this.start = Date.now();
  console.log("Before orderSchema.find()");
});

orderSchema.post("find", function () {
  console.log(`After orderSchema.find() ${Date.now() - this.start}ms`);
});

const Order = mongoose.model("Order", orderSchema);

export {
  Order,
};
