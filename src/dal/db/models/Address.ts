import { Schema } from "mongoose";

const addressSchema = new Schema({
  city: {
    type: String,
    required: true,
  },
  streetAddress: {
    type: String,
    required: true,
  },
  zip: {
    type: Number,
    required: true,
  },
}, {
  _id: false,
});

export {
  addressSchema,
};
