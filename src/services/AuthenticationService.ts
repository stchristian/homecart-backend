import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
import "reflect-metadata";
import { IUserDao } from "../dal/dao/IUserDao";
import { TYPES } from "../inversify/types";
import { Credentials, IAuthenticationService, LoginResult, VerifyTokenResult } from "./IAuthenticationService";

@injectable()
export class AuthenticationService implements IAuthenticationService {
  private userDao: IUserDao;
  constructor(
    @inject(TYPES.IUserDao) userDao: IUserDao,
  ) {
    this.userDao = userDao;
  }

  public async verifyToken(token: string): Promise<VerifyTokenResult> {
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return {
        success: false,
        message: err.message,
        user: null,
      };
    }
    if (!decodedToken) {
      return {
        success: false,
        message: "Cannot decode token...",
        user: null,
      };
    }
    try {
      const user = await this.userDao.getUserById(decodedToken.userId);
      return {
        success: true,
        message: "Successful",
        user,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  public async loginUser(credentials: Credentials): Promise<LoginResult> {
    const user = await this.userDao.getUserByEmail(credentials.email);
    if (!user) {
      return {
        success: false,
        message: "No user with the given email address",
      };
    }
    const isEqual = await bcrypt.compare(credentials.password, user.password);
    if (!isEqual) {
      return {
        success: false,
        message: "Passsword incorrect",
      };
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
    );
    const expirationDate = new Date();
    // Token valid for 1 day
    expirationDate.setHours(expirationDate.getHours() + 24);
    return {
      success: true,
      message: "Logged in successfully",
      token,
      expirationDate,
    };
  }
}
