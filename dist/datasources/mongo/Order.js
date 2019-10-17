var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const { MongoDataSource } = require('apollo-datasource-mongodb');
const ObjectId = require('mongodb').ObjectID;
class Orders extends MongoDataSource {
    transformOrder(order) {
        return Object.assign(Object.assign({}, order), { id: order._id.toString() });
    }
    transformOrders(orders) {
        return orders.map(this.transformOrder);
    }
    getManyByIds(orderIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.findManyByIds(orderIds);
            return this.transformOrders(orders);
        });
    }
    // async getCourierOrdersByUser(user) {
    //   await this.getAllOrders.
    // }
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orders.find().toArray();
            return this.transformOrders(orders);
        });
    }
    getOrdersByUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orders.find({ customer: user._id }).toArray();
            return this.transformOrders(orders);
        });
    }
    getPostedOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orders.find({
                state: 'POSTED'
            }).toArray();
            return this.transformOrders(orders);
        });
    }
}
module.exports = Orders;
//# sourceMappingURL=Order.js.map