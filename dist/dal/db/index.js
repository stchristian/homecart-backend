"use strict";
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
const mongodb_1 = require("mongodb");
let db = null;
function initDb() {
    return __awaiter(this, void 0, void 0, function* () {
        const client = new mongodb_1.MongoClient(process.env.MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        yield client.connect();
        mongodb_1.Logger.setLevel("debug");
        mongodb_1.Logger.filter("class", ["Db"]);
        db = client.db();
        console.log("Connected succesfully to MongoDB database...");
    });
}
exports.initDb = initDb;
function getDb() {
    if (!db) {
        throw Error("Db is not initialized. Initialize with initDb()");
    }
    return db;
}
exports.getDb = getDb;
//# sourceMappingURL=index.js.map