export const DB_NAMES = {
  USERS: 'users',
  PRODUCTS: 'products',
} as const;

export type DB_NAMES = (typeof DB_NAMES)[keyof typeof DB_NAMES];
