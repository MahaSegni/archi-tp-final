import { DecrementStockService } from './decrement-stock.service';
import { Product } from '../../domain/entity/product.entity';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product-repository.interface';
import { EmailService } from '../../infrastructure/presentation/email.service';

class ProductRepositoryFake implements ProductRepositoryInterface {
  private products: Product[] = [];

  findById(id: string): Product | null {
    return this.products.find(product => product.id === id) || null;
  }

  async create(product: Product): Promise<void> {
    this.products.push(product);
  }

  async update(product: Product): Promise<void> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.products[index] = product;
    }
  }

  async delete(productId: string): Promise<void> {
    this.products = this.products.filter(product => product.id !== productId);
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  decrementStock(product: Product, quantity: number): void {
    product.stock -= quantity;
  }

  public clear(): void {
    this.products = [];
  }
}

class EmailServiceFake {
  async sendStockAlert(product: Product): Promise<void> {
    // Simulate sending an email alert for stock
  }
}

const productRepositoryFake = new ProductRepositoryFake();
const emailServiceFake = new EmailServiceFake();

describe("DecrementStockService", () => {
  let decrementStockService: DecrementStockService;

  beforeEach(() => {
    productRepositoryFake.clear();
    decrementStockService = new DecrementStockService(productRepositoryFake, emailServiceFake);
  });

  it('should throw an error if product is not found', async () => {
    const invalidProductId = 'non-existent-id';
    try {
      await decrementStockService.execute(invalidProductId, 1);
    } catch (error) {
      if (error.message !== 'Produit non trouvé') {
        throw new Error("Expected 'Produit non trouvé' error but got a different one.");
      }
    }
  });

  it('should decrement stock and update product', async () => {
    const product = new Product('Test Product', 100, 10, 'Test Description');
    product.id = '1';
    await productRepositoryFake.create(product);

    await decrementStockService.execute(product.id, 3);

    const updatedProduct = await productRepositoryFake.findById(product.id);
    if (updatedProduct.stock !== 7) {
      throw new Error(`Expected stock to be 7, but got ${updatedProduct.stock}`);
    }
  });

  it('should send an email alert when stock reaches zero', async () => {
    const product = new Product('Test Product', 100, 3, 'Test Description');
    product.id = '1';
    await productRepositoryFake.create(product);

    const sendStockAlertSpy = jest.spyOn(emailServiceFake, 'sendStockAlert');

    await decrementStockService.execute(product.id, 3);

    if (!sendStockAlertSpy.mock.calls.length) {
      throw new Error("Expected sendStockAlert to have been called, but it was not.");
    }
  });

  it('should throw an error if quantity is greater than stock', async () => {
    const product = new Product('Test Product', 100, 2, 'Test Description');
    product.id = '1';
    await productRepositoryFake.create(product);

    try {
      await decrementStockService.execute(product.id, 3);
    } catch (error) {
      if (error.message !== 'Insufficient stock.') {
        throw new Error("Expected 'Insufficient stock.' error but got a different one.");
      }
    }
  });
});
