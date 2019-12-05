import { TYPES } from "../inversify/types";
import { IUserDao } from "../dal/dao/IUserDao";
import { IAdminService } from "./IAdminService";
import sinon from "sinon";
import { CreateUserInput } from "../dto/UserDTO";
import { User, UserRoles } from "../models/User";
import { CourierApplicationState } from "../enums";
import { Container } from "inversify";
import { AdminService } from "./AdminService";
const container = new Container();

describe("Admin service", () => {
  beforeAll(() => {
    container.bind<IAdminService>(TYPES.IAdminService).to(AdminService).inSingletonScope();
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

  describe("Admin accepts courier application", () => {
    test("should accept application successfully", async () => {
      const user = {
        id: "aewo42u48nifsd",
        email: "test@test.com",
        password: "Password1234",
        firstName: "Test",
        lastName: "Test",
        phoneNumber: "36 30 111 2222",
        biography: "",
        courierApplicationState: CourierApplicationState.APPLIED,
        roles: [],
      };
      const userDaoMock: unknown = {
        getUserById: sinon.stub().withArgs(user.id).resolves(user),
        saveUser: sinon.stub().resolvesArg(0),
      };
      container.bind<IUserDao>(TYPES.IUserDao).toConstantValue(userDaoMock as IUserDao);
      const adminService = container.get<IAdminService>(TYPES.IAdminService);
      const courier = await adminService.acceptCourierApplication(user.id);
      expect(courier.courierApplicationState).toBe(CourierApplicationState.ACCEPTED);
      expect(courier.roles.includes(UserRoles.COURIER)).toBe(true);
    });
  });

});
