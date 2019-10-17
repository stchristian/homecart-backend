import { SchemaDirectiveVisitor } from "graphql-tools";
import { defaultFieldResolver } from "graphql";
import { AuthenticationError } from "apollo-server";

class AuthDirective extends SchemaDirectiveVisitor {
  public visitObject(type) {
    const neededRole = this.args.role;
    this.ensureFieldsWrapped(type, neededRole);
  }

  public visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const neededRole = this.args.role;
    field.resolve = async function(...args) {
      const context = args[2];
      if (!context.currentUser) {
        throw new AuthenticationError(`You must be authenticated for this field: ${field.name}`);
      }
      if (neededRole && !context.currentUser.roles.includes(neededRole)) {
        throw new AuthenticationError(`You have no right for this field ${field.name}`);
      }
      return resolve.apply(this, args);
    };
  }

  public ensureFieldsWrapped(objectType, neededRole) {
    const fields = objectType.getFields();

    Object.keys(fields).forEach((fieldName) => {
      const field = fields[fieldName];
      const { resolve = defaultFieldResolver } = field;
      field.resolve = async function(...args) {
        const context = args[2];
        if (context.currentUser) {
          throw new AuthenticationError(`You must be authenticated for this field ${field.name}`);
        }
        if (neededRole && !context.currentUser.roles.includes(neededRole)) {
          throw new AuthenticationError(`You have no right for this field ${field.name}`);
        }
        return resolve.apply(this, args);
      };
    });
  }
}

export default {
  auth: AuthDirective,
};
