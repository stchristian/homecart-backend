import { initDb } from "./dal/db";
import { importSchema } from "graphql-import";
import { ApolloServer } from "apollo-server";
import { makeExecutableSchema } from "graphql-tools";
import resolvers from "./graphql/resolvers";
import directives from "./graphql/directives";
import { Container } from "inversify";
import getLoaders, { Services } from "./graphql/dataloaders";
import config from "./inversify/config";
import { TYPES } from "./inversify/types";
import { IAuthenticationService } from "./services/IAuthenticationService";
import { IOrderService } from "./services/IOrderService";
import { IProductService } from "./services/IProductService";
import { IUserService } from "./services/IUserService";
const typeDefs = importSchema("./schema.graphql");

export default class App {
  private DIContainer: Container;
  private services: Services;

  public async run(): Promise<any> {
    await initDb();
    this.setUpDIContainer();

    const schema = makeExecutableSchema({
      typeDefs,
      resolvers,
      resolverValidationOptions: {
        requireResolversForResolveType: false,
      },
      schemaDirectives: {
        ...directives,
      },
    });
    const server = new ApolloServer({
      schema,
      context: async ({ req }) => {
        const authHeaderSplitted = req.headers.authorization.split(" ");
        const result = await this.services.authenticationService.verifyToken(authHeaderSplitted[1]);
        return {
          ...this.services,
          req,
          ...getLoaders(this.services),
          currentUser: result.user,
        };
      },
    });
    const { url } = await server.listen();
    console.log(`Apollo server started on ${url}...`);
  }

  private setUpDIContainer() {
    this.DIContainer = config();
    this.services = {
      authenticationService: this.DIContainer.get<IAuthenticationService>(TYPES.IAuthenticationService),
      userService : this.DIContainer.get<IUserService>(TYPES.IUserService),
      productService : this.DIContainer.get<IProductService>(TYPES.IProductService),
      orderService : this.DIContainer.get<IOrderService>(TYPES.IOrderService),
    };
  }
}
