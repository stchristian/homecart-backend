import { Container } from "inversify";
import { IOrderDao } from "../dal/dao/IOrderDao";
import { IProductDao } from "../dal/dao/IProductDao";
import { IUserDao } from "../dal/dao/IUserDao";
import { ProductDao } from "../dal/dao/ProductDao";
import { UserDao } from "../dal/dao/UserDao";
import { OrderDao } from "../dal/dao/OrderDao";
import { AuthenticationService } from "../services/AuthenticationService";
import { IAuthenticationService } from "../services/IAuthenticationService";
import { IOrderService } from "../services/IOrderService";
import { IProductService } from "../services/IProductService";
import { IUserService } from "../services/IUserService";
import { OrderService } from "../services/OrderService";
import { ProductService } from "../services/ProductService";
import { UserService } from "../services/UserService";
import { TYPES } from "./types";

export default function() {
  const myContainer = new Container();
  myContainer.bind<IAuthenticationService>(TYPES.IAuthenticationService).to(AuthenticationService).inSingletonScope();
  myContainer.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
  myContainer.bind<IProductService>(TYPES.IProductService).to(ProductService).inSingletonScope();
  myContainer.bind<IOrderService>(TYPES.IOrderService).to(OrderService).inSingletonScope();
  myContainer.bind<IUserDao>(TYPES.IUserDao).to(UserDao).inSingletonScope();
  myContainer.bind<IOrderDao>(TYPES.IOrderDao).to(OrderDao).inSingletonScope();
  myContainer.bind<IProductDao>(TYPES.IProductDao).to(ProductDao).inSingletonScope();
  return myContainer;
}
