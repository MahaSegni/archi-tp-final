import { ProductRepositoryInterface } from '../../domain/port/persistance/product-repository.interface';
import { Product } from '../../domain/entity/product.entity';
import { CreateProductService } from './create-product.service';

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

  findById(id: string): Product {
    return this.products.find(product => product.id === id) || null;
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }
  decrementStock(product: Product, quantity: number) {
    product.stock -= quantity;
  }
}

const productRepositoryFake = new ProductRepositoryFake();

describe("CreateProductService", () => {
  it('should create a product successfully', async () => {
    const createProductService = new CreateProductService(productRepositoryFake);
    
    const name = 'Test Product';
    const price = 100;
    const description = 'A product for testing';
    const stock = 10;

    await createProductService.execute(name, price, description, stock);

    const createdProduct = await productRepositoryFake.findById(productRepositoryFake['products'][0].id);

    expect(createdProduct).toBeDefined();
    expect(createdProduct?.name).toBe(name);
    expect(createdProduct?.price).toBe(price);
    expect(createdProduct?.description).toBe(description);
    expect(createdProduct?.stock).toBe(stock);
  });

  it('should throw an error if the product does not have a name', async () => {
    const createProductService = new CreateProductService(productRepositoryFake);

    const name = '';
    const price = 100;
    const description = 'A product for testing';

    await expect(
      createProductService.execute(name, price, description),
    ).rejects.toThrow(new Error('Product must have a name, price, and description.'));
  });

  it('should throw an error if the product does not have a price', async () => {
    const createProductService = new CreateProductService(productRepositoryFake);

    const name = 'Test Product';
    const price = undefined; 
    const description = 'A product for testing';

    await expect(
      createProductService.execute(name, price, description),
    ).rejects.toThrow(new Error('Product must have a name, price, and description.'));
  });

  it('should throw an error if the product does not have a description', async () => {
    const createProductService = new CreateProductService(productRepositoryFake);

    const name = 'Test Product';
    const price = 100;
    const description = '';

    await expect(
      createProductService.execute(name, price, description),
    ).rejects.toThrow(new Error('Product must have a name, price, and description.'));
  });
});
