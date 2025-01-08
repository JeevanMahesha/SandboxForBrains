import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { INewProduct } from '../add-product/add-product.model';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-products-details',
  standalone: true,
  imports: [],
  templateUrl: './products-details.component.html',
  styleUrl: './products-details.component.scss',
})
export default class ProductsDetailsComponent {
  #productService = inject(ProductService);
  productsDetails = toSignal(this.#productService.getProducts());
  selectedCartProduct = computed(() =>
    this.#productService.selectedCartProduct().map((product) => product.id)
  );

  isProductInCart(selectedCartProductId: string): boolean {
    return this.selectedCartProduct().includes(selectedCartProductId);
  }

  addToCart(selectedCartProduct: INewProduct): void {
    this.#productService.selectedCartProduct.update((product) => [
      ...product!,
      selectedCartProduct,
    ]);
  }

  removeFromCart(selectedCartProductId: string): void {
    this.#productService.selectedCartProduct.update((product) =>
      product!.filter((product) => product.id !== selectedCartProductId)
    );
  }
}
