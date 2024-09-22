import { FormArray, FormControl } from '@angular/forms';
import { TQuantityDomination } from './shopping-cart.model';

export interface IShoppingProductCartForm {
  quantity: FormControl<TQuantityDomination | null>;
  price: FormControl<number | null>;
  productName: FormControl<string | null>;
  productType: FormControl<TQuantityDomination | null>;
  productId: FormControl<string | null>;
  productPrice: FormControl<number | null>;
}

export interface IShoppingCartForm {
  products: FormArray<FormControl<IShoppingProductCartForm | null>>;
  total: FormControl<number | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  userId: FormControl<string | null>;
  id: FormControl<string | null>;
  createdAt: FormControl<Date | null>;
  updatedAt: FormControl<Date | null>;
  status: FormControl<string | null>;
}
