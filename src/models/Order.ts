import uuid from "uuid/v4";
import { Product } from "./Product";
import { Address, User } from "./User";
import { OrderDTO } from "../dto/OrderDTO";
import { CreateOrderInput } from "../dto/OrderDTO";
import { AmountType, OrderState } from "../enums";

export interface OrderItem {
  productId: string;
  amount: number;
}

export class Order {
  public static create(input: CreateOrderInput): Order {
    const order = new Order();
    order.id = uuid();
    order.createdAt = new Date();
    order.deadline = input.deadline;
    order.preferredDeliveryTime = input.preferredDeliveryTime;
    order.address = input.address;
    order.customerId = input.customerId;
    order.tipPrice = input.tipPrice;
    order.items = input.items;
    order.state = OrderState.POSTED;
    return order;
  }
  public id: string;
  public createdAt: Date;
  public deadline: Date;
  public preferredDeliveryTime: { start: Date, end: Date };
  public address: Address;
  public state: OrderState;
  public customerId: string;
  public courierId: string | null = null;
  public totalPrice: number = 0;
  public estimatedPrice: number;
  public realPrice: number = 0;
  public tipPrice: number;
  public items: OrderItem[];
}
