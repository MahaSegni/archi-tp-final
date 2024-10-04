import { OrderRepositoryInterface } from '../../domain/port/persistance/order.repository.interface';
import { Order } from '../../domain/entity/order.entity';
import { GenerateInvoiceService } from '../../application/use-case/generate-invoice.service';

class OrderRepositoryFake {
  async findById(orderId: string): Promise<Order> {
    const order = new Order({
      customerName: 'John Doe',
      items: [
        { productName: 'item 1', price: 200, quantity: 1 },
        { productName: 'item 1', price: 200, quantity: 1 },
        { productName: 'item 1', price: 200, quantity: 1 },
        { productName: 'item 1', price: 200, quantity: 1 },
        { productName: 'item 1', price: 200, quantity: 1 },
      ],
      shippingAddress: 'Shipping Address',
      invoiceAddress: 'Invoice Address',
    });

    return order;
  }
}

class PdfGeneratorServiceFake {
  async generatePdf(text: string): Promise<Buffer> {
    return Buffer.from(text);
  }
}

const orderRepositoryFake =
  new OrderRepositoryFake() as OrderRepositoryInterface;

const pdfGeneratorServiceFake = new PdfGeneratorServiceFake();

describe("an invoice can't be generated if the order status is PENDING", () => {
  it('should return an error', async () => {
    const generateInvoiceService = new GenerateInvoiceService(
      orderRepositoryFake,
      pdfGeneratorServiceFake,
    );

    await expect(generateInvoiceService.generateInvoice('1')).rejects.toThrow();
  });
});
