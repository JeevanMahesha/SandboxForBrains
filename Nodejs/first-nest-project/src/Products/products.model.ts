import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// this is used with mongoose schema
// export const ProductSchema = new Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   price: { type: Number, required: true },
// });

// this is used with nesj/mongoose schema
@Schema()
export class Product {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

export interface IProduct extends Document {
  id: any;
  title: string;
  description: string;
  price: number;
}
