import dotenv from "dotenv";
dotenv.config();
import config from "../../inversify/config";
import { TYPES } from "../../inversify/types";
import { IUserService } from "../../services/IUserService";
import { IProductService } from "../../services/IProductService";
import { IOrderService } from "../../services/IOrderService";
import casual from "casual";
import mongoose from "./";

async function seed() {
  const container = config();
  const userService = container.get<IUserService>(TYPES.IUserService);
  const productService = container.get<IProductService>(TYPES.IProductService);
  const orderService = container.get<IOrderService>(TYPES.IOrderService);

  // const couriers = [];
  const users = [];
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
  const products = [];
  // Random products
  for (let index = 0; index < 30; index++) {
    const product = await productService.createProduct({
      name: `Product ${index + 1}`,
      description: casual.sentences(3),
      estimatedPrice: casual.integer(150, 20000),
    });
    products.push(product);
  }

  // Random orders
  const orders = [];
  for (let index = 0; index < 10; index++) {
    const items = [...Array(casual.integer(1, 8)).keys()].map(() => {
      return {
        productId: casual.random_element(products).id,
        amount: casual.integer(1, 20),
        amountType: casual.random_element(["MASS", "PIECE", "LENGTH", "AREA"]),
      };
    });
    console.log(JSON.stringify(items));
    const order = await orderService.createOrder({
      deadline: casual.moment.toDate(),
      preferredDeliveryTime: {
        start: casual.moment.toDate(),
        end: casual.moment.toDate(),
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
  }
  return Promise.resolve();
}

seed();
