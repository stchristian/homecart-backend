import dotenv from "dotenv";
dotenv.config();
import config from "../../inversify/config";
import { TYPES } from "../../inversify/types";
import { IUserService } from "../../services/IUserService";
import { IProductService } from "../../services/IProductService";
import { IOrderService } from "../../services/IOrderService";
import casual from "casual";
import { connectDb } from "./";
import { User, UserRoles } from "../../models/User";
import { Product } from "../../models/Product";
import { Order } from "../../models/Order";
import { IUserDao } from "../dao/IUserDao";
import { AmountType, CourierApplicationState } from "../../enums";
import { Product as ProductModel } from "./models/Product";
import { Order as OrderModel } from "./models/Order";
import { User as UserModel } from "./models/User";

const productNames = ["Bread", "Tomato", "Potato", "Onion", "Chocolate", "Paper", "Sponge", "Milk", "Joghurt"];

export async function seed() {
  const container = config();
  await connectDb();
  await ProductModel.db.dropCollection("users");
  await ProductModel.db.dropCollection("orders");
  await ProductModel.db.dropCollection("products");
  const userService = container.get<IUserService>(TYPES.IUserService);
  const productService = container.get<IProductService>(TYPES.IProductService);
  const orderService = container.get<IOrderService>(TYPES.IOrderService);
  const userDao = container.get<IUserDao>(TYPES.IUserDao);

  // const couriers = [];
  const users: User[] = [];

  // Create admin
  const adminUser = await userService.createUser({
    email: process.env.SEED_ADMIN_EMAIL,
    firstName: "Adam",
    lastName: "Admin",
    phoneNumber: "36 10 000 1010",
    password: process.env.SEED_ADMIN_PASSWORD,
    biography: "I am an admin",
  });
  adminUser.roles.push(UserRoles.ADMIN);
  userDao.saveUser(adminUser);

  // Create a courier
  const courierUser = await userService.createUser({
    email: process.env.SEED_COURIER_EMAIL,
    firstName: "Chris",
    lastName: "Courier",
    phoneNumber: "36 10 000 1010",
    password: process.env.SEED_COURIER_PASSWORD,
    biography: "I am the fastest courier",
  });
  courierUser.roles.push(UserRoles.COURIER);
  courierUser.courierApplicationState = CourierApplicationState.ACCEPTED;
  userDao.saveUser(courierUser);

  // A normal user
  const normalUser = await userService.createUser({
    email: process.env.SEED_NORMAL_EMAIL,
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "36 10 000 1010",
    password: process.env.SEED_NORMAL_PASSWORD,
    biography: "I am just a simple user",
  });

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
      name: casual.random_element(productNames),
      description: casual.sentences(3),
      estimatedPrice: casual.integer(150, 20000),
      amountType: casual.random_element(Object.values(AmountType)),
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
  console.log("Database reset");
}
