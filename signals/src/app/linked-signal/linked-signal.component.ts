import {
  Component,
  computed,
  linkedSignal,
  signal,
  WritableSignal,
} from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-linked-signal',
  imports: [MatSelectModule, FormsModule],
  templateUrl: './linked-signal.component.html',
  standalone: true,
})
export class LinkedSignalComponent {
  cartProducts: WritableSignal<ICart[]> = signal([
    {
      id: 1,
      name: 'Blue denim shirt',
      color: 'Blue',
      size: 'M',
      price: 1000,
      quantity: 1,
      img: 'https://www.drakes.com/cdn/shop/products/DR2A4D21804-01200-1.jpg?v=1673977364&width=1500',
    },
    {
      id: 2,
      name: 'Black denim shirt',
      color: 'Black',
      size: 'M',
      price: 2000,
      quantity: 1,
      img: 'https://www.flyclothing.com/cdn/shop/products/11-050-0594-7056-BL_Black_1_fa817361-c19c-4777-bb91-692d3994cc45.jpg?v=1695141390',
    },
    {
      id: 3,
      name: 'White denim shirt',
      color: 'White',
      size: 'M',
      price: 1500,
      quantity: 1,
      img: 'https://www.coes.co.uk/cdn/shop/files/1a862cd80ddfd2ac9a2d4ce5d23e8646.webp?v=1695371780',
    },
  ]);

  selectedProduct: WritableSignal<ICart | null> = signal(
    this.cartProducts()[0]
  );
  quantity = linkedSignal(() => this.selectedProduct()?.quantity || null);
  total = computed(
    () => this.selectedProduct()?.price! * this.quantity()! || 0
  );
}

interface ICart {
  id: number;
  name: string;
  color: string;
  size: string;
  price: number;
  img: string;
  quantity: number;
}
