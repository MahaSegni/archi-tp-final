import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountRepositoryInterface } from '../../domain/port/persistance/discount-repository.interface';
import { Discount } from '../../domain/entity/discount.entity';

@Injectable()
export class DiscountRepository implements DiscountRepositoryInterface {
  constructor(
    @InjectRepository(Discount)
    private readonly discountRepo: Repository<Discount>,
  ) {}

  async create(discount: Discount): Promise<void> {
    await this.discountRepo.save(discount);
  }

  async findById(id: string): Promise<Discount | null> {
    return await this.discountRepo.findOneBy({ id } as any);
  }

  async update(discount: Discount): Promise<void> {
    await this.discountRepo.save(discount);
  }

  async delete(id: string): Promise<void> {
    await this.discountRepo.delete(id);
  }

  async findAll(): Promise<Discount[]> {
    return await this.discountRepo.find();
  }
}
