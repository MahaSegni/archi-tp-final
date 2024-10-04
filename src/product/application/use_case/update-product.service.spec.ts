import { ProductRepositoryInterface } from '../../domain/port/persistance/product-repository.interface';
import { Product } from '../../domain/entity/product.entity';
import { UpdateProductService } from './update-product.service';
import { BadRequestException } from '@nestjs/common';

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

const productRepositoryFake = new ProductRepositoryFake();

describe("UpdateProductService", () => {
  it('should update a product successfully', async () => {
    const productId = '1';
    const initialProduct = new Product('Initial Product', 50, 5, 'Initial Description');
    initialProduct.id = productId; 
    await productRepositoryFake.create(initialProduct);

    const updateProductService = new UpdateProductService(productRepositoryFake);
    
    const name = 'Updated Product';
    const price = 75;
    const description = 'Updated Description';

    await updateProductService.execute(productId, name, price, description);

    const updatedProduct = await productRepositoryFake.findById(productId);

    expect(updatedProduct).toBeDefined();
    expect(updatedProduct?.name).toBe(name);
    expect(updatedProduct?.price).toBe(price);
    expect(updatedProduct?.description).toBe(description);
  });

  it('should throw an error if the product does not exist', async () => {
    const updateProductService = new UpdateProductService(productRepositoryFake);
    
    const name = 'Non-existent Product';
    const price = 75;
    const description = 'This product does not exist';

    await expect(
      updateProductService.execute('non-existent-id', name, price, description),
    ).rejects.toThrow(new Error("Product not found."));
  });

  it('should throw an error if the updated product does not have a name', async () => {
    const productId = '1';
    const initialProduct = new Product('Initial Product', 50, 5, 'Initial Description');
    initialProduct.id = productId; // Assign an ID to the product
    await productRepositoryFake.create(initialProduct);

    const updateProductService = new UpdateProductService(productRepositoryFake);

    await expect(
      updateProductService.execute(productId, '', 75, 'Updated Description'),
    ).rejects.toThrow(new BadRequestException('Product must have a name, price, and description.'));
  });

  it('should throw an error if the updated product does not have a price', async () => {
    const productId = '1';
    const initialProduct = new Product('Initial Product', 50, 5, 'Initial Description');
    initialProduct.id = productId; // Assign an ID to the product
    await productRepositoryFake.create(initialProduct);

    const updateProductService = new UpdateProductService(productRepositoryFake);

    await expect(
      updateProductService.execute(productId, 'Updated Product', undefined, 'Updated Description'),
    ).rejects.toThrow(new BadRequestException('Product must have a name, price, and description.'));
  });

  it('should throw an error if the updated product does not have a description', async () => {
    const productId = '1';
    const initialProduct = new Product('Initial Product', 50, 5, 'Initial Description');
    initialProduct.id = productId; // Assign an ID to the product
    await productRepositoryFake.create(initialProduct);

    const updateProductService = new UpdateProductService(productRepositoryFake);

    await expect(
      updateProductService.execute(productId, 'Updated Product', 75, ''),
    ).rejects.toThrow(new BadRequestException('Product must have a name, price, and description.'));
  });
});
