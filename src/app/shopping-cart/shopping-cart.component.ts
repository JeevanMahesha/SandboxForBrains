import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../auth/auth.service';
import { ProductService } from '../service/product.service';
import {
  IShoppingCartForm,
  IShoppingProductCartForm,
} from './shopping-cart.form';
import {
  TQuantityDomination,
  VEGETABLE_QUANTITY_DOMINATION,
} from './shopping-cart.model';
import { INewProduct, TProductType } from '../add-product/add-product.model';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [MatSelectModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export default class ShoppingCartComponent {
  foods = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  #fb = inject(FormBuilder);
  #productService = inject(ProductService);
  #authService = inject(AuthService);

  shoppingCartForm: FormGroup<IShoppingCartForm>;

  constructor() {
    this.shoppingCartForm = this.initForm();
  }

  initForm() {
    const userDetail = this.#authService.loggedInUserDetail();
    const products = this.#productService
      .selectedCartProduct()
      .map((product) => this.getProductsForm(product));
    return this.#fb.group<IShoppingCartForm>({
      products: this.#fb.array(products),
      total: this.#fb.control<number | null>(null),
      name: this.#fb.control<string | null>(userDetail?.name ?? null),
      email: this.#fb.control<string | null>(userDetail?.email ?? null),
      userId: this.#fb.control<string | null>(userDetail?.id ?? null),
      id: this.#fb.control<string | null>(crypto.randomUUID()),
      createdAt: this.#fb.control<Date | null>(new Date()),
      updatedAt: this.#fb.control<Date | null>(new Date()),
      status: this.#fb.control<string | null>('active'),
    });
  }

  private getProductsForm(productValue: INewProduct) {
    return this.#fb.group<IShoppingProductCartForm>({
      quantity: this.#fb.control<TQuantityDomination | null>(
        VEGETABLE_QUANTITY_DOMINATION['One Kilogram']
      ),
      quantityPrice: this.#fb.control<number | null>(productValue.productPrice),
      productName: this.#fb.control<string | null>(productValue.productName),
      productType: this.#fb.control<TProductType | null>(
        productValue.productType
      ),
      productId: this.#fb.control<string | null>(productValue.id!),
      productPrice: this.#fb.control<number | null>(productValue.productPrice),
    });
  }
}
