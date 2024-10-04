import { Discount } from "../../entity/discount.entity";

export interface DiscountRepositoryInterface {
    create(discount: Discount): Promise<void>;
    findById(id: string): Promise<Discount | null>;
    update(discount: Discount): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(): Promise<Discount[]>;
}