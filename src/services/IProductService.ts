import { Product } from "../models/Product";
import { ProductDTO } from "../dto/ProductDTO";

export interface IProductService {
  getProductsByIds(ids: string[]): Promise<Array<Product | null>>;
  getAllProducts(): Promise<Product[]>;
  createProduct(data: ProductDTO): Promise<Product>;
  getProductById(productId: string): Promise<Product>;
  search(text: string): Promise<Product[]>;
}
