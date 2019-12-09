import { Order } from "../models/Order";
import { CreateOrderInput } from "../dto/OrderDTO";

export interface IOrderService {
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getOrdersByIds(orderIds: string[]);
  getCourierOrdersByUserId(userId: string): Promise<Order[]>;
  setCourierForOrder(options: { orderId: string, courierId: string }): Promise<Order>;
  itemsPurchased(options: { realPrice: number, orderId: string, courierId: string}): Promise<Order>;
  verifyItemsPurchased(options: {
    orderId: string,
    verifierId: string,
  }): Promise<Order>;
  getPostedOrders(): Promise<Order[]>;
  createOrder(data: CreateOrderInput): Promise<Order>;
  getAssignedOrdersByUserId(userId: string): Promise<Order[]>;
}
