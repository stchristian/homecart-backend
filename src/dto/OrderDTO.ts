import { AmountType } from "../models/Order";
import * as yup from "yup";

export interface OrderDTO {
  deadline: Date;
  preferredDeliveryTime: { start: Date, end: Date };
  address: AddressDTO;
  customerId: string;
  tipPrice: number;
  items: OrderItemDTO[];
  estimatedPrice?: number;
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

export const orderDTOValidator = yup.object().shape({
  deadline: yup.date().min(new Date(), "Deadline must be in future").required(),
  preferredDeliveryTime: yup.object({
    start: yup.date().min(new Date(), "Preferred delivery time start must be in future"),
    end: yup.date().min(yup.ref("start"), "Preferred delivery time end must be after start"),
  }).required(),
  customerId: yup.string().required(),
  tipPrice: yup.number().positive().required(),
  address: yup.object({
    city: yup.string().required(),
    zip: yup.number().required(),
    streetAddress: yup.string().required(),
  }),
  items: yup.array().of(yup.object({
    productId: yup.string().required(),
    amount: yup.number().positive().required(),
    amountType: yup.string().required(),
  })).required(),
});
