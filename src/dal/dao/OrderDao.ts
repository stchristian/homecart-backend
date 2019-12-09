import { injectable } from "inversify";
import { Order } from "../../models/Order";
import { OrderState } from "../../enums";
import { IOrderDao } from "./IOrderDao";
import { Order as MongooseOrder, IOrderDoc} from "../db/models/Order";

/**
 *  Persist orders into db
 */
@injectable()
export class OrderDao implements IOrderDao {

  public async getOrderById(id: string): Promise<Order>  {
    const order: IOrderDoc | null = await MongooseOrder.findOne({ _id: id }).lean();
    if (!order) { throw new Error("No order with the given id"); }
    return this.transformFromDoc(order);
  }

  public async getOrdersByUserId(userId: string): Promise<Order[]> {
    const result: IOrderDoc[] = await MongooseOrder.find({
      customer: userId,
    }).lean();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async getPostedOrders(): Promise<Order[]> {
    const orders: IOrderDoc[] = await MongooseOrder.find({
      state: OrderState.POSTED,
    }).lean();
    return orders.map((order) => this.transformFromDoc(order));
  }

  public async getOrdersByCourierId(courierId: string): Promise<Order[]> {
    const orders: IOrderDoc[] = await MongooseOrder.find({
      courier: courierId,
    }).lean();
    return orders.map((order) => this.transformFromDoc(order));
  }

  public async getManyByIds(ids: string[]): Promise<Order[]> {
    const result: IOrderDoc[] = await MongooseOrder.find({
      _id: {
        $in: ids,
      },
    }).lean();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async saveOrder(order: Order): Promise<Order> {
    const result: IOrderDoc = await MongooseOrder.findByIdAndUpdate(
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
    const orders: IOrderDoc[] = await MongooseOrder.find({
      state: {
        $in: [OrderState.ASSIGNED, OrderState.PURCHASED, OrderState.COMPLETED],
      },
      $or: [
        {
          courier: userId,
        },
        {
          customer: userId,
        },
      ],
    }).lean();
    return orders.map((order) => this.transformFromDoc(order));
  }

  private transformFromDoc(doc: IOrderDoc): Order {
    const order = new Order();
    order.id = doc._id,
    order.customerId = doc.customer,
    order.state = doc.state,
    order.deadline = doc.deadline,
    order.preferredDeliveryTime = doc.preferredDeliveryTime,
    order.courierId = doc.courier,
    order.createdAt = doc.createdAt,
    order.realPrice = doc.realPrice,
    order.totalPrice = doc.totalPrice,
    order.tipPrice = doc.tipPrice,
    order.items = doc.items.map((i) => ({
      productId: i.product,
      amount: i.amount,
    })),
    order.address = doc.address,
    order.estimatedPrice = doc.estimatedPrice;
    return order;
  }

  private transformToDoc(order: Order): IOrderDoc {
    return  {
      _id: order.id,
      customer: order.customerId,
      state: order.state,
      deadline: order.deadline,
      preferredDeliveryTime: order.preferredDeliveryTime,
      courier: order.courierId,
      createdAt: order.createdAt,
      realPrice: order.realPrice,
      totalPrice: order.totalPrice,
      tipPrice: order.tipPrice,
      items: order.items.map((i) => ({
        product: i.productId,
        amount: i.amount,
      })),
      address: order.address,
      estimatedPrice: order.estimatedPrice,
    };
  }
}
