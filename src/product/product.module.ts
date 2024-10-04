import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateProductService } from './application/use_case/create-product.service';
import { UpdateProductService } from './application/use_case/update-product.service';
import { DeleteProductService } from './application/use_case/delete-product.service';
import { ListProductsService } from './application/use_case/list-products.service';
import { DecrementStockService } from './application/use_case/decrement-stock.service';
import { Product } from './domain/entity/product.entity';
import { ProductController } from './infrastructure/presentation/product.controller';
import { EmailService } from './infrastructure/presentation/email.service';
import { ProductRepositoryImpl } from './infrastructure/persistance/product-repository';
import { ProductRepositoryInterface } from './domain/port/persistance/product-repository.interface';
import { OrderRepositoryInterface } from 'src/order/domain/port/persistance/order.repository.interface';
import OrderRepositoryTypeOrm from 'src/order/infrastructure/persistance/order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    ProductRepositoryImpl,
    EmailService,
    OrderRepositoryTypeOrm,
    {
      provide: CreateProductService,
      useFactory: (productRepository: ProductRepositoryImpl) => {
        return new CreateProductService(productRepository);
      },
      inject: [ProductRepositoryImpl],
    },
    {
      provide: UpdateProductService,
      useFactory: (productRepository: ProductRepositoryInterface) => {
        return new UpdateProductService(productRepository);
      },
      inject: [ProductRepositoryImpl],
    },
    {
      provide: DeleteProductService,
      useFactory: (
        productRepository: ProductRepositoryInterface,
        orderRepository: OrderRepositoryInterface 
      ) => {
        return new DeleteProductService(productRepository, orderRepository);
      },
      inject: [ProductRepositoryImpl, OrderRepositoryTypeOrm],
    },    
    {
      provide: ListProductsService,
      useFactory: (productRepository: ProductRepositoryInterface) => {
        return new ListProductsService(productRepository);
      },
      inject: [ProductRepositoryImpl],
    },
    {
      provide: DecrementStockService,
      useFactory: (productRepository: ProductRepositoryInterface, emailService: EmailService) => {
        return new DecrementStockService(productRepository, emailService);
      },
      inject: [ProductRepositoryImpl, EmailService], 
    },
  ],
})
export class ProductModule {}
