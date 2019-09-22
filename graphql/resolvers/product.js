const { Product } = require('../../models')

module.exports = {
  products: async ({ search }) => {
    let products = []
    try {
      if (search) {
        console.log(search)
        products = await Product.find({ 
          name: {
            $regex: search,
            $options: 'i'
          }
        })
      } else {
        products = await Product.find()
      }
      return products.map(product => ({
        ...product._doc
      }))
    } catch (error) {
      throw err
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