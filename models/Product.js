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

productSchema.index({name : 'text'})

const Product = mongoose.model('Product', productSchema)

module.exports = Product