import { IUserDao } from "../dal/dao/IUserDao";
import { IProductDao } from "../dal/dao/IProductDao";
import { IAuthenticationService } from "../services/IAuthenticationService";
import { IOrderService } from "../services/IOrderService";
import { IUserService } from "../services/IUserService";
import { IProductService } from "../services/IProductService";
import DataLoader = require("dataloader");
import { User } from "../models/User";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { IAdminService } from "../services/IAdminService";

export interface Context {
  userRepository: IUserDao
  productRepository: IProductDao
  authenticationService : IAuthenticationService,
  orderService: IOrderService,
  userService: IUserService,
  productService: IProductService,
  adminService: IAdminService,
  userLoader: DataLoader<string, User>,
  orderLoader: DataLoader<string, Order>,
  productLoader: DataLoader<string, Product>,
  currentUser: User,
  req: any
}

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}