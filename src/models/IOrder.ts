import { OrderItem } from "./Order";
import { User } from "./User";

export interface IOrder {
  getCustomer(): Promise<User>;
  getCourier(): Promise<User>;
}
