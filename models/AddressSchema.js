const mongoose = require('mongoose')
const Schema = mongoose.Schema

const addressSchema = new Schema({
  city: {
    type: String,
    required: true
  },
  streetAddress: {
    type: String,
    required: true
  },
  zip: {
    type: Number,
    required: true
  }
}, {
  _id: false  
})

module.exports = addressSchema