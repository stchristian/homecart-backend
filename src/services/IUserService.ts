import { CreateUserInput, User } from "../models/User";

export interface IUserService {
  getUserById(id: string): Promise<User>;
  getUsersByIds(ids: string[]): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  createUser(input: CreateUserInput): Promise<User>;
  applyForCourier(userId: string): Promise<User>;
  uploadMoney(options: { userId: string, amount: number }): Promise<User>;
}
