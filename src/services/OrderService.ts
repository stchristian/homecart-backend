import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IOrderDao } from "../dal/dao/IOrderDao";
import { IUserDao } from "../dal/dao/IUserDao";
import { TYPES } from "../inversify/types";
import { Order } from "../models/Order";
import { OrderState } from "../enums";
import { IOrderService } from "./IOrderService";
import { IProductService } from "./IProductService";
import { IUserService } from "./IUserService";
import { OrderDTO, createOrderInputValidator, CreateOrderInput} from "../dto/OrderDTO";

@injectable()
export class OrderService implements IOrderService {
  private orderDao: IOrderDao;
  private userDao: IUserDao;
  private userService: IUserService;
  private productService: IProductService;

  constructor(
    @inject(TYPES.IOrderDao) orderDao: IOrderDao,
    @inject(TYPES.IUserDao) userDao: IUserDao,
    @inject(TYPES.IUserService) userService: IUserService,
    @inject(TYPES.IProductService) productService: IProductService,

  ) {
    this.orderDao = orderDao;
    this.userService = userService;
    this.productService = productService;
    this.userDao = userDao;
  }

  public getOrdersByIds(orderIds: string[]): Promise<Order[]> {
    return this.orderDao.getManyByIds(orderIds);
  }

  public getOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderDao.getOrdersByUserId(userId);
  }

  public getCourierOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderDao.getOrdersByCourierId(userId);
  }

  public async setCourierForOrder(options: { orderId: string, courierId: string }): Promise<Order> {
    const user = await this.userService.getUserById(options.courierId);
    if (!user.isCourier) {
      throw new Error("User is not a courier");
    }
    const order = await this.orderDao.getOrderById(options.orderId);
    if (order.state !== OrderState.POSTED) {
      throw new Error("Order is not in POSTED state");
    }
    order.state = OrderState.ASSIGNED;
    order.courierId = options.courierId;
    return this.orderDao.saveOrder(order);
  }

  public async itemsPurchased(options: { realPrice: number, orderId: string, courierId: string }): Promise<Order> {
    const order = await this.orderDao.getOrderById(options.orderId);
    if (order.courierId !== options.courierId) {
      throw Error("You are not the courier.");
    }
    if (order.state !== OrderState.ASSIGNED) {
      throw Error("Order is not in ASSIGNED state.");
    } else {
      order.state = OrderState.PURCHASED;
      order.realPrice = options.realPrice;
      order.totalPrice = order.tipPrice + order.realPrice;
    }
    return this.orderDao.saveOrder(order);
  }

  public async verifyItemsPurchased(options: {
    orderId: string,
    verifierId: string,
  }): Promise<Order> {
    const order = await this.orderDao.getOrderById(options.orderId);
    if (order.state !== OrderState.PURCHASED || order.customerId !== options.verifierId) {
      throw new Error("Order is not PURCHASED or you are not the customer.");
    } else {
      const customer = await this.userService.getUserById(order.customerId);
      const courier = await this.userService.getUserById(order.courierId as string);
      if (customer.balance < order.totalPrice) {
        throw new Error("You are poor my friend.");
      }
      order.state = OrderState.COMPLETED;
      customer.balance -= order.totalPrice;
      courier.balance += order.totalPrice;
      return this.orderDao.saveOrder(order);
    }
  }

  public async getPostedOrders() {
    return this.orderDao.getPostedOrders();
  }

  public async createOrder(inputData: CreateOrderInput): Promise<Order> {
    await createOrderInputValidator.validate(inputData);
    const order = Order.create(inputData);
    let estimatedPrice = inputData.tipPrice;
    for (const item of inputData.items) {
      const product = await this.productService.getProductById(item.productId);
      estimatedPrice += product.estimatedPrice * item.amount;
    }
    order.estimatedPrice = estimatedPrice;
    const user = await this.userDao.getUserById(inputData.customerId);
    await this.userDao.saveUser(user);
    return this.orderDao.saveOrder(order);
  }

  public async getAssignedOrdersByUserId(userId: string): Promise<Order[]> {
    return this.orderDao.getAssignedOrdersByUserId(userId);
  }

}
