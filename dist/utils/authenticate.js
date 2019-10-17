var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const jwt = require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectID;
module.exports = ({ req, users }) => __awaiter(this, void 0, void 0, function* () {
    const authHeader = req.headers.authorization || '';
    if (!authHeader) {
        return null;
    }
    const token = authHeader.split(' ')[1]; //Authorization: Bearer <tokenstring...>
    if (!token || token === '') {
        return null;
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        return null;
    }
    if (!decodedToken) {
        return null;
    }
    console.log(decodedToken);
    const user = yield users.findOne({ _id: ObjectId(decodedToken.userId) });
    console.log(user);
    return user;
});
//# sourceMappingURL=authenticate.js.map