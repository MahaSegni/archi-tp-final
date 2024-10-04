// src/product/infrastructure/presentation/email.service.ts
import { Injectable } from '@nestjs/common';
import { Product } from '../../domain/entity/product.entity';

@Injectable()
export class EmailService {
  async sendStockAlert(product: Product): Promise<void> {
    const adminEmail = 'admin@test.fr';
    console.log(`Email envoyé à ${adminEmail} pour le produit ${product.id}, stock atteint 0.`);
  }
}
