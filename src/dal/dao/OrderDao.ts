import { injectable } from "inversify";
import { Order, OrderState } from "../../models/Order";
import { IOrderDao } from "./IOrderDao";
import { Order as MongooseOrder, IOrderDocument, IOrder } from "../db/models/Order";

/**
 *  Persist orders into db
 */
@injectable()
export class OrderDao implements IOrderDao {

  public async getOrderById(id: string): Promise<Order>  {
    const userDoc = await MongooseOrder.findOne({ _id: id }, null, { lean: true });
    if (!userDoc) { throw new Error("No order with the given id"); }
    return this.transformFromDoc(userDoc);
  }

  public async getOrdersByUserId(userId: string): Promise<Order[]> {
    const result = await MongooseOrder.find({
      customerId: userId,
    }, null, { lean: true });
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async getPostedOrders(): Promise<Order[]> {
    const orders = await MongooseOrder.find({
      state: OrderState.POSTED,
    }, null, { lean: true });
    return orders.map((order) => this.transformFromDoc(order));
  }

  public async getOrdersByCourierId(courierId: string): Promise<Order[]> {
    const orders = await MongooseOrder.find({
      courierId,
    }, null, { lean: true });
    return orders.map((order) => this.transformFromDoc(order));
  }

  public async getManyByIds(ids: string[]): Promise<Order[]> {
    const result = await MongooseOrder.find({
      _id: {
        $in: ids,
      },
    }, null, { lean: true });
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async saveOrder(order: Order): Promise<Order> {
    const result = await MongooseOrder.findByIdAndUpdate(
      order.id,
      this.transformToDoc(order),
      {
        upsert: true,
        // @ts-ignore
        lean: true,
        new: true,
      });
    if (!result) {
      throw new Error("Failed to save user to db");
    }
    return this.transformFromDoc(result);
  }

  public async getAssignedOrdersByUserId(userId: string): Promise<Order[]> {
    const orders = await MongooseOrder.find({
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
    }, null, { lean: true });
    return orders.map((order) => this.transformFromDoc(order));
  }

  private transformFromDoc(doc: IOrderDocument): Order {
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

  private transformToDoc(order: Order): IOrder {
    return  {
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
