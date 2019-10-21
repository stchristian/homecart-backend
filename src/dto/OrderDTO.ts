import { AmountType } from "../models/Order";

export interface OrderDTO {
  deadline: Date;
  preferredDeliveryTime: { start: Date, end: Date };
  address: AddressDTO;
  customerId: string;
  tipPrice: number;
  items: OrderItemDTO[];
  estimatedPrice: number;
}

export interface AddressDTO {
  zip: number;
  city: string;
  streetAddress: string;
}

export interface OrderItemDTO {
  productId: string;
  amount: number;
  amountType: AmountType;
}
