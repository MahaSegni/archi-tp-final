import { PdfGeneratorServiceInterface } from 'src/order/domain/port/pdf/pdf-generator.service.interface';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';

export class GenerateInvoiceService {
  constructor(
    private readonly orderRepository: OrderRepositoryInterface,
    private readonly pdfGeneratorService: PdfGeneratorServiceInterface,
  ) {}

  async generateInvoice(orderId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    const invoiceInfos = order.getInvoiceInfos();

   // return this.pdfGeneratorService.generatePdf(invoiceInfos);
  }
}
