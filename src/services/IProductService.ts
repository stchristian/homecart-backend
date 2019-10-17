import { CreateProductInput, Product } from "../models/Product";

export interface IProductService {
  getProductsByIds(ids: string[]): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  createProduct(data: CreateProductInput): Promise<Product>;
  getProductById(productId: string): Promise<Product>;
  search(text: string): Promise<Product[]>;
}
