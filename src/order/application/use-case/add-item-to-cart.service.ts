import { Injectable } from "@nestjs/common";
import { Order, OrderStatus } from "../../domain/entity/order.entity";
import { OrderRepositoryInterface } from "src/order/domain/port/persistance/order.repository.interface";
import { ItemDetailCommand, OrderItem } from "src/order/domain/entity/order-item.entity";

@Injectable()
export class AddItemToCartService {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
  ) {}

  async execute(orderId: string, itemDetail: ItemDetailCommand): Promise<void> {
    const order: Order | null = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.addItem(itemDetail);
    await this.orderRepository.save(order);
  }
}
