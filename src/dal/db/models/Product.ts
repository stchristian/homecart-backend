import mongoose, { Schema, Document } from "mongoose";

import { AmountType } from "../../../enums";

export interface IProductDoc {
  _id: string;
  name: string;
  description: string;
  estimatedPrice: number;
  amountType: AmountType;
}

const productSchema = new Schema({
  _id: String,
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  estimatedPrice: {
    type: Number,
    required: true,
  },
  amountType: {
    type: String,
    enum: Object.values(AmountType),
    required: true,
  },
});

productSchema.index({name : "text"});

const Product = mongoose.model("Product", productSchema);

export {
  Product,
};
