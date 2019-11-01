import bcrypt from "bcryptjs";
import uuid from "uuid/v4";
import { CreateUserInput } from "../dto/UserDTO";
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

  public static async create(input: CreateUserInput): Promise<User> {
    const user = new User();
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
