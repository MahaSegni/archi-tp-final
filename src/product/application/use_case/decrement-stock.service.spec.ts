import { DecrementStockService } from './decrement-stock.service';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product-repository.interface';
import { Product } from '../../domain/entity/product.entity';
import { EmailService } from '../../infrastructure/presentation/email.service';

class ProductRepositoryFake implements ProductRepositoryInterface {
  private products: Product[] = [];

  async create(product: Product): Promise<void> {
    this.products.push(product);
  }

  async update(product: Product): Promise<void> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = product;
    }
  }

  async delete(productId: string): Promise<void> {
    this.products = this.products.filter(product => product.id !== productId);
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.find(product => product.id === id) || null;
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }
}

class EmailServiceFake {
  sendStockAlert(product: Product): Promise<void> {
    return Promise.resolve();
  }
}

describe('DecrementStockService', () => {
  let decrementStockService: DecrementStockService;
  let productRepositoryFake: ProductRepositoryFake;
  let emailServiceFake: EmailServiceFake;

  beforeEach(() => {
    productRepositoryFake = new ProductRepositoryFake();
    emailServiceFake = new EmailServiceFake();
    decrementStockService = new DecrementStockService(productRepositoryFake, emailServiceFake);
  });

  it('should decrement stock successfully', async () => {
    const product = new Product('Test Product', 100, 10, 'Test Description');
    product.id = '1';
    await productRepositoryFake.create(product);

    await decrementStockService.execute(product.id, 5);

    const updatedProduct = await productRepositoryFake.findById(product.id);
    expect(updatedProduct?.stock).toBe(5);
  });

  it('should throw an error if the product does not exist', async () => {
    await expect(decrementStockService.execute('non-existent-id', 5)).rejects.toThrow('Produit non trouvé');
  });

  it('should send a stock alert when stock reaches zero', async () => {
    const product = new Product('Test Product', 100, 5, 'Test Description');
    product.id = '1';
    await productRepositoryFake.create(product);

    const sendStockAlertSpy = jest.spyOn(emailServiceFake, 'sendStockAlert');

    await decrementStockService.execute(product.id, 5);

    expect(sendStockAlertSpy).toHaveBeenCalledWith(product);
  });

  it('should not send a stock alert when stock is above zero', async () => {
    const product = new Product('Test Product', 100, 10, 'Test Description');
    product.id = '1';
    await productRepositoryFake.create(product);

    const sendStockAlertSpy = jest.spyOn(emailServiceFake, 'sendStockAlert');

    await decrementStockService.execute(product.id, 5);

    expect(sendStockAlertSpy).not.toHaveBeenCalled();
  });
});
