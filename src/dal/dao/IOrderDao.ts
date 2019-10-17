import { Order } from "../../models/Order";
import { User } from "../../models/User";

export interface IOrderDao {
  getManyByIds(ids: string[]): Promise<Order[]>;
  getOrderById(id: string): Promise<Order>;
  getOrdersByUser(user: User): Promise<Order[]>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  getPostedOrders(): Promise<Order[]>;
  getOrdersByCourierId(courierId: string): Promise<Order[]>;
  getAssignedOrdersByUserId(userId: string): Promise<Order[]>;
  saveOrder(order: Order): Promise<Order>;
}
