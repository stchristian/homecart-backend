"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v4_1 = __importDefault(require("uuid/v4"));
class Product {
    static create(input) {
        const product = new Product();
        product.id = v4_1.default();
        product.name = input.name;
        product.description = input.description;
        product.estimatedPrice = input.estimatedPrice;
        return product;
    }
}
exports.Product = Product;
//# sourceMappingURL=Product.js.map