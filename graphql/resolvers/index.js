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
    return mockedUsers
  },
  loginUser: async ({ credentials }) => {
    return mockedToken
  },
  products: async () => {
    return mockedProducts
  },
  orders: async ({ ordersQuery }) => {
    return mockedOrders
  },
  createUser: async ({ userData }) => {
    const newUser = {
      _id: mockedUsers.length + 1,
      email: userData.email,
      password: userData.password, 
      firstName: userData.firstName,
      lastName: userData.lastName,
      phoneNumber: userData.phoneNumber,
      addresses: [],
      isCourier: false,
      courierOrders: [],
    }
    newUser.addresses.push(userData.address)
    mockedUsers.push(newUser)
    return newUser
  },
  createOrder: async ({ orderData }) => {
    //This 
    // const newOrder = {
    //   ...orderData,
    //   _id: mockedOrders++,
    //   customer: 1,
    //   state: 'CREATED',
    //   courier: null,
    //   totalPrice: orderData.items.reduce((total, current) => {
    //     return total + current.price
    //   }, 0)
    // }
  }
}
  