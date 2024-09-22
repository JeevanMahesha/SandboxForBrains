import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../auth/auth.service';
import { ProductService } from '../service/product.service';
import {
  IShoppingCartForm,
  IShoppingProductCartForm,
} from './shopping-cart.form';
import { TQuantityDomination } from './shopping-cart.model';

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
    console.log(this.shoppingCartForm);
  }

  initForm() {
    const userDetail = this.#authService.loggedInUserDetail();
    return this.#fb.group<IShoppingCartForm>({
      products: this.#fb.array([this.getProductsForm()]),
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

  private getProductsForm() {
    return this.#fb.control<IShoppingProductCartForm>({
      quantity: this.#fb.control<TQuantityDomination | null>(null),
      price: this.#fb.control<number | null>(null),
      productName: this.#fb.control<string | null>(null),
      productType: this.#fb.control<TQuantityDomination | null>(null),
      productId: this.#fb.control<string | null>(null),
      productPrice: this.#fb.control<number | null>(null),
    });
  }
}
