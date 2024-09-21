export const PRODUCT_TYPES = {
  VEGETABLE: 'vegetable',
  FRUIT: 'fruit',
} as const;

export type TProductType = (typeof PRODUCT_TYPES)[keyof typeof PRODUCT_TYPES];
