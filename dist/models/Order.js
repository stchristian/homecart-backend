"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
var OrderState;
(function (OrderState) {
    OrderState["POSTED"] = "POSTED";
    OrderState["ASSIGNED"] = "ASSIGNED";
    OrderState["PURCHASED"] = "PURCHASED";
    OrderState["COMPLETED"] = "COMPLETED";
    OrderState["EXPIRED"] = "EXPIRED";
})(OrderState = exports.OrderState || (exports.OrderState = {}));
var AmountType;
(function (AmountType) {
    AmountType["MASS"] = "MASS";
    AmountType["PIECE"] = "PIECE";
    AmountType["LENGTH"] = "LENGTH";
    AmountType["AREA"] = "AREA";
})(AmountType = exports.AmountType || (exports.AmountType = {}));
class Order {
    constructor() {
        this.courierId = null;
        this.totalPrice = 0;
        this.realPrice = 0;
    }
    static create(input) {
        const order = new Order();
        order.id = v4_1.default();
        order.createdAt = new Date();
        order.deadline = input.deadline;
        order.preferredDeliveryTime = input.preferredDeliveryTime;
        order.address = input.address;
        order.customerId = input.customerId;
        order.tipPrice = input.tipPrice;
        order.items = input.items;
        order.state = OrderState.POSTED;
        order.estimatedPrice = input.estimatedPrice;
        return order;
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map