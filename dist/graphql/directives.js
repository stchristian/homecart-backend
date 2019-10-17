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
const graphql_tools_1 = require("graphql-tools");
const graphql_1 = require("graphql");
const apollo_server_1 = require("apollo-server");
class AuthDirective extends graphql_tools_1.SchemaDirectiveVisitor {
    visitObject(type) {
        const neededRole = this.args.role;
        this.ensureFieldsWrapped(type, neededRole);
    }
    visitFieldDefinition(field) {
        const { resolve = graphql_1.defaultFieldResolver } = field;
        const neededRole = this.args.role;
        field.resolve = function (...args) {
            return __awaiter(this, void 0, void 0, function* () {
                const context = args[2];
                if (!context.currentUser) {
                    throw new apollo_server_1.AuthenticationError(`You must be authenticated for this field: ${field.name}`);
                }
                if (neededRole && !context.currentUser.roles.includes(neededRole)) {
                    throw new apollo_server_1.AuthenticationError(`You have no right for this field ${field.name}`);
                }
                return resolve.apply(this, args);
            });
        };
    }
    ensureFieldsWrapped(objectType, neededRole) {
        const fields = objectType.getFields();
        Object.keys(fields).forEach((fieldName) => {
            const field = fields[fieldName];
            const { resolve = graphql_1.defaultFieldResolver } = field;
            field.resolve = function (...args) {
                return __awaiter(this, void 0, void 0, function* () {
                    const context = args[2];
                    if (context.currentUser) {
                        throw new apollo_server_1.AuthenticationError(`You must be authenticated for this field ${field.name}`);
                    }
                    if (neededRole && !context.currentUser.roles.includes(neededRole)) {
                        throw new apollo_server_1.AuthenticationError(`You have no right for this field ${field.name}`);
                    }
                    return resolve.apply(this, args);
                });
            };
        });
    }
}
exports.default = {
    auth: AuthDirective,
};
//# sourceMappingURL=directives.js.map