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
require("reflect-metadata");
const Product_1 = require("../../models/Product");
const db_1 = require("../db");
/**
 *  Persist products into db
 */
let ProductDao = class ProductDao {
    constructor() {
        this.loader = null;
        this.products = db_1.getDb().collection("products");
        this.products.createIndex({ name: "text" });
    }
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (this.loader === null) {
            //   this.loader = new DataLoader(this.getManyByIds.bind(this));
            // }
            const product = yield this.products.findOne({ _id: id });
            if (!product) {
                throw new Error(`No product with id ${id}`);
            }
            // return this.loader.load(id);
            return this.transformFromDoc(product);
        });
    }
    searchProducts(text) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield this.products.find({ $text: { $search: text } }).toArray();
            return products.map((doc) => this.transformFromDoc(doc));
        });
    }
    getManyByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Product ids requested ${ids}`);
            // this.loader = null;
            const result = yield this.products.find({
                _id: {
                    $in: ids,
                },
            }).toArray();
            return result.map((doc) => this.transformFromDoc(doc));
        });
    }
    getAllProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.products.find().toArray();
            return result.map((doc) => this.transformFromDoc(doc));
        });
    }
    saveProduct(product) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.products.replaceOne({
                _id: product.id,
            }, this.transformToDoc(product), {
                upsert: true,
            });
            if (result.ops.length === 0) {
                throw new Error("Failed to save product to db");
            }
            return this.transformFromDoc(result.ops[0]);
        });
    }
    deleteProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.products.deleteOne({
                _id: id,
            });
        });
    }
    transformFromDoc(doc) {
        const product = new Product_1.Product();
        product.id = doc._id;
        product.name = doc.name;
        product.description = doc.description;
        product.estimatedPrice = doc.estimatedPrice;
        return product;
    }
    transformToDoc(product) {
        return {
            _id: product.id,
            name: product.name,
            description: product.description,
            estimatedPrice: product.estimatedPrice,
        };
    }
};
ProductDao = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], ProductDao);
exports.ProductDao = ProductDao;
//# sourceMappingURL=ProductDao.js.map