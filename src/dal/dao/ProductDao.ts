import { injectable } from "inversify";
import "reflect-metadata";
import { Product } from "../../models/Product";
import { IProductDoc, Product as MongooseProduct } from "../db/models/Product";
import { IProductDao } from "./IProductDao";

/**
 *  Persist products into db
 */
@injectable()
export class ProductDao implements IProductDao {
  public async getProductById(id: string): Promise<Product> {
    const product: IProductDoc | null = await MongooseProduct.findOne({ _id: id }).lean();
    if (!product) { throw new Error(`No product with id ${id}`); }
    return this.transformFromDoc(product);
  }

  public async searchProducts(text: string): Promise<Product[]> {
    const products: [IProductDoc] = await MongooseProduct.find({ $text: { $search: text } }).lean();
    return products.map((doc) => this.transformFromDoc(doc));
  }

  public async getManyByIds(ids: string[]): Promise<Product[]> {
    const result: [IProductDoc] = await MongooseProduct.find({
      _id: {
        $in: ids,
      },
    }).lean();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async getAllProducts(): Promise<Product[]> {
    const result: [IProductDoc] = await MongooseProduct.find().lean();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async saveProduct(product: Product): Promise<Product> {
    const result: IProductDoc = await MongooseProduct.findByIdAndUpdate(
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

  private transformFromDoc(doc: IProductDoc): Product {
    const product = new Product();
    product.id = doc._id;
    product.name = doc.name;
    product.description = doc.description;
    product.estimatedPrice = doc.estimatedPrice;
    product.amountType = doc.amountType;
    return product;
  }

  private transformToDoc(product: Product): IProductDoc {
    return {
      _id: product.id,
      name: product.name,
      description: product.description,
      estimatedPrice: product.estimatedPrice,
      amountType: product.amountType,
    };
  }
}
