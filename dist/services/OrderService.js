"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../inversify/types");
const Order_1 = require("../models/Order");
let OrderService = class OrderService {
    constructor(orderDao, userDao, userService, productService) {
        this.orderDao = orderDao;
        this.userService = userService;
        this.productService = productService;
        this.userDao = userDao;
    }
    getOrdersByIds(orderIds) {
        return this.orderDao.getManyByIds(orderIds);
    }
    getOrdersByUserId(userId) {
        return this.orderDao.getOrdersByUserId(userId);
    }
    getCourierOrdersByUserId(userId) {
        return this.orderDao.getOrdersByCourierId(userId);
    }
    setCourierForOrder(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userService.getUserById(options.courierId);
            if (!user.isCourier) {
                throw new Error("User is not a courier");
            }
            const order = yield this.orderDao.getOrderById(options.orderId);
            if (order.state !== Order_1.OrderState.POSTED) {
                throw new Error("Order is not in POSTED state");
            }
            user.courierOrderIds.push(order.id);
            order.state = Order_1.OrderState.ASSIGNED;
            order.courierId = options.courierId;
            yield this.userDao.saveUser(user);
            return this.orderDao.saveOrder(order);
        });
    }
    itemsPurchased(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderDao.getOrderById(options.orderId);
            if (order.courierId !== options.courierId) {
                throw Error("You are not the courier.");
            }
            if (order.state !== Order_1.OrderState.ASSIGNED) {
                throw Error("Order is not in ASSIGNED state.");
            }
            else {
                order.state = Order_1.OrderState.PURCHASED;
                order.realPrice = options.realPrice;
                order.totalPrice = order.tipPrice + order.realPrice;
            }
            return this.orderDao.saveOrder(order);
        });
    }
    verifyItemsPurchased(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderDao.getOrderById(options.orderId);
            if (order.state !== Order_1.OrderState.PURCHASED || order.customerId !== options.verifierId) {
                throw new Error("Order is not PURCHASED or you are not the customer.");
            }
            else {
                const customer = yield this.userService.getUserById(order.customerId);
                const courier = yield this.userService.getUserById(order.courierId);
                if (customer.balance < order.totalPrice) {
                    throw new Error("You are poor my friend.");
                }
                order.state = Order_1.OrderState.COMPLETED;
                customer.balance -= order.totalPrice;
                courier.balance += order.totalPrice;
                return this.orderDao.saveOrder(order);
            }
        });
    }
    getPostedOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.orderDao.getPostedOrders();
        });
    }
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let estimatedPrice = data.tipPrice;
            for (const item of data.items) {
                const product = yield this.productService.getProductById(item.productId);
                estimatedPrice += product.estimatedPrice * item.amount;
            }
            const order = Order_1.Order.create(Object.assign(Object.assign({}, data), { estimatedPrice }));
            const user = yield this.userDao.getUserById(data.customerId);
            user.orderIds.push(order.id);
            yield this.userDao.saveUser(user);
            return this.orderDao.saveOrder(order);
        });
    }
    getAssignedOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.orderDao.getAssignedOrdersByUserId(userId);
        });
    }
};
OrderService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.IOrderDao)),
    __param(1, inversify_1.inject(types_1.TYPES.IUserDao)),
    __param(2, inversify_1.inject(types_1.TYPES.IUserService)),
    __param(3, inversify_1.inject(types_1.TYPES.IProductService)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map