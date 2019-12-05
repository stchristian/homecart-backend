import dotenv from "dotenv";
dotenv.config();
import config from "../../inversify/config";
import { TYPES } from "../../inversify/types";
import { IUserService } from "../../services/IUserService";
import { IProductService } from "../../services/IProductService";
import { IOrderService } from "../../services/IOrderService";
import casual from "casual";
import { connectDb } from "./";
import { User } from "../../models/User";
import { Product } from "../../models/Product";
import { Order } from "../../models/Order";

async function seed() {
  const container = config();
  await connectDb();
  const userService = container.get<IUserService>(TYPES.IUserService);
  const productService = container.get<IProductService>(TYPES.IProductService);
  const orderService = container.get<IOrderService>(TYPES.IOrderService);

  // const couriers = [];
  const users: User[] = [];
  // Random user
  for (let index = 0; index < 20; index++) {
    const user = await userService.createUser({
      email: casual.email,
      firstName: casual.first_name,
      lastName: casual.last_name,
      phoneNumber: casual.phone,
      password: casual.password,
      biography: casual.sentence,
    });
    users.push(user);
  }
  const products: Product[] = [];
  // Random products
  for (let index = 0; index < 30; index++) {
    const product = await productService.createProduct({
      name: `Product ${index + 1}`,
      description: casual.sentences(3),
      estimatedPrice: casual.integer(150, 20000),
      amountType: casual.random_element(["MASS", "PIECE", "LENGTH", "AREA"]),
    });
    products.push(product);
  }

  // Random orders
  const orders: Order[] = [];
  for (let index = 0; index < 10; index++) {
    const items = [...Array(casual.integer(1, 8)).keys()].map(() => {
      return {
        productId: casual.random_element(products).id,
        amount: casual.integer(1, 20),
      };
    });
    console.log(JSON.stringify(items));
    try {
      const start = casual.moment.year(2020);
      const end = start.clone().add(1, "h");
      const order = await orderService.createOrder({
        deadline: start.clone().subtract(2, "h"),
        preferredDeliveryTime: {
          start: start.toDate(),
          end: end.toDate(),
        },
        address: {
          city: casual.city,
          streetAddress: casual.address,
          zip: casual.integer(600, 7000),
        },
        customerId: casual.random_element(users).id,
        items,
        tipPrice: casual.integer(300, 700),
      });
      orders.push(order);
    } catch (error) {
      console.log(error);
    }
  }
  return Promise.resolve();
}

seed();
