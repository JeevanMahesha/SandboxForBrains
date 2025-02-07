import { TProductType } from '../add-product/add-product.model';

export const VEGETABLE_QUANTITY_DOMINATION = {
  'One Kilogram': 1,
  'Half Kilogram': 0.5,
  'Two Kilograms': 2,
  'Two Hundred Fifty Grams': 0.25,
  'Two and a Quarter Kilograms': 2.25,
  'Two and a Half Kilograms': 2.5,
  'Three Quarters of a Kilogram': 0.75,
  'Two and Three Quarters Kilograms': 2.75,
} as const;

export type TQuantityDomination =
  (typeof VEGETABLE_QUANTITY_DOMINATION)[keyof typeof VEGETABLE_QUANTITY_DOMINATION];

export interface IShoppingProductCartValue {
  quantity: TQuantityDomination;
  quantityPrice: number;
  productName: string;
  productType: TProductType;
  productId: string;
  productPrice: number;
}
