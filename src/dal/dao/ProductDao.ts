import { injectable } from "inversify";
import "reflect-metadata";
import { Product } from "../../models/Product";
import { IProductDocument, Product as MongooseProduct, IProduct } from "../db/models/Product";
import { IProductDao } from "./IProductDao";

/**
 *  Persist products into db
 */
@injectable()
export class ProductDao implements IProductDao {
  public async getProductById(id: string): Promise<Product>  {
    const product = await MongooseProduct.findOne({ _id: id }, null, { lean: true });
    if (!product) { throw new Error(`No product with id ${id}`); }
    return this.transformFromDoc(product);
  }

  public async searchProducts(text: string): Promise<Product[]> {
    const products = await MongooseProduct.find({ $text: { $search: text }}, null, { lean: true });
    return products.map((doc) => this.transformFromDoc(doc));
  }

  public async getManyByIds(ids: string[]): Promise<Product[]> {
    console.log(`Product ids requested ${ids}`);
    const result = await MongooseProduct.find({
      _id: {
        $in: ids,
      },
    }, null, { lean: true });
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async getAllProducts(): Promise<Product[]> {
    const result = await MongooseProduct.find(null, null, { lean: true });
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async saveProduct(product: Product): Promise<Product> {
    const result = await MongooseProduct.findByIdAndUpdate(
      product.id,
      this.transformToDoc(product),
      {
        upsert: true,
        // @ts-ignore
        lean: true,
        new: true,
      });
    if (!result) {
      throw new Error("Failed to save product to db");
    }
    return this.transformFromDoc(result);
  }

  public async deleteProductById(id: string): Promise<void> {
    const result = await MongooseProduct.deleteOne({
      _id: id,
    });
  }

  private transformFromDoc(doc: IProductDocument): Product {
    const product = new Product();
    product.id = doc._id;
    product.name = doc.name;
    product.description = doc.description;
    product.estimatedPrice = doc.estimatedPrice;
    return product;
  }

  private transformToDoc(product: Product): IProduct {
    return {
      name: product.name,
      description: product.description,
      estimatedPrice: product.estimatedPrice,
    };
  }
}
