"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_iso_date_1 = require("graphql-iso-date");
exports.default = {
    DateTime: graphql_iso_date_1.GraphQLDateTime,
    Query: {
        me: (_, __, { currentUser }) => {
            return currentUser;
        },
        userById: (_, { id }, { userService }) => {
            return userService.getUserById(id);
        },
        users: (_, __, { userService }) => {
            return userService.getAllUsers();
        },
        products: (_, args, { productService }) => {
            if (args.search) {
                return productService.search(args.search);
            }
            return productService.getAllProducts();
        },
        myOrders: (_, __, { currentUser, orderService }) => {
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
        createUser: (_, { createUserInput }, { userService }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield userService.createUser(createUserInput);
            // Make response object
            return {
                success: true,
                message: "User successfully created.",
                user,
            };
        }),
        // Y
        createOrder: (_, { createOrderInput }, { orderService, currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            const order = yield orderService.createOrder(Object.assign(Object.assign({}, createOrderInput), { customerId: currentUser.id }));
            return {
                success: true,
                message: "Order successully created",
                order,
            };
        }),
        // Y
        createProduct: (_, { createProductInput }, { productService }) => __awaiter(void 0, void 0, void 0, function* () {
            const product = yield productService.createProduct(createProductInput);
            return {
                success: true,
                message: "Product created successfully!",
                product,
            };
        }),
        // Y
        uploadMoney: (_, { uploadMoneyInput }, { userService, currentUser }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield userService.uploadMoney({
                userId: currentUser.id,
                amount: uploadMoneyInput.amount,
            });
            return {
                success: true,
                message: "Success",
                user,
            };
        }),
        // Y
        loginUser: (_, { loginUserInput }, { authenticationService }) => __awaiter(void 0, void 0, void 0, function* () {
            return authenticationService.loginUser(loginUserInput);
        }),
        // Y
        applyForCourier: (_, __, { currentUser, userService }) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield userService.applyForCourier(currentUser.id);
            return {
                success: true,
                message: "You are now a courier",
                user,
            };
        }),
        // Y
        signUpForOrder: (_, { signUpForOrderInput }, { currentUser, orderService }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const order = yield orderService.setCourierForOrder({
                    orderId: signUpForOrderInput.orderId,
                    courierId: currentUser.id,
                });
                return {
                    success: true,
                    message: "Successfully signed up for order",
                    order,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }
        }),
        // Y
        itemsPurchasedForOrder: (_, { itemsPurchasedForOrderInput }, { currentUser, orderService }) => __awaiter(void 0, void 0, void 0, function* () {
            const { orderId, realPrice } = itemsPurchasedForOrderInput;
            try {
                const order = yield orderService.itemsPurchased({
                    orderId,
                    realPrice,
                    courierId: currentUser.id,
                });
                return {
                    success: true,
                    message: "Real price set for order",
                    order,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }
        }),
        // Y
        verifyPurchaseForOrder: (_, { verifyPurchaseForOrderInput }, { currentUser, orderService }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const order = yield orderService.verifyItemsPurchased({
                    orderId: verifyPurchaseForOrderInput.orderId,
                    verifierId: currentUser.id,
                });
                return {
                    success: true,
                    message: "Yea boi",
                    order,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }
        }),
    },
    User: {
        courierOrders: (user, _, { currentUser, orderLoader }) => {
            return orderLoader.loadMany(user.courierOrderIds);
        },
        orders: (user, _, { currentUser, orderLoader }) => {
            return orderLoader.loadMany(user.orderIds);
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
    },
};
//# sourceMappingURL=index.js.map