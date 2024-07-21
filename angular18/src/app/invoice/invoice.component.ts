import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export default class InvoiceComponent {
  products = products;
  taxRate = 0;
  discountRate = 0;
  subtotal = 0;
  taxAmount = 0;
  discountAmount = 0;
  totalAmount = 0;

  addRow() {
    // this.products.push({ name: '', quantity: 0, price: 0, total: 0 });
  }

  removeRow(index: number) {
    this.products.splice(index, 1);
    this.updateTotals();
  }

  calculateTotal(index: number) {
    const row = this.products[index];
    // row.total = row.quantity * row.price;
    this.updateTotals();
  }

  updateTotals() {
    // this.subtotal = this.rows.reduce((sum, row) => sum + row.total, 0);
    this.taxAmount = this.subtotal * (this.taxRate / 100);
    this.discountAmount = this.subtotal * (this.discountRate / 100);
    this.totalAmount = this.subtotal + this.taxAmount - this.discountAmount;
  }
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
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
