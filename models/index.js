const mongoose = require('mongoose')
const User = require('./User')
const Order = require('./Order')
const Product = require('./Product')

mongoose.connect(process.env.MONGODB_CONNECT_STRING, function (err) {
  if (err) {
    throw err
  }
  console.log('Successfully connected to db...')
})

module.exports = {
  User,
  Order,
  Product
}