import * as yup from "yup";
import { AmountType } from "../enums";

export interface ProductDTO {
  name: string;
  description?: string;
  estimatedPrice: number;
  amountType: AmountType;
}

export const createProductValidator = yup.object({
  name: yup.string().required(),
  description: yup.string().ensure(),
  estimatedPrice: yup.number().positive(),
  amountType: yup.mixed().oneOf(Object.values(AmountType)).required(),
});

export type CreateProductInput = yup.InferType<typeof createProductValidator>;
