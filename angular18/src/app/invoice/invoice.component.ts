import { CommonModule } from '@angular/common';
import { Component, computed, model, signal } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export default class InvoiceComponent {
  products = products;
  invoiceItems = signal<InvoiceItem[]>([]);
  taxRate = 0;
  discountRate = model(0);
  subtotal = computed(() =>
    this.invoiceItems().reduce((sum, row) => sum + row.total, 0)
  );
  taxAmount = 0;
  discountAmount = 0;
  totalAmount = 0;
  invoiceItem = new FormGroup({
    productName: new FormControl(''),
    quantity: new FormControl(0),
    price: new FormControl(0),
    total: new FormControl(0),
  });
  invoiceForm = new FormGroup({
    invoiceItems: new FormArray([this.invoiceItem]),
  });

  constructor() {
    this.addRow();
  }

  addRow() {
    this.invoiceItems.update((items) => {
      items.push({ productName: '', quantity: 0, price: 0, total: 0 });
      return items;
    });
  }

  updateProductDetail(productDetail: IProduct, indexValue: number) {
    this.invoiceItems.update((items) => {
      items[indexValue] = {
        price: productDetail.price,
        productName: productDetail.name,
        quantity: 1,
        total: productDetail.price,
      };
      return items;
    });
  }

  calculateTotal(quantity: number, indexValue: number) {
    this.invoiceItems.update((items) => {
      items[indexValue].quantity = quantity;
      items[indexValue].total = Math.ceil(items[indexValue].price * quantity);
      return items;
    });
  }

  removeRow(index: number) {
    this.products.splice(index, 1);
    this.updateTotals();
  }

  updateTotals() {
    // this.subtotal = this.rows.reduce((sum, row) => sum + row.total, 0);
    this.taxAmount = this.subtotal() * (this.taxRate / 100);
    this.discountAmount = this.subtotal() * (this.discountRate() / 100);
    this.totalAmount = this.subtotal() + this.taxAmount - this.discountAmount;
  }
}

interface IProduct {
  id: number;
  name: string;
  price: number;
}

const products = [
  { id: 1, name: 'Laptop', price: 999.99 },
  { id: 2, name: 'Smartphone', price: 699.99 },
  { id: 3, name: 'Tablet', price: 499.99 },
  { id: 4, name: 'Smartwatch', price: 199.99 },
  { id: 5, name: 'Headphones', price: 149.99 },
  { id: 6, name: 'Bluetooth Speaker', price: 89.99 },
  { id: 7, name: 'External Hard Drive', price: 129.99 },
  { id: 8, name: 'Gaming Console', price: 399.99 },
  { id: 9, name: 'Monitor', price: 179.99 },
  { id: 10, name: 'Keyboard', price: 79.99 },
];

interface InvoiceItem {
  productName: string;
  quantity: number;
  price: number;
  total: number;
}
