import { FormControl } from '@angular/forms';
import { TProductType } from './add-product.model';

export interface IProductForm {
  productName: FormControl<string | null>;
  productType: FormControl<TProductType | null>;
  productPrice: FormControl<number | null>;
}
