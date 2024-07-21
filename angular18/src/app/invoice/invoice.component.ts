import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
export default class InvoiceComponent implements OnInit {
  products = products;
  taxRate = 0;
  discountRate = 0;
  subtotal = 0;
  taxAmount = 0;
  discountAmount = 0;
  totalAmount = 0;

  invoiceForm = new FormGroup({
    invoiceItems: new FormArray<FormGroup<IInvoiceItemForm>>([]),
  });

  get getNewInvoiceItems() {
    return new FormGroup({
      productName: new FormControl(''),
      quantity: new FormControl(0, Validators.min(1)),
      price: new FormControl(0),
      total: new FormControl(0),
    });
  }

  ngOnInit(): void {
    this.invoiceForm.controls.invoiceItems.valueChanges.subscribe(console.log);
  }

  addRow() {
    this.invoiceForm.controls.invoiceItems.push(this.getNewInvoiceItems, {
      emitEvent: false,
    });
  }

  updateProductDetail(productName: string, indexValue: number) {
    const selectedProductPrice = this.products.find(
      (product) => product.productName === productName
    );
    this.invoiceForm.controls.invoiceItems.at(indexValue).patchValue(
      {
        price: selectedProductPrice?.price,
        quantity: 1,
        total: selectedProductPrice?.price,
      },
      { emitEvent: false }
    );
  }

  removeRow(index: number) {
    this.invoiceForm.controls.invoiceItems.removeAt(index);
  }

  updateRowTotal(indexValue: number) {
    const currentProduct =
      this.invoiceForm.controls.invoiceItems.at(indexValue);
    this.invoiceForm.controls.invoiceItems.at(indexValue).patchValue(
      {
        total: Math.ceil(
          currentProduct.value.price! * currentProduct.value.quantity!
        ),
      },
      { emitEvent: false }
    );
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

interface InvoiceItem {
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

interface IInvoiceItemForm {
  productName: FormControl<string | null>;
  quantity: FormControl<number | null>;
  price: FormControl<number | null>;
  total: FormControl<number | null>;
}
