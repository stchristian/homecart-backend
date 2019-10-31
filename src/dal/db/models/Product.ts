import mongoose, { Schema, Document } from "mongoose";

export interface IProduct {
  name: string;
  description: string;
  estimatedPrice: number;
}

export interface IProductDocument extends Document, IProduct {

}

const productSchema = new Schema({
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
});

productSchema.index({name : "text"});

const Product = mongoose.model<IProductDocument>("Product", productSchema);

export {
  Product,
};
