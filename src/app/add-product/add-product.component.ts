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
import { ToastrService } from 'ngx-toastr';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize, pipe } from 'rxjs';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss',
})
export default class AddProductComponent {
  #productService = inject(ProductService);
  #toastr = inject(ToastrService);
  productTypes = signal(Object.values(PRODUCT_TYPES));
  productForm: FormGroup<IProductForm>;
  saveSpinner = signal(false);

  constructor() {
    const fb = inject(FormBuilder);
    this.productForm = fb.group<IProductForm>({
      productName: fb.control('Tomato', Validators.required),
      productPrice: fb.control(10, [Validators.required, Validators.min(1)]),
      productType: fb.control('vegetable', Validators.required),
      createdAt: fb.control(new Date()),
      updatedAt: fb.control(new Date()),
      id: fb.control(crypto.randomUUID()),
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }

    this.saveSpinner.set(true);
    this.#productService
      .addNewProduct(this.productForm.value)
      .pipe(finalize(() => this.saveSpinner.set(false)))
      .subscribe({
        next: () => {
          this.#toastr.success('Product added successfully');
          this.productForm.reset({}, { emitEvent: false, onlySelf: true });
        },
        error: () => {
          this.#toastr.error('Something went wrong');
        },
      });
  }
}
