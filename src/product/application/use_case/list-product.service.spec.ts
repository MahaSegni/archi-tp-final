import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product-repository.interface';
import { Product } from '../../domain/entity/product.entity';
import { ListProductsService } from './list-products.service';

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

  // Ajoutez cette méthode pour réinitialiser les produits entre les tests
  public clear(): void {
    this.products = [];
  }
}

const productRepositoryFake = new ProductRepositoryFake();

describe("ListProductsService", () => {
  let listProductsService: ListProductsService;

  beforeEach(() => {
    productRepositoryFake.clear(); // Réinitialiser le dépôt avant chaque test
    listProductsService = new ListProductsService(productRepositoryFake);
  });

  it('should return all products when no filter is applied', async () => {
    const product1 = new Product('Active Product 1', 100, 5, 'Active Description');
    product1.id = '1'; 
    product1.isActive = true; 
    await productRepositoryFake.create(product1);

    const product2 = new Product('Inactive Product 1', 50, 0, 'Inactive Description');
    product2.id = '2'; 
    product2.isActive = false; 
    await productRepositoryFake.create(product2);

    const allProducts = await listProductsService.execute();
    expect(allProducts).toHaveLength(2);
  });

  it('should return only active products when isActive is true', async () => {
    const product1 = new Product('Active Product 1', 100, 5, 'Active Description');
    product1.id = '1'; 
    product1.isActive = true; 
    await productRepositoryFake.create(product1);

    const product2 = new Product('Active Product 2', 75, 10, 'Another Active Description');
    product2.id = '2'; 
    product2.isActive = true; 
    await productRepositoryFake.create(product2);

    const product3 = new Product('Inactive Product', 50, 0, 'Inactive Description');
    product3.id = '3'; 
    product3.isActive = false; 
    await productRepositoryFake.create(product3);

    const activeProducts = await listProductsService.execute(true);
    expect(activeProducts).toHaveLength(2);
    expect(activeProducts.map(p => p.name)).toEqual(['Active Product 1', 'Active Product 2']);
  });

  it('should return only inactive products when isActive is false', async () => {
    const product1 = new Product('Active Product 1', 100, 5, 'Active Description');
    product1.id = '1'; 
    product1.isActive = true; 
    await productRepositoryFake.create(product1);

    const product2 = new Product('Inactive Product 1', 50, 0, 'Inactive Description');
    product2.id = '2'; 
    product2.isActive = false; 
    await productRepositoryFake.create(product2);

    const product3 = new Product('Inactive Product 2', 25, 0, 'Another Inactive Description');
    product3.id = '3'; 
    product3.isActive = false; 
    await productRepositoryFake.create(product3);

    const inactiveProducts = await listProductsService.execute(false);
    expect(inactiveProducts).toHaveLength(2);
    expect(inactiveProducts.map(p => p.name)).toEqual(['Inactive Product 1', 'Inactive Product 2']);
  });

  it('should return an empty array if there are no products matching the filter', async () => {
    const activeProducts = await listProductsService.execute(false);
    expect(activeProducts).toHaveLength(0);
  });
});
