import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  @Expose({ groups: ['group_products'] })
  id?: string;

  @Column()
  @Expose({ groups: ['group_products'] })
  name: string;

  @Column()
  @Expose({ groups: ['group_products'] })
  price: number;

  @Column({ default: 0 })
  @Expose({ groups: ['group_products'] })
  stock: number;

  @Column({ default: true })
  @Expose({ groups: ['group_products'] })
  isActive?: boolean;

  @Column()
  @Expose({ groups: ['group_products'] })
  description: string;

  @CreateDateColumn()
  @Expose({ groups: ['group_products'] })
  createdAt: Date;

 constructor(name: string, price: number, stock: number, description: string) {
    this.name = name;
    this.price = price;
    this.stock = stock ?? 0; // Si le stock n'est pas défini, mettez-le à 0
    this.description = description;
    this.validateProduct(); // Validation des propriétés à la création
  }

  private validateProduct() {
    if (!this.name || !this.price || !this.description) {
      throw new BadRequestException('Product must have a name, price, and description.');
    }
  }

  updateDetails(name: string, price: number, description: string) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.validateProduct();
  }

  deactivate() {
    this.isActive = false;
  }

  activate() {
    this.isActive = true;
  }

  isInStock(): boolean {
    return this.stock > 0;
  }

  decrementStock(quantity: number): void {
    if (quantity <= 0) {
      throw new BadRequestException("Quantity must be greater than 0.");
    }

    if (this.stock - quantity < 0) {
      throw new BadRequestException("Insufficient stock.");
    }

    this.stock -= quantity;
  }

  canBeDeleted(isLinkedToOrder: boolean): void {
    if (isLinkedToOrder) {
      throw new BadRequestException("Cannot delete a product linked to an existing order.");
    }
  }
}
