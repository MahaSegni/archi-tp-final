import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { CreateOrderCommand, Order } from '../../domain/entity/order.entity';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product-repository.interface';
import { EmailService } from 'src/product/infrastructure/presentation/email.service';

export class CreateOrderService {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface,
    private readonly emailService: EmailService,
  ) {}

  async execute(createOrderCommand: CreateOrderCommand): Promise<Order> {
    const orderItems = [];

    for (const item of createOrderCommand.items) {
      const product = await this.productRepository.findById(item.id);

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.isInStock() || product.stock < item.quantity) {
        await this.emailService.sendStockAlert(product);
      }

      product.decrementStock(item.quantity);

      // Ajout explicite de la propriété 'price'
      orderItems.push({
        id: item.id,
        productName: item.productName,
        quantity: item.quantity,
        price: product.price, // Récupération du prix du produit
      });
    }

    const order = new Order({
      customerName: createOrderCommand.customerName,
      items: orderItems,
      shippingAddress: createOrderCommand.shippingAddress,
      invoiceAddress: createOrderCommand.invoiceAddress,
    });

    await this.orderRepository.save(order);

    return order;
  }
}
