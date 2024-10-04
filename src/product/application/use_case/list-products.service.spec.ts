import { ListProductsService } from './list-products.service';
import { Product } from '../../domain/entity/product.entity';
import { ProductRepositoryInterface } from '../../domain/port/persistance/product-repository.interface';

class ProductRepositoryFake implements ProductRepositoryInterface {
  private products: Product[] = [];

  findById(id: string): Product | null {
    return this.products.find(product => product.id === id) || null;
  }

  async delete(productId: string): Promise<void> {
    this.products = this.products.filter(product => product.id !== productId);
  }

  async create(product: Product): Promise<void> {
    this.products.push(product);
  }

  async findAll(): Promise<Product[]> {
    return this.products;
  }

  public clear(): void {
    this.products = [];
  }

  async update(product: Product): Promise<void> {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.products[index] = product;
    }
  }

  decrementStock(product: Product, quantity: number): void {
    product.stock -= quantity;
  }
}

const productRepositoryFake = new ProductRepositoryFake();

describe("ListProductsService", () => {
  let listProductsService: ListProductsService;

  beforeEach(() => {
    productRepositoryFake.clear(); 
    listProductsService = new ListProductsService(productRepositoryFake);
  });

  it('should return a list of products', async () => {
    const product1 = new Product('Product 1', 100, 10, 'Description for Product 1');
    const product2 = new Product('Product 2', 200, 5, 'Description for Product 2');

    await productRepositoryFake.create(product1);
    await productRepositoryFake.create(product2);

    const products = await listProductsService.execute();

    expect(products).toHaveLength(2);
    expect(products[0].name).toBe('Product 1');
    expect(products[1].name).toBe('Product 2');
  });

  it('should return an empty array if no products exist', async () => {
    const products = await listProductsService.execute();
    expect(products).toHaveLength(0);
  });
});
