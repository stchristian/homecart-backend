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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./dal/db");
const graphql_import_1 = require("graphql-import");
const apollo_server_1 = require("apollo-server");
const graphql_tools_1 = require("graphql-tools");
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const directives_1 = __importDefault(require("./graphql/directives"));
const dataloaders_1 = __importDefault(require("./graphql/dataloaders"));
const config_1 = __importDefault(require("./inversify/config"));
const types_1 = require("./inversify/types");
const typeDefs = graphql_import_1.importSchema("./src/graphql/schema.graphql");
class App {
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.initDb();
            this.setUpDIContainer();
            const schema = graphql_tools_1.makeExecutableSchema({
                typeDefs,
                resolvers: resolvers_1.default,
                resolverValidationOptions: {
                    requireResolversForResolveType: false,
                },
                schemaDirectives: Object.assign({}, directives_1.default),
            });
            const server = new apollo_server_1.ApolloServer({
                schema,
                context: ({ req }) => __awaiter(this, void 0, void 0, function* () {
                    console.log("NEW REQUEST");
                    const authHeaderSplitted = req.headers.authorization.split(" ");
                    const result = yield this.services.authenticationService.verifyToken(authHeaderSplitted[1]);
                    return Object.assign(Object.assign(Object.assign(Object.assign({}, this.services), { req }), dataloaders_1.default(this.services)), { currentUser: result.user });
                }),
            });
            const { url } = yield server.listen();
            console.log(`Apollo server started on ${url}...`);
        });
    }
    setUpDIContainer() {
        this.DIContainer = config_1.default();
        this.services = {
            authenticationService: this.DIContainer.get(types_1.TYPES.IAuthenticationService),
            userService: this.DIContainer.get(types_1.TYPES.IUserService),
            productService: this.DIContainer.get(types_1.TYPES.IProductService),
            orderService: this.DIContainer.get(types_1.TYPES.IOrderService),
        };
    }
}
exports.default = App;
//# sourceMappingURL=app.js.map