import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-products-details',
  standalone: true,
  imports: [],
  providers: [ProductService],
  templateUrl: './products-details.component.html',
  styleUrl: './products-details.component.scss',
})
export default class ProductsDetailsComponent {
  #productService = inject(ProductService);
  #destroyRef = inject(DestroyRef);
  productsDetails = toSignal(
    this.#productService
      .getProducts()
      .pipe(takeUntilDestroyed(this.#destroyRef))
  );
}
