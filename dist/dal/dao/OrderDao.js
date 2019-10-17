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
const Order_1 = require("../../models/Order");
const index_1 = require("../db/index");
/**
 *  Persist orders into db
 */
let OrderDao = class OrderDao {
    constructor() {
        this.orders = index_1.getDb().collection("orders");
    }
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDoc = yield this.orders.findOne({ _id: id });
            if (!userDoc) {
                throw new Error("No order with the given id");
            }
            return this.transformFromDoc(userDoc);
        });
    }
    getOrdersByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (user.orderIds.length > 0) {
                const result = yield this.getManyByIds(user.orderIds);
                return result;
            }
            else {
                return [];
            }
        });
    }
    getOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.orders.find({
                customerId: userId,
            }).toArray();
            return result.map((doc) => this.transformFromDoc(doc));
        });
    }
    getPostedOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orders.find({
                state: Order_1.OrderState.POSTED,
            }).toArray();
            return orders.map((order) => this.transformFromDoc(order));
        });
    }
    getOrdersByCourierId(courierId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orders.find({
                courierId,
            }).toArray();
            return orders.map((order) => this.transformFromDoc(order));
        });
    }
    getManyByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.orders.find({
                _id: {
                    $in: ids,
                },
            }).toArray();
            return result.map((doc) => this.transformFromDoc(doc));
        });
    }
    saveOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.orders.replaceOne({
                _id: order.id,
            }, this.transformToDoc(order), {
                upsert: true,
            });
            if (result.ops.length === 0) {
                throw new Error("Failed to save user to db");
            }
            return this.transformFromDoc(result.ops[0]);
        });
    }
    getAssignedOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orders.find({
                state: {
                    $in: [Order_1.OrderState.ASSIGNED, Order_1.OrderState.PURCHASED, Order_1.OrderState.COMPLETED],
                },
                $or: [
                    {
                        courierId: userId,
                    },
                    {
                        customerId: userId,
                    },
                ],
            }).toArray();
            return orders.map((order) => this.transformFromDoc(order));
        });
    }
    transformFromDoc(doc) {
        const order = new Order_1.Order();
        order.id = doc._id,
            order.customerId = doc.customerId,
            order.state = doc.state,
            order.deadline = doc.deadline,
            order.preferredDeliveryTime = doc.preferredDeliveryTime,
            order.courierId = doc.courierId,
            order.createdAt = doc.createdAt,
            order.realPrice = doc.realPrice,
            order.totalPrice = doc.totalPrice,
            order.tipPrice = doc.tipPrice,
            order.items = doc.items,
            order.address = doc.address,
            order.estimatedPrice = doc.estimatedPrice;
        return order;
    }
    transformToDoc(order) {
        return {
            _id: order.id,
            customerId: order.customerId,
            state: order.state,
            deadline: order.deadline,
            preferredDeliveryTime: order.preferredDeliveryTime,
            courierId: order.courierId,
            createdAt: order.createdAt,
            realPrice: order.realPrice,
            totalPrice: order.totalPrice,
            tipPrice: order.tipPrice,
            items: order.items,
            address: order.address,
            estimatedPrice: order.estimatedPrice,
        };
    }
};
OrderDao = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], OrderDao);
exports.OrderDao = OrderDao;
//# sourceMappingURL=OrderDao.js.map