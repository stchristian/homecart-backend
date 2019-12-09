import { injectable } from "inversify";
import "reflect-metadata";
import { User} from "../../models/User";
import { User as MongooseUser, IUserDoc } from "../db/models/User";
import { IUserDao } from "./IUserDao";
import { CourierApplicationState } from "../../enums";

/**
 *  Persist users into db
 */
@injectable()
export class UserDao implements IUserDao {

  public async getUserById(id: string): Promise<User>  {
    const user: IUserDoc | null = await MongooseUser.findOne({ _id: id }).lean();
    if (!user) { throw new Error(`No user with given id ${id}`); }
    return this.transformFromDoc(user);
  }

  public async getManyByIds(ids: string[]): Promise<User[]> {
    const result: [IUserDoc] = await MongooseUser.find({
      _id: {
        $in: ids,
      },
    }).lean();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async getAllUsers(): Promise<User[]> {
    const result: [IUserDoc] = await MongooseUser.find().lean();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const result: IUserDoc | null = await MongooseUser.findOne({ email }).lean();
    if (result) {
      return this.transformFromDoc(result);
    } else {
      return null;
    }
  }

  public async saveUser(user: User): Promise<User> {
    const result: IUserDoc = await MongooseUser.findByIdAndUpdate(
      user.id,
      this.transformToDoc(user),
      {
        // @ts-ignore
        upsert: true,
        // @ts-ignore
        lean: true,
        new: true,
    });
    if (!result) {
      throw new Error("Failed to save user to db");
    }
    return this.transformFromDoc(result);
  }

  public async deleteUserById(id: string): Promise<void> {
    const result = await MongooseUser.deleteOne({
      _id: id,
    });
  }

  public async getCourierApplicants(): Promise<User[]> {
    const applicants = await MongooseUser.find({
      courierApplicationState: CourierApplicationState.APPLIED,
    }).lean();
    return applicants.map((doc) => this.transformFromDoc(doc));
  }

  private transformFromDoc(doc: IUserDoc): User {
    const user = new User();
    user.id = doc._id;
    user.email = doc.email;
    user.password = doc.password;
    user.firstName = doc.firstName;
    user.lastName = doc.lastName;
    user.phoneNumber = doc.phoneNumber;
    user.balance = doc.balance;
    user.addresses = doc.addresses;
    user.roles = doc.roles;
    user.biography = doc.biography;
    user.courierApplicationState = doc.courierApplicationState;
    return user;
  }

  private transformToDoc(user: User): IUserDoc {
    return  {
      _id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      courierApplicationState: user.courierApplicationState,
      email: user.email,
      biography: user.biography,
      addresses: user.addresses,
      roles: user.roles,
      balance: user.balance,
      password: user.password,
      phoneNumber: user.phoneNumber,
    };
  }
}
