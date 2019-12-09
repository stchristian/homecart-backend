import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IUserDao } from "../dal/dao/IUserDao";
import { TYPES } from "../inversify/types";
import { User } from "../models/User";
import { IUserService } from "./IUserService";
import { CreateUserInput, createUserInputValidator } from "../dto/UserDTO";
import { CourierApplicationState } from "../enums";

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

  public async createUser(inputData: CreateUserInput): Promise<User> {
    await createUserInputValidator.validate(inputData);
    let user = await this.userDao.getUserByEmail(inputData.email);
    if (user) {
      throw new Error("A user already exists with this email");
    }
    user = await User.create(inputData);
    return this.userDao.saveUser(user);
  }

  public async applyForCourier(userId: string): Promise<User> {
    const user = await this.userDao.getUserById(userId);
    if (user.isCourier) {
      throw new Error("You are a courier already!");
    }
    if (user.courierApplicationState === CourierApplicationState.APPLIED) {
      throw new Error("You can only apply once");
    }
    user.courierApplicationState = CourierApplicationState.APPLIED;
    return this.userDao.saveUser(user);
  }

  public async uploadMoney(options: { userId: string, amount: number }): Promise<User> {
    const user = await this.userDao.getUserById(options.userId);
    user.balance += options.amount;
    return this.userDao.saveUser(user);
  }
}
