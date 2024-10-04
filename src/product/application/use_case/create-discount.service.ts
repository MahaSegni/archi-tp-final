import { Discount } from "../../domain/entity/discount.entity";
import { DiscountRepositoryInterface } from "../../domain/port/persistance/discount-repository.interface";

export class CreateDiscountService {
  constructor(private readonly promotionRepository: DiscountRepositoryInterface) {}

  async execute(nom: string, code: string, amount?: number): Promise<void> {
    const promotion = new Discount(nom, code, amount);
    await this.promotionRepository.create(promotion);
  }
}
