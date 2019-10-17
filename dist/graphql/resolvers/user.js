var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require("../../models");
module.exports = {
    users: () => __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield User.find();
            return users.map(user => (Object.assign(Object.assign({}, user._doc), { password: null })));
        }
        catch (err) {
            throw err;
        }
    }),
    uploadMoney: ({ amount }, { user, isAuth }) => __awaiter(this, void 0, void 0, function* () {
        if (!isAuth) {
            throw new Error("Unauthenticated. Please log in.");
        }
        user.balance += amount;
        const savedUser = yield user.save();
        return Object.assign(Object.assign({}, savedUser._doc), { password: null });
    }),
    applyForCourier: (args, request) => __awaiter(this, void 0, void 0, function* () {
        if (!request.isAuth) {
            throw new Error("Unauthenticated. Please log in.");
        }
        if (request.user.isCourier) {
            return true;
        }
        else {
            request.user.isCourier = true;
            const user = yield request.user.save();
            return user.isCourier;
        }
    }),
    userById: ({ id }, request) => __awaiter(this, void 0, void 0, function* () {
        if (!request.isAuth) {
            throw new Error("Unauthenticated. Please log in.");
        }
        try {
            const user = yield User.findById(id).populate('orders');
            return Object.assign(Object.assign({}, user._doc), { orders: user.orders.map(order => (Object.assign({}, order._doc))), password: null });
        }
        catch (error) {
            throw err;
        }
    }),
    createUser: ({ userData }) => __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(userData);
            const hashedPassword = yield bcrypt.hash(userData.password, 12);
            const user = yield User.create({
                email: userData.email,
                password: hashedPassword,
                firstName: userData.firstName,
                lastName: userData.lastName,
                phoneNumber: userData.phoneNumber,
                addresses: userData.address ? new Array(userData.address) : [],
                biography: userData.biography ? userData.biography : undefined,
            });
            console.log(user);
            return Object.assign(Object.assign({}, user._doc), { password: null });
        }
        catch (error) {
            throw error;
        }
    }),
    loginUser: ({ credentials }) => __awaiter(this, void 0, void 0, function* () {
        const user = yield User.findOne({ email: credentials.email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = yield bcrypt.compare(credentials.password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        //This should be async later
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
        const expirationDate = new Date();
        expirationDate.setHours(expirationDate.getHours() + 24);
        console.log(`expiration: ${expirationDate.toISOString()}`);
        return {
            userId: user.id,
            token: token,
            expirationDate: expirationDate.toISOString()
        };
    }),
};
//# sourceMappingURL=user.js.map