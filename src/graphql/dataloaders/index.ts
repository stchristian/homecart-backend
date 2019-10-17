import DataLoader from "dataloader";
import { IAuthenticationService } from "../../services/IAuthenticationService";
import { IOrderService } from "../../services/IOrderService";
import { IProductService } from "../../services/IProductService";
import { IUserService } from "../../services/IUserService";

export interface Services {
  authenticationService: IAuthenticationService;
  userService: IUserService;
  productService: IProductService;
  orderService: IOrderService;
}

export default function(services: Services) {
  return {
    userLoader: new DataLoader(async (ids: string[]) => {
      return services.userService.getUsersByIds(ids);
    }),
    productLoader: new DataLoader(async (ids: string[]) => {
      return services.productService.getProductsByIds(ids);
    }),
    orderLoader: new DataLoader(async (ids: string[]) => {
      return services.orderService.getOrdersByIds(ids);
    }),
  };
}
