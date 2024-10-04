import { Product } from "../../domain/entity/product.entity";
import { ProductRepositoryInterface } from "../../domain/port/persistance/product-repository.interface";
import { v4 as uuidv4 } from 'uuid';

export class CreateProductService {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(name: string, price: number, description: string, stock?: number): Promise<void> {
     const product = new Product(name, price, stock, description);
    
    product.id = uuidv4();
    
    await this.productRepository.create(product);
  }
}
