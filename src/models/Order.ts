import uuid from "uuid/v4";
import { Product } from "./Product";
import { Address, User } from "./User";

export enum OrderState {
  POSTED = "POSTED",
  ASSIGNED = "ASSIGNED",
  PURCHASED = "PURCHASED",
  COMPLETED = "COMPLETED",
  EXPIRED = "EXPIRED",
}

export enum AmountType {
  MASS = "MASS",
  PIECE = "PIECE",
  LENGTH = "LENGTH",
  AREA = "AREA",
}

export interface CreateOrderInput {
  deadline: Date;
  preferredDeliveryTime: { start: Date, end: Date };
  address: Address;
  customerId: string;
  tipPrice: number;
  items: OrderItem[];
  estimatedPrice: number;
}

export interface OrderItem {
  product?: Product;
  productId: string;
  amount: number;
  amountType: AmountType;
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
    order.estimatedPrice = input.estimatedPrice;
    return order;
  }
  public id: string;
  public createdAt: Date;
  public deadline: Date;
  public preferredDeliveryTime: { start: Date, end: Date };
  public address: Address;
  public state: OrderState;
  public customerId: string;
  public courierId?: string = null;
  public totalPrice: number = 0;
  public estimatedPrice: number;
  public realPrice: number = 0;
  public tipPrice: number;
  public items: OrderItem[];
}
