import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../service/product.service';
import { IProductForm } from './add-product.form';
import { PRODUCT_TYPES } from './add-product.model';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [MatInputModule, MatSelectModule, ReactiveFormsModule],
  providers: [ProductService],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export default class AddProductComponent {
  #productService = inject(ProductService);
  productTypes = signal(Object.values(PRODUCT_TYPES));
  productForm: FormGroup<IProductForm>;

  constructor() {
    const fb = inject(FormBuilder);
    this.productForm = fb.group<IProductForm>({
      productName: fb.control('Tomato', Validators.required),
      productPrice: fb.control(10, Validators.required),
      productType: fb.control('vegetable', Validators.required),
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }
    this.#productService.addNewProduct(this.productForm.value);
  }
}
