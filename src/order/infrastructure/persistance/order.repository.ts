import { InjectDataSource } from '@nestjs/typeorm';
import { Order } from 'src/order/domain/entity/order.entity';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import { DataSource, Repository } from 'typeorm';

export default class OrderRepositoryTypeOrm
  extends Repository<Order>
  implements OrderRepositoryInterface
{
  constructor(@InjectDataSource() private readonly datasource: DataSource) {
    super(Order, datasource.createEntityManager());
  }

  async findById(id: string): Promise<Order | null> {
    const queryBuilder = this.createQueryBuilder('order');

    queryBuilder.where('order.id = :id', { id });

    return queryBuilder.getOne();
  }
  async save(order: any): Promise<void> {
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index > -1) {
      this.orders[index] = order; // Mise à jour de l'ordre existant
    } else {
      this.orders.push(order); // Ajout d'un nouvel ordre
    }
  }
  async findAll(): Promise<Order[]> {
    const queryBuilder = this.createQueryBuilder('order');

    return queryBuilder.getMany();
  }

  async findByCustomerName(customerName: string): Promise<Order[]> {
    const queryBuilder = this.createQueryBuilder('order');

    queryBuilder.where('order.customerName = :customerName', { customerName });

    return queryBuilder.getMany();
  }

  async deleteOrder(id: string): Promise<void> {
    const queryBuilder = this.createQueryBuilder('order');

    queryBuilder.where('order.id = :id', { id });

    await queryBuilder.delete().execute();
  }
  async findOrdersByProductId(productId: string): Promise<Order[]> {
    const queryBuilder = this.createQueryBuilder('order')
      .innerJoinAndSelect('order.items', 'item') 
      .where('item.productId = :productId', { productId });
  
    return queryBuilder.getMany();
  }
  
}
