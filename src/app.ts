import { importSchema } from "graphql-import";
import express from "express";
import expressPino from "express-pino-logger";
import pino from "pino";
import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import { User } from "./models/User";
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
import { connectDb } from "./dal/db";
import { IAdminService } from "./services/IAdminService";
const typeDefs = importSchema("./schema.graphql");

export default class App {
  private DIContainer: Container;
  private services: Services;

  public async run(): Promise<any> {
    await connectDb();
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
        let currentUser: User | null = null;
        if (req.headers.authorization) {
          const authHeaderSplitted = req.headers.authorization.split(" ");
          const result = await this.services.authenticationService.verifyToken(authHeaderSplitted[1]);
          currentUser = result.user;
        }
        return {
          ...this.services,
          req,
          ...getLoaders(this.services),
          currentUser,
        };
      },
      introspection: true,
    });
    const app = express();
    const logger = pino({
      prettyPrint: true,
    });
    app.use("/", (req, res) => {
      return res.send("Hello. You requested the backend of my thesis project. Try sending GraphQL requests to /graphql :-)");
    });
    app.use(expressPino({ logger }));
    server.applyMiddleware({ app });
    await app.listen({
      port: process.env.PORT,
    });
    logger.info(`Server started on port ${process.env.PORT}`);
  }

  private setUpDIContainer() {
    this.DIContainer = config();
    this.services = {
      authenticationService: this.DIContainer.get<IAuthenticationService>(TYPES.IAuthenticationService),
      userService : this.DIContainer.get<IUserService>(TYPES.IUserService),
      productService : this.DIContainer.get<IProductService>(TYPES.IProductService),
      orderService : this.DIContainer.get<IOrderService>(TYPES.IOrderService),
      adminService: this.DIContainer.get<IAdminService>(TYPES.IAdminService),
    };
  }
}
