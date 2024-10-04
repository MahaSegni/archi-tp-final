import { Product } from "../../entity/product.entity";

export interface ProductRepositoryInterface {
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(productId: string): Promise<void>;
  findById(productId: string): Promise<Product | null>;
  findAll(active?: boolean): Promise<Product[]>;
}