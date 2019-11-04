import { GraphQLDateTime } from "graphql-iso-date";
import { ResolverMap } from "../../@types/resolver";

export default {
  DateTime: GraphQLDateTime,
  Query: {
    me: (_, __, { currentUser }) => {
      return currentUser;
    },
    userById: (_, { id }, { userService }) => {
      return userService.getUserById(id);
    },
    users: (_, __, { userService}) => {
      return userService.getAllUsers();
    },
    products: (_, args, { productService }) => {
      if (args.search) {
        return productService.search(args.search);
      }
      return productService.getAllProducts();
    },
    myOrders: (_, __, {  currentUser, orderService }) => {
      return orderService.getOrdersByUserId(currentUser.id);
    },
    myJobs: (_, __, { currentUser, orderService }) => {
      return orderService.getCourierOrdersByUserId(currentUser.id);
    },
    postedOrders: (_, __, { orderService }) => {
      return orderService.getPostedOrders();
    },
    myAssignedOrders: (_, __, { currentUser, orderService }) => {
      return orderService.getAssignedOrdersByUserId(currentUser.id);
    },
  },

  Mutation: {
    // Y
    createUser: async (_, { createUserInput }, { userService }) => {
      try {
        const user = await userService.createUser(createUserInput);
        return {
          success: true,
          message: "User successfully created.",
          user,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          user: null,
        };
      }
    },

    // Y
    createOrder: async (_, { createOrderInput }, { orderService, currentUser }) => {
      try {
        const order = await orderService.createOrder({ ...createOrderInput, customerId: currentUser.id });
        return {
          success: true,
          message: "Order successully created",
          order,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          order: null,
        };
      }
    },

    // Y
    createProduct: async (_, { createProductInput }, { productService } ) => {
      const product = await productService.createProduct(createProductInput);
      return {
        success: true,
        message: "Product created successfully!",
        product,
      };
    },

    // Y
    uploadMoney: async (_, { uploadMoneyInput }, { userService, currentUser }) => {
      const user = await userService.uploadMoney({
        userId: currentUser.id,
        amount: uploadMoneyInput.amount,
      });
      return {
        success: true,
        message: "Success",
        user,
      };
    },

    // Y
    loginUser: async (_, { loginUserInput }, { authenticationService }) => {
      return authenticationService.loginUser(loginUserInput);
    },
    // Y
    applyForCourier: async (_, __, { currentUser, userService }) => {
      const user = await userService.applyForCourier(currentUser.id);
      return {
        success: true,
        message: "You are now a courier",
        user,
      };
    },
    // Y
    signUpForOrder: async (_, { signUpForOrderInput }, { currentUser, orderService }) => {
      try {
        const order = await orderService.setCourierForOrder({
          orderId: signUpForOrderInput.orderId,
          courierId: currentUser.id,
        });
        return {
          success: true,
          message: "Successfully signed up for order",
          order,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
    // Y
    itemsPurchasedForOrder: async (_, { itemsPurchasedForOrderInput }, { currentUser, orderService }) => {
      const { orderId, realPrice } = itemsPurchasedForOrderInput;
      try {
        const order = await orderService.itemsPurchased({
          orderId,
          realPrice,
          courierId: currentUser.id,
        });
        return {
          success: true,
          message: "Real price set for order",
          order,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
          order: null,
        };
      }
    },
    // Y
    verifyPurchaseForOrder: async (_, { verifyPurchaseForOrderInput }, { currentUser, orderService }) => {
      try {
        const order = await orderService.verifyItemsPurchased({
          orderId: verifyPurchaseForOrderInput.orderId,
          verifierId: currentUser.id,
        });
        return {
          success: true,
          message: "Yea boi",
          order,
        };
      } catch (error) {
        return {
          success: false,
          message: error.message,
        };
      }
    },
  },

  Order: {
    customer: (order, args, { currentUser, userLoader }) => {
      return userLoader.load(order.customerId);
    },
    courier: (order, args, { currentUser, userLoader }) => {
      if (!!order.courierId) {
        return userLoader.load(order.courierId);
      }
      return null;
    },
  },

  OrderItem: {
    product: (orderItem, args, { productLoader }) => {
      return productLoader.load(orderItem.productId);
    },
    // price: (orderItem, args, { productService }) => {
    //   return 0;
    // },
  },
} as ResolverMap;
