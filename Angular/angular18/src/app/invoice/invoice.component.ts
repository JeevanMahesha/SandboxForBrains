import { CommonModule } from '@angular/common';
import { Component, computed, effect, model } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { map, of, startWith } from 'rxjs';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export default class InvoiceComponent {
  products = products;
  discountRate = model(0);
  subtotal = toSignal(of(0));
  discountAmount = computed(() =>
    Math.ceil(this.subtotal()! * (this.discountRate() / 100))
  );
  totalAmount = computed(() =>
    Math.ceil(this.subtotal()! - this.discountAmount())
  );

  invoiceForm = new FormGroup({
    invoiceItems: new FormArray<FormGroup<IInvoiceItemForm>>([]),
  });

  constructor() {
    this.subtotal = this.getSubtotal;
    effect(() => console.log(this.discountRate()));
  }

  get getNewInvoiceItems() {
    return new FormGroup({
      productDetail: new FormControl<IProductDetail | null>(null),
    });
  }

  get getSubtotal() {
    return toSignal(
      this.invoiceForm.controls.invoiceItems.valueChanges.pipe(
        map((items) => items.map((item) => item.productDetail?.price || 0)),
        map((prices) => prices.reduce((a, b) => Math.ceil(a + b), 0)),
        startWith(0)
      )
    );
  }

  addRow() {
    this.invoiceForm.controls.invoiceItems.push(this.getNewInvoiceItems, {
      emitEvent: false,
    });
  }

  removeRow(index: number) {
    this.invoiceForm.controls.invoiceItems.removeAt(index);
  }
}

const products = [
  { id: 1, productName: 'Laptop', price: 999.99 },
  { id: 2, productName: 'Smartphone', price: 699.99 },
  { id: 3, productName: 'Tablet', price: 499.99 },
  { id: 4, productName: 'Smartwatch', price: 199.99 },
  { id: 5, productName: 'Headphones', price: 149.99 },
  { id: 6, productName: 'Bluetooth Speaker', price: 89.99 },
  { id: 7, productName: 'External Hard Drive', price: 129.99 },
  { id: 8, productName: 'Gaming Console', price: 399.99 },
  { id: 9, productName: 'Monitor', price: 179.99 },
  { id: 10, productName: 'Keyboard', price: 79.99 },
];

interface IProductDetail {
  productName: string;
  price: number;
  id: number;
}

interface IInvoiceItemForm {
  productDetail: FormControl<IProductDetail | null>;
}
