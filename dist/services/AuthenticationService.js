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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const inversify_1 = require("inversify");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("reflect-metadata");
const types_1 = require("../inversify/types");
let AuthenticationService = class AuthenticationService {
    constructor(userDao) {
        this.userDao = userDao;
    }
    verifyToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let decodedToken;
            try {
                decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            }
            catch (err) {
                return {
                    success: false,
                    message: err.message,
                    user: null,
                };
            }
            if (!decodedToken) {
                return {
                    success: false,
                    message: "Cannot decode token...",
                    user: null,
                };
            }
            try {
                const user = yield this.userDao.getUserById(decodedToken.userId);
                return {
                    success: true,
                    message: "Successful",
                    user,
                };
            }
            catch (error) {
                return {
                    success: false,
                    message: error.message,
                };
            }
        });
    }
    loginUser(credentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userDao.getUserByEmail(credentials.email);
            if (!user) {
                return {
                    success: false,
                    message: "No user with the given email address",
                };
            }
            const isEqual = yield bcryptjs_1.default.compare(credentials.password, user.password);
            if (!isEqual) {
                return {
                    success: false,
                    message: "Passsword incorrect",
                };
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET);
            const expirationDate = new Date();
            expirationDate.setHours(expirationDate.getHours() + 24);
            console.log(`expiration: ${expirationDate.toISOString()}`);
            return {
                success: true,
                message: "Logged in successfully",
                token,
                expirationDate,
            };
        });
    }
};
AuthenticationService = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.IUserDao)),
    __metadata("design:paramtypes", [Object])
], AuthenticationService);
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=AuthenticationService.js.map