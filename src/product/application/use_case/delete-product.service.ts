import { OrderRepositoryInterface } from "src/order/domain/port/persistance/order.repository.interface";
import { ProductRepositoryInterface } from "../../domain/port/persistance/product-repository.interface";

export class DeleteProductService {
  constructor(
    private readonly productRepository: ProductRepositoryInterface,
    private readonly orderRepository: OrderRepositoryInterface
  ) {}

  async execute(productId: string): Promise<void> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error("Product not found.");
    }

    const orders = await this.orderRepository.findOrdersByProductId(productId);
    product.canBeDeleted(orders.length > 0); 

    await this.productRepository.delete(productId);
  }
}
