import DataLoader from "dataloader";
import { injectable } from "inversify";
import "reflect-metadata";
import { Collection } from "mongodb";
import { User, UserRoles } from "../../models/User";
import { getDb } from "../db/index";
import { IUserDao } from "./IUserDao";

interface UserDocument {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  biography: string;
  phoneNumber: string;
  balance: number;
  addresses: any[];
  roles: UserRoles[];
}

/**
 *  Persist users into db
 */
@injectable()
export class UserDao implements IUserDao {
  private users: Collection<UserDocument>;
  // private loader: DataLoader<string, User> = null;

  constructor() {
    this.users = getDb().collection("users");
  }

  public async getUserById(id: string): Promise<User>  {
    // if (this.loader === null) {
    //   this.loader = new DataLoader(this.getManyByIds.bind(this));
    // }
    // const user = await this.loader.load(id);
    const user = await this.users.findOne({ _id: id });
    if (!user) { throw new Error(`No user with given id ${id}`); }
    return this.transformFromDoc(user);
  }

  public async getManyByIds(ids: string[]): Promise<User[]> {
    console.log(`UserIds requested from db: ${ids}`);
    // this.loader = null;
    const result = await this.users.find({
      _id: {
        $in: ids,
      },
    }).toArray();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async getAllUsers(): Promise<User[]> {
    const result = await this.users.find().toArray();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  // async createUser(user: User) : Promise<User> {
  //   const result = await this.users.insertOne(user.toDoc())
  //   if (result.insertedCount == 0) {
  //     throw new Error(`Failed to insert user into db...`);
  //   }
  //   return User.fromDoc(result.ops[0])
  // }

  public async getUserByEmail(email: string): Promise<User> {
    const result = await this.users.findOne({ email });
    if (result) {
      return this.transformFromDoc(result);
    } else {
      return null;
    }
  }

  public async saveUser(user: User): Promise<User> {
    const result = await this.users.replaceOne(
      {
      _id: user.id,
      },
      this.transformToDoc(user),
      {
        upsert: true,
      });
    if ( result.ops.length === 0) {
      throw new Error("Failed to save user to db");
    }
    return this.transformFromDoc(result.ops[0]);
  }

  public async deleteUserById(id: string): Promise<void> {
    const result = await this.users.deleteOne({
      _id: id,
    });
  }

  private transformFromDoc(doc: UserDocument): User {
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

  private transformToDoc(user: User): UserDocument {
    return  {
      _id: user.id,
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
