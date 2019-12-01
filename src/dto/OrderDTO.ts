import { AmountType } from "../enums";
import * as yup from "yup";

export interface OrderDTO {
  deadline?: Date;
  preferredDeliveryTime?: { start: Date, end: Date };
  address?: {
    zip?: number;
    city?: string;
    streetAddress?: string;
  };
  customerId?: string;
  tipPrice?: number;
  items?: Array<{
    productId?: string;
    amount?: number;
    amountType?: AmountType;
  }>;
  estimatedPrice?: number;
}

export const createOrderInputValidator = yup.object({
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
    // amountType: yup.mixed().oneOf(["MASS", "PIECE", "LENGTH", "AREA"]).required(),
  })).required(),
});

export type CreateOrderInput = yup.InferType<typeof createOrderInputValidator>;
