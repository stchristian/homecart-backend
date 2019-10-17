import DataLoader = require("dataloader");
import { injectable } from "inversify";
import { Collection } from "mongodb";
import "reflect-metadata";
import { Product } from "../../models/Product";
import { getDb } from "../db";
import { IProductDao } from "./IProductDao";

export interface ProductDocument {
  _id: string;
  estimatedPrice: number;
  name: string;
  description: string;
}

/**
 *  Persist products into db
 */
@injectable()
export class ProductDao implements IProductDao {
  private products: Collection<ProductDocument>;
  private loader: DataLoader<string, Product> = null;

  constructor() {
    this.products = getDb().collection("products");
    this.products.createIndex({ name: "text" });
  }

  public async getProductById(id: string): Promise<Product>  {
    // if (this.loader === null) {
    //   this.loader = new DataLoader(this.getManyByIds.bind(this));
    // }
    const product = await this.products.findOne({ _id: id });
    if (!product) { throw new Error(`No product with id ${id}`); }
    // return this.loader.load(id);
    return this.transformFromDoc(product);
  }

  public async searchProducts(text: string): Promise<Product[]> {
    const products = await this.products.find({ $text: { $search: text }}).toArray();
    return products.map((doc) => this.transformFromDoc(doc));
  }

  public async getManyByIds(ids: string[]): Promise<Product[]> {
    console.log(`Product ids requested ${ids}`);
    // this.loader = null;
    const result = await this.products.find({
      _id: {
        $in: ids,
      },
    }).toArray();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async getAllProducts(): Promise<Product[]> {
    const result = await this.products.find().toArray();
    return result.map((doc) => this.transformFromDoc(doc));
  }

  public async saveProduct(product: Product): Promise<Product> {
    const result = await this.products.replaceOne(
      {
      _id: product.id,
      },
      this.transformToDoc(product),
      {
        upsert: true,
      });
    if ( result.ops.length === 0) {
      throw new Error("Failed to save product to db");
    }
    return this.transformFromDoc(result.ops[0]);
  }

  public async deleteProductById(id: string): Promise<void> {
    const result = await this.products.deleteOne({
      _id: id,
    });
  }

  private transformFromDoc(doc: ProductDocument): Product {
    const product = new Product();
    product.id = doc._id;
    product.name = doc.name;
    product.description = doc.description;
    product.estimatedPrice = doc.estimatedPrice;
    return product;
  }

  private transformToDoc(product: Product): ProductDocument {
    return {
      _id: product.id,
      name: product.name,
      description: product.description,
      estimatedPrice: product.estimatedPrice,
    };
  }
}
