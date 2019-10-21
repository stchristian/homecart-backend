import { injectable } from "inversify";
import { Collection } from "mongodb";
import { AmountType, Order, OrderItem, OrderState } from "../../models/Order";
import { Address, User } from "../../models/User";
import { getDb } from "../db/index";
import { IOrderDao } from "./IOrderDao";

interface OrderItemNestedDoc {
  productId: string;
  amount: number;
  amountType: AmountType;
}

interface OrderDocument {
  _id: string;
  customerId: string;
  state: OrderState;
  items: OrderItemNestedDoc[];
  address: Address;
  courierId?: string;
  deadline: Date;
  preferredDeliveryTime: { start: Date, end: Date };
  createdAt: Date;
  tipPrice: number;
  totalPrice: number;
  realPrice: number;
  estimatedPrice: number;
}

/**
 *  Persist orders into db
 */
@injectable()
export class OrderDao implements IOrderDao {
  private orders: Collection<OrderDocument>;

  constructor() {
    this.orders = getDb().collection("orders");
  }

  public async getOrderById(id: string): Promise<Order>  {
    const userDoc = await this.orders.findOne({ _id: id });
    if (!userDoc) { throw new Error("No order with the given id"); }
    return this.transformFromDoc(userDoc);
  }

  // public async getOrdersByUser(user: User): Promise<Order[]> {
  //   if (user.orderIds.length > 0) {
  //     const result = await this.getManyByIds(user.orderIds);
  //     return result;
  //   } else { return []; }
  // }

  public async getOrdersByUserId(userId: string): Promise<Order[]> {
    const result = await this.orders.find({
      customerId: userId,
    }).toArray();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async getPostedOrders(): Promise<Order[]> {
    const orders = await this.orders.find({
      state: OrderState.POSTED,
    }).toArray();
    return orders.map((order) => this.transformFromDoc(order));
  }

  public async getOrdersByCourierId(courierId: string): Promise<Order[]> {
    const orders = await this.orders.find({
      courierId,
    }).toArray();
    return orders.map((order) => this.transformFromDoc(order));
  }

  public async getManyByIds(ids: string[]): Promise<Order[]> {
    const result = await this.orders.find({
      _id: {
        $in: ids,
      },
    }).toArray();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async saveOrder(order: Order): Promise<Order> {
    const result = await this.orders.replaceOne(
      {
      _id: order.id,
      },
      this.transformToDoc(order),
      {
        upsert: true,
      });
    if ( result.ops.length === 0) {
      throw new Error("Failed to save user to db");
    }
    return this.transformFromDoc(result.ops[0]);
  }

  public async getAssignedOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await this.orders.find({
      state: {
        $in: [OrderState.ASSIGNED, OrderState.PURCHASED, OrderState.COMPLETED],
      },
      $or: [
        {
          courierId: userId,
        },
        {
          customerId: userId,
        },
      ],
    }).toArray();
    return orders.map((order) => this.transformFromDoc(order));
  }

  private transformFromDoc(doc: OrderDocument): Order {
    const order = new Order();
    order.id = doc._id,
    order.customerId = doc.customerId,
    order.state = doc.state,
    order.deadline = doc.deadline,
    order.preferredDeliveryTime = doc.preferredDeliveryTime,
    order.courierId = doc.courierId,
    order.createdAt = doc.createdAt,
    order.realPrice = doc.realPrice,
    order.totalPrice = doc.totalPrice,
    order.tipPrice = doc.tipPrice,
    order.items = doc.items,
    order.address = doc.address,
    order.estimatedPrice = doc.estimatedPrice;
    return order;
  }

  private transformToDoc(order: Order): OrderDocument {
    return  {
      _id: order.id,
      customerId: order.customerId,
      state: order.state,
      deadline: order.deadline,
      preferredDeliveryTime: order.preferredDeliveryTime,
      courierId: order.courierId,
      createdAt: order.createdAt,
      realPrice: order.realPrice,
      totalPrice: order.totalPrice,
      tipPrice: order.tipPrice,
      items: order.items,
      address: order.address,
      estimatedPrice: order.estimatedPrice,
    };
  }
}
