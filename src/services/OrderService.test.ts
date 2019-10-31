import { Container } from "inversify";
import { TYPES } from "../inversify/types";
import { IUserDao } from "../dal/dao/IUserDao";
import { IOrderDao } from "../dal/dao/IOrderDao";
import { IOrderService } from "./IOrderService";
import { IUserService } from "./IUserService";
import sinon from "sinon";
import { IProductService } from "./IProductService";
import { OrderService } from "./OrderService";

describe("User service", () => {

  test("Set courier for order", async () => {
    const mockedCourier = {
      id: "USERID#123",
      isCourier: true,
    };
    const mockedOrder = {
      id: "ORDERID#123",
      state: "POSTED",
      courierId: null,
    };
    const orderDaoMock: any = {
      getOrderById: sinon.stub().withArgs(mockedOrder.id).resolves(mockedOrder),
      saveOrder: sinon.stub().resolvesArg(0),
    };
    const userServiceMock: any = {
      getUserById: sinon.stub().withArgs(mockedCourier.id).resolves(mockedCourier),
    };
    const container = new Container();
    container.bind<IOrderService>(TYPES.IOrderService).to(OrderService).inSingletonScope();
    container.bind<IOrderDao>(TYPES.IOrderDao).toConstantValue(orderDaoMock as IOrderDao);
    container.bind<IUserService>(TYPES.IUserService).toConstantValue(userServiceMock as IUserService);
    container.bind<IUserDao>(TYPES.IUserDao).toConstantValue(null);
    container.bind<IProductService>(TYPES.IProductService).toConstantValue(null);
    const orderService = container.get<IOrderService>(TYPES.IOrderService);
    const result = await orderService.setCourierForOrder({
      orderId: mockedOrder.id,
      courierId: mockedCourier.id,
    });
    expect(result.state).toBe("ASSIGNED");
    expect(result.courierId).toBe(mockedCourier.id);
    expect(orderDaoMock.getOrderById.calledOnce).toBe(true);
    expect(orderDaoMock.saveOrder.calledOnce).toBe(true);
    expect(userServiceMock.getUserById.calledOnce).toBe(true);
  });

});
