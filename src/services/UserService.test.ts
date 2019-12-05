import { TYPES } from "../inversify/types";
import { IUserDao } from "../dal/dao/IUserDao";
import { IUserService } from "./IUserService";
import sinon from "sinon";
import { CreateUserInput } from "../dto/UserDTO";
import { User, UserRoles } from "../models/User";
import { CourierApplicationState } from "../enums";
import { Container } from "inversify";
import { UserService } from "./UserService";
const container = new Container();

describe("User service", () => {
  beforeAll(() => {
    container.bind<IUserService>(TYPES.IUserService).to(UserService).inSingletonScope();
  });

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

  test("Create user", async () => {
    const userDto: CreateUserInput = {
      email: "test@test.com",
      password: "Password1234",
      firstName: "Test",
      lastName: "Test",
      phoneNumber: "36 30 111 2222",
      biography: "",
    };
    const userDaoMock: unknown = {
      saveUser: sinon.stub().resolvesArg(0),
      getUserByEmail: sinon.stub().withArgs(userDto.email).resolves(null),
    };
    const createdUser = {
      ...userDto,
      password: expect.not.stringContaining(userDto.password),
      id: expect.any(String),
    };
    container.bind<IUserDao>(TYPES.IUserDao).toConstantValue(userDaoMock as IUserDao);
    const userService = container.get<IUserService>(TYPES.IUserService);
    const result = await userService.createUser(userDto);
    expect(result).toMatchObject(createdUser);
  });

  test("User applies for courier", async () => {
    const testUser: User = await User.create({
      email: "test@test.com",
      password: "Password1234",
      firstName: "TestFirst",
      lastName: "TestLast",
      phoneNumber: "36 30 111 2222",
      biography: "",
    });
    const userDaoMock: unknown = {
      saveUser: sinon.stub().resolvesArg(0),
      getUserById: sinon.stub().withArgs(testUser.id).resolves(testUser),
    };
    container.bind<IUserDao>(TYPES.IUserDao).toConstantValue(userDaoMock as IUserDao);
    const userService = container.get<IUserService>(TYPES.IUserService);
    const result = await userService.applyForCourier(testUser.id);
    expect(result.courierApplicationState).toBe(CourierApplicationState.APPLIED);
    expect(result.roles.includes(UserRoles.COURIER)).toBe(false);
  });
});
