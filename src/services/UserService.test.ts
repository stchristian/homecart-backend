import config from "../inversify/config";
import { TYPES } from "../inversify/types";
import { IUserDao } from "../dal/dao/IUserDao";
import { IUserService } from "./IUserService";
import sinon from "sinon";
import { UserDTO } from "../dto/UserDTO";
import { User } from "../models/User";
const container = config();

describe("User service", () => {
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
    const userDto: UserDTO = {
      email: "test@test.com",
      password: "Password1234",
      firstName: "Test",
      lastName: "Test",
      phoneNumber: "+36301112222",
      biography: "",
    };
    const userDaoMock: unknown = {
      saveUser: sinon.stub().resolvesArg(0),
    };
    const createdUser = {
      ...userDto,
      password: expect.not.stringContaining(userDto.password),
      id: expect.any(String),
    };
    container.unbind(TYPES.IUserDao);
    container.bind<IUserDao>(TYPES.IUserDao).toConstantValue(userDaoMock as IUserDao);
    const userService = container.get<IUserService>(TYPES.IUserService);
    const result = await userService.createUser(userDto);
    expect(result).toMatchObject(createdUser);
  });

  test("User becomes a courier", async () => {
    const testUser: User = await User.fromUserDTO({
      email: "test@test.com",
      password: "Password1234",
      firstName: "TestFirst",
      lastName: "TestLast",
      phoneNumber: "+36301112222",
      biography: "",
    });
    expect(testUser.isCourier).toBe(false);
    const userDaoMock: unknown = {
      saveUser: sinon.stub().resolvesArg(0),
      getUserById: sinon.stub().withArgs(testUser.id).resolves(testUser),
    };
    container.unbind(TYPES.IUserDao);
    container.bind<IUserDao>(TYPES.IUserDao).toConstantValue(userDaoMock as IUserDao);
    const userService = container.get<IUserService>(TYPES.IUserService);
    const result = await userService.applyForCourier(testUser.id);
    expect(result.isCourier).toBe(true);
  });
});
