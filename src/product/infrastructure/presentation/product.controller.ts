import { Controller, Post, Body, Delete, Put, Get, Param } from '@nestjs/common';
import { CreateProductService } from '../../application/use_case/create-product.service';
import { DeleteProductService } from '../../application/use_case/delete-product.service';
import { ListProductsService } from '../../application/use_case/list-products.service';
import { UpdateProductService } from '../../application/use_case/update-product.service';
import { DecrementStockService } from '../../application/use_case/decrement-stock.service';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductService: CreateProductService,
    private readonly updateProductService: UpdateProductService,
    private readonly deleteProductService: DeleteProductService,
    private readonly listProductsService: ListProductsService,
    private readonly decrementStockService: DecrementStockService
  ) {}

  @Post()
  async create(@Body() body: { name: string; price: number; description: string; stock?: number }) {
    return this.createProductService.execute(body.name, body.price, body.description, body.stock);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { name: string; price: number; description: string }) {
    return this.updateProductService.execute(id, body.name, body.price, body.description);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.deleteProductService.execute(id);
  }

  @Get()
  async list() {
    return this.listProductsService.execute();
  }
  @Post('decrement-stock')
  async decrementStock(@Body('productId') productId: string, @Body('quantity') quantity: number) {
    await this.decrementStockService.execute(productId, quantity);
  }
}
