import { Order } from 'src/order/domain/entity/order.entity';

export interface OrderRepositoryInterface {
  save(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findAll(): Promise<Order[]>;
  findByCustomerName(customerName: string): Promise<Order[]>;
  deleteOrder(id: string): Promise<void>;
  findOrdersByProductId(productId: string): Promise<Order[]>;
}
