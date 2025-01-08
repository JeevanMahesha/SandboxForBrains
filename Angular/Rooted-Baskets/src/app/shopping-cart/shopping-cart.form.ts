import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { TQuantityDomination } from './shopping-cart.model';
import { TProductType } from '../add-product/add-product.model';

export interface IShoppingProductCartForm {
  quantity: FormControl<TQuantityDomination | null>;
  quantityPrice: FormControl<number | null>;
  productName: FormControl<string | null>;
  productType: FormControl<TProductType | null>;
  productId: FormControl<string | null>;
  productPrice: FormControl<number | null>;
}

export interface IShoppingCartForm {
  products: FormArray<FormGroup<IShoppingProductCartForm>>;
  total: FormControl<number | null>;
  name: FormControl<string | null>;
  email: FormControl<string | null>;
  userId: FormControl<string | null>;
  id: FormControl<string | null>;
  createdAt: FormControl<Date | null>;
  updatedAt: FormControl<Date | null>;
  status: FormControl<string | null>;
}
