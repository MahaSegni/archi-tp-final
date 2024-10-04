import { DeleteProductService } from './delete-product.service';
import { Product } from '../../domain/entity/product.entity';
import { ProductRepositoryInterface } from 'src/product/domain/port/persistance/product-repository.interface';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';

class ProductRepositoryFake implements ProductRepositoryInterface {
  private products: Product[] = [];

  async findById(id: string): Promise<Product | null> {
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
}

class OrderRepositoryFake implements OrderRepositoryInterface {
  private orders: { productId: string; id: string; customerName: string; /* autres propriétés */ }[] = [];

  async findOrdersByProductId(productId: string): Promise<any[]> {
    return this.orders.filter(order => order.productId === productId);
  }

  async create(order: any): Promise<void> {
    this.orders.push(order);
  }

  async save(order: any): Promise<void> {
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index > -1) {
      this.orders[index] = order; // Mise à jour de l'ordre existant
    } else {
      this.orders.push(order); // Ajout d'un nouvel ordre
    }
  }

  async findById(id: string): Promise<any | null> {
    return this.orders.find(order => order.id === id) || null;
  }

  async findAll(): Promise<any[]> {
    return this.orders;
  }

  async findByCustomerName(customerName: string): Promise<any[]> {
    return this.orders.filter(order => order.customerName === customerName);
  }

  async deleteOrder(id: string): Promise<void> {
    this.orders = this.orders.filter(order => order.id !== id);
  }

  public clear(): void {
    this.orders = [];
  }
}

const productRepositoryFake = new ProductRepositoryFake();
const orderRepositoryFake = new OrderRepositoryFake();

describe("DeleteProductService", () => {
  let deleteProductService: DeleteProductService;

  beforeEach(() => {
    productRepositoryFake.clear(); // Réinitialiser le dépôt de produits
    orderRepositoryFake.clear(); // Réinitialiser le dépôt de commandes
    deleteProductService = new DeleteProductService(productRepositoryFake, orderRepositoryFake);
  });

  it('should throw an error if the product does not exist', async () => {
    await expect(deleteProductService.execute('non-existent-id')).rejects.toThrow("Product not found.");
  });

  it('should delete the product if no orders are associated', async () => {
    const product = new Product('Test Product', 100, 5, 'Test Description');
    product.id = '1'; 
    product.isActive = true; 
    await productRepositoryFake.create(product);

    await deleteProductService.execute(product.id);

    const deletedProduct = await productRepositoryFake.findById(product.id);
    expect(deletedProduct).toBeNull();
  });

  it('should not delete the product if it is associated with existing orders', async () => {
    const product = new Product('Test Product', 100, 5, 'Test Description');
    product.id = '1'; 
    product.isActive = true; 
    await productRepositoryFake.create(product);

    // Créer une commande associée au produit
    const order = { productId: product.id, id: 'order-1', customerName: 'John Doe' };
    await orderRepositoryFake.create(order);

    await expect(deleteProductService.execute(product.id)).rejects.toThrow("Product cannot be deleted because it is associated with existing orders.");
  });
});
