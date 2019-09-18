const { User, Product, Order } = require('../../models')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const mockedUsers = [
  {
    _id: 0,
    email: 'mocked@mocked.com',
    firstName: 'John',
    lastName: 'Williams',
    password: 'pw123',
    phoneNumber: '+36201112222',
    addresses: [
      {
        city: 'Budapest',
        zip: '1123',
        streetAddress: 'Váci utca 2'
      }
    ],
    orders: [],
    isCourier: false,
    courierOrders: []
  },
  {
    _id: 1,
    email: 'mocked11@mockedsecond.com',
    firstName: 'Hans',
    lastName: 'Zimmer',
    password: 'password',
    phoneNumber: '+36203332222',
    addresses: [
      {
        city: 'Budapest',
        zip: '1155',
        streetAddress: 'Mandolin utca 6'
      },
      {
        city: 'Budapest',
        zip: '1007',
        streetAddress: 'Barokk köz 1'
      }
    ],
    orders: [],
    isCourier: false,
    courierOrders: []
  },
  {
    _id: 2,
    email: 'mockedthird@mockingisgood.com',
    firstName: 'Steve',
    lastName: 'Johnson',
    password: 'randompass',
    phoneNumber: '+36201115533',
    addresses: [
      {
        city: 'Miskolc',
        zip: '3333',
        streetAddress: 'Mészáros utca 3'
      }
    ],
    orders: [],
    isCourier: false,
    courierOrders: []
  }
]

const mockedProducts = [
  {
    _id: 111,
    name: 'Főző krumpli',
    estimatedPrice: 500,
    description: 'Főzéshez használatos földben termő kerti zöldség'
  },
  {
    _id: 112,
    name: 'Tej',
    estimatedPrice: 200,
    description: 'Mindenkinek kell egy kis tej. Jagerhez szokták inni'
  },
  {
    _id: 113,
    name: 'Kenyér',
    estimatedPrice: 250,
    description: 'Basic étel'
  }
]

const mockedToken = {
  userId: 1,
  token: 'somerandomstringbest4evergraphqlyeah',
  expireDate: '2011-10-05T14:48:00.000Z'
}

const mockedOrders = []

module.exports = {
  users: async () => {
    try {
      const users = await User.find()
      return users.map(user => ({ 
        ...user._doc,
        password: null
      }))
    } catch (error) {
      throw err
    }
  },
  loginUser: async ({ credentials }) => {
    const user = await User.findOne({ email: credentials.email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(credentials.password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    //This should be async later
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET

    );
    const expirationDate = new Date()
    expirationDate.setHours(expirationDate.getHours() + 24)
    console.log(`expiration: ${expirationDate.toISOString()}`)
    return { 
      userId: user.id, 
      token: token, 
      expirationDate: expirationDate.toISOString()
    };
  },
  products: async () => {
    return mockedProducts
  },
  orders: async ({ ordersQuery }) => {
    return mockedOrders
  },
  createUser: async ({ userData }) => {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      const newUser = await User.create({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        addresses: new Array(userData.address),
      })
      return {
        ...newUser._doc,
        password: null
      }
    } catch (error) {
      throw err
    }
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
  createProduct: async({ productData }, request) => {
    if(!request.isAuth) {
      throw new Error("Unauthenticated. Please log in.")
    }
    const newProduct = await Product.create({
      ...productData
    })
    return {
      ...newProduct._doc
    }
  }
}
  