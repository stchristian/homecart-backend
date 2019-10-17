import bcrypt from "bcryptjs";
import uuid from "uuid/v4";
import { UserDocument } from "../dal/dao/UserDao";
import { Order } from "./Order";

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  biography: string;
}

export interface Address {
  zip: number;
  city: string;
  streetAddress: string;
}

export enum UserRoles {
  COURIER = "COURIER",
  ADMIN = "ADMIN",
}

export class User {

  get isAdmin(): boolean {
    return this.roles.includes(UserRoles.ADMIN);
  }

  get isCourier(): boolean {
    return this.roles.includes(UserRoles.COURIER);
  }

  public static async fromInput(input: CreateUserInput): Promise<User> {
    const user = new User();
    console.log(input);
    user.id = uuid();
    user.firstName = input.firstName;
    user.lastName = input.lastName;
    user.email = input.email;
    user.biography = input.biography;
    user.password = await bcrypt.hash(input.password, 12);
    user.phoneNumber = input.phoneNumber;
    return user;
  }
  public id: string;
  public email: string;
  public firstName: string;
  public password: string;
  public lastName: string;
  public phoneNumber: string;
  public balance: number = 0;
  public orderIds: string[] = [];
  public courierOrderIds: string[] = [];
  public addresses: Address[] = [];
  public roles: UserRoles[] = [];
  public biography: string = "";

  public setCourier(value) {
    const index = this.roles.findIndex((role) => role === UserRoles.COURIER);
    if (value && index === -1 ) {
      this.roles.push(UserRoles.COURIER);
    }
  }
}
