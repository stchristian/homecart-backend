import * as yup from "yup";

export interface ProductDTO {
  name: string;
  description?: string;
  estimatedPrice: number;
}

export const createProductValidator = yup.object({
  name: yup.string().required(),
  description: yup.string().ensure(),
  estimatedPrice: yup.number().positive(),
});

export type CreateProductInput = yup.InferType<typeof createProductValidator>;
