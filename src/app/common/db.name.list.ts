export const DB_NAMES = {
  USERS: 'users',
  BASKETS: 'baskets',
} as const;

export type DB_NAMES = (typeof DB_NAMES)[keyof typeof DB_NAMES];
