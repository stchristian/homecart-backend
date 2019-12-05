import config from "../inversify/config";
import { TYPES } from "../inversify/types";
import { IUserDao } from "../dal/dao/IUserDao";
import { IAuthenticationService } from "./IAuthenticationService";
import sinon from "sinon";
import bcrypt from "bcryptjs";
const container = config();

process.env.JWT_SECRET = "something secret";

describe("Authentication service", () => {
  beforeEach(() => {

    // create a snapshot so each unit test can modify
    // it without breaking other unit tests
    container.snapshot();
  });

  afterEach(() => {
    // Restore to last snapshot so each unit test
    // takes a clean copy of the application container
    container.restore();
    sinon.restore();
  });

  test("Login with good password", async () => {
    const credentials = {
      email: "test@gmail.com",
      password: "Almafa123",
    };
    const passwordHash = await bcrypt.hash(credentials.password, 12);
    const userDaoMock: unknown = {
      getUserByEmail: sinon.stub().withArgs(credentials.email).resolves({
        id: "asd123z498hdsfhkhbfds",
        email: credentials.email,
        password: passwordHash,
      }),
    };
    container.unbind(TYPES.IUserDao);
    container.bind<IUserDao>(TYPES.IUserDao).toConstantValue(userDaoMock as IUserDao);
    const authService = container.get<IAuthenticationService>(TYPES.IAuthenticationService);
    const result = await authService.loginUser(credentials);
    expect(result.success).toBe(true);
    expect(typeof result.token).toBe("string");
  });

  test("Login with wrong password", async () => {
    const goodPassword = "Almafa123";
    const wrongPassword = "Almafa";
    const credentials = {
      email: "test@gmail.com",
      password: wrongPassword,
    };
    const passwordHash = await bcrypt.hash(goodPassword, 12);
    const userDaoMock: unknown = {
      getUserByEmail: sinon.stub().withArgs(credentials.email).resolves({
        id: "asd123z498hdsfhkhbfds",
        email: credentials.email,
        password: passwordHash,
      }),
    };
    container.unbind(TYPES.IUserDao);
    container.bind<IUserDao>(TYPES.IUserDao).toConstantValue(userDaoMock as IUserDao);
    const authService = container.get<IAuthenticationService>(TYPES.IAuthenticationService);
    const result = await authService.loginUser(credentials);
    expect(result.success).toBe(false);
    expect(result.token).toBeNull();
  });
});
