import uuid from "uuid/v4";

export interface CreateProductInput {
  name: string;
  description?: string;
  estimatedPrice: number;
}

export class Product {

  public static create(input: CreateProductInput): Product {
    const product = new Product();
    product.id = uuid();
    product.name = input.name;
    product.description = input.description;
    product.estimatedPrice = input.estimatedPrice;
    return product;
  }
  public id: string;
  public name: string;
  public description: string;
  public estimatedPrice: number;
}
