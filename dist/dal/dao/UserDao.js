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
const User_1 = require("../../models/User");
const index_1 = require("../db/index");
/**
 *  Persist users into db
 */
let UserDao = class UserDao {
    // private loader: DataLoader<string, User> = null;
    constructor() {
        this.users = index_1.getDb().collection("users");
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // if (this.loader === null) {
            //   this.loader = new DataLoader(this.getManyByIds.bind(this));
            // }
            // const user = await this.loader.load(id);
            const user = yield this.users.findOne({ _id: id });
            if (!user) {
                throw new Error(`No user with given id ${id}`);
            }
            return this.transformFromDoc(user);
        });
    }
    getManyByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`UserIds requested from db: ${ids}`);
            // this.loader = null;
            const result = yield this.users.find({
                _id: {
                    $in: ids,
                },
            }).toArray();
            return result.map((doc) => this.transformFromDoc(doc));
        });
    }
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.users.find().toArray();
            return result.map((doc) => this.transformFromDoc(doc));
        });
    }
    // async createUser(user: User) : Promise<User> {
    //   const result = await this.users.insertOne(user.toDoc())
    //   if (result.insertedCount == 0) {
    //     throw new Error(`Failed to insert user into db...`);
    //   }
    //   return User.fromDoc(result.ops[0])
    // }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.users.findOne({ email });
            if (result) {
                return this.transformFromDoc(result);
            }
            else {
                return null;
            }
        });
    }
    saveUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.users.replaceOne({
                _id: user.id,
            }, this.transformToDoc(user), {
                upsert: true,
            });
            if (result.ops.length === 0) {
                throw new Error("Failed to save user to db");
            }
            return this.transformFromDoc(result.ops[0]);
        });
    }
    deleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.users.deleteOne({
                _id: id,
            });
        });
    }
    transformFromDoc(doc) {
        const user = new User_1.User();
        user.id = doc._id;
        user.email = doc.email;
        user.password = doc.password;
        user.firstName = doc.firstName;
        user.lastName = doc.lastName;
        user.phoneNumber = doc.phoneNumber;
        user.balance = doc.balance;
        user.orderIds = doc.orderIds;
        user.addresses = doc.addresses;
        user.roles = doc.roles;
        user.biography = doc.biography;
        user.courierOrderIds = doc.courierOrderIds;
        return user;
    }
    transformToDoc(user) {
        return {
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            biography: user.biography,
            addresses: user.addresses,
            orderIds: user.orderIds,
            roles: user.roles,
            balance: user.balance,
            password: user.password,
            phoneNumber: user.phoneNumber,
            courierOrderIds: user.courierOrderIds,
        };
    }
};
UserDao = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], UserDao);
exports.UserDao = UserDao;
//# sourceMappingURL=UserDao.js.map