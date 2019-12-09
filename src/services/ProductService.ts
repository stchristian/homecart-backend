import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IProductDao } from "../dal/dao/IProductDao";
import { TYPES } from "../inversify/types";
import { Product } from "../models/Product";
import { IProductService } from "./IProductService";
import { CreateProductInput, createProductValidator } from "../dto/ProductDTO";

@injectable()
export class ProductService implements IProductService {
  private productDao: IProductDao;

  constructor(
    @inject(TYPES.IProductDao) productDao: IProductDao,
  ) {
    this.productDao = productDao;
  }

  public getProductById(productId: string): Promise<Product> {
    return this.productDao.getProductById(productId);
  }

  public async getProductsByIds(ids: string[]): Promise<Array<Product | null>> {
    const products =  await this.productDao.getManyByIds(ids);
    return ids.map((id) => {
      const index = products.findIndex((product) => product.id === id);
      return index === -1 ? null : products[index];
    });
  }

  public getAllProducts(): Promise<Product[]> {
    return this.productDao.getAllProducts();
  }

  public async createProduct(data: CreateProductInput): Promise<Product> {
    await createProductValidator.validate(data);
    const product = Product.create(data);
    return this.productDao.saveProduct(product);
  }

  public search(text: string): Promise<Product[]> {
    return this.productDao.searchProducts(text);
  }
}
