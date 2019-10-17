import { User } from "../models/User";

export interface LoginResult {
  message: string;
  success: boolean;
  token?: string;
  user?: User;
  expirationDate?: Date;
}

export interface VerifyTokenResult {
  message: string;
  success: boolean;
  user?: User;
}

export interface Credentials {
  email: string;
  password: string;
}

export interface IAuthenticationService {
  verifyToken(token: string): Promise<VerifyTokenResult>;
  loginUser(credentials: Credentials): Promise<LoginResult>;
}
