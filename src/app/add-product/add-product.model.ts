export const PRODUCT_TYPES = {
  VEGETABLE: 'vegetable',
  FRUIT: 'fruit',
} as const;

export type TProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];

export interface INewProduct {
  productName: string | null;
  productType: TProductType | null;
  productPrice: number | null;
}
