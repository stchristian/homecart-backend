import { IAdminService } from "./IAdminService";
import { injectable, inject } from "inversify";
import { TYPES } from "../inversify/types";
import { IUserDao } from "../dal/dao/IUserDao";
import { CourierApplicationState, UserRoles } from "../enums";
import { User } from "../models/User";

@injectable()
export class AdminService implements IAdminService {
  private userDao: IUserDao;

  constructor(
    @inject(TYPES.IUserDao) userDao: IUserDao,
  ) {
    this.userDao = userDao;
  }

  public async acceptCourierApplication(userId: string): Promise<void> {
    const user: User = await this.userDao.getUserById(userId);
    if (user.courierApplicationState !== CourierApplicationState.APPLIED) {
      throw new Error("Cant accept application. User is not applied");
    }
    user.courierApplicationState = CourierApplicationState.ACCEPTED;
    user.roles.push(UserRoles.COURIER);
    this.userDao.saveUser(user);
  }

  public async rejectCourierApplication(userId: string): Promise<void> {
    const user: User = await this.userDao.getUserById(userId);
    if (user.courierApplicationState !== CourierApplicationState.APPLIED) {
      throw new Error("Cant accept application. User is not applied");
    }
    user.courierApplicationState = CourierApplicationState.REJECTED;
    this.userDao.saveUser(user);
  }

  public async getCourierApplicants(): Promise<User[]> {
    return this.userDao.getCourierApplicants();
  }
}
