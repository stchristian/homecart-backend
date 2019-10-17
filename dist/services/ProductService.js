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
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
require("reflect-metadata");
const types_1 = require("../inversify/types");
const Product_1 = require("../models/Product");
let ProductService = class ProductService {
    constructor(productDao) {
        this.productDao = productDao;
    }
    getProductById(productId) {
        return this.productDao.getProductById(productId);
    }
    getProductsByIds(ids) {
        return this.productDao.getManyByIds(ids);
    }
    getAllProducts() {
        return this.productDao.getAllProducts();
    }
    createProduct(data) {
        const product = Product_1.Product.create(data);
        return this.productDao.saveProduct(product);
    }
    search(text) {
        return this.productDao.searchProducts(text);
    }
};
ProductService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.IProductDao)),
    __metadata("design:paramtypes", [Object])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map