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

productSchema.index({ name: "text" });
// @ts-ignore
productSchema.pre(/find/, function () {
  // @ts-ignore
  this.start = Date.now();
  console.log("Before productSchema.find()");
});

productSchema.post(/find/, function () {
  console.log(`After productSchema.find() ${Date.now() - this.start}ms`);
});
const Product = mongoose.model("Product", productSchema);

export {
  Product,
};
