import { Product } from "../../entity/product.entity";

export interface ProductRepositoryInterface {
  create(product: Product): Promise<void>;
  update(product: Product): Promise<void>;
  delete(productId: string): Promise<void>;
  findById(productId: string): Product;
  findAll(active?: boolean): Promise<Product[]>;
  decrementStock(produit: Product, quantity: number);
}