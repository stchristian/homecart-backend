"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = __importDefault(require("./app"));
const app = new app_1.default();
app.run()
    .then(() => {
    console.log("App started successfully...");
})
    .catch((err) => {
    console.log("Error when running App... Error message: " + err.message);
});
//# sourceMappingURL=index.js.map