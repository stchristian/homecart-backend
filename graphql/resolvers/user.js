const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require("../../models")

module.exports = {
  users: async () => {
    try {
      const users = await User.find()
      return users.map(user => ({
        ...user._doc,
        password: null,
      }))
    } catch (err) {
      throw err
    }
  },

  uploadMoney: async ({ amount }, { user, isAuth }) => {
    if (!isAuth) {
      throw new Error("Unauthenticated. Please log in.")
    }
    user.balance += amount
    const savedUser = await user.save()
    return {
      ...savedUser._doc,
      password: null
    }
  },
  
  applyForCourier: async (args, request) => {
    if (!request.isAuth) {
      throw new Error("Unauthenticated. Please log in.")
    }
    if(request.user.isCourier) {
      return true
    } else {
      request.user.isCourier = true
      const user = await request.user.save()
      return user.isCourier
    }
  },
  userById: async ({ id }, request) => {
    if (!request.isAuth) {
      throw new Error("Unauthenticated. Please log in.")
    }
    try {
      const user = await User.findById(id).populate('orders')
      return {
        ...user._doc,
        orders: user.orders.map(order => ({
          ...order._doc
        })),
        password: null
      }
    } catch (error) {
      throw err
    }
  },
  createUser: async ({ userData }) => {
    try {
      console.log(userData)
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      const user = await User.create({
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        addresses: userData.address ? new Array(userData.address) : [],
        biography: userData.biography ? userData.biography : undefined,
      })
      console.log(user)
      return {
        ...user._doc,
        password: null
      }
    } catch (error) {
      throw error
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
}