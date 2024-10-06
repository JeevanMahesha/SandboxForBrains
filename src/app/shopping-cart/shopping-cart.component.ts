import { KeyValuePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { map } from 'rxjs';
import { INewProduct, TProductType } from '../add-product/add-product.model';
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

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [MatSelectModule, KeyValuePipe, MatInput, ReactiveFormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export default class ShoppingCartComponent {
  productQuantity = signal(VEGETABLE_QUANTITY_DOMINATION);
  #fb = inject(FormBuilder);
  #productService = inject(ProductService);
  #authService = inject(AuthService);
  #destroyRef = inject(DestroyRef);

  shoppingCartForm: FormGroup<IShoppingCartForm>;

  constructor() {
    this.shoppingCartForm = this.initForm();
    this.triggerFormValueChangesEvent();
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

  private triggerFormValueChangesEvent() {
    this.shoppingCartForm.controls.products.controls.forEach((control) => {
      control.valueChanges
        .pipe(
          map((product) => {
            return product.productPrice! * product.quantity!;
          }),
          takeUntilDestroyed(this.#destroyRef)
        )
        .subscribe((quantityPrice) => {
          control.controls.quantityPrice.setValue(quantityPrice, {
            emitEvent: false,
            onlySelf: true,
          });
        });
    });
    this.shoppingCartForm.controls.products.valueChanges
      .pipe(
        map((products) =>
          products
            .map((product) => product.quantityPrice)
            .filter(
              (price): price is number => price !== null && price !== undefined
            )
            .reduce((acc, value) => acc + value, 0)
        )
      )
      .subscribe((totalPrice) => {
        this.shoppingCartForm.controls.total.setValue(totalPrice, {
          emitEvent: false,
          onlySelf: true,
        });
      });
  }
}
