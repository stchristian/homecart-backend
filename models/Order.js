const mongoose = require('mongoose')
const addressSchema = require('./AddressSchema')

const Schema = mongoose.Schema

const orderItemSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  amountType: {
    type: String,
    enum: ['MASS', 'PIECE', 'LENGTH', 'AREA'],
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: {
    type: Number,
    default: 0
  }
}, { _id: false })

const orderSchema = new Schema({
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  state: {
    type: String,
    enum: [
      'CREATED', 
      'POSTED',
      'ASSIGNED',
      'COMPLETED',
      'EXPIRED'
    ]
  },
  items: [orderItemSchema],
  address: {
    type: addressSchema,
    required: true
  },
  courier: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  deadline: {
    type: Date,
    required: true,
  },
  preferredDeliveryTime: {
    type: new Schema({
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      }
    }, { _id: false })
  },
  totalPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: {
    createdAt: 'createdAt'
  }
})

const Order = mongoose.model('Order', orderSchema)

module.exports = Order