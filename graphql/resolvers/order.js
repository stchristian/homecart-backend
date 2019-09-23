const { Order } = require('../../models')

module.exports = {
  orders: async ({ ordersQuery }) => {
    const orders = await Order.find()
      .populate('customer')
      .populate('courier')
      .populate('items.product')
    const result = orders.map(order => ({
      ...order._doc,
      createdAt: (new Date(order.createdAt)).toISOString(),
      preferredDeliveryTime: {
        start: order.preferredDeliveryTime.start.toISOString(),
        end: order.preferredDeliveryTime.end.toISOString()
      }
    }))
    return result
  },
  
  createOrder: async ({ orderData }, request) => {
    if(!request.isAuth) {
      throw new Error("Unauthenticated. Please log in.")
    }

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
    const populated = await Order.populate(newOrder, 'customer')
    console.log(populated._doc)
    return {
      ...populated._doc,
      customer: populated.customer._doc
    }
  },

}