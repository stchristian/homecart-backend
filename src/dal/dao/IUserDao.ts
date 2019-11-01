import { User } from "../../models/User";

export interface IUserDao {
  getUserById(id: string): Promise<User>;
  getManyByIds(ids: string[]): Promise<User[]>;
  getAllUsers(): Promise<User[]>;
  getUserByEmail(email: string): Promise<User | null>;
  saveUser(user: User): Promise<User>;
  deleteUserById(id: string): Promise<void>;
}
