import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IUserDao } from "../dal/dao/IUserDao";
import { TYPES } from "../inversify/types";
import { User } from "../models/User";
import { IUserService } from "./IUserService";
import { UserDTO, userDTOValidator } from "../dto/UserDTO";

@injectable()
export class UserService implements IUserService {
  private userDao: IUserDao;

  constructor(
    @inject(TYPES.IUserDao) userDao: IUserDao,
  ) {
    this.userDao = userDao;
  }

  public getUserById(id: string): Promise<User> {
    return this.userDao.getUserById(id);
  }

  public getUsersByIds(ids: string[]): Promise<User[]> {
    return this.userDao.getManyByIds(ids);
  }

  public getAllUsers(): Promise<User[]> {
    return this.userDao.getAllUsers();
  }

  public async createUser(input: UserDTO): Promise<User> {
    await userDTOValidator.validate(input);
    const u = await this.userDao.getUserByEmail(input.email);
    if (u) {
      throw new Error("A user already exists with this email");
    }
    const user: User = await User.fromUserDTO(input);
    return this.userDao.saveUser(user);
  }

  public async applyForCourier(userId: string): Promise<User> {
    const user = await this.userDao.getUserById(userId);
    user.setCourier(true);
    return this.userDao.saveUser(user);
  }

  public async uploadMoney(options: { userId: string, amount: number }): Promise<User> {
    const user = await this.userDao.getUserById(options.userId);
    user.balance += options.amount;
    return this.userDao.saveUser(user);
  }
}
