const { Order } = require('../../models')

module.exports = {
  orders: async ({ ordersQuery }) => {
    const orders = await Order.find()
      .populate('customer')
      .populate('courier')
      .populate('items.product')
    const result = orders.map(order => ({
      ...order._doc,
      createdAt: (new Date(order.createdAt)).toISOString()
    }))
    return result
  },
  
  createOrder: async ({ orderData }, request) => {
    if(!request.isAuth) {
      throw new Error("Unauthenticated. Please log in.")
    }
    console.log(orderData)

    let parsedDelTime
    if (orderData.preferredDeliveryTime) {
      parsedDelTime = {
        start: new Date(orderData.preferredDeliveryTime.start),
        end: new Date(orderData.preferredDeliveryTime.end)
      }
    }

    const newOrder = await Order.create({
      customer: request.userId,
      state: 'POSTED',
      items: orderData.items.map(item => ({
        amount: item.amount,
        amountType: item.amountType,
        product: item.productId
      })),
      address: orderData.address,
      deadline: new Date(orderData.deadline),
      totalPrice: 0,
      preferredDeliveryTime: parsedDelTime,
    })

    return {
      ...newOrder._doc
    }
  },

}