import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Customexception } from 'src/exception/customexception';
import { IProduct } from './products.model';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productService: ProductsService) {}

  @Post()
  async addProduct(
    @Body('title') prodTitle: string,
    @Body('description') prodDes: string,
    @Body('price') prodPrice: number,
  ): Promise<{ prodId: string }> {
    const result = await this.productService.insertProduct(
      prodTitle,
      prodDes,
      prodPrice,
    );
    return {
      prodId: result,
    };
  }

  @Get()
  async getAllProducts(): Promise<{ productsList: IProduct[] }> {
    const productsList = await this.productService.getAllProductDetails();
    return { productsList };
  }

  @Get(':id')
  async getTheProductById(
    @Param('id') prodId: string,
  ): Promise<{ product: IProduct }> {
    const product = await this.productService.getTheProductDetailById(prodId);
    return { product };
  }

  @Patch(':id')
  async updateTheProductById(
    @Param('id') prodId: string,
    @Body('title') prodTitle: string,
    @Body('des') prodDes: string,
    @Body('price') prodPrice: number,
  ): Promise<{ message: string }> {
    await this.productService.updateTheProductById(
      prodId,
      prodTitle,
      prodDes,
      prodPrice,
    );

    return { message: 'updated successfully' };
  }

  @Delete(':id')
  async deleteProductById(@Param('id') prodId: string) {
    try {
      await this.productService.deleteProductById(prodId);
    } catch (error) {
      console.log(error);
      throw new Customexception(error.message, error.status);
    }
    return 'Delete Successfully';
  }
}
