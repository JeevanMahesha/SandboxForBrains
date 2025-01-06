import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customexception } from 'src/exception/customexception';
import { IProduct, Product } from './products.model';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Products') private readonly productModel: Model<Product>,
  ) {}

  async insertProduct(
    title: string,
    description: string,
    price: number,
  ): Promise<string> {
    try {
      const newProduct = new this.productModel({ title, description, price });
      const saveResult = await newProduct.save();
      return saveResult.id;
    } catch (error) {
      console.log(error.message);
      throw new Customexception(
        'Unable to Save the product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllProductDetails(): Promise<IProduct[]> {
    const productsList = await this.productModel.find().exec();
    return productsList.map(this.filterTheReturnData);
  }

  async getTheProductDetailById(id: string): Promise<IProduct> {
    const productById = await this.findTheProductById(id);
    const filteredData = this.filterTheReturnData(productById);
    return { ...filteredData };
  }

  async updateTheProductById(
    id: string,
    title: string,
    des: string,
    price: number,
  ): Promise<void> {
    if (!title || !des || !price) {
      throw new Error('Data is Incomplete');
    }
    let updateProduct = null;
    try {
      updateProduct = await this.findTheProductById(id);
      updateProduct.title = title;
      updateProduct.description = des;
      updateProduct.price = price;
      updateProduct.save();
    } catch (error) {
      console.log(error.message);
      throw new Customexception(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteProductById(_id: any) {
    const { deletedCount = null } = await this.productModel
      .deleteOne({ _id })
      .exec();
    if (deletedCount === 0) {
      throw new NotFoundException('Product not found');
    }
  }

  private async findTheProductById(id: string): Promise<IProduct> {
    let productById = null;
    try {
      productById = await this.productModel.findById(id);
    } catch (error) {
      console.log(error.message);
      throw new Customexception(
        'Unable to find the product',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    if (!productById) {
      throw new NotFoundException('Product not found');
    }
    return productById;
  }

  private filterTheReturnData(products: IProduct | any): any {
    return {
      id: products.id,
      title: products.title,
      description: products.description,
      price: products.price,
    };
  }
}
