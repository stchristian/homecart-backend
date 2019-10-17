import { Product } from "../../models/Product";

export interface IProductDao {
  getProductById(id: string): Promise<Product>;
  getManyByIds(ids: string[]): Promise<Product[]>;
  getAllProducts(): Promise<Product[]>;
  saveProduct(product: Product): Promise<Product>;
  deleteProductById(id: string): Promise<void>;
  searchProducts(text: string): Promise<Product[]>;
}
