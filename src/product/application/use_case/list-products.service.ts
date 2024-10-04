import { ProductRepositoryInterface } from '../../domain/port/persistance/product-repository.interface';
import { Product } from '../../domain/entity/product.entity';

export class ListProductsService {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(isActive?: boolean): Promise<Product[]> {
    const allProducts = await this.productRepository.findAll();

    return allProducts;
  }
}
