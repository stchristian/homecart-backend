import mongoose, { Schema, Document } from "mongoose";

import { AmountType } from "../../../enums";

export interface IProduct {
  name: string;
  description: string;
  estimatedPrice: number;
  amountType: AmountType;
}

export interface IProductDocument extends Document, IProduct {

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

const Product = mongoose.model<IProductDocument>("Product", productSchema);

export {
  Product,
};
