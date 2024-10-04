import { AddItemToCartService } from '../use-case/add-item-to-cart.service';
import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { Order, OrderStatus } from '../../domain/entity/order.entity';
import { ItemDetailCommand } from '../../domain/entity/order-item.entity';

class OrderRepositoryFake implements OrderRepositoryInterface {
    private orders: Order[] = [];
  
    async findById(orderId: string): Promise<Order | null> {
      return this.orders.find(order => order.id === orderId) || null;
    }
  
    async save(order: Order): Promise<Order> {
      this.orders.push(order);
      return order;
    }
  
    // Méthodes manquantes de l'interface, que tu peux remplir si nécessaire
    async findAll(): Promise<Order[]> {
      return this.orders;
    }
  
    async findByCustomerName(customerName: string): Promise<Order[]> {
      return this.orders.filter(order => order.customerName === customerName);

    }
  
    async deleteOrder(orderId: string): Promise<void> {
      this.orders = this.orders.filter(order => order.id !== orderId);
    }
  
    async findOrdersByProductId(productId: string): Promise<Order[]> {
      return this.orders.filter(order =>
        order.orderItems.some(item => item.id === productId)
      );
    }
  }
  

const orderRepositoryFake =
  new OrderRepositoryFake() as OrderRepositoryInterface;

describe('AddItemToCartService', () => {
  it('should throw an error if the order is not found', async () => {
    const addItemToCartService = new AddItemToCartService(orderRepositoryFake);

    await expect(
      addItemToCartService.execute('invalid-order-id', {
        id : '1',
        productName: 'item 1',
        price: 10,
        quantity: 1,
      }),
    ).rejects.toThrow('Order not found');
  });

  it('should throw an error if the order status is not pending', async () => {
    const order = new Order({
      customerName: 'John Doe',
      items: [],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });
    order['status'] = OrderStatus.PAID; // Forcing status to PAID for the test

    const addItemToCartService = new AddItemToCartService(orderRepositoryFake);
    await orderRepositoryFake.save(order);

    await expect(
      addItemToCartService.execute(order.id, {
        id : '1',
        productName: 'item 1',
        price: 10,
        quantity: 1,
      }),
    ).rejects.toThrow('Cannot add items to a non-pending order');
  });

  it('should add an item to a pending order and recalculate the price', async () => {
    const order = new Order({
      customerName: 'John Doe',
      items: [],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });
    order['status'] = OrderStatus.PENDING; // Forcing status to PENDING for the test

    const addItemToCartService = new AddItemToCartService(orderRepositoryFake);
    await orderRepositoryFake.save(order);

    const itemDetail: ItemDetailCommand = {
        id : '1',
      productName: 'item 1',
      price: 10,
      quantity: 1,
    };

    await addItemToCartService.execute(order.id, itemDetail);

    expect(order.orderItems).toHaveLength(1);
    expect(order.price).toBe(10);
  });
});
