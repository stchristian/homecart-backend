const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  estimatedPrice: {
    type: Number,
    required: true
  }
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product