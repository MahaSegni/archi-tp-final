import { Product } from '../../entity/product.entity';
export interface EmailServiceInterface {
    sendStockAlert(product: Product): Promise<void>;
  }