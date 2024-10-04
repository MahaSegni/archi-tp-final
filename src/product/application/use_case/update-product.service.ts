import { ProductRepositoryInterface } from "../../domain/port/persistance/product-repository.interface";

export class UpdateProductService {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(productId: string, name: string, price: number, description: string): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found.");
    }

    product.updateDetails(name, price, description);
    await this.productRepository.update(product);
  }
}
