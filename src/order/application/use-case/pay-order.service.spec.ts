import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { Order } from '../../domain/entity/order.entity';
import { PayOrderService } from '../../application/use-case/pay-order.service';

class OrderRepositoryFake {
  async findById(orderId: string): Promise<Order> {
    const order = new Order({
      customerName: 'John Doe',
      items: [
        {  id : '1',productName: 'item 1', price: 200, quantity: 1 },
        {  id : '2',productName: 'item 1', price: 200, quantity: 1 },
        {  id : '3',productName: 'item 1', price: 200, quantity: 1 },
        {  id : '4',productName: 'item 1', price: 200, quantity: 1 },
        {  id : '5',productName: 'item 1', price: 200, quantity: 1 },
      ],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });

    return order;
  }
}

const orderRepositoryFake =
  new OrderRepositoryFake() as OrderRepositoryInterface;

describe("an order can't be paid if the max amount is hit", () => {
  it('should return an error', async () => {
    const payOrderService = new PayOrderService(orderRepositoryFake);

    await expect(payOrderService.execute('1')).rejects.toThrow();
  });
});
