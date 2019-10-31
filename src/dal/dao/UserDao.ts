import { injectable } from "inversify";
import "reflect-metadata";
import { User } from "../../models/User";
import { User as MongooseUser, IUserDocument, IUser } from "../db/models/User";
import { IUserDao } from "./IUserDao";

/**
 *  Persist users into db
 */
@injectable()
export class UserDao implements IUserDao {

  public async getUserById(id: string): Promise<User>  {
    const user = await MongooseUser.findOne({ _id: id }, null, { lean: true });
    if (!user) { throw new Error(`No user with given id ${id}`); }
    return this.transformFromDoc(user);
  }

  public async getManyByIds(ids: string[]): Promise<User[]> {
    const result = await MongooseUser.find({
      _id: {
        $in: ids,
      },
    }, null, { lean: true });
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async getAllUsers(): Promise<User[]> {
    const result = await MongooseUser.find();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async getUserByEmail(email: string): Promise<User> {
    const result = await MongooseUser.findOne({ email }, null, { lean: true });
    if (result) {
      return this.transformFromDoc(result);
    } else {
      return null;
    }
  }

  public async saveUser(user: User): Promise<User> {
    const result = await MongooseUser.findByIdAndUpdate(
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

  private transformFromDoc(doc: IUserDocument): User {
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
    return user;
  }

  private transformToDoc(user: User): IUser {
    return  {
      firstName: user.firstName,
      lastName: user.lastName,
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
