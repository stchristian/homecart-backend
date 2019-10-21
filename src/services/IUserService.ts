import { User } from "../models/User";
import { UserDTO } from "../dto/UserDTO";

export interface IUserService {
  getUserById(id: string): Promise<User>;
  getUsersByIds(ids: string[]): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  createUser(input: UserDTO): Promise<User>;
  applyForCourier(userId: string): Promise<User>;
  uploadMoney(options: { userId: string, amount: number }): Promise<User>;
}
