const mongoose = require('mongoose')
const addressSchema = require('./AddressSchema')
const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  isCourier: {
    type: Boolean,
    default: false
  },
  addresses: [addressSchema],
  orders: [{
      type: Schema.Types.ObjectId,
      ref: 'Order'
  }],
  isAdmin: {
    type: Boolean,
    default: false
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User