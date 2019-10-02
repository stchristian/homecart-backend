const { Order } = require('../../models')
const { Product } = require('../../models')

module.exports = {
  orders: async ({ ordersQuery }) => {
    let args = {}
    if (ordersQuery.state) {
      args.state = ordersQuery.state
    }
    const orders = await Order.find(args)
      .populate('customer')
      .populate('courier')
      .populate('items.product')
      .sort('-createdAt')
    const result = orders.map(order => ({
      ...order._doc,
      createdAt: (new Date(order.createdAt)).toISOString(),
      preferredDeliveryTime: {
        start: order.preferredDeliveryTime.start.toISOString(),
        end: order.preferredDeliveryTime.end.toISOString()
      },
      deadline: order.deadline.toISOString()
    }))
    return result
  },

  itemsPurchased: async ({ orderId, realPrice }, request) => {
    if (!request.isAuth) {
      throw new Error("Unauthenticated. Please log in.")
    }
    if (!request.user.isCourier) {
      throw new Error("You are not a courier.")
    }
    try {
      const order = await Order.findById(orderId)
      if (!order) {
        throw new Error("No order found with the given orderId.")
      }
      if (order.state !== 'ASSIGNED') {
        throw new Error("This order is already completed or unassigned.")
      }
      console.log(order.courier)
      console.log(request.userId)
      if (order.courier != request.userId) {
        throw new Error("This order is not assigned to you.")
      }
      order.state = 'PURCHASED'
      order.realPrice = realPrice
      order.totalPrice = order.tipPrice + realPrice
      const newOrder = await order.save()
      const populated = await Order.populate(newOrder, ['customer', 'courier'])
      return {
        ...populated._doc,
        customer: populated.customer._doc,
        courier: populated.courier._doc
      }
    } catch (error) {
      throw error
    }
  },
  
  applyForOrder: async ({ orderId }, request) => {
    if(!request.isAuth) {
      throw new Error("Unauthenticated. Please log in.")
    }
    if(!request.user.isCourier) {
      throw new Error("You are not a courier.")
    }
    try {
      const order = await Order.findById(orderId)
      if (!order) {
        throw new Error("No order found with the given orderId.")
      }
      if (order.state === 'ASSIGNED' || order.state === 'COMPLETED' || order.state === 'EXPIRED') {
        throw new Error("You cannot apply to this order.")
      }
      order.state = 'ASSIGNED'
      order.courier = request.user.id
      const newOrder = await order.save()
      const populated = await Order.populate(newOrder, ['customer', 'courier'])
      return {
        ...populated._doc,
        customer: populated.customer._doc,
        courier: populated.courier._doc
      }
    } catch (error) {
      throw error
    }
  },

  myAssignedOrders: async (_, request) => {
    if(!request.isAuth) {
      throw new Error("Unauthenticated. Please log in.")
    }
    try {
      const orders = await Order.find({
        $and: [
          {
            $or: [
              {
                state: 'ASSIGNED'
              },
              {
                state: 'PURCHASED'
              },
              {
                state: 'COMPLETED'
              }
            ],
          },
          {
            $or: [
              {
                customer: request.userId
              },
              {
                courier: request.userId
              }
            ]
          }
        ]  
      })
        .populate('customer')
        .populate('courier')
        .populate('items.product')
      const result = orders.map(order => ({
        ...order._doc,
        createdAt: (new Date(order.createdAt)).toISOString(),
        preferredDeliveryTime: {
          start: order.preferredDeliveryTime.start.toISOString(),
          end: order.preferredDeliveryTime.end.toISOString()
        },
        deadline: order.deadline.toISOString()
      }))
      return result
    } catch (error) {
      throw error
    }
  },

  completeOrder: async ({ orderId }, request) => {
    if(!request.isAuth) {
      throw new Error("Unauthenticated. Please log in.")
    }
    try {
      const order = await Order.findById(orderId).populate(['customer', 'courier'])
      if (!order) {
        throw new Error("No order found with the given orderId.")
      }
      if (order.state !== 'PURCHASED') {
        throw new Error("You cannot complete this order.")
      }
      if (order.customer.id !== request.userId) {
        throw new Error("This is not your order.")
      }
      if (request.user.balance < order.totalPrice) {
        throw new Error("Sorry, you are poor.")
      }
      order.customer.balance -= order.totalPrice
      order.courier.balance += order.totalPrice
      order.state = 'COMPLETED'
      await Promise.all(new Array(order.customer.save(), order.courier.save()))
      const newOrder = await order.save()
      const populated = await Order.populate(newOrder, ['customer', 'courier'])
      return {
        order: {
          ...populated._doc,
          customer: populated.customer._doc,
          courier: populated.courier._doc
        }
      }
    } catch (error) {
      throw error
    }
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
    const productIds = orderData.items.map(item => item.productId)
    const products = await Product.find().where('_id').in(productIds).exec()
    const estimatedPrice = orderData.items.reduce((total, item) => {
      const product = products.find(pr => pr.id == item.productId)
      if (!product) {
        throw Error(`Rossz product id-t adtal meg: ${item.productId}`)
      }
      return total + item.amount * product.estimatedPrice
    }, 0)
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
      estimatedPrice,
      tipPrice: orderData.tipPrice,
      preferredDeliveryTime: parsedDelTime,
    })
    const populated = await Order.populate(newOrder, 'customer')
    console.log(populated._doc)
    return {
      ...populated._doc,
      customer: populated.customer._doc,
      deadline: populated.deadline.toISOString()
    }
  },

}