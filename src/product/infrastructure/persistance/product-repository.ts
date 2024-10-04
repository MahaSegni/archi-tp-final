import { ProductRepositoryInterface } from '../../domain/port/persistance/product-repository.interface';
import { Product } from '../../domain/entity/product.entity';
import { BadRequestException } from '@nestjs/common';

export class ProductRepositoryImpl implements ProductRepositoryInterface {
  private products: Product[] = [];

  async create(product: Product): Promise<void> {
    this.products.push(product);
  }

  async update(product: Product): Promise<void> {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index > -1) {
      this.products[index] = product;
    }
  }

  async delete(productId: string): Promise<void> {
    this.products = this.products.filter((p) => p.id !== productId);
  }

  findById(productId: string): Product{
    return this.products.find((p) => p.id === productId) || null;
  }

  async findAll(): Promise<Product[]> {
    return this.products; 
  }
    decrementStock(produit: Product, quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than 0.");
    }

    if (produit.stock - quantity < 0) {
      throw new BadRequestException("Insufficient stock.");
    }

    produit.stock -= quantity;
  }
}
