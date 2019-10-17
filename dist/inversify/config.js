"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const ProductDao_1 = require("../dal/dao/ProductDao");
const UserDao_1 = require("../dal/dao/UserDao");
const OrderDao_1 = require("../dal/dao/OrderDao");
const AuthenticationService_1 = require("../services/AuthenticationService");
const OrderService_1 = require("../services/OrderService");
const ProductService_1 = require("../services/ProductService");
const UserService_1 = require("../services/UserService");
const types_1 = require("./types");
function default_1() {
    const myContainer = new inversify_1.Container();
    myContainer.bind(types_1.TYPES.IAuthenticationService).to(AuthenticationService_1.AuthenticationService).inSingletonScope();
    myContainer.bind(types_1.TYPES.IUserService).to(UserService_1.UserService).inSingletonScope();
    myContainer.bind(types_1.TYPES.IProductService).to(ProductService_1.ProductService).inSingletonScope();
    myContainer.bind(types_1.TYPES.IOrderService).to(OrderService_1.OrderService).inSingletonScope();
    myContainer.bind(types_1.TYPES.IUserDao).to(UserDao_1.UserDao).inSingletonScope();
    myContainer.bind(types_1.TYPES.IOrderDao).to(OrderDao_1.OrderDao).inSingletonScope();
    myContainer.bind(types_1.TYPES.IProductDao).to(ProductDao_1.ProductDao).inSingletonScope();
    return myContainer;
}
exports.default = default_1;
//# sourceMappingURL=config.js.map