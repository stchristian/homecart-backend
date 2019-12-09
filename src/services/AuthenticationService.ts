import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";
import jwt from "jsonwebtoken";
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
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
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
        user: null,
      };
    }
  }

  public async loginUser(credentials: Credentials): Promise<LoginResult> {
    const result: LoginResult = {
      success: false,
      message: "Failed to authenticate user",
      token: null,
    };
    const user = await this.userDao.getUserByEmail(credentials.email);
    if (!user) {
      return result;
    }
    const passwordsAreEqual = await bcrypt.compare(credentials.password, user.password);
    if (!passwordsAreEqual) {
      result.message = "Password is incorrect";
      return result;
    }
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET as string,
      {
        algorithm: "HS256",
        expiresIn: "10d",
      },
    );
    return {
      success: true,
      message: "Logged in successfully",
      token,
    };
  }
}
