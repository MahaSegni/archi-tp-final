import { Injectable } from "@nestjs/common";
import { Product } from "../../domain/entity/product.entity"; 
import { ProductRepositoryInterface } from "../../domain/port/persistance/product-repository.interface";
import { EmailService } from "../../infrastructure/presentation/email.service";

@Injectable()
export class DecrementStockService {
  constructor(
    private readonly productRepository: ProductRepositoryInterface,
    private readonly emailService: EmailService,
  ) {}

  async execute(productId: string, quantity: number): Promise<void> {
    const product: Product | null = await this.productRepository.findById(productId);

    if (!product) {
      throw new Error('Produit non trouvé');
    }

    this.productRepository.decrementStock(product, quantity);
    await this.productRepository.update(product);

    if (product.stock === 0) {
      await this.emailService.sendStockAlert(product);
    }
  }
}
